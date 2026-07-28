import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'schema': 'src/schema/index.ts',
    '*': 'src/adapters/*',
    'react': 'src/react/index.ts',
    'react/*': 'src/react/adapters/*',
    'next/*': 'src/react/adapters/next/*',
    'vue': 'src/vue/index.ts',
    // 'vue/*': 'src/vue/adapters/*',
  },
  dts: true,
  exports: true,
  publint: true,
  deps: {
    onlyBundle: [],
  },
})
