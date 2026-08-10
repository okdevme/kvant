import { configurePlaywright } from '@kvant/e2e-shared/playwright.config'

export default configurePlaywright({
  startCommand: 'pnpm build && PORT=3102 pnpm start',
  port: 3102,
})
