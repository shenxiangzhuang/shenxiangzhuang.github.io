---
title: Ubuntu命令积累
date: 2017-03-02 17:03:54
categories:
- Linux
tags:
- Linux
- Ubuntu
copyright: true
---
##### 查看CPU及内存
```
top
或者
sudo apt-get install htop
htop
```
##### 查看网络
```
# 查看网卡
​ ifconfig
# 查看网络状况
​ sudo apt-get install slurm
​ slurm -i wlan0    # wlan0是指定的网卡
```

##### 重启&关闭网络服务

```
# 重启
service network-manager restart

# 关闭
service network-manager stop
```

> 发现中大校园网认证在Linux客户端会先停掉network-manager再进行认证。开始还可以正常连接上网，后面连接成功了但是无法上网，重启下network-manager之后再连接可以。



#####  登录到远程服务器

{% codeblock %}
     ssh -l root 45.77.14.149
{% endcodeblock %}

指定端口

{% codeblock %}
     ssh -l root -p 45.77.14.149
{% endcodeblock %}

退出ssh登录： `logout`

另外，[Vultr 修改 Root 密码](https://www.cnblogs.com/mexinyan/p/9700252.html)

##### 设置环境变量
参考[这里](http://www.th7.cn/system/lin/201605/164198.shtml)
######  临时设置
{% codeblock %}
    export PATH=路径:$PATH
{% endcodeblock %}
>注意，上面`export`语句是在终端执行。
###### 用户环境变量
{% codeblock %}
    sudo gedit  ~/.profile
    export PATH=路径:$PATH
    source .profile
{% endcodeblock %}
>上面`export`语句是要加到打开的文件中

此外也可以修改`~/.bashrc`文件，和修改`~/.profile`是一样的，实际上以上~/.profile文件中有这两句

```
if [ -f "$HOME/.bashrc" ]; then
 . "$HOME/.bashrc"
```
注意，如果使用`zsh`可能需要修改`~/.zshrc`，见下文。

###### 系统[所有用户]环境变量

{% codeblock %}
    sudo gedit /etc/profile
    export PATH=路径:$PATH
    source /etc/profile
{% endcodeblock %}
>上面`export`语句是要加到打开的文件中

参考[这里](https://www.jianshu.com/p/12fbfa8c7489)

##### `~/.bashrc` or `~/.zshrc`

在使用`bash`（`exec bash`切换到`bash`）的时候是修改`~/.bashrc`文件做一些配置（比如alias等）；在使用`zsh`（`exec zsh`切换到`zsh`）的时候要改`~/.zshrc`文件.

参考[stackoverflow](https://stackoverflow.com/questions/26616003/shopt-command-not-found-in-bashrc-after-shell-updation)

#####  查看[特定程序]线程
{% codeblock %}
    ps -eLf|grep python[指定程序]
{% endcodeblock %}
![](http://dataimage-1252464519.costj.myqcloud.com/images/Ubuntu/2.png)
可以看到有三个Python线程在运行。

 关于ps -eLf:[参考这里](http://outprog.github.io/blog/2015/10/15/ubuntu-14-dot-04-shi-yong-cron-shi-xian-ji-hua-ren-wu/)：

>输出按顺序为：UID PID PPID LWP C NLWP STIME TTY TIME CMD

>LWP　light weight process ID 可以称其为线程ID。
NLWP 进程中的线程数number of lwps (threads) in the process。 


##### Ubuntu计划任务之crontab
参考[这里](http://outprog.github.io/blog/2015/10/15/ubuntu-14-dot-04-shi-yong-cron-shi-xian-ji-hua-ren-wu/)
{% codeblock %}
    crontab -e 
    30 7 * * * run-parts /home   #每天7：30运行 /home 目录下的所有脚本
{% endcodeblock %}


具体到执行Python脚本的话参考[这里](http://blog.csdn.net/ybsun2010/article/details/9972403)，就是如下的写法：
{% codeblock %}
    */2 * * * * python /home/mytask/hello.py >> /home/mytask/hello.py.log 2>&1
{% endcodeblock %}
 即，每两分钟执行/home/mytask目录下的hello.py脚本, 并将执行的log写入hello.py.log文件中。

hello.py如下：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Ubuntu/3.png)

crontab -e 后的添加：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Ubuntu/4.png)
log文件如下：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Ubuntu/5.png)

##### Ubuntu安装中文字体
参考[这里](http://blog.csdn.net/up_com/article/details/51218458).
由于我是双系统，直接从win10里面C:/Windows/Fonts/目录下面，将所有字体文件都复制下来到
>/home/shen/Downloads/font


再用cp命令：
>sudo cp -r /home/shen/Downloads/font /usr/share/fonts/


最后：
> sudo mkfontscale
sudo mkfontdir
sudo fc-cache -fv

##### 为浏览器安装安装flash插件

之前手动装过一次，最近提示过期，换了种方法安装，参考[这里](http://www.linuxidc.com/Linux/2016-05/131098.htm)

##### 标题栏实时显示上下行网速、CPU及内存使用率

>sudo add-apt-repository ppa:fossfreedom/indicator-sysmonitor
 sudo apt-get update
 sudo apt-get install indicator-sysmonitor

安装完成后，启动：

>indicator-sysmonitor

在General设置开机启动，并在Advance设置要显示的参数即可。

参考[这里](http://blog.csdn.net/tecn14/article/details/24489031)


##### 挽救`/boot`,清除image

Linux的内核是不断更新的，但是Ubuntu（debian也是）是不会自动清理之前的内核的，所以boot的空间就会慢慢堆满。

可以使用`df -h`来看下空间的使用情况。


查看已经安装的内核：

`sudo dpkg --get-selections |grep linux-image`

查看自己正在使用的内核：

`uname -a`

可以将比较早的删除，留下最近的几个，删除命令如下：

>sudo apt-get remove linux-image-4.4.0-57-generic
sudo apt-get remove linux-image-4.4.0-59-generic
sudo apt-get remove linux-image-extra-4.4.0-57-generic
sudo apt-get remove linux-image-extra-4.4.0-59-generic

>这里执行可能出现错误`E: Sub-process /usr/bin/dpkg returned an error code (1) `，可参考[这里](http://blog.csdn.net/qiaoji6073/article/details/76140146)解决。



有时候运行完上面的命令，再次查看已经安装的内核，会由原来的`install`变为`deinstall`,这时候可以将上面的`remove`换为`purge`清理下，如：

>sudo apt-get purge linux-image-4.4.0-57-generic


参考：

[解决Ubuntu 16.04下提示boot分区空间不足的办法](http://www.jb51.net/article/106976.htm)

[ubuntu16.04 LTS解决/boot空间不足 ](http://blog.csdn.net/wxyangid/article/details/53097208)

[/boot空间不足的解决办法 ](http://blog.csdn.net/qq_27818541/article/details/72675954)

##### 开机黑屏，光标闪烁

用的Win10+Ubuntu16.04, 在Win上卸载一些软件，删了一些文件后发现再去启动Ubuntu就黑屏了，只有左上角的光标在闪。查了下是引导出了问题，重新回去Win用EasyBcd添加引导就可以了。

##### 防火墙

首先是测试远程主机的端口是否开启：`telnet 192.168.1.103 80`
查看本地的端口开启情况： `sudo ufw status`
打开80端口： `sudo ufw allow 80`
防火墙开启： `sudo ufw enable`
防火墙重启： `sudo ufw reload`

##### 安装rpm文件

参考[这里](https://linuxize.com/post/install-rpm-packages-on-ubuntu/), 方法是利用alien将其转化为deb文件:

```
sudo apt-get install alien
#将rpm转换位deb，完成后会生成一个同名的xxxx.deb 
sudo alien xxxx.rpm
sudo dpkg -i xxxx.deb
```

##### 修改ubuntu自带截图的默认保存路径

1.安装dconf-editor：
 `sudo apt-get install dconf-tools`

2.打开系统自带搜索，搜dconf-editor打开

3.按照org->gnome->gnome-screenshot->auto-save-directory，修改value为需要的路径。

参考[这里](https://www.cnblogs.com/zhihaowu/p/8846479.html)

##### 增加用户

1. 终端执行：`adduser username`
2. 执行：`usermod -aG sudo username`（[Add the new user to the `sudo` group](https://linuxize.com/post/how-to-create-a-sudo-user-on-ubuntu/#3-add-the-new-user-to-the-sudo-group)）
   