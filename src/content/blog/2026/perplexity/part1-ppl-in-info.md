---
title: '信息论中的Perplexity'
description: '从Entropy到Perplexity的推导之旅'
date: 2026-02-08
tags: ['AI', 'NLP']
authors: ['mathew']
draft: false
order: 1
---

## 熵 (Entropy)

$$
H(X) = -\sum_{i} P(x_i) \log P(x_i)
$$



## 交叉熵 (Cross-Entropy)：认知的代价

在现实中，我们往往不知道真实的马匹胜率 $P(x)$。博彩公司会根据经验估计出一个概率分布 $Q(x)$（即**模型分布**）。

当我们制定编码策略时，我们只能基于**我们的认知 $Q$** 来设定长度：我们认为 $x$ 发生的概率是 $Q(x)$，所以我们给它分配长度为 $-\log Q(x)$ 的代码。

但是，**现实是残酷的**。实际比赛的结果是按照**真实分布 $P(x)$** 发生的。

于是，实际的平均传输长度就变成了：

$$
H(P, Q) = \sum_{x} \underbrace{P(x)}_{\text{Reality}} \cdot \underbrace{\left( -\log_2 Q(x) \right)}_{\text{Our Strategy}}
$$

这就是 **交叉熵**。

如果我们猜对了（$Q=P$），那么交叉熵等于熵（$H(P,Q) = H(P)$），我们达到了理论最优。
如果我们猜错了（比如还是那个偏斜的赛马局，但我们误判为所有马胜率相等），我们就会给“马1”分配 3 bit (000)，而不是 1 bit (0)。

这中间的差值，就是 **KL 散度（Relative Entropy）**，即**无知/误判带来的额外代价**：

$$
H(P, Q) = H(P) + D_{KL}(P || Q)
$$

## 困惑度 (Perplexity)：从比特回归选项

在这个漫长的旅程最后，我们终于来到了 **Perplexity (PPL)**。

作为人类，我们对“比特”其实很不敏感。
- “这个模型的熵是 2 bit。” —— 听起来没什么感觉。
- “这个模型的熵是 5 bit。” —— 比上面那个大，但大多少？

Fred Jelinek 等人提出的 PPL，旨在把抽象的“比特数”还原回直观的“**选项数**”:

$$
\text{PPL} = 2^{H(P, Q)} \quad (\text{或者 } e^{H(P, Q)})
$$

