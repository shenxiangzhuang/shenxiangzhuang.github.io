# FastAPI Practices

## FastAPI Tips
[101 FastAPI Tips by The FastAPI Expert](https://github.com/Kludex/fastapi-tips)
提供了很多 FastAPI 的实践技巧，可以帮助我们从另外一个维度来了解 FastAPI 及其最佳实践。

## Async V.S. Sync
FastAPI 的[文档](https://fastapi.tiangolo.com/async)对于异步和同步的讨论已经很详细了。

简单来说，如果接口涉及的操作都是异步的 (1)，或者不涉及一些计算和等待，那么就用`async`；
如果涉及的操作都是同步的 (2), 那么就用`sync`。
{ .annotate }

1. 比如异步的数据库操作 (async redis 等)，异步的网络请求等，这些请求都不会阻塞当前的线程。
2. 比如一些计算，同步的数据库操作，网络请求等，这些请求都会阻塞当前的线程。


!!! note "其他相关的讨论"

    - [reddit: How do you decide which functions/routes should be async?](https://www.reddit.com/r/FastAPI/comments/18c66xt/how_do_you_decide_which_functionsroutes_should_be/)
      >the rule is, if the handler only does async waiting inside, then use async. if you don't wait at all (pure calculations), no need for async. if you wait for non-async things, like file io, system calls, non-async databases, etc, then never specify async!
      >if you specify async and then wait for something synchronous, all other async calls will be stalled. bad.
      >in contrast, if you don't use async at all, it is a minor performance penalty, because fastapi will handle parallelism by other means, which are somewhat less performant.
