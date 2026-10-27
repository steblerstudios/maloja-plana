# Seiten bündeln vor der sechsten Fassung — Entscheidungsblatt

*Vorbereitet 24.10.2026 auf `e620588a` (Zweig `feat/charts-geldfluss`, 24.10. 17:31), Blatt auf
Zweig `docs/seiten-buendeln`. Entscheid: Stebler Studios. **Noch nichts gebaut.***

**Die Frage:** Vor dem Einstieg in die sechste Fassung — wie viele Seiten hat Maloja, und welche
lassen sich zusammenlegen, so wie am 24.10. die Finanz-Übersicht ins Kapitel Finanzen
(`finanzen-fusion.md`)?

## 1 · Heute-Zustand — gemessen am Code

**Zählung:** Render-Zweige `view === '…'` in `src/main.jsx` (Z. ~1553–1770), Kapitel aus
`src/config/constants.js`.

| Was | Anzahl |
|---|---|
| Ansichts-Schlüssel in `main.jsx` | 86 (inkl. `chapter`) |
| davon Doppelnamen derselben Seite | 1 (`schnellcheck` = `ansprueche`, seit 27.09.) |
| Kapitel (über `chapter`) | 7 — basis, wohnen, finanzen, versicherungen, ausbildung, behoerden, notfall |
| **Seiten, die ein Mensch sehen kann** | **≈ 91** (84 Ansichten + 7 Kapitel) |
| davon Technik/Rahmen | ≈ 8 — dashboard, search, settings, notifications, lockpreview, installApp, legal, flyer |

**Verlauf** (gleiche Zählung über `git show <commit>:src/main.jsx`): Mitte August 65, Mitte
September 65, ab Anfang Oktober 86. Die «rund 90 Seiten» vom Anfang stimmen also noch — es sind
eher mehr geworden. Zusammengelegt wurde bisher einmal: `finanzuebersicht` ist seit 24.10. ein
Alias (`UMLEITUNGEN` in `utils/hashRouter.js`). Der Geldfluss ist ins Kapitel Finanzen gewandert,
das Spinnennetz ins Kapitel Versicherungen.

**Was es schon gibt, um alte Adressen zu halten:** `UMLEITUNGEN` (Ansicht → Kapitel + Sprungmarke).
Jede Bündelung unten kann darüber laufen; Lesezeichen, Querverweise und Suche bleiben gültig.

## 2 · Gruppen — Befund je Gruppe

Zeilen = Zeilen der Komponente (`wc -l`). «Fundstellen» = Dateien in `src/` (ohne Tests), die den
Schlüssel als String nennen — grob, kurze Schlüssel wie `kk` oder `sync` zählen auch Fremdtreffer.

### A · Ansprüche — *schon fast eins*

| Ansicht | Komponente | Zeilen | Was sie ist |
|---|---|---|---|
| `ansprueche` / `schnellcheck` | `Schnellcheck` (`mitLandkarte`) | 307 | Zahlen → alle möglichen Leistungen |
| `anspruchcheck` | `AnspruchCheck` | 197 | Hülle: Schritt 1 = Schnellcheck, Schritt 2 = Lebenssituationen |
| `situationen` | `Lebenssituationen` | — | Lebenslage |

`AnspruchCheck` verwendet laut eigenem Kopf beide Bausteine «unverändert wieder». Drei Eingänge
für einen Weg. **Vorschlag:** eine Seite «Ansprüche» = der geführte Check; `ansprueche`,
`schnellcheck`, `anspruchcheck` zeigen dorthin, `situationen` bleibt als Schritt 2 und als Alias.
*Gewinn: 2–3 Seiten. Aufwand klein.*

### B · Krankenkasse-Werkzeuge

| Ansicht | Komponente | Zeilen | Fundstellen |
|---|---|---|---|
| `praemien` | `PraemienOrientierung` | 470 | 13 |
| `premium` (IPV) | `PremiumSubsidy` | 674 | 32 |
| `kvg` | `KVGLeistungen` | 1085 | 12 |
| `kk` | `KKScanner` (Kassenkarte, QR) | 354 | 10 (grob) |

