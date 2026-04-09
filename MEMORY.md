# Memoria di Progetto e Log delle Decisioni

Questo file contiene lo storico delle decisioni architetturali e i task completati con successo. Da aggiornare alla fine di ogni task.

## Task Completati
- [Setup] Inizializzazione del protocollo PLAN-ASK-CONFIRM-EXECUTE e integrazione regole Next.js 15.
- [Fix] MobileMenu — scroll lock iOS Safari (position fixed + restore scrollY) + chiusura Escape. Commit `a352590` su branch `setup-workflow-ai`.

## Decisioni Architetturali
- La gestione della memoria AI avviene esclusivamente tramite questo file e CLAUDE.md per mantenere il contesto deterministico. Nessun tool RAG esterno.
- Qualsiasi operazione su Next.js deve prima passare per la lettura di AGENTS.md.
