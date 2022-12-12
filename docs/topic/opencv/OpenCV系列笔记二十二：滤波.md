---
title: OpenCV系列笔记二十二：滤波
copyright: true
date: 2017-05-25 15:33:11
categories:
- Cpp
tags:
- Cpp
- OpenCV
---


#### Overview

滤波在信号处理领域具有广泛的应用。同样的，我们可以通过 Fourier transform 或者 Cosine transform将空域（ spatial domain）上的图像信息转化到频域（frequency domain）。这里我们暂时不做深入了解，只需要了解：图像中的一些边缘和细节（变化较大的部分）对应频域中的高频部分，图像中较为平坦，变化不大的地方对应频域的低频部分。

基于上面的结论，我们称进行滤波的工具为滤波器(filter)，根据不同的过滤方式分为低通滤波器（ low-pass filter ）和高通滤波器( high-pass filter ).

我们将展示mean filter, gaussian filter, median filter 等多种滤波器的使用。

#### Code

##### Downsampling images with filters

我们在进行downsampling的时候，如果不进行低通滤波器的处理，直接去除行列的话，结果会比较糟糕：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052501.png)

可以看到，在直接downsampling的时候，原图像的细节，也就是高频部分无法在如此小的空间（如此少的像素数）上表现出来，还会出现spatial aliasing的现象。所以，我们一般进经过low-pass filter处理后在进行downsampling，这种做法即是遵从 Nyquist-Shannon theorem.而效果也是有较高的提升的：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052502.png)


下面是一些低通滤波器具体的应用：

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    using namespace std;

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png",0);
        if (!image.data)
            return 0;

        cv::imshow("Original Image", image);

        cv::Mat result;

        // Mean filtered
        cv::blur(image, result, cv::Size(5,5)); // size of the filter
        cv::imshow("Mean filtered Image", result);

        // Gaussian filtered Image
        cv::GaussianBlur(image, result, cv::Size(5,5), 1.5);
        cv::namedWindow("Gaussian filtered Image");
        cv::imshow("Gaussian filtered Image", result);

        // 应用高斯滤波后进行downsampling
        cv::Mat reduced(image.rows/4, image.cols/4, CV_8U);
        for(int i=0; i<reduced.rows; i++){
            for(int j=0; j<reduced.cols; j++){
                reduced.at<uchar>(i, j) = result.at<uchar>(i*4, j*4);
            }
        }

        cv::imshow("downsampling gaussian", reduced);
        cv::imwrite("gaussian-redeced.jpg", reduced);

        // 图像金字塔
        cv::Mat reducedImage;
        cv::pyrDown(result, reducedImage);  // reduce by half
        cv::imshow("pyDownImage", reducedImage);

        // resizing
        cv::Mat resized;
        cv::resize(image, resized, cv::Size(), 2, 2, cv::INTER_LINEAR);
        cv::imshow("resized", resized);


        // Median filtered
        cv::medianBlur(image, result, 5); // size of the filter
        cv::imshow("Mean filtered Image", result);

        cv::waitKey();
        return 0;
    }

{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052503.png)

median filter（注意其为no-linear）输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052504.png)

注意，基于图像金字塔的操作pyDown和pyUp是不可逆的。而pyDown在进行downsampling是也是进行了5x5 Gaussian filter to low-pass 处理的。


##### Applying directional filters to detect edges

高通的滤波器一般用来检测变化比较大的区域，这里通过sobel函数，用于图像的边缘检测。

{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    using namespace std;

    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png", 0);
        cv::imshow("Original Image", image);


        cv::Mat sobelX, sobelY;
        cv::Sobel(image, sobelX, CV_8U, 1, 0, 3, 0.4, 128);
        cv::imshow("SobelX Image", sobelX);

        cv::Sobel(image, sobelY, CV_8U, 0, 1, 3, 0.4, 128);
        cv::imshow("SobelY Image", sobelY);

        // Compute norm of Sobel
        cv::Sobel(image, sobelX, CV_16S, 1, 0);
        cv::Sobel(image, sobelY, CV_16S, 0, 1);
        cv::Mat sobel;
        // compute the L1 norm
        sobel = abs(sobelX)+abs(sobelY);

        // Find Sobel max value
        double sobmin, sobmax;
        cv::minMaxLoc(sobel, &sobmin, &sobmax);
        // Conversion to 8-bit image
        // -alpha*sobel + 255
        cv::Mat sobelImage;
        sobel.convertTo(sobelImage,CV_8U, -255./sobmax, 255);
        cv::imshow("Sobel Image", sobelImage);

        // Binary Sobel Image(low)
        cv::Mat sobeThreshold;
        cv::threshold(sobelImage, sobeThreshold, 230, 255, cv::THRESH_BINARY);
        cv::imshow("Binary Sobel Image(low)", sobeThreshold);

        cv::waitKey();
        return 0;
    }