Vier Rechner/Werkzeuge um dieselbe Sache, zusammen ≈ 2600 Zeilen. Muster wie Finanzen: ins
**Kapitel Versicherungen** als Auswertung. Aber: IPV hat 32 Fundstellen und ist ein eigenes
Kantonsmodul-Gebiet (26 Dateien `ipv*.js`) — ein Umzug ist kein kleiner Schritt.
**Vorschlag:** `praemien` + `kvg` ins Kapitel Versicherungen (Prämie, was gedeckt ist). IPV bleibt
eigene Seite (zu gross, zu viele Aufrufer); Kassenkarte bleibt Werkzeug.
*Gewinn: 2 Seiten. Aufwand gross (Grösse von `KVGLeistungen`, Startbündel 65 kB → lazy).*

### C · Krankenkasse-Abläufe

| Ansicht | Komponente | Zeilen |
|---|---|---|
| `kkerst` | `KKErstAnmeldung` | 64 |
| `kvgwechsel` | `KVGWechsel` | 164 |
| `zusatzwechsel` | `ZusatzWechsel` | 95 |

Alle drei auf der `AblaufSchale`. Fachlich verschieden: Erstanmeldung (3-Monats-Frist),
KVG-Wechsel (KVG 7, Aufnahmepflicht), VVG-Kündigung (keine Aufnahmepflicht, Fristen je Police).
**Vorschlag:** *nicht* zusammenlegen — die Unterschiede sind gerade der Inhalt. Stattdessen im
Dashboard/Kapitel als eine Gruppe «Krankenkasse» mit drei Einstiegen zeigen.
*Gewinn: 0 Seiten, aber ein Eintrag statt drei in der Liste.*

### D · Notfall

| Ansicht | Komponente | Zeilen | Was sie ist |
|---|---|---|---|
| `notfalleinstieg` | `NotfallEinstieg` | 243 | Einstieg, verweist auf Karte und Pass |
| `notfallkarte` | `NotfallVorlesekarte` | 177 | für den Ernstfall selbst |
| `notfallpass` | `NotfallpassBlatt` | 136 | Angaben fürs Telefon übertragen |
| `notfalldossier` | `NotfallDossier` | 216 | QR/vCard fürs Papier |

Dazu das Kapitel `notfall`. Fünf Orte für ein Thema. Die Vorlesekarte muss im Ernstfall **mit
einem Griff** erreichbar bleiben — sie gehört nicht ins Aufklappen.
**Vorschlag:** `notfalleinstieg` geht im Kapitel Notfall auf (er trägt schon dessen Titel und
Zeichen, `ansichtenRegister.js`); Pass und Dossier als zwei «Ausgänge» im Kapitel; die
Vorlesekarte bleibt eigene Seite.
*Gewinn: 3 Seiten. Aufwand mittel.*

### E · Geldsorgen

| Ansicht | Komponente | Zeilen | Art |
|---|---|---|---|
| `mahnung` | `MahnungErhalten` | 112 | Ablauf |
| `betreibung` | `BetreibungErhalten` | 56 | Ablauf |
| `betreibungsauszug` | `BetreibungsAuszug` | 40 | Ablauf |
| `schulden` | `SchuldenManager` | 612 | Werkzeug (kennt Mahnstufen schon) |

Mahnung → Betreibung ist eine Stufenfolge; `SchuldenManager` zeigt dieselben Stufen
(`MahnstufenUebersicht`). Der Betreibungsauszug ist ein anderer Anlass (Wohnungssuche).
**Vorschlag:** `mahnung` + `betreibung` zu einem Ablauf «Rechnung nicht bezahlt» mit
Stufen-Einstieg; Auszug und Schulden bleiben.
*Gewinn: 1 Seite. Aufwand mittel — beide Abläufe sind am Gesetzeswortlaut geprüft (27.09.),
Zusammenlegen braucht eine neue Prüfrunde.*

