# CLAUDE.md — sito-calazingaro

> Regole operative per questo progetto. Leggi prima di toccare qualsiasi file.
> Prima di iniziare: leggi anche `~/.claude/PATTERNS_GLOBALI.md`.

---

## CONTESTO PROGETTO

**Cliente:** Cala Zingaro — Beach Club & Ristorante  
**Indirizzo:** Traversa XIX Pineta, 48015 – Milano Marittima (RA)  
**Telefono:** +39 379 1203796  
**WhatsApp:** +39 379 1203796  
**Email:** info@calazingaro.com  
**P.IVA:** IT00720310390 (Patti Srl)  
**Instagram:** https://www.instagram.com/calazingaro  
**Facebook:** https://www.facebook.com/calazingaro  

**Sito attuale:** calazingaro.it (WordPress + Elementor — sostituito completamente)  
**Obiettivo:** Sito mobile-first, veloce, SEO-ottimizzato con gestione menu via Telegram e sistema prenotazioni online.

---

## STACK

```
Next.js 15 — App Router ONLY (mai Pages Router)
TypeScript strict
Tailwind CSS v4
shadcn/ui (solo se strettamente necessario)
next/image — TUTTE le immagini passano da qui
next/font — font locali, zero Google Fonts a runtime
Framer Motion — SOLO se necessario, dynamic import obbligatorio, usa whileInView NON useScroll (v12 bug)
Lucide React — icone
Supabase — database prenotazioni
Upstash Redis — stato sessione bot Telegram
Resend — email transazionali
pnpm — gestore pacchetti
Vercel — deploy
GitHub — version control
```

---

## REGOLE ASSOLUTE

1. **Mai Pages Router** — App Router soltanto.
2. **Mai `npm install`** — usa sempre `pnpm add`.
3. **Mai HTML inline in page.tsx** — estrai sempre in componenti.
4. **Mai librerie pesanti se esiste vanilla** — prima valuta CSS/JS vanilla.
5. **`pnpm build` prima di dichiarare qualsiasi task completato.**
6. **Mai commit diretto su `main`** — branch `session/YYYY-MM-DD_HH-mm`.
7. **Tutte le immagini via `next/image`** — mai `<img>` tag raw.
8. **Mai hardcodare chiavi API** — tutto in `.env.local` (mai committare).
9. **I dati menu stanno in `src/data/menu.ts`** — non hardcodare nelle pagine.
10. **Notifiche sempre con `Promise.allSettled`** — mai `Promise.all` (vedi PATTERNS_GLOBALI.md).
11. **Supabase client sempre lazy** — funzione `supabaseAdmin()`, mai costante globale.
12. **Font nel CSS manuale: sempre variabili `next/font` dirette** — mai alias `@theme inline`. Vedi sezione FONT.
13. **VERSIONE NEXT.JS CRITICA:** Prima di scrivere qualsiasi codice relativo a data fetching, routing, caching o server components, **DEVI** leggere `node_modules/next/dist/docs/` e invocare la skill `vercel/nextjs`. Questa versione ha breaking changes rispetto al training data.

---

## MASTER ORCHESTRATION PROTOCOL

> Questa è la Costituzione operativa. Governa ogni task. Le sezioni precedenti forniscono il contesto tecnico; questa sezione governa il comportamento.

### MODALITÀ OPERATIVE (BINARIO)
- **FAST:** nel prompt → BINARIO 2: agisci direttamente, niente PLAN, task a basso rischio.
- Prompt normale → BINARIO 1: protocollo STRICT completo (vedi sotto).

---

### 1. ARCHITETTURA — Superpowers `writing-plans`
Ogni task BINARIO 1 inizia invocando la skill `superpowers:writing-plans`.
Il piano deve:
- Elencare i percorsi esatti dei file coinvolti.
- Citare esplicitamente quale sezione di questo CLAUDE.md o di MEMORY.md giustifica ogni scelta tecnica.
- Terminare con 2-3 domande di allineamento. Aspetta “OK procedi” prima di eseguire.

