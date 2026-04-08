import { test } from "@playwright/test"

test("screenshot all sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.waitForTimeout(1500)

  const scrollPositions = [0, 900, 1800, 2700, 3600, 4500, 5400]
  for (const y of scrollPositions) {
    await page.evaluate((s) => window.scrollTo(0, s), y)
    await page.waitForTimeout(500)
    await page.screenshot({ path: `test-results/section-y${y}.png` })
  }
})
