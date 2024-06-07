# Backend: Python

## Books

- [ ] [Architecture Patterns with Python](https://www.cosmicpython.com/)

    ??? "实用的开发模式"

        介绍了 DDD, Repository Pattern, Unit of Work, Dependency injection 等常见且实用的设计模式。

- [x] [Python Concurrency with asyncio](https://www.manning.com/books/python-concurrency-with-asyncio) 🌟🌟🌟🌟

    ???+ "Python 异步编程"

        - 介绍了 Python 异步编程的基础知识，以及如何使用 asyncio 来构建异步应用。对于理解 FastAPI 的异步编程模型有很大帮助。

        - 本书前 3 章节介绍了 Python 的异步编程基础，后面的章节介绍了如何使用 asyncio 来构建异步应用，以及如何使用 asyncio 来处理并发问题。
        个人感觉前 3 章对了解 asyncio 的原理帮助比较大：从 scoket 讲起，之后手动实现 blocking 和 non-blocking 的 socket，
        最后基于 non-blocking 的 socket 实现了一个简单的 web server。这里相当于手动实现了一个简单的 asyncio，清晰地展示了其主要的工作原理。

        - 后面在第 9 章讲解了 WSGI (web server gateway interface) 和 ASGI (asynchronous server gateway interface) 的一些基本原理，
        这部分背景知识也值得学习一下 (可惜的是这部分讲解比较少也比较浅显)。

        - 书中对很多高阶的异步编程模式也有介绍，比如异步队列，加锁同步等，在遇到复杂异步场景时也可以作为很好的参考资料。
        - 总的来说还是比较值得一读。


## Frameworks

### FastAPI 🌟🌟🌟🌟🌟
很新也很好，对 ORM，异步等的支持也更好，接口文档等也可以原生地生成，感觉后续会逐渐取代 Flask。

!!! tip "FastAPI Practice"

    更多关于FastAPI的实践见[FastAPI Practice](./fastapi)


### Flask 🌟🌟🌟🌟
轻量简便，应用较多的后端框架，比较适合简单的服务的构建。
但是对 ORM，接口文档管理等目前比较通用的需求无内部集成，需要结合很多第三方库来实现。

### Django 🌟🌟🌟
更加完善的后端框架，更“重”一些，更适合大型项目的开发。

## ORM(Object-relational mapping)

### SQLAlchemy 🌟🌟🌟🌟🌟
较为流行，用的比较多的 ORM 框架，支持的数据库种类也比较多。

### SQLModel 🌟🌟🌟🌟
很新的框架，基于 SQLAlchemy 和 Pydantic 构建，更加 Modern。
但是目前看距离 1.0 版本还要一段时间，文档也在完善中，所以可能还不太适合生产环境。


## ODM(Object-document mapping)

### [ODMantic](https://github.com/art049/odmantic) 🌟🌟🌟🌟
**Sync and Async** ODM (Object Document Mapper) for MongoDB based on python type hints

!!! tip "FastAPI :heart: ODMantic"

    FastAPI的NOSQL[文档](https://fastapi.tiangolo.com/how-to/nosql-databases-couchbase/)
    提到说后续的Tutorail会采用ODMantic。ODMantic也给出了FastAPI中使用的[示例](https://art049.github.io/odmantic/usage_fastapi/),
    所以如果是新的FastAPI项目，可以考虑使用ODMantic。


### [Beanie](https://github.com/roman-right/beanie) 🌟🌟🌟🌟
**Asynchronous** Python ODM for MongoDB.
当前业务中用的最多的 MongoDB ODM，支持异步，支持 Pydantic。
整体用下来也没有遇到太大的坑，还是比较推荐使用的。

!!! note "大量数据 Validation 的性能问题"

    因为底层是用的Pydantic做数据校验，
    所以Beanie在大量数据的Validation上可能会有一些性能问题


### [Bunnet](https://github.com/roman-right/bunnet)
Synchronous Python ODM for MongoDB.(Beanie 的同步版本)

## Database Migration

### [Alembic](https://github.com/sqlalchemy/alembic) 🌟🌟🌟🌟🌟
Alembic 是使用非常广泛的数据库迁移工具，功能完善，且和 SQLAlchemy 集成得很好。

!!! note "Alembic 的使用场景"

    随着业务的发展，数据库的表结构和数据的变更是不可避免的，
    而数据库迁移工具就是用来管理这些变更的。
    一般来说，数据库迁移工具会记录下数据库的变更历史，
    并且可以根据这些历史记录来生成数据库迁移脚本，
    以便在不同的环境中执行这些脚本来同步数据库的变更。

    使用数据库迁移工具可以让数据库的变更更加可控，更加透明(以代码的方式记录变更历史)。


## Observability

目前接触到的有 Skywalking 和 Sentry[^1].
[^1]: 相关实践参考：[https://datahonor.com/se/observability/](https://datahonor.com/se/observability/)


### Sentry 🌟🌟🌟🌟🌟

总体用下来 Sentry 要好用的多，支持足够好，使用足够简单，也可以同时满足问题排查和性能监控的需求。
Sentry 相对优于 Skywalking 的地方很多，比如在性能监控方面，Sentry 采集到的 Span 数据更加准确且精细，
可以很方便地基于性能监控数据来针对性地降低服务延时，而 Skywalking 的性能监控数据则相对粗糙，且采集的数据和实际有一定偏差。
另外在问题排查方面，Sentry 的事件分析功能也更加强大，可以很方便地定位问题，而 Skywalking 的事件分析功能也相对简单。

### Skywalking 🌟🌟🌟
Skywalking 可以接 ElasticSearch 来收集日志，这对于日志的检索/分析来说是一个很好的选择，
相对来水 Sentry 对全局的日志检索/分析的支持得不够好。


## Doc, Test, Lint & Format

!!! tip "MPPT: A Modern Python Package Template"

    [MPPT](https://datahonor.com/mppt)是一个现代Python库模版，收集了目前社区应用最广泛的工具，这里只是列举一部分。
    在MPPT文档中，还有更多的工具和实践，可以参考。

| Domain               | Tools                                              |
|----------------------|----------------------------------------------------|
| Documentation        | Mkdocs(with Material theme)                        |
| Testing              | Pytest(unit), Hypothesis(property), Locust(stress) |
| Linting & Formatting | black, flake8, isort, ruff, mypy                   |


## Tools

### Retry

#### Tenacity 🌟🌟🌟🌟🌟
[tenacity](https://github.com/jd/tenacity)是普遍使用的重试库，整体功能已经比较完善，可以满足大部分的重试场景。

#### stamina 🌟🌟🌟🌟
[stamina](https://github.com/hynek/stamina): Production-grade retries for Python.
是对 tenacity 的封装，目的是提供更加好用的 API，更加方便的使用。


