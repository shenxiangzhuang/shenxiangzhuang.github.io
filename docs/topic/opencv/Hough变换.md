---
title: Hough变换
copyright: true
date: 2017-05-28 11:13:36
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

#### Overview

关于hough变换，确实被它的奇妙思想震撼到。

>图像空间中共线的点对应参数空间共点的线。




于是就尝试去实现这个变换.


#### Code

##### Python
先用Python写了个demo，效果还是可以的，但是写的略显粗糙...

{% codeblock lang:python %}

    #!/usr/bin/env python
    # coding=utf-8

    import numpy as np
    import matplotlib.pyplot as plt
    import pandas as pd
    import operator



    # 获取原空间的点
    def get_raw_points():
        points = np.array([[1,1], [2,2], [3,3], [1,2], [2,1]])
        return points

    # 获取原空间点对应的线
    def get_line(points):
        fig = plt.figure()
        para_points = {}
        for point in points:
            a = point[0]
            b = point[1]

            para_X = np.linspace(-5, 5, 101)
            para_Y = a * para_X + b
            plt.plot(para_X, para_Y)

            for i in range(len(para_X)):
                para_x = np.round(para_X[i], 3)
                para_y = np.round(para_Y[i], 3)
                # para_points.append([para_x, para_y])
                para_str = str(np.round([para_x, para_y], 3))
                if para_str not in para_points.keys():
                    para_points[para_str] = 1
                else:
                    para_points[para_str] += 1
        plt.legend(['(1,1)', '(2,2)', '(3,3)', '(1,2)', '(2,1)'])
        # 按照交点个数排序
        sorted_para_points = sorted(para_points.items(), key=operator.itemgetter(1))

        # 取其中的交点,这里就简短地从结果看下，直接切片了
        # 正规是根据点的value来取的，也不麻烦。
        more_points = sorted_para_points[-6:]

        # The point that we want to find!
        # 这里可以用正则...前面写的太粗糙了，这里就取点比较麻烦了
        # 绿色点标记交点
        plt.plot(-1, 0, 'go', linewidth=3)
        # plt.show()

        return more_points

    # 在hough变换后找到直线[a,b]后，在原空间画出此直线
    def plot_point_line():
        fig = plt.figure()
        points = get_raw_points()
        plt.plot(points[:,0], points[:,1], 'o')
        # [-1,0]--> 0=-a+b --> b=a --> y=x

        X = np.linspace(-2,5,101)
        Y= X
        plt.plot(X, Y, 'g')
        plt.show()

    if __name__=='__main__':
        points = get_raw_points()
        more_points = get_line(points)
        plot_point_line()


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Figure%201_052801.png)
![](http://blog-1252464519.costj.myqcloud.com/1705/Figure%202_052802.png)


##### Cpp

在用Python写出demo后，想着拿一张真实的图像来试试，结果没成功...也没有找出原因。这里贴上代码，请看出错误的大佬指点...


{% codeblock lang:cpp %}

    #include "opencv2/highgui.hpp"
    #include "opencv2/imgproc.hpp"
    #include "grayhistogram.h"
    #include "matplotlibcpp.h"
    
    using namespace std;
    using namespace cv;
    namespace plt = matplotlibcpp;
    #define PI 3.1415926


    vector<cv::Point> PointFindPtr(cv::Mat image){
        vector<cv::Point> Points;

        int nl = image.rows; // number of lines
        // total number or element per ;ine
        int nc = image.cols * image.channels();
        for(int j=0; j<nl; j++){
            //get the address of row j
            uchar* data = image.ptr<uchar>(j);
            for(int i=0;i<nc;i++){
                // process each pixel=======================
                if (data[i] == 255)
                    Points.push_back(cv::Point(j, i));
                // OR in this way
                //data[i] = (data[i]/div)*div + div/2;
                //end of pixel processing=====================
            }//end of line
        }
        return Points;
    }


    int main(){

        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/road.jpg", 0);
        cv::imshow("Original Image", image);

        // Apply Canny algotithm
        cv::Mat contours;
        cv::Canny(image, contours, 125, 350);
        cv::imshow("Contours", contours);

        vector<cv::Point> Points = PointFindPtr(contours);

        int n = Points.size();
        cout<<n<<endl;
        for(int i=0; i<n; i++){
            Point point_i = Points[i];
            int a = point_i.x;
            int b = point_i.y;
            cout<<a<<" "<<b<<endl;

            vector<double> x(360), y(360);
            for(int i=0; i<360; i++){
                x.at(i) = 2*PI/i-PI;
                y.at(i) = a*cos(2*PI/i)+b*sin(2*PI/i);
            }
            plt::plot(x,y);
        }
        plt::show();

        waitKey(0);

        return 0;
    }


{% endcodeblock %}

输出：

![](http://blog-1252464519.costj.myqcloud.com/1705/Figure%201_052803.png)

参数空间所有的线交在一点说明图像中，所有的点共线...很明显是错误的...

这里，matplotlibcpp的安装，参考[gothub项目地址](https://github.com/lava/matplotlib-cpp),记得安装后将matplotlibcpp.h文件放到自己的工程里面。且这里在cmake做了改动才可以，使用的，
`include_directories(Clions ${PYTHON_INCLUDE_DIRS})`， 
而不是`target_include_directories(Clions ${PYTHON_INCLUDE_DIRS})`。


##### Cpp调用Python

上面是对amtplotlib进行了包装，然后直接在Cpp使用。除此之外，我们还有另一个办法在Cpp中使用Python。

{% codeblock lang:cpp %}

    #include <python2.7/Python.h>
    #include "pythonrun.h"

    int main(){

        Py_Initialize();
        PyRun_SimpleString("import pylab");
        PyRun_SimpleString("pylab.plot(range(5))");
        PyRun_SimpleString("pylab.show()");
        Py_Exit(0);

        return 0;
    }


{% endcodeblock %}

注意，这里的头文件：

    #include <python2.7/Python.h>
    #include "pythonrun.h"

在测试的时候，直接写Python.h是找不到的，而且没有下面的pythonrun.h也是不行的。


#### Reference

[字典按键值排序](https://stackoverflow.com/questions/613183/sort-a-python-dictionary-by-value)

[Python.h](https://stackoverflow.com/questions/8024737/c-interface-for-matplotlib)

[matplotlibcpp](https://github.com/lava/matplotlib-cpp)


