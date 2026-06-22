# Maloja Plana — Product Memory Registry

> Zentrales Gedächtnis aller Produkt-, Design- und Architekturentscheidungen.
> Verhindert, dass wichtige Ideen und Regeln in Chats verloren gehen.

Stand: 2026-06-22

---

## 1. Produktidentität

### 1.1 Name & Herkunft
- **Produktname:** Maloja Plana (ehemals "Ordnung & Ruhe v5")
- **Technischer Name:** ordnung-ruhe-neu (package.json, Vercel, Git)
- **Name Easter Eggs:**
  - Maloja → Malojapass (Alpenpass GR, Verbindung)
  - Pass → Schweizer Pass + Bergpass
  - Plana → Ordnung (planen) + Silvaplana (Engadin)
- **localStorage-Präfix:** `or5_` (historisch, nicht ändern)
- **IndexedDB:** `ordnung-ruhe-documents` (nicht ändern)
- **Branding-Regel:** UI-Texte = "Maloja Plana", technische Bezeichner bleiben `ordnung-ruhe`

### 1.2 Leitsatz
> Maloja Plana ist keine generische AI-App.
> Es ist eine ruhige, regelbasierte, schweizerische Lebensinfrastruktur
> mit hochwertiger Informationsarchitektur, klaren Regelwerken
> und langfristigem Vertrauen.

### 1.3 Metapher
- **"Ein Ort, kein Dashboard"** — Editorial Layout, nicht SaaS-Kartengitter
- **Malojapass-Silhouette** als topographischer Dashboard-Anker (3-Layer Alpine Profil mit Pass-Sattel)
- 7 Kapitel-Icons als klickbare Stationen entlang des Passwegs

### 1.4 Kernprinzipien (12)
1. Ruhe über Engagement
2. Klarheit über Komplexität
3. Vertrauen über Growth Hacking
4. Privatsphäre über Extraktion
5. Orientierung über Produktivitätsdruck
6. Emotionale Sicherheit in der UX
7. Humane Technologie
8. Local-First-Denken
9. Barrierefreie Systeme
10. Menschenlesbare Prozesse
11. Transparenz über Manipulation
12. Langfristiges Vertrauen über kurzfristige Retention

---

## 2. Zielgruppen

### 2.1 Primär
- Schweizer Einwohner (Immigranten, Flüchtlinge, Expats)
- Personen mit administrativer Überlastung
- Neurodivergente Personen
- Menschen in Burnout oder Krisensituationen

### 2.2 Emotionale Ziele (nach 30 Tagen)
- Ruhiger, klarer, weniger überfordert
- Orientierter, sicherer, fähiger
- Weniger beschämt, mehr Kontrolle
- Weniger mental fragmentiert
- Emotional unterstützt durch Struktur

---

## 3. Anti-Patterns (NIEMALS)

### 3.1 Engagement-Optimierung
- Keine Streaks, Badges, Completion-Prozente
- Keine Gamification (aber: visuelle Freude/Micro-Feedback ist erwünscht — satisfying state changes, Fülleffekte, Fortschrittsvisualisierung)
- Keine XP/Scores/Rivalen

### 3.2 Dopamin-UX
- Kein Pull-to-Refresh, Infinite Scroll, rote Badge-Zähler
- Keine Dringlichkeitsfarben für unvollständige Abschnitte

### 3.3 Scham-Mechaniken
- Leere Zustände einladend, nicht anklagend
- Kein "Du hast dein Budget gesprengt"
- Kein Vergleich mit Durchschnitt

### 3.4 Dark Patterns
- Keine Pre-Checked Consent Boxes
- Keine versteckten Datenübertragungen
- Keine künstliche Dringlichkeit

---

## 4. Architektur-Entscheidungen

