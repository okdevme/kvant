import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX({
  configPath: './source.config.ts',
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['typescript', 'twoslash', 'twoslash-vue', '@vue/language-core'],
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/next',
        permanent: false,
      },
    ]
  },
}

export default withMDX(config)
