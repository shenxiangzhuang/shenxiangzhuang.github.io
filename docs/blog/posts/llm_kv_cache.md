---
title: "LLM KV Cache: A Simple Implementation"
draft: false
date: 2025-05-12
authors: [mathew]
slug: llm_kv_cache
description: >
    介绍 LLM KV Cache 的原理和实现
categories:
  - 终身学习
  - LLM
---

## Introduction

在看很多大语言模型的推理代码时，发现有一个非常重要的概念，就是 KV Cache。
这里我们简要介绍一下 KV Cache 的核心原理并给出一个简单的代码实现。
相关的实验和测试代码同样开源在[toyllm](https://github.com/ai-glimpse/toyllm).

<!-- more -->

## What

- 全称是 Key-Value Cache
- 这里的 Key 和 Value 是 Transformer/Attention 中的 Key 和 Value
- 一种空间换时间的优化策略，主要是为了加速大语言模型推理速度
- 作用是缓存模型在推理过程中计算出的中间结果，以便在后续的推理中复用这些结果，从而减少计算量

## Why & How

现在 LLM 的核心架构是基于 Transformer 的 Decoder Only 结构，Transformer 的核心结构是基于 Attention 的，
而 Attention 的核心计算是基于`query`，`key`和`value`的矩阵运算。也就是说，KV Cache 主要用于加速 Attention 的计算，从而加速整个模型的推理速度。

让我们从数学上推导为什么需要 KV Cache。我们将**通过数学推导凸显 LLM 推理阶段原始 Attention 的重复计算问题**。在重复计算的问题被凸显出来之后，KV Cache 的实现原理也就显而易见了。下面的推导主要参考了 Lei Mao 的博客[Transformer Autoregressive Inference Optimization](https://leimao.github.io/article/Transformer-Autoregressive-Inference-Optimization/).


在自回归生成过程中，假设我们已经生成了 n 个 token，现在要生成第 n+1 个 token。在时间步 n，输入张量$X_n \in \mathbb{R}^{n \times d_{\text{model}}}$，其中$d_{\text{model}}$是模型的隐藏维度。通过线性变换，我们可以得到：

$$
\begin{align}
Q_n = X_n W^Q \in \mathbb{R}^{n \times d_k}
\end{align}
$$

$$
\begin{align}
K_n = X_n W^K \in \mathbb{R}^{n \times d_k}
\end{align}
$$

$$
\begin{align}
V_n = X_n W^V \in \mathbb{R}^{n \times d_v}
\end{align}
$$

其中$W^Q \in \mathbb{R}^{d_{\text{model}} \times d_k}$, $W^K \in \mathbb{R}^{d_{\text{model}} \times d_k}$, $W^V \in \mathbb{R}^{d_{\text{model}} \times d_v}$分别是 query、key、value 的权重矩阵。

我们将此时的 Attention 结果记为$Y_n$，则有：

$$
Y_n = \text{softmax}(\text{Mask}(\frac{Q_nK_n^T}{\sqrt{d_k}}))V_n
$$

在时间步 n+1，新的输入 token $x_{n+1} \in \mathbb{R}^{1 \times d_{\text{model}}}$进入模型，此时输入张量变为$X_{n+1} \in \mathbb{R}^{(n+1) \times d_{\text{model}}}$:

$$
\begin{align}
X_{n+1} = \left [
    \begin{array}{c|c}
        X_{n} \\
        x_{n+1} \\
    \end{array}
\right ]
\end{align}
$$

在时间步 n+1，我们需要计算 $Y_{n+1}$，其计算公式为：

$$
\begin{align}
Y_{n+1} = \text{softmax}(\text{Mask}(\frac{Q_{n+1}K_{n+1}^T}{\sqrt{d_k}}))V_{n+1}
\end{align}
$$

其中，

$$
\begin{align}
Q_{n+1}
&= X_{n+1} W^{Q} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} \\
        x_{n+1} \\
    \end{array}
\right ] W^{Q} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} W^{Q} \\
        x_{n+1} W^{Q} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
        Q_{n} \\
        q_{n+1} \\
    \end{array}
\right ] \\
\end{align}
$$

$$
\begin{align}
K_{n+1}
&= X_{n+1} W^{K} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} \\
        x_{n+1} \\
    \end{array}
\right ] W^{K} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} W^{K} \\
        x_{n+1} W^{K} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
        K_{n} \\
        k_{n+1} \\
    \end{array}
\right ] \\
\end{align}
$$

$$
\begin{align}
V_{n+1}
&= X_{n+1} W^{V} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} \\
        x_{n+1} \\
    \end{array}
