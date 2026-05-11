import { expect, test } from "@playwright/test"

test("quick parse playground renders a complete draft", async ({ page }) => {
  const consoleErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })

  await page.goto("/admin/quick-parse")
  await page.getByLabel("Messaggio ricevuto").fill("franco domani tavolo 7 3 21")
  await page.getByRole("button", { name: "Prepara bozza" }).click()

  const draft = page.locator("section").filter({ hasText: "Anteprima" })
  await expect(draft.getByText("franco")).toBeVisible()
  await expect(draft.getByText("12/05/2026")).toBeVisible()
  await expect(draft.getByText("Cena")).toBeVisible()
  await expect(draft.getByText("21:00")).toBeVisible()
  await expect(draft.getByText("tavolo 7", { exact: true })).toBeVisible()
  await expect(draft.getByText("Bozza completa. Prossimo step: trasformarla in salvataggio reale.")).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test("quick parse playground shows missing fields without inventing data", async ({ page }) => {
  await page.goto("/admin/quick-parse")
  await page.getByLabel("Messaggio ricevuto").fill("domani sera 4 fuori vista mare")
  await page.getByRole("button", { name: "Prepara bozza" }).click()

  const draft = page.locator("section").filter({ hasText: "Anteprima" })
  await expect(draft.getByText("Da inserire")).toBeVisible()
  await expect(draft.getByText("12/05/2026")).toBeVisible()
  await expect(draft.getByText("Cena")).toBeVisible()
  await expect(draft.getByText("fuori vista mare", { exact: true })).toBeVisible()
  await expect(draft.getByText("Mancano: nome")).toBeVisible()
})
