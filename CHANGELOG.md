# Changelog

Alle wesentlichen Änderungen an Maloja Plana werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

---

## [Unreleased]

### Geändert
- **Finanz-Daten auf Stand 1.1.2026 (quellenverifiziert)**: AHV-/BVG-Werte (Min-/Max-Rente, Ehepaar-Plafond, Koordinationsabzug, Eintrittsschwelle, Grenzbeträge), Säule-3a-Höchstabzüge und SKOS-Grundbedarf aktualisiert. Direkte Bundessteuer auf den amtlichen ESTV-Tarif 2026 umgestellt (Stufen + Abzüge) — die Berechnung deckt sich nun aufs Rappen mit der ESTV-Tariftabelle. Quellen: BSV, ESTV/EFD (kalte Progression), SKOS.

### Behoben
- **SKOS-Doppelquelle**: `cantonalData.js` und `sozialhilfeRechner.js` zeigten widersprüchliche Grundbedarfs-Werte (1'031 vs. 1'061) im selben Sozialhilfe-View; vereinheitlicht und mit Konsistenz-Test abgesichert.

---

## [0.1.0-beta] — 2026-06-23

### Hinzugefügt
- **Wartungs-Infrastruktur**: Automatische Quartals-Erinnerungen via GitHub Actions, Wartungskalender, Claude-Wartungs-Prompts
- **Ticketing**: GitHub Issue Templates (Bug, Feature, Wartung)
- **Changelog**: Dieses Dokument

### Geändert
- Version von `0.1.0-alpha` auf `0.1.0-beta` aktualisiert

---

## [0.1.0-alpha.8] — 2026-06-23

### Hinzugefügt
- **Print-Stylesheet**: Sauberes A4-Layout, Footer/Header ausgeblendet
- **Unicode-Fix**: `font-variant-emoji: text` verhindert Emoji-Rendering auf Android
- **CTA-Bereinigung**: Doppelter Demo-Button auf Dashboard entfernt

### Geändert
- `known-issues-beta.md` komplett überarbeitet (28 erledigte Verbesserungen dokumentiert)

---

## [0.1.0-alpha.7] — 2026-06-23

### Hinzugefügt
- **Bundle-Splitting**: PLZ- und Prämien-Daten als separate Chunks (247KB → 124KB)
- **Error Boundaries**: Per-View Fehlerbehandlung (App crasht nicht komplett)
- **A11y**: Skip-Link, focus-visible, ARIA-Labels, Logo als Keyboard-Link
- **Rätoromanisch 100%**: 2000+ Keys, volle DE-Parität

### Geändert
- PraemienOrientierung-Chunk von 247KB auf 124KB reduziert

---

## [0.1.0-alpha.6] — 2026-06-22

### Hinzugefügt
- **Trust-Panel**: Aufklappbare Datenschutz-Erklärung im Footer (5 Sprachen)
- **PWA**: manifest.id für stabiles Install-Tracking
- **SEO**: canonical, Schema.org, OG/Twitter Cards, SafeSearch-Rating
- **Ressourcen**: Threema, SecureSafe, IncaMail, Beratungsstellen, Petitionen
- **KVG-Leistungen**: Franchise-Tracker und Rechnungserklärung
- **Feature-Walkthrough**: Alle 15 Views systematisch verifiziert

---

## [0.1.0-alpha.5] — 2026-06-21

### Hinzugefügt
- **Finanz-Übersicht**: Kompaktansicht aller Rechner-Ergebnisse + BFS-Branchenvergleich
- **Cross-Links**: Steuer-, IPV-, Sozialhilfe-, Vorsorge-Rechner verlinken zueinander
- **Dashboard-Snippets**: Versicherungen, Behörden, Notfall, Finanzen
- **Behörden-Checkliste**: Interaktive Checkliste (localStorage-persistent, 5 Sprachen)
- **Demo-Einstieg**: Prominente Demo-Card für Erstnutzer
- **Dropdown-UX**: Custom Chevron + appearance:none für alle Selects

---

## [0.1.0-alpha.4] — 2026-06-20

### Hinzugefügt
- **Fortschrittskarte**: Status-Label über Berglandschaft + Kapitel-Labels
- **Rätoromanisch**: 5. Sprache (Grundausstattung)
- **3a-Guthaben-Feld**: Eigenes Eingabefeld für Säule-3a-Stand
- **Sozialhilfe**: Rückzahlungs-Info + Disclaimer visuell hervorgehoben

---

## [0.1.0-alpha.3] — 2026-06-19

### Hinzugefügt
- **Kantonale Links**: Direkt-Links zu allen 26 Kantonen
- **Behörden-Dossier**: JSON-Export für Sozialamt-Termine
- **Backup-Versionierung**: Automatische Versionierung bei Export

---

## [0.1.0-alpha.2] — 2026-06-18

### Hinzugefügt
- **Design-Asymmetrie**: Layout-Verfeinerungen (A-030 Audit)
- **17 kaputte Links gefixt**: Kantonal + federal
- **SW-Cache v7**: Service Worker Cache-Invalidierung

---

## [0.1.0-alpha.1] — 2026-06

### Hinzugefügt
- **Phase 5 komplett**: Encrypted Backup (AES-256-GCM), Data Validation, Print CSS
- **Phase 4 komplett**: Alle 7 Kapitel, Rechner (Steuer, IPV, Sozialhilfe, Vorsorge, EO, Budget)
- **Phase 3 komplett**: i18n (DE/EN/FR/IT), Datenimport, Migration
- **Phase 2 komplett**: Dashboard, Navigation, Theme Toggle
- **Phase 1 komplett**: Grundstruktur, BetaGate, localStorage