### F · Arbeit verloren

| Ansicht | Komponente | Zeilen | Art |
|---|---|---|---|
| `stelleverloren` | `StelleVerloren` | 98 | Ablauf |
| `aussteuerung` | `Aussteuerung` | 53 | Ablauf, «Fortsetzung von Stelle verloren» |
| `alv` | `AlvRechner` | 168 | Rechner (14 Fundstellen) |

**Vorschlag:** `aussteuerung` als letzter Teil von «Stelle verloren» (der eigene Kopf nennt sich
Fortsetzung); ALV-Rechner bleibt Werkzeug.
*Gewinn: 1 Seite. Aufwand klein bis mittel.*

### G · Ablauf und Formular — *eher nicht bündeln*

| Paar | Befund |
|---|---|
| `vorsorgeauftrag` (Ablauf, 92) + `patientenverfuegung` (Fragen-Formular, 54) | Der Ablauf deckt beides ab; die PV ist das Werkzeug zum Ausfüllen (`FragenAblauf`) |
| `todesfall` (Ablauf, 53) + `bestattung` (Fragen-Formular, 47) | ebenso |

Ablauf = «was ist zu tun», Formular = «halte deins fest». Zwei Arten, die sich gegenseitig
verlinken. **Vorschlag:** getrennt lassen, nur prüfen, dass der Ablauf aufs Formular zeigt.
*Gewinn: 0.*

### H · Ablage

| Ansicht | Komponente | Zeilen |
|---|---|---|
| `tresor` | `DocumentTresor` | 370 |
| `unterlagen` | `MeineUnterlagen` (Doku-Hub, Tresor «zuoberst») | 166 |
| `lebensmappe` | `Lebensmappe` (Druck-Dossier) | 154 |
| `export` | `ZipExport` (Sicherung/Wiederherstellen) | 495 |
| `merkliste` | `MerklisteView` (seit 23.10. die To-do-Liste) | 208 |

`unterlagen` ist schon der Hub über dem Tresor. Merkliste gehört seit Fassung 5 zu «Was ansteht»,
nicht zur Ablage. Export ist Sicherung — gehört eher zu den Einstellungen.
**Vorschlag:** `unterlagen` + `tresor` zu einer Seite «Unterlagen» (Hub oben, Tresor darunter);
Lebensmappe als Ausgang dort. Export bleibt (Datensicherheit soll nicht versteckt sein).
*Gewinn: 1–2 Seiten. Aufwand mittel (Tresor hat Fassung 5 vom 23.10.).*

### I · Reste aus der Finanzen-Fusion

| Ansicht | Komponente | Zeilen | Befund |
|---|---|---|---|
| `charts` | `ChartsAdvanced` | 163 | 3 Fundstellen. Rechnet seit 21.10. wie das Kapitel; der Geldfluss ist seit heute dort |
| `sozialhilfe` | `SozialhilfeView` | 274 | steht jetzt auch im Kapitel Finanzen unter «Weitere Ansprüche»; 21 Fundstellen |
| `taxImport` | `TaxImport` | 119 | Import für die Steuer, Muster wie `BudgetImport` |
| `budget` / `sync` | `BudgetImport` 128 / `BudgetSync` 502 | | Import + Budgetseite |

**Vorschlag:** `charts` → Umleitung ins Kapitel Finanzen (kleinster Schritt der ganzen Liste).
`taxImport` in den Steuerrechner, `budget` in die Budgetseite (Import als Feld oben statt eigener
Seite). `sozialhilfe` bleibt eigene Seite (Rückerstattungs-Rechner, viele Aufrufer).
*Gewinn: 3 Seiten. Aufwand: charts klein, Importe mittel.*

## 3 · Übersicht

