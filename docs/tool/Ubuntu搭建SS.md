---
title: Ubuntu搭建SS
date: 2017-03-02 16:57:56
categories:
- Linux
tags:
- Linux
- Ubuntu
copyright: true
---

### 旧版

S1:注册[arukas](https://app.arukas.io/)帐号

S2:创建SS账户，参考[这里](http://www.iqcni.com/other/12.html)。

S3：Ubuntu搭建SS客户端的GUI， 参考[这里](http://www.jianshu.com/p/4f6ea97427e9)。

>sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5


![](http://dataimage-1252464519.costj.myqcloud.com/images/Ubuntu/1.png)


### 更新

用上面的教程搭建的代理好早前就开始变卡了...后来就没再用了，不知道现在如何...

#### Pan --> foxyproxy

之前一直都是shadowsock5配合火狐的pan插件用，不过更新到新版的火狐后，pan已经不能用了，经推荐换了foxyproxy来用。配置过程比较简单，记得将IP和端口都设置成本地就行了（IP：127.0.0.1， 端口：1080）。而且，发现foxyproxy的pattern比较好用，把百度和本地地址放到Black List，访问百度会变得比较快，禁用本地地址更是方便...之前不论用hexo还是jupyter notebook都是手动把pan关了的orz.....现在是方便许多~











