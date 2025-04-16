---
title: "LLM KV Cache: A Simple Implementation"
draft: false
date: 2025-04-16
authors: [mathew]
slug: llm_kv_cache
description: >
    LLM KV Cache 代码实现
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

- KV Cache 的全称是 Key-Value Cache
- KV Cache 是一种用于加速大语言模型推理的技术
- KV Cache 是一种空间换时间的优化策略，主要是为了加速模型的推理速度
- KV Cache 的作用是缓存模型在推理过程中计算出的中间结果，以便在后续的推理中复用这些结果，从而减少计算量

## Why

在大语言模型中，推理过程通常涉及大量的计算和内存访问。每次输入时，模型都需要重新计算所有的中间结果，这会导致性能瓶颈。
LLM KV Cache 通过缓存这些中间结果，可以显著减少计算量，提高推理速度。

TODO: 给出一个例子，说明在不做 KV Cache 的情况下，模型推理存在重复计算的问题。

## How

TODO: 说明 KV Cache 是通过缓存来减少计算量的

## Talk is Cheap

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


