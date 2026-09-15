# Architettura sistema prenotazioni Cala Zingaro

> Documento tecnico interno. Spiega come e' strutturato il sistema, come riusiamo
> il codice di Piccolo Hotel, e come funziona la chat AI.
> Da consultare prima di iniziare lo sviluppo del sistema gestionale.

**Versione:** 1.0
**Data:** maggio 2026
**Riferimento progetto base:** sito-piccolo-hotel (gia' funzionante in produzione)

---

## 1. Visione architetturale

```
[Cliente finale]                    [Staff Cala Zingaro]
       |                                    |
       v                                    v
[Sito vetrina pubblico]            [App PWA gestionale]
   /prenota/ristorante                /admin/dashboard
   /prenota/ombrelloni                /admin/servizio
       |                              /admin/chat
       v                                    |
       +------------> Supabase <------------+
                          ^
                          |
              [Chat AI: Anthropic Claude]
              [Email: Resend]
              [Push: Web Push API]
              [Pagamenti: Stripe]
```

**Tutto in un solo progetto Next.js**, due aree:
- `/` -> sito vetrina pubblico
- `/admin/*` -> app gestionale interna (PWA)

---

## 2. Cosa riusiamo da Piccolo Hotel

Il progetto `sito-piccolo-hotel` e' **gia' funzionante** in produzione. Riusiamo:

### Riuso al 100% (copia diretta, cambia solo branding)
- Schema Supabase: `reservations`, `tables`, `time_slots`, `push_subscriptions`
- API routes admin: `/api/admin/prenotazioni/*`, `/api/admin/push/*`
- Auth admin (cookie + bcrypt password)
- Service Worker per PWA + push
- Componenti dashboard: SalaView, ReservationList, NuovaPrenotazioneModal
- ServizioClient (vista operativa)
- Layout admin (admin-shell con CSS PWA-feel)

### Riuso al 90% (piccoli adattamenti)
- Sito vetrina (cambia copy, foto, palette, ma struttura uguale)
- Form prenotazione pubblico (cambia copy, ma logica identica)
- Notifiche push (gia' funzionano, basta nuovi VAPID keys)

### Da costruire ex novo
- **Chat AI prenotazioni** (vedi sezione 4)
- **Sistema ombrelloni** (modello dati esteso, vedi sezione 5)
- **Pagamenti Stripe** (per ombrelloni online)

---

## 3. Modello dati esteso

Estendiamo lo schema Piccolo Hotel per gestire **risorse generiche**, non solo tavoli.

### Tabella `risorse` (rinominata da `tables`)

```sql
CREATE TABLE risorse (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('tavolo', 'ombrellone', 'lettino')),
  nome text NOT NULL,        -- "T1", "Veranda", "Ombrellone 12", "Lettino A"
  posti integer,             -- numero coperti per tavoli, NULL per ombrelloni
  posizione_x integer,       -- coordinate per la mappa
  posizione_y integer,
  zona text,                 -- "interno", "veranda", "spiaggia-fila-1"
  attivo boolean DEFAULT true,
  prezzo_giornaliero numeric, -- solo per ombrelloni/lettini
  prezzo_settimanale numeric,
  prezzo_stagionale numeric,
  metadata jsonb             -- info extra (es. con tavolino, sedie, ecc.)
);
```

### Tabella `prenotazioni` (estesa da `reservations`)

```sql
CREATE TABLE prenotazioni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('ristorante', 'ombrellone')),
  risorsa_id uuid REFERENCES risorse(id),

  -- Dati cliente
  nome_ospite text NOT NULL,
  telefono text,
  email text,
  note text,

  -- Date
  data_inizio date NOT NULL,        -- per ristorante = giorno della prenotazione
  data_fine date,                   -- per ombrellone = ultimo giorno (es. settimana)
  time_slot_id uuid,                -- solo per ristorante
  coperti integer,                  -- solo per ristorante
  durata_minuti integer DEFAULT 75, -- solo per ristorante

  -- Stato
  stato text NOT NULL DEFAULT 'pending',
  canale text NOT NULL,             -- 'online', 'telefonica', 'walkin', 'chat-ai'
  fonte_chat_id uuid,               -- ref al messaggio chat se canale='chat-ai'

  -- Pagamento (per ombrelloni)
  prezzo_totale numeric,
  pagamento_stato text,             -- 'pending', 'paid', 'refunded'
  stripe_payment_intent text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Tabella `chat_messages` (nuova, per la chat AI)

```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,            -- chi ha scritto (staff)
  testo text NOT NULL,              -- messaggio originale
  parsed_data jsonb,                -- output AI (nome, coperti, data, ecc.)
  parsed_confidence numeric,        -- confidenza AI (0-1)
  prenotazione_id uuid REFERENCES prenotazioni(id), -- se confermata
  stato text NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'discarded'
  created_at timestamptz DEFAULT now()
);
```

### Tabella `clienti` (nuova, per riconoscimento abituali)

```sql
CREATE TABLE clienti (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefono text UNIQUE,
  email text,
  note_storiche text,           -- "allergico noci, festeggia anniversario 12 luglio"
  totale_visite integer DEFAULT 0,
  ultima_visita date,
  created_at timestamptz DEFAULT now()
);
```

---

## 4. Chat AI: come funziona davvero

### Flusso utente

```
1. Staff apre /admin/chat sull'iPad
2. Vede una chat tipo WhatsApp con i messaggi degli altri colleghi
3. Scrive a mano libera: "famiglia rossi 6 persone sabato sera anniversario"
4. Sistema invia messaggio a /api/chat/parse
5. AI legge e restituisce JSON strutturato + confidence
6. Sotto al messaggio appare card con i dati estratti
7. Se mancano info -> AI chiede automaticamente nel chat
8. Staff fa tap su "Conferma" -> INSERT in prenotazioni + assegnazione automatica risorsa
9. La dashboard si aggiorna in real-time per tutti
```

### Stack tecnico

```
Input:
  - Form chat in /admin/chat (componente client React)
  - Real-time multi-utente via Supabase Realtime

Parsing:
  - Endpoint /api/chat/parse (Vercel Function, Fluid Compute)
  - Modello: Claude Haiku 3.5 via Vercel AI Gateway
  - JSON Schema forzato per output strutturato (no allucinazioni)
  - Tetto budget: 10 EUR/mese hardcoded a livello provider

Cache:
  - Upstash Redis (free tier) - cache messaggi identici 5 min
  - Riduce chiamate AI duplicate

Rate limit:
  - 200 messaggi/utente/giorno
  - Implementato con Redis counter
```

### Esempio di prompt AI

```
Sei un assistente che legge messaggi italiani dello staff di un ristorante.
Estrai i dati di prenotazione in JSON. Se non sei sicuro di un campo, lascia null.

Input: "{messaggio}"
Data oggi: {oggi}

Output JSON con schema:
{
  "nome_ospite": string | null,
  "coperti": int | null,
  "data": "YYYY-MM-DD" | null,
  "slot": "pranzo" | "cena" | null,
  "telefono": string | null,
  "note": string | null,
  "confidence": float (0-1),
  "domande": [string]  // se devi chiedere info, lista le domande
}
```

### Esempi di messaggi e parsing atteso

| Messaggio staff | Output AI |
|-----------------|-----------|
| "rossi 4 sabato 13" | {nome:"Rossi", coperti:4, data:"sab", slot:"pranzo", confidence:0.95} |
| "famiglia bianchi 6 persone domani sera anniversario" | {nome:"Bianchi", coperti:6, data:"domani", slot:"cena", note:"anniversario", confidence:0.9} |
| "stasera tavolo per 2 fuori se possibile" | {coperti:2, data:"oggi", slot:"cena", note:"fuori", confidence:0.8, domande:["Nome cliente?"]} |
| "ha chiamato mario per giovedi" | {nome:"Mario", data:"giovedi", confidence:0.5, domande:["Quante persone?","Pranzo o cena?"]} |

### Protezioni anti-errore

1. **JSON Schema forzato** -> niente testo libero, solo i campi previsti
2. **Confidenza esplicita** -> se < 0.7, l'AI deve fare domande prima di confermare
3. **Conferma umana sempre** -> niente entra in DB senza tap dello staff
4. **Regole hardcoded** per dati certi:
   - Date relative: "domani"/"sabato" calcolate lato server
   - Telefono: regex italiana 10 cifre
   - Slot: matching keyword (pranzo/13/14/sera/cena/19/20/21)
5. **Riconoscimento cliente** dalla rubrica `clienti` -> se "Rossi" gia' esiste, propone storico

### Costi reali AI

- Claude Haiku 3.5: ~0,00007 EUR per parsing
- Stima Cala Zingaro: 30-50 messaggi/giorno = ~1.500/mese
- Costo mensile reale: **0,10-0,15 EUR**
- Tetto provider: 10 EUR/mese (impossibile sforare)

---

## 5. Sistema ombrelloni

### UI mappa spiaggia

Componente `SpiaggiaMap` (nuovo). Ispirato a `SalaView` di Piccolo Hotel ma con layout diverso:

- Griglia di ombrelloni numerati (es. 5 file da 10 = 50 ombrelloni)
- Click su ombrellone -> dettagli + form prenotazione
- Colori stati: libero (verde), prenotato (rosso), occupato (giallo), abbonato (blu)
- Vista filtrabile per data

### Tipi di prenotazione ombrellone

- **Giornaliera** (mezza o intera): 1 giorno specifico
- **Settimanale**: 7 giorni consecutivi
- **Stagionale/abbonamento**: tutta la stagione, stesso ombrellone

### Pagamento

Stripe Checkout per pagamento online subito. L'ombrellone si "blocca" solo dopo pagamento confermato.

### Integrazione con ristorante

Cliente che prenota ombrellone vede CTA: "Aggiungi pranzo al tuo giorno in spiaggia". Upselling automatico, prenotazione tavolo collegata.

---

## 6. Riuso codice da Piccolo Hotel - piano operativo

### Step 1: Setup base
1. Clonare struttura admin da Piccolo Hotel
2. Adattare migrations Supabase (rinominare `tables` -> `risorse`, aggiungere campi nuovi)
3. Configurare nuovo progetto Vercel + nuovo Supabase project
4. Deploy iniziale per validare

### Step 2: Adattare componenti esistenti
- `SalaView.tsx` -> `RisorseView.tsx` (filtra per tipo)
- `ReservationList.tsx` -> aggiungi colonna "tipo" (ristorante/ombrellone)
- `NuovaPrenotazioneModal.tsx` -> due flussi separati per tipo

### Step 3: Costruire nuovi componenti
- `/admin/chat` page + `ChatClient.tsx` + `ChatMessage.tsx` + `PrenotazioneCard.tsx`
- `/admin/spiaggia` page + `SpiaggiaMap.tsx` + `OmbrelloneDetail.tsx`
- `/api/chat/parse` endpoint
- `/api/ombrelloni/disponibilita` endpoint
- `/api/ombrelloni/checkout` endpoint (Stripe)

### Step 4: Sito vetrina
- Mantieni le pagine gia' esistenti del sito-calazingaro
- Aggiungi `/prenota/ristorante` (riusa form da Piccolo Hotel)
- Aggiungi `/prenota/ombrelloni` (nuovo, con SpiaggiaMap pubblica)

---

## 7. Stima tempi di sviluppo

| Fase | Ore stimate | Note |
|------|-------------|------|
| Setup base + clone codice da Piccolo Hotel | 8h | DB schema, deploy, env vars |
| Adattamento componenti esistenti | 12h | RisorseView, branding, copy |
| Sistema ombrelloni (UI + API) | 20h | Mappa, prenotazioni, Stripe |
| Chat AI (UI + parsing + integrazione) | 20h | Realtime, AI Gateway, cache |
| Sito vetrina (cambio copy/foto da quello iniziato) | 8h | |
| Test, polish, formazione cliente | 12h | |
| **Totale stima** | **80h** | |

Con 2 persone in parallelo: **5-6 settimane** di lavoro effettivo.

---

## 8. Variabili d'ambiente necessarie

```
# Supabase (nuovo progetto)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth admin
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

# AI (Anthropic via Vercel AI Gateway)
ANTHROPIC_API_KEY=
AI_GATEWAY_API_KEY=  # se si usa Vercel AI Gateway

# Email
RESEND_API_KEY=

# Pagamenti
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=

# Push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:info@calazingaro.com

# Cache rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 9. Note operative per lo sviluppo futuro

- **Sempre mobile-first**: lo staff usa principalmente iPad e iPhone
- **Touch-friendly**: bottoni minimo 44px, no hover-only states
- **Real-time fondamentale**: Supabase Realtime per chat e dashboard, polling 30s come fallback
- **Offline-friendly**: PWA cache base, sync quando torna connessione
- **Italiano**: tutti i copy, tutti i messaggi di errore, tutta la documentazione cliente
- **GDPR**: privacy policy aggiornata, dati clienti minimi, export su richiesta

---

## 10. Riferimenti incrociati

- Modello commerciale: `docs/proposta-commerciale.md`
- Progetto base funzionante: `~/Desktop/dev/Websites/sito-piccolo-hotel`
- Documentazione cliente Cala Zingaro: vedi `CLAUDE.md`
- Schema Supabase di riferimento: `~/Desktop/dev/Websites/sito-piccolo-hotel/supabase/`
