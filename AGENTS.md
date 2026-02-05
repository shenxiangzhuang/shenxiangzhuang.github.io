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
title: 'Your Post Title'        # 必填，≤60字符
description: 'A brief desc'     # 必填，≤155字符
date: 2024-01-01               # 必填，YYYY-MM-DD格式
tags: ['tag1', 'tag2']         # 可选
image: './image.png'           # 可选，1200x630px
authors: ['author-id']         # 可选，对应 authors/ 下的文件名
draft: false                   # 可选，默认false
order: 0                       # 可选，同日期子文章排序
---
```

## 标签体系

本博客采用两层标签体系，每篇文章使用 **2 个标签**：1 个 General Tag + 1 个细分 Tag。

### General Tags（5 个）

| Tag | 定位 |
|-----|------|
| **生活** | 个人感悟、回忆、日常 |
| **文学** | 书评、影评、文学讨论 |
| **技术** | 工程实践、系统设计 |
| **AI** | 人工智能、机器学习 |
| **项目** | 开源项目、个人作品 |

### 细分 Tags（10 个）

| Tag | 说明 | 常配合的 General Tag |
|-----|------|---------------------|
| **随笔** | 思考、杂感 | 生活、AI、技术、项目、文学 |
| **回忆** | 回忆性文章 | 生活 |
| **书评** | 读书笔记 | 文学、AI |
| **算法** | 算法相关 | 技术 |
| **系统** | 后端、分布式 | 技术 |
| **LLM** | 大语言模型 | AI |
| **NLP** | 自然语言处理 | AI |
| **RL** | 强化学习 | AI |
| **论文** | 论文阅读 | AI、技术 |
| **开源** | 开源贡献 | 项目 |

### 使用规则

1. 每篇文章固定使用 **2 个标签**
2. 第 1 个标签：General Tag（从 5 个中选 1 个）
3. 第 2 个标签：细分 Tag（从 10 个中选 1 个）
4. 格式示例：`tags: ['AI', 'LLM']`

### 常见组合示例

- `['生活', '随笔']` - 日常感悟
- `['生活', '回忆']` - 回忆性文章
- `['AI', 'LLM']` - 大语言模型技术文章
- `['AI', '论文']` - AI 论文阅读笔记
- `['技术', '系统']` - 系统/工程实践
- `['技术', '算法']` - 算法相关
- `['项目', '开源']` - 开源项目介绍
- `['文学', '书评']` - 读书笔记

## 作者 Frontmatter

```yml
---
name: 'Author Name'           # 必填
pronouns: 'he/him'            # 可选
avatar: 'url or /path'        # 必填，URL或/开头的路径
bio: 'Short bio'              # 可选
mail: 'email@example.com'     # 可选
website: 'https://...'        # 可选
github: 'https://github.com/...'  # 可选
twitter: 'https://twitter.com/...' # 可选
linkedin: 'https://...'       # 可选
---
```
