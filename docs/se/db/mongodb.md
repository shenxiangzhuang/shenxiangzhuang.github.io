# MongoDB

## Practices

### Compound Indexes

mongo的
[Compound Indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/#compound-indexes)是最左匹配的(Index Prefixes):
当创建索引下述后
```json
{ "item": 1, "location": 1, "stock": 1 }
```

其两个Index Prefix分别是

- `{"item": 1}`
- `{"item": 1, "location": 1}`

- 此时当前的索引可以用于下面几种组合的查询:

- `item`
- `item`, `location`
- `item`, `location`, `stock`

注意其**不能**用于优化下面的查询组合:

- `location`
- `stock`
- `location`, `stock`

也就是说没有索引的第一个字段(这里是`item`)，后续的字段组合的查询都无法利用该索引。

!!! tip "The ESR (Equality, Sort, Range) Rule"

    在创建Mongo复合索引时，应当遵循[ESR原则](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/#std-label-esr-indexing-rule):
    简单说就是可以用Equality筛选的字段应当放在索引的前面用于最大程度上降低
    扫描文档的次数，Sort字段次之，Range相关字段最后。
