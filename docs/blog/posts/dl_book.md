---
title: 深度学习与大语言模型书籍推荐
draft: false
date: 2025-02-20
authors: [mathew]
slug: dl_book
description: >
    深度学习书籍推荐。
categories:
  - 随笔
  - 终身学习
---

## 前言

之前在朋友圈/推特上推荐的几本NLP/LLM的书大家都比较喜欢，这里为了方便大家查阅，统一整理了一下，
同时也发在公众号上方便大家收藏查阅。

## 大语言模型三剑客

### Build a Large Language Model (From Scratch)

<figure markdown="span">
  ![](../images/dl_book/llm_rom_scratch.png){ width="800" }
</figure>

如果说本期所有的书只推荐一本的话，我会推荐这一本。
这是真正教你从零开始构建GPT模型的书。全书以GPT-2模型为例，用PyTorch从头实现了GPT-2模型网络，
对Tokenizer，Embedding，Transformer等部分都做了极为详细的介绍。
同时载入OpenAI开源的GPT-2模型的权重以验证当前实现的正确性。

因为GPT-2模型很小，所以即使是8G的显卡也能跑得动(没显卡用CPU跑也不会太慢)，非常适合新手入门。
书籍相关代码开源在GitHub(4万Star), 也是很好的学习资料: [https://github.com/rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch).
我强烈建议大家跟着仓库内的直到一步一步跑一遍代码，这样会对LLM的原理有更深刻的理解。
比如我自己在学习的时候就将代码进行了一些整理并封装成一个Python库，有兴趣的可以参考看下: [https://github.com/ai-glimpse/toyllm](https://github.com/ai-glimpse/toyllm).


### Super Study Guide: Transformers & Large Language Models

<figure markdown="span">
  ![](../images/dl_book/super_llm.png){ width="800" }
</figure>

如果你只想快速了解LLM相关的**理论知识**，那么这本书可能是目前最好的一本。
本书虽然没什么代码供读者去实践，但是对NLP/Transformer/LLM的核心概念都给出了非常简明的介绍， 可以让读者快速建立对LLM理论的认知。
另外本书有大量的图表来帮助读者理解，对于理解Transformer的原理和LLM的训练过程非常有帮助。

这本书远虽然没有上面 *Build a Large Language Model (From Scratch)* 有名，但是论内容，我认为这本是有过之而无不及的。

### Natural Language Processing with Transformers


<figure markdown="span">
  ![](../images/dl_book/nlp_with_transformer.png){ width="800" }
</figure>

上面两本书都是直接面向LLM的书，也都是2024年的新书。
如果你和我一样没什么NLP的基础，那么这本书可能更适合你作为入门的第一本书。

本书从NLP的基础知识开始讲起，依托Huggingface的transformer库对NLP&Transformer模型做了非常详尽的介绍。
书中提供了很多的代码用例，适合初学者夯实基础。

