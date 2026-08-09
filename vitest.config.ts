import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env': JSON.stringify({ NODE_ENV: 'test' }),
  },
  test: {
    environment: 'happy-dom',
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts'],
    },
  },
})
