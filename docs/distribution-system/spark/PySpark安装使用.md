---
title: PySpark安装使用
type: categories
copyright: true
date: 2020-02-02 20:00:35
tags:
- PySpark
- Spark
categories:
- Spark
---

## 概览

这里不直接安装原生的Spark，因为目前没必要，所以仅仅记录下PySpark的安装和使用过程中遇到的坑。

## 安装

在Spark的官方的[安装界面](https://spark.apache.org/downloads.html)就提到了PySpark的安装方式就是直接运行`pip install pyspark`。这当然是可以的，但是我们一般不直接这样做，主要是因为Anaconda的依赖问题。在默认的Base环境中混用`pip install`和`conda install`很容易把环境搞坏掉，使得后面根本没法升级。

所以养成好的习惯，一般不要去动Base, 需要配置为xx而用的Python环境就搞一个虚拟环境出来，这样就很容易管理。

这里我们就用conda建立一个Python3.7的名字为`pyspark`的环境`conda create --name pyspark python=3.7`.之后激活此环境`conda activate pyspark`。此时直接在终端输入`pyspark`即可。

> 注意，我在运行的时候遇到一个小问题，就是此时打开的之前安装的Spark版本2.3.0，而不是最新的2.4.4.查了下主要问题在一个环境变量`SPARK_HOME`，我之前指定到了那个2.3.0的版本(通过`env | grep spark`发现)。我们在`/etc/profile`将其注释掉之后重启电脑即可。此时激活虚拟环境后，运行`pyspark`会直接进入`pip`安装的新的版本。



## 默认启动IPython

上面运行`pyspark`会直接运行python，而我想让他进入IPython，显然后者更为方便一些。修改步骤如下，首先`which pyspark`定位spark的位置，发现在`/home/shensir/anaconda3/envs/pyspark/bin/pyspark`之后直接执行`gedit /home/shensir/anaconda3/envs/pyspark/bin/pyspark`对其进行修改：

```
export PYSPARK_DRIVER_PYTHON
export PYSPARK_DRIVER_PYTHON_OPTS
```

定位到上面两行，为第一行的环境变量指定为`ipython`即可，如下：

```
export PYSPARK_DRIVER_PYTHON='ipython'
export PYSPARK_DRIVER_PYTHON_OPTS
```

之后再次运行`pyspark`就会直接进入IPython.

## 连接MySQL数据库

在看一个[教程](https://www.osgeo.cn/learnspark/rdd.html)的时候，尝试了从MySQL数据库创建RDD，但是报错`[java.lang.ClassNotFoundException: com.mysql.jdbc.Driver](https://www.cnblogs.com/spicy/p/9754123.html)`,后参考[[Cant connect to Mysql database from pyspark, getting jdbc error](https://stackoverflow.com/questions/49011012/cant-connect-to-mysql-database-from-pyspark-getting-jdbc-error)发现是少了驱动文件，看了下数据库是8.0.17版本，所以在[MySQL Connector/J (Archived Versions)](https://downloads.mysql.com/archives/c-j/)选择8.0.17和Platform Independent下载`mysql-connector-java-8.0.17.tar.gz`文件，之后解压，找到`mysql-connector-java-8.0.17.jar`文件，将其复制到`/home/shensir/anaconda3/envs/pyspark/lib/python3.7/site-packages/pyspark/jars`文件夹下，重启终端继续即可。

下面贴一下PySpark连接MySQL数据的代码：

```python
from pyspark.sql import SparkSession

spark = SparkSession \
	.builder \
    	.appName('Python Spark creates RDD') \
        .config('Spark.some.config.option', 'some-value') \
        .getOrCreate()

df = spark.read.format("jdbc").options(
	url="jdbc:mysql://localhost:3306/数据库名",
	driver="com.mysql.cj.jdbc.Driver",
	dbtable = "表名",
	user="用户名",
	password="密码").load()

print(df.show())
```

## 从HDFS读取文件

首先要保证服务开启`start-dfs.sh`，可以`jps`查看各个节点是否启动成功。同时使用`hdfs dfs -ls -R`查看已经加入HDFS的文件。我们也可以用命令`hdfs dfs -moveFromLocal data/WineData.csv /user/shensir`来将本地文件添加到HDFS，之后再次通过`hdfs dfs -ls -R`查看是否添加成功。

> 注，开启服务后我们也可以在浏览器查看HDFS文件目录，我这里是在`http://localhost:9870/explorer.html#/user/shensir`查看，但是注意在代码中读取的位置依旧是用9000端口。

之后可以在PySpark中读取:

```python
from pyspark.context import SparkContext
from pyspark.sql import HiveContext

sc = SparkContext('local','example')
hc = HiveContext(sc)
data = sc.textFile("hdfs://localhost:9000/user/shensir/WineData.csv")
print(data.first())

# RDD->DataFrame
header = data.first()
df = data \
    .filter(lambda row: row != header) \
    .map(lambda row: [float(ch) for ch in row.split(',')]) \
    .toDF(header.split(','))
print(df.show(5))
```

