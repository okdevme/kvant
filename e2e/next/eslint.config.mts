import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    nextjs: true,
  },
  {
    rules: {
      // pages router files export getServerSideProps alongside the component
      'react-refresh/only-export-components': 'off',
    },
  },
)