| Gruppe | Seiten weniger | Aufwand | Vorschlag |
|---|---|---|---|
| A Ansprüche | 2–3 | klein | bündeln |
| B KK-Werkzeuge | 2 | gross | teilweise |
| C KK-Abläufe | 0 | — | gruppieren, nicht bündeln |
| D Notfall | 3 | mittel | bündeln, Karte bleibt |
| E Geldsorgen | 1 | mittel + Prüfrunde | bündeln |
| F Arbeit verloren | 1 | klein–mittel | bündeln |
| G Ablauf + Formular | 0 | — | getrennt lassen |
| H Ablage | 1–2 | mittel | bündeln |
| I Finanzen-Reste | 3 | klein–mittel | bündeln |
| **Summe** | **≈ 13–15** | | von ≈ 91 auf ≈ 76–78 |

Das ist weniger als die «25–30» aus der ersten Schätzung im Gespräch (24.10.): dort waren die
Gruppen nur nach Namen gebildet. Beim Lesen der Komponenten zeigten C und G, dass dort
verschiedene Dinge hinter ähnlichen Namen stehen.

## 4 · Offene Entscheide (für Stebler Studios)

1. **Ziel:** Reicht ≈ 15 Seiten weniger, oder soll die sechste Fassung grundsätzlicher ordnen
   (z. B. jedes Werkzeug in sein Kapitel, wie bei Finanzen)?
2. **Reihenfolge:** Vorschlag Claude — zuerst die kleinen (I `charts`, A, F), dann D, H, E, zuletzt B.
3. **KK-Werkzeuge (B):** IPV eigene Seite lassen, oder auch ins Kapitel Versicherungen?
4. **Notfall (D):** Bleibt die Vorlesekarte eigene Seite? (Vorschlag: ja.)
5. **Geldsorgen (E):** Mahnung und Betreibung zu einem Ablauf — mit neuer Fachprüfung
   (`swiss-precision-pruefer`, `rechts-pruefer`)?
6. **Ablauf + Formular (G):** getrennt lassen?

> ✅ **Entschieden 24.10.2026** (Stebler Studios, Auswahl-Dialog, alle sechs je die empfohlene Option):
> 1. **Ziel:** ≈ 15 Seiten weniger — die neun Gruppen wie oben, je mit Umleitung. Kein
>    grundsätzlicher Umbau «jedes Werkzeug in sein Kapitel».
> 2. **Reihenfolge:** klein zuerst — I `charts`, A Ansprüche, F Ausgesteuert; dann D Notfall,
>    H Ablage, E Geldsorgen; zuletzt B KK-Werkzeuge. (Die übrigen Teile von I — Importe — mit H.)
> 3. **IPV:** bleibt eigene Seite. ~~Nur `praemien` und `kvg` ins Kapitel Versicherungen.~~
>    ⟨**überholt 25.10.2026**, siehe §11⟩ `praemien` wird die eigene Seite **«Versicherungs-Übersicht»**
>    (Runde 9 AB); `kvg` kommt dort als Zeile hinein, nicht ins Kapitel.
> 4. **Notfall:** die Vorlesekarte bleibt eigene Seite. `notfalleinstieg` geht im Kapitel Notfall
>    auf, Pass und Dossier werden Ausgänge dort.
> 5. **Geldsorgen:** `mahnung` + `betreibung` werden ein Ablauf «Rechnung nicht bezahlt» mit
>    Stufen-Einstieg — **mit neuer Fachprüfung** (`swiss-precision-pruefer`, `rechts-pruefer`).
>    Betreibungsauszug und Schulden bleiben.
> 6. **Ablauf + Formular:** getrennt. Zu prüfen ist nur, dass Vorsorgeauftrag → Patientenverfügung
>    und Todesfall → Bestattung verlinken.
>
> **Noch nichts gebaut.** Nächster Schritt nach Entscheid 2: `charts` → `UMLEITUNGEN`.

## 6 · Stand Schritt 1 (24.10.2026)

