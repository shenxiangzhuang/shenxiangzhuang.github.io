---
title: OpenCV系列笔记二十：Segmenting images using watersheds
copyright: true
date: 2017-05-24 23:19:35
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview

关于分水岭算法：

>The watershed transformation is a popular image processing algorithm that is used to quickly segment an image into homogenous regions. It relies on the idea that when the image is seen as a topological relief, the homogeneous regions correspond to relatively flat basins delimited by steep edges. 

在同质区域的分割里，watersheds是很好用的一个算法，但是其存在over-segment的问题，也就是会错误地分割出很多小的区域。这点我们可以通过在应用算法前手动添加标记来弥补。

算法的进一步理解：

>use the topological map analogy in the description of the watershed algorithm. In order to create watershed segmentation, the idea is to progressively flood the image starting at level 0. As the level of water progressively increases (to levels 1, 2, 3, and so on), catchment basins are formed. The size of these basins also gradually increases and, consequently, the water of two different basins will eventually merge. When this happens, a watershed is created in order to keep the two basins separated. Once the level of water has reached its maximum level, the sets of these created basins and watersheds form the watershed segmentation.


#### Code


##### watershedSegmentation.h

{% codeblock lang:cpp %}

    #ifndef CLIONS_WATERSHEDSEGMENTATION_H
    #define CLIONS_WATERSHEDSEGMENTATION_H

    #endif //CLIONS_WATERSHEDSEGMENTATION_H

    class WatershedSegmenter{
    private:
        cv::Mat markers;

    public:
        void setMarkers(const cv::Mat& markerImage){

            // Convert to image of ints
            markerImage.convertTo(markers, CV_32S);
        }

        cv::Mat process(const cv::Mat & image){

            // Apply watershed
            cv::watershed(image, markers);
            return markers;
        }

        // Return result in the form of an image
        cv::Mat getSegmentation(){
            cv::Mat tmp;
            // all segment with label higher than 255
            // will be assigned value 255
            markers.convertTo(tmp, CV_8U);
            return tmp;
        }

        // Return watershed in the form of an image
        cv::Mat getWatersheds(){
            cv::Mat tmp;
            // -1*255+255 = 0  --> 分水岭算法将边界标记为-1，如此转化为0，黑色，其余全白色
            markers.convertTo(tmp, CV_8U, 255, 255);
            return tmp;
        }
    };

{% endcodeblock %}

##### main.cpp

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include "watershedSegmentation.h"

    using namespace std;

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png");
        cv::Mat binary = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/binary.bmp",0);
        cv::imshow("raw image", image);

        cv::imshow("raw binary", binary);
        // Eliminate noise and smaller objects
        cv::Mat fg;
        cv::erode(binary, fg, cv::Mat(), cv::Point(-1,-1), 4);
        cv::imshow("fg", fg);

    //    threshold_type=CV_THRESH_BINARY:
    //    dst(x,y) = max_value, if src(x,y)>threshold ; 0, otherwise.

    //    threshold_type=CV_THRESH_BINARY_INV:
    //    dst(x,y) = 0, if src(x,y)>threshold; dst(x,y) = max_value,otherwise.

        cv::Mat bg;
        cv::dilate(binary, bg, cv::Mat(), cv::Point(-1,-1) ,5);
        // 使得原来为黑色[0]的，变为灰色[草地]， 原来为白色[255]的，变为黑色[牛群]
        cv::threshold(bg, bg, 1, 128, cv::THRESH_BINARY_INV);
        cv::imshow("bg", bg);

        // Create markers image
        cv::Mat markers(binary.size(), CV_8U, cv::Scalar(0));
        markers = fg+bg;
        cv::imshow("markers", markers);

        //Create watershed segmentation object
        WatershedSegmenter segmenter;

        // Set markers and process
        segmenter.setMarkers(markers);
        segmenter.process(image);

        // Display segmentation result
        cv::imshow("Segmentation", segmenter.getSegmentation());

        // Display watersheds
        cv::imshow("Watershed", segmenter.getWatersheds());

        cv::waitKey();
        return 0;

    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052402.png)


##### main.cpp

我们可以手工添加标记来防止watersheds固有的over-segment问题，是为Marker-controlled watershed。


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include "watershedSegmentation.h"

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/tower.jpg");

        // Identify background pixels
        cv::Mat imageMask(image.size(), CV_8U, cv::Scalar(0));
        cv::rectangle(imageMask, cv::Point(5,5), cv::Point(image.cols-5, image.rows-5), cv::Scalar(255,255,255),3);
        // Identify foreground pixels(int the middle of the image)
        cv::rectangle(imageMask, cv::Point(image.cols/2-10, image.rows/2-10), cv::Point(image.cols/2+10, image.rows/2+10), cv::Scalar(1),10);

        // Set markers and process
        WatershedSegmenter segmenter;
        segmenter.setMarkers(imageMask);
        segmenter.process(image);

        // Display the image with markers
        cv::rectangle(image, cv::Point(5,5), cv::Point(image.cols-1, image.rows-5), cv::Scalar(255,255,255), 3);
        cv::rectangle(image, cv::Point(image.cols/2-10,image.rows/2-10),cv::Point(image.cols/2+10,image.rows/2+10),cv::Scalar(1,1,1),10);
        cv::imshow("Image with marker", image);

        // Display watersheds
        cv::imshow("Watershed", segmenter.getWatersheds());

        cv::waitKey();
        return 0;

    }

{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052403.png)



#### Reference

http://cmm.ensmp.fr/~beucher/wtshed.html#mark
http://docs.opencv.org/3.1.0/d3/db4/tutorial_py_watershed.html



