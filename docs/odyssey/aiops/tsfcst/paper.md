# Paper

## Time Series Forecasting Statistical Methods

### 2017-Facebook-Prophet


### 2023-AntGroup-AntTS

*AntTS*[@antts]是蚂蚁根据自己的业务场景开发的一个时间序列预测框架，重点考虑 Treatment 存在时的时序预测问题。
AntTS 要解决的问题是如何充分利用 microscopic time series 的信息来精确预测 macroscopic time series，
同时考虑 Treatment 对 microscopic time series 的影响。

AntTS 框架核心分为三个部分：Clustering Module, Natural Forecasting Module 和 Effect Module.
首先是 Clustering Module。大致的流程是先将 microscopic time series 通过 Clustering Module 进行聚类，得到一系列的 cluster，

之后是 Natural Forecasting Module。这个模块对每个 cluster 内的 microscopic time series 进行时序建模，得到 cluster 内的预测结果。
对各个 cluster 的预测结果进行整合，得到 macroscopic time series 的之后是 Natural 预测结果。

最后是针对 Treatment 的 Effect Module。这个模块主要是考虑 Treatment 对 microscopic time series 的影响。
通过对同一个 cluster 内的 microscopic time series 进行 Treatment 的分析，得到 Treatment 对当前 cluster 预期的影响值，
聚合各个 cluster 的影响值，得到 Effect Module 的预测结果。
最终的 macroscopic time series 预测结果是 Natural 预测结果加上 Effect Module 的预测结果。

整体来说，AntTS的几个值得借鉴的地方在于：

1. 三个模块的划分十分清晰，每个模块的功能和输入输出都很明确，且模块预测结果保持"可加"的性质，使得整个系统更加透明，整体结果的可解释性也比较强。
2. Clustering Module 的设计其实是一个综合下来比较适合落地的方案：避免直接对macroscopic time series建模使得无法使用microscopic time series的信息；
同时避免直接对microscopic time series建模带来的波动过大和计算复杂度问题。
先聚类之后在类内进行预测的方式使得模型既能够更好地利用微观时间序列的信息，提高预测的准确性；
又能够降低预测单个microscopic time series带来的误差，降低预测的波动性。
3. Effect Module的设计足够直观且具有说服力。


## TS :heart: GPT

GPT 的风还是吹到了 Time Series，看到 Nixtla 和 Google 都在做一些相关的工作，这里就一起跟进一下。

### 2023-Nixtla-TimeGPT

!!! quote "Paper Abstract"

    In this paper, we introduce TimeGPT, the **first** foundation model for time series,
    capable of generating accurate predictions for diverse datasets not seen during
    training. We evaluate our pre-trained model against established statistical, machine learning,
    and deep learning methods, demonstrating that TimeGPT zero-shot
    inference excels in **performance, efficiency, and simplicity**.

简单来说，TimeGPT-1[@timegpt]是**第一个**发布的时间序列基础模型，专注于 zero-shot 的时序预测。
论文的 Benchmark 对比了统计学，(统计) 机器学习和深度学习的方法，证明了 TimeGPT 的优越性。


这里注意摘要中提到说 TimeGPT 是在**performance, efficiency, and simplicity**方面都全面领先的，
这个是比较出乎意料的。首先，更好的 performance 是可以理解的，毕竟都上 DL 了，在标准数据集上跑分高还是能做的 (1)。
但是在 efficiency 和 simplicity 上怎么能做到领先的呢？
{ .annotate }

1. 没错，言下之意就是在工业级的生产环境是很难跑到这个分数的，也很可能比其他统计学的方法更差。

首先是 efficiency，论文提到 TimeGPT 在单个序列的 GPU 平均推理时间是 0.6ms，与此同时一些统计学方法在的训练 + 推理的时间会达到
600ms, 其他像 LGBM, LSTM 这些方法平均每个序列的训练 + 推理时间为 57ms，因此得出结论：TimeGPT 比其他方法快好几个数量级。
Emmm...你要真这么比也不是不行:-) 不过 0.6ms 的推理时间确实是很快了，完全具有批量上生成环境的可能。

至于 simplicity，文章没有提及很多。不过论文给出的模型架构确实很简单，基本就是 Transformer 原封不动拿过来用。

![](https://github.com/Nixtla/nixtla/raw/main/nbs/img/forecast_readme.png)

另外 simplicity 可能也是表现在使用方式上，Nixtla 给出了调用 TimeGPT 的[SDK](https://github.com/Nixtla/nixtla)，
确实也是简单易用的：

```python
import pandas as pd
from nixtla import NixtlaClient


# Get your API Key at dashboard.nixtla.io

# 1. Instantiate the NixtlaClient
nixtla_client = NixtlaClient(api_key = 'YOUR API KEY HERE')

# 2. Read historic electricity demand data
df = pd.read_csv('https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/electricity-short.csv')

# 3. Forecast the next 24 hours
fcst_df = nixtla_client.forecast(df, h=24, level=[80, 90])

# 4. Plot your results (optional)
nixtla_client.plot(df, timegpt_fcst_df, time_col='timestamp', target_col='value', level=[80, 90])

```
![](https://github.com/Nixtla/nixtla/raw/main/nbs/img/forecast.png)


论文目前透露的信息不太多，模型也是闭源的。等后面有更多的信息放出来或者有相关开源的模型时，还是值得尝试一下效果的。

### TODO: 2024-Salesforce-MOIRAI
*Unified Training of Universal Time Series Forecasting Transformers*[@woo2024unified]

### TODO: 2024-CMU-MOMENT
*MOMENT: A Family of Open Time-series Foundation Models*[@goswami2024moment]

### TODO: 2024-Amazon-Chronos

*Chronos: Learning the Language of Time Series*[@ansari2024chronos]


### 2024-Google-TimesFM

A decoder-only foundation model for time-series forecasting[@timesfm]是 Google 发在 ICML 2024
的一篇关于时序预测基础模型的文章。
模型在 GitHub 开源：[google-research/timesfm](https://github.com/google-research/timesfm)。


论文要解决的问题和 TimeGPT 是基本一致的 (1), 主要也是 zero-shot 时间序列的预测问题。
这篇文章给出的信息还是非常充分的，尤其是在数据预处理和模型架构上做的微小调整。
{ .annotate }

1. 论文中也提到了："To the best of our knowledge, the very
recent work in TimeGPT-1is the only other parallel work on a zero-shot foundation model for time-series
forecasting. However the model is not public access, and several model details and the benchmark dataset have not
been revealed."

在数据预处理部分，TimesFM 是围绕 patch 展开的。这里的 patch，其实就是一段时序数据。
patch 的思想很简单，也是经过之前很多工作验证过的，这使得用 patch 来对标 NLP 里面的 Token 显得更加合理 (1)。
另外介绍了关于 patch 的 masking 和窗口的处理，这些都是为了提高模型的泛化能力，也是比较有意思的部分。
{ .annotate }

1. 这里的 patch 和 NLP 里面的 Token 是很相似的，只不过这里 patch 是时序数据的一段，而 Token 是文本的一段。
另外，时间序列任务上拿单个时间点作为输入，就类似 NLP 中用 character 做输入，会损失很多信息。
所以这里用 patch 来对应 token 是很自然且合理的。

在模型架构方面，TimesFM 是一个 decoder-only 的模型，这个和 TimeGPT 是一样的。模型的架构也是比较类似，如下：
![](./images/timesfm.png)

总的来说，TimesFM 的工作是提供了一个时序预训练模型的基础，且其表现至少在 benchmark 上是很好的，
是可以考虑在生产环境做进一步尝试的。