\right ] W^{V} \\
&=
\left [
    \begin{array}{c|c}
        X_{n} W^{V} \\
        x_{n+1} W^{V} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
\end{align}
$$



$Y_{n+1}$的计算过程如下：

$$
\begin{align}
Y_{n+1}
&= \text{softmax} \left( \text{Mask} \left( \frac{ Q_{n+1} K_{n+1}^{\top}}{\sqrt{d_k}} \right) \right) V_{n+1} \\
&= \text{softmax} \left( \text{Mask} \left(
\frac{1}{\sqrt{d_k}}
\left [
    \begin{array}{c|c}
        Q_{n} \\
        q_{n+1} \\
    \end{array}
\right ]
\left [
    \begin{array}{c|c}
        K_{n} \\
        k_{n+1} \\
    \end{array}
\right ]^{\top} \right) \right)
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
&= \text{softmax} \left( \text{Mask} \left(
\frac{1}{\sqrt{d_k}}
\left [
    \begin{array}{c|c}
        Q_{n} \\
        q_{n+1} \\
    \end{array}
\right ]
\left [
    \begin{array}{c|c}
        K_{n}^{\top} & k_{n+1}^{\top} \\
    \end{array}
\right ] \right) \right)
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
&= \text{softmax} \left( \text{Mask} \left(
\frac{1}{\sqrt{d_k}}
\left [
    \begin{array}{c|c}
        Q_{n}K_{n}^{\top} & Q_{n}k_{n+1}^{\top} \\
        \hline
        q_{n+1}K_{n}^{\top} & q_{n+1}k_{n+1}^{\top} \\
    \end{array}
\right ]
\right) \right)
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
&= \text{softmax} \left(
\left [
    \begin{array}{c|c}
        \text{Mask} \left( \frac{1}{\sqrt{d_k}} Q_{n}K_{n}^{\top}\right) & -\infty \\
        \hline
        \frac{1}{\sqrt{d_k}} q_{n+1}K_{n}^{\top} & \frac{1}{\sqrt{d_k}} q_{n+1}k_{n+1}^{\top} \\
    \end{array}
\right ]
\right)
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
    \left [
        \begin{array}{c|c}
            \text{softmax} \left(\text{Mask} \left( \frac{1}{\sqrt{d_k}} Q_{n}K_{n}^{\top}\right) \right) & 0 \\
        \end{array}
    \right ] \\
    \hline
    \text{softmax}
    \left(
    \frac{1}{\sqrt{d_k}}q_{n+1}
        \left [
                \begin{array}{c|c}
                    K_{n}^{\top} & k_{n+1}^{\top} \\
                \end{array}
        \right ]
    \right) \\
    \end{array}
\right ]
\left [
    \begin{array}{c|c}
        V_{n} \\
        v_{n+1} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
        \text{softmax} \left(\text{Mask} \left( \frac{1}{\sqrt{d_k}} Q_{n}K_{n}^{\top}\right) \right) V_{n} \\
    \hline
    \text{softmax}
    \left(
        \frac{1}{\sqrt{d_k}}q_{n+1} K_{n+1}^{\top}
    \right) V_{n + 1} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
    Y_{n} \\
    \text{softmax}
    \left(
        \frac{1}{\sqrt{d_k}}q_{n+1} K_{n+1}^{\top}
    \right) V_{n + 1} \\
    \end{array}
\right ] \\
&=
\left [
    \begin{array}{c|c}
    Y_{n} \\
    y_{n+1} \\
    \end{array}
\right ] \\
\end{align}
$$

从上面的推导我们可以看到，$Y_{n+1}$可以分解为两部分：

1. 历史 token 的 attention 结果$Y_n$，这部分在时间步 n 已经计算过
2. 新 token 的 attention 结果$y_{n+1}$，这部分需要重新计算

可以看到，在从第 n 步到第 n+1 步的过程中，我们只需要计算新 token 的 attention 结果$y_{n+1}$，而$Y_n$已经计算过了，所以不需要重新计算。

在不使用 KV Cache 时，每次生成新 token 时，我们都需要：

1. 计算 attention 矩阵$Q_{n+1}K_{n+1}^T$，计算复杂度为$O(n^2)$
2. 对 n 个 token 重复这个过程，总计算复杂度为$O(n^3)$

**KV Cache 避免重复计算的方式是缓存数据和变更计算流程：缓存数据就是指缓存$K_n$和$V_n$，变更计算流程就是指在生成新 token 时，只需要计算新 token 的 query 与所有 key 的点积。前者避免了$K_n$和$V_n$的重复计算，后者避免了$Y_n$的重复计算**。

使用 KV Cache 后：

1. 计算 attention 矩阵时，只需要计算新 token 的 query 与所有 key 的点积，计算复杂度为$O(n)$
2. 对 n 个 token 重复这个过程，总计算复杂度为$O(n^2)$

