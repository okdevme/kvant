import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { defineConfig } from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { remarkPeer } from './lib/remark-peer'
import { remarkSwitch } from './lib/remark-switch'

export default defineConfig({
  mdxOptions: {
    preset: 'fumadocs',
    remarkPlugins: [remarkSwitch, remarkPeer],
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
    },
    rehypeCodeOptions: {
      inline: 'tailing-curly-colon',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
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
      ],
      langs: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    },
  },
})
