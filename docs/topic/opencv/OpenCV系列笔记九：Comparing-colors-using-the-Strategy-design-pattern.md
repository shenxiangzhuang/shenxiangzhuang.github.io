---
title: OpenCV系列笔记九：Comparing colors using the Strategy design pattern
copyright: true
date: 2017-04-28 13:20:46
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

介绍通过比较颜色来检测一片区域，并进行处理的方法，采用了Strategy design pattern.


>Let's say we want to build a simple algorithm that will identify all of the
pixels in an image that have a given color. For this, the algorithm has to
accept an image and a color as input and will return a binary image
showing the pixels that have the specified color. The tolerance with
which we want to accept a color will be another parameter to be
specified before running the algorithm.

##### Code

代码通过两种方式来进行颜色的比较， 一种是自己实现的，另一种是应用了OpenCV提供的函数absdiff等。最后将这种算法的效果和floodfill进行比较。


{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>


    //Comparing colors using the Strategy design pattern

    class ColorDetector{
    public:
        // minimun accptable distance
        int maxDist;
        // target color
        cv::Vec3b target;

        // image containing resulting binary map
        cv::Mat result;

        // empty constructor
        // default parameter initialization here
        ColorDetector():maxDist(50),target(0,0,0){};

        // full constructor with target and distance
        // functor
        ColorDetector(uchar blue, uchar green, uchar red, int maxDist=50):
                maxDist(maxDist){
            setTargetColor(blue, green, red);
        }

        // functor--> ()
        cv::Mat operator()(const cv::Mat &image){
            return process_bycv(image);
        }


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
            // BGR order
            target = cv::Vec3b(blue, green, red);
        }

        // Sets the color to be detected
        void setTargetColor(cv::Vec3b color){
            target = color;
        }

        // Gets the color to be detected
        cv::Vec3b getTargetColor() const{
            return target;
        }

        // process the image
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

        // processing
        // get the iterators
        cv::Mat_<cv::Vec3b>::const_iterator it = image.begin<cv::Vec3b>();
        cv::Mat_<cv::Vec3b>::const_iterator itend = image.end<cv::Vec3b>();
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

    cv::Mat ColorDetector::process_bycv(const cv::Mat &image) {
        cv::Mat output;
        // compute abssolute difference with tarfet color
        cv::absdiff(image, cv::Scalar(target) ,output);

        //split the channels into 3 images;
        std::vector<cv::Mat> images;
        cv::split(output, images);

        // add the 3 channels (saturation might occurs here)
        output = images[0] + images[1] + images[2];
        // apply threshold
        cv::threshold(output, output, maxDist, 255, cv::THRESH_BINARY_INV);
        return output;
    }


    int main(){
        //1. Create image processor object
        ColorDetector cdetect;
        //2. Read input image
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");
        if(image.empty()) return 0;
        else cv::imshow("Original Image", image);

        //3. Set input parameters
        cdetect.setTargetColor(230, 190, 130);

        //4. Process the image and display the result
        cv::Mat result1 = cdetect.process(image);
        cv::imshow("process", result1);

        cv::Mat result2 = cdetect.process_bycv(image);
        cv::imshow("process_bycv", result2);



        // another way
        ColorDetector colordetector(230, 190, 130);
        cv::Mat result = colordetector(image);
        cv::imshow("colordetector result", result);

        // show the result in original image
        cv::Mat image_masked, mask_inv;
        mask_inv = 255 - result;
        cv::bitwise_and(image, image, image_masked, mask_inv);
        cv::add(image_masked, cv::Scalar(255, 255, 255), image_masked, result);
        cv::imshow("image_masked", image_masked);


        //floodFill的用法

        cv::floodFill(image, cv::Point(100,50),cv::Scalar(255,255,255),
                      (cv::Rect*)0, cv::Scalar(35,35,35), cv::Scalar(35,35,35),
                      cv::FLOODFILL_FIXED_RANGE);
        cv::imshow("Flood fill", image);

        cv::waitKey(0);
        return 0;

    }


{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170427/9.png)



关于floodfill和原算法的不同之处：

>Our ColorDetector class identifies the pixels in an image that have a
color similar to a given target color. The decision to accept or not a pixel
is simply made on a per-pixel basis. The cv::floodFill function
proceeds in a very similar way with one important difference: in this
case, the decision to accept a pixel also depends on the state of its
neighbors. The idea is to identify a connected area of a certain color.
The user specifies a starting pixel location and tolerance parameters that
determine color similarity.








