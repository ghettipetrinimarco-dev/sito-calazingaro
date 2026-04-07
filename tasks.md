# tasks.md — sito-calazingaro

---

## 🔴 DA FARE (priorità alta)

### SETUP PROGETTO
- [ ] `pnpm create next-app@latest sito-calazingaro` (in cartella vuota)
- [ ] Configurare TypeScript strict
- [ ] Installare Tailwind v4
- [ ] Installare dipendenze: `pnpm add @octokit/rest @supabase/supabase-js @dnd-kit/core @dnd-kit/utilities ioredis resend sharp`
- [ ] Configurare sharp in `next.config.ts` (serverComponentsExternalPackages)
- [ ] Creare struttura cartelle (`/app`, `/components`, `/lib`, `/data`, `/types`, `/public/images`)
- [ ] Creare `CLAUDE.md` nella root
- [ ] Creare repo GitHub + primo commit
- [ ] Deploy Vercel

### SERVIZI ESTERNI DA CONFIGURARE
- [ ] Supabase — creare progetto, ottenere URL e service role key
- [ ] Supabase — eseguire `migration_crea_prenotazione_rpc.sql` nel SQL editor (copiare da sito-piccolo-hotel)
- [ ] Upstash Redis — creare database, ottenere REDIS_URL
- [ ] Resend — creare account, verificare dominio calazingaro.com
- [ ] Telegram Bot 1 (menu) — creare su @BotFather, ottenere token
- [ ] Telegram Bot 2 (notifiche prenotazioni) — creare su @BotFather, ottenere token
- [ ] GitHub Token — creare personal access token con permesso `repo`

### BOT TELEGRAM — GESTIONE MENU
- [ ] Creare `app/api/telegram/route.ts` (copiare e adattare da sito-piccolo-hotel)
- [ ] Creare `lib/redis.ts` (lazy init ioredis, stessa struttura sito-piccolo-hotel)
- [ ] Creare `data/menu.ts` con struttura iniziale MenuCategory[]
- [ ] Registrare webhook Telegram: `POST https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://sito-calazingaro.vercel.app/api/telegram`
- [ ] Test: proprietario manda messaggio → menu.ts si aggiorna su GitHub → Vercel re-deploya

### SISTEMA PRENOTAZIONI
- [ ] Creare schema DB Supabase: `reservations`, `tavoli`, `time_slots`, `sala_layouts`, `settings`
- [ ] Eseguire RPC `crea_prenotazione` con advisory lock (da migration_crea_prenotazione_rpc.sql)
- [ ] Creare `app/api/prenotazioni/route.ts` (POST pubblico)
- [ ] Creare `app/api/admin/prenotazioni/route.ts` + `[id]/route.ts`
- [ ] Creare `app/api/admin/tavoli/route.ts` + `[id]/route.ts`
- [ ] Creare `app/api/admin/sala-layout/route.ts`
- [ ] Creare `lib/supabase.ts` (funzione lazy, NON costante globale)
- [ ] Creare `lib/admin-auth.ts` (token rotante + tolleranza ±24h mezzanotte)
- [ ] Creare `types/database.ts` (Reservation, Tavolo, TimeSlot, StatoPrenotazione, ecc.)

### DASHBOARD ADMIN
- [ ] Creare `app/admin/dashboard/page.tsx` (Server Component)
- [ ] Creare `DashboardClient.tsx` (tabs, filtri data)
- [ ] Creare `ReservationList.tsx` (lista con azioni stato)
- [ ] Creare `SalaView.tsx` (vista tavoli con assegnazione)
- [ ] Creare `NuovaPrenotazioneModal.tsx` (form prenotazione telefonica)
- [ ] Creare `LayoutEditorModal.tsx` (drag-and-drop con @dnd-kit)

### PAGINE PUBBLICHE
- [ ] `/` — Homepage (Hero stagionale estate/inverno + CTA prenota + orari + mappa)
- [ ] `/spiaggia` — Beach Club (King, Standard, Lettini + prezzi)
- [ ] `/ristorante` — Sapori (storia, atmosfera)
- [ ] `/menu` — Menu HTML con `revalidate = 60` che legge da `data/menu.ts`
- [ ] `/vini` — Carta Vini HTML
- [ ] `/eventi` — Serate ed eventi stagionali
- [ ] `/gallery` — Galleria fotografica
- [ ] `/contatti` — Mappa Google, orari, social, CTA WhatsApp

### SEO & TECNICO
- [ ] Schema markup `Restaurant` in homepage
- [ ] Meta tags + Open Graph per ogni pagina
- [ ] `sitemap.xml` automatico (Next.js built-in)
- [ ] `robots.txt`
- [ ] Google Search Console collegato

---

## 🟡 IN CORSO

---

## ✅ COMPLETATI

---

## 🧊 IN ATTESA CLIENTE

- [ ] Foto spiaggia, ristorante, cibo, serate
- [ ] Menu in formato testo (non PDF)
- [ ] Carta vini in formato testo
- [ ] Prezzi ombrelloni: mostrarli o "contattaci"?
- [ ] Decisione sistema prenotazione ristorante (TheFork widget o form custom?)
- [ ] Sezione eventi: gestione autonoma o aggiornamento dev?

---

## 📐 ARCHITETTURA RIFERIMENTO

Copiare e adattare da **sito-piccolo-hotel**:
- `app/api/telegram/route.ts` → bot menu
- `app/api/prenotazioni/route.ts` → prenotazioni pubbliche
- `app/admin/dashboard/` → intera cartella dashboard
- `lib/supabase.ts` → client lazy
- `lib/admin-auth.ts` → autenticazione admin
- `types/database.ts` → tipi (adattare per spiaggia vs ristorante)
- `supabase/migration_crea_prenotazione_rpc.sql` → RPC advisory lock
