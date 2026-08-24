import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { navigateTo } from './navigate'

export interface HydrationSpecOptions {
  /** Origin used to seed cookies/localStorage before navigation. */
  origin: string
  /** Asserts on the cookie-bound #state element (default true). */
  cookie?: boolean
  /** Asserts on the search-params-bound #query element (default false). */
  query?: boolean
  /** Asserts on the localStorage-bound #stored element (default false). */
  storage?: boolean
  /** Expected SSR text of #state when the bench feeds request cookies (Next). */
  cookieSsrState?: string
  /** Expected SSR text of #query (default 'server'). */
  querySsrState?: string
}

declare global {
  interface Window {
    __kvantHydrationErrors?: string[]
  }
}

/** Captures console errors/warnings from the earliest page scripts. */
async function setupHydrationErrorSpy(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const errors: string[] = []
    window.__kvantHydrationErrors = errors
    for (const level of ['error', 'warn'] as const) {
      // eslint-disable-next-line no-console -- intentional interception for hydration mismatch assertions
      const original = console[level]
      // eslint-disable-next-line no-console -- intentional interception for hydration mismatch assertions
      console[level] = (...args: unknown[]) => {
        errors.push(args.map(String).join(' '))
        original.apply(console, args)
      }
    }
    window.addEventListener('error', event => errors.push(String(event.message)))
    window.addEventListener('unhandledrejection', event => errors.push(String(event.reason)))
  })
}

async function hydrationErrors(page: Page): Promise<string[]> {
  const lines = await page.evaluate(() => window.__kvantHydrationErrors ?? [])
  return lines.filter(line => /hydration/i.test(line))
}

/**
 * Shared specs for hydration with client data mismatching the SSR snapshot.
 * Page contract: #state bound to cookie 'test', #query to search param 'test',
 * #stored to localStorage 'test'. The spec seeds client values ('client') that
 * differ from the SSR snapshot, so hydration must not report mismatches and the
 * client values must win after hydration.
 */
export function testHydration(bench: string, path: string, options: HydrationSpecOptions) {
  const {
    origin,
    cookie = true,
    query = false,
    storage = false,
    cookieSsrState = 'server',
    querySsrState = 'server',
  } = options

  test.describe(`${bench} / hydration`, () => {
    test.beforeEach(async ({ context }) => {
      await context.clearCookies()
    })

    test('no hydration mismatch when client cookie differs from the SSR snapshot', async ({ page }) => {
      test.skip(!cookie, 'bench does not render a cookie-bound element')
      await setupHydrationErrorSpy(page)
      await page.context().addCookies([{ name: 'test', value: 'client', url: origin }])
      await navigateTo(page, path)
      await expect(page.locator('#state')).toHaveText('client')
      expect(await hydrationErrors(page)).toEqual([])
    })

    test('SSR HTML renders the server snapshot, not client data', async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      await page.context().addCookies([{ name: 'test', value: 'client', url: origin }])
      // Fetch the SSR HTML without executing any client scripts.
      await page.route('**/*', (route) => {
        route.request().resourceType() === 'script'
          ? route.abort()
          : route.continue()
      })
      await page.goto(path)
      await expect(page.locator('#state')).toHaveText(cookieSsrState)
      await context.close()
    })

    test('no hydration mismatch when the URL search param is not in the SSR snapshot', async ({ page }) => {
      test.skip(!query, 'bench does not render a search-params-bound element')
      await setupHydrationErrorSpy(page)
      await navigateTo(page, path, '?test=server')
      await expect(page.locator('#query')).toHaveText(querySsrState)
      expect(await hydrationErrors(page)).toEqual([])
    })

    test('no hydration mismatch when localStorage has data the server could not see', async ({ page }) => {
      test.skip(!storage, 'bench does not render a localStorage-bound element')
      await setupHydrationErrorSpy(page)
      await page.context().addInitScript(() => {
        localStorage.setItem('test', 'client')
      })
      await navigateTo(page, path)
      await expect(page.locator('#stored')).toHaveText('client')
      expect(await hydrationErrors(page)).toEqual([])
    })
  })
}
