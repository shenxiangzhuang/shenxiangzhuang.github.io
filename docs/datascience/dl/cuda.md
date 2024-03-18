# CUDA

记录在Linux(Ubuntu)上折腾CUDA环境的那些事。

## NVIDIA Driver & PyTorch

在Ubuntu20.04上安装了最新的NVIDIA Driver(550.54.14)和CUDA Toolkit(12.4)，
然后发现在Anaconda的环境下可以正常用CUDA，但是在Python起的venv上没办法用[^1]。
报错信息为`RuntimeError: Found no NVIDIA driver on your system`.

这就是比较奇怪的地方: 如果Driver不能用，那么Anaconda为什么就可以正常使用呢？
但是现在的报错就是说了在venv上没办法找到Driver，所以我觉着问题还是出在Driver上[^2]。

!!! note "更加详细的问题描述"

    [The right way to use CUDA in PyTorch on Linux: In venv, Not in conda](https://discuss.pytorch.org/t/the-right-way-to-use-cuda-in-pytorch-on-linux-in-venv-not-in-conda/198998/1)

但是问题并不在Driver上...这里报错的含义更多的是当前Python环境无法和GPU正常通信，
所以也可能是Python venv的问题。

注意到这个问题是偶然发现用Python3.10和Python3.12生成的venv都可以正常用CUDA，只有3.11不行——这就更奇怪了...
然后看了下这个Python3.11到底有什么不同, `which python3.11`返回`/home/linuxbrew/.linuxbrew/bin/python3.11`[^3]!
这个东西还要从我发现[Homebrew on Linux](https://docs.brew.sh/Homebrew-on-Linux)说起...
总之，就是安装的这个Python有问题，导致基于它新建的venv就会出现上面莫名奇妙的问题Orz.

把linuxbrew的这个Python3.11卸载掉，然后用apt安装`sudo apt install python3.11`即可。


[^1]: `python -c 'import torch; print(torch.cuda.is_available()))`返回`True`为可用。
[^2]: 当中怀疑过各种`pip`, `conda`安装的包的差异，cuda-toolkit的版本等，但是尝试了都还是不行。
[^3]: 其他Python环境都是`sudo apt install python3.12`的方式安装，`which python`返回`/usr/bin/python3.12`
