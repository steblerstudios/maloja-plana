# MASTER CONTEXT V1 — Maloja Plana

> Erstellt: 2026-06-01
> Aktueller Commit: `0d05b16` (Simplify beta footer to email-only feedback)
> Build: Grün — 647 KB dist, 181 KB gzipped
> Codebase: 64 Source-Dateien, ~26.400 Zeilen, 271 Commits

---

## 1. PRODUKTVISION

### Was ist Maloja Plana?

Schweizer Lebensordner. Eine ruhige, regelbasierte, schweizerische Lebensinfrastruktur.

**Nicht:** Finanzsoftware, Dokumentenscanner, Behördenportal, AI-Chatbot, SaaS-Tool.

**Sondern:** Ein Ort (kein Dashboard), an dem Menschen in der Schweiz — besonders Immigrant:innen, Geflüchtete, Expats, neurodivergente Personen, Menschen in Krisensituationen — ihr Leben administrativ ordnen können.

### Leitsatz

> Maloja Plana ist keine generische AI-App.
> Es ist eine ruhige, regelbasierte, schweizerische Lebensinfrastruktur
> mit hochwertiger Informationsarchitektur, klaren Regelwerken und langfristigem Vertrauen.

### Emotionale Ziele (nach 30 Tagen)

Ruhiger. Klarer. Weniger überfordert. Orientierter. Sicherer. Fähiger. Weniger beschämt. Mehr Kontrolle. Weniger fragmentiert. Emotional unterstützt durch Struktur.

### 12 Kernprinzipien

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

## 2. ARCHITEKTUR

### Stack (unverhandelbar)

| Aspekt | Detail |
|--------|--------|
| Framework | React 18 + Vite 4 |
| Rendering | `React.createElement()` — kein JSX-Syntax trotz .jsx-Dateien |
| Styling | 100% Inline-Styles via `palette` Props + CSS Custom Properties (`tokens.css`) |
| Routing | Hash-Router (`#/view` oder `#/chapter/N`) |
| Persistenz | localStorage (`or5_data`, `or5_docs`, `or5_reminders`) + IndexedDB |
| Deployment | Vercel (statisch) |
| Abhängigkeiten | React + React DOM + @vercel/speed-insights — sonst nichts |
| Offline | 100% offline nach erstem Laden (Service Worker) |

### Unveränderliche Bezeichner

Folgende dürfen NICHT geändert werden (bräuchten Migration):
- `or5_data`, `or5_docs`, `or5_reminders` (localStorage Keys)
- `ordnung-ruhe-docs`, `ordnung-ruhe-backups` (IndexedDB Namen)
- `or5_lang`, `or5_beta_access` (localStorage)
- ~80 Button-Unicode-Präfixe (✓ ✕ □) — zu viel Churn

### Datenmodell

- Version: 2 (Migration v1→v2: fullName → firstName + lastName)
- 7 Kapitel: `basis`, `wohnen`, `finanzen`, `versicherungen`, `ausbildung`, `behoerden`, `notfall`
- ~85 Felder, 23 Dokument-Slots
- `getFullName(basisData)` Utility in constants.js

### Runtime-Fundament (vorhanden, aber nicht global integriert)

- Unified State Machine — implementiert
- Subscribable EventBus — implementiert
- Runtime Singleton — implementiert
- **KEIN** globaler React Context/Hook Layer (noch Proof-of-Concept-Stadium)

### ADRs

| ADR | Thema |
|-----|-------|
| ADR-009 | Storage Strategy (localStorage + IndexedDB) |
| ADR-010 | OCR Engine (lokal-erst, CDN-Fallback) |
| ADR-011 | Auth Strategy (kein Auth — local-only) |

---

## 3. UX & VISUAL IDENTITY

### Metapher

"Ein Ort, kein Dashboard" — Editorial Layout, Magazin-Charakter, nicht SaaS-Kartengitter.

### Dashboard

