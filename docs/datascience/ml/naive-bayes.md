---
date: 2017-03-03 12:38:48
---

李航老师，《统计学习方法》第四章笔记，朴素贝叶斯算法实现。
## 算法原理

### 极大似然估计
![](http://dataimage-1252464519.costj.myqcloud.com/images/%E7%BB%9F%E8%AE%A1%E5%AD%A6%E4%B9%A0%E6%96%B9%E6%B3%95/ch4/Screenshot%20from%202017-03-03%2012-38-53.png)

### 贝叶斯估计

![](http://dataimage-1252464519.costj.myqcloud.com/images/%E7%BB%9F%E8%AE%A1%E5%AD%A6%E4%B9%A0%E6%96%B9%E6%B3%95/ch4/Screenshot%20from%202017-03-03%2012-46-57.png)

如上所述，在lambda = 0时，贝叶斯估计就等价于极大似然估计。

## Python实现
这里数据集用的是[数字手写体](http://download.csdn.net/detail/zouxy09/6610571).

### 手动实现算法
```python
import os
import time
import pandas as pd
import numpy as np


## 处理单个txt文件, 将文件转化为1-d数组
def img2vector(filename):
    rows = 32
    cols = 32
    imgVector = np.zeros((1, rows * cols))
    fileIn = open(filename)
    for row in range(rows):
        lineStr = fileIn.readline()
        for col in range(cols):
            imgVector[0, row * 32 + col] = int(lineStr[col])
    fileIn.close()
    return imgVector


# 获取训练集
def get_training_sample():
    os.chdir('/home/shen/PycharmProjects/MyPython/统计学习方法/Naive Bayes/digits/trainingDigits')
    files = os.listdir()
    numSamples = len(files)
    train_x = np.zeros((numSamples, 1024))
    train_y = []
    for i in range(numSamples):
        filename = files[i]
        yi = int(filename.split('_')[0])
        xi = img2vector(filename)

        train_x[i, :] = xi
        train_y.append(yi)

    return train_x, train_y


# 获取测试集
def get_test_sample():
    os.chdir('/home/shen/PycharmProjects/MyPython/统计学习方法/Naive Bayes/digits/testDigits')
    files = os.listdir()
    numSamples = len(files)
    test_x = np.zeros((numSamples, 1024))
    test_y = []
    for i in range(numSamples):
        filename = files[i]
        yi = int(filename.split('_')[0])
        xi = img2vector(filename)

        test_x[i, :] = xi
        test_y.append(yi)

    return test_x, test_y


# 核心训练算法
def get_train_x_yi(train_x, train_y, yi):
    if yi == 0:
        train_x_yi = train_x[train_y == np.zeros(len(train_y))]

    else:
        train_x_yi = train_x[train_y == np.ones(len(train_y)) * yi]

    x_equal_1 = (train_x_yi.sum(axis=0)+lamda)/ (len(train_x_yi)+len(train_x_yi[0])*lamda)
    x_equal_0 = np.ones(len(x_equal_1)) - x_equal_1
    x_prec = np.vstack((x_equal_0, x_equal_1))

    return x_prec


def train(train_x, train_y):
    # 根据需要，构造合适的结构
    # [[0, [{0:p0, 1:p1}, {...}, {...},...{...}]], [1, [...]], [...], ...]
    train_result = list(range(0, 10))
    for i in train_result:
        train_result[i] = [0, [{} for i in range(32 * 32)]]

    N = len(train_y)
    unique_yi, counts_yi = np.unique(train_y, return_counts=True)
    prec_yi = (counts_yi+lamda) / (len(train_y)+len(unique_yi)*lamda)
    for i in range(len(prec_yi)):
        train_result[i][0] = list(prec_yi)[i]
    # yi = dict(zip(unique_yi, prec_yi))

    for y in range(10):
        x_prec = get_train_x_yi(train_x, train_y, y)

        for xi in range(len(x_prec[0])):
            train_result[y][1][xi][0] = x_prec[0][xi]
            train_result[y][1][xi][1] = x_prec[1][xi]

    return train_result

# 对测试集进行预测
def predict(test_x, test_y, train_result):
    true_pre = 0
    for i in range(len(test_x)):
        yi = test_y[i]
        xi = test_x[i]
        result_xi = []
        for classx in range(10):
            P_yi = train_result[classx][0]
            for k in range(len(xi)):
                # print(train_result[classx][1][k][int(xi[k])])
                P_yi *= train_result[classx][1][k][int(xi[k])]
            result_xi.append(P_yi)

        y0 = dict(zip(result_xi, range(len(result_xi))))[max(result_xi)]
        if y0 == yi:
            true_pre += 1

    print('预测准确率为： ', true_pre / len(test_x))


def run():
    s = time.time()
    train_x, train_y = get_training_sample()
    test_x, test_y = get_test_sample()


    train_result = train(train_x, train_y)
    predict(train_x, train_y, train_result)
    e = time.time()
    print('本次训练预测共耗时 ', e - s)


if __name__ == '__main__':
    # 选取合适的lamda
    # lamda=0是为极大似然估计
    # lamda>0是为贝叶斯估计，特别地，在其为1时，称作拉普拉斯平滑。
    lamda = 0  # 这里lamda=0得到的准确率较高
    run()

```

运行结果：

```
预测准确率为 0.9462
本次训练预测共耗时  1.8078570365905762
```

### 与sklearn实现对比
为了对比，我们也用sklearn的朴素贝叶斯算法实现下。
```python
    import os
    import time
    import pandas as pd
    import numpy as np
    # the Naive Bayes model
    from sklearn.naive_bayes import MultinomialNB, GaussianNB

	# 这里的函数还是上面那些，只不过用到其中几个而已，这里不再赘述
    if __name__=='__main__':
        s = time.time()

        train_x, train_y = get_training_sample()
        test_x, test_y = get_test_sample()
        nb = MultinomialNB()
        # nb = GaussianNB()
        nb.fit(train_x, train_y)
        print(nb.score(test_x, test_y))

        e = time.time()
        print('本次训练预测共耗时 ', e-s)
```

输出：
```
nb = MultinomialNB()
0.923890063425
本次训练预测共耗时  1.693662405014038


nb = GaussianNB()
0.733615221987
本次训练预测共耗时  1.8078570365905762
```


可以看到，sklearn的算法实现明显要快得多，在正确选择合适算法时，也能达到较高的准确率。



!!! 数据结构设计

    这里训练数据的结果用了一个比较复杂结构，开始的时候怎么也构造不出，这时候可以尝试从结果反推。

    在新的待预测的测试向量进入时,我需要哪些数据去预测呢？怎样高效地调用这些数据呢？
    所以，从其需要，构造其现有的就够，变得简单许多。






