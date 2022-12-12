---
title: OpenCV识别条形码——python实现
date: 2017-03-02 16:33:55
categories:
- Python
tags:
- OpenCV
---
今天看到[这篇文章](http://python.jobbole.com/80448/)，这里保留核心识别算法，稍微进行一些改动贴在这里学习研究。

环境：Win32, Anaconda3, Spyder, OpenCV3.1.0

文件目录：
>待测试图片文件夹test-imgs
>核心预测算法实现bar_code.py
>图片批处理imgs_pro.py 


##### Code
###### bar_code.py
{% codeblock lang:python%}

    # -*- coding: utf-8 -*-
    """
    Created on Mon Dec 26 21:46:21 2016

    @author: Administrator
    """

    import cv2
    import numpy as np

    #image_name = input("Enter the name of the picture:")

    def detect(image_name):
        print("正在识别"+image_name+'...')
        # Load the image and convert it to grayscale
        image = cv2.imread(image_name)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # compute the Scharr gradient magnitude representation of the iamges
        # in both the x and y direction
        # 原来代码下面是cv2.cv.CV_32F会报错->AttributeError: module 'cv2' has no attribute 'cv'
        # 在新版本变为cv2.CV_32F
        gradX = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 1, dy = 0, ksize = -1)
        gradY = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 0, dy = 1, ksize = -1)

        # substract the y-gradient from the x-gradient
        gradient = cv2.subtract(gradX, gradY)
        gradient = cv2.convertScaleAbs(gradient)

        # blur and threhold the image
        # 这里(13,13)是kernel matrix size，自己可以改变看看识别效果
        blurred = cv2.blur(gradient, (13, 13))
        # 这里的阀值200,255也可以根据图片自定义
        (_, thresh) = cv2.threshold(blurred, 200, 255, cv2.THRESH_BINARY)

        # construct a closing kernel and apply it to the thresholded image
        # (20, 15)也是一个参数，用来获取需要的kernel
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 15))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        # perform a series of erosions and dilations
        closed = cv2.erode(closed, None, iterations = 4)
        closed = cv2.dilate(closed, None, iterations = 4)

        # Find the contours in the thresholded image, then sort the contours
        # by their area, keeping only the largest one
        # ValueError: too many values to unpack (expected 2)
        (img,cnts, _) = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        c = sorted(cnts, key = cv2.contourArea, reverse = True)[0]
        # compute the rotated bounding box of the largest contour
        rect = cv2.minAreaRect(c)
        # 原文这里使用cv2.cv.BoxPoints，新版本已经移除，换为cv2.boxPoints
        box = np.int0(cv2.boxPoints(rect))

        # draw a bounding box around the detected barcode
        # and display the image
        cv2.drawContours(image, [box], -1, (0,255,0), 3)


        cv2.imshow(image_name, image)
        cv2.waitKey(0)
        print("Done...\n##################################")

{% endcodeblock %}
###### imgs_pro.py

{% codeblock lang:python%}

    # -*- coding: utf-8 -*-
    """
    Created on Mon Dec 26 23:22:01 2016

    @author: Administrator
    """
    import os
    from bar_code import detect
    # 切换到测试图片文件夹
    os.chdir('test-imgs')
    # 找到所有的测试图片文件名
    image_names = os.listdir()

    if __name__=='__main__':
        for image_name in image_names:
            detect(image_name)

{% endcodeblock %}

#####  test-imgs文件夹
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/1.png)

##### 运行结果
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/3.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/4.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/5.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/6.png)


 开始按照原来的程序识别效果不怎么好，自己调整了几个参数，效果还可以，但是可以看到还是有的识别不出。接下来我们会用OpenCV官方给出的[Cpp](http://datahonor.com/2017/03/02/OpenCV%E8%AF%86%E5%88%AB%E6%9D%A1%E5%BD%A2%E7%A0%81%E2%80%94%E2%80%94python%E5%AE%9E%E7%8E%B0-CPP%E8%A1%A5%E5%85%85/#more)的例子来纠正这个问题。


