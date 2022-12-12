---
title: OpenCV系列笔记十九：Morphalogical Operations
copyright: true
date: 2017-05-15 22:59:20
categories:
- Cpp
tags:
- Cpp
- OpenCV
---



#### Overview

一些图像的形态学操作，主要包括Erosion, Dilation, Closing 和 Opening.

它们之间有一些巧妙的关系：

Erosion and Dilation:
>The erosion of an image is equivalent to the complement of the
dilation of the complement image
The dilation of an image is equivalent to the complement of the
erosion of the complement image

Closing and Opening:

>The opening and closing filters are simply defined in terms of the basic
erosion and dilation operations. Closing is defined as the erosion of the
dilation of an image. Opening is defined as the dilation of the erosion of
an image.


最后注意下Idempotent：
>Note that applying the same opening (and similarly the closing) operator on an image several times has no effect. Indeed, as the holes have been filled by the first opening filter, an additional application of the same filter will not produce any other changes to the image. In mathematical terms, these operators are said to be idempotent.


对这些概念的理解可以参考Youtube的一套视频，讲的挺好(自备梯子:-)：

[传送门](https://www.youtube.com/watch?v=BldfktFW1bQ)

#### Code

##### Erosion and Dilation

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>

    int main(){

        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/binary.bmp");
        cv::imshow("Original image", image);
        // Erode the image
        // with the default 3x3 structuring element (SE)
        cv::Mat eroded;  // the destination image
        cv::erode(image, eroded, cv::Mat());
        cv::imshow("eroded", eroded);

        // Erode the image with a larger SE
        // create a 7x7 mat with containing all ls
        cv::Mat element(7, 7, CV_8U, cv::Scalar(1));
        // erode the image with that SE
        cv::erode(image, eroded, element);
        cv::imshow("Eroded by 7x7 elements", eroded);

        // Erode the image 3 times
        cv::erode(image, eroded, cv::Mat(), cv::Point(-1,-1), 3);
        cv::imshow("eroded 3 times", eroded);

        // Dilate the image
        cv:: Mat dilate;
        cv::dilate(image, dilate, cv::Mat());
        cv::imshow("dilate", dilate);

        cv::waitKey();
        return 0;

    }

{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/170515/Selection_051502.png)


##### Closing and Opening

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/binary.bmp");

        cv::imshow("Original image", image);
        // Close the image
        cv::Mat element5(5 ,5, CV_8U, cv::Scalar(1));
        cv::Mat closed;
        cv::morphologyEx(image, closed,   // input and output
                         cv::MORPH_CLOSE,  // operator code
                         element5);  // structuring element

        cv::imshow("Cloed", closed);

        // Opening the image
        cv::Mat opening;
        cv::morphologyEx(image, opening,   // input and output
                         cv::MORPH_OPEN,  // operator code
                         element5);  // structuring element
        cv::imshow("opening", opening);


        // opening first, then closing
        cv::Mat open_closed;
        cv::morphologyEx(image, open_closed, cv::MORPH_OPEN, element5);
        cv::morphologyEx(open_closed, open_closed, cv::MORPH_CLOSE, element5);
        cv::imshow("open_closed", open_closed);

        cv::waitKey();

        return 0;
    }


{% endcodeblock %}


输出：

![](http://blog-1252464519.costj.myqcloud.com/170515/Selection_051503.png)


##### morphological operators on gray-level images

关于灰度图的形态学操作：

>A good way to understand the effect of morphological operators on a
gray-level image is to consider an image as a topological relief in which
the gray levels correspond to elevation (or altitude). 

图像梯度与顶帽变换：

>morphological gradient: extracting the edges of an image
>top-hat transform:  extract local small foreground objects 


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    using namespace std;

    int main() {
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png", 0);
        cv::imshow("Original image", image);

        // Get the gradient image using a 3x3 structuring element
        cv::Mat result;
        cv::morphologyEx(image, result, cv::MORPH_GRADIENT, cv::Mat());
        cv::imshow("gradient", result);

        // Apply the black top-hat transform using 7x7 structuring element
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/book.png", 0);
        cv::Mat element7(7, 7, CV_8U, cv::Scalar(1));
        cv::morphologyEx(image, result, cv::MORPH_BLACKHAT, element7);
        cv::imshow("black hat", result);

        cv::waitKey();
        return 0;
    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052401.png)













