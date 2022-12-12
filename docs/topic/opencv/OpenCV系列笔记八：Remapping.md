---
title: OpenCV系列笔记八：Remapping
copyright: true
date: 2017-04-28 11:29:15
categories:
- Cpp
tags:
- Cpp
- OpenCV
---
##### Overview
关于Remapping, [官方文档](http://docs.opencv.org/2.4/doc/tutorials/imgproc/imgtrans/remap/remap.html)已经解释的十分清楚了。

>It is the process of taking pixels from one place in the image and locating them in another position in a new image.
>
>To accomplish the mapping process, it might be necessary to do some interpolation for non-integer pixel locations, since there will not always be a one-to-one-pixel correspondence between source and destination images.
>
>We can express the remap for every pixel location (x,y) as:
`g(x,y) = f ( h(x,y) )`
where g() is the remapped image, f() the source image and h(x,y) is the mapping function that operates on (x,y)

注意这里对函数的理解，也就是remapping的过程，举个简单的例子，当remapping函数为h(x,y)=(x+1, y+1)时， 新的图像g(3,4) = f(h(3, 4)) = f(4, 5), 也就是说新得到的图像(3,4)处的像素点原来是在原图像的(4, 5)处。

##### Code

这里是书上的一段代码，很简短，官方文档给的例子比较好些。


{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>
    #include "imageInfo.h"

    // remapping an image by createing wave effects
    void wave(const cv::Mat &image, cv::Mat &result){
        //the mao function
        cv::Mat srcX(image.rows, image.cols, CV_32F);
        cv::Mat srcY(image.rows, image.cols, CV_32F);

        // creating the mapping
        for (int i = 0; i < image.rows; i++) {
            for (int j = 0; j < image.cols; j++) {
                // new location of pixel at (i, j)
                srcX.at<float>(i,j)=j;
                srcY.at<float>(i,j) = i+5*sin(j/10.0);
            }
        }
        // applying the mapping
        cv::remap(image,result, srcX, srcY,cv::INTER_LINEAR);
    }




    int main(){
        cv::Mat image1 = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");
        getImageInfo(image1);
        cv::Mat result;
        wave(image1, result);
        cv::imshow("result", result);
        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170427/7.png)


##### Reference

[Remapping](http://docs.opencv.org/2.4/doc/tutorials/imgproc/imgtrans/remap/remap.html)







