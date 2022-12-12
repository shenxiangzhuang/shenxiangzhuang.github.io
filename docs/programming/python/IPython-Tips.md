---
title: IPython Tips
copyright: true
date: 2018-03-08 13:29:01
categories:
- Tips
tags:
- Tips
- IPython
---

### Install

一直是Anaconda一起用的，直接就安装好了。当然不用Conda,也可以用Pip装上IPython,这里记录下常用的命令以备忘。


### Tips

#### "cmd"
在IPython中，一些常见的Linux命令都是可以用的，如ls, cd这些。

#### %load xxx.py
载入文件中的变量，函数，类等。

#### edit xxx.py
指定用于编辑的工具后（我这里用的Vim），可以直接编辑文件。之后保存退出，代码会自动执行。

#### whos [del %reset](http://sofasofa.io/forum_main_post.php?postid=1000225)
whos，查看当前环境下的所有全局变量。
del x, 删除变量x
%reset [-f], 删去所有变量

#### [function_name? & function_name??](https://stackoverflow.com/questions/1562759/can-python-print-a-function-definition)
Use function_name? to get help, and function_name?? will print out the source.


#### IPython in virtual environment

在用conda创建新的env后会发现无法使用对应版本的IPython,于是可以先在这个环境新安装一个IPython。，然后运行`hash -r`。如果不运行后面的命令会发现打开的IPython还是之前默认的版本。后者的作用就是`forget all remembered locations`，所以就可以了。

[参考1](https://howchoo.com/g/mgvizdexzje/how-to-make-ipython-work-in-a-virtualenv-virtual-environment), [参考2](https://askubuntu.com/questions/952137/what-does-hash-r-command-do)



