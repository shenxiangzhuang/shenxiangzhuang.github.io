---
title: 'Entropy'
description: '殊途同归的Entropy'
date: 2026-02-08
tags: ['AI', 'Information Theory']
authors: ['mathew']
draft: false
---

Entropy（熵）是信息论中的核心概念之一，它最初由香农（Claude Shannon）在 1948 年提出，用来量化系统的混乱程度或不确定性。

在学习熵的时候，我们常常从其定义开始：

$$
H(X) = -\sum_{i} P(x_i) \log P(x_i)
$$

其中，$P(x_i)$ 是随机变量 $X$ 取值为 $x_i$ 的概率。

在 $\log$ 取底为 2 的情况下，熵的单位是比特（bits）；而在 $\log$ 取底为自然数 $e$ 的情况下，熵的单位是纳特（nats）。无论使用哪种底数，熵的物理意义都是一样的：它衡量了系统的不确定性或混乱程度。


我们也会被给出一些直观的例子来理解熵，比如抛硬币、掷骰子等。比如对于一个公平的硬币，熵是 $\log_2 2 = 1$ bit：

$$
H(X) = -\left( \frac{1}{2} \log_2 \frac{1}{2} + \frac{1}{2} \log_2 \frac{1}{2} \right) = 1 \text{ bit}
$$


对于一个公平的六面骰子，熵是 $\log_2 6 \approx 2.585$ bits：

$$
H(X) = -\sum_{i=1}^{6} \frac{1}{6} \log_2 \frac{1}{6} = \log_2 6 \approx 2.585 \text{ bits}
$$

掷骰子的不确定性比抛硬币更大，因此熵也更高。

但是，为什么？为什么熵能够量化不确定性？为什么它的定义是这样的？
这个简洁优雅的公式从何而来？

解答这个问题，正是我们这篇文章的目标。
