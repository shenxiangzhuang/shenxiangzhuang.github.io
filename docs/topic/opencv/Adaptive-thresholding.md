---
title: OpenCV系列笔记十七：Adaptive thresholding
copyright: true
date: 2017-05-15 08:15:28
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview

在介绍Adaptive thresholding之前，让我们来看看Integral Image的概念：

>Integral images have been introduced as an efficient way of summing
pixels in image regions of interest. They are widely used in applications
that involve, for example, computations over sliding windows at multiple
scales.

可以看到，Integral Image是避免重复计算多个ROI像素值和的一种方法。接下来，我们实现的就是简单的矩形ROI，使得Integral Image上的每一个点的值为：该点和图像左上角形成的矩形区域像素值之和。

而Adaptive thresholding 是相对于fixed thresholding而言的。fixed就是我们之前常用的固定阀值，而Adaptive的阀值是由一个固定阀值和一个变化的均值决定的，这个均值，就是某像素点周围一些像素点的均值。

#### Code


##### integral.h

实际上，OpenCV已经提供了计算Integral Image的函数`cv::integral`，但是书上也自己实现了一边，我们这里也贴上。


{% codeblock lang:cpp %}


    #if !defined IINTEGRAL
    #define IINTEGRAL

    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>

    #include <vector>

    template <typename T, int N>
    class IntegralImage {

          cv::Mat integralImage;

      public:

          IntegralImage(cv::Mat image) {

            // (costly) computation of the integral image
            cv::integral(image,integralImage,cv::DataType<T>::type);
          }

          // compute sum over sub-regions of any size from 4 pixel access
          cv::Vec<T,N> operator()(int xo, int yo, int width, int height) {

              // window at (xo,yo) of size width by height
              return (integralImage.at<cv::Vec<T,N> >(yo+height,xo+width)
                      -integralImage.at<cv::Vec<T,N> >(yo+height,xo)
                      -integralImage.at<cv::Vec<T,N> >(yo,xo+width)
                      +integralImage.at<cv::Vec<T,N> >(yo,xo));
          }

          // compute sum over sub-regions of any size from 4 pixel access
          cv::Vec<T,N> operator()(int x, int y, int radius) {

              // square window centered at (x,y) of size 2*radius+1
              return (integralImage.at<cv::Vec<T,N> >(y+radius+1,x+radius+1)
                      -integralImage.at<cv::Vec<T,N> >(y+radius+1,x-radius)
                      -integralImage.at<cv::Vec<T,N> >(y-radius,x+radius+1)
                      +integralImage.at<cv::Vec<T,N> >(y-radius,x-radius));
          }
    };

    // convert to a multi-channel image made of binary planes
    // nPlanes must be a power of 2
    void convertToBinaryPlanes(const cv::Mat& input, cv::Mat& output, int nPlanes) {

            // number of bits to mask out
            int n= 8-static_cast<int>(log(static_cast<double>(nPlanes))/log(2.0));
            // mask used to eliminate least significant bits
            uchar mask= 0xFF<<n; // e.g. for div=16, mask= 0xF0

            // create a vector of 16 binary images
            std::vector<cv::Mat> planes;
            // reduce to nBins bins by eliminating least significant bits
            cv::Mat reduced= input&mask;

            // compute each binary image plane
            for (int i=0; i<nPlanes; i++) {

                // 1 for each pixel equals to i<<shift
                planes.push_back((reduced==(i<<n))&0x1);  // i<<n  --> 16, 32, 48, ...
            }

            // create multi-channel image
            cv::merge(planes,output);
    }

    #endif


{% endcodeblock %}



##### main.cpp

