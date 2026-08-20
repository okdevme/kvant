import type { SnippetMap } from './snippets'
import type { Framework, FrameworkId } from '@/lib/frameworks'
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { transformerTwoslash } from 'fumadocs-twoslash'
import * as twoslashComponents from 'fumadocs-twoslash/ui'
import { frameworks } from '@/lib/frameworks'
import { CachedCodeBlock } from './cached-codeblock'

export interface SnippetComponent {
  id: string
  frameworks?: FrameworkId[]
  label: (framework: Framework) => string
  render: (framework: Framework) => string
}

export const snippetComponents: SnippetComponent[] = [
  {
    id: 'search-params',
    label: (framework) => {
      switch (framework.id) {
        case 'react':
        case 'next':
        case 'react-router':
        case 'vue':
          return 'Search Params'
        case 'next-pages':
          return 'Router Query'
        case 'vue-router':
        case 'nuxt':
          return 'Route Query'
      }
    },
    render: (framework) => {
      const importEntry = {
        'react': 'react',
        'next': 'next',
        'next-pages': 'next/pages',
        'react-router': 'react-router',
        'vue': 'vue',
        'vue-router': 'vue-router',
        'nuxt': 'nuxt',
      }[framework.id]
      const importName = {
        'react': 'useSearchParams',
        'next': 'useSearchParams',
        'next-pages': 'useRouterQuery',
        'react-router': 'useSearchParams',
        'vue': 'useSearchParams',
        'vue-router': 'useRouteQuery',
        'nuxt': 'useRouteQuery',
      }[framework.id]

      switch (framework.family) {
        case 'react': return `import { ${importName} } from 'kvant/${importEntry}'
import * as kv from 'kvant/schema'

function SearchInput() {
  // [!code word:${importName}]
  const [query, setQuery] = ${importName}('q', kv.string().default(''))

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  )
}`
        case 'vue': return `<script setup lang="ts">
import { ${importName} } from 'kvant/${importEntry}'
import * as kv from 'kvant/schema'

// [!code word:${importName}]
const query = ${importName}('q', kv.string().default(''))
</script>

<template>
  <input v-model="query">
</template>`
      }
    },
  },
  {
    id: 'route-params',
    frameworks: ['vue-router', 'nuxt'],
    label: () => 'Route Params',
    render: (framework) => {
      const importEntry = framework.id === 'nuxt' ? 'nuxt' : 'vue-router'
      const routePattern = framework.id === 'nuxt' ? '/users/[id]' : '/users/:id'

      return `<script setup lang="ts">
import { useRouteParams } from 'kvant/${importEntry}'
import * as kv from 'kvant/schema'

// Route: ${routePattern}
// [!code word:useRouteParams]
const id = useRouteParams('id', kv.string())
</script>

<template>
  <p>User #{{ id }}</p>
</template>`
    },
  },
  {
    id: 'local-storage',
    label: () => 'Local Storage',
    render: (framework) => {
      switch (framework.family) {
        case 'react': return `import { useLocalStorage } from 'kvant/react'
import * as kv from 'kvant/schema'

function ThemeToggle() {
  // [!code word:useLocalStorage]
  const [theme, setTheme] = useLocalStorage('theme', kv.enum(['light', 'dark']).default('light'))

  return (
    <button onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
      Theme: {theme}
    </button>
  )
}`
        case 'vue': return `<script setup lang="ts">
import { useLocalStorage } from 'kvant/vue'
import * as kv from 'kvant/schema'

// [!code word:useLocalStorage]
const theme = useLocalStorage('theme', kv.enum(['light', 'dark']).default('light'))
</script>

<template>
  <button @click="theme = theme === 'light' ? 'dark' : 'light'">
    Theme: {{ theme }}
  </button>
</template>`
      }
    },
  },
  {
    id: 'cookies',
    label: () => 'Cookies',
    render: (framework) => {
      switch (framework.family) {
        case 'react': return `import { useCookies } from 'kvant/react'
import * as kv from 'kvant/schema'

function LocaleSelect() {
  // [!code word:useCookies]
  const [locale, setLocale] = useCookies('locale', kv.string().default('en'))

  return (
    <select value={locale} onChange={e => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  )
}`
        case 'vue': {
          const importEntry = framework.id === 'nuxt' ? 'nuxt' : 'vue'

          return `<script setup lang="ts">
import { useCookies } from 'kvant/${importEntry}'
import * as kv from 'kvant/schema'

// [!code word:useCookies]
const locale = useCookies('locale', kv.string().default('en'))
</script>

<template>
  <select v-model="locale">
    <option value="en">English</option>
    <option value="de">Deutsch</option>
  </select>
</template>`
        }
      }
    },
  },
]

const transformers = [
  ...(rehypeCodeDefaultOptions.transformers ?? []),
  transformerTwoslash({
    langs: ['ts', 'tsx', 'js', 'jsx', 'vue'],
    twoslashOptions: {
      compilerOptions: {
        moduleResolution: 100, // Bundler
        jsx: 4, // React JSX
      },
    },
  }),
]

export const snippetMap = Object.fromEntries(
  frameworks.map(framework => [
    framework.id,
    snippetComponents
      .filter(component => !component.frameworks || component.frameworks.includes(framework.id))
      .map(component => ({
        label: component.label(framework),
        children: (
          <CachedCodeBlock
            lang={framework.family === 'vue' ? 'vue' : 'tsx'}
            code={component.render(framework)}
            codeblock={{ className: 'border-0 shadow-none' }}
            transformers={transformers}
            meta={{ __raw: 'twoslash' }}
            components={twoslashComponents}
          />
        ),
      })),
  ]),
) as SnippetMap
