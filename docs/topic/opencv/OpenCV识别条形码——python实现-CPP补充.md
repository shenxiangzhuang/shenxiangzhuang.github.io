---
title: 'OpenCV识别条形码——python实现[CPP补充]'
date: 2017-03-02 16:42:49
categories:
- Cpp
tags:
- OpenCV
---


在之前的[这篇文章](待测文件： 位于与当前cpp文件同目录的data文件夹下 
http://datahonor.com/2017/03/02/OpenCV%E8%AF%86%E5%88%AB%E6%9D%A1%E5%BD%A2%E7%A0%81%E2%80%94%E2%80%94python%E5%AE%9E%E7%8E%B0/)，仿照教程做了一个条形码识别的程序，不过结果不太理想，就暂时放下，最近继续看OpenCV官方文档，看到了Template Matching，于是动手实验了一下，成功的解决了问题。

环境：ubuntu14.04， OpenCV3.2.0， Clion
##### data/barcode.jpg
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/barcode.jpg)
##### /data/barcode_temp.png
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/barcode_temp.png)

##### Code
{% codeblock lang:cpp %}

    #include "opencv2/highgui/highgui.hpp"
    #include "opencv2/imgproc/imgproc.hpp"
    #include <iostream>
    #include <stdio.h>

    /// Function Headers
    void MatchingMethod( int, void* );

    /** @function main */
    int main( int argc, char** argv )
    {
        /// Load image and template
        img = imread( argv[1], 1 );
        templ = imread( argv[2], 1 );

        /// Create windows
        namedWindow( image_window, CV_WINDOW_AUTOSIZE );
        namedWindow( result_window, CV_WINDOW_AUTOSIZE );

        /// Create Trackbar
        const char *trackbar_label = "Method: \n 0: SQDIFF \n 1: SQDIFF NORMED \n 2: TM CCORR \n 3: TM CCORR NORMED \n 4: TM COEFF \n 5: TM COEFF NORMED";
        createTrackbar( trackbar_label, image_window, &match_method, max_Trackbar, MatchingMethod );

        MatchingMethod( 0, 0 );

        waitKey(0);
        return 0;
    }

    /**
     * @function MatchingMethod
     * @brief Trackbar callback
     */
    void MatchingMethod( int, void* )
    {
        /// Source image to display
        Mat img_display;
        img.copyTo( img_display );

        /// Create the result matrix
        int result_cols =  img.cols - templ.cols + 1;
        int result_rows = img.rows - templ.rows + 1;

        result.create( result_rows, result_cols, CV_32FC1 );

        /// Do the Matching and Normalize
        matchTemplate( img, templ, result, match_method );
        normalize( result, result, 0, 1, NORM_MINMAX, -1, Mat() );

        /// Localizing the best match with minMaxLoc
        double minVal; double maxVal; Point minLoc; Point maxLoc;
        Point matchLoc;

        minMaxLoc( result, &minVal, &maxVal, &minLoc, &maxLoc, Mat() );

        /// For SQDIFF and SQDIFF_NORMED, the best matches are lower values. For all the other methods, the higher the better
        if( match_method  == CV_TM_SQDIFF || match_method == CV_TM_SQDIFF_NORMED )
        { matchLoc = minLoc; }
        else
        { matchLoc = maxLoc; }

        /// Show me what you got
        rectangle( img_display, matchLoc, Point( matchLoc.x + templ.cols , matchLoc.y + templ.rows ), Scalar::all(0), 2, 8, 0 );
        rectangle( result, matchLoc, Point( matchLoc.x + templ.cols , matchLoc.y + templ.rows ), Scalar::all(0), 2, 8, 0 );

        imshow( image_window, img_display );
        imshow( result_window, result );

        return;
    }


{% endcodeblock %}

之后在Clion编译运行：
>cmake .      // 注意空格
make
./CvTest data/barcode.jpg data/barcode_temp.png    // CvTest是我的项目名称


运行结果如下： 可通过滑动trackbar选择不同的matching方式
![](http://dataimage-1252464519.costj.myqcloud.com/images/CV/barcode-1.jpg)
最后，要注意的是，上面的barcode_temp.png是直接从barcode.jpg中截取的照片，而我们使用的又是以来与Histgram的算法，所以模板图片的大小可能会对其识别有一定的影响，具体改进等继续学习以后再回来补充了。



