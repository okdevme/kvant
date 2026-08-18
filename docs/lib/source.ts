import type { FrameworkId } from './frameworks'
import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { defineDocs } from 'fumadocs-mdx/macro'
import { z } from 'zod'
import { frameworks } from './frameworks'
import { docsContentRoute, docsImageRoute, docsRoute } from './shared'

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      // Current framework, consumed at build time by `lib/remark-switch.ts`
      framework: z.enum(
        frameworks.map(f => f.id) as [FrameworkId, ...FrameworkId[]],
      ),
    }),
    // Underscore-prefixed files are partials for the MDX `include` feature
    files: ['**/*.mdx', '!**/_*.mdx'],
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
})

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `/${[page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/')}`,
  }
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md']

  return {
    segments,
    url: `/${[page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/')}`,
  }
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
