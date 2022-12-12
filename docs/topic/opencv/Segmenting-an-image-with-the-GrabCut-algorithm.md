---
title: OpenCV系列笔记十一：Segmenting an image with the GrabCut algorithm
copyright: true
date: 2017-05-02 09:40:33
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview

如上篇所述，所关注的物体有较为独特的颜色时，我们可以通过一个颜色范围过滤出想要的物体。但是有些时候所要抽取的物体并不总是有鲜明的颜色特征。这里，我们介绍另一种根据图片特征进行分类的算法，即为GrabCut.


##### Code

先看一下实现代码和效果：

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>
    #include "imageInfo.h"


    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");
        cv::Rect rectangle(50,30,240,170);

        // show the ractangle
        cv::Mat imageclone = image.clone();
        cv::rectangle(imageclone, rectangle, 255, 2);
        cv::imshow("Image with Ractangle", imageclone);

        cv::Mat result;
        cv::Mat bgMOdel, fgModel;
        cv::grabCut(image, result, rectangle, bgMOdel, fgModel, 5, cv::GC_INIT_WITH_RECT);

    //    打印可以看到result是由1，2，3，4组成，即为四种模式
    //    std::cout<<result<<std::endl;
    //    std::cout<<cv::GC_PR_FGD<<std::endl;

        cv::compare(result, cv::GC_PR_FGD, result, cv::CMP_EQ);
        cv::Mat foreground(image.size(), CV_8UC3,cv::Scalar(255,255,255));
        image.copyTo(foreground, result);

        cv::imshow("foreground", foreground);
        cv::waitKey(0);

        return 0;
    }

{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170502/Selection_002.png)


简单解释下上面的程序：

- [ ] **cv::grubCut**
先看下文档的参数解释：
![](http://blog-1252464519.costj.myqcloud.com/170502/Selection_001.png)
>中文解释，参考[这里](http://blog.csdn.net/zouxy09/article/details/8535087)
>这个解释还是挺不错的，但是在mask和rect这里好像和文档有些出入。第一个是mask这里，即使不手工标记，也会有GCD_BGD存在，因为rect之外的部分默认被视为背景，我们上面的实验结果result也是未进行人工标注，其包含0，2，3.

- [ ] **models**
看文档强调在处理同一张图片时，不要修改两个models,即bgdModel和fgdModel.这是因为运行grubCut之后，里面保存了一些之前迭代的数据，如果得到的结果不理想，我们可以再次利用这两个models继续迭代，省去重复迭代。
>This explains the argument of the function where the user can specify
the number of iterations to be applied. The two internal models
maintained by the algorithm are passed as an argument of the function
(and returned). Therefore, it is possible to call the function with the
models of the last run again if one wishes to improve the segmentation
result by performing additional iterations.

- [ ] **cv::GC_PR_FGD and cv::GC_FGD**
在我们上面的程序，`cv::compare(result, cv::GC_PR_FGD, result, cv::CMP_EQ);`可以看出，我们提取的是，可能的前景图，并没有提取确定的前景图。我们可以将这一行代码换为`result = result&1`来达到同时提取的目的。
因为，

{% codeblock lang:cpp %}

    //! class of the pixel in GrabCut algorithm
    enum GrabCutClasses {
        GC_BGD    = 0,  //!< an obvious background pixels
        GC_FGD    = 1,  //!< an obvious foreground (object) pixel
        GC_PR_BGD = 2,  //!< a possible background pixel
        GC_PR_FGD = 3   //!< a possible foreground pixel
    };

{% endcodeblock %}

>所以，1&1, 1&3 均为1，0&1， 2&1均为0.这里因为没有事先标记GC_FGD，所以同时获取得到的结果和之前是一样的。















