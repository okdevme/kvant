import { expect, test } from '@playwright/test'
import { expectUrl } from './expect-url'
import { setupLogSpy } from './log-spy'
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
 * #set-scoped writes a cookie scoped to `path`, #set-samesite writes a
 * SameSite=strict cookie, #state/#expiring/#scoped/#samesite display.
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

    test('sameSite attribute is written to the cookie', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-samesite').click()
      await expect(page.locator('#samesite')).toHaveText('strict-value')

      const cookies = await page.context().cookies()
      const cookie = cookies.find(c => c.name === 'samesite')
      expect(cookie?.sameSite).toBe('Strict')
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

/**
 * Shared specs for key isolation (render counts).
 * Page contract: two probe components bound to keys 'a' and 'b' on the same
 * adapter; #trigger-a/#trigger-b write 'pass' to their key, #state-a/#state-b
 * display the values. Each probe logs `render a` / `render b` to console.log
 * on every render (React: render body; Vue: onMounted + onUpdated).
 *
 * Assertions are baseline-relative so StrictMode double-rendering and
 * framework-specific mount counts don't leak into the spec.
 *
 * Not run on the next / react-router benches: those adapters sit on the
 * framework router context, which re-renders consumers on any navigation
 * by design.
 */
export function testKeyIsolation(bench: string, path: string) {
  test.describe(`${bench} / key isolation`, () => {
    test('updating key a does not re-render hook b', async ({ page }) => {
      const spy = await setupLogSpy(page)
      await navigateTo(page, path)
      await expect(page.locator('#state-a')).toBeAttached()

      const baseA = await spy.count('render a')
      const baseB = await spy.count('render b')
      expect(baseA).toBeGreaterThan(0)
      expect(baseB).toBeGreaterThan(0)

      await page.locator('#trigger-a').click()
      await expect(page.locator('#state-a')).toHaveText('pass')
      await expectUrl(page, /[?&]a=pass/)

      expect(await spy.count('render a')).toBeGreaterThan(baseA)
      expect(await spy.count('render b')).toBe(baseB)
    })

    test('updating key b does not re-render hook a', async ({ page }) => {
      const spy = await setupLogSpy(page)
      await navigateTo(page, path)
      await expect(page.locator('#state-a')).toBeAttached()

      const baseA = await spy.count('render a')
      const baseB = await spy.count('render b')

      await page.locator('#trigger-b').click()
      await expect(page.locator('#state-b')).toHaveText('pass')
      await expectUrl(page, /[?&]b=pass/)

      expect(await spy.count('render b')).toBeGreaterThan(baseB)
      expect(await spy.count('render a')).toBe(baseA)
    })

    test('sequential updates stay isolated', async ({ page }) => {
      const spy = await setupLogSpy(page)
      await navigateTo(page, path)
      await expect(page.locator('#state-a')).toBeAttached()

      await page.locator('#trigger-a').click()
      await expect(page.locator('#state-a')).toHaveText('pass')
      await expectUrl(page, /[?&]a=pass/)

      const countA = await spy.count('render a')
      const countB = await spy.count('render b')

      await page.locator('#trigger-b').click()
      await expect(page.locator('#state-b')).toHaveText('pass')
      await expectUrl(page, url =>
        url.searchParams.get('a') === 'pass'
        && url.searchParams.get('b') === 'pass')

      expect(await spy.count('render a')).toBe(countA)
      expect(await spy.count('render b')).toBeGreaterThan(countB)
    })
  })
}

/**
 * Shared specs for the scroll option on searchParams writes.
 * Page contract: tall page (content height > viewport), #write-default writes
 * test=default with default options, #write-scroll writes test=scroll with
 * `scroll: true`.
 *
 * Only run on benches whose adapters support the scroll option
 * (core searchParams, next, react-router); vue-router / nuxt delegate scroll
 * behavior to the framework router.
 */
export function testScroll(bench: string, path: string) {
  test.describe(`${bench} / scroll option`, () => {
    test('default: scroll position is preserved on write', async ({ page }) => {
      await navigateTo(page, path)
      await page.evaluate(() => window.scrollTo(0, 500))
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

      await page.locator('#write-default').click()
      await expectUrl(page, /[?&]test=default/)
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    })

    test('scroll: true resets scroll to the top on write', async ({ page }) => {
      await navigateTo(page, path)
      await page.evaluate(() => window.scrollTo(0, 500))
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

      await page.locator('#write-scroll').click()
      await expectUrl(page, /[?&]test=scroll/)
      await expect
        .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
        .toBe(0)
    })
  })
}

/**
 * Shared specs for programmatic router navigation.
 * Page contract: #nav-push / #nav-replace navigate (framework router push /
 * replace) to `${destPath}?test=routed`. The destination page shows #state
 * bound to the 'test' key (the linking-target pages satisfy this).
 */
export function testRouting(bench: string, path: string, destPath: string) {
  const isDest = (url: URL) =>
    url.pathname === destPath && url.searchParams.get('test') === 'routed'

  test.describe(`${bench} / routing`, () => {
    test('router push to a URL with query picks up state', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#nav-push').click()
      await expectUrl(page, isDest)
      await expect(page.locator('#state')).toHaveText('routed')
    })

    test('router replace to a URL with query picks up state', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#nav-replace').click()
      await expectUrl(page, isDest)
      await expect(page.locator('#state')).toHaveText('routed')
    })

    test('state follows back/forward navigation', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#nav-push').click()
      await expectUrl(page, isDest)
      await expect(page.locator('#state')).toHaveText('routed')

      await page.goBack()
      await expectUrl(page, url => url.pathname === path)

      await page.goForward()
      await expectUrl(page, isDest)
      await expect(page.locator('#state')).toHaveText('routed')
    })
  })
}

