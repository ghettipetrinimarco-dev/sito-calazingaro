import { test, expect } from "@playwright/test"

test("debug: screenshot transition frames", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  await page.screenshot({ path: "test-results/frame-00-home.png" })

  // Apri menu
  await page.getByRole("button", { name: "Apri menu" }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: "test-results/frame-01-menu-open.png" })

  // Clicca link
  await page.getByRole("link", { name: "Ristorante", exact: true }).first().click()
  await page.waitForTimeout(100)
  await page.screenshot({ path: "test-results/frame-02-100ms.png" })
  await page.waitForTimeout(200)
  await page.screenshot({ path: "test-results/frame-03-300ms.png" })
  await page.waitForTimeout(300)
  await page.screenshot({ path: "test-results/frame-04-600ms.png" })
  await page.waitForTimeout(500)
  await page.screenshot({ path: "test-results/frame-05-1100ms.png" })

  // Verifica stato DOM dell'overlay
  const overlay = page.locator(".fixed.inset-0.z-\\[9999\\]")
  const overlayCount = await overlay.count()
  console.log("Overlay elements found:", overlayCount)

  // Verifica stato del context
  const bodyHtml = await page.locator("body").innerHTML()
  const hasOverlay = bodyHtml.includes("z-[9999]") || bodyHtml.includes("z-9999") || bodyHtml.includes("9999")
  console.log("Body contains overlay markup:", hasOverlay)
  console.log("Current URL:", page.url())
})
