# Distributed System


## Message Queue

### Kafka
目前业界较为常用的消息中间件。社区活跃，文档齐全，更加Modern一些。

### RabbitMQ
较早比较流行的MQ, 比较老一些。

## Elastic Stack(ELK): Elasticsearch, Kibana, Beats & Logstash

### Elasticsearch
一般用于服务日志的存储和检索。总体使用十分方便，但是对于嵌套数据(如json嵌套)查询的支持并不是很友好。
上手的学习成本主要要是DSL查询语法的学习。

### Kibana
很方便对ES的数据进行可视化。同样地建图的语法也是需要一定的学习成本。

### Logstash
Elastic的日志收集组件

### Beats
TODO
