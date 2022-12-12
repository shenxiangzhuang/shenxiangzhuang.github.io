---
title: Pedestrian Detection
copyright: true
date: 2017-08-17 09:47:39
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

#### Overview

使用OpenCV自带的API进行行人检测。


#### Code

参考[这里](https://github.com/shenxiangzhuang/opencv-samples)

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/imgproc.hpp>
    #include "opencv2/imgcodecs.hpp"
    #include <opencv2/highgui.hpp>
    #include <opencv2/ml.hpp>
    #include <opencv2/opencv.hpp>

    using namespace cv;
    using namespace std;

    #define INPUT_VIDEO_FILE "/home/shensir/Documents/MyPrograming/Cpp/MyCV/data/terrace1-c0.avi"
    #define WINDOW_NAME "WINDOW"

    // Reference: https://github.com/Itseez/opencv/blob/master/samples/cpp/train_HOG.cpp
    void draw_locations(Mat &img, const vector<Rect> &locations, const Scalar &color) {
        if (!locations.empty()) {
            vector<Rect>::const_iterator loc = locations.begin();
            vector<Rect>::const_iterator end = locations.end();
            for (; loc != end; ++loc) {
                rectangle(img, *loc, color, 2);
            }
        }
    }

    int main(int argc, char **argv) {
        Mat mSrc;
        vector<Rect> vDetected;
        HOGDescriptor hog;

        static vector<float> detector = HOGDescriptor::getDefaultPeopleDetector();
        hog.setSVMDetector(detector);

        VideoCapture cap(INPUT_VIDEO_FILE);

        while (true) {

            cap >> mSrc;
            hog.detectMultiScale(mSrc, vDetected, 0, Size(8, 8), Size(32, 32), 1.05, 2);
            draw_locations(mSrc, vDetected, Scalar(0, 255, 0));

            imshow(WINDOW_NAME, mSrc);
            // 加上ESC退出
            char c = waitKey(10);
            if (c == 27)
                break;
        }

        return 0;
    }

{% endcodeblock %}

输出效果：

![](http://datahonor-1252464519.costj.myqcloud.com/201708/WINDOW_081702.png)

![](http://datahonor-1252464519.costj.myqcloud.com/201708/WINDOW_081703.png)


总体感觉还是不错的。视频下载[地址](http://cvlab.epfl.ch/data/pom).

#### 。。。

话说当初学OpenCV的初衷就是检测行人来着，想着检测食堂和学校主干道的行人，并进行计数，最好能搞出来实时人流量的图（天真orz...）...现在学了一年了，几乎没什么进展，而且发现所要做的或许是属于人群检测，而非简单的行人检测...


总的来说学的都是基本的图像处理操作和原理，用到的机器学习算法也就是K-means, KNN, SVM这些，至于深度学习，神经网络这些还没有去研究，一是想着先打好基础，二来。。。我这I5的小本子也撑不住..








