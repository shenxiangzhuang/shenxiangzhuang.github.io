# ElasticSearch & Kibana

## Installation & Deployment

首先是安装前的检查：[Bootstrap Checks](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/bootstrap-checks.html),
这里注意设置下`sysctl -w vm.max_map_count=262144`[^1]

[^1]: 参考：[Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/docker.html)


之后创建网络`docker network create elastic`, 再启动 ES 实例：
```bash
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.11.3
```

启动成功后记录下相应的帐号密码以及 Token(用于 Kibana 登录认证)。

???+ warning "新版本的 ES 需要认证"

    注意新版本的ES在Kibana连接时需要认证，这个在老版本中是没有的。
    比如Skywalking在采用ES作为日志收集后端时，教程采用的是ES7^2。

[^2]: [Start a standalone container with ElasticSearch 7](https://skywalking.apache.org/docs/main/v9.1.0/en/setup/backend/backend-docker/)

最后启动 Kibana 即可：
```bash
docker run --name kib01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.11.3
```


