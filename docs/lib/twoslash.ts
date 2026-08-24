import type { TwoslashTypesCache } from 'fumadocs-twoslash'
import type { Hash } from 'node:crypto'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { transformerTwoslash } from 'fumadocs-twoslash'

/**
 * Shared Twoslash setup, used by both the MDX pipeline (`source.config.ts`)
 * and the hero snippets (`components/hero/content.tsx`).
 *
 * Memory strategy: persist Twoslash results on disk (`.next/cache/twoslash`,
 * restored between deployments by Vercel's build cache) so that warm builds
 * skip TypeScript environment creation entirely. Cold builds run one shared
 * twoslasher per process; combine with the `lowmem` build mode (webpack,
 * single compilation process) to keep peak RSS within Vercel's 8 GB runner.
 *
 * Cache keys are versioned: any change to kvantjs's emitted `.d.mts` files,
 * the TypeScript/twoslash/Vue toolchain versions, or `TWOSLASH_CACHE_SALT`
 * invalidates all entries, so stale hover info cannot survive a dependency
 * or library update.
 */

/**
 * This module executes in two very different contexts during `next build`:
 *
 * 1. The MDX compilation pipeline, where `import.meta.url` points at this
 *    file on disk and module resolution works normally.
 * 2. Inside the webpack-bundled server build during static generation
 *    (RSC prerender), where `import.meta.url` points into `.next/server`
 *    and `require.resolve` of external packages returns webpack module ids
 *    instead of paths.
 *
 * `import.meta.url` is compiled to a constant in the bundle, so paths
 * derived from it stay correct. Dynamic `require.resolve` calls get
 * eliminated by webpack's static analysis, so dependency lookup below is
 * done with plain filesystem probing instead.
 */

function moduleDir(importMetaUrl: string): string {
  return path.dirname(new URL(importMetaUrl).pathname)
}

/** Walk up from `start` until a directory containing `node_modules` is found. */
function findPackageRoot(start: string): string {
  let dir = start
  for (let i = 0; i < 12; i++) {
    if (existsSync(path.join(dir, 'node_modules')))
      return dir
    const parent = path.dirname(dir)
    if (parent === dir)
      break
    dir = parent
  }
  return start
}

/** Locate an installed package's directory on disk (pnpm-compatible). */
function packageDir(name: string, fromDir: string): string | undefined {
  const candidate = path.join(findPackageRoot(fromDir), 'node_modules', ...name.split('/'))
  return existsSync(candidate) ? candidate : undefined
}

function packageVersion(name: string, fromDir: string): string {
  try {
    const dir = packageDir(name, fromDir)
    if (!dir)
      return 'unknown'
    const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) as { version?: string }
    return pkg.version ?? 'unknown'
  }
  catch {
    return 'unknown'
  }
}

/**
 * `@vue/language-core` computes its default `typesRoot` from its own
 * `__dirname`. Inside the webpack-bundled server build that resolves
 * relative to `.next/server/...`, producing broken
 * `/// <reference types="...">` headers in generated Vue code. Resolve the
 * types directory absolutely at runtime instead (it is a transitive
 * dependency of twoslash-vue, resolved through twoslash-vue's own
 * dependency chain).
 */
function vueTypesRoot(fromDir: string): string | undefined {
  const root = findPackageRoot(fromDir)
  // Direct install (visible from the docs package)
  const direct = packageDir('@vue/language-core', root)
  if (direct)
    return path.join(direct, 'types')
  // Transitive dependency of twoslash-vue. Under pnpm both live as siblings
  // in the virtual store: .pnpm/twoslash-vue@…/node_modules/twoslash-vue and
  // .pnpm/@vue+language-core@…/node_modules/@vue/language-core — discover it
  // by scanning the store, since webpack cannot statically bundle
  // require.resolve calls needed for a normal lookup.
  const twoslashVue = packageDir('twoslash-vue', root)
  const realTwoslashVue = twoslashVue && realpathSync(twoslashVue)
  if (!realTwoslashVue)
    return undefined
  // realTwoslashVue = <store>/.pnpm/twoslash-vue@…/node_modules/twoslash-vue
  const nodeModules = path.dirname(realTwoslashVue)
  const candidates = [
    path.join(nodeModules, '@vue', 'language-core'),
    // also probe every sibling store entry (different store layouts)
    ...(() => {
      try {
        const pnpmStore = path.dirname(nodeModules) // .pnpm
        return readdirSync(pnpmStore)
          .filter(entry => entry.startsWith('@vue+language-core@'))
          .map(entry => path.join(pnpmStore, entry, 'node_modules', '@vue', 'language-core'))
      }
      catch {
        return []
      }
    })(),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate))
      return path.join(candidate, 'types')
  }
  return undefined
}

