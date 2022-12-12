---
title: HOG+SVM&Pedestrian Detection
copyright: true
date: 2017-08-17 15:24:18
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

#### Overview

用了大概几个月的时间看完了*OpenCV 3 Computer Vision Application Programming Cookbook - Third Edition*， 也对前7章的基本操作部分在小站上进行了相应的总结。这里是最后一章实战的DEMO部分的代码，算作对本书学习的一个结尾吧。前面也看了几本相关的书，不过都和这本书差远了，无论理论和算法的讲解还是代码的水平都堪称一流，真心推荐~


#### Code

##### 关于HOG的可视化

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/imgproc.hpp>
    #include "opencv2/imgcodecs.hpp"
    #include <opencv2/highgui.hpp>
    #include <opencv2/ml.hpp>
    #include <opencv2/opencv.hpp>

    using namespace cv;
    using namespace std;

    // draw one HOG over one cell
    void drawHOG(std::vector<float>::const_iterator hog, // iterator to the HOG
            int numberOfBins,  // number of bins inHOG
            cv::Mat & image,  // image of the cell
            float scale = 1.0)
    {
        const float PI = 3.1415927;
        float binStep = PI/numberOfBins;
        float maxLength = image.rows;
        float cx = image.cols/2;
        float cy = image.rows/2;

        // for each bin
        for(int bin=0; bin<numberOfBins; bin++){
            // bin orientation
            float angle = bin*binStep;
            float dirX = cos(angle);
            float dirY = sin(angle);
            // length of line proportion to bin size
            // 这里感觉是为了可视化的时候区分不同的bin,不是很明白...
            float length = 0.5*maxLength**(hog+bin);

            // drawing the line
            float x1 = cx - dirX * length * scale;
            float y1 = cy - dirY * length * scale;
            float x2 = cx + dirX * length * scale;
            float y2 = cy + dirY * length * scale;
            cv::line(image, cv::Point(x1, y1), cv::Point(x2, y2),
            CV_RGB(255, 255, 255), 1.5);

        }
    }

    // Draw HOG over an image
    void drawHOGDescriptors(const cv::Mat &image, // the input image
        cv::Mat &hogImage, // the resulting hog image
            cv::Size cellSize,  // size of each cell
            int nBins
        ){
        // block size is image size
        // image.cols = 391
        // (image.cols/cellSize.width)*cellSize.width = 384
        // 下面这里先除后乘，是为了保证在不能恰好被cell均分的情况
        cv::HOGDescriptor hog(cv::Size((image.cols/cellSize.width)*cellSize.width, (image.rows/cellSize.height)*cellSize.height),
                              cv::Size((image.cols/cellSize.width)*cellSize.width, (image.rows/cellSize.height)*cellSize.height),
                              cellSize, cellSize, nBins);

        // compute HOG
        std::vector<float>descriptors;
        hog.compute(image, descriptors);

        float scale = 2.0 / *std::max_element(descriptors.begin(), descriptors.end());
        hogImage.create(image.rows, image.cols, CV_8U);
        cv::Mat temp;
        std::vector<float>::const_iterator itDesc = descriptors.begin();
        for(int i=0; i<image.rows/cellSize.height; i++){
            for(int j=0; j < image.cols/cellSize.width; j++){
                // draw each cell
                temp = hogImage(cv::Rect(j*cellSize.width, i*cellSize.height, cellSize.width, cellSize.height));
                drawHOG(itDesc, nBins, temp, scale);
                itDesc += nBins;

            }
        }
    }

    int main() {
        cv::Mat image = imread("/home/shensir/Documents/MyPrograming/Cpp/MyCV/data/girl.png", 0);
        cv::imshow("Original image", image);

        cv::HOGDescriptor hog(cv::Size((image.cols / 16) * 16, (image.rows / 16) * 16), // size of the window
                              cv::Size(16, 16),  // block size
                              cv::Size(16, 16),  // block stride
                              cv::Size(4, 4),  // cell size
                              9); // num of bins

        std::vector<float> descriptor;

        // Draw  a representation of HOG cells
        cv::Mat hogImage = image.clone();
        drawHOGDescriptors(image, hogImage, cv::Size(16, 16), 9);
        cv::imshow("HOG image", hogImage);

        waitKey(0);
    }

{% endcodeblock %}

输出：

