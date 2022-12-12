---
title: Const in Cpp
date: 2017-04-09 23:49:36
categories:
- Cpp
tags:
- Cpp
---

关于const在函数声明里的应用。const放在函数前与后的区别。
先看下[cplusplus](http://www.cplusplus.com/forum/general/12087/)的一个问答：

问：
>Could you please explain the different between:
void const f() {} and void f() const {}.

答：
>void const f() is equivilent to const void f(), which means the return type (in this case a void) is const. This is totally meaningless not only because it's a void (there is nothing there that needs a const qualifier), but also because it's a return type (returning something as const doesn't make a whole lot of sense).
>
void f() const makes the function itself const. This only really has meaning for member functions. Making a member function const means that it cannot call any non-const member functions, nor can it change any member variables. It also means that the function can be called via a const object of the class:

示例代码：

{% codeblock lang:cpp %}

    class A
    {
    public:
      void Const_No();   // nonconst member function
      void Const_Yes() const; // const member function
    };


    //-----------

    A  obj_nonconst;  // nonconst object
    obj_nonconst.Const_No();  // works fine
    obj_nonconst.Const_Yes(); // works fine

    const A obj_const = A(); // const object
    obj_const.Const_Yes(); // works fine (const object can call const function)
    obj_const.Const_No();  // ERROR (const object cannot call nonconst function) 


{% endcodeblock %}


再参考下[stackoverflow](http://stackoverflow.com/questions/751681/meaning-of-const-last-in-a-c-method-declaration):

>When you add the const keyword to a method the this pointer will essentially become const, and you can therefore not change any member data. (Unless you use mutable, more on that later).
>

简单讲，就是说，const放在前面，是保证函数返回值为const；放在函数后面，是保证其调用的对象，也就是参数为const,不能被改变。









