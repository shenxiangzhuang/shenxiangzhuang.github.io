# Paper Reading List

## Step0: Basic Concepts
如果之前对DL的基本概念不是很熟悉，可以先看一些基础的DL论文。
如一些介绍性的论文，见[Deep Learning Papers](../../datascience/dl/paper.md)。
此外，DL的一个核心是BP算法，相关的论文可以参考[Backpropagation](../../datascience/dl/bp/index.md)。

## Step1: NMT, Attention and Transformer

??? "Reference Blogs"

    - [Attention? Attention!](https://lilianweng.github.io/lil-log/2018/06/24/attention-attention.html)
    - [Visual Attention Model in Deep Learning](https://towardsdatascience.com/visual-attention-model-in-deep-learning-708813c2912c).

### TODO: 2014-Google-Sequence to Sequence
*Sequence to Sequence Learning with Neural Networks*

### 2014-Bengio-Attention
*Neural Machine Translation by Jointly Learning to Align and Translate*[@bahdanau2014neural].
本文首次提出了Attention的概念, 首先介绍了什么是Neural machine translation(NMT):
attempts to build and train a single, large neural network that reads a sentence
and outputs a correct translation.

之后指出当时现有的NMT model大多属于encoder-decoder类型的网络:
An encoder neural network reads and encodes a source sentence into a fixed-length vector.
A decoder then outputs a translation from the encoded vector.
在这种框架下， A neural network needs to be able to compress all necessary
information of a source sentence into a fixed-length vector.
那么就有一个潜在的问题，在source sentence 过长的时候，
这里得到的fixed-length vector不足以表达全部的信息，
所以后面基于此vector的翻译任务将很难有好的表现，
如下图[^1]所示:

<center>
<img src="https://i.loli.net/2021/02/24/SDztCQbhuq34FYc.png">
</center>


在`T`较大的时候，`C`很难将全部的信息综合起来，损失了较多的信息，所以使得Decoder很难有好的表现。

接着就是文章提出方法的具体描述了:
The **most important distinguishing feature** of this approach from the
basic encoder–decoder is that it does not attempt to encode a whole
input sentence into a single fixed-length vector.
Instead, it **en-codes the input sentence into a sequence of vectors and chooses a
subset of these vectors adaptively while decoding the translation**.
This **frees** a neural translation model from having to squash
all the information of a source sentence, regardless of its length, into a fixed-length vector.

<center>
<img src="https://i.loli.net/2021/02/24/2J1d9zXWIp8rht5.png">
</center>

上图(来自本文)进一步地补充了上面的解释。这里的Encoder是一个双向RNN, Decode仍然是一个RNN。
不同的是，我们不再将source sentence的全部信息强行压缩到一个fixed-length vector,
而是加上了一个alignment model，其在每次预测$y_t$的时候都会汇总来自Encoder隐藏层的信息(annotations, 双向RNN拼接而成)作为输入。

接下来解释了为什么这样方法是有效的：**Intuitively,this implements a mechanism of attention in the decoder.**
The decoder decides parts of the source sentence to pay attention to.
**By letting the decoder have an attention mechanism, we relieve the encoder
from the burden of having to encode all information in the source sentence into a fixed-length vector.**
With this new approach the information can be spread throughout the sequence of annotations,
which can be selectively retrieved by the decoder accordingly.

关于alignment model的实现: We parametrize the alignment model as a feedforward neural network
which is jointly trained with all the other components of the proposed system.

综上可知，这里的Attention就是说在预测的时候持续“关注”source sentence(输入)以获得更好的预测，
而完成这个“关注”任务的，协调“关注”工作的任务就交给了Attention Mechanism的实现，如这里的alignment model.


!!! note "PyTorch Practice"

    算法的PyTorch实现: [pcyin/pytorch_basic_nmt](https://github.com/pcyin/pytorch_basic_nmt)

    PyTorch教程: [NLP From Scratch: Translation with a Sequence to Sequence Network and Attention](https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html)


### TODO: 2017-Transformers
*Attention Is All You Need*

## Step2: GPT Series

### 2018-OpenAI-GPT1.0
*Improving Language Understanding by Generative Pre-Training*

### 2018-Google-BERT
*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*

### 2019-OpenAI-GPT2.0
*Language Models are Unsupervised Multitask Learners*

### 2020-OpenAI-GPT3.0
*Language models are few-shot learners*

## Step3: Engineering in LLM
TBD


# Reference
- [Understanding Large Language Models -- A Transformative Reading List](https://sebastianraschka.com/blog/2023/llm-reading-list.html)
- [Awesome-LLM/Milestone Papers](https://github.com/Hannibal046/Awesome-LLM?tab=readme-ov-file#milestone-papers)


[^1]: [Learning phrase representations using rnn encoder-decoderfor statistical machine translation](https://arxiv.org/pdf/1406.1078.pdf)



