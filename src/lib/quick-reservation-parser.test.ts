import { describe, expect, it } from "vitest"
import { parseQuickReservation } from "./quick-reservation-parser"

const referenceDate = new Date("2026-05-11T10:00:00+02:00")

describe("parseQuickReservation", () => {
  it("converte domani sera in data italiana e fascia cena", () => {
    expect(parseQuickReservation("Rossi 4 domani sera fuori", referenceDate)).toEqual({
      input: "Rossi 4 domani sera fuori",
      nome: "Rossi",
      data: "2026-05-12",
      fascia: "cena",
      orario: null,
      coperti: 4,
      telefono: null,
      note: "fuori",
      missingFields: [],
      confidence: "alta",
    })
  })

  it("estrae un orario preciso senza confonderlo con i coperti", () => {
    expect(parseQuickReservation("Bianchi 2 sabato 20:30 anniversario", referenceDate)).toMatchObject({
      nome: "Bianchi",
      data: "2026-05-16",
      fascia: "cena",
      orario: "20:30",
      coperti: 2,
      note: "anniversario",
      missingFields: [],
    })
  })

  it("segnala i campi mancanti senza inventarli", () => {
    expect(parseQuickReservation("Verdi domani pranzo", referenceDate)).toMatchObject({
      nome: "Verdi",
      data: "2026-05-12",
      fascia: "pranzo",
      coperti: null,
      missingFields: ["coperti"],
      confidence: "media",
    })
  })

  it("riconosce oggi dalla timezone italiana", () => {
    expect(parseQuickReservation("Neri 3 oggi 13:00", referenceDate)).toMatchObject({
      nome: "Neri",
      data: "2026-05-11",
      fascia: "pranzo",
      orario: "13:00",
      coperti: 3,
    })
  })

  it("capisce i dati anche quando non sono in ordine naturale", () => {
    expect(parseQuickReservation("domani sera Rossi 4 fuori", referenceDate)).toMatchObject({
      nome: "Rossi",
      data: "2026-05-12",
      fascia: "cena",
      coperti: 4,
      note: "fuori",
      missingFields: [],
    })
  })

  it("mantiene le note quando nome, coperti e orario sono mescolati", () => {
    expect(parseQuickReservation("20:30 anniversario 2 Bianchi sabato", referenceDate)).toMatchObject({
      nome: "Bianchi",
      data: "2026-05-16",
      fascia: "cena",
      orario: "20:30",
      coperti: 2,
      note: "anniversario",
      missingFields: [],
    })
  })

  it("non confonde il numero del tavolo con i coperti e interpreta l'ora secca", () => {
    expect(parseQuickReservation("franco domani tavolo 7 3 21", referenceDate)).toMatchObject({
      nome: "franco",
      data: "2026-05-12",
      fascia: "cena",
      orario: "21:00",
      coperti: 3,
      note: "tavolo 7",
      missingFields: [],
    })
  })

  it("capisce nomi minuscoli anche quando la frase parte dalla data", () => {
    expect(parseQuickReservation("domani sera franco 4 fuori", referenceDate)).toMatchObject({
      nome: "franco",
      data: "2026-05-12",
      fascia: "cena",
      coperti: 4,
      note: "fuori",
      missingFields: [],
    })
  })

  it("capisce nomi minuscoli dopo i coperti quando la frase e' molto mescolata", () => {
    expect(parseQuickReservation("20:30 anniversario 2 bianchi sabato", referenceDate)).toMatchObject({
      nome: "bianchi",
      data: "2026-05-16",
      fascia: "cena",
      orario: "20:30",
      coperti: 2,
      note: "anniversario",
      missingFields: [],
    })
  })

  it("ignora parole di appoggio come alle, per e persone", () => {
    expect(parseQuickReservation("Rossi domani alle 21 per 4 persone", referenceDate)).toMatchObject({
      nome: "Rossi",
      data: "2026-05-12",
      fascia: "cena",
      orario: "21:00",
      coperti: 4,
      note: null,
      missingFields: [],
    })
  })

  it("estrae il telefono senza usarlo come coperti o orario", () => {
    expect(parseQuickReservation("Rossi 4 domani sera 333 1234567 fuori", referenceDate)).toMatchObject({
      nome: "Rossi",
      data: "2026-05-12",
      fascia: "cena",
      coperti: 4,
      telefono: "3331234567",
      note: "fuori",
      missingFields: [],
    })
  })

  it("non inventa il nome quando restano solo note operative", () => {
    expect(parseQuickReservation("domani sera 4 fuori vista mare", referenceDate)).toMatchObject({
      nome: null,
      data: "2026-05-12",
      fascia: "cena",
      coperti: 4,
      note: "fuori vista mare",
      missingFields: ["nome"],
      confidence: "media",
    })
  })
})
