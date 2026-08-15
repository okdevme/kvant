import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX({
  configPath: './source.config.ts',
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
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
