import type { Page } from '@playwright/test'

export interface LogSpy {
  /** Count matching log lines so far. */
  count: (pattern?: RegExp | string) => Promise<number>
  /** All captured lines. */
  lines: () => Promise<string[]>
}

declare global {
  interface Window {
    __kvantLogSpy?: string[]
  }
}

/**
 * Intercept console.log lines in the page and expose count queries.
 * Call before navigation; uses an init script so early logs are captured.
 */
export async function setupLogSpy(page: Page): Promise<LogSpy> {
  await page.addInitScript(() => {
    const lines: string[] = []
    window.__kvantLogSpy = lines
    // eslint-disable-next-line no-console -- intentional interception for render-count assertions
    const original = console.log
    // eslint-disable-next-line no-console -- intentional interception for render-count assertions
    console.log = (...args: unknown[]) => {
      lines.push(args.map(String).join(' '))
      original.apply(console, args)
    }
  })

  return {
    count: pattern =>
      page.evaluate(
        p =>
          (window.__kvantLogSpy ?? []).filter(line =>
            p ? new RegExp(p).test(line) : true,
          ).length,
        pattern instanceof RegExp ? pattern.source : pattern,
      ),
    lines: () => page.evaluate(() => window.__kvantLogSpy ?? []),
  }
}
