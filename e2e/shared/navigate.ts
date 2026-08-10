import type { Page } from '@playwright/test'

/** Navigate to a bench page and wait for hydration. */
export async function navigateTo(page: Page, path: string, search = '') {
  const url = `${path}${search}`
  const response = await page.goto(url)
  if (!response?.ok()) {
    throw new Error(
      `Failed to navigate to ${url}: ${response ? response.status() : 'no response'}`,
    )
  }
  await page.waitForLoadState('networkidle')
}
