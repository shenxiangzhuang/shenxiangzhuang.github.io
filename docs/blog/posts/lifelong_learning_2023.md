---
title: 终身学习:2023
draft: false
date: 2024-02-07
authors: [mathew]
slug: lifelong-2023
description: >
    终身学习！
categories:
  - General
---

# 终身学习: 2023

!!! tip "终身学习(Lifelong learning)"

    Lifelong learning is the "ongoing, voluntary, and self-motivated"
    pursuit of knowledge for either personal or professional reasons.[^1]


本文主要是过去一年的学习记录，内容较为杂乱，主要是为备忘。

<!-- more -->

## 个人项目进展

单独建了个[Project](https://datahonor.com/project/)页面，主要是记录一些个人项目的进展。
这些项目有些从2020年就开始了，有些是最近才开始的。这里主要记录下这些项目的一些进展。

!!! note "[Py]S-ESD: Seasonal Extreme Studentized Deviate(S-ESD) in Python."

    [shenxiangzhuang/pysesd](https://github.com/shenxiangzhuang/pysesd)是
    今年写的一个TSAD领域经典算法的Python实现。

    目前已经完成了基本的算法实现和测试，可以直接`pip install pysesd`一键启动:-)

!!! note "MPPT: A Modern Python Package Template"

    [shenxiangzhuang/mppt](https://github.com/shenxiangzhuang/mppt)
    是一个Python库的模板，也是一个简单的小项目，最初是为了在团队内做工程实践的分享。
    项目主要介绍现代Python库的一些最佳实践，包括项目结构、文档、测试、发布等。

    目前已经完成了基本的模板，后续会不断更新完善，可能会考虑加一些CLI来支持模版动态生成。

!!! note "Toys: ToyData -> ToyML -> ToyDL"

    - [ToyData](https://github.com/shenxiangzhuang/toydata):
    ToyData是ToyX系列的第一个项目，主要是用Python来实现一些经典的数据结构，比如链表、树、图等。
    这个项目是2019年为了学习数据结构和算法写的(2023年并未实际投入，列举用于说明ToyX系列项目初衷)，
    在这个造轮子的过程中我发现自己对数据结构和算法的理解更加深入了。
    正如Feynman's所言: "What I cannot create, I do not understand" —— 这也是ToyML和ToyDL项目的初衷，
    本质上是用于Education的工具。

    - [ToyML](https://github.com/shenxiangzhuang/toyml):
    ToyML是ToyX系列的第二个项目，主要是用Python来实现一些经典的机器学习算法，比如线性回归、逻辑回归、决策树等。
    目前是实现了Clustering: DBSCAN, Hierarchical(Agnes&Diana), Kmeans; Classification: KNN; Ensemble: Boosting(AdaBoost).
    (2023年也没投入，仅仅是因为强迫症，不写这里很难受)

    - [ToyDL](https://github.com/shenxiangzhuang/toydl):
    ToyDL是ToyX系列的第三个项目，主要是用Python来实现一些经典的深度学习算法。
    这个项目的核心部分是在2023年完成，目前还是一个简单的深度学习引擎,
    只实现了最基本的前向传播和反向传播(自动微分)。项目本身是收mini-torch的启发，
    也是用于自身学习DL的工具。目前项目已经可以跑通XOR等简单的例子，
    后续重点的方向**不是**让项目更加完善，
    而是让项目更加简单，更加易懂，让Torch不再黑盒。(免杠声明: 我是自己在开始学习
    用pytorch的时候对自动微分十分迷惑，所以才学上了mini-torch的课，学完后发现
    仍然没有理解地很透彻才开始写ToyDL :-)

!!! note "[Beer: Fifty challenging problems in probability](https://github.com/shenxiangzhuang/beer)"

    受George E. P. Box的[the Monday night beer and statistics sessions](https://news.wisc.edu/renowned-statistician-george-box-dies-at-93/)影响，
    一直想记录一些概率论/统计学相关的有趣问题，让其他领域的朋友们也能感受下概率统计的魅力。
    恰逢看到*Fifty challenging problems in probability*这本书，所以就有了这个项目。
    项目本身是一个简单的概率论/统计学的问题集，目前已经写了*Fifty challenging problems in probability*的前六个问题的答案解析，后续会不断更新。
    这里更新比较慢的原因是每道题目的工序都比较长: 翻译成中文，推导出解析解，给出(甚至多种)编程模拟求解方案。
    希望后续能有更多的朋友参与进来，一起来解决这些有趣的问题。

!!! note "[LLM: Calvino's Invisible Cities](https://calvino.datahonor.com/)"

    卡尔维诺(Italo Calvino), 一位意大利作家，他的作品《看不见的城市》是我非常喜欢的一本书。
    书中描述了55个虚构的城市，项目用DALL·E 3生成了这55个城市的图片。
    部分城市的生成结果大大地超出了我的预期，只能用惊艳来形容。比如下图给出的**轻盈的城市之珍诺比亚**。

    严格来说这是我写的第一个前端项目，用的是练习时长两个月半的TypeScript/React/NextJs.


![Thin/Zenodia](https://datahonor-1252464519.cos.ap-beijing-1.myqcloud.com/calvino/public/city/thin/zenodia.png)


## Blog迁移
在2022年底将博客([datahonor.com](https://datahonor.com))从Hexo迁移到了MkDocs，主要是Hexo用起来要装很多插件，
然后一些插件的更新后会导致博客无法正常生成，又发现MkDocs强大的工程和简单的使用，所以决定迁移。

MkDocs + GitHub Page是目前采取的方案，非常的方便。全部的代码和资料都在GitHub上，
更新发布等流程可以全部在GitHub完成。

## 工作漫游
工作漫游([Career Odyssey](https://datahonor.com/careerodyssey/))
是我在2023年开始的一个系列，主要是工作中接触到的一些算法领域的学习积累，
一般分为学术论文解读和实际工程应用两个部分[^2]。

### [AIOps: TSAD & RCA](https://datahonor.com/odyssey/aiops/)

!!! note "TSAD(Time Series Anomaly Detection)"

    时间序列异常检测是之前主要的工作方向，在
    [TASD/Paper](https://datahonor.com/odyssey/aiops/tsad/paper/)部分，
    记录了目前工业界(主要)和学术界的一些时间序列异常检测的论文解读，
    并对一些关键算法给出落地实践时的一些思考。

    目前将总体分为了四个部分: Review/Systems/Algorithms/Evaluation.
    其中Review就是介绍了几篇综述论文，Evaluation主要是记录了一些评价指标和评价方法。
    比较重要的是Systems和Algorithms部分，
    这两部分选择的Paper大多都是出自工业界大厂(Twitter/Amazon/IBM/Miscrosoft/Salesforce等),
    对落地实践具有非常大的参考意义。另外这里分为了两个部分: 一个是System部分，这部分的论文更加
    偏重时序异常检测的算法体系或通用框架，另一个是Algorithms部分，这部分的论文更加偏重于算法本身的细节。
    当然这两部分的论文都是有交叉的，但是这样分开有助于更好的理解和学习。


!!! note "RCA(Root Cause Analysis)"

    根因分析([RCA/paper](https://datahonor.com/odyssey/aiops/rca/paper/))是在TSAD的基础上的一个延伸，
    主要是在异常检测的基础上进一步做故障的根因分析。这方面的论文没有特别繁杂，
    整体的脉络相对比较清晰，但是因为问题本身的复杂性，实际落地的时候会更加困难。
    工作中曾经POC过一些通用的RCA算法(大致是基于Event Stream的Frequent Pattern Mining)，
    但是由于实际的数据和场景的复杂性，效果并不是很好，
    感觉实际落地中还是要根据具体领域细分做专门化的处理才可以达到比较好的效果。

TSAD和RCA一直是AIOps的热点，在开源社区也有很多讨论和实践。
TSAD就不用说了，在[TSAD/Paper](https://datahonor.com/odyssey/aiops/tsad/paper/)
部分已经充分介绍了开源社区丰富的工具和算法。RCA这块目前开源社区的讨论和实践相对较少，
目前跟过的主要就是Salesforce的[PyRCA](https://github.com/salesforce/PyRCA),
不过目前看PyRCA距离落地显然还有很多工作要做。


另外提下一个孵化中的项目
[SkyAPM/aiops-engine-for-skywalking: an incubating repository of the Apache SkyWalking AIOps Engine](https://github.com/SkyAPM/aiops-engine-for-skywalking)。
项目中算法的选型和我个人的一些实践经验非常吻合，可以明显看出项目是真心想做工业级的落地。
可惜的是不知道为什么项目已经很久不更新了，如果后续有机会的话还是希望能为这个项目做一些贡献的。


### Data Centric AI: Crowdsourcing

另外就是一些近期的工作，主要是在Data Centric AI方面的一些工作。
Data Centric AI是一个很大的领域，目前接触比较多的还是在Crowdsourcing方面。
在[CHC/Paper](https://datahonor.com/odyssey/chc/paper/)里面列出了一些
Crowdsourcing相关的论文，以Label Aggregation方面的论文为主，
其他是Data Labeling系统在落地实践中需要的其他各类算法。

### MLOps & LLM
MLOps和LLM的水都太深了，还在慢慢趟...接下来一年会有一些关于MLOps和LLM的学习积累。

## Software Engineering

最近工作做数据工程和后端开发比较多，所以也在学习一些软件工程的知识，
记录在[Software Engineering](https://datahonor.com/se/)。
目前主要是Backend/Python的一些学习积累。

## Rust & Elixir

Rust+Wasm+ML/DL和Elixir+Agent是我认为后续会有很大发展空间的方向，
所以最近也在学习这两门语言。

在Rust方面主要是看了看基础的语法， 另外在工作中尝试了下用Axum写后端API，虽然写起来慢一些(相比Python，用的FastAPI)，
但是性能确实是吊打Python的。

在Elixir方面主要是看了看基础的语法，之后就主要学习Phoenix和LiveView了。
不得不说通过Elixir学习Actor Model真的是非常有趣，也非常有启发性。
Phoenix和LiveView也是足够先进和强大的Web框架，非常值得学习。

在2024年个人的[Lifelong Learning Milestones](https://github.com/users/shenxiangzhuang/projects/3/views/5)中，
也将两门语言的学习作为了一个重要部分，希望今年能多一些实践，做一些有趣的项目。

## 未完待续
还有些更加细碎的内容等后续补充吧...


[^1]: [https://en.wikipedia.org/wiki/Lifelong_learning](https://en.wikipedia.org/wiki/Lifelong_learning)
[^2]: 目前只是在逻辑上大致分为两个部分，工业落地实践和论文分析评论放在一起，还没有完全拆分出来。

