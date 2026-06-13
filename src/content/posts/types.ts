export const KT_BLOG_CATS = ['Market Update', 'Neighborhoods', 'Buying', 'Selling', 'Lifestyle'] as const
export type PostCategory = (typeof KT_BLOG_CATS)[number]
export type PostBlock = string | { h: string } | { cta: string } | { disclaimer: string } | { sources: { t: string; href: string }[] }
export type Post = { slug: string; title: string; category: PostCategory; date: string; excerpt: string; cover?: boolean; draft?: boolean; body: PostBlock[] }
