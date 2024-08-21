---
title: Dawid-Skene算法
draft: true
date: 2024-08-21
authors: [mathew]
slug: ds
description: >
    记录下最近逛开源社区的体会
categories:
  - 算法
  - 开源
---

# Dawid-Skene算法

介绍Dawid-Skene算法(下称DS算法)的原理和工程实现。

## 简介

Dawid-Skene算法最早是应用于临床医学相关的领域，
用于处理多个专家对同一个问题的判断结果。
后来被广泛应用于数据标注领域的标签聚合(真值推断, truth inference)，
用于从同一个问题的多个标注结果中推断出最可靠的标签。

<!-- more -->

## 算法原理
DS算法是一种基于EM算法的标签聚合算法，我们先简要介绍EM算法的原理，然后再介绍DS算法的细节。

### EM算法推导
*The Expectation Maximization Algorithm: A short tutorial*[@borman2004em]
给出了一个极为详细的EM算法推导。

### Dawid-Skene算法推导
*Maximum likelihood estimation of observer error-rates using the EM algorithm*[@dawid1979maximum]
是DS算法的原始论文，给出了DS算法的推导。


## 工程实现
以
[crowd-kit](https://github.com/Toloka/crowd-kit/blob/main/crowdkit/aggregation/classification/dawid_skene.py)
的实现代码为例。
先简要介绍DS算法核心的实现，然后重点介绍两个算法优化点的具体实现。

### 核心算法实现

```python linenums="1" hl_lines="11 15 16 22 26 27"
class DawidSkene(BaseClassificationAggregator):
    # 省略部分代码
    def fit(
        self,
        data: pd.DataFrame,
        true_labels: Optional["pd.Series[Any]"] = None,
        initial_error: Optional[pd.DataFrame] = None,
    ) -> "DawidSkene":
        # 省略部分代码
        # Initialization
        probas = MajorityVote().fit_predict_proba(data)  # (1)
        # correct the probas by true_labels
        if true_labels is not None:
            probas = self._correct_probas_with_golden(probas, true_labels)
        priors = probas.mean()  # (2)
        errors = self._m_step(data, probas, initial_error, self.initial_error_strategy)  # (3)
        loss = -np.inf
        self.loss_history_ = []

        # Updating proba and errors n_iter times
        for _ in range(self.n_iter):
            probas = self._e_step(data, priors, errors)  # (4)
            # correct the probas by true_labels
            if true_labels is not None:
                probas = self._correct_probas_with_golden(probas, true_labels)
            priors = probas.mean()  # (5)
            errors = self._m_step(data, probas)  # (6)
            new_loss = self._evidence_lower_bound(data, probas, priors, errors) / len(
                data
            )
            self.loss_history_.append(new_loss)

            if new_loss - loss < self.tol:
                break
            loss = new_loss
        # 省略部分代码
```

1.  `MajorityVote`是一个简单的多数投票算法，用于初始化标签的概率分布。
2.  `priors`是标签的先验概率。
3.  `errors`是worker标注的confusion matrix。
4.  EM算法的E步: 根据标注数据`data`，标签的先验分布`prioir`和worker的混淆矩阵`errors`来更新标签的概率分布。
5.  更新标签的先验概率。
6.  EM算法的M步: 根据标注数据`data`和标签的概率分布`probas`来更新worker的混淆矩阵`errors`。


### 算法优化
这里做的优化主要有两处，分别对应DS算法中两个缺失的参数：
标签的先验分布`priors`和标注人员的混淆矩阵`errors`。

#### 金标题修正标签先验分布
那么如果在数据集中有一些题目的真值标签(即为金标题)，我们如何利用上这部分信息让推断更加准确呢？
通过上面的代码可以看到，在没有真值标签的情况下，`priors`的初始值是通过多数投票算法得到的。
这里我们可以通过这些真值标签来修正`priors`。

!!! note "PR链接"

    [#109: ds support golden question](https://github.com/Toloka/crowd-kit/pull/109/files)


```python linenums="1" hl_lines="13-14 24-25"
class DawidSkene(BaseClassificationAggregator):
    # 省略部分代码
    def fit(
        self,
        data: pd.DataFrame,
        true_labels: Optional["pd.Series[Any]"] = None,
        initial_error: Optional[pd.DataFrame] = None,
    ) -> "DawidSkene":
        # 省略部分代码
        # Initialization
        probas = MajorityVote().fit_predict_proba(data)
        # correct the probas by true_labels  # (1)
        if true_labels is not None:
            probas = self._correct_probas_with_golden(probas, true_labels)
        priors = probas.mean()
        errors = self._m_step(data, probas, initial_error, self.initial_error_strategy)  # (3)
        loss = -np.inf
        self.loss_history_ = []

        # Updating proba and errors n_iter times
        for _ in range(self.n_iter):
            probas = self._e_step(data, priors, errors)
            # correct the probas by true_labels  # (2)
            if true_labels is not None:
                probas = self._correct_probas_with_golden(probas, true_labels)
            priors = probas.mean()
        # 省略部分代码
```

1.  `self._correct_probas_with_golden`是一个修正标签概率分布的函数，用于根据金标题真值标签修正标签的概率分布。这里是修正初始化的标签概率分布。
2. 在每次迭代中，都会根据金标题真值标签修正标签的概率分布。

#### 历史混淆矩阵修正worker混淆矩阵
在工业界的标注平台中，会对平台内的worker构建详细的用户画像用于刻画worker的能力。
比如我们可以通过用户历史的做题记录来构建worker的历史混淆矩阵。

那么我们如何利用这些历史数据来让推断更加准确呢？
通过上面的代码可以看到，在没有历史混淆矩阵的情况下，`errors`的初始值是将多数投票的结果作为真值算出来的。
这里我们可以通过这些历史混淆矩阵来修正`errors`。
