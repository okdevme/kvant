import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/shared'
import { source } from '@/lib/source'

function getPriority(page: (typeof source)['$inferPage']): number {
  switch (page.data.framework) {
    case 'next': return 0.9
    case 'react': return 0.8
    case 'nuxt': return 0.7
    case 'vue': return 0.6
    default: return 0.5
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: baseUrl.origin,
      lastModified,
      priority: 1,
    },
    ...source.getPages().map(page => ({
      url: `${baseUrl.origin}${page.url}`,
      lastModified,
      priority: getPriority(page),
    })),
  ]
}
