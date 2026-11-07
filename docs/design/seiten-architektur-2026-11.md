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
| 2 | Gesundheit als Kapitel, Notfall darin | [Organigramm](seiten-architektur-organigramm.html) | ja | ✅ Kapitel Gesundheit mit Ästen Gesundheit + Notfall |
| 3 | Alle Seiten durchgehen | [Organigramm](seiten-architektur-organigramm.html) · [①](seiten-architektur-2-krankenkasse.html) · [②④](seiten-architektur-3-verfuegungen.html) · [③⑤⑥⑦](seiten-architektur-4-geld-arbeit.html) | je A | ✅ alle A, Zuordnung steht (Tabelle unten) |
| 4 | Dashboard: was und in welcher Ordnung | [Dashboard](seiten-architektur-5-dashboard.html) | A — Kapitel führen, Äste als Zwischentitel; «Alle Seiten nach Kapitel» ersetzt die 7 Werkzeug-Gruppen; Ankommen + Mit 18 als Türen, Klammer eine Zeile | ✅ **06.11.: A, Kapitel führen** (Stebler Studios). 4b Stufen-Namen: Bild [4b](seiten-architektur-5b-stufen.html) — ✅ **06.11.: A, bleibt** (Dein Alltag: Basis · Wohnen · Finanzen · Deine Absicherung: Versicherungen & Vorsorge · Ausbildung & Arbeit · Dein Schutz: Behörden · Gesundheit). Reihenfolge und Berg-Stationen unverändert |

## ✅ Besprechung abgeschlossen (06.11.2026)

Jede Seite hat Kapitel und Ast (Tabelle «Zuordnung steht» unten), die Dashboard-Ordnung ist entschieden.
**Gebaut ist nichts.** Der Bau (Liste «Was beim Bau nachzieht» unten, dazu Dashboard: «Alle Seiten nach Kapitel»
statt der 7 Werkzeug-Gruppen, Ankommen + Mit 18 als Türen, Klammer als Zeile; Stufe «Dein Schutz» mit Gesundheit)
kommt erst auf Ja von Stebler Studios, am besten nach der Icon-Sitzung in einem Zug.

## Übergabe an die Icon-Sitzung (Zweig `docs/icon-plan`, PR #708)

Regel aus Frage 1, gilt für alle Seiten: **Kapitel = die Sache, um die es geht → Leitform. Geld, das dazu fliesst →
Fünfliber gold im Abzeichen. Ein anderer Ast spielt mit → dessen Farbe im Abzeichen.**

| Seite | Kapitel → Leitform | Abzeichen |
|---|---|---|
| **IPV** (Prämienverbilligung) | Versicherungen & Vorsorge → Edelweiss-Schild | Mini-Fünfliber **gold** (Geld). Folgt der Krankenkasse |
| **Prämien** («Versicherungs-Übersicht») | Versicherungen & Vorsorge → Edelweiss-Schild | **orange** (Gesundheit spielt mit: 4 von 5 Teilen sind Krankenkasse) |
| **Sozialhilfe** | Finanzen → Fünfliber | **Behörden** (Sozialdienst spielt mit) |
| KK-Erstanmeldung · KK wechseln | Versicherungen & Vorsorge → Schild | orange |
| KVG-Leistungen · KK-Belege · Unfall/Krankheit | **Gesundheit → Arztkoffer** | Mini-Schild mit Edelweiss |
| **Gesundheit / Notfall** | **Ein Kapitel «Gesundheit»** (ersetzt «Notfall», Schlüssel `notfall` bleibt), Äste Gesundheit (Hagebutte) + Notfall (Vogelbeere) | — |
| Arztkoffer · IV · Pflege | Gesundheit → Arztkoffer | Ast Gesundheit |
| Notfall-Einstieg · Notfallkarte · Notfallpass | Gesundheit → Arztkoffer | rot (Ast Notfall) — das rote Herz mit Puls bleibt Zeichen des Notfalls |
| Patientenverfügung · Vorsorgeauftrag & PV · Organspende · Bestattungswünsche | Gesundheit → Arztkoffer | rot (Ast Notfall). ⚠️ VA + PV waren schon abgenommen (mit Schild) → **neu prüfen** |
| Steuern · Quellensteuer | Finanzen → Fünfliber | Behörden |
| ALV-Taggeld · Stundenlohn | Ausbildung & Arbeit → Helm | Fünfliber gold (beide) |
| EO | Basis → Ausweiskarte (Familie) | Fünfliber gold |
| Lehre | Ausbildung & Arbeit → Schulhut | Arbeit (haselnuss) |
| Lebenslauf | Ausbildung & Arbeit → Helm | — |
| Betreibungsauszug | Behörden → Helvetia | (wie dort entschieden) |

