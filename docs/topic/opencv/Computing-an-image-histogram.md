---
title: OpenCV系列笔记十三：Computing an image histogram
copyright: true
date: 2017-05-02 16:34:26
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview
我们经常从图像像素点的直方图来获取一些数据，所以绘制直方图也是需要掌握的。

>An image is made of pixels that have different values. For example, in a 1-channel gray-level image, each pixel has an integer value between 0 (black) and 255 (white). Depending on the picture content, you will find different amounts of each gray shade laid out inside the image. A histogram is a simple table that gives you the number of pixels that have a given value in an image (or sometimes, a set of images). The histogram of a gray-level image will, therefore, have 256 entries (or bins). Bin 0 gives you the number of pixels that have the value 0, bin 1 gives you the number of pixels that have the value 1, and so on. Obviously, if you sum all of the entries of a histogram, you should get the total number of pixels. Histograms can also be normalized so that the sum of the bins equals 1. In this case, each bin gives you the percentage of pixels that have this specific value in the image.

下面我们分别给出单通道[灰度图]和三通道图像直方图的绘制，前者来自这系列笔记的参考书，后者来自官方文档，其实基本思路是一致的。


#### Code

##### 单通道[灰度图]

###### grayhistogram.h

{% codeblock lang:cpp %}

    #ifndef CLIONS_GRAYHISTOGRAM_H
    #define CLIONS_GRAYHISTOGRAM_H

    #include <cv.h>
    #include <highgui.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>

    class Histogram1D{
    private:
        int histSize[1]; // numbers of bins in histogram
        float hranges[2];  // range of values
        const float* ranges[1];  // pointer to the value ranges
        int channels[1]; // channel number to be examined
    public:
        Histogram1D(){
            // Prepare default arguments for 1D histogram
            histSize[0] = 256;  // 256bins
            hranges[0] = 0.0;  // from 0 (inclusive)
            hranges[1] = 256.0;  // to 256 (exclusive)
            ranges[0] = hranges;
            channels[0] = 0; // we look at channel 0
        }

        void setNBins(int size){
            histSize[0] = size;
        }

        // Computes the 1D histogram
        cv::Mat getHistogram(const cv::Mat &image){
            cv::Mat hist;
            //Compute 1D histogram with calcHist
            cv::calcHist(&image,1,channels,cv::Mat(),
                         hist, 1, histSize, ranges);
            return  hist;
        }


        // Compute the 1D histogram and returns an image of it
        cv::Mat getHistogramImage(const cv::Mat &image, int zoom=1){
            // Compute histogram first
            cv::Mat hist = getHistogram(image);
            // Create imaeg
            return getImageOfHistogram(hist, zoom);
        }

        // Create an image representing a histogram (static method)
        static cv::Mat getImageOfHistogram(const cv::Mat &hist, int zoom){
            // Get min and max bin values
            double maxVal = 0;
            double minVal = 0;
            cv::minMaxLoc(hist, &minVal, &maxVal, 0, 0);

            //get histogram size
            int histSize = hist.rows;

            //Square image on which to display histogram
            cv::Mat histImg(histSize*zoom, histSize*zoom, CV_8U, cv::Scalar(255));
            // set highest point at 90% of nbins (i.e. image height)
            int hpt = static_cast<int>(0.9*histSize);

            //Draw vertical line for each bin
            for(int h=0; h<histSize; h++){
                float binVal = hist.at<float>(h);
                if(binVal>0){
                    int intensity = static_cast<int>(binVal*hpt/maxVal);
                    cv::line(histImg, cv::Point(h*zoom, histSize*zoom), cv::Point(h*zoom, (histSize - intensity)*zoom),cv::Scalar(0),zoom);
                }
            }
            return histImg;
        }


    };

    #endif //CLIONS_GRAYHISTOGRAM_H

{% endcodeblock %}



