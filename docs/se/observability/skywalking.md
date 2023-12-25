# Skywalking


## Installation/Deployment

这里参考[文档](https://skywalking.apache.org/docs/main/v9.1.0/en/setup/backend/backend-docker/)
采用Docker部署的方式。


首先是Backend即OAP Server的部署:
```bash
docker run --name oap --restart always -d apache/skywalking-oap-server:9.0.0
```
之后`docker inspect oap`查看OAP Server容器的IP地址，这里为`172.17.0.2`:
```bash
...
"Gateway": "172.17.0.1",
"IPAddress": "172.17.0.2",
...
```

然后是UI的部署，注意这里`SW_OAP_ADDRESS`的配置需要为`http://172.17.0.2:12800`:
```bash
docker run -p 8080:8080 --name oap-ui --restart always -d -e SW_OAP_ADDRESS=http://172.17.0.2:12800 apache/skywalking-ui:9.0.0
```

之后`docker container ls`检查两个服务是否成功启动:
```bash
CONTAINER ID   IMAGE                                COMMAND                  CREATED          STATUS          PORTS                                       NAMES
c98fd6b94248   apache/skywalking-ui:9.0.0           "bash docker-entrypo…"   30 seconds ago   Up 29 seconds   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   oap-ui
265a26cc28fb   apache/skywalking-oap-server:9.0.0   "bash docker-entrypo…"   35 seconds ago   Up 34 seconds   1234/tcp, 11800/tcp, 12800/tcp              oap

```

最后访问[http://127.0.0.1:8080](http://127.0.0.1:8080)可以看到UI界面。


## Usage

服务自动分组: [Service Auto Grouping](https://skywalking.apache.org/docs/main/v9.1.0/en/setup/backend/service-auto-grouping/)
