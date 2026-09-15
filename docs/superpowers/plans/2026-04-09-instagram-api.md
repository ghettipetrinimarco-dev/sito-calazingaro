# Instagram Graph API — Piano di Implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire i post hardcoded di Instagram con fetch automatica dei post recenti tramite Instagram Graph API, con auto-rinnovo del token via Upstash Redis.

**Architecture:** Server Component `InstagramSection` chiama `lib/instagram.ts` che legge il token da Redis (con fallback a env var), fetcha i post recenti dalla Graph API, e rinnova silenziosamente il token se mancano < 10 giorni alla scadenza. ISR revalidate: 3600s.

**Tech Stack:** Instagram Graph API v21+, Upstash Redis (ioredis, già installato), Next.js 15 Server Components, ISR

---

## Pre-requisiti (azioni manuali di Marco — FARE PRIMA DEL CODICE)

Marco deve completare questi step sul portale Meta **prima** di eseguire il piano:

1. Vai su [developers.facebook.com](https://developers.facebook.com) → Crea una nuova App di tipo "Business"
2. Aggiungi il prodotto **"Instagram Graph API"** all'app
3. In "Instagram Graph API" → "Generazione Token" → Seleziona la Facebook Page di Cala Zingaro
4. Copia il token generato (short-lived, 1h) e scambialo con un token a lunga durata:
   ```
   GET https://graph.instagram.com/access_token
     ?grant_type=ig_exchange_token
     &client_id={APP_ID}
     &client_secret={APP_SECRET}
     &access_token={SHORT_TOKEN}
   ```
5. Copia il token a lunga durata (60 giorni) e salvalo in `.env.local`:
   ```
   INSTAGRAM_ACCESS_TOKEN=EAAxxxxx...
   ```
6. Verifica l'account Instagram sia di tipo **Business** o **Creator** collegato alla Facebook Page ✓ (già confermato)

> ⚠️ **Credenziali non disponibili ora** — il client deve aggiungere Marco come Sviluppatore sull'App Meta (o creare una nuova App). Il codice si scrive subito; il token si inserisce in `.env.local` quando disponibile.

---

## Struttura File

| File | Azione | Responsabilità |
|------|--------|----------------|
| `src/lib/instagram.ts` | CREA | Fetch post + auto-rinnovo token via Redis |
| `src/components/sections/InstagramSection.tsx` | MODIFICA | Usa `fetchRecentPosts()` invece di oEmbed hardcoded |
| `src/components/sections/InstagramGrid.tsx` | NESSUNA | Già ok, interfaccia `Post` invariata |
| `next.config.ts` | NESSUNA | Già ha `cdninstagram.com` e `fbcdn.net` |
| `.env.local` | MODIFICA | Aggiunge `INSTAGRAM_ACCESS_TOKEN` |

---

## Task 1: `src/lib/instagram.ts`

**Files:**
- Crea: `src/lib/instagram.ts`

- [ ] **Step 1: Scrivi il file**

```typescript
import { Redis } from "ioredis"

const REDIS_KEY_TOKEN = "instagram:access_token"
const REDIS_KEY_EXPIRY = "instagram:token_expiry" // timestamp UNIX (secondi)
const GRAPH_API_BASE = "https://graph.instagram.com"
// Numero di post da mostrare
const POSTS_LIMIT = 6

export interface InstagramPost {
  id: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  thumbnail_url?: string // solo per VIDEO
  permalink: string
  timestamp: string
}

function getRedis(): Redis {
  const url = process.env.REDIS_URL
  if (!url) throw new Error("REDIS_URL non configurata")
  return new Redis(url)
}

/**
 * Rinnova il token e aggiorna Redis.
 * Lancia eccezione se il rinnovo fallisce.
 */
async function refreshToken(redis: Redis, token: string): Promise<string> {
  const res = await fetch(
    `${GRAPH_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  )
  if (!res.ok) {
    throw new Error(`Rinnovo token fallito: ${res.status}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  const newToken = data.access_token
  const newExpiry = Math.floor(Date.now() / 1000) + data.expires_in
  await redis.set(REDIS_KEY_TOKEN, newToken)
  await redis.set(REDIS_KEY_EXPIRY, String(newExpiry))
  return newToken
}

/**
 * Restituisce il token attivo, rinnovandolo se mancano < 10 giorni alla scadenza.
 * Priorità: Redis → env var
 */
async function getActiveToken(redis: Redis): Promise<string> {
  const TEN_DAYS_IN_SECONDS = 10 * 24 * 60 * 60

  // Leggi token da Redis
  const [redisToken, redisExpiry] = await Promise.all([
    redis.get(REDIS_KEY_TOKEN),
    redis.get(REDIS_KEY_EXPIRY),
  ])

  const token = redisToken ?? process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN non configurato")

  const expiryTs = redisExpiry ? parseInt(redisExpiry) : null
  const nowTs = Math.floor(Date.now() / 1000)
  const needsRefresh = expiryTs === null || expiryTs - nowTs < TEN_DAYS_IN_SECONDS

  if (needsRefresh) {
    try {
      return await refreshToken(redis, token)
    } catch (err) {
      // Se il rinnovo fallisce, usa il token esistente senza interrompere
      console.error("[instagram] rinnovo token fallito, uso token esistente:", err)
      return token
    }
  }

  return token
}

/**
 * Fetcha i post recenti dell'account Instagram collegato.
 * Restituisce array vuoto in caso di errore — la sezione rimane visibile ma vuota.
 */
export async function fetchRecentPosts(): Promise<InstagramPost[]> {
  const redis = getRedis()
  try {
    const token = await getActiveToken(redis)

    const fields = "id,media_type,media_url,thumbnail_url,permalink,timestamp"
    const res = await fetch(
      `${GRAPH_API_BASE}/me/media?fields=${fields}&limit=${POSTS_LIMIT}&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error("[instagram] fetch fallita:", res.status, await res.text())
      return []
    }

    const data = (await res.json()) as { data: InstagramPost[] }
    return data.data ?? []
  } catch (err) {
    console.error("[instagram] errore:", err)
    return []
  } finally {
    redis.disconnect()
  }
}
```

- [ ] **Step 2: Verifica che ioredis sia installato**

```bash
grep "ioredis" package.json
```

Se non trovato: `pnpm add ioredis`

- [ ] **Step 3: Commit**

```bash
git add src/lib/instagram.ts
git commit -m "feat: lib instagram — fetch post recenti + auto-rinnovo token via Redis"
```

---

## Task 2: Modifica `InstagramSection.tsx`

**Files:**
- Modifica: `src/components/sections/InstagramSection.tsx`

- [ ] **Step 1: Sostituisci il contenuto**

```typescript
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import InstagramGrid from "@/components/sections/InstagramGrid"
import OrganicLink from "@/components/ui/OrganicLink"
import { fetchRecentPosts } from "@/lib/instagram"

