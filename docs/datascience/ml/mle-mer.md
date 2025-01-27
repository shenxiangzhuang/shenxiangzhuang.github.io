---
date: 2017-03-03 13:39:39
---


李航老师《统计学习方法》第一章笔记——经验风险最小化推导极大似然估计

题目：当模型是条件概率分布，损失函数是对数损失函数时，经验风险最小化就等价于极大似然估计

## 预备知识

### 统计学习三要素

模型的假设空间，模型选择的标准以及模型学习的算法是统计学习方法的三要素。

简记为：方法 = 模型 + 策略 + 算法



### 损失函数

在模型的假设空间，我们要确定一定的准则来确定模型的好坏，即我们需要确定一定的策略三要素之一去衡量，所以我们引入了损失函数 loss function 或代价函数 cost function.

损失函数有很多种，例如 0-1 损失函数，平方损失函数等，这里我们要用的是对数损失函数。

$$
L(Y, P(Y | X)) = - \log P(Y | X)
$$


### 风险函数

选定损失函数后，其值越小，模型就越好。模型的输入与输出 $(X, Y)$ 是随机变量，遵循联合分布 $P(X, Y)$，所以损失函数的期望为：

$$
R_{exp} = E_p[L(Y, f(X))] = \int_{X \times Y} L(y, f(x))P(x, y)dxdy
$$

这就是风险函数 risk function 或 期望损失 expected loss, 其代表理论上模型$f(X)$ 关于联合分布 $P(X, Y)$的平均意义下的损失。



### 经验风险

关于有监督学习的病态问题 ill-formed problem: 一方面，根据最小化风险函数确立最优的的模型需要联合分布 $P(X, Y)$，另一方面此联合分布又是未知的。

我们想到用样本估计整体，为此我们引入经验风险 empirical risk 或经验损失 empirical loss：

$$
R_{emp}(f) = \frac{1}{N}\sum_{i=1}^{N}L(y_i, f(x_i))
$$

其中，定义训练集为：

$$
T = \{(x_1, y_1), (x_2, y_2), \cdots , (x_N, y_N)\}
$$

根据大数定律，在样本量 N 趋向于无穷时， $R_{emp}(f)$趋于$R_{exp}(f)$. 当然实际上标注好的样本一般达不到要求，所以效果不太好，这时我们可以引入关于模型复杂度的罚项来纠正，这里暂时不展开讨论。


### 极大似然估计


## 证明

设$x_1, x_2, \cdots , x_n$为独立同分布 i.i.d., independent and identically distributed 的样本，$\theta$为模型参数，$f$为我们使用的模型。

由 i.i.d.:

$$
f(x_1, x_2, \cdots, x_n) = f(x_1|\theta)\times f(x_2|\theta)\times \cdots \times f(x_n|\theta)
$$

而实际上我们已知$x_1, x_2, \cdots , x_n$, 未知的是，$\theta$，故似然定义为：

$$
L(\theta|x_1, x_2, \cdots , x_n) = f(x_1, x_2, \cdots , x_n|\theta) = \coprod_{i=1}^{n}f(x_i|\theta)
$$

此为样本发生可能性的大小，而极大似然估计的核心即为，以使得当前样本发生概率最大时的参数$\hat{\theta}$作为真实参数$\theta$的一个估计值。所以此时我们要求的是$L(\theta|x_1, x_2, \cdots , x_n)$取得最大值时$\theta$的值，即为$\hat{\theta}$。即问题转化为求$L(\theta|x_1, x_2, \cdots , x_n)$的极值问题。自然想到导数，而由于连乘的存在，可利用对数函数单调递增的性质，两边取对数再求导，可以简化计算。

$$
\ln{L(\theta|x_1, x_2, \cdots, x_n)} = \sum_{i=1}^{n}\ln{f(x_i|\theta)}
$$

上式即为对数似然，而一般而言的最大似然中的似然指的是对数平均似然$$\hat{l}$$，即为：

$$
\hat{l} = \frac{1}{n}\ln{L}
$$

整理得：

$$
\hat{\theta} = \mathop{\arg\max}_{\theta\epsilon R^n}\hat{l}(\theta|x_1, x_2, \cdots, x_n)
$$

看到，极大似然估计即为：

$$
max\frac{1}{n}\sum_{i=1}^{n}\ln{f(x_i|\theta)}
$$

即：

$$
min\frac{1}{n}\sum_{i=1}^{n}-\ln{f(x_i|\theta)}
$$

而经验风险最小化公式为：

$$
\mathop{\arg\min}_{f\epsilon F}\frac{1}{N}\sum_{i=1}^{N}L(y_i, f(x_i))
$$

所以，在模型为条件概率分布模型，损失函数是对数损失函数$L(Y, P(Y | X)) = - \log P(Y | X)$时，经验风险最小化就等价于极大似然估计

证毕。