`#/charts` führt ins Kapitel Finanzen, Sprungmarke `mp-finanz-auswertung` (`UMLEITUNGEN`,
`utils/hashRouter.js`), Commit `78566302` auf `feat/charts-umleitung`. `ChartsAdvanced.jsx` und
`charts.*` (5 Sprachen) sind weg; das Register behält den Eintrag (Menü, Suche, Gepäck → Umleitung).
Tests umgezogen: `chartsWieKapitel` und `chartsLegendeSchluessel` prüfen jetzt `geldflussDaten`.
Weg fällt der BVG-Hinweis der Charts-Seite (steht weiter auf Budget und Steuer).

**Offen:** nicht gepusht, kein PR — der Zweig steht auf dem ungepushten Stapel `feat/charts-geldfluss`.
Zur Entscheidung: soll der Eintrag «Charts» im Gepäck (Aussenfach) bleiben, obwohl er ins Kapitel führt?
Nächste Schritte: A Ansprüche, F Ausgesteuert.

## 5 · Was je Bündelung gilt (wie bei Finanzen)

- Alte Adresse → `UMLEITUNGEN`, nie toter Link. Suche, Menü, Dashboard zeigen aufs neue Ziel.
- Ein Commit je Schritt; Tests anpassen, nicht löschen; Startbündel 65 kB (neue Teile lazy).
- Texte in fünf Sprachen, `copy-pruefer`; Fachinhalt unverändert oder neu geprüft.
- Browser 375 px, Entwurfs-PR, **kein Merge, kein Deploy** ohne Stebler Studios.

**Nicht geprüft für dieses Blatt:** gerenderte Seiten im Browser (nur Code gelesen), Nutzungszahlen
(es gibt keine — local-first), ob Abläufe untereinander schon verlinken.

## 7 · Gruppe A zurückgestellt, Gruppe F gebaut (24.10.2026)

**Stand davor:** #555 (Finanzen-Fusion, Geldfluss u. a.) und #556 (dieses Blatt + Charts-Umleitung) auf
Zuruf gemergt, `main` = `4f615aa2`. Nicht live.

**A · Ansprüche — zurückgestellt** (Stebler Studios: «Stell die Ansprüche zurück und mach zuerst Gruppe F»).
Befund beim Lesen des Codes, der §2 korrigiert: Seit dem 23.10. («ein Name je Seite») ist `situationen`
(«Was steht mir zu?») der feste Anker in der Leiste. `ansprueche`/`schnellcheck` = Zahlen-Check + Landkarte;
`anspruchcheck` = Schritt 1 Zahlen-Check, Schritt 2 Lebenslagen, Schritt 3 Zusammenfassung — er hat keinen
eigenen Inhalt. «Aufwand klein» stimmt nur für den kleinsten Schnitt (geführten Check streichen, 1 Seite).
**Empfehlung Claude:** zusammenlegen am Anker — eine Seite «Was steht mir zu?» mit Lebenslagen, Zahlen-Check
und Landkarte, die drei anderen Adressen als Umleitung (2 Seiten weniger, ein Ort für Ansprüche). Das ist ein
Umbau: Gliederung, neue Zwischentitel in 5 Sprachen, Probier-Modus-Knopf und Zusammenfassung brauchen einen
neuen Platz. In Schritten wie die Finanzen-Fusion, eher mit Fassung 6.

**F · Ausgesteuert — gebaut** auf Zweig `feat/ausgesteuert-in-stelle-verloren`. «Ausgesteuert — wie weiter?»
ist der letzte, aufklappbare Teil von «Stelle verloren» (`<details id="mp-aussteuerung">`, Muster Mietzins im
Umzug). Alle fünf Schritte, Frist, Quelle und Hinweis unverändert, **keine neuen Texte**. `#/aussteuerung` →
`UMLEITUNGEN` → «Stelle verloren», `springeZuAnker` klappt den Teil auf. Einträge in Dashboard, Suche und Gepäck
bleiben und führen über die Umleitung. Wächter: `aussteuerungUmleitung.test.js`.

## 8 · Gruppe D · Schritt 1 gebaut (24.10.2026)