export default async function InstagramSection() {
  const rawPosts = await fetchRecentPosts()

  // Converti al formato che InstagramGrid si aspetta
  // I VIDEO usano thumbnail_url come immagine di anteprima
  const posts = rawPosts
    .filter((p) => p.media_url || p.thumbnail_url)
    .map((p) => ({
      url: p.permalink,
      thumb: p.media_type === "VIDEO" ? (p.thumbnail_url ?? p.media_url) : p.media_url,
    }))

  return (
    <section
      className="px-6 md:px-10 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="max-w-6xl mx-auto">

        <RevealText>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <SectionLabel>Instagram</SectionLabel>
              <h2
                className="font-light uppercase tracking-wide leading-none"
                style={{
                  fontFamily: "var(--font-yanone)",
                  fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                  color: "var(--color-text)",
                }}
              >
                Seguici<br />su Instagram.
              </h2>
            </div>
            <OrganicLink
              href="https://www.instagram.com/calazingaro/"
              color="var(--color-text)"
              className="text-[0.7rem] tracking-[0.18em] uppercase transition-opacity hover:opacity-60"
              external
            >
              @calazingaro →
            </OrganicLink>
          </div>
        </RevealText>

        {posts.length > 0 ? (
          <InstagramGrid posts={posts} />
        ) : (
          // Fallback silenzioso se l'API non risponde — non mostrare errori all'utente
          <div className="h-40 flex items-center justify-center opacity-30 text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-quicksand)" }}>
            Segui @calazingaro su Instagram
          </div>
        )}

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build di verifica**

```bash
pnpm build
```

Atteso: build OK. Se errore su `INSTAGRAM_ACCESS_TOKEN` mancante → normale in CI, la funzione gestisce il fallback.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/InstagramSection.tsx
git commit -m "feat: instagram section — post reali da Graph API, fallback silenzioso"
```

---

## Task 3: Variabili d'ambiente

**Files:**
- Modifica: `.env.local` (non committare)

- [ ] **Step 1: Aggiungi a `.env.local`**

```env
# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=EAAxxxxx...   # token a lunga durata (60 giorni)
```

- [ ] **Step 2: Aggiungi su Vercel**

```bash
vercel env add INSTAGRAM_ACCESS_TOKEN production
```

- [ ] **Step 3: Verifica che `.env.local` sia in `.gitignore`**

```bash
grep ".env.local" .gitignore
```

Atteso: `.env.local` presente.

---

## Domande di allineamento (rispondere prima di eseguire)

1. **Tipo account Instagram:** Business o Creator? Se personale → va convertito prima su Instagram (Impostazioni → Account → Passa ad account professionale).
2. **Token management:** auto-rinnovo via Redis (come da piano) o rinnovo manuale ogni 50 giorni?
3. **Quanti post:** 9 (3×3) o altro numero?
