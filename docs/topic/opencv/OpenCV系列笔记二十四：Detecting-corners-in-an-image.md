---
title: OpenCV系列笔记二十四：Detecting corners in an image
copyright: true
date: 2017-07-20 11:43:58
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

#### Overview

关于图片关键点的检测中，corner点的检测。

>When searching for interesting feature points in images, corners come out as an interesting solution. They are indeed local features that can be easily localized in an image, and in addition, they should abound in scenes of man-made objects (where they are produced by walls, doors, windows, tables, and so on).

这里主要是基于Harris feature detector的实现。

首先是corners的定义：

>To define the notion of corners in images, the Harris feature detector looks at the average directional change in intensity in a small window around a putative interest point.... This average intensity change can then be computed in all possible directions, which leads to the definition of a corner as a point for which the average change is high in more than one direction.

这里的公式没有看太懂，大致就是利用梯度找到对比度较强的点作为corner.

这里首先介绍了经典的Harris feature detector的实现，接着针对feature point clustering问题给出了两种解决的办法，分别是non-maxima suppression，通过dilate操作来实现；还有GFTT（good-features-to-track），通过设置两个interest points 之间的最小距离来解决。

#### Code


##### harrisDetector.h

{% codeblock lang:cpp %}

    //
    // Created by shensir on 17-7-20.
    //

    #ifndef CLIONS_HARRISDETECTOR_H
    #define CLIONS_HARRISDETECTOR_H


    #include <opencv2/core/mat.hpp>
    #include <opencv2/imgproc.hpp>

    class harrisDetector {
    private:
        // 32-it float image of corner strength
        cv::Mat cornerStrength;
        // 32-bit float image of thresholded corners
        cv::Mat cornerTh;
        // image of local maxima(internal)
        cv::Mat localMax;
        // size of neighborhood for derivatives smoothing
        int neighborhood;
        // aperture for gradient computation
        int aperture;
        // Harris parameter
        double k;
        // maximum strength for threshold computation
        double maxStrength;
        // calculated threshold(internal)
        double threshold;
        // size of neighborhood for non-max suppression
        int nonMaxSize;
        // kernel for non-max suppression
        cv::Mat kernel;

    public:
        harrisDetector():neighborhood(3), aperture(3),
                         k(0.01), maxStrength(0.0),
                         threshold(0.01), nonMaxSize(3){
            // create kernel used in non-maxima suppression
            setLocalMaxWindowSize(nonMaxSize);
        }


        // Create kernel used in non-maxima suppression
        void setLocalMaxWindowSize(int size) {

            nonMaxSize= size;
            kernel.create(nonMaxSize,nonMaxSize,CV_8U);
        }


        // compute Harris corners
        void detect(const cv::Mat& image){
            // Harris computation
            cv::cornerHarris(image, cornerStrength,
            neighborhood, aperture, k);

            // internal threshold computation
            cv::minMaxLoc(cornerStrength, 0, &maxStrength);
            // local maxima detection
            cv::Mat dilated;
            cv::dilate(cornerStrength, dilated, cv::Mat());
            cv::compare(cornerStrength, dilated, localMax, cv::CMP_EQ);
        }

        // Get the corner map from the computed Harris values
        cv::Mat getCornerMap(double qualityLevel){

            cv::Mat cornerMap;
            // thresholding the corner strength
            threshold = qualityLevel*maxStrength;
            cv::threshold(cornerStrength, cornerTh, threshold,
            255, cv::THRESH_BINARY);

            // convert to 8-bit image
            cornerTh.convertTo(cornerMap, CV_8U);
            // not-maxima suppression
            cv::bitwise_and(cornerMap, localMax, cornerMap);

            return cornerMap;
        }

        // Get the feature points from the computed Harris values
        void getCorners(std::vector<cv::Point>&points, double qualityLeves){
            // Get the corner map
            cv::Mat cornerMap = getCornerMap(qualityLeves);
            // Get the corners
            getCorners(points, cornerMap);
        }

        // Get the feature points from the computed corner mao
        void getCorners(std::vector<cv::Point>&points,
                        const cv::Mat& cornerMap){
            // Iterate over the pixels to obtain all features
            for(int y = 0; y < cornerMap.rows; y++){
                const uchar* rowPtr = cornerMap.ptr<uchar>(y);
                for(int x = 0; x < cornerMap.cols; x++){
                    // if it is a feature point
                    if(rowPtr[x]){
                        points.push_back(cv::Point(x, y));
                    }
                }
            }
        }
        // Draw circles at feature point locations on an image
        void drawOnImage(cv::Mat& image,
                        const std::vector<cv::Point>&points,
                        cv::Scalar color = cv::Scalar(255, 255, 255),
                        int radius=3, int thickness=1){
            std::vector<cv::Point>::const_iterator it = points.begin();
            // for all corners
            while (it != points.end()){
                // draw a circle at each corner location
                cv::circle(image, *it, radius, color, thickness);
                ++it;
            }
        }

    };

    #endif //CLIONS_HARRISDETECTOR_H


{% endcodeblock %}


##### main.cpp


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #include "harrisDetector.h"
    #define PI 3.1415926

    using namespace std;
    using namespace cv;


    Mat findHarrisCorner(const Mat image){
        Mat HarriCorner;
        cornerHarris(image,
                    HarriCorner,
                    3,
                    3,
                    0.01);

        Mat HarriCornerThreshed;
        double thresholdNum = 0.0001;
        threshold(HarriCorner, HarriCornerThreshed,
                    thresholdNum, 255, THRESH_BINARY_INV);

        return HarriCornerThreshed;
    }


    Mat MGFTT(Mat image){
        // Compute good features to track
        std::vector<cv::KeyPoint>keypoints;
        // GFTT detector
        cv::Ptr<cv::GFTTDetector>ptrGFTT =
                cv::GFTTDetector::create(
                        500,
                        0.01,
                        10
                );

        // detect the GFTT
        ptrGFTT->detect(image, keypoints);
        std::vector<cv::KeyPoint>::const_iterator it = keypoints.begin();
        while(it != keypoints.end()){
            cv::circle(image, it->pt, 3, cv::Scalar(255, 255, 255), 1);
            ++it;
        }
        return image;
    }


    int main(){
        Mat image;
        image = imread("/home/shensir/Documents/MyPrograming/Cpp/MyCV/data/church01.jpg", 0);
        imshow("Original", image);

        // Raw harrisCorner
        Mat HarriCornerThreshed;
        HarriCornerThreshed = findHarrisCorner(image);
        imshow("HarrisCornerThreshed", HarriCornerThreshed);

        // non-maxima suppression(for the problem of feature point clustering.)

        // Create Harris detector instance
        Mat image2;
        image.copyTo(image2);

        harrisDetector harris;
        // Compute Harris values
        harris.detect(image2);
        // Detect Harris corners
        std::vector<cv::Point> pts;
        harris.getCorners(pts, 0.02);
        // Draw Harris corners
        harris.drawOnImage(image2, pts);
        imshow("non-maxima suppression", image2);

        //  impose a minimum distance between two interest points.
        // (for the problem of feature point clustering.)
        Mat image3;
        image.copyTo(image3);

        Mat GfttImage;
        GfttImage = MGFTT(image3);
        imshow("GFTT", GfttImage);

        waitKey(0);

        return 0;
    }


{% endcodeblock %}


输出：

![](http://otdfzpvtk.bkt.clouddn.com/Selection_072001.png)


















