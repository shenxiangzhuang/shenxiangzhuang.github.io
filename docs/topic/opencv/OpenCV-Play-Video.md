---
title: OpenCV Wait!
date: 2017-02-22 20:43:53
categories:
- Cpp
tags:
- Cpp
- OpenCV
---



环境： CLion Ubuntu16.04 OPenCV3.2.0

学习OpenCV基础时，在读取视频文件时发现一个问题。
按照这样：
{% codeblock lang:cpp%}

    #include <iostream>
    #include	"opencv2/highgui/highgui.hpp"
    #include	"opencv2/imgproc/imgproc.hpp"

    int	main(	int	argc,	char**	argv	)	{
        cv::namedWindow(	"Example3",	cv::WINDOW_AUTOSIZE	);
        cv::VideoCapture	cap;
        //cap.open(	std::string(argv[1])	);
        cap.open("/home/shen/CLionProjects/MyCv/data/summaryVid.ogv");
        cv::Mat	frame;
        for(;;)	{
            cap	>>	frame;
            if(	frame.empty() )	break;					//	Ran	out	of	film
            cv::imshow(	"Example3",	frame	);

            if(	cvWaitKey(33) >= 0 )	break;
            //if(	cv::waitKey(33) >= 0 )	break;
        }
        return	0;
    }

{% endcodeblock %}

代码最后，第一个if可以播放完整视频，而第二个却只显示一帧画面。调试发现，cvWaitKey(33)在不按键时返回的是-1， cv::waitKey(33)返回的是255
那么，问题来了，这两个函数不一样吗？查了查，没查到区别。。。
经[废帝童鞋](http://www.liusong.me/)帮助，发现是个[bug](https://github.com/opencv/opencv/pull/7866)...
酸爽的夜晚，继续前行...


参考： **Learning	OpenCV	3: Computer	Vision	in	C++	with	the	OpenCV	Library** [p58]





