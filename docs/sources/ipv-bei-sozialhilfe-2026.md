# Rechts-Check: Prämienverbilligung (IPV) während der Sozialhilfe

Stand der Recherche: **2026-09-25**. Betrifft den Text `schnellcheck.ipvSubsumed`
(`src/i18n/*.js`), angezeigt in der Dashboard-Leistungsliste
(`src/components/Leistungsliste.jsx`) und im vollen Schnellcheck (`src/Schnellcheck.jsx`),
wenn zugleich Sozialhilfe möglich ist:

> «Solange Sie Sozialhilfe beziehen, wird die Prämienverbilligung angerechnet – kein
> zusätzliches Geld. Endet die Sozialhilfe, senkt sie wieder direkt Ihre Prämie; ob ein Antrag
> nötig ist, sagt Ihnen der Sozialdienst.»

Anlass: Vorschlag, «während der Sozialhilfe **kein Anspruch** auf IPV» zu schreiben. Das ist
als allgemeine Aussage **falsch** — der Anspruch bleibt in den geprüften Kantonen bestehen,
er wird verrechnet bzw. fliesst an Kasse oder Sozialdienst. Für die Person gibt es kein
zusätzliches Geld.

## Bundesrecht

- KVG Art. 65 Abs. 1: Die Kantone gewähren «den Versicherten in bescheidenen wirtschaftlichen
  Verhältnissen» Prämienverbilligungen. Kein Ausschluss von Sozialhilfebeziehenden gefunden.
  (Wortlaut zitiert nach ZH-Sozialhilfehandbuch; Fedlex nicht selbst abgerufen.)
- **Einzige Gruppe mit wörtlich «kein Anspruch»:** Asylsuchende, solange sie von der
  Asylfürsorge abhängen — IPV sistiert (AsylG Art. 82a Abs. 7, zitiert nach ZH-Handbuch
  11.1.10 Ziff. 6.3). Nicht Gegenstand des Schnell-Checks (der rechnet SKOS-Sozialhilfe).

## Basel-Stadt

- GKV (SG 834.400, Fassung in Kraft seit 26.01.2014) § 17 Abs. 3: Sozialhilfebeziehende
  erhalten Prämienbeiträge «grundsätzlich auf der Grundlage des Sozialhilfegesetzes»; Leistungen
  nach GKV werden an die Sozialhilfe **angerechnet**. KVO (SG 834.410) § 24: Anspruch geht auf
  die Sozialhilfebehörde über. — https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/834.400
  (abgerufen 2026-09-25)
- «angerechnet» im Text stammt von hier.

## Bern

- Amt für Sozialversicherungen (ASV), «Informationen zur Prämienverbilligung, gültig ab
  1. Januar 2026», S. 2–3: Wer Sozialhilfe bezieht, hat «Anrecht auf die maximal ordentliche
  Prämienverbilligung»; die Beiträge gehen «direkt an Ihren Sozialdienst».
  — https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Informationsblatt%202026_de.pdf
  (abgerufen 2026-09-25)

## Zürich (Fassungen geprüft 2026-09-25)

- **Sozialhilfehandbuch Kap. 11.1.10 Ziff. 6.2** (publ. 28.09.2021, laut Versionsliste
  «aktuell»): Die Gemeinde übernimmt den durch die IPV nicht gedeckten Prämienrest (§ 15 Abs. 1
  EG KVG); ohne Antrag fordert sie dazu auf oder stellt ihn stellvertretend (§ 48 VEG KVG); im
  Existenzminimum «gilt nur der Prämienrest als anerkannte Ausgabe».
  — https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/11-weitere-leistungen-soziale-sicherheit/11-1-sozialversicherungsleistungen/11-1-10-krankenversicherung-praemienverbilligung-und-praemienuebernahme.html
  - Hinweis: Das Kapitel ist in Teilen veraltet (EL-Übergangsregel «bis 31. Dezember 2023»);
    Ziff. 6.2 ist davon nicht betroffen.
