---
title: 利用Python,Lingo, Octave解线性规划问题(LP)
date: 2017-03-22 22:50:39
mathjax: true
categories:
- Python
tags:
- Python
- OR
---
##### Overview
新学期开了运筹学(OR)的课,最近学线性规划问题(LP)。老师建议说是用MATLAB 或者 LINGO，这里再加上Python,三种都试下，进行下比较。[懒的切换到windows系统了。。。用Octave代替Matlab了先。。。]

##### Python求解(cvxopt)
这里用的库是cvxopt,之前解SVM的QP问题也用过，这里求解LP问题。
这是文档的介绍：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Python/OR/LP1.png)

这里，我们主要看下在有无等式约束两种情况下的不同,其实也没差 :-）
###### 无等式约束
 $ minimize     \quad   -4x_{1}-5x_{2}$ 


$ subject \quad to
\left\{\begin{matrix}
2x_{1} & +x_{2} & \leq 3\\ 
x_{1}& +2x_{2} & \leq 3\\
x_{1}&,x_{2}&\geq 0
\end{matrix}\right.
$

实现代码：
{% codeblock lang:python %}

    import numpy as np
    from cvxopt import matrix, solvers

    c = matrix([-4., -5.])
    G = matrix([[2., 1., -1., 0.], [1., 2., 0., -1.]])
    h = matrix([3., 3., 0., 0.])
    sol = solvers.lp(c, G, h)
    print(sol['x'])


{% endcodeblock %}
输出：
>     pcost       dcost       gap    pres   dres   k/t
 0: -8.1000e+00 -1.8300e+01  4e+00  0e+00  8e-01  1e+00
 1: -8.8055e+00 -9.4357e+00  2e-01  1e-16  4e-02  3e-02
 2: -8.9981e+00 -9.0049e+00  2e-03  3e-16  5e-04  4e-04
 3: -9.0000e+00 -9.0000e+00  2e-05  1e-16  5e-06  4e-06
 4: -9.0000e+00 -9.0000e+00  2e-07  3e-16  5e-08  4e-08
Optimal solution found.
[ 1.00e+00]
[ 1.00e+00]


Remark：
>这里记得一定要调入numpy,否则会出现如下报错
>Intel MKL FATAL ERROR: Cannot load libmkl_avx2.so or libmkl_def.so.
>可能是依赖的问题。

###### 有等式约束

 $ minimize  \quad  z = -3x_{1}+x_{2}+x{3}$ 

 $ subject \quad to
\left\{\begin{matrix}
x_{1} &  -2x_{2}& +x_{3} & \leq 11\\ 
-4x_{1} & +x{2} &  +2x{3}& \geq 3\\ 
 -2x_{1}&  & +x_{3} & = 1\\ 
 x_{1},&x_{2},&x_{3}&\geq 0 
\end{matrix}\right.
$


{% codeblock lang:python %}

    import numpy as np
    from cvxopt import matrix, solvers


    G = matrix([[1.0,4.0,-2.0,-1.0,0.0,0.0], [-2.0,-1.0,0.0,0.0,-1.0,0.0],[1.0,-2.0,1.0,0.0,0.0,-1.0]])
    h = matrix([11.0,-3.0,1.0,0.0,0.0,0.0])

    A = matrix([-2.0,0.0,1.0])
    A = A.trans()  # 这里不转置会报错
    b = matrix([1.0])
    c = matrix([-3.0, 1.0, 1.0])

    sol = solvers.lp(c,G,h,A=A,b=b)
    print(sol['x'])


{% endcodeblock %}

输出：
>     pcost       dcost       gap    pres   dres   k/t
 0: -2.1667e+00 -1.1167e+01  3e+01  9e-01  1e+00  1e+00
 1: -1.1986e+00 -1.9278e+00  2e+00  7e-02  1e-01  1e-01
 2: -1.9895e+00 -2.0163e+00  6e-02  3e-03  4e-03  5e-03
 3: -1.9999e+00 -2.0002e+00  6e-04  3e-05  5e-05  5e-05
 4: -2.0000e+00 -2.0000e+00  6e-06  3e-07  5e-07  5e-07
 5: -2.0000e+00 -2.0000e+00  6e-08  3e-09  5e-09  5e-09
Optimal solution found.
[ 4.00e+00]
[ 1.00e+00]
[ 9.00e+00]




##### Lingo求解线性规划问题

题目还是上面的有等式约束的那道题[用lingo处理等式约束方便的多，有无等式约束几乎是一样的]

代码：
{% codeblock lang:lingo%}
    MIn=-3*x1+x2+x3;

    x1>=0;
    x2>=0;
    x3>=0;

    x1-2*x2+x3 <= 11;
    -4*x1+x2+2*x3>=3;
    -2*x1+x3=1;


{% endcodeblock %}

输出：
![](http://dataimage-1252464519.costj.myqcloud.com/images/Python/OR/Lp2.png)






![](http://dataimage-1252464519.costj.myqcloud.com/images/Python/OR/LP3.png)



##### 利用Octave解决LP问题
>注意，在MatLab中，使用的函数是linprog, 这在Octave换成了glpk函数。

代码：
{% codeblock %}

    c = [-3 1 1]';

    A = [1 -2 1;
    -4 1 2;
    -2 0 1];

    b = [11 3 1];
    lb = [0 0 0];
    ub = [];

    ctype = "ULS";
    vartype = "CCC";
    s = 1;
    param.msglev = 1;
    param.itlim = 100;



    [xopt, fmin, status, extra] = glpk (c, A, b, lb, ub, ctype, vartype, s, param)


{% endcodeblock %}

输出：
>xopt =
>
   4
   1
   9

>fmin = -2
status = 0
extra =

>  scalar structure containing the fields:

>    lambda =

>     -0.33333
       0.33333
       0.66667

>  redcosts =

>       0
       0
       0

>    time = 0
    status =  5


好啦，都完美运行咯，再见单纯形法，再见大M法：-）
##### Refrence
[cvxopt](http://cvxopt.org/)
[glpk](https://www.gnu.org/software/octave/doc/v4.0.0/Linear-Programming.html)


