import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { defineConfig } from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'
import { remarkSwitch } from './lib/remark-switch'

export default defineConfig({
  mdxOptions: {
    preset: 'fumadocs',
    remarkPlugins: [remarkSwitch],
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
    },
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({ langs: ['ts', 'tsx', 'js', 'jsx', 'vue'] }),
      ],
      langs: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    },
  },
})
