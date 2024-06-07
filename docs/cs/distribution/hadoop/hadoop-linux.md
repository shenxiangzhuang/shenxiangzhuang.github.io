---
date: 2020-02-23 12:01:05
---

## 概览

记录 Hadoop 安装使用过程遇到的问题与解决方案。因为在公司都是使用搭建好的集群，所以一般没有什么配置上的问题。这里主要记录在自己搭建的伪分布式集群中遇到的问题。

## 报错：Connection refused

运行`hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'`报的错。

注意执行操作之前要先启动 Hadoop，可以通过`start-dfs.sh`或者`start-all.sh`[^1]。原因就是 Hadoop 未启动成功，通过`jps`看到`namenode`并未启动。比较奇怪的是安装的时候测试还是可以的，而且是完全按照[官方文档](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html)来的。

问题就在官方文档...林子雨老师的[Hadoop3.1.3 安装教程](http://dblab.xmu.edu.cn/blog/2441-2/)提到了这点：

```
Hadoop 的运行方式是由配置文件决定的（运行 Hadoop 时会读取配置文件），因此如果需要从伪分布式模式切换回非分布式模式，需要删除 core-site.xml 中的配置项。

此外，伪分布式虽然只需要配置 fs.defaultFS 和 dfs.replication 就可以运行（官方教程如此），不过若没有配置 hadoop.tmp.dir 参数，则默认使用的临时目录为 /tmp/hadoo-hadoop，而这个目录在重启时有可能被系统清理掉，导致必须重新执行 format 才行。所以我们进行了设置，同时也指定 dfs.namenode.name.dir 和 dfs.datanode.data.dir，否则在接下来的步骤中可能会出错。
```

也就是说我们按照官网的方法配置`core-site.xml `与`hdfs-site.xml`的话，重启的时候必须重新`format`，否则就无法启动`namenode`! 谁没事每次启动都去格式化依次，太坑了 Orz

按照林子雨老师的方法配置就不会出现这个问题。对`core-site.xml `配置如下

```xml
<configuration>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/usr/local/hadoop/tmp</value>
        <description>Abase for other temporary directories.</description>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
```

对`hdfs-site.xml`配置如下

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:/usr/local/hadoop/tmp/dfs/name</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:/usr/local/hadoop/tmp/dfs/data</value>
    </property>
</configuration>
```

因为林老师是将 Hadoop 放在`/usr/local`, 而我是在`/home/shensir/Application`,所以将上面的`/usr/local`部分替换为`/home/shensir/Application`即可。

另外一点就是 HDFS 网页的访问地址在 Linux 是`http://localhost:9870`，好像也有的是`50070`端口的。我这里测试是前者。

## 报错：Retrying connect to server: 0.0.0.0/0.0.0.0:8032

也是运行`hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'`时候出错。推测是 YARN 配置和上面的冲突了，把 YARN 的配置全部清空再重启就可以了。



[^1]: 注意这里在加入环境变量后调用的，其位于`sbin`文件夹下。



## 伪分布式：YARN 上显示的内存与核数与本机器不一致

用的是实验室的服务器，32 核 100G+,然后部署的伪分布式，起了 YARN, 在 8088 端口看节点配置发现只有 8G，核数也不对，原来是因为这个要自己写配置文件设置的 (之前还以为是自动检测 Orz)...

参考[Hadoop not utilizing available memory](https://stackoverflow.com/questions/31768479/hadoop-not-utilizing-available-memory), 在 Hadoop 安装目录下找到`etc/hadoop/yarn-site.xml`, 添加如下内容，指定当前节点可供分配的内存为 80G，可用核数为 24 个 (注意内存单位默认是 M, 所以这里写 81920):

```xml
<property>
    <name>yarn.nodemanager.resource.memory-mb</name>
    <value>81920</value>
</property>

<property>
    <name>yarn.nodemanager.resource.cpu-vcores</name>
    <value>24</value>
</property>
```

此外注意，我们必须重启 YARN 才可以使得配置生效，所以执行`stop-yarn.sh`后`start-yarn.sh`,再到 8088 端口去看就可以看到可用内存已经设置成功。

## 伪分布式：[Container is running beyond memory limits](https://stackoverflow.com/questions/21005643/container-is-running-beyond-memory-limits)

报错类似`Container [pid=28920,containerID=container_1389136889967_0001_01_000121] is running beyond virtual memory limits. Current usage: 1.2 GB of 1 GB physical memory used; 2.2 GB of 2.1 GB virtual memory used. Killing container.`

参考标题链接给的解决方案，可以调整`yarn.nodemanager.vmem-pmem-ratio`或者关闭虚拟内存检查 (不推荐).



