---
title: Spark On Cloud
type: categories
copyright: true
date: 2020-12-19 23:09:39
tags:
- Spark
- PySpark
categories:
- Spark
---



# Overview

起因是实验需要用到Spark集群，然而目前只有本地Linux搭的一台伪分布式，所以打算用云服务器搭建。好在腾讯和阿里都有相关的服务，所以可以很简单的把集群搭建起来，在测试过之后，感觉腾讯云的服务更好使用。

# 腾讯云

腾讯云的产品是[弹性 MapReduce](https://console.cloud.tencent.com/emr), 开始是选硬件配置，设置私网和子网以及授权的操作，过程计较简单。

此外，Master和各Worker节点的Python均有两个版本的Python, 分别是Python2(默认PySpark启动这个)和Python3。因为要用到的是Python3的环境，而且需要Numpy和Pandas这些库，所以打算**装Anaconda来管理Python环境，并设置为PySpark启动环境**。

步骤如下：

1. 首先SSH登录到Master节点(设置弹性公网IP即可登录)
2. 下载Anaconda安装文件到Master节点，可以`wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh -O ~/anaconda.sh`（参考[文档](https://docs.anaconda.com/anaconda/install/silent-mode/)）或者本地下载后通过FileZilla等FTP工具上传；同时将`anaconda.sh`文件上传到HDFS：`hdfs dfs -mkdir /user/hadoop/installdata`（创建目录）， `hdfs dfs -put ~/anaconda.sh /user/hadoop/installdata`（上传到HDFS，供子节点使用）
3. 在Master节点和Worker节点分别安装Anaconda。注意，每个节点下默认有两个用户：root和hadoop。我们一般将所有的操作在hadoop用户下执行。通过`su hadoop`, `cd`, `hdfs dfs -get /user/hadoop/installdata/anaconda.sh`将`anaconda.sh`拉取到本地的`/home/hadoop/`路径，之后执行`bash anaconda.sh`根据提示安装即可。安装成功后我们需要的Python就在目录`/home/hadoop/anaconda3/bin/python`之下。
4. 参考[AWS文档](https://aws.amazon.com/premiumsupport/knowledge-center/emr-pyspark-python-3x/), 在Master节点中，在`/usr/local/service/spark/conf/spark-env.sh`最后加入`export PYSPARK_PYTHON=/home/hadoop/anaconda3/bin/python`， 在`/usr/local/service/spark/bin/pyspark`中将`export PYSPARK_DRIVER_PYTHON`改为`export PYSPARK_DRIVER_PYTHON=/home/hadoop/anaconda3/bin/python`即可。(Worker节点不需要额外设置)
5. 这时候在Master直接执行`pyspark`即可拉起我们Anaconda管理的Python3.

> 这里通过设置引导的方式来统一搭建的Anaconda环境没有测试成功，有两点需要注意：
>
> 1. 腾讯云的引导操作必须在**创建集群或者扩容**的时候才会自动执行引导脚本(集群搭建好之后好像没有办法重启执行引导操作； 修改spark和hdfs的配置文件倒是可以重启服务使其改动生效的)
> 2. Worker节点没有设置弹性公网IP的话是不能访问外网的，也就是说引导操作里面执行`wget`的话，只有Master节点可以成功下载文件，Worker节点无法下载。(可以在各个节点的`/usr/local/service/scripts/`文件夹下看到脚本执行的状态)

此外，腾讯云弹性MapReduce服务明显更容易使用，弹性公网IP，安全组设置以及利用Knox来访问YARN UI，Spark UI等都十分方便，几乎不需要额外设置就能立即使用，基本上没什么延迟。

# 阿里云

阿里云的产品是[E-MapReduce](https://emr.console.aliyun.com/?spm=5176.12818093.nav-right.81.6ec716d0AGWwMK#/cn-qingdao), 开始创建集群的操作和腾讯云基本是一致的，只不过弹性公网IP的绑定不是默认的，需要手动创建并绑定。之后的安全组和授权操作也基本一致。

最后没有用阿里云，原因是文档过于拉胯，页面反应也慢的很(最烦的是隔一会就要重新验证登录状态)。其他的配置也很混乱，尤其是Knox用户的配置，文档写的很模糊，地址怎么也打不开。提工单回复又慢的一匹...最主要的，还比腾讯云贵(摔...)所以就放弃了。

# 用服务器自己搭建

用服务器自己搭建分布式集群。前不久自己用实验室的一台服务器搭建了一个伪分布式集群。整个流程很简单，先安装JAVA, 之后Hadoop, 之后Spark。 最后设置一下PySpark启动用的Python环境，YARN配置下可用于分配的集群资源(内存与逻辑核数)。

因为服务器是绑定了公网IP的，所以全程就是SSH连起来安装的。但是我本地怎么PING都PING不同，当然对应的4040和8088等端口也没办法访问。好在VSCODE的Remote - SSH插件很好用，可以自动做前向代理。所以在VSCODE登录到机器，然后自动前向代理后，就可以在本电脑直接访问对应4040和8088等端口了！









