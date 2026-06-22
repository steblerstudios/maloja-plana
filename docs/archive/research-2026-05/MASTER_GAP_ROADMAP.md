# Maloja Plana — Master Gap Roadmap

**Datum:** 2026-06-14  
**Basis:** Live-Version auf malojaplana.ch (Commit c3c064f)  
**Stand:** 32 Komponenten, 7 Kapitel, 4 Sprachen, ~1250 i18n-Keys

---

## Executive Summary

Maloja Plana ist funktional vollständig genug für erste Testpersonen. Die grössten Lücken sind nicht Features, sondern **Vertrauen** (Datenschutz-Erklärung, Fehlseiten, Security Headers) und **Realismus** (echte Testdaten, Validierung, Mobile-Feinschliff). Die App braucht keine neuen Kapitel oder Integrationen, um vor Menschen zu bestehen — sie braucht Sorgfalt an den Rändern.

---

## Top 5 Sofort-Tickets (Vor erster Testperson)

1. **A.1** — Security Headers via .htaccess
2. **A.2** — Fehlerseite für ungültige Routen
3. **A.3** — Mobile Feinschliff (Überlappungen, Touch-Targets)
4. **A.4** — Testdaten-Set für Demo
5. **A.5** — Datenschutzerklärung vollständig

---

## A — Vor erster echter Testperson (5 Tickets)

### A.1 — Security Headers via .htaccess

| Feld | Wert |
|---|---|
| Nutzen | Vertrauen, professioneller Eindruck, OWASP-Konformität |
| Aufwand | 1 Stunde |
| Risiko | Niedrig — nur Header, keine Funktionsänderung |
| Abhängigkeiten | Infomaniak Apache-Zugang |
| Warum jetzt | Ohne HSTS und X-Frame-Options wirkt die Seite bei Security-Prüfung unsicher |
| Kleinste Umsetzung | `.htaccess` mit X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |

### A.2 — Fehlerseite für ungültige Routen

| Feld | Wert |
|---|---|
| Nutzen | Kein weisser Bildschirm bei falscher URL |
| Aufwand | 2 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | Keine |
| Warum jetzt | Testpersonen tippen URLs falsch ein oder teilen Links |
| Kleinste Umsetzung | Fallback-Route in main.jsx → "Diese Seite gibt es nicht" + Link zum Dashboard |

### A.3 — Mobile Feinschliff

| Feld | Wert |
|---|---|
| Nutzen | Die meisten Testpersonen werden am Handy testen |
| Aufwand | 4–6 Stunden |
| Risiko | Mittel — viele kleine Stellen, keine einzelne grosse |
| Abhängigkeiten | Keine |
| Warum jetzt | Erstkontakt-Qualität. Eine Überlappung auf dem Handy zerstört den Ersteindruck |
| Kleinste Umsetzung | Systematisch alle 7 Kapitel + Dashboard + Tresor + Budget auf 375px durchgehen, Touch-Targets ≥44px |

### A.4 — Testdaten-Set für Demo

| Feld | Wert |
|---|---|
| Nutzen | Ermöglicht Vorführung ohne manuelle Dateneingabe |
| Aufwand | 2–3 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | Keine |
| Warum jetzt | Ohne Testdaten sieht die App leer und unfertig aus |
| Kleinste Umsetzung | JSON-Datei mit realistischen (fiktiven) Schweizer Daten, Import über Export/Import-Funktion |

### A.5 — Datenschutzerklärung vollständig

| Feld | Wert |
|---|---|
| Nutzen | Rechtlich notwendig, vertrauensbildend |
| Aufwand | 2 Stunden (Text), 1 Stunde (Integration) |
| Risiko | Niedrig |
| Abhängigkeiten | Keine — kein Server, keine Cookies, keine Analytics |
| Warum jetzt | Eine App, die "100% privat" sagt, braucht eine nachprüfbare Erklärung |
| Kleinste Umsetzung | Statische Seite: Was gespeichert wird (localStorage), was nicht (nichts extern), Kontakt |

---

## B — Vor geschlossener Beta (8 Tickets)

### B.1 — Eingabevalidierung Kernfelder

| Feld | Wert |
|---|---|
| Nutzen | Verhindert unsinnige Daten (negative Beträge, Datum in der Zukunft als Geburtsdatum) |
| Aufwand | 6–8 Stunden |
| Risiko | Mittel — viele Felder, muss sorgfältig getestet werden |
| Abhängigkeiten | Keine |
| Warum jetzt | Beta-Tester werden absichtlich Grenzen testen |
| Kleinste Umsetzung | Numerische Felder: min/max, Datumsfelder: Plausibilität, CHF-Felder: ≥0 |

