# Proposta commerciale Cala Zingaro

> Documento di lavoro interno (Marco + socio) per definire prezzi, scope e modello di vendita.
> NON e' il preventivo finale per il cliente, e' la base di discussione tra noi.

**Versione:** 1.0
**Data:** maggio 2026

---

## 1. Modello commerciale scelto

**One-shot + tagliando annuale.**

Niente canoni mensili (rifiutati dal mercato PMI italiano). Il cliente paga un prezzo grosso all'inizio per avere il sistema, poi un tagliando annuale leggero per manutenzione e infrastruttura.

Logica: come l'auto. Compri la macchina, poi una volta l'anno fai il tagliando. Niente bollette mensili.

---

## 2. Pacchetto base (one-shot)

### Prezzo: 3.500 EUR (IVA esclusa se applicabile)

### Cosa include

**Sito vetrina:**
- Homepage + 4-5 pagine (chi siamo, ristorante, spiaggia, contatti, eventi)
- Mobile-first, design moderno
- SEO base (Google Maps, schema.org, sitemap)
- Form contatti
- Multilingua italiano + inglese

**Sistema prenotazioni ristorante:**
- Form di prenotazione pubblico per i clienti
- Dashboard admin per lo staff (vista giorno, settimana)
- Mappa sala con tavoli interattivi
- Modalita' Servizio dedicata (vista operativa per durante il servizio)
- Stati prenotazione (in attesa, confermata, arrivato, completato, cancellato)
- Notifiche push al telefono/iPad dello staff
- Email automatica di conferma al cliente

**Sistema prenotazioni ombrelloni:**
- Mappa spiaggia con postazioni numerate
- Prenotazione online: giornaliero, mezza giornata, settimana
- Pagamento online (Stripe)
- Vista occupazione real-time per il bagnino

**Chat AI prenotazioni (la chicca):**
- Lo staff scrive in chat dentro l'app come scriverebbe in WhatsApp
- L'AI legge il messaggio e crea automaticamente la card prenotazione
- Conferma sempre richiesta con un tap (no errori)
- Riconoscimento clienti abituali dallo storico
- Fino a 200 messaggi parsati al giorno per utente

**App PWA installabile:**
- Installazione su iPhone/iPad/Android come app nativa
- Funziona offline (consultazione)
- Notifiche push
- Esperienza identica a un'app dello store, costo zero

**Setup completo:**
- Dominio collegato
- Hosting configurato
- Account creati (cliente li riceve)
- Formazione iniziale staff (1-2 ore videocall)
- Documentazione semplice in italiano

### Tempi di consegna
- 6-8 settimane dal pagamento acconto

### Modalita' pagamento
- 30% all'ordine (1.050 EUR)
- 40% a consegna preview funzionante (1.400 EUR)
- 30% al go-live (1.050 EUR)

---

## 3. Tagliando annuale

### Prezzo: 200 EUR/anno (rinnovo a inizio stagione)

### Cosa include

- Hosting Vercel + dominio rinnovato
- Database Supabase mantenuto
- Quota AI per chat (fino a 5.000 messaggi/anno parsati)
- Quota notifiche email (fino a 10.000/anno)
- Backup giornalieri automatici
- Aggiornamenti di sicurezza
- 4 ore di modifiche/manutenzione l'anno (cambio menu, aggiorna prezzi, sostituisci foto, fix piccoli bug)
- Supporto via WhatsApp/email per problemi urgenti

### Cosa NON include
- Sviluppo nuove feature (vedi "Moduli extra")
- Modifiche grosse (oltre 4h totali) -> tariffa oraria
- Migrazione dati massicci, integrazioni con software loro

### Cosa succede se non pagano il tagliando
- Sito e app continuano a funzionare ma niente AI, niente backup, niente supporto
- Dopo 60 giorni dominio sospeso (loro lo perdono)
- Politica chiara da scrivere nel contratto

---

## 4. Moduli extra (vendita successiva)

Da vendere a chiamata, una tantum, quando il cliente li chiede o tu glieli proponi.

