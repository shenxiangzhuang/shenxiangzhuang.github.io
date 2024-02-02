# MySQL


## Practices

!!! warning "可能并非最佳实践"

    这里仅记录一些常见的实践，但并不一定是最佳实践。

### 分页查询
当查询大量数据的时候，需要分页查询。否则会造成数据库慢查询过多，占用过多连接，影响其他查询的性能。

!!! tip "使用 `LIMIT` 和 `OFFSET`"
    使用 `LIMIT` 和 `OFFSET` 进行分页查询。

    ```sql
    SELECT * FROM table_name LIMIT 10 OFFSET 10;
    ```

    `LIMIT` 表示返回的行数，`OFFSET` 表示偏移量。


### 分批写入
类似读取大量数据时需要分页查询，当写入大量数据的时候，也需要分批写入,
同时需要注意错误处理需要`rollback`。


### Deadlock: `INSERT ... ON DUPLICATE KEY UPDATE`

`INSERT ... ON DUPLICATE KEY UPDATE`在高并发的情况下，可能会出现死锁。