这里介绍了，OpenCV自带的fixed thresholding， Adaptive thresholding, boxFilter的用法，同时运用Integral Image重新实现了一遍Adaptive thresholding.

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #include "integral.h"

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/book.png",0);

        // display original image
        cv::namedWindow("Original Image");
        cv::imshow("Original Image", image);

        // using a fixed threshold
        cv::Mat binaryFixed;
        cv::Mat binaryAdaptive;
        cv::threshold(image, binaryFixed,70,255,cv::THRESH_BINARY);

        //using as adaptive threshold
        int blockSize=21;  //size of the neighborhood
        int threshold=10;  // pixel will be compare to (mean-threshold)

        int64 time;
        time = cv::getTickCount();
        cv::adaptiveThreshold(
                image,  //input image
                binaryAdaptive, // output binary image
                255,  //max value for output
                cv::ADAPTIVE_THRESH_GAUSSIAN_C, // adaptive method
                cv::THRESH_BINARY, //threshold type
                blockSize,
                threshold
        );


        time = cv::getTickCount() - time;
        std::cout<<"time (adaptiveThreshold) =  "<<time<<endl;

        // compute integral image
        IntegralImage<int, 1>integral(image);

        // test integral image
    //    cout<<"sum = "<<integral(18, 45,30, 50)<<endl;
    //    cv::Mat test(image, cv::Rect(18,45,30,50));
    //    cv::Scalar t = cv::sum(test);
    //    cout<<"sum test = "<<t[0]<<endl;

        cv::namedWindow("Fixed Threshold");
        cv::imshow("Fixed Threshold", binaryFixed);

        cv::namedWindow("Adaptive Threshold");
        cv::imshow("Adaptive Threshold", binaryAdaptive);

        cv::Mat binary = image.clone();
        time = cv::getTickCount();
        int nl = binary.rows; // number of lines
        int nc = binary.cols; // total number of elements per line

        // compute integral image
        cv::Mat iimage;
        cv::integral(image, iimage, CV_32S);

        //for each row
        int halfSize = blockSize/2;
        for(int j=halfSize; j<nl - halfSize -1;j++ ){
            // get the address of row j
            uchar* data = binary.ptr<uchar>(j);
            int* idata1 = iimage.ptr<int>(j-halfSize); // 滑动窗口上边
            int* idata2 = iimage.ptr<int>(j+halfSize+1); // 滑动窗口下边

            //for pixel of a line
            for(int i=halfSize; i<nc-halfSize-1;i++){
                //compute pix_mean
                int pix_mean = (idata2[i+halfSize+1]-idata2[i-halfSize]-idata1[i+halfSize+1]
                +idata1[i-halfSize])/(blockSize*blockSize);

                //apply adaptive threshold
                if(data[i]<(pix_mean-threshold))
                    data[i] = 0;
                else
                    data[i]  =255;
            }

        }
        // add white border
        for(int j=0;j<halfSize;j++){
            uchar *data = binary.ptr<uchar>(j);
            for(int i=0; i<binary.cols;i++)
                data[i] = 255;
        }
        for(int j=binary.rows-halfSize-1;j<binary.rows;j++){
            uchar * data = binary.ptr<uchar>(j);
            for(int i=0; i<binary.cols;i++){
                data[i] = 255;
            }
        }
        for(int j=halfSize;j<nl-halfSize-1;j++){
            uchar* data = binary.ptr<uchar>(j);
            for(int i=0; i<halfSize;i++)
                data[i] = 255;
            for(int i=binary.cols-halfSize-1;i<binary.cols;i++)
                data[i] = 255;
        }

        time = cv::getTickCount()-time;
        cout<<"time integral= "<<time<<endl;

        cv::namedWindow("Adaptive Threshold (integral)");
        cv::imshow("Adaptive Threshold (integral)", binary);

        // adaptive threshold using image operators
        time = cv::getTickCount();
        cv::Mat filtered;
        cv::Mat binaryFiltered;
        // box filter compute avg of pixels over a rectangle region
        cv::boxFilter(image, filtered, CV_8U, cv::Size(blockSize,blockSize));
        // check if pixel greater than (mean+shreshold)
        binaryFiltered = image>=(filtered-threshold);
        time = cv::getTickCount()-time;

        cout<<"time filtered= "<<time<<endl;

        cv::namedWindow("Adaptive filtered");
        cv::imshow("Adaptive filtered", binaryFiltered);

        cv::waitKey();

        return 0;

    }

{% endcodeblock %}


输出：


![](http://blog-1252464519.costj.myqcloud.com/170515/AdF.png)


>time (adaptiveThreshold) =  2305893
time integral= 7118664
time filtered= 1179760











