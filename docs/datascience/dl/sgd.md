---
date: 2017-03-02 17:31:38
---

初步认识梯度下降这一算法，认识并分析其优缺点以更好地利用此算法。

##### 简介[wiki](https://zh.wikipedia.org/wiki/%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D%E6%B3%95)

![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/1.png)
##### 描述
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/2.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/3.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/4.png)

##### 线性回归的应用
参考[这里](https://github.com/mattnedrich/GradientDescentExample)

```python
from numpy import *
from matplotlib import pyplot as plt

# y = mx + b
# m is slope, b is y-intercept
def compute_error_for_line_given_points(b, m, points):
    totalError = 0
    for i in range(0, len(points)):
        x = points[i, 0]
        y = points[i, 1]
        totalError += (y - (m * x + b)) ** 2
    return totalError / float(len(points))

def step_gradient(b_current, m_current, points, learningRate):
    b_gradient = 0
    m_gradient = 0
    N = float(len(points))
    for i in range(0, len(points)):
        x = points[i, 0]
        y = points[i, 1]
        b_gradient += -(2/N) * (y - ((m_current * x) + b_current))
        m_gradient += -(2/N) * x * (y - ((m_current * x) + b_current))
    new_b = b_current - (learningRate * b_gradient)
    new_m = m_current - (learningRate * m_gradient)
    return [new_b, new_m]

def gradient_descent_runner(points, starting_b, starting_m, learning_rate, num_iterations):
    b = starting_b
    m = starting_m
    for i in range(num_iterations):
        b, m = step_gradient(b, m, array(points), learning_rate)
    return [b, m]

def run():
    points = genfromtxt("data.csv", delimiter=",")
    learning_rate = 0.0001
    initial_b = 0 # initial y-intercept guess
    initial_m = 0 # initial slope guess
    num_iterations = 1000
    print("Starting gradient descent at b = {0}, m = {1}, error = {2}".format(initial_b, initial_m, compute_error_for_line_given_points(initial_b, initial_m, points)))
    print("Running...")
    [b, m] = gradient_descent_runner(points, initial_b, initial_m, learning_rate, num_iterations)
    print("After {0} iterations b = {1}, m = {2}, error = {3}".format(num_iterations, b, m, compute_error_for_line_given_points(b, m, points)))

    # 作图[只是为了直观地看下拟合的效果]
    plt.plot([points[i,0] for i in range(len(points))], [points[i,1] for i in range(len(points))], 'bo')
    x = linspace(min([points[i,0] for i in range(len(points))])-5, max([points[i,0] for i in range(len(points))])+5, 1000)
    plt.plot(x, m*x+b)
    plt.show()

if __name__ == '__main__':
    run()

```

运行结果：
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/5.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/6.png)


##### 梯度下降的弊端及验证
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/7.png)

尝试验证wiki的下图：
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/8.gif)

选取不同的学习率，实验结果如下：

>E1：Learning Rate = 0.0045


![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/9.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/10.png)



>E2: Learning Rate = 0.0025

![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/11.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/12.png)
可以看到还是有一定的差别，推测与学习率和迭代次数有关，这个暂时留到以后深究。

Python实现源码如下：

