---
date: 2020-12-19 23:09:39
---



起因是实验需要用到 Spark 集群，然而目前只有本地 Linux 搭的一台伪分布式，所以打算用云服务器搭建。好在腾讯和阿里都有相关的服务，所以可以很简单的把集群搭建起来，在测试过之后，感觉腾讯云的服务更好使用。

## 腾讯云

腾讯云的产品是[弹性 MapReduce](https://console.cloud.tencent.com/emr), 开始是选硬件配置，设置私网和子网以及授权的操作，过程计较简单。

此外，Master 和各 Worker 节点的 Python 均有两个版本的 Python, 分别是 Python2(默认 PySpark 启动这个) 和 Python3。因为要用到的是 Python3 的环境，而且需要 Numpy 和 Pandas 这些库，所以打算**装 Anaconda 来管理 Python 环境，并设置为 PySpark 启动环境**。

步骤如下：

1. 首先 SSH 登录到 Master 节点 (设置弹性公网 IP 即可登录)
2. 下载 Anaconda 安装文件到 Master 节点，可以`wget https://repo.anaconda.com/archive/Anaconda3-2020.11-Linux-x86_64.sh -O ~/anaconda.sh`（参考[文档](https://docs.anaconda.com/anaconda/install/silent-mode/)）或者本地下载后通过 FileZilla 等 FTP 工具上传；同时将`anaconda.sh`文件上传到 HDFS：`hdfs dfs -mkdir /user/hadoop/installdata`（创建目录）， `hdfs dfs -put ~/anaconda.sh /user/hadoop/installdata`（上传到 HDFS，供子节点使用）
3. 在 Master 节点和 Worker 节点分别安装 Anaconda。注意，每个节点下默认有两个用户：root 和 hadoop。我们一般将所有的操作在 hadoop 用户下执行。通过`su hadoop`, `cd`, `hdfs dfs -get /user/hadoop/installdata/anaconda.sh`将`anaconda.sh`拉取到本地的`/home/hadoop/`路径，之后执行`bash anaconda.sh`根据提示安装即可。安装成功后我们需要的 Python 就在目录`/home/hadoop/anaconda3/bin/python`之下。
4. 参考[AWS 文档](https://aws.amazon.com/premiumsupport/knowledge-center/emr-pyspark-python-3x/), 在 Master 节点中，在`/usr/local/service/spark/conf/spark-env.sh`最后加入`export PYSPARK_PYTHON=/home/hadoop/anaconda3/bin/python`，在`/usr/local/service/spark/bin/pyspark`中将`export PYSPARK_DRIVER_PYTHON`改为`export PYSPARK_DRIVER_PYTHON=/home/hadoop/anaconda3/bin/python`即可。(Worker 节点不需要额外设置)
5. 这时候在 Master 直接执行`pyspark`即可拉起我们 Anaconda 管理的 Python3.

> 这里通过设置引导的方式来统一搭建的 Anaconda 环境没有测试成功，有两点需要注意：
>
> 1. 腾讯云的引导操作必须在**创建集群或者扩容**的时候才会自动执行引导脚本 (集群搭建好之后好像没有办法重启执行引导操作；修改 spark 和 hdfs 的配置文件倒是可以重启服务使其改动生效的)
> 2. Worker 节点没有设置弹性公网 IP 的话是不能访问外网的，也就是说引导操作里面执行`wget`的话，只有 Master 节点可以成功下载文件，Worker 节点无法下载。(可以在各个节点的`/usr/local/service/scripts/`文件夹下看到脚本执行的状态)

此外，腾讯云弹性 MapReduce 服务明显更容易使用，弹性公网 IP，安全组设置以及利用 Knox 来访问 YARN UI，Spark UI 等都十分方便，几乎不需要额外设置就能立即使用，基本上没什么延迟。

## 阿里云

阿里云的产品是[E-MapReduce](https://emr.console.aliyun.com/?spm=5176.12818093.nav-right.81.6ec716d0AGWwMK#/cn-qingdao), 开始创建集群的操作和腾讯云基本是一致的，只不过弹性公网 IP 的绑定不是默认的，需要手动创建并绑定。之后的安全组和授权操作也基本一致。

最后没有用阿里云，原因是文档过于拉胯，页面反应也慢的很 (最烦的是隔一会就要重新验证登录状态)。其他的配置也很混乱，尤其是 Knox 用户的配置，文档写的很模糊，地址怎么也打不开。提工单回复又慢的一匹...最主要的，还比腾讯云贵 (摔...) 所以就放弃了。

## 用服务器自己搭建

用服务器自己搭建分布式集群。前不久自己用实验室的一台服务器搭建了一个伪分布式集群。整个流程很简单，先安装 JAVA, 之后 Hadoop, 之后 Spark。最后设置一下 PySpark 启动用的 Python 环境，YARN 配置下可用于分配的集群资源 (内存与逻辑核数)。

因为服务器是绑定了公网 IP 的，所以全程就是 SSH 连起来安装的。但是我本地怎么 PING 都 PING 不同，当然对应的 4040 和 8088 等端口也没办法访问。好在 VSCODE 的 Remote - SSH 插件很好用，可以自动做前向代理。所以在 VSCODE 登录到机器，然后自动前向代理后，就可以在本电脑直接访问对应 4040 和 8088 等端口了！









