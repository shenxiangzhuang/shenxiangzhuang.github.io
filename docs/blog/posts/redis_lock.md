---
title: 简单聊一聊 Redis 的锁
draft: false
date: 2025-03-23
authors: [mathew]
slug: redis_lock
description: >
    结合最近给 Redis 社区提的一个 PR，简单聊一聊 Redis 的锁机制
categories:
  - 终身学习
  - 开源
  - Engineering
---


今天我们分析一下 redis-py 一个奇怪的报错并据此简单聊一下 Redis 的锁机制。

## 奇怪的报错

我们采用 redis-py 最新的 5.2.1 版本来测试下面的逻辑。

首先我们定义下面两个线程：线程 1 就是获取锁并打印日志；线程 2 则是试图释放这同一个锁。

```python
import redis

# Create Redis client
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
# Create and start threads
t1 = threading.Thread(target=thread1_function)
t2 = threading.Thread(target=thread2_function)

t1.start()
time.sleep(1)
t2.start()

# Wait for threads to complete
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
这就很奇怪，因为此时对应的锁并不是`unlocked`，它目前仍然是 `locked` 的状态，且被线程 1 持有。

