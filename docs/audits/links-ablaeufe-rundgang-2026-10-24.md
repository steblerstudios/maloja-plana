# Links, Abläufe und Seitenrundgang — Maloja Plana, 24.10.2026

*Geprüfter Stand: `origin/main` `32284107` (24.10.2026, #559), das, was am 29.10. live gehen soll.
Umfang auf Wunsch von Stebler Studios **nur** «Prüfung von Links und Abläufen» und «Seitenrundgang».
Kein System-Audit und kein Voll-Review, weil das letzte Stufe-L-Review erst am 19./20.10. lief
(`docs/AUDIT-VOLL-2026-10.md`). Stufen S/M/L: `stebler-studios/bibliothek/sops/review-umfang.md`.*

*Wer prüfte:*
- `link-checker` (Sonnet): 1'098 URL-Treffer, `curl -sIL`, GET-Nachmessung bei 4xx/5xx
- ein Routen-/Ablauf-Prüfer (Sonnet), der Router, Umleitungen und `docs/ABLAEUFE.md` gegen den Code abglich
- Claude Code (Opus): Rundgang im Browser auf dem Dev-Server (Beispielperson, 375 px und 1280 px, hell und dunkel), Nachmessung jedes 🔴 und 🟠

*Schwere wie im Oktober-Audit: 🔴 blockiert Deploy · 🟠 sollte vor 29.10. · 🔵 später.*

## Ergebnis

**Kein Blocker.** Die zwei Fehlsprünge und die alten Beschriftungen sind in PR #563
(`fix/ablauf-sprungziele`) behoben, mit Wächter `src/__tests__/ablaufSprungziele.test.js`.

## 🟠 Sollte vor 29.10.

| # | Befund | Stand |
|---|---|---|
| 1 | KVG-/Zusatz-Wechsel «Police ablegen» → `unterlagen` → «Meine Unterlagen» **ganz unten** in der Ablage statt beim Ablegen (im Browser nachgemessen) | **behoben** #563 → `tresor` |
| 2 | Mietzins «Einkommen erfassen» (nur ohne Einkommen sichtbar) → `finanzuebersicht` → Auswertung **unter** dem Formular. Belegt nur im Code, die Beispielperson hat ein Einkommen | **behoben** #563 → Kapitel Finanzen ohne Sprungmarke |
| 3 | Knöpfe hiessen «Finanz-Übersicht», die Zielseite heisst «Finanzen & Geld»; dazu ein doppelter Menüeintrag | **behoben** #563, Entscheid Stebler Studios 24.10.: Label = Kapiteltitel in 5 Sprachen, Werkzeug-Eintrag aus dem Menü (Suche, Portemonnaie, alte Links bleiben) |
| 4 | EL unter «Was steht mir zu?» zeigt auf die Finanz-Auswertung (`AnspruchCheck.jsx:60`, `data/anspruchLandkarte.js:30`, `data/anspruchSignale.js:45`), obwohl es den Ablauf `ergaenzungsleistungen` gibt | **offen** |
| 5 | Fortschritt widerspricht sich: Menü «63 % vollständig», Übersicht «Ihr Fortschritt 70 %» | **offen** |
| 6 | ALV-Link `arbeit.swiss/de/stellensuchende` (`data/direktLinks.js:54`) liefert 401. Am 24.10. **auf der ganzen Domain** 401, auch die Startseite, auch im Browser, also ein Problem der Seite selbst | **offen**: am 28.10. im Browser öffnen, sonst auf `/de/registrierung-stellensuchende` ausweichen |
| 7 | `abstraktum-odemis.ch` (`data/direktLinks.js:210`): 503 «Under Maintenance», seit dem Review vom 15.09. | **offen**: Eintrag herausnehmen, bis die Seite zurück ist |

## 🔵 Später

- **`docs/ABLAEUFE.md` ohne Nachtrag zum Bündeln vom 24.10.** Veraltet sind:
  - `charts`, `finanzuebersicht`, `unterlagen` und `notfalleinstieg` als eigene Seiten (Z. 54–58, 68)
  - `NotfallEinstieg.jsx` (F2, I5, Z. 473)
  - `MeineUnterlagen.jsx` (G1, Z. 468, 502–504)
  - der Hub `finanzuebersicht` (E2, E3)
  - «Ausgesteuert» als eigener Ablauf (Z. 18)
- `docs/entscheide/seiten-buendeln.md:225` sagt, Suche, Menü und Dashboard «zeigen aufs neue Ziel». Tatsächlich rufen sie den alten Namen und laufen über die Umleitung. Dort steht ausserdem §6 vor §5.
- **Verwaist:**
  - `src/FinanzUebersicht.jsx` (nur noch Tests)
  - `src/data/orientationRegistry.js` (nirgends importiert)
  - `data/systemblick.js` und `data/versichererListe.js` (nur Tests)
- **Doppelt im Aussenfach:** «Dokumentenablage» und «Meine Unterlagen»; «Charts» liegt dort, landet aber im Kapitel Finanzen. Beides ist laut Entscheidblatt §6 und §9 offen.
- **Kein Test gegen Umleitungsketten.** Ein Ziel könnte selbst wieder umleiten. Heute stimmt es, abgesichert ist es nicht.
- **Unbekannte Adressen** (`#/gibtsnicht`) zeigen still die vorherige Seite weiter.
- **Copy auf der Übersicht** (Beispielperson):
  - «frei/Mt..» mit zwei Punkten
  - «Frist 2026-09-30»: vorbei und im ISO-Format
  - «Tipps für den Anfang» erscheinen auch bei fertiger Grundordnung, mit geraden statt «» Anführungszeichen
- **In der Suche nach «finanz»** steht «Finanzen & Geld» zweimal (Werkzeug mit Untertitel, Kapitel). Das folgt aus Entscheid #3. Falls es stört, das Werkzeug ganz aus der Suche nehmen.
- **Bot-Sperren (403/500 per curl), einmal im Browser öffnen:**
  - `baselland.ch` (`direktLinks.js:284–286`)
  - `edk.ch` (`stipendienData.js:14–15`)
  - `asloca.ch` (`fr.js:2573`)
  - `ecosia.org`
  - `gnu.org`
  - `berufsbildung.ch` (`ChapterView.jsx:1343`)

## ✅ Bestätigt gut

- **Die fünf Umleitungen** (`utils/hashRouter.js` `UMLEITUNGEN`): keine Kette, keine Schleife, jede Sprungmarke existiert.
  - Im Browser angesehen: `#/unterlagen`, `#/notfalleinstieg`, `#/aussteuerung`, `#/charts`.
  - «Ausgesteuert» klappt beim Sprung auf.
- **Alle festen Navigationsziele** in `src/` und `public/` sind gültig; die Routen-Tests sind grün.
- **Link-Blocker B1–B3** aus `docs/AUDIT-VOLL-2026-10.md` sind behoben, mit `curl` und `pdftotext` nachgemessen.
- **1'098 Links:**
  - kein Zertifikatsfehler
  - keine Umleitung auf eine fremde Domain
  - 104 `mailto:`, alle `info@malojaplana.ch`, korrekt kodiert
- **Brief-Links aus «Stelle verloren»** öffnen die Vorlage vorausgewählt.
- **Rundgang:** Übersicht, Kapitel, Ablage, «Stelle verloren», Notfall, Brief-Vorlagen auf Handy und Desktop, hell und dunkel: nichts Auffälliges. In der Konsole stehen nur die Service-Worker-Meldungen des Dev-Servers.

## Grenzen

- **Fedlex** liefert als SPA immer 200. Inhaltlich geprüft sind nur die neuen/geänderten Links und drei Stichproben.
- **Die Beispielperson** zeigt Knöpfe nicht, die nur bei fehlenden Daten erscheinen (z. B. Mietzins «Einkommen erfassen»).
- **Kein Rundgang auf Stage oder Live**, nur Dev mit dem Stand von `main`.
