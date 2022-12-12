---
title: OpenCV4.1.0 on Ubuntu16.04
type: categories
copyright: true
date: 2019-09-05 00:02:22
tags:
- OpenCV
- Ubuntu
- Clion
- Cpp
categories:
- Cpp
---

### 安装编译

#### 大致流程

主要的参考资料还是[官方文档](https://docs.opencv.org/4.1.0/d7/d9f/tutorial_linux_install.html), 不过这里在设置`Python`路径方面并没有写的特别详细，所以参考了[Medium文章](https://medium.com/dsc-manipal/opencv4-1-0-ubuntu-18-04-anaconda-dc427aa216d9)，这里是用了`conda`来创建了一个独立虚拟环境，使得路径的配置显得更加清晰。(此外也可以用`virtualenv`, 类似可以参考[pyimagesearch](https://www.pyimagesearch.com/2018/08/15/how-to-install-opencv-4-on-ubuntu/))。Medium文章中要注意一点，就是它的`OPENCV_EXTRA_MODULES_PATH`是直接写死的，我们要将其改为自己下载的`opencv_contrib`的路径（直接写绝对路径）。

#### 遇到的问题与解决方法

问题主要就是网络的问题，就是在执行`cmake ...`命令之后，一般会卡在`IPPICV: Download: ippicv_2019_lnx_intel64_general_20180723.tgz`，这里国内的网络一般是不行，可以选择配置代理或者手动安装，网上教程很多，一般都是可以的。后面可能还会遇到`face_landmark_model.dat`数据下载卡住的情况，也可以通过配置代理或手动下载进行处理。

更多其他问题可以参考[Ubuntu16.04安装OpenCV](https://www.jianshu.com/p/259a6140da9d)， 有一些其他问题的解决方法。

### Clion配置

这里参考了之前用的`CMakeLists.txt`文件（那时候是在OpenCV3.4版本左右使用，现在依然是可以的），这里直接贴出来。

```
cmake_minimum_required(VERSION 3.14)
project(CoolCV)

set(CMAKE_CXX_STANDARD 14)

add_executable(CoolCV main.cpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

find_package( OpenCV REQUIRED )

#include_directories(${OpenCV_INCLUDE_DIRS})

target_link_libraries(CoolCV ${OpenCV_LIBS} )
#target_link_libraries(CoolCV ${PYTHON_LIBRARIES})
```

