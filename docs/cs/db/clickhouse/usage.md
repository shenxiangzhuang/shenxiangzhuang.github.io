# ClickHouse 使用


## Python SDK 新建连接耗时长

使用 ClickHouse 官方的 Python SDK 时发现每次请求用新建 client 的方式耗时比较长，
通过 Sentry 的 trace 可以清晰地看到这部分的耗时：

<figure markdown="span">
  ![Image title](../images/ck_client_time_usage.png){ width="800" }
  <figcaption>Sentry 记录的一次完整 CK 查询的耗时</figcaption>
</figure>

这个连接建立耗时理论上不应该那么久，具体原因没有去查了。
目前通过建立一个全局的 client 来规避这个问题，上线后整体查询的耗时下降很多。
