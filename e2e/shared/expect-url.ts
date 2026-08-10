import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Poll until the page URL matches the given expectation.
 * Absorbs async router/transition timing that immediate toHaveURL would flake on.
 */
export async function expectUrl(page: Page, expected: RegExp | string | ((url: URL) => boolean)) {
  if (typeof expected === 'function') {
    await expect
      .poll(() => expected(new URL(page.url())), { timeout: 5_000 })
      .toBe(true)
    return
  }
  await expect(page).toHaveURL(expected, { timeout: 5_000 })
}

/** Assert the current URL has the given search param(s). */
export async function expectSearch(page: Page, params: Record<string, string>) {
  await expectUrl(page, (url) => {
    for (const [key, value] of Object.entries(params)) {
      if (url.searchParams.get(key) !== value) {
        return false
      }
    }
    return true
  })
}
