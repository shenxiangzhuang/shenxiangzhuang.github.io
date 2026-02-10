---
title: 'NLP中的Perplexity'
description: '引入 NLP：从分布到序列'
date: 2026-02-08
tags: ['AI', 'NLP']
authors: ['mathew']
draft: false
order: 2
---


## 历史：Jelinek 的贡献

Perplexity 并不是一开始就生长在 NLP 里的。它是在 1970 年代末被引入语音识别（Automatic Speech Recognition, ASR）领域的。這一概念最早可以追溯到 IBM T.J. Watson 研究中心的经典工作：

> **Paper:** [Jelinek, F., Mercer, R. L., Bahl, L. R., & Baker, J. K. (1977). *Perplexity—a measure of the difficulty of speech recognition tasks.*](https://asa.scitation.org/doi/abs/10.1121/1.2016299)

**核心动机：解耦。**
当时，研究人员主要关注词错率（WER）。但这不仅取决于**语言模型**（预测下一个词的能力），还取决于**声学模型**（听清声音的能力）。Fred Jelinek 等人提出 PPL，旨在衡量**语言任务本身的难度**，从而能独立地优化和评估语言模型。


## 定义样本空间与分布

为了复用第一章的数学工具，我们需要明确 $P$ 和 $Q$ 到底是在什么东西上的分布。关键在于视角的转换：**不要把单个“词”看作样本，要把“整句话”看作一个独立的随机事件。**

*   **样本空间 (Support)**：
    假设我们要处理长度为 $N$ 的序列。我们的随机变量 $X$ 就是**整个序列**。
    因此，样本空间 $\Omega$ 就是由**所有可能的长度为 $N$ 的词序列**构成的集合。
    *   **玩具例子**：设词表 $V=\{A, B\}$，长度 $N=2$。那么样本空间就是
        $$
        \Omega = \{AA, AB, BA, BB\}
        $$
        测试语料只是其中一种组合，比如 $W=AB$。

*   **模型分布 $Q(W)$ (联合概率)**：
    模型 $Q$ 本质上是一个**定义在序列空间 $\Omega$ 上的联合分布**，目标是给出整句话 $W$ 出现的概率 $Q(W)$。
    直接对从 $\Omega$ 中采样出的整句建模是非常困难的（维度爆炸）。因此，在 NLP 中我们利用**概率链式法则 (Chain Rule)** 将同一个联合分布“按前缀条件化”拆解为一串条件概率：
    $$
    Q(W) = Q(w_1) \cdot Q(w_2 | w_1) \cdot ... \cdot Q(w_N | w_{<N}) = \prod_{i=1}^N Q(w_i | w_{<i})
    $$

    **玩具例子对应**：
    对 $W=AB$，有
    $$
    Q(AB) = Q(A) \cdot Q(B|A)
    $$

    形式上，这些条件概率都来自同一个联合分布：
    $$
    Q(w_i | w_{<i}) = \frac{Q(w_1, ..., w_i)}{Q(w_1, ..., w_{i-1})}
    $$
    这里的 $Q(w_1, ..., w_i)$ 不是“改了输入长度”，而是**对同一联合分布的边缘化**。更直观的写法是：
    $$
    Q(w_{\le i}) = \sum_{w_{i+1} \in V} \sum_{w_{i+2} \in V} \cdots \sum_{w_N \in V} Q(w_1, w_2, ..., w_N)
    $$

    **玩具例子对应**：
    $$
    Q(A) = Q(AA) + Q(AB)
    $$
    因此
    $$
    Q(B|A) = \frac{Q(AB)}{Q(A)} = \frac{Q(AB)}{Q(AA) + Q(AB)}
    $$

    也就是说，把“后续所有可能的词”都加总起来，就得到“前缀发生”的概率。
    因此，$Q$ 始终是定义在“整句”上的分布；$Q(w_i | w_{<i})$ 只是把同一个 $Q$ 对后续位置求和后，再按前缀条件化得到的视角。

    **玩具例子小结**：
    对 $V=\{A,B\}, N=2$ 来说，联合分布 $Q(AA), Q(AB), Q(BA), Q(BB)$ 就是模型的“全貌”。
    从这四个数可以得到前缀边缘 $Q(A)=Q(AA)+Q(AB)$，再得到条件概率 $Q(B|A)$，最后通过链式法则还原回 $Q(AB)$。

*   **真实分布 $P(W)$**：
    这是自然语言的客观真理。实际中我们无法直接获得它。
    但在**评估阶段**，我们拥有一组真实语料（Test Corpus）。

    常见做法是用**经验分布 (Empirical Distribution)** 近似真实分布。为了突出推导的主干，我们先用单个样本 $W_{obs}$ 说明：
    $$
    P(W) = \begin{cases} 1 & \text{if } W = W_{obs} \\ 0 & \text{other} \end{cases}
    $$
    在真实评估中，我们对整个测试集取平均，形式上只是在求和里加入更多样本而已，推导不变。

## 推导序列的交叉熵

回到第一章的交叉熵定义：
$$
H(P, Q) = -\sum_{W \in \Omega} P(W) \log Q(W)
$$

将我们定义的序列分布代入：
由于 $P(W)$ 仅在测试集 $W_{obs}$ 处为 1，其余为 0，求和符合瞬间简化为一项：
$$
H(P, Q) = -1 \cdot \log Q(W_{obs}) = -\log Q(W_{obs})
$$

这就是整个序列的总惊诧度。

## 从总熵到“每个词的平均熵”

但是，总惊诧度与序列长度 $N$ 正相关。如果不做归一化，长句子的 Loss 永远比短句子大。
为了衡量模型在**“单个词”**层面的平均预测能力，我们需要计算**每个 Token 的平均交叉熵**（Average Cross Entropy per Token）：

$$
H_{\text{avg}}(P, Q) = \frac{1}{N} H(P, Q) = -\frac{1}{N} \log Q(W_{obs})
$$

利用 $\log$ 的性质展开 $Q(W_{obs})$：
$$
H_{\text{avg}}(P, Q) = -\frac{1}{N} \sum_{i=1}^{N} \log Q(w_i | w_{<i})
$$

这正是我们在训练代码中经常看到的 `CrossEntropyLoss`。

## 定义 NLP 中的 PPL

现在，逻辑闭环了。
既然 $PP = e^{H(P,Q)}$，那么在 NLP 中，我们同样使用平均熵的指数形式：

$$
\text{PPL} = e^{H_{\text{avg}}(P, Q)} = e^{-\frac{1}{N} \sum_{i=1}^{N} \log Q(w_i | w_{<i})}
$$

这个推导过程清楚地表明：**Perplexity 就是测试集在模型下的“平均负对数似然”的指数形式。**

**直观理解 (Wikipedia 视角)：**
如 [Wikipedia](https://en.wikipedia.org/wiki/Perplexity) 所述，利用对数性质，该公式等价于模型对正确词预测概率倒数的几何平均：
$$
\text{PPL} = \sqrt[N]{\prod_{i=1}^{N} \frac{1}{Q(w_i | w_{<i})}}
$$

这正是我们在训练时优化的 **Cross Entropy Loss**（即每一个 Token 损失的算术平均值）。

因此，我们在训练日志中看到的 Loss 与 PPL 存在着最简单的指数关系：

$$
\text{PPL} = e^{\text{Loss}}
$$

*(注：这里的 Loss 需基于自然对数 $e$ 计算；如果是以 2 为底，则是 $2^{\text{Loss}}$)*

## 物理意义：平均候选词数

在语言模型中，PPL 表示**“模型在每一步预测时，平均以为有多少个合理的候选词”**。

- **PPL = 100**：模型在预测下一个词时，就像是在 100 个词里随机瞎猜一样迷茫。
- **PPL = 1**：模型完全确定下一个词是什么。

**举例**：
句子："The cat sat on the [mat]"。
- **模型 A** 预测 "mat" 的概率是 0.1。$PPL \approx 1/0.1 = 10$。
- **模型 B** 预测 "mat" 的概率是 0.5。$PPL \approx 1/0.5 = 2$。

模型 B 的 PPL 更低，说明它更确定，也就是更好。

