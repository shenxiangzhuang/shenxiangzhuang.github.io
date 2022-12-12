---
title: Cmake使用
copyright: true
date: 2017-12-18 10:58:48
categories:
- C
tags:
- C
- Cmake
---



一直使用的Clion写C&Cpp，编译都是用cmake文件来，这里记录下使用过程中遇到的问题及解决方法。


####  链接math.h库

若是`.c`源文件包含了`math`库，那么我们在命令行用`gcc`编译的时候可以使用`-lm`来实现，如下：

>gcc fib.c -lm -o fibo

参考[stackoverflow](https://stackoverflow.com/questions/8671366/undefined-reference-to-pow-and-floor)


>ps:在Linux下cc与gcc是等价的，cc原是Unix下的c compiler,gcc是其在Linux下的替代。参考[这里](http://www.cnblogs.com/zhouyinhui/archive/2010/02/01/1661078.html)

而在Clion中就需要修改` CMakeLists.txt`文件,最后加上：

>target_link_libraries(NAME m)

参考[intellij-support](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206607085-CLion-Enabling-math-h-for-C-projects)