/**
 * Shared specs for zod schema integration (docs: /docs/schema/zod).
 * Page contract: key 'test' bound via a zod schema with `.catch(fallback)`.
 * #state shows the typed value, #set-valid writes a valid value,
 * #set-invalid writes an out-of-domain value (e.g. below min),
 * #clear removes the key.
 */
export function testZodSchema(bench: string, path: string) {
  test.describe(`${bench} / zod schema`, () => {
    test('reads a valid value from the URL', async ({ page }) => {
      await navigateTo(page, path, '?test=5')
      await expect(page.locator('#state')).toHaveText('5')
    })

    test('invalid URL value falls back via .catch()', async ({ page }) => {
      await navigateTo(page, path, '?test=abc')
      await expect(page.locator('#state')).toHaveText('1')
    })

    test('out-of-domain URL value falls back via .catch()', async ({ page }) => {
      await navigateTo(page, path, '?test=0')
      await expect(page.locator('#state')).toHaveText('1')
    })

    test('missing key falls back via .catch()', async ({ page }) => {
      await navigateTo(page, path)
      await expect(page.locator('#state')).toHaveText('1')
    })

    test('writing a valid value updates the URL and survives reload', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-valid').click()
      await expect(page.locator('#state')).toHaveText('42')
      await expectUrl(page, /[?&]test=42/)
      await page.reload()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('#state')).toHaveText('42')
    })
  })
}

/**
 * Shared specs for a custom qs-based search serializer
 * (docs: custom search serializer snippet).
 * Page contract: key 'filters' bound via kv.object({ tags: string[].default([]),
 * range: tuple([number, number]).optional() }); #state shows JSON of the value,
 * #set-filters writes { tags: ['a','b'], range: [1,9] }, #clear removes the key.
 */
export function testCustomSerializer(bench: string, path: string) {
  test.describe(`${bench} / custom search serializer (qs)`, () => {
    test('reads nested values from a qs-style URL', async ({ page }) => {
      await navigateTo(
        page,
        `${path}?filters[tags][0]=a&filters[tags][1]=b&filters[range][0]=1&filters[range][1]=9`,
      )
      await expect(page.locator('#state'))
        .toHaveText('{"tags":["a","b"],"range":[1,9]}')
    })

    test('writes nested values in qs format', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-filters').click()
      await expect(page.locator('#state'))
        .toHaveText('{"tags":["a","b"],"range":[1,9]}')
      await expectUrl(page, /filters\[tags\]\[0\]=a/)
      await expectUrl(page, /filters\[range\]\[1\]=9/)
    })

    test('applies defaults when the key is absent', async ({ page }) => {
      await navigateTo(page, path)
      await expect(page.locator('#state')).toHaveText('{"tags":[]}')
    })

    test('nested state survives reload', async ({ page }) => {
      await navigateTo(page, path)
      await page.locator('#set-filters').click()
      await expectUrl(page, /filters\[tags\]\[0\]=a/)
      await page.reload()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('#state'))
        .toHaveText('{"tags":["a","b"],"range":[1,9]}')
    })
  })
}
