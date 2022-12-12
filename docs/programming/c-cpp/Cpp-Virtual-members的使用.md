---
title: Cpp Virtual members的使用
date: 2017-03-02 12:26:43
categories:
- Cpp
tags:
- Cpp
---
C++类的学习-->Virtual member的使用

先看一个例子：

{% codeblock lang:cpp %}

    #include <iostream>
    using namespace std;

    class CPolygon{
    protected:
        int width, heigth;
    public:
        void set_values (int a, int b)
        {width=a; heigth=b;}
    };


    class CRectangle: public CPolygon{
    public:
        int area()
        {
            return (width * heigth);
        }
    };

    class CTriangle: public CPolygon{
    public:
        int area()
        {
            return (width * heigth / 2);
        }
    };

    int main(){
        CRectangle rect;
        CTriangle trgl;
        CPolygon * ppoly1 = &rect;
        CPolygon * ppoly2 = &trgl;
        ppoly1 -> set_values(4, 5);
        ppoly2 -> set_values(4, 5);
        cout << rect.area() << endl;
        cout << trgl.area() << endl;
        return 0;
    }

{% endcodeblock %}
输出：
>20
>10

 这里，最后的rect.area() 与 trgl.area（） 必须用rect 与 trgl， 而不能用(*ppoly1)或是ppoly1->  。为什么呢，我们先试下，看看报错：

变动只有这两行:
{% codeblock %}
    cout << (*ppoly1).area() << endl;
    cout << ppoly2->area() << endl;

{% endcodeblock %}

报错如下： 
![](http://dataimage-1252464519.costj.myqcloud.com/images/index.png)


报错写的很清楚了，两个指针ppoly1, ppoly2指向的基类是CPolygon, 而CPolygon类 has no member named 'area'. 所以我们想，既然两个derived classes 都用到area, 如果能在基类里面定义就好了。但是可惜的是，两个darived class的area是不同的。

>实际上，这就是我们常说的*Diamond Problem*。[这篇文章](https://www.geeksforgeeks.org/multiple-inheritance-in-c/)解释的比较详细。


这时，就是Virtual member 上场的时候了。
先看下Virtual member的说明：
![](http://dataimage-1252464519.costj.myqcloud.com/images/x.png)

接下来看个上面改写的例子： 
{% codeblock %}
    #include <iostream>
    using namespace std;

    class CPolygon{
    protected:                // protected与private的区别就在于能否被其derived classes使用
        int width, height;
    public:
        void set_values (int a, int b){
            width=a; height=b;
        }
        virtual int area()
        { return (0);}
    };

    class CRectangle: public CPolygon{
    public:
        int area(){
            return (width * height);
        }
    };

    class CTriangle: public CPolygon{
    public:
        int area(){
            return (width * height / 2);
        }
    };


    int main(){
        CRectangle rect;
        CTriangle trgl;
        CPolygon poly;
        CPolygon * ppoly1 = &rect;
        CPolygon * ppoly2 = &trgl;
        CPolygon * ppoly3 = &poly;
        ppoly1->set_values(4, 5);
        ppoly2->set_values(4, 5);
        ppoly3->set_values(4, 5);

        cout << ppoly1->area() << endl;
        cout << ppoly2->area() << endl;
        cout << ppoly3->area() << endl;
        return 0;
    }



{% endcodeblock %}

输出：
>20
>10
>0

![](http://dataimage-1252464519.costj.myqcloud.com/images/virtual.png)

参考：*The C++ Language Tutorial*