- Malojapass-SVG-Silhouette als topographischer Anker (3-Layer Alpine Profil mit Pass-Sattel)
- 7 Kapitel-Icons als klickbare Stationen entlang des Passwegs
- Kapitel-Liste: Offene Register-Zeilen (borderBottom, keine Karten)

### Palette

Creme / Salbei / Anthrazit / Sand — geerdet, schweizerisch.
13 semantische Farbtöne (bg, surface, up, top, border, text, mid, soft, gold, sage, rose, sky, sand).
Keine gesättigten Primärfarben, keine aggressiven Rot/Grün-Signale.

### Typografie

DM Sans (WOFF2, lokal). Gewichte: 400/500/600. Grössen: 11–36px.

### Icon-System

SVG-Pictogramme (IconSystem.jsx, ~40 Icons). Kapitel-Icons als Stationen auf dem Malojapass-Pfad.

### Micro-Feedback

Stempel-Effekt, Häkchen-Pop, Schloss-Animation, Fade/Slide-Übergänge.
**Anti-Gamification**: Kein XP, keine Scores, keine Streaks — aber visuelle Freude ist erwünscht (satisfying state changes, Fülleffekte, Fortschrittsvisualisierung).

### Design-Audit-Befund (A-030, 2026-05-26)

Kritische Lücke: Design Registry und JSX leben in zwei Welten.
- Typografie zu klein (12px statt 15px → Admin-Panel-Gefühl)
- Materialität fehlt (Schatten/Tiefe-System kaum genutzt)
- "Alles ist beige" — Palette OK, aber semantische Farbdramaturgie fehlt
- Emotional schwere Themen (Sozialhilfe, Schulden, Behörden) erscheinen am kältesten

### Accessibility

Focus-Ring, Skip-to-Content, `prefers-reduced-motion`, ARIA-Labels, Nav-Landmark, Keyboard-navigierbar, alle 17 Views mobile-safe (375px+).

---

## 4. HELVETIA ORIENTATION LAYER

### Konzept

Helvetia ist die Stimme der Orientierung — sachkundig, ruhig, nie belehrend.
Kein Chatbot, kein Avatar, kein Assistent. Erscheint nirgends als Figur.

### V1: 19 Begriffe

AHV, ALV, IV, EO, EL, BVG, Säule 3a, KVG, Franchise, Selbstbehalt, IPV, UVG, Familienzulagen, Bewilligung B, Bewilligung C, Betreibung, Verlustschein, RAV, SKOS.

### Integration

- `orientationRegistry.js` — Zentrales Register
- `i18n/{de,en,fr,it}.js` → `orientation.*`
- Erscheint als sage-farbige Zeile unter Feldern und als Kontext-Hinweise

### Ton-Regeln

Du-Form, 1–2 Sätze, kein Juristendeutsch, keine Panikmache, "könnte"/"je nach Kanton"/"prüfe bei...", nie absolute Aussagen.

---

## 5. SPIEGELUNGEN (MIRROR LAYER)

### Konzept

Phase 3B: Verwandelt Datensammel-Kapitel in "lebendige Räume", die die Lebenssituation einer Person widerspiegeln.

### Implementiert

| Kapitel | Commit | Inhalt |
|---------|--------|--------|
| Basis | `e9fc6f8` | Lebensaussage basierend auf Name, Kanton, Geburtsdatum |
| Wohnen | `ea75fd0` | Wohnsituation, Mietkosten, Adresse |
| Finanzen | `2f7d884` | Einkommen, Ausgaben, Sparen, Kredite |

### Noch nicht implementiert

Versicherungen, Ausbildung, Behörden, Notfall.

---

## 6. BUDGET

### Budget Light V1 (implementiert)

Felder, Gruppierung, ruhige Sprache. Einkommen/Ausgaben-Übersicht.

### Budget Hardening (teilweise)

- Einkommen- und Verpflichtungskategorien erweitert (Commit `22784ea`)
- Presentation und Empty States verfeinert (Commit `037fc86`)

