---
title: 梅贾的窃魂卷(1/25)——Decorator and Closure
type: categories
copyright: true
date: 2019-09-26 16:35:34
tags:
- Python
- Tips
categories:
- Python

---

### 为什么需要装饰器(MotivaMotion)

存在即合理。在开始之前，我们必须先搞清楚我们为什么需要装饰器,亦即我们可以用它来做什么。总的来说用处很多，下面我们举几个例子。

#### 计时器,日志记录

比如说我们想要测试一些函数的运行时间。在函数不多的时候，我们可以分别计时测试。

比如对函数`func`:

```python
def func():
    print("Hello, I am func.")
```



计时代码大概是下面这样：

```python
import time


def func():
    start = time.time()
    print("Hello, I am func.")
    end = time.time()
    print('Spend:{}s'.format(end - start))


if __name__ == '__main__':
    func()
```

输出:

```
Hello, I am func.
Spend:2.5510787963867188e-05s
```



可以看出我们这里修改了`func`的函数定义才完成计时的任务,使得代码可读性十分差,对于复杂点的函数,我们可能会很艰难地才能找到函数原始的定义.有些读者可能觉得,我们也可以不修改函数定义达到计时的目的确实如此,代码大概是下面这样.

```python
import time


def func():
    print("Hello, I am a function.")


if __name__ == '__main__':
    start = time.time()
    func()
    end = time.time()
    print('Spend:{}s'.format(end - start))
```

输出：

```
Hello, I am a function.
Spend:2.2411346435546875e-05s
```

这样当然是可以的。但是如果函数很多呢？我们也这样一一测试，即使是粘贴复制去测试，也会很耗时间。而使用装饰器，我们可以很方便地对函数进行批量计时。

如，我们可以用下面的代码，很方便地在函数执行的时候自动打印运行所需要的时间。

```python
import time


def timeIt(func):
    def wrapper():
        start = time.time()
        func()
        end = time.time()
        print('Spend:{}s'.format(end - start))
    return wrapper


@timeIt
def func1():
    print("Hello, I am func1.")


@timeIt
def func2():
    print("Hello, I am func2.")


if __name__ == '__main__':
    func1()
    func2()

```

输出:

```
Hello, I am func1.
Spend:3.886222839355469e-05s
Hello, I am func2.
Spend:8.106231689453125e-06s
```

同样地,我们可以将函数执行的时间和其他信息记录到日志文件当中.

#### 缓存器

我们也可以使用装饰器完成缓存的任务.下面我们会介绍Python内置的`lru_cache`装饰器的使用,它可以通过Memoization的方式, 帮助我们更好地完成动态规划(Dynamic Programming)的任务.

### 装饰器是什么

通过上面的例子,我们了解到了装饰器的必要性,即简化我们的工作.(看不懂不要紧,因为我们还没开始讲:-)那么,到底装饰器是什么呢?

> "A decorator is a callable that takes a callable as input and returns another callable."                                     -- Dan, *Python Tricks: The Book*

---
**NOTE**

