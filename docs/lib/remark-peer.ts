import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { findAndReplace } from 'mdast-util-find-and-replace'

const require = createRequire(import.meta.url)

/**
 * Remark plugin that resolves `{{peer:{package}:{peerDependency}}}` tokens
 * at build time, replacing them with the version range declared in the
 * peerDependencies of `node_modules/{package}/package.json`.
 *
 * Example: `{{peer:kvantjs:react}}` → `` `>=18.0.0` `` (inline code).
 *
 * Tokens referencing an unresolvable package or an unknown peer are left
 * untouched, so typos stay visible in the output instead of silently
 * rendering an empty cell.
 */

const cache = new Map<string, Record<string, string>>()

function getPeerDependencies(pkg: string): Record<string, string> | undefined {
  const cached = cache.get(pkg)
  if (cached)
    return cached
  try {
    const manifestPath = require.resolve(`${pkg}/package.json`)
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      peerDependencies?: Record<string, string>
    }
    const peers = manifest.peerDependencies ?? {}
    cache.set(pkg, peers)
    return peers
  }
  catch {
    return undefined
  }
}

export const remarkPeer: Plugin<[], Root> = () => {
  return (tree) => {
    findAndReplace(tree, [
      [
        /\[\[peer:([\w@/-]+):([\w@/-]+)\]\]/g,
        (match: string, pkg: string, peer: string) => {
          const range = getPeerDependencies(pkg)?.[peer]
          return range ? { type: 'inlineCode', value: range } : match
        },
      ],
    ])
  }
}
