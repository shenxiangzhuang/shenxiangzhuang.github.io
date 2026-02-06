import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: "MathewShen's Blog",
  description: "Mathew Shen's personal blog.",
  href: 'https://datahonor.com',
  author: 'mathew',
  locale: 'en-US',
  featuredPostCount: 3,
  postsPerPage: 6,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/tags',
    label: 'tags',
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
  },
  // {
  //   href: 'https://twitter.com/enscry',
  //   label: 'Twitter',
  // },
  {
    href: 'mailto:datahonor@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

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
  theme: 'preferred_color_scheme',
  lang: 'en',
  loading: 'lazy',
}
