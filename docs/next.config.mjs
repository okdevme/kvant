import { createMDX } from 'fumadocs-mdx/next'

// `build:lowmem` sets this to cap the build within Vercel's 8 GB runner.
// Disabled by default so well-provisioned runners keep the fast turbopack build.
const lowMemory = process.env.NEXT_LOW_MEMORY === '1'

const withMDX = createMDX({
  configPath: './source.config.ts',
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['typescript', 'twoslash', 'twoslash-vue', '@vue/language-core'],
  ...(lowMemory && {
    experimental: {
      webpackMemoryOptimizations: true,
    },
  }),
}

export default withMDX(config)