#557 (Gruppe F) auf Zuruf gemergt, `main` = `591c84d4`. Nicht live.

**Notfall-Einstieg → Kapitel Notfall** auf Zweig `feat/notfall-buendeln`. `components/NotfallImKapitel.jsx`:
- **oben**, gleich nach dem Kapitelkopf: Vorlesekarte (Ernstfall) und Notfallpass, Sprungmarke `mp-notfall-ernstfall`.
  Nicht lazy — der Ernstfall-Knopf soll ohne Nachladen dastehen.
- **unten**, nach dem Formular: «Was brauchen Sie im Notfall?», die drei Lagen (Unfall, Spital, Behörde).
  Fehlende Angaben aus dem Kapitel Notfall stehen im Formular darüber; nur andere Kapitel bekommen einen Knopf.
- Texte unverändert (`notfallEinstieg.*`, `notfallpass.einstieg*`), keine neuen. `NotfallEinstieg.jsx` entfernt.
- `#/notfalleinstieg` → `UMLEITUNGEN` → Kapitel 6. Dashboard, Lebensbaum, Abläufe, Arztkoffer, Suche und die
  Brotkrume des Notfallpasses rufen weiter `notfalleinstieg` auf und landen dort.
- Querverweis «Notfallkarte erstellen» am Feld Notfallkontakt zeigt jetzt direkt auf die Vorlesekarte.
- Vorlesekarte bleibt eigene Seite (Entscheid 4). Wächter: `notfallEinstiegUmleitung.test.js`; `brotkrume.test.js`
  lässt Umleitungen als Eltern-Stufe zu.

**Noch offen in Gruppe D:** Notfallpass und Notfall-Dossier sind weiter eigene Seiten, im Kapitel als Wege erreichbar
(Pass oben, Dossier über Unterlagen und Vorlesekarte). Ob sie als Aufklapp-Teile ins Kapitel kommen (2 weitere Seiten),
ist ein eigener Schritt — beide sind Ausgabe-Werkzeuge (QR fürs Papier, Felder fürs Telefon), kein Lesetext.

## 9 · Gruppe H gebaut (24.10.2026)

#558 (Gruppe D, Schritt 1) auf Zuruf gemergt, `main` = `e760207d`. Nicht live.

**«Meine Unterlagen» → Abschnitt in der Dokumentenablage** auf Zweig `feat/ablage-buendeln`.
Die frühere Seite war eine Verteilseite mit sechs Karten, die erste davon die Ablage selbst. Die Ablage
(`tresor`, Fassung 5, rund 25 Aufrufer, Platz im Menü und im ＋-Fächer) bleibt die Seite; darunter steht neu
`components/UnterlagenWege.jsx`: «Meine Unterlagen» mit Lebensmappe, Notfall-Dossier, Behörden-Dossier,
Briefvorlagen und Datensicherung — echte Knöpfe, Texte unverändert (`unterlagen.*`).
- `#/unterlagen` → `UMLEITUNGEN` → Ablage, Sprungmarke `mp-unterlagen`. Abläufe (KVG-/Zusatz-Wechsel),
  Merkpunkte und die Brotkrumen der vier Dossiers zeigen weiter auf `unterlagen` und landen dort.
- `MeineUnterlagen.jsx` entfernt. Im Dashboard (Werkzeuggruppe Dokumente) fällt der zweite Eintrag weg, der auf
  dieselbe Seite zeigte. Register/Suche/Aussenfach behalten ihn (Suchwörter «unterlagen», «dossier»).
- Weg fällt der Satz `unterlagen.note` («Alle Unterlagen bleiben auf Ihrem Gerät») — die Ablage sagt dasselbe
  schon in ihrer Fusszeile (`trust.localOnly`).
- Wächter: `unterlagenUmleitung.test.js`.

**Offen:** Im Aussenfach des Gepäcks stehen weiter «Dokumentenablage» und «Meine Unterlagen» nebeneinander,
beide führen jetzt in die Ablage — einen davon herausnehmen? Lebensmappe, Merkliste und Export bleiben
eigene Seiten (Entscheid in §2: Merkliste gehört zu «Was ansteht», Export bleibt sichtbar).

