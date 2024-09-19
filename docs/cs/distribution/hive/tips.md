# Hive Tips

## `WITH MID-TABLE AS (SELECT ...)`

在 Hive 中，可以使用`WITH`子句来定义一个中间表，然后在查询中引用这个中间表。这样可以使查询更加简洁，易于理解。

!!! note "Hive 0.13.0+"

    `WITH`子句在Hive 0.13.0及以上版本中可用。
    - [hadoop - Is there sql WITH clause equivalent in hive? - Stack Overflow](https://stackoverflow.com/questions/23909741/is-there-sql-with-clause-equivalent-in-hive)
    - [LanguageManual Select - Apache Hive - Apache Software Foundation](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select)

## Partitioning & Clustering(Bucketing)

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1xyX3aEx8zWGOylgZkZj4g.png)

!!! tip "拓展阅读"

    [Hive data organization — Partitioning & Clustering | by Amit Singh Rathore | Nerd For Tech | Medium](https://medium.com/nerd-for-tech/hive-data-organization-partitioning-clustering-3e14ef6ab121)

## `get_json_object`

`get_json_object`函数可以用来从 JSON 字符串中提取指定的字段。

!!! tip "拓展阅读"

    - [How to query struct array with Hive (get_json_object) or json serde - Stack Overflow](https://stackoverflow.com/questions/45020211/how-to-query-struct-array-with-hive-get-json-object-or-json-serde)
    - [JSON functions and operators — Trino 458 Documentation](https://trino.io/docs/current/functions/json.html#json-query)
    - [JSONPath - XPath for JSON](https://goessner.net/articles/JsonPath/)
