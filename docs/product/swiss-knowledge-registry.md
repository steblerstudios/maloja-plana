# Swiss Knowledge Infrastructure Registry

> Zentrales Verzeichnis aller Schweizer Regelwerke, Datenquellen, Berechnungslogiken
> und domänenspezifischen Wissensbausteine in Maloja Plana.
>
> Prinzip: Jeder Eintrag ist **regelbasiert, deterministisch, auditierbar** —
> keine AI-generierten Wahrheiten, keine Blackbox-Entscheidungen.

Stand: 2026-05-26

---

## 1. Sozialversicherungen & Vorsorge

### 1.1 AHV (Alters- und Hinterlassenenversicherung)
- **Rechtsgrundlage:** AHVG (SR 831.10)
- **Datenquelle:** ahv-iv.ch, BSV
- **Implementiert:** AHV-Nummer-Feld (Basis-Chapter), AHV-Beitragsfeld (Versicherungen-Chapter), Link zu ahv-iv.ch
- **Kantonale Unterschiede:** Nein (Bundesrecht)
- **Geplant:** AHV-Rentenberechnung, Beitragslücken-Prüfung, Rentenalter-Timeline
- **Determinismus:** Vollständig regelbasiert (Beitragsformel, Rentenformel)

### 1.2 IV (Invalidenversicherung)
- **Rechtsgrundlage:** IVG (SR 831.20)
- **Datenquelle:** BSV, ahv-iv.ch
- **Implementiert:** IV-Rente als Eingabefeld in EL-Berechnung
- **Geplant:** IV-Anspruchsprüfung, Eingliederungsmassnahmen-Übersicht

### 1.3 EO (Erwerbsersatzordnung)
- **Rechtsgrundlage:** EOG (SR 834.1)
- **Implementiert:** Nicht direkt — konzeptionell erfasst
- **Geplant:** Militärdienst-/Mutterschaftsentschädigung-Rechner

### 1.4 ALV (Arbeitslosenversicherung)
- **Rechtsgrundlage:** AVIG (SR 837.0)
- **Implementiert:** Nicht direkt
- **Geplant:** Taggeldberechtigung, RAV-Fristen-Tracker, Einstelltage-Logik

### 1.5 BVG (Berufliche Vorsorge / 2. Säule)
- **Rechtsgrundlage:** BVG (SR 831.40)
- **Implementiert:** BVG-Versicherer + BVG-Beitrag (Versicherungen-Chapter), BVG-Rente in EL-Berechnung
- **Geplant:** BVG-Mindestzinssatz, Koordinationsabzug, Umwandlungssatz, Freizügigkeitslogik

