# Deep Learning Papers

参考[Deep Learning Papers Reading Roadmap](https://github.com/floodsung/Deep-Learning-Papers-Reading-Roadmaphttps://github.com/floodsung/Deep-Learning-Papers-Reading-Roadmap)来阅读 DL 相关论文，并做简单记录。


## General

### Deep learning(Three Giants' Survey)

Deep Learning[@lecun2015deep]是三位大佬的综述，对 DL 的发展做了一个总结。
看完对 DL 有了一个更加明确的认识 (其实黑盒之前的理解也差不多，只不过这里很明确地指出来了)，那就是 Deep Learning 主要就是 learn representations of data with multiple levels of abstraction.

总的来说，文章指出了传统 ML 的缺点是：required **careful engineering** and considerable domain expertise to **design a feature extractor**. 这就使得传统 ML 受人工知识和经验等的限制，很难在 raw data“不规则”时取得好的效果。为了使得传统 ML 算法更加高效，便有了 kernel methods, 但是实际中发现有时候效果并不好，如 Gaussian kernel 引入的 generic features 带来的效果并不能泛化到测试集上。而依赖于 Representation Learning 的 Deep Learning 就不受上述限制，其用到的特征是在网络的各个 layer 中自动学习的。Good features can be learned automatically using a general-purpose learning procedure.(This is a key advantage of deep learning). 所以说，很多 DL 方法本质上就是做了自动化特征提取的工作：The hidden layers can be seen as distorting the input in a non-linear way so that categories become linearly separable by the last layer.

论文中对 Representation Learning 和 Deep Learning 给出了大致定义：

- **Representation Learning** is a set of methods that allows a machine to be fed with raw data and automatically discover the representations needed for detection or classification.
- **Deep Learning** methods are representation-learning methods with multiple levels of representation, obtained by composing simple but non-linear modules that each transform the representation at one level(starting with raw input) into a representation at a higher, slightly more abstract level.

论文后面大概讲了下 CNN 和 RNN，CNN 中对 convolutional layer 和 pooling layer 的讲解很好：The role of the convolutional layer is to detect local conjunctions of features from the previous layer; the role of the pooling  layer is merge semantically similar features into one.

最后是关于 unsupervised learning 的两个比较感兴趣的地方。For smaller data sets, unsupervised pre-training helps to prevent over-fitting, leading to significantly better generalization when the number of labelled examples is small, or in a transfer setting where we have lots of examples for some 'source' tasks but very few for some 'target' tasks. (给出了参考文献，后面打算看一下)。
另外就是文末的一句：Human and animal learning is largely unsupervised: we discover the structure of the world by observing it, not by being told the name of every object.

