# Lifelong Learn: Deep Learning


## Books


- [x] [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/)

    ??? "NNDL: 个人看来入门 DL 最好 (没有之一) 的一本书"
         先是从理论上把基于梯度下降的优化过程讲清楚，之后写代码从零开始构建神经网络。条理清晰，层次分明，没有回避任何问题，读完解决了很多之前一直都有的疑惑。

    ??? "一些碎碎念:-)"

        不知道具体什么原因，以前一直对 DL 喜欢不起来，所以也就随便看看，没有系统地去学。现在看来，主要的原因还是在于没有好的引导资料，
        像 Berkley 的 DL 课程，李沐的《深度学习》，我怎么看不下去...转折点是在一本书，Michael Nielsen 的[*Neural Network and Deep Learning* ](http://neuralnetworksanddeeplearning.com/)。
        初读这本书时，直接被震撼到了，明白了何谓高屋建瓴。

        > You need to understand the durable, lasting insights underlying how neural networks work. Technologies come and technologies go, but insight is forever.

        所以我强烈推荐将这本书作为学习 DL 的开端。

- [x] [Neural Networks from Scratch in Python](https://nnfs.io/)

    ??? "NNFS: 从零实现神经网络"
        如果说 Michael Nielsen 的 NNDL 是高屋建瓴，站在足够的高度为读者展示整个 NN 的蓝图，那么这本 NNFS 就是踩在坚实的大地上，为读者提供蓝图中的每一处事物并带领你亲身去体验。其实 NNDL 本身也已经包含了很多 NNFS 提供的内容，但是后者更加具体一些。

        **优点**: From Scratch 是透彻理解一个事物的最直接有效的办法，前提是真的 From Scratch; NN 的 Forward 部分讲的比较详细，逻辑清晰，代码简洁; 对 Nonlinear(Activation function) 的讲解细致，其中部分应该是参考了 Michael Nielsen, Neural Networks and Deep Learning 中[Chap4 A visual proof that neural nets can compute any function](http://neuralnetworksanddeeplearning.com/chap4.html) 的内容。两者可以互为参考; Chap9 Backpropagation 写的极为细致清晰，应该是我目前看到的最为清晰的 BP 讲解与实现，层层递进，引人入胜; Chap10 Optimizers 算是差强人意，对各个优化器 motivation 的讲解较为清晰，代码写的也比较好。比较可惜的是没有放任何公式...这些公式又不难，贴上来对着代码讲一下会好很多; Chap18 Model Object，Chap21 Saving and Loading Models and Their Parameters 都写的不错，条理清晰，代码也是一步步地讲解

        **缺点**:Chap6,7,8 中对 Calculus(Derivative, Gradient 等) 的讲解有些繁琐，且稍显粗浅; Chap11, 12, 13 分三章讲 Testing Data/Validation Data/Training Data, 每章几页草草了事，大可不必...不过能提到 data leakage 也算是弥补回来一点

- [x] [Dive into Deep Learning](https://d2l.ai/)

    ??? "D2L"
        非常全面的一本书，深入浅出，通俗易懂，值得多翻。
        2021 年前后读完此书，当时还是 0.7.1 版本，代码全是 MXNet 实现的。最近版本已经到了 0.16.5，添加了 PyTorch 和 TensorFlow 的代码实现。

- [x] Grokking Deep Learning

    ??? "差强人意吧"
        - 本书前 6 章写的极其友好，很适合没有任何 DL 基础的人从零开始学起。印象比较深刻的就是把 NN 比作一个机器，
          NN 中各个参数比作一个个的旋钮，我们的任务其实就是不断调节各个旋钮的值使得机器按照我们预期的方式工作。
          这是一个非常恰当的例子，也几乎贯穿整本书的介绍。不论怎样，前 6 章值得一读。

        - 第 7, 8 章写的还算可以，中规中矩。但是从第 9 章开始这书开始错误频出，而且概念也描述得不清楚。
          给代码提了[issue](https://github.com/iamtrask/Grokking-Deep-Learning/issues/31)作者也不管...
          所以就没有继续读了。
          Amazon 上的这篇[书评](https://www.amazon.com/Grokking-Deep-Learning-Andrew-Trask/dp/1617293709/ref=sr_1_1?dchild=1&keywords=grokking+deep+learning&qid=1623855522&sr=8-1)
          写的很客观，可以作为更加详细的参考。


- [x] Probabilistic Deep Learning

    ??? note "2021.06.24 第一次通读，受益匪浅"

        === "概览"

            可能是我对 PDL 的了解真的过于少了，读这本书我收获很多。不知道是不是作者统计学出身的缘故，书里面很多内容读起来都非常流畅，而且解答了我之前对 DL 的诸多疑惑。虽然 Amazon 上仅有的一条书评对这本评价并不高 (说这本太简单了 Orz), 但是我还是极力推荐这本书给初学 DL 的朋友。

            - Chap1-3 就是 NN 基础知识的介绍，总体还算不错。
            - Chap4-6，引入 data-inherent(**aleatoric**) uncertainty, 介绍了 deep probabilistic classification&regression。我们通过预测一个 Distribution 而不是一个 value or class label 来捕捉这种不确定性 (即预测输出分布)。
            - Chap7 引入 parameter(**epistemic**) uncertainty, 其捕捉的是输出分布整体 (根据不同参数得到的不同输出分布，也就是一个输出分布族) 的不确定性。其可以通过 epistemic uncertainty 的大小来检测 novel situations
            - Chap8 讲了两种拟合 BNN 的方法：VI 和 MC Dropout.

        === "优点"

            - 全书代码在 Github 和 Colab 均有，注释清晰，内容对书中概念有很大补充，好评。
            - 书中的诸多例子和数据集的选择都恰到好处，很好地表达了作者想要传递的观点。这种结合例子来提供 insight 并加深读者理解的方式实乃本书一大亮点。(虽然举例在各种书中都有，但是或千篇一律或可有可无或强行关联，但是本书并非如此，其每个例子都值得认真思考.)
            - 逻辑清晰，Motivation 讲解到位。全书都在进行不断的对比，在对比中突出关键所在，十分受用。
            - 作者基本没有省略任何必要的推导，即使少量略过也必会给出参考文献，所以基本不需要查阅其他资料就可以通读
            - 作者还是挺幽默的，"Don't bend your head as to why we set $\sigma=3$; we just choose it so that the plot looks nice" 🤣

        === "缺点"

            - TF2.0.0，TFP0.8.0，版本都略低，部分 API 已经变更了，部分代码 (如 NFs 部分) 无法运行
            - 对 TFP 的讲解稍浅，大部分只停留在如何应用，代码解释较少

        === "细节"

            - 在 Chap4.2 给出了 cross entropy loss 的推导，证明 min cross entropy loss 与 max likelihood 等价。但是这里的证明写的不够好，参考推导：[https://leimao.github.io/blog/Cross-Entropy-KL-Divergence-MLE/](https://leimao.github.io/blog/Cross-Entropy-KL-Divergence-MLE/)。其实就是注意一点，就是我们本身想要最大化的就是条件似然，即 $\arg\max_{\theta} \prod_{i=1}^{n} q_{\theta}(y_i | x_i)$, 这样更好理解一些。
            - Chap4.3 给出了 MSE 与 maximal likelihood 之间的联系，推导还是较为清晰的。最为重要的一点是，通过这一段让我找到自己对 NN 理解上一个巨大的误区：**我之前一直认为 NN 最后一层 Neuron 的个数必须与标签的维度一致，这是错误的！** 比如在书中的例子中，我第一眼看到要输出$\sigma$时想得是数据的标签只有$\mu$，怎么样从样本中构造出$\sigma$的值出来呢？其实根本不用构造！我们在 NN 最后一层直接设置两个 Neuron，分别代表均值和方差的度量，记为$\hat y_i$, shape=**(B, 2)**, 我们只需要根据真实的标签$y$, shape=**(B, 1)**来自定义 loss 即可，$loss_i = f(\hat y, y)$. 只要定义好 loss, 我们就可以训练 NN，即此时 Forward 与 Backward 的过程都可以正常进行.(参考[colab](https://colab.research.google.com/github/Awesome-Deep-Learning/dl_book/blob/master/chapter_04/nb_ch04_04.ipynb#scrollTo=2tfOZWbikXbb))
            - Chap5.3 也是比较惊喜，有个需求是我们希望最终得到回归预测是一条直线，但是希望方差是随$x$变化而边的。书中给出的方法是分别在不同的层输出两个神经元，然后将其一起连接到最后的 loss 层中，如下图所示。**所以原先所认为的，NN 所有的输出全部在最后一层也是错误的！**

            - Chap5 引入了针对 Count Data 建模的分布，Poisson Distribution 和 Zero-Inflated Poisson(ZIP). 模型还是以最小化 NNL(Max Likelihood) 的方式来求解参数。
            - Chap6.1, 6.2 引入了**Discretized Logistic Function(Distribution)**. 之前几章提到过，我们要想使用 Max Likelihood 来优化模型，那么我们必须定义每个 Sample 的 likelihood, 然后通过 min NLL 的方法来求得最优的参数。而我们要想定义 likelihood，必须指定$P(Y|X)$，即 sample 服从的分布。对于$Y$为连续值的情况来说，可以假定条件分布服从正态分布$P(Y|X) \sim \mathcal{N}(\mu_X,\,\sigma^{2}_{X})$; 当$Y$为计数型数据我们可以定义其为泊松分布$P(Y|X) \sim Poisson(\lambda_X)$; 对于 MINIST 这种多分类的数据，可以采用多项式分布$P(Y|X) \sim Multinomial(n, \alpha_1, \cdots, \alpha_k)$. 因为泊松分布中各个离散值之间是有次序关系存在的，这点很多时候并不成立，所以一般来说多项式分布用的略多一些。如 Google 的 WaveNet 和 OpenAI 的 PixelCNN 都是用的 Multinomial Distribution 来作为 CPD(Conditional Probability Distribution) 的。之后 OpenAI 采在 2017 年采用**Discretized Logistic Mixture Likelihood**来改进了 PixelCNN，称为 PixelCNN++, 将 NLL 从 3.14 降低为 2.92.其实对于 WaveNet 和 PixelCNN 来说，最后都是预测一个离散值，范围在 0~255 或者 0~65535. 理论上来说我们是可以通过调整泊松分布来作为 CPD，但是这样会使得模型参数过少，过于简化.(The number of parameters defining the distribution is often an indicator of the flexibility of the distribution). 所以模型 mixture of distribution 就被采用了，而 PixelCNN++ 采用的就是 Discretized Logistic Function
            - Chap6.2 以 Deer Data 为例给出了在不同 CPD(Normal, Poisson, ZIP, Discretized Logistic) 下的最优 NLL 对比实验，在 CPD 为 Discretized Logistic 时效果最好
            - Chap6.3-6.7 整个都是介绍 Normalizing Flows(NFs). 这是我第一次接触到 NFs, 着实惊艳。作为一个学了六年统计的混子来说，如果你问我回归的时候如果$y$不服从正态分布的时候该怎么办，那我只有一个建议——Log 一下先！如果 Log 不行呢？我会说你去找那本 Linear Model 去看，里面对不同形式的$y$给了几种常见的变换方式，都试一下看看能不能转成正态。如作者所言，此乃 old fashion statistician 的做派，而如今都 2021 年了……我们完全可以采用 Data Driven 的方法来取代这种“Test”Driven 的方法。用什么？用 NFs! **In a nutshell, an NF learns a transformation(flow) from a simple high-dimensional distribution to a complex one**.

            - 简单来说，NFs 就是对于给定的$p_z(z)$找到最优的$g$,使得 NLL 最小。也就是说，我们虽然无法准确地计算出$p_x(x)$，但是我们可以通过$p_z(z)$和$g$管中窥豹。基于这种关系我们也可以作出一些应用：如通过在$p_z(z)$中随机抽样出$z_i$,由$x_i = g(z_i)$来达到从$p_x(x)$中抽样的目的，这在随机生成人脸图片中有很好的应用；此外 NFs 也可以用于 Novelty Detection. 书中对 NFs 的介绍还是十分清晰的，尤其对$g$的设计层面的解释十分到位。
            - 美中不足的是最后两个小节中 NFs 的代码直接用的 TF1.0 写的，而且没办法运行……还有之前 TF2.0.0 代码和 TF2.5.0 代码输入输出也不一样。再加上 Keras API 的变化，着实混乱得很。所以后面大概率不会选择用 TFP，选择 PyTorch+Pyro 可能更合适些。
            - Chap8 对 VI 的介绍相当精彩，将 VI 的简洁优雅清楚展示的同时给出了一个很生动的例子来讲述 WHAT 和 HOW. 尤其是 VI 推导部分和重参数化的部分，写的极好。可惜的是 TFP 在 VI 的应用介绍的很少，而且代码看起来比较奇怪，不过这锅可能要 TFP 背才是:-)


## Courses

- [x] [CS-L,W-182/282A Designing, Visualizing and Understanding Deep Neural Networks(Berkeley, Spring 2020)](https://bcourses.berkeley.edu/courses/1487769/wiki)

    ??? "非常好的 Deep Learning 教程，力荐！"

        (2021-02-28) 做完了 Assignment1, 几乎是完全从头开始搭建 FC 和 CNN 网络，走完整个流程对整个训练的过程有了相当深刻的认识，受益匪浅！

        (2021-03-15) 这是一个近乎完美的课程！前三个 Assignment 是全部完成了的，在及其友好的引导下手写了 CNN, Vanilla RNN, LSTM, Transformer 等实现，通过写 Forward 和 Backward 的步骤，对各种网络结构的理解又加深了一个层次。

        这种 from scratch 的实现方式也是我最喜欢的方式——个人认为这是最为直观，有效的学习方式。这是因为 from scratch 的代码一方面可以让模糊的理论理解更加清晰，同时也提供了关于算法落地的 insight。这些实现基本上没有加任何优化，所以运行效率都比较低，但是正因为如此才能够以一种更为直接的方式将算法本身的面目呈现出来。

        课程后半主要讲的是 GAN 和 RL, 这块之前几乎没有接触过，所以学起来比较吃力。所以最后的 Assignment4(RL 相关) 只做了一部分，还是参考了下面的实现写的。感觉这块内容进度有点太快了，也是因为我主要以 Lecture Notes 为主，资料看得比较少。



- [ ] [Inference and Representation (NYU,DS-GA-1005, CSCI-GA.2569)](https://github.com/joanbruna/ir18)

    ??? 概率图模型

        和上面的 DS-GA 1003 一个的系列的课程，主要关注的是概率图模型。资料也很全，后面系统学习概率图时打算选此课作为引导。


- [ ] [Introduction to Deep Learning(STAT 157, UC Berkeley, Spring, 2019)](https://courses.d2l.ai/berkeley-stat-157/index.html)

    ??? note "UC Berkeley 的 DL"

        D2L

- [ ] [Introduction to Deep Learning(Princeton, COS 495)](https://www.cs.princeton.edu/courses/archive/spring16/cos495/)

    ??? note "作为学习 Deep Learning 的参考"

        Princeton 的其他 AL&ML 相关课程可以在[https://aiml.cs.princeton.edu/course.html](https://aiml.cs.princeton.edu/course.html) 找到。
        其中 Mathematics for Numerical Computing and Machine Learning，Theoretical Machine Learning 看着还不错。



- [ ] [CSC2541 Winter 2021   Topics in Machine Learning:   Neural Net Training Dynamics](https://www.cs.toronto.edu/~rgrosse/courses/csc2541_2021/)

    ??? note "深入 DL 训练过程的"

        试图分析 DL 效果好的原因，值得好好看！

- [ ] [CSE 5526: Neural Networks, Fall 2014](http://mr-pc.org/t/cse5526/)

    ??? note "神经网络参考课程"

        看到说 Simon 那本*Learning Networks and Learning Machines*不错，就去找了下相关的课程，只找到了这个，感觉可以作为书的引导。


- [ ] [**CS224W: Analysis of Networks(Stanford)**, Fall2018](http://snap.stanford.edu/class/cs224w-2018/)

    ??? 图数据挖掘课程
        这里选择 Fall2018 出于两个目的：课程作业可以获取；有教学录制视频。

- [ ] [Graph Neural Networks](https://hhaji.github.io/Deep-Learning/Graph-Neural-Networks/)

    ??? "GNN 最全总结"
        发现这位大佬教的课[https://hhaji.github.io/Teaching/](https://hhaji.github.io/Teaching/)
        真的都很顶！个人十分喜欢这种给出大量参考资料的课程！

- [ ] [CS 285 at UC Berkeley: Deep Reinforcement Learning](http://rail.eecs.berkeley.edu/deeprlcourse/)

    ??? "Berkeley DRL"
        目前用到 DRL 的场景很少，作为后续学习参考