### Blockiert

- **Brutto/Netto-Entscheidung** fehlt — blockiert Budget Hardening Phase 1, Steuer-Integration, IPV im Budget, SKOS-Referenzwerte
- **Household Model** fehlt — blockiert Budget Hardening Phase 2, Kinderzulagen, Alimente, Haushaltsgrößen-Templates

### Bekannte Bugs

- **BVG Double Deduction:** Nettolohn enthält bereits BVG-Abzug; App subtrahiert nochmals
- **SKOS Household Bug:** `householdSize = 1 + dependents` — zählt Kinder als Erwachsene

---

## 7. SCHWEIZER LOGIK

### Implementierte Rechner/Tools

| Tool | Swiss-Spezifisch |
|------|-----------------|
| IPV-Rechner (alle 26 Kantone) | Hoch |
| Sozialhilfe/SKOS-Rechner | Hoch |
| EL-Berechtigungsprüfung | Hoch |
| PLZ→Kanton Zuordnung | Hoch |
| Mietzinslimiten (SKOS) | Hoch |
| KK-Scanner (Barcode/QR/OCR) | Hoch |
| Steuerrechner (Basis) | Mittel |
| Schulden/Betreibung | Hoch |
| AHV-Nummern-Validierung | Hoch |

### Deterministic-First-Prinzip

Alle Regeln/Berechnungen müssen traceable, auditierbar, versioniert, reproduzierbar sein. AI kommt NACH deterministischer Logik — nie statt.

---

## 8. LEGAL & DATENSCHUTZ

### Implementiert

| Element | Status |
|---------|--------|
| LegalView (Datenschutz / Nutzung / Impressum) | Implementiert, 3 Tabs, 4 Sprachen |
| Alpha-Banner | Kompakt, 2 Zeilen, nicht alarmistisch |
| Orientierungsdisclaimer bei Berechnungen | Implementiert (Sozialhilfe, IPV) |
| Nutzungsbedingungen | Implementiert |
| Security Headers (Vercel) | X-Content-Type, X-Frame-Options, Referrer-Policy, Permissions-Policy |

### Ehrliche Position

- Kein Zugriffschutz (kein PIN, keine Biometrie)
- localStorage/IndexedDB unverschlüsselt (Geräte-Verschlüsselung liegt beim Nutzer)
- Backup-Dateien: Klartext JSON
- Vercel Speed Insights: Anonyme Performance-Metriken (nicht deaktivierbar)
- Keine Zertifizierungen (ISO, FINMA, etc.)

### Offene Lücken

- **Impressum-Platzhalter nicht gefüllt** (Name, Adresse, Kontakt fehlen)
- **Feedback-Adresse** fehlt
- Vercel Speed Insights Opt-out nicht vorhanden

---

## 9. BETA

### Implementiert

| Element | Commit |
|---------|--------|
| Beta Gate (Code: `maloja2026`) | `d38a141` |
| Feedback-Link (E-Mail) | `0d05b16` |
| LegalView (3 Tabs) | Vorhanden |
| Vercel Config + Security Headers | Vorhanden |

### Beta-Blocker (P0 — vor öffentlicher Beta)

| Blocker | Status |
|---------|--------|
| Legal sichtbar | **done** |
| Alpha-Hinweis sauber | **done** |
| Datenschutzseite erreichbar | **done** |
| Berechnungen als Orientierung | **done** |
| SKOS-Kinderlogik | **offen** — Fachstelle prüfen |
| Impressum-Platzhalter füllen | **offen** — Sophie-Aktion |
| Build grün + Smoke Test | **done** |
| i18n vollständig | **done** |
| QR offline | **done** |
| Helvetia P0-Set | **done** |

### Vor geschlossener Beta (P1)

