---
title: 开源体会
draft: false
date: 2023-11-01
authors: [mathew]
slug: open-source-related
description: >
    记录下最近逛开源社区的体会
categories:
  - General
---


# 开源体会

记录下最近逛开源社区的体会

<!-- more -->

## 大部分社区都很友好
对于反馈的问题基本都能够收到及时有效的反馈。

???+ example "mlxtend"

    - [https://github.com/rasbt/mlxtend/issues/706](https://github.com/rasbt/mlxtend/issues/706)
    - [https://github.com/rasbt/mlxtend/issues/709](https://github.com/rasbt/mlxtend/issues/709)


## 修复文档的PR是必要的
之前认为修复文档的PR太“小”了，
所以遇到的一些小的关于文档问题都是自己解决了完事，也不会去提PR做修复。

但是这种想法有些太局限了。对于参与项目的开发者来说，代码就是全部的信息，
只需要去看代码就可以了解到自己想要的信息(大部分情况来说)；
但是对于不参与代码贡献的用户(占大对数)来说，**文档就是全部**，这是他们了解项目的唯一途径。
修复文档中的一些小的问题，可以让后续的用户避免产生同样的疑问，
从而节省用户些许时间。

???+ example "wasmtime, crowd-kit, rabbitmq-tutorials"

    - [https://github.com/bytecodealliance/wasmtime/pull/7214](https://github.com/bytecodealliance/wasmtime/pull/7214)
    - [https://github.com/Toloka/crowd-kit/pull/81](https://github.com/Toloka/crowd-kit/pull/81)
    - [https://github.com/rabbitmq/rabbitmq-tutorials/pull/366](https://github.com/rabbitmq/rabbitmq-tutorials/pull/366)

## 是否有更好的解决方案？
有时候我们看到代码存在的问题并给出修复的PR后，在沟通中会发现
我们给出的这个修复只解决了部分问题。这是一种很好的体验，即让我们
自己认识到对项目认识的不足，也让我们能够跳出自己习惯的思维模式，
学习这种更全面解决问题的方式。

???+ example "mkdocs_macros_plugin"

    - [https://github.com/fralau/mkdocs_macros_plugin/issues/186](https://github.com/fralau/mkdocs_macros_plugin/issues/186)

## 项目在不同阶段有不同的权衡
比如在项目早期不需要过于关注性能，而在项目后期则需要考虑性能问题。
类似的这种权衡是很值得学习。

???+ example "aiops-engine-for-skywalking"

    - [https://github.com/SkyAPM/aiops-engine-for-skywalking/issues/5](https://github.com/SkyAPM/aiops-engine-for-skywalking/issues/5)
