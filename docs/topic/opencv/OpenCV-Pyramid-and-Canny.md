---
title: 'OpenCV [Pyramid and Canny]'
date: 2017-02-23 08:27:25
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

关于[图像金字塔](http://www.opencv.org.cn/opencvdoc/2.3.2/html/doc/tutorials/imgproc/pyramids/pyramids.html)与边缘检测的结合。
我们知道，cv::pyrDown会损失图像的信息，其后再使用cv::pyrUP进行放大，会变得“模糊”。但是在用于边缘检测时，损失部分细节，可以获得更简洁的轮廓图。
测试代码：
{% codeblock lang:cpp%}
    #include	<opencv2/opencv.hpp>
    int	main(	int	argc,	char**	argv	)	{
        cv::Mat	img_rgb,	img_gry,	img_cny;
        cv::namedWindow(	"Example	Gray",		cv::WINDOW_AUTOSIZE	);
        cv::namedWindow(	"Example	Canny",	cv::WINDOW_AUTOSIZE	);
        cv::namedWindow(	"Example	Canny  DU",	cv::WINDOW_AUTOSIZE	);

        img_rgb	=	cv::imread(	argv[1]	);				cv::cvtColor(	img_rgb,	img_gry,	cv::COLOR_BGR2GRAY);
        cv::imshow(	"Example	Gray",	img_gry	);
        cv::Canny(	img_gry,	img_cny,	10,	100,	3,	true	);
        cv::imshow(	"Example	Canny",	img_cny	);

         (img_gry, img_gry);
        cv::pyrUp(img_gry, img_gry);
        cv::Canny(	img_gry,	img_cny,	10,	100,	3,	true	);
        cv::imshow(	"Example	Canny  DU",	img_cny	);
        cv::waitKey(0);
    }
{% endcodeblock %}

输出图像：
![canny](http://dataimage-1252464519.costj.myqcloud.com/images/canny.png)

参考： **Learning	OpenCV	3: Computer	Vision	in	C++	with	the	OpenCV	Library** [p68]
