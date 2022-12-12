---
title: 'public, protected and private'
copyright: true
date: 2017-04-25 16:35:58
categories:
- Cpp
tags:
- Cpp
---

关于c++类变量的属性：private, protected, private

##### 访问范围

- [ ] private

>只能由该类的函数和其友元函数访问
>该类的对象不能访问

- [ ] proteected

>可以被，该类的函数，子类的函数， 友元函数访问
>不能被类的对象访问

- [ ] public

>可以被该类的函数，子类的函数， 友元函数访问
>也可以被类的对象访问

##### 继承

子类与父类的关系：

![](https://i.stack.imgur.com/W6CJ3.jpg)


##### 参考
[stackoverflow](http://stackoverflow.com/questions/860339/difference-between-private-public-and-protected-inheritance)

[ C++ 类访问控制](http://cnmtjp.blog.51cto.com/204390/36548/)

