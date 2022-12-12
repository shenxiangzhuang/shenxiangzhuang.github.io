---
title: OpenCV系列笔记四：ROI
copyright: true
date: 2017-04-28 00:00:24
categories:
- Cpp
tags:
- Cpp
- OpenCV
---
##### Overview
在对图片进行处理的时候，我们关注的往往是图片的某些区域，称为regions of interest，即为ROI。我们的操作也是主要针对这些区域进行的。来看下面这个向图片上添加logo的例子。

##### Code

我们直接将logo加到图片上去，即使使用权重，效果也是不好。

{% codeblock lang:cpp %}
    int main(){
        cv::Mat image, logo;
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/bao.jpeg");
        logo = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/logo.png");

        cv::imshow("logo", logo);
        cv::imshow("image", image);
        // define image ROI at image bottom-right
        cv::Mat imageROI(image, cv::Rect(0,0, logo.cols, logo.rows));


    //  insert logo directly
        logo.copyTo(imageROI);
        cv::imshow("add drictly", image);


    //  add in weight
        cv::Mat dst;
        cv::addWeighted(imageROI, 0.7, logo, 0.3, 0,imageROI);
        cv::imshow("add in weight", image);

        cv::waitKey(0);
        return 0;
    }


{% endcodeblock %}

![](http://blog-1252464519.costj.myqcloud.com/170427/1.png)



这里，我们应当专注于ROI的mask使用，用来提取logo的主体和ROI的背景。

{% codeblock lang:cpp %}

    int main(){
        cv::Mat image, logo;
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/bao.jpeg");
        logo = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/logo.png");

        cv::imshow("logo", logo);
        cv::imshow("image", image);
        // define image ROI at image bottom-right
        cv::Mat imageROI(image, cv::Rect(0,0, logo.cols, logo.rows));




        cv::Mat logo_gray;
        cv::cvtColor(logo, logo_gray, CV_BGR2GRAY);

        cv::Mat mask, mask_inv;
        //下面将logo主体形状[灰度值不再100-255的部分]标记为白色255，即在按位和时取此白色部分
        cv::threshold(logo_gray, mask, 100, 255, CV_THRESH_BINARY_INV);
        // mask_inv与mask颜色相反[黑白互换即0,255互换]，即在取按位和时取logo的背景部分
        cv::bitwise_not(mask,mask_inv);

        cv::Mat img_bg, logo_fg;
        //取出ROI中和背景部分重合的区域，预留主体部分为黑色0
        cv::bitwise_and(imageROI,imageROI, img_bg, mask_inv);

        //从logo中取出logo主体部分，预留非logo主体部分为黑色0
        cv::bitwise_and(logo,logo,logo_fg,mask);

        // 相加合并图像
        cv::add(img_bg, logo_fg,imageROI);

        //处理过程中产生的图像
        cv::imshow("mask", mask);
        cv::imshow("img_bg", img_bg);
        cv::imshow("logo_fg", logo_fg);

        //最后完成合并的图像
        cv::imshow("image", image);
        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}


输出：
![](http://blog-1252464519.costj.myqcloud.com/170427/2.png)




这段代码对初学者理解起来可能有些困难，我也是反复看了几次才搞懂...主要的流程就是，先将logo转化为灰度图，再进行threshold操作，用mask分离出logo主体，再通过mask作用于logo的按位和得到logo主体部分，其余背景为0（黑色）；同样地，再将mask_inv作用于原图片的ROI区域的按位和，得到ROI区域的背景，其中预留将要和logo主体重合的部分为0（黑色）。这样，再直接将抠出来的背景和logo相加，就得到看了想要的效果了。