### 1.6 Säule 3a / 3b (Private Vorsorge)
- **Rechtsgrundlage:** BVV 3 (SR 831.461.3)
- **Implementiert:** Pension3a + Pension3b Felder (Finanzen-Chapter)
- **Geplant:** Maximalbeitrag-Rechner (aktuell CHF 7'056), Steuerabzug-Simulation

### 1.7 EL (Ergänzungsleistungen)
- **Rechtsgrundlage:** ELG (SR 831.30)
- **Implementiert:** `checkELEligibility()` in cantonalData.js — Berechtigungsprüfung basierend auf Einkommen, Rente, Miete, KK-Prämie
- **Kantonale Unterschiede:** Ja (kantonale Zuschläge, Vermögensfreibeträge)
- **Determinismus:** Regelbasiert, AHV/IV-Bezug als Voraussetzung

### 1.8 Sozialhilfe / SKOS
- **Rechtsgrundlage:** Kantonale Sozialhilfegesetze, SKOS-Richtlinien
- **Implementiert:**
  - `calculateSozialhilfe()` in cantonalData.js
  - `SKOS_GRUNDBEDARF` (1–7 Personen: CHF 1'031–2'891)
  - `CANTONAL_RENT_LIMITS` (11 Kantone + Fallback)
  - Eigene SozialhilfeView.jsx Komponente
- **Kantonale Unterschiede:** Ja (Mietzinslimiten, Zuschläge, Berechnungsmethode)
- **Determinismus:** Vollständig regelbasiert

---

## 2. Krankenversicherung & Gesundheit

### 2.1 KVG (Grundversicherung)
- **Rechtsgrundlage:** KVG (SR 832.10)
- **Implementiert:**
  - Versicherer, Modell, Prämie, Franchise, Kartennummer (Versicherungen-Chapter)
  - KK-Scanner (KKScanner.jsx + kkScanner.js)
  - Franchise-Optionen: 300/500/1000/1500/2000/2500
  - Versicherungsmodell-Optionen: Standard/HMO/Hausarzt/Telemed
- **Datenquelle:** priminfo.admin.ch (Referenz), BAG
- **Geplant:** Prämienvergleich-Engine, TARMED/TARDOC-Leistungsprüfung

### 2.2 IPV (Individuelle Prämienverbilligung)
- **Rechtsgrundlage:** Art. 65 KVG + kantonale Gesetze
- **Implementiert:**
  - `calculateIPV()` in cantonalData.js
  - `CANTONAL_IPV` mit allen 26 Kantonen
  - Pro Kanton: maxIncome, subsidySingle/Family/Child, Modell, Antragshinweis
  - Eigene PremiumSubsidy.jsx Komponente + premiumCalc.js
- **Kantonale Unterschiede:** Ja (komplett kantonal — Einkommensgrenzen, Beiträge, Antragsverfahren)
- **Determinismus:** Regelbasiert, einkommensabhängig oder pauschal

### 2.3 Selbstbehalt & Franchise
- **Rechtsgrundlage:** Art. 64 KVG
- **Implementiert:** Franchise-Auswahl in Versicherungen-Chapter
- **Geplant:** Franchise-Optimierungs-Rechner (Break-even-Analyse), Selbstbehalt-Kalkulation (10%, max. CHF 700)

### 2.4 Organspende
- **Rechtsgrundlage:** Transplantationsgesetz (SR 810.21)
- **Implementiert:** OrganDonation.jsx — Organspendekarte, QR-Code-Generator
- **Datenquelle:** Swisstransplant
- **Hinweis:** QR-Code-CDN-Abhängigkeit (Offline-Risiko)

### 2.5 Patientenverfügung
- **Rechtsgrundlage:** Art. 370–373 ZGB
- **Implementiert:** Feld in Notfall-Chapter + Dokument in Behörden-Chapter
- **Geplant:** Patientenverfügungs-Generator (strukturierter Assistent)

---

## 3. Wohnen & Miete

### 3.1 Mietrecht
- **Rechtsgrundlage:** OR Art. 253ff., VMWG
- **Implementiert:** Mietvertrag-Dokument, Vermieter-Kontakt, Mietzins, Nebenkosten (Wohnen-Chapter)
- **Geplant:** Mietzinsanfechtung-Generator, Kündigungsfristen-Rechner, Referenzzinssatz-Tracking

### 3.2 Wochenaufenthalt
- **Rechtsgrundlage:** Kantonale Meldegesetze
- **Implementiert:** `getResidenceInfo()` — liefert steuer-, KK-, IPV- und Stimmrechts-Hinweise je nach Aufenthaltstyp
- **Kantonale Unterschiede:** Ja

### 3.3 PLZ → Kanton Zuordnung
- **Implementiert:** `cantonFromPLZ()` in cantonalData.js — vollständige PLZ-Bereiche 1000–9999
- **Verwendung:** Automatische Kantonszuordnung bei Eingabe der Postleitzahl

### 3.4 Kantonale Mietzinslimiten (SKOS)
- **Implementiert:** `CANTONAL_RENT_LIMITS` — 11 Kantone + Fallback für Single/Paar/Familie
- **Verwendung:** Sozialhilfe-Berechnung, Wohnkosten-Plausibilisierung

---

## 4. Steuern

### 4.1 Bundessteuer
- **Rechtsgrundlage:** DBG (SR 642.11)
- **Implementiert:** TaxCalculator.jsx (Grundstruktur)
- **Geplant:** Bundessteuer-Berechnung, Abzüge, Progression

### 4.2 Kantonale Steuern
- **Rechtsgrundlage:** StHG (SR 642.14) + kantonale Steuergesetze
- **Implementiert:** Steuerkanton, Steuer-ID, Steuerfrist (Behörden-Chapter)
- **Geplant:** Kantonale Steuerfuss-Integration, Steuervergleich

### 4.3 Steuererklärung
- **Implementiert:** Steuerfrist-Tracking, Pendente Steuererklärungen (Behörden-Chapter)
- **Geplant:** Steuer-Assistent (strukturierter Prozess, keine Beratung)

---

## 5. Schulden & Betreibung

### 5.1 SchKG (Betreibungsrecht)
- **Rechtsgrundlage:** SchKG (SR 281.1)
- **Implementiert:**
  - Betreibungsstatus-Feld (Behörden-Chapter)
  - SchuldenManager.jsx + schuldenCalc.js
  - Betreibungsauszug-Dokument
  - Link zu betreibungsamt.ch
- **Geplant:** Einsprache-Generator (Rechtsvorschlag), Tilgungsplan-Rechner

---

## 6. Arbeit & Bildung

### 6.1 Aufenthalts-/Arbeitsbewilligung
- **Rechtsgrundlage:** AIG (SR 142.20)
- **Implementiert:** Arbeitsbewilligungstyp-Feld (B/C/G/L/F/N/S/Ci)
- **Geplant:** Bewilligungsablauf-Tracker, Verlängerungsfristen

### 6.2 Bildungsanerkennung
- **Rechtsgrundlage:** BBG, SBFI
- **Implementiert:** EFZ-Nummer, Bildungsstufe, Zertifikate (Ausbildung-Chapter)
- **Geplant:** SBFI-Anerkennungsprüfung, Diploma Supplement

### 6.3 CV-Generator
- **Implementiert:** CVGenerator.jsx + cvGenerator.js — generiert strukturierten Lebenslauf aus Profildaten

---

## 7. Vorsorge & Notfall

### 7.1 Vorsorgeauftrag
- **Rechtsgrundlage:** Art. 360–369 ZGB
- **Implementiert:** Vorsorgeauftrag-Feld (Notfall-Chapter)
- **Geplant:** Vorsorgeauftrag-Generator

### 7.2 Testament
- **Rechtsgrundlage:** Art. 498ff. ZGB
- **Implementiert:** Testament-Feld (Behörden-Chapter), Testament-Dokument
- **Geplant:** Testament-Assistent (strukturierte Erfassung, keine Rechtsberatung)

### 7.3 Bestattungswünsche
- **Implementiert:** Bestattungswünsche-Feld (Notfall-Chapter)
- **Geplant:** Bestattungsverfügungs-Generator

### 7.4 Notfallkontakte & Medizinische Daten
- **Implementiert:** Notfallkontakt, Blutgruppe, Allergien, Medikamente, chronische Krankheiten, Arzt, Spital (Notfall-Chapter)
- **Geplant:** Notfall-QR-Code (offline-fähig), Notfallblatt-PDF

---

## 8. Dokumente & Export

### 8.1 Dokument-Tresor
- **Implementiert:** DocumentTresor.jsx — verschlüsselte lokale Dokumentenablage (IndexedDB)
- **Verschlüsselung:** AES-256 via Web Crypto API

### 8.2 ZIP-Export
- **Implementiert:** ZipExport.jsx + zipExport.js — vollständiger Datenexport als ZIP
- **Formate:** JSON (strukturiert), PDF-Metadaten, Dokumentenarchiv

### 8.3 CSV-Import
- **Implementiert:** csvImport.js — Budget-Datenimport aus CSV
- **Verwendung:** BudgetImport.jsx

### 8.4 Backup-System
- **Implementiert:** autoBackup.js — automatische localStorage/IndexedDB-Backups
- **Verschlüsselung:** backupCrypto.js (AES-256)

---

## 9. Kantonale Daten — Implementierungsstand

### 9.1 Vollständig (alle 26 Kantone)
- PLZ → Kanton Zuordnung
- Kantonsnamen (DE)
- IPV-Einkommensgrenzen, Beiträge, Modelle, Antragshinweise
- Kantonsauswahl (Basis + Behörden)

### 9.2 Teilweise (11+ Kantone + Fallback)
- Mietzinslimiten (SKOS): ZH, BE, LU, BS, GE, VD, AG, SG, TI, SO, TG + Default

### 9.3 Geplant
- Kantonale Steuerfüsse
- Kantonale Prämienregionen (KVG)
- Kantonale Sozialhilfe-Zuschläge
- Kantonale Stipendien-Logik
- Kantonale Behördenkontakte

---

## 10. Externe Datenquellen — Referenzregister

| Quelle | URL | Typ | Verwendung | Status |
|--------|-----|-----|------------|--------|
| BAG (Bundesamt für Gesundheit) | bag.admin.ch | Referenz | KVG, Prämien, Franchise | Referenziert |
| priminfo.admin.ch | priminfo.admin.ch | API/Daten | Prämienvergleich | Geplant |
| ESTV | estv.admin.ch | Referenz | Steuerrecht | Verlinkt |
| BSV (Bundesamt für Sozialversicherungen) | bsv.admin.ch | Referenz | AHV/IV/EO/EL | Referenziert |
| ahv-iv.ch | ahv-iv.ch | Referenz | AHV-Informationen | Verlinkt |
| monokk.ch | monokk.ch | Referenz | KK-Informationen | Verlinkt |
| betreibungsamt.ch | betreibungsamt.ch | Referenz | Betreibungsrecht | Verlinkt |
| SBFI | sbfi.admin.ch | Referenz | Bildungsanerkennung | Geplant |
| Swisstransplant | swisstransplant.org | Referenz | Organspende | Referenziert |
| SKOS | skos.ch | Richtlinien | Sozialhilfe-Standards | Implementiert |

---

## 11. Generatoren — Übersicht

| Generator | Status | Datei | Regelbasiert | CH-spezifisch |
|-----------|--------|-------|--------------|---------------|
| CV-Generator | Implementiert | CVGenerator.jsx, cvGenerator.js | Ja | Ja (Bewilligungstyp, EFZ) |
| ZIP-Export | Implementiert | ZipExport.jsx, zipExport.js | Ja | Ja (CH-Datenstruktur) |
| KK-Scanner | Implementiert | KKScanner.jsx, kkScanner.js | Ja | Ja (KVG-Karte) |
| Budget-Import (CSV) | Implementiert | BudgetImport.jsx, csvImport.js | Ja | Teilweise |
| Budget-Sync | Implementiert | BudgetSync.jsx, budgetSync.js | Ja | Ja |
| Schulden-Rechner | Implementiert | SchuldenManager.jsx, schuldenCalc.js | Ja | Ja (SchKG) |
| IPV-Rechner | Implementiert | PremiumSubsidy.jsx, premiumCalc.js | Ja | Ja (26 Kantone) |
| Steuer-Rechner | Implementiert (Basis) | TaxCalculator.jsx | Ja | Ja |
| Einsprache-Generator | Geplant | — | Ja | Ja (SchKG, OR) |
| Brief-Generator | Geplant | — | Ja | Ja |
| Formular-Generator | Geplant | — | Ja | Ja |
| Bestattungs-Generator | Geplant | — | Ja | Ja (ZGB) |
| Vorsorge-Generator | Geplant | — | Ja | Ja (ZGB) |
| Versicherungsanschreiben | Geplant | — | Ja | Ja |
| Behördenantworten | Geplant | — | Ja | Ja |
| Fristenschreiben | Geplant | — | Ja | Ja |

---

## 12. Prinzipien der Wissensinfrastruktur

1. **Regelbasiert, nicht AI-generiert** — Jede Berechnung, jeder Hinweis basiert auf nachvollziehbaren Regeln und Rechtsgrundlagen
2. **Versionierbar** — Alle Daten und Regeln sind in Code oder strukturierten Dateien, versioniert via Git
3. **Auditierbar** — Jede Berechnung ist reproduzierbar, jede Quelle nachvollziehbar
4. **Exportierbar** — Alle Nutzerdaten können als JSON/ZIP exportiert werden
5. **Kantonal differenziert** — Wo nötig, kantonale Unterschiede explizit modelliert
6. **Quellenangabe** — Jede Regel verweist auf die Rechtsgrundlage (SR-Nummer oder Quelle)
7. **Kein juristischer Rat** — Hinweise, keine Beratung; Disclaimer an allen sensiblen Stellen
8. **Offline-fähig** — Alle Regeln und Berechnungen lokal ausführbar, keine API-Abhängigkeit im Kern