```python
#!/usr/bin/env python3
# encoding: utf-8

from matplotlib import pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import sys

# 递归实现逐次求梯度，这里为了充分迭代，修改递归次数限制
sys.setrecursionlimit(2000)

# 计算Rosenbrock函數的值
def func(X, Y):
    return (1 - X) ** 2 + 100 * ((Y - X ** 2) ** 2)

def step_gradient(pre, learningRate=0.0025):  #0.0025
    scatter.append(pre)
    x = pre[0]
    y = pre[1]
    x_gradient = 2*(x-1)+400*x*(x**2-y)
    y_gradient = 200*(y-x**2)
    step_x = learningRate * x_gradient
    step_y = learningRate * y_gradient
    steps = [step_x, step_y]
    now = [pre[0] - steps[0], pre[1] - steps[1]]
    # 将新的点存储到scatter列表里面去
    z = func(now[0], now[1])
    # print(z)
    z_l.append(z)
    try:
        step_gradient(now)
    except:
        pass

if __name__=='__main__':
    fig = plt.figure()
    # ax = Axes3D(fig)
    # 随机度下降起始点
    point = (-0.5, 0.5)
    scatter = []
    z_l = []
    scatter.append(point)
    step_gradient(point)
    print('Total times', len(scatter))
    print("Min_z-->", min(z_l))
    plt.plot([point[0] for point in scatter], [point[1] for point in scatter], 'r')

    X = np.arange(-0.8, 1, 0.01)
    Y = np.arange(-0.2, 1.1, 0.025)
    X, Y = np.meshgrid(X, Y)
    Z = func(X, Y)

    # ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap='rainbow')
    # plt.show()
    CS = plt.contour(X, Y, Z, 100)
    manual_locations = [(i, i+0.02) for i in np.linspace(-0.2, 0.3, 10)]
    manual_locations.append((1,1))

    plt.clabel(CS, inline=1, fontsize=8, manual=manual_locations)
    plt.title('Rosenbrock')
    plt.show()

```

适当调节参数，也可以作出下面的图：
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/13.png)
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/14.png)



第一次补充：[尝试放大局部图像找到所谓的“之”字形失败]
之前未能实现wiki“之”字形震荡, 就想到可能是点过于密集导致微小的弯折被掩盖，于是进行局部放大图像的尝试。

```python
#!/usr/bin/env python3
# encoding: utf-8

from matplotlib import pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import sys

# 递归实现逐次求梯度，这里为了充分迭代，修改递归次数限制
sys.setrecursionlimit(2000)

# 计算Rosenbrock函數的值
def func(X, Y):
    return (1 - X) ** 2 + 100 * ((Y - X ** 2) ** 2)

def step_gradient(pre, learningRate=0.0045):  #0.0025
    scatter.append(pre)
    x = pre[0]
    y = pre[1]
    x_gradient = 2*(x-1)+400*x*(x**2-y)
    y_gradient = 200*(y-x**2)
    step_x = learningRate * x_gradient
    step_y = learningRate * y_gradient
    steps = [step_x, step_y]
    now = [pre[0] - steps[0], pre[1] - steps[1]]
    # 将新的点存储到scatter列表里面去
    z = func(now[0], now[1])
    # print(z)
    z_l.append(z)
    try:
        step_gradient(now)
    except:
        pass

if __name__=='__main__':

    fig = plt.figure(figsize=(16, 8), dpi=98)
    p1 = plt.subplot(121, aspect=1.8 / 1.3)
    p2 = plt.subplot(122, aspect=0.06 / 0.001)

    # 随机度下降起始点
    point = (-0.5, 0.5)
    scatter = []
    z_l = []
    scatter.append(point)
    step_gradient(point)
    print('Total times', len(scatter))
    print("Min_z-->", min(z_l))
    p1.plot([point[0] for point in scatter], [point[1] for point in scatter], 'r')

    p2.plot([point[0] for point in scatter], [point[1] for point in scatter], 'r')
    p2.axis([-0.02, 0.04, -0.0005, 0.0005])

    X = np.arange(-0.8, 1, 0.01)
    Y = np.arange(-0.2, 1.1, 0.025)
    X, Y = np.meshgrid(X, Y)
    Z = func(X, Y)

    CS = p1.contour(X, Y, Z, 100)
    manual_locations = [(i, i+0.02) for i in np.linspace(-0.2, 0.3, 10)]
    manual_locations.append((1,1))
    p1.clabel(CS, inline=1, fontsize=8, manual=manual_locations)

    plt.show()

```


得到结果如下[显然实验失败了:-)]
![](http://dataimage-1252464519.costj.myqcloud.com/images/ML/gradient/15.png)
