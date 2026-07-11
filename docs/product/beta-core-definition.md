# A-034 — Beta Core Definition

> Was Maloja Plana in der ersten Beta wirklich ist.
> Nicht alles. Nicht die ganze Vision. Aber das Richtige.
>
> Stand: 2026-05-27

---

## Beta-Versprechen

Maloja Plana ist ein ruhiger Ort, um dein Leben in der Schweiz zu organisieren.

Nicht eine Finanz-App.
Nicht eine Notiz-App.
Nicht ein AI-Tool.
Nicht ein Verwaltungsportal.

Sondern: ein Ort, an dem du weisst, wo alles ist.

**Für Menschen, die:**
- sich im Schweizer Alltag orientieren wollen
- Formulare, Fristen, Versicherungen und Behörden als belastend erleben
- wissen wollen, was ihnen zusteht
- einen einzigen Ort für ihre Haushaltsinformationen brauchen
- vorbereitet sein wollen, nicht überrascht

**Kernversprechen:**
Du weisst, wo alles ist. Du bist vorbereitet.

**Was Maloja Plana von anderen unterscheidet:**

| Andere | Maloja Plana |
|--------|--------------|
| Verwaltungsapps digitalisieren Formulare | Maloja Plana erklärt, warum du sie brauchst |
| Finanzapps überwachen dein Ausgabeverhalten | Maloja Plana zeigt ruhig, wo dein Geld hingeht |
| Notizapps speichern Text | Maloja Plana strukturiert dein Leben in Kapitel |
| AI-Tools generieren Antworten | Maloja Plana gibt dir deterministische, nachvollziehbare Orientierung |

---

## 1. Beta-Kern (MUSS enthalten sein)

### 1.1 Was bereits gebaut ist und bleibt

16 Views, 33 Source-Dateien, 7'231 Zeilen Code, 676KB dist, 5 Sprachen.

