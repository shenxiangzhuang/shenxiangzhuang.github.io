# 自建 ClickHouse 的问题及优化措施

记录使用自建 ClickHouse 的经历。


## 性能不及预期

在搭建完成后，压测的时候发现性能并不及预期。
后来经查阅文档可以看到和硬件有关：CK 的性能受内存和硬盘的影响。
内存要大一些，硬盘最好用 SSD 才能达到比较好的性能。
据此可以推测性能退化是和内存设置过小且使用 HDD 硬盘有关。

!!! tip "官方推荐配置"

    - [recommendations-for-self-managed-clickhouse](https://clickhouse.com/docs/en/install#recommendations-for-self-managed-clickhouse)
    - [Usage Recommendations](https://clickhouse.com/docs/en/operations/tips)


## 磁盘占用过高
在使用一段时间后，CK 挂载的数据卷出现了磁盘写满的问题，但保存的数据远远没有那么多。

看了下表的存储情况：
```sql
SELECT
  database,
  table,
  formatReadableSize(sum(bytes)) AS size
FROM system.parts
WHERE active
GROUP BY
  database,
  table
ORDER BY sum(bytes) DESC
```

| database | table                   | size       |
|----------|-------------------------|------------|
| system   | asynchronous_metric_log | 11.25 GiB  |
| system   | trace_log               | 2.36 GiB   |
| system   | metric_log              | 2.09 GiB   |
| system   | query_log               | 974.79 MiB |

可以看到比较大的几张表都是 system table.
在 CK 的[System Tables 文档](https://clickhouse.com/docs/en/operations/system-tables)中其实写到了关于系统表的情况：

!!! quote "System Tables"

    By default, table growth is unlimited.
    To control a size of a table, you can use TTL settings for removing outdated log records.
    Also you can use the partitioning feature of MergeTree-engine tables.


也就是说系统表的数据默认是永久保存的...所以自建的时候需要自己配置 TTL 来定期清理这些日志。
文档也以`query_log`给出了 TTL 配置的示例：
```xml linenums="1" hl_lines="6"
<clickhouse>
    <query_log>
        <database>system</database>
        <table>query_log</table>
        <partition_by>toYYYYMM(event_date)</partition_by>
        <ttl>event_date + INTERVAL 30 DAY DELETE</ttl>
        <!--
        <engine>ENGINE = MergeTree PARTITION BY toYYYYMM(event_date) ORDER BY (event_date, event_time) SETTINGS index_granularity = 1024</engine>
        -->
        <flush_interval_milliseconds>7500</flush_interval_milliseconds>
        <max_size_rows>1048576</max_size_rows>
        <reserved_size_rows>8192</reserved_size_rows>
        <buffer_size_rows_flush_threshold>524288</buffer_size_rows_flush_threshold>
        <flush_on_crash>false</flush_on_crash>
    </query_log>
</clickhouse>
```
这个示例代码其实是来自 CK 自带的配置文件[`/etc/clickhouse-server/config.xml`](https://github.com/ClickHouse/ClickHouse/blob/a11baf176b2ca63c8a8b24dc8418420d2eeaaca5/programs/server/config.xml#L1073-L1127).
我们配置的方法也比较简单：复制这个文件，定位到上述各个系统表的位置，分别增加 TTL 配置；打镜像的时候将这个文件放到`/etc/clickhouse-server/config.xml`路径下即可。
比如对`asynchronous_metric_log`这张表设置 7 天的 TTL，只需要增加`<ttl>event_date + INTERVAL 7 DAY DELETE</ttl>`这一行配置：
```xml linenums="1" hl_lines="14"
<clickhouse>
    <!--
        Asynchronous metric log contains values of metrics from
        system.asynchronous_metrics.
    -->
    <asynchronous_metric_log>
        <database>system</database>
        <table>asynchronous_metric_log</table>
        <flush_interval_milliseconds>7000</flush_interval_milliseconds>
        <max_size_rows>1048576</max_size_rows>
        <reserved_size_rows>8192</reserved_size_rows>
        <buffer_size_rows_flush_threshold>524288</buffer_size_rows_flush_threshold>
        <flush_on_crash>false</flush_on_crash>
        <ttl>event_date + INTERVAL 7 DAY DELETE</ttl>
    </asynchronous_metric_log>
<clickhouse>
```

增加这个配置之后，需要重启 CK 实例以使得对应的 TTL 生效。
重启后再次查看系统表的情况会发现新增一些类似`asynchronous_metric_log_0`的表 (后缀为`_0`)，
这些表包含重启之前所有的历史数据。

这里因为用不到这些日志，所以直接删掉来把磁盘空间空出来：
```sql
DROP TABLE system.asynchronous_metric_log_0
```

!!! note "异步删除"

    注意这里文件建议不要用`SYNC`, 也就是尽量用`DROP TABLE system.asynchronous_metric_log_0`
    而不是`DROP TABLE system.asynchronous_metric_log_0 SYNC`。前者可以异步删除数据而不影响其他查询。
