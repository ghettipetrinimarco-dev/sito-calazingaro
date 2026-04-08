// Menu gestito dal bot Telegram — modificato via Octokit Git Tree API
// NON hardcodare nelle pagine — importare sempre da qui

export interface MenuItem {
  id: string
  nome: string
  descrizione: string
  prezzo: number | null // null = "su richiesta" / prezzo al mercato
  nota: string | null   // es. "3 pz." / "min 2 persone" / "€/pz"
  foto: string | null
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
      { id: "a1", nome: "Il crudo", descrizione: "", prezzo: 45, nota: null, foto: null, disponibile: true },
      { id: "a2", nome: "Tartare di tonno", descrizione: "guacamole, mayo al lime e perle di yuzu", prezzo: 20, nota: "3 pz.", foto: null, disponibile: true },
      { id: "a3", nome: "Tiradito di ricciola", descrizione: "", prezzo: 24, nota: null, foto: null, disponibile: true },
      { id: "a4", nome: "Cozze", descrizione: "guazzetto di cocco e zenzero", prezzo: 18, nota: null, foto: null, disponibile: true },
      { id: "a5", nome: "Crocchette di baccalà", descrizione: "senape al miele", prezzo: 18, nota: "4 pz.", foto: null, disponibile: true },
      { id: "a6", nome: "Bao", descrizione: "ventresca di ricciola", prezzo: 22, nota: "2 pz.", foto: null, disponibile: true },
      { id: "a7", nome: "Lobster hot-dog", descrizione: "chips homemade", prezzo: 26, nota: "2 pz.", foto: null, disponibile: true },
      { id: "a8", nome: "Pepite di salmone", descrizione: "crema di topinambur", prezzo: 22, nota: "4 pz.", foto: null, disponibile: true },
      { id: "a9", nome: "Il Fritto", descrizione: "", prezzo: 24, nota: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "caviale",
    nome: "CAVIALE",
    descrizione: null,
    items: [
      { id: "c1", nome: "Siberian", descrizione: "", prezzo: 35, nota: "10g", foto: null, disponibile: true },
      { id: "c2", nome: "Oscetra", descrizione: "", prezzo: 40, nota: "10g", foto: null, disponibile: true },
      { id: "c3", nome: "Beluga", descrizione: "", prezzo: 65, nota: "10g", foto: null, disponibile: true },
    ],
  },
  {
    id: "crudite",
    nome: "CRUDITÈ",
    descrizione: null,
    items: [
      { id: "cr1", nome: "Gambero rosso", descrizione: "", prezzo: 5, nota: "€/pz", foto: null, disponibile: true },
      { id: "cr2", nome: "Scampo", descrizione: "", prezzo: 6, nota: "€/pz", foto: null, disponibile: true },
      { id: "cr3", nome: "Ostrica", descrizione: "", prezzo: 6, nota: "€/pz", foto: null, disponibile: true },
      { id: "cr4", nome: "Ricci di mare", descrizione: "", prezzo: 8, nota: "€/pz", foto: null, disponibile: true },
    ],
  },
  {
    id: "primi",
    nome: "PRIMI",
    descrizione: null,
    items: [
      { id: "p1", nome: "Risotto", descrizione: "zucca, calamari spillo e bottarga", prezzo: 24, nota: "min 2 persone", foto: null, disponibile: true },
      { id: "p2", nome: "Spaghettone", descrizione: "cacio, pepe, cozze e pesto di basilico", prezzo: 18, nota: null, foto: null, disponibile: true },
      { id: "p3", nome: "Monfettino", descrizione: "risottato al ragù di seppia, crema ai ricci e lime", prezzo: 24, nota: null, foto: null, disponibile: true },
      { id: "p4", nome: "Passatello", descrizione: "astice e porcini", prezzo: 30, nota: null, foto: null, disponibile: true },
      { id: "p5", nome: "Spoja lorda", descrizione: "canocchie, zafferano e cime di rapa", prezzo: 24, nota: null, foto: null, disponibile: true },
      { id: "p6", nome: "Tagliatella al ragù", descrizione: "", prezzo: 14, nota: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "secondi",
    nome: "SECONDI",
    descrizione: null,
    items: [
      { id: "s1", nome: "Insalata di mare", descrizione: "patata mantecata", prezzo: 26, nota: null, foto: null, disponibile: true },
      { id: "s2", nome: "Branzino e Bambù", descrizione: "riso basmati, shiitake e curry verde", prezzo: 26, nota: null, foto: null, disponibile: true },
      { id: "s3", nome: "Catalana", descrizione: "aragostella, scampo, mazzancolla, canocchia", prezzo: 38, nota: null, foto: null, disponibile: true },
      { id: "s4", nome: "Moscardino", descrizione: "guazzetto, olive, patate e chips di polenta", prezzo: 26, nota: null, foto: null, disponibile: true },
      { id: "s5", nome: "Capesante", descrizione: "piastrate, caviale e latticello", prezzo: 30, nota: null, foto: null, disponibile: true },
      { id: "s6", nome: "Coniglio", descrizione: "rollé farcito con radicchio e bacon", prezzo: 26, nota: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "pesci",
    nome: "I PESCI",
    descrizione: "secondo disponibilità del pescato fresco",
    items: [
      { id: "pe1", nome: "Rombo", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
      { id: "pe2", nome: "Soaso", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
      { id: "pe3", nome: "Branzino", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
      { id: "pe4", nome: "Orata", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
      { id: "pe5", nome: "San Pietro", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
      { id: "pe6", nome: "Coda di Rospo", descrizione: "", prezzo: null, nota: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "contorni",
    nome: "CONTORNI",
    descrizione: null,
    items: [
      { id: "co1", nome: "Pinzimonio", descrizione: "", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "co2", nome: "Misticanza", descrizione: "", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "co3", nome: "Carciofo fondente", descrizione: "", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "co4", nome: "Patata al forno", descrizione: "sale dolce di Cervia e rosmarino", prezzo: 8, nota: null, foto: null, disponibile: true },
      { id: "co5", nome: "Giardiniera", descrizione: "", prezzo: 10, nota: null, foto: null, disponibile: true },
    ],
  },
  {
    id: "dolci",
    nome: "DOLCI",
    descrizione: null,
    items: [
      { id: "d1", nome: "Gelato di nostra produzione", descrizione: "", prezzo: 8, nota: null, foto: null, disponibile: true },
      { id: "d2", nome: "Panna cotta", descrizione: "pop-corn caramellato", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "d3", nome: "Mascarpone", descrizione: "tiramisù, coulis di fragole", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "d4", nome: "Sasso", descrizione: "cioccolato bianco e pistacchio con salsa Kahlùa", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "d5", nome: "Cannolo", descrizione: "lampone", prezzo: 10, nota: null, foto: null, disponibile: true },
      { id: "d6", nome: "Pesca romagnola", descrizione: "crema ai cachi e crema al cacao", prezzo: 10, nota: null, foto: null, disponibile: true },
    ],
  },
]
