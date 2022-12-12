---
title: By reference | By pointer
copyright: true
date: 2017-08-28 21:32:35
categories:
- Cpp
tags:
- Cpp
---

在看*c++ primer plus 6th*, 发现给函数传参的时候，By reference和Pointer都是一样可以改变实参的，于是查了下他们的不同之处。

>1.指针是一个实体，而引用仅是个别名；

>2.引用被创建的同时必须被初始化（指针则可以在任何时候被初始化）
>
>3.不能有NULL引用，引用必须与合法的存储单元关联（指针则可以是NULL）

>4.一旦引用被初始化，就不能改变引用的关系（指针则可以随时改变所指的对象）
>
>5.“sizeof 引用”得到的是所指向的变量(对象)的大小，而“sizeof 指针”得到的是指针本身的大小；
>


参考： [C++ 值传递、指针传递、引用传递详解](http://www.cnblogs.com/yanlingyin/archive/2011/12/07/2278961.html)