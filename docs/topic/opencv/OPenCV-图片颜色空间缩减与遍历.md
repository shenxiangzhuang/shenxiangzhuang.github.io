---
title: OpenCV系列笔记六：图片颜色空间缩减与遍历
date: 2017-04-09 09:43:10
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

##### 概览
记录下遍历图片的以及缩减图片颜色空间的几种办法，主要是记录下关于位运算进行像素的按位操作。
首先我们直观上看下图片的存储格式：
- [ ] 灰度图像
-![](http://img.blog.csdn.net/20160425221258898?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

- [ ] 彩色图像
![](http://img.blog.csdn.net/20160425221306945?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

##### 几种遍历的方法


###### 利用指针进行
{% codeblock lang:cpp %}

    void colorReducePtr(cv::Mat image, int div=64){
        int nl = image.rows; // number of lines
        // total number or element per ;ine
        int nc = image.cols * image.channels();

        for(int j=0; j<nl; j++){
            //get the address of row j
            uchar* data = image.ptr<uchar>(j);
            for(int i=0;i<nc;i++){
                // process each pixel=======================

                data[i] = data[i]/div*div + div/2;
                // OR in this way
                //data[i] = (data[i]/div)*div + div/2;

                //end of pixel processing=====================
            }//end of line
        }
    }

    // 理解reduction核心算法,这里假设div为10.
    // 去除‘余数’， 拉向中心
    // 11  --> data[i]/div*div + div/2 --> 10 + 5 --> 15
    // 16  --> data[i]/div*div + div/2 --> 10 + 5 --> 15



    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");

        // 使用Clone,保护原来图像不受损坏
        cv::Mat imageClone = image.clone();
        colorReducePtr(imageClone, 64);
        cv::namedWindow("Result");
        cv::imshow("Result", imageClone);
        cv::waitKey(0);

        return 0;
    }

{% endcodeblock %}



###### 位运算


{% codeblock lang:cpp %}

    void colorReduceBit(cv::Mat &image, int div=64){
        int nl = image.rows;
        int nc = image.cols*image.channels();
        if(image.isContinuous()){
            nc = nc*nl;
            nl = 1;
        }

        int n = static_cast<int>(
                log(static_cast<double>(div))/log(2.0)+0.5);

        uchar mask = 0xFF<<n;
        uchar div2 = div>>1;
        for(int j=0;j<nl;j++){
            uchar* data = image.ptr<uchar>(j);
            for(int i=0;i<nc;i++){
                *data &= mask;   //a &= b; set a to a & b
                *data++ += div2;
            }
        }

    }



    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");

        colorReduceBit(image);
        cv::namedWindow("Result");
        cv::imshow("Result", image);
        cv::waitKey(0);

        return 0;
    }

{% endcodeblock %}

几点解释：

>0xFF<<n 是为左移运算，这里简单说就是1111 1111(0xFF的二进制表示)整体向左移动n个长度，右边空出部分用0补充。假设n=4,则结果为1111 0000


>*data &= mask等价于*data = (*data & mask),即先进行按位和再赋值给*data, 例如说*data = 11001100,那么根据上面叙述，n=4时mask=1111 0000 ，那么取按位和之后得到，1100 0000
更直观地看，在这里div=64, 那么n=6, mask = 1100 0000, 也就是说，在按位的时候，每个像素点的二进制值的后六位将会被重置为0，只保留前两位。而1100 0000 = 192, 容易算出63&192 = 0, 64&192 = 64, 127&192=64, 128&192=128...很清楚的可以看出，0~255被分割为4段，每段单位为64。

>*data++ += div2;的运算等价于*data += div/2; data++[指针移动]，可以如下测试得到。


{% codeblock lang:cpp %}

    int main(){
        int a = 1;
        int * p = &a;

        std::cout<<p<<'\n';
        *p++ += 1;
        std::cout<<a<<'\n';
        std::cout<<p;

        return 0;
    }

{% endcodeblock %}

输出：
>0x7ffe0d69780c
2
0x7ffe0d697810
可以看到，a的值恰好增加了1，且指针p的位置增加了4,即一个单位int的长度。

###### Iterators