![](http://datahonor-1252464519.costj.myqcloud.com/201708/Original%20image_081704.png)
![](http://datahonor-1252464519.costj.myqcloud.com/201708/HOG%20image_081705.png)


##### HOG+SVM检测警示牌

这里是自己完成训练到预测全部过程的，之前看到[这个](http://blog.csdn.net/masibuaa/article/details/16105073)，但是是OpenCV2.4的，尝试改成3的没成功，很多函数的用法已经变了，不过对比看还是下面这种逻辑更为清晰一些。

{% codeblock lang:cpp %}

    #include <iostream>
    #include <opencv2/core.hpp>
    #include <opencv2/imgproc.hpp>
    #include "opencv2/imgcodecs.hpp"
    #include <opencv2/highgui.hpp>
    #include <opencv2/ml.hpp>
    #include <opencv2/opencv.hpp>

    using namespace cv;
    using namespace std;

    int main() {

        // generate the filename
        std::vector<std::string> imgs;
        std::string prefix = "/home/shensir/Documents/MyPrograming/Cpp/b"
                "ooks/CV/1-ing/OpenCV3ComputerVisionApplicationProgrammingCookbook"
                "ThirdEdition_Code/images/stopSamples/stop";
        std::string ext = ".png";
        // loading 8 positive samples
        std::vector<cv::Mat> positives;
        for (int i = 0; i < 8; i++) {
            std::string name(prefix);
            std::ostringstream ss;
            ss << std::setfill('0') << std::setw(2) << i;
            name += ss.str();
            name += ext;
            positives.push_back(imread(name, cv::IMREAD_GRAYSCALE));
        }

        // the first 8 positive samples
        cv::Mat posSamples(2 * positives[0].rows, 4 * positives[0].cols, CV_8U);
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 4; j++) {
                positives[i * 4 + j].copyTo(posSamples(cv::Rect(j * positives[i * 4 + j].cols,
                                                                i * positives[i * 4 + j].rows,
                                                                positives[i * 4 + j].cols,
                                                                positives[i * 4 + j].rows)));
            }
        }
        cv::imshow("Positive samples", posSamples);

        // laoding 8 negative samples
        std::string nprefix = "/home/shensir/Documents/MyPrograming/Cpp/books/CV/1-ing"
                "/OpenCV3ComputerVisionApplicationProgrammingCookbookThirdEdition_Code"
                "/images/stopSamples/neg";
        std::vector<cv::Mat> negatives;
        for (long i = 0; i < 8; i++) {
            std::string name(nprefix);
            std::ostringstream ss;
            ss << std::setfill('0') << std::setw(2) << i;
            name += ss.str();
            name += ext;
            negatives.push_back(cv::imread(name, cv::IMREAD_GRAYSCALE));
        }

        // the first 8 negative  samples
        cv::Mat negSamples(2 * negatives[0].rows, 4 * negatives[0].cols, CV_8U);
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 4; j++) {
                negatives[i * 4 + j].copyTo(
                        negSamples(cv::Rect(j * negatives[4 * i + j].cols,
                                            i * negatives[4 * i + j].rows, negatives[4 * i + j].cols,
                                            negatives[4 * i + j].rows)));

            }
        }
        cv::imshow("Negative Samples", negSamples);

        // The HOG descriptor for stop sign detection
        cv::HOGDescriptor hogDesc(positives[0].size(), // size of the window
                                  cv::Size(8, 8),  // block size
                                  cv::Size(4, 4),  // block stride
                                  cv::Size(4, 4),  // cell size
                                  9  // number of bins
        );

        // compute first descriptor
        std::vector<float> desc;
        hogDesc.compute(positives[0], desc);
        std::cout << "Positive sample size: " << positives[0].rows << "x" << positives[0].cols << endl;
        std::cout << "HOG descriptor size: " << desc.size() << std::endl;

        // the matrix of sample descriptors
        int featureSize = desc.size();
        int numberOfSamples = positives.size() + negatives.size();
        // create the matrix that will contain the sample HOG
        cv::Mat samples(numberOfSamples, featureSize, CV_32FC1);

        // fill first row with first descriptor
        for (int i = 0; i < featureSize; i++)
            samples.ptr<float>(0)[i] = desc[i];

        // compute descriptor of the positive samples
        for (int j = 1; j < positives.size(); j++) {
            hogDesc.compute(positives[j], desc);
            // fill the next row with current descriptor
            for (int i = 0; i < featureSize; i++) {
                samples.ptr<float>(j)[i] = desc[i];
            }
        }

        // compute descriptor of the negative samples
        for (int j = 0; j < negatives.size(); j++) {
            hogDesc.compute(negatives[j], desc);
            // fill the next row with current descriptor
            for (int i = 0; i < featureSize; i++) {
                samples.ptr<float>(j + positives.size())[i] = desc[i];
            }
        }

        // create the labels
        cv::Mat labels(numberOfSamples, 1, CV_32SC1);
        // labels of positive samples
        labels.rowRange(0, positives.size()) = 1.0;
        // labels of negative sampels
        labels.rowRange(positives.size(), numberOfSamples) = -1.0;

        // create SVM classifier
        cv::Ptr<cv::ml::SVM> svm = cv::ml::SVM::create();
        svm->setType(cv::ml::SVM::C_SVC);
        svm->setKernel(cv::ml::SVM::LINEAR);

        // prepare the training data
        cv::Ptr<cv::ml::TrainData> trainingData =
                cv::ml::TrainData::create(samples, cv::ml::SampleTypes::ROW_SAMPLE, labels);
        // SVM training
        svm->train(trainingData);
        // 将训练好的SVM模型保存为XML文件
        svm->save("STOP_LOGO.xml");

        // 测试
        cv::Mat queries(4, featureSize, CV_32FC1);

        // fill the rows with query descriptor
        hogDesc.compute(cv::imread("/home/shensir/Documents/MyPrograming/Cpp/bo"
                                           "oks/CV/1-ing/OpenCV3ComputerVisionApplication"
                                           "ProgrammingCookbookThirdEdition_Code/images/stopSamples/stop08.png", 0), desc);
        for (int i = 0; i < featureSize; i++)
            queries.ptr<float>(0)[i] = desc[i];


        hogDesc.compute(cv::imread("/home/shensir/Documents/MyPrograming/Cpp/boo"
                                           "ks/CV/1-ing/OpenCV3ComputerVisionApplicationProgramm"
                                           "ingCookbookThirdEdition_Code/images/stopSamples/stop09.png", 0), desc);
        for (int i = 0; i < featureSize; i++)
            queries.ptr<float>(1)[i] = desc[i];

        hogDesc.compute(cv::imread("/home/shensir/Documents/MyPrograming/"
                                           "Cpp/books/CV/1-ing/OpenCV3ComputerVisionApplicationPro"
                                           "grammingCookbookThirdEdition_Code/images/stopSamples/neg08.png", 0), desc);
        for (int i = 0; i < featureSize; i++)
            queries.ptr<float>(2)[i] = desc[i];

        hogDesc.compute(cv::imread("/home/shensir/Documents/MyPrograming/Cpp/books/"
                                           "CV/1-ing/OpenCV3ComputerVisionApplicationP"
                                           "rogrammingCookbookThirdEdition_Code/images/stopSamples/neg09.png", 0), desc);
        for (int i = 0; i < featureSize; i++)
            queries.ptr<float>(3)[i] = desc[i];

        cv::Mat predictions;
        svm->predict(queries, predictions);
        for(int i=0; i<4; i++){
            cout << "query: " << i << ": " <<
                                           ((predictions.at<float>(i,0) < 0.0) ?
                                           "Negative" : "Positive") << endl;
        }
        waitKey(0);
        return 0;

    }


