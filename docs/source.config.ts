import { defineConfig } from 'fumadocs-mdx/config'

export default defineConfig({
  mdxOptions: {
    preset: 'fumadocs',
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
    },
  },
})