| Punkt | Status |
|-------|--------|
| Orientierungssätze | **done** |
| Spiegelungen (Basis, Wohnen, Finanzen) | **done** |
| Mutter-Feedback rekonstruieren | **offen** — Sophie-Aktion |
| Testpersonen durchführen | **offen** — kein Test durchgeführt |
| Finanzen-Gesamtbild | **teilweise** |
| Budget-UX (Geduld/Finesse) | **offen** — blockiert |
| Empty States wärmer | **offen** |

### Scope-Killer (NICHT vor/während Beta)

- AI-Empfehlungen
- Chatbot / Helvetia als Figur
- Gamification
- Kalender-Synchronisation
- Push-Notifications
- Multi-Personen-Profile
- FINMA/ISO-Zertifizierung

---

## 10. KAPITEL-STRUKTUR

### Tier-System (A-026/027/028)

| Tier | Name | Kapitel |
|------|------|---------|
| CORE | "Dein Alltag" | Basis, Wohnen, Finanzen |
| SUPPORTING | "Deine Absicherung" | Versicherungen, Ausbildung |
| PROTECTIVE | "Dein Schutz" | Behörden, Notfall |

### 7 Kapitel

1. **Basis** — Persönliche Daten, AHV, Kanton, Kontakt
2. **Wohnen** — Adresse, Miete, Mietvertrag, Nebenkosten
3. **Finanzen** — Einkommen, Ausgaben, Budget, Steuer
4. **Versicherungen** — KVG, Franchise, BVG, UVG, Hausrat, Reise, Cyber, Auto
5. **Ausbildung** — Aufenthaltsstatus, Beruf, Ausbildung
6. **Behörden** — Betreibung, Behördenkontakte, Verlustscheine
7. **Notfall** — Notfallkontakte, Vollmachten, Organspende, Patientenverfügung

---

## 11. GENERATOREN & EXPORT (implementiert)

| Feature | Output |
|---------|--------|
| CV-Generator | HTML/PDF |
| ZIP-Export | ZIP (JSON + CSV + MANIFEST) |
| Budget-Import | CSV/Excel/eBill → Daten |
| Lebensmappe (Dossier-Preview) | Browser-Print HTML |
| Notfall-Dossier | Browser-Print HTML |
| Meine Unterlagen | Dossier-Eintragsansicht |
| Organspendekarte | QR-Code |
| KK-Scanner | Barcode/QR/OCR → Versicherungsdaten |

---

## 12. i18n

| Sprache | Code | Status |
|---------|------|--------|
| Deutsch | de | Primär |
| Englisch | en | Vollständig (Fallback) |
| Französisch | fr | Vollständig |
| Italienisch | it | Vollständig |
| Romanisch | rm | Basis |

System: Eigene Implementation, `I18nProvider` → `useT()` → `t(key, params)`.
Fallback-Kette: Gewählt → EN → Key.

---

## 13. DOCS-INFRASTRUKTUR

### Registries (in `docs/product/`)

| Datei | Inhalt |
|-------|--------|
| `product-memory-registry.md` | Produktidentität, Entscheidungen, Anti-Patterns, Visual Identity, Features |
| `swiss-knowledge-registry.md` | Schweizer Regeln, Datenquellen, Rechner, Generatoren |
| `system-architecture-registry.json` | Maschinenlesbares Register aller Module (44 Einträge) |
| `design-language-registry.md` | Palette, Typografie, Spacing, Animation, Branding |

### Weitere wichtige Docs

| Datei | Inhalt |
|-------|--------|
| `beta-blockers.md` | Priorisierte Blocker-Liste |
| `beta-test-plan.md` | Testplan (erstellt, NICHT durchgeführt) |
| `household-dependencies.md` | Abhängigkeitsanalyse Household/Brutto-Netto |
| `privacy-security-position.md` | Ehrliche Datenschutz-Positionsbestimmung |
| `helvetia-orientation-layer.md` | Helvetia V1 Dokumentation |
| `anti-patterns.md` | Was die App NIEMALS tun wird |
| `feedback-log.md` | Gesammeltes Feedback |
| `mutter-feedback-status.md` | Status Mutter-Feedback-Rekonstruktion |

