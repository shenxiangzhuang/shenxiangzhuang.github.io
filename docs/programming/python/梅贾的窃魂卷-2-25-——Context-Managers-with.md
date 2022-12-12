---
title: 梅贾的窃魂卷(2/25)——Context Managers(with)
type: categories
copyright: true
date: 2019-11-01 11:37:02
tags:
- Python
- Tips
categories:
- Python

---

### 为什么需要Context Managers(Motivation)

先来看一个读写文件的例子。

```python
f = open('hello.txt', 'w')
f.write('hello, world')
# 一些其他操作等
f.close()
```

很明显，在执行`f.write`和其他操作的时候可能会出错，这就会导致我们的`f`无法被正常关闭。所以，对于诸如此类的资源释放问题，我们一般都会加上异常判断。

```python
f = open('hello.txt', 'w')
try:
    f.write('hello, world')
    # 一些其他操作等
finally:
    f.close()
```

但是这样会显得代码比较繁杂，降低了可读性。所以现在我们一般看到的读写文件的写法都是用`with`来写的，它定义了一个`Context Manager`。

```python
with open('hello.txt', 'w') as f:
    f.write('hello, world')
    # 一些其他操作等
```

这种写法可以保证在任何情况下`f`都可以被正常关闭，保持简洁同时代码的可读性大大提升。

不仅是读写文件，其他的诸如读写数据库，线程的释放等，都是需要做类似处理的。这就催生出了我们的`with`， 它就是**专门为简化这种`try/finally`的写法而设计的，它保证在运行一段代码后我们总能进行一些操作，即使运行的那段代码出错也不影响**。

### Context Manager是什么

我们知道，Python的内部实现依赖Duck Type("If it walks like a duck and it quacks like a duck, then it must be a duck"), 所以一般要实现某种行为，我们只需要对应实现一些必须的`protocol`. 就像`str(x)`对应`__str__`， `len(x)`对应`__len__`， `in`对应`__contains__`这样，**这里的Context Manager对应`__enter__`和`__exit__`， 其表现形式一般是一个类(class)**， 后面也会介绍用已有的**装饰器工具和生成器(generator)来构造Context Manager**的例子。

好了，我知道要实现这些protocol了，那么，所谓的Context Manager到底长什么样呢？下面就是一个很好的例子(来自Fluent Python)。

```python
class LookingGlass:

    def __enter__(self):
        import sys
        self.original_write = sys.stdout.write
        sys.stdout.write= self.reverse_write
        return 'ABCD'

    def reverse_write(self, text):
        self.original_write(text[::-1])

    def __exit__(self, exc_type, exc_value, traceback):
        import sys
        sys.stdout.write = self.original_write
        if exc_type is ZeroDivisionError:
            print('Please DO NOT divide by zero!')
            return True

```

我们先来看下这个Context Manager到底是用来干什么的，之后在具体解释其背后的运行机制。

```python
>>> with LookingGlass() as what:
...     print('Hello World')
...     print(what)
... 
dlroW olleH
DCBA
>>> what
'ABCD'
>>> print('Hello')
Hello

```

可以看到，在`with`内打印的内容全部是其真实内容的倒序，如`Hello World`变成`dlroW olleH`, `ABCD`变成`DCBA`。退出`with`之后打印行为又恢复正常。下面我们来深入解释其背后的原理。

### Context Manager运行机制

其实运行机制也非常简单，就是在`with LookingGlass() as what`时，执行`__enter__`做一些操作（比如这里更改打印行为），并将该函数的返回值赋给`as`后面的`what`。之后执行`with` 段的程序（即这里的两个`print`）。执行完之后跳出`with`段，同时调用`__exit__`函数做一些操作（这里是将打印行为恢复正常）。

此外，注意`__exit__`中的异常判断，在`if exc_type is ZeroDivisionError:`中，我们返回`True`表示该异常已经被处理。如果上述异常未触发，该处的`__exit__`会默认返回`None`，如果在`with`段内执行的代码有其他类型的错误，即`exc_type`并非`ZeroDivisionError`那么错误将会被`raise`出来。 



### 创建自己的Context Manager

前面那种基于类的方法是一种可行自定义Context Manager的方法,就是自己**定义好`__enter__`和`__exit__`方法**.此外, Python还提供了一些库函数可以帮助我们更快地创建自己的Context Manager. `contextlib`库提供了很多的帮助函数,这里我们专注于其中最重要也是最常用的**`@contextmanager`装饰器**, 其可以十分方便地将生成器转化为一个Context Manager(此处也向我们展示了生成器不是只能用于迭代,也可以用于此处,以及后面可能会涉及的协程(coroutine)).

下面我们来看一些`@contextmanager`的使用方法,先看一个例子,它用装饰器加生成器的方法实现之前基于类的Context Manager.

```python
import contextlib

@contextlib.contextmanager
def looking_glass():
    import sys
    original_write = sys.stdout.write

    def reverse_write(text):
        original_write(text[::-1])

    sys.stdout.write = reverse_write
    yield 'ABCD'
    sys.stdout.write = original_write
```

