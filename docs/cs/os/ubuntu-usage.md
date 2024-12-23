# Ubuntu 使用配置


## 基本环境配置

### Plank(The Lightweight Dock For Ubuntu)
- [https://www.unixmen.com/plank-lightweight-dock-ubuntu/](https://www.unixmen.com/plank-lightweight-dock-ubuntu/)

### 输入法
- [Rime](https://rime.im/)
    - [rime-ice](https://github.com/iDvel/rime-ice): 雾凇拼音
    - [rime-auto-deploy](https://github.com/Mark24Code/rime-auto-deploy): 自动部署

## 终端
### Zsh & Oh-My-Zsh
- [https://www.zsh.org/](https://www.zsh.org/)
- [https://github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh)

### Atuin: Magical shell history
- [atuinsh/atuin](https://github.com/atuinsh/atuin)

### Starship: Customizable prompt
- [https://starship.rs/](https://starship.rs/)

???+ note "字体配置"

    注意当前终端字体的配置，可以使用 Nerd Font 等字体，以支持 Starship 的图标显示。
    系统安装 Nerd Font 字体后，同时需要在终端配置中选择对应的字体。(否则部分图标无法显示)


## GitHub 配置
### GitHub SSH Key
- [/connecting-to-github-with-ssh](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

## 代理配置

### Clash & Proxy
- [GUI: mihomo-party](https://github.com/mihomo-party-org/mihomo-party)
```bash
# clash in terminal
function proxy_on() {
    export http_proxy=http://127.0.0.1:7890
    export https_proxy=$http_proxy
    echo -e "终端代理已开启。"
}

function proxy_off(){
    unset http_proxy https_proxy
    echo -e "终端代理已关闭。"
}
```

??? "(旧) SSR & Proxy"

    ```bash
    # set proxy
    function setproxy() {
        export http_proxy=socks5://127.0.0.1:1080
        export https_proxy=socks5://127.0.0.1:1080
    }

    # unset proxy
    function unsetproxy() {
        unset http_proxy https_proxy
    }
    ```

## 编程环境配置

### IDE: Jetbrains Toolbox
- [https://www.jetbrains.com/toolbox-app/](https://www.jetbrains.com/toolbox-app/)


### IDE: Vscode
- [https://code.visualstudio.com/](https://code.visualstudio.com/)


### IDE: Zed
- [Zed](https://zed.dev/)


### Python

???+ "UV"
    - [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv)


??? "Anaconda"

    - [https://docs.anaconda.com/anaconda/install/linux/](https://docs.anaconda.com/anaconda/install/linux/)
    - [https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)


### Java & Scala: SDKMAN
- [https://sdkman.io/](https://sdkman.io/)


### JS: NVM & NRM:

- [NVM](https://github.com/nvm-sh/nvm)
- [NRM](https://github.com/Pana/nrm)

### Elixir: Hex
- [UPYUN 支持 Elixir hex.pm 国内镜像](https://ruby-china.org/topics/31631)


```shell
export HEX_MIRROR="https://hexpm.upyun.com"
export HEX_CDN="https://hexpm.upyun.com"
```

### Latex
- [https://www.tug.org/texlive/quickinstall.html](https://www.tug.org/texlive/quickinstall.html)
- [ctexbook-template](https://github.com/shenxiangzhuang/ctexbook-template)
    - 包含 VSCode 配置流程，可以直接使用 VSCode 进行 Latex 编写

### WakaTime
- [https://wakatime.com/](https://wakatime.com/)


## 工具软件

### Linux 微信
- [https://linux.weixin.qq.com/en](https://linux.weixin.qq.com/en)

### Linux QQ
- [https://im.qq.com/linuxqq/index.shtml](https://im.qq.com/linuxqq/index.shtml)


### Firefox
- [https://www.mozilla.org/en-US/firefox/new/](https://www.mozilla.org/en-US/firefox/new/)