- **Sozialhilfehandbuch Kap. 11.1.11** (publ. 22.10.2025, «aktuell»): Sozialhilfeorgane melden
  Beginn und Ende des Bezugs der SVA, «damit Prämienverbilligungsansprüche vor, während und nach
  dem Sozialhilfebezug korrekt berechnet werden können» (§ 49 Abs. 2 VEG KVG).
  — https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/11-weitere-leistungen-soziale-sicherheit/11-1-sozialversicherungsleistungen/11-1-11-krankenversicherung-auswirkungen-auf-die-sozialbehoerden.html
- **EG KVG (LS 832.01), Nachtrag 123** (PDF-Fusszeile «1. 1. 24 – 123»): § 15 Abs. 1 (Gemeinde
  oder SVA übernimmt den Prämienrest), § 15 Abs. 2 (direkt an den Versicherer), § 18 Abs. 1 (IPV
  nur auf Antrag), § 19 Abs. 1 (SVA überweist den Versicherern). Paragraphen-Nummern unverändert.
  — https://www.notes.zh.ch/appl/zhlex_r.nsf/WebView/523FF20124833D4DC1258E6400258FD3/$File/832.01_29.4.19_123.pdf
- **VEG KVG (LS 832.1), Nachtrag 108** (seit Inkraftsetzung 01.04.2020 unverändert): § 48
  (Aufforderung / stellvertretender Antrag), § 49 Abs. 2 (Meldung Beginn/Ende), **§ 51** («Für
  die Zeit, während der für eine Person der Prämienrest übernommen wird, erfolgt keine
  definitive Bestimmung der Prämienverbilligung») — stärkster Beleg für «kein zusätzliches Geld».
  — https://www.notes.zh.ch/appl/zhlex_r.nsf/WebView/9138A152B73FD9CDC12585430039B82B/$File/832.1_25.3.20_108.pdf
- Gegenprobe: zhlex-Direktlinks mit `Ordnr=` führen auf diese Fassungen; eine erfundene Nummer
  (832.99999) gibt 404.
- **Nicht geprüft:** beschlossene, noch nicht in Kraft getretene Änderungen (Lexfind-Abfrage
  auf geratene Adresse → 404, kein Befund). Feld «Hinweise» auf beiden zh.ch-Seiten leer.

## Bewertung des Textes

- ✅ «kein zusätzliches Geld» — BS (Anrechnung), BE (Zahlung an den Sozialdienst), ZH (nur
  Prämienrest im Budget, § 51 VEG KVG).
- ✅ «Endet die Sozialhilfe, senkt sie wieder direkt Ihre Prämie» — ZH: IPV fliesst ohnehin an
  den Versicherer, Ende wird der SVA gemeldet; kein Widerspruch gefunden.
- 💡 «angerechnet» ist für ZH genau genommen ungenau (dort senkt die IPV die Prämie schon vorher,
  nur der Rest erscheint im Budget); das Ergebnis für die Person ist dasselbe. Gewählt, weil es
  der Wortlaut von BS ist und über die Kantone trägt.
- ⚠️ **Nicht belegt:** dass die IPV nach dem Austritt ohne neuen Antrag weiterläuft. ZH: IPV nur
  auf Antrag (§ 18 Abs. 1 EG KVG), jährlich — vermutlich läuft sie im laufenden Jahr weiter, fürs
  Folgejahr braucht es einen Antrag (Ableitung, kein Wortlaut). Darum bewusst: «ob ein Antrag
  nötig ist, sagt Ihnen der Sozialdienst». **Nicht zu «automatisch» verschärfen.**
- Randbemerkung ZH: § 15 EG KVG gilt auch für Menschen knapp am Existenzminimum ohne
  Sozialhilfe («Restprämienübernahme ist keine Sozialhilfe», Merkblatt Kantonales Sozialamt,
  28.04.2023). Der Text erfasst diese Gruppe nicht; kein Widerspruch.

Weitere Kantone mit voller IPV für Sozialhilfebeziehende (LU, UR, SO, AR, AI, GR, AG, TG, VS):
siehe `ipv-kantone-2026.md`.