### B.2 — PWA-Installierbarkeit prüfen

| Feld | Wert |
|---|---|
| Nutzen | App auf Homescreen = höhere Nutzung |
| Aufwand | 2–3 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | HTTPS (vorhanden via Let's Encrypt) |
| Warum jetzt | PWA ist ein Kern-Versprechen (offline, installierbar) |
| Kleinste Umsetzung | manifest.json prüfen (Icons, Name, Start-URL), Service Worker testen, Lighthouse-Audit |

### B.3 — Export/Backup testen und dokumentieren

| Feld | Wert |
|---|---|
| Nutzen | Datenverlust-Angst reduzieren |
| Aufwand | 3–4 Stunden |
| Risiko | Mittel — Export existiert, aber Import-Integrität muss geprüft werden |
| Abhängigkeiten | Testdaten (A.4) |
| Warum jetzt | Ohne funktionierenden Export/Import vertraut niemand der App seine Daten an |
| Kleinste Umsetzung | Export-JSON prüfen, Import testen, Rückmeldung im UI verbessern |

### B.4 — Barrierefreiheit Grundlagen

| Feld | Wert |
|---|---|
| Nutzen | Keyboard-Navigation, Screen-Reader-Kompatibilität |
| Aufwand | 6–8 Stunden |
| Risiko | Mittel |
| Abhängigkeiten | Keine |
| Warum jetzt | 33 aria-Attribute sind ein Anfang, aber Formulare und Navigation brauchen mehr |
| Kleinste Umsetzung | Focus-Management, Skip-Links, Label-Verknüpfungen, Farbkontraste prüfen |

### B.5 — Beta-Gate Mehrsprachigkeit

| Feld | Wert |
|---|---|
| Nutzen | FR/IT/EN-Testpersonen sehen deutschen Beta-Gate-Text |
| Aufwand | 1–2 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | Keine |
| Warum jetzt | Erstkontakt für nicht-deutschsprachige Tester |
| Kleinste Umsetzung | BetaGate nutzt bereits `useT()` — die Keys existieren, müssen nur vollständig sein |

### B.6 — HTTP→HTTPS Redirect

| Feld | Wert |
|---|---|
| Nutzen | Keine unverschlüsselte Version erreichbar |
| Aufwand | 30 Minuten |
| Risiko | Niedrig |
| Abhängigkeiten | .htaccess-Zugang (wie A.1) |
| Warum jetzt | Ohne Redirect können Links auf http:// landen |
| Kleinste Umsetzung | `RewriteRule` in .htaccess oder Infomaniak-Panel |

### B.7 — Zweiter Vorname

| Feld | Wert |
|---|---|
| Nutzen | In der Schweiz haben viele Menschen einen zweiten Vornamen (amtlich relevant) |
| Aufwand | 2 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | Keine |
| Warum jetzt | Fehlt als Basisfeld, fällt sofort auf |
| Kleinste Umsetzung | Optionales Feld in Basis-Kapitel, i18n in 4 Sprachen, MirrorCards anpassen |

### B.8 — Schweizer Ikonografie Phase 2

| Feld | Wert |
|---|---|
| Nutzen | 83% der Icons sind noch generisch |
| Aufwand | 8–12 Stunden |
| Risiko | Niedrig — rein visuell |
| Abhängigkeiten | Keine |
| Warum jetzt | Identität stärken, bevor Beta-Feedback die Wahrnehmung prägt |
| Kleinste Umsetzung | 5–8 weitere Icons aus maloja-icons/ adaptieren (Behörden/Helvetia, Finanzen, Wohnen) |

---

## C — Vor öffentlicher Beta (8 Tickets)

### C.1 — Stipendium / Ausbildungsbeiträge

| Feld | Wert |
|---|---|
| Nutzen | Wichtige Schweizer Lebenssituation, besonders für jüngere Nutzer |
| Aufwand | 8–10 Stunden |
| Risiko | Mittel — kantonale Unterschiede |
| Abhängigkeiten | Kantonale Daten |
| Warum später | Nicht kritisch für ersten Kontakt, aber wichtig für Vollständigkeit |
| Kleinste Umsetzung | Felder im Ausbildungs-Kapitel + kantonale Hinweise + Dokument-Uploads |

### C.2 — Notfallübergabe

| Feld | Wert |
|---|---|
| Nutzen | Kern-Versprechen des Notfall-Kapitels: "Im Notfall findet jemand alles" |
| Aufwand | 6–8 Stunden |
| Risiko | Mittel — Datenschutz-Fragen (was wird exportiert?) |
| Abhängigkeiten | Export-Funktion (B.3) |
| Warum später | Braucht Designentscheidungen (PDF? QR? Ausdruck?) |
| Kleinste Umsetzung | "Notfallblatt exportieren" — 1 Seite PDF mit Notfallkontakt, Blutgruppe, Allergien, Medikamente |

### C.3 — Kantonale PLZ/Gemeinde-Logik

| Feld | Wert |
|---|---|
| Nutzen | Korrekte Zuordnung Kanton ↔ Gemeinde für Prämienregion, Steuerfuss |
| Aufwand | 10–15 Stunden |
| Risiko | Hoch — Datenquelle nötig, Wartungsaufwand |
| Abhängigkeiten | Externe Datenbasis (BFS, Post) |
| Warum später | Funktioniert aktuell mit manueller Kantonswahl — PLZ-Automatik ist Komfort |
| Kleinste Umsetzung | PLZ→Kanton-Mapping (ohne Gemeinde), ~4600 Einträge |

### C.4 — Versicherungslücken-Prüfung

| Feld | Wert |
|---|---|
| Nutzen | "Hast du eine Haftpflicht?" — einfache Checkliste statt Beratung |
| Aufwand | 4–6 Stunden |
| Risiko | Mittel — darf nicht wie Beratung aussehen |
| Abhängigkeiten | Keine |
| Warum später | Muss sorgfältig formuliert werden (keine Empfehlung, keine Bewertung) |
| Kleinste Umsetzung | Ja/Nein-Felder für Grundversicherung, Haftpflicht, Hausrat, Rechtsschutz — ohne Bewertung |

### C.5 — Behörden-Zeitstatus

| Feld | Wert |
|---|---|
| Nutzen | "Aufenthaltsbewilligung läuft am X ab" — Fristen sichtbar machen |
| Aufwand | 4–6 Stunden |
| Risiko | Niedrig |
| Abhängigkeiten | Kalender-Integration (existiert) |
| Warum später | Braucht Recherche zu relevanten Behördenfristen |
| Kleinste Umsetzung | Ablaufdatum-Felder für Pass, Aufenthaltsbewilligung, Führerschein → automatische Erinnerung |

### C.6 — Wohnkostenanteil am Einkommen

| Feld | Wert |
|---|---|
| Nutzen | "Wie viel deines Einkommens geht fürs Wohnen?" — Kernfrage für Budget |
| Aufwand | 2–3 Stunden |
| Risiko | Niedrig — reine Mathematik aus vorhandenen Daten |
| Abhängigkeiten | Miete (Wohnen-Kapitel) + Einkommen (Finanzen-Kapitel) |
| Warum später | Nice-to-have, kein Blocker |
| Kleinste Umsetzung | Berechnung in MirrorCards oder Budget: Miete ÷ Nettoeinkommen × 100 |

### C.7 — Rumantsch Grischun (Sprache 5)

| Feld | Wert |
|---|---|
| Nutzen | Identitätsstiftend — vierte Landessprache |
| Aufwand | 12–18 Stunden (siehe RUMANTSCH_GAP_NOTE.md) |
| Risiko | Mittel — Fachterminologie, Muttersprachler-Review nötig |
| Abhängigkeiten | Keine technischen |
| Warum später | ~60'000 Sprecher, die meisten nutzen digital Deutsch |
| Kleinste Umsetzung | rm.js befüllen, Import aktivieren, SUPPORTED erweitern, Onboarding-Grid anpassen |

### C.8 — Kapitelabschlüsse / Ankunftsmomente

| Feld | Wert |
|---|---|
| Nutzen | Wenn ein Kapitel "steht", gibt es keine Rückmeldung — Maloja schweigt |
| Aufwand | 4–6 Stunden |
| Risiko | Hoch — darf nicht wie "Gut gemacht!" klingen |
| Abhängigkeiten | Kapitelstatus-System (existiert) |
| Warum später | Braucht sehr sorgfältige Sprache (keine Bewertung, kein Lob) |
| Kleinste Umsetzung | Ruhiger Satz wenn Grundordnung steht: "Die Grundordnung steht. Das Wichtigste ist an seinem Platz." (existiert bereits in i18n) |

---

## D — Vor App Store / PWA Launch (8 Tickets)

### D.1 — App-Store-Icons und Splash Screens

| Feld | Wert |
|---|---|
| Nutzen | Professioneller Auftritt im App Store / PWA |
| Aufwand | 4–6 Stunden |
| Risiko | Niedrig |

### D.2 — Offline-Modus testen und härten

| Feld | Wert |
|---|---|
| Nutzen | Kern-Versprechen: "funktioniert ohne Internet" |
| Aufwand | 4–6 Stunden |
| Risiko | Mittel — Service Worker Edge Cases |

### D.3 — Performance-Optimierung

| Feld | Wert |
|---|---|
| Nutzen | 707 KB Bundle — akzeptabel, aber verbesserbar |
| Aufwand | 6–8 Stunden |
| Risiko | Mittel — Code-Splitting kann Routing beeinflussen |

### D.4 — Telefonnummer / E-Mail / AHV Validierung

| Feld | Wert |
|---|---|
| Nutzen | Schweizer Formate korrekt prüfen (+41, AHV-Checksumme) |
| Aufwand | 4–6 Stunden |
| Risiko | Niedrig |

### D.5 — Echte Krankenkassen-Daten

| Feld | Wert |
|---|---|
| Nutzen | Dropdown statt Freitext für Krankenkasse |
| Aufwand | 4–6 Stunden |
| Risiko | Mittel — Datenquelle, Wartung |

### D.6 — Dark/Light Mode Feinschliff

| Feld | Wert |
|---|---|
| Nutzen | Beide Modi konsistent und schön |
| Aufwand | 4–6 Stunden |
| Risiko | Niedrig |

### D.7 — Mehrgeräte-Sync (Export/Import UX)

| Feld | Wert |
|---|---|
| Nutzen | "Ich will meine Daten auf dem neuen Handy" |
| Aufwand | 8–12 Stunden |
| Risiko | Hoch — UX-Herausforderung ohne Backend |

### D.8 — Automatische Backups (localStorage → File)

| Feld | Wert |
|---|---|
| Nutzen | Schutz vor Datenverlust bei Browser-Reset |
| Aufwand | 6–8 Stunden |
| Risiko | Hoch — File System Access API ist nicht überall verfügbar |

---

## E — Später (nach Launch)

| Thema | Warum später |
|---|---|
| Google Maps Adresssuche | Externe Abhängigkeit, Datenschutz-Frage, Kosten |
| BAG-KVG-Abgleich | Komplexe Datenbasis, Wartungsaufwand, rechtliche Fragen |
| Compendium / Medikamenten-Daten | Lizenzfragen, medizinische Haftung |
| Weitere Schweizer Lebenssituationen | Feature-Scope begrenzen — 7 Kapitel reichen |
| Kinder als eigene Entitäten | Aktuell: Anzahl + Alter. Reicht für Beta |
| Design "zu beige" | Identität, nicht Bug. Bewusste Entscheidung |
| 17 künstlerische maloja-icons/ vollständig integrieren | Langfristige Identitätsarbeit |

---

## Bewusst gestrichen

| Thema | Begründung |
|---|---|
| Backend / Cloud-Sync | Widerspricht local-first Philosophie |
| KI-basierte Empfehlungen | Maloja empfiehlt nicht |
| Gamification / Scores | Maloja bewertet nicht |
| Social Features | Private App, keine Community |
| Push Notifications Server-Side | Nur lokale Erinnerungen |
| Chatbot / Assistent | Maloja ist ein Ordner, kein Berater |

---

## Empfohlene nächste 3 Sprints

### Sprint 3: Vertrauensschicht

**Tickets:** A.1 (Security Headers), A.2 (Fehlerseite), A.5 (Datenschutz), B.6 (HTTPS Redirect)

**Ergebnis:** Die App wirkt professionell und vertrauenswürdig.

**Aufwand:** ~6 Stunden

### Sprint 4: Erste-Testperson-Bereit

**Tickets:** A.3 (Mobile), A.4 (Testdaten), B.5 (Beta-Gate i18n)

**Ergebnis:** Die App kann einer realen Person gezeigt werden.

**Aufwand:** ~8 Stunden

### Sprint 5: Beta-Härtung

**Tickets:** B.1 (Validierung), B.2 (PWA), B.3 (Export/Backup)

**Ergebnis:** Die App hält Beta-Nutzung aus.

**Aufwand:** ~12 Stunden
