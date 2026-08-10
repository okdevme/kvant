import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env': JSON.stringify({ NODE_ENV: 'test' }),
  },
  test: {
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', 'e2e/**'],
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts'],
    },
  },
})
