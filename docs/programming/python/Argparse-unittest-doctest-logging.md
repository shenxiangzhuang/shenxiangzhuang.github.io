---
title: Argparse&Test&Logging
type: categories
copyright: true
date: 2019-06-15 09:18:29
tags:
- Python
categories:
- Python
---


### argparse

[Argparse Tutorial](https://docs.python.org/3/howto/argparse.html?highlight=argparse): This tutorial is intended to be a gentle introduction to argparse, the recommended command-line parsing module in the Python standard library.

A demo:

```python
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("x", type=int, help="the base")
parser.add_argument("y", type=int, help="the exponent")
parser.add_argument("-v", "--verbosity", action="count", default=0)
args = parser.parse_args()
answer = args.x**args.y
if args.verbosity >= 2:
    print("Running '{}'".format(__file__))
if args.verbosity >= 1:
    print("{}^{} == ".format(args.x, args.y), end="")
print(answer)
```

output:

```python
$ python3 prog.py 4 2
16
$ python3 prog.py 4 2 -v
4^2 == 16
$ python3 prog.py 4 2 -vv
Running 'prog.py'
4^2 == 16
```

补充`vars`:

```python
>>> parser = argparse.ArgumentParser()
>>> parser.add_argument('--foo')
>>> args = parser.parse_args(['--foo', 'BAR'])
>>> vars(args)
{'foo': 'BAR'}
```

### Test

主要介绍四种测试工具，分别是`doctest`, `unitest`, `hypethesis`和`pytest`。其中，前三种均可以和`pytest`结合使用.(注意其检测的是文件名为`test_xxx.py`或者`xxx_test.py`的文件，具体参考文档)

此外，`hypothesis`还可以和`unittest`结合使用。

#### doctest

[doctest](https://docs.python.org/3/library/doctest.html) — Test interactive Python examples

```python
def factorial(n):
    """Return the factorial of n, an exact integer >= 0.

    >>> [factorial(n) for n in range(6)]
    [1, 1, 2, 6, 24, 120]
    >>> factorial(30)
    265252859812191058636308480000000
    >>> factorial(-1)
    Traceback (most recent call last):
        ...
    ValueError: n must be >= 0

    Factorials of floats are OK, but the float must be an exact integer:
    >>> factorial(30.1)
    Traceback (most recent call last):
        ...
    ValueError: n must be exact integer
    >>> factorial(30.0)
    265252859812191058636308480000000

    It must also not be ridiculously large:
    >>> factorial(1e100)
    Traceback (most recent call last):
        ...
    OverflowError: n too large
    """

    import math
    if not n >= 0:
        raise ValueError("n must be >= 0")
    if math.floor(n) != n:
        raise ValueError("n must be exact integer")
    if n+1 == n:  # catch a value like 1e300
        raise OverflowError("n too large")
    result = 1
    factor = 2
    while factor <= n:
        result *= factor
        factor += 1
    return result


if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

> 注意这里我们不仅可以进行测试，也可以在顶部对函数进行注释。当然，下面的测试也会自动加入文档注释之中。

补充，终端下测试：`python -m doctest -v example.py`

与`pytest`结合，终端运行：`pytest --doctest-modules`,注意其作用为“run doctests in all .py modules”。



####  unittest

[unittest](https://docs.python.org/3/library/unittest.html)——Unit testing framework

```python
import unittest

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)

if __name__ == '__main__':
    unittest.main()
```

> 注意一点，这里使用unittest可以在`test_xxx`函数内部任意位置调用`self.assertEqual`等命令来进行测试，于此不同的是`doctest`一般是对整个函数进行测试，也是通过计算结果与预期结果的对比。

补充`@unittest.skipIf(*condition*, *reason*)`：

> Skip the decorated test if *condition* is true.

```python
class TestSVM(unittest.TestCase):
    skip_flag = False
    @unittest.skipIf(skip_flag, "debug")
    def test_e71(self):
        pass
```

#### [hypothesis](https://github.com/HypothesisWorks/hypothesis/tree/master/hypothesis-python)

`hypothesis`是类似于`haskell`中`QuickCheck`的“property-based testing”，但是还是有些不同的。

```python
from hypothesis import given
import hypothesis.strategies as st
import unittest


@given(x=st.integers(), y=st.integers())
def test_ints_cancel(x, y):
    assert (x + y) - y == x

class TestCommutative(unittest.TestCase):
    @given(x=st.integers(), y=st.integers())
    def test_ints_are_commutative(self, x, y):
        self.assertEqual(x+y, y+x)
```

第一种方法是原生的写法，后面一种是和`unittest`结合的写法，两种写法均可，且均可以直接在终端运行`pytest`完成检测。注意文件名要用`xxx_test.py`和`test_xxx.py`的格式，此外还有其他可选的参数。



#### [pytest](https://docs.pytest.org/en/latest/index.html)

> Due to `pytest`’s detailed assertion introspection, only plain `assert` statements are used.

```python
# content of test_sample.py
def inc(x):
    return x + 1

def test_answer():
    assert inc(3) == 5
```

执行输出：

```
$ pytest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-4.x.y, py-1.x.y, pluggy-0.x.y
cachedir: $PYTHON_PREFIX/.pytest_cache
rootdir: $REGENDOC_TMPDIR
collected 1 item

test_sample.py F                                                     [100%]

================================= FAILURES =================================
_______________________________ test_answer ________________________________

    def test_answer():
>       assert inc(3) == 5
E       assert 4 == 5
E        +  where 4 = inc(3)

test_sample.py:6: AssertionError
========================= 1 failed in 0.12 seconds =========================
```



### logging

[Logging HOWTO——Basic Logging Tutorial](https://docs.python.org/3/howto/logging.html#logging-basic-tutorial)

```python
import logging

class TestSVM(unittest.TestCase):
    skip_flag = False
    @unittest.skipIf(skip_flag, "debug")
    def test_e71(self):
        #...
        logger.info("\n res is \n %s \n x is \n %s\n" % (str(res), res["x"]))
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)
```

### Reference

[Python doc](https://docs.python.org/3/library/)

[hypothesis doc](https://hypothesis.readthedocs.io/en/latest/quickstart.html#writing-tests)

[python-guide.org](https://docs.python-guide.org/writing/tests/)