# Seiten-Architektur November 2026 · Entscheidungsblatt

**Anlass, 06.11.2026:** In der Icon-Besprechung (Zweig `docs/icon-plan`, PR #708) blieben IPV, Prämien und
Sozialhilfe offen. Stebler Studios: «ich denke, wir kommen hier an einen Seiten- und hierarchischen Punkt
und Architekturfrage: was unterliegt welchem Kapitel … auch ein wenig die Dashboard-Frage».

**Was diese Besprechung klärt:** Für jede Seite das **Kapitel** (eins der 7, bestimmt die Navigation und die
Leitform des Icons) und den **Ast** (einer der 11 Lebensbereiche, bestimmt die Farbe). Dazu, was das
Dashboard zeigt und in welcher Ordnung.

**So gehen wir vor:** eine Frage nach der anderen, je mit Bild (heute + A/B/C + Empfehlung). Jeder Entscheid
kommt sofort hierher. **Gebaut wird nichts**, bis alles entschieden ist und Stebler Studios Ja sagt. Eine
Idee gilt erst als entschieden, wenn sie auf echten Seiten gezeigt wurde.

**Grundlage, Stand `main` `9ef00b4e`:** `data/lebensbereiche.js` (11 Äste, `chapterKey`) · `config/constants.js`
(`CHAPTER_KEYS`, 7 Kapitel) · `AblaufSchale.jsx` (`KAPITEL_OHNE_EIGENES`: Gesundheit + Vorsorge → Versicherungen,
Arbeit → Ausbildung, Familie → Basis) · `config/ansichtenRegister.js` (Feld `bereich`, 36 Abläufe) ·
`data/werkzeugRegister.js` (Feld `fach`) · `data/aufgabenBereiche.js` · `Lebensbaum.jsx` (`connections`) ·
`components/WerkzeugGruppen.jsx` · `ArztkofferView.jsx`.

## Die Fragen

| # | Frage | Bild | Empfehlung | Entscheid |
|---|---|---|---|---|
| 1 | IPV, Prämien, Sozialhilfe | [1](seiten-architektur-1-ipv-praemien-sozialhilfe.html) | Regel «Kapitel = die Sache, um die es geht, Geld spielt mit (gold)». IPV → Versicherungen (folgt der Krankenkasse) · Prämien → Versicherungen · Sozialhilfe → Finanzen, Behörden spielt mit | offen |
| 2 | Gesundheit als Kapitel, Notfall darin | — | | offen |
| 3 | Alle Seiten durchgehen | — | | offen |
| 4 | Dashboard: was und in welcher Ordnung | — | | offen |

## Befunde

- **Sozialhilfe hängt heute an drei Orten:** Merkliste/Kalender Finanzen (`werkzeugRegister` Fach `geld`) ·
  Lebensbaum Behörden-Ast (`Lebensbaum.jsx`, `connections`, Kommentar «Sozialhilfe-Orientierung am
  Behörden-Ast» — zur Balance, max. 2 Früchte je Ast) · Schnellcheck Salbei (`Schnellcheck.jsx`).
- **IPV** hängt an vier Orten, dreimal Versicherungen, einmal als Querverweis im Kapitel Finanzen.
- **Prämien** (`praemien`, «Versicherungs-Übersicht») ist überall Versicherungen.
