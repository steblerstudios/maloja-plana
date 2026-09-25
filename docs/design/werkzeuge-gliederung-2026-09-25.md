# Werkzeuge & Features — Bestand und drei Gliederungen

*Vorschlag, 25.09.2026, aus dem Tester-Feedback «Werkzeuge und Features nochmals anschauen».
Nichts davon ist gebaut; die Wahl trifft Stebler Studios. Stand des Codes: Zweig
`feat/tester-feedback-dashboard-2026-09-25`.*

## Bestand (gezählt im Code, nicht geschätzt)

Werkzeuge stehen heute an **drei Orten**, jeder mit eigener Liste:

| Ort | Quelle im Code | Einträge |
|---|---|---|
| Dashboard · «Werkzeuge & Features» | `Dashboard.jsx`, Gruppen von Hand + `ABLAEUFE` | 7 Gruppen, **53** (34 Lebensereignisse + 19) |
| Menü · «Werkzeuge» | `MobileNav.jsx`, Liste `allTools` von Hand | **18** (9 sichtbar, 9 hinter «Mehr») |
| Dashboard · «Was können Sie hier sofort tun?» | `Dashboard.jsx`, Hervorhebungen | 5 |

Die Suche liest aus `config/ansichtenRegister.js` (`SEARCH_VIEWS`, `ABLAEUFE`).

**Menü und Dashboard sind sich nur bei 8 Werkzeugen einig:**

- **Beide:** Lebenssituationen · Meine Unterlagen · Dokumentenablage · Steuern · Kalender · Budget-Sync · Prämienverbilligung (IPV) · Lebenslauf
- **Nur im Menü:** Finanz-Übersicht · KK-Scanner · Budget · Schulden · Sozialhilfe · Organspende · Charts · Export · Benachrichtigungen · Einstellungen
- **Nur auf dem Dashboard:** Gesundheit (Arztkoffer) · Steuer-Import · Mietzinsbeiträge · Vorsorge-Rechner · Mindestlohn-Check · Prämien-Orientierung · KVG-Leistungen & Franchise · Offizielle Links · Flyer zum Teilen · Suche · Merkliste

Das ist dasselbe Muster wie `SEARCH_VIEWS` neben `allTools` am 21.09. («Zwei Quellen für
eine Wahrheit»): wer im Menü sucht, findet anderes als auf dem Dashboard.

Weitere Auffälligkeiten:
- Die Gruppe «Gesundheit» enthält genau einen Eintrag, der ebenfalls «Gesundheit» heisst; daneben steht «Versicherung & Gesundheit» (3).
- Zwei Gruppen haben nur einen einzigen Eintrag (Gesundheit, Unterstützung & Anspruch).
- «Lebensereignisse» ist eine flache Liste von 34 Einträgen, ohne Unterordnung.
- Sozialhilfe steht auf dem Dashboard nur als Hervorhebung, nicht im Werkzeug-Raster.

## Drei Gliederungen

### A · Nach Lebensbereich (an den 7 Kapiteln)
Jedes Werkzeug hängt am Kapitel, zu dem es gehört: Mietzins bei Wohnen, IPV und Prämien bei
Versicherungen, Steuern bei Finanzen … Das ist die Idee «Zwei Bäume verschmelzen» (IDEEN.md,
Abschnitt 2). **Stärke:** eine Ordnung für alles, die Farben stimmen schon. **Schwäche:**
Lebensereignisse passen schlecht in ein Kapitel (eine Trennung betrifft Wohnen, Finanzen,
Kinder); sie bräuchten trotzdem einen eigenen Platz.

### B · Nach Anlass («Was ist bei Ihnen los?»)
Die 34 Lebensereignisse in sechs Gruppen, die Rechner und Ablagen getrennt davon:

| Gruppe | Einträge |
|---|---|
| Arbeit & Ausbildung | Neuer Job · Stelle verloren · Ausgesteuert · Selbständig werden · Lehre beginnen · Quellensteuer · Militär- oder Zivildienst (7) |
| Familie & Zusammenleben | Heirat oder Partnerschaft · Zusammenziehen ohne Trauschein · Kind bekommen · Adoption · Trennung oder Scheidung · 18 werden (6) |
| Wohnen & Geld | Umzug · Wohnung gekündigt · Betreibung erhalten · Betreibungsauszug · Ergänzungsleistungen (5) |
| Gesundheit & Pflege | Krankenkasse zum ersten Mal · KK wechseln · Zusatzversicherung wechseln · Unfall oder Krankheit · Krankheit & IV · Angehörige pflegen (6) |
| Aufenthalt & Ausweise | Neu in der Schweiz · Wegzug · Bewilligung verlängern · Einbürgerung · Asyl & Schutz · Pass oder ID · Führerausweis (7) |
| Alter & Lebensende | Pensionierung · Vorsorgeauftrag & Patientenverfügung · Todesfall (3) |

Daneben: **Rechnen & prüfen** (Steuern, IPV, Prämien-Orientierung, Vorsorge-Rechner, Mietzinsbeiträge,
Mindestlohn-Check, Sozialhilfe …) und **Ablegen & ordnen** (Dokumentenablage, Meine Unterlagen,
Kalender, Merkliste, Lebenslauf …).
**Stärke:** man sucht nach dem, was gerade passiert, nicht nach dem Amt. **Schwäche:** die
Zuordnung ist manchmal Ermessen (Quellensteuer: Arbeit oder Aufenthalt?).

