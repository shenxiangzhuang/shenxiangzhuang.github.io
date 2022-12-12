---
title: Learning Opencv3学习笔记--制作简易视频播放器
date: 2017-04-03 23:47:43
categories:
- Cpp
tags:
- Cpp
- OpenCV
copyright: true
---

*Learning Opencv3*上面的的一个代码，第一次看的时候基本没看懂，这次大概看懂了。这里先贴上代码，再来简单解释下代码流程。
##### 代码

{% codeblock lang:cpp %}

    #include "opencv2/highgui/highgui.hpp"
    #include "opencv2/imgproc/imgproc.hpp"
    #include <iostream>
    #include <fstream>

    using namespace std;

    int g_slider_position = 0;
    int g_run = 1, g_dontset = 0;
    cv::VideoCapture g_cap;

    void onTrackbarSlide(int pos, void*){
        g_cap.set(cv::CAP_PROP_POS_FRAMES, pos);

        if(!g_dontset)
            g_run = 1;
        g_dontset = 0;
    }

    int main(){
        cv::namedWindow("Example", cv::WINDOW_AUTOSIZE);
        g_cap.open("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/sampvideo.ogv");
        int frames = (int) g_cap.get(cv::CAP_PROP_FRAME_COUNT);
        int tmpw = (int) g_cap.get(cv::CAP_PROP_FRAME_WIDTH);
        int tmph = (int) g_cap.get(cv::CAP_PROP_FRAME_HEIGHT);
        cout<<"Video has "<<frames<<" frames of dimensions("<<tmpw<<", "<<tmph<<")."<<endl;

        cv::createTrackbar("Position",	"Example",	&g_slider_position,	frames,
                           onTrackbarSlide);

        cv::Mat frame;
        for(;;){
            if(g_run != 0){
                g_cap>>frame; if(frame.empty()) break;
                int current_pos = (int) g_cap.get(cv::CAP_PROP_POS_FRAMES);

                g_dontset = 1;

                cv::setTrackbarPos("Position", "Example", current_pos);
                cv::imshow("Example", frame);

                g_run -= 1;
            }
            char c = (char) cvWaitKey(10);
            if(c == 's') // single step
                {g_run =1; cout<<"single step, run = "<<g_run<<endl;}
            if(c == 'r')  // run mode
                {g_run = -1; cout<<"Run mode, run = "<<g_run<<endl;}
            if(c == 27)
                break;
        }
        return 0;
    }


{% endcodeblock %}
##### 简单解释


重要参数解释：
>g_slider_position，进度条位置
>
>g_run，控制视频播放模式，为正数[如5]时，表示距离视频暂停还有几个[这里是5个]frame将输出到屏幕，这里g_run为正数大都是1，故为step即但不模式； 当为负数时，将一直播放下去，因为g_run -=1的存在使得g_run一直为负。
>
>g_dontest,为了鼠标点击进度条的动作而设计的参数。使得点击进度条后，自动进入step模式。
>
>createTrackbar( TrackbarName, "Linear Blend", &alpha_slider, alpha_slider_max, on_trackbar );Whenever the user moves the Trackbar, the callback function on_trackbar is called



运行流程：
>开始时g_slider_position为0,在main函数中输出到frame，后show，这个过程中，g_dontset被设置为1，使得在不进行*点击以移动进度条*动作时，进度条不会被重置到新的指定的位置,且g_dontset将一直被从0重置为1.此时，如果在cvWaitKey的10ms[图片显示时间]，按下‘s’则，按照前面参数说明，在播放一帧之后，视频将暂停；按下'r'，则g_run将由-1递减下去，一直为负，视频一直进行下去。若是此时点击移动进度条，则在g_dontset = 1之前[这时g_dontset=0]调用回调函数onTrackbarSlide，使得g_cap的位置被指定为当前帧的位置，接着g_run = 1， 进入单步模式，接着将show当前帧的画面和他的下一帧画面后进入暂停模式。


个人理解，错误之处请指正。























