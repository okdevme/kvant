import type { ServerCodeBlockProps } from 'fumadocs-ui/components/codeblock.rsc'
import type { ReactNode } from 'react'
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc'

export type CachedCodeBlockProps = ServerCodeBlockProps

const globalStore = globalThis as typeof globalThis & {
  __kvantSnippetCache?: Map<string, Promise<ReactNode>>
}
const snippetCache = (globalStore.__kvantSnippetCache ??= new Map())

export async function CachedCodeBlock({ lang, code, ...options }: CachedCodeBlockProps) {
  const key = `${lang}\n${code}`
  let rendered = snippetCache.get(key)
  if (!rendered) {
    rendered = ServerCodeBlock({ lang, code, ...options })
    snippetCache.set(key, rendered)
  }
  return rendered
}
