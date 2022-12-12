---
title: OpenCV计算结果保存--YAML/XML
copyright: true
date: 2017-05-15 22:42:16
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

在图像的操作与识别等过程中，我们很多时候要保存一些计算结果，方便后续的使用。OpenCV为我们提供了XML/YAML持久化层来完成这个任务。

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include <iostream>

    using namespace cv;

    int main(){

        // 写入操作
        FileStorage fs("Test.yml", FileStorage::WRITE);
        // save as int
        int fps = 5;
        fs<<"fps"<<fps;

        // mat
        Mat m1 = Mat::eye(2, 3, CV_32F);
        Mat m2 = Mat::ones(3, 2, CV_32F);
        Mat result = (m1+1).mul(m1+3);
        fs<<"Result"<<result;

        fs.release();


        // 读取操作
        FileStorage fs_r("Test.yml", FileStorage::READ);

        Mat r;
        fs_r["Result"] >> r;
        std::cout<< r<< std::endl;

        fs_r.release();

        return 0;

    }

{% endcodeblock %}


输出：
>[8, 3, 3;
 3, 8, 3]

此时，查看Test.YML文件：

    %YAML:1.0
    ---
    fps: 5
    Result: !!opencv-matrix
       rows: 2
       cols: 3
       dt: f
       data: [ 8., 3., 3., 3., 8., 3. ]


同样地，我们将上面文件的拓展名改为.xml，再次运行我们可以得到Test.xml文件：

    <?xml version="1.0"?>
    <opencv_storage>
    <fps>5</fps>
    <Result type_id="opencv-matrix">
      <rows>2</rows>
      <cols>3</cols>
      <dt>f</dt>
      <data>
        8. 3. 3. 3. 8. 3.</data></Result>
    </opencv_storage>


参考：*OpenCV By Example*