| Modulo | Cosa fa | Prezzo |
|--------|---------|--------|
| Eventi/matrimoni | Pagina dedicata + form richiesta + catalogo allestimenti | 600 EUR |
| Loyalty card digitale | Tessera virtuale + punti + promo personalizzate | 700 EUR |
| Newsletter automatica | Sistema invio campagne con liste segmentate | 400 EUR |
| Ordine al tavolo via QR | Cliente ordina dal suo telefono, va in cucina | 900 EUR |
| Pagamento al tavolo | Integrazione Stripe per pagare via QR | 500 EUR |
| Gift card / abbonamenti | Vendita digitale carte regalo + abbonamenti stagionali | 600 EUR |
| Recensioni automatiche | Invio richiesta recensione Google/TripAdvisor post-visita | 300 EUR |
| Dashboard analytics avanzata | Report incassi, top piatti, previsioni affluenza | 700 EUR |
| Integrazione TheFork/Booking | Sync con piattaforme terze | 500 EUR |
| WhatsApp Business automatico | Invio conferme/promo via WhatsApp ufficiale | 600 EUR + costi consumo |

**Modifiche fuori contratto:** 50 EUR/ora con minimo 2 ore.

---

## 5. Costi reali per noi (per cliente)

### Anno 1
| Voce | Costo annuo | Note |
|------|-------------|------|
| Vercel Hobby | 0 EUR | Free tier basta |
| Supabase Free | 0 EUR | Free tier basta |
| Dominio .it | 12 EUR | Aruba/Register |
| Claude Haiku AI | 24 EUR | ~2 EUR/mese, tetto a 10 EUR/mese |
| Resend email | 0 EUR | Free tier basta |
| Stripe | 0 EUR fisso + 1.4% sulle transazioni (le paga il cliente) | |
| **Totale costi diretti** | **36 EUR/anno** | |

### Tempo nostro
- Sviluppo iniziale: ~80 ore (10 giornate piene tra noi due)
- Manutenzione anno 1: ~5 ore/anno

---

## 6. Margini e calcoli

### Cliente singolo - Anno 1
- Ricavo: 3.500 EUR (one-shot) + 200 EUR (tagliando) = **3.700 EUR**
- Costi infrastruttura: 36 EUR
- **Utile lordo:** 3.664 EUR
- **Tempo lavoro:** ~85 ore tra noi due
- **EUR/ora:** ~43 EUR/h (lordo, da dividere in due e tassare)

### Cliente singolo - Anno 2 (solo tagliando + 1 modulo)
- Ricavo: 200 EUR (tagliando) + 600 EUR (modulo extra) = **800 EUR**
- Costi: 36 EUR + ~10 ore lavoro modulo
- **Utile lordo:** 764 EUR

### Cliente singolo - Su 3 anni
- Ricavo totale: 3.500 + (200 x 3) + (~700 x 1.5 moduli) = **5.150 EUR**
- Costi totali: 36 x 3 = 108 EUR
- **Utile lordo 3 anni:** 5.042 EUR
- **EUR/ora medio:** ~50 EUR/h

---

## 7. Proiezione su scala

Riusando il sistema base (cambiando colori, dati, foto) ogni cliente nuovo richiede ~25-30 ore invece di 80.

### Scenario A: 1 cliente nuovo + Cala Zingaro = 2 attivi
- Anno 1: 3.700 + 3.500 = **7.200 EUR ricavi**
- Tempo: 85h Cala Zingaro + 30h cliente nuovo = 115h totali
- Margine netto stimato (al netto di costi e dividendo 50/50): ~**3.000 EUR/persona**

### Scenario B: 5 clienti attivi (1 anno avanzato)
- Ricavo annuo: (3.500 x 2 nuovi) + (200 x 5 tagliandi) + (~700 x 3 moduli) = **9.100 EUR/anno**
- Tempo: 60h sviluppo + 25h manutenzione = 85h annue
- **Buon margine, sostenibile come secondo lavoro**

### Scenario C: 10 clienti attivi (2-3 anni in)
- Ricavo annuo: (3.500 x 3 nuovi) + (200 x 10 tagliandi) + (~700 x 6 moduli) = **16.700 EUR/anno**
- Tempo: 90h sviluppo + 50h manutenzione = 140h annue
- **EUR/ora migliorato:** ~120 EUR/h
- **A questo punto si valuta P.IVA seria, possibilmente forfettaria al 5%**

---

## 8. Cose da decidere insieme (Marco + socio)

### A. Struttura societaria
- [ ] Avete entrambi P.IVA?
- [ ] Aprite societa' insieme (SRL semplice / SAS) o continuate ognuno con la sua P.IVA?
- [ ] Chi intesta gli account tecnici (Vercel, Supabase, Anthropic, Stripe)?
- [ ] Carta di credito su quale conto?

### B. Divisione del lavoro
- [ ] Chi fa cosa nel progetto base? (frontend / backend / design / cliente)
- [ ] Chi e' il riferimento commerciale per il cliente? (uno solo, l'altro fa il tecnico)
- [ ] Chi gestisce la manutenzione e le emergenze?
- [ ] Chi risponde se il cliente chiama alle 21 di sabato sera?

