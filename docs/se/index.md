# Software Engineering

## Principles

### Branching Model
[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)

### Semantic Versioning
[Semantic Versioning 2.0.0](https://semver.org/)

### Keep a Changelog
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

### The Twelve Factors
[The Twelve Factors](https://12factor.net/)


## API Management

??? tip "*Book: Mastering API Architecture*"

    Book: [Mastering API Architecture](https://www.oreilly.com/library/view/mastering-api-architecture/9781492090625/)


### 避免引入不兼容的变化

在开发 API 接口时，即使是在非稳定的版本，也应该尽量避免不向前兼容的接口，最好是通过引入新的接口，并逐步废弃旧的的方式来完成切换。
这里主要的考量是下游服务的调用。

???+ warning "不兼容带来的问题"

    如果接口不兼容，当前服务变更时，下游的服务必须同步变更，
    否则如果下游(对上游的)服务调用没有加异常处理就会导致下游服务调用失败。

所以如果可能的话，还是尽量引入新的接口，将旧接口标记为即将废弃，并通知下游做变更。
在下游变更完成时再将废弃接口相关代码清理掉 (减少 dead code)。


## OSS: Open Source Software

[OSS Insight](https://ossinsight.io/)可以对 OSS 项目进行统计分析，提供一些项目的数据指标。
比如本项目的[OSS Insight](https://ossinsight.io/analyze/shenxiangzhuang/shenxiangzhuang.github.io#overview)。