{% endcodeblock %}

输出：
![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052505.png)


##### band-pass filter

如果我们先应用高斯滤波器去除高频的部分，再用sobel filter去除低频的部分，那么我们就得到了一个band-filter. 我们只要在上面程序的开头加上一个高斯滤波即可查看效果：


`    cv::GaussianBlur(image, image, cv::Size(5,5), 1.5);
`


输出：
![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052506.png)




##### Computing the Laplacian of an image


ps:这个公式推导不是很懂，所以暂时只是会用...

关于Laplacian:


>The Laplacian is another high-pass linear filter that is based on the computation of the image derivatives. As it will be explained, it computes second-order derivatives to measure the curvature of the image function.

关于LOG：

> Since these larger kernels are computed using the second derivatives of the Gaussian function, the corresponding operator is often called Laplacian of Gaussian (LoG)

由于高斯-拉普拉斯算子形状像一个草帽，所以又被称为“墨西哥草帽”



注意，拉氏算子是一种二阶导数算子，对图像中的噪声相对敏感，检测的边缘没有方向信息。因此，拉普拉斯算子很少直接用于检测边缘，而主要用于已知边缘像素后，确定图像的名区还是暗区。


关于DOG：

>. Now, if we subtract the two images that result from the filtering of an image by two Gaussian filters of different bandwidths, then the resulting image will be composed of those higher frequencies that one filter has preserved, and not the other. This operation is called Difference of Gaussians (DoG)


{% codeblock lang:cpp %}

    #include <cv.h>
    #include <opencv2/imgcodecs.hpp>
    #include <opencv/cv.hpp>
    #include <iostream>
    using namespace std;


    class LaplacianZC{
    private:
        // laplacina
        cv::Mat laplace;
        // Aperture size of the laplacian kernel
        int aperture;
    public:
        LaplacianZC():aperture(3){}

        // Set the aperture size of the kernel
        void setAperture(int a){
            aperture = a;
        }

        // Compute the floating point Laplacian
        cv::Mat computeLaplacian(const cv::Mat& image){
            // Compute Laplacian
            cv::Laplacian(image, laplace, CV_32F, aperture);
            return laplace;
        }

        // Get the Laplacian result in 8-bits image
        // zero corresponds to gray level 128
        // if no scale is provide, then the max value will be
        // scaled to intensity 255
        // You must call cimputeLaplacianImage before calling this
        cv::Mat getLaplacianImage(double scale=-1.0){
            if(scale<0){
                double lapmin, lapmax;
                // get min and max laplacian values
                cv::minMaxLoc(laplace, &lapmin, &lapmax);
                // scale the laplacian to 127
                scale = 127/std::max(-lapmin, lapmax);
            }
            // produce gray-level image
            cv::Mat laplaceImage;
            laplace.convertTo(laplaceImage, CV_8U, scale, 128);
            return laplaceImage;
        }

        //Get a binary image of the zero-crossings
        // laplacian image should be CV_32F
        cv::Mat getZeroCrossings(cv::Mat laplace){
            // threshold at 0
            // negtive values in black
            // positive values in white
            cv::Mat signImage;
            cv::threshold(laplace, signImage, 0, 255, cv::THRESH_BINARY);

            // convert the +/- image into CV_8U
            cv::Mat binary;
            signImage.convertTo(binary, CV_8U);
            // dilate the binary image of +/- regions
            cv::Mat dilated;
            cv::dilate(binary, dilated, cv::Mat());

            // return the zero-crossing contours
            return dilated-binary;
        }
    };



    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png", 0);
        cv::imshow("Original", image);
        // Compute Laplcian using LaplacianZC class
        LaplacianZC laplacian;
        laplacian.setAperture(7); // 7x7 laplacian
        cv::Mat flap = laplacian.computeLaplacian(image);

        cv::Mat laplace;
        laplace = laplacian.getLaplacianImage();
        cv::imshow("Laplacian Image 7x7", laplace);


        // binary image of zero-crossing
        cv::Mat Binary;
        Binary = laplacian.getZeroCrossings(flap);
        cv::imshow("Binary", Binary);


        // DoG
        cv::Mat gauss20, gauss22;
        cv::GaussianBlur(image, gauss20, cv::Size(), 2.0);
        cv::GaussianBlur(image, gauss22, cv::Size(), 2.2);

        // compute a difference of Gaussians
        cv::Mat dog;
        cv::subtract(gauss22, gauss20, dog, cv::Mat(), CV_32F);

        // compute the zero-crossings of DoG
        cv::Mat zeros;
        zeros = laplacian.getZeroCrossings(dog);
        cv::imshow("DoG",zeros);

        cv::waitKey();
        return 0;
    }

{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Selection_052508.png)



#### Reference

*《数字图像处理》高教出版社*