{% endcodeblock %}

输出：

    Positive sample size: 64x64
    HOG descriptor size: 8100
    query: 0: Positive
    query: 1: Positive
    query: 2: Negative
    query: 3: Negative


![](http://datahonor-1252464519.costj.myqcloud.com/201708/Positive%20samples_081707.png)

![](http://datahonor-1252464519.costj.myqcloud.com/201708/Negative%20Samples_081706.png)

##### Pedestrian Detection简化版


同样是用的OpenCV自带的行人检测器，这里只是一个针对照片的简化版本，[这里](http://datahonor.com/2017/08/17/Pedestrain-Detection/)是完整版。

{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include "grayhistogram.h"
    #include "matplotlibcpp.h"


    using namespace std;
    using namespace cv;


    int main() {
        // People detection
        cv::Mat myImage = imread("/home/shensir/Documents/MyPrograming/Cpp/MyCV/data/person.jpg", 0);
        // create the detector
        std::vector<cv::Rect> peoples;
        cv::HOGDescriptor peopleHog;
        peopleHog.setSVMDetector(cv::HOGDescriptor::getDefaultPeopleDetector());
        // detect people on an image
        peopleHog.detectMultiScale(myImage,
                                   peoples, 0, cv::Size(4, 4), cv::Size(32, 32), 1.1, 2);
        // draw detections on image
        for (int i = 0; i < peoples.size(); i++)
            cv::rectangle(myImage, peoples[i], cv::Scalar(0, 255, 0), 2);

        cv::imshow("People detection", myImage);
        cv::waitKey(0);
        return 0;
    }


{% endcodeblock %}

输出：

![](http://datahonor-1252464519.costj.myqcloud.com/201708/People%20detection_081708.png)


#### ...

马上大三了，课比较多，估计没时间再捣鼓这些纯粹为了兴趣的东西了orz...嗯，不过毕竟看了快一年，也算是有点基础了解吧，之后还有机会玩这个也会轻松一些了。



