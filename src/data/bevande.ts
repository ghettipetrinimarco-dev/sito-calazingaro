// Carta bevande — gestita manualmente o via bot Telegram in futuro
// NON hardcodare nelle pagine — importare sempre da qui

export interface Bevanda {
  id: string
  nome: string
  note: string | null
  prezzo: number
}

export interface BevandaCategory {
  id: string
  nome: string
  items: Bevanda[]
}

export const bevande: BevandaCategory[] = [
  {
    id: "amari",
    nome: "Amari",
    items: [
      { id: "am1", nome: "Grappa Bianca", note: null, prezzo: 5 },
      { id: "am2", nome: "Grappa Barrique", note: null, prezzo: 5 },
      { id: "am3", nome: "Cynar", note: null, prezzo: 5 },
      { id: "am4", nome: "Stravecchio", note: null, prezzo: 5 },
      { id: "am5", nome: "Liquerizia", note: null, prezzo: 5 },
      { id: "am6", nome: "Limoncello", note: null, prezzo: 5 },
      { id: "am7", nome: "Amaro Montenegro", note: null, prezzo: 6 },
      { id: "am8", nome: "Sambuca", note: null, prezzo: 6 },
      { id: "am9", nome: "Amaro del Capo", note: null, prezzo: 6 },
      { id: "am10", nome: "Jägermeister", note: null, prezzo: 6 },
      { id: "am11", nome: "Brancamenta", note: null, prezzo: 6 },
      { id: "am12", nome: "Fernet Branca", note: null, prezzo: 6 },
      { id: "am13", nome: "Averna", note: null, prezzo: 6 },
      { id: "am14", nome: "Venturo", note: null, prezzo: 6 },
      { id: "am15", nome: "Hierbas", note: null, prezzo: 6 },
      { id: "am16", nome: "Amaretto Disaronno", note: null, prezzo: 6 },
      { id: "am17", nome: "Braulio", note: null, prezzo: 6 },
      { id: "am18", nome: "Baileys", note: null, prezzo: 6 },
      { id: "am19", nome: "Jefferson", note: null, prezzo: 6 },
      { id: "am20", nome: "Chartreuse Verte", note: null, prezzo: 8 },
    ],
  },
  {
    id: "calice",
    nome: "Calice",
    items: [
      { id: "ca1", nome: "Passito", note: null, prezzo: 8 },
      { id: "ca2", nome: "Sherry Pedro Ximenez", note: null, prezzo: 10 },
    ],
  },
  {
    id: "vodka",
    nome: "Vodka",
    items: [
      { id: "vo1", nome: "Belvedere", note: null, prezzo: 8 },
      { id: "vo2", nome: "Grey Goose", note: null, prezzo: 10 },
      { id: "vo3", nome: "Beluga", note: null, prezzo: 10 },
    ],
  },
  {
    id: "tequila",
    nome: "Tequila",
    items: [
      { id: "te1", nome: "Herradura Reposada", note: null, prezzo: 8 },
      { id: "te2", nome: "Patron Silver", note: null, prezzo: 10 },
      { id: "te3", nome: "Patron Reposada", note: null, prezzo: 14 },
      { id: "te4", nome: "Patron al caffè", note: null, prezzo: 14 },
      { id: "te5", nome: "Don Julio", note: "1942", prezzo: 35 },
      { id: "te6", nome: "Clase Azul Reposado", note: null, prezzo: 35 },
    ],
  },
  {
    id: "rum",
    nome: "Rum",
    items: [
      { id: "ru1", nome: "Brugal Extra Viejo", note: null, prezzo: 8 },
      { id: "ru2", nome: "Diplomatico Mantuano", note: null, prezzo: 8 },
      { id: "ru3", nome: "Diplomatico Reserva Esclusiva", note: null, prezzo: 12 },
      { id: "ru4", nome: "Don Papa", note: null, prezzo: 12 },
      { id: "ru5", nome: "J. Bally", note: null, prezzo: 10 },
      { id: "ru6", nome: "Matusalem Gran Reserva", note: "15y", prezzo: 10 },
      { id: "ru7", nome: "Sailor Jerry", note: null, prezzo: 10 },
      { id: "ru8", nome: "Abuelo", note: "12y", prezzo: 10 },
      { id: "ru9", nome: "Zacapa", note: "23y", prezzo: 12 },
      { id: "ru10", nome: "Eminente", note: "3y", prezzo: 10 },
      { id: "ru11", nome: "Santa Teresa", note: null, prezzo: 8 },
    ],
  },
  {
    id: "whisky",
    nome: "Whisky",
    items: [
      { id: "wh1", nome: "Jack Daniel's", note: null, prezzo: 8 },
      { id: "wh2", nome: "Jameson", note: null, prezzo: 8 },
      { id: "wh3", nome: "Glenfiddich", note: "12y", prezzo: 8 },
      { id: "wh4", nome: "Whistlepig", note: "10y", prezzo: 10 },
      { id: "wh5", nome: "Laphroaig", note: "10y", prezzo: 12 },
      { id: "wh6", nome: "Caol-ila", note: "12y", prezzo: 14 },
      { id: "wh7", nome: "Nikka", note: null, prezzo: 12 },
    ],
  },
]
