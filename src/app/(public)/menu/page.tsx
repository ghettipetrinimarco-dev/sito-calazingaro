import { menu } from "@/data/menu"

// Revalidate ogni 60s — il bot aggiorna menu.ts su GitHub → Vercel re-deploya
export const revalidate = 60

export default function MenuPage() {
  return (
    <main>
      <h1>Menu</h1>
      {menu.map((categoria) => (
        <section key={categoria.id}>
          <h2>{categoria.nome}</h2>
          {categoria.items.length === 0 && <p>In aggiornamento…</p>}
        </section>
      ))}
    </main>
  )
}
