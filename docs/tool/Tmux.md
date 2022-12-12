---
title: Tmux
type: categories
copyright: true
date: 2020-01-21 11:05:53
tags:
- Linux
categories:
- Linux
---

# Tmux

分屏工具[Tmux](https://github.com/tmux/tmux)使用记录。



## 安装

首先安装就是直接`sudo apt-get install tmux`安装的，所以版本比较旧(V2.1),最新版可以直接从Github源码安装。

## 配置

直接[.tmux](https://github.com/gpakosz/.tmux),即执行

```
cd
git clone https://github.com/gpakosz/.tmux.git
ln -s -f .tmux/.tmux.conf
cp .tmux/.tmux.conf.local .
```

导入配置，之后设置鼠标开启，同时将`Ctrl+b`的绑定改为`Ctrl+a`，然后重启终端。

> 注意到一点，就是导入这个配置后，直接重启终端好像不行。要把之前开启的tmux session全部kill掉再重启终端才可以。

