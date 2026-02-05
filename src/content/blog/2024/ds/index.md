---
title: 'Dawid-Skene 算法'
description: '对标签聚合算法 (真值推断) Dawid-Skene 算法进行一些较为深入讨论。所谓标签聚合算法，是指从多个标注者的标注结果中推断出最可靠的标签。'
date: 2024-08-21
tags: ['技术', '算法']
authors: ['mathew']
draft: false
---

# Dawid-Skene 算法

![](./images/ds_position.png)

Lilian 在[Thinking about High-Quality Human Data | Lil'Log](https://lilianweng.github.io/posts/2024-02-05-human-data-quality/)
对数据标注的质量进行了一些很有远见的讨论。
这里我们主要对标签聚合算法 (真值推断) Dawid-Skene 算法进行一些较为深入讨论。

所谓标签聚合算法，是指从多个标注者的标注结果中推断出最可靠的标签。

## 简介

Dawid-Skene 算法最早是应用于临床医学相关的领域，
用于聚合多个临床专家对同一个病人的的判断结果。
后来被广泛应用于数据标注领域，用于聚合多个标注结果得到最可靠的标签。

<!-- more -->

## 算法原理
![DS 算法的概率图模型](https://tlk.s3.yandex.net/crowd-kit/docs/ds_llm.png)
*Image source: Crowd-Kit*

DS 算法是一种基于 EM 算法的标签聚合算法，我们先简要介绍 EM 算法的原理，然后再介绍 DS 算法的细节。

### EM 算法推导
*The Expectation Maximization Algorithm: A short tutorial*[@borman2004em]
给出了一个极为详细的 EM 算法推导。

> **Note: Read the paper right now!**
>
>
> <iframe src="./pdf/em_algo_intro.pdf" title="The Expectation Maximization Algorithm" style="min-height:100vh;width:100%"></iframe>
>
>
### Dawid-Skene 算法推导
*Maximum likelihood estimation of observer error-rates using the EM algorithm*[@dawid1979maximum]
是 DS 算法的原始论文，给出了 DS 算法的推导。

> **Note: Read the paper right now!**
>
>
> <iframe src="./pdf/ds_paper.pdf" title="Maximum likelihood estimation of observer error-rates using the EM algorithm" style="min-height:100vh;width:100%"></iframe>
>
>
论文本身的推导过程还算比较完善的，不过省略了较为关键的极大似然估计的推导过程，也就是通过
**式 2.2**:

$$
L = \prod_{i=1}^I \prod_{j=1}^J \left\{p_j \prod_{k=1}^K \prod_{l=1}^J (\pi_{jl}^{(k)})^{n_{il}^{(k)}}\right\}^{T_{ij}}
$$

推导出**式 2.3**:

$$
\hat{\pi}_{jl}^{(k)} = \frac{\sum_{i} T_{ij} n_{il}^{(k)}}{\sum_{l} \sum_{i} T_{ij} n_{il}^{(k)}}
$$

和**式 2.4**:

$$
\hat{p}_j = \frac{\sum_{i} T_{ij}}{I}
$$

所谓极大似然估计，就是先定义一个似然函数$L$，然后通过求解$L$的极值来求解参数，
这里求解的关键其实是通过 Lagrange 乘子法 (Lagrange multiplier) 来求解。
因为要求解的参数 $\pi_{jl}^{(k)}$ 和 $p_j$ 都是概率，所以需要满足概率的约束条件，
我们用 Lagrange 乘子法来满足这个约束条件。
这里我们主要介绍 $\pi_{jl}^{(k)}$ 的推导过程，$p_j$ 的推导过程类似。

因为这里的$L$的形式存在多个乘积，所以我们可以通过对数似然函数来简化计算。

$$
\ln L = \sum_{i=1}^I \sum_{j=1}^J T_{ij} \left[\ln p_j + \sum_{k=1}^K \sum_{l=1}^J n_{il}^{(k)} \ln \pi_{jl}^{(k)}\right]
$$

作为概率的估计，$\pi_{jl}^{(k)}$的约束条件是：

$$
\sum_{l=1}^J \pi_{jl}^{(k)} = 1 \quad \text{for all } j \text{ and } k
$$

综合以上条件，我们可以得到 Lagrange 函数：

$$
\mathcal{L} = \ln L + \sum_{j=1}^J \sum_{k=1}^K \lambda_{jk} \left(1 - \sum_{l=1}^J \pi_{jl}^{(k)}\right)
$$

通过对 $\pi_{jl}^{(k)}$ 求偏导，我们可以得到：

$$
\frac{\partial \mathcal{L}}{\partial \pi_{jl}^{(k)}} = \frac{\partial}{\partial \pi_{jl}^{(k)}} \left[\sum_{i=1}^I \sum_{j=1}^J T_{ij} \sum_{k=1}^K \sum_{l=1}^J n_{il}^{(k)} \ln \pi_{jl}^{(k)} - \sum_{j=1}^J \sum_{k=1}^K \lambda_{jk} \sum_{l=1}^J \pi_{jl}^{(k)}\right]
$$

化简后得到：

$$
\frac{\partial \mathcal{L}}{\partial \pi_{jl}^{(k)}} = \frac{\partial}{\partial \pi_{jl}^{(k)}} \left[\sum_{i=1}^I T_{ij} n_{il}^{(k)} \ln \pi_{jl}^{(k)} - \lambda_{jk}  \pi_{jl}^{(k)}\right] = \sum_{i=1}^I T_{ij} \frac{n_{il}^{(k)}}{\pi_{jl}^{(k)}} - \lambda_{jk}
$$

将上式置为 0，我们可以得到：

$$
\sum_{i=1}^I T_{ij} \frac{n_{il}^{(k)}}{\pi_{jl}^{(k)}} - \lambda_{jk} = 0
$$

调整一下顺序，将 $\pi_{jl}^{(k)}$ 隔离出来，我们可以得到：

$$
\sum_{i=1}^I T_{ij} n_{il}^{(k)} = \lambda_{jk} \pi_{jl}^{(k)}
$$

利用约束条件来消除 $\pi_{jl}^{(k)}$ 以求解 $\lambda_{jk}$，这里通过两边同时按照 $l$ 求和：

$$
\sum_{l=1}^J \sum_{i=1}^I T_{ij} n_{il}^{(k)} = \lambda_{jk} \sum_{l=1}^J \pi_{jl}^{(k)} = \lambda_{jk}
$$

根据上述两式，我们可以得到最终的 $\pi_{jl}^{(k)}$ 的极大似然估计，也就是**式 2.3**：

$$
\hat{\pi}_{jl}^{(k)} = \frac{\sum_{i} T_{ij} n_{il}^{(k)}}{\sum_{l} \sum_{i} T_{ij} n_{il}^{(k)}}
$$

至此，我们完成了 $\pi_{jl}^{(k)}$ 的推导，$p_j$ 的推导过程类似，这里不再赘述。


## 工程实现
以
[crowd-kit](https://github.com/Toloka/crowd-kit/blob/main/crowdkit/aggregation/classification/dawid_skene.py)
的实现代码为例。
先简要介绍 DS 算法核心的实现，然后重点介绍两个算法优化点的具体实现。

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
3.  `errors`是 worker 标注的 confusion matrix。
4.  EM 算法的 E 步：根据标注数据`data`，标签的先验分布`prioir`和 worker 的混淆矩阵`errors`来更新标签的概率分布。
5.  更新标签的先验概率。
6.  EM 算法的 M 步：根据标注数据`data`和标签的概率分布`probas`来更新 worker 的混淆矩阵`errors`。


### 算法优化
这里做的优化主要有两处，分别对应 DS 算法中两个缺失的参数：
标签的先验分布`priors`和标注人员的混淆矩阵`errors`。

#### 金标题修正标签先验分布
那么如果在数据集中有一些题目的真值标签 (即为金标题)，我们如何利用上这部分信息让推断更加准确呢？
通过上面的代码可以看到，在没有真值标签的情况下，`priors`的初始值是通过多数投票算法得到的。
这里我们可以通过这些真值标签来修正`priors`。

!!! note "PR 链接"

    [#109: ds support golden question](https://github.com/Toloka/crowd-kit/pull/109)


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

#### 能力画像修正混淆矩阵
在工业界的标注平台中，会对平台内的 worker 构建详细的用户画像用于刻画 worker 的能力。
比如我们可以通过用户历史的做题记录来构建 worker 的历史混淆矩阵。

那么我们如何利用这些历史数据来让推断更加准确呢？
通过上面的代码可以看到，在没有历史混淆矩阵的情况下，`errors`的初始值是将多数投票的结果作为真值算出来的。
这里我们可以通过这些历史混淆矩阵来修正`errors`。

!!! note "PR 链接"

    [#114: add init_error for worker init error matrix](https://github.com/Toloka/crowd-kit/pull/114)


```python linenums="1" hl_lines="3 9 18"
class DawidSkene(BaseClassificationAggregator):
    # 省略部分代码
    initial_error_strategy: Optional[Literal["assign", "addition"]] = attr.ib(default=None)  # (1)
    # 省略部分代码
    def fit(
        self,
        data: pd.DataFrame,
        true_labels: Optional["pd.Series[Any]"] = None,
        initial_error: Optional[pd.DataFrame] = None,  # (2)
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
        # 省略部分代码
```

1.  `initial_error_strategy`是一个初始化 worker 混淆矩阵的策略，可以是`assign`或者`addition`。
2.  `initial_error`是 worker 混淆矩阵的初始值，可以是历史混淆矩阵。
3.   仅仅在初始化 worker 混淆矩阵时，才会使用`initial_error`。

通过上面的实现可以到历史混淆矩阵仅仅影响 worker 混淆矩阵的初始化，而不会影响后续的迭代更新。
算法的逻辑是在`_m_step`内部通过一行的函数调用实现：

!!! tip "保持核心代码的整洁"

    这里通过函数调用的方式，使得核心代码的逻辑更加清晰(保证可读性)，也方便后续的维护和扩展。


```python linenums="1" hl_lines="18"
class DawidSkene(BaseClassificationAggregator):
    # 省略部分代码
    @staticmethod
    def _m_step(
        data: pd.DataFrame,
        probas: pd.DataFrame,
        initial_error: Optional[pd.DataFrame] = None,
        initial_error_strategy: Optional[Literal["assign", "addition"]] = None,
    ) -> pd.DataFrame:
        """Performs M-step of the Dawid-Skene algorithm.

        Estimates the workers' error probability matrix using the specified workers' responses and the true task label probabilities.
        """
        joined = data.join(probas, on="task")
        joined.drop(columns=["task"], inplace=True)
        errors = joined.groupby(["worker", "label"], sort=False).sum()
        # Apply the initial error matrix
        errors = initial_error_apply(errors, initial_error, initial_error_strategy)
        # Normalize the error matrix
        errors.clip(lower=_EPS, inplace=True)
        errors /= errors.groupby("worker", sort=False).sum()

        return errors
```

简单来说，我们通过上游的两个参数`initial_error`和`initial_error_strategy`，
在`initial_error_apply`函数来修正 worker 混淆矩阵的初始化。
从下面的代码可以看到，这种设计方式可以使得`initial_error_apply`函数是一个纯函数，不会对外部的状态产生影响。


```python linenums="1" hl_lines="9 14-17 23-26 31-32"
def initial_error_apply(
    errors: pd.DataFrame,
    initial_error: Optional[pd.DataFrame],
    initial_error_strategy: Optional[Literal["assign", "addition"]],
) -> pd.DataFrame:
    if initial_error_strategy is None or initial_error is None:
        return errors
    # check the index names of initial_error
    if initial_error.index.names != errors.index.names:  # (1)
        raise ValueError(
            f"The index of initial_error must be: {errors.index.names},"
            f"but got: {initial_error.index.names}"
        )
    if initial_error_strategy == "assign":
        # check the completeness of initial_error: all the workers in data should be in initial_error
        mask = errors.index.isin(initial_error.index)
        if not mask.all():  # (2)
            not_found_workers = errors.index[~mask].get_level_values("worker").unique()
            raise ValueError(
                f"All the workers in data should be in initial_error: "
                f"Can not find {len(not_found_workers)} workers' error matrix in initial_error"
            )
        # if the values in initial_error are probability, check the sum of each worker's error matrix
        if (initial_error <= 1.0).all().all() and not np.allclose(
            initial_error.groupby("worker", sort=False).sum(), 1.0
        ):  # (3)
            raise ValueError(
                "The sum of each worker's error matrix in initial_error should be 1.0"
            )
        errors = initial_error
    elif initial_error_strategy == "addition":  # (4)
        errors = errors.add(initial_error, axis="index", fill_value=0.0)
    else:
        raise ValueError(
            f"Invalid initial_error_strategy: {initial_error_strategy},"
            f"should be 'assign' or 'addition'"
        )
    return errors
```

1.  保证`initial_error`的 index 和`errors`的 index 一致，方便后续的计算。
2.  赋值策略下，因为是完全替换掉原有的 worker 混淆矩阵，所以需要保证`initial_error`中包含了所有的 worker 混淆矩阵。
3.  赋值策略下，是允许混淆矩阵是 count 或者 probability 的。如果检查到传入的混淆矩阵是 probability，需要保证混淆矩阵的合法性。
4.  加法策略下，是将传入的混淆矩阵加到原有的混淆矩阵上。注意，这里需要保证传入的混淆矩阵的值为 count 而不是 probability
    (这点在[文档](https://crowd-kit.readthedocs.io/en/latest/classification/#crowdkit.aggregation.classification.DawidSkene.initial_error_strategy)
    做了特别说明)。