---

### 2. DESIGN AUTHORITY — Skill `design-taste-frontend`
Per ogni componente UI nuovo o modificato, **invocare la skill `design-taste-frontend` prima di scrivere codice**.
Parametri estetici definiti in `TASTE_RULES.md` (file di progetto, standard obbligatorio).
Standard estetico obbligatorio “High-End Taste”:
- Animazioni con fisica spring (Framer Motion), mai ease lineare.
- Micro-interazioni su hover, focus e tap.
- Tipografia dinamica: scale fluida, spaziatura consapevole.
- **VIETATO:** stili industrial, brutalist, minimal-standard generico.
- Non sostituire la skill con giudizio personale o convenzioni generiche.

---

### 3. NEXT.JS RIGOR — Skill `vercel/nextjs`
Prima di scrivere codice relativo a data fetching, routing, caching, searchParams o Server Components:
- Invocare la skill `vercel/nextjs`.
- Leggere `node_modules/next/dist/docs/` se il comportamento è incerto.
- `searchParams` è asincrono in Next.js 15 — validare sempre con `await`.

---

### 4. MEMORIA ATTIVA
- Dopo ogni EXECUTE: aggiornare `~/.claude/projects/.../memory/MEMORY.md` con la decisione tecnica presa (non il log delle azioni, ma il *perché*).
- **Compattazione:** se le voci sotto “Task Completati” superano 30 righe, consolida i task vecchi in “Contesto Storico” mantenendo estesi solo gli ultimi 3.
- Basarsi SOLO su codice, MEMORY.md e questo CLAUDE.md — non dedurre best practice da fonti esterne.

---

### 5. KILL-SWITCH & VERIFICA FINALE
- **Errori di build/lint/runtime:** massimo 2 tentativi di auto-fix. Al terzo, fermati, documenta l'errore e aspetta istruzioni.
- **Prima di dichiarare completato:** invocare la skill `superpowers:verification-before-completion`.
- Non dichiarare mai “✓ Fatto” senza aver eseguito `pnpm build` e verificato l'output.

---

**FLEXIBILITY**: Puoi proporre deviazioni architetturali, ma devi motivarle con dati reali estratti dal codice e chiedere conferma.

---

## STRUTTURA SITO

```
app/
├── api/
│   ├── telegram/route.ts              ← webhook bot menu (Bot 1)
│   ├── prenotazioni/route.ts          ← prenotazione pubblica spiaggia/ristorante
│   └── admin/
│       ├── prenotazioni/route.ts      ← prenotazione manuale (POST)
│       ├── prenotazioni/[id]/route.ts ← cambio stato, email ospite (PATCH)
│       ├── tavoli/route.ts            ← lista e creazione tavoli (GET/POST)
│       ├── tavoli/[id]/route.ts       ← modifica e cancellazione (PATCH/DELETE)
│       └── sala-layout/route.ts       ← layout sala drag-and-drop (GET/PUT)
├── admin/dashboard/
│   ├── page.tsx                       ← Server Component, fetch dati
│   ├── DashboardClient.tsx            ← stato UI, tabs, filtri
│   ├── ReservationList.tsx            ← lista con azioni
│   ├── SalaView.tsx                   ← vista sala con tavoli
│   ├── NuovaPrenotazioneModal.tsx     ← form prenotazione telefonica
│   └── LayoutEditorModal.tsx          ← editor drag-and-drop layout
├── (public)/
│   ├── page.tsx                       ← Homepage
│   ├── spiaggia/page.tsx              ← Beach Club + prezzi + prenota
│   ├── ristorante/page.tsx            ← Sapori
│   ├── menu/page.tsx                  ← Menu HTML (revalidate 60s da data/menu.ts)
│   ├── vini/page.tsx                  ← Carta Vini HTML
│   ├── eventi/page.tsx                ← Serate ed eventi
│   ├── gallery/page.tsx               ← Galleria fotografica
│   └── contatti/page.tsx              ← Mappa, orari, social, CTA
lib/
├── supabase.ts                        ← client lazy (service role)
└── admin-auth.ts                      ← token rotante + tolleranza ±24h
types/
└── database.ts                        ← Reservation, Tavolo, TimeSlot, ecc.
data/
└── menu.ts                            ← modificato dal bot Telegram via Octokit
supabase/
└── migration_crea_prenotazione_rpc.sql ← DA ESEGUIRE MANUALMENTE nel SQL editor
```

