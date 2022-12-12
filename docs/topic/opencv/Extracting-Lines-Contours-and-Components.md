---
title: OpenCV系列笔记二十三：Extracting Lines, Contours, and Components
copyright: true
date: 2017-05-27 09:01:01
categories:
- Cpp
tags:
- Cpp
---

#### Overview

我们这里介绍怎样从图像中抽取一些有用的特征来进行图像的分析。
>In order to perform content-based analysis of an image, it is necessary to
extract meaningful features from the collection of pixels that constitute
the image.


#### Code

##### Find contours by Canny operator

之前，我们也简单介绍了基于梯度的图像的边缘检测，但是有两个缺点：第一是边缘有些厚，第二用于分割的阀值很难找到。所以我们这里介绍Canny算子。

原理部分，参考[文档](http://docs.opencv.org/2.4/doc/tutorials/imgproc/imgtrans/canny_detector/canny_detector.html),写的很精彩。主要就是Non-maximum suppression和Hysteresis threshold的理解。

一个简单的demo:

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    using namespace std;

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/road.jpg", 0);
        cv::namedWindow("Original Image");
        cv::imshow("Original Image", image);

        // Apply Canny algorithm
        cv::Mat contours;
        cv::Canny(image, contours, 125, 350);  // contours {0,255},边缘为255
        cv::namedWindow("Canny Image");
        // 为了便于观察，取反色
        cv::imshow("Canny Image", 255-contours);

        cv::waitKey();
        return 0;
    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052701.png)



