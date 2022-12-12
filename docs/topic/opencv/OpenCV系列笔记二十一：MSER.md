---
title: OpenCV系列笔记二十一：MSER
copyright: true
date: 2017-05-25 00:06:22
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview

Maximally Stable External Regions (MSER) 和分水岭算法类似，也是通过一种类似“浸水”的过程来找到图像中一些有意义的区域。但是和分水岭算法又有些不同：

>but this time, we will be interested in the basins that remain relatively stable for a period of time during the immersion process. It will be observed that these regions correspond to some distinctive parts of the scene objects pictured in the image.

也就是说，这里关注的不仅仅是界限，更多地考虑随着浸水过程的进行，特定区域是否有明显的变化（比如当前区域的水面面积的方差是否小于给定的阀值），如果在一段浸水时间内，某些区域的面积未有太大的变化，那么这就是我们要找的MSER。


#### Code


这里做图的时候要注意两点。第一，检测到的MSER是具有层级结构的，我们在绘图的时候要按照从大到小（面积）的顺序，且每次做图进行检查当前区域是否已经画过了。第二，这里会返回包含MSER的矩形，不过一般来说数目较多，全部做出来会使得结果显得比较凌乱，所以一般添加一些过滤条件来指定输出某些物体，比如通过指定矩形的长宽比来来输出包含窗户的矩形框。


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    using namespace std;

    int main(){
        // Read the image
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/building.jpg", 0);
        if(!image.data)
            return 0;

        // Display the image
        cv::namedWindow("Image");
        cv::imshow("Image", image);

        // basic MSER detector
        cv::Ptr<cv::MSER>ptrMSER = cv::MSER::create(5,  // delta value
                                                      200,  // min acceptable area
                                                         2000); // max acceptable area

        // vector of point sets
        std::vector<std::vector<cv::Point>>points;
        // vector of rectangles
        std::vector<cv::Rect>rects;
        // detect MSER features
        ptrMSER->detectRegions(image, points, rects);

        std::cout<<points.size()<<" MSERs detected"<<std::endl;

        // create white image
        cv::Mat output(image.size(), CV_8UC3);
        output = cv::Scalar(255,255,255);

        // OpenCV random number  generator
        cv::RNG rng;

        // Display the MSERs in color areas
        // for each detected feature
        // reverse order to display the larger MSER first
        for(std::vector<std::vector<cv::Point>>::reverse_iterator it = points.rbegin();
                it!=points.rend(); ++it){
            // generate a random color
            cv::Vec3b c(rng.uniform(0,254), rng.uniform(0,254), rng.uniform(0,254));

            std::cout << "MSER size= "<<it->size()<<std::endl;
            // for each point in MSER set
            for(std::vector<cv::Point>::iterator itPts = it->begin();
                    itPts!=it->end(); ++itPts){
                // do not overwrite MSER pixels
                if(output.at<cv::Vec3b>(*itPts)[0] = 255){
                    output.at<cv::Vec3b>(*itPts) = c;
                }
            }
        }
        cv::namedWindow("MSER point sets");
        cv::imshow("MSER point sets", output);
        cv::imwrite("mser.bmp", output);

        // Reload the input image
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/building.jpg", 0);
        if (!image.data)
            return 0;

        // Extract and display the elliptic MSERs
        for (std::vector<std::vector<cv::Point> >::iterator it = points.begin();
             it != points.end(); ++it) {

            // for each point in MSER set
            for (std::vector<cv::Point>::iterator itPts = it->begin();
                 itPts != it->end(); ++itPts) {

                // Extract bouding rectangles
                cv::RotatedRect rr = cv::minAreaRect(*it);
                // check ellipse elongation
                if (rr.size.height / rr.size.height > 0.6 || rr.size.height / rr.size.height < 1.6)
                    cv::ellipse(image, rr, cv::Scalar(255), 2);
            }
        }

        // Display the image
        cv::namedWindow("MSER ellipses");
        cv::imshow("MSER ellipses", image);


        cv::waitKey();
        return 0;

    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052404.png)