这样，我们避免了重复计算，将计算复杂度从$O(n^3)$降低到了$O(n^2)$。这就是为什么 KV Cache 对于加速 LLM 推理如此重要。

## Code

代码的实现其实也很简单，首先我们来实现一个简单的 `KVCache` class：

```python
import torch
from torch import nn


class KVCache(nn.Module):
    """Standalone ``nn.Module`` containing a kv-cache to cache past key and values during inference.

    Args:
        batch_size (int): batch size model will be run with
        max_seq_len (int): maximum sequence length model will be run with
        num_kv_heads (int): number of key/value heads.
        head_dim (int): per-attention head embedding dimension
        dtype (torch.dtype): dtype for the caches
    """

    def __init__(
        self,
        batch_size: int,
        max_seq_len: int,
        num_kv_heads: int,
        head_dim: int,
        dtype: torch.dtype,
    ) -> None:
        super().__init__()
        cache_shape = (batch_size, num_kv_heads, max_seq_len, head_dim)
        self.register_buffer("k_cache", torch.zeros(cache_shape, dtype=dtype), persistent=False)
        self.register_buffer("v_cache", torch.zeros(cache_shape, dtype=dtype), persistent=False)
        self.batch_size = batch_size
        self.cache_pos = 0

    def reset(self) -> None:
        """Reset the cache to zero."""
        self.k_cache.zero_()
        self.v_cache.zero_()
        self.cache_pos = 0

    @property
    def size(self) -> int:
        return self.cache_pos

    def update(self, k_val: torch.Tensor, v_val: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """Update KV cache with the new ``k_val``, ``v_val`` and return the updated cache.

        Args:
            k_val (torch.Tensor): Current key tensor with shape [B, H, S, D]
            v_val (torch.Tensor): Current value tensor with shape [B, H, S, D]
        """
        bsz, _, seq_len, _ = k_val.shape
        if bsz > self.k_cache.shape[0]:
            raise ValueError(  # noqa: TRY003
                f"The current cache has been setup with a batch size of {self.k_cache.shape[0]}"  # noqa: EM102
                f", but found new key tensors with batch size {k_val.shape[0]}!"
            )
        assert (self.cache_pos + seq_len) <= self.k_cache.shape[2]  # noqa: S101
        k_out = self.k_cache
        v_out = self.v_cache
        k_out[:, :, self.cache_pos : self.cache_pos + seq_len] = k_val
        v_out[:, :, self.cache_pos : self.cache_pos + seq_len] = v_val
        # forward cache_pos seq_len positions along
        self.cache_pos += seq_len
        return k_out, v_out

```

??? note "如果你对这里的`register_buffer`有疑惑"

    简单来说，`register_buffer`可以使得我们在模型中注册一个持久化的buffer，这个buffer不会被视为模型的参数(自然也不会更新)。
    这里存在一个问题，那就是为什么要用`register_buffer`而不是直接用`self.k_cache = ...`呢？
    答案很简单，通过`register_buffer`注册的buffer可以随着`model.to(device)`的调用而自动转移到指定的设备上，而后一种方式则不会。

    >In essence, PyTorch buffers are tensor attributes associated with a PyTorch module or model similar to parameters,
    >but unlike parameters, buffers are not updated during training.

    >Buffers in PyTorch are particularly useful when dealing with GPU computations, as they need to be transferred
    >between devices (like from CPU to GPU) alongside the model's parameters. Unlike parameters, buffers do not require gradient computation, but they still need to be on the correct device to ensure that all computations are performed correctly.

    更多的细节可以参考以下链接：

    - [PyTorch register_buffer](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.register_buffer)

    - [LLMs-from-scratch explain](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch03/03_understanding-buffers/understanding-buffers.ipynb)

注意这里`KVCache`内部`cache`的维度：`cache_shape = (batch_size, num_kv_heads, max_seq_len, head_dim)`.
其中，`batch_size`是模型的 batch size，`num_kv_heads`是模型的 kv head 的数量，`max_seq_len`是模型的最大序列长度，`head_dim`是每个 kv head 的维度。
也就是说，这里会缓存**batch 中每个样本的每个 kv head 在每个位置上的 key 和 value(两者均为维度等于`head_dim`的向量)**。

`KVCache`的`update`方法会将当前的`k_val`和`v_val`更新到缓存中，并返回更新后的缓存。
更新时的操作也很简单，就是把当前的`k_val`和`v_val`更新到缓存中对应的位置上：

```python
k_out[:, :, self.cache_pos : self.cache_pos + seq_len] = k_val
v_out[:, :, self.cache_pos : self.cache_pos + seq_len] = v_val
self.cache_pos += seq_len
```

这里的`self.cache_pos`表示当前缓存的最后一个位置，`seq_len`表示当前输入的序列长度。