---

## 14. BEKANNTE RISIKEN

| Risiko | Schwere |
|--------|---------|
| QR-Code CDN in OrganDonation + KKScanner (offline-Ausfall) | Mittel |
| SKOS zählt Kinder als Erwachsene | Hoch (fachlich) |
| BVG Double Deduction | Mittel |
| localStorage unverschlüsselt | Mittel |
| Backup-Dateien unverschlüsselt | Mittel |
| ~80 Button-Unicode-Präfixe inkonsistent mit SVG-System | Niedrig |
| Design-Registry und JSX divergieren | Hoch (UX-Kohärenz) |
| jsPDF CDN-Import ist toter Code | Niedrig |

---

## 15. KONSOLIDIERUNGSPRIORITÄTEN (definiert, nicht gestartet)

1. **Design System Consolidation** (P1) — Token bridging, Typografie-Lift, Materialität, semantische Farbdramaturgie
2. **Core User Flows** (P2) — Kernmomente: Wohnungswechsel, KK-Wechsel, Dokumente organisieren, Vorsorge erstellen, Behördenbrief
3. **Deterministic Engine Strategy** (P3) — Rule Engine vs AI Assistance klar trennen
4. **Trust & Legal Layer** (P4) — Datenschutz, Auditierbarkeit, Quellenklarheit, Haftung, Versionierung

---

## 16. BEWUSST VERWORFENE / ZURÜCKGESTELLTE IDEEN

### Permanent verworfen

| Idee | Grund |
|------|-------|
| Gamification (XP, Scores, Streaks, Badges) | Widerspricht Produktphilosophie |
| AI-Chatbot / Helvetia als Figur | Helvetia ist Ton, nicht Feature |
| Push-Notifications (Web Push) | Zu intrusiv, braucht Service Worker Permissions |
| User-Tracking / Analytics-Tracking | Widerspricht Privacy-First |
| Dark Patterns (Pre-checked Consent, künstliche Dringlichkeit) | Widerspricht Vertrauens-Philosophie |
| Shame Mechanics ("Du hast dein Budget gesprengt") | Widerspricht emotionaler Sicherheit |
| Autonomous AI Agents | Widerspricht deterministic-first |
| Cloud-Sync / Backend | Widerspricht local-first |

### Zurückgestellt (nach Beta)

| Idee | Grund |
|------|-------|
| Verschlüsselung localStorage/IndexedDB | P2 — nach Beta |
| App-Sperre (PIN/Biometrie) | P2 — nach Beta |
| Backup-Verschlüsselung | P2 |
| Vercel Speed Insights Opt-out | P2 |
| Kuhglocke-Erinnerungen (Fristen) | P2 |
| Erweiterte Verbindungen (EL, RAV, IPV-Hinweise) | P2 |
| Kapitel-Einleitungen als Orientierungsseiten | P2 |
| Export-Architektur erweitern (PDF, JSON, ZIP) | P2 |
| Bundesordner-Metapher im Dokumenten-Tresor | P2 |
| Multi-Sprach-Audit (FR, IT Qualität) | P2 |
| Kantonsspezifische Orientierung | P2 |
| Aufenthaltsstatus-abhängige Orientierung | P2 |
| Multi-Personen-Haushalte als Profile | Architektur-Umbau |

---

## 17. OPEN QUESTIONS — NUR SOPHIE KANN ENTSCHEIDEN

### Blocker-Entscheidungen

1. **Brutto/Netto-Entscheidung** — Wie soll Einkommen erfasst werden? Blockiert Budget Hardening, Steuer-Integration, IPV im Budget, SKOS-Referenzwerte.

2. **Impressum-Daten** — Name, Adresse, Kontakt der Betreiberin müssen eingetragen werden. Rechtliche Pflicht für Beta.