| Bereich | View/Datei | Status | Beta-Aktion |
|---------|-----------|--------|-------------|
| Dashboard + Malojapass SVG | Dashboard.jsx | Done | Behalten |
| 14 Lebenskapitel | ChapterView.jsx | Done | Behalten |
| Dokumenten-Tresor (IndexedDB) | DocumentTresor.jsx | Done | Behalten |
| KK-Scanner (QR-Karte) | KKScanner.jsx + kkScanner.js | Done | Behalten |
| Budget-Sync (Basisversion) | BudgetSync.jsx + budgetSync.js | Done | **Erweitern** (A-034 Budget) |
| Schulden-Manager | SchuldenManager.jsx + schuldenCalc.js | Done | Behalten |
| Steuer-Rechner | TaxCalculator.jsx | Done | Behalten |
| Organspende-Karte | OrganDonation.jsx | Done | Behalten |
| IPV-Rechner (26 Kantone) | PremiumSubsidy.jsx + premiumCalc.js | Done | Behalten |
| CV-Generator | CVGenerator.jsx + cvGenerator.js | Done | Behalten |
| Sozialhilfe-View (SKOS) | SozialhilfeView.jsx | Done | **Bug fixen** (Household) |
| ZIP-Export | ZipExport.jsx + zipExport.js | Done | Behalten (als Backup) |
| Budget-Import (CSV) | BudgetImport.jsx + csvImport.js | Done | Behalten |
| Charts | ChartsAdvanced.jsx | Done | Behalten |
| Kalender-Erinnerungen | CalendarReminders.jsx | Done | Behalten |
| Benachrichtigungen | NotificationSettings.jsx | Done | Behalten |
| Onboarding | Onboarding.jsx | Done | Behalten |
| i18n (EN/DE/FR/IT + RM) | src/i18n/*.js | Done | **Bug fixen** (Hardcoded German) |
| Dark Mode | ThemeToggle.jsx | Done | Behalten |
| Hash-Routing (16 Views) | utils/hashRouter.js | Done | Behalten |
| Icon-System (SVG) | IconSystem.jsx | Done | Behalten |
| CSP + SRI + Encrypted Backup | Diverse | Done | Behalten |

**Das ist die Basis. 28 Features. Funktioniert. Lokal. Offline.**

### 1.2 Bug-Fixes (Vertrauensschutz)

Ohne diese Fixes ist die Beta nicht vertrauenswürdig:

| Bug | ID | Warum kritisch | Blocker |
|-----|-----|---------------|---------|
| SKOS: Kinder = Erwachsene | MP-BUG-001 | Falsche Berechnungen zerstören Vertrauen | Household Model (minimal) |
| Hardcoded German in cantonalData.js | MP-BUG-002 | i18n-Bruch fuer 3 von 4 Sprachen | Keiner |
| QR-Code CDN-Abhaengigkeit | MP-BUG-003 | Offline-Versprechen gebrochen | Keiner |
| BVG Doppelabzug (Brutto/Netto) | MP-BUG-005 | Status unklar, muss geklaert werden | Entscheidung von Stebler Studios |

### 1.3 Budget Hardening (Light)

Nicht: vollstaendige Finanzsoftware.
Sondern: ruhige Schweizer Haushaltsuebersicht.

**Was hinzukommt (Minimum):**

| Kategorie | Was konkret | Warum |
|-----------|------------|-------|
| Brutto/Netto-Toggle | Einkommensfeld mit Umschaltung | Schweizer Grundunterscheidung |
| Fixkosten erweitern | Steuern, Internet/Telefon, Lebensmittel, OeV | Aktuell nur 5 Posten — unrealistisch |
| Schulden-Integration | SchuldenManager-Raten im Budget sichtbar | Existiert separat, aber nicht verknuepft |
| IPV als Entlastung | Berechnete IPV im Budget anzeigen | Rechner existiert, Budget ignoriert es |
| Versicherungen | Haftpflicht + Hausrat als Budget-Posten | Felder existieren, aber nicht im Budget |
| Calm Budget Sprache | Keine Judgment-Texte mehr | "Expenses critical!" -> ruhige Orientierung |

**Was NICHT in Beta:**
Abo-Management, Nebenerwerb, Auto-Kosten-Detail, Benchmarks, AI-Vorschlaege.

**Details:** `budget-recovery-scope.md`

### 1.4 Household Model (Minimal)

Nicht: vollstaendiges Familiensystem.
Sondern: Erwachsene + Kinder + Pensioniert-Flag.

| Was | Warum |
|-----|-------|
| Anzahl Erwachsene im Haushalt | SKOS-Berechnung, Budget-Templates |
| Anzahl Kinder (mit Alter) | SKOS-Berechnung, Kinderzulagen |
| Pensioniert-Flag | AHV/BVG-Relevanz, Budget-Unterschied |

**Entblockt direkt:**
- SKOS-Bug-Fix (Kinder ≠ Erwachsene)
- Kinderzulagen als Einnahme
- Alimente als Einnahme/Ausgabe
- Haushaltsbezogene Budget-Templates

**Was NICHT in Beta:**
Partner-Verknuepfung, Eltern-Kind-Sichtbarkeit, WG-Modell, Volljährigkeits-Uebergabe.

### 1.5 Export: "Meine Unterlagen" (2 Dossiers)

Nicht: Dateiformat-Werkzeugkasten.
Sondern: ruhiger Lebensbereich.

**Beta-Scope:**

| Dossier | Inhalt | Zielperson |
|---------|--------|------------|
| **Lebensmappe** | Alle Kapitel-Zusammenfassungen, Budget-Uebersicht, Dokumenten-Liste, Versicherungen, Fristen | Ich selbst |
| **Notfalldossier** | Notfallkontakte, Blutgruppe, Allergien, Medikamente, Arzt, Patientenverfuegung (ja/nein), Vorsorgeauftrag (ja/nein), Organspende-Status | Familie/Angehoerige |

**Produktflow:**
```
#/unterlagen (neuer Bereich)
├── Dossier erstellen
│   ├── Lebensmappe
│   └── Notfalldossier
├── Vorschau (was enthalten, was fehlt)
└── PDF herunterladen
```

**Was NICHT in Beta:**
Behoerden-Dossier, Steuer-Dossier, Wohnungs-Dossier, Verschluesselung, E-Mail-Versand.

**Details:** `export-dossier-concept.md`

### 1.6 Legal (Pflicht)

Ohne diese Dokumente darf die App nicht veroeffentlicht werden:

| Dokument | ID | Warum |
|----------|-----|------|
| Impressum | MP-LEG-001 | Schweizer Recht: Pflicht fuer jede oeffentliche Website |
| Datenschutzerklaerung | MP-LEG-002 | DSG/DSGVO: Pflicht bei Verarbeitung personenbezogener Daten |
| Nutzungsbedingungen (AGB) | MP-LEG-003 | Haftungsausschluss, Nutzungsregeln |

**Hinweis:** Die App speichert alles lokal. Kein Backend, kein Cloud-Sync, keine Cookies. Die Datenschutzerklaerung kann deshalb kurz und klar sein. Aber sie muss existieren.

### 1.7 Hardcoded German Fix

| Datei | Problem | Aufwand |
|-------|---------|---------|
| src/i18n/de.js (+ en/fr/it) | cantonalData.js gibt deutsche Strings zurueck statt i18n-Keys | Mittel |
| premiumCalc.js | Ebenfalls hardcoded German | Klein |

Dies ist der einfachste Fix mit dem hoechsten Impact: 3 von 4 Sprachen funktionieren korrekt danach.

---

## 2. Beta-Wuenschenswert (SOLL, wenn moeglich)

| # | Was | Warum | Abhaengigkeit |
|---|-----|-------|---------------|
| 1 | Emotionale Temperatur schwerer Screens | SozialhilfeView, SchuldenManager, TaxCalculator sollen nicht kalt wirken | Keine technische |
| 2 | AHV/BVG/ALV Basis-Orientierung | Schweizer Kernwissen als Info-Sektionen (nicht Rechner) | Content-Arbeit |
| 3 | Template Engine Core + Briefgenerator | Erster nicht-CV-Generator, beweist System | MP-GEN-016 |
| 4 | Kuendigungsschreiben (Mietvertrag) | Hoher Alltagsnutzen, konkreter Anwendungsfall | Template Engine |
| 5 | Mietbeitrags-Hinweis (kantonal) | Haeufiger Bedarf fuer Zielgruppe | Content |
| 6 | Vorsorge-Dokument-Existenz-Checks | PV, Vorsorgeauftrag, Bestattungswuensche: "Hast du eins? Wo ist es?" | Keine technische |
| 7 | PWA / Service Worker | Echte Offline-Zuverlaessigkeit, Add-to-Homescreen | MP-INF-001 |
| 8 | AHV-Nummer visuelles Masking | Sensible Daten nicht offen anzeigen | MP-VER-015 |

---

## 3. Scope-Killer (NICHT Beta)

### 3.1 Phase 1 Governance Runtime

**26 geplante Items. 24 davon noch nicht gebaut.**

| Scope-Killer-Grund | Erklaerung |
|---------------------|------------|
| **Ueberengineering fuer Single-User** | Audit Logger, Approval Gates, Evidence Register, Module Registry — all das ist sinnvoll fuer Multi-User-Systeme mit AI-Agents. Fuer eine lokale Single-User-App ist es Infrastruktur ohne Nutzernutzen. |
| **Massive Scope-Explosion** | 24 Items, davon Ingestion Pipeline (8 Stages), Rule Schema (9 Typen), Approval Wiring — das sind Monate Arbeit. |
| **Kein User-Facing Value** | Kein einziger dieser Items erzeugt direkten Nutzen fuer einen Menschen, der sein Leben organisieren will. |

**Empfehlung:** Governance Runtime ist richtig fuer Phase 2/3, wenn Multi-User, AI-Agents oder Organisation-Rollout kommen. Fuer Beta: ueberspringen. Die bestehende localStorage + IndexedDB Persistenz + Encrypted Backup reicht.

**Was davon trotzdem sinnvoll ist (aber als Quality, nicht Governance):**
- E2E Integration Tests (MP-P1-022) — Quality
- Mobile QA 375px (MP-P1-023) — Quality
- Dark Mode QA (MP-P1-024) — Quality
- Performance Gate <200KB (MP-P1-026) — Bereits erfuellt (676KB dist, ~136KB gzipped)

### 3.2 Phase 2 Workflow Engine

**25 geplante Items. 0 gebaut.**

Workflow DAG, Executor, Role Definitions, Policy Engine, Agent Runtime Sandbox, State Snapshot Engine, Rollback Executor — all das ist eine eigenstaendige Plattform innerhalb der Plattform.

**Scope-Killer-Grund:** Dies ist ein Multi-Monats-Projekt. Kein einziger User braucht einen Workflow DAG-Executor, um sein Budget zu verstehen.

**Empfehlung:** Komplett post-beta. Kein einziges Item.

### 3.3 AI-Assistenten & Agents

9 Items, 0 gebaut. ValidationAdvisor, ImportMapper, AnomalyDetector, ComplianceChecker, Agent Sandbox, Suggestion API, Agent Sidebar, AI Act Compliance, Ethik-Framework.

**Scope-Killer-Grund:**
- AI-Agents brauchen die Governance Runtime (die wir fuer Beta ueberspringen)
- AI Act Compliance ist regulatorisch komplex
- Suggestion API + Zero-Trust Sandbox sind eigenstaendige Systeme
- Kein User-Bedarf: Die App funktioniert deterministisch

**Empfehlung:** Komplett post-beta. Maloja Plana ist explizit deterministic-first.

### 3.4 Volle Generator-Welt

17 Generatoren sind "idea". Nur CV-Generator existiert.

**Scope-Killer-Grund:**
- Jeder Generator braucht kantonale Varianten (26 Kantone)
- Patientenverfuegung, Vorsorgeauftrag: medizinisch/juristisch sensitiv
- IPV-Antrag: kantonale Formular-Unterschiede
- Template Engine Core muss zuerst gebaut werden

**Beta-Grenze:** Maximal Template Engine + 2 einfache Generatoren (Briefgenerator + Kuendigungsschreiben). Rest post-beta.

### 3.5 Volle kantonale Abdeckung

Die IPV-Berechnung deckt alle 26 Kantone ab. Das ist beeindruckend. Aber fuer jedes weitere Feature (Steuerfuesse, Mietbeitraege, Stipendien, Behoerdenformulare) 26 Kantone abzudecken, explodiert den Scope.

**Beta-Grenze:** Neue kantonale Features starten mit 5-6 Referenzkantonen (ZH, BE, BS, GE, LU, TI). Volle Abdeckung post-beta.

### 3.6 Scanner-Systeme

Versicherungs-Scanner (OCR), KK-Abrechnungs-Scanner, Dokumenten-Scanner (Tesseract.js) — alles nur Idee.

**Scope-Killer-Grund:** OCR ist technisch fragil, braucht viel Testdaten, funktioniert schlecht auf Mobilgeraeten, und die Engine (Tesseract.js) ist gross (~4MB).

**Empfehlung:** Post-beta. KK-Scanner (QR) existiert bereits und reicht.

### 3.7 Multi-Account & Rollen

6 Items: Familien-Uebergabe, Eltern-Kind-Verknuepfung, Medizinisches Personal, Multi-Device Sync, Delegation, Notfall-Zugriff.

**Scope-Killer-Grund:** Braucht Backend, Auth, Sync — alles nicht vorhanden, alles nicht Beta.

### 3.8 REST API & externe Schnittstellen

9 Items: REST API, OpenAPI, CalDAV, Google Calendar, mailto, QR-Bill, BAG API, BFS Daten, CRDT Sync.

**Scope-Killer-Grund:** Maloja Plana ist lokal-first. APIs brauchen Backend. CRDT Sync ist ein Forschungsprojekt.

**Beta-Ausnahme:** mailto: (MP-API-005) ist sinnvoll und einfach.

---

## 4. Foundation Blockers

Systeme, die zuerst stabil sein muessen, bevor andere Bereiche wachsen koennen.

### 4.1 Household Model (Minimal)

| Feld | Wert |
|------|------|
| **Warum kritisch** | Blockiert SKOS-Bug-Fix, Alimente, Kinderzulagen, Budget-Templates, Retirement-Flag |
| **Abhaengige Bereiche** | Budget (5+), Sozialhilfe (2+), Export/Dossier (2+) |
| **Beta-Relevanz** | Core — ohne Household ist Budget-Hardening halb, SKOS falsch, Familienlogik unmoeglich |
| **Prioritaet** | 1 (zusammen mit Hardcoded German Fix) |
| **Scope** | NUR: Anzahl Erwachsene, Anzahl Kinder + Alter, Pensioniert-Flag |
| **Nicht-Scope** | Partner-Verknuepfung, Sichtbarkeitssteuerung, WG, Mehrgenerationen |

### 4.2 Brutto/Netto-Entscheidung

| Feld | Wert |
|------|------|
| **Warum kritisch** | Alle Budget-Berechnungen haengen davon ab, ob das Einkommensfeld Brutto oder Netto meint |
| **Abhaengige Bereiche** | Budget (alle), Steuerberechnung, SKOS-Referenzwerte, IPV-Berechnung |
| **Beta-Relevanz** | Core |
| **Prioritaet** | 1 (Entscheidung, nicht Implementation) |
| **Empfehlung** | Netto als Default (was auf dem Konto ankommt), Brutto als optionale Eingabe |

### 4.3 Hardcoded German Fix

| Feld | Wert |
|------|------|
| **Warum kritisch** | cantonalData.js und premiumCalc.js geben deutsche Strings statt i18n-Keys zurueck. 3 von 4 Sprachen sind dadurch gebrochen. |
| **Abhaengige Bereiche** | Alle kantonsabhaengigen Anzeigen, IPV-Berechnung, KK-Scanner |
| **Beta-Relevanz** | Core |
| **Prioritaet** | 1 (kleinster Aufwand, groesster Impact) |

### 4.4 Backlog Canonicalization

| Feld | Wert |
|------|------|
| **Warum kritisch** | 3 Backlog-Systeme mit 3 ID-Schemata. Cross-Referenzen unmoeglich. Doppelerfassungen. |
| **Abhaengige Bereiche** | Projektsteuerung, Priorisierung, Fortschrittsmessung |
| **Beta-Relevanz** | Prozess-Hygiene (nicht user-facing) |
| **Prioritaet** | 2 |
| **Naechster Schritt** | backlog-registry.json von 48 auf 260+ Eintraege erweitern |

### 4.5 Feedback Recovery (Stebler Studios, manuell)

| Feld | Wert |
|------|------|
| **Warum kritisch** | Testperson G-Feedback nicht dokumentiert. Family-Expert nicht zugeordnet. Ohne Recovery gehen Einsichten verloren. |
| **Abhaengige Bereiche** | Priorisierung, Produktentscheidungen |
| **Beta-Relevanz** | Prozess-Hygiene |
| **Prioritaet** | 2 (nur Stebler Studios kann das) |
| **Status** | Template in feedback-log.md erstellt (A-033). Aktion von Stebler Studios ausstehend. |

---

## 5. Product Core Flows

Nicht Features. Lebenssituationen.

### Flow 1: "Ich will mein Budget verstehen"

| Feld | Wert |
|------|------|
| **Zielperson** | Jede/r — Single, Familie, Paar, Pensionierte |
| **Haeufigkeit** | Monatlich, bei Veraenderungen sofort |
| **Emotionales Gewicht** | Hoch — Geld ist Stress. Muss ruhig sein. |
| **Datenbedarf** | Einkommen, Fixkosten, Versicherungen, Schulden-Raten |
| **Exportbedarf** | Teil der Lebensmappe |
| **Beta-Relevanz** | **Core** — groesste Nutzerlücke |
| **Aktueller Stand** | 1 Einnahme + 5 Ausgaben. Unbrauchbar fuer echten Alltag. |
| **Beta-Ziel** | 1 Einnahme (Brutto/Netto) + 10-12 Ausgaben-Kategorien + Schulden-Integration + IPV + Calm Sprache |

### Flow 2: "Ich muss zum Amt — was brauche ich?"

| Feld | Wert |
|------|------|
| **Zielperson** | Neuzuzueger, Sozialhilfe-Bezueger, Migrant:innen |
| **Haeufigkeit** | 2-5x pro Jahr |
| **Emotionales Gewicht** | Sehr hoch — Angst, Unsicherheit, Scham |
| **Datenbedarf** | Personalien, Aufenthaltsstatus, AHV, Wohnadresse, Familienstand, relevante Dokumente |
| **Exportbedarf** | Behoerden-Dossier (post-beta) oder Lebensmappe (beta) |
| **Beta-Relevanz** | **Important** — Kapitel enthalten die Daten, Export als Lebensmappe deckt Grundbedarf |
| **Beta-Ziel** | Alle relevanten Daten in Kapiteln erfasst + als Lebensmappe exportierbar |

### Flow 3: "Was passiert, wenn mir etwas zustosst?"

| Feld | Wert |
|------|------|
| **Zielperson** | Jede/r mit Angehoerigen |
| **Haeufigkeit** | 1x erstellen, jaehrlich pruefen |
| **Emotionales Gewicht** | Sehr hoch — Sterblichkeit, Verletzlichkeit |
| **Datenbedarf** | Notfallkontakte, medizinische Daten, Vorsorgedokumente, Organspende |
| **Exportbedarf** | Notfalldossier (Beta-Core) |
| **Beta-Relevanz** | **Core** — hoher emotionaler und praktischer Wert |
| **Aktueller Stand** | Notfallkontakte + Organspende existieren. PV/Vorsorgeauftrag als Checkliste. |
| **Beta-Ziel** | Notfalldossier als PDF mit allen relevanten Daten |

### Flow 4: "Steht mir Praemienverbilligung zu?"

| Feld | Wert |
|------|------|
| **Zielperson** | Geringverdienende, Familien, Sozialhilfe-Bezueger |
| **Haeufigkeit** | Jaehrlich (KK-Wechselfrist Oktober-November) |
| **Emotionales Gewicht** | Mittel — finanziell relevant, nicht emotional belastend |
| **Datenbedarf** | Einkommen, Kanton, Haushalt |
| **Exportbedarf** | Nein (Ergebnis wird angezeigt) |
| **Beta-Relevanz** | **Core** — bereits implementiert (26 Kantone), Schweizer USP |
| **Aktueller Stand** | Funktioniert. IPV-Rechner vollstaendig. |
| **Beta-Ziel** | Behalten + IPV-Ergebnis ins Budget integrieren |

### Flow 5: "Ich will alle meine Unterlagen auf einen Blick"

| Feld | Wert |
|------|------|
| **Zielperson** | Jede/r |
| **Haeufigkeit** | Nach grossen Aenderungen, vor Behördengaengen |
| **Emotionales Gewicht** | Positiv — Kontrolle, Uebersicht, Ruhe |
| **Datenbedarf** | Alle Kapitel-Zusammenfassungen |
| **Exportbedarf** | Lebensmappe (Beta-Core) |
| **Beta-Relevanz** | **Core** — Kernproduktversprechen |
| **Aktueller Stand** | ZIP-Export existiert, aber technisch, nicht menschlich |
| **Beta-Ziel** | "Meine Unterlagen" Bereich + Lebensmappe als PDF |

### Flow 6: "Wie funktioniert AHV / BVG / Krankenkasse?"

| Feld | Wert |
|------|------|
| **Zielperson** | Neuzuzueger, junge Erwachsene, Migrant:innen |
| **Haeufigkeit** | Bei Lebenswechseln (neuer Job, Umzug, Pensionierung) |
| **Emotionales Gewicht** | Mittel — Orientierungsbedarf, kein akuter Stress |
| **Datenbedarf** | Minimal — primaer Info-Content + Links |
| **Exportbedarf** | Nein |
| **Beta-Relevanz** | **Important** — Schweizer USP, aber Info-Content reicht |
| **Beta-Ziel** | Kurze Info-Sektionen innerhalb der Kapitel: Was ist das? Was muss ich tun? Wohin wende ich mich? |

### Flow 7: "Meine Schulden verstehen"

| Feld | Wert |
|------|------|
| **Zielperson** | Verschuldete Personen, Sozialhilfe-Bezueger |
| **Haeufigkeit** | Monatlich |
| **Emotionales Gewicht** | Sehr hoch — Scham, Angst, Ohnmacht |
| **Datenbedarf** | Schulden-Betraege, Glaeubiger, Raten, Betreibungen |
| **Exportbedarf** | Teil der Lebensmappe, spaeter Behoerden-Dossier |
| **Beta-Relevanz** | **Core** — SchuldenManager existiert, muss ins Budget integriert werden |
| **Aktueller Stand** | SchuldenManager funktioniert isoliert. Nicht im Budget sichtbar. Sprache noch kalt. |
| **Beta-Ziel** | Schulden-Raten im Budget + Calm Sprache |

---

## 6. Nicht Beta (Post-Beta / Future)

### 6.1 Explizit deferred — mit Begruendung

| Bereich | Eintraege | Phase | Begruendung |
|---------|-----------|-------|-------------|
| **Phase 1 Governance Runtime** | 24 von 26 | Post-Beta | Single-User-App braucht keine Audit Trails, Approval Gates, Evidence Register. Lokal gespeicherte Daten brauchen keine Governance-Infrastruktur. |
| **Phase 2 Workflow Engine** | 25 von 25 | Post-Beta | DAG-Executor, Rollback Engine, Policy Engine — eigenstaendige Plattform. Kein User-Bedarf. |
| **AI Agents** | 9 von 9 | Post-Beta | Braucht Governance Runtime. App ist deterministisch. AI ist optional. |
| **Multi-Account / Rollen** | 6 von 6 | Post-Beta | Braucht Backend, Auth, Sync. |
| **REST API / externe Schnittstellen** | 8 von 9 | Post-Beta/Future | Lokal-first. Kein Backend vorhanden. |
| **Scanner-Systeme (OCR)** | 3 von 3 | Post-Beta | Tesseract.js ist 4MB+. Fragil auf Mobilgeraeten. |
| **Volle kantonale Erweiterung** | Diverse | Post-Beta | IPV (26 Kantone) reicht. Neue Features starten mit 5-6 Referenzkantonen. |
| **Generatoren (15 von 17)** | 15 Items | Post-Beta/Future | Braucht Template Engine. Kantonale Varianten. Juristisch sensitiv (PV, Vorsorgeauftrag). |
| **Versicherungs-Details** | 5+ Items | Post-Beta | Franchise-Optimierung, BAG-API, TARMED — zu spezialisiert fuer Beta. |
| **Dokument-Erweiterungen** | 7 von 9 | Post-Beta | OCR, Versionierung, Volltext-Suche, Relational — nuetzlich, nicht essentiell. |
| **Erinnerungs-Erweiterungen** | 7 von 9 | Post-Beta | Smarte Intervalle, Push Notifications, Life-Event-Checklisten. |
| **UX-Erweiterungen** | 12 von 25 | Post-Beta/Future | Raetoromanisch, TTS, Piktogramm-Flows, Spinnennetz-Viz, Globale Suche. |
| **Sicherheits-Erweiterungen** | 6 von 12 | Post-Beta | WebAuthn, 2FA, Penetration Test — wichtig, aber nicht fuer lokale Beta. |
| **Langfristige Vision** | 8 von 8 | Future | Mobilitaets-Modul, Inventar, Community, Mini-Job, Monetarisierung. |

### 6.2 Zahlen

| Kategorie | Total Backlog | Beta-Kern | Beta-Wuenschenswert | Post-Beta | Future |
|-----------|--------------|-----------|---------------------|-----------|--------|
| Bereits gebaut | 28 | 28 | — | — | — |
| Neu fuer Beta | — | ~15 | ~8 | — | — |
| Deferred | ~225 | — | — | ~140 | ~85 |

**Beta = ~43 Items (28 bestehend + 15 neue). Statt 260.**

Das ist die Fokussierung.

---

## 7. Empfohlene Beta-Reihenfolge

```
SOFORT (Stebler Studios, manuell):
  → Testperson G-Feedback rekonstruieren (feedback-log.md)
  → Family Expert Feedback zuordnen
  → BVG-Bug-Status klaeren
  → Brutto/Netto-Entscheidung treffen

SCHRITT 1 — Vertrauen reparieren:
  1. Hardcoded German Fix          [Klein, sicher, hoher Impact]
  2. QR-Code CDN Fix               [Klein, sicher]

SCHRITT 2 — Foundation bauen:
  3. Household Model (Minimal)     [Entblockt SKOS + Budget + Alimente]
  4. SKOS-Bug-Fix                  [Blockiert von Household]

SCHRITT 3 — Kernnutzen staerken:
  5. Budget Hardening (Light)      [Groesste Nutzerlücke]
  6. Calm Budget Sprache           [Produktversprechen]

SCHRITT 4 — Produktidentitaet:
  7. "Meine Unterlagen" Bereich    [Neuer Bereich #/unterlagen]
  8. Lebensmappe PDF               [Kernexport]
  9. Notfalldossier PDF            [Emotionaler Wert]

SCHRITT 5 — Pflicht:
  10. Impressum                    [Gesetzlich]
  11. Datenschutzerklaerung        [Gesetzlich]
  12. Nutzungsbedingungen          [Gesetzlich]

WENN ZEIT:
  13. Template Engine + Briefgenerator
  14. AHV/BVG/ALV Info-Sektionen
  15. Emotionale Temperatur
  16. PWA / Service Worker
```

---

## 8. Beta-Metriken

Wann ist die Beta bereit?

| Kriterium | Messung | Ziel |
|-----------|---------|------|
| Bugs mit Vertrauensimpact | MP-BUG-001, 002, 003 | 0 offen |
| Budget-Kategorien | Einnahmen + Ausgaben | ≥ 12 sinnvolle Posten |
| Export-Dossiers | Funktionsfaehige PDF-Exporte | ≥ 2 (Lebensmappe + Notfall) |
| Sprachen korrekt | i18n ohne Hardcoded Strings | 4 von 4 (EN/DE/FR/IT) |
| Legal vorhanden | Impressum + DSE + AGB | 3 von 3 |
| SKOS korrekt | Kinder ≠ Erwachsene | Berechnung korrekt |
| Household | Erwachsene + Kinder + Pensioniert | Implementiert |
| Calm Budget | Keine Judgment-Sprache | 0 Judgment-Texte |
| Dist-Groesse | Gzipped Bundle | < 200KB |
| Mobile | 375px Responsive | Funktioniert |

---

*Dokument: beta-core-definition.md v1.0.0*
*Erstellt: 2026-05-27 (A-034)*
*Keine Implementation — nur Scope-Definition.*
