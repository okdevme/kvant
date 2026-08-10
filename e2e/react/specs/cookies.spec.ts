import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

const origin = 'http://localhost:3101'

test.describe('react / cookies', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('reads the value from cookies on mount', async ({ page }) => {
    await page.context().addCookies([{ name: 'test', value: 'init', url: origin }])
    await navigateTo(page, '/cookies')
    await expect(page.locator('#state')).toHaveText('init')
  })

  test('writes the value to cookies', async ({ page }) => {
    await navigateTo(page, '/cookies')
    await page.locator('#set-pass').click()
    await expect(page.locator('#state')).toHaveText('pass')
    const cookies = await page.context().cookies()
    expect(cookies.find(c => c.name === 'test')?.value).toBe('pass')
  })

  test('clears the cookie when set to undefined', async ({ page }) => {
    await page.context().addCookies([{ name: 'test', value: 'init', url: origin }])
    await navigateTo(page, '/cookies')
    await page.locator('#clear').click()
    await expect(page.locator('#state')).toBeEmpty()
    const cookies = await page.context().cookies()
    expect(cookies.find(c => c.name === 'test')).toBeUndefined()
  })

  test('parses numbers through the schema', async ({ page }) => {
    await page.context().addCookies([{ name: 'count', value: '41', url: origin }])
    await navigateTo(page, '/cookies')
    await expect(page.locator('#count')).toHaveText('41')
    await page.locator('#increment').click()
    await expect(page.locator('#count')).toHaveText('42')
    const cookies = await page.context().cookies()
    expect(cookies.find(c => c.name === 'count')?.value).toBe('42')
  })
})