## 10 · Gruppe E gebaut, mit Fachprüfung (24.10.2026)

#559 (Gruppe H) auf Zuruf gemergt, `main` = `32284107`. Nicht live.

**«Mahnung erhalten» + «Betreibung erhalten» → eine Seite «Rechnung nicht bezahlt»** (`src/RechnungOffen.jsx`) auf
Zweig `feat/geldsorgen-buendeln`. Oben die Wahl «Was ist angekommen?» (Mahnung / Zahlungsbefehl), darunter nur der
gewählte Teil (`MahnungTeil`, `BetreibungTeil`) — Schritte, Fristen, Briefe und Quellen byte-gleich. Bewusst **kein
Aufklappen**: wer über `#/betreibung` kommt, sieht «1 · Ruhig bleiben — Sie haben 10 Tage» auf dem ersten Bildschirm
(375 px). Beide Adressen bleiben und wählen die Stufe; die Wahl wechselt die Adresse (Zurück-Taste geprüft).
Register, Suche, Gepäck, Lebenszustand und Mahnstufen zeigen unverändert auf `mahnung`/`betreibung`.

**Neue Texte** `rechnungOffen.title/intro/frage/stufeMahnung/stufeBetreibung` in 5 Sprachen; rm als ungeprüft markiert.

**Fachprüfung 24.10.2026** — swiss-precision-, rechts- und copy-pruefer: **0 Blocker**. Umgesetzt:
- Einleitung ohne Abfolge «von der Mahnung bis …» — ein Zahlungsbefehl setzt weder Rechnung noch Mahnung voraus
  (swiss-precision). Neu: «Die Schritte richten sich danach, was angekommen ist: eine Mahnung oder ein Zahlungsbefehl.»
- Englisch «payment order» wie der bestehende Teil und die englische SchKG-Fassung.
- Eigene Knopf-Beschriftungen: «Zahlungsbefehl erhalten» nennt das Papier; `nav.betreibung` bleibt für Menü/Suche.
- rm: der alte TODO-Vermerk steht wieder über `mahnung` (rechts-pruefer).
SchKG Art. 74 (10 Tage ab Zustellung) im Code-Kommentar bestätigt.

**Offen für Stebler Studios:**
- **Titel «Rechnung nicht bezahlt»** setzt voraus, dass man etwas schuldet; wer zu Unrecht betrieben wird, fühlt sich
  evtl. nicht angesprochen (swiss-precision ⚠️). Neutraler wäre z. B. «Mahnung oder Zahlungsbefehl — was tun?».
- Zustelldatum geht beim Wechsel zur Mahnung und zurück verloren (rechts-pruefer 💡) — war mit zwei Seiten gleich.
- rm-Texte brauchen eine Rumantsch-Fachperson; für «Zahlungsbefehl» gibt es in `rm.js` noch keinen Begriff.

> ✅ **Entschieden 24.10.2026** (Stebler Studios): Titel neutral — «Mahnung oder Zahlungsbefehl — was tun?», in allen
> fünf Sprachen (rm weiter ungeprüft). Ersetzt «Rechnung nicht bezahlt».

## 11 · Gruppe B neu entschieden: Versicherungs-Übersicht als eigene Seite (25.10.2026)

> ✅ **Entschieden 25.10.2026** (Stebler Studios, Abnahme Fassung 6): «Versicherungs-Übersicht als eigene Seite, wie in
> Runde 9 AB entschieden.» Ersetzt in §4 Entscheid 3 den Teil «`praemien` und `kvg` ins Kapitel Versicherungen».

Grund: Die beiden Blätter widersprachen sich — §4 Entscheid 3 (24.10., `praemien` + `kvg` ins Kapitel) und
`docs/design/mockups-stardust-2026-10-23/VERGLEICH.md` Runde 9 AB (24.10. später, «wie beim Geld: Kapitel zum Eintragen,
eine Übersicht für alles»). Es gilt AB.

