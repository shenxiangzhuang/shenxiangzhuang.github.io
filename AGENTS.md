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

### 图片尺寸限制

CSS 已设置图片的最大尺寸限制：
- 最大宽度：`min(100%, 500px)`
- 最大高度：`600px`

图片会自动缩放并保持比例（`object-fit: contain`）。