---

## DUE BOT TELEGRAM SEPARATI (NON CONSOLIDARE)

- **Bot 1** (`TELEGRAM_BOT_TOKEN`): gestisce il menu — webhook, Redis, comandi interattivi a step
- **Bot 2** (`TELEGRAM_PRENOTAZIONI_BOT_TOKEN`): notifiche prenotazioni — stateless, solo invio messaggi

**Funzioni diverse, logiche diverse. Non unirli.**

### Flusso bot menu
```
Proprietario → Telegram → POST /api/telegram
  → verifica chat_id
  → legge/scrive stato sessione su Upstash Redis (TTL 30 min)
  → dialogo a step (sezione → nome → descrizione → prezzo → foto)
  → commit atomico via Octokit Git Tree API (UN solo deploy Vercel)
  → Vercel re-deploy automatico → sito aggiornato
```

### Commit atomico (PATTERN CRITICO)
Usare sempre Octokit Git Tree API per committare più file in un colpo solo.
**Non committare menu.ts e immagine separatamente** → causano due deploy.
Riferimento implementazione: `sito-piccolo-hotel/app/api/telegram/route.ts`

### Sessione Redis
```typescript
// Key: `telegram:session:${chat_id}` — TTL: 1800s
type SessioneStep = "idle" | "aggiungi_sezione" | "aggiungi_nome" |
                    "aggiungi_descrizione" | "aggiungi_prezzo" |
                    "aggiungi_foto_conferma" | "aggiungi_foto_upload" | "aggiungi_conferma"
```

---

## SISTEMA PRENOTAZIONI

### Race condition — OBBLIGATORIO usare RPC con advisory lock
**Non fare SELECT count + INSERT separati** — su serverless sono non-atomici.
Usare `db.rpc("crea_prenotazione", {...})` con `pg_advisory_xact_lock`.
File SQL: `supabase/migration_crea_prenotazione_rpc.sql` (eseguire manualmente).

### Autoconferma
Se coperti_occupati + nuovi_coperti ≤ capacità_totale × soglia → stato `confirmed`.
Altrimenti → `pending`, notifica al gestore.

### Canali prenotazione
```typescript
type CanalePrenotazione = "online" | "telefono"
type StatoPrenotazione = "pending" | "confirmed" | "rejected" | "arrived" | "completed" | "cancelled"
```

---

## SHARP — CONFIGURAZIONE OBBLIGATORIA

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
}
```
Senza questo, Sharp non funziona in produzione su Vercel.

---

## FONT — REGOLA CRITICA (Tailwind v4 + next/font)

`@theme inline` in Tailwind v4 **non emette variabili CSS nel browser** — le usa solo internamente per generare utility classes. Quindi `var(--font-sans)` o `var(--font-serif)` nel CSS manuale non funzionano.

**Nel CSS manuale usa sempre le variabili `next/font` direttamente:**

```css
/* ✅ corretto */
body { font-family: var(--font-quicksand), system-ui, sans-serif; }
.title-display { font-family: var(--font-yanone), Georgia, sans-serif; }

