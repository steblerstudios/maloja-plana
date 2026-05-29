# Mutter-Feedback — Statusmatrix

> Stand: 2026-05-29
> Quelle: `docs/product/feedback-log.md` (FB-017 + rekonstruierte Punkte)
> Zweck: Klare Übersicht, was umgesetzt ist, was offen bleibt, was Sophie klären muss.

---

## Status-Legende

| Status | Bedeutung |
|--------|-----------|
| done | Umgesetzt und verifiziert |
| partial | Teilweise umgesetzt, Lücken bestehen |
| open | Nicht umgesetzt |
| deferred | Bewusst zurückgestellt |
| needs-input | Sophie muss klären / rekonstruieren |

---

## Feedback-Matrix

| # | Feedbackpunkt | Status | Umgesetzt in | Was fehlt | Nächste Aktion |
|---|---------------|--------|-------------|-----------|----------------|
| 1 | Alpha-Banner zu alarmistisch / zu gross | **done** | `Dashboard.jsx`, i18n `alpha.*` (alle 4 Sprachen) | — | Erledigt: Kompakter Banner, 2 Zeilen statt Bullet-Liste |
| 2 | SKOS mit Kindern falsch berechnet | **partial** | `SozialhilfeView.jsx` hat Kinder-Logik, aber FB-005 markiert als "needs-verification" | Kantonale Unterschiede bei Kinder-Grundbedarf nicht vollständig | Sophie: SKOS-Kinderlogik mit Fachstelle abgleichen |
| 3 | BVG/AHV nur Referenzwerte | **partial** | Alpha-Banner kennzeichnet es als Orientierung; Berechnungen in `premiumCalc.js` | Kein In-Context-Hinweis direkt bei BVG-Feldern | P1: Orientierungssatz bei BVG/AHV-Feldern |
| 4 | KKScanner nicht mit Kapiteln verbunden | **done** | `main.jsx` — KKScanner `onSave` schreibt in `versicherungen` + `basis.ahv` | — | Verbindung existiert seit A-024 |
| 5 | Keine Rechtsberatung | **done** | Alpha-Banner, Legal-View (`LegalView.jsx`), Nutzungsbedingungen | — | Erledigt |
| 6 | Keine Finanzberatung | **done** | Alpha-Banner, Legal-View, Nutzungsbedingungen | — | Erledigt |
| 7 | Budget braucht mehr Geduld / Finesse | **open** | — | Budget-Bereich zeigt nur Felder, keine Orientierung, kein Gesamtbild | P1: Spiegelungsebene Finanzen, sanftere Struktur |
| 8 | Franchise-Erklärung fehlt (FB-021) | **open** | — | Kein Orientierungssatz bei Franchise-Feld | P1: Helvetia-Orientierungssatz (1 Satz) |
| 9 | KVG-Kontext fehlt (FB-022) | **open** | — | Kein Kontext zur obligatorischen Grundversicherung | P1: Orientierungssatz bei KK-Feldern |
| 10 | Sozialhilfe darf nicht falsche Sicherheit geben | **partial** | `SozialhilfeView.jsx` hat Disclaimer-Text | Disclaimer visuell zu leise, könnte übersehen werden | P1: Disclaimer prominenter + in Legal referenziert |

---

## Mutter-Feedback — Rekonstruktionsstatus

| Frage | Antwort |
|-------|---------|
| Wer genau ist "Mutter" im Feedback-Log? | **Unklar.** FB-017 sagt "Mutter", FB-012–016 sagen "Family feedback (domain expert)". Sophie muss klären, ob das dieselbe Person ist. |
| Was hat Mutter konkret zum Budget gesagt? | **Nicht dokumentiert.** Einzige Referenz: "Budget still needs more patience and finesse." |
| Wurden weitere Gespräche geführt? | **Nicht dokumentiert.** Rekonstruktions-Template in `feedback-log.md` (Zeile 264–300) wurde erstellt, aber nicht ausgefüllt. |

### Nächste Aktion

Sophie muss entscheiden:
1. Kann sie aus Erinnerung rekonstruieren, was Mutter gesagt hat? → Dann als FB-Einträge aufnehmen
2. Ist ein erneutes Gespräch möglich? → Dann mit dem Rekonstruktions-Template durchgehen
3. Bleibt es unklar? → Dann als "nicht rekonstruierbar" markieren und die generischen Punkte (Budget-Geduld, Finesse) als eigenständige UX-Aufgaben behandeln
