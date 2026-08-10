import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

test.describe('vue / localStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear())
  })

  test('reads the value from localStorage on mount', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('test', 'init'))
    await navigateTo(page, '/local-storage')
    await expect(page.locator('#state')).toHaveText('init')
  })

  test('writes the value to localStorage', async ({ page }) => {
    await navigateTo(page, '/local-storage')
    await page.locator('#set-pass').click()
    await expect(page.locator('#state')).toHaveText('pass')
    const stored = await page.evaluate(() => window.localStorage.getItem('test'))
    expect(stored).toBe('pass')
  })

  test('removes the key when set to undefined', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('test', 'init'))
    await navigateTo(page, '/local-storage')
    await page.locator('#clear').click()
    await expect(page.locator('#state')).toBeEmpty()
    const stored = await page.evaluate(() => window.localStorage.getItem('test'))
    expect(stored).toBeNull()
  })

  test('parses numbers through the schema', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('count', '41'))
    await navigateTo(page, '/local-storage')
    await expect(page.locator('#count')).toHaveText('41')
    await page.locator('#increment').click()
    await expect(page.locator('#count')).toHaveText('42')
    expect(await page.evaluate(() => window.localStorage.getItem('count'))).toBe('42')
  })

  test('syncs across tabs via the storage event', async ({ page, context }) => {
    await navigateTo(page, '/local-storage')
    const other = await context.newPage()
    await navigateTo(other, '/local-storage')

    await page.locator('#set-pass').click()
    await expect(other.locator('#state')).toHaveText('pass')
  })
})