除此之外，我们也可以通过pyrUp去除一些细节再进行边缘检测，效果会更好些。参考[这里](http://datahonor.com/2017/02/23/OpenCV-Pyramid-and-Canny/)


##### Detecting lines in images with the Hough transform

关于霍夫变换的简单的demo，可以看下[这里](http://datahonor.com/2017/05/28/Hough%E5%8F%98%E6%8D%A2/). 这里，我们使用其进行检测图像中的直线。

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #define PI 3.1415926

    using namespace std;


    int main() {
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/road.jpg", 0);
        cv::imshow("Original Image", image);

        // Apply Canny algotithm
        cv::Mat contours;
        cv::Canny(image, contours, 125, 350);
        cv::imshow("Contours", contours);

        // Hough transfrom for line detection
        std::vector<cv::Vec2f>lines;
        cv::HoughLines(contours, lines, 1, PI/180, 60);

        std::vector<cv::Vec2f>::const_iterator it = lines.begin();
        while(it != lines.end()){

            float rho = (*it)[0];  // first element is distance rho
            float theta = (*it)[1];  // second element is angle theta

            if(theta < PI/4. || theta > 3.*PI/4){
                // vertical line
                // point of intersection of the line with first row
                cv::Point pt1(rho/cos(theta), 0);

                // point of intersection of the line with last row
                cv::Point pt2((rho-image.rows*sin(theta))/cos(theta), image.rows);

                // draw white line
                cv::line(image, pt1, pt2, cv::Scalar(255), 1);
            }else{
                // horizontal line
                // point of intersection of the line with first column
                cv::Point pt1(0, rho/sin(theta));
                // point of intersection of the line with last column
                cv::Point pt2(image.cols, (rho-image.cols*cos(theta))/sin(theta));
                // draw white line
                cv::line(image, pt1, pt2, cv::Scalar(255), 1);
            }
            ++it;
        }

        cv::imshow("Image", image);
        cv::waitKey();
        return 0;
    }

{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052804.png)


同样地，只要可以将图像中的形状转化到参数空间，我们都可以用hough变换进行检测，比如圆形的检测：


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #define PI 3.1415926

    using namespace std;
    int main() {
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/chariot.jpg", 0);
        // Detecting circles
        cv::GaussianBlur(image, image, cv::Size(5, 5), 1.5);
        std::vector<cv::Vec3f>circles;
        cv::HoughCircles(image, circles, cv::HOUGH_GRADIENT,
                        2, // accumulator resolution(size of the image/2)
                        20, // minimum distance between two circles
                        200, // Canny high threshold
                        60, // minimum number of vates
                        15,
                        50);  // min and max radius


        std::vector<cv::Vec3f>::const_iterator itc = circles.begin();
        while(itc!=circles.end()){
            cv::circle(image, cv::Point((*itc)[0], (*itc)[1]), (*itc)[2], cv::Scalar(255), 2);
            ++itc;
        }
        cv::namedWindow("Detected Circles");
        cv::imshow("Detected Circles", image);

        cv::waitKey();
        return 0;
    }


{% endcodeblock %}


输出:
![](http://datahonor-1252464519.costj.myqcloud.com/201705/Detected%20Circles_052901.png)


基于上面的应用，我们来学习下关于Probabilistic Hough transform的应用：

>As can be seen, the Hough transform simply looks for an alignment of edge pixels across the image. This can potentially create some false detections due to incidental pixel alignments or multiple detections when several lines with slightly different parameter values pass through the same alignment of pixels.
To overcome some of these problems, and to allow line segments to be detected (that is, with endpoints), a variant of the transform has been proposed. This is the Probabilistic Hough transform, and it is implemented in OpenCV as the cv::HoughLinesP function. 


**linefinder.h**

{% codeblock lang:cpp %}

    //
    // Created by shensir on 17-4-21.
    //

    #include <opencv2/core.hpp>
    #include <opencv2/imgproc.hpp>
    #define PI 3.1415926

    #ifndef CLIONS_LINEFINDER_H
    #define CLIONS_LINEFINDER_H

    #endif //CLIONS_LINEFINDER_H

    class LineFinder{
    private:
        // orginal image
        cv::Mat img;

        // vector containing the endpoints of the detected lines
        std::vector<cv::Vec4i>lines;

        // accumulator resolution parameters
        double deltaRHo;
        double deltaTheta;

        // minimum number of votes that a line
        // must receive before being considered
        int minVote;

        // min length for a line
        double minLength;

        // max allowed gap along the line
        double maxGap;

    public:
        // Default accumulator resolution is 1 pixel by 1 degree
        // no gap, no minimum length
        LineFinder():deltaRHo(1), deltaTheta(PI/180),
                     minVote(10), minLength(0.), maxGap(0.){}


        // Set the resolution of the accumulator
        void setAccResolution(double dRho, double dTheta){
            deltaRHo = dRho;
            deltaTheta = dTheta;
        }

        // Set the minimum member of votes
        void setMinVote(int minv){
            minVote = minv;
        }

        // Set line length and gap
        void setLineLengthAndGap(double length, double gap){
            minLength = length;
            maxGap = gap;
        }

        // Apply probabilistic Hough Transform
        std::vector<cv::Vec4i>findLines(cv::Mat&binary){
            lines.clear();
            cv::HoughLinesP(binary, lines, deltaRHo, deltaTheta, minVote,
                            minLength, maxGap);
            return lines;
        }

        // Draw the detected lines on an image
        void drawDetectedLines(cv::Mat &image, cv::Scalar color=cv::Scalar(255,255,255)){

            // Draw lines
            std::vector<cv::Vec4i>::const_iterator it2 = lines.begin();

            while(it2!=lines.end()){
                cv::Point pt1((*it2)[0], (*it2)[1]);
                cv::Point pt2((*it2)[2], (*it2)[3]);

                cv::line(image, pt1, pt2, color);
                ++it2;
            }
        }

    };


{% endcodeblock %}



**main.cpp**

{% codeblock %}

#include <cv.h>
#include <opencv2/imgcodecs.hpp>
#include <opencv/cv.hpp>
#include <iostream>
#include "linefinder.h"
#define PI 3.1415926

using namespace std


int main() {
    cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/road.jpg", 0);
    cv::imshow("Original Image", image);

    // Apply Canny algotithm
    cv::Mat contours;
    cv::Canny(image, contours, 125, 350);
    cv::imshow("Contours", contours);

        // Create LineFinder instance
    LineFinder finder;

    // Set probabilistic Hough parameters
    finder.setLineLengthAndGap(100, 20);
    finder.setMinVote(60);

    // Detect lines and draw them in the image
    std::vector<cv::Vec4i>lines = finder.findLines(contours);
    finder.drawDetectedLines(image);

    cv::namedWindow("Lines with HoughP");
    cv::imshow("Lines with HoughP", image);

    cv::waitKey();
    return 0;
}


{% endcodeblock %}

输出：
![](http://datahonor-1252464519.costj.myqcloud.com/201705/Selection_052902.png)

##### Extracting connected components && Computing components' shape descriptors


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #define PI 3.1415926

    using namespace std;

    // Eliminate too short or too long contours
    void BalanceLength(std::vector<std::vector<cv::Point>>& contours){
        int cmin = 80;  // minimum contour length
        int cmax = 500;  // maximum contours length
        std::vector<std::vector<cv::Point>>::iterator itc = contours.begin();

        // for all contours
        while( itc != contours.end()){
            // verify contour size
            if(itc->size() < cmin || itc->size() > cmax)
                itc = contours.erase(itc);
            else
                ++itc;
        }
    }


    int main(){

        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/marphimg.png", 0);
        cv::imshow("Original Image", image);
        // the vector that will contain the contours
        std::vector<std::vector<cv::Point>> contours;
        cv::findContours(image,
                        contours,   // a vector og contours
                        cv::RETR_EXTERNAL,  //retieve the external contours
                        cv::CHAIN_APPROX_NONE);  // all pixels of each contours


        // draw black contours on a white image
        cv::Mat result(image.size(), CV_8U, cv::Scalar(255));
        cv::drawContours(result, contours, -1, 0, 2); // draw all contours; in black; with a thickness of 2
        cv::imshow("result_before_elimination", result);

        // Eliminate too short or too long contours
        BalanceLength(contours);

        cv::Mat result1(image.size(), CV_8U, cv::Scalar(255));
        cv::drawContours(result1, contours, -1, 0, 2); // draw all contours; in black; with a thickness of 2
        cv::imshow("result_after_elimination", result1);

        // testing the bounding box
        cv::Rect r0 = cv::boundingRect(contours[0]);
        // draw the rectangle
        cv::rectangle(result1, r0, 0, 2);
        cv::imshow("boundingbox", result1);

        // testing the enclosing circle
        float radius;
        cv::Point2f center;
        cv::minEnclosingCircle(contours[1],center,radius);
        // draw the cricle
        cv::circle(result1,center,static_cast<int>(radius), cv::Scalar(0), 2);
        cv::imshow("enclosing", result1);

        // testing the approximate polygon
        std::vector<cv::Point> poly;
        cv::approxPolyDP(contours[2], poly, 5, true);
        // draw the polygon
        cv::polylines(result1, poly, true, 0, 2);
        cv::imshow("Poly", result1);


        // testing the convex hull
        std::vector<cv::Point>hull;
        cv::convexHull(contours[3], hull);
        // draw the polygon
        cv::polylines(result1, hull, true, 0, 2);
        cv::imshow("convexhull", result1);

        // testing the moments
        // iterator over all contours
        std::vector<std::vector<cv::Point>>::iterator itc = contours.begin();
        while(itc!=contours.end()){
            // compute all moments
            cv::Moments mom = cv::moments(cv::Mat(*itc++));

            // draw mess center
            cv::circle(result1, cv::Point(mom.m10/mom.m00, mom.m01/mom.m00),
            2, cv::Scalar(0), 2);  // draw black dot
        }

        cv::imshow("Moments", result1);


        // original color image of cattles
        cv::Mat colorImage  = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png");
        cv::imshow("OriginalColorImage", colorImage);

        cv::drawContours(colorImage, contours, -1, cv::Scalar(255,255,255), 2); // draw all contours; in black; with a thickness of 2
        cv::imshow("colorImage", colorImage);

        cv::waitKey(0);
        return 0;
    }



{% endcodeblock %}




输出：

![](http://datahonor-1252464519.costj.myqcloud.com/201705/Selection_052903.png)



##### Quadrilateral detection

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    #define PI 3.1415926

    using namespace std;

    int main(){
        cv::Mat components = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/mser.bmp", 0);
        cv::imshow("Raw Image", components);

        // binary
        components = components == 255;
        cv::imshow("Binary", components);

        // open the image (white background)
        // clean the image with a morphological filter
        cv::morphologyEx(components,components,
                        cv::MORPH_OPEN, cv::Mat(),
                        cv::Point(-1,-1), 3);

        cv::imshow("After bin-morph", components);

        // invert image (background must be black)
        cv::Mat componentsInv = 255 - components;

        // Get the contours of the connected components
        std::vector<std::vector<cv::Point>> contours;
        cv::findContours(componentsInv, contours, cv::RETR_EXTERNAL,
                        cv::CHAIN_APPROX_NONE);

        // white image
        cv::Mat quadri(components.size(), CV_8U, 255);

        // for all contours
        std::vector<std::vector<cv::Point>>::iterator it = contours.begin();
        std::vector<cv::Point> poly;
        while (it != contours.end()){
            poly.clear();
            cv::approxPolyDP(*it, poly, 5, true);

            // do we have a quadrilateral?
            if(poly.size() == 4)  //draw it
                cv::polylines(quadri, poly, true, 0, 2);
            ++it;
        }

        cv::imshow("Quadri", quadri);
        cv::waitKey();
        return 0;
    }


{% endcodeblock %}

输出：

![](http://datahonor-1252464519.costj.myqcloud.com/201705/Selection_052904.png)


