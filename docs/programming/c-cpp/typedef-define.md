title: 'typedef & #define'
date: 2017-03-25 15:18:25
categories:
- Cpp
tags:
- Cpp
---

在c++里面，有两种方法为一个数据类型起一个别名，一个是通过预编译器(preprocessor)来替换文本实现，另一个是通过typedef来为类型起别名。
一般情况下，而这均可以实现想要的效果
{% codeblock lang:cpp %}
    #include <iostream>

    using namespace std;

    typedef float* float_pointer;
    #define FLOAT_POINTER float*

    int main(){
        float fv = 1.0;
        float_pointer fp1;
        fp1 = &fv;
        cout<<*fp1<<endl;

        FLOAT_POINTER FP1;
        FP1 = &fv;
        cout<<*FP1<<endl;
        return 0;
    }

{% endcodeblock %}

输出：
>1
1


然而，在**同时为多个变量定义类型**时，就会出现差别。
{% codeblock lang:cpp %}

    #include <iostream>

    using namespace std;

    typedef float* float_pointer;
    #define FLOAT_POINTER float*

    int main(){
        float fv = 1.0;
        float_pointer fp1, fp2;
        fp1 = &fv;
        fp2 = &fv;
        cout<<*fp1<<endl;

        FLOAT_POINTER FP1, FP2;
        FP1 = &fv;
        FP2 = &fv;
        cout<<*FP1<<endl;
        return 0;
    }

{% endcodeblock %}

这段代码将报错
>main.cpp:18:9: error: cannot convert ‘float*’ to ‘float’ in assignment
     FP2 = &fv;
         ^

可以看出，FP2的类型为float，而不是期望的float*

这是因为，预编译器仅仅是将FLOAT_POINTER 替换为 float *， 也就是说定义FP1，FP2时，是这样的：
> float * FP1, FP2;

即仅仅定义FP1为float* ，而FP2为float.


参考：*C++ Primer Plus [5th]*p234






