---
title: 当谈论吃饭时，我们在谈论什么？关于我在 SYSU 吃饭这件事
draft: false
date: 2021-02-28
authors: [mathew]
slug: sysu-card
description: >
     如题，仅仅是出于好奇而已。大致分为两个部分，校园卡数据爬取与数据分析
categories:
  - 回忆录
  - 数据分析
---


如题，仅仅是出于好奇而已。大致分为两个部分，校园卡数据爬取与数据分析。完整项目见[Github](https://github.com/shenxiangzhuang/Sysu-Card), 请合理使用！

<!-- more -->

## 数据爬取

首先是内网才能够登录，总站是:http://card.sysu.edu.cn

总的来说比较简单，大致分为两步：表单提交登录; 获取数据。

### 表单提交登录

这里表单的形式如下：

```
payload = {'sno': sno,
'pwd': npwd,
'ValiCode': verify_code,
'remember': '0',
'uclass': '1',
'json': "true"
}
```

抓包可以看到`sno`就是自己的学号;`pwd`是密码，但是是**加密后的密码**; `ValiCode`是验证码，这里就是简单的**数字验证码**;其他几个字段默认不变即可。

数字验证码直接找到接口 down 下来然后显示，手动输入即可。至于密码的加密方式......这个接触的不多，大概就知道 base64 和 md5 这些，然后我就在登录后的首页 Ctrl+U, Ctrl+F, base64...Ok, 还真的就写在源码里面，lucky:-)

所以手动收入验证码，把密码用 base64 加密传入即可构建完整表单。

### 获取数据

获取数据同样需要提交数据查看的表单，抓包看到的格式如下

```
dataPayload = {
"sdate": "2019-01-01",
"edate": "2021-01-05",
"account": account,
"page": "1",
"rows": "15"
}
```

就是起止日期，第几页，以及每页的行数。这里的 account 抓包看到是一个数字，和学号身份证号看着不太相关，所以就去前面的请求去找，于是发现了名为`GetCardInfoByAccountNoParm`的请求...lucky:-) 所以先请求 (也是 POST) 这个地址获取到自己账户的`account`,之后传入表达请求即可。

> 注意代码里为了减少请求次数，在表单中调大了每页显示的数据条数。这也是比较常用的一种方式。只需要先查出来总的数据条数，之后做个总页数计算即可。



## 数据简单分析

学五真的不好吃，但是它太近了 Orz

![交易类型与地点](https://i.loli.net/2021/03/01/EdwqRn3j9TOPG8g.jpg)



这空白的半年就很魔幻 233

![就餐日期 - 金额](https://i.loli.net/2021/03/01/CxNKyYEz4enTqpr.jpg)

早餐现状:-)

![就餐时间 - 金额](https://i.loli.net/2021/03/01/Y21IL9xphT6WirE.jpg)

每餐 10~15 块的样子

![每餐金额](https://i.loli.net/2021/03/01/Bo1fVLmAtgKqiY3.jpg)
