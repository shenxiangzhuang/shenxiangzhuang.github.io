---
title: OpenCV获取安卓手机摄像头的视频流
copyright: true
date: 2017-07-22 17:53:58
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

最近又拿来*OpenCV 3 Computer Vision Application Programming Cookbook*看，上学期学到第8章就停下来在这里写笔记总结了。略过了三维重建那章，看到了视频的处理，其实这个基本的操作基本会了。然后觉着电脑摄像头像素太差...突然想到能不能用下手机的摄像头:-)于是就搜了下，还真有...方法也挺简单的。



首先到Google play（当然有墙了orz...）下载[IP Webcam](https://play.google.com/store/apps/details?id=com.pas.webcam&hl=en).然后把手机和电脑连到同一个WIFI下，手机端开启视频流服务。根据手机端的提示，我们到http://192.168.1.106:8080/ 即可看到手机摄像头的实时视频。


但是呢，我们获取的视频能够实时地被处理才有意义。所以，我们可以直接导入到OpenCV内，方便进一步的处理。下面给出两种办法，第一种是用了curl库，略显复杂：


{% codeblock lang:cpp %}

    #include <stdio.h>
    #include "curl/curl.h"
    #include <sstream>
    #include <iostream>
    #include <vector>
    #include <opencv2/opencv.hpp>


    size_t write_data(char *ptr, size_t size, size_t nmemb, void *userdata) {
        std::ostringstream *stream = (std::ostringstream*)userdata;
        size_t count = size * nmemb;
        stream->write(ptr, count);
        return count;
    }
    //function to retrieve the image as Cv::Mat data type
    cv::Mat curlImg()
    {
        CURL *curl;
        CURLcode res;
        std::ostringstream stream;
        curl = curl_easy_init();
        curl_easy_setopt(curl, CURLOPT_URL, "http://192.168.1.106:8080/shot.jpg"); //the JPEG Frame url  //
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data); // pass the writefunction
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &stream); // pass the stream ptr when the writefunction is called
        res = curl_easy_perform(curl); // start curl
        std::string output = stream.str(); // convert the stream into a string
        curl_easy_cleanup(curl); // cleanup
        std::vector<char> data = std::vector<char>( output.begin(), output.end() ); //convert string into a vector
        cv::Mat data_mat = cv::Mat(data); // create the cv::Mat datatype from the vector
        cv::Mat image = cv::imdecode(data_mat,1); //read an image from memory buffer
        return image;
    }
    int main(void)
    {
        cv::namedWindow( "Image output", CV_WINDOW_AUTOSIZE );
        double scale=0.5;
        while(1)
        {
            cv::Mat image = curlImg(); // get the image frame
            //可以不resize，不过电脑端会图像显示很大
            cv::Size dsize = cv::Size(image.cols*scale,image.rows*scale);
            cv::Mat image2 = cv::Mat(dsize,CV_32S);
            resize(image, image2,dsize);
            cv::imshow("Image output",image2); //display image frame
            char c = cvWaitKey(33); // sleep for 33ms or till a key is pressed (put more then ur camera framerate mine is 30ms)
            if ( c == 27 ) break; // break if ESC is pressed
        }
        cv::destroyWindow("Image output");
    }

{% endcodeblock %}


还有一种就比较简单，直接利用OpenCV自带的处理视频流的函数即可：

{% codeblock lang:cpp %}

    #include <string>
    #include <iostream>
    #include <sstream>
    #include <opencv2/core.hpp>
    #include <opencv2/imgproc.hpp>
    #include <opencv2/highgui.hpp>

    void MCamera(){
        cv::VideoCapture capture;
        capture.open("http://192.168.1.106:8080/video");
        // Check if video successfully opened
        if(capture.isOpened())
            std::cout << "OK!" << std::endl;

        // Get the frame rate
        double rate = capture.get(CV_CAP_PROP_FPS);

        bool stop(false);
        cv::Mat frame;
        cv::namedWindow("Extracted Frame");

        // Delay between each frame in ms
        // corresponds to video frame rate
        int delay = 1000/rate;
        std::cout << "rate: " << rate << std::endl;
        std::cout << "1/rate: " << 1/rate << std::endl;


        // for all frames in video
        while(!stop){
            // read next frame if any
            if (!capture.read(frame))
                break;
            cv::imshow("Extracted Frame", frame);
            // introduce a delay
            // or press key to stop
            if(cv::waitKey(delay)>=0)
                stop=true;
        }

        // Close the video file
        capture.release();
    }


    int main(){
        MCamera();
        return 0;
    }


{% endcodeblock %}

这种方法就比较直观，也容易使用。这里我们是直接获使用和MJPEG URL进行视频流的获取，除此之外我们还有其他的请求方式：

>http://192.168.1.106:8080/video 是 MJPEG URL.
http://192.168.1.106:8080/shot.jpg 获取最新一帧
http://192.168.1.106:8080/audio.wav 是WAV格式的音频流
http://192.168.1.106:8080/audio.aac 是AAC格式的音频流（如果硬件支持的话）
http://192.168.1.106:8080/audio.opus 是Opus格式的音频流
http://192.168.1.106:8080/focus 对焦摄像头
http://192.168.1.106:8080/nofocus 释放对焦

更多设置参考 http://192.168.1.106:8080/viewers.html#advanced。


这里两种方法的测试效果都是挺好的，播放都很流畅，几乎没有延迟。


其实ivideon也提供给我们一种不需要连接在同一WIFI下就可以查看安卓视频流的方法，那就是通过ivideon的帐号。在手机端登录，在浏览器也进行登录即可查看，但是没有找到相关的接口可以用Cpp直接请求来获取数据，可能需要自己模拟登录再抓包获取，不过还不会用Cpp写爬虫呢...这个测试的效果也并不太好，比较卡，而且延迟较高。等有时间再看下这个能不能解决吧。



除了使用自己的摄像头之外，网络上也有一些开放的IP Camera （之后我们可以用这些资源做些测试嘛0.0） , 我们可以直接在浏览器访问，OpenCV也为我们提供了很好的接口从网上直接读取视频。

比如这个地址：　`http://150.214.93.55/mjpg/video.mjpg`，　以及　`http://plazacam.studentaffairs.duke.edu/view/view.shtml?id=2862&imagepath=/mjpg/video.mjpg&size=1` 都是可以在浏览器直接看到实时的界面的，前面一种比较简单，像上面一样直接将地址替换即可。但是后面的这个地址是不能直接替换的，根据[这里](https://stackoverflow.com/questions/15584161/ip-camera-and-opencv)我们尝试找到视频的真正地址为`http://plazacam.studentaffairs.duke.edu/mjpg/video.mjpg`,使用这个即可。但是参考的这个答案说：

>one way or the other, opencv seems to insist, that the url must end with ".mjpg" (dot mjpg), so if it doesn't, add a dummy param to it, like : my/fancy/url?type=.mjpg


还好有个seems to insist ... 因为我们前面已经看到了，安卓手机的摄像头的地址并非以`.mjpg`结尾。


暂时先记录下，继续学习CV，等到能较好地识别视频中一些物体时再结合这个看能不能做个小应用玩玩。




参考：

[opencv获取android手机摄像头的视频流 ](http://blog.leanote.com/post/leeyoung/opencv%E8%8E%B7%E5%8F%96android%E6%89%8B%E6%9C%BA%E6%91%84%E5%83%8F%E5%A4%B4%E7%9A%84%E8%A7%86%E9%A2%91%E6%B5%81-2)

[IP camera and OPENCV]()









