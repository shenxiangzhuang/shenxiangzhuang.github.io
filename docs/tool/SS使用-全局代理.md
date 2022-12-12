---
title: SS使用-全局代理
copyright: true
date: 2017-08-01 00:07:32
categories:
- Linux
tags:
- Linux
- Ubuntu
---


SS全局代理的设置。测试情况：

设置PAC文件：
>参考[这里](http://www.pandagao.com/2016/05/13/ubuntu-use-shadowsocks-and-pac/)，开始运行不成功，因为PIP安装的GenPAC不支持Py3,即使update也不行orz...后来到Github发现正好新添加了Py3的支持，又clone并install重新安装GenPAC才可以(类似的版本问题值得注意！)，成功生成了PAC文件。然后在在系统设置，网络，代理里面选择自动，并指定了PAC的地址。之后启动Shadowsocks并连接。这时候Chrome可以在不使用插件的时候翻出去，但是FireFox还是不行，最后发现把原来的PAN插件禁用才可以。

设置代理地址：
>在系统设置，网络，代理里面选择人工设置，在Socks Host一栏填入127.0.0.1:1080即可。之后启动Shadowsocks并连接。这时候Chrome可以在不使用插件的时候翻出去，但是FireFox不行,即使禁用了PAN也是不行。




总之，通过第一种方法我们可以实现浏览器的完全的代理模式，但是终端还是不行。于是就用polipo来搞了。参考[这里](http://droidyue.com/blog/2016/04/04/set-shadowsocks-proxy-for-terminal/index.html)设置成功。

运行结果(盖住了部分ip...)：

    shensir@shen:~$ curl ip.gs
    Current IP / 当前 IP: 150.255.29.xxx
    ISP / 运营商:  ChinaUnicom
    City / 城市: Haikou Hainan
    Country / 国家: China
    Please join Telegram group https://t.me/sbfans if you have any issues. / 如有问题，请加入 Telegram 群 https://t.me/sbfans 

      /\_/\
    =( °w° )=
      )   (  //
     (__ __)//

    shensir@shen:~$ hp curl ip.gs
    Current IP / 当前 IP: 45.77.19.xxx
    ISP / 运营商:  choopa.com
    City / 城市: Tokyo Tokyo
    Country / 国家: Japan
    Please join Telegram group https://t.me/sbfans if you have any issues. / 如有问题，请加入 Telegram 群 https://t.me/sbfans 

      /\_/\
    =( °w° )=
      )   (  //
     (__ __)//


貌似是可以了，可是我加了hp`再ping www.google.com`还是不行orz...
此外，代码翻墙也是有待解决...先挖个坑，有空再来填吧.

====================================================

2017/8/14 解决部分终端问题

今天在用conda装虚拟环境的时候，不管用不用前面的hp似乎都没什么卵用...就试了试proxychains。安装和设置都十分简单，参考[这里](https://github.com/naseeihity/LearnReact/issues/7)。这样设置后虽说还是ping不通Google,但是在使用conda装东西的时候速度可以起飞...嗯，目前是够用了，先这样。

<<<<<<<<<<<<<<<<<<<2019/4/29 更新 proxychains quit mode>>>>>>>>>>>>>>>>>>>>
参考[这里](https://www.codeproject.com/Tips/634228/How-to-Use-Proxychains-Forwarding-Ports).修改其配置文件即可。


====================================================
2017/9/10 解决Python代码翻墙问题

之前尝试了很多办法，都没办法在Python利用SS翻墙。现在是找到了两种解决方案。第一种就是在运行Python脚本的时候加上前面设置的proxychains。但是总感觉不太方便（Pycharm里面不好用...）于是就有了第二种方法（感谢一位群友相助），是利用requests设置代理IP的方法，其实也很简单：

{% codeblock lang:cpp %}

    import requests

    proxy = {
        "http": "http://localhost:1080",
        "https": "https://localhost:1080"
    }
    data = requests.get("https://www.google.com.hk", proxies=proxy)

    print(data.status_code)
    print(data.text)


{% endcodeblock %}

这里有两个关键的地方：


- [ ] SS设置

>Local Server Type 改成Http(s)。。。之前就是用SOCKS，一直不成。。

- [ ] Http | SOCKS5

>proxy里面， "http": "http://localhost:1080" , 后面也对应改成http











