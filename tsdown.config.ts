import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/schema/index.ts',
    'src/react/index.ts',
    {
      '*': 'src/adapters/*',
      'react/*': 'src/react/adapters/*',
      'next/*': 'src/react/adapters/next/*',
    },
  ],
  dts: true,
  exports: true,
  publint: true,
  deps: {
    onlyBundle: [],
  },
})
