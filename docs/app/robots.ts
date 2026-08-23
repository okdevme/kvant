import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/shared'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${baseUrl.origin}/sitemap.xml`,
  }
}