Was damit gilt (Entwurf `seiten-v5.html?nur=ab`, Beschreibung in `VERGLEICH.md` «Versicherungs-Übersicht (AB)»):
- **`praemien` (`PraemienOrientierung`) wird «Versicherungs-Übersicht»**, Brotkrume über das Kapitel Versicherungen;
  `#/praemien` bleibt als Adresse bzw. leitet weiter; Titel in fünf Sprachen neu (Copy-Prüfer).
- Aufbau wie die Finanz-Auswertung: Marken (Kasse · Modell, Franchise, Prämienregion) · «Versicherungen pro Monat» +
  KK-Last · Zeilen mit Wert je Werkzeug (Franchise, Krankenkasse wechseln, Prämienverbilligung, Gesundheitskosten,
  **KVG-Leistungen**, Vorsorge) · Schutzschild · aufklappbar das ganze Franchise-Kreuz, Prämie regional,
  Prämienvergleich & Unfalldeckung, Alle Kassen · Zusatz-Wechsel und KK-Scanner als Zeilen.
- **`kvg` (`KVGLeistungen`) bleibt eigene Seite** und wird von der Übersicht als Zeile erreicht — nicht ins Kapitel
  gezogen (die 1085 Zeilen und das 65-kB-Thema aus §2 B entfallen damit).
- **IPV bleibt eigene Seite** (unverändert). Kassenkarte bleibt Werkzeug.
- Das **Kapitel Versicherungen** bleibt der Ort zum Eintragen, mit den eigenen Instrumenten aus Runde 9 AA
  (Versicherungen pro Monat, KK-Last, kleines Franchise-Kreuz, kleines Schutzschild) und zuoberst in «Passend»
  «Alle Versicherungen auf einen Blick» → Versicherungs-Übersicht.

**Noch nichts gebaut.**

## 12 · Fassung 7: Importe, Merkliste, Dossiers, Vorsorge-Rückweg gebaut (27.10.2026)

Entscheide Stebler Studios 27.10.2026 (alle «Ja»), Zweig `feat/f7-budget-merkliste-dossiers`. Nicht gepusht, kein PR.

- **F7-L7 (Gruppe I, Importe):** `budget` ist ein Teil «CSV importieren» unten im Monatsbudget (`sync`),
  `#/budget` → `UMLEITUNGEN` mit Sprungmarke `mp-budget-import`. Register, Rucksack, Dashboard und Suche kennen nur
  noch «Monatsbudget» (`budgetSync.title`); `csv`, `import`, `budget` sind Suchwörter von `sync`. `taxImport` offen.
- **F7-L10 (Gruppe H, Merkliste):** Reiter «Merkliste» in «Was ansteht» (role=tablist, Pfeiltasten). `#/merkliste`
  → `UMLEITUNGEN` mit `wahl: 'merkliste'`; main.jsx führt `wahl` als Zustand. Eine Liste für beide Reiter.
- **F7-S2 (Gruppe H, Dossiers):** «Unterlagen drucken» (`drucken`) mit drei Auswahlen (radiogroup): Alles ·
  Für ein Amt · Für den Notfall. `#/lebensmappe`, `#/behoerdendossier`, `#/notfalldossier` öffnen die passende
  Auswahl. Ablage: eine Zeile statt drei. Notfall-QR und Hinweise unverändert.
- **F7-S10:** Patientenverfügung, Bestattungswünsche, Organspende mit Brotkrume «Übersicht › Notfall › …» und
  «Zurück zur Vorsorge» am Schluss → `notfallvorsorge` (Kapitel Notfall, Block Vorsorge, `mp-notfall-vorsorge`).

Wächter: `budgetImportUmleitung`, `merklisteReiter`, `unterlagenDrucken`, `vorsorgeRueckweg`.
Offen: rm-Texte (Gegenlese-Marke F7), Copy-Prüfung der neuen Texte.
