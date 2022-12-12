---
title: VsCode使用记录
type: categories
copyright: true
date: 2019-06-21 14:59:05
tags:
- Tips
categories:
- Tips

---

#### Remote-SSH（Visual Studio Code Insiders）

开始的时候用总是出错，错误类似[Remote-SSH not working](https://github.com/microsoft/vscode/issues/73382), 之后根据[这里](https://code.visualstudio.com/docs/remote/troubleshooting#_quick-start-ssh-key)进行修改，即运行`ssh-copy-id your-user-name-on-host@host-fqdn-or-ip-goes-here`（host]和ip换成自己的）。之后还是出错，再根据同一个issue下的方法，在`settings.json`设置`"remote.SSH.showLoginTerminal": true`

#### code-runner配置python解释器

设置`"code-runner.executorMap"`参数为python解释器地址即可。

> ps: 运行默认快捷键 Ctrl+Alt+N



#### Python Linting and pep8

在打开pep8的时候，在`class`内部使用`annotation`会有如下报错：`E701: multiple statements on one line (colon)`（如[这里](https://stackoverflow.com/questions/49774397/flake-8-multiple-statements-on-one-line-colon-only-for-variable-name-starti)），，这时候可以设置`python.linting.pep8Args`来进行修正，即忽略此错误。在`settings.json`添加

`"python.linting.pep8Args": ["--ignore=E701"]`即可。