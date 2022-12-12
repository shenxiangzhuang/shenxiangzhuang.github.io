---
title: Learning Opencv3学习笔记
date: 2017-04-06 00:44:23
categories:
- Cpp
tags:
- Cpp
- OpenCV
---

###### 关于遍历
再学到P123时，发现书上的代码是无法运行的，先来看下它的写法：
{% codeblock lang:cpp %}

    int sz[3] = {4, 4, 4};
    cv::Mat	m(3, sz, CV_32FC3);		//	A	three-dimensional	array	of	size	4-by-4-by-4
    cv::randu( m, -1.0f, 1.0f);			//	fill	with	random	numbers	from	-1.0	to	1.0
    float max = 0.0f;														//	minimum	possible	value	of	L2	norm
    cv::MatConstIterator<cv::Vec3f> it = m.begin();
    while( it != m.end() ) {
        len2 = (*it)[0]*(*it)[0]+(*it)[1]*(*it)[1]+(*it)[2]*(*it)[2];
        if( len2 > max ) max = len2;
        it++;
    }

{% endcodeblock %}

首先，len2未声明，再者，MatConstIterator的用法可能有变化。
参考[官方文档示例代码](http://docs.opencv.org/trunk/d5/dd2/classcv_1_1NAryMatIterator.html)解决。

{% codeblock lang:cpp %}

    #include <opencv2/opencv.hpp>
    #include <iostream>
    int main(){

        int sz[3] = {4, 4, 4};
        cv::Mat	m(3, sz, CV_32FC3);		//	A	three-dimensional	array	of	size	4-by-4-by-4
        cv::randu( m, -1.0f, 1.0f);			//	fill	with	random	numbers	from	-1.0	to	1.0
        float max = 0.0f;														//	minimum	possible	value	of	L2	norm
        cv::MatConstIterator_<cv::Vec3f> it = m.begin<cv::Vec3f>();
        while( it != m.end<cv::Vec3f>() ) {
            float len2 = (*it)[0]*(*it)[0]+(*it)[1]*(*it)[1]+(*it)[2]*(*it)[2];
            if( len2 > max ) max = len2;
            it++;
            std::cout<<max<<std::endl;
        }
        return 0;
    }


{% endcodeblock %}





