import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

test.describe('vue-router / params', () => {
  test('reads route params on mount', async ({ page }) => {
    await navigateTo(page, '/params/xyz/1')
    await expect(page.locator('#id')).toHaveText('xyz')
    await expect(page.locator('#tab')).toHaveText('1')
  })

  test('writes params to the URL path', async ({ page }) => {
    await navigateTo(page, '/params')
    await page.locator('#set-id').click()
    await expect(page).toHaveURL(/\/params\/abc/)
    await expect(page.locator('#id')).toHaveText('abc')
  })

  test('parses numeric params through the schema', async ({ page }) => {
    await navigateTo(page, '/params/xyz')
    await page.locator('#set-tab').click()
    await expect(page).toHaveURL(/\/params\/xyz\/2/)
    await expect(page.locator('#tab')).toHaveText('2')
  })
})
