---
title: 近期做开源项目的一些正反馈
draft: false
date: 2025-10-16
authors: [mathew]
slug: open_source_feedback
description: >
    近期在开源项目中获得的一些积极反馈和体会。
categories:
  - 随笔
---


和大家分享一下近期做开源项目收获的一些正反馈和自己的一些体会。


<!-- more -->


## 简单的小工具也能给地球上的某人带来大的帮助
 
去年写的一个Python画图显示中文的小工具 [zhplot](https://datahonor.com/blog/2024/12/08/zhplot/) 目前已经受到了64个Star.
我在知乎和V2EX上发布的帖子也受到了很多感谢，每当这个时候我就感到非常开心——我也从开始的小小白变得可以帮助别人了！
![](../images/open_source_thought/zhihu_zhplot.png)


也是去年写的一个BLEU计算库([bleuscore](https://datahonor.com/blog/2024/12/28/2024_summary/?h=bleu#bleuscore))，在前几天又收到Huggingface上的一条留言, 说之前写的帮助他将评估程序的运行时间从6个小时提升到半秒：

![](../images/open_source_thought/hf_comment.png)


正如之前我在推上写的感慨：网友的正反馈就像是魂游给谏言的点赞，可以加血，且加在地球online这个系统。


## 为工作中第一个复现的算法提交PR的感受

在从事时序异常检测相关工作时，我接触的第一个算法就是SPOT。
如果你正好看过我对[时序异常论文的一些总结](https://datahonor.com/odyssey/aiops/tsad/paper/)，就能知道我其实非常喜欢这个算法，也很敬佩这位作者：

>这位作者配得上匠人的称号。开源的第一版是用Cpp写的，后来大佬觉着用Cpp有点Overskill了，所以就用C(c99)重写了，然后连标准库也不依赖，我是真的respect。

我之前想用Rust写一个基于SPOT算法的时序异常算法，直接通过FFI调用这个C实现，一切都非常丝滑，直到在写WASM Binding的时候发现通过FFI调用C代码
写Binding非常麻烦(反正我是没玩明白)。但是我个人又很喜欢WASM，因为我觉着算法直接跑在浏览器很酷...所以我就把这个C库用Rust重写了，在AI的帮助下这个重写工作意外的轻松！同时在深入看C代码实现的时候还发现了一个比较关键的Bug，这个Bug会导致算法内部状态更新有问题，所以就提了个[PR](https://github.com/asiffer/libspot/pull/24)帮修了下——这是我人生中第一次提交C代码的PR。

从复现到魔改整个过程让我学到了很多东西，也让我对这个算法有了更深的理解。
如今能帮原作者贡献一些自己的力量，也是一种非常不错的体验。


## 我单纯地喜欢造轮子

我一向将费曼的那句"What I cannot create, I do not understand."奉为圭臬，所以多年以来我一直沉迷造轮子...从开始的[toyml](https://github.com/ai-glimpse/toyml)和[toydl](https://github.com/ai-glimpse/toydl)，到后来的[toyllm](https://github.com/ai-glimpse/toyllm), [toyrl](https://github.com/ai-glimpse/toyrl), 再到最近的[toynlp](https://github.com/ai-glimpse/toynlp)...这个过程中我学到了关于各类算法的大量知识。个人认为，能够架起数学到代码的桥梁，是迈过理论和现实鸿沟的关键一步。

我偶尔也会把这些复现的过程写成博客分享出来。之前写的两篇LLM算法复现的文章([LLM Speculative Sampling
](https://datahonor.com/blog/2025/03/08/llm_sps/), [LLM KV Cache: A Simple Implementation](https://datahonor.com/blog/2025/06/03/llm_kv_cache/))，其实就是toyllm项目的副产品。

同样地，这些代码也都或多或少地受到了一些好评并帮助了一些朋友。
比如下面和Sebastian(LLM from Scratch作者)的互动(当然这位大佬本身就很友善):

![](../images/open_source_thought/toyllm.png)

> 这老哥真的非常有趣且真诚...上次和大佬互动是5年前在深圳实习的时候，那个时候老哥回复我的issue说他在外面旅行，时间比较少hhh


## 最后

希望你也能在开源的道路上找到乐趣，收获成长。
