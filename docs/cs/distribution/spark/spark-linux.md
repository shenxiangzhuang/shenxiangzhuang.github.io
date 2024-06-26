---
date: 2020-02-23 13:40:11
---


原生 Spark 与 Scala 的使用。参考林子雨老师教程[Spark 的安装和使用](https://dblab.xmu.edu.cn/blog/1307-2/)。

## PySpark 安装与使用

### 安装：从 Spark 复制文件

在安装好 Spark(目前自己电脑是在`/home/shensir/Application/spark/`)，并设置好环境变量之后，在终端直接运行`pyspark`就可以直接运行。此时在终端通过`which pyspark`也可以打印出上述路径。但是要想在脚本中使用还需要做额外的配置。

在安装好 Spark 之后，将`/home/shensir/Application/spark/bin/pyspark`文件夹直接复制到 Python 的库文件目录下即可，比如我想在 conda 的虚拟环境`ML`中使用，那么就将上述`pyspark`文件夹直接复制到`/home/shensir/anaconda3/envs/ML/lib/python3.6/site-packages`即可在脚本中使用，这是安装原生 Spark 后使用 PySpark 的方法之一。可以通过在该虚拟环境打开 IPython，并运行`import pypsark`就行测试。

> 我开始在测试的时候会报错，说是少 py4j 库，直接 conda install py4j，然后测试就可以了。

### 安装：直接安装 PySpark 第三方库

我们也可以直接使用 PySpark，即通过第三库的方式直接安装使用。比如我们可以新创建一个虚拟的 conda 环境，然后在该环境内部通过 pip 或者 conda 进行安装。安装完成后我们进入该虚拟环境，终端输入`which pyspark`会发现此时的路径是在虚拟环境内部的，比如我这里在虚拟环境`myspark`中安装，得到的路径就是`/home/shensir/anaconda3/envs/myspark/bin/pyspark`. 此时我们可以在终端和脚本中任意调用 PySpark 使用了。

### 使用：IPython 启动 PySpark Shell

在上述安装完成的时候，终端输入`pyspark`会进入默认的 IDLE，而不是 IPython, 那么我们如何设置其以 IPython 启动呢？答案就是在上面的提到的路径。无论使用上述那种方法安装，我们通过`which pyspark`定位到 PySpark 的路径，然后直接编辑该文件即可，比如我们得到的路径为`/home/shensir/anaconda3/envs/myspark/bin/pyspark`，通过`vim /home/shensir/anaconda3/envs/myspark/bin/pyspark`打开，文件的最后是

```
export PYSPARK_DRIVER_PYTHON
export PYSPARK_DRIVER_PYTHON_OPTS
exec "${SPARK_HOME}"/bin/spark-submit pyspark-shell-main --name "PySparkShell" "$@"
```

只需要在最后设置`PYSPARK_DRIVER_PYTHON`为`ipython`即可

```
export PYSPARK_DRIVER_PYTHON="ipython"
```

最后注意一下这里版本上的差异

```
# In Spark 2.0, IPYTHON and IPYTHON_OPTS are removed and pyspark fails to launch if either option
# is set in the user's environment. Instead, users should set PYSPARK_DRIVER_PYTHON=ipython
# to use IPython and set PYSPARK_DRIVER_PYTHON_OPTS to pass options when starting the Python driver
# (e.g. PYSPARK_DRIVER_PYTHON_OPTS='notebook').  This supports full customization of the IPython
# and executor Python executables.
```

### 使用：在 Notebook 使用 PySpark

实际上只需要在 Jupyter Notebook 中添加该环境的 Kernel 就可以了，Kernel 安装参考[文档](https://ipython.readthedocs.io/en/stable/install/kernel_install.html). 首先确保`ipykernel`库已经安装，安装直接通过`conda install ipykernel`即可。之后进入虚拟环境`conda activate myspark`，终端执行`python -m ipykernel install --user --name myspark --display-name "Python(pyspark)"`

根据文档，上面安装 Kernel 的格式为`python -m ipykernel install --user --name myenv --display-name "Python (myenv)"`

这样我们就安装好了一个环境为`myspark`的 Jupyter Notebook Kernel, 终端执行`jupyter notebook`进入，可以发现新的 Kernel, 显示为`Python(pyspark)`

## 从本地&HDFS 读取文件

参考[stackoverflow](https://stackoverflow.com/questions/27299923/how-to-load-local-file-in-sc-textfile-instead-of-hdfs)

### 从 HDFS 读取

一般来说，我们执行下面的读取命令都是默认从 HDFS 读取文件

```py
data = sc.textFile(path)
```

而且要注意的是，目录默认不是 HDFS 的根目录，而是在`/user/用户名`,我这里就是在`/user/shensir`，所以要读取上层或者其他目录下的文件可以使用相对路径，比如`'../../data/bike-data'`来读取根目录的`data`文件夹下的`bike-data`文件。

### 从本地读取

要想在本地读取也很简单，需要用如下方式

```pyth
data = sc.textFile("file://" + path)
```

这里的`path`为本地文件的绝对路径，暂时还不知道如何使用相对路径。

## 使用 YARN

配置 Spark On YARN. 首先在配置 Hadoop 的时候根据[Hadoop: Setting up a Single Node Cluster](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html#YARN_on_a_Single_Node)对 YARN 进行一定的配置，主要是对`/home/shensir/Application/hadoop/etc/hadoop`文件夹下的`mapred-site.xml`和`yarn-site.xml`进行配置，具体内容参考链接。

之后将任务提交到 YARN 会出现错误`java.nio.channels.ClosedChannelException`,主要原因是在 YARN 默认配置下我们的内存不够分配。这里需要根据自己机器的配置来合理设定，不过现在暂时可以采取关闭这个虚拟内存检测的方法，就是在`yarn-site.xml`中加入如下配置 (不推荐，暂时设置)：

```xml
<property>
    <name>yarn.nodemanager.pmem-check-enabled</name>
    <value>false</value>
</property>
<property>
    <name>yarn.nodemanager.vmem-check-enabled</name>
    <value>false</value>
</property>
```

总之，这样可以先将任务 RUN 起来。参考[这里](https://blog.csdn.net/caiwenguang1992/article/details/77574182)

### Spark History Server 使用

参考[cloudera](https://docs.cloudera.com/documentation/enterprise/5-6-x/topics/admin_spark_history_server.html)配置。首先创建存放历史文件的文件夹`hdfs dfs -mkdir -p logs/history`

> 注意这里-p 的意思是如果没有 parent directory 则一并创建。与之相反的是删除时的-rm -r

之后设置权限 (这里还另外与用户组的配置等相关，这里可以暂时不管)，直接赋权`hdfs dfs -chmod -R 1777 /user/shensir/logs/history`

之后修改文件`/home/shensir/Application/spark/conf/spark-defaults.conf`，如果没有就从同文件夹下的`spark-defaults.conf.template`复制过来，添加如下内容：

```
spark.eventLog.enabled=true
spark.eventLog.dir= hdfs://localhost:9000/user/shensir/logs/history
spark.history.fs.logDirectory=hdfs://localhost:9000/user/shensir/logs/history
spark.history.ui.port=18080
spark.yarn.historyServer.address=http://localhost:18080
```

> 这里的`localhost:9000`就是`namenode_host:namenode_port`.上面两个路径的更多讨论见[stackoverflow](https://stackoverflow.com/questions/32001248/whats-the-difference-between-spark-eventlog-dir-and-spark-history-fs-logdirecto)

之后终端运行`start-history-server.sh`打开 history server, 通过 jps 看到可以看到`HistoryServer`已经启动。注意此时终端运行`jps`应该显示以下几个节点的正确运行：

```
25202 ResourceManager
19539 Jps
3701 HistoryServer
24936 SecondaryNameNode
25355 NodeManager
24508 NameNode
24686 DataNode
```

此时就可以使用`spark-shell --master yarn`, `pyspark --master yarn`, `spark-submit xxx.py --master yarn`开始任务的执行了，打开`http://localhost:8088`可以看到 YARN 的 WEB UI，对于完成的 Application，点击后面的 History 便可以重建 Spark UI，目标地址类似如下形式`http://localhost:18080/history/application_1589083440750_0005/jobs/`

同时，浏览器访问`http://localhost:9870/explorer.html#/user/shensir/logs/history`即可以在 HDFS 文件中看到上面的历史文件。

## 问题解决

### SBT 换源问题

这个真的是众所周知，林老师也是一提，网上的答案也大多是错的！错的很微妙...

错的教程就是类似[这样](https://www.jianshu.com/p/8d3ded620051)，正确的是[这样](https://blog.csdn.net/weixin_41115760/article/details/89034839), 有什么区别呢，就是相差一个`s`,也就是说文件`~/.sbt/repositories`的内容应该是下面这样 (注意是`https`)

```
[repositories]
local
osc: https://maven.aliyun.com/nexus/content/groups/public/
typesafe: https://repo.typesafe.com/typesafe/ivy-releases/, [organization]/[module]/(scala_[scalaVersion]/)(sbt_[sbtVersion]/)[revision]/[type]s/[artifact](-[classifier]).[ext], bootOnly
sonatype-oss-releases
maven-central
sonatype-oss-snapshots
```

配置成功的标志是发现下面输出的下载地址为`https://maven.aliyun.com/nexus/content/groups/public/...`开头，当然还有飞起的速度:-)

> 还有个隐藏的问题就是在公司的时候要注意设置公司的代理 IP

### [Spark-ERROR] Failed to construct terminal; falling back to unsupported

启动`spark-shell`的时候出现这行报错，通过`~/.zshrc`添加`export TERM=xterm-color`解决，貌似这是`sbt`的锅...参考[Github](https://github.com/sbt/sbt/issues/3240)

### [Spark-WARN] NativeCodeLoader: Unable to load native-hadoop library

也是启动`spark-shell`的时候出现的报错。通过`vim ./conf/spark-env.sh`编辑，在最后加入`export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$HADOOP_HOME/lib/native`即可。参考["Native-Hadoop" Library Load Issues with Spark](https://www.stefaanlippens.net/spark-native-hadoop.html)

### 伪分布式：启动 PySpark 或者 Spark-Shell 时设置的 executor 个数不生效

比如终端执行`pyspark --master yarn --num-executors 4 --executor-memory 4G`,发现启动正常，但是到 4040 端口看 executor 个数会发现 executor instance 并没有 4 个。原因是资源分配不够，如果当前伪分布式节点资源够用的话，参考[Linux 下 Hadoop 使用](https://datahonor.com/2020/02/23/Linux%E4%B8%8BHadoop%E4%BD%BF%E7%94%A8/)中的解决方案，即在配置文件`yarn-site.xml`设置当前节点可用资源。参考[Apache Spark: setting executor instances does not change the executors](https://stackoverflow.com/questions/29940711/apache-spark-setting-executor-instances-does-not-change-the-executors).

### 伪分布式：[Total size of serialized results of 16 tasks (1048.5 MB) is bigger than spark.driver.maxResultSize (1024.0 MB)](https://stackoverflow.com/questions/47996396/total-size-of-serialized-results-of-16-tasks-1048-5-mb-is-bigger-than-spark-dr)

参考链接方法，在`conf/spark-defaults.conf`中添加`spark.driver.maxResultSize=4g`, 设置 Master 可以接受的结果最大为 4G, 注意这样设置要保证 Master 分配的内存一定是要大于 4G 的。

### 伪分布式：[Spark java.lang.OutOfMemoryError: Java heap space](https://stackoverflow.com/questions/21138751/spark-java-lang-outofmemoryerror-java-heap-space)

其实这个就是堆内存不够了，下面的解答中有让设置`spark.storage.memoryFraction`参数的 (在`conf/spark-default.conf`)，但是这个参数已经在 Spark1.6 之后已经废除了，因为用于缓存和用于堆的内存已经统一。所以还是先看看有没有数据倾斜，然后不行就只能加内存了。





