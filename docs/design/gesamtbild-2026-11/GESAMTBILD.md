# Gesamtbild nach Stardust · 06.11.2026

**Frage (Stebler Studios):** «wollten wir nicht generell dieser Fassung näher kommen … wir wollen
definitiv noch besser werden als diese Version, obwohl sie extrem in die richtige Richtung ist.»

**Was das ist:** ein Stand, gemessen und nicht geschätzt — App gegen die Stardust-Entwürfe
Fassung 5 (`docs/design/mockups-stardust-2026-10-23/seiten-v5.html`), dazu alle offenen Fäden
und ein Vorschlag, wie es weitergeht. Nichts gebaut.

**Gemessen an:** `origin/main` **`7e9bf444`** (06.11.2026 17:42, Merge #698), App im Beispiel
«Ohne Code ausprobieren» (Maria Muster), 390 × 844 und 1280 × 860, hell und dunkel. Entwürfe über
einen lokalen Server (`?nur=<id>&thema=light|dark`). Werte mit `getComputedStyle` gelesen.
Bilder: [`bilder/`](bilder/). Live: siehe Abschnitt 2.

---

## 1. Stand: App gegen Fassung 5

### 1.1 Das Grosse zuerst: die App ist *inhaltlich* weiter als das Mockup

Fassung 5 wurde am 23./24.10. Seite für Seite entschieden und in Fassung 6–8 gebaut (Übergabe
`UEBERGABE-FASSUNG-6.md`: Kapitel-Muster M1–M8, alle sieben Kapitel mit Instrument, Finanzen-
Grafiken, Notfall als ein Ort, Versicherungs-Übersicht). Wo heute beide dasselbe zeigen, ist die
**App genauer**:

| Stelle | Mockup Fassung 5 | App heute | Wer ist besser |
|---|---|---|---|
| Kapitel Wohnen (Z) | «Mietpreiserhebung **2020**», Region CHF 1538 | BFS Mietpreis-Strukturerhebung **2024**, Region CHF 1’732, Quelle verlinkt | **App** |
| Wohnen, Faustregel | «viele Vermieter verlangen das sogar» (unbelegt) | Satz gestrichen, «grobe Orientierung … keine feste Grenze» | **App** |
| Tausender-Zeichen | «CHF 1650», «CHF 1327» | «CHF 1’650», «CHF 1’446» | **App** |
| Breit (1280 px) | Entwurf ist nur als Telefon gezeichnet | eigene breite Spalte, Monatsleiste voll | **App** (das Mockup sagt hier nichts) |
| Dunkel | Voreinstellung, Werte aus `constants.js` | Voreinstellung (`or5_theme` = dunkel), gleiche Palette | gleich |

**Folgerung:** «Dem Mockup näher kommen» heisst nicht mehr *Inhalte* nachbauen. Es geht um die
**Haltung der Oberfläche** — Ecken, Flächen, wie laut Gold ist. Dort liegt der Eindruck «edler».

### 1.2 Gemessen: wo die Oberfläche abweicht

| Merkmal | Mockup Fassung 5 | App heute (`7e9bf444`) | Entschieden? |
|---|---|---|---|
| **Titelschrift** | Hanken Grotesk 700, Seitentitel 30 px, grosse Zahl 44 px | Hanken Grotesk 700, Seitentitel 30 px, «in 12 Tagen» gross | gleich |
| **Fliesstext** | Lexend 400, 15 px | Lexend 400/500/600 | gleich |
| **Ersatzschrift** | `font-family: 'Hanken Grotesk'` **ohne** Ersatz (Z. 33, 46, 103 …) | `'Hanken Grotesk', sans-serif` (`tokens.js`) | App richtig |
| **Knöpfe mit Text** | Pille, `999px` (Z. 119, 120, 585) | **6 px** (`KNOPF_RADIUS`) | ✅ 05.11. «keine Pillen an Textknöpfen» (`brand-guidelines.md` §Knopfarten) |
| **Monatsknöpfe/Chips** | Pille `999px` | 10 px (32×) bzw. 6 px | ✅ «Auswahl» = 6 px |
| **Karten** | `.karte` 18 px, `.u-karte` 22 px, Erklärung 12 px | 6 px / 10 px / 16 px gemischt, im Kapitel fast **keine** Karten (Angaben als Liste) | ⏳ #729 «Ecken nach Rolle» |
| **Kartenluft** | `.karte` 12 px innen, `.u-karte` 18/18/14 | 10–16 px, 12/16, 16/24 gemischt | ⏳ #729 «Luft auf Skala» |
| **«Heute» im Kalender** | leer, grauer Rand, Text dunkel | Nebenknopf: Rand + Schrift **Gold** (`rgb(122,95,48)`) | Regel 05.11. ja, Wirkung offen |
| **«+ Erinnerung hinzufügen»** | leer, grauer Rand (Gold erst im Formular «Erinnerung hinzufügen») | **gefüllt Gold** = Hauptknopf der Seite | Regel 05.11. ja, Wirkung offen |
| **Gold-Text je Seite** | sparsam, «ändern ›» gold | im Kapitel 6–8 goldene Elemente auf einem Bildschirm (ändern ›, ergänzen ›, Weiter mit …) | — |
| **Schatten** | fast keine; nur Papierblatt | `shadow.sm…xl` vorhanden, wenig benutzt | gleich ruhig |

Belege: Mockup `#g` → `Heute | bg transparent | c rgb(36,38,42) | r 999px | border 1px rgb(220,218,214)`,
`+ Erinnerung hinzufügen` gleich, `Erinnerung hinzufügen` (im Formular) `bg rgb(196,160,106)`.
App `#/calendar` hell → Hauptknopf `+ Erinnerung hinzufügen r6px` gefüllt Sand, `Heute` Schrift
`rgb(122,95,48)`; Knopf-Rundungen auf der Seite: 6 px ×19, 10 px ×32, 9999 px ×4, 0 px ×61 (Listenzeilen).

### 1.3 Der «Serifen»-Eindruck: Ladefehler, nicht Gestaltung

Über einen lokalen Server lädt `seiten-v5.html` Hanken Grotesk korrekt (`document.fonts`:
Hanken 600/700 und Lexend 400/500 «loaded», Titel gemessen in Hanken). Weil dort aber **keine
Ersatzschrift** steht, fällt jeder Titel auf die Serifenschrift des Browsers, sobald die woff2
nicht geladen werden — vermutlich beim Öffnen ohne Server (`file://`) oder aus einer Kopie ohne
die Schriftdateien. So entstand der «edlere» Eindruck. **Das Markenhandbuch will das nicht**
(«Kontrast aus Gewicht, nicht aus Serif-vs-Sans»). Die App macht es richtig. Nichts nachziehen.

Ein kleiner Befund in der App: «Was ist jetzt dran?» (Übersicht) verlangt Hanken **400**, geladen
sind nur 600/700 → der Browser nimmt 600. Kein sichtbarer Fehler, aber ein unehrlicher Wert.

### 1.4 Je Seitenart (Kurzfassung)

| Seitenart (Mockup-ID) | gleich | schlechter in der App | besser in der App |
|---|---|---|---|
| G Was ansteht | Kopf, «Als Nächstes · in N Tagen», Monatsleiste, Reiter Merkliste | Gold lauter (Hauptknopf «+ Erinnerung», «Heute» gold); «Möglicherweise für Sie da» steht im Mockup über dem Monat, in der App im ersten Bildschirm nicht (im Code da, `CalendarReminders.jsx:479`; Bedingung nicht geprüft) | Kalenderblatt für Fristen (#722/#731 im Bau), breit nutzbar |
| Z Kapitel Wohnen | Instrument, Barometer, Liste der Angaben | — | Daten 2024, Quelle, kein unbelegter Satz |
| A–AE Kapitel allgemein | Muster M1–M8 gebaut | Karten fast ohne Rundung/Fläche → wirkt «Formular» statt «Blatt» | Instrumente, Querverweise (#712) |
| U Übersicht | Aufbau, «Was ist jetzt dran?» | Rundungen gemischt (2/6/10/16 px); Rundgang-Dialog deckt beim ersten Mal alles zu | — |
| Knöpfe überall | — | — | ein Satz Knopfarten mit Test (`knopfarten.test.js`) — das Mockup hatte keinen |

Nicht einzeln gemessen: B, C, D, E, F, H–X (die Regeln oben gelten seitenübergreifend; die
Abnahme Fassung 6 in `VERGLEICH.md` Z. 980–1307 hat sie Seite für Seite).

---

## 2. Offene Fäden

**Momentaufnahme 06.11.2026 ~18:00.** Während der Messung rückte `origin/main` von `7e9bf444`
auf **`13c26597`** (#701 gemergt 17:57); #703 wurde auf `main` umgestellt. An der F9-Kette arbeitet
gerade eine andere Sitzung — vor jedem Schritt neu messen.

**Live:** `https://malojaplana.ch/version.json` → commit **`4f37d580`**, 0.1.49-beta, gebaut
05.11. 11:48 (Gegenprobe erfundene Datei → 404). Live liegt **203 Commits** hinter `origin/main`.
Nichts vom 06.11. ist live. *Gemergt ist nicht live.*

### 2.1 Offene PRs

Belege: `gh pr view`, `git cherry`, `gh pr checks`, `git merge-tree --write-tree --name-only`.
CI läuft nur bei Basis `main`; gestapelte PRs zeigen «keine Checks».

| PR | Inhalt | Basis | CI | Konflikt mit main | Zustand |
|---|---|---|---|---|---|
| #730 | drei Gesetzeszitate fr/it/en wörtlich nach Fedlex (C2) | main | ✅ | keiner | **mergebereit** |
| #728 | Entscheide A3/C1/C2/C3/D3 vom 06.11. (nur Doku) | main | ✅ | keiner | **mergebereit** |
| #703 | «du» klein (B1), 259 Stellen + Wächter | **main** (seit 17:57) | nicht neu abgefragt | keiner | nach CI mergebereit |
| #710 | Hausbegriffe, ein Wort je Sache (B2–B11) | #703 | – | gegen #703 sauber | wartet auf #703 |
| #712 | Querverweise in beide Richtungen, Dringendes zuerst (D3–D5) | #710 | – | gegen #710 sauber | wartet auf #710 |
| #726 | Bewegung: Festwerte → `duration`/`ease`, Vergrösserung max. 1.04 | main | ✅ | keiner | mergebereit, **nicht im Browser angesehen** |
| #722 | A14 Schritt 1: Kalenderblatt mit Frucht-Stempel | `feat/f9-knopfarten` (= #696, **schon gemergt**) | – | `src/AblaufSchale.jsx` | auf `main` umstellen, 1 Konflikt lösen |
| #731 | A14 Schritt 2: Tresor, Zahlungsfristen, Brief-Frist, «abgelaufen/überfällig», Jahreskreis | #722 | – | gegen #722 sauber | wartet auf #722 |
| #693 | Erklärseite «Wie die Schweiz entscheidet» (/politsystem/) | main | ✅ | keiner | mergebereit |
| #729 | Ecken nach Rolle, Luft-Skala mit 12, Abschnitte 48, Brand Book §7a A–F; **enthält #726 inhaltlich** | main | ✅ | **67 Dateien** (111 Dateien, ~1 300 Zeilen Codemod gegen #691/#696/#698) | **neu erzeugen**, nicht nachziehen; nicht im Browser angesehen |
| #652 | Wiederkehr nur auf dem Gerät zählen | main | ✅ | 4 Dateien, 345 Commits zurück | alt, eigene Frage |

**Was was blockiert**
- #710 → #712 hängen an #703. #731 hängt an #722, #722 an Umstellung + `AblaufSchale.jsx`.
- **#729 ⊃ #726**: beide Commits stecken mit anderen Hashes in #729 (`git cherry` «−»). Beide mergen →
  Konflikt in `brand-guidelines.md` und `Dashboard.jsx`. Also: #726 mergen, #729 auf frischem `main`
  mit den Skripten neu erzeugen (so plant es auch die Sitzung «Rundungen, Abstände und Animationen»).
- **Widerspruch #729 ↔ main:** #729 setzt Knöpfe auf `md` **10 px**. Auf `main` steht seit #696
  (05.11.) «alle Knöpfe und Auswahlen **6 px**», mit Wächter `knopfarten.test.js`. → Entscheid E1.
- **Vorschau-Engpass:** der Projektordner hat die Grenze von 5 Vorschau-Servern erreicht. Deshalb
  sind #726 und #729 ohne Vorher-nachher-Bilder. Diese Sitzung lief deshalb ausserhalb der Vorschau.

### 2.2 Fassung 9 (Bestandsaufnahme `docs/fassung-9-bestandsaufnahme`, `486c1bb1`, kein PR)

| Teil | gebaut / gemergt | offen im PR | offen ohne PR |
|---|---|---|---|
| A Gestaltung | A1–A4 (#691), Knopfarten + Fristen blau (#696) | A5 Abstand 12 (#729) · A14 Kalenderblatt (#722 → #731) | A6–A13 |
| B Sprache | — | B1 (#703) · B2–B11 (#710) | — |
| C Zitierweise | C1 Stufe 1 (#701, 17:57) | C2 (#730, #728) | C3–C9 |
| D Abfolge | D1, D6 (#698) · D2 (#720, laut Gedächtnis) | D3–D5 (#712) | D7–D10 |
| E Doku | — | — | E1–E3 |

Die Bestandsaufnahme selbst ist **nur auf ihrem Zweig** — sie gehört als Doku-PR auf `main`, sonst
ist sie für jede andere Sitzung unsichtbar.

### 2.3 Aus Fassung 5/6 noch offen (`VERGLEICH.md`)
- Übersicht: Kartentitel und Bereichszeilen «bleiben offen» (Z. 947–949); 7/7 «warten» (Z. 1645).
- Bewegung Regel E (Verschwinden ≈ ⅔ der Erscheinzeit) im Bestand nicht umgesetzt; verschachtelte
  Ecken (Regel D) nicht geprüft (Meldung der Sitzung «Rundungen …»).
- `seiten-v5.html`: ID `u` doppelt (Übersicht **und** Lebensmappe) — `?nur=u` zeigt beide.

---

## 3. Vorschlag

### 3a. Fertigmachen — in dieser Reihenfolge (Mergen ist Stebler Studios’ Hand)

1. **#730, #728** — klein, sauber, grün.
2. **#703 → #710 → #712** — Sprache und Querverweise; je nach Merge den nächsten auf `main`
   umstellen, CI abwarten.
3. **#726** Bewegung — vorher **einmal im Browser** ansehen (Stempel, Berg, «abgeschlossen»).
4. **#722** auf `main` umstellen, `AblaufSchale.jsx` lösen → **#731**. Damit ist A14 fertig.
5. **#693** Politsystem.
6. **#729 neu erzeugen** auf dem dann aktuellen `main`, mit Entscheid E1 eingearbeitet, **mit
   Vorher-nachher-Bildern** (Übersicht, Kapitel, Rechner, Kalender). Erst dann mergen.
7. Bestandsaufnahme F9 als Doku-PR; #652 getrennt entscheiden.
8. Nach jeder Runde: `build-seiten --pruefen` und vitest auf `main`. Danach **Deploy** (Stebler Studios),
   damit 203 Commits nicht weiter anwachsen.

Warum diese Reihenfolge: zuerst das, was ohne Konflikt durchgeht; #729 zuletzt, weil es als
Codemod über 111 Dateien jede frühere Zeile wieder trifft — einmal neu laufen lassen statt zweimal lösen.

### 3b. Was wir aus dem Mockup noch nachziehen

Nur, was das Mockup **besser macht**, nicht was es anders macht:

1. **Gold-Disziplin.** Im Mockup ist auf «Was ansteht» nichts gold, bis man wirklich etwas festhält:
   «+ Erinnerung hinzufügen» öffnet (grauer Rand), erst «Erinnerung hinzufügen» im Formular ist gold.
   Die App macht den Öffner schon zum Hauptknopf. Das ist der eine Punkt, der die App «lauter»
   macht als das Mockup. → E2.
2. **«Heute» ist Navigation, nicht Handlung.** Im Kalender gehört «Heute» zur Monatsleiste
   (Knopfart «Auswahl»), nicht als goldener Nebenknopf.
3. **Karten mit Ecke nach Rolle** (Mockup 18/22 px, App 6/10/16 gemischt): kommt mit #729 (Karte 16).
4. **«Möglicherweise für Sie da» im Kalender** sichtbar über dem Monat, wie im Mockup — erst
   prüfen, unter welcher Bedingung die App den Kasten zeigt.

**Bewusst nicht nachziehen:** die Pillen an Textknöpfen (entschieden 05.11.) und die
Serifen-Wirkung (Ladefehler, Abschnitt 1.3).

### 3c. Wo wir besser werden als das Mockup

Das Mockup ist eine Zeichnung mit gutem Auge. Wir werden besser, indem wir das Auge **in Regeln**
fassen, die die App selbst prüft — das kann ein Mockup nicht:

1. **Regeln statt Pixel** (Brand Book §7a A–F, entschieden 06.11.): Nähe, Skala ×1.5, Ecke nach
   Grösse, verschachtelte Ecken, Bewegung nach Weg, Takt 24. Jede neue Seite ist dann automatisch
   «aus einem Guss», auch die, die nie gezeichnet wurden (das Mockup hat 32 Entwürfe; `main.jsx` unterscheidet 74 Ansichten, gezählt mit `grep "view === '…'"`).
2. **Ein Gold je Bildschirm, als Test.** Heute stehen im Kapitel 6–8 goldene Elemente auf einem
   Bildschirm. Regel: höchstens **ein** gefüllter Goldknopf je Ansicht (steht schon im Brand Book)
   und Leise-Links bleiben die Ausnahme — als Wächter-Test wie `knopfarten.test.js`.
3. **Fristen haben ein eigenes Zeichen** (Kalenderblatt, blau, rot erst bei «abgelaufen», mit
   Frucht-Stempel des Lebensbereichs) — das Mockup kannte nur Zahlen. #722/#731.
4. **Breit gestaltet.** Das Mockup zeichnet nur das Telefon. Die App hat eine breite Spalte, aber
   ohne eigenes Raster. Später: zwei Spalten für Kapitel (Instrument links, Angaben rechts).
5. **Ehrliche Schrift.** `font-weight: 400` nur, wo Hanken 400 geladen ist (heute nicht:
   «Was ist jetzt dran?»), Ersatzschrift immer `sans-serif` — beides als Test, damit nie wieder eine
   Serife «aus Versehen» edel wirkt.
6. **Inhalt bleibt Wahrheit.** Wo die App das Mockup überholt hat (BFS 2024, gestrichene unbelegte
   Sätze, Tausender-Zeichen), gilt die App — das Mockup wird nicht mehr als Textquelle verwendet.

### 3d. Die vier Entscheide, die als Nächstes anstehen

> ✅ **Entschieden 06.11.2026 abends** (Stebler Studios: «Ja, so übernehmen», auf die vier
> Empfehlungen unten): **E1 = B** Knöpfe 10 px · **E2 = C** Gold erst beim Festhalten ·
> **E3** Merge-Reihenfolge wie in 3a · **E4 = C** #726 jetzt, #729 danach neu erzeugen.
> E3 gibt die **Reihenfolge** frei, nicht das Mergen selbst — Mergen und Deployen bleiben
> Stebler Studios’ Hand.
>
> **Was daraus zu bauen ist (noch nicht gebaut):**
> - E1 → im Neubau von #729: `KNOPF_RADIUS` = `radius.md` (10), Brand Book §Knopfarten
>   («alle Knöpfe und Auswahlen 6 px» → 10 px), Wächter `knopfarten.test.js` mitziehen.
> - E2 → Knopfarten-Regel ergänzen: ein Öffner (z. B. «+ Erinnerung hinzufügen») ist Nebenknopf,
>   Hauptknopf ist nur der Schritt, der speichert oder sendet; «Heute» im Kalender ist eine
>   Auswahl. Betrifft `CalendarReminders.jsx` und das Brand Book; danach im ganzen Bestand
>   nach weiteren Öffnern als Hauptknopf suchen.
> - E4 → #726 zum Mergen bereit (vorher einmal im Browser ansehen); #729 danach auf frischem
>   `main` mit den Skripten neu erzeugen, mit Vorher-nachher-Bildern.

Skizzen A/B/C dazu im Bild: [`gesamtbild.html`](gesamtbild.html) (veröffentlicht als privates
Artifact «Gesamtbild nach Stardust», https://claude.ai/artifact/V9PL74gCetTGzS7njk8Xd9).

**E1 · Wie rund sind Knöpfe? — 6 px oder 10 px**
A heute 6 px (#696, 05.11.) · B 10 px (#729, Vorschlag B vom 06.11.) · C Pille (Mockup).
**Empfehlung B, 10 px**: Es ist der neuere Entscheid und folgt der Regel «Ecke nach Grösse»
(Knopf 44 px hoch zwischen Marke 6 und Karte 16). Dann im Neubau von #729 die Zeile «alle Knöpfe 6 px»
im Brand Book und `KNOPF_RADIUS` mitändern, sonst widersprechen sich Regel und Test.

**E2 · Wann ist etwas gold?**
A heute: der Öffner («+ Erinnerung hinzufügen») ist gold, «Heute» gold umrandet · B Mockup:
nichts gold auf der Seite · C **Gold erst beim Festhalten**: Öffner und «Heute» ruhig (Rand grau),
gold ist nur der Knopf, der wirklich speichert oder sendet.
**Empfehlung C.** Passt zur Farbrolle «Gold = handeln» und nimmt die Lautstärke weg.

**E3 · Reihenfolge freigeben**
Die Liste in 3a. **Empfehlung: so mergen**, #729 erst nach dem Neubau mit Bildern.

**E4 · #726 jetzt einzeln mergen und #729 danach neu erzeugen?**
A beide offen lassen, bis #729 fertig ist · B #729 allein (#726 schliessen) · C **#726 jetzt,
#729 neu**. **Empfehlung C:** #726 ist sauber und grün; #729 muss ohnehin neu entstehen.

---

*Erstellt 06.11.2026 in der Sitzung «Gesamtbild nach Stardust». Nur gelesen und gemessen, nichts
gebaut. Messwerte aus `getComputedStyle` im Browser, PR-Stand aus `gh`/`git`, Rundungen-Stand aus der
Sitzung «Rundungen, Abstände und Animationen» (Nachricht 06.11. abends).*
