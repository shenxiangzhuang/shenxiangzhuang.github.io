---
date: 2019-04-30 18:13:24
---

### Overview
Ubuntu16.04 LTS中LaTex环境配置（这里是2018版）。


### Remove Old Version

参考[tex.stackexchange](https://tex.stackexchange.com/questions/95483/how-to-remove-everything-related-to-tex-live-for-fresh-install-on-ubuntu)

### Tex Live

#### Ubuntu 安装源

直接`sudo apt-get install texlive-full`即可，完整版需要磁盘空间较大。

#### 安装包（现在采用的方法）


##### Tex Live
参考[stone-zeng](https://stone-zeng.github.io/2018-05-13-install-texlive-ubuntu/)

```
wget https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/install-tl-unx.tar.gz
tar -xzf install-tl-unx.tar.gz
cd install-tl-2018*
```
之后直接以GUI模式安装`sudo ./install-tl -gui -repository https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet/`


##### 设置环境变量

打开`~/.bashrc`，最后添加
```
export PATH=/usr/local/texlive/2018/bin/x86_64-linux:$PATH
export MANPATH=/usr/local/texlive/2018/texmf-dist/doc/man:$MANPATH
export INFOPATH=/usr/local/texlive/2018/texmf-dist/doc/info:$INFOPATH

```

还需保证开启 sudo 模式后路径仍然可用。命令行中执行
```
sudo visudo
```

找到如下一段代码
```
Defaults        env_reset
Defaults        mail_badpass
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"
```
将第三行更改为
```
Defaults        secure_path="/usr/local/texlive/2018/bin/x86_64-linux:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"
```
也就是加入 TeX Live 的执行路径


##### 字体设置

要在整个系统中使用 TeX 字体，还需要将 TeX 自带的配置文件复制到系统目录下。命令行中执行
```
sudo cp /usr/local/texlive/2018/texmf-var/fonts/conf/texlive-fontconfig.conf /etc/fonts/conf.d/09-texlive.conf
```
后执行

```
sudo fc-cache -fv
```
刷新字体数据库。

### 安装宏包

#### tmlgr自动安装
首先再次配置镜像，参考[这里](https://tex.stackexchange.com/questions/145186/problem-with-updating-tlmgr-bad-hostname)
```
sudo tlmgr option repository https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/tlnet
```
之后运行`tlmgr install <package name>`即可。

#### 压缩包手动安装
参考[这里](https://github.com/hokein/Wiki/wiki/ubuntu%E4%B8%8B%E5%AE%8F%E5%8C%85latex%E5%AE%89%E8%A3%85)


Step1. 先找到系统默认宏包的位置，一般是在目录 /usr/share/texmf/tex/latex

Step2. 把需要安装的宏包放到上面的目录下。

Step3. 执行下面的命令更新一下即可: ~/$ sudo texhash


### TexMaker

直接`sudo apt-get install texmaker`即可。也可以到[官网](http://www.xm1math.net/texmaker/)选择安装更新的版本（已经18.04起步了Orz


### Templates

[ElegantLaTeX](https://github.com/ElegantLaTeX)


### Videos

[米神LaTex+Emacs](https://www.bilibili.com/video/av50392724?p=2)




