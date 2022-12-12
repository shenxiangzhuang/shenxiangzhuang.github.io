---
title: OpenCV系列笔记十二：Using colors for detection - skin tone detection
copyright: true
date: 2017-05-02 12:02:23
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

关于颜色空间，除了经常用的RGB和之前用于颜色比较的Lab,还有其他很多不同用途的种类。这里我们要检测皮肤，用到的颜色空间是[HSV](https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4). 原因如下：

>In general, to detect an object using color, you first need to collect a large database of image samples that contain the object captured from different viewing conditions. These will be used to define the parameters of your classifier. You also need to select the color representation that you will use for classification. For skin tone detection, many studies have shown that skin color from the diverse ethnical groups clusters well in the hue/saturation space. For this reason, we will simply use the hue and saturation values to identify the skin tones in the following image.

显然，在下面的程序里出现的一些阀值也是来自于一些经验数据。

##### Code

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>
    #include "imageInfo.h"

    void detectHScolor(const cv::Mat& image,
                       double minHue, double maxHue,
                       double minSat, double maxSat,
                       cv::Mat& mask){
        cv::Mat hsv;
        cv::cvtColor(image, hsv, CV_BGR2HSV);
        std::vector<cv::Mat>channels;
        cv::split(hsv, channels);

        // Hue masking
        cv::Mat mask1;
        cv::threshold(channels[0], mask1, maxHue, 255,cv::THRESH_BINARY_INV);  // 0~maxhue
        cv::Mat mask2;
        cv::threshold(channels[0], mask2, minHue, 255, cv::THRESH_BINARY);  // minhue~180

        cv::Mat hueMask;
        if(minHue<maxHue)
            hueMask = mask1 & mask2;  // minhue~maxhue
        else // if interval crossed the zero-degrees axis
            hueMask = mask1 | mask2;  // 上面的注释是书上的，一时搞不懂这个else是什么意思...知道的朋友可留言告知...

        // Saturation masking
        // between minSat and maxSat
        cv::Mat satMask;
        cv::inRange(channels[1], minSat, maxSat, satMask);

        // combined mask
        mask = hueMask & satMask;
    }




    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/girl.png");
        cv::imshow("Original Image", image);
        //detect skin tone
        cv::Mat mask;
        detectHScolor(image, 160,10,25,166, mask);
        cv::Mat detected(image.size(),CV_8UC3,cv::Scalar(0,0,0));
        image.copyTo(detected,mask);

        cv::imshow("Detected", detected);
        cv::waitKey(0);
        return 0;
    }


{% endcodeblock %}


输出：
![](http://blog-1252464519.costj.myqcloud.com/170502/Selection_004.png)





