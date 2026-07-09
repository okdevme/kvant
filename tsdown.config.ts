import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/schema/index.ts',
  ],
  dts: true,
  exports: true,
  publint: true,
  deps: {
    onlyBundle: [],
  },
})
