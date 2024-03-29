# Backend: Python

## Frameworks

### FastAPI 🌟🌟🌟🌟🌟
很新也很好，对ORM，异步等的支持也更好，接口文档等也可以原生地生成，感觉后续会逐渐取代Flask。

### Flask 🌟🌟🌟🌟
轻量简便，应用较多的后端框架，比较适合简单的服务的构建。
但是对ORM，接口文档管理等目前比较通用的需求无内部集成，需要结合很多第三方库来实现。

### Django 🌟🌟🌟
更加完善的后端框架，更“重”一些，更适合大型项目的开发。

## ORM(Object-relational mapping)

### SQLAlchemy 🌟🌟🌟🌟🌟
较为流行，用的比较多的ORM框架，支持的数据库种类也比较多。

### SQLModel 🌟🌟🌟🌟
很新的框架，基于SQLAlchemy和Pydantic构建，更加Modern。
但是目前看距离1.0版本还要一段时间，文档也在完善中，所以可能还不太适合生产环境。


## ODM(Object-document mapping)

### [ODMantic](https://github.com/art049/odmantic)
**Sync and Async** ODM (Object Document Mapper) for MongoDB based on python type hints

### [Beanie](https://github.com/roman-right/beanie) 🌟🌟🌟🌟
**Asynchronous** Python ODM for MongoDB.
当前业务中用的最多的MongoDB ODM，支持异步，支持Pydantic。
整体用下来也没有遇到太大的坑，还是比较推荐使用的。

!!! note "大量数据Validation的性能问题"

    因为底层是用的Pydantic做数据校验，
    所以Beanie在大量数据的Validation上可能会有一些性能问题


### [Bunnet](https://github.com/roman-right/bunnet)
Synchronous Python ODM for MongoDB.(Beanie的同步版本)

## Database Migration

### [Alembic](https://github.com/sqlalchemy/alembic) 🌟🌟🌟🌟🌟
Alembic是使用非常广泛的数据库迁移工具，功能完善, 且和SQLAlchemy集成得很好。

!!! note "Alembic的使用场景"

    随着业务的发展，数据库的表结构和数据的变更是不可避免的，
    而数据库迁移工具就是用来管理这些变更的。
    一般来说，数据库迁移工具会记录下数据库的变更历史，
    并且可以根据这些历史记录来生成数据库迁移脚本，
    以便在不同的环境中执行这些脚本来同步数据库的变更。

    使用数据库迁移工具可以让数据库的变更更加可控，更加透明(以代码的方式记录变更历史)。


## Observability

目前接触到的有Skywalking和Sentry[^1].
[^1]: 相关实践参考: [https://datahonor.com/se/observability/](https://datahonor.com/se/observability/)


### Sentry 🌟🌟🌟🌟🌟

总体用下来Sentry要好用的多，支持足够好，使用足够简单，也可以同时满足问题排查和性能监控的需求。
Sentry相对优于Skywalking的地方很多，比如在性能监控方面，Sentry采集到的Span数据更加准确且精细，
可以很方便地基于性能监控数据来针对性地降低服务延时，而Skywalking的性能监控数据则相对粗糙，且采集的数据和实际有一定偏差。
另外在问题排查方面，Sentry的事件分析功能也更加强大，可以很方便地定位问题，而Skywalking的事件分析功能也相对简单。

### Skywalking 🌟🌟🌟
Skywalking可以接ElasticSearch来收集日志，这对于日志的检索/分析来说是一个很好的选择，
相对来水Sentry对全局的日志检索/分析的支持得不够好。


## Doc, Test, Lint & Format

!!! tip "MPPT: A Modern Python Package Template"

    [MPPT](https://datahonor.com/mppt)是一个现代Python库模版，收集了目前社区应用最广泛的工具，这里只是列举一部分。
    在MPPT文档中，还有更多的工具和实践，可以参考。

| Domain               | Tools                                              |
|----------------------|----------------------------------------------------|
| Documentation        | Mkdocs(with Material theme)                        |
| Testing              | Pytest(unit), Hypothesis(property), Locust(stress) |
| Linting & Formatting | black, flake8, isort, ruff, mypy                   |

