# Changelog

Alle wesentlichen Änderungen an Maloja Plana werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

---

## [Unreleased]

*Hier sammelst du Zeilen während der Arbeit. Beim Release wird aus „Unreleased"
die Versionsnummer + Datum, und `package.json` wird im selben PR angehoben — so
kommt der Changelog immer mit, nie doppelt.*

### Neu
- **Der Lebensbaum wächst jetzt räumlich.** Unter «Was aus Ihren Angaben wächst» steht
  der Baum dreidimensional: ein Ast je Kapitel, jeder mit seiner Schweizer Frucht, die
  mit dem Ausfüllstand **dieses** Kapitels reift. Drehen mit Maus, Finger oder
  Pfeiltasten. Name, Prozent und der Weg ins Kapitel bleiben erhalten — sie liegen als
  echte Knöpfe über dem Bild, damit Tastatur und Screenreader weiter funktionieren.
- **Umschalter flach ↔ räumlich**, die Wahl wird gemerkt. Standard ist räumlich.
- Gebaut nach nachprüfbaren Naturgesetzen statt nach Gefühl: Phyllotaxis (137,5°),
  Da-Vinci-Regel für die Astdicken, Goldener Schnitt für die Astlängen, elastische
  Ähnlichkeit für die Stammdicke, Fibonacci für die Anzahlen. Fruchtgrössen nach echten
  Massen, mit einem Potenzgesetz gestaucht, damit eine Heidelbeere sichtbar bleibt,
  ohne so gross zu wirken wie ein Apfel.

### Geändert
- Neue Abhängigkeit **three.js** (die dritte überhaupt, nach react und react-dom).
  Sie liegt bei uns und wird von unserem Server geliefert — kein fremder Server, die
  CSP `script-src 'self'` bleibt unangetastet.
- ⚠️ **Der Baum lädt beim Öffnen des Dashboards rund 145 KB (gzip) nach**, weil die
  räumliche Ansicht der Standard ist. Wer auf flach stellt, lädt ihn nicht mehr.
- Ohne 3D-fähiges Gerät erscheint automatisch der bisherige flache Baum.
- ⚠️ Die Startdatei liegt damit bei **64,95 KB gzip gegen die Grenze von 65 KB** — rund
  50 Byte Reserve. Die nächste Änderung an Code, der beim Start geladen wird, reisst das
  Gate; die Grenze gehört bewusst neu gesetzt, nicht beiläufig.

### Barrierefreiheit
- Die Beschriftungen am Baum sind **44 px hohe Ziele** mit klein bleibender Pille — vorher
  waren es 18 bzw. 14 px und damit unter jedem Mindestmass.
- Die Werkzeug-Pillen haben einen **deckenden Grund** statt eines 8-%-Farbschleiers: dahinter
  liegt die bewegte 3D-Szene, gegen die kein Kontrast garantiert werden kann.
- Prozentzahlen werden über eine geprüfte Farbe gedämpft, nicht über `opacity`.
- Die Zeichenfläche ist `role="group"` (nicht `img`) und erklärt per unsichtbarem Hinweis,
  dass die Pfeiltasten drehen; die Tab-Reihenfolge folgt der Bildreihenfolge.
- Verliert die Grafikkarte den Kontext, erscheint der flache Baum statt einer schwarzen
  Fläche; **jeder** Fehler im Szenenaufbau führt dorthin statt ins leere Dashboard.

## [0.1.38-beta] — 2026-09-20

**K31 — fünf Kantone rechnen jetzt nach ihrem eigenen amtlichen Modell**, statt nach der
Näherungsformel, die für keinen Kanton gilt. Dazu ein gemeinsamer Rahmen, damit ein Befund
künftig an einer Stelle behoben wird und kein Kanton ihn auslassen kann.

