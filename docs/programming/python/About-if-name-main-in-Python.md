---
title: About if __name__=='__main__' in Python
copyright: true
date: 2017-05-08 18:02:48
categories:
- Python
tags:
- Python
---

##### Overview
关于`if __name__ == '__main__'`,一直想写个笔记，但是老忘，这里总结下。


总的来说，这句代码的作用是**既能保证当前的py文件直接运行，也能保证其可以作为模块被其他py文件导入**。

怎么理解这句话呢？我们通过几个小例子来看下。

##### Code


###### \_\_name\_\_
首先任意创建一个py文件，仅输入一行代码

`print(__name__)`

然后运行，输出：

>__main__

这说明，`__name__`本身是一个变量，但是不是一般的变量。它是在程序执行前就创建并赋值的，而赋值的机制是这里的关键。

在当前程序被当作主程序被执行的时候，`__name__`自动被赋值为固定的字符串`__main__`，当作为模块被其他文件调用的时候，自动被赋值为模块所在的文件名。

看下面一段程序,新建name_main.py文件：

{% codeblock lang:python %}

    def printHello():
        print("Hello World!")
        print(__name__)


    if __name__ ==  '__main__':
        printHello()


{% endcodeblock %}

输出：
>Hello World!
__main__

那么，我们知道`__name__`此处是被赋值为`__main__`的，那么程序的逻辑就很清楚了。先是定义了一个函数，然后判断语句，最后判断通过执行函数。也许会问，不要这个判断，程序不是一样执行吗？当然，一样是可以的，我们完全可以写成下面这样：

{% codeblock lang:python %}

    def printHello():
        print("Hello World!")
        print(__name__)

    printHello()

{% endcodeblock %}

但是，问题就在与，当其作为模块被调用的时候。看下面一节的解释。


###### from xxx import xxx

保持name_main.py文件没有if语句，新建main_name1.py文件，如下：

{% codeblock lang:python %}

    from name_main import printHello
    printHello()

{% endcodeblock %}

想一下，会发生什么？先看输出：

>Hello World!
name_main
Hello World!
name_main


首先，我们知道，作为模块调入，`—__name__` 自动被赋值为模块所在文件名，这点在意料之中。但是，我们明显看到，函数被执行了两次，这就关键所在！因为，在没有判断语句的时候，name_main在被调入的过程中就自动执行了一次（因为name_main本身就包含执行函数的部分），被调入后我们又主动调用一次，所以是两次。

那么，现在if语句的作用已经十分明确了，就是保证不重复执行函数。也就有了下面py文件的一般写法：

**name_main.py**
{% codeblock lang:python %}

    def printHello():
        print("Hello World!")
        print(__name__)


    if __name__ ==  '__main__':
        printHello()


{% endcodeblock %}


**name_main1.py**

{% codeblock lang:python %}

    from name_main import printHello
    printHello()

{% endcodeblock %}

这样，我们单独运行name_main.py:
>Hello World!
__main__



单独运行name_main1.py:
>Hello World!
name_main

可以看到，printHello函数都可以正常执行！这就是`if __name__== '__main__'`语句的作用。
它保证我们既可以单独调试一个文件的函数和类等，有不影响其他文件的调用。

再次看下开头的那句话：

**既能保证当前的py文件直接运行，也能保证其可以作为模块被其他py文件导入**



##### Reference

[stackoverflow](http://stackoverflow.com/questions/419163/what-does-if-name-main-do)


