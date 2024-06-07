# Paper

## Algorithms & Models

### 2014-Microsoft-Adtributor

Adtributor[@bhagwan2014adtributor]最早系统地提出利用根因分析对广告系统收入指标进行溯因，
其基于一个较强的假设：根因的指标来自于单个指标。

### 2016-Microsoft-iDice

iDice[@lin2016idice]对 Adtributor[@bhagwan2014adtributor]中的根因位于单个维度
的假定进行了放宽。在 iDice 中，允许根因是多个维度的组合。

### 2018-Baidu-HotSpot

HotSpot[@sun2018hotspot]指出多维根因分析的两个难点：单个指标的异常会传播导致该指标在不同层级的异常；
算法搜索空间过大，需要高效的搜索算法。针对这两个难点，论文给出了对应的解决方案：对于第一个异常传播的问题，提出了
一个新的指标 ripple effect 用于得分计算; 对于第二个问题采用蒙特卡洛搜索树 (Monte Carlo Tree Search) 和层次剪枝 (hierarchical pruning) 的方法
来实现更加高效的搜索。


### 2019-BizSeer-Squeeze

Squeeze[@li2019generic]提出 generalized ripple effect 和 generalized potential score,
同时可以更好地平衡搜索效率与精度。


### 2021-CAS-AutoRoot
AutoRoot[@jing2021autoroot]使用 daptive density clustering 来提升模型精度，
同时使用一种高效的过滤机制来提升搜索效率。

### 2022-Huawei-RiskLoc

RiskLoc[@kalander2022riskloc]通过加权的方式定义 risk score 来挖掘根因指标。

### 2022-Microsoft-CMMD

CMMD[@yan2022cmmd]主要由两个部分组成：
relationship modeling, 根据历史数据用 GNN 来构建指标之间的关联关系;
root cause localization, 使用遗传算法 (genetic algorithm) 来高效准确地定位根因。