### Neu
- **Kanton Zürich** (#236): Referenzprämie minus Eigenanteil 8,4 % bzw. 10,5 %, drei
  Prämienregionen, Mindestanspruch für Kinder nach § 7 Abs. 1 EG KVG.
- **Kanton Bern** (#239): amtliche Stufentabelle der KKVV mit festen Monatsbeträgen,
  Bezugsjahr −2, eigener Hinweis für Einkommen unter Fr. 14'000 (dort ist der Antrag nötig,
  nicht automatisch).
- **Kanton Aargau** (#239): Richtprämie minus 17,5 % des massgebenden Einkommens, Bezugsjahr
  −3, ohne Prämienregionen. Mit Fristhinweis, weil der Anspruch ohne Antrag verwirkt.
- **Kanton St.Gallen** (#240): Referenzprämie minus Belastungsgrenze, deren Satz mit dem
  Einkommen steigt. Minimalgarantie 80 % für Kinder, Mindestbetrag Fr. 100 je Person.
- **Gemeinsamer Rahmen** `config/kantonsModell.js` (#240) für alle Kantonsmodelle.
- **`scripts/ipv-abdruck.mjs`** (#240): zeichnet das Rechen-Verhalten über 78'995
  Eingabe-Kombinationen auf — das Beweismittel für verhaltensgleiche Umbauten.

### Behoben
- **Ohne erfasste Krankenkassenprämie fiel der gesetzliche Deckel still weg.** Die App zeigte
  dann die Obergrenze statt des Anspruchs — in Aargau gemessen bis 40 % zu viel. Betraf alle
  vier Kantone mit eigenem Modell; jetzt steht dort keine Zahl, bis die Prämie erfasst ist.
- **Konkubinat rechnete durch**, obwohl das Einkommen der zweiten Person fehlt. Jetzt dieselbe
  Orientierung wie bei Verheirateten.
- **Ein Kind ohne erfasstes Alter** galt als Säugling (`age` ist mit 0 vorbelegt) und erhöhte
  still Referenzprämie und Mindestanspruch. Jetzt keine Zahl, bis das Alter dasteht.
- Zürich: Altersstichtag nach § 8 EG KVG (Alter am Ende des Vorjahres), Säule 3a wird dem
  massgebenden Einkommen hinzugerechnet, negatives Einkommen sprengt die Obergrenze nicht mehr.
- Bern: falsches Basisjahr im Vorbehalt; «automatisch via Steuerdaten» stimmte für kleine
  Einkommen nicht; Reutigen zeigt keinen Betrag, solange zwei amtliche Listen sich widersprechen.
- Aargau: die Finanzübersicht behauptete eine Einkommensgrenze, die der Kanton nicht publiziert.

### Geändert
- **Vite 4.5 → 7.3.6** (#235). Schliesst zwei Sicherheitslücken im Entwicklungs-Server;
  `npm audit` meldet 0. Die erzeugten Dateinamen tragen jetzt base64url-Hashes.
- Die Dokumentation der Kantonsquellen (`docs/sources/ipv-kantone-2026.md`) trägt zu jedem
  gebauten Kanton die Wortlaute, auf die sich der Code beruft.
- Neu `docs/sources/FRAGEN-AN-DIE-AEMTER.md` mit fünf offenen Punkten bei vier Ämtern.

### Nicht gebaut, bewusst
Paare und Konkubinat, junge Erwachsene 19–25, quellenbesteuerte Personen; in Aargau zusätzlich
Haushalte mit Kindern. In allen Fällen zeigt die App eine Orientierung mit Grund statt einer
Zahl, für die ihr die Angaben fehlen. Waadt ist gebaut, aber zurückgehalten, bis das OVAM
die Formeln bestätigt.

## [0.1.37-beta] — 2026-09-19

*Live seit **19.09.2026** (`index-fc8ee6ec.js`, Tag `v0.1.37-beta` = `335a557`, per `curl` belegt: 164/164 Build-Dateien 200, altes `index-c80eed98.js` 404, erfundener Name 404, `sw.js` mit Cache `maloja-plana-fc8ee6ec`; im Browser Footer v0.1.37-beta, Konsole leer). Entscheid-Block vom 19.09.2026 (Stebler Studios) und Abbau K86–K103. Umfasst #230, #231, #232 und die Zweige `fix/k86-k87-k98-steuer`, `fix/k82-null-als-antwort`, `fix/k88-k89-k102-k103-kvg`, `fix/k99-k106`.*

### Behoben
- **K106 · CSV-Budget-Import überschreibt kein Einkommen mehr:** Ohne Einkommenszeile in der Datei setzte der Import das Monatseinkommen auf 0 und löschte so ein eingetragenes Einkommen. Jetzt bleibt das Feld unangetastet; nur eine vorhandene Einkommenszeile wird übernommen.
- **K86 · Kein falscher Steuersatz beim gemeinsamen Wert:** Bei «verheiratet» mit direkt eingetragenem gemeinsamem steuerbarem Einkommen bezog sich der «effektive Satz» (und die Box «Nettoeinkommen») auf den eigenen Nettolohn, die Steuer aber auf das gemeinsame Einkommen. Beide entfallen in diesem Fall, mit Hinweis. Die Zeile heisst jetzt «Ihr eigener Nettolohn pro Jahr».
- **K87 · Probiermodus mit anderer Kinderzahl:** Weicht die Kinderzahl vom direkt eingetragenen Wert ab, zeigt der Steuerrechner keine Zahl mehr (bisher z. B. 400.80 ohne Hinweis), sondern sagt, warum — gleiches Muster wie K62.4.
- **K103 · Kein stiller Rückfall auf Taxpunktwert 0.89:** Ohne Kanton oder bei unbekanntem Kanton rechnet die Arztrechnung nicht mehr still mit 0.89, sondern zeigt einen ruhigen Hinweis.
- **K94 · Speicher gesperrt oder voll:** Erinnerungen, Lebenssituationen, Backup-Metadaten und das Datum der letzten Sicherung fangen Speicherfehler ab. Beim Export erschien bei vollem Speicher eine Fehlermeldung, obwohl die Datei schon heruntergeladen war.
- **K97 · Escape:** `0` erscheint in Dossier, Brief und Flyer als «0» statt leer; `'` wird maskiert. Dossier, Brief und Flyer nutzen dieselbe Funktion.
- **K90 · Tab-Reihenfolge:** Die Karte beim Sprach-Ladefehler steht im Seitenaufbau dort, wo sie sichtbar ist (oben).

### Neu
- **Herzensempfehlung utopi:** Wildblumen-Saatgut für Wildbienen und Insekten, im Buch «Tiere» (kein Affiliate; Entscheid Stebler Studios).

### Behoben (aus dem Deploy-Gate)
- **Versicherergruppe am Ergebnis:** In GE, VD, LU, UR und SZ ist der Taxpunktwert nur für bestimmte Versicherergruppen belegt. Das steht jetzt direkt beim berechneten Betrag — im Tab «Arztrechnung» und im Franchise-Tab vor dem Übernehmen als Beleg.
- **«Stand 2025» auch im Franchise-Tab:** Kantone ohne belegten Wert 2026 tragen den Hinweis jetzt auch dort.
- **Ansagen für Screenreader:** Wechselt der Steuerrechner zwischen Zahl und Hinweis, wird das einmal angesagt; beim Erstellen eines QR-Codes «QR-Code erstellt.» (ohne den Inhalt vorzulesen).
- Taxpunktwerte-Datenstand 19.09.2026 (Quellen nachgeprüft, Werte unverändert) · fr-Apostroph vereinheitlicht.

### Geändert
- **K82 · 0 ist eine Antwort:** Eine gespeicherte 0 in einem Betragsfeld zählt für die Vollständigkeit und steht als «0» im Feld (34 Betragsfelder). Leere Felder bleiben leer und zählen nicht. Rechner unverändert.
- **K101 · QR-Hinweis überall:** Auch der Krankenkassen- und der Organspende-QR sagen, dass der Code nicht verschlüsselt und für alle lesbar ist, die ihn scannen.
- **K99 · Individualbesteuerung:** Der Text sagt jetzt, dass sie 2032 in Kraft treten soll (Entscheid des Bundesrats vom 19.08.2026, ESTV-Medienmitteilung), statt «Zeitpunkt offen». «Soll», weil die ESTV zwei Vorbehalte nennt (Volksinitiative, Abstimmung 29.11.2026; mögliche Gesetzesänderung).
- **K88 · Versicherergruppe bei den Quellen:** GE (CSS), VD und LU (santéservices), UR (HSK, Link jetzt auf das BVGer-Urteil C-409/2026); Stand-Datum bei GR und ZG.
- **K102 · santéservices:** tarifsuisse ag heisst jetzt santéservices (seit 1.7.2026 gemeinsame Marke santéservices) — Linktexte «santéservices, vormals tarifsuisse».
- **K89 · Tessin:** Der Quellen-Link springt in der amtlichen Gesetzessammlung (Bollettino ufficiale delle leggi) auf den Beschluss (S. 64–65); die Freiburger Quelle ist bestätigt.
- **K98 · Texte:** «0 eintragen» eindeutig, «gemeinsam» nur als Annahme, it einheitlich «salario netto».
- **K96 · Capacitor als Entwicklungs-Abhängigkeit:** Zur Laufzeit hängt die App nur noch an React.
- **K95 · npm audit:** Entwicklungs-Pakete aktualisiert (12 → 2 Meldungen, Laufzeit weiterhin 0). Offen: esbuild im Dev-Server, nur mit Vite-Major-Update (Oktober). Build byte-gleich.

## [0.1.36-beta] — 2026-09-17

*Live seit **17.09.2026, 16:32** (`index-c80eed98.js`, Tag `v0.1.36-beta` = `6546358`, per `curl` belegt: 164/164 Build-Dateien 200, altes `index-d179693a.js` 404, erfundener Name 404, `index.html`, `theme-init.js`, `sw.js`, `sitemap.xml` zeichengleich mit dem Build, `sw.js` mit Cache `maloja-plana-c80eed98`). Live im Browser geprüft: Beispiel → Notfall-Dossier, Code mit jsQR zurückgelesen (Version 19, Medizin zuerst, Schlusszeile «Nicht enthalten …»), kein `title`, `aria-label` gesetzt, Hinweis «nicht verschlüsselt», Footer v0.1.36-beta, Konsole leer; Beispiel verlassen → `/`, localStorage leer. Umfasst #224, #226, #227.*

### Behoben (aus dem Deploy-Gate)
- **K80 · Notfall-QR nennt, was fehlt:** Passt eine Angabe nicht in den Code, fällt nur sie weg; die folgenden werden weiter gefüllt, und die letzte Zeile im Code nennt die fehlenden Angaben. Im Code steht Medizin zuerst, dann Notfallkontakt, Vorsorge, Person, Betreuung, Versicherung (Entscheid Stebler Studios); das gedruckte Dossier bleibt unverändert.
- **QR ohne Klartext-Tooltip:** Die Bibliothek setzte den ganzen Inhalt als `title` (Tooltip mit Gesundheits- und AHV-Daten). Jetzt entfernt; der Code ist als Bild beschriftet (`role="img"`, `aria-label`).
- **QR mit Emoji:** Zeichen ausserhalb der BMP werden als ein 4-Byte-Zeichen kodiert.
- **Kürzungs-Hinweis ohne Live-Region:** Er steht schon beim ersten Laden da; nur die Fehlermeldung bleibt `role="status"`.
- **Notfall-QR ehrlich beschrieben:** Der Hinweis sagt jetzt, dass der Code nur Text enthält, nicht verschlüsselt ist und von allen gelesen werden kann, die ihn scannen. Statt «ausdrucken» (der Druck-Knopf des Dossiers enthält keinen Code) empfiehlt er ein Bildschirmfoto oder den Druck dieser Seite (5 Sprachen, rm provisorisch).
- **Englisch einheitlich:** Der Disclaimer im Behörden-JSON sagt «responsible authority» wie der Rest der Datei.

### Behoben
- **K80 · QR-Codes mit Umlauten:** Die eingebettete QR-Bibliothek kodierte nach dem ersten Umlaut falsch (ein wiederverwendetes Byte-Feld hängte Reste an). Folge: im Notfall-Dossier, bei der Organspende und der Krankenkassen-Karte blieb die Fläche leer oder der Inhalt war verfälscht. Bibliothek korrigiert (Vermerk im Dateikopf), neuer Helfer `utils/qrSicher.js` rechnet in UTF-8-Bytes, kürzt das Notfall-Dossier an Zeilengrenzen auf 600 Bytes (Fehlerkorrektur M) und zeigt statt einer leeren Fläche einen ruhigen Hinweis (5 Sprachen, rm provisorisch). Im Browser geprüft: der gezeichnete Code des Beispiels liest sich mit jsQR zurück, «Zürich» inklusive.

### Geändert
- **K91 · Fussnote der Taxpunktwerte ohne «amtlich»:** Sie sagte, nur den unbelegten Kantonen fehle ein «amtlich belegter» Wert. Das widersprach der Quellen-Beschriftung «Ärztegesellschaften» für OW, NW und SZ. Jetzt «belegter Wert» (5 Sprachen).
- **K92 · Schwyz nennt beide Werte:** Der Quellen-Link sagt jetzt «0.85 für tarifsuisse, 0.86 für CSS und HSK», wie die Quelle.
- **K93 · Behörden-JSON mit Einordnung:** Die Datei trägt oben `disclaimer: { code: 'orientierung', text }`: Orientierung auf Grundlage der erfassten Angaben, keine verbindliche Prüfung (anredefrei, 5 Sprachen).

## [0.1.35-beta] — 2026-09-17

*Live seit **17.09.2026, 14:35** (`index-d179693a.js`, Tag `v0.1.35-beta` = `cb29a33`, per `curl` belegt: 164/164 Build-Dateien 200, altes `index-e5ece27b.js` 404, erfundener Name 404, `sw.js` mit Cache `maloja-plana-d179693a`). Live im Browser geprüft: Beispiel → KVG «Arztrechnung» zeigt 17 Quellen-Links, Konsole ohne Fehler, Beispiel verlassen → `/`, localStorage leer. Umfasst #219, #220, #221, #222 (Entscheid-Runde 17.09.2026 nachmittags).*

### Neu
- **K58 · Hinweis beim Sprachwechsel:** Lädt eine Sprache länger als 300 ms, erscheint leise «Sprache wird geladen …» (angesagt, ohne Layoutverschiebung). Scheitert das Laden, zeigt die App Deutsch und sagt es, mit «Erneut versuchen». Die Meldung hängt nicht an der fehlenden Sprachdatei (de/fr/it/en fest im Hauptbundle, rm fällt auf de zurück). Der Rückfall wird nicht gespeichert.
- **E41 · Quellen der Taxpunktwerte sichtbar:** Im Tab «Rechnung» der KVG-Leistungen steht je Kanton ein Quellen-Link (17 Kantone mit belegter Quelle; nur Adressen, die schon als Beleg in den Daten standen). Kantone ohne belegten Wert bekommen keinen Link.

### Geändert
- **E40 · Behörden-Export mit Kennung und Sprache:** Die Erläuterungen zur Steuerschätzung (`taxableIncomeBasis`, `cantonalBasis`, `assumptions`) tragen jetzt eine feste Kennung (`code`) und den Text in der gewählten App-Sprache (`text`); `textLanguage` steht oben. Dateiversion 1.0 → 1.1.
- **K45 · Formulare ruhiger:** «Arbeitsbeginn» und «Anstellung seit» belegen sich gegenseitig vor (nur leere Felder, nur vollständige Daten); das Pflicht-Sternchen beim Notfallkontakt ist weg; ein eingetragener Wert hebt «trifft nicht zu» auf.

### Behoben
- **K62.2 · Partnereinkommen 0 sichtbar:** Eine gespeicherte 0 erschien als leeres Feld, zählte aber als Antwort. Jetzt steht «0» da (auch im Vorsorgerechner).
- **K62.4 · Steuerrechner ohne Widerspruch:** Bei «verheiratet» mit direkt eingetragenem steuerbarem Einkommen und fehlendem Partnereinkommen nennt der Kantonstext nur noch die fehlende Kantonszahl (statt «noch keine Steuerschätzung» unter einer angezeigten Bundessteuer). Weicht im Probiermodus der Zivilstand vom Profil ab, erscheint keine Zahl mehr, dafür ein Hinweis. Gleiche Regel in Steuerrechner, Finanzübersicht und Dossier.
- **Befunde der Vorab-Prüfung:** Nach «Erneut versuchen» oder «Schliessen» springt der Fokus auf die Sprachwahl (am Handy auf den Hauptbereich) statt verloren zu gehen · Quellen-Links 44 px hoch · der Hinweis zum eingetragenen steuerbaren Einkommen sagt jetzt, dass bei Verheirateten der gemeinsame Wert beider Ehegatten gemeint ist (5 Sprachen).

## [0.1.34-beta] — 2026-09-17

*Live seit **17.09.2026, 13:25** (`index-e5ece27b.js`, Tag `v0.1.34-beta` = `a414f86`, per `curl` belegt: 164/164 Build-Dateien 200, altes `index-606d23bb.js` 404, erfundener Name 404, `sw.js` mit Cache `maloja-plana-e5ece27b`, Backup `20260917-132557` mit 177 Dateien). Live im Browser geprüft: «Beispiel verlassen» im Banner führt zurück zur Code-Wand, Konsole ohne Fehler. Umfasst #214, #215, #216.*

### Behoben
- **«Beispiel verlassen» funktioniert wieder:** Wer über «Ohne Code ausprobieren» ins Beispiel kam, konnte es über den Knopf im Banner nicht verlassen — der Knopf reichte das Klick-Ereignis als Adresse weiter, die Adresse wurde zu `/NaN` und das Neuladen scheiterte (`reload is not a function`; nach einem Neuladen von Hand erschien die 404-Seite). Live beobachtet am 17.09.2026 in 0.1.33-beta; der Link in der Fusszeile war nicht betroffen. Jetzt führt der Knopf zurück zur Code-Wand (lokal im Browser geprüft), und `demoVerlassen` nimmt nur echte Orts-Objekte an. Test mit Gegenprobe.

### Geändert
- **K73 · Italienisch siezt in der Sie-Ansicht:** 14 italienische Texte duzten, obwohl der deutsche Text keine Anrede hat — sie erschienen so auch in der Sie-Ansicht. Jetzt anredefrei (Titel im Infinitiv) oder mit Sie- und Du-Fassung; ebenso einzelne französische Titel und Hinweise. Ein Test verhindert neue Fälle.
- **K75 · Schriften in der Lizenzliste:** Lexend, Hanken Grotesk und Atkinson Hyperlegible statt der früheren DM Sans und Cormorant.
- **K79 · Du-Ansicht ohne feste Sie-Formen:** Rund 57 französische und 6 deutsche Texte siezten fest und erschienen so auch in der Du-Ansicht — jetzt anredefrei oder mit Sie- und Du-Fassung. Dazu 34 italienische Hinweise mit Du-Verbform ohne Pronomen («hai», «Usa …»), jetzt unpersönlich, und zwei deutsche Hinweise im Infinitiv. Briefe an Stellen und der Flyer siezen bewusst weiter. Ein Test prüft fr und de.
- **E43 · belegbare Privatheits-Aussagen:** «100 % privat» und «100 % lokal» sind ersetzt durch «lokal gespeichert» bzw. «Ihre Eingaben bleiben auf Ihrem Gerät» — in `index.html`, Manifest und App (5 Sprachen; Slogan, Beta-Einstieg, Datenschutz-Hinweis, Vertrauens-Badge, Flyer). Grund: Beim Laden verarbeitet der Hoster technische Daten; die absolute Form war angreifbar. Ein Test verhindert die alte Formulierung (K78).
- **K77 · Doku ohne unbelegte Aussagen:** «nDSG-konform» als juristisch nicht geprüft gekennzeichnet; Vercel-Angaben auf Infomaniak nachgeführt.

## [0.1.33-beta] — 2026-09-17

*Live seit **17.09.2026, 12:42** (`index-606d23bb.js`, Tag `v0.1.33-beta` = `db75d59`, per `curl` belegt: 164/164 Build-Dateien 200, altes `index-297034b6.js` 404, erfundene Namen 404, `sw.js` mit Cache `maloja-plana-606d23bb`, Backup `20260917-124213` mit 173 Dateien). Umfasst #211 (K67/K68/K71) und #212 (K46, K55–K58, K74).*

### Geändert
- **Sie-Ansicht siezt durchgehend (K46):** Rund 200 deutsche Texte standen nur in der Du-Form und erschienen so auch in der Sie-Ansicht, der Voreinstellung — Lebensereignis-Anleitungen (Umzug, Stelle verloren, Selbständigkeit, Betreibung, Pensionierung, KVG- und Zusatzwechsel u. a.), Lebenslagen, Notfallkarte, Anspruchs-Check, Vorsorge-Zukunft, Tresor. Sie haben jetzt eine Sie- und eine Du-Fassung, in fr (vous/tu) und it (Lei/tu) ebenso; einige Texte in der Ihr-Form («Meldet euch») sind mit umgestellt. Die zwei SEO-Texte sind anredefrei wie in `index.html`. Ein neuer Test verhindert, dass ein deutscher Text in der Sie-Ansicht wieder duzt. Muttersprachliches Gegenlesen fr/it bleibt offen (K70).
- **Rückfall-Sprache Deutsch (K58):** Fehlt einer Sprache ein Text, erscheint er jetzt auf Deutsch statt Englisch; auch beim Ladefehler wird Deutsch nachgeladen. Die Startsprache für unbekannte Browsersprachen bleibt Englisch. Der Paritätstest prüft zusätzlich gegen den deutschen Bestand.
- **«offline-fähig» statt «offline» (K55):** Werbetexte in `index.html`, `manifest.json`, README und App (5 Sprachen) sagen jetzt «offline-fähig» — offline geht erst nach dem ersten Besuch. Die FAQ-Sätze «Keine Daten werden je über das Netz gesendet» und «Nichts wird an einen Server gesendet» sind präzisiert: Maloja sendet keine Eingaben; beim Laden verarbeitet nur der Hoster technische Daten; auf ein anderes Gerät gelangen Eingaben nur durch eigenen Export oder Versand (K74).

### Rechtliches
- **Lizenztexte mitgeliefert (K56):** `/licenses/jsQR-LICENSE.txt` (Apache-2.0, Wortlaut des Originalprojekts) und `/licenses/QRCode.js-LICENSE.txt` (MIT, «Copyright (c) 2012 davidshimjs»); der Lizenzkommentar von QRCode.js fiel im Build weg. Verweise in `NOTICE`, `VENDOR.md`, `docs/legal/third-party-licenses.md`.
- **Doku-Reste (K57):** «Daten bleiben in der Schweiz (nDSG-konform)» ohne Beleg ersetzt; «Vercel Speed Insights» aus der Datenschutz-Position und «Performance-Metriken» aus der Datenschutzerklärung entfernt (kein Messdienst im Code); Nachhaltigkeits-Statement mit gemessenen Grössen. jsQR als Version 1.4.0 belegt (SHA-256 gleich wie das npm-Paket).

### Intern
- **K68 · Anrede-Reste:** `kvg.mammoGeoYourCantonNo` (de/fr/it/rm), `legal.resources.localGovDesc` (fr/it/rm) und `legal.privacy.sensitive1` (fr) sind anredefrei formuliert — sie erschienen vorher in der Sie-Ansicht geduzt bzw. umgekehrt. rm mit `TODO(rm)` zum Gegenlesen (K69).
- **K71 · Rückfall ohne Übersetzer:** Eine Ansicht ohne `t` und ohne Kontext zeigt jetzt die Texte der bereits geladenen Sprache (Anrede wie gespeichert) statt leerer Knöpfe; nur wenn nichts geladen ist, bleibt der Text leer. `createTranslator` (ungenutzt, immer Sie-Form) ist entfernt.
- **K67 · Hauptbundle:** Der Vermögensfreibetrag je Kanton liegt in `data/vermoegensfreibetragKanton.js`; `config/cantonalData.js` zieht damit nicht mehr den ganzen Sozialhilfe-Rechner ins Hauptbundle (62.71 → 62.09 kB gzip). `sozialhilfeRechner.js` reicht die Funktion weiter.

## [0.1.32-beta] — 2026-09-17

*Live seit **17.09.2026, 11:46** (`index-297034b6.js`, Tag `v0.1.32-beta` = `1437feb`, per `curl` belegt: 161/161 Build-Dateien 200, altes `index-c2f8af36.js` 404, erfundener Name 404, `sw.js` mit Cache `maloja-plana-297034b6`, Backup `20260917-114602` mit 171 Dateien). Umfasst die sechste Runde (#204–#208) und K49 (#203).*

### Behoben
- **Keine weisse Seite mehr beim Start (K60, #204):** Liess sich beim ersten Start keine Sprachdatei laden (alte zwischengespeicherte Startseite nach einem Deploy, offline), blieb die Seite weiss. Jetzt wird einmal pro Sitzung neu geladen; hilft das nicht, erscheint ein ruhiger Hinweis mit Knopf «Neu laden».
- **Schnappschuss vor dem Wiederherstellen nie gemischt (K61, #204):** Scheitert der Schnappschuss mittendrin (z. B. Speicher voll), werden die in diesem Lauf geschriebenen Sicherungskopien zurückgesetzt; das Wiederherstellen bricht wie bisher ab, ohne etwas zu überschreiben. Vor dem Release ergänzt (#208): Die Kopie eines jetzt leeren Bereichs aus einem früheren Lauf wird entfernt, und das Wiederherstellen aus der automatischen Sicherung nutzt denselben Schnappschuss (vorher sicherte es nur `or5_data`, ohne Abbruch bei Fehler).
- **Quellenangaben Taxpunktwert und Nachhaltigkeit (K65, #205):** Der Taxpunktwert-Hinweis sagt nicht mehr «fast überall provisorisch», sondern «in den meisten Kantonen provisorisch festgesetzt» (15 von 17 Quellen belegen das; eine Klammer «Beschlüsse und Verfügungen der Kantone» wurde vor dem Release gestrichen, weil drei Werte nur von Tarifpartnern belegt sind) — so weit tragen die kantonalen Quellen in den Daten. Die Infomaniak-Quellen im Abschnitt Nachhaltigkeit sind jetzt anklickbare Links (alle 5 Sprachen).

### Barrierefreiheit
- **Ansagen und ruhige Rückfälle (K64, #206):** «Online beantragen» (Prämienverbilligung) sagt den neuen Tab jetzt hörbar an; gesperrt zeigen beide Knöpfe dort den ruhigen Stil aus K53 (Text mid auf up, hell 5.25:1, dunkel 4.81:1, gestrichelter Rand). Die Kapitelansicht zeigt ohne Übersetzer nie mehr rohe Schlüssel, und Quellen-Links ohne Ansage melden sich im Entwicklungsmodus.

### Sprache
- **Französisch und Italienisch mit Sie- und Du-Form überall (K49, #203):** 237 fr- und 119 it-Texte hatten nur eine Anredeform; jetzt haben alle beide, die Liste der bekannten Lücken ist leer. Acht it-Texte standen in der «voi»-Form und sind korrigiert. Gegenlesen durch Muttersprachler:innen empfohlen.

### Intern
- **Aufräumen ohne Verhaltensänderung (K66, #207):** Steuer-Annahmen und `chf` an einer Stelle (`utils/steuerTexte.js`) · Rechtstexte reichen die Übersetzung an Links durch statt über eine Modulvariable · der Build stempelt `sw.js` auch bei `--outDir` · Test für den Löschsignal-Schlüssel in `main.jsx`.

## [0.1.31-beta] — 2026-09-17

*Live seit **17.09.2026, 11:14** (`index-c2f8af36.js`, Tag `v0.1.31-beta` = `672d8af`, per `curl` belegt: 159/159 Build-Dateien 200, altes `index-98d2d140.js` 404, erfundener Name 404, `sw.js` mit Cache `maloja-plana-c2f8af36`). Umfasst K59 (#200). Auf malojaplana.ch im Browser geprüft: Nach dem ersten Besuch (Beispiel-Modus) liegen 18 Einträge im Offline-Speicher, darunter `index-c2f8af36.js`, das Stylesheet und die Sprachdateien.*

### Behoben
- **Offline nach dem ersten Besuch (K59, #200):** Am 17.09. gemessen: nach dem ersten Besuch blieb die App ohne Netz leer, weil Haupt-Skript, Stylesheet und Sprachdatei geladen waren, bevor der Service Worker die Seite kontrollierte, und nie im Offline-Speicher landeten. Jetzt legt der Service Worker beim Installieren die Dateien der Startseite ab, und die Seite meldet ihm, was sie schon geladen hat (nur eigene Dateien unter `/assets/`). Abgelegte Dateien werden auch bei einem `Vary`-Header gefunden, und die Startseite ersetzt offline nur noch Seitenaufrufe, nicht Schriften oder Skripte. Lokal im Browser gemessen: Server aus, Neuladen → Startseite erscheint.

## [0.1.30-beta] — 2026-09-17

*Live seit **17.09.2026, 10:55** (`index-98d2d140.js`, Tag `v0.1.30-beta` = `b20cd0b`, per `curl` belegt: alle 159 Build-Dateien 200, altes Bundle `index-91c30770.js` 404, erfundener Name 404, Sitemap `lastmod` 2026-09-17, Backup `20260917-105542` mit 171 Dateien). Umfasst R4 vom 17.09. früh (#186–#188), #191 und die fünfte Runde vom Vormittag (#194–#198).*

### Sicherheit
- **Meta-CSP ohne `frame-ancestors` (#191):** die Direktive wirkt nur als HTTP-Header und löste im Meta-Tag einen Konsolenfehler aus (PageSpeed Best Practices 96). Clickjacking-Schutz unverändert über `X-Frame-Options`.

### Barrierefreiheit
- **«Öffnet in neuem Tab» hörbar (R4, #188):** 38 externe Links in 21 Dateien über `ExternerLink.jsx`, `rel="noopener noreferrer"` erzwungen; optisch unverändert.

### Sprache
- **fr/it mit Sie- und Du-Form in allen Rechtstexten (R4, #188);** ein Test verhindert neue Lücken, rund 356 ältere stehen als bekannte Lücke (Bau-Liste K49).

### Behoben
- **Sprachwechsel ohne rohe Schlüssel (K43, #194):** Die App wechselt die Sprache erst, wenn die neue geladen ist; bis dahin bleibt die bisherige stehen. Bei einem Ladefehler bleibt die bisherige Sprache.
- **Gesperrte Knöpfe lesbar (K53, #195):** Kontrast der gesperrten Export-, Entschlüsseln- und Format-Knöpfe von 2.4–3.4:1 auf mindestens 4.8:1, dazu ein gestrichelter Rand. Druckfarben des Dossiers an einer Stelle gesammelt (Ausdruck unverändert); die Druckzeile «Annahmen» der Finanzübersicht ist nicht mehr blassgrau, sondern in `#6B6560` gesetzt (#198).
- **Löschweg bei mehreren offenen Tabs (#198):** Wird der löschende Tab mitten im Löschen geschlossen, lädt ein anderer offener Tab nach 45 Sekunden selbst neu, statt still nichts mehr zu speichern.
- **Steuer-Annahmen (R4, #187):** 13. Monatslohn wird mitgerechnet (bei «ja»; sonst Hinweis) · keine Schätzung aus dem Nettolohn für Rentner und Selbständige · verheiratet ohne Angabe zum Partnereinkommen → keine Zahl, bei ausdrücklich 0 «Alleinverdiener-Ehepaar» · Steuerrechner, Finanzübersicht und Dossier lesen dieselbe Regel für das eingetragene steuerbare Einkommen · Tarifvergleich mit dem passenden steuerbaren Einkommen je Zivilstand.
- **Hinweise und Robustheit (R4, #186):** «Kantonal nicht bestätigt» auch bei Vermögen unter dem Freibetrag (Sozialhilfe, Schnellcheck, Dashboard) · Taxpunktwert-Stand je Kanton aus den Daten · Löschweg benachrichtigt andere offene Tabs · Wiederherstellen überschreibt nichts, wenn der Schnappschuss scheitert · Gemeinde ohne geratene Web-Adresse · AG-Links auf die neue Adresse · `CANTONAL_DATA_VERSION` entfernt.

### Dokumentation
- **Lizenzen und Aussagen (K47, #196):** Lizenzliste um Atkinson Hyperlegible, Capacitor (nur iOS-Hülle) und jsQR ergänzt · «gemeinnützig» gestrichen · Nachhaltigkeitsangaben zu Infomaniak auf deren eigenen Wortlaut gekürzt, mit Quellenzeile · «vollständig offline» präzisiert (5 Sprachen).
- **Quelle der Berufsauslagen-Pauschale (K53, #195):** SR 642.118.1 Art. 7 im Code vermerkt; die Kürzung bei Teilzeit fehlt noch (K54).
- **K52 geklärt (#197):** Kein KVG-Artikel regelt provisorisch festgesetzte Taxpunktwerte; auch das Freigabe-Register nennt keinen mehr (#198). Bau-Liste §1 und §14 nachgeführt (#193, #197).

## [0.1.29-beta] — 2026-09-16

*Live seit **17.09.2026, 01:46** (`index-91c30770.js`, Tag `v0.1.29-beta` = `2fcf409`, per `curl` belegt: alle 159 Build-Dateien 200, altes Bundle 404, Backup `20260917-014608` mit 165 Dateien). Umfasst die Entscheid-Runde vom 16.09. nachmittags (#161–#170, der Deploy-Versuch um 17:45 wurde vom Backup-Tor gestoppt) und die Runden vom Abend (#172–#185).*

#### Abend 16.09. (#172–#185)
##### Geändert
- **Sicherung verschlüsselt als Voreinstellung, Passwort mindestens 12 Zeichen (E10, #173):** «Mit Passwort sichern» steht zuerst, «Ohne Verschlüsselung sichern» bleibt wählbar mit ruhigem Hinweis (DSG Art. 7 Abs. 3). Ältere Sicherungen mit kürzerem Passwort lassen sich weiter öffnen. Die automatischen Schnappschüsse bleiben bewusst unverschlüsselt (K34, Begründung in `docs/security/backup-strategy.md`).
- **«Trifft nicht zu» und gelockerte Grundordnung (E17, #174):** Arbeitgeber, Telefon und E-Mail sind nur noch «empfohlen» (Grundordnung 15 statt 18 Angaben). Bei diesen und den Arbeitsfeldern lässt sich ein Feld als «trifft nicht zu» markieren; es zählt dann als erledigt und wird nicht mehr vorgeschlagen. Gespeichert als `_na` je Kapitel, rein additiv, keine Migration.
- **Kennzeichnungen (#175):** Kantons-/Gemeindesteuer als «grobe Schätzung» (K13, erster Teil) · Dashboard-Beschriftungen in lesbarer Grösse mit Kurzlabels und Silbentrennung (K18) · Taxpunktwerte als provisorisch gekennzeichnet, neun Kantone mit Stand 2025 genannt (K26), eigener Datenstand je Block (K27) · Rumantsch in der Sprachwahl als provisorisch (O14).
- **CI auf Node 24 / npm 11 (E27, #172),** Lockfile mit npm 11 erneuert, keine Versionssprünge.

##### Behoben
- **Bundessteuer mit dem steuerbaren Einkommen nach ESTV (E39, #184):** Sie wurde aus dem Nettolohn ohne die Standardabzüge gerechnet und lag deutlich zu hoch (ZH ledig 1'022 statt 906, alleinerziehend mit 1 Kind 447 statt 114, VD verheiratet mit 2 Kindern 1'670 statt 551). Jetzt dasselbe steuerbare Einkommen wie die Kantonstabelle, an allen 14'144 Messpunkten höchstens CHF 0.50 neben der ESTV; der Steuerrechner zeigt nur noch ein steuerbares Einkommen. Bei als Brutto erfasstem Lohn und bei Verheirateten mit Partnereinkommen keine Zahl.
- **Befunde aus dem Predeploy-Gate (#185):** `pii-scan.sh` nimmt erlaubte Stellen nur noch selbst aus (vorher ganze Zeilen); Tippflächen mind. 44 px; Kantonsname im Druck escaped; fr «canton de …» und Du-Form; Datenschutzerklärung zur Voreinstellung präzisiert; unbelegte Artikelnummer aus der Taxpunktwert-Fussnote entfernt.
- **Kantons- und Gemeindesteuer aus amtlichen Messpunkten (E37 #180, E38 #182):** Der eine Faktor je Kanton lag bei CHF 80'000 brutto (ledig) in allen 26 Kantonen 44–70 % unter dem ESTV-Steuerrechner 2026. Jetzt eine Stütztabelle je Kanton, Zivilstand und 0–3 Kindern (14'144 Messpunkte, Hauptort, ohne Kirchensteuer; Abweichung im Median CHF 5, höchstens CHF 391). Das steuerbare Einkommen wird nach den Standardabzügen der ESTV geschätzt. Steuerrechner, Finanzübersicht und Behördendossier nutzen dieselbe Regel und den Steuerkanton; ohne Messung (zwei Einkommen, Lohn als Brutto erfasst, mehr als drei Kinder, ausserhalb der Tabelle) keine Kantonszahl, sondern Links zur ESTV und zur kantonalen Steuerverwaltung. Das Behördendossier rechnet die Bundessteuer jetzt mit den Kindern im Haushalt.
- **Notfallkontakt «trifft nicht zu» (K38, #179):** mit einer leisen Anregung, eine Person des Vertrauens zu fragen; Notfallkarte, Vorlesekarte und Dossier zeigen «Keine Kontaktperson hinterlegt». Der Hinweis «Kontakt hinterlegt → Notfallkarte» erscheint nur noch mit Kontakt. Die Markierung beim Arbeitgeber (und seiner Adresse) gilt in «Finanzen» und «Ausbildung & Arbeit». Alimente-Felder markierbar. CSV-Export und Export-Vorschau ohne interne `_`-Felder (`_migratedAt` wurde bisher Zeichen für Zeichen zerlegt).
- **Sie-Form der Export-Notiz (K40, #181)** in de, it, rm · **Kontrast der Berg-Beschriftungen (K41, #181)** von teils 1.6:1 auf 5.9:1 (hell) bzw. 5.5:1 (dunkel), «noch nicht begonnen» jetzt kursiv statt blass · **Steuerkanton (K33, #181)** auch in Finanzübersicht und Steuererklärungs-Link.

##### Hinzugefügt
- **«Alle Daten auf diesem Gerät löschen» (E18, #174):** in den Einstellungen, mit Erklärung, Angebot «vorher sichern» und zweistufiger Bestätigung. Löscht alle `or5_`-Schlüssel (ausser dem Beta-Zugang) und die IndexedDB-Datenbanken der App; im Beispiel-Modus ausgeschaltet.

##### Performance
- **Hauptbundle 64.94 → 61.00 kB (E36, #177):** Onboarding und Tour wurden trotz `React.lazy` zusätzlich direkt importiert; die Statusabfrage liegt jetzt in `src/utils/einfuehrungStatus.js`. Ein Test verhindert, dass ein nachgeladenes Modul wieder direkt importiert wird.

##### Dokumentation
- **Rechtstexte (K39, #178):** Datenschutz, FAQ und Nutzungsbedingungen (5 Sprachen) sowie `docs/legal/*` nennen die verschlüsselte Voreinstellung, die unverschlüsselten automatischen Schnappschüsse und den Löschweg. Sieben offene Rechtsfragen stehen in #178.
- Anzahl der automatischen Schnappschüsse korrigiert (5, nicht 3; höchstens einer je 12 Stunden) und IndexedDB-Namen in `docs/security/data-flow.md` nachgeführt.

#### Nachmittag 16.09. (#161–#170)

##### Behoben
- **Prämienverbilligung ohne Beleg ohne Betrag (E9, #167, #168):** Die kantonalen IPV-Werte der App waren nach einem Muster erzeugt. Die Recherche in #161 zeigt: Die Beträge lagen in jedem belegten Kanton zu tief, die Einkommensgrenzen teils zu hoch, teils zu tief, und kein Kanton rechnet wie das Muster. Solange ein Kanton nicht amtlich belegt ist (heute alle 26), zeigt die App an keiner Stelle einen Betrag, kein «berechtigt» und keine Einschätzung aus der Einkommensgrenze, sondern einen neutralen Hinweis mit dem Link zur kantonalen Stelle. Ins Budget fliesst kein unbelegter Betrag. Der Verfahrens-Hinweis je Kanton ist ausgeblendet (für Glarus war er falsch).
- **Vermögensfreibetrag je Kanton (#169, #170):** Die App rechnete für alle Kantone mit der SKOS-Empfehlung 6'000 / 12'000 / +3'000 je Kind / höchstens 15'000. Zehn Kantone rechnen tiefer (AG, SH, SO, BL, SG, BE, NE, FR, VD, GE), Basel-Stadt und Tessin höher (Beleg: #166). Jetzt je Kanton; wo kein aktueller kantonaler Beleg vorliegt (BL, AI, OW, TI, SG, FR, VD) oder eine Lücke gedeutet werden musste (SH und AG mit Kindern), steht «Kantonal nicht bestätigt — bitte beim Sozialdienst Ihrer Gemeinde prüfen».
- **B-1 · Schnellcheck-Zahlen kommen im IPV-Rechner an (E22, #167):** Übergabe beim Klick, sichtbar «Gerechnet mit den Zahlen aus dem Schnellcheck», ins Profil nur auf «Ins Profil übernehmen».
- **B-2 · Steuerrechner merkt sich den Steuerkanton (E23, #165):** liest und schreibt `behoerden.cantoneOfTaxation`; bei Abweichung vom Wohnkanton fragt er, ob dieser mitgeändert werden soll.
- **CSV-Export gegen Formel-Injection geschützt (E14, #163):** Zellen mit `= + - @` Tab oder Wagenrücklauf am Anfang bekommen ein `'`; reine Zahlen bleiben Zahlen (OWASP «CSV Injection»).
- **Voll-Review-Rest (#162):** Ausrufezeichen in fr/it/en/rm entfernt, drei Textfarben auf `sageDeep`, SKOS-Datenstand 2026-01.

##### Dokumentation
- Prämienverbilligung 2026 je Kanton amtlich belegt, 21 abbildbar, 5 teilweise (#161) · Vermögensfreibetrag je Kanton mit Quellen (#166) · Rechts- und Sicherheits-Doku an den Code angeglichen, u. a. «Sicherung standardmässig unverschlüsselt» ehrlich benannt (#164).

## [0.1.28-beta] — 2026-09-16

*Die K-Runde vom 15. und 16.09.2026. **Live seit 16.09.2026, 12:23** (`index-2301b4b1.js` aus
`2aaeff5`), Tag `v0.1.28-beta` gesetzt (`RELEASE.md`, Schritt 6).*

### Behoben (16.09.)
- **Der Beispiel-Modus griff auf echte Dokumente zu (K24, #156):** Wer den Beispiel-Modus innerhalb der App betrat, konnte dort Dokumente hochladen und löschen — beides wirkte auf die echten Dokumente samt Datei. Erst nachgestellt (`beispielDokumente.test.js`), als B-3 in `BUGS.md` eingetragen, dann behoben: im Beispiel laufen Hochladen, Löschen und Ablaufdatum über eine Kopie im Arbeitsspeicher, die beim Betreten und Verlassen geleert wird.
- **Tardoc-Taxpunktwerte 2026 für 14 weitere Kantone (K22, #157):** AR 0.86 · FR 0.91 · GE 0.94 · GR 0.86 · LU 0.85 · SG 0.86 · TI 0.93 · UR 0.88 · VD 0.94 · ZG 0.82 · SZ 0.85 · OW 0.86 · NW 0.88; TG 0.86 bestätigt. Elf davon aus behördlichen Beschlüssen, drei aus Tarifpartner-Publikationen, jede Quelle einzeln gelesen und im Code zitiert. Neun Kantone bleiben ohne Beleg und stehen weiter als ungeprüft auf Stand 2025.
- **Rundung und Erhebungsgrenze der direkten Bundessteuer (K23, #154):** steuerbares Einkommen auf 100 Franken abgerundet, Jahressteuer auf 5 Rappen, keine Steuer unter 25 Franken (DBG Art. 36 Abs. 3; die beiden Rundungen stehen in der ESTV-Tabelle Form. 58c-2026, nicht im Gesetz). Gilt für alle Tarife.

### Neu (16.09.)
- **Export-Vorschau vor sechs weiteren Ausgaben (K20, #155):** Finanzübersicht drucken, Notfallkarte, IPV-Antrag, Budget-Bericht, Lebenslauf und Kalender-Datei zeigen vorher, was in der Datei stehen wird. 14 neue Tests, jeder gegen den echten Generator.

### Ruhe und Wahrheit (16.09.)
- **Demo leiser (K25, #156):** Die automatische Sicherung ruht im Beispiel-Modus, damit keine Fehlermeldungen mehr in der Konsole landen; nach «Beispiel verlassen» zeigt die Adresse wieder den Einstieg. Der Speicher-Schirm bleibt unverändert scharf.
- **«ZIP» aus der Doku (K21, #153):** 17 Stellen in 11 Dokumenten beschrieben den Export als ZIP-Archiv. Ein solches hat die App nie erzeugt. Historische und datierte Dokumente blieben unangetastet.

### Behoben (15.09.)
- **Elterntarif der direkten Bundessteuer (K12, #144):** Alleinerziehende wurden mit dem Grundtarif minus 263 Franken je Kind gerechnet. Diese Mischung kennt das DBG nicht. Neu nach DBG Art. 36 Abs. 2bis: Tarif für Verheiratete, minus CHF 263 je Kind (V EFD über die kalte Progression, AS 2024 479; Tarifstufen 2026 AS 2025 579; ESTV Form. 58c-2026). Die App weiss nicht sicher, ob die Voraussetzung erfüllt ist; deshalb gibt es eine Bestätigung, ohne sie rechnet sie vorsichtig mit dem Grundtarif. 8 Tests mit Sollwerten aus der ESTV-Tabelle.
- **Generika-Selbstbehalt (K14, #148):** Der Hinweis nannte «10 % statt 20 %». Nach KLV Art. 38a sind es 10 % bzw. 40 %. In 5 Sprachen korrigiert.
- **Tardoc-Taxpunktwerte 2026 (K14, #148):** Zürich 0.91 statt 0.89 (RRB ZH 1299/2025), Bern 0.86 statt 0.89 (Verfügung 2025.GSI.2252). Die Werte der übrigen 23 Kantone sind Stand 2025 und im Code als ungeprüft markiert.
- **Hilfe und FAQ versprachen eine «verschlüsselte ZIP-Datei» (K17, #145):** Geschrieben werden Einzeldateien (JSON, CSV, verschlüsselt `.maloja`). Texte in 5 Sprachen und `README.md` angepasst, Menüpfad wie in der App.
- **Heller Blitz im Dunkelmodus (K4, #142):** `public/theme-init.js` setzt `data-theme` vor dem ersten Rendern. Die CSP ist unverändert.
- **Beispiel-Modus:** Die Speichern-Knöpfe der Rechner schrieben Beispielwerte in die echten Daten; jetzt landen sie in der Beispiel-Kopie (#150).

### Neu
- **Export-Vorschau (K3, #145):** Vor Export, Dossier und Brief zeigt ein ruhiger Schritt, welche Angaben in der Datei stehen und ob sie verschlüsselt ist. 9 Knöpfe in 5 Ansichten, eigener Teil (2.6 kB gzip).
- **Ohne Code ausprobieren (K7, #150):** zweiter Weg auf der Code-Wand in den Beispiel-Modus. Ein Speicher-Schirm hält localStorage und sessionStorage im Arbeitsspeicher und sperrt IndexedDB; das Beta-Gate bleibt unangetastet.
- **Quellen (K1, K2, #147):** «BFS-Methodik» im Armutsgrenzen-Befund verlinkt auf die BFS-Armutsstatistik. Im Wechsel der Zusatzversicherung steht neu «Vor dem Wechsel prüfen» mit VVG Art. 4, 6 und 35a Abs. 4.

### Barrierefreiheit
- **Glyphen, zweite Hälfte (K5, #146):** 20 rohe Zeichen in 6 Ansichten durch Icons ersetzt, zwei neue Icons (`mappe`, `drucker`). Kalender-Knopfgruppen mit `role="group"`, Wiederholungs-Knöpfe mit `aria-pressed`, Sozialhilfe «Nächste Schritte» als h3. Fokusring nachgerechnet (K6): überall mindestens 4:1, nichts geändert.

### Technik
- **Lockfile mit npm 10 erneuert, `npm ci` in beiden Workflows (K15, #142).** Solange die CI auf Node 22 mit npm 10 läuft, das Lockfile nach Paketänderungen mit `npx npm@10 install --package-lock-only` erneuern.
- **Tote Exporte entfernt, `sw.js` öffnet nur noch die eigene Origin (K16, #146).**

### Dokumentation
- Freigabe-Register je Modul `docs/legal/freigabe-register.md` (K9), Crosslink-Test Kanton mit zwei neuen Einträgen in `BUGS.md` (K10), Notiz zu den `rm.js`-Keys (K11), alles #149. Fremd-Audit gegen den Code gelegt, Bau-Liste §8 (#141, #143).

## [0.1.27-beta] — 2026-09-15

*Stand seit 0.1.26-beta: PR #114 bis #139. **Live seit 15.09.2026, 22:14** (`index-4a2ca1ae.js`);
Tag `v0.1.27-beta` auf `f368fbb` (`RELEASE.md`, Schritt 6).*

### Barrierefreiheit
- **Barrierefreiheit/Icons (M8, erste Hälfte):** Rohe Text-Glyphen `◰ □ ● ✕` in Sozialhilfe und Schulden-Manager durch IconSystem-SVGs ersetzt (neu: `rechner`, `kaestchen`, `kreuz`, je ein Element); die Barometer-Legenden `▬ ● ▏` (Lohn-Einordnung, Regional-/Miet-Barometer) sind jetzt echte SVG-Marken aus einer gemeinsamen `LegendenMarke`-Komponente, die die Balken-Marken spiegeln (Füllung · Punkt · Strich · «!»). Texte und i18n-Keys unverändert; Bundle 63.49 → 63.65 kB.

### Behoben
- **AHV-Aufschubszuschlag nach Art. 55ter AHVV (Swiss-Precision 15.09., 🔴 1):** Der Zuschlag beim Rentenaufschub war linear mit 3,2 %/Jahr modelliert (5 Jahre → 16,0 %). Neu die amtliche Tabelle aus Art. 55ter Abs. 1 AHVV (SR 831.101, Stand 1.1.2026; identisch BSV-Merkblatt 3.04 Ziff. 14): 1 J 5,2 · 2 J 10,8 · 3 J 17,1 · 4 J 24,0 · 5 J 31,5 %, dazwischen nach Monatsgruppen 0–2/3–5/6–8/9–11. Unter 12 Monaten kein Zuschlag (Art. 39 Abs. 1 AHVG, Mindestdauer ein Jahr). Die Vorbezugskürzung (6,8 %/Jahr) ist unverändert. Neu `aufschubZuschlagProzent()`, 7 Tests.
- **Referenzalter im Zukunfts-Szenario nicht mehr fest «65» (Swiss-Precision 15.09., 🔴 2):** Die Texte «vor/über das Referenzalter 65» und «Rücktritt mit 65» zeigen jetzt das gerechnete Referenzalter der Person (`{referenzalter}`, z. B. «64 Jahre 6 Monate» für Frauen JG 1962), in allen 5 Sprachen; Test je Sprache.
- **Backup-Restore gehärtet (TODO §G2):** Die Struktur-Prüfung beim Import ist jetzt eine Barriere statt einer Warnung — schlägt `validateBackupPayload` fehl, wird nichts geschrieben (auch kein Pre-Restore-Snapshot); ruhige Meldung in 5 Sprachen. Dazu ein 50-MB-Limit vor dem Lesen der Datei, Anzahl-Obergrenzen für alle Listen (Dokumente, Kalender, Kontakte, Merkliste, Schulden/Betreibung/Verlustscheine) und `merkliste` in der Validierung. Neu `restoreBackup()` in `backupCrypto.js` als eine Stelle für Prüfen → Snapshot → Schreiben; 22 neue Tests.

#### Aus dem Voll-Review Stufe L (2026-09-15 — neun Prüfer über die ganze App)
- **Recht:** Kündigungsbrief zitierte für die Schriftform «OR Art. 266a» — richtig ist **OR Art. 266l Abs. 1** (5 Sprachen); KVG-Kündigungshinweis nennt jetzt Art. 7 Abs. 2 und den Jahresende-Fall; «null Netzwerkverkehr» → «läuft auch ohne Netz weiter» (der Service Worker ist network-first); `README` verlinkt `LICENSE.txt`.
- **Copy/Würde:** Schulden-Einordnung «Kritische Schuldenlage … erforderlich!» ruhig umformuliert (5 Sprachen); ALV-Block hatte nur Du-Form → `{sie,du}`-Split für 9 Keys; «Arbeitslosengeld» → «Arbeitslosenentschädigung»/«ALV-Taggeld» (Schweizer Begriff); drei Ausrufezeichen im Onboarding weg.
- **Brief-Generator:** Objektadresse im Kündigungsbrief war doppelt escaped («Meier &amp;amp; Co»), jetzt genau einmal; Regressionstest.
- **Barrierefreiheit:** Text `onSand` auf Fläche `sky` lag bei 4.496:1 (unter AA) → Buttons auf `skyDeep`/`surface`; drei Textknoten mit rohem `sage` auf `sageDeep`; Prämienverbilligung: Checklisten-Titel h4 → h3 (kein Überschriften-Sprung).
- **Datenschutz-Texte (nDSG-Wahrheit):** der Export schreibt Einzeldateien (JSON, CSV, verschlüsselt `.maloja`), nicht «ZIP» — `legal.privacy.backup1`/`rights3` in 5 Sprachen korrigiert; Server-Logs «automatisch gelöscht» → «nach der Aufbewahrungsfrist des Hosters gelöscht» (`hosting1`). Petitions-Plattform: `petitionen.ch` (SSL-Fehler) → `petition.ch`, auf das die Domain selbst umleitet.
- **Robustheit:** Dokument-Upload meldet jetzt auch unlesbare Dateien (`FileReader.onerror`); Thema-Speichern in try/catch wie alle anderen Storage-Zugriffe.
- **CI/Deploy:** `permissions: contents: read` in beiden Workflows, SFTP-Passwort im dormanten Deploy-Workflow nicht mehr im Befehlstext (`--env-password` wie `deploy.sh`); `public/icon-preview.html` (Dev-Werkzeug, lag live) nach `docs/design/`.

### Seit 0.1.26-beta schon live, bisher ohne Changelog-Zeile
- **Lohn-Barometer sichtbarer** (#114) und **Predeploy-Runde 20.07.** (#115: toter Klick am Barometer, a11y, totes jsPDF entfernt).
- **Steuer-Säulen nach Zivilstand im Probier-Modus** (#116) · **Kapitel-Reihenfolge per Test verankert** (#118) · **steuerbares Einkommen direkt eingebbar** (#120).
- **Sitemap `lastmod` + IndexNow** (#124) · **Krypto-README** (#125) · **Deploy: Rollback-Backup als Gate** (#126) · **verwaiste Build-Dateien werden nach dem Upload entfernt** (#128).

### Dokumentation
- Q3-Wartungsprotokoll (#131) · Bau-Liste bis 30.09. mit Bug-Eingang, wageClaim-Zettel und DSFA-Entwurf (#132) · Befund-Liste Voll-Review Stufe L (#137) · Rechts- und Security-Doku auf Code-Stand (#138).

## [0.1.26-beta] — 2026-07-19

### Behoben (Predeploy-Review 2026-07-19)
- **Sie/Du-Anrede:** Die Armutsgrenzen-Hinweise (`povertyLineNote`/`povertyBruttoHint`) sprachen im Du-Modus in Sie-Form — jetzt korrekt als `{sie,du}` gesplittet (de/fr/it/rm).
- **Rätoromanisch:** Die Lohn-Barometer-Zonen waren unübersetzt deutsch — jetzt übersetzt (Muttersprachler-Gegenlese offen, mit `TODO(rm)` markiert).
- **Barrierefreiheit:** Barometer-Legenden-Glyphen (▬/●) für Screenreader ausgeblendet (`aria-hidden`, wie der Miet-Barometer); Auswahl-Pills nutzen `sageDeep` statt `sage` als Text (WCAG-AA-Kontrast).
- **Quellen-Redlichkeit:** Armutsgrenze als „nach BFS-Methodik 2024" statt „(BFS 2024)" — die Zahl ist haushaltsindividuell berechnet, nicht vom BFS publiziert.
- **Robustheit:** `localStorage` in BetaGate/Dashboard gegen blockierten Speicher (Privat-Modus) abgesichert; externe Quellen-Links mit vollständigem `rel="noopener noreferrer"`.
- **Aufräumen:** 5 ungenutzte i18n-Keys (altes Einkommens-Textband) in allen 5 Sprachen entfernt.

## [0.1.25-beta] — 2026-07-14

### Barrierefreiheit
- **Durchgehender AA-Kontrast (Hell & Dunkel)**: Sekundär- und Feintext, Kapitel-Untertitel, Statusfarben, aktive Reiter/Umschalter, Badge-Etiketten und die grünen Aktions-Buttons erreichen jetzt auf allen Flächen ≥4.5:1 (WCAG 1.4.3). Ursache waren wenige zentrale Stellen: die Grautöne `mid`/`soft`, `sandDeep` sowie `skyDeep` (Dunkelmodus) waren auf getönten Flächen zu hell, und Kapitel-/Status-/Reiter-Texte nutzten die dekorativen Roh-Akzente statt der lesbaren `*Deep`-Varianten. Geprüft über Dashboard, alle sieben Kapitel und die Rechner-/Situationsansichten (Hell + Dunkel).
- **Grössere Trefferflächen**: die Kopfzeilen-Symbole (Einstellungen/Barrierefreiheit/Menü) sind 44×44 px, der Vorlese-Knopf erreicht die AA-Mindestgrösse ≥24 px (WCAG 2.5.5/2.5.8) — der Icon bleibt dabei klein und ruhig.
- **AA-Kontrast vervollständigt (Status-Rot)**: die letzten Stellen mit dekorativem Roh-Rosa als Text — Speicherfehler-Meldung, negativer Budget-Saldo, Prämien-Abweichung, überfällige-Termine-Zähler und der Frei-Betrag — nutzen jetzt die lesbare `roseDeep`-Variante (≥4.5:1, WCAG 1.4.3, Hell + Dunkel).

### Geändert
- **Ruhigerer Einstieg**: Auf der Übersicht steht jetzt zuerst das Versprechen (Titel + Nutzen); der „Frühe Version"-Hinweis rückt darunter — auf dem Handy stand die Warnung sonst vor dem Inhalt.
- **Leiserer Erscheinungsbild-Umschalter**: Der Hell/Dunkel-Knopf trägt dieselbe ruhige Ghost-Fläche wie die übrigen Kopfzeilen-Schalter; Gold bleibt echten Primär-Aktionen vorbehalten.

### Behoben
- **Latenter Hook-Reihenfolge-Fehler (Export/Sicherung)**: Im Probier-/Demo-Modus wurden die React-Hooks in wechselnder Reihenfolge aufgerufen (bisher folgenlos, da der Moduswechsel die Ansicht verlässt). Der Ausstieg steht jetzt nach allen Hooks — robust gegen künftige Änderungen.
- **Doppelte Übersetzungs-Schlüssel entfernt**: `franchise` (rm) und `disclaimer` (it) waren je zweimal definiert; der jeweils verdeckte Eintrag ist raus (keine sichtbare Änderung — die aktive Fassung bleibt).
- **Vier tote Behörden-Links korrigiert**: die BWO-Kantonshilfen (FR/IT), die Caritas-Schuldenberatung und der Tessiner Sozialdienst-Link liefen ins Leere (404) → auf die aktuellen, einzeln geprüften Ziele umgestellt.
- **Seiten-Meta wieder in einer Anrede**: der auf 60 Zeichen gekürzte Titel hatte „Dein" verloren, während `og:title`/`twitter:title`/Beschreibung es behielten — jetzt durchgehend neutral, passend zum Sie-Standard der App.

### Auffindbarkeit
- **SEO/GEO-Fundament**: statischer Titel, Beschreibung, Open-Graph-/Twitter-Karten, mehrsprachige `hreflang`, `canonical`, `robots.txt`/`sitemap.xml` und ein `schema.org`-JSON-LD-Block machen die Seite für Suchmaschinen und KI-Antwortmaschinen sichtbar — die App rendert clientseitig, ohne diese Hülle sähen Crawler ohne JavaScript nichts. Ein Deploy-Gate (`scripts/check-seo.sh`) hält die Bausteine bei jedem Release nach. Alles self-hosted, CSP self-only bleibt unberührt.

### Intern
- **Linting reaktiviert**: ESLint 9 als echte devDependency + schlanke Flat-Config (`eslint.config.js`); `npm run lint` läuft wieder sauber durch (0 Fehler). Die Basisregeln fanden die drei oben behobenen Punkte.
- **Toter Code entfernt**: ungenutzte Importe/Variablen in ~30 Dateien bereinigt.
- **Effekt-Abhängigkeiten geprüft (`exhaustive-deps`)**: alle 9 Hinweise einzeln bewertet. Vier bekamen die fehlende Dep (`t`/`tr` ist memoisiert → stabil, Neuberechnung bei Sprachwechsel erwünscht; `sectionTabs.length`); `tr` in ChapterView zusätzlich in `useMemo` stabilisiert. Fünf sind bewusste Auslassungen (Mount-only bzw. abgeleitete Werte, die als Dep jeden Render feuern würden) und tragen jetzt eine begründete `eslint-disable`-Zeile. Sprachwechsel live gegengeprüft (FR↔DE, keine Schleife/kein Crash).
- **Restliche 4 Domänen-Konstanten geprüft & aufgelöst** → Lint-Stand **76 → 0** (0 Fehler, 0 Warnungen):
  - `MUTTERSCHAFT_MIN_MONATE_AVS/ARBEIT` (Anspruch EOG Art. 16b) jetzt via `EO_PARAMS` exportiert → für die UI nutzbar statt nur Code-Kommentar.
  - `FIELD_KEYS` exportiert (wie das Geschwister `CHAPTER_KEYS` — sprachunabhängige Feldkarte für Daten-Init/-Validierung).
  - `geburtsjahr` in `berechneAltersrente` als **reserviert** dokumentiert: das Referenzalter ist derzeit pauschal 65; die AHV-21-Übergangsjahrgänge der Frauen (1961–1969) sind noch nicht modelliert (bewusst offen — braucht belegte Fach-Prüfung).
- **Repo-Hygiene**: `maloja-server/` (privates Backend) und `_maloja-archiv/` (History-Purge-Backups) in die `.gitignore` aufgenommen — liegen sie im Working Tree, kann `git add -A` sie nicht mehr versehentlich ins öffentliche Repo ziehen.

## [0.1.24-beta] — 2026-07-10

### Neu
- **Mein Gepäck — mehr Wege**: In die Ausrüstungsgegenstände sind fünf weitere Lebenswege eingezogen (Mietzins prüfen, Ausbildung & Stipendien, Krankenkasse zum ersten Mal, Invalidität, Organspende).
- **Vorsorge, Zukunft-Reiter — Rücktrittsalter live**: Beim Ziehen der Marke erscheinen sofort das Alter und die daraus folgende Monatsrente; die wichtigen Alter (63/64/65/70) rasten sanft ein.
- **Zwei ruhige Übersichten im Alter**: „Was im Alter auf dich zukommt" (die typischen Kostenposten) und „Was dich im Alter entlastet" (oft übersehene Vergünstigungen, mit Weg zum Leistungs-Schnellcheck) — beide ehrlich ohne erfundene Beträge.

### Barrierefreiheit
- **Reduzierte Bewegung**: neuer Schalter im Barrierefreiheit-Menü, der alle Animationen ruhigstellt — auch ohne System-Einstellung.
- **Linkshänder-Modus** (Handy): Menü- und Einstellungs-Schubladen sowie der Boden-Anker spiegeln sich für die Einhand-Bedienung mit der linken Hand.
- **Besserer Kontrast**: Link- und Fehlertexte im Hellmodus lesen sich jetzt klar (WCAG AA); Formularfehler werden Screenreadern angesagt.

### Behoben
- Die Einstellung „reduzierte Bewegung" stellt den weichen Seitenlauf (Smooth-Scroll) jetzt wirklich ab.

## [0.1.23-beta] — 2026-07-09

### Neu
- **Mein Gepäck** — neue Ansicht neben Baum und Obstgarten: ein Rucksack packt sich aus in echte Ausrüstungsgegenstände je Lebensbereich (Schlüsselbund, Werkzeugrolle, Erinnerungskiste, Arztkoffer, Feldflasche, versiegelter Brief). Einen Gegenstand aufklappen, hineinschauen — die Lebensereignisse darin führen in ihren bestehenden geführten Ablauf. Reife-Pünktchen zeigen ehrlich, wie viel aus dem passenden Bereich schon erfasst ist (kein erfundener Fortschritt).

### Sicherheit
- Externer Pro-Senectute-Link im Pensionierungs-Ablauf mit `rel="noopener noreferrer"` gehärtet.

## [0.1.22-beta] — 2026-07-09

### Neu
- **Ansprüche am Lebensbaum** — trägt ein Bereich einen gedeckten Anspruch (Prämienverbilligung, Sozialhilfe, Ergänzungsleistungen), bekommt seine Frucht einen ruhigen Ring; ein Klick führt zum benannten Anspruch. Die Erinnerungsliste zeigt sie zusätzlich unter „Möglicherweise für dich".
- **Umwandlungssatz der eigenen Pensionskasse** im Vorsorge-Rechner — statt immer des Mindestsatzes lässt sich der tatsächliche Satz eintragen, für eine realistischere BVG-Rente.
- **Hinterbliebenenrente & Ergänzungsleistungen** als eigener, klar hervorgehobener Schritt im Todesfall-Ablauf.
- **Kosten im Alter** — neuer Orientierungs-Schritt in der Pensionierung: wer zahlt was bei Pflege (Spitex/Heim), samt Ergänzungsleistungen, Hilflosenentschädigung und Pro Senectute.
- **Mehr regionale Vergünstigungen** — Caritas-Markt in elf Kantonen, GGG Wegweiser Basel und Pro Senectute als Beratungs-Anker.

## [0.1.21-beta] — 2026-07-09

### Neu
- **Anspruch-Check** — ein geführter Weg von den Zahlen zur Lebenslage: die Anspruchs-Landkarte zeigt alle Berechtigungen im Überblick, ein geführter Check schlägt die Brücke, und der Ergebnis-Schritt „Dein Überblick" fasst zusammen. Die Zahlen aus dem Schnellcheck fliessen dabei in den Überblick ein.
- **KK-Beanstandungsbrief** — geführte Auswahl des Grundes.
- **Beistandschaft-Wegweiser** (Erwachsenenschutz) im Notfall-Bereich, samt Glossar-Begriff.

### Behoben
- Barrierefreiheit: stimmige Überschriften-Hierarchie in den neuen Anspruch-Ansichten.
- Doppelter Platzhalter im Brief entfernt.

## [0.1.20-beta] — 2026-07-09

### Geändert
- Der Einstieg in den Lebens-Obstgarten ist auf dem Dashboard jetzt eine sichtbare Einladung statt eines leisen Links.
- Auffindbarkeit: Kopf-Metadaten je Sprache dynamisch, `canonical`/`hreflang` stimmig, Sitemap aktualisiert.
- Hinweis zum SBB-Begleitabo präzisiert (Text und Link).

### Behoben
- Barrierefreiheit: die letzten ungelabelten Formularfelder sind jetzt korrekt mit ihrem Label gekoppelt.

## [0.1.19-beta] — 2026-07-09

### Geändert
- **Deine Instrumente** — die vier Selbstchecks stehen jetzt im ruhigen 2×2-Raster statt 3+1.
- Einheitliches Anrede-Register in den Instrumenten; „Puffer" heisst durchgehend „Reserve".

### Behoben
- Die Schutzschild-Kachel öffnet nun das Versicherungs-Kapitel statt der Basis.
- Barrierefreiheit: Tacho- und Kompass-Grafik gelten als dekorativ und werden nicht mehr doppelt vorgelesen; sand- und himmelfarbene Schrift ist im Hellmodus WCAG-AA-kontraststark.

## [0.1.18-beta] — 2026-07-09

### Wartung
- `deploy.sh` räumt alte Rollback-Sicherungen automatisch auf (behält nur die neuesten drei).
- Repo aufgeräumt: leere `prompts/`-Stubs und veralteter `BUTTONS_AUDIT` entfernt, `src/data/raw/` (nur lokale Roh-Tabellen) wird ignoriert.

## [0.1.17-beta] — 2026-07-09

### Neu
- **Deine Instrumente** — Dashboard-Spiegel der vier Selbstchecks: Franchise-Tacho (Prämien), Leistungs-Kompass (Schnellcheck), Reserve-Tankanzeige (Finanzen) und Versicherungs-Schutzschild. Jede Kachel führt in den passenden Bereich.
- **Lebens-Obstgarten** — neue, naturgetreue Gartenansicht als eigener Blick auf den Lebensordner.
- **Schnellcheck** — ruhiger Wegweiser zu lageabhängigen Leistungen.
- **Versicherungs-Schutzschild** — zwei Schilde: Pflicht (gesetzlich) und Empfohlen.

### Geändert
- Instrumente-Panel wird auf dem Dashboard lazy geladen — das Haupt-Bundle bleibt unter dem 65-KB-Budget.
- `deploy.sh`: SFTP-Passwort sonderzeichensicher (`--env-password`), und der Backup-Schritt hängt bei Verbindungsproblemen nicht mehr endlos.

## [0.1.16-beta] — 2026-07-08

### Sicherheit
- Backup-Verschlüsselung gehärtet: Version + Algorithmus werden jetzt in den GCM-Auth-Tag gebunden (AAD) und beim Öffnen explizit geprüft — ein manipuliertes oder formatfremdes Backup scheitert klar, statt still etwas Falsches zu tun. Der Schlüssel auf dem Öffnen-Pfad ist nicht mehr extrahierbar (schützt die Zero-Knowledge-Garantie auch bei kompromittiertem Client-Code).

### Behoben
- Barrierefreiheit: Status-Banner (Probier-Modus, Demo, DB-Hinweis, Frühe-Version-Hinweis) umschliessen ihre Buttons nicht mehr in der Vorlese-Region — Screenreader lesen nur noch den Status, nicht die Bedienelemente.

## [0.1.15-beta] — 2026-07-08

### Neu
- **IK-Historie auch im Zukunft-Reiter** des Vorsorge-Rechners: eine ruhige AHV-Grundlage-Karte zeigt die erfasste Beitragshistorie direkt dort, wo die Projektion sie nutzt — mit aufklappbarem Editor (dieselbe Erfassung, keine Doppel-Eingabe) und Sprung in den AHV-Reiter. Prinzip: nie zurück-navigieren müssen.

### Behoben
- **CV-Export gegen XSS abgesichert** (Feld-Inhalte werden beim Export escaped); zusätzlich Referrer-Policy gesetzt.

### Intern
- `BUGS.md` als eine ruhige Bug-Liste eingeführt (Regel: ein Bug ist erst weg, wenn ein Test ihn festhält).
- `scripts/i18n-gap-scan.mjs` misst offene Übersetzungen; `RUMANTSCH_GAP_NOTE.md` auf realen Stand gebracht.
- Verwaiste `legal.resources`-Titelschlüssel entfernt.

## [0.1.13-beta] — 2026-07-06

### Neu
- **Lebensbaum trägt Früchte**: pro Lebensbereich eine Schweizer-Frucht-Silhouette am passenden Ast, mit eigener Ast-Farbe — barrierefrei über Silhouette, Helligkeit und Wort unterscheidbar (nicht nur Farbe)
- **Bereichs-Früchte mit echtem Icon-Negativ**: das Bereichs-Symbol steht als ausgespartes Negativ auf einer soliden Frucht-Scheibe (SVG-Maske statt aufgesetztem Icon); Cluster-Früchte bündeln mehrere Bereiche
- **Arztkoffer** — ein ruhiges Zuhause für alles Gesundheitliche (Pilot-Metapher, 7 Fächer)
- **Bundesordner-Register** im Dokument-Tresor: Reiter je Bereich mit Ast-Frucht und Ast-Farbe
- **Glossar-Tooltip für Abkürzungen** (Testperson A-Verständlichkeit): Fachbegriffe/Abkürzungen mit Aufklapp-Pfeil erklärt, ohne den Lesefluss zu brechen

### Geändert
- **Boden-Anker fix am unteren Rand** mit Safe-Area-Berücksichtigung (iPhone-Notch/Home-Indikator); Früchte erscheinen nur noch im Baum, nicht im Anker
- **Mobile-Kopf aufgeräumt**: Einstellungen/Konto oben rechts, Footer wird zur mitscrollenden Inhalts-Fusszeile
- **Echtes Zahnrad-Symbol** für Einstellungen; „Rundgang"-Eintrag entdoppelt

### Behoben
- Boden-Anker-Labels in EN/FR/IT/RM ergänzt (waren nur auf Deutsch)

### Quellen
- Fortführung Design-Schritte 2 (Navigations-Rückgrat) und 3 (Pilot-Metapher Dokumente)

---

## [0.1.12-beta] — 2026-07-06

### Neu
- **Lebenszustände-Ebene vollständig (alle 11 Zustände live)**: neu „Pensioniert / im AHV-Alter", „Ohne Arbeit / zwischen Stellen", „Verschuldet oder in Betreibung", „(Halb-)Waise" — proaktive Situationen, die versteckte Berechtigungen aufdecken (`#/situationen`)
- **Ablauf-Anreicherung mit Nordstern-Brücken**: alle 8 dünnen Abläufe (Trennung, Kind, Todesfall, Heirat, Betreibung, Pensionierung, Selbständigkeit, Bewilligung) binden jetzt an einen Lebenszustand an — Ereignis ↔ Zustand durchgängig vernetzt
- **Ereignis→Zustand-Rückwege**: „Ohne Arbeit" → RAV-Anmeldefrist, „Pensioniert" → Pensionierungs-Ablauf
- **Regionale Vergünstigungen bei tiefem Einkommen** (Braindump #26): KulturLegi (Caritas) für **alle Kantone** web-verifiziert (deutschsprachig `kulturlegi.ch/<region>`, französischsprachig CarteCulture) + kuratierte Zusatz-Angebote für Basel (Familienpass, Volkszahnklinik, Volkshochschule); Block auf 8 einkommens-nahen Lebenszuständen, kanton-bewusst (has/none/check)
- **IPV**: Orientierung „Anspruch & Aufenthaltsbewilligung" (auch Ausweis L kann berechtigen), Brücke aus dem Bewilligungs-Ablauf zur IPV-Box, „Unterlagen für den Antrag merken" (Merkliste)
- **Anspruchs-Matrix** im Dashboard: leiser positiver Hinweis „Anspruch möglich" (Sozialhilfe/IPV), streng gegated, nur positiv
- **Notruf-Vorlesekarte** mit opt-in Standort (Geolocation nur on demand, nie gespeichert)
- **Mehrfach-Einträge** für Budget-Posten (z. B. Internet & Telefon einzeln auflisten)
- **Kalender-Vorlage** „Medikamente nachbestellen / Rezept erneuern"
- **Ruhige Berg-Ladeanimation** (CalmLoader) als sanft atmende Granit-Silhouette beim Nachladen

### Geändert
- **Kohärenz-Audit abgeschlossen**: Steuernummer, Krankentaggeld und Einkommensart werden jetzt in den Spiegelkarten angezeigt; Einkommensart (netto/brutto) steuert die Prefills von ALV (brutto) und Sozialhilfe (netto) korrekt
- **Bundle deutlich schlanker**: Kern-/Sekundär-Views ausgelagert → Haupt-Chunk −32 % (73,9 → 50,0 kB gzip); Navigation zu nachgeladenen Views robust (startTransition)
- **App-Version** wird jetzt aus einer einzigen Quelle (`package.json`) gelesen — kein Drift mehr zwischen Footer und Paket
- Auto-Backup sichert jetzt auch Merkliste und Notfall-Kontakte

### Behoben
- IPV-Schnellcheck-Hinweis wurde ohne gesetzten Kanton doppelt angezeigt
- FR/IT-Formulierungen bei Todesfall/Hilflosenentschädigung natürlicher

### Quellen
- KulturLegi/CarteCulture (Caritas) — regionale Verzeichnisse je Kanton (2026 web-verifiziert) · SVA Zürich / Kanton Basel-Stadt (IPV-Anspruch) · SKOS (Existenzminimum)

---

## [0.1.11-beta] — 2026-06-30

### Neu
- **Franchise mit/ohne Unfall einzeln wählbar**: in der Referenzprämien-Tabelle wählt ein Klick auf den Mit- oder Ohne-Preis die Franchise und die Unfall-Variante zusammen
- **Franchise-Wechsel: wie oft?**: der Franchise-Optimierer zeigt jetzt, dass die Franchise einmal pro Jahr änderbar ist — wirksam auf den 1. Januar, Anmeldung bis Ende November (Kassenwechsel: 30. November), belegt mit KVG Art. 7 und KVV Art. 94

### Quellen
- KVG Art. 7 (Versichererwechsel) · KVV Art. 94 (Wahlfranchisen) — fedlex

---

## [0.1.10-beta] — 2026-06-30

Krankenkasse: Unfalldeckung mit/ohne transparent, Wunschkasse genauer wählbar
und eine belegte Antwort auf „lohnt sich eine höhere Franchise?". Plus app-weit
präzisere Quellen-Links.

### Neu
- **UVG mit/ohne Unfall**: als Angestellte:r bist du über den Arbeitgeber unfallversichert — ein ruhiger Hinweis zeigt, dass du die Unfalldeckung bei der Kasse abwählen kannst, und ein Umschalter zeigt die konkrete Prämien-Differenz
- **Zwei Referenzspalten (mit/ohne Unfall)** in Franchise-Tabelle und Kassenvergleich
- **Wunschkasse mit/ohne**: im Kassenvergleich die gewünschte Variante per Klick auf den Preis wählen
- **Franchise umwählbar**: Franchise direkt anklicken oder im Kassenvergleich auswählen — Tabelle und Vergleich rechnen darauf
- **Franchise-Optimierer**: Prämien-Ersparnis pro Jahr, die Reserve, die man tragen können sollte (Franchise + max. Selbstbehalt), und bis zu welchen Gesundheitskosten sich die höhere Franchise lohnt (KVG Art. 64)
- **Aufklappbare Kassen-Detailansicht** als richtige Tabelle (Franchise / Mit / Ohne)

### Verbessert
- **Quellen-Links aufs Wort**: Quellen verlinken jetzt das Wort selbst (BAG, WHO, SKOS …) statt einer zweiten, lärmenden Domain — und Gesetzesartikel führen auf die amtliche Fassung (fedlex, sprachrichtig)

### Quellen
- BAG priminfo.admin.ch (Prämien je Tarif/Franchise) · KVG Art. 64 / KLV (Selbstbehalt) · WHO/UNO SDG 3.8.2 · SKOS · fedlex (Gesetzesartikel)

---

## [0.1.9-beta] — 2026-06-30

Sichtbare Fairness: die Krankenkassen-Prämie und die Miete der eigenen Region
gegen den Schweizer Schnitt — und was die Prämienverbilligung wirklich ausmacht.

### Neu
- **Regional-Barometer Krankenkasse**: zeigt ruhig, wie die Durchschnittsprämie deiner Region zum Schweizer Schnitt steht (BAG 2026) — mit deiner eigenen Prämie als Punkt „wo wir sind". In Prämien-Orientierung und Monatsbudget
- **Regional-Barometer Miete**: deine Region gegen den Schweizer Schnitt, abgestimmt auf die Wohnungsgrösse (BFS) — mit deiner Miete als Punkt, im Budget
- **Prämienverbilligung sichtbar**: die KK-Last-Karte zeigt, was die IPV abnimmt und wie viel bis zum 10%-Richtwert noch fehlt
- **Mietzinsbeiträge-Hinweis**: ob es in deinem Kanton Mietzinsbeiträge gibt — würdevoll, ohne falsche Zusage (BWO)
- **Herzensempfehlungen**: Winterhilfe Schweiz und Stiftung Rheinleben (neue Gruppe „Soziale Unterstützung")

### Verbessert
- **PLZ nur einmal eingeben**: eine in der Prämien-Orientierung eingegebene PLZ fliesst ins Wohnen-Kapitel zurück und leitet Kanton, IPV und Miet-Vergleich ab

### Quellen
- BAG mittlere Prämie 2026 · BFS Mietpreise nach Kanton/Zimmerzahl · BWO Kantonale Hilfen

---

## [0.1.8-beta] — 2026-06-30

Belegbare Haushalts-Budget-Richtwerte (BFS) mit Teuerungs-Gap, abgestimmt auf
die Haushaltsgrösse — ruhig einklappbar. Und der Lebensbaum wird anklickbar.

### Neu
- **Budget-Richtwerte pro Kategorie (BFS)**: Zu Wohnen, Mobilität, Lebensmitteln, Kommunikation, Steuern und Krankenkasse zeigt das Monatsbudget ruhig, was ein vergleichbarer Haushalt im Schnitt ausgibt — als Orientierung, nie als Wertung
- **Nach Haushaltsgrösse abgestimmt**: die Richtwerte passen sich an (Einzelperson, Paar, Familie …) — die Spanne ist gross (z. B. Lebensmittel von ~390 bis ~970)
- **Teuerung pro Kategorie**: wie stark die Preise seit 2020 gestiegen sind, im Vergleich zur allgemeinen Teuerung — sichtbar wird, dass Wohnen & Energie am stärksten steigt
- **Alles ruhig einklappbar**: Richtwerte, Teuerung und der SKOS-Block sind standardmässig eingeklappt — ein Schalter blendet alles ein, oder pro Kategorie einzeln
- **Sozialhilfe-Anspruch im Blick**: liegt das Einkommen über dem, was die Sozialhilfe decken würde, erscheint das ruhig ausgegraut — Orientierung, keine Bewertung
- **Lebensbaum anklickbar**: die Blätter im Dashboard-Baum führen jetzt direkt zur passenden Ansicht (Budget, Steuern, IPV, Sozialhilfe, Notfall …)

### Quellen
- BFS Haushaltsbudgeterhebung (HABE) 2023 / nach Haushaltstyp 2020–2021
- BFS Landesindex der Konsumentenpreise (LIK)

---

## [0.1.7-beta] — 2026-06-29

Briefe nach Schweizer Norm mit Auto-Feldern, ein mitdenkender Gesundheits-Kalender
und die KK-Last im Verhältnis zum Einkommen (WHO-Richtwert).

### Neu
- **Schweizer Geschäftsbrief-Norm** in allen Brief-Vorlagen: Empfängeradresse rechts (fürs Sichtfenster), Absender als Briefkopf, Betreff fett
- **Policennummer-Feld** bei den Versicherungen — fliesst automatisch in den KK-Kündigungsbrief
- **KK-Reklamationsbrief mit Beleg-Auswahl**: strittige Belege ankreuzen, Datum + Betrag werden automatisch in den Brief übernommen (Differenz bleibt Selbst-Eintrag)
- **Gesundheits-Kalender mit Deckungs-Orientierung**: die Vorlagen (Arzt, Zahnarzt, Gynäkologie, Impfungen) zeigen ruhig und sachlich, was die Grundversicherung übernimmt — ohne medizinische Empfehlungen
- **„Letzter Besuch" → nächster Termin**: beim Gesundheits-Termin den letzten Besuch eintragen, der nächste wird berechnet (egal wann im Jahr man startet)
- Optionaler **„dieses Jahr gedeckt?"-Marker** pro Gesundheits-Termin
- **KK-Last-Orientierung**: die Grundversicherungs-Prämie als Anteil des Einkommens, gegen den WHO-Richtwert von 10% (in Prämien-Orientierung und Finanz-Übersicht)

---

## [0.1.6-beta] — 2026-06-29

KK-Kosten-Tracker (Belege, Franchise/Selbstbehalt), durchgängige Crosslinks
(„nie zweimal eingeben") und ein Kohärenz-Audit der erfassten Angaben.

### Neu
- **KK-Verbrauchs-Tracker / Beleg-Liste**: Arztrechnungen einzeln erfassen (Datum, Betrag, optional aus Taxpunkten berechnet), **Jahres-Auflistung mit Jahr-Umschalter** (auch frühere Jahre), Franchise-/Selbstbehalt-Standort in Klartext (drei Zonen)
- **Beleg-Status**: bezahlt/offen mit **Zahlungsfrist** + Ein-Klick „im Kalender erinnern"; **„bei KK eingereicht"-Marker**; **gedeckt/nicht-gedeckt-Anteil** getrennt (nur der gedeckte Teil zählt auf die Franchise)
- **Gesundheitskosten in der Finanz-Übersicht**: bezahlte Belege fliessen als Crosslink in die Finanzen (mit „noch offen"-Hinweis), auch in der Druck-/PDF-Übersicht
- **KK-Reklamationsbrief** als neue Brief-Vorlage (falls die Kasse eine Leistung nicht oder falsch angerechnet hat)
- **Pronomen + weitere bisher ungenutzte Angaben** in den Spiegelkarten sichtbar; **Gender → Pronomen-Vorschlag** (überschreibbar, politisch neutral)
- Hinweis: Belege bis zu **5 Jahre rückwirkend** bei der KK einreichbar

### Verbessert
- **„Nie zweimal eingeben"**: ALV- und Sozialhilfe-Rechner befüllen Lohn/Miete/KK-Prämie/Einkommen aus den bereits erfassten Angaben vor
- Brief-Vorlagen: Empfänger ist direkt die hinterlegte Krankenkasse; Signatur unten nur noch der Name (Adresse nicht mehr doppelt)

### Behoben
- Spiegelkarten zeigten bei reinen Text-/Währungsfeldern rohe i18n-Keys statt der Beschriftung (neuer `fieldLabel`-Helfer)

---

## [0.1.5-beta] — 2026-06-29

Geführte Lebensereignis-Abläufe und das UX-Playbook. Schwerpunkt: zusammenhängende
Wege statt isolierter Werkzeuge (Maloja verwaltet Zusammenhänge, nicht nur Informationen).

### Neu
- **Wiederverwendbare Ablauf-Schale** und sechs geführte Abläufe: Krankenkasse wechseln, Zusatzversicherung kündigen, **Umzug**, **Unfall oder Krankheit — was tun?**, **Neuer Job**, **Stelle verloren / RAV** — ruhige Orientierung mit Crosslinks, Fristen in den Kalender und Verkettung untereinander
- **Notrufnummern** (144/1414/145/112) als anrufbare `tel:`-Links im Unfall-/Krankheit-Ablauf
- **Loop-Closure Brief → Scan → Ablage**: nach dem Brief-Erstellen ruhiger Weg in den Dokumenten-Tresor (vorgefiltert aufs passende Kapitel)
- **UX-Playbook** (`docs/UX_PLAYBOOK.md`) als „Grundgesetz" + App-Teardowns (Budgetberatung, BlueBudget, Coople)
- **Persona-Walkthrough** (qualitativer Journey-Test der 8 Personas)

### Behoben
- BriefGenerator nutzte undefiniertes `palette.accent` → Druck-Button im Hellmodus unsichtbar; auf Palette-Konventionen umgestellt (Theme-sicher)
- KVG-Kündigungsbrief: Kassenname füllt korrekt (kkInsurer); Frist-Tag zählt; Speicher-Bestätigung nur bei Erfolg
- KTG-Hinweis konkretisiert (steht meist auf dem Lohnausweis)

---

## [0.1.4-beta] — 2026-06-28

Sammelrelease der Korrekturen aus dem 6-Domänen-Audit (Architektur, Schweizer Berechnungen, Design, Barrierefreiheit, Mehrsprachigkeit, Governance).

### Behoben
- **13. AHV-Rente**: Jahresrente rechnet ab 2026 mit ×13 statt ×12
- **SKOS-Vermögensfreibetrag** vereinheitlicht und auf Stand 2026 (6'000 Alleinstehende / 12'000 Paare / +3'000 pro Kind) — zuvor zwei widersprüchliche Werte
- **Prämienverbilligung im Dashboard-Schnellcheck** nutzt jetzt den kantonalen Rechner — keine abweichende Pauschalzahl mehr
- **Datenverlust-Schutz**: Autosave fängt vollen Speicher ab, Datei-Uploads sind grössenbegrenzt
- **Vertiefte Links** zu Einstellungen, Steuer-Import und Rechtlichem überstehen Neuladen und Teilen
- Korrekte Domain `malojaplana.ch` in Finanz-Ausdruck und PDF-Fuss
- Zwei fehlende Übersetzungstexte ergänzt (Generika-Hinweis, AHV-Feld im Kassen-Scanner)

### Geändert
- **Schulden-Abbau-Plan** ruhiger und barrierearm: klare Überschriften, Tab-Rollen, beschriftete Felder, wertungsfreier Status
- **Vorlesen** jetzt auch auf Schulden, Sozialhilfe, Asyl, Finanz-Übersicht, Stipendien, Prämienverbilligung und Flyer; Vorlese-Beschriftung in allen Sprachen
- Überfällig-Hinweis und Armuts-Einordnung optisch beruhigt
- Junge Erwachsene (19–25) bei der Prämienverbilligung als eigene Kategorie ausgewiesen

### Technisch
- `@capacitor/cli` in die Entwicklungs-Abhängigkeiten verschoben (Laufzeit bleibt abhängigkeitsfrei)
- Radius-Token zwischen JS und CSS synchronisiert
- Ereignis-Bus mit Ringpuffer und Fehler-Isolation gehärtet

---

## [0.1.3-beta] — 2026-06-28

### Hinzugefügt
- **Schulden-Abbau-Plan**: Konsequenz-Priorität nach Schweizer Beratungs-Praxis (existenzsichernd → amtlich → übrige nach Lawine/Schneeball) + wertungsfreie Beratungs-Box (0800 708 708)
- **Einfache Ansicht** ausgebaut: Kapitel-Karten icon-forward (nur Symbol + Titel) und grössere, kontrastreiche Formularfelder; Vorlesen pro Feld
- **Lebenslauf**: alle Anstellungen (Mehrfach-Jobs) erscheinen in Vorschau, HTML und JSON/ATS
- **Pilot-Einladung / One-Pager** (docs/proof-of-concept.md)

### Behoben
- Lebenslauf zeigte bisher nur den aktuellen Job, nicht die weiteren Anstellungen

---

## [0.1.2-beta] — 2026-06-28

### Hinzugefügt
- **Einstellungen-Bereich**: zentrale Seite, bündelt Anzeige/Sprache/Anrede u.a. — „jederzeit änderbar", mit Schnellzugriff Daten bearbeiten/sichern
- **Erwachsene im Haushalt**: einzeln hinzufügen wie Kinder (Vorname + Beziehung)
- **Schwarzweiss-/Ruhe-Modus**: entsättigte, reizarme Ansicht (dumbphone-nah)
- **Maschinenlesbarer Lebenslauf**: JSON-Resume-Export (ATS) im CV-Generator
- **Einfache Ansicht (Inkrement 1)**: Icon-Dashboard + automatisches Vorlesen; Umschalter in Menü, BetaGate und Onboarding
- **Sonne/Mond-Icons** am Hell/Dunkel-Schalter
- **Foodshiner** als Herzensempfehlung

### Geändert
- **Sprachauswahl**: eingeklappt kompaktes Kürzel (DE/EN/FR/IT/RM), aufgeklappt volle native Namen

### Behoben
- **Kanton-Crosslink** im Steuer-Brief: las `wohnen.canton` statt `basis.canton` → der Brief erhält jetzt den tatsächlich gesetzten Kanton

---

## [0.1.1-beta] — 2026-06-28

### Hinzugefügt
- **In-App-Suche**: Tools und Kapitel direkt finden
- **Merkliste**: persönliche To-Do-Liste mit Deeplinks zu Rechnern/Kapiteln (im verschlüsselten Backup enthalten)
- **Probier-Modus (Sandbox)**: Szenarien neben dem eigenen Stand durchrechnen, „leer starten", prominenter Einstieg auf Rechner-Seiten
- **PLZ-Vorschlags-Dropdown**: lokale, barrierearme PLZ→Ort/Kanton-Autofüllung im Wohnen-Feld
- **Vermögen & Wertschriften**: neue Sektion im Finanzen-Kapitel, gespiegelt in Finanz-Übersicht und Behörden-Dossier (Preview/Druck/JSON)
- **Steuerdatei-Import**: Eckwerte aus der Steuererklärung übernehmen
- **Sozialhilfe: Vermögensfreibetrag-Orientierung** (SKOS C.7)
- **Green-Hosting-Hinweis** im Footer (verifiziert via Green Web Foundation)

### Geändert
- **Finanz-Daten auf Stand 1.1.2026 (quellenverifiziert)**: AHV-/BVG-Werte (Min-/Max-Rente, Ehepaar-Plafond, Koordinationsabzug, Eintrittsschwelle, Grenzbeträge), Säule-3a-Höchstabzüge und SKOS-Grundbedarf aktualisiert. Direkte Bundessteuer auf den amtlichen ESTV-Tarif 2026 umgestellt (Stufen + Abzüge) — die Berechnung deckt sich nun aufs Rappen mit der ESTV-Tariftabelle. Quellen: BSV, ESTV/EFD (kalte Progression), SKOS.
- **Mehrsprachigkeit**: DE/FR/IT/RM auf volle EN-Parität (asyl, flyer, Suche, Merkliste, Vorsorge-international u. a.)
- **Akzentfarbe** als CSS-Token `--mp-accent`

### Behoben
- **PLZ-Kanton-Autofüllung** nur noch aus präziser Datenbank — der Range-Fallback lieferte bei ~18 % der Grenz-PLZ falsche, „klebende" Kantone
- **SKOS-Doppelquelle**: `cantonalData.js` und `sozialhilfeRechner.js` zeigten widersprüchliche Grundbedarfs-Werte (1'031 vs. 1'061) im selben View; vereinheitlicht + Konsistenz-Test
- **PLZ-Performance/Robustheit**: 165 kB eager im Initial-Bundle → dynamisch; verlorene Validierung; Blur-Timer-Leak
- Diverse i18n-Lücken, die auf EN zurückfielen

### Tests & Infrastruktur
- **Test-Guards** gegen Drift: i18n-Key-/Platzhalter-/Anrede-Parität, `createT`-Kern, Finanz-/Sozialhilfe-/IPV-/EL-Logik (~186 → 314+ Tests)
- **Schriftlizenzen**: SIL OFL 1.1 Texte zu den WOFF2 gelegt
- **Deploy**: lokales SFTP-Script zu Infomaniak; CI-Auto-Deploy pausiert (Infomaniak blockt CI-Runner-IPs)

---

## [0.1.0-beta] — 2026-06-23

### Hinzugefügt
- **Wartungs-Infrastruktur**: Automatische Quartals-Erinnerungen via GitHub Actions, Wartungskalender, Claude-Wartungs-Prompts
- **Ticketing**: GitHub Issue Templates (Bug, Feature, Wartung)
- **Changelog**: Dieses Dokument

### Geändert
- Version von `0.1.0-alpha` auf `0.1.0-beta` aktualisiert

---

## [0.1.0-alpha.8] — 2026-06-23

### Hinzugefügt
- **Print-Stylesheet**: Sauberes A4-Layout, Footer/Header ausgeblendet
- **Unicode-Fix**: `font-variant-emoji: text` verhindert Emoji-Rendering auf Android
- **CTA-Bereinigung**: Doppelter Demo-Button auf Dashboard entfernt

### Geändert
- `known-issues-beta.md` komplett überarbeitet (28 erledigte Verbesserungen dokumentiert)

---

## [0.1.0-alpha.7] — 2026-06-23

### Hinzugefügt
- **Bundle-Splitting**: PLZ- und Prämien-Daten als separate Chunks (247KB → 124KB)
- **Error Boundaries**: Per-View Fehlerbehandlung (App crasht nicht komplett)
- **A11y**: Skip-Link, focus-visible, ARIA-Labels, Logo als Keyboard-Link
- **Rätoromanisch 100%**: 2000+ Keys, volle DE-Parität

### Geändert
- PraemienOrientierung-Chunk von 247KB auf 124KB reduziert

---

## [0.1.0-alpha.6] — 2026-06-22

### Hinzugefügt
- **Trust-Panel**: Aufklappbare Datenschutz-Erklärung im Footer (5 Sprachen)
- **PWA**: manifest.id für stabiles Install-Tracking
- **SEO**: canonical, Schema.org, OG/Twitter Cards, SafeSearch-Rating
- **Ressourcen**: Threema, SecureSafe, IncaMail, Beratungsstellen, Petitionen
- **KVG-Leistungen**: Franchise-Tracker und Rechnungserklärung
- **Feature-Walkthrough**: Alle 15 Views systematisch verifiziert

---

## [0.1.0-alpha.5] — 2026-06-21

### Hinzugefügt
- **Finanz-Übersicht**: Kompaktansicht aller Rechner-Ergebnisse + BFS-Branchenvergleich
- **Cross-Links**: Steuer-, IPV-, Sozialhilfe-, Vorsorge-Rechner verlinken zueinander
- **Dashboard-Snippets**: Versicherungen, Behörden, Notfall, Finanzen
- **Behörden-Checkliste**: Interaktive Checkliste (localStorage-persistent, 5 Sprachen)
- **Demo-Einstieg**: Prominente Demo-Card für Erstnutzer
- **Dropdown-UX**: Custom Chevron + appearance:none für alle Selects

---

## [0.1.0-alpha.4] — 2026-06-20

### Hinzugefügt
- **Fortschrittskarte**: Status-Label über Berglandschaft + Kapitel-Labels
- **Rätoromanisch**: 5. Sprache (Grundausstattung)
- **3a-Guthaben-Feld**: Eigenes Eingabefeld für Säule-3a-Stand
- **Sozialhilfe**: Rückzahlungs-Info + Disclaimer visuell hervorgehoben

---

## [0.1.0-alpha.3] — 2026-06-19

### Hinzugefügt
- **Kantonale Links**: Direkt-Links zu allen 26 Kantonen
- **Behörden-Dossier**: JSON-Export für Sozialamt-Termine
- **Backup-Versionierung**: Automatische Versionierung bei Export

---

## [0.1.0-alpha.2] — 2026-06-18

### Hinzugefügt
- **Design-Asymmetrie**: Layout-Verfeinerungen (A-030 Audit)
- **17 kaputte Links gefixt**: Kantonal + federal
- **SW-Cache v7**: Service Worker Cache-Invalidierung

---

## [0.1.0-alpha.1] — 2026-06

### Hinzugefügt
- **Phase 5 komplett**: Encrypted Backup (AES-256-GCM), Data Validation, Print CSS
- **Phase 4 komplett**: Alle 7 Kapitel, Rechner (Steuer, IPV, Sozialhilfe, Vorsorge, EO, Budget)
- **Phase 3 komplett**: i18n (DE/EN/FR/IT), Datenimport, Migration
- **Phase 2 komplett**: Dashboard, Navigation, Theme Toggle
- **Phase 1 komplett**: Grundstruktur, BetaGate, localStorage
