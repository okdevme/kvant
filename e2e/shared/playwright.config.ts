import { defineConfig, devices } from '@playwright/test'

export interface PlaywrightBenchConfig {
  /** Command to start the bench server. */
  startCommand: string
  /** Port the bench listens on. */
  port: number
}

/** Shared Playwright configuration for e2e benches. */
export function configurePlaywright({ startCommand, port }: PlaywrightBenchConfig) {
  return defineConfig({
    testDir: './specs',
    outputDir: '.playwright/test-results',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: 10_000,
    reporter: [['list']],
    use: {
      baseURL: `http://localhost:${port}`,
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: {
      command: startCommand,
      url: `http://localhost:${port}`,
      reuseExistingServer: !process.env.CI,
    },
  })
}
