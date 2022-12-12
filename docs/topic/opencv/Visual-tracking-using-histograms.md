---
title: OpenCV系列笔记十八：Visual tracking using histograms
copyright: true
date: 2017-05-15 16:56:09
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview

在之前，我们介绍了Intergral Image， 还有通过mean shift算法搜索物体。这里，来学习下利用Intergral Image，通过比较histogram来追踪物体。

代码里面比较难理解的就是先将灰度图转化为多通道二进制图的部分。关于这里我也迷惑好久，再次仔细读书，其实书上已经写的比较清楚了：
>The cv::integral function also works for multichannel images. You can take advantage of this fact to compute histograms of image subregions using integral images. You simply need to convert your image into a multichannel image made of binary planes; each of these planes is associated to a bin of your histogram and shows you which pixels have a value that falls into this bin.


#### Code

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #include "grayhistogram.h"
    #include "integral.h"
    using namespace std;
    
    
    int main()
    {
        // Open image
        cv::Mat image= cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/bike55.bmp",0);
        // define image roi
        int xo=97, yo=112;
        int width=25, height=30;
        cv::Mat roi(image,cv::Rect(xo,yo,width,height));

        // compute sum
        // returns a Scalar to work with multi-channel images
        cv::Scalar sum= cv::sum(roi);
        std::cout << sum[0] << std::endl;

        // compute integral image
        cv::Mat integralImage;
        cv::integral(image,integralImage,CV_32S);
        // get sum over an area using three additions/subtractions
        int sumInt= integralImage.at<int>(yo+height,xo+width)
                    -integralImage.at<int>(yo+height,xo)
                    -integralImage.at<int>(yo,xo+width)
                    +integralImage.at<int>(yo,xo);
        std::cout << sumInt << std::endl;

        // histogram of 16 bins
        Histogram1D h;
        h.setNBins(16);
        // compute histogram over image roi
        cv::Mat refHistogram= h.getHistogram(roi);

        cv::imshow("Reference Histogram",h.getHistogramImage(roi,16));

        // first create 16-plane binary image
        cv::Mat planes;
        convertToBinaryPlanes(image,planes,16);
        // then compute integral image
        IntegralImage<float,16> intHisto(planes);


        // for testing compute a histogram of 16 bins with integral image
        cv::Vec<float,16> histogram= intHisto(xo,yo,width,height);
    //    std::cout<<" integral image histogram "<< histogram << std::endl;

        cv::Mat im= h.getImageOfHistogram(cv::Mat(histogram),16);
        cv::imshow("IM", im);


        // search in second image
        cv::Mat secondImage= cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/bike65.bmp",0);
        if (!secondImage.data)
            return 0;

        // first create 16-plane binary image
        convertToBinaryPlanes(secondImage,planes,16);

        // then compute integral image
        IntegralImage<float,16> intHistogram(planes);

        // compute histogram of 16 bins with integral image (testing)
        histogram= intHistogram(135,114,width,height);

        cv::Mat im2= h.getImageOfHistogram(cv::Mat(histogram),16);

        std::cout << "Distance= " << cv::compareHist(refHistogram,histogram, cv::HISTCMP_INTERSECT) << std::endl;

        double maxSimilarity=0.0;
        int xbest, ybest;
        // loop over a horizontal strip around girl location in initial image
        for (int y=110; y<120; y++) {
            for (int x=0; x<secondImage.cols-width; x++) {


                // compute histogram of 16 bins using integral image
                histogram= intHistogram(x,y,width,height);
                // compute distance with reference histogram
                double distance= cv::compareHist(refHistogram,histogram, cv::HISTCMP_INTERSECT);
                // find position of most similar histogram
                if (distance>maxSimilarity) {

                    xbest= x;
                    ybest= y;
                    maxSimilarity= distance;
                }

                std::cout << "Distance(" << x << "," << y << ")=" << distance << std::endl;
            }
        }

        std::cout << "Best solution= (" << xbest << "," << ybest << ")=" << maxSimilarity << std::endl;

        // draw a rectangle around target object
        cv::rectangle(image,cv::Rect(xo,yo,width,height),0);
        cv::namedWindow("Initial Image");
        cv::imshow("Initial Image",image);

        cv::namedWindow("New Image");
        cv::imshow("New Image",secondImage);

        // draw rectangle at best location
        cv::rectangle(secondImage,cv::Rect(xbest,ybest,width,height),0);
        // draw rectangle around search area
        cv::rectangle(secondImage,cv::Rect(0,110,secondImage.cols,height+10),255);
        cv::namedWindow("Object location");
        cv::imshow("Object location",secondImage);

        cv::waitKey(0);

        return 0;

    }


{% endcodeblock %}


输出：

![](http://blog-1252464519.costj.myqcloud.com/170515/Selection_051501.png)




