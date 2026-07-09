import type { SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Mathew Shen',
  description: 'Mathew Shen 的个人博客。',
  href: 'https://mathewshen.me',
  author: 'mathew',
  locale: 'zh-CN',
  recentPostCount: 5,
}

export const RSS_FOLLOW_CHALLENGE = {
  feedId: '242234111295813632',
  userId: '41781781100792832',
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: '文章',
  },
  {
    href: '/blog/2025/books',
    label: '书单',
  },
  {
    href: '/tags',
    label: '标签',
  },
  // {
  //   href: '/authors',
  //   label: 'authors',
  // },
  // {
  //   href: '/about',
  //   label: 'about',
  // },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/shenxiangzhuang',
    label: 'GitHub',
    icon: 'github',
  },
  // {
  //   href: 'https://twitter.com/enscry',
  //   label: 'Twitter',
  // },
  {
    href: 'https://www.linkedin.com/in/mathewshen/',
    label: 'LinkedIn',
    icon: 'linkedin',
  },
  {
    href: 'mailto:datahonor@gmail.com',
    label: 'Email',
    icon: 'mail',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
    icon: 'rss',
  },
]

export const GISCUS = {
  enabled: true,
  repo: 'shenxiangzhuang/shenxiangzhuang.github.io',
  repoId: 'MDEwOlJlcG9zaXRvcnk4MjU0MjM1OQ==',
  category: 'Announcements',
  categoryId: 'DIC_kwDOBOt_F84CTHBH',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '1',
  inputPosition: 'top',
  theme: '',
  lang: 'zh-CN',
  loading: 'lazy',
}
