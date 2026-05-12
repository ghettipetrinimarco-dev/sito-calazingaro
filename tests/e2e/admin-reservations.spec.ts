import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/prenotazioni")
  await page.evaluate(() => localStorage.removeItem("calazingaro:operator-agenda:v1"))
  await page.reload()
})

test("adds a reservation from quick input and shows it in the agenda", async ({ page }) => {
  await page.getByLabel("Nuova prenotazione").fill("franco domani tavolo 7 3 21")
  await page.getByRole("button", { name: "Inserisci in agenda" }).click()

  const reservation = page.locator("article").filter({ hasText: "franco" })
  await expect(reservation.getByText("21:00")).toBeVisible()
  await expect(reservation.getByText("3 coperti")).toBeVisible()
  await expect(reservation.getByText("Tavolo 7", { exact: true })).toBeVisible()
  await expect(page.getByText("Cena").first()).toBeVisible()
})

test("filters service and updates reservation status", async ({ page }) => {
  await page.getByRole("button", { name: "Cena" }).click()

  await expect(page.getByRole("heading", { name: "franco" })).toBeVisible()
  await expect(page.getByText("Rossi")).not.toBeVisible()

  const reservation = page.locator("article").filter({ hasText: "franco" })
  await reservation.getByRole("button", { name: "Arrivato" }).click()
  await expect(reservation.getByText("Arrivato")).toBeVisible()
})

test("keeps inserted operator reservations already booked", async ({ page }) => {
  await expect(page.getByText("Da confermare")).not.toBeVisible()
  await expect(page.getByRole("heading", { name: "Bianchi" })).toBeVisible()

  const reservation = page.locator("article").filter({ hasText: "Bianchi" })

  await expect(reservation.getByText("Prenotata")).toBeVisible()
  await expect(reservation.getByText("Tavolo da assegnare").first()).toBeVisible()
})

test("edits table and notes inline", async ({ page }) => {
  const reservation = page.locator("article").filter({ hasText: "Bianchi" })

  await reservation.getByRole("button", { name: "Modifica" }).click()
  await page.getByLabel("Tavolo").fill("12")
  await page.getByLabel("Note").fill("anniversario, veranda")
  await page.getByRole("button", { name: "Salva" }).click()

  await expect(reservation.getByText("Tavolo 12")).toBeVisible()
  await expect(reservation.getByText("anniversario, veranda")).toBeVisible()
})
