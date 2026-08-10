import { expectUrl } from '@kvant/e2e-shared/expect-url'
import { navigateTo } from '@kvant/e2e-shared/navigate'
import { test } from '@playwright/test'

test.describe('vue / options provider', () => {
  test('provided default history mode applies to composables', async ({ page }) => {
    await navigateTo(page, '/options-provider')
    await page.locator('#set-pass').click()
    await expectUrl(page, /[?&]test=pass/)

    // push mode: going back removes the param
    await page.goBack()
    await expectUrl(page, url => !url.searchParams.has('test'))
  })

  test('per-composable options override the provided defaults', async ({ page }) => {
    await navigateTo(page, '/options-provider')
    await page.locator('#set-override').click()
    await expectUrl(page, /[?&]override=yes/)

    // replace mode: no history entry added
    await page.locator('#set-pass').click()
    await expectUrl(page, url => url.searchParams.get('test') === 'pass')
    await page.goBack()
    await expectUrl(page, url => url.searchParams.get('override') === 'yes' && !url.searchParams.has('test'))
  })
})
