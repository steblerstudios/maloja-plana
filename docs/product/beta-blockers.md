# Beta-Blocker — Maloja Plana

> Stand: 2026-06-01
> Zweck: Klare Priorisierung, was vor welcher Beta-Phase erledigt sein muss.
> Regel: Nichts ist "erledigt", bis es tatsächlich verifiziert ist.

---

## P0 — Muss vor öffentlicher Beta

| # | Blocker | Status | Verifiziert |
|---|---------|--------|-------------|
| 1 | Legal sichtbar (Datenschutz, Nutzung, Impressum) | done | Ja — `LegalView.jsx`, Footer-Link, 4 Sprachen |
| 2 | Alpha-Hinweis sauber (nicht alarmistisch, nicht dominant) | done | Ja — kompakter Banner, 2 Zeilen |
| 3 | Datenschutzseite sichtbar und erreichbar | done | Ja — über Footer-Link "Datenschutz & Rechtliches" |
| 4 | Berechnungen als Orientierung kennzeichnen | done | Ja — Alpha-Banner + Legal + Sozialhilfe-Orientierungshinweis direkt bei Resultaten |
| 5 | SKOS-Kinderlogik prüfen / klar einschränken | done | Ja — Rechner unterscheidet Erwachsene/Kinder, Household Model verbunden |
| 6 | Impressum-Platzhalter füllen (Name, Adresse, Kontakt) | done | Ja — Name, Ort, E-Mail, Web in `de.js` `legal.imprint`, alle Sprachen |
| 7 | Sozialhilfe-Disclaimer visuell prüfen | done | Ja — Orientierungshinweis direkt nach Berechnungsergebnissen, ruhiger Ton, 4 Sprachen |
| 8 | Build grün + Smoke Test | done | Ja — 634 KB dist, 178 KB gzipped |
| 9 | Hardcoded German in cantonalData/premiumCalc | done | Ja — Commit `0ddb57b`, alle Kantonsnamen + IPV/SKOS/EL über i18n |
| 10 | Hardcoded German in KKScanner-Validation | done | Ja — 3 Fehlermeldungen über i18n, 4 Sprachen |
| 11 | QR-Code offline (Generation) | done | Ja — qrcodejs lokal gebundelt, Commit `77ad82a` |
| 12 | QR-Scanner + OCR offline | **teilweise** | Graceful Fallback vorhanden, aber jsQR/Tesseract laden per CDN. Scanner als "benötigt Internet" gekennzeichnet, manueller Input funktioniert offline. |
| 13 | jsPDF offline | **nicht relevant** | jsPDF in `helpers.js` wird von keinem aktiven Feature genutzt. Dossier-Export verwendet browser-native Print (HTML). CDN-Abhängigkeit ist toter Code. |
| 14 | Helvetia Orientierungssätze (P0-Set) | done | AHV, BVG, KVG, Franchise, IPV, Säule 3a, Betreibung, Bewilligung B — Commit `ea2a9ac` |

---

## P1 — Wichtig vor geschlossener Beta

| # | Punkt | Status |
|---|-------|--------|
| 1 | Schweizer Orientierungssätze (Franchise, KVG, AHV, BVG) | done — Helvetia Orientation Layer, Commit `ea2a9ac` |
| 2 | Spiegelungsebenen pro Kapitel | done — Basis, Wohnen, Finanzen. Commits `e9fc6f8`, `ea75fd0`, `2f7d884` |
| 3 | Mutter-Feedback vollständig rekonstruieren | offen — Template existiert, nicht ausgefüllt. Sophie-Aktion. |
| 4 | Testpersonen wirklich durchführen | offen — Plan existiert, nicht durchgeführt |
| 5 | Finanzen-Gesamtbild (kapitelübergreifend) | teilweise — Finanzen-Spiegelkarten + BudgetSync (6 Gruppen, 14 Felder, IPV). Budget Phase 2 (Household-Templates) offen. |
| 6 | Budget-UX verbessern (Geduld/Finesse) | offen — Brutto/Netto + Household entschieden/gebaut. Budget-UX-Verbesserungen jetzt möglich. |
| 7 | Empty States wärmer gestalten (FB-019) | done — Kapitelstatus, Tresor, Notfall-Dossier wärmer, 4 Sprachen |
| 8 | Hardcoded German in Berechnungen fixen (FB-018) | done — Commits `0ddb57b`, `84006d0`. Restliche 3 Strings in kkScanner.js jetzt auch behoben. |

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
