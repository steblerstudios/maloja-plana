# Helvetia Orientation Layer — V1

> Stand: 2026-05-29
> Status: V1 implementiert und aktiv

---

## Was ist die Helvetia-Schicht?

Die Helvetia-Schicht ist eine ruhige Orientierungsebene innerhalb von Maloja Plana. Sie erklärt Schweizer Begriffe und Systeme — direkt dort, wo der Nutzer sie braucht.

Helvetia ist **kein Chatbot**, **kein Avatar**, **kein Assistent**. Helvetia erscheint nirgends sichtbar als Figur.

Helvetia ist die **Stimme der Orientierung** — sachkundig, ruhig, nie belehrend.

---

## Was sie erklärt (V1 — 19 Begriffe)

### Sozialversicherungen (1. Säule)
- **AHV** — Sozialversicherungsnummer und Altersvorsorge
- **ALV** — Arbeitslosenversicherung
- **IV** — Invalidenversicherung
- **EO** — Erwerbsersatzordnung
- **EL** — Ergänzungsleistungen

### Berufliche Vorsorge (2. Säule)
- **BVG** — Pensionskasse

### Private Vorsorge (3. Säule)
- **Säule 3a** — Steuerlich begünstigte Vorsorge

### Krankenversicherung
- **KVG** — Obligatorische Grundversicherung
- **Franchise** — Jährlicher Selbstbehalt
- **Selbstbehalt** — 10% Kostenbeteiligung
- **IPV** — Prämienverbilligung

### Unfallversicherung
- **UVG** — Obligatorische Unfallversicherung

### Familie
- **Familienzulagen** — Kinderzulagen nach Kanton

### Aufenthalt
- **Bewilligung B** — Aufenthaltsbewilligung (befristet)
- **Bewilligung C** — Niederlassungsbewilligung (unbefristet)

### Schulden & Betreibung
- **Betreibung** — Betreibungsregister
- **Verlustschein** — Abgeschlossene Betreibung, offene Forderung

### Arbeit & Soziales
- **RAV** — Regionale Arbeitsvermittlung
- **SKOS** — Sozialhilfe-Richtlinien

---

## Wo sie erscheint (V1)

### Als Feld-Orientierung (unter dem Eingabefeld)
- `basis` → AHV-Nummer
- `versicherungen` → Krankenkasse (KVG), Franchise, BVG-Pensionskasse, UVG, AHV-Beitrag
- `finanzen` → Säule 3a
- `ausbildung` → Aufenthaltsbewilligung
- `behoerden` → Betreibungsregister

### Als Kontext-Hinweis (über den Feldern, datenabhängig)
- `finanzen` → IPV-Hinweis (wenn Einkommen + Kanton vorhanden)
- `basis` → Familienzulagen-Hinweis (wenn Kinder vorhanden)

---

## Was sie bewusst NICHT macht

| Nicht | Warum |
|-------|-------|
| Keine Rechtsberatung | Orientierung ≠ Beratung. Nutzer werden an Behörden/Fachstellen verwiesen. |
| Keine Berechnungen | Die Schicht rechnet nichts. Bestehende Rechner (IPV, SKOS, Budget) bleiben separat. |
| Keine KI | Alle Sätze sind statisch, menschlich formuliert, in i18n-Dateien gespeichert. |
| Keine Empfehlungen | "Könnte relevant sein" ≠ "Du solltest". Keine Handlungsanweisungen. |
| Keine Bewertungen | Keine Scores, keine Ampeln, keine "Du hast X% erledigt". |
| Keine Popups/Modals | Orientierung erscheint inline, leise, als Teil des Formular-Flusses. |

---

## Architektur

### Registry
`src/data/orientationRegistry.js` — Zentrales Register aller Schweizer Begriffe mit:
- Schlüssel (`key`)
- Kapitelzuordnung (`chapter`)
- Feldzuordnung (`fieldKey`)
- Priorität (`p0` = sichtbar, `p1` = vorbereitet, `p2` = Referenz)

### i18n
`src/i18n/{de,en,fr,it}.js` → `orientation.*` — Alle Sätze in 4 Sprachen.

### Integration
`src/config/constants.js` — Felder tragen `orientation`-Property.
`src/ChapterView.jsx` — Rendert `field.orientation` als sage-farbige Zeile unter dem Feld.

### Styling
- Farbe: `palette.sage` (Orientierung unterscheidet sich visuell von normalen Hints)
- Format: `○ [Satz]`
- Kontexthinweise: Sage-Hintergrund mit leichtem Rand

---

## Ton-Regeln (Helvetia-Stimme)

1. Du-Form, immer
2. Ein Satz, maximal zwei
3. Kein Juristendeutsch, kein Behördenjargon
4. Keine Panikmache, keine Dringlichkeit
5. "Könnte", "je nach Kanton", "prüfe bei..." — nie absolute Aussagen
6. Quellenverweis nur bei konkreten Zahlen (z.B. "Maximalbetrag 2026")
7. Alle Sprachen gleichwertig — DE ist nicht privilegiert

---

## Nächste Schritte (nicht jetzt)

- P1: Orientierungssätze für EL, RAV, SKOS, Verlustschein in Kontexthinweisen
- P1: Spiegelungsebene pro Kapitel (zeigt Gesamtbild + Orientierung)
- P2: Aufenthaltsstatus-abhängige Orientierung (B vs. C spezifische Hinweise)
- P2: Kantonsspezifische Orientierung (z.B. "In Zürich ist die IPV-Grenze bei...")