3. **Feedback-Adresse** — Welche E-Mail/URL für Beta-Feedback?

4. **SKOS-Kinderlogik** — Mit Fachstelle abgleichen: Wie werden Kinder vs. Erwachsene in der Sozialhilfe-Berechnung korrekt behandelt?

5. **Mutter-Feedback** — Kann aus Erinnerung rekonstruiert werden? Erneutes Gespräch möglich? Oder als "nicht rekonstruierbar" markieren?

### Richtungs-Entscheidungen

6. **Testpersonen** — Wer testet? Wann? Mindestens 1 vor geschlossener Beta.

7. **Deployment** — Wann geht die geschlossene Beta live auf Vercel?

8. **Household Model Scope** — Wie tief soll es gehen? Singles, Paare, Familien, WGs, Mehrgenerationen? Welche Konstellationen zuerst?

9. **Romanisch** — Volle Unterstützung, teilweise, oder Glossar-basiert?

10. **Spinnennetz-Visualisierung** — Wie soll das Lebensnetz ruhig visualisiert werden?

---

## 18. DATEISTRUKTUR (Zusammenfassung)

```
src/
├── main.jsx                    # Entry point, Router, Auto-Save
├── Dashboard.jsx               # Malojapass-Dashboard
├── ChapterView.jsx             # 7 Kapitel-Renderer
├── BetaGate.jsx                # Beta-Code-Gate
├── LegalView.jsx               # Datenschutz/Nutzung/Impressum
├── MirrorCards.jsx             # Spiegelungsebene
├── IconSystem.jsx              # SVG-Icon-System (~40 Icons)
├── BudgetImport/Sync.jsx       # Budget-Features
├── PremiumSubsidy.jsx          # IPV-Rechner
├── SozialhilfeView.jsx         # SKOS-Rechner
├── TaxCalculator.jsx           # Steuerrechner
├── SchuldenManager.jsx         # Schulden/Betreibung
├── KKScanner.jsx               # KK-Barcode/QR/OCR
├── CVGenerator.jsx             # CV-Generator
├── Lebensmappe.jsx             # Dossier-Preview
├── NotfallDossier.jsx          # Notfall-Dossier
├── MeineUnterlagen.jsx         # Unterlagen-Übersicht
├── DocumentTresor.jsx          # Dokument-Tresor (IndexedDB)
├── OrganDonation.jsx           # Organspendekarte
├── config/
│   ├── constants.js            # Kapitel-Definitionen, Felder, Palette
│   ├── tokens.js               # Design Tokens (JS)
│   ├── cantonalData.js         # Kantone, IPV, SKOS, EL, PLZ
│   └── whitelabel.js           # White-Label-Konfiguration
├── data/
│   └── orientationRegistry.js  # Helvetia-Orientierungssätze
├── i18n/
│   ├── de.js, en.js, fr.js, it.js, rm.js
│   └── index.js                # I18nProvider
├── utils/
│   ├── storage.js, hashRouter.js, autoBackup.js
│   ├── dataMigration.js, dataValidation.js
│   ├── helpers.js, notifications.js
│   ├── backupCrypto.js, docReminders.js
│   └── storageMonitor.js
├── tokens.css                  # CSS Custom Properties
└── print.css                   # Druck-Styles

docs/
├── product/                    # Registries, PRD, Beta-Docs, Feedback
├── architecture/               # ADRs, Domain Mapping, Field Governance
├── governance/                 # Audit-Log, Migration Policy, Versioning
├── roadmap/                    # Phase-Pläne, Backlogs, Sprints
├── design/                     # Design-Docs
├── legal/                      # Rechtliches
├── security/                   # Sicherheits-Docs
├── research/                   # Recherche
└── runtime/                    # Runtime-Architektur-Docs
```

---

*MASTER_CONTEXT_V1.md — Zentrales Referenzdokument für zukünftige Chats.*
*Keine Implementierung. Nur Wissenskonsolidierung.*
