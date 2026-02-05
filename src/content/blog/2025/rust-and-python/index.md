---
title: 'Rust ♥️ Python: Rust 做底层实现的高效 Python 库'
description: 'Rust ♥️ Python: 推荐一些 Rust 做底层实现的高效 Python 库'
date: 2025-06-25
tags: ['技术', '系统']
authors: ['mathew']
draft: false
---

Rust 和 Python 结合的生态这几年发展的越来越好，很多高性能的 Python 库都是用 Rust 作为底层实现。
本文推荐一些优秀的 Rust 实现的 Python 库，希望能够帮到大家。

<!-- more -->

## Astral 三剑客：Ruff, Uv, Ty

在 [Ruff](https://github.com/astral-sh/ruff),
[Uv](https://github.com/astral-sh/uv),
[Ty](https://github.com/astral-sh/ty)
出现之前，想要构建一个较为合格的 Python 项目，你需要组合使用一堆来自不同年代和不同风格的工具：Flake8, Isort, Black, Mypy, Poetry 等。
这些工具有各种问题，不过最大的问题还是太慢了。
Ruff 作为 Linter 和 Formatter，采用 Rust 作为底层实现，以其超快的速度和超高的准确率得到了很多开发者的认可。在生态逐渐取代了上述的 Flake8, Isort, Black 等工具。
接着，Uv 作为 Python 的包管理器，目标直指 Poetry，同样地比 Poetry 快太多了 (尤其是较早版本的 Poetry，依赖解析速度极慢)。最近出现的 Ty 作为 Python 的类型检查器，目标直指 Mypy，同样地比 Mypy 快很多，虽然 Ty 目前还处于早期阶段，不过未来可期。这几个工具给 Python 社区带来的影响是深远的，它们让 Python 的开发体验变得比之前好很多。

笔者在 23 年早期搞了一个 Python 项目模板 ([MPPT](https://github.com/shenxiangzhuang/mppt), Modern Python Project Template)，最早还是使用 Flake8, Isort, Black, Mypy, Poetry 等工具，目前已经逐渐被 Ruff, Uv, Ty 取代。

## Polars: 或许是新时代 Pandas 的接班人

Pandas 曾引领一个时代，但是随着数据量的增加，Pandas 的性能问题越来越明显。
[Polars](https://github.com/pola-rs/polars) 作为 Pandas 的替代品，采用 Rust 作为底层实现，带来了巨大的性能提升。在 Polars 之前，还有一个选择是 PySpark，这个现在业界用的也比较多。不过 Polars 性能比 PySpark 也快很多，而且使用也更加简单 (不过两者还是有很多相似性的)。

对于个人而言，Polars 的 LazyFrames 真的是太好用了，对于处理一些大于 RAM，但是没必要动用集群跑 Spark 的情况，Polars 目前是不二之选。

## Whenever: 无论何时何地都可以放心使用的日期工具

[Whenever](https://github.com/ariebovenberg/whenever) 是一个基于 Rust 的 Python 库，用于处理日期和时间。它主要用于处理日期和时间，解决了 Python 标准库`datetime`中日期和时间处理的很多[痛点](https://dev.arie.bovenberg.net/blog/python-datetime-pitfalls/)。

同样地它也很快，而且使用相比标准库也更加简单。准确来说，是心智负担小很多，这点从下面这个例子就可以看出来：`Instant.now()` 就是获取当前时间，这个时间就是真实世界当前时间的抽象，没有时区，没有各种奇怪的内部实现，没有任何歧义，就只是当前时间。(听起来好像没什么，但是做到这点并不容易:)

```python
>>> from whenever import (
...    Instant,
...    ZonedDateTime,
... )

# Identify moments in time, without timezone/calendar complexity
>>> now = Instant.now()
Instant(2024-07-04 10:36:56Z)

# Simple, explicit conversions
>>> now.to_tz("Europe/Paris")
ZonedDateTime(2024-07-04 12:36:56+02:00[Europe/Paris])
```

为什么说做到这点并不容易呢？让我们看下 Python 标准库的操作：你认为`datetime.datetime.utcnow().timestamp()` 会返回什么？
就看这个 API 名称，`utcnow` 是获取当前的 UTC 时间，`timestamp` 是获取其时间戳。
但实际上，如果运行代码的机器是 0 时区，那么`datetime.datetime.utcnow().timestamp()`返回的时间戳就是对的;如果是其他时区，那么返回的时间戳就是错的😭😭😭。这个东西直到 Python3.12 才会弹出来一个 `DeprecationWarning`，在这之前，你只能祈祷你的代码运行在 0 时区:D

## 最后

抛砖引玉，欢迎补充！
