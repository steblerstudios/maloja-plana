# Standbilder für die Hintergrundseite /krankenkasse/

Fünf isometrische Strichfiguren, als **ruhige Standbilder** in die Seite eingesetzt (kein Skript,
CSP `default-src 'none'` bleibt). `scripts/seiten-figuren.mjs` liest sie beim Bauen, setzt Titel und
Beschreibung für Vorlese-Programme ein und färbt sie über Klassen in Malojas Palette «Granit».

| Datei | Figur | Zustand | Zahlen darin |
|---|---|---|---|
| `krankenkasse-praemie.svg` | Prämien-Maschine (Anatomy-Stil): Stapel aus Kostenblöcken, Sockel = eigener Anteil, Taster liest die Prämie ab | Prämienjahr 2027 | BAG-Faktenblatt Leistungen 2025, mit dem Kostenwachstum auf 2027 hochgerechnet; oberster Block = Rest bis zur mittleren Prämie 412 Fr. |
| `krankenkasse-dorf.svg` | 100 Häuser, eines je Mensch, so hoch wie seine Kosten 2024 (Hairline-Stil) | Ruhe, höchstes Haus hervorgehoben | BAG EFIND 2024, Tabelle 1.1 — dieselben Stufen wie `DORF_STUFEN` |
| `krankenkasse-alter.svg` | eine Säule je Altersgruppe (Hairline) | Ruhe | BAG EFIND 2024, Tabelle 2.2 — dieselben Werte wie `ALTER_KOSTEN` |
| `krankenkasse-kostenteil.svg` | Treppe des eigenen Anteils bei Franchise 1'000 (Hairline) | Ruhe | Franchise, 10 % Selbstbehalt, Dach 700 Fr. — dieselbe Regel wie `berechneFranchise` |
| `krankenkasse-kantone.svg` | ein Pfosten je **Prämienregion**, nach Kanton gruppiert, aufsteigend (Hairline) | Ruhe, Genf hervorgehoben | `PRAEMIEN['2027']` aus `src/data/praemienRegionenDaten.js` (Stand 22.10.2026), 42 Regionen |

**Woher:** Die Figuren stammen aus der Erklärseite «Krankenkasse erklärt» von Stebler Studios
(Fassung 02.11.2026), gebaut mit den Werkzeugen *anatomy* (isometrische Erklärfiguren) und
*hairline* (Strichfiguren, Engine `@lucasmarkes/hairline`). Die bewegten Fassungen liegen dort.
Hier stehen nur die Standbilder: das SVG im Ruhezustand, im Browser abgegriffen
(`svg.outerHTML`), bzw. für die Prämien-Maschine direkt aus dem gebauten HTML geschnitten.
Die Kantonsfigur ist eine Abwandlung mit Malojas Prämiendaten statt der Handabschrift.

**Neu abgreifen**, wenn sich Zahlen ändern (spätestens zum Prämienjahr 2028): die Figur in der
Quelle neu bauen, Seite öffnen, nach dem Einschwingen `document.querySelector('svg').outerHTML`
in die Datei hier schreiben, dann `node scripts/build-seiten.mjs`. Die Zahlen, die Leserinnen und
Leser sehen, stehen ohnehin in den Tabellen und kommen aus `src/data` bzw. `seiten-figuren.mjs`;
die Bilder zeigen Grössenverhältnisse.

**Bewegte Fassungen** (seit 04.11.2026): `bewegt/` enthält die Figuren-Skripte mit der Marke DATEN
(die Zahlen setzt der Bau ein), die eigene Bühne `buehne.js` und unter `bewegt/fremd/` den
unveränderten Hairline-Kernel und das Anatomy-Skript der Prämien-Maschine (einzige Anpassung: keine
Autotour, WCAG 2.2.2). Daraus baut `scripts/build-seiten.mjs` je Figur eine Seite unter
`/krankenkasse/bewegt/<name>/`; die Skripte liegen als Dateien daneben und laufen mit
`script-src 'self'` — so verlangt es der Server-Header (`public/.htaccess`, Abschrift). Eingebettete
Skripte würden live blockiert. Die Hauptseite klappt die bewegten Fassungen als Rahmen auf
(`bewegtEinbetten` in `krankenkasse.mjs`, Entscheid 04.11.2026); dafür muss auf dem Server für
`/krankenkasse/bewegt/` `frame-ancestors 'self'` gelten — vorbereiteter Block in `public/.htaccess`,
`scripts/check-deploy.sh` prüft es nach dem Deploy. Der Link darunter bleibt als Ausweg. Im Rahmen
blendet `rahmen.js` die Hinweise der Unterseite aus. Die Strichfiguren sind per Tastatur bedienbar (`buehne.js`
mit `anzahl`/`waehle` der Figur).

**Lizenz:** Hairline (Lucas Marques) und das Anatomy-Kit sind MIT-lizenziert; die Texte liegen unter
`public/licenses/hairline-LICENSE.txt` und `anatomy-LICENSE.txt` und sind in
`docs/legal/third-party-licenses.md` eingetragen. Die CSS-Regeln für die Strichklassen in
`scripts/build-seiten.mjs` sind daran angelehnt.


