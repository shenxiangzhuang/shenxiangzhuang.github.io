---
title: OpenCV系列笔记十：Converting color reprentations
copyright: true
date: 2017-05-02 11:07:38
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview
在第九篇中，我们通过计算颜色范围来提取出ROI（上例为蓝天部分），我们是在BGR颜色空间进行的，但是在这个颜色空间并不是很好。原因是：
>Unfortunately, computing the distance between the colors using the
RGB color space is not the best way to measure the similarity between
two given colors. Indeed, RGB is not a perceptually uniform color
space. This means that two colors at a given distance might look very
similar, while two other colors separated by the same distance might
look very different.

所以：
>To solve this problem, other color representations that have the property
of being perceptually uniform have been introduced. In particular, the
CIE L*a*b* is one such color model. By converting our images to this
representation, the Euclidean distance between an image pixel and the
target color will then be a meaningful measure of the visual similarity
between the two colors.



##### Code
这里核心的程序就是转换到另一个颜色空间进行颜色比较和颜色范围的界定。

主要改动就是process这里：

{% codeblock lang:cpp %}

    cv::Mat ColorDetector::process(const cv::Mat &image){
        // re-allocate binary map if necessary
        // same size as input image, but 1-channel
        result.create(image.size(), CV_8U);

        // Converting to Lab color space
        cv::cvtColor(image, converted, CV_BGR2Lab);

        // processing
        // get the iterators
        cv::Mat_<cv::Vec3b>::const_iterator it = converted.begin<cv::Vec3b>();
        cv::Mat_<cv::Vec3b>::const_iterator itend = converted.end<cv::Vec3b>();
        cv::Mat_<uchar>::iterator itout = result.begin<uchar>();

        // for each pixel
        for(; it!=itend;++it, ++itout){
            // compute distance from target color
            if(getColorDitanceToTargetColor(*it) <= maxDist){
                *itout = 255;
            }else{
                *itout = 0;
            }
        }
        return result;
    }


{% endcodeblock %}


为了方便运行，这里也贴下完整的代码：


{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>
    #include "imageInfo.h"

    class ColorDetector{
    public:
        // minimun accptable distance
        int maxDist;
        // target color
        cv::Vec3b target;

        // image containing resulting binary map
        cv::Mat result, converted;

        // empty constructor
        // default parameter initialization here
        ColorDetector():maxDist(15),target(0,0,0){};

        // another constructor with target and distance
        ColorDetector(uchar blue, uchar green, uchar red, int mxDist){};




        // Sets the color distance threshold
        // Threshold must be positive,
        // otherwise distance threshold is set to 0.
        void setColorDistanceThreshold(int distance){
            if(distance<0)
                distance = 0;
            maxDist = distance;
        }

        // Gets the color distance threshold
        int getColorDistanceThreshold() const{
            return maxDist;
        }


        // Sets the color to be detected
        void setTargetColor(uchar blue, uchar green, uchar red){
            // Temporary 1-pixel image
            cv::Mat tmp(1,1,CV_8UC3);
            tmp.at<cv::Vec3b>(0,0) = cv::Vec3b(blue, green, red);

            // Converting the target to Lab color space
            cv::cvtColor(tmp, tmp, CV_BGR2Lab);

            target = tmp.at<cv::Vec3b>(0,0);
        }

        // Sets the color to be detected
        void setTargetColor(cv::Vec3b color){
            target = color;
        }

        // Gets the color to be detected
        cv::Vec3b getTargetColor() const{
            return target;
        }

        cv::Mat process(const cv::Mat &image);
        cv::Mat process_bycv(const cv::Mat &image);


        int getColorDitanceToTargetColor(const cv::Vec3b& color) const {
            return getColorDistance(color, target);
        }
        // Compute the city-block distance between two colors
        int getColorDistance(const cv::Vec3b&color1, const cv::Vec3b& color2) const {
            return abs(color1[0]-color2[0]+
                       abs(color1[1])-color2[1]+
                       abs(color1[2]-color2[2]));
        }

    };


    cv::Mat ColorDetector::process(const cv::Mat &image){
        // re-allocate binary map if necessary
        // same size as input image, but 1-channel
        result.create(image.size(), CV_8U);

        // Converting to Lab color space
        cv::cvtColor(image, converted, CV_BGR2Lab);

        // processing
        // get the iterators
        cv::Mat_<cv::Vec3b>::const_iterator it = converted.begin<cv::Vec3b>();
        cv::Mat_<cv::Vec3b>::const_iterator itend = converted.end<cv::Vec3b>();
        cv::Mat_<uchar>::iterator itout = result.begin<uchar>();

        // for each pixel
        for(; it!=itend;++it, ++itout){
            // compute distance from target color
            if(getColorDitanceToTargetColor(*it) <= maxDist){
                *itout = 255;
            }else{
                *itout = 0;
            }
        }
        return result;
    }



    int main(){
        //1. Create image processor object
        ColorDetector cdetect;
        //2. Read input image
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");
        if(image.empty()) return 0;
        else cv::imshow("Original Image", image);

        //3. Set input parameters
        cdetect.setTargetColor(230, 220, 130);

        //4. Process the image and display the result
        cv::Mat result = cdetect.process(image);
        cv::imshow("Process Result", result);

        cv::Mat masked, result_inv;
        cv::bitwise_not(result, result_inv);

        image.copyTo(masked, result_inv);
        cv::add(masked, cv::Scalar(255,255,255), masked, result);
        cv::imshow("Masked", masked);

        cv::waitKey(0);
        return 0;

    }


{% endcodeblock %}


输出：

![](http://blog-1252464519.costj.myqcloud.com/170502/Selection_003.png)

貌似，效果差不多...







