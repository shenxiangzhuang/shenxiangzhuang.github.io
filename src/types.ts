export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  recentPostCount: number
  postsPerPage: number
}

export type SocialLink = {
  href: string
  label: string
}

export type IconMap = {
  [key: string]: string
}
