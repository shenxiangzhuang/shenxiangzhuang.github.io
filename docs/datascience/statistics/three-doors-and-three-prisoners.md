---
date: 2017-09-08 12:12:34
---


在看*Statistical Inference*的时候，看到 Three Prisoners 的问题时，没看太懂，因为问题的描述略简单。
于是为 wiki 查了下，又把之前看到的 Three Doors 放在一起。


## Three Doors Problems

三门问题，又叫 Monty Hall problem，来自一个电视节目，规则如下（具体参见[wiki](https://en.wikipedia.org/wiki/Monty_Hall_problem)）：

!!! example
    Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car;
    behind the others, goats. You pick a door, say No. 1, and the host, who knows what's behind the doors,
    opens another door, say No. 3, which has a goat. He then says to you, "Do you want to pick door No. 2?"
    Is it to your advantage to switch your choice?

里面有很多解释，简单讲就是：

!!! tip
    按照规则，如果在主持人询问后选择转换，那么最后得到的奖品必然是和初始选择到的奖品是不同的。
    所以只要是选择转换，那么第一次选中山羊的概率就是最后得到汽车的概率，为 2/3；
    反之，只要选择不动，那么第一次选择得到的奖品就是最后得到的，所以得到汽车的概率为 1/3.
    因此，选择转换，会使得得到汽车的概率提高一倍。

## Three Prisoners Problems


问题描述如下，具体参见[wiki](https://en.wikipedia.org/wiki/Three_Prisoners_problem)：

!!! example

    Three prisoners, A, B and C, are in separate cells and sentenced to death.
    The governor has selected one of them at random to be pardoned.
    The warden knows which one is pardoned, but is not allowed to tell.
    Prisoner A begs the warden to let him know the identity of one of the others who is going to be executed.
    "If B is to be pardoned, give me C's name. If C is to be pardoned, give me B's name.
    And if I'm to be pardoned, flip a coin to decide whether to name B or C."

    The warden tells A that B is to be executed.
    Prisoner A is pleased because he believes that his probability of surviving has gone up from 1/3 to 1/2, as it is now between him and C.
    Prisoner A secretly tells C the news, who is also pleased, because he reasons that A still has a chance of 1/3 to be the pardoned one,
    but his chance has gone up to 2/3. What is the correct answer?


感觉枚举的方法不如用贝叶斯来得简单：

![](http://datahonor-1252464519.costj.myqcloud.com/201708/Screenshot%20from%202017-09-08%2012-25-24.png)







