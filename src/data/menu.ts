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
    nome: "Antipasti",
    descrizione: null,
    items: [],
  },
  {
    id: "primi",
    nome: "Primi",
    descrizione: null,
    items: [],
  },
  {
    id: "secondi",
    nome: "Secondi",
    descrizione: null,
    items: [],
  },
  {
    id: "dolci",
    nome: "Dolci",
    descrizione: null,
    items: [],
  },
]
