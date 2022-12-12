---
title: Julia in Ubuntu
copyright: true
date: 2018-01-28 18:27:24
categories:
- Julia
tags:
- Julia
- Jupyter
---

#### Overview
补上Jupyter三大将最后一个——Julia，目前每台有时间学了，先把环境搭建好。首先很简单的步骤安装好Julia，之后设置Jupyter上的kernel。最后是一些Atom里面的配置。


#### Julia installation

Julia的安装及其简单，只需要到[官网](https://julialang.org/downloads/platform.html)下载安装文件，之后一个软链接就可以了。之后在终端直接输入`julia`即可进入交互式界面！

#### Julia kernel

同样的，让Jupyter notebook支持Julia也是及其简单。在交互式界面直接输入`Pkg.add("IJulia")`同样是一行的事。之后在终端输入`jupyter notebook`，浏览器上就可以看到新添加的Julia的kernel了。


#### Julia in Atom

发现Atom一个叫[hydrogen](https://atom.io/packages/hydrogen#plugins-for-hydrogen)的插件，很好地支持Jupyter的一套kernel，正在测试中。其提供了集成各种kernel的[文档](https://nteract.gitbooks.io/hydrogen/docs/Installation.html)