###### main.cpp

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/highgui.hpp>
    #include <opencv2/imgproc.hpp>
    #include "imageInfo.h"
    #include "grayhistogram.h"

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png",0); // gray
        cv::imshow("Original Image", image);
        // The histogram object
        Histogram1D h;

        //Compute the histogram
        cv::Mat histo = h.getHistogram(image);

        // Loop over each bin
        for(int i=0; i<256; i++){
            std::cout<<"Value "<<i<<" = "
                                  <<histo.at<float>(i)<<std::endl;
        }


        cv::imshow("Histogram", h.getHistogramImage(image));

        cv::waitKey(0);
        return 0;

    }

{% endcodeblock %}

输出：

>Value 0 = 73
Value 1 = 94
Value 2 = 288
Value 3 = 157
...

![](http://blog-1252464519.costj.myqcloud.com/170502/hist1.png)



##### 多通道[彩色]

###### main.cpp
这里，为了更好地展示图片，我们仿照上面的方法，对文档代码进行了修改。主要就是动态限制了直方图高度。

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgcodecs.hpp"
    #include "opencv2/imgproc.hpp"
    #include <iostream>

    using namespace std;
    using namespace cv;


    int main(){
        Mat src, dst;
        src = imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png", IMREAD_COLOR);

        if(src.empty()) return  -1;
        else imshow("Original Image", src);

        vector<Mat>bgr_planes;
        split(src, bgr_planes);

        int histSize[1];
        histSize[0] = 256;

        float range[] = {0, 256};
        const float* histRange[2] = {range};

        bool uniform = true;
        bool accumulate = false;

        Mat b_hist, g_hist, r_hist;

        calcHist(&bgr_planes[0], 1, 0, Mat(), b_hist, 1, histSize, histRange, uniform, accumulate);
        calcHist(&bgr_planes[1], 1, 0, Mat(), g_hist, 1, histSize, histRange, uniform, accumulate);
        calcHist(&bgr_planes[2], 1, 0, Mat(), r_hist, 1, histSize, histRange, uniform, accumulate);

        // Draw the histograms for B, G, and R
        double maxVal = 0;
        double minVal = 0;
        cv::minMaxLoc(b_hist, &minVal, &maxVal, 0, 0);
        cv::minMaxLoc(g_hist, &minVal, &maxVal, 0, 0);
        cv::minMaxLoc(r_hist, &minVal, &maxVal, 0, 0);

        int hpt = static_cast<int>(0.9*histSize[0]);

        int hist_w = 512; int hist_h = 400;
        int bin_w = cvRound((double)hist_w / histSize[0]);
        Mat histImage(hist_h, hist_w, CV_8UC3, Scalar(0,0,0));

        // normalization
        normalize(b_hist, b_hist, 0, histImage.rows, NORM_MINMAX, -1, Mat());
        normalize(b_hist, b_hist, 0, histImage.rows, NORM_MINMAX, -1, Mat());
        normalize(b_hist, b_hist, 0, histImage.rows, NORM_MINMAX, -1, Mat());

        for(int i=1; i<histSize[0]; i++)
        {
            line(histImage, Point(bin_w*(i-1), hist_h - cvRound(b_hist.at<float>(i-1)*hpt/maxVal)),
                            Point(bin_w*i, hist_h - cvRound(b_hist.at<float>(i)*hpt/maxVal)),
                            Scalar(255, 0, 0), 2, 8, 0);

            line(histImage, Point(bin_w*(i-1), hist_h - cvRound(g_hist.at<float>(i-1)*hpt/maxVal)),
                 Point(bin_w*i, hist_h - cvRound(g_hist.at<float>(i)*hpt/maxVal)),
                 Scalar(0, 255, 0), 2, 8, 0);

            line(histImage, Point(bin_w*(i-1), hist_h - cvRound(r_hist.at<float>(i-1)*hpt/maxVal)),
                 Point(bin_w*i, hist_h - cvRound(r_hist.at<float>(i)*hpt/maxVal)),
                 Scalar(0, 0, 255), 2, 8, 0);
        }

        imshow("calcHist", histImage);
        waitKey(0);

        return 0;
    }

{% endcodeblock %}


输出：

![](http://blog-1252464519.costj.myqcloud.com/170502/hist2.png)



##### 直方图的修正

先来看下什么是图像增强技术：
>图像增强技术是一大类基本的图像处理技术，目的是对一幅图像进行 加工，突出图像中的某些信息，削弱或除去某些不需要的信息，以得 到对具体应用来说视觉效果更好、更有用的图像，或转换成一种更适
合人或机器进行分析处理的形式。

而图像增强方法分为空间域法和频率域法，空间域法是指在空间域内直接对像素的灰度值进行运算处理，我们这里将要介绍的直方图的修正，还有在下一篇笔记[look-ip table](http://datahonor.com/2017/05/04/Look-up-tables/)
里面用到了灰度变换都属于常用的空间域法。与之对应的频率域法是一种间接的处理方法。它是在图像的某种变换宇内，对图像的变换值进行增强处理，然后通过逆变换获得增强图像。


###### 直方图的均衡化(histogram equalization)

均衡化的原理是使得变换后的图像灰度的概率密度均匀分布，即变换后的图像是衣服灰度级均匀分布的图像，这意味着图像灰度的动态范围得到了增加，从而可提高图像的对比度。
转换过程类似这种形式：
![]()

简单讲就是转换为其累计密度分布的形式。具体的推导过程见参考资料。

在OpenCV中已经有了相应的函数，我们来看下它的效果：

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include "grayhistogram.h"

    int main() {
        cv::Mat image;
        Histogram1D h;

        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/dark.jpeg", 0);
        cv::imshow("Original Image", image);
        cv::imshow("Original Hist", h.getHistogramImage(image));

        cv::Mat equed;
        cv::equalizeHist(image, equed);
        cv::imshow("Equed", equed);
        cv::imshow("Equed Hist", h.getHistogramImage(equed));

        cv::waitKey(0);
        return 0;

    }

{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170505/Selection_050511%3A02%3A11.png)


###### 直方图的规定化(histogram specification/matching)

定义：
>是指将一幅图像通过灰度变换后，使其具有特定的直方图形式，如使图像与某一标准图像具有相同的直方图，或使图像具有某一特定函数形式的直方图。

可以看到规定化是将原来的直方图转化为指定的形式。先将两个图像都进行均衡化处理，之后让被转化的直方图向目标直方图靠拢来得到目的。

在OpenCV中没有特定函数实现规定化，我从Scribd找来实现的代码，参考一下：


{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include "grayhistogram.h"
    #include <iostream>

    cv::Mat grayImgSpecification(cv::Mat &img1, cv::Mat &img2){
        cv::Mat img_new = img1.clone();
        int grayLevel = 256;

        // Histogram
        Histogram1D h;
        cv::Mat histogram1 = h.getHistogram(img1);
        cv::Mat histogram2 = h.getHistogram(img2);
    //    cv::imshow("img1-original histogram", h.getHistogramImage(img1));
    //    cv::imshow("img2-original histogram", h.getHistogramImage(img2));

        // Specifuication
        float * prImg1 = new float[grayLevel];
        float * mapImg1 = new float[grayLevel];
        float * prImg2 = new float[grayLevel];

        float n1 = img1.rows * img1.cols;
        float n2 = img2.rows * img2.cols;

        // 不同灰度级所占的比例
        for(int i=0; i<grayLevel; i++ ){
            float nk = histogram1.at<float>(i);
            prImg1[i] = nk/n1;

            nk = histogram2.at<float>(i);
            prImg2[i] = nk/n2;

            mapImg1[i] = 0;
        }

        // 累加
        for(int i=1; i<grayLevel; i++){
            prImg1[i] = prImg1[i-1] + prImg1[i];
            prImg2[i] = prImg2[i-1] + prImg2[i];

        }
        prImg1[grayLevel - 1] = prImg2[grayLevel - 1] = 1;

        // Mapping
        int currentID = 0;
        for(int i=1; i<grayLevel; i++)
        {
            bool mapped = false;
            while(mapped== false){
                if(prImg1[i] <= prImg2[currentID])
                {
                    mapImg1[i] = currentID;
                    mapped = true;
                }
                else
                {
                    currentID++;
                }
            }
        }

        // new Image
        for(int i=0; i<img_new.rows; i++){
            uchar* data = img_new.ptr<uchar>(i);
            for(int j=0; j<img_new.cols;j++){
                int grayVale = (int)data[j*img_new.channels()+0];
                float val = mapImg1[grayVale];
                data[j*img_new.channels()+0] = val;
            }
        }

        return img_new;
    }



    int main(){
        // Read image
        cv::Mat img1 = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/desert.jpg");
        cv::Mat img2 = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/sea.jpg");

        // split
        std::vector<cv::Mat>img1_bgrplanes;
        cv::split(img1, img1_bgrplanes);

        std::vector<cv::Mat>img2_bgrplanes;
        cv::split(img2, img2_bgrplanes);

        cv::Mat img_new0 = grayImgSpecification(img1_bgrplanes[0], img2_bgrplanes[0]);
        cv::Mat img_new1 = grayImgSpecification(img1_bgrplanes[1], img2_bgrplanes[1]);
        cv::Mat img_new2 = grayImgSpecification(img1_bgrplanes[2], img2_bgrplanes[2]);

        cv::Mat img_news;
        std::vector<cv::Mat>img_new_planes;
        img_new_planes= {img_new0, img_new1, img_new2};
        cv::merge(img_new_planes, img_news);
        cv::imshow("Img_news", img_news);
        cv::imwrite("specification.jpg", img_news);

        cv::waitKey(0);
        return 0;

    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/170505/Selection_050512%3A26%3A29.png)

根据上面已经提到的，我们来获取原来的图片和新生成图片的彩色直方图：


![](http://blog-1252464519.costj.myqcloud.com/170505/Selection_050501.png)

![](http://blog-1252464519.costj.myqcloud.com/170505/Selection_050502.png)

![](http://blog-1252464519.costj.myqcloud.com/170505/Selection_050503.png)


可以看到，最后生成的直方图和目标直方图(sea-hist)是基本一致的，这样就是达到了正规化的目的。

#### 直方图比较

我们也可以通过比较直方图来检测图像的相似度

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include "grayhistogram.h"
    #include <iostream>
    #include "colorhistogram.h"

    using namespace std;

    class ImageCompparator{
    private:
        cv::Mat refH;  // reference histogram
        cv::Mat inputH;  // histogram of input image

        ColorHistogram hist;  // to generate the histograms number of bins used in each color channel
        int nBins;

    public:
        ImageCompparator():nBins(8){}

        // set and compute histogram of reference image
        void setReferenceImage(const cv::Mat &image){
            hist.setSize(nBins);
            refH = hist.getHistogram(image);
        }

        // comapre the image using their BGR histograms
        double compare(const cv::Mat &image){
            inputH = hist.getHistogram(image);

            //histogram comparison using intersection
            return cv::compareHist(refH, inputH, cv::HISTCMP_INTERSECT);
        }
    };

    int main(){
        cv::Mat image;
        image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/waves.jpg");
        cv::imshow("Original Image", image);

        ImageCompparator c;
        c.setReferenceImage(image);

        cv::Mat wave, beach, cattle;
        wave = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/waves.jpg");  // 和自身比较
        beach = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/beach.jpg");  // 和较为相似的比较
        cattle = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/cattle.png");  // 和不相似的比较


        double waves = c.compare(wave);
        cv::imshow("wave's score: "+std::to_string(waves), wave);
        double beachs = c.compare(beach);
        cv::imshow("beach's score: "+std::to_string(beachs), beach);
        double cattles = c.compare(cattle);
        cv::imshow("cattle's score: "+std::to_string(cattles), cattle);

        cv::waitKey(0);
        return 0;

    }



{% endcodeblock %}

![](http://blog-1252464519.costj.myqcloud.com/170505/cmphists.png)


#### Refrence

[Scribd代码](https://www.scribd.com/document/106790597/OPENCV-Topic-04-Histogram-Specification)

[北大遥感课件](http://bj3s.pku.edu.cn/activity/subjects/lesson6.pdf)


山东科大《数字图像处理》
