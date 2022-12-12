---
title: Hello Docker!
copyright: true
date: 2017-10-24 11:18:49
categories:
- Docker
tags:
- Docker
---

### Overview

一直不清楚Docker怎么玩，只知道很强...打算学习下怎么用。

关于版本：
>Docker CE is the simple classical OSS Docker Engine.

> Docker EE is Docker CE with certification on some systems and support by Docker Inc.

> Docker CS (Commercially Supported) is kind of the old bundle version of Docker EE for versions <= 1.13.

这里装的是CE.

### 安装与配置

基本上按照官网教程来的。

#### Install

先是[Get Docker CE for Ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/), 选用的是`Install using the repository`。一切正常。

>之后尝试` docker run -it ubuntu bash`，然后就进去了一个环境，但是怎么也无法退出...参考[这里](https://forums.docker.com/t/container-stops-upon-exit-from-the-terminal/1267/2),使用`CTRL+p CTRL+q`退出到了原来的环境。


#### Post-installation steps for Linux

参考[这里](https://docs.docker.com/engine/installation/linux/linux-postinstall/#manage-docker-as-a-non-root-user),只是设置了非root的权限，其他的暂时没去管。


#### Build and run your first app

参考[这里](https://docs.docker.com/get-started/)进行下一步的操作。






