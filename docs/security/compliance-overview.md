# Compliance-Übersicht — Maloja Plana

**Stand: Juni 2026**

---

## Anwendbare Regulierungen

| Regulierung | Status | Bemerkung |
|---|---|---|
| **nDSG** (Schweizer Datenschutzgesetz) | Konform | Datenschutzerklärung + Bearbeitungsverzeichnis vorhanden |
| **DSGVO/GDPR** | Nicht direkt anwendbar | Kein EU-Targeting, keine Datenverarbeitung in EU |
| **ISO 27001:2022** | Dokumentation vorbereitet | Kein Audit durchgeführt |
| **WCAG 2.1 AA** | Teilweise konform | Barrierefreiheitserklärung vorhanden |
| **eCH-0059** | Orientierung | Schweizer Accessibility-Standard |

---

## nDSG-Compliance

| Anforderung | Artikel | Umsetzung | Dokument |
|---|---|---|---|
| Datenschutzerklärung | Art. 19 | Vorhanden | `datenschutzerklaerung-ndsg.md` |
| Bearbeitungsverzeichnis | Art. 12 | Vorhanden | `bearbeitungsverzeichnis-ndsg.md` |
| Datensicherheit | Art. 8 | AES-256 Backup, CSP, Security Headers | `encryption.md`, `architecture.md` |
| Privacy by Design | Art. 7 | Local-First, keine Datenerhebung | Architektur-Entscheidung |
| Auskunftsrecht | Art. 25 | Nicht anwendbar (kein Datenzugriff durch Anbieterin) | — |
| Meldepflicht Datenverlust | Art. 24 | Nicht anwendbar (keine serverseitigen Daten) | `incident-response.md` |

---

## ISO 27001:2022 — Dokumentationsstatus

| Annex-A-Control | Thema | Dokument | Status |
|---|---|---|---|
| A.5.1 | Informationssicherheitsrichtlinien | `architecture.md` | Vorhanden |
| A.5.12 | Klassifikation von Informationen | `data-classification.md` | Vorhanden |
| A.5.23 | Informationssicherheit in der Cloud | — | Nicht anwendbar (local-first) |
| A.5.31 | Gesetzliche Anforderungen | `compliance-overview.md` (dieses Dokument) | Vorhanden |
| A.6.1 | Screening | — | Einzelperson, nicht anwendbar |
| A.8.1 | User Endpoint Devices | `trust-boundaries.md` | Vorhanden |
| A.8.9 | Configuration Management | `CLAUDE.md`, `vite.config.js` | Vorhanden |
| A.8.12 | Data Leakage Prevention | `never-export-data.md`, `data-flow.md` | Vorhanden |
| A.8.13 | Backup | `backup-strategy.md` | Vorhanden |
| A.8.24 | Kryptographie | `encryption.md` | Vorhanden |
| A.8.25 | Secure Development | `CLAUDE.md`, CI/CD | Vorhanden |
| A.8.28 | Secure Coding | CSP, Input-Validierung, React XSS-Schutz | Implementiert |

---

## Swiss Made Software / Digital Trust Label

### Swiss Made Software
- Entwicklung: Schweiz (Basel)
- Hosting: GitHub Pages (Microsoft/US) — **nicht qualifizierend**
- Alternative für Qualifikation: Hosting bei Schweizer Provider (Infomaniak, Hostpoint)

### Digital Trust Label (Swiss Digital Initiative)
Anforderungen und Status:
| Kriterium | Status |
|---|---|
| Sicherheit | Teilweise (CSP, Encryption, keine Server-Daten) |
| Datenschutz | Stark (local-first, nDSG-konform) |
| Zuverlässigkeit | Beta-Phase, noch nicht produktionsreif |
| Faire Interaktion | Umgesetzt (keine Dark Patterns, transparente Rechner) |
| Kinderschutz | Nicht spezifisch adressiert |

---

## Offene Punkte für Zertifizierung

| Punkt | Priorität | Aufwand |
|---|---|---|
| Markenanmeldung IGE | Hoch | CHF 550, 3–6 Monate |
| Penetration Test | Mittel | Extern beauftragen |
| WCAG-Audit mit Screenreader | Mittel | 1–2 Tage |
| Swiss Hosting (für Swiss Made Label) | Niedrig | Hosting-Wechsel |
| Professionelles Lektorat FR/IT/EN | Niedrig | Extern beauftragen |
| ISO 27001 Zertifizierung | Langfristig | Externer Auditor, CHF 5'000–15'000 |
