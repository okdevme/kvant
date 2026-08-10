import { expect, test } from '@playwright/test'
import { expectUrl } from './expect-url'
import { navigateTo } from './navigate'

/**
 * Shared specs for conditional rendering behavior.
 * Page contract: #toggle mounts/unmounts inner component,
 * #state shows value (or 'unmounted'), #inner-set writes 'inner'.
 */
export function testConditionalRendering(bench: string, path: string) {
  test.describe(`${bench} / conditional rendering`, () => {
    test('state survives unmount and remount', async ({ page }) => {
      await navigateTo(page, path, '?test=init')
      await expect(page.locator('#state')).toHaveText('init')

      await page.locator('#toggle').click()
      await expect(page.locator('#state')).toHaveText('unmounted')

      await page.locator('#toggle').click()
      await expect(page.locator('#state')).toHaveText('init')
    })

    test('writes from a remounted component update the URL', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#toggle').click()
      await page.locator('#toggle').click()
      await page.locator('#inner-set').click()
      await expect(page.locator('#state')).toHaveText('inner')
      await expectUrl(page, /[?&]test=inner/)
    })
  })
}

/**
 * Shared specs for hash preservation.
 * Page contract: #set-pass writes 'pass', #clear removes, #state shows value.
 */
export function testHashPreservation(bench: string, path: string) {
  test.describe(`${bench} / hash preservation`, () => {
    test('hash survives setting a value', async ({ page }) => {
      await navigateTo(page, `${path}#section`)
      await page.locator('#set-pass').click()
      await expectUrl(page, /test=pass/)
      await expectUrl(page, /#section$/)
    })

    test('hash survives clearing a value', async ({ page }) => {
      await navigateTo(page, path, '?test=init#section')
      await page.locator('#clear').click()
      await expectUrl(page, url => !url.searchParams.has('test'))
      await expectUrl(page, /#section$/)
    })
  })
}

/**
 * Shared specs for plain link integration.
 * Page contract: anchor #link-with-query (href with ?test=link-value),
 * anchor #link-cross-page (href to `crossPath` with query), #state shows value.
 * SPA benches: links must trigger router navigation (click handler intercepts).
 */
export function testLinking(bench: string, path: string, crossPath: string) {
  test.describe(`${bench} / linking`, () => {
    test('same-page link with query params updates state', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#link-with-query').click()
      await expect(page.locator('#state')).toHaveText('link-value')
      await expectUrl(page, /[?&]test=link-value/)
    })

    test('cross-page link carries query state to destination', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#link-cross-page').click()
      await expectUrl(page, url => url.pathname === crossPath)
      await expect(page.locator('#state')).toHaveText('cross')
    })
  })
}

/**
 * Shared specs for native form integration.
 * Page contract: form #form with input #input (name="test"), submit button #submit,
 * #state shows value. Submit applies input value to the URL.
 */
export function testForm(bench: string, path: string) {
  test.describe(`${bench} / form`, () => {
    test('input value initializes from the URL', async ({ page }) => {
      await navigateTo(page, path, '?test=init')
      await expect(page.locator('#input')).toHaveValue('init')
    })

    test('submitting the form updates the URL and state', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#input').fill('submitted')
      await page.locator('#submit').click()
      await expect(page.locator('#state')).toHaveText('submitted')
      await expectUrl(page, /[?&]test=submitted/)
    })
  })
}

/**
 * Shared specs for special characters in values.
 * Page contract: #set-special writes a value with reserved chars, #state shows it.
 */
export function testSpecialChars(bench: string, path: string) {
  test.describe(`${bench} / special characters`, () => {
    test('reserved characters roundtrip through the URL', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-special').click()
      await expect(page.locator('#state')).toHaveText('a b+c/d?e&f=g')
      // wait for the write to land in the URL before reloading
      await expectUrl(page, url => url.searchParams.get('test') === 'a b+c/d?e&f=g')
      await page.reload()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('#state')).toHaveText('a b+c/d?e&f=g')
    })
  })
}

/**
 * Shared specs for json schema roundtrip.
 * Page contract: #set-json writes an object, #state shows JSON-stringified value.
 */
export function testJson(bench: string, path: string) {
  test.describe(`${bench} / json schema`, () => {
    test('object state roundtrips through the URL', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-json').click()
      await expect(page.locator('#state')).toHaveText('{"a":1,"b":[true,"x"]}')
      // wait for the write to land in the URL before reloading
      await expectUrl(page, url => url.searchParams.has('test'))
      await page.reload()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('#state')).toHaveText('{"a":1,"b":[true,"x"]}')
    })
  })
}

/**
 * Shared specs for multi-hook sync on the same key.
 * Page contract: two hooks (single-key and multi-key form) read key 'test',
 * #state-a and #state-b show both views, #set-a writes via first hook,
 * #set-b writes via second hook.
 */
