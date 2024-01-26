# Deep Learning Papers

!!! warning "待整理"

    很久前读的一些论文，待后续整理


参考[Deep Learning Papers Reading Roadmap](https://github.com/floodsung/Deep-Learning-Papers-Reading-Roadmaphttps://github.com/floodsung/Deep-Learning-Papers-Reading-Roadmap)来阅读DL相关论文，并做简单记录。


## General

- LeCun, Yann, Yoshua Bengio, and Geoffrey Hinton. "**Deep learning**." Nature 521.7553 (2015): 436-444. [[pdf]](http://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf) **(Three Giants' Survey)**

> 2021-01-28：看完对DL有了一个更加明确的认识(其实黑盒之前的理解也差不多，只不过这里很明确地指出来了)，那就是Deep Learning主要就是learn representations of data with multiple levels of abstraction.
>
> 总的来说，文章指出了传统ML的缺点是： required **careful engineering** and considerable domain expertise to **design a feature extractor**. 这就使得传统ML受人工知识和经验等的限制，很难在raw data“不规则”时取得好的效果。为了使得传统ML算法更加高效，便有了kernel methods, 但是实际中发现有时候效果并不好，如Gaussian kernel引入的generic features带来的效果并不能泛化到测试集上。而依赖于Representation Learning的Deep Learning就不受上述限制，其用到的特征是在网络的各个layer中自动学习的。Good features can be learned automatically using a general-purpose learning procedure.(This is a key advantage of deep learning). 所以说，很多DL方法本质上就是做了自动化特征提取的工作： The hidden layers can be seen as distorting the input in a non-linear way so that categories become linearly separable by the last layer.
>
> 论文中对Representation Learning和Deep Learning给出了大致定义：
>
> **Representation Learning** is a set of methods that allows a machine to be fed with raw data and automatically discover the representations needed for detection or classification.
>
> **Deep Learning** methods are representation-learning methods with multiple levels of representation, obtained by composing simple but non-linear modules that each transform the representation at one level(starting with raw input) into a representation at a higher, slightly more abstract level.
>
> 论文后面大概讲了下CNN和RNN，CNN中对convolutional layer和pooling layer的讲解很好：The role of the convolutional layer is to detect local conjunctions of features from the previous layer; the role of the pooling  layer is merge semantically similar features into one.
>
> 最后是关于unsupervised learning的两个比较感兴趣的地方。For smaller data sets, unsupervised pre-training helps to prevent overfitting, leading to significantly better generalization when the number of labelled examples is small, or in a transfer setting where we have lots of examples for some 'source' tasks but very few for some 'target' tasks. (给出了参考文献，后面打算看一下)。另外就是文末的一句：Human and animal learning is largely unsupervised: we discover the structure of the world by observing it, not by being told the name of every object.



## Attention

在肝[Designing, Visualizing and Understanding Deep Neural Networks (Spring 2020)](https://bcourses.berkeley.edu/courses/1487769)的时候，对Attention的理解总是比较肤浅，所以找来几篇论文读了一下.

此外有以下几个比较好的Blog:[Attention? Attention!](https://lilianweng.github.io/lil-log/2018/06/24/attention-attention.html), [Visual Attention Model in Deep Learning](https://towardsdatascience.com/visual-attention-model-in-deep-learning-708813c2912c).

- Sawant, Shriraj P., and Shruti Singh. "Understanding attention: in minds and machines." *arXiv preprint arXiv:2012.02659* (2020).[[pdf](https://arxiv.org/pdf/2012.02659.pdf)]

> 随便找的一篇最近的关于Attention review的文章.
>
> 文章整体可以大概分为两个部分： Attention in Artificial Neural Networks, Attention in Neuroscience。因为这里关注的是DL, 阅读的重点放在Attention in ANN部分。(以下提及Attention,若不做说明则全部认为是Attention in ANN)
>
> 文章首先给出Attention的起源， Attention mechanism in artificial neural networks was **first proposed** for the task of Machine Translation by [Bahdanau et al](https://arxiv.org/pdf/1409.0473.pdf)，也就是NMT领域。因为[Bahdanau et al](https://arxiv.org/pdf/1409.0473.pdf)的工作是依赖于[Learning phrase representations using rnn encoder-decoderfor statistical machine translation](https://arxiv.org/pdf/1406.1078.pdf)的，所以文章先介绍了后者，之后结合[Bahdanau et al](https://arxiv.org/pdf/1409.0473.pdf)介绍了Basic Attention Mechanism.(这里就不展开了，详见后面对这篇论文的简评)
>
> 之后介绍了几个Attention Variants
>
> - Soft vs Hard Attention:最先在Image Captions任务中被提出. In Soft Attention, the alignment weights are placed all over the source image. On the other hand, Hard Attention selects one patch of the image to attend to at a time.
> - Local vs Global Attention: 最先在Machine Translation任务中提出.Global Attention与Soft Attention类似，consider all hidden states of the encoder when deriving the context. Local Attention focus on small context window.
> - Self Attention: Self Attention is the mechanism to capture different relations between words at different positions in the same sequence.
> - Hierachical Attention: To take into account the hierarchical nature of the data.

- Bahdanau, Dzmitry, Kyunghyun Cho, and Yoshua Bengio. "Neural machine translation by jointly learning to align and translate." *arXiv preprint arXiv:1409.0473* (2014).[[pdf](https://arxiv.org/pdf/1409.0473.pdf)]

> 最早提出Attention in ANN的文章。
>
> 本文首先介绍了什么是Neural machine translation(NMT): attemps to build and train a single, large neural network that reads a sentence and outputs a correct translation.
>
> 之后指出当时现有的NMT model大多属于encoder-decoder类型的网络: An encoder neural network reads and encodes a source sentence into a fixed-length vector. A decoder then outputs a translation from the encoded vector.在这种框架下， A neural network needs to be able to compress all necessary information of a source sentence into a fixed-length vector.那么就有一个潜在的问题，在source sentence 过长的时候，这里得到的fixed-length vector不足以表达全部的信息，所以后面基于此vector的翻译任务将很难有好的表现，如下图所示(图片来自[Learning phrase representations using rnn encoder-decoderfor statistical machine translation](https://arxiv.org/pdf/1406.1078.pdf))
>
> ![image-20210224180320025](https://i.loli.net/2021/02/24/SDztCQbhuq34FYc.png)
>
> 在`T`较大的时候，`C`很难将全部的信息综合起来，损失了较多的信息，所以使得Decoder很难有好的表现。
>
> 接着就是文章提出方法的具体描述了。The **most important distinguishing feature** of this approach from the basic encoder–decoder is thatit does not attempt to encode a whole input sentence into a single fixed-length vector. Instead, it **en-codes the input sentence into a sequence of vectors and chooses a subset of these vectors adaptively while decoding the translation**.  This **frees** a neural translation model from having to squash all theinformation of a source sentence, regardless of its length, into a fixed-length vector.
>
> ![image-20210224181041682](https://i.loli.net/2021/02/24/2J1d9zXWIp8rht5.png)
>
> 上图(来自本文)进一步地补充了上面的解释。这里的Encoder是一个双向RNN, Decode仍然是一个RNN。不同的是，我们不再将source sentence的全部信息强行压缩到一个fixed-length vector, 而是加上了一个alignment model，其在每次预测$y_t$的时候都会汇总来自Encoder隐藏层的信息(annotations, 双向RNN拼接而成)作为输入。
>
> 接下来解释了为什么这样方法是有效的：**Intuitively,this implements a mechanism of attention in the decoder.**  The decoder decides parts of the sourcesentence to pay attention to.  **By letting the decoder have an attention mechanism, we relieve theencoder from the burden of having to encode all information in the source sentence into a fixed-length vector.**  With this new approach the information can be spread throughout the sequence ofannotations, which can be selectively retrieved by the decoder accordingly.
>
> 关于alignment model的实现: We parametrize the alignment modelaas a feedforward neural network which is jointly trained withall the other components of the proposed system.
>
> 综上可知，这里的Attention就是说在预测的时候持续“关注”source sentence(输入)以获得更好的预测，而完成这个“关注”任务的，协调“关注”工作的任务就交给了Attention Mechanism的实现，如这里的alignment model.
>
> 算法的PyTorch实现: https://github.com/pcyin/pytorch_basic_nmt.

- Recurrent Models of Visual Attention[[pdf](https://arxiv.org/pdf/1406.6247.pdf)]

> Google DeepMind的一篇文章。
>
> **What**: a novel framework for attention-basedtask-driven visual processing with neural networks.
>
> **How**(to train): This procedure uses **backpropagation** to train the neural-network components and **policy gradient** to address the non-differentiabilities due to the control problem.
>
> 关于Recurrent Attention Model(RAM)的提出:In this paper we consider the attention problem as the sequential decision process of a goal-directedagent interacting with a visual environment.
>
> <img src="https://i.loli.net/2021/02/24/S3z49M7tPcwxJIY.png" alt="image-20210224183711691" style="zoom:120%;" />
>
> 框架的主体就是一个RNN，有两点需要关注。第一，每个时间$t$的输入是`g`(Glimpse Network的输出); 第二每个hidden neural cell的状态$h_t$别被传入两个网络： 传入Action Network $f_a(:, \theta_a)$输出action or classification $a_t$, 传入Location Network$f_l(:, \theta_l)$输出下一个聚焦中心的位置$l_t$
>
> 具体训练来说，总体还是用BP通过SGD来优化参数，不过没有看懂这里通过增强学习来学习policy的过程。
>
> 算法的PyTorch实现: https://github.com/kevinzakka/recurrent-visual-attention