function hashDeclarations(hash: Hash, dir: string): void {
  if (!existsSync(dir))
    return
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      hashDeclarations(hash, full)
    }
    else if (/\.d\.(?:m|c)?ts$/.test(entry.name)) {
      hash.update(entry.name).update('\0').update(readFileSync(full)).update('\0')
    }
  }
}

export function createTwoslashTypesCache(
  dir: string = process.env.TWOSLASH_CACHE_DIR ?? '.next/cache/twoslash',
): TwoslashTypesCache {
  // Anchor both the cache directory and all resolution to the package root,
  // so the compile pipeline and the webpack-bundled prerender agree on them.
  const packageRoot = findPackageRoot(moduleDir(import.meta.url))
  const cacheDir = path.resolve(packageRoot, dir)

  const version = createHash('sha256')
  version.update(JSON.stringify({
    'salt': process.env.TWOSLASH_CACHE_SALT ?? 'v1',
    'kvantjs': packageVersion('kvantjs', packageRoot),
    'typescript': packageVersion('typescript', packageRoot),
    'twoslash': packageVersion('twoslash', packageRoot),
    'twoslash-vue': packageVersion('twoslash-vue', packageRoot),
    'fumadocs-twoslash': packageVersion('fumadocs-twoslash', packageRoot),
    'vue': packageVersion('vue', packageRoot),
  }))
  try {
    // kvantjs is workspace-linked and may rebuild without a version bump —
    // fingerprint its emitted declarations so dev builds never go stale.
    const kvantDir = packageDir('kvantjs', packageRoot)
    if (kvantDir)
      hashDeclarations(version, path.join(kvantDir, 'dist'))
  }
  catch {}
  const versionKey = version.digest('hex').slice(0, 16)

  const keyOf = (code: string): string =>
    createHash('sha256').update(versionKey).update('\0').update(code).digest('hex').slice(0, 16)

  if (process.env.TWOSLASH_CACHE_DEBUG === '1')
    process.stderr.write(`[twoslash-cache] dir=${cacheDir} versionKey=${versionKey}\n`)

  return {
    init() {
      try {
        mkdirSync(cacheDir, { recursive: true })
      }
      catch {}
    },
    read(code) {
      try {
        const file = path.join(cacheDir, `${keyOf(code)}.json`)
        if (!existsSync(file))
          return null
        return JSON.parse(readFileSync(file, 'utf8'))
      }
      catch {
        return null
      }
    },
    write(code, data) {
      try {
        writeFileSync(path.join(cacheDir, `${keyOf(code)}.json`), JSON.stringify(data))
      }
      catch {}
    },
  }
}

export const twoslashTypesCache = createTwoslashTypesCache()

export function createTwoslashTransformer(): ReturnType<typeof transformerTwoslash> {
  const typesRoot = vueTypesRoot(moduleDir(import.meta.url))
  return transformerTwoslash({
    langs: ['ts', 'tsx', 'js', 'jsx', 'vue'],
    typesCache: twoslashTypesCache,
    twoslashOptions: {
      compilerOptions: {
        moduleResolution: 100, // Bundler
        jsx: 4, // React JSX
      },
      ...(typesRoot && { vueCompilerOptions: { typesRoot } }),
    },
  })
}
