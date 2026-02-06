# Blog Agent 指南

## 技术栈

| Category   | Technology                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------ |
| Framework  | [Astro](https://astro.build/)                                                              |
| Styling    | [Tailwind](https://tailwindcss.com)                                                        |
| Components | [shadcn/ui](https://ui.shadcn.com/)                                                        |
| Content    | [MDX](https://mdxjs.com/)                                                                  |
| Codeblocks | [Expressive Code](https://expressive-code.com/), [Shiki](https://github.com/shikijs/shiki) |

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器 (localhost:1234)
pnpm build          # 类型检查并构建项目
pnpm preview        # 预览构建后的项目
pnpm prettier       # 格式化所有文件
```

## 项目结构

- `src/consts.ts` - 站点配置、导航链接、社交链接
- `src/styles/global.css` - 全局样式，颜色定义（OKLCH 格式，shadcn/ui 约定）
- `src/content/blog/` - 博客文章（MDX 格式）
- `src/content/authors/` - 作者信息
- `src/content/projects/` - 项目信息
- `src/components/` - Astro/React 组件
- `src/pages/` - 页面路由

## 博客文章 Frontmatter

```yml
---
title: 'Your Post Title'        # 必填，≤60 字符
description: 'A brief desc'     # 必填，≤155 字符
date: 2024-01-01               # 必填，YYYY-MM-DD 格式
tags: ['tag1', 'tag2']         # 可选
image: './image.png'           # 可选，1200x630px
authors: ['author-id']         # 可选，对应 authors/ 下的文件名
draft: false                   # 可选，默认 false
order: 0                       # 可选，同日期子文章排序
---
```


## 作者 Frontmatter

```yml
---
name: 'Author Name'           # 必填
pronouns: 'he/him'            # 可选
avatar: 'url or /path'        # 必填，URL 或/开头的路径
bio: 'Short bio'              # 可选
mail: 'email@example.com'     # 可选
website: 'https://...'        # 可选
github: 'https://github.com/...'  # 可选
twitter: 'https://twitter.com/...' # 可选
linkedin: 'https://...'       # 可选
---
```

## 图片规范

### 图片引用

博客文章中的图片必须使用 **Markdown 语法**，不能使用 HTML `<img>` 标签（Astro content 目录中 HTML 标签无法正确解析本地相对路径）。

```markdown
<!-- ✅ 正确 -->
![图片描述](./images/example.png)

<!-- ❌ 错误 - 图片无法显示 -->
<img src="./images/example.png" alt="图片描述" />
```

### 图片存放位置

图片应存放在对应博客文章目录下的 `images/` 文件夹中：

```
src/content/blog/2024/my-post/
├── index.md
└── images/
    └── example.png
```

### 图片说明（Caption）

图片说明使用 **紧跟图片的斜体文字** 格式，CSS 会自动将其渲染为居中、小字号、淡色的说明文字样式。

**格式要求：**

1. 图片说明必须紧跟在图片后的下一行
2. 使用 Markdown 斜体语法 `*说明文字*`
3. 说明文字独占一行

**示例：**

```markdown
![GPT 模型的内部构造](./images/nano_gpt_viz_qkv.png)
*From [bbycroft.net/llm](https://bbycroft.net/llm)*

![大脑与人工神经网络](./images/brain_and_ann.png)
*人工神经网络是受大脑工作方式激发的模型 - From [Super Study Guide](https://superstudy.guide/)*
```

**渲染效果：** 图片说明会自动居中显示，字体变小，颜色变淡，与正文形成视觉区分。


### 图片尺寸限制

CSS 已设置图片的最大尺寸限制：
- 最大宽度：`min(100%, 500px)`
- 最大高度：`600px`

图片会自动缩放并保持比例（`object-fit: contain`）。
