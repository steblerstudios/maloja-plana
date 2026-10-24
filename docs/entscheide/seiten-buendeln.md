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
> 3. **IPV:** bleibt eigene Seite. Nur `praemien` und `kvg` ins Kapitel Versicherungen.
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