### 4.1 Stack & Constraints
- **Framework:** React 18 + Vite 4 (keine weiteren Abhängigkeiten)
- **Rendering:** `React.createElement()` durchgehend (KEIN JSX-Syntax trotz .jsx-Dateien)
- **Styling:** 100% Inline-Styles via `palette` Prop-Objekte + CSS Custom Properties (tokens.css)
- **Routing:** Hash-Router (#/view oder #/chapter/N)
- **Persistenz:** localStorage (`or5_data`, `or5_docs`, `or5_reminders`) + IndexedDB
- **Deployment:** Vercel (statisches Hosting)

### 4.2 Unveränderliche Bezeichner
| Bezeichner | Typ | Grund |
|---|---|---|
| `or5_data` | localStorage Key | Migration erforderlich bei Änderung |
| `or5_docs` | localStorage Key | Migration erforderlich |
| `or5_reminders` | localStorage Key | Migration erforderlich |
| `ordnung-ruhe-docs` | IndexedDB Name | Migration erforderlich |
| `ordnung-ruhe-backups` | IndexedDB Name | Migration erforderlich |
| Unicode-Präfixe (✓ ✕ □) | ~80 Button-Labels | Zu viel Churn für minimalen Gewinn |

### 4.3 Data Model
- **Version:** 2 (Migration v1→v2: fullName → firstName + lastName)
- **7 Kapitel:** basis, wohnen, finanzen, versicherungen, ausbildung, behoerden, notfall
- **~85 Felder, 23 Dokument-Slots**
- **Migrationen:** Sequenziell, mit Pre-Migration-Snapshot, Rollback bei Fehler

### 4.4 ADRs (Architecture Decision Records)
| ADR | Titel | Status |
|-----|-------|--------|
| ADR-009 | Storage Strategy | Angenommen |
| ADR-010 | OCR Engine | Angenommen |
| ADR-011 | Auth Strategy | Angenommen |

### 4.5 Runtime-Fundament
- Unified State Machine (implementiert)
- Subscribable EventBus (implementiert)
- Runtime Singleton (implementiert)
- Workflow-Definition-Schema (definiert)
- Approval Gates (definiert)
- Audit Log (definiert)
- NOCH KEIN globaler React Context/Hook Layer

---

## 5. Visual Identity

### 5.1 Palette
| Token | Light | Dark | Verwendung |
|-------|-------|------|------------|
| bg | #F5F2EE | #0F0E0C | Hintergrund |
| surface | #FFFFFF | #161513 | Karten/Panels |
| up | #F0EDE8 | #1E1C19 | Erhöhte Flächen |
| top | #EAE5DD | #252320 | Höchste Erhebung |
| border | #DDD8D0 | #2A2824 | Rahmen |
| text | #1C1A17 | #EDE8E0 | Haupttext |
| mid | #6B6560 | #8A8478 | Sekundärtext |
| soft | #A89F94 | #504C46 | Deaktiviert |
| gold | #C9A96E | #C9A96E | Akzent (Gold) |
| sage | #7B9E8C | #7B9E8C | Natur/Beruhigung |
| rose | #B87070 | #B87070 | Warm/Warnung |
| sky | #6E90B0 | #6E90B0 | Himmel/Information |
| sand | #B8956A | #B8956A | Erde/Navigation |

### 5.2 Farbwelt-Charakter
- **Creme / Salbei / Anthrazit / Sand** — geerdet, schweizerisch
- Keine gesättigten Primärfarben
- Keine aggressiven Rot/Grün-Signale
- Warme, natürliche Töne

### 5.3 Typografie
- **Schriftfamilie:** DM Sans (WOFF2, lokal)
- **Gewichte:** 400 (Normal), 500 (Medium), 600 (Semi)
- **Grössen:** 11px (xs) bis 36px (3xl)
- **Zeilenhöhen:** 1.2 (tight) bis 1.7 (relaxed)

### 5.4 Spacing & Layout
- **4px-Basisraster:** 2px bis 64px
- **Radien:** 6px (sm) bis 24px (xl) + full
- **Schatten:** Subtil, premium (0.06–0.12 Opacity)
- **Transitions:** cubic-bezier(0.4, 0, 0.2, 1), 150ms–400ms

### 5.5 Animations & Micro-Feedback
- `mp-stamp` — Stempel-Effekt (scale bounce)
- `mp-check-pop` — Häkchen-Pop (scale 0→1.2→1)
- `mp-lock-close` — Schloss-Animation (translateY)
- `fadeIn`, `slideIn`, `slideUp` — Basisübergänge
- `prefers-reduced-motion` wird respektiert

### 5.6 Accessibility
- Focus-Ring: 2px solid #B8956A, offset 2px
- Skip-to-Content Link
- `prefers-reduced-motion: reduce` → alle Animationen auf 0.01ms
- ARIA-Labels auf allen interaktiven Elementen
- Nav-Landmark
- Keyboard-navigierbar

### 5.7 Icon-System
- SVG Pictogramme (IconSystem.jsx, ~40 Icons, 71KB)
- Kapitel-Icons: Stationen auf dem Malojapass-Pfad
- Keine Unicode-Emojis für Navigation (aber bestehende Button-Präfixe bleiben)

### 5.8 Dashboard-Struktur
- Malojapass-Silhouette als topographischer Anker
- Kapitel als offene Register-Zeilen (borderBottom-Separatoren, keine Kartencontainer)
- Editorial Layout (Magazin-Charakter)

---

## 6. i18n & Sprachen

### 6.1 Unterstützte Sprachen
| Code | Sprache | Status |
|------|---------|--------|
| de | Deutsch | Primär |
| fr | Französisch | Vollständig |
| it | Italienisch | Vollständig |
| en | Englisch | Vollständig (Fallback) |
| rm | Romanisch | Basis |

### 6.2 System
- Eigene Implementation (kein i18n-Framework)
- `I18nProvider` → `useT()` → `t(key, params)`
- Fallback-Kette: Gewählte Sprache → EN → Key
- Auto-Detection via Browser-Locale (de-CH → de)
- Speicherung: `or5_lang` in localStorage

---

## 7. Implementierte Features (Stand 2026-06-22)

### 7.1 Kernfunktionen
| Feature | Datei(en) | Phase |
|---------|-----------|-------|
| 7 Lebenskapitel | ChapterView.jsx, constants.js | Phase 0 |
| Dashboard (Malojapass) | Dashboard.jsx | Phase 2 |
| Auto-Save (5s-Intervall) | main.jsx, AutoSaveStatus.jsx | Phase 1 |
| Hash-Routing | hashRouter.js | Phase 1 |
| Theme Toggle (Hell/Dunkel) | ThemeToggle.jsx | Phase 2 |
| Onboarding (mit Trust-Hinweis) | Onboarding.jsx | Phase 5 |
| Mobile Navigation | MobileNav.jsx | Phase 4 |
| Fehlerbehandlung | ErrorBoundary.jsx | Phase 1 |
| Storage-Warnung | StorageWarning.jsx | Phase 1 |
| Überfällig-Banner | OverdueBanner.jsx | Phase 5 |
| Demo-Person (Maria Muster) | demoData.js, Dashboard.jsx | E-09 |
| Fortschrittskarte | Dashboard.jsx | C8 |
| Trust-Badge (Dashboard) | main.jsx | A2 |
| Trust im Empty State | ChapterView.jsx | A2 |
| «Deine Daten fliessen in» | ChapterView.jsx | A1/A3 |
| Live-Verbindungen «Daten wirken» | Dashboard.jsx (DatenWirken) | A1/A3 |
| Kontextuelle Links (offizielle Quellen) | ChapterView.jsx, constants.js | C9 |
| Mindestlohn-Cross-Link | ChapterView.jsx | C7 |
| MirrorCards (Zusammenfassungen) | MirrorCards.jsx | E-01 |
| MVO (Minimum Viable Order) | Dashboard.jsx | E-02 |
| Kapitelabschlüsse | ChapterView.jsx | E-05 |
| Synthesen | Dashboard.jsx | E-06 |
| Farbdramaturgie (kapitelspezifisch) | Dashboard.jsx, ChapterView.jsx | E-07 |
| Beta-Feedback-Formular | Dashboard.jsx | E-09 |

### 7.2 Schweizer Logik
| Feature | Datei(en) | Swiss-Specificity |
|---------|-----------|-------------------|
| IPV-Rechner (alle 26 Kantone) | PremiumSubsidy.jsx, premiumCalc.js, cantonalData.js | Hoch |
| Sozialhilfe/SKOS-Rechner | SozialhilfeView.jsx, cantonalData.js | Hoch |
| EL-Berechtigungsprüfung | cantonalData.js | Hoch |
| PLZ→Kanton Zuordnung | cantonalData.js | Hoch |
| Mietzinslimiten (SKOS) | cantonalData.js | Hoch |
| KK-Scanner (Barcode/QR/OCR) | KKScanner.jsx, kkScanner.js | Hoch |
| Steuerrechner (Basis) | TaxCalculator.jsx | Mittel |
| Schulden/Betreibung | SchuldenManager.jsx, schuldenCalc.js | Hoch |
| Wochenaufenthalt-Logik | cantonalData.js | Hoch |
| AHV-Nummern-Validierung | validationUtils.js | Hoch |
| CH-Telefon-Formatierung | validationUtils.js | Hoch |

### 7.3 Generatoren & Export
| Feature | Datei(en) | Output |
|---------|-----------|--------|
| CV-Generator | CVGenerator.jsx, cvGenerator.js | HTML/PDF |
| ZIP-Export | ZipExport.jsx, zipExport.js | ZIP (JSON + CSV + MANIFEST) |
| Budget-Import | BudgetImport.jsx, csvImport.js | CSV/Excel/eBill → Daten |
| Budget-Sync | BudgetSync.jsx, budgetSync.js | Cross-Chapter-Verknüpfung |
| Dokument-Tresor | DocumentTresor.jsx | IndexedDB (AES-256) |
| Organspendekarte | OrganDonation.jsx | QR-Code |
| Kalender/Erinnerungen | CalendarReminders.jsx | Benachrichtigungen |
| Erweiterte Charts | ChartsAdvanced.jsx | Visualisierungen |
| Benachrichtigungseinstellungen | NotificationSettings.jsx | Konfiguration |
| Auto-Backup | autoBackup.js, backupCrypto.js | Verschlüsselte Backups |

### 7.4 White-Label-System
- Organisation, Logo, URL, Kontakt
- App-Name-Override, Tagline, Akzentfarbe
- Feature-Toggles (Budget, IPV, Sozialhilfe, Steuer, Schulden, CV, Organspende, Kalender, Charts, Export)
- Standard-Kanton/Sprache voreinstellbar
- Konfigurations-Quelle: localStorage (kein Backend)

---

## 8. Bekannte Risiken & Bugs

### 8.1 Architektur
- QR-Code-CDN-Abhängigkeit in OrganDonation (KKScanner jsQR jetzt lokal) → Teilweise behoben
- ~80 Button-Unicode-Präfixe inkonsistent mit SVG-Iconsystem (niedrige Priorität)
- Kein globaler Runtime-React-Context/Hook Layer

### 8.2 Domänenlogik
- **SKOS Household Composition Bug:** `householdSize = 1 + dependents` behandelt jeden als Erwachsenen; SKOS unterscheidet aber Zusammensetzungen → blockiert von Phase 9 (Household Model)
- **BVG Double Deduction:** Nettolohn enthält bereits BVG-Abzug; App subtrahiert nochmals → benötigt Brutto/Netto-Unterscheidung
- **Daten-Duplikation:** AHV-Nummer, Franchise, KK-Versicherer in mehreren Chapters → Design-Entscheidung: ein kanonischer Ort pro Feld, Rest via Derived State

---

## 9. Phasen (Roadmap-Übersicht)

> Vollständige Roadmap: `docs/roadmap/master-roadmap.md`

| Phase | Thema | Status |
|-------|-------|--------|
| 0 | i18n (4 Sprachen) | ✅ Abgeschlossen |
| 1 | Foundation (Migration, Backup, Routing) | ✅ Abgeschlossen |
| 2 | Visual Rebrand "Maloja Plana" | ✅ Abgeschlossen |
| 2.5 | SVG Pictogram System | ✅ Abgeschlossen |
| 3 | Accessibility Pass | ✅ Abgeschlossen |
| 4 | Responsive Polish (375px+) | ✅ Abgeschlossen |
| Iter. 0 | ADRs, CI/CD, Build Budget | ✅ Abgeschlossen |
| P1-001/002 | State Machine, EventBus, Runtime Singleton | ✅ Abgeschlossen |
| A-024 | Input Trust + Versicherungsfelder | ✅ Abgeschlossen |
| E-01–E-08 | Execution (MirrorCards bis Ikonographie) | ✅ Abgeschlossen |
| B1–B3 | BVG, UVG/KTG, Vorsorge/Nachlass | ✅ Abgeschlossen |
| C7–C9 | Mindestlohn-Link, Fortschrittskarte, Kontextlinks | ✅ Abgeschlossen |
| A1–A3 | Nutzen, Vertrauen, Verbindungen + Demo-Person | ✅ Abgeschlossen |
| **E-09** | **Beta mit echten Menschen** | **Aktuell** |
| — | Generatoren (Briefe, Einsprachen, IPV-Anträge) | Geplant |
| — | Export-Architektur (PDF, DOCX, CSV) | Geplant |
| — | Household Model (SKOS-konform) | Geplant |
| — | Template Engine | Geplant |

---

## 10. Spinnennetz (Life Web) — Konzeptionell

### 10.1 Idee
Lebensbereiche sind vernetzt. Änderungen in einem Bereich wirken auf viele andere. Die App soll diese Verbindungen ruhig sichtbar machen — nicht als komplexer Graph, sondern als ruhiges Orientierungssystem.

### 10.2 Beispiele
- **Umzug** → Gemeinde, Kanton, Steuern, KK, IPV, Mietvertrag, Hausratversicherung, Einwohneramt, Aufenthaltsbewilligung, Parkplatz, Kinderbetreuung, Schule
- **Jobverlust** → Einkommen, ALV, BVG, AHV, Budget, Schulden, KK, Sozialhilfe, Steuern
- **Krankheit** → Arbeitsfähigkeit, Krankentaggeld, UVG, KK, IV, Medikamente, Budget, Notfallkontakte
- **Tod** → Vollmachten, Versicherungen, Mietvertrag, Erbschaft, Konten, Dokumente, Angehörige, AHV, BVG

### 10.3 Zukünftige Engines
- Derived State Engine
- Household Engine
- Canton Rule Engine
- Document Generation Engine
- Reminder Intelligence Engine
- Relationship Mapping Engine
- Security Hardening Engine

---

## 11. Sicherheit & Privatsphäre

### 11.1 Prinzipien
- **100% Offline-fähig** — kein Backend, keine Accounts, keine Cloud
- **Local-First** — alle Daten auf dem Gerät des Users
- **Verschlüsselung:** AES-256 via Web Crypto API (Dokument-Tresor, Backups)
- **Kein Tracking** — keine Analytics, keine Cookies, keine externen Scripts (Ausnahme: QR-CDN)

### 11.2 Vertrauens-Grenzen
- **Systemgrenze:** Browser ↔ localStorage/IndexedDB
- **Exportgrenze:** User kontrolliert alle Exports manuell
- **Keine automatische Übermittlung** an Behörden oder Dritte

### 11.3 Disclaimer-Regel
- Jeder Rechner/Hinweis mit rechtlicher Relevanz: Disclaimer
- Orientierung, nicht Beratung
- Keine juristischen Schlussfolgerungen
- Keine Garantie auf Korrektheit kantonaler Daten