### C · Wenig zeigen, eine Liste
Das Dashboard zeigt nur eine kleine, feste Auswahl (die 5 Hervorhebungen plus «Alle
Werkzeuge»). Alles andere liegt auf **einer** Seite mit Suche — und Menü, Dashboard und Suche
lesen aus **demselben** Register. **Stärke:** ruhigstes Dashboard, und die zwei Listen können
nicht mehr auseinanderlaufen. **Schwäche:** wer stöbern will, braucht einen Klick mehr.

## Nachtrag 25.09. abends: alle drei in einem, im Rucksack

**Entscheid Stebler Studios:** «alle drei in einem» — und die Werkzeug-Seite ist der Rucksack.

**Befund, der den Vorschlag oben korrigiert:** der Rucksack existiert schon. «Mein Gepäck»
(`src/Gepaeck.jsx`, Register `src/data/gepaeck.js`) ordnet **alle 34 Lebensereignisse** in
6 Gegenstände, dazu 3 Werkzeuge (Mietzinsbeiträge, Stipendien, Organspende). Gemessen: kein
Lebensereignis fehlt. Variante B oben ist also **gebaut** — mit eigener, etwas anderer
Einteilung; es gilt die bestehende, nicht meine:

| Gegenstand | Bereich | Wege |
|---|---|---|
| Schlüsselbund | Wohnen & Aufenthalt | 11 (inkl. Mietzinsbeiträge) |
| Werkzeugrolle | Arbeit | 9 (inkl. Stipendien) |
| Erinnerungskiste | Familie | 6 |
| Arztkoffer | Gesundheit | 5 |
| Feldflasche | Alter | 4 |
| Versiegelter Brief | Abschied | 2 (inkl. Organspende) |

Die flache Liste «Lebensereignisse» (34) auf dem Dashboard ist damit eine **dritte**
Darstellung derselben Wege, neben Gepäck und Suche.

### Das Modell «alle drei in einem»

- **C · ein Ort:** «Mein Gepäck» wird die eine Werkzeug-Seite. Dashboard und Menü zeigen
  darauf, statt eigene Listen zu führen.
- **A · nach Lebensbereich:** jeder Gegenstand ist ein Lebensbereich und trägt **Wege und
  Werkzeuge** — so wie Mietzinsbeiträge schon heute im Schlüsselbund liegen.
- **B · nach Anlass:** innerhalb des Gegenstands die Wege (Lebensereignisse), wie heute.
- **Eine Quelle:** Menü, Suche, Dashboard und Gepäck lesen aus demselben Register.

Wohin die übrigen Werkzeuge kämen (Vorschlag):

| Werkzeuge | Ort |
|---|---|
| Prämienverbilligung (IPV) · Prämien-Orientierung · KVG-Leistungen & Franchise · KK-Scanner | Arztkoffer |
| Vorsorge-Rechner | Feldflasche |
| Steuern · Steuer-Import · Budget · Budget-Sync · Schulden · Finanz-Übersicht · Mindestlohn-Check · Sozialhilfe | **fehlt** — kein Gegenstand für Geld (neuer Gegenstand nötig, z. B. Portemonnaie) |
| Dokumentenablage · Meine Unterlagen · Kalender · Merkliste · Lebenslauf · Offizielle Links · Flyer · Charts · Suche · Lebenssituationen · Gesundheit (Arztkoffer-Ansicht) | Ablegen & Ordnen — kein Lebensbereich: Aussenfach des Rucksacks **oder** direkt im Menü |
| Einstellungen · Export · Benachrichtigungen | **Einstellungen.** Export steht dort schon (`SettingsView.jsx`, samt «Daten löschen»); Benachrichtigungen ist eine eigene Ansicht und käme als Eintrag dazu. |

Achtung Namensgleichheit: die Werkzeug-Ansicht «Gesundheit» (`view: 'gesundheit'`,
`nav.arztkoffer`) und der Gegenstand «Arztkoffer» im Gepäck sind zwei verschiedene Dinge.

### Offene Entscheide
1. **Geld:** neuer Gegenstand (z. B. Portemonnaie) für die Finanz-Werkzeuge — ja/nein, welcher?
2. **Ablegen & Ordnen:** Aussenfach im Rucksack, oder bleiben sie direkt im Menü?
3. **Die 5 Hervorhebungen auf dem Dashboard:** noch offen. Vorschlag: vorerst unverändert
   lassen — der Umbau hängt nicht davon ab — und im Oktober mit neuem Tester-Feedback entscheiden.

## Empfehlung (Stand vor dem Nachtrag)

**C als Gerüst, B als Ordnung darin.** C behebt den eigentlichen Fehler (drei Listen, die
sich widersprechen) und macht das Dashboard ruhiger — «weniger ist mehr, nicht weg, nur an
andere Orte» (Design-Rückmeldung 19.07.). Auf der einen Werkzeug-Seite ordnet B die 34
Lebensereignisse in sechs Gruppen. A bleibt die Vision für später (Werkzeuge am Ast ihres
Bereichs); es braucht B trotzdem für die Lebensereignisse.

**Offene Fragen an die Entscheidung:**
1. Welche Gliederung (A, B, C oder C+B)?
2. Was steht in der festen Auswahl auf dem Dashboard — die heutigen 5 Hervorhebungen?
3. Gehören Einstellungen, Export und Benachrichtigungen überhaupt zu «Werkzeuge», oder ins
   Einstellungs-Menü?
