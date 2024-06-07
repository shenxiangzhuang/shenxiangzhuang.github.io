---
date: 2020-12-14 23:06:18
---


记录 SBT 使用情况。

## 入门指南

目前看了*Sbt In Action*这本书的前四章，感觉整体讲解的还是比较清晰的 (比直接跟着 Scala 官网走流程好多了)。包括设计理念在内的大部分概念都有涉及，简单的使用来说差不多够用了。

## Thin Jar and Fat Jar

因为 Scala 运行在 JVM 上，一个很直接的问题是怎样把 Scala 程序打包成 JAR 包直接`java -jar xxx.jar`执行？这里就涉及两个命令及其对应的包。

终端输入`sbt`进入 sbt 环境，如果输入`package`那么会给出一个 Thin Jar, 也就是将源码直接打包，不加入其他运行需要的依赖; 如果加入`sbt-assembly`插件 (后面会介绍如何加入)，输入`assembly`,那么就会得到一个 Fat Jar。Fat Jar 就是我们可以直接运行的 Jar 包。

关于 Fat jar 的生成以及`sbt-assembly`插件的使用参考[Baeldung](https://www.baeldung.com/scala/sbt-fat-jar):

1. 在`build.sbt`同目录下的`project`文件夹下新建`plugins.sbt`文件
2. 在`plugins.sbt`文件中添加`addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.15.0")`即可

文章另外讲了`provided`与`default deduplicate merge strategy(META-INF)`的讲解。