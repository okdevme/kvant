import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    ignores: ['.react-router/**', 'build/**'],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
)
