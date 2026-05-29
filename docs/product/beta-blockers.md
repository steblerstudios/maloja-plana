# Beta-Blocker — Maloja Plana

> Stand: 2026-05-29
> Zweck: Klare Priorisierung, was vor welcher Beta-Phase erledigt sein muss.
> Regel: Nichts ist "erledigt", bis es tatsächlich verifiziert ist.

---

## P0 — Muss vor öffentlicher Beta

| # | Blocker | Status | Verifiziert |
|---|---------|--------|-------------|
| 1 | Legal sichtbar (Datenschutz, Nutzung, Impressum) | done | Ja — `LegalView.jsx`, Footer-Link, 4 Sprachen |
| 2 | Alpha-Hinweis sauber (nicht alarmistisch, nicht dominant) | done | Ja — kompakter Banner, 2 Zeilen |
| 3 | Datenschutzseite sichtbar und erreichbar | done | Ja — über Footer-Link "Datenschutz & Rechtliches" |
| 4 | Berechnungen als Orientierung kennzeichnen | done | Ja — Alpha-Banner + Legal/Nutzungsbedingungen |
| 5 | SKOS-Kinderlogik prüfen / klar einschränken | **offen** | Sophie muss mit Fachstelle abgleichen |
| 6 | Impressum-Platzhalter füllen (Name, Adresse, Kontakt) | **offen** | Sophie muss Betreiberangaben eintragen |
| 7 | Sozialhilfe-Disclaimer visuell prüfen | **offen** | Ist vorhanden, aber visuell möglicherweise zu leise |
| 8 | Build grün + Smoke Test | done | Ja |

---

## P1 — Wichtig vor geschlossener Beta

| # | Punkt | Status |
|---|-------|--------|
| 1 | Schweizer Orientierungssätze (Franchise, KVG, AHV, BVG) | offen — Phase 3 geplant |
| 2 | Spiegelungsebenen pro Kapitel | offen — Phase 3 Architektur entworfen |
| 3 | Mutter-Feedback vollständig rekonstruieren | offen — Template existiert, nicht ausgefüllt |
| 4 | Testpersonen wirklich durchführen | offen — Plan existiert, nicht durchgeführt |
| 5 | Finanzen-Gesamtbild (kapitelübergreifend) | offen |
| 6 | Budget-UX verbessern (Geduld/Finesse) | offen |
| 7 | Empty States wärmer gestalten (FB-019) | offen |
| 8 | Hardcoded German in Berechnungen fixen (FB-018) | offen |

---

## P2 — Nach Beta

| # | Punkt |
|---|-------|
| 1 | Kuhglocke-Erinnerungen (Fristen) |
| 2 | Erweiterte Verbindungen (EL, RAV, IPV-Hinweise) |
| 3 | Kapitel-Einleitungen als Orientierungsseiten |
| 4 | Export-Architektur (PDF, JSON, ZIP) erweitern |
| 5 | Bundesordner-Metapher im Dokumenten-Tresor |
| 6 | Multi-Sprach-Audit (FR, IT Qualität) |

---

## Scope-Killer — Nicht vor und nicht während Beta

| Punkt | Warum nicht |
|-------|------------|
| AI-gestützte Empfehlungen | Widerspricht deterministic-first-Prinzip |
| Chatbot / Helvetia als Figur | Kein Chatbot — Helvetia ist Ton, nicht Feature |
| Gamification | Widerspricht Produkt-Philosophie |
| Kalender-Synchronisation | Braucht Server/API, widerspricht local-first |
| Push-Notifications (Web Push) | Braucht Service Worker Permissions, zu intrusiv |
| Multi-Personen-Haushalte als Profile | Architektur-Umbau, nicht jetzt |
| FINMA/ISO-Zertifizierung | Unrealistisch und unnötig für Beta |
