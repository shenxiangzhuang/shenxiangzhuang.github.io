# Lifelong Learn: Elixir

## 换源
[UPYUN 支持 Elixir hex.pm 国内镜像](https://ruby-china.org/topics/31631)

```shell
export HEX_MIRROR="https://hexpm.upyun.com"
export HEX_CDN="https://hexpm.upyun.com"
```


## Books


## Courses

- [x] [The Pragmatic Studio Elixir and OTP](https://pragmaticstudio.com/courses/elixir)

!!! note "非常好的入门教程"

    这门课程基本以构建网络服务(RESTful CRUD接口)为线索，在前期循序渐进地介绍了Elixir语言的一些基础特性,
    如`function`, `module`, `struct`, `Process`等，从零构建一系列后端接口后引入对
    [Phoenix](https://www.phoenixframework.org/)的介绍，完美完成过渡和对接——让Phoenix中一些
    原本一些难以理解的概念变得顺理成章。在课程后期逐步引入对GenServer的介绍，也是先从零实现了一遍，之后替换为
    GenServer的实现。这个过程让GenServer的学习曲线也变得平滑(帮助理解参数的设计和传递原理等)。

    同时通过视频的形式可以更容易学习到平时Elixir开发的流程是怎么样的，比如课程中大量使用`iex`做一些简单的测试，
    先写`IF-ELSE`逻辑，之后用Pattern Match来简化/解耦等。这对我们做实际的开发也有很大的帮助。

    最后提一下课程的设计真的优秀，曲线非常平滑，而且比较注重工程实践，这点也非常难得。


??? tip "B 站资源"

    [Elixir & OTP](https://www.bilibili.com/video/BV1944y1p7XD?p=24&vd_source=38496312658bc94e9d3106e4eb6dbc70)
