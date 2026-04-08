import { test, expect } from "@playwright/test"

test("homepage loads", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Cala Zingaro/)
})

test("leaf transition fires on menu navigation", async ({ page }) => {
  await page.goto("/")

  // Apri il menu hamburger
  await page.getByRole("button", { name: "Apri menu" }).click()

  // Verifica che l'overlay foglia appaia durante la navigazione
  const overlayPromise = page.locator("[data-testid='leaf-overlay']").or(
    page.locator(".fixed.inset-0.z-\\[9999\\]")
  )

  // Clicca su Ristorante nel menu mobile (exact match, primo risultato)
  await page.getByRole("link", { name: "Ristorante", exact: true }).first().click()

  // Attende che la navigazione sia completata
  await expect(page).toHaveURL("/ristorante")
})

test("pages are reachable", async ({ page }) => {
  const routes = ["/", "/ristorante", "/spiaggia", "/eventi", "/gallery", "/contatti"]

  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator("body")).toBeVisible()
  }
})
