# AGENTS.md - sito-calazingaro

> File entry-point per Codex CLI. Per regole estese leggere `CLAUDE.md` (stesso progetto).
> Lavoro in parallelo Claude Code + Codex (vedi DUAL-AI ROUTING in fondo).

## Cliente
Cala Zingaro - Beach Club & Ristorante (Milano Marittima, RA)
Sito attuale: calazingaro.it (WordPress + Elementor, sostituito completamente)

## Stack
Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui (solo se necessario), Framer Motion, Lucide React, next/image, next/font, Supabase, Upstash Redis, Resend, pnpm, Vercel.

## Regole assolute
1. Mai Pages Router -- App Router soltanto
2. Mai `npm install` -- sempre `pnpm add`
3. Mai HTML inline in `page.tsx` -- estrai in componenti
4. Mai librerie pesanti se esiste vanilla
5. `pnpm build` prima di dichiarare task completato
6. Mai commit diretto su `main` -- branch `session/YYYY-MM-DD_HH-mm`
7. Tutte le immagini via `next/image`
8. Mai hardcodare chiavi API -- tutto in `.env.local`
9. I dati menu in `src/data/menu.ts` -- non hardcodare
10. Notifiche con `Promise.allSettled` (mai `Promise.all`)
11. Supabase client lazy -- funzione `supabaseAdmin()`
12. Font nel CSS manuale: variabili `next/font` dirette (no alias `@theme inline`)
13. Per data fetching/routing/caching/server components: leggere `node_modules/next/dist/docs/` (Next.js 15 ha breaking changes rispetto al training data)

## Loop di qualita
1. Analizza prima di scrivere
2. Scrivi solo se ragionevolmente sicuro
3. Avvia server se necessario, controlla console e terminale
4. Se non funziona: fermati, cambia ipotesi, NON ripetere
5. Conferma solo dopo verifica con `pnpm build`

## Lingua
Italiano per risposte e commenti. Inglese per nomi var/func/file.

## Due bot Telegram separati (non consolidare)
- Bot 1 (`TELEGRAM_BOT_TOKEN`): gestione menu, webhook, Redis, comandi a step
- Bot 2 (`TELEGRAM_PRENOTAZIONI_BOT_TOKEN`): notifiche prenotazioni, stateless

## Pattern critici
- Race condition prenotazioni: usare RPC con `pg_advisory_xact_lock`, mai SELECT count + INSERT
- Commit atomico bot menu: Octokit Git Tree API, mai due commit separati
- Sharp in `next.config.ts`: `serverComponentsExternalPackages: ["sharp"]`
- Timezone Italia: usare `Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" })`, mai `toISOString()`

---

## DUAL-AI ROUTING (PREFERENZE SOFT)

> Suggerimenti, non vincoli. Entrambi gli AI possono fare qualsiasi task.

### Preferenza Claude Code
- Planning architetturale, refactoring multi-file
- Logica business (prenotazioni, bot Telegram, DB)
- Task con memoria persistente (GSD, plan, MEMORY.md)

### Preferenza Codex
- Componente UI isolato o sezione visiva nuova
- Image-to-code (mockup + implementazione)
- Second opinion / review pre-merge
- Sblocco rapido dopo stallo dell'altro AI

### Quando ricevi un task fuori preferenza
1. NON rifiutare. Esegui normalmente.
2. UNA riga di suggerimento opzionale: "se vuoi, Claude Code qui sarebbe piu' [veloce/preciso] perche' [ragione]"
3. Procedi al task.

### Workflow tipico
- Task piccolo: l'AI aperto per primo lo fa
- Task grande: chi pianifica suggerisce divisione lavoro
- Bug stuck dopo 2 tentativi: passare all'altro AI
- Pre-merge su main: review dell'altro AI consigliata, non obbligatoria

---

Per dettagli completi (architettura sistema prenotazioni, struttura cartelle, font Tailwind v4, env vars, sync asset, SEO, documenti strategici): vedi `CLAUDE.md`.

<!-- COMPANY_BRAIN_POINTER_START -->
## Company Brain

Questo progetto fa parte del Company Brain Obsidian in `/Users/marco/Desktop/all/dev`.

Prima di lavorare qui:
1. Leggi `/Users/marco/Desktop/all/dev/llms.txt`.
2. Leggi `/Users/marco/Desktop/all/dev/08_Data/project-context-map.json`.
3. Leggi `/Users/marco/Desktop/all/dev/03_Projects/calazingaro-website.md`.
4. Usa `/Users/marco/Desktop/all/dev/06_Docs/AI Context Retrieval.md` e `/Users/marco/Desktop/all/dev/06_Docs/AI Skill Routing.md` per scegliere contesto e skill senza scandire tutto il workspace.

Non leggere cartelle intere se la mappa compatta indica gia' i file chiave.
<!-- COMPANY_BRAIN_POINTER_END -->
