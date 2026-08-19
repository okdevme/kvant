import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    nextjs: true,
    pnpm: {
      catalogs: true,
    },
    ignores: ['next-env.d.ts', '.source'],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
    },
  },
)
