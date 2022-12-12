---
title:  OpenCV系列笔记十四：Look-up tables
copyright: true
date: 2017-05-04 14:25:07
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

在处理图像的时候，我们可能需要对所有的像素点，根据其像素值的大小，统一进行一个映射的操作，这个时候我们就需要look-up tables来完成这项工作。

>A look-up table is a simple one-to-one (or many-to-one) function that defines how pixel values are transformed into new values. It is a 1D array with, in the case of regular gray-level images, 256 entries.
>
> Entry i of the table gives you the new intensity value of the corresponding gray level, which is expressed as follows:
 `newIntensity= lookup[oldIntensity];`


##### Code

###### 一般的使用方法

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgcodecs.hpp"
    #include "opencv2/imgproc.hpp"
    #include <iostream>
    #include "grayhistogram.h"

    cv::Mat getlut(){
        cv::Mat lut(1, 256, CV_8U);
        for(int i=0; i<256; i++){
    //0 becomes 255, 1 becomes 254, etc
            lut.at<uchar>(i) = 255-i;
        }
        return lut;
    }


    cv::Mat getStrechlut(cv::Mat image, cv::Mat hist){
        //number of pixel in percentile
        float percentile = 0.01;
        float number = image.total()*percentile;

        int imin = 0;
        for(float count=0.0;imin<256;imin++){
            if((count+=hist.at<float>(imin)) >= number)
                break;
        }

        int imax=255;
        for(float count = 0.0; imax >= 0; imax--){
            if((count+=hist.at<float>(imax)) >= number)
                break;
        }

        cv::Mat lut(1, 256, CV_8U);
        for(int i=0; i<256; i++){
            lut.at<uchar>(i) = 255.0*(i-imin)/(imax-imin);
        }
        return lut;

    }

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png",0); // gray

        cv::imshow("Original Image", image);
        // The histogram object
        Histogram1D h;
        cv::imshow("Original Histogram", h.getHistogramImage(image));

        //Compute the histogram
        cv::Mat histo = h.getHistogram(image);




        //get lut and apply
        cv::Mat lut = getlut();
        cv::Mat result = h.applyLookUp(image, lut);
        cv::imshow("inverse lut image", result);


        //get strech lut and apply
        cv::Mat strechlut = getStrechlut(image, histo);
        cv::Mat strechresult = h.applyLookUp(image, strechlut);

        cv::imshow("strech lut histo", h.getHistogramImage(strechresult));
        cv::imshow("strech lut image", strechresult);


        cv::waitKey(0);
        return 0;

    }

{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170504/Selection_050414%3A18%3A23.png)


###### 对之前颜色空间缩减的改进

之前[颜色空间缩减](http://datahonor.com/2017/04/09/OPenCV-%E5%9B%BE%E7%89%87%E9%A2%9C%E8%89%B2%E7%A9%BA%E9%97%B4%E7%BC%A9%E5%87%8F%E4%B8%8E%E9%81%8D%E5%8E%86/) 时，我们用了手动遍历的方法进行修改对应的像素值，我们可以用look-up tables进行简化。

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgcodecs.hpp"
    #include "opencv2/imgproc.hpp"
    #include <iostream>
    #include "grayhistogram.h"

    void colorReduce(cv::Mat &image, int div=64){
        //creating the 1d lookup table
        cv::Mat lookup(1,256, CV_8U);

        //defining the color reduction lookup
        for(int i=0; i<256; i++)
            lookup.at<uchar>(i) = i/div*div+div/2;
        //lookip table applied on all channels;
        cv::LUT(image, lookup, image);
    };

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");

        // 使用Clone,保护原来图像不受损坏
        cv::Mat imageClone = image.clone();
        colorReduce(imageClone, 64);
        cv::namedWindow("Result");
        cv::imshow("Result", imageClone);
        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}