{% codeblock lang:cpp %}

    // Iterators
    void colorReduce(cv::Mat image, int div=64){
        // div must be a power of 2
        int n = static_cast<int>(
                log(static_cast<double>(div))/log(2.0)+0.5);
        // mask used to round the pixel value
        uchar mask = 0xFF<<n;
        uchar div2 = div>>1;

        //get iterators
        cv::Mat_<cv::Vec3b>::iterator it = image.begin<cv::Vec3b>();
        cv::Mat_<cv::Vec3b>::iterator itend = image.end<cv::Vec3b>();

        //scan all pixels
        for(;it!=itend;++it){
            (*it)[0] &= mask;
            (*it)[0] += div2;

            (*it)[1] &= mask;
            (*it)[1] += div2;

            (*it)[2] &= mask;
            (*it)[2] += div2;


        }
    }


    int main(){
        cv::Mat image = cv::imread("/home/shensir/Documents/MyPrograming/Cpp/Clions/data/lake.png");

        colorReduce(image);
        cv::namedWindow("Result");
        cv::imshow("Result", image);
        cv::waitKey(0);

        return 0;
    }


{% endcodeblock %}


##### 时间效率比较
这里，我们综合上面的三种方法进行时间效率的比较

{% codeblock lang:cpp %}

    // get run time [学习函数作为参数的用法]
    double getTime(void(*pfunc)(cv::Mat,int), cv::Mat img,int div){
        const int64 start = cv::getTickCount();
        pfunc(img, 64);
        double duration = (cv::getTickCount()-start)/cv::getTickFrequency();
        std::cout<<duration<<'\n';
        return duration;

    }


    // 指针，除法
    void colorReducePtr(cv::Mat image, int div=64){
        int nl = image.rows; // number of lines
        // total number or element per ;ine
        int nc = image.cols * image.channels();

        for(int j=0; j<nl; j++){
            // get the address of row j
            uchar* data = image.ptr<uchar>(j);
            for(int i=0;i<nc;i++){
                // process each pixel=======================

                data[i] = data[i]/div*div + div/2;
                // OR in this way
                //data[i] = (data[i]/div)*div + div/2;

                //end of pixel processing=====================
            }//end of line
        }
    }


    //位运算

    void colorReduceBit(cv::Mat image, int div=64){
        int nl = image.rows;
        int nc = image.cols*image.channels();
        if(image.isContinuous()){
            nc = nc*nl;
            nl = 1;
        }

        // 四舍五入取指数
        int n = static_cast<int>(
                log(static_cast<double>(div))/log(2.0)+0.5);

        uchar mask = 0xFF<<n;
        uchar div2 = div>>1;
        for(int j=0;j<nl;j++){
            uchar* data = image.ptr<uchar>(j);
            for(int i=0;i<nc;i++){
                // 下面这步等同于data[i] = data[i]/div*div
                *data &= mask;   //a &= b; set a to a & b
                *data++ += div2;  // *data += div/2; data++[指针移动]
            }
        }

    }


    //Iterator

    void colorReduceItr(cv::Mat image, int div=64){
        // div must be a power of 2
        int n = static_cast<int>(
                log(static_cast<double>(div))/log(2.0)+0.5);
        // mask used to round the pixel value
        uchar mask = 0xFF<<n;
        uchar div2 = div>>1;

        //get iterators
        cv::Mat_<cv::Vec3b>::iterator it = image.begin<cv::Vec3b>();
        cv::Mat_<cv::Vec3b>::iterator itend = image.end<cv::Vec3b>();

        //scan all pixels
        for(;it!=itend;++it){
            (*it)[0] &= mask;
            (*it)[0] += div2;

            (*it)[1] &= mask;
            (*it)[1] += div2;

            (*it)[2] &= mask;
            (*it)[2] += div2;


        }
    }



    int main(){
        cv::Mat image = cv::imread(".../lake.png");
        cv::Mat imagePtr(image), imageBit(image), imageItr(image);

        // Ptr
        std::cout<<"colorReducePtr=====\nTime: ";
        getTime(colorReducePtr, imagePtr, 64);

        // Bit
        std::cout<<"colorReduceBit=====\nTime: ";
        getTime(colorReduceBit, imageBit, 64);

        // Itr
        std::cout<<"colorReduceItr=====\nTime: ";
        getTime(colorReduceItr, imageItr, 64);


        cv::namedWindow("Result");
        cv::imshow("Result", image);
        cv::waitKey(0);

        return 0;
    }

{% endcodeblock %}

输出：
```
colorReducePtr=====
Time: 0.00144757
colorReduceBit=====
Time: 0.000849209
colorReduceItr=====
Time: 0.00298409
```
可以明显看到位运算的高效




##### 参考
[OpenCv学习笔记(六)](http://www.lai18.com/content/10109307.html)
[Bitwise operation](https://en.wikipedia.org/wiki/Bitwise_operation#Bit_shifts)


