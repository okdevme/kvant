import { expectUrl } from '@kvant/e2e-shared/expect-url'
import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

test.describe('nuxt / params', () => {
  test('reads route params on mount', async ({ page }) => {
    await navigateTo(page, '/params/xyz/1')
    await expect(page.locator('#id')).toHaveText('xyz')
    await expect(page.locator('#tab')).toHaveText('1')
  })

  test('writes params to the URL path', async ({ page }) => {
    await navigateTo(page, '/params/xyz')
    await page.locator('#set-tab').click()
    await expect(page).toHaveURL(/\/params\/xyz\/2/)
    await expect(page.locator('#tab')).toHaveText('2')
  })
})

test.describe('nuxt / params (nested routes)', () => {
  test('reads params and query on mount at a deep path', async ({ page }) => {
    await navigateTo(page, '/deep/acme/widgets/issues?q=open')
    await expect(page.locator('#org')).toHaveText('acme')
    await expect(page.locator('#repo')).toHaveText('widgets')
    await expect(page.locator('#tab')).toHaveText('issues')
    await expect(page.locator('#q')).toHaveText('open')
  })

  test('writing a param preserves the query string', async ({ page }) => {
    await navigateTo(page, '/deep/acme/widgets?q=open')
    await page.locator('#set-tab').click()
    await expectUrl(page, url =>
      url.pathname === '/deep/acme/widgets/issues'
      && url.searchParams.get('q') === 'open')
    await expect(page.locator('#tab')).toHaveText('issues')
    await expect(page.locator('#q')).toHaveText('open')
  })

  test('writing a query param preserves the path params', async ({ page }) => {
    await navigateTo(page, '/deep/acme/widgets/issues')
    await page.locator('#set-q').click()
    await expectUrl(page, url =>
      url.pathname === '/deep/acme/widgets/issues'
      && url.searchParams.get('q') === 'filter')
    await expect(page.locator('#q')).toHaveText('filter')
    await expect(page.locator('#org')).toHaveText('acme')
    await expect(page.locator('#tab')).toHaveText('issues')
  })

  test('writing a mid-path param keeps the rest of the path', async ({ page }) => {
    await navigateTo(page, '/deep/acme/widgets/issues')
    await page.locator('#set-repo').click()
    await expectUrl(page, url => url.pathname === '/deep/acme/next/issues')
    await expect(page.locator('#repo')).toHaveText('next')
    await expect(page.locator('#org')).toHaveText('acme')
    await expect(page.locator('#tab')).toHaveText('issues')
  })
})
