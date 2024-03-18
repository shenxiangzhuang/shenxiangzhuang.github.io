# CUDA

记录在Linux(Ubuntu)上折腾CUDA环境的那些事。

## NVIDIA Diver & PyTorch

在Ubuntu20.04上安装了最新的NVIDIA Driver(550.54.14)和CUDA Toolkit(12.4)，
然后发现在Anaconda的环境下可以正常用CUDA，但是在Python起的venv上没办法用[^1]。
报错信息为`RuntimeError: Found no NVIDIA driver on your system`.

这就是比较奇怪的地方: 如果Driver不能用，那么Anaconda为什么就可以正常使用呢？
但是现在的报错就是说了在venv上没办法找到Driver，所以问题还是出在Driver上[^2]。

!!! note "更加详细的问题描述"

    [The right way to use CUDA in PyTorch on Linux: In venv, Not in conda](https://discuss.pytorch.org/t/the-right-way-to-use-cuda-in-pytorch-on-linux-in-venv-not-in-conda/198998/1)


因为之前在Ubuntu22.04上的配置都没有问题，所以就对比了下Driver的配置，发现22.04上装的Driver版本为545，而不是550，
然后cuda-toolkit的版本为12.3而不是12.4。所以就将现在Ubuntu20.04上的Driver和Toolkit的版本回退到545和12.3,
然后重启(这很重要:)就发现问题解决了。因为NVIDIA官网下载Driver等都会默认给跳到最新版，
所以把解决问题用到资料列举在下面，供参考。

!!! info "NVIDIA Resources"

    - Linux x64 (AMD64/EM64T) Display Driver
        - [Newest](https://www.nvidia.com/Download/index.aspx)
        - [545.29.06](https://www.nvidia.com/Download/driverResults.aspx/216530/en-us/)

    - CUDA Toolkit Downloads
        - [Newest](https://developer.nvidia.com/cuda-toolkit)
        - [12.3](https://developer.nvidia.com/cuda-12-3-0-download-archive?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=20.04&target_type=runfile_local)



[^1]: `python -c 'import torch; print(torch.cuda.is_available()))`返回`True`为可用。
[^2]: 当中怀疑过各种`pip`, `conda`安装的包的差异，cuda-toolkit的版本等，但是尝试了都还是不行。现在想想还是在尝试的过程中离问题越来越远了。
