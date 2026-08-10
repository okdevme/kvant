import { expectUrl } from '@kvant/e2e-shared/expect-url'
import { navigateTo } from '@kvant/e2e-shared/navigate'
import { expect, test } from '@playwright/test'

test.describe('react / options provider', () => {
  test('provider default history mode applies to subtree hooks', async ({ page }) => {
    await navigateTo(page, '/options-provider')
    await page.locator('#set-pass').click()
    await expectUrl(page, /[?&]test=pass/)

    // push mode: going back removes the param
    await page.goBack()
    await expectUrl(page, url => !url.searchParams.has('test'))
    await expect(page.locator('#state')).toBeEmpty()
  })

  test('per-hook options override the provider', async ({ page }) => {
    await navigateTo(page, '/options-provider')
    await page.locator('#set-override').click()
    await expectUrl(page, /[?&]override=yes/)

    // replace mode: no history entry added, back stays on the same page param-less
    await page.locator('#set-pass').click()
    await expectUrl(page, url => url.searchParams.get('test') === 'pass')
    await page.goBack()
    // the push from #set-pass is popped; override was replace so it survives in history
    await expectUrl(page, url => url.searchParams.get('override') === 'yes' && !url.searchParams.has('test'))
  })
})
