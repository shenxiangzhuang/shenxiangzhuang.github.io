import type { CollectionEntry } from 'astro:content'

type BlogPost = CollectionEntry<'blog'>
type BlogImage =
  | BlogPost['data']['imageWithText']
  | BlogPost['data']['imageWithoutText']

export function getDisplayCoverImage(post: BlogPost): BlogImage {
  return post.data.imageWithoutText ?? post.data.imageWithText
}

export function getPostSocialImage(post: BlogPost): BlogImage {
  return post.data.imageWithText ?? post.data.imageWithoutText
}
