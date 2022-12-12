---
title: OpenCV系列笔记三：Draw on image
copyright: true
date: 2017-04-27 23:19:52
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

有些时候，我们需要在图片上做一些标记，好比画些矩形，圆形或者一些文字。OpenCV提供了很好用的接口，除了文字有点丑...


##### Code

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>


    using namespace std;


    // Mouse trackbar

    using namespace std;


    int main(){
        cv::Mat image;
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/mang.png");

        //  a rectangle on the top of the image
        cv::rectangle(image, cv::Point(0,0), cv::Point(image.cols, 50), cv::Scalar(0,0,255), 3, 0);

        // put some text
        cv::putText(image, "A Text Test", cv::Point(image.cols/3, 30), cv::FONT_HERSHEY_PLAIN, 2.0, 0, 2);

        cv::imshow("Image", image);
        cv::waitKey();
        return 0;
    }



{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/170427/Selection_002.png)