/* ❌ sbagliato — var(--font-sans) non esiste nel browser con @theme inline */
body { font-family: var(--font-sans); }
```

Le utility Tailwind (`font-sans` come classe) funzionano perché Tailwind risolve il valore a compile time.
Il CSS manuale con `var()` punta a variabili che non esistono a runtime → fallback al font di sistema.

Font attivi: `--font-yanone` (Yanone Kaffeesatz, titoli) · `--font-quicksand` (Quicksand, corpo testo)

---

## GESTIONE CONTENUTI STAGIONALI

```typescript
// lib/season.ts
export const CURRENT_SEASON: 'estate' | 'inverno' = 'estate'
```

---

## TIMEZONE ITALIA

```typescript
function oggiMinimo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date())
  // Restituisce "YYYY-MM-DD" nell'orario italiano
}
```
**Non usare mai `new Date().toISOString()`** per date locali — è UTC.

---

## SEO

Ogni pagina: title, meta description (140-160 car.), canonical, Open Graph.  
Schema markup `Restaurant` in `/`: name, address, telephone, servesCuisine, priceRange, openingHours.

---

## VARIABILI D'AMBIENTE

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Bot 1 — menu
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=                    # stesso per entrambi i bot

# Bot 2 — notifiche prenotazioni
TELEGRAM_PRENOTAZIONI_BOT_TOKEN=

# GitHub (commit atomico bot menu)
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=

# Redis (Upstash) — stato sessione bot
REDIS_URL=                           # rediss://default:token@hostname.upstash.io:6379

# Email
RESEND_API_KEY=
# ATTENZIONE: in produzione verificare dominio su Resend, NON usare onboarding@resend.dev

# Auth admin
ADMIN_PASSWORD=
ADMIN_SECRET=
```

---

## DIPENDENZE DA INSTALLARE

```bash
pnpm add @octokit/rest @supabase/supabase-js @dnd-kit/core @dnd-kit/utilities ioredis resend sharp
```

---

## SYNC ASSET (FOTO / VIDEO)

### Watch automatico (consigliato)

Avvia una volta in un terminale separato:

```bash
pnpm watch-assets
```

Da quel momento, ogni volta che aggiungi file in `public/`, lo script li committa e pusha su GitHub **automaticamente** dopo 3 secondi. Gira in locale sul Mac, zero costi.

### Sync manuale (alternativa)

```bash
pnpm sync-assets
```

**Cartelle asset:**
- `public/Ambiente/` — foto location e spiaggia
- `public/Cucina/` — foto cibo e ristorante
- `public/videos/` — video (attenzione: file grandi, push può essere lento)
- `public/images/` — loghi, icone, elementi grafici

> ⚠️ I video pesanti (>50MB) potrebbero essere rifiutati da GitHub (limite 100MB per file).
> In quel caso usare un CDN esterno (Cloudflare R2, Vercel Blob, ecc.) e referenziare l'URL.

---

## GIT WORKFLOW

### Struttura branch
```
main    ← branch principale — merge dai branch personali con ok di Marco
marco   ← branch personale di Marco
ale     ← branch personale di Alessandro
```

### Flusso operativo
1. Ogni sviluppatore lavora sul proprio branch (`marco`, `ale`, ecc.)
2. Quando una feature è pronta e verificata → merge diretto su `main` con ok di Marco
3. Per aggiornarsi col lavoro dell'altro → `git pull origin main`, poi `git merge main` sul proprio branch
4. **Mai committare direttamente su `main`**

### Convenzioni commit
```bash
git add <file> && git commit -m "feat: descrizione in italiano"
```

Prefissi: `feat:` `fix:` `refactor:` `style:` `chore:` `docs:`

---

## NOTE FINALI

- Copyright footer: `© 2026 Cala Zingaro`
- Nessun PDF — menu e vini sempre in HTML
- Instagram in evidenza in header e footer
- Admin token: `verificaAdminToken` accetta oggi e ieri (tolleranza mezzanotte UTC)
- `tavolo_id` nel DB, non `table_id` — verificare sempre i tipi in `types/database.ts`
