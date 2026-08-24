import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { defineConfig } from 'fumadocs-mdx/config'
import { remarkPeer } from './lib/remark-peer'
import { remarkSwitch } from './lib/remark-switch'
import { createTwoslashTransformer } from './lib/twoslash'

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
        createTwoslashTransformer(),
      ],
      langs: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    },
  },
})
