---
title: OpenCV系列笔记十六：Using the mean shift algorithm to find an object
copyright: true
date: 2017-05-04 15:40:36
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview
在上一篇笔记[OpenCV系列笔记十五：Backprojecting a histogram to detect specific image content ](http://datahonor.com/2017/05/04/Backprojecting-a-histogram-to/)，我们了解了histogram backprojection的原理及用法。这里，我们在backprojection的基础上介绍一种新的算法，即mean shift。他用来在给定的模糊范围，精确定位一个已知histogram[从给定的ROI得到]的物体。来看下参考书的介绍：
>The result of a histogram backprojection is a probability map that expresses the probability that a given piece of image content is found at a specific image location. Suppose we now know the approximate location of an object in an image; the probability map can be used to find the exact location of the object. The most probable location will be the one that maximizes this probability inside a given window. Therefore, if we start from an initial location and iteratively move around in an attempt to increase the local probability measure, it should be possible to find the exact object location. This is what is accomplished by the **mean shift algorithm**.


在看下文档对mean shift的介绍：

    /** @brief Finds an object on a back projection image.

    @param probImage Back projection of the object histogram. See calcBackProject for details.
    @param window Initial search window.
    @param criteria Stop criteria for the iterative search algorithm.
    returns
    :   Number of iterations CAMSHIFT took to converge.
    The function implements the iterative object search algorithm. It takes the input back projection of
    an object and the initial position. The mass center in window of the back projection image is
    computed and the search window center shifts to the mass center. The procedure is repeated until the
    specified number of iterations criteria.maxCount is done or until the window center shifts by less
    than criteria.epsilon. The algorithm is used inside CamShift and, unlike CamShift , the search
    window size or orientation do not change during the search. You can simply pass the output of
    calcBackProject to this function. But better results can be obtained if you pre-filter the back
    projection and remove the noise. For example, you can do this by retrieving connected components
    with findContours , throwing away contours with small area ( contourArea ), and rendering the
    remaining contours with drawContours.

    @note
    -   A mean-shift tracking sample can be found at opencv_source_code/samples/cpp/camshiftdemo.cpp
     */
    CV_EXPORTS_W int meanShift( InputArray probImage, CV_IN_OUT Rect& window, TermCriteria criteria );

mean shift算法是根据已经生成的backprojection map，在给定的初始位置开始进行迭代搜索，直到前后centroid差值小于给定的阀值或者达到预先设定的最大迭代次数时停止迭代, 函数返回达到收敛时迭代的次数。

##### Code

[colorhistogram.h和contentfinder.h在前一篇笔记已经给出]


{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include <iostream>
    #include "colorhistogram.h"
    #include "contentfinder.h"




    int main(){
        // Read reference image
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/baboon01.jpg");
        // initial window position
        cv::Rect rect(110, 45, 35, 45);
        cv::rectangle(image, rect, cv::Scalar(0,0,255));
        // Baboon's face ROI
        cv::Mat imageROI = image(rect);

        cv::namedWindow("Image1");
        cv::imshow("Image1", image);

        // Get the Hue histogram of baboon's face
        int minSat = 65;
        ColorHistogram hc;
        cv::Mat colorhist = hc.getHueHistogram(imageROI, minSat);

        ContentFinder finder;
        finder.setHistogram(colorhist);

        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/baboon02.jpg");

        // Convert to HSV space
        cv::Mat hsv;
        cv::cvtColor(image, hsv, CV_BGR2HSV);
        // Get back-projection of hue histogram
        int ch[1] = {0};
        finder.setThreshold(-1.0f); // no thresholding
        cv::Mat result = finder.find(hsv, 0.0f, 180.0f, ch);

        // initial window position
        cv::rectangle(image, rect, cv::Scalar(0,0,255));

        cv::Rect* prect = &rect;
        // Search object with mean shift
        cv::TermCriteria criteria(
                cv::TermCriteria::MAX_ITER | cv::TermCriteria::EPS,
                10, // iterate max 10 times
                1); // or until the change in centroid position is less than 1px
        std::cout<<"meanshif= "<<cv::meanShift(result, *prect, criteria)<<std::endl;
        cv::rectangle(image, *prect , cv::Scalar(0,255,0));


        cv::namedWindow("image 2");
        cv::imshow("image 2", image);

        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}



输出：
![](http://blog-1252464519.costj.myqcloud.com/170504/Selection_050415%3A35%3A28.png)




