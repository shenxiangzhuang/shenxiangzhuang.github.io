---
title: OpenCV系列笔记七：Neighbor access
copyright: true
date: 2017-04-28 09:48:42
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### Overview
前面介绍了几种获取特定位置像素点的方法，但是有些时候我们也需要同时获取其周围的像素点的值，这时候，我们仿照前面的做法，只需要多加上几个位置指针即可。


##### Code

{% codeblock lang:cpp %}

    void sharpen(const cv::Mat &image, cv::Mat &result){
        // allocate if necessary
        result.create(image.size(), image.type());
        int nchannels = image.channels();

        // for all rows(except first and last
        for (int j = 0; j < image.rows - 1; j++) {
            const uchar * previous = image.ptr<const uchar>(j-1);
            const uchar * current = image.ptr<const uchar>(j);
            const uchar * next = image.ptr<const uchar>(j+1);

            uchar* output = result.ptr<uchar>(j); // output row
            for(int i=nchannels; i<(image.cols-1)*nchannels; i++){
                // apply sharpening operator
                *output++ = cv::saturate_cast<uchar>(
                        5*current[i]-current[i-nchannels]-
                        current[i+nchannels]-previous[i]-next[i]
                            );
            }
        }
        // set the unprocessed pixels to 0
        result.row(0).setTo(cv::Scalar(0));
        result.row(result.rows-1).setTo(cv::Scalar(0));
        result.col(0).setTo(cv::Scalar(0));
        result.col(result.cols-1).setTo(cv::Scalar(0));
    }



    void sharpen2D(const cv::Mat &image, cv::Mat &result){
        // Construct kernel (all entries initialized to 0)
        cv::Mat kernel(3,3, CV_32F, cv::Scalar(0));
        //assigns kernel values
        kernel.at<float>(1,1) = 5.0;
        kernel.at<float>(0,1) = -1.0;
        kernel.at<float>(2,1) = -1.0;
        kernel.at<float>(1,0) = -1.0;
        kernel.at<float>(1,2) = -1.0;
        //filter the image
        cv::filter2D(image, result, image.depth(), kernel);

    }



    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");
        cv::imshow("image", image);

        cv::Mat result1, result2;
        sharpen(image, result1);
        sharpen2D(image, result2);
        cv::imshow("Result1", result1);
        cv::imshow("Result2", result2);

        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/170427/8.png)



几点补充：

- [ ] cv::saturate_cast<uchar>
>其作用是保证像素点操作过程中出现的低于0或者大于255的值强制转化为0和255.
>

- [ ] 彩色图像的操作
>在对彩色图像进行处理的时候，每次对单个pixel的单个channel操作。


