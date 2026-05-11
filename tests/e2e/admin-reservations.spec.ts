import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/prenotazioni")
  await page.evaluate(() => localStorage.removeItem("calazingaro:admin-reservations:v1"))
  await page.reload()
})

test("adds a reservation from quick input and shows it in the agenda", async ({ page }) => {
  await page.getByLabel("Messaggio prenotazione").fill("franco domani tavolo 7 3 21")
  await page.getByRole("button", { name: "Aggiungi in agenda" }).click()

  const reservation = page.locator("article").filter({ hasText: "franco" })
  await expect(reservation.getByText("21:00")).toBeVisible()
  await expect(reservation.getByText("3 coperti")).toBeVisible()
  await expect(reservation.getByText("Tavolo 7", { exact: true })).toBeVisible()
  await expect(page.getByText("Prenotazioni cena")).toBeVisible()
})

test("filters service and updates reservation status", async ({ page }) => {
  await page.getByRole("button", { name: "Cena" }).click()

  await expect(page.getByRole("heading", { name: "franco" })).toBeVisible()
  await expect(page.getByText("Rossi")).not.toBeVisible()

  const reservation = page.locator("article").filter({ hasText: "franco" })
  await reservation.getByRole("button", { name: "Segna arrivato" }).click()
  await expect(reservation.getByText("Arrivato")).toBeVisible()
})

test("surfaces reservations that need attention and confirms them", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Azioni richieste" })).toBeVisible()

  const reservation = page.locator("article").filter({ hasText: "Bianchi" })

  await expect(reservation.getByText("Da confermare").first()).toBeVisible()
  await expect(reservation.getByText("Tavolo da assegnare").first()).toBeVisible()

  await reservation.getByRole("button", { name: "Conferma" }).click()

  await expect(reservation.getByText("Confermata")).toBeVisible()
  await expect(reservation.getByText("Da confermare")).not.toBeVisible()
  await expect(reservation.getByText("Tavolo da assegnare").first()).toBeVisible()
})

test("edits table and notes inline", async ({ page }) => {
  const reservation = page.locator("article").filter({ hasText: "Bianchi" })

  await reservation.getByRole("button", { name: "Modifica" }).click()
  await page.getByLabel("Tavolo").fill("12")
  await page.getByLabel("Note").fill("anniversario, veranda")
  await page.getByRole("button", { name: "Salva modifiche" }).click()

  await expect(reservation.getByText("Tavolo 12")).toBeVisible()
  await expect(reservation.getByText("anniversario, veranda")).toBeVisible()
})
