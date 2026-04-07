// Menu gestito dal bot Telegram — modificato via Octokit Git Tree API
// NON hardcodare nelle pagine — importare sempre da qui

export interface MenuItem {
  id: string
  nome: string
  descrizione: string
  prezzo: number | null // null = "su richiesta"
  foto: string | null // path relativo in /public/images/menu/
  disponibile: boolean
}

export interface MenuCategory {
  id: string
  nome: string
  descrizione: string | null
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: "antipasti",
    nome: "ANTIPASTI",
    descrizione: null,
    items: [
      { id: "a1", nome: "Il crudo", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "a2", nome: "Tartare di tonno", descrizione: "guacamole, mayo al lime e perle di yuzu", prezzo: null, foto: null, disponibile: true },
      { id: "a3", nome: "Tiradito di ricciola", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "a4", nome: "Cozze", descrizione: "guazzetto di cocco e zenzero", prezzo: null, foto: null, disponibile: true },
      { id: "a5", nome: "Crocchette di baccalà", descrizione: "senape al miele", prezzo: null, foto: null, disponibile: true },
      { id: "a6", nome: "Bao", descrizione: "ventresca di ricciola", prezzo: null, foto: null, disponibile: true },
      { id: "a7", nome: "Lobster hot-dog", descrizione: "chips homemade", prezzo: null, foto: null, disponibile: true },
      { id: "a8", nome: "Pepite di salmone", descrizione: "crema di topinambur", prezzo: null, foto: null, disponibile: true },
      { id: "a9", nome: "Il Fritto", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "caviale",
    nome: "CAVIALE",
    descrizione: null,
    items: [
      { id: "c1", nome: "Siberian", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "c2", nome: "Oscetra", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "c3", nome: "Beluga", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "crudite",
    nome: "CRUDITÈ",
    descrizione: null,
    items: [
      { id: "cr1", nome: "Gambero rosso", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "cr2", nome: "Scampo", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "cr3", nome: "Ostrica", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "cr4", nome: "Ricci di mare", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "primi",
    nome: "PRIMI",
    descrizione: null,
    items: [
      { id: "p1", nome: "Risotto", descrizione: "zucca, calamari spillo e bottarga", prezzo: null, foto: null, disponibile: true },
      { id: "p2", nome: "Spaghettone", descrizione: "cacio, pepe, cozze e pesto di basilico", prezzo: null, foto: null, disponibile: true },
      { id: "p3", nome: "Monfettino", descrizione: "risottato al ragù di seppia, crema ai ricci e lime", prezzo: null, foto: null, disponibile: true },
      { id: "p4", nome: "Passatello", descrizione: "astice e porcini", prezzo: null, foto: null, disponibile: true },
      { id: "p5", nome: "Spoja lorda", descrizione: "canocchie, zafferano e cime di rapa", prezzo: null, foto: null, disponibile: true },
      { id: "p6", nome: "Tagliatella al ragù", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "secondi",
    nome: "SECONDI",
    descrizione: null,
    items: [
      { id: "s1", nome: "Insalata di mare", descrizione: "patata mantecata", prezzo: null, foto: null, disponibile: true },
      { id: "s2", nome: "Branzino e Bambù", descrizione: "riso basmati, shiitake e curry verde", prezzo: null, foto: null, disponibile: true },
      { id: "s3", nome: "Catalana", descrizione: "aragostella, scampo, mazzancolla, canocchia", prezzo: null, foto: null, disponibile: true },
      { id: "s4", nome: "Moscardino", descrizione: "guazzetto, olive, patate e chips di polenta", prezzo: null, foto: null, disponibile: true },
      { id: "s5", nome: "Capesante", descrizione: "piastrate, caviale e latticello", prezzo: null, foto: null, disponibile: true },
      { id: "s6", nome: "Coniglio", descrizione: "rollé farcito con radicchio e bacon", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "pesci",
    nome: "I PESCI",
    descrizione: "secondo disponibilità del pescato fresco",
    items: [
      { id: "pe1", nome: "Rombo", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "pe2", nome: "Soaso", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "pe3", nome: "Branzino", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "pe4", nome: "Orata", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "pe5", nome: "San Pietro", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "pe6", nome: "Coda di rospo", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "contorni",
    nome: "CONTORNI",
    descrizione: null,
    items: [
      { id: "co1", nome: "Pinzimonio", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "co2", nome: "Misticanza", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "co3", nome: "Carciofo fondente", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "co4", nome: "Patata al forno", descrizione: "sale dolce di Cervia e rosmarino", prezzo: null, foto: null, disponibile: true },
      { id: "co5", nome: "Giardiniera", descrizione: "", prezzo: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "dolci",
    nome: "DOLCI",
    descrizione: null,
    items: [
      { id: "d1", nome: "Gelato di nostra produzione", descrizione: "", prezzo: null, foto: null, disponibile: true },
      { id: "d2", nome: "Panna cotta", descrizione: "pop-corn caramellato", prezzo: null, foto: null, disponibile: true },
      { id: "d3", nome: "Mascarpone", descrizione: "tiramisù, coulis di fragole", prezzo: null, foto: null, disponibile: true },
      { id: "d4", nome: "Sasso", descrizione: "cioccolato bianco e pistacchio con salsa Kahlùa", prezzo: null, foto: null, disponibile: true },
      { id: "d5", nome: "Cannolo", descrizione: "lampone", prezzo: null, foto: null, disponibile: true },
      { id: "d6", nome: "Pesca romagnola", descrizione: "crema ai cachi e crema al cacao", prezzo: null, foto: null, disponibile: true },
    ],
  },
]
