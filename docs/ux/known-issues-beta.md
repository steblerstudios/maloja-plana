# Known Issues — Beta (Stand 2026-06-22)

> Diese Liste ist für Tester gedacht. Hier stehen Dinge, die wir kennen und bewusst noch nicht behoben haben.

---

## Rechner-Einschränkungen

| Thema | Was passiert | Auswirkung |
|---|---|---|
| **Sozialhilfe: Haushalt** | Berechnung nimmt `1 + Abhängige` statt differenzierte SKOS-Zusammensetzung (Erwachsene vs. Kinder) | Betrag kann bei Familien leicht abweichen |
| **Steuerrechner** | Kantonale Schätzung basiert auf Hauptort-Multiplikatoren, nicht auf exaktem kantonalem Tarif | Betrag kann je nach Gemeinde abweichen |
| **IPV** | Pauschale Schätzung, nicht kantonal differenziert | Anspruch kann kantonal anders sein |

## Visuelle Inkonsistenzen

| Thema | Was passiert |
|---|---|
| **Button-Icons** | ~80 Buttons verwenden Unicode-Zeichen (←, →, ○) statt SVG-Icons |

## Funktionale Hinweise

| Thema | Was passiert |
|---|---|
| **Daten nur lokal** | Alles liegt im Browser-Speicher. Browser-Cache löschen = Daten weg. Backup-Funktion nutzen! |
| **Kein Account** | Kein Login, keine Cloud-Sync. Daten existieren nur auf diesem Gerät/Browser |
| **Demo-Modus** | «Beispiel ansehen» zeigt eine fiktive Person (Maria Muster). Diese Daten werden nicht gespeichert |
| **Sprachen** | FR/IT/EN sind maschinell übersetzt und nicht professionell lektoriert |
| **OCR-Scan** | KK-Karten OCR-Erkennung (Tesseract) entfernt — QR/Barcode-Scan funktioniert weiterhin offline |

## Erledigte Verbesserungen (aus Alpha-Feedback)

| Thema | Status |
|---|---|
| **Budget: Orientierung** | Erledigt — BudgetSync zeigt Gesamtbild mit Gruppen |
| **Franchise: Erklärung** | Erledigt — Orientierungssatz auf Feld (4 Sprachen) |
| **KVG-Kontext** | Erledigt — Orientierungssatz auf KK-Feldern (4 Sprachen) |
| **BVG/AHV: In-Context-Hinweis** | Erledigt — Orientierungssätze auf BVG/AHV-Feldern |
| **QR via CDN** | Erledigt — QR-Generierung war bereits lokal (qrcodejs vendor), Tesseract-CDN entfernt |
| **Sozialhilfe-Disclaimer** | Erledigt — Gold-Rand + Hintergrund, visuell deutlich sichtbar |
| **Steuerrechner: Kantonale Steuer** | Erledigt — Kantons-/Gemeindesteuer-Schätzung (26 Kantone, Hauptort-Multiplikatoren) |
| **PDF-Export: Behörden-Dossier** | Erledigt — Dossier mit Berechnungen für Sozialamt-Termine (Browser-Print) |
| **BVG-Doppelabzug** | Erledigt — BVG/AHV werden als Referenz geführt, nicht von Ausgaben abgezogen |

## Nicht-Ziele dieser Beta

- Keine Formulare für Behörden (kommt später)
- Kein Multi-Gerät-Sync (bewusste Designentscheidung: local-first)

---

## Feedback geben

Nutze das Feedback-Formular in der App (unten im Dashboard) oder schreib direkt an Sophie.
