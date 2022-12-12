---
title: OpenCV系列笔记二：Mouse trackbar
copyright: true
date: 2017-04-27 00:06:56
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

#### Overview
关于OpenCV如何捕捉鼠标动作进行图片的交互。这里回调函数可能有点不太好理解，简单讲就是说，在cv::setMouseCallback之后，在指定的窗口，鼠标动作将会被捕捉，根据捕捉到的动作，按照onMouse的定义进行操作，之后回到捕捉状态。如果没有鼠标动作，那么程序将会一直wait,等待退出。


#### Code

##### 显示像素值

{% codeblock lang:cpp %}

    //
    // Created by shensir on 17-4-26.
    //
    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include "imageInfo.h"

    using namespace std;


    // Mouse trackbar

    using namespace std;

    void onMouse(int event, int x, int y, int flags, void* param);

    int main(){
        cv::Mat image;
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/mangzai.jpg", 0);
        getImageInfo(image);
        cv::imshow("Original Image", image );
        cv::setMouseCallback("Original Image", onMouse,
                             reinterpret_cast<void*>(&image));
        cvWaitKey(0);

        return 0;
    }

    void onMouse (int event, int x, int y, int flags, void*param){
        cv::Mat *im = reinterpret_cast<cv::Mat*>(param);
        switch (event){
            case cv::EVENT_LBUTTONDOWN: // left mouse button down event
                // display pixel value at (x,y)
                std::cout << "at (" << x << "," << y << ") value is:"
                          << static_cast<int>(
                                  im->at<uchar>(cv::Point(x,y))) <<
                          std::endl;

            break;

        }
    }


{% endcodeblock %}




##### 动态模糊与做图

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    using namespace cv;


    // 创建变量，保存滑动条的初始位置值
    int blurAmount = 15;

    // 滑动条的回调函数
    static void onChange(int pos, void* userInput);

    // 鼠标的回调
    static void onMouse(int event, int x, int y, int, void* userInput);

    int main(){

        Mat img = imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/tower.jpg");
        namedWindow("Tower");

        // 创建滑动条
        createTrackbar("Tower Bar", "Tower", &blurAmount, 30, onChange, &img);
        setMouseCallback("Tower", onMouse, &img);

        // 调用onChange来初始化
        onChange(blurAmount, &img);

        waitKey(0);

        // 销毁窗口
        destroyAllWindows();

        return 0;
    }


    static void onChange(int pos, void* userInput)
    {
        if(pos <= 0)
            return;

        // 输出的辅助变量
        Mat imgBlur;

        // 获取图像指针
        Mat* img = (Mat*) userInput;

        // 应用模糊滤波
        blur(*img, imgBlur, Size(pos, pos));

        // 展示输出
        imshow("Tower", imgBlur);
    }


    static void onMouse(int event, int x, int y, int, void* userInput){
        if(event != EVENT_LBUTTONDOWN)
            return;

        // 获取图像指针
        Mat* img = (Mat*)userInput;

        // 绘制圆形
        circle(*img, Point(x,y), 10, Scalar(0,255,0), 3);

        onChange(blurAmount, img);
    }
{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/170515/Selection_051601.png)


##### 添加按钮

这里，测试的时候没有成功，因为在编译OpenCV的时候没有添加Qt的支持，需要重新编译才行。这里先把代码放在这，有时间重新编译再测试。


{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    using namespace cv;

    Mat img;
    bool applyGray=false;
    bool applyBlur=false;
    bool applySobel=false;

    void applyFilters(){
        Mat result;
        img.copyTo(result);

        if(applyGray){
            cvtColor(result, result, COLOR_BGR2GRAY);
        }

        if(applyBlur){
            blur(result, result, Size(5,5));
        }

        if(applySobel){
            Sobel(result, result, CV_8U, 1,1 );
        }

        imshow("Tower", result);
    }


    void grayCallback(int state, void*  userData){
        applyGray=true;
        applyFilters();
    }


    void bgrCallback(int state, void*userData){
        applyGray = false;
        applyFilters();
    }

    void blurCallback(int state, void* userData){
        applyBlur = (bool)state;
        applyFilters();
    }

    void sobelCallback(int state, void* userData){
        applySobel = !applySobel;
        applyFilters();
    }


    int main(){
        img = imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/tower.jpg");
        namedWindow("Tower");

        // 创建按钮
        createButton("Blur", blurCallback);

        waitKey(0);
        destroyAllWindows() ;

        return 0;
    }

{% endcodeblock %}


还有就是。。。开始以为安装Qt，在Qt运行才可以(其实并不是啦。。)，所以就在Qt下配置了下OpenCV。具体配置参考[这里](http://rodrigoberriel.com/2014/11/using-opencv-3-qt-creator-3-2-qt-5-3)




