# Paper

## TS :heart: GPT

GPT的风还是吹到了Time Series，看到Nixtla和Google都在做一些相关的工作，这里就一起跟进一下。

### 2023-Nixtla-TimeGPT

!!! quote "Paper Abstract"

    In this paper, we introduce TimeGPT, the **first** foundation model for time series,
    capable of generating accurate predictions for diverse datasets not seen during
    training. We evaluate our pre-trained model against established statistical, machine learning,
    and deep learning methods, demonstrating that TimeGPT zero-shot
    inference excels in **performance, efficiency, and simplicity**.

简单来说，TimeGPT-1[@timegpt]是**第一个**发布的时间序列基础模型，专注于zero-shot的时序预测。
论文的Benchmark对比了统计学，(统计)机器学习和深度学习的方法，证明了TimeGPT的优越性。


这里注意摘要中提到说TimeGPT是在**performance, efficiency, and simplicity**方面都全面领先的，
这个是比较出乎意料的。首先，更好的performance是可以理解的，毕竟都上DL了，在标准数据集上跑分高还是能做的(1)。
但是在efficiency和simplicity上怎么能做到领先的呢？
{ .annotate }

1. 没错，言下之意就是在工业级的生产环境是很难跑到这个分数的，也很可能比其他统计学的方法更差。

首先是efficiency，论文提到TimeGPT在单个序列的GPU平均推理时间是0.6ms，与此同时一些统计学方法在的训练+推理的时间会达到
600ms, 其他像LGBM, LSTM这些方法平均每个序列的训练+推理时间为57ms，因此得出结论: TimeGPT比其他方法快好几个数量级。
Emmm...你要真这么比也不是不行:-) 不过0.6ms的推理时间确实是很快了，完全具有批量上生成环境的可能。

至于simplicity，文章没有提及很多。不过论文给出的模型架构确实很简单，基本就是Transformer原封不动拿过来用。

![](https://github.com/Nixtla/nixtla/raw/main/nbs/img/forecast_readme.png)

另外simplicity可能也是表现在使用方式上，Nixtla给出了调用TimeGPT的[SDK](https://github.com/Nixtla/nixtla)，
确实也是简单易用的:

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


### TODO: 2024-Google-TimesFM

A decoder-only foundation model for time-series forecasting[@timesfm]是Google发在ICML 2024
的一篇关于时序预测基础模型的文章。模型是在GitHub开源的: [google-research/timesfm](https://github.com/google-research/timesfm)。

