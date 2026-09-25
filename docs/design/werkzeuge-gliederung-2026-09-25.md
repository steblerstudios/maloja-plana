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

## Empfehlung

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