### C. Divisione del guadagno
- [ ] 50/50 o altre proporzioni?
- [ ] Si calcola sul fatturato o sull'utile (al netto di costi infrastruttura)?
- [ ] Si fattura tra voi o si fa un conto comune?
- [ ] Chi paga le tasse su cosa?

### D. Strategia commerciale
- [ ] Si parte da Cala Zingaro come "case study" da mostrare ad altri?
- [ ] Si cercano altri lidi/ristoranti simili in zona o in tutta Italia?
- [ ] Quale prezzo finale al cliente Cala Zingaro? (3.500 EUR e' un punto di partenza, possiamo trattare)
- [ ] Si offre uno sconto al primo cliente in cambio di testimonial/foto/video?

### E. Garanzie e contratto
- [ ] Bug fix garantiti per quanti mesi dopo go-live? (proposto: 6 mesi)
- [ ] Clausola di disdetta del tagliando (es. preavviso 30 giorni)?
- [ ] Cosa succede se loro non pagano il tagliando?
- [ ] Proprieta' del codice: nostra (riusabile per altri) o loro (esclusiva)?
- [ ] Backup dati: cosa succede se vogliono migrare a un altro fornitore?

### F. Limiti d'uso (proteggono noi dai costi)
- [ ] Tetto AI: 10 EUR/mese hardcoded a livello provider
- [ ] Limite messaggi chat: 200/giorno per utente
- [ ] Limite email: 10.000/anno (oltre, costi a parte)
- [ ] Limite SMS: zero, solo email (per controllo costi)

---

## 9. Frasi di vendita da usare al colloquio

**Apertura:**
> "Vi proponiamo un sistema che gestisce ristorante e spiaggia, costruito sopra a una cosa che vi piacera': l'app capisce i vostri messaggi e li trasforma in prenotazioni, senza farvi cambiare modo di lavorare."

**Sul prezzo:**
> "Tre mila e cinquecento una tantum. Niente canoni mensili che vi spaventano. Una volta all'anno, due cento euro per tagliando. E' tutto."

**Sul tagliando:**
> "E' come quello dell'auto. Una volta l'anno io controllo tutto, faccio gli aggiornamenti, sistemo le piccole cose, vi chiamo a inizio stagione. Non avete bollette da gestire."

**Sull'AI:**
> "Continuate a scrivere come fate adesso in chat. La differenza? Sotto al messaggio appare la prenotazione gia' pronta. Voi confermate con un tap. Niente carta, niente trascrizioni, niente errori. La tecnologia si adatta a voi, non viceversa."

**Sulla nostra credibilita':**
> "Vi mostro un sistema gia' funzionante per un altro ristorante (mostri Piccolo Hotel su iPad). Lo riadattiamo per voi in 6-8 settimane. Non parliamo di idee — parliamo di una cosa che gia' esiste."

**Chiusura:**
> "Vi lascio il preventivo, se vi torna ci sentiamo entro fine settimana. Se ci sono dubbi sulle cifre o sui contenuti, modifichiamo insieme."

---

## 10. Cosa NON dire al colloquio

- Non dire "uso l'intelligenza artificiale di Anthropic" -> di' "l'app capisce automaticamente"
- Non dire "abbonamento" o "canone mensile" -> di' "tagliando annuale" o "rinnovo"
- Non dire "Vercel/Supabase/Stripe" -> di' "infrastruttura professionale"
- Non promettere tempi piu' brevi di 6 settimane (rischi di sforare)
- Non scendere sotto 3.000 EUR senza tagliare features
- Non includere features che non sai di poter consegnare (es. integrazione SumUp se non l'hai mai fatta)

---

## 11. Prossimi step

1. Marco + socio leggono questo documento
2. Si discute punti **8.A**, **8.B**, **8.C**, **8.E** (struttura, divisione lavoro, divisione utile, contratto)
3. Si prepara preventivo formale stile PDF/Notion da consegnare a Cala Zingaro
4. Si prepara mockup demo (rebrand di Piccolo Hotel con colori/foto Cala Zingaro)
5. Si va al colloquio preparati

---

**Nota finale:** questi numeri sono punti di partenza, non vincoli. Se al colloquio vedete che il budget loro e' diverso, si modula. Meglio scendere a 3.000 EUR + 150 EUR tagliando che perdere il cliente, ma mai sotto 2.500 EUR senza tagliare scope.
