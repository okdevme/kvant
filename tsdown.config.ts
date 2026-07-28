import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'schema': 'src/schema/index.ts',
    'react': 'src/react/index.ts',
    'next/app': 'src/next/app/index.ts',
    'vue': 'src/vue/index.ts',
  },
  dts: true,
  exports: true,
  publint: true,
  deps: {
    onlyBundle: [],
  },
})