**Auch in der App (seit 09.11.2026, Variante D):** `scripts/app-verstehen.mjs` schreibt das Standbild `krankenkasse-kostenteil.svg` mit Titel, Beschreibung, Legende und Quelle (über `standbildSvg` und `kostenteilAngaben`) nach `src/data/erklaerfiguren.js`. Die Prämien-Orientierung klappt es als «Im Bild erklärt» auf, die bewegte Fassung bleibt ein Link. Nach einem neuen Abgriff: `node scripts/app-verstehen.mjs`.
---

# Standbilder für die Hintergrundseite /politsystem/ (seit 05.11.2026)

Isometrische Figuren (Anatomy-Stil) aus der Erklärfigur «Schweizer Politsystem als Kugelbahn»
von Stebler Studios (Fassung 02.11.2026, Werkstatt `in Arbeit/schweizer-politsystem/`, ausserhalb
dieses Repos). Sie stehen als **ruhige Standbilder** in der Seite, ohne Skript; Titel und
Beschreibung setzt `scripts/seiten/politsystem.mjs` ein, die Farben kommen aus dem Seitenstil
(`.iso`, dazu `--kb-gold` für die Kugel).

| Datei | Figur | Zustand | Abgriff |
|---|---|---|---|
| `politsystem-ebenen.svg` | **Strichfigur** (Hairline-Stil): drei Terrassen Bund · Kantone · Gemeinden | Ruhe | **erzeugt** von `politsystem-ebenen.mjs` mit dem Hairline-Kernel aus `bewegt/fremd/` (nur Geometrie, kein DOM); seit 05.11.2026 abends |
| `politsystem-bahn.svg` | Kugelbahn: Bundesrat, Nationalrat, Ständerat, Referendum, Urne | Kugel am Start | aus dem gebauten HTML |
| `politsystem-mehr.svg` | Prüfstand doppeltes Mehr | Beispiel «Volk 50,6 %, Stände 6 von 23» | im Browser nach dem Einschwingen |
| `politsystem-wahlbank.svg` | Wahlbank, 200 Sitze in 26 Säulen (Sitze seit 2023) | Zürich gewählt, kleine Partei 8 % → 13 · 12 · 8 · 3 | im Browser nach dem Einschwingen |

**Überarbeitung 05.11.2026 abends (Stebler Studios, «A bis E»):** Uhrwerk und Waage sind entfernt. Sie
waren Bilder ohne zusätzliche Information. An ihrer Stelle stehen kleine Darstellungen ohne Bilddatei, gebaut in
`scripts/seiten/politsystem.mjs`: sieben Kästchen für den Bundesrat und ein Streifen der 23 Standesstimmen.
Dazu kommt eine Schrittliste zur Kugelbahn. Die Sortierbahn ist durch die Strichfigur ersetzt. Seither drei
isometrische Bilder und eine Strichfigur, Bereichsfarbe Zwetschge (Behörden).

**Bereinigt beim Abgriff:** unsichtbare Bedienflächen (`kb-ziel`), ausgeblendete Ebenen
(`opacity:0`), `id`/`role`/`tabindex`/`aria-*` und alle `data-*` ausser denen, die der Stil liest
(`data-shade`, `data-tone`, `data-lit`, `data-dotted`, `data-dashed`). Die beiden Clip-Pfade behalten
ihre id, vorangestellt `ps-` (`ps-urnfahnen`, `ps-fahnen`), sonst zeichnet der Browser die Fläche
schwarz. Zahlen auf eine Nachkommastelle gerundet (keine Matrix-Transformationen in den Figuren).

**Neu abgreifen**, wenn sich die Quelle ändert (spätestens mit den Sitzen der Wahlen 2027): Quelle
bauen, `index.html` lokal ausliefern, die Figur ins Bild scrollen, einschwingen lassen (die Wahlbank
braucht rund 30 Sekunden), dann `document.querySelector('#<id> svg').outerHTML` abspeichern und wie
oben bereinigen. Die Zahlen, die Leserinnen und Leser sehen, stehen ohnehin im Text und in der
Tabelle und kommen aus `scripts/seiten/politsystem.mjs`; die Bilder zeigen Verhältnisse.

**Bewegte Fassung:** nicht übernommen. Entscheid Stebler Studios 05.11.2026: «Erst Handy-Test», danach die Kugelbahn in eigene Skriptdateien zerlegen (Gründe im Kopf von `scripts/seiten/politsystem.mjs`).

**Lizenz:** Gezeichnet mit dem Anatomy-Kit (MIT, Lizenztext `public/licenses/anatomy-LICENSE.txt`, in
`docs/legal/third-party-licenses.md` wegen der bewegten Prämien-Maschine eingetragen). Die Standbilder
enthalten keinen Code des Kits, nur dessen gezeichnete Ausgabe; die CSS-Regeln für `.iso` in
`scripts/build-seiten.mjs` sind an dessen `iso.css` angelehnt (wie auf /krankenkasse/). Die Figuren
selbst sind Werk von Stebler Studios. Die Schriften
der Quelle (SIL OFL) sind nicht übernommen, die Seite nutzt Malojas eigene.
