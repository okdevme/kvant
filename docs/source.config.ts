import { defineConfig } from 'fumadocs-mdx/config'
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
  },
})
