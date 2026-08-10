import { configurePlaywright } from '@kvant/e2e-shared/playwright.config'

export default configurePlaywright({
  startCommand: 'pnpm dev',
  port: 3102,
})