Alle übrigen Seiten: Kapitel und Ast wie im [Organigramm](seiten-architektur-organigramm.html).

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
✅ **06.11.: A, beisammen** — Patientenverfügung · Vorsorgeauftrag & Patientenverfügung · Organspende ·
Bestattungswünsche = Kapitel Gesundheit, Ast Notfall. Todesfall (für Angehörige) bleibt Familie.
⚠️ Für die Icon-Sitzung: Vorsorgeauftrag und Patientenverfügung waren dort schon abgenommen; Leitform jetzt Koffer.

### ③ ⑤ ⑥ ⑦ Steuern · ALV/EO · Löhne · Lehre/Lebenslauf

Bild [Geld und Arbeit](seiten-architektur-4-geld-arbeit.html). Empfehlungen: ③ Steuern + Quellensteuer = Finanzen
(Abzeichen Behörden) · ⑤ ALV = Arbeit, EO = Familie (beide Fünfliber gold, wie Stipendien und IV) · ⑥ Stundenlohn =
Arbeit, Mindestlohn-Check bleibt in der Kapitelseite Finanzen (dort steht das Einkommen, kein Umbau) · ⑦ Lehre =
Bildung (Abzeichen Arbeit), Lebenslauf = Arbeit. ✅ **06.11.: überall A** (Stebler Studios: «Überall A»).

### ✅ Zuordnung steht (06.11.2026)

Alle Seiten haben ein Kapitel und einen Ast. Endstand im [Organigramm](seiten-architektur-organigramm.html)
(nachgeführt, keine offene Stelle mehr). Kurz:

| Kapitel (Leitform) | Ast | Seiten |
|---|---|---|
| Persönliche Basis (Ausweiskarte) | Person | 18 werden · Digitale Ordnung |
| | Familie | Heirat · Kind · Adoption · Trennung · Todesfall · EO |
| Wohnen (Chalet) | Wohnen | Umzug · Wohnung gekündigt · Zusammenziehen · Mietzinsverbilligung |
| Finanzen (Fünfliber) | Finanzen | Budget · Finanz-Übersicht · Kreditkarte · Schulden · Mahnung erhalten · Selbst mahnen · Betreibung erhalten · Steuern · Quellensteuer · Sozialhilfe · Mindestlohn-Check (Abschnitt der Kapitelseite) |
| Versicherungen & Vorsorge (Schild) | Versicherungen | Versicherungs-Übersicht · KK-Erstanmeldung · KK wechseln (Grund + Zusatz) · IPV |
| | Vorsorge | Vorsorge-Rechner · Pensionierung · Ergänzungsleistungen |
| Ausbildung & Arbeit (Kopfbedeckung) | Bildung | Stipendien · Lehre |
| | Arbeit | Neuer Job · Stelle verloren · Ausgesteuert · Selbständig · Lebenslauf · ALV-Taggeld · Stundenlohn |
| Behörden (Helvetia) | Behörden | Zuzug · Bewilligung · Einbürgerung · Asyl · Wegzug · Pass/ID · Führerausweis · Militär/Zivildienst · Betreibungsauszug |
| **Gesundheit** (Arztkoffer, neu, Schlüssel `notfall`) | Gesundheit | Arztkoffer · Unfall/Krankheit · IV · Pflege · KVG-Leistungen · KK-Belege |
| | Notfall | Notfall-Einstieg · Notfallkarte · Notfallpass · Patientenverfügung · Vorsorgeauftrag & Patientenverfügung · Organspende · Bestattungswünsche |
| *ohne Kapitel* | Klammer | Kalender · Merkliste · Unterlagen · Lebensmappe · Drucken · Briefe · Offizielle Links · Teilen · Suche |
| *ohne Kapitel* | oben | Was steht mir zu? · Schnellcheck |

