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
| 1 | IPV, Prämien, Sozialhilfe | [1](seiten-architektur-1-ipv-praemien-sozialhilfe.html) | Regel «Kapitel = die Sache, um die es geht, Geld spielt mit (gold)». IPV → Versicherungen (folgt der Krankenkasse) · Prämien → Versicherungen · Sozialhilfe → Finanzen, Behörden spielt mit | ✅ **06.11.: IPV = A, Sozialhilfe = A** (Stebler Studios: «a anfang und am ende») — IPV: Kapitel Versicherungen, Fünfliber gold im Abzeichen, folgt der Krankenkasse · Sozialhilfe: Kapitel Finanzen, Abzeichen Behörden. Regel «Kapitel = die Sache, um die es geht» damit angenommen. 🔄 **Prämien offen:** «bei der Prämie denke ich halt noch an die Gesundheit» → Bild [1b](seiten-architektur-1b-praemien.html) |
| 2 | Gesundheit als Kapitel, Notfall darin | — | | offen |
| 3 | Alle Seiten durchgehen | — | | offen |
| 4 | Dashboard: was und in welcher Ordnung | — | | offen |

## Zuerst das Organigramm (06.11.2026, Stebler Studios)

Wörtlich: «wollen wir nicht die Seitenlogiken ein wenig zuerst beantworten, bevor wir hier was teilen … Gesundheit
ist eine Kategorie und der Notfall gehört zur Gesundheit wie die Vorsorge zur Versicherung … deshalb müssen wir
uns zuerst ein Seiten- und Logik-Organigramm anschauen und dann können wir die Seiten und Zeichen richtig verbinden».
→ **Prämien (1b) zurückgestellt**, bis das Organigramm steht. Frage 2 wird Teil des Organigramms.
Bild [Organigramm](seiten-architektur-organigramm.html): heute (7 Kapitel, 4 Äste ohne Kapitel) → Vorschlag
(Kapitel Gesundheit mit den Ästen Gesundheit + Notfall; 7 Kapitel, 11 Äste) mit allen Seiten, dazu sieben offene
Stellen ①–⑦ (Krankenkasse, Verfügungen, Steuern, Bestattung/Organspende, ALV/EO, Löhne, Lehre/Lebenslauf).
✅ **06.11.: Gerüst angenommen** (Stebler Studios: «Ja, weiter mit ①») — **Kapitel Gesundheit mit den Ästen Gesundheit
und Notfall** (ersetzt das Kapitel «Notfall»), 7 Kapitel, 11 Äste, je Kapitel ein oder zwei Äste. Schlüssel `notfall`
und Daten bleiben. Die offenen Stellen ①–⑦ werden einzeln entschieden.

### ① Krankenkasse

Bild [Krankenkasse](seiten-architektur-2-krankenkasse.html): A teilen (Vertrag = Versicherungen, Abzeichen orange ·
Leistungen/Belege/Unfall = Gesundheit, Abzeichen Mini-Schild) · B alles Versicherungen · C alles Gesundheit.
Empfehlung A. Befund: «Zusatz wechseln» ist seit 27.10. Teil von «KK wechseln» (`#/zusatzwechsel` leitet um) —
im Organigramm darum keine eigene Seite. ✅ **06.11.: A, teilen** (Stebler Studios: «A, teilen»).
- **Versicherungen (Vertrag):** KK-Erstanmeldung · KK wechseln (Grund + Zusatz) · Versicherungs-Übersicht · IPV.
  Abzeichen orange (Gesundheit spielt mit), IPV gold (Geld).
- **Gesundheit (was die Kasse zahlt):** KVG-Leistungen · KK-Belege · Unfall/Krankheit. Abzeichen Mini-Schild.
- Damit **1b erledigt:** Versicherungs-Übersicht = Kapitel Versicherungen, Abzeichen orange (= Variante B von 1b).
- Arztkoffer behält «KK wechseln» als Weg (Querverweis), nicht als Fach. Felder bleiben im Kapitel Versicherungen.

### ② + ④ Verfügungen und Wünsche

Befund: Patientenverfügung, Vorsorgeauftrag, Organspende, Bestattungswünsche bilden heute schon **einen Block
«Vorsorge» im Kapitel Notfall** (`i18n` `vorsorge: { organDonor, patientenverfuegung, vorsorgeauftrag,
bestattungswuensche }`, Brotkrume «Übersicht › Notfall › Bestattungswünsche»). Das Register ist uneinig
(Vorsorge · Gesundheit · ohne Ast). Bild [Verfügungen](seiten-architektur-3-verfuegungen.html): A alles im Ast
Notfall (Kapitel Gesundheit) · B aufteilen · C alles Vorsorge. Empfehlung A (geändert gegenüber dem Organigramm,
wo der Vorsorgeauftrag noch bei Vorsorge stand: ein Ablauf deckt beide Verfügungen, die Felder stehen zusammen).
Offen.

## Befunde

- **Betreibungsauszug:** Register `bereich: 'finanzen'`, in der Icon-Besprechung 06.11. aber Behörden entschieden
  («der Auszug darf Behörden sein»). Im Organigramm bei Behörden; das Register zieht beim Bau nach.

- **Sozialhilfe hängt heute an drei Orten:** Merkliste/Kalender Finanzen (`werkzeugRegister` Fach `geld`) ·
  Lebensbaum Behörden-Ast (`Lebensbaum.jsx`, `connections`, Kommentar «Sozialhilfe-Orientierung am
  Behörden-Ast» — zur Balance, max. 2 Früchte je Ast) · Schnellcheck Salbei (`Schnellcheck.jsx`).
- **IPV** hängt an vier Orten, dreimal Versicherungen, einmal als Querverweis im Kapitel Finanzen.
- **Prämien** (`praemien`, «Versicherungs-Übersicht») ist überall Versicherungen.
