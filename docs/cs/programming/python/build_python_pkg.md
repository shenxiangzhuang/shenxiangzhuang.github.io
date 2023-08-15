# How to build a python package


这里记录下如何将自己写的Python程序打包成库，并安装, 参考官方文档[Packaging Python Projects](https://packaging.python.org/tutorials/packaging-projects/)。

##  方法一：官方安装流程

首先，我们要有一个文件夹，比如名为`mypkg`的文件夹。

之后我们需要将我们主要的源文件，比如`myml`文件夹（比如里面是一些机器学习的算法实现）， 添加到`mypkg`中。

之后我们需要两个辅助文件：`setup.py`和`README.md`

其中`README.md`写上项目简短的说明即可。

`setup.py`需要按照一定的格式写，比如下面这样：

```python
import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="example-pkg-your-username",
    version="0.0.1",
    author="Example Author",
    author_email="author@example.com",
    description="A small example package",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/pypa/sampleproject",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
```



之后呢，我们就可以将上面的文件夹打包并发布了，发布之后便可以自行通过pip安装。具体可以参考上面官网的链接。

但是，我们这里可能会有一个需求，那就是，我们可能要持续开发这个库。这样的话，我们可以用pip提供的[“Editable” Installs](https://pip.pypa.io/en/stable/reference/pip_install/#id44), 如此可以进入[“Development Mode”](https://setuptools.readthedocs.io/en/latest/setuptools.html#id25)。也即，我们只需要在`mypkg`上层文件夹下运行`pip install -e mypkg`就可以直接进入开发模式。这时候我们已经可以在终端（但是记得不要在`myml`文件下，不然就会无法调用）运行Python, 并直接通过`import myml`来完成调用。

这里我们对代码进行更改后，只需要在`mypkg`文件下用命令行运行`python setup.py build`就可以将新的改动提交上去。最后在我们将项目开发完时，运行`python setup.py develop --uninstall`将开发版本卸载掉，之后重新打包发布，在安装正式版本即可。

### `__init__.py`文件的写法

首先明确`__init__.py`文件存在，则其所在的文件夹被自动视为一个`package`,在运行`import package_name`之后，其对应的`__init__.py`首先被调用。

按照文档，最顶层的`__init__.py`可以只写上库名字：`name = "example_pkg"`。

其他的一般空下，不写任何东西，只是作为一个标识。

也有时候会用于多个`submodules`的一起调用或者限制调用，具体可以参考*Python Cookbook3-Chap10*.



### 测试

在写完需求后，写简单的单元测试来验证API的正确性，同时也避免了通过打印测试的局限性。目前主要用的还是`unittest`库，结合`vscode`使用非常方便。



### 文档

对于一个完整的库来说，文档是必不可少的，这里选用的是用`Sphinx`来做项目的文档。大致流程可以先参考下[这里](https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html), 将文档通过Github发布，可以参考[Open Source Options](https://www.youtube.com/channel/UCOSeGDrlScCNgBcN5C8nTEw)的这个教程， 最后还有些细枝末节的问题，可以看[这篇文档](https://daler.github.io/sphinxdoc-test/includeme.html)

上面的教程总体感觉都挺乱的，这里进行下汇总。

#### Step1: 本地生成

首先安装`sphinx`: `pip install sphinx`.

之后在`mypkg`新建文件夹`sphinx`， 之后进入该文件夹`cd sphinx`，并运行`sphinx-quickstart`， 根据提示输入对应的信息。（这里填错了后面还可以改的）



这时候，可以根据[reStructuredText](http://sphinx-doc.org/rest.html) 语法写改`sphinx`文件夹下的`.rst`文件，指定生成文档的内容与格式等。



之后修改`sphinx/source/conf.py`文件设置`autodoc`，参考[这里](https://www.jianshu.com/p/23a54872ab82)。因为我在设置的时候没有遇到让加入`extensions`的提示，所以就手动设置，修改结果如下：

```python
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "sphinx.ext.todo",
    "sphinx.ext.viewcode",
    "sphinx_rtd_theme",
]
```

这里还有去掉下面路径设置的注释

```python
import os
import sys

sys.path.insert(0, os.path.abspath(''))
```

然后保存（其他设置可以随便找个开源项目看看别人怎么写的，比如`requests`库），在`sphinx`文件夹下，终端执行`sphinx-apidoc -o ./source ../src/`

最后是生成html文件，`make html`。

此时可以打开`sphinx/build/html/index.html`打开文档。

#### Step2: 发布文档

发布的方法[这篇文档](https://daler.github.io/sphinxdoc-test/includeme.html)写的比较详细，可以照着作下，我这里并没有测试，而是按照[Open Source Options](https://www.youtube.com/channel/UCOSeGDrlScCNgBcN5C8nTEw)最后一集比较粗暴的方法。

就是在`mypkg`文件夹下新建一个`docs`文件夹，之后将`html`文件夹下的文档全部复制过去，再新建一个`.nojekyll`文件，之后直接commit， push到github。最后在项目的`setting`中选择githubpages的设置，选中`docs`文件夹即可。

之后重新生成文档，同样将`html`文件夹下的文件全部复制到`docs`再提交就是了。注意这里`.nojekyll`文件十分重要，如果没有这个文件（而是选择某个主题），会出现文档页面无法显示的情况。

在全部完成之后就可以打包发布了。其他可能有些设置没有提到，可以看下我的[ToyData](https://github.com/shenxiangzhuang/ToyData)项目的设置。

## 方法二：自动化构建

之前的项目都是按照上面的方法一来构建和发布的，但是总体来看，流程还是有一些复杂的...(当然了，全面地了解下这个流程还是很有必要的)

所以就查了下一些自动化构建的工具，在测试过之后采取了[Poetry](https://python-poetry.org/)+[MkDocs](https://www.mkdocs.org)的组合: Poetry用于库文件的创建，库的本地打包与[PyPI](https://pypi.org/)上传; MkDocs用于文档的生成与部署。下面简单介绍下整个库从重建到发布的流程。(Poetry和MkDocs的安装见官网指引)

### 本地创建库

命令行执行`poetry new poetry-mkdocs-shenxzh`, 输出`Created package poetry_mkdocs_shenxzh in poetry-mkdocs-shenxzh`.

查看文件目录

```
➜ tree
.
├── poetry_mkdocs_shenxzh
│   └── __init__.py
├── pyproject.toml
├── README.rst
└── tests
    ├── __init__.py
    └── test_poetry_mkdocs_shenxzh.py
```

我们在`poetry_mkdocs_shenxzh`文件夹下放我们的库源码，在`tests`文件夹下做测试。为了符合一般习惯，可以把`README.rst`改成`README.md`, `pyproject.toml`是项目的主要配置文件，包括库依赖等设置。

后面就要进行库的开发了，我们用Git记录开发过程，故在`pyproject.toml`同目录(后称之为根目录)下运行`git init`初始化项目。

之后添加库文件，修改`README.md`文件， `.gitignore`，测试...

之后在根目录下执行`mkdocs new docs`, 此时`docs`文件夹目录

```
➜ tree .
.
├── docs
│   └── index.md
└── mkdocs.yml
```

我们将在`docs/docs`文件夹下放我们的文档源文件，这里是`.md`格式的。`mkdocs.yml`是MkDocs的配置文件。

我们在`docs/docs`文件夹下加入`intro.md`之后修改`mkdocs.yml`为

```
site_name: My Docs
nav:
    - Home: index.md
    - Introduction: intro.md
```

之后`mkdocs serve`就可以在打开本地服务，查看文档界面。调整合适之后即可`mkdocs build`生成html文件，位于`./docs/site`文件夹下。因为我们一般不把`site`目录加入Git(只用`docs/docs`下面的md文件就可以很好地追踪文档变化),所以将`docs/site`加入`.gitignore`之后再`add`, `commit`。(如果已经commit也可以用`git rm -r --cached docs/site`将其删除)

现在我们已经完成了库的开发和文档的本地生成。下面首先将项目发布到GitHub，然后发布文档，最后将整个库打包发布。

### 项目发布到GitHub

首先在Github新建项目`poetry-mkdocs-shenxzh`，之后复制仓库地址，执行`git remote add origin https://github.com/shenxiangzhuang/poetry-mkdocs-shenxzh.git`加入远程仓库地址。

### 发布文档

在`./docs`文件夹下执行`mkdocs gh-deploy`，输出

```
➜ mkdocs gh-deploy
INFO    -  Cleaning site directory
INFO    -  Building documentation to directory: /home/shensir/Documents/CS/MyPrograming/Python/poetry-mkdocs-shenxzh/docs/site
INFO    -  Documentation built in 0.23 seconds
WARNING -  Version check skipped: No version specified in previous deployment.
INFO    -  Copying '/home/shensir/Documents/CS/MyPrograming/Python/poetry-mkdocs-shenxzh/docs/site' to 'gh-pages' branch and pushing to GitHub.
INFO    -  Your documentation should shortly be available at: https://shenxiangzhuang.github.io/poetry-mkdocs-shenxzh/
```

这里直接访问`https://shenxiangzhuang.github.io/poetry-mkdocs-shenxzh/ `即可查看文档了。(我们可以在https://github.com/shenxiangzhuang/poetry-mkdocs-shenxzh/settings 中看到，GitHub Page的站点建立在`gh-pages`分支(`mkdocs gh-deploy`帮我们自动创建的)的根目录下。

### 发布库到PyPI

这里就是Poetry发挥作用的时候了，根目录执行`poetry build`把轮子造好（会自动创建`./dist`文件夹，然后将build好的文件放在这里）

```
➜ poetry build
Building poetry-mkdocs-shenxzh (0.1.0)
  - Building sdist
  - Built poetry-mkdocs-shenxzh-0.1.0.tar.gz
  - Building wheel
  - Built poetry_mkdocs_shenxzh-0.1.0-py3-none-any.whl
```

之后执行`poetry publish`即可直接将库发布。

```
➜ poetry publish

Username: IronSky
Password:
Publishing poetry-mkdocs-shenxzh (0.1.0) to PyPI
 - Uploading poetry-mkdocs-shenxzh-0.1.0.tar.gz 100%
 - Uploading poetry_mkdocs_shenxzh-0.1.0-py3-none-any.whl 100%
```

此时登录https://pypi.org/manage/projects/即可看到发布的库，这时执行`pip install poetry-mkdocs-shenxzh`就可以安装了。因为我本地已经把默认源头换成了豆瓣源，所以需要`pip install poetry-mkdocs-shenxzh -i https://pypi.org/simple`才可以

```
➜ pip install poetry-mkdocs-shenxzh -i https://pypi.org/simple
Collecting poetry-mkdocs-shenxzh
  Downloading poetry_mkdocs_shenxzh-0.1.0-py3-none-any.whl (1.4 kB)
Installing collected packages: poetry-mkdocs-shenxzh
Successfully installed poetry-mkdocs-shenxzh-0.1.0
```

之后我们就可以使用我们自己写的库了！

```
In [1]: from poetry_mkdocs_shenxzh.hello import Hello

In [2]: h = Hello()

In [3]: h.sayHello()
Hello World!
```

## 后记

用MkDocs替换Sphinx其实有个问题,那就是没办法自动化生成API Doc，就是Python的Docstring不能直接生成文档。(暂时没找到好的插件可以做到这一点)

所以用MkDocs在不需要对源码做大量解释的情况下还是很方便的，如果要对源码做更多的介绍，可能还是Sphinx好一些？



