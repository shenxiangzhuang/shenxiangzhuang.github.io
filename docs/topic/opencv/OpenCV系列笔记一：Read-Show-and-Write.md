---
title: 'OpenCV系列笔记一：Read, Show and Write'
copyright: true
date: 2017-04-26 22:50:36
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

看了一段时间的 *OpenCV 3 Computer Vision Application Programming Cookbook - Third Edition*,受益匪浅，目前看到了第8章，打算先暂停下，总结下前面学到的内容。
这里，在开始的部分，我们介绍下图片文件的读写。


##### Code

先看一段代码

{% codeblock lang:cpp %}

    //
    // Created by shensir on 17-4-26.
    //
    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>

    //core header that declares the image data structure
    //and the highgui header file that contains all the graphical interface
    //functions

    // print images's info
    void getImageInfo(cv::Mat image){
        std::cout<<"=====Image Info=====\n";
        std::cout<<"image.rows: "<<image.rows<<"\n";
        std::cout<<"image.cols: "<<image.cols<<"\n";
        std::cout<<"image.dims: "<<image.dims<<"\n";
        std::cout<<"image.channels: "<<image.channels()<<"\n";

        // something else...
        std::cout<<"====================\n";

    }

    int main(){
        cv::Mat image;  // create an empty image

        // read an input image
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/mangzai.jpg");
        if(image.empty()){
            std::cout<<"ERROR: Empty Image!\n";
            return -1;  // exit with code -1;
        }
        // print info of the image
        getImageInfo(image);

        // define the window(optional)
        // http://stackoverflow.com/questions/31155577/opencv-is-namedwindow-necessary-before-imshow

        cv::namedWindow("Original Image");
        // show the image
        cv::imshow("Original Image", image);

        // let's do something on the image
        cv::Mat fliped;  // we create another empty image
        cv::flip(image, fliped, 1); // 1->positive for horizontal
                                    // 0 for vertical, negative for both
        cv::imshow("Fliped", fliped);

        // save the image
        cv::imwrite("Filped.jpg", fliped);

        cv::waitKey();

        return 0;

    }



{% endcodeblock %}



简单讲解下代码要注意的地方：

1. cv::imread
>源码：@param filename Name of file to be loaded.
@param flags Flag that can take values of cv::ImreadModes
*/
CV_EXPORTS_W Mat imread( const String& filename, int flags = IMREAD_COLOR );
>可以看到，两个参数分别是文件名和读取的方式，默认是COLOR即BGR方式读入。
>关于flags, 我们截取源码片段看一下：
//! Imread flags
enum ImreadModes {
IMREAD_UNCHANGED = -1, //!< If set, return the loaded image as is (with alpha channel, otherwise it gets cropped).
>
>IMREAD_GRAYSCALE = 0,  //!< If set, always convert image to the single channel grayscale image.
>IMREAD_COLOR = 1,  //!< If set, always convert image to the 3 channel BGR color image.
>
>注意默认的是COLOR模式，即为1.
>

2. image.empty()
>这里是很有必要的习惯，我们要保证图片的正确载入，否则下面的操作将会失去意义。用Cpp写imread,image为空会自动报错，在用Python调用OpenCV接口读取的时候，即使图片为空也不会有报错，这点要注意下。

3. namedWindow
> namedWindow creates a window that can be used as a placeholder for images and trackbars. Created windows are referred to by their names.
>
>The fuction namedWindow just makes sure that if you wish to do something with that same window afterwards (eg move, resize, close that window), you can do it by referencing it with the same name.
>
>So if you just want to show it; you don't need to use namedWindow().
>即是说，如果只用窗口展示图片的话，不需要namedWindow, 在需要对图片展示窗口进行操作（复用）时才用的到。

4. cv::waitKey() 与 cvWaitKey()
>@param delay Delay in milliseconds. 0 is the special value that means "forever".
 */
CV_EXPORTS_W int waitKey(int delay = 0);
>
>/* wait for key event infinitely (delay<=0) or for "delay" milliseconds */
CVAPI(int) cvWaitKey(int delay CV_DEFAULT(0));
>
>看似并没有什么差别...但是这里有个之前发现的bug，参考[这里](http://datahonor.com/2017/02/22/OpenCV-Play-Video/).










