---
title: Ubuntu跳坑记录——环境变量，不存在的
copyright: true
date: 2017-08-22 23:18:42
categories:
- Linux
tags:
- Ubuntu
---


嗯，本来是一个平静的夜晚，开始搬砖，打开终端，嗯。。说.bashrc文件有问题，但是没什么影响。但是看着难受啊，开始改，开始Google, 发现一条看似平淡的命令[不要试orz...]：

>cp /etc/skel/.bashrc ~/

运行，可以了，不出错了！开始干活，运行Ipython，挂了，conda挂了，hexo挂了...
之后一阵乱搜，发现基本无解了。因为是覆盖的，不是删除的，根本无从找回原文件。但是这里也认识到一个问题，后来发现同样的问题，有的答案给出的就有先备份文件的命令，但是我第一次遇见的并没有让备份...继续乱搜，运行，发现sudo, ls,基本全部挂了...


嗯，还是学到一点，上面的命令可以恢复默认配置的,所以恢复之后sudo, ls也就能使用了。突然想到，之前Ubuntu无限Login也是环境变量写错了格式，而且后来的情况也是一样的(就是sudo, ls也乱套了)。


到Linux群问了问，基本上没有好的办法。于是开始手动添加环境变量(编辑文件/home/shensir/.bashrc，最后追加)。

>conda  path：加入export PATH="/home/shensir/anaconda3/bin:$PATH"，参考[这里](https://askubuntu.com/questions/817938/changing-bashrc-file-for-anaconda)
>
>
>node, npm: 没有找到原来的路径，直接重新装的（目前未出现冲突问题），参考[这里](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)。其实也就两条命令，非常方便，一次运行成功。
>	`curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -`
    `sudo apt-get install -y nodejs`

>hexo：在原hexo文件夹的根目录下直接运行安装命令 `sudo npm install hexo-cli -g`， 和之前提到的迁移是一样的，只安装，不要初始化。


配置到此，基本上是恢复了一些常用的功能。不知道之后还会不会暴露出新的问题。先更到这里，我先重启看看...无限login就悲剧了。

回更，一切安好...

![](http://datahonor-1252464519.costj.myqcloud.com/201708/Screenshot%20from%202017-08-22%2023-58-36.png)



