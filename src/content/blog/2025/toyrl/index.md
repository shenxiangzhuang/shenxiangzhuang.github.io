---
title: 'ToyRL: 从零实现深度强化学习算法'
description: 'ToyRL: 从零实现深度强化学习算法'
date: 2025-05-08
tags: ['项目', 'RL']
authors: ['mathew']
draft: false
---

## 简介

在看 LLM + RL 的一些论文时，发现对于一些 RL 概念 (比如 GAE) 的理解还是有所欠缺，
所以就系统地学习了一遍深度强化学习（Deep Reinforcement Learning）相关的知识。选的书是
[*Foundations of Deep Reinforcement Learning*](https://slm-lab.gitbook.io/slm-lab/publications-and-talks/instruction-for-the-book-+-intro-to-rl-section)[@drlbook].

在阅读过程中，将书中介绍的一些算法（REINFORCE、SARSA、DQN（Double DQN）、A2C、PPO）用 PyTorch 从头实现了一遍，统一整理到了开源库，
也就是今天要介绍的 [ToyRL](https://github.com/ai-glimpse/toyrl)。
为了更好地配合书一起学习，当前实现尽量贴近书中的伪代码。
另外每个算法实现都在一个 Python 文件内完成，虽然有些重复代码，但是避免了代码碎片化，更便于学习。

<!-- more -->

## ToyRL

如前所述，当前实现包含 5 个 DRL 领域经典的算法，每个算法的实现约 200~300 行 Python 代码，包含完整算法、训练代码及 wandb 集成等功能，
可以直接一键执行。
另外[ToyRL 的文档](https://ai-glimpse.github.io/toyrl/algorithms/reinforce/)放上了每个算法的伪代码便于梳理算法逻辑。


## 关于这本书

我个人是没什么 RL 背景的，但是在读这本书的时候基本很少遇到卡点，一路读下来非常的顺畅。
另外我个人觉着这本书安排的顺序非常好，首先介绍 REINFORCE，让读者可以从最直观的角度感受到 DRL 是什么，是通过什么形式在解决什么问题。
之后介绍 SARSA 和 DQN，更进一步地介绍 DRL 一些核心的问题和解决方案。最后介绍 A2C 和 PPO，让大家明白结合多种方式的算法可以更加高效。
另外，作为一本相对偏代码实现的书，这本书在数学上的推导也是非常完备的，这点真是难能可贵。

这本书在 Amazon 上的评价总体也是比较好的。要说有不好的地方，就是除了 REINFORCE 之外，
其他算法的实现都是通过作者自己写的一个库来介绍的——只给出了一些片段。
作者写的这个库做了很多复用，主要是方便做实验，但是代码太碎了，扒拉半天也找不出一个算法完整实现，所以学习起来并不是很友好。
这也是我写 ToyRL 的一个主要的原因。不过总的来说，这仍然是一本不错的书。


## 最后

过去几周阅读这本书并编写这个库的过程，对我来说是一段非常奇妙的知识探索之旅，在学到很多知识的同时真正体验到了 RL 美妙之处。
希望这本书和这个项目也能对大家有所帮助！
