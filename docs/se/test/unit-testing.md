# Book: Unit Testing

*Unit Testing: Principles, Practices and Patterns*

## Part1: The bigger picture

### Chap1: The goal of unit testing

The goal is to enable **sustainable** growth of the software project.


!!! note "Code&Branch coverage"

    === "Code coverage"

        $$ \text{Code coverage(test coverage)} = \frac{\text{Lines of code executed}}{\text{Total number of lines}} $$

    === "Branch coverage"

        $$ \text{Branch coverage} = \frac{\text{Branch traversed}}{\text{Total number of branches}}$$


!!! abstract "总结"

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
