# Known Issues — Beta (Stand 2026-06-22)

> Diese Liste ist für Tester gedacht. Hier stehen Dinge, die wir kennen und bewusst noch nicht behoben haben.

---

## Rechner-Einschränkungen

| Thema | Was passiert | Auswirkung |
|---|---|---|
| **Sozialhilfe: Haushalt** | Berechnung nimmt `1 + Abhängige` statt differenzierte SKOS-Zusammensetzung (Erwachsene vs. Kinder) | Betrag kann bei Familien leicht abweichen |
| **BVG-Abzug** | Nettolohn enthält bereits BVG, App subtrahiert nochmals | Verfügbares Einkommen wird leicht zu tief angezeigt |
| **Steuerrechner** | Nur Bundessteuer (DBG Art. 36), keine Kantons-/Gemeindesteuer | Betrag ist tiefer als reale Steuerlast |
| **IPV** | Pauschale Schätzung, nicht kantonal differenziert | Anspruch kann kantonal anders sein |

## Visuelle Inkonsistenzen

| Thema | Was passiert |
|---|---|
| **Button-Icons** | ~80 Buttons verwenden Unicode-Zeichen (←, →, ○) statt SVG-Icons |
| **Organspende-QR** | QR-Generator lädt noch via CDN (rest der App ist offline-fähig) |

## Funktionale Hinweise

| Thema | Was passiert |
|---|---|
| **Daten nur lokal** | Alles liegt im Browser-Speicher. Browser-Cache löschen = Daten weg. Backup-Funktion nutzen! |
| **Kein Account** | Kein Login, keine Cloud-Sync. Daten existieren nur auf diesem Gerät/Browser |
| **Demo-Modus** | «Beispiel ansehen» zeigt eine fiktive Person (Maria Muster). Diese Daten werden nicht gespeichert |
| **Sprachen** | FR/IT/EN sind maschinell übersetzt und nicht professionell lektoriert |

## Offene Verbesserungen (aus Alpha-Feedback)

| Thema | Feedback | Status |
|---|---|---|
| **Budget: Orientierung fehlt** | Budget-Bereich zeigt nur Felder, kein Gesamtbild, keine Orientierungssätze | Geplant |
| **Franchise: Erklärung fehlt** | Kein Orientierungssatz beim Franchise-Feld (was bedeutet Franchise?) | Geplant |
| **KVG-Kontext fehlt** | Kein Hinweis zur obligatorischen Grundversicherung bei KK-Feldern | Geplant |
| **BVG/AHV: In-Context-Hinweis** | Kein Orientierungssatz direkt bei BVG/AHV-Feldern (nur Alpha-Banner) | Geplant |
| **Sozialhilfe-Disclaimer** | Disclaimer-Text vorhanden, aber visuell zu leise — könnte übersehen werden | Geplant |

## Nicht-Ziele dieser Beta

- Kein PDF-Export (kommt später)
- Keine Briefgeneratoren (kommt später)
- Keine Formulare für Behörden (kommt später)
- Kein Multi-Gerät-Sync (bewusste Designentscheidung: local-first)

---

## Feedback geben

Nutze das Feedback-Formular in der App (unten im Dashboard) oder schreib direkt an Sophie.
