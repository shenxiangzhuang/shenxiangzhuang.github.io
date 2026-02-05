---
title: '简单聊一聊 Redis 的锁'
description: '结合最近给 Redis 社区提的一个 PR，简单聊一聊 Redis 的锁机制'
date: 2025-03-23
tags: ['技术', '系统']
authors: ['mathew']
draft: false
---

今天我们分析一下 redis-py 一个奇怪的报错并据此简单聊一下 Redis 的锁机制。

<!-- more -->

## 奇怪的报错

我们采用 redis-py 最新的 [5.3.0b5](https://github.com/redis/redis-py/tree/v5.3.0b5) 版本来测试下面的逻辑。

首先我们定义下面两个线程：线程 1 就是获取锁并打印日志；线程 2 则是试图释放这同一个锁。

```python
import redis

r = redis.Redis()
lock_name = "lock:example"


def thread1_function():
    print("Thread 1: Starting")
    lock = r.lock(lock_name, timeout=5)
    if lock.acquire():
        print("Thread 1: Lock acquired")


def thread2_function():
    print("Thread 2: Starting")
    lock = r.lock(lock_name)
    try:
        lock.release()
    except Exception as e:
        print(f"Thread 2: Lock error: {e}")
```

之后我们启动这两个线程，先启动线程 1，过 1 秒再启动线程 2，保证线程 1 可以先拿到锁：

```python
t1 = threading.Thread(target=thread1_function)
t2 = threading.Thread(target=thread2_function)

t1.start()
time.sleep(1)
t2.start()

t1.join()
t2.join()
```

在看输出之前，我们可以先想一下这里预期的行为应该是怎样的。
因为线程 1 先启动，所以它可以先拿到锁。之后线程 2 试图去释放一个不属于自己的锁，那应该是报错的。
事实上，实际结果也差不多，但是有个奇怪的报错信息：

```
Thread 1: Starting
Thread 1: Lock acquired
Thread 2: Starting
Thread 2: Lock error: Cannot release an unlocked lock
```

这里的奇怪的地方在于，当线程 2 试图去释放一个不属于自己的锁的时候，报的错是`Cannot release an unlocked lock`。
这里报错信息就很奇怪，因为此时对应的锁并不是`unlocked`，它目前仍然是 `locked` 的状态，且被线程 1 持有。
后面我提了一个 PR 来解决这里的问题 (redis-py [#3535](https://github.com/redis/redis-py/issues/3535))。
在介绍这个 PR 之前，让我们先来简单了解下 redis-py 中锁机制的实现逻辑。


## redis-py 中的锁

我们先来看下目前 redis-py 中锁的实现。
首先是锁获取 (acquire) 的[实现](https://github.com/redis/redis-py/blob/28964c1ec4fc481141f6025248845c5e22588a41/redis/lock.py#L173-L228)：

!!! note "省略部分代码"

    为了便于阅读，这里我们省略部分与当前逻辑关系不大的代码，用`# skip`占位。


```python
def acquire(
    self,
    # skip
    token: Optional[str] = None,
):
    # skip
    if token is None:
        token = uuid.uuid1().hex.encode()
    else:
        encoder = self.redis.get_encoder()
        token = encoder.encode(token)
    # skip
    while True:
        if self.do_acquire(token):
            self.local.token = token
            return True
        # skip

def do_acquire(self, token: str) -> bool:
    # skip
    if self.redis.set(self.name, token, nx=True, px=timeout):
        return True
    return False

```

可以看到，默认情况下，获取锁的操作其实就是生成一个 `token`并存在`self.local`中 (默认为`threading.local()`).
在上述的例子中，线程 1 先获取到了锁，所以其就将生成 `token` 存在 `thread1_function`函数中的`lock.local.token`中。

同样地，我们来看下锁释放 (release) 的代码[实现](https://github.com/redis/redis-py/blob/28964c1ec4fc481141f6025248845c5e22588a41/redis/lock.py#L248-L265):

```python
def release(self) -> None:
    expected_token = self.local.token
    if expected_token is None:
        raise LockError("Cannot release an unlocked lock", lock_name=self.name)
    self.local.token = None
    self.do_release(expected_token)

def do_release(self, expected_token: str) -> None:
    if not bool(
        self.lua_release(keys=[self.name], args=[expected_token], client=self.redis)
    ):
        raise LockNotOwnedError(
            "Cannot release a lock that's no longer owned",
            lock_name=self.name,
        )
```

可以看到，这里锁释放的时候首先就是检查本地记录的 `token`，
如果其为`None`, 那么就报错`LockError("Cannot release an unlocked lock", lock_name=self.name)`。
因为上述例子中，线程 2 去释放锁的时候，`thread2_function`函数中的`lock.local.token`其实就是初始化的状态，即为`None`，
所以就会得到上述报错。

至此问题就比较清晰了，我们从线程 2 去释放此时被线程 1 持有的锁，无法释放是正常的 (因为并不是自己的锁)，
但是报错信息却有很大的误导性——这里不应该报错`Cannot release an unlocked lock`。

那么怎么让报错更友好一些呢，其实就是考虑释放锁时哪些情况可以跑到这个逻辑。其一就是原来的报错：当前锁并未被锁定，所以无法进行释放。
另外一种情况就是像这种别的线程去释放一个不属于自己的锁的情况。所以这里将报错信息调整一下即可，详见[PR](https://github.com/redis/redis-py/pull/3534)。

```diff
def release(self) -> Awaitable[None]:
    """Releases the already acquired lock"""
    expected_token = self.local.token
    if expected_token is None:
-        raise LockError("Cannot release an unlocked lock")
+        raise LockError(
+                "Cannot release a lock that's not owned or is already unlocked.",
+                lock_name=self.name,
+            )
    self.local.token = None
    return self.do_release(expected_token)
```


## thread_local 的使用

在读 redis 锁的文档和实现代码的时候，`redis.Lock`初始化参数中`thread_local`的[文档](https://github.com/redis/redis-py/blob/2fb2f47d0aa46c2622ee09f547f8c01d2eeb7738/redis/lock.py#L110-L134)
让我觉着有些难以理解：

```python
``thread_local`` indicates whether the lock token is placed in
thread-local storage. By default, the token is placed in thread local
storage so that a thread only sees its token, not a token set by
another thread. Consider the following timeline:

    time: 0, thread-1 acquires `my-lock`, with a timeout of 5 seconds.
             thread-1 sets the token to "abc"
    time: 1, thread-2 blocks trying to acquire `my-lock` using the
             Lock instance.
    time: 5, thread-1 has not yet completed. redis expires the lock
             key.
    time: 5, thread-2 acquired `my-lock` now that it's available.
             thread-2 sets the token to "xyz"
    time: 6, thread-1 finishes its work and calls release(). if the
             token is *not* stored in thread local storage, then
             thread-1 would see the token value as "xyz" and would be
             able to successfully release the thread-2's lock.

In some use cases it's necessary to disable thread local storage. For
example, if you have code where one thread acquires a lock and passes
that lock instance to a worker thread to release later. If thread
local storage isn't disabled in this case, the worker thread won't see
the token set by the thread that acquired the lock. Our assumption
is that these cases aren't common and as such default to using
thread local storage.
```

其实如果不仔细读几遍或者对这里的使用场景不太熟悉，可能会觉着这里有些莫名其妙 (至少我是这样:)。
其实这里的意思并不复杂，默认的情况就是`thread_locl=True`, 也就是上面提到的将 `token` 放到 `threading.local()`，
这样 `token` 就只在当前线程可见，如此便可以避免从其他线程释放掉当前线程锁的情况。
但是有些特殊的情况可能需要使得当前线程的锁可以被其他线程释放才可以 (`token` 可以被共享)，
比如文档所说这种需要将当前线程的锁给到另外一个 worker 线程去延迟释放锁的的情况。

具体实现上来说，在`thread_local=False`的时候，`self.local` 用的是[`SimpleNamespace`](https://docs.python.org/3/library/types.html#types.SimpleNamespace)

```python
self.local = threading.local() if self.thread_local else SimpleNamespace()
```

>A simple object subclass that provides attribute access to its namespace, as well as a meaningful repr.

`SimpleNamespace`其实就是一个简单的对象，其可以通过属性访问其命名空间。

在思考这个问题的时候，我也在 GitHub 上提了一个问题：
[Question: is the thread_local=False works only when use the same Lock instance?](https://github.com/redis/redis-py/issues/3540)，
这里提供了一些例子来说明这个问题，可以作为参考。