### ✅ Erklärseiten im Organigramm (07.11.2026)

Befund im Durchgang 07.11.: Das Organigramm kannte nur die App-Seiten, die Erklärseiten (öffentlich, vor dem Tor)
standen nirgends. ✅ **07.11.: so zugeordnet** (Stebler Studios: «Ja, so»):

| Ort | Erklärseiten |
|---|---|
| Kapitel Versicherungen & Vorsorge, «Zum Verstehen» | Krankenkasse (`/krankenkasse/`) · Prämienverbilligung (`/praemienverbilligung/`) |
| Kapitel Finanzen, «Zum Verstehen» | Sozialhilfe (`/sozialhilfe/`) · Steuern (`/steuern/`) |
| Oben, ohne Kapitel, «Die Schweiz verstehen» | Politsystem (`/politsystem/`) · Kantone im Vergleich (`/kantone-im-vergleich/`) · Kantonsatlas (`/kantonsatlas/`, Entwurf #741) |
| Oben, ohne Kapitel (wie bisher) | Was steht mir zu? (`/was-steht-mir-zu/`) |

Regel: **Eine Erklärseite zu einem Thema hängt am Kapitel dieses Themas, eine Seite über alle Themen hat kein
Kapitel.** Das entspricht den Erklärseiten-Links in den Werkzeugen (D1, `ErklaerseiteLink.jsx`). Nur Ordnung im
Blatt — an App und Seiten ist nichts gebaut. Offen zur Durchsicht des Kantonsatlas: «Kantone im Vergleich» und
Kantonsatlas zeigen dieselben sechs Themen aus denselben Daten (`seiten-vergleich.mjs`), als Tabelle bzw. als Karten.

**Abzeichen-Farben aus den Entscheiden** (für die Icon-Sitzung): KK-Seiten (Vertrag) und Versicherungs-Übersicht
orange · IPV gold · Sozialhilfe Behörden · Steuern/Quellensteuer Behörden · KVG-Leistungen/Belege/Unfall Mini-Schild ·
ALV, EO, Stundenlohn, Stipendien Fünfliber gold · Lehre Arbeit.

**Was beim Bau nachzieht** (nur nach Ja, erst nach Frage 4): Register `bereich`/`fach` für KVG-Leistungen, Belege,
Patientenverfügung, Vorsorgeauftrag, Organspende, Bestattung, ALV, EO, Stundenlohn, Lehre, Lebenslauf,
Betreibungsauszug · `KAPITEL_OHNE_EIGENES` und `lebensbereiche.js` (Gesundheit → Kapitel `notfall`) · Kapitelname
«Gesundheit» ×5 Sprachen · Lebensbaum-Frucht Sozialhilfe an Finanzen · Schnellcheck-Farbe Sozialhilfe ·
`aufgabenBereiche.js` (Fach gesundheit → Kapitel Gesundheit statt Versicherungen) · Arztkoffer: «KK wechseln» nur als Weg.

## Befunde

- **Betreibungsauszug:** Register `bereich: 'finanzen'`, in der Icon-Besprechung 06.11. aber Behörden entschieden
  («der Auszug darf Behörden sein»). Im Organigramm bei Behörden; das Register zieht beim Bau nach.

- **Sozialhilfe hängt heute an drei Orten:** Merkliste/Kalender Finanzen (`werkzeugRegister` Fach `geld`) ·
  Lebensbaum Behörden-Ast (`Lebensbaum.jsx`, `connections`, Kommentar «Sozialhilfe-Orientierung am
  Behörden-Ast» — zur Balance, max. 2 Früchte je Ast) · Schnellcheck Salbei (`Schnellcheck.jsx`).
- **IPV** hängt an vier Orten, dreimal Versicherungen, einmal als Querverweis im Kapitel Finanzen.
- **Prämien** (`praemien`, «Versicherungs-Übersicht») ist überall Versicherungen.
