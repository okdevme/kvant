import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

test.describe('react / search params', () => {
  test('reads the value from the URL on mount', async ({ page }) => {
    await navigateTo(page, '/search-params', '?test=init')
    await expect(page.locator('#state')).toHaveText('init')
  })

  test('writes the value to the URL', async ({ page }) => {
    await navigateTo(page, '/search-params')
    await page.locator('#set-pass').click()
    await expect(page.locator('#state')).toHaveText('pass')
    await expect(page).toHaveURL(/[?&]test=pass/)
  })

  test('removes the value from the URL', async ({ page }) => {
    await navigateTo(page, '/search-params', '?test=init')
    await page.locator('#clear').click()
    await expect(page.locator('#state')).toBeEmpty()
    await expect(page).not.toHaveURL(/test=/)
  })

  test('parses numbers through the schema', async ({ page }) => {
    await navigateTo(page, '/search-params', '?count=41')
    await expect(page.locator('#count')).toHaveText('41')
    await page.locator('#increment').click()
    await expect(page.locator('#count')).toHaveText('42')
    await expect(page).toHaveURL(/[?&]count=42/)
  })

  test('updates multiple keys at once', async ({ page }) => {
    await navigateTo(page, '/search-params')
    await page.locator('#set-multi').click()
    await expect(page.locator('#multi')).toHaveText('{"a":"x","b":2}')
    await expect(page).toHaveURL(/[?&]a=x/)
    await expect(page).toHaveURL(/[?&]b=2/)
  })

  test('replace history mode by default', async ({ page }) => {
    await navigateTo(page, '/')
    await navigateTo(page, '/search-params')
    await page.locator('#set-pass').click()
    await expect(page).toHaveURL(/[?&]test=pass/)
    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
  })
})

test.describe('react / search params push', () => {
  test('push history mode adds a history entry', async ({ page }) => {
    await navigateTo(page, '/')
    await navigateTo(page, '/search-params-push')
    await page.locator('#set-pass').click()
    await expect(page).toHaveURL(/[?&]test=pass/)
    await page.goBack()
    await expect(page).not.toHaveURL(/test=/)
    await expect(page.locator('#state')).toBeEmpty()
  })
})
