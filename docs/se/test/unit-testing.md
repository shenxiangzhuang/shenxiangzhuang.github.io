# Book: Unit Testing

*Unit Testing: Principles, Practices and Patterns*

## Part1: The bigger picture

### Chap1: The goal of unit testing

The goal is to enable **sustainable** growth of the software project.

???+ abstract "总结"

    - 写测试很重要，写好的测试同样重要。不恰当的测试最终会导致和不写测试一样的结果：
      项目因为难以做变更进入停滞 (stagnation) 状态或在每次变更后出现很多 Bug。

    - 测试的最终目标是保持软件项目迭代的可持续性，避免进入停滞阶段并避免代码变更带来的各种问题。

    - 并不是所有的测试具有同样的重要性。每个测试都有自己的成本和收益，需要谨慎评估两者并作出取舍，
      只需要保留那些有正向收益的测试。注意测试代码和应用代码一样都是负债 (liabilities) 而不是资产 (assets)。

    - 应用代码不容易测试是代码质量存在问题的信号，因为一般好的应用代码都是易于测试的。但是反之不然，容易测试的代码不一定就是好的代码。

    - 覆盖度指标类似，低的覆盖度也是代码低质量的信号，但是高的覆盖度并不说明代码质量就一定好。

    - 一个成功的测试有以下几个特征：
        - 它被用于集成到开发流程中 (CI): 每次代码变更都会被自动执行
        - 仅针对代码库中最重要的部分
        - 在保持最小的维护成本时提供最大的价值

    - 达到单测目标的唯一途径：
        - 学会分辨好测试和坏测试
        - 能够重构一个测试使其更加有用

???+ note "Code&Branch coverage"

    === "Code coverage"

        $$ \text{Code coverage(test coverage)} = \frac{\text{Lines of code executed}}{\text{Total number of lines}} $$

    === "Branch coverage"

        $$ \text{Branch coverage} = \frac{\text{Branch traversed}}{\text{Total number of branches}}$$

### Chap2: What's a unit test?

???+ abstract "总结"

    - 单元测试(unit test)更加精确的定义：
        - 一个单元测试验证一个行为单元(A unit test verifies a single unit of behavior)
        - 运行快(Does it quickly)
        - 和其他单元测试互不影响(And does it in isolation from other tests)

    - 集成测试(integration test): 如果一个测试至少违背了上述单元测试三条规则中的一条，那么这个测试就是集成测试。
      端到端测试(End-to-end test)是集成测试的子集。


### Chap3: The anatomy of a unit testing

???+ abstract "总结"

    - 所有的单元测试都应该遵循AAA模式: arrange, act, assert.
      如果一个单元测试汉有多个arrange, act, assert代码块，说明当前测试在同时测试多个行为。
      如果当前测试是单元测试(而不是集成测试)，那么就需要将这个测试拆分成多个单元测试。

    - 如果act部分的代码超过一行，说明SUT(System under test)的API可能存在问题。
      因为这意味着用户每次想要预期的行为都必须执行多行代码才可以，否则就可能引起一些数据不一致等问题(inconsistencies)。
      这些inconsistencies又被称为invariant violations。而我们一般通过封装(encapsulation)的方式来避免invariant violations。

    - (尤其在存在多个Class交互时)将SUT的实例命名为sut以便于区分。
      将arrange, act, assert三部分代码用空行隔开或者增加注释(在无法使用空行的时候)来增加单测代码的可读性。

    - 通过工厂模式来复用test fixture的初始化代码，不要将这部分初始化代码放到constructor内部。
      这样可以让不同的测试之间保持高度的解耦且具有更好的可读性。

    - 不要使用严格的测试名称规范。像对无编程背景(但熟悉领域问题)的人描述场景一样的方式来为你的测试命名。
      用下划线来分割单词，且不需要在命名中引入待测试方法的函数名。

    - 参数化测试(Parameterized test)可以减少重复代码，但是写法会更加抽象一些，会牺牲一些可读性。

    - Assertion库(Assertion libraries)的使用可以使得测试代码读起来更像日常语言，进一步增加可读性。


## (TODO)Part2: Make your tests work for you


## (TODO)Part3: Integration testing


## (TODO)Part4: Unit testing anti-patterns
