import type { Metadata } from 'next'

export const title = 'kvant'
export const description = 'Universal, type-safe state manager for key-value interfaces'

export const authors: Metadata['authors'] = [
  {
    name: 'Oleg Kapranov',
    url: 'https://github.com/okdevme',
  },
]

export const appName = title
export const docsRoute = '/docs'
export const docsImageRoute = '/og/docs'
export const docsContentRoute = '/llms.mdx/docs'

export const gitConfig = {
  user: 'okdevme',
  repo: 'kvant',
  branch: 'main',
}