函数`function`是`callable`的一种,也是最主要的一种, 其它像class实现了`__call__`方法的也是属于callable的.后面我们将围绕函数来展开装饰器的讲解,我们下面用函数(function)来指代这里的`callable`.更多关于`callable`的内容可以参考[文档](https://docs.python.org/3/library/functions.html?highlight=callable#callable)和[stackoverflow](https://stackoverflow.com/questions/111234/what-is-a-callable).此外，可以参考[Class as decorator in python](https://www.geeksforgeeks.org/class-as-decorator-in-python/)来找到class(作为callable)实现装饰器的具体例子。

---


这样,上面对装饰器的解释就是: **装饰器是一个函数, 特别的是,它以一个函数作为它的输入,并返回另一个函数.**

*注意,在Python中,函数是first class object, 也就是说函数的使用是很自由的,具体可以参考[stackoverflow](https://stackoverflow.com/questions/245192/what-are-first-class-objects).所以Python对FP的支持还是比较好的,有趣的是,这种良好的支持并非设计者有意为之:-)(在Fluent Python提到)*

那么关于装饰器是什么的问题就解释清楚了,它是一个函数而已,只不过比较特殊.在函数式编程(FP, Functional Programming)中,我们将这类输出或输出涉及函数的函数,叫做高阶函数(High-Order Function). 所以,确切地说,**装饰器是一个高阶函数**.

在了解了为什么和是什么之后，我们需要知道怎么正确使用装饰器。在这之前，我们先介绍下闭包(Closure)的概念，理解闭包有助于我们对装饰器的理解。

### 什么是闭包

> “Actually, a closure is function with an extended scope that encompasses non-global variables referenced in the body of the function but not defined there.”                          ——*Fluent Python*

简单翻译下：实际上，**闭包就是一个函数连同一个额外的作用域**，其中这个作用域包含一些在该函数用到（但并非在该函数定义）的一些非全局变量。可能有些抽象，让我们来看到一个例子(来自*Fluent Python*)。

设想这样一个场景，我们想要定义一个形如`avg(x)`函数，在第一次调用的时候，返回传入的参数本身，比如传入10，返回10；第二调用的时候返回传入参数的累计平均，比如本次传入11， 那么这一次函数返回10.5, 即（10 + 11）/ 2； 以此类推。

我们知道因为我们每次只传入一个参数，但是却要求函数具有“记忆性”一样，这种记忆性就是通过闭包来实现的。

```python
def make_averager():
    series = []

    def averager(new_value):
        series.append(new_value)
        total = sum(series)
        return total / len(series)

    return averager

```

这里函数`averager`连同`series`构成了一个闭包。这里和装饰器一样用到了函数嵌套，实际上从闭包的定义就可以看出其总是和函数嵌套联系在一起。

![](https://datahonor-1252464519.cos.ap-beijing-1.myqcloud.com/2019/decorator)



这里变量`series`原本就是函数`make_averager`的一个局部变量(local variable),其在调用函数`make_averager`返回`averager`之后就不存在了。但是却不是永远的消失，而是作为一个自由变量(free variable， 表示变量不与局部作用域绑定)存储在`averager`之中组成闭包。

那么又有问题出现了，这个自由变量到底怎么储存的呢？答案是储存在返回函数`avg`的`__closure__`属性之中， 在`avg.__closure__`中的有很多`cell`，每个`cell`有一个`cell_contents`属性，这里存储着其具体包含的数据。此外，我们可以在`avg.__code__co_freevars`看到所有`cell`对应的自由变量名。

```python
>>> avg.__code__.co_freevars
('series',)
>>> avg.__closure__
(<cell at 0x7ff64747f978: list object at 0x7ff6475695c8>,)
>>> avg.__closure__[0].cell_contents
[10, 11]
```

总的来说闭包就是为了重分利用非全局变量而存在的。

### 修改闭包中自由变量

我们可以对上面闭包的实现进行初步改进，因为我们只需要保存总和和总的数量就可以完成上面的要求。所以可以试着写下如下代码，但是它是错的。

```python
def make_averager():
    count = 0
    total = 0

    def averager(new_value):
        count += 1
        total += new_value
        reutrn total / count
    return averager

```

```python
>>> avg = make_averager()
>>> avg(10)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "test.py", line 6, in averager
    count += 1
UnboundLocalError: local variable 'count' referenced before assignment
```



错误的原因是这里我们对`count`和`total`进行重新绑定(rebinding)，相当于执行`count = count + 1`，这种绑定实际上会将他们从自由变量变为局部变量，局部变量不会保存在闭包，所以也就找不到了。之前的`series`由于是一个列表，所以我们只进行`append`是不会进行重新绑定的，所以是可行的。

也就是说，对于`int`, `str`, `tuple`等不可变类型(immutable type)， 我们对闭包一般只有读取权限。说一般肯定是因为有其他方法可以获得读取权限，那就是使用`nonlocal`去做一个声明。

```python
def make_averager():
    count = 0
    total = 0

    def averager(new_value):
        nonlocal count, total
        count += 1
        total += new_value
        return total / count
    return averager

```

在函数内部对变量进行赋值的时候，这个声明使得变量成为自由变量。这样我们就可以改变闭包的值了。

### 怎么用装饰器



#### 如何写&作用原理



当然是按照定义写就可以了:-)

也就是说，**写一个高阶函数，它接受一个一般意义上的函数)(我们叫它`func`好了)作为参数，然后内部在嵌套定义一个新的函数(叫它`wrapper`)，其在完成`func`本来功能的基础上在加上其他想要的功能，最后返回`wrapper`函数**就可以了。

重新来看下上面的`timeIt`装饰器：

```python
def timeIt(func):
    def wrapper():
        start = time.time()
        result = func()
        end = time.time()
        print('Spend:{}s'.format(end - start))
        return result
    return wrapper
```

直接对比上面的定义就很清晰了。

那么，有一个问题，就是装饰器有了，它具体怎么工作的呢？为什么在想要装饰的函数上面加上一个`@timeIt`就可以了呢？

答案其实很简单，`@`在这里只是一个语法糖(Syntactic sugar)，只是起到一个**简化**的作用。下面两种写法是完全等价的：

```python
@timeIt
def func1():
    print("Hello, I am func1.")
```

```python
func1 = timeIt(func1)
```

他们都是把原始的`func1`作为参数传入`timeIt`装饰器，然后返回一个新的函数，并将重新绑定到`func1`.

注意，这里我们用的被装饰的函数，如这里的`func1`都只是示例作用，只是打印一些信息，并无返回值。但是在大多数场合下，被装饰函数还是有返回值的，这是我们就要向上面一样用`result`接受原始函数调用的返回值，并作为`wrapper`函数的返回值来返回。下面有的时候不会带有`result`返回，只是为了说明方便，还望不要引起误解。

#### 参数传入(被装饰函数`func`)

```python
import time


def timeIt(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print('Spend:{}s'.format(end - start))
        return result
    return wrapper


@timeIt
def func_args(x, y, a=3):
    print("Hello, I have three args: %s, %s, %s." % (x, y, a))

```

```python
>>> func_args(1, 2)
Hello, I have three args: 1, 2, 3.
Spend:5.602836608886719e-05s
```

#### 参数传入(装饰器本身`timeIt`)

还是上面的计时场景，上面的`time.time`和`time.perf_counter`是类似的，都是返回当前的时间，以秒为单位（后者更加适合做benchmarking一点）。那么，我们如何定义一个装饰器，使得我们可以控制装饰器本身的行为呢？

一种比较自然的方式是直接在`timeIt`中增加额外的参数来完成这一改进。大概像下面这样去改进，但是这是**不可行的**。

```python
import time


def timeIt(func, seconds=True):
    # 以秒为单位，返回浮点数
    if seconds:
        measure = time.perf_counter
        fmt = 'Spend:{}s'
    else:
        # 以纳秒为单位，返回整数
        measure = time.perf_counter_ns
        fmt = 'Spend:{}ns'

    def wrapper(*args, **kwargs):
        start = measure()
        result = func(*args, **kwargs)
        end = measure()
        print(fmt.format(float(end) - float(start)))
        return result
    return wrapper


@timeIt(seconds=False)
def func_args(x, y, a=3):
    print("Hello, I have three args: %s, %s, %s." % (x, y, a))

```

执行上面的代码，将会报错。

```python
Traceback (most recent call last):
  File "test.py", line 23, in <module>
    @timeIt(seconds=False)
TypeError: timeIt() missing 1 required positional argument: 'func'
```

也就是说，我们如果在装饰器传入其他参数，就会使得`@`失效，因为它不再能后完成将下面函数作为参数传入的任务。

当然，我们可以手动完成这个任务，即用`@`的等价表示来“手动装饰”。

```python
import time


def timeIt(func, seconds=True):
    # 以秒为单位，返回浮点数
    if seconds:
        measure = time.perf_counter
        fmt = 'Spend:{}s'
    else:
        # 以纳秒为单位，返回整数
        measure = time.perf_counter_ns
        fmt = 'Spend:{}ns'

    def wrapper(*args, **kwargs):
        start = measure()
        result = func(*args, **kwargs)
        end = measure()
        print(fmt.format(float(end) - float(start)))
        return result
    return wrapper


def func_args(x, y, a=3):
    print("Hello, I have three args: %s, %s, %s." % (x, y, a))
```

```python
>>> func1 = timeIt(func_args, seconds=True)
>>> func1(1, 2)
Hello, I have three args: 1, 2, 3.
Spend:3.587399987736717e-05s
>>> func2 = timeIt(func_args, seconds=False)
>>> func2(1, 2)
Hello, I have three args: 1, 2, 3.
Spend:64493.0ns
```

这种方法是可以的，但是可惜的一点是我们不能使用`@`来进行装饰，可能会有些不方便。真正可以同时利用`@`语法糖的做法是再次进行函数的嵌套，对装饰器本身进行嵌套。

```python
import time


def clock(seconds=True):
    # 以秒为单位，返回浮点数
    if seconds:
        measure = time.perf_counter
        fmt = 'Spend:{}s'
    else:
        # 以纳秒为单位，返回整数
        measure = time.perf_counter_ns
        fmt = 'Spend:{}ns'

    def timeIt(func):
        def wrapper(*args, **kwargs):
            start = measure()
            result = func(*args, **kwargs)
            end = measure()
            print(fmt.format(float(end) - float(start)))
            return result
        return wrapper
    return timeIt


@clock()
def func_args_1(x, y, a=3):
    print("Hello, I have three args: %s, %s, %s." % (x, y, a))


@clock(seconds=False)
def func_args_2(x, y, a=3):
    print("Hello, I have three args: %s, %s, %s." % (x, y, a))

```

```python
>>> func_args_1(1, 2)
Hello, I have three args: 1, 2, 3.
Spend:8.46920011099428e-05s
>>> func_args_2(1, 2)
Hello, I have three args: 1, 2, 3.
Spend:62385.0ns
```

让我们从一个更加广阔的视角看待这种嵌套。对原始函数`func`进行嵌套，组成装饰器，我们在不修改`func`定义的情况下，对`func`调用时的行为进行了改进； 同样地，这里我们对装饰器本身`timeIt`进行嵌套，进而控制装饰器的行为。

注意，这里的`clock`函数并不是装饰器，为什么？因为装饰器的定义是接受函数作为参数，这里很明显不满足。所以`clock`只是一个单纯的高阶函数而已，它接受一个参数，根据参数定义装饰器的行为，而后**返回一个装饰器**。所以，从某种意义上讲，它可以看作一个装饰器的生产函数，这是一种更高层次的抽象。



#### 多重装饰(decorator stacking)

想一下调用`func`函数会输出什么呢？

```python
def add_hi(func):
    def wrapper(*args, **kwargs):
        org = func(*args, **kwargs)
        return '<hi>' + org + '</hi>'
    return wrapper


def add_hello(func):
    def wrapper(*args, **kwargs):
        org = func(*args, **kwargs)
        return '<hello>' + org + '</hello>'
    return wrapper


@add_hello
@add_hi
def func():
    return 'func'

```

```python
>>> func()
'<hello><hi>func</hi></hello>'
```

可以看到，`add_hi`是先于`add_hello`对`func`进行装饰的，所以下面两种写法是等价的。

```python
@add_hello
@add_hi
def func():
    return 'func'
```

```python
func = add_hello(add_hi(func))
```

#### 可用于DEBUG的装饰器

在以上所有的装饰器中，都存在一个问题，那就是我们看到函数名和实际内部函数的名字是不一致的，而且初始函数在被装饰后其`docstring`, `parameter list`也会被隐藏。

```python
def add_hello(func):
    def wrapper(*args, **kwargs):
        org = func(*args, **kwargs)
        return '<hello>' + org + '</hello>'
    return wrapper


def func():
    """
    Just return the name of the function.
    """
    return 'func'

decorate_func = add_hello(func)
```

```python
>>> func.__name__
'func'
>>> func.__doc__
'Just return the name of the function.'
>>> decorate_func.__name__
'wrapper'
>>> decorate_func.__doc__
>>> 
```

毕竟，到了这里，我们早就知道装饰过后返回的是一个新的函数，自然名字和文档都会变为新的。因为我们使用装饰器的初衷就是为了**不修改**函数的定义等来进行新功能的加入，这种情况看起来不太妙，而且尤其不利于我们DEBUG，毕竟谁看到一个莫名`wrapper`函数出错都感到茫然...

解决的方法就是...用一个装饰器(要用魔法打败魔法:-)我们可以用`functools.wraps`来复制原始函数`func`中的元数据(metadata)到装饰器的闭包当中。

```python
import functools


def add_hello(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        org = func(*args, **kwargs)
        return '<hello>' + org + '</hello>'
    return wrapper


@add_hello
def func():
    """Just return the name of the function."""
    return 'func'

```

```python
>>> func.__name__
'func'
>>> func.__doc__
'Just return the name of the function.'
```

#### 注意事项

装饰器的“装饰”是在正式调用函数前就进行的(Fluent Python有例子)，也就是一旦对函数进行了装饰，要返回去得到初始的函数是比较麻烦，如果有这种需求可以不用`@`，在运行需要的时候手动调用装饰器。

`decorator stacking`虽好，也没有层次限制，但是当堆叠太多的时候还是对程序的运行效率带来压力，毕竟本身是函数的调用。

---
**NOTE**
Python也是有[Class Decorator](https://www.python.org/dev/peps/pep-3129/#rationale)的哦，后面可能会讲到:-)

>A common use of class decorators is to be a simpler alternative to some use-cases of metaclasses. In both cases, you are changing the definition of a class dynamically. ([Primer on Python Decorators](https://realpython.com/primer-on-python-decorators/))

---


我们一直在讲用装饰器来对函数进行计时,但是如果采用上述方式对递归函数计时会发现程序在每次执行函数时候都会打印一个时间,这显然不是我们想要的.解决方法有两种,第一是继续使用装饰器,但是需要做一些细节的处理,参考[这里](https://stackoverflow.com/questions/29560643/python-counting-executing-time-of-a-recursion-function-with-decorator), 另一种就是参考后面基于[Context Managers](http://datahonor.com/2019/11/01/%E6%A2%85%E8%B4%BE%E7%9A%84%E7%AA%83%E9%AD%82%E5%8D%B7-2-25-%E2%80%94%E2%80%94Context-Managers-with/)的方法.

### Python内部的装饰器

比较好用且常用的就是用[`functools.lru_cache`](https://docs.python.org/3/library/functools.html?highlight=lru_cache#functools.lru_cache)来进行`Memoization`。常见的求Fibonacci数列时，使用这个装饰器可以在提升运行速度的同时极大地简化程序。

此外一些比较常见的就是`@property`, `@classmethod`, `@staticmethod`这三个，而这三个装饰器(甚至包括`__slots__`与class method)的实现都是依赖于Descriptor的，具体见[Descriptor HowTo Guide](https://docs.python.org/3/howto/descriptor.html#technical-tutorial)： 文档给出了上述常见装饰器的Pure Python实现，参考这些实现可以更加深入具体地了解这些装饰器的本质是什么，而不是仅仅停留在怎么用的阶段。