测试其行为是否和之前的实现一样.

```python
>>> with looking_glass() as what:
...     print('Hello World')
...     print(what)
... 
dlroW olleH
DCBA
>>> what
'ABCD'
>>> print('Hello')
Hello
```

可以看到和之前基于类的方法调用是一样,且行为也正如我们预期的那样.

那么,上面的程序到底是怎么运行的呢?换句话说,我们是怎么通过生成器和库提供的装饰器结合来构造Context Manager的呢?

简言之,在生成器(此处是函数`looking_glass`)中`yield xxx`语句将整个函数体分割为三个部分,`yield`之前的部分相当于函数`__enter__`的内容, `yield`之后的部分相当于函数`__exit__`的内容, `yield 'ABCD'`返回的`ABCD`在执行` with looking_glass() as what`时被绑定到`what`(相当于`__enter__`中`return`的值).

这样,在加上装饰器之后,整个函数被视作一个Context Manager, 在解释器调用`__enter__`时,它就执行`yield`之前的程序,然后将`yield`产生的内容绑定到`as`后的变量中(若`with f() as xxx`, 即绑定到`xxx`).之后执行`with`段的程序(上面例子中的两个`print`). 执行完毕后,解释器调用`__exit__`方法,此时程序去执行`yield`之后的部分.这就是使用装饰器和生成器来创建Context Manager的整个流程了.

需要注意的一点是,上面我们并为介绍生成器方法在此时并不完全等价于上面基于类的方法,关键在于**对异常的处理.**就内部细节来看,如果`with`语句后的内容执行出错,程序会报错一次.之后由于我们的Context Manager的实现,会在生成器内重新报错一次,在生成器内部的报错会终止我们的程序,使得Context Manager失效,资源无法释放.所以我们必须要对该错误进行处理才可以使得其完全等价于基于类的实现.

```python
import contextlib

@contextlib.contextmanager
def looking_glass():
    import sys
    original_write = sys.stdout.write

    def reverse_write(text):
        original_write(text[::-1])

    sys.stdout.write = reverse_write
    msg = ''
    try:
        yield 'ABCD'
    except ZeroDivisionError:
        msg = 'Please DO NOT divide by zero!'
    finally:
        sys.stdout.write = original_write
        if msg:
            print(msg)

```

这样修改过,才算是真正写好了一个Context Manager,其和之前基于类的方法是等价的.因为我们不知道用户会用我们写的Context Manager做什么,所以这种内部的异常处理是基于生成器写Context Manager必须付出的代价(Leonardo Rochael).

那么,之前不是说搞Context Manager出来就是为了简化`try/finally`的写法吗,这里不是更加复杂了吗?

我个人感觉这类似封装的思想,我们将资源释放和异常处理统统加到我们的Context Manager里面,在调用的时候只需要一个`with`语句,使得代码逻辑更加清晰,也更加容易维护.

### 具体应用

#### 文件修改(in-place)

从前的叙述中我们可以看到Context Manager的应用好像总是和资源释放等有关,其实并非如此.在Fluent Python中,作者提到Martijn Pieter的一个妙用, 他使用Context Manager来完成文件的就地(in-place)修改.

先定义好Context Manager`inplace`,之后可以通过简单的调用完成修改.

```python
import csv

with inplace(csvfilename, 'r', newline='') as (infh, outfh):
    reader = csv.reader(infh)
    writer = csv.writer(outfh)

    for row in reader:
        row += ['new', 'columns']
        writer.writerow(row)

```

具体内容参考其[博客](https://www.zopatista.com/python/2013/11/26/inplace-file-rewriting/)

#### 程序计时

我们知道装饰器可以用来函数的计时,我们也可以写一个Context Manager完成函数的计时,而且相对更加方便一点.

```python
import time

class Timeit():
    def __init__(self):
        self.start = None
        self.end = None

    def __enter__(self):
        self.start = time.time()

    def __exit__(self, exc_type, exc_value, traceback):
        self.end = time.time()
        print(f'Spend {self.end - self.start} s')

def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)


if __name__ == '__main__':
    with Timeit() as f:
        y = fib(30)
    print(f'fib(30) = {y}')
```

输出:

```python
Spend 0.5587637424468994 s
fib(30) = 832040
```

在[梅贾的窃魂卷(1/25)——Decorator and Closure](http://datahonor.com/2019/09/26/%E6%A2%85%E8%B4%BE%E7%9A%84%E7%AA%83%E9%AD%82%E5%8D%B7-1-25-%E2%80%94%E2%80%94Decorator-and-Closure/)中我们了解到用装饰器计时大概有三个缺点:

> 1.仅仅可以对某函数计时,对程序块计时需要先将其定义为函数
>
> 2.对递归函数的计时需要进一步的处理
>
> 3.不灵活,一旦将函数"装饰"起来,一般不能去掉"装饰"

而上面基于Context Manager的计时方法更加灵活且友好.