export function testMultiHookSync(bench: string, path: string) {
  test.describe(`${bench} / multi-hook sync`, () => {
    test('both hooks read the same URL value', async ({ page }) => {
      await navigateTo(page, path, '?test=shared')
      await expect(page.locator('#state-a')).toHaveText('shared')
      await expect(page.locator('#state-b')).toHaveText('shared')
    })

    test('writes via the single-key hook propagate to the multi-key hook', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-a').click()
      await expect(page.locator('#state-a')).toHaveText('from-a')
      await expect(page.locator('#state-b')).toHaveText('from-a')
    })

    test('writes via the multi-key hook propagate to the single-key hook', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-b').click()
      await expect(page.locator('#state-b')).toHaveText('from-b')
      await expect(page.locator('#state-a')).toHaveText('from-b')
    })
  })
}

/**
 * Shared specs for sessionStorage.
 * Page contract: mirrors the localStorage bench (#set-pass, #clear, #increment,
 * #state, #count) backed by sessionStorage.
 */
export function testSessionStorage(bench: string, path: string) {
  test.describe(`${bench} / sessionStorage`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => window.sessionStorage.clear())
    })

    test('reads the value from sessionStorage on mount', async ({ page }) => {
      await page.addInitScript(() => window.sessionStorage.setItem('test', 'init'))
      await navigateTo(page, path)
      await expect(page.locator('#state')).toHaveText('init')
    })

    test('writes the value to sessionStorage', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-pass').click()
      await expect(page.locator('#state')).toHaveText('pass')
      expect(await page.evaluate(() => window.sessionStorage.getItem('test'))).toBe('pass')
    })

    test('removes the key when set to undefined', async ({ page }) => {
      await page.addInitScript(() => window.sessionStorage.setItem('test', 'init'))
      await navigateTo(page, path)
      await page.locator('#clear').click()
      await expect(page.locator('#state')).toBeEmpty()
      expect(await page.evaluate(() => window.sessionStorage.getItem('test'))).toBeNull()
    })

    test('does not leak into localStorage', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-pass').click()
      await expect(page.locator('#state')).toHaveText('pass')
      expect(await page.evaluate(() => window.localStorage.getItem('test'))).toBeNull()
    })

    test('is not shared with a new tab', async ({ page, context }) => {
      await navigateTo(page, path)
      await page.locator('#set-pass').click()
      await expect(page.locator('#state')).toHaveText('pass')

      const other = await context.newPage()
      await navigateTo(other, path)
      await expect(other.locator('#state')).toBeEmpty()
    })
  })
}

/**
 * Shared specs for multiple interfaces coexisting on one page.
 * Page contract: #set-query/#set-cookie/#set-storage/#set-all write 'from-*'
 * (or single chars for #set-all) into searchParams/cookies/localStorage under
 * the same key 'test'; #query/#cookie/#storage display each interface's value.
 */
export function testMultiInterface(bench: string, path: string) {
  test.describe(`${bench} / multi-interface`, () => {
    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies()
      await page.addInitScript(() => window.localStorage.clear())
    })

    test('interfaces are independent', async ({ page }) => {
      await navigateTo(page, path)

      await page.locator('#set-query').click()
      await expect(page.locator('#query')).toHaveText('from-query')
      await expect(page.locator('#cookie')).toBeEmpty()
      await expect(page.locator('#storage')).toBeEmpty()

      await page.locator('#set-cookie').click()
      await expect(page.locator('#cookie')).toHaveText('from-cookie')
      await expect(page.locator('#storage')).toBeEmpty()

      await page.locator('#set-storage').click()
      await expect(page.locator('#storage')).toHaveText('from-storage')
      await expect(page.locator('#query')).toHaveText('from-query')
    })

    test('same key across interfaces does not cross-talk', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-all').click()

      await expect(page.locator('#query')).toHaveText('q')
      await expect(page.locator('#cookie')).toHaveText('c')
      await expect(page.locator('#storage')).toHaveText('s')
      await expectUrl(page, /[?&]test=q/)
      expect(await page.evaluate(() => window.localStorage.getItem('test'))).toBe('s')
      const cookies = await page.context().cookies()
      expect(cookies.find(c => c.name === 'test')?.value).toBe('c')
    })
  })
}

/**
 * Shared specs for cookie attributes.
 * Page contract: #set-expiring writes 'expiring' cookie with maxAge,
 * #set-scoped writes a cookie scoped to `path`, #state/#expiring/#scoped display.
 */
export function testCookieAttributes(bench: string, path: string) {
  test.describe(`${bench} / cookie attributes`, () => {
    test.beforeEach(async ({ context }) => {
      await context.clearCookies()
    })

    test('maxAge is written to the cookie', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-expiring').click()
      await expect(page.locator('#expiring')).toHaveText('alive')

      const cookies = await page.context().cookies()
      const cookie = cookies.find(c => c.name === 'expiring')
      expect(cookie).toBeDefined()
      // expires roughly maxAge (3600s) in the future
      expect(cookie!.expires).toBeGreaterThan(Date.now() / 1000 + 3000)
    })

    test('path-scoped cookie is sent on its path only', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-scoped').click()
      await expect(page.locator('#scoped')).toHaveText('scoped-value')

      const cookies = await page.context().cookies()
      const cookie = cookies.find(c => c.name === 'scoped')
      expect(cookie?.path).toBe(path)
    })

    test('cookie persists across reload', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-expiring').click()
      await expect(page.locator('#expiring')).toHaveText('alive')

      await page.reload()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('#expiring')).toHaveText('alive')
    })
  })
}
