# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Stebler Studios). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-09-22, 10:25 (`main` = `28006b5` nach **#249** a11y-Labels · **#250** Stand-Doku · **#251** SEO-Fixes + Audit-Blatt · **#253** öffentliche Erklärseiten · **#252** Kern-Text ohne JS · **#254** EL/SKOS-Fachkorrektur · **#255** + **#257** Stand-Doku · **#256** Erklärseiten in fünf Sprachen, **gemergt 21.09. 15:32 UTC** · **#259** Vorname raus, **gemergt 21.09. 16:26 UTC** · **#258** Zeichenschicht + Fokus-Falle, **gemergt 22.09. 07:54 UTC** · **#260** Stand-Doku, **gemergt 22.09. 07:58 UTC** · **#262** Stand-Korrektur, **gemergt 22.09. 10:15 UTC** · **#261** Lebensbaum auf die Finanz-Übersicht, **gemergt 22.09. 08:20 UTC** · **live weiterhin `index-nd0WhuaA.js` = 0.1.39-beta, also VOR diesen dreizehn PRs** · **2696 Tests grün auf `main` gemessen** (140 Dateien), eslint sauber, Startdatei **59,09 kB von 65** · **keine offenen PRs**, unmittelbar vor dem Schreiben geprüft)

> *Nach dem Merge von **#260** nachgezogen: die Zeile nannte `0e57926`, `main` stand auf
> `849042b`. **Eine Stand-Doku, die an einem Merge endet, zeigt sonst den Vor-Merge-Stand.**
>
> Die Zeile kann ihren **eigenen** Merge-Commit nie enthalten — das ist ein unendlicher
> Regress, kein Versäumnis. **Ein Commit Rückstand ist zulässig, mehr nicht.** Wer die Zeile
> anfasst: `git log -1 origin/main` messen, auch wenn man den Stand zu kennen glaubt. Am
> 21./22.09. wurde sie **viermal** falsch — dreimal durch einen Merge, einmal in genau dem
> Block, der davor warnt, und einmal, weil eine **parallele Sitzung** während des Schreibens
> einen PR öffnete («keine offenen PRs» stimmte 20 Minuten lang).
>
> 🛑 **Nicht nur der eigene Merge altert die Zeile, auch fremde Arbeit.** Bei mehreren
> Sitzungen im selben Repo gehört `gh pr list --state open` unmittelbar vor den Merge —
> nicht an den Anfang der Arbeit.*

> *Nachgezogen nach **#261**: die Zeile stand auf `849042b` und war damit **zwei** Merges
> zurück. Zugleich am 22.09. aufgeräumt — **14 Zweige** auf GitHub und **17** lokal gelöscht
> (alle restlos in `main`, einzeln geprüft), **4 Arbeitsbäume** entfernt, 3 Vorschau-Einträge
> aus `launch.json`. Es bleiben `main`, `feat/k31-ipv-vd` (3 Commits, Waadt) und
> `mess/baum-3d` (11 Commits, das Protokoll der 3D-Runden) — beide tragen Arbeit und
> wurden bewusst nicht angefasst.*

> *Zweimal nachgeführt am 21.09. Erst stand #256 hier als «← dieser PR», war aber um
> 15:32 UTC gemergt. Dann nannte die Zeile `47866b5`, während #259 um 16:26 UTC schon
> auf `main` lag — **in genau dem Block, der vor dieser Falle warnt.** Gefunden hat es
> eine Peer-Sitzung, nicht ich.*
>
> **Eine Stand-Zeile altert nicht langsam, sie wird mit einem Merge auf einen Schlag
> falsch — und wer sie schreibt, ist dagegen nicht immun.** Wer sie anfasst, misst
> vorher `git log -1 origin/main`, auch wenn er glaubt, den Stand zu kennen.

> ### 🔣 Zeichenschicht, Fokus-Falle, Glossar — PR #258, **gemergt 22.09. 07:54 UTC**, nicht deployt
>
> Rohe Zeichen im Produkt von **1'079 auf 173**. Code geklebt 289 → 2, Code allein 97 → 4,
> Sprachdateien 592 → 167. Der Rest ist Typografie für «ergibt» und bleibt bewusst stehen.
>
> **Die Fokus-Falle (O17)** liegt jetzt als ein Baustein in `src/hooks/useFocusTrap.js` und
> trägt `Tour`, `DatenLoeschen` und `MobileNav`. 🛑 **Beide Schubladen hatten vorher gar
> keine**: der Escape-Griff lag auf dem Hintergrund, der Fokus stand aussen, Escape tat
> schlicht nichts. Die Erfassen-Fächer in `main.jsx` bekommen nur Escape und **keine**
> Falle — das ist eine Auswahl am Knopf, kein Dialog.
>
> 🛑 **React setzt `autoFocus` VOR dem ersten Effekt.** Der Auslöser wird deshalb *während
> des Renderns* gemerkt, sonst kehrt der Fokus nie dorthin zurück.
>
> **Drei Doppelungen aufgelöst**, alle nach demselben Muster: eine Zusage, die von Hand
> wiederholt wird, wird an der siebten Stelle vergessen. Kapitel-Piktogramme lagen als
> Glyphen in `i18n` · `SEARCH_VIEWS` stand neben `allTools` (5 von 16 uneinig) · das
> Ziel-Zeichen klebte an sechs Stellen neben einem `ExternerLink`, der den Kontextwechsel
> längst selbst ankündigte. Neu: `src/config/ansichtenRegister.js` als **eine** Zuordnung
> Ansicht → Beschriftung → Piktogramm für Suche, Menü und Querverweise.
>
> 🛑 **Aufklappen ist ein Chevron, kein gedrehter Pfeil.** Ein Pfeil hat einen Schaft und
> liest sich gedreht als «herunterladen» — im Test stand neben der Sprachwahl «DE↓».
>
> **Glossar 12 → 16** (Nettolohn · Taxpunktwert · Bundessteuer · Veranlagung, fünf Sprachen,
> Quelle wo rechtlich: KVG Art. 43 ff., DBG Art. 36). Markierungen auf der Steuerseite 1 → 8.
> Nebenbefund: `GlossarText` warf ohne Sprach-Kontext, auch wenn `t` als Eigenschaft kam —
> lag seit jeher drin, riss beim Anschluss 41 Tests, behoben.
>
> **65-kB-Deckel:** `MobileNav` auf `React.lazy` mit Vorladen im Leerlauf, **−2,88 kB**.
> Der Deckel stand bei 64,96 von 65.
>
> **Belegt:** 2680 Tests grün (139 Dateien) · lint sauber · `check-seo.sh` 0 Fehler ·
> Build grün · Startdatei 63,39 von 65 kB · 18 Ansichten im Browser ohne React-Fehler.
> Jeder neue Wächter mit **Gegenprobe** belegt (eingeschmuggeltes ★ → rot).
>
> 🛑 **Vier Entscheide offen**, keiner davon in #258 gelöst: (1) `stipResultMarker`
> (`StipendienView.jsx:17`) trägt ✓ / ○ / ⓘ — für ○ «kein Anspruch» gibt es kein Piktogramm
> ohne Bedeutungswechsel, ✕ liest sich härter, **Ton-Entscheid**. (2) Toter
> Übersetzungs-Bestand `premiumCalc.check1..6` (6 × 5 Sprachen) und
> `firstChapterDone`/`firstFieldDone` (nur `rm`) — mit zwei Messgeräten als unbenutzt
> belegt, hier sind **nur die Glyphen** entfernt. (3) **Das Glossar ist faktisch
> deutschsprachig:** `GLOSSAR` führt deutsche Wortformen als Schlüssel, `GlossarText` sucht
> sie im *übersetzten* Text — über 40 Sätze gemessen: de 19 · en 6 · rm 2 · fr 0 · it 0.
> (4) Rätoromanisch gegenlesen lassen.
>
> 🛑 **Nicht belegt:** nichts davon ist deployt. Rätoromanisch ist durchweg ungeprüfte
> Übersetzung (`TODO(rm)`). Der `DatenLoeschen`-Dialog ist nicht live prüfbar.

> *Korrigiert am 21.09. ~01:30: hier stand `1d9127d`, «sieben» hiess «sechs», und «keine
> offenen PRs». Beides war beim Schreiben wahr und ist es seit dem Merge von #255 und dem
> Öffnen von #256 nicht mehr. Der alte Wortlaut ist nicht erhaltenswert, die Lehre schon:
> **eine Stand-Zeile, die am Merge vorbeigeschrieben wird, ist ab dem Merge falsch.***

> ### 🌍 Die Erklärseiten in fünf Sprachen — PR #256 (2026-09-21)
>
> 🛑 **Gemergt heisst hier NICHT sichtbar.** Öffentlich ist weiterhin nur Deutsch. Die vier
> Übersetzungen gehen mit, sind unter ihrer Adresse lesbar und bleiben für Suchmaschinen
> unsichtbar, bis ein Mensch sie gelesen und `freigegeben: true` gesetzt hat. Das ist der
> Zweck der Sperre unten — nicht ein Zwischenstand, sondern der gewollte Dauerzustand,
> solange niemand gegengelesen hat.
>
> Die fünf Seiten gab es nur auf Deutsch. **#256** ergänzt echte Sprachpfade:
> `/fr/…` `/it/…` `/en/…` `/rm/…`; Deutsch bleibt ohne Präfix, weil diese Adressen seit
> dem 20.09. in der Sitemap stehen und nicht wandern dürfen.
>
> 🛑 **Der Kern des PR ist nicht die Übersetzung, sondern eine Sperre.** Die vier neuen
> Sprachen sind rund 2900 Wörter über Schweizer Sozial- und Steuerrecht, **die kein Mensch
> gegengelesen hat**. Jede Sprache trägt darum ein Feld `freigegeben` in
> `scripts/seiten-sprachen.mjs`. `false` bedeutet **dreierlei zugleich**: die Seite trägt
> `noindex, follow` · sie steht **nicht** in der Sitemap · sie erscheint in **keinem**
> hreflang-Ring. Dazu ein sichtbarer Hinweis auf der Seite und **kein**
> «Inhaltlich geprüft»-Datum — das wäre die Behauptung einer Prüfung, die es nicht gab.
>
> **Freigeben ist eine Zeile** (`freigegeben: true` + `geprueft`), dann
> `node scripts/build-seiten.mjs`. Einen zweiten Ort gibt es bewusst nicht:
> `scripts/check-seo.sh` liest die Freigabe **aus der erzeugten Seite selbst**
> (`noindex` ja/nein), damit nichts auseinanderlaufen kann.
>
> **Entscheid Stebler Studios, 21.09.: «rumantsch im oktober».** `rm` ist damit nicht
> dasselbe wie `fr`/`it`/`en` — die drei warten auf eine Gegenlesung, die im September noch
> kommen kann, Rumantsch wartet bewusst. Festgehalten als Feld `vertagtAuf` in
> `seiten-sprachen.mjs`. 🛑 **Kein Rückstand, ein Entscheid.**
>
> **Quellen je Sprache, einzeln mit Gegenprobe geprüft:** Priminfo de/fr/it/en (gleicher
> Slug) · AHV-Merkblatt `.d/.f/.i/.e` · SKOS nur de/fr (mehr bietet der Umschalter dort
> nicht) · ESTV/BWO/BSV nur de · **Rumantsch: keine einzige**, der Bund publiziert das nicht
> auf Rumantsch. Fehlt die Sprachadresse, steht die deutsche **mit sichtbarem Vermerk**.
> 🛑 Der erste Versuch hatte die Slugs aus dem deutschen Pfad abgeleitet (`/fr/primes`): alle
> 404. Das misst die eigene Vermutung. **Eine fremde URL holt man aus der fremden Seite.**
>
> **Zweiter Commit in #256: die Startseite trug fünf tote hreflang-Zeilen** auf `?lang=…`.
> Der `canonical` in `index.html` steht **statisch** auf `/` und gilt auch für `?lang=fr` —
> Google folgt der Alternative, findet dort `canonical: /` und verwirft sie. Dieselbe Falle,
> die am 20.09. die Sitemap gekostet hat. Raus, samt alleinstehendem `x-default`.
> Der Wächter in `src/i18n/__tests__/i18n.test.js` wurde **nicht gelöscht, sondern
> umgedreht und an die Ursache gebunden**: solange der canonical statisch ist, darf dort
> kein hreflang stehen — wird er dynamisch, schlägt der Test an.
>
> 🛑 **Offener Entscheid, bewusst nicht mitgemacht:** `src/main.jsx:631` setzt `canonUrl`
> weiterhin auf `?lang=`. Der Code läuft heute nicht (er sitzt hinter dem Gate), bringt den
> Widerspruch aber zurück, sobald das Gate fällt. Gehört mit **K105** auf denselben Tisch.
>
> **Belegt auf dem Zweig:** 2648 Tests grün (137 Dateien) · lint sauber · `check-seo.sh`
> 0 Fehler / 0 Warnungen über alle 25 Seiten · **Bundle 64,96 kB von 65 — unverändert**,
> statische Seiten kosten am Startpfad null Bytes · der gegengelesene **deutsche Text ist
> unberührt**, `<main>` aller fünf Seiten zeichengleich gegen `origin/main` gemessen.
>
> ⚠️ **Der Vorschau-Server täuscht.** `vite preview` hat einen SPA-Rückfall: `/fr/…` gibt
> 200, ein erfundenes `/xy/…` **auch**. Dort ist ein Statuscode wertlos. Der echte Apache
> hat den Rückfall nicht (belegt: `wartung.html` 200 gegen erfundenen Pfad 404).

> ### 🔎 SEO: der Gate-Entscheid ist gefallen — sechs PRs gemergt, **nichts davon live** (2026-09-21, nachts)
>
> **Gemessen, nicht angenommen:** `main` = `1d9127d`. Live antwortet weiterhin
> `index-nd0WhuaA.js` mit **18 Wörtern** im Body, und alle fünf neuen Pfade liefern
> **HTTP 404** — Gegenprobe mit erfundenem Pfad ebenfalls 404, die Messung unterscheidet
> also. **Der Deploy steht aus und ist Stebler Studios' Schritt.**
>
> **Der Befund, der die Sitzung ausgelöst hat:** Das Beta-Gate sperrte **jeden** Crawler
> aus, auch Googlebot — `BetaGate` umschliesst die ganze App, und Google hat weder Code
> noch `localStorage`. Ein JS-loser Crawler sah **18 Wörter, und die waren eine
> Fehlermeldung**. Die sprachabhängige Kopf-SEO in `main.jsx` läuft nie, weil sie in
> `AppInner` sitzt, einem Kind von `BetaGate`; alle fünf `?lang=`-URLs lieferten
> byte-identisches Deutsch. Voller Befund mit Messprotokoll:
> `docs/audits/seo-audit-2026-09-20.md`.
>
> **Entscheid von Stebler Studios:** öffentliche Erklärseiten **vor** dem Gate, die App dahinter.
> Das Gate bleibt — es steht nur nicht mehr vor allem.
>
> 🛑 **Sechs Dinge, die die nächste Sitzung wissen muss:**
> 1. **Die fünf Seiten sind erzeugt, nicht von Hand geschrieben.** Quelle
>    `scripts/seiten-inhalt.mjs`, Generator `scripts/build-seiten.mjs` (`npm run seiten`,
>    `--pruefen`). Das Ergebnis ist **committet** — wer `public/<pfad>/index.html` von
>    Hand ändert, bricht den Test. **Auch `public/sitemap.xml` kommt von dort**; sie kann
>    nicht mehr von der Seitenliste abdriften (die Drift war dreimal passiert).
> 2. **Auf diesen Seiten stehen keine Zahlen** — keine Beträge, Fristen,
>    Einkommensgrenzen, Prozentsätze. Nicht aus Vorsicht: sie sind kantonal verschieden
>    und ändern jährlich, auf einer statischen Seite veralten sie unbemerkt. Ein Test
>    setzt das durch; das sichtbare Prüfdatum hat **eine benannte Ausnahme**, keine
>    weichere Regel.
> 3. **`check-seo.sh` prüft die fünf Seiten mit** und bricht den Deploy ab, wenn eine
>    fehlt oder nicht in der Sitemap steht. Erprobt, indem eine aus `dist/` entfernt wurde.
> 4. **Zwei Prüfer fanden zwei echte Sachfehler**, beide nicht auf den neuen Seiten,
>    sondern in der ausgelieferten App: «Wer EL bezieht, ist von den Prämien befreit»
>    (falsch — ELG Art. 10 Abs. 3 lit. d: Pauschalbetrag in Höhe der Durchschnittsprämie,
>    höchstens die tatsächliche) und «Die SKOS-Richtlinien **bestimmen** die Höhe»
>    (sie empfehlen). Behoben in allen fünf Sprachen, PR #254.
>    **Die Prüfer sind keine Formsache.**
> 5. **Drei Schritte hängen an Stebler Studios' Konto, nicht am Code:** das
>    GitHub-Website-Feld dieses Repos zeigt auf `ordnung-ruhe-neu.vercel.app` statt auf
>    malojaplana.ch (der stärkste Backlink der Marke, und er zeigt woandershin) · diese
>    Vercel-Adresse ist noch live (HTTP 200, älterer Build) · **Search Console ist nicht
>    eingerichtet** — ohne sie ist nicht messbar, ob Google die Seiten aufnimmt.
> 6. 🛑 **Offen, Entscheid:** Art. 3 Abs. 1 lit. s UWG verlangt eine **Kontaktadresse**.
>    Auf `/rechtliches/` stehen Name, Stadt und E-Mail, **keine Strasse** —
>    `docs/legal/impressum.md` hat dieselbe Lücke, neu ist nur, dass sie ab dem Deploy
>    öffentlich und indexierbar dasteht.
>
> **Nach dem Deploy zu prüfen** (sonst gilt es nicht): die fünf Pfade müssen 200 liefern,
> ein erfundener 404, die Startseite ~320 Wörter statt 18, und das Bundle darf nicht mehr
> `index-nd0WhuaA.js` heissen. Danach `bash scripts/indexnow-ping.sh`.

> ### 🌳 Der Lebensbaum ist räumlich — und live gegengeprüft (2026-09-20 abends)
>
> Auf dem Dashboard steht der Baum unter «Was aus Ihren Angaben wächst» jetzt dreidimensional:
> ein Ast je Kapitel, jede Frucht die Schweizer Sorte ihres Lebensbereichs, und jeder Ast reift
> mit dem Ausfüllstand **seines** Kapitels. **Räumlich ist der Standard**; wer auf flach stellt,
> bekommt die Wahl gemerkt (`or5_baumAnsicht`) und lädt three.js gar nicht erst. Ohne
> 3D-fähiges Gerät — und bei jedem Fehler im Szenenaufbau — erscheint der bisherige flache Baum.
>
> **Live belegt, nicht angenommen:** `index-nd0WhuaA.js` verweist auf **`Baum3D-KpQjzqKK.js`**,
> das mit **HTTP 200 / 144 490 Bytes** ausgeliefert wird; **Gegenprobe mit erfundenem
> Dateinamen → 404**. Der Schlüssel `or5_baumAnsicht` steht im Live-Bundle.
>
> 🛑 **Drei Dinge, die die nächste Sitzung wissen muss:**
> 1. **three.js ist die dritte Abhängigkeit überhaupt** (nach react/react-dom) und wird beim
>    Öffnen des Dashboards nachgeladen — rund 141 KB gzip, weil räumlich Standard ist.
> 2. **Die Startdatei hat kaum noch Luft:** 64,96 kB gegen die 65-kB-Grenze. Die nächste
>    Änderung an Code, der beim Start lädt, reisst `npm run size` in der CI. Die Grenze gehört
>    bewusst neu gesetzt, nicht beiläufig, wenn sie rot wird.
> 3. **Anspruchs-Ringe sind bewusst vertagt** (Oktober). Dabei gefunden und **noch offen**:
>    für ZH/BE/AG/SG rechnet ein nachgeladenes Kantonsmodul; solange es lädt, liefert
>    `calculateIPV` `anspruchMoeglich: kkPremium > 0` — der Ring am **flachen** Baum blitzt also
>    heute auf, ohne dass ein Anspruch gedeckt ist. Das widerspricht dem Guardrail in
>    `data/anspruchSignale.js` («Nie ein Ring ohne gedeckten Anspruch»). Eigener PR nötig.
>
> Herleitung, Messwerte und elf Runden Messfehler: `docs/MESSUNG-baum-3d-2026-09-20.md`.

> ### ✅ DER DEPLOY-RIEGEL IST WEG (20.09.2026, 16:33)
>
> Kurzzeitig stand hier eine Warnung: `main` trug 0.1.38-beta **mit** einem Rechenfehler in
> Zürich — der Deckel nach § 4 Abs. 3 EG KVG entfiel mit Kindern ganz
> (`const deckel = !gruppe ? praemie : Infinity;`). Nachgerechnet (Region 1, Einkommen 0,
> Prämie 300/Mt., ein Kind): der erwachsenen Person wurden **5'428** angerechnet, obwohl ihre
> Prämie **3'600** beträgt — rund **1'776 Franken zu viel im Jahr**.
>
> **PR #242 hat das behoben**, gegen `main` nachgerechnet: **4'894** statt 6'670, ohne Kind
> unverändert 3'600. Die fehlerhafte Zeile kam mit `c08fa4f` (19.09.), war **nie live** und
> ist jetzt weg. **0.1.38-beta ist damit deploybar.**
>
> 🛑 **Die Lehre, die bleibt:** Der Fehler überlebte einen Umbau, der sein Nicht-Verändern
> über 78'995 Eingabe-Kombinationen **belegte** — und bekam dabei einen Kommentar, der ihn
> begründete, als wäre er ein Entscheid. *Zeichengleich heisst «nichts verändert», nie
> «geprüft».* Beim nächsten Umbau: den Fachprüfer auf **alle berührten** Kantone ansetzen,
> nicht nur auf den neuen.

> ### ⭐ AKTUALISIERUNG 2026-09-20 (K31: fünf Kantone + gemeinsamer Rahmen, 0.1.38-beta bereit)
>
> **Gemergt (7 PRs):** #234 Doku 0.1.37 · #235 Vite 4.5 → 7.3.6 · #236 ZH · #239 BE + AG
> (Nachtrag, siehe unten) · #240 Rahmen + SG · #241 Release 0.1.38-beta.
> **Nicht deployt.** `deploy.sh` von `main` ist Stebler Studios' Schritt.
>
> **K31 — fünf Kantone rechnen nach ihrem eigenen amtlichen Modell:**
> ZH (Eigenanteil 8,4/10,5 %) · BE (Stufentabelle) · AG (Richtprämie − 17,5 %) · SG
> (Belastungsgrenze, steigt mit dem Einkommen) auf `main`; **VD fertig auf
> `feat/k31-ipv-vd`, bewusst ohne PR**, bis das OVAM die Formeln bestätigt.
> Neu `src/config/kantonsModell.js` — der gemeinsame Rahmen: fünf Regeln, die bei 26 Kantonen
> 130 Kopien geworden wären, liegen an einer Stelle. Neu `scripts/ipv-abdruck.mjs`: zeichnet
> das Rechen-Verhalten über 78'995 Eingabe-Kombinationen auf, als Beleg für
> verhaltensgleiche Umbauten.
>
> **Der Fehler, der die Runde prägte:** Ohne erfasste Krankenkassenprämie fiel der gesetzliche
> Deckel still weg — die App zeigte die Obergrenze statt des Anspruchs (in AG gemessen bis
> 40 % zu viel). Betraf **alle vier** Kantone mit Deckel; VD fiel zuerst durchs Raster, weil
> sein Zweig in keinem PR lag. 🛑 **SG ist der Gegenfall: dort gibt es gar keinen Deckel**
> (weder sGS 331.538 noch 331.111 kennen einen) — darum die benannte Konstante
> `KEIN_PRAEMIENDECKEL`, damit das Auslassen als Entscheid lesbar ist.
>
> **Offene Fragen an vier Ämter:** `docs/sources/FRAGEN-AN-DIE-AEMTER.md`, fünf Punkte
> (SVA ZH · ASV BE · OVAM VD · SVA AG · SVA SG).
>
> 🛑 **Zwei Merge-Fallen, die diesen Tag gekostet haben:**
> 1. **Gestapelte PRs hängen nicht von selbst um.** #237 und #238 landeten in ihren
>    Basis-Zweigen statt auf `main`; nur ZH war da. GitHub hängt erst um, wenn der Basis-Zweig
>    **beim Mergen gelöscht** wird. Repariert mit #239. Seither: **flache PRs auf `main`**,
>    und nach jedem Merge an der Quelle nachmessen (`git cat-file -e origin/main:<datei>`),
>    nicht dem «merged»-Häkchen glauben.
> 2. **Ein verhaltensgleicher Umbau beweist nicht, dass das Verhalten richtig war.** Der
>    Abdruck belegte, dass #240 nichts änderte — der ZH-Deckelfehler war da längst drin und
>    bekam beim Umbau sogar einen erklärenden Kommentar. Siehe #242.

> ### ⭐ AKTUALISIERUNG 2026-09-19 (0.1.37-beta live)
>
> **Deploy 19.09.** aus `335a557` (#230–#233), per `curl` belegt: 164/164 Build-Dateien 200, altes `index-c80eed98.js` 404, erfundener Name 404, `index.html`/`sw.js`/`theme-init.js` zeichengleich mit dem Build, `sw.js` Cache `maloja-plana-fc8ee6ec`, Header HSTS/CSP/Permissions unverändert. Live im Browser (Beispiel): Footer v0.1.37-beta, UR «gilt für HSK», TI «Gesetzessammlung», Konsole leer; Beispiel verlassen → `/`, localStorage leer.
> **Inhalt:** Entscheid-Block 19.09. (K81/K83/K100/K105 → Oktober, K82/K96/K99/K101/K106 gebaut) + K86–K98, K102, K103 + Herzensempfehlung utopi. Deploy-Gate 6 Prüfer je 0 🔴. Details: CHANGELOG `[0.1.37-beta]`, Bau-Liste §24.
> **Offen:** K107–K115 (Bau-Liste §24), Oktober-Kasten im Studio-Fahrplan. Push-Regel bis 30.09.: Claude darf Arbeitszweige + Entwurfs-PRs pushen; Merge/Deploy = Stebler Studios.

> ### ⭐ AKTUALISIERUNG 2026-09-17, 16:37 (0.1.36-beta live)
>
> **Deploy 16:32** aus `6546358` (#224 K91–K93, #226 K80, #227 Release mit Gate-Korrekturen), per `curl` belegt
> (164/164, alt 404, Gegenprobe 404, vier Kerndateien zeichengleich) und im Browser (Beispiel, Notfall-QR mit jsQR gelesen).
> **K80 war grösser als gedacht:** die eingebettete QR-Bibliothek kodierte ab dem ersten Umlaut falsch (B-4). Deploy-Gate
> mit sechs Prüfern, 0 Blocker; übernommen: Weiterfüllen + Fehlend-Zeile, Medizin zuerst (Entscheid), kein Klartext-Tooltip,
> Emoji, ehrlicher QR-Hinweis. Deploy-Wächter in `.claude/settings.json` (lokal, nicht in git) zeigte auf den falschen Ordner → korrigiert.
> **Als Nächstes:** K86–K98, K31. **Entscheide offen:** K81–K83, K96, K99; neu: «Noch nicht»-Antworten im Notfall-QR weglassen?
> Hinweis «für alle lesbar» auch bei KK- und Organspende-QR? Beta-Zugangscode im Klartext in einer Doku-Datei (K105)? **Oktober:** E42, E1, E3, K62 Punkte 1/3/5, Jurist:in, Studio-Livegang.

> ### ⭐ ABSCHLUSS 2026-09-17, 15:10 (Sitzung «Entscheid-Runde bis Oktober, 0.1.35»)
>
> **Entschieden (Auswahl-Dialog):** E40, E41, K45 (alle drei), K58-Ladehinweis, K62 nur 2+4 (1/3/5 Oktober),
> E1/E3 Oktober, Studio-Website `noindex` bis Oktober, Morgenlauf-Restregeln «nächste Woche» (Bau-Liste §21).
> **Live:** 0.1.35-beta (#219–#222). **Header komplett** inkl. O20 (Jahres-Cache `/assets/` + `/fonts/`).
> **Gemergt, nicht live:** #224 K91–K93 (Fussnote ohne «amtlich», SZ mit beiden Werten, Disclaimer im
> Behörden-JSON) → mit dem nächsten Paket deployen (vorher Version anheben + Gate + Marke).
> **Nächste Sitzung beginnt mit:** K80 (🔴 QR im Notfall-Dossier bei langen Angaben) → dann K86–K90, K94.
> **Entscheide offen:** K81 Notfallkontakt Grundordnung · K82 0 in Währungsfeldern · K83 Bundessteuer bei
> verheiratet+direkt · K96 Capacitor. **Hand Stebler Studios:** K85 `no-cache` Einstieg (Server-`.htaccess`).
> **Oktober:** E42, E1, E3, K62 Punkte 1/3/5, K99 Individualbesteuerung, Jurist:in (K48), Gegenlesen fr/it/rm.

> ### ⭐ AKTUALISIERUNG 2026-09-17, 14:45 (0.1.35-beta live)
>
> **Deploy 14:35** aus `cb29a33` (#219–#222: K58-Ladehinweis, E40, E41, K45, K62.2/.4), per `curl` belegt
> (164/164, alt 404, Gegenprobe 404) und im Browser (Beispiel, KVG-Quellen, Konsole leer). **O20 ✅** Jahres-Cache
> für `/assets/` + `/fonts/` aus der Server-`.htaccess`. Vorab-Prüfung (Sicherheit ganze App, Qualität, Recht/Copy,
> Swiss Precision, Links, a11y): 0 Blocker.
> **Als Nächstes (kleiner PR, 0.1.36):** Fussnote `kvg.tpwNote` ohne «amtlich» für OW/NW/SZ · SZ 0.85 nur
> tarifsuisse · Disclaimer im Behörden-JSON (Bau-Liste §22). Dann K80, K86–K90.
> **Entscheide offen:** K81–K83. **Oktober:** E42, E1, E3, K62 Punkte 1/3/5, Jurist:in, Studio-Livegang.

> ### ⭐ ABSCHLUSS 2026-09-17, 14:45 (Sitzung «Oktober-Fokus: Runden 5–9, Header-Durchgang»)
>
> **Heute live gegangen:** 0.1.29 → 0.1.34 (sechs Deploys), zuletzt #211–#216.
> **Header, alle aus der Server-`.htaccess`:** Standort, HSTS 1 Jahr, http→https, www→Hauptadresse, CSP-Header
> mit `frame-ancestors` — alle ✅ gemessen; CSP-Prüfbatterie im Browser 0 Verletzungen (Bau-Liste §20).
> **Nächste Sitzung beginnt mit:** K80 (🔴 QR im Notfall-Dossier fehlt bei langen Angaben) → Release →
> Deploy; parallel O20 Cache-Control (Server, Stebler Studios) nachmessen.
> **Oktober:** E42 (Pensum/Teilzeit-Pauschale), E1, E3, Jurist:in (K48 + E43), IDEEN §14 (Speicherorte, Karten).
> **Gegenlesen offen:** fr/it/rm (K69/K70).

> ### ⭐ AKTUALISIERUNG 2026-09-17, 13:40 (0.1.34-beta live)
>
> **Deploy 13:25** aus `a414f86` (#214–#216), per `curl` belegt (164/164, alt 404, Gegenprobe 404,
> Backup 177). **Demo-Fehler behoben** und live im Browser geprüft. **Header:** M15 (`geolocation=(self)`)
> und HSTS 31536000 live, aus der Server-`.htaccess` (Stebler Studios; `deploy.sh` lässt sie unberührt).
> **Offen im Header-Durchgang:** CSP-Header (O8/K72) · Cache (O20) · `http://` leitet nicht auf https
> weiter, `www.` nicht auf die Hauptadresse (Panel). **Oktober:** E42, E1, E3, Jurist:in (K48 + E43).

> ### ⭐ AKTUALISIERUNG 2026-09-17, 12:50 (0.1.33-beta live)
>
> **Deploy 12:42** aus `db75d59` (#211 + #212), per `curl` belegt: `index-606d23bb.js`, 164/164 Dateien 200,
> altes Bundle 404, zwei Gegenproben 404, `sw.js` mit Cache `maloja-plana-606d23bb`, Tag auch auf origin,
> Backup 173 Dateien. Merkmale von K46, K55, K56, K74 im Live-Code.
> **Inhalt:** K46 Sie-Ansicht durchgehend · K58 Rückfall Deutsch · K55 offline-fähig · K56 Lizenzen ·
> K57 Doku · K67/K68/K71. Vorab-Prüfung für #212: Sprache, Recht, Qualität, je 0 Blocker (#211 ohne Batterie).
> **M4 erledigt** (Postfach `info@` funktioniert laut Stebler Studios) → alle 12 MUSS erledigt.
> **Offen:** Panel-Durchgang · E42, E43 · Bau-Liste §17 (K73, K75–K78) · Gegenlesen K69/K70.

> ### ⭐ AKTUALISIERUNG 2026-09-17, 12:00 (0.1.32-beta live)
>
> **Deploy 11:46** aus `1437feb` (#208 = #204–#207 zusammengeführt + Befund-Fixes), per `curl` belegt:
> `index-297034b6.js`, 161/161 Dateien 200, altes Bundle 404, Gegenprobe 404, Tag auch auf origin,
> Backup 171 Dateien. Merkmale von K49, K60, K61, K64, K65 im Live-Code (Gegenprobe 0).
> **Vorab-Prüfung:** 9 Prüfer, 0 Blocker; K61 in #208 vervollständigt. Bericht in den Studio-Übergaben.
> **Offen:** Bau-Liste §16 (K67–K72, E40, E41) · M4 Postfach · Panel-Durchgang (jetzt inkl. K72).
> **Hauptbundle-Reserve nur noch 2.4 kB** (K67).

> ### ⭐ AKTUALISIERUNG 2026-09-17, 11:25 (0.1.31-beta live, K59)
>
> **K59 gemessen:** Mit 0.1.30-beta blieb die App nach dem ersten Besuch offline leer: Haupt-Skript,
> CSS und Sprache lagen nie im Cache. Lokal mit `vite preview` belegt (Server gestoppt, Neuladen → `#root` leer).
> **#200** behebt das (Install legt die Assets der Startseite ab, die Seite meldet schon Geladenes,
> `ignoreVary`, Startseiten-Ersatz nur für Seitenaufrufe). Danach, ebenfalls lokal: Server gestoppt,
> Neuladen → Startseite erscheint. Sicherheits-Prüfer: 0 Blocker; unbekannte `/assets/` liefern live 404.
> **Deploy 11:14** aus `672d8af` (#201 hob die Version), per `curl` belegt: `index-c2f8af36.js`,
> 159/159, altes Bundle 404, Gegenprobe 404. Live im Browser (Beispiel-Modus): 18 Cache-Einträge inkl. Einstieg.
> **Merker:** Vor jedem Deploy prüfen, ob die Version in `package.json` schon getaggt ist (heute zweimal gefehlt).

> ### ⭐ AKTUALISIERUNG 2026-09-17, 11:10 (0.1.30-beta live)
>
> **Deploy 10:55** von `main` = `b20cd0b` (Hand von Stebler Studios), Tag `v0.1.30-beta` vom Lauf
> gesetzt (auch auf origin). Per `curl` belegt: `index-98d2d140.js` = lokaler Build, **alle 159
> Build-Dateien live 200**, altes `index-91c30770.js` → 404, erfundener Name → 404, `0.1.30-beta`
> im Bundle, Sitemap `lastmod` 2026-09-17. Merkmale von #186–#198 im ausgelieferten Code (Gegenprobe 0).
> Backup `20260917-105542` = 171 Dateien.
> **Vor dem Deploy:** Prüf-Batterie 9/9 über `2fcf409..0b467da`, ein Blocker (Version nicht angehoben),
> behoben in #198 zusammen mit der Löschweg-Frist (4 Prüfer). Gate auf `b20cd0b` erneut grün, Marke geschrieben.
> Die ⚠️/💡 stehen in der Bau-Liste §15.
> **Live unverändert aus dem Panel:** HSTS `16000000`, `geolocation=()`, kein `cache-control`, kein CSP-Header
> → Panel-Durchgang (O20 · HSTS · M15 · O8) weiter bei Stebler Studios, danach PageSpeed neu.
> **Offen:** M4 Postfach `info@` · Bau-Liste §13–§15 (K49–K66).

> ### ⭐ AKTUALISIERUNG 2026-09-17, 02:10 (PageSpeed-Befund, #191 gemergt, nicht live)
>
> **Anlass:** PageSpeed Insights 16.09. 18:30 für `https://malojaplana.ch/` (Mobil): Leistung 98 ·
> Barrierefreiheit 100 · Best Practices 96 · SEO 100. **#191** (`c7f1282`, Merge `da7c5c3`):
> `frame-ancestors 'none'` aus der Meta-CSP in `index.html` entfernt (wirkte dort nie, Konsolenfehler);
> Clickjacking-Schutz bleibt der Panel-Header `X-Frame-Options: SAMEORIGIN`. Doku nachgeführt
> (SECURITY, Checkliste, DSFA-Kurzfassung, SECURITY_ARCHITECTURE), Bau-Liste O8 ergänzt, **O20 neu**.
> **Geprüft:** vitest 1750/1750, Build ok, `dist/` lokal ohne Konsolenfehler; Gegenprobe (Direktive per
> JS eingefügt) erzeugt genau den Lighthouse-Fehler. **Live noch mit Direktive** (`curl` 02:08: 1 Treffer,
> Bundle `index-91c30770.js`) — kommt mit dem nächsten Deploy.
> **Befund:** Cache-Control für `/assets/` und `/fonts/` fehlt live (252 KiB). Geht **nicht** über
> `public/.htaccess`: `deploy.sh` löscht sie (Infomaniak liefert sonst 503). Alle Live-Header kommen
> aus dem Infomaniak-Panel → daher auch die Abweichung `geolocation=(self)` (Repo) vs `()` (live).
> **Panel-Durchgang für Stebler Studios:** O20 (Cache `/assets/`+`/fonts/` 1 Jahr `immutable`, nicht
> für `index.html`/`sw.js`/`theme-init.js`) · HSTS auf `31536000` · M15 `geolocation=(self)` · O8 CSP-Header
> mit `frame-ancestors 'none'`. Nach dem Deploy PageSpeed neu laufen lassen (Erwartung: Best Practices ↑).
> **Datenschutz:** Indexierung/Search Console verlangt keine Änderung der Datenschutzerklärung (keine
> Cookies, CSP self-only, localStorage und Server-Logs sind genannt). Kleine Präzisierung angeboten,
> nicht umgesetzt: «Eingaben werden nie an einen Server übertragen» statt «keine Daten».

> ### ⭐ AKTUALISIERUNG 2026-09-17, früh (0.1.29-beta live, R4 gemergt)
>
> **Deploy 01:46** von `main` = `2fcf409` (Hand von Stebler Studios), Tag `v0.1.29-beta` vom Lauf
> gesetzt. Per `curl` belegt: `index-91c30770.js` = lokaler Build, **alle 159 Build-Dateien live 200**,
> altes `index-2301b4b1.js` → 404, erfundener Name → 404, `0.1.29-beta` im Bundle, Teil
> `kantonaleSteuerdaten-41e98bdc.js` 200, Merkmale von #173–#185 im ausgelieferten Code (Gegenprobe 0).
> Backup `20260917-014608` = 165 Dateien. Sitemap-`lastmod` weiter 2026-09-14.
> **Live damit:** #161–#170 (Nachmittag 16.09.) und #172–#185 (Abend): Kantonssteuer als ESTV-Tabelle,
> Bundessteuer mit ESTV-steuerbarem Einkommen, IPV ohne Beleg ohne Betrag, Vermögensfreibetrag je
> Kanton, Sicherung verschlüsselt als Voreinstellung, Löschweg, «trifft nicht zu», Hauptbundle 61 kB.
> **Vor dem Deploy:** Prüf-Batterie 9/9 über `2aaeff5..0c9cc43`, kein Blocker; Befunde in #185
> (darunter: `pii-scan.sh` verdeckte Namen in Zeilen mit «Stebler Studios» — behoben).
> **Danach gemergt, nicht live:** #186 (R4 Hinweise/Robustheit), #187 (R4 Steuer-Annahmen).
> **Danach auch gemergt:** #188 («öffnet in neuem Tab», fr/it Sie/Du in `legal.*`) und #189 (diese Doku). **Nächster Deploy** bringt #186–#188. **Offen:** Bau-Liste §13 (K49–K53) und §12.
> Merker: der Haupt-Checkout liegt unter `~/Claude/Projects/maloja plana/maloja-frontend`
> (nicht mehr `~/Projects`).

> ### ⭐ AKTUALISIERUNG 2026-09-16, 18:00 (Entscheid-Runde gemergt, Deploy gestoppt)
>
> **Gemergt seit 12:23:** #161 IPV-Belege je Kanton · #162 Voll-Review-Rest · #163 CSV-Formelschutz
> (E14) · #164 Rechts-Doku an den Code (K28) · #165 Steuerkanton (B-2/E23) · #166 Freibetrags-Belege ·
> #167 + #168 Prämienverbilligung ohne Beleg ohne Betrag (E9) und Schnellcheck-Übergabe (B-1/E22) ·
> #169 + #170 Vermögensfreibetrag je Kanton.
> **Deploy 17:45:** `dist/` wurde gebaut (`index-3b23d185.js`), danach kein neues Backup und keine
> Änderung live — Signatur des Tors «Rollback-Backup fehlgeschlagen» (`deploy.sh` ab Z. 150: der
> leere Backup-Ordner wird gelöscht, `.deploy-backups/` trägt den Zeitstempel 17:45). Die genaue
> Meldung stand im Terminal von Stebler Studios und ist nicht belegt. **Nächster Schritt:** nach dem
> Merge dieses PRs `git pull`, `bash deploy.sh` erneut; bei erneutem Abbruch die Meldung sichern
> (Login · Netz · Zeitüberschreitung). `DEPLOY_OHNE_BACKUP=1` nur bewusst.
> **Nach dem Deploy:** Bundle-Hash prüfen, die neuen Zeilen in `FEATURES.md` auf `deployed`,
> B-1 und B-2 in `BUGS.md` nach «Zuletzt behoben», Tag `v0.1.29-beta` prüfen.
> **Gerettet:** §8.7 der Bau-Liste (Teil 7, O15–O19) lag nur auf dem Zweig
> `docs/bauliste-8b-audit-teil-1-6` (Commit nach dem Merge von #143) und kommt mit diesem PR nach `main`.
> Seine beiden Entscheide heissen dort jetzt **E32/E33** (auf dem Zweig E20/E21); §9 behält E20/E21,
> weil Stebler Studios am 16.09. auf §9-E20 geantwortet hat.
> **Entscheide vom 16.09. abends** (E10, E17, E18, §9-E20, E27–E30, K13, E3) stehen in Bau-Liste §10.
> **Offen und Oktober:** Bau-Liste §10.

> ### ⭐ AKTUALISIERUNG 2026-09-16, 12:30 (0.1.28-beta live)
>
> `bash deploy.sh` von `main` (`2aaeff5`) um **12:23**, Hand von Stebler Studios; der Lauf hat das
> Tag `v0.1.28-beta` selbst gesetzt. Per `curl` 12:25 belegt: `index-2301b4b1.js` = lokaler Build,
> alle 118 Dateien live 200, `index.html` · `theme-init.js` · `sw.js` · `sitemap.xml`
> prüfsummengleich, altes Bundle `index-f4a79e77.js` → 404, erfundener Name → 404, `0.1.28-beta`
> im Bundle. Merkmale von K20 und K22 in den ausgelieferten Teilen gefunden. Backup
> `20260916-122343` = 165 Dateien. **Nicht im Browser geprüft:** der Browser-Tab hielt die echte
> Sitzung von Stebler Studios; dort wird nichts angeklickt. Die Sichtproben mit Zugangscode
> (K3, K5, K12, K20, K24) bleiben bei Stebler Studios. B-3 steht jetzt unter «Zuletzt behoben».

> ### ⭐ AKTUALISIERUNG 2026-09-16, 12:10 (K20 – K25 gemergt, nicht deployt)
>
> Fünf PRs, alle mit grüner CI: **#153** «ZIP» aus der Doku (K21) · **#154** Rundung und
> Erhebungsgrenze der Bundessteuer (K23) · **#155** Export-Vorschau vor sechs weiteren Ausgaben
> (K20) · **#156** Beispiel-Modus traf echte Dokumente, Bug B-3 in `BUGS.md`, dazu die leisere
> Demo (K24, K25) · **#157** Tardoc 2026 für 14 weitere Kantone (K22).
> Vier Agenten waren zwischendurch am Nutzungslimit abgebrochen; ihre angefangene Arbeit lag
> unkommittiert in den Arbeitskopien und wurde weitergebaut, nichts verworfen.
> **Vor dem Deploy:** `git pull` im Haupt-Checkout. **Nach dem Deploy:** die neuen Zeilen in
> `FEATURES.md` per Bundle-Hash prüfen, Tag `v0.1.28-beta` setzen, B-3 in `BUGS.md` nach «Zuletzt
> behoben» schieben. Offene Entscheide: Bau-Liste §9, neu E28 – E31.

> ### ⭐ AKTUALISIERUNG 2026-09-15, 23:30 (K-Runde live)
>
> `bash deploy.sh` von `main` (`f482576`) um **23:25**, Hand von Stebler Studios. Per `curl` belegt:
> `index-f4a79e77.js` = lokaler Build, alle 118 Dateien aus `dist/assets` live 200, `index.html` ·
> `theme-init.js` · `sw.js` · `sitemap.xml` prüfsummengleich, altes Bundle `index-4a2ca1ae.js` → 404,
> erfundener Name → 404. Merkmale je K-Punkt in den ausgelieferten Dateien gefunden (BFS-Link,
> VVG 35a, Vorschau-Titel, Demo-Knopf, Elterntarif, Generika 40 %, Tardoc ZH .91 / BE .86); «ZIP-Datei»
> kommt im deutschen Sprach-Teil nicht mehr vor. Backup `20260915-232551` = 162 Dateien, 116 in `assets/`.
> **Offen:** eigene Versionsnummer für diesen Stand (0.1.28-beta, Release-PR + Tag), Entscheide der
> Bau-Liste §9.

> ### ⭐ AKTUALISIERUNG 2026-09-15 spätabends (K-Runde gemergt, nicht deployt)
>
> Acht K-Gruppen parallel in eigenen Arbeitskopien gebaut, je ein PR mit grüner CI: #142 (K4, K15)
> · #144 (K12 Elterntarif) · #145 (K3, K17) · #146 (K5, K6, K16, **offen**) · #147 (K1, K2) ·
> #148 (K14 Datenquellen 2026) · #149 (K9 – K11) · #150 (K7 Demo). Dazu aus einer anderen Sitzung
> #141 und #143 (Fremd-Audit, Bau-Liste §8). Stand je Punkt und die neuen Fragen E20 – E27:
> Bau-Liste §9.
> **Vor dem nächsten Deploy:** #146 mergen, dann `git pull` im Haupt-Checkout. **Nach dem Deploy:**
> die K-Zeilen in `FEATURES.md` per Bundle-Hash auf `verified-live`, Klick-Proben für die
> Export-Vorschau (K3) und die Demo (K7), Blick hell und dunkel auf die Icons (K5).

> ### ⭐ AKTUALISIERUNG 2026-09-15 spätabends (Deploy 0.1.27-beta gelandet)
>
> `bash deploy.sh` von `main` (`f368fbb`) um **22:14**, Hand von Stebler Studios. Per `curl` 22:20
> belegt: `index-4a2ca1ae.js` 200 und gleich wie `dist/`, `0.1.27-beta` im Bundle, `index-2d6da893.js`
> → 404, erfundener Name → 404, Sitemap 200. Damit sind **#133 · #134 · #135 · #136** live; ihre
> Zeilen in `FEATURES.md` stehen auf `verified-live`. Tag `v0.1.27-beta` zeigt auf `f368fbb` und
> liegt auf origin (`RELEASE.md` Schritt 6 erledigt). Bau-Liste §7: M3 · M10 · M14 erledigt.
> **Offen aus der Bau-Liste:** M4 (Postfach `info@`, Hand), M13/E9 (IPV-Beträge), M15 (Panel:
> `Permissions-Policy`), K1–K7 · K9–K17, Entscheide E1 · E3 · E9–E12.

> **Merke zur Stand-Zeile:** Wer sie am Sitzungs-Ende via PR nachzieht, verschiebt `main` mit
> dem eigenen Merge erneut — die Zeile ist also im Moment des Mergens schon eine Kommastelle
> alt. Das ist normal und kein Fehler. Verlässlich ist die Aussage „`main` = Stand nach PR #N";
> der exakte Hash gehört immer per `git fetch && git log --oneline -1 origin/main` gegengeprüft,
> nie aus dieser Datei abgeschrieben.

> ### ⭐ AKTUALISIERUNG 2026-09-15 abends (Bau-Liste M1–M12, Voll-Review Stufe L, acht PRs gemergt — nicht deployt)
>
> **`main`: `531332b` → `2be5338`.** Acht PRs, alle mit grüner CI, gemergt von Stebler Studios:
> **#131** Q3-Wartungsprotokoll · **#132** Bau-Liste `docs/BAULISTE-2026-09-30.md`, Bug-Eingang in
> `BUGS.md`, wageClaim-Zettel, DSFA-Entwurf · **#133** Backup-Restore-Härtung · **#134** Fixes aus dem
> Voll-Review (OR 266l, ruhige Schulden-Copy, ALV Sie/Du, Kontrast, Brief-Escape, FileReader,
> CI-permissions, Datenschutz-Texte, petition.ch) · **#135** Glyphen → Icons, erste Hälfte · **#136**
> AHV-Aufschub nach Art. 55ter AHVV + Referenzalter-Platzhalter · **#137** Befund-Liste
> `docs/audits/voll-review-L-2026-09-15.md`, Bau-Liste §7, Vornamen aus Repo-Doku entfernt ·
> **#138** Rechts- und Security-Doku auf Code-Stand.
>
> **Nicht live.** Live liefert weiter `index-2d6da893.js`. Der nächste Deploy bringt die
> App-Änderungen aus #133–#136; danach die vier `built`-Zeilen in `FEATURES.md` auf `verified-live`
> (Bundle-Hash gegen frischen Build) und das Tag `v0.1.27-beta` setzen.
>
> **Vor dem Deploy:** `git pull` im Haupt-Checkout (steht lokal noch auf `4b922ac`) · `/maloja-predeploy`
> für den neuen HEAD · `bash scripts/pii-scan.sh` mit lokaler Deny-Liste — erwartet 0 Treffer, seit
> #137 belegt. Ohne #137 hätte das PII-Gate in `deploy.sh` angehalten.
>
> **Voll-Review Stufe L:** 11 🔴 · 30 ⚠️ · 22 💡; 10 der 11 🔴 behoben und gemergt. **Offen:**
> `CANTONAL_IPV` ist mustergeneriert und zeigt trotzdem «Berechtigt» und einen CHF-Betrag →
> Entscheid E9 (Bau-Liste M13).
>
> **Offen bei Stebler Studios** (Bau-Liste §7): Deploy · Postfach `info@` + Testmail (M4) ·
> Infomaniak-Panel `geolocation=(self)` für die Notfall-Vorlesekarte (M15) · Analytics-Zeile für
> Issue #123 · Entscheide E1 und E9–E12.
>
> ⚠️ Zwei Merker aus der Sitzung: Force-Push ist per `.claude/settings.json` gesperrt — bei einem
> Rebase-Konflikt auf einem gepushten PR-Zweig `merge origin/main` statt Rebase. `npm ci` scheitert
> in der CI am Lockfile (esbuild-0.28-Plattformpakete fehlen) → erst Lockfile erneuern (Bau-Liste K15).

> ### ⭐ AKTUALISIERUNG 2026-09-15 (Branch-Wald leer, Aufräumen gemergt, Sitemap nachgezogen)
>
> **`main`: `aee402e` → `0cc8e80`.** Zwei PRs: **#127** (Stand-Doku 14.09.) und **#128**
> (`fix/deploy-assets-aufraeumen`: `deploy.sh` spiegelt nach dem Upload ein zweites Mal nur
> `assets/` mit `--delete`, nicht-fatal, im Stage-Modus übersprungen; dazu
> `scripts/aufraeumen-trockenlauf.sh`). Alle sechs Zweige gelöscht, jeder per `merge-base` als
> in `main` enthalten belegt, Gegenprobe vorher mit dem damals offenen Zweig. **Kein offener
> Feature-Branch mehr, keine offenen PRs.**
>
> **Trockenlauf gegen die Produktion, 15.09.** (Stebler Studios, `mirror --delete --dry-run`
> auf `assets/`): würde **5535 verwaiste Dateien entfernen** und **115 aktuelle ersetzen**,
> lftp-Summe `Removed: 5535 files`, `Modified: 115 files`, kein aktuelles File in der
> Löschliste; Gegenproben: Juli-Bundle `index-1fb26e10.js` drin, aktuelles `index-2d6da893.js`
> nicht. **Erster echter Lauf: Deploy 15.09. 15:52 aus `0cc8e80`** (Stebler Studios, noch vor
> dem Merge dieses PRs). Belegt per `curl` 16:05: die drei Stichproben aus der Löschliste
> (`index-1fb26e10.js` Juli-Bundle, `index-2340fe54.js` August-Bundle, `AblaufSchale-00e61fd0.js`)
> → **404**, aktuelles `index-2d6da893.js` → 200, erfundener Name → 404. Das Backup
> `20260915-155206` (5696 Dateien, 5650 in `assets/`) ist der letzte Stand vor dem Aufräumen;
> das nächste Backup sollte ~150 Dateien spiegeln, in Sekunden statt in vier Minuten.
>
> **`public/sitemap.xml`: `lastmod` 2026-08-13 → 2026-09-14** (Datum des letzten
> App-Deploys, in diesem PR). Ist erst live, wenn deployt. Danach einmal
> `bash scripts/indexnow-ping.sh` — ob der Ping nach dem 14.09.-Deploy lief, ist nicht belegt.
>
> ⚠️ Zwei Messfehler aus dem Trockenlauf, damit sie nicht wiederkommen: (1) die erste
> Skript-Fassung zählte lftp-Meldungen UND Befehlszeilen → 11185 statt 5535; jetzt zählt sie
> `rm`/`get -e` und gleicht gegen lftps eigene Summe ab. (2) «würde senden 0» war die falsche
> Erwartung — lftp ersetzt aktuelle Files mit neuerem mtime, der normale Upload tut dasselbe.

> ### ⭐ AKTUALISIERUNG 2026-09-14 (Deploy gelandet — vier PRs live, `mergen ≠ live` geschlossen)
>
> **`main`: `575c40d` → `aee402e`.** Fünf PRs an einem Tag: **#122** (Stand-Doku nach #121),
> **#124** (`sitemap.xml` `lastmod` 07-09 → 08-13 + IndexNow-Schlüsseldatei + `scripts/indexnow-ping.sh`),
> **#125** (`src/crypto/README.md`, Vault-Entscheid vom 24.08. festgehalten), **#126** (`deploy.sh`:
> das Rollback-Backup ist jetzt ein **Gate** — lftp-Fehler oder leerer Backup-Ordner brechen ab;
> Ausweg nur ausdrücklich per `DEPLOY_OHNE_BACKUP=1`; `RELEASE.md` beschreibt es). Alle gemergt,
> Arbeitsbaum sauber, keine offenen PRs.
>
> **Deployt, 14.09. 18:32 (Zürich), aus `6b17e6b`** (= Stand nach #125). Live liefert seit
> **14.09. 16:32:12 GMT** `index-2d6da893.js` / `index-6b0b5577.css` (HTTP 200), byte-gleich mit
> dem lokalen `dist`; Sicherung `.deploy-backups/20260914-183209`. Gegenprobe: erfundener
> Bundle-Name → 404. **Damit live: #120 (steuerbares Einkommen direkt eingebbar), #124, #125.**
> `#126` kam nach dem Build (`da88589`, 18:34) und berührt nur `deploy.sh` + `RELEASE.md` —
> `git diff 6b17e6b..main` zeigt genau diese zwei Dateien, **kein App-Delta**. Also: `main` ist
> live, ein Deploy hängt **nicht**.
>
> **Einzeln belegt (curl 14.09. 23:55):** IndexNow-Schlüsseldatei live **200** (erfundener
> Schlüssel → 404). `sitemap.xml` live mit `lastmod` **2026-08-13** (5×) — so hat es #124 gesetzt;
> beim **nächsten** Deploy auf das dann gültige Datum ziehen (`public/sitemap.xml`), nicht in
> einem Doku-PR. `bash scripts/indexnow-ping.sh` nach dem Deploy: **nicht belegt, ob gelaufen.**
>
> **Kein Release-Tag gesetzt.** `package.json` steht auf `0.1.26-beta`, letzter Tag `v0.1.26-beta`
> (19.07.) — der Deploy vom 14.09. trägt keinen eigenen Tag.
>
> **Zweige:** vier gemergte Zweige liegen noch lokal und auf `origin` (`docs/crypto-readme`,
> `docs/stand-nach-121`, `fix/deploy-backup-gate`, `fix/sitemap-lastmod`), alle per `merge-base`
> als in `main` enthalten belegt, 0 voraus — dürfen weg, nicht Teil dieses PRs.
> `fix/deploy-assets-aufraeumen` (`a1707a8`, 2 voraus) liegt jetzt **12 Commits hinter `main`**
> und fasst dieselbe `deploy.sh` an wie #126 → vor dem SFTP-Trockenlauf erst auf `main`-Stand
> bringen und den Konflikt auflösen (Merkregel vom 24.08. gilt weiter).
>
> **Lehre des Tages:** der Deploy war um 18:32 erledigt, während Briefing und Übergabe ihn bis
> 22:35 als offen führten — vier Stunden Doku-Rückstand ohne einen einzigen `curl`. Vor jedem
> «Deploy hängt» erst `curl -sI https://malojaplana.ch/` + Bundle-Hash gegen `dist/`, dann
> schreiben.

> ### ⭐ AKTUALISIERUNG 2026-08-24 (zwei Merges + Branch-Wald gerodet)
>
> **`main`: `48ce925` → `4e2ec1d`.** Zwei PRs sind seit dem 14.08. dazugekommen:
> **#119** (Stand-Korrektur 13./14.08.) und **#120** (`feat/reineinkommen-feld` — steuerbares
> Einkommen direkt eingebbar). Beide gemergt, Arbeitsbaum sauber, nichts ungepusht.
>
> **⚠️ Gemergt ≠ live.** Der letzte Deploy stammt vom **13.08.** (`index-2340fe54.js`).
> `main` trägt seither zwei PRs mehr. Das ist **kein Rückstand, sondern der Predeploy-Stand** —
> ein Deploy erfolgt bewusst erst nach der Predeploy-Runde und nur von Stebler Studios.
>
> **Branch-Wald gerodet.** Von 28 Zweigen auf `origin` und 20 lokal ist **einer** übrig:
> `fix/deploy-assets-aufraeumen`. Gelöscht wurden 26 `origin`- und 18 lokale Zweige — alle per
> `git branch -r --merged origin/main` als **vollständig in `main` enthalten** belegt, mit
> Hash-Liste für den Rückweg (ausserhalb des Repos protokolliert). Gegenprobe mit dem
> verbliebenen Zweig: korrekt als *nicht* enthalten gemeldet — die Prüfung unterscheidet
> also wirklich, statt pauschal ✓ zu liefern.
>
> **Offen bleibt genau einer:** `fix/deploy-assets-aufraeumen` (**`a1707a8`**, 2 voraus /
> 0 zurück) ergänzt `deploy.sh` um das Aufräumen verwaister Build-Dateien in `assets/`.
> `bash -n` sauber.
>
> ⚠️ Er lag zwischenzeitlich auf `112de43` und damit **2 Commits hinter `main`** (Abzweig vom
> 14.08., also vor PR #120). Der Diff sah dann aus, als entferne er das Reineinkommen-Feld —
> er war nur alt. Da `deploy.sh --stage` aus dem *ausgecheckten* Zweig baut, hätte der
> Trockenlauf eine veraltete App auf die Stage gestellt. Inzwischen auf `main`-Stand gebracht.
> **Merkregel: einen Feature-Branch vor dem Deployen auf `main`-Stand bringen.**
>
> **Nicht mergen, bevor der SFTP-Trockenlauf gelaufen ist** — der Patch verändert den
> Produktionsweg und braucht Zugangsdaten, die nur Stebler Studios hat.

> ### ⭐ AKTUALISIERUNG 2026-08-13/14 (Stand-Korrektur + Deploy nachgezogen)
>
> **Erst die Wahrheit nachgezogen.** Diese Datei behauptete seit dem
> 29.07. `main`=`74afcc7` mit „offenem PR #116". Beides war überholt: #116, #117 und #118 sind
> alle am **30.07.** gemergt, `main` steht auf **`48ce925`**. Aufgefallen ist es, weil das lokale
> Repo seit dem 30.07. nicht gefetcht war — GitHub führte #118 längst als gemergt, lokal zeigte
> `main` noch `22a2424`. Per `git fetch` + `merge-base` geprüft, lokales `main` nachgezogen.
>
> **`mergen ≠ live` ist geschlossen — am selben Abend deployt.** Eine Stunde nach dieser
> Stand-Korrektur wurde `main` deployt (`bash deploy.sh`, Stebler Studios): die Live-Seite
> liefert seit **13.08. 18:28 GMT** `index-2340fe54.js` == `main`-Build `48ce925` (HTTP 200,
> per `curl` gegen malojaplana.ch verifiziert 14.08.). Die **Zivilstand-Steuer-Säulen (#116)**
> und der **Kapitel-Index-Test (#118)** sind damit **live** — beide Zeilen in `FEATURES.md`
> stehen jetzt auf `verified-live`.
>
> **Offen:** RM-Copy (Rätoromanisch) steht als Erstfassung live und ist noch nicht native
> gegengelesen. Der Rechenweg „verheiratet einzeln" bleibt zahllos bis zum belegten Inkrafttreten
> der Individualbesteuerung (`docs/sources/individualbesteuerung-status.md`).

> ### ✅ AKTUALISIERUNG 2026-07-29 (Deploy nachgeholt + neuer Faden Steuer-Säulen)
>
> **Deploy-Rückstand geschlossen.** Die Predeploy-Runde #115 (`main`=`74afcc7`, gemergt 20.07.)
> war 10 Tage gemergt-aber-nicht-live (Ferien-Lücke). Heute deployt (`bash deploy.sh`, Stebler
> Studios) → Live-Bundle **`index-c7370d19.js` → `index-f66f04c7.js`**, last-modified So 19.07.
> → Mi 29.07. 13:12 GMT, HTTP 200. Per `curl` gegen `malojaplana.ch` verifiziert. `mergen ≠ live`
> ist geschlossen.
>
> **Neuer Faden: Zivilstand-Steuer-Säulen (Probier-Modus).** Branch
> `feat/steuer-saeulen-zivilstand`, **PR [#116](https://github.com/steblerstudios/maloja-plana/pull/116)
> offen — nicht gemergt, nicht live.** Neues Bauteil `src/components/SteuerSaeulen.jsx` im
> `TaxCalculator`: ledig / verheiratet gemeinsam (beide amtlich via `vergleicheTarife()`, DBG
> Art. 36) + verheiratet einzeln als **zahllose Platzhalter-Säule**. 409 Tests grün, ESLint
> sauber, size 63.49/65 kB. Copy in allen 5 Sprachen (`tax.saeulen.*`).
>
> **Rechts-Check Individualbesteuerung** (`docs/sources/individualbesteuerung-status.md`): das
> Bundesgesetz wurde **am 8.3.2026 in der Volksabstimmung angenommen** (54,23 % Ja), ist aber
> **noch nicht in Kraft** (Zeitpunkt offen), neuer Tarif nur als Grafik verfügbar, braucht
> Pro-Person-Einkommen → die dritte Säule bleibt korrekt zahllos. Kinderabzug direkte
> Bundessteuer neu 6'800 → 12'000 CHF/Kind (betrifft `steuerRechner.js`, sobald in Kraft).
>
> **Offen:** PR #116 → `/code-review ultra` → Merge → Deploy. RM-Copy nur Erstfassung
> (native gegenlesen). Rechenweg „einzeln" erst bei belegtem Inkrafttreten + Tarif-Stufen.

> ### ⭐ AKTUALISIERUNG 2026-07-20 (Predeploy-Gate gelaufen — 6 Funde behoben)
>
> **Branch `fix/predeploy-runde-2026-07-20`** (3 Commits über `be75049`), noch **nicht gepusht,
> kein PR**. Volles Gate + Review-Batterie über `df70cb1..HEAD` gelaufen: **0 🔴 Blocker**,
> 772 Tests grün (+2), Build/SEO/Size/PII/ESLint sauber, keine neuen Dependencies.
>
> **Behoben:**
> - **Toter Klick** am neu eingebetteten Lohn-Barometer: `incomeType` liegt selbst im Finanzen-
>   Kapitel, der Hinweis navigierte also auf die Seite, auf der man schon stand. Jetzt nur noch
>   klickbar, wenn er woandershin führt (`aktuellesKapitel`-Prop).
> - **Hartcodierte Kapitel-Indizes 2/4** → `CHAPTER_KEYS.indexOf()` + 2 Tests, die die Zuordnung
>   verankern (Umsortierung wird rot statt still falsch).
> - **A11y:** Pfeil in `aria-hidden`-Span (Screenreader las „Rechtspfeil" mit), Touch-Ziel ~38px → 44px.
> - **jsPDF gelöscht** (`public/vendor/jspdf.umd.min.js`, 364 KB): nie importiert, ging aber in jedem
>   Build live, mit ReDoS-Advisory auf 2.5.x. `VENDOR.md` + `third-party-licenses.md` nachgezogen,
>   verbleibende Hash-Pins nachgerechnet.
> - **`window.open` ohne `noopener`** in `PremiumSubsidy.jsx` (einzige von 35 `_blank`-Stellen).
> - **PII:** nackter Vorname in dieser Datei (kam über `07ea86e`, steht damit in `main`) → Rollen-Begriff.
>
> **Bewusst offen gelassen** (systemisch, nicht neu, gehören in den Backlog): Icon-only „✕"-Buttons
> app-weit mit `minHeight: 24px` (destruktive Aktionen auf Mobil), Label/Input-Kopplung ohne
> `htmlFor`, `createPreRestoreSnapshot()` ohne `try/catch` (`backupCrypto.js:193`), unescapte
> i18n-Interpolation `cvGenerator.js:149` (aktuell kein XSS-Weg).
>
> **Keine Freigabe-Marke geschrieben** — die gehört auf den Stand, der wirklich deployt wird, und
> der liegt auf `main`. Reihenfolge bleibt: PR → Merge → `/code-review ultra` → Deploy → live gegenprüfen.

> ### ⚠️ AKTUALISIERUNG 2026-07-20 (Barometer-Fix gemergt — Deploy steht aus)
>
> **`main` ist weitergerückt: `07ea86e` → `e7a3714`** (Merge PR
> [#114](https://github.com/steblerstudios/maloja-plana/pull/114), Lohn-Barometer-Sichtbarkeit:
> klickbarer Hinweis + Einbettung im Finanz-Kapitel, 4 Dateien, +36/−4, CI grün).
> Lokales `main` per `pull --ff-only` nachgezogen, Arbeitsbaum sauber, nichts ungepusht.
>
> **Live ist davon NICHTS zu sehen.** `curl malojaplana.ch` liefert weiterhin
> **`index-c7370d19.js`** — das Bundle von `df70cb1`. **Mergen ≠ live.** Der Fix wird erst
> mit dem nächsten `bash deploy.sh` sichtbar (löst Stebler Studios aus, nie Claude).
>
> **Nächster Schritt:** auf `main` (steht schon) `bash deploy.sh`, danach per `curl` prüfen,
> bis der Bundle-Hash **nicht mehr** `index-c7370d19.js` heisst. Ab 2026-07-20 meldet der
> Morgenlauf diese Abweichung von selbst (`scripts/stand-erheben.py` im Studio-Cockpit).

> ### ⭐ AKTUALISIERUNG 2026-07-19 (DEPLOY GELANDET — Live-Stand eingearbeitet)
>
> **Der Deploy ist real gelandet.** Stebler Studios hat heute deployt; per `dig`+`curl`
> gegengeprüft (nicht aus Erinnerung): `malojaplana.ch` → `185.176.225.7`, Live-Bundle
> **`index-c7370d19.js`** / `index-6b0b5577.css`, `last-modified` **2026-07-19 13:59:21 UTC**.
> Dreifach-Abgleich stimmt: **Live-Hash == lokaler `dist`-Build == `main`=`df70cb1`-Build**
> (`predeploy-ok`-Marke `df70cb1` @13:58:38 UTC; dist gebaut @13:59:21). Der vorige Stand
> „DEPLOY-BEREIT auf `2093805`" ist damit **überholt** — `df70cb1` ist `2093805` + drei
> Docs-only-Commits (#111 Predeploy-Gate-Doku, #112 Marke-Notiz, #113 PII-Fix an dieser Datei),
> byte-neutral zum App-Bundle.
>
> **Was dadurch NEU live ist** (die ~44+ Commits über dem alten Live-Stand `c5906715`/`4c79bee`,
> 2026-07-18): **Armutsgrenze + Lohn-Barometer-Bubbles (p10/Median/p90) + 13.-Monatslohn-
> Mindestlohn-Boden (#107/#108)**, Predeploy-Runde 19.07. (a11y/copy/security-Fixes). #100 Tresor
> **dormant im Bundle** (kein Live-Effekt), #102 LockScreen **dev-only** (nicht im Prod-Bundle).
> `FEATURES.md` nachgezogen: die #107-Zeilen (13.-Monatslohn · Barometer) sind jetzt `verified-live`.
>
> **Weiter offen / unverändert:** ⚠️ r7-`.htaccess`-`geolocation=(self)` NICHT live (deploy.sh
> strippt `.htaccess` → Header im Infomaniak-Panel, dort noch `geolocation=()`). ⚠️ `wageClaim`-Brief
> RUHT (`WAGECLAIM_BEREIT=false`). Der Claude-Hook-Pfad-Bug (Claude deployt nie → fail-safe/gewollt)
> bleibt Kosmetik.
>
> **Predeploy-Backlog neu bewerten:** „Predeploy" ist bei Maloja **kein Vor-dem-ersten-Launch-Zustand**
> (die App ist seit 2026-07-10 live) — der Deploy hebt den „nur notieren"-Freeze also **nicht automatisch
> auf**. Ob die Backlog-Wünsche (Memory `project-maloja-predeploy-backlog-2026-07-19`) jetzt gebaut werden
> dürfen, bleibt der Entscheid von Stebler Studios, nicht meiner.

> ### ⭐ AKTUALISIERUNG 2026-07-19 (Predeploy-Gate, Runde Armutsgrenze/Barometer)
>
> **`main` steht auf `7213263`** (PR #108, a11y Barometer-Glyphen aria-hidden). Die Armutsgrenzen-/
> Netto→Brutto-Linie ist via PR #107 **längst in `main`** (die ältere Notiz unten „gepusht, NICHT gemergt"
> ist überholt). LIVE unverändert = `4c79bee` / Bundle `index-c5906715.js` (2026-07-18). **44 Commits über
> LIVE** → Rhythmus reif.
>
> **Predeploy-Gate 2026-07-19:** Mechanik grün (770 Tests · Build sauber · SEO 0/0 · Size 63.42/65 kB ·
> CSP self-only · i18n-Parität). PII-🔴 (`docs/TODO.md`) bereinigt. Volle 9-Prüfer-Batterie: **swiss-precision,
> security, rechts, a11y, qualität, ordnungshüter, polygrafin, link-checker je 0 🔴** — keine falsche Zahl
> erreicht Anzeige/Brief, Wächter-Kette hält. Copy-🔴 (Sie/Du-Split fehlte an `povertyLineNote`/
> `povertyBruttoHint`; rm-Zonen deutsch) + zwei konvergente ⚠️ (Barometer-Glyphen nicht aria-hidden;
> „(BFS 2024)"→„(nach BFS-Methodik)") **behoben** — plus pre-existing Cleanup (Pill-Kontrast `sageDeep`,
> `localStorage` try/catch ×2, `noreferrer`, 5 tote i18n-Keys). Release `0.1.26-beta` auf
> `fix/predeploy-2026-07-19-review-fixes` → PR nach `main` (GitHub Flow).
>
> **✅ Quellen belegt 2026-07-19 (der Deploy-Blocker ist weg):** (a) **SKOS-Grundbedarf 2026 unverändert** —
> gegen Aargauer Handbuch (SKOS-RL 1.1.2025) 1:1 bestätigt, nächste Anpassung erst 1.1.2027; (b) **BFS-
> Armutsgrenze 2388/4159 korrekt für Bezugsjahr 2024** (BFS-Medienmitteilung publiziert Feb 2026). Beide
> Kommentare in `sozialhilfeRechner.js` geschärft, TODO Abschnitt B auf ✅.
>
> **✅ Predeploy-Gate 2026-07-19 GRÜN auf `main`=`2093805` (48 Commits über LIVE):** Mechanik grün
> (770 Tests · Build · SEO 0/0 · Size 63.43/65 kB · PII · i18n-Parität 32/32 · keine neuen Deps · CSP self-only) ·
> de-Chunk-Verifikation der Fixes bestätigt · fokussierte Re-Review (a11y/copy/security/swiss-precision über
> den Fix-Diff) **0 🔴 / 0 ⚠️**. Die volle 9-Prüfer-Batterie lief früher in derselben Sitzung über die
> Feature-Linie (alle Funde gefixt #109, Quellen belegt #110). **Freigabe-Marke `.maloja/predeploy-ok`
> GESETZT** (= `2093805`, lokal/gitignored). **FEATURES-Zeilen bleiben `built`** bis `deploy.sh` real lief
> (dann → `verified-live` mit Bundle-Hash). Nächster Zug (Stebler Studios): `/code-review ultra` → `deploy.sh`
> von `main` → LIVE gegen die de/fr/it/rm-Chunks gegenprüfen.
>
> **Hinweis Deploy-Marke (korrigiert 2026-07-19):** Die `predeploy-ok`-Marke gilt **nur dem Claude-seitigen
> Hook** (`.claude/settings.json`) — sie gatet, ob **Claude** `deploy.sh` starten darf. Der **manuelle**
> Deploy von Stebler Studios im eigenen Terminal ist davon **unberührt** (kein Claude-Hook feuert dort); `deploy.sh` prüft die Marke
> nicht selbst, hat aber eigene Gates (Branch=`main`, PII-Scan, SEO-Check, Build). Der Claude-Hook hat einen
> kleinen Pfad-Bug (`cd` zum Container statt git-Toplevel, „Hüll-Ordner"-Falle wie BD37) → er verweigert Claude
> den Deploy **immer**; das ist **fail-safe/gewollt** (Claude deployt nie), kein Blocker für Stebler Studios. Optionaler
> Kosmetik-Fix: `cd`-Pfad auf `…/maloja-frontend`/`CLAUDE_PROJECT_DIR` ziehen. Marke sitzt korrekt auf `main`-HEAD.

> ### ⭐ AKTUALISIERUNG 2026-07-19 (git-Stand gegengeprüft, NICHT am Live-Bundle)
>
> **`main` steht auf `93fbe27`** (Merge PR #103, `chore/session-close-2026-07-18`) — per `git`
> gegengeprüft. ⚠️ Die „Wo stehen wir"-Tabelle unten stammt vom **2026-07-15/18** und nennt
> ältere Hashes (`acc52f0` / `4c79bee`); **`93fbe27` ist der aktuelle** `main`-HEAD.
> **Live unverändert** (`index-c5906715.js`) — seit 2026-07-18 kein Deploy, nichts Neues live.
> #103 war `session-close` (Doku), byte-neutral.
>
> #### 🌐 Deploy-/Hosting-Wahrheit — verifiziert 2026-07-19 (DNS + Header + PWA gecurlt)
> **Production = Infomaniak (Apache), `malojaplana.ch`, deployt manuell via `deploy.sh`** (SFTP,
> IP-gefiltert gegen CI, nur Stebler Studios). Belegt: `dig malojaplana.ch` → `185.176.225.7`
> (Infomaniak, **nicht** Vercel `76.76.21.21`); `curl -I` → `server: Apache`. Der Deploy-Weg im
> Kopf dieser Datei (`bash deploy.sh`) ist korrekt — **„mergen nach `main`" ist KEIN Deploy.**
>
> **PWA installierbar, live verifiziert:** `/manifest.json` (`display: standalone`, App-Shortcuts)
> + `/sw.js` → HTTP 200. Die App wird selbstgehostet von Infomaniak ausgeliefert — **Vercel nie.**
>
> **⚠️ Vercel (`ordnung-ruhe-neu`) = totes Überbleibsel der alten Alpha, RETIRED.** Hatte
> `malojaplana.ch` im Dashboard als Domain eingetragen und baute bei jedem Push mit, aber DNS
> zeigte **nie** dorthin → hat Production nie serviert. **Git-Integration 2026-07-19 disconnectet**
> (Auto-Builds gestoppt). Optional restlos löschen (safe — DNS hängt an Infomaniak). Merker gegen
> Wieder-Verheddern: das Vercel-Dashboard zeigt die Domain irreführend als „Production" — die
> Wahrheit steht in DNS + `server`-Header, nicht im Dashboard.
>
> **Aktive Arbeit — EINE merge-fertige Linie, gepusht, NICHT gemergt, kein PR:**
> - `feat/lohn-barometer-zonen` (ab `main=4c79bee`, 13 Commits, Tip `c32ef58`) — Barometer als
>   Verteilungs-**Bubbles** (p10/Median/p90 LSE 2024), 13.-Monatslohn-Feld + rechtskonformer
>   Mindestlohn-Check (`konformMit13`, 13. zählt an den Jahres-Boden), interaktive Branchen-Chips,
>   a11y Variante B (Chip-Touch-Ziel 24×24), Byte-Budget entschärft (DEMO_DATA + autoBackup lazy).
> - **`feat/armutsgrenze-auf-barometer`** (Kind-Branch ab `c32ef58`, 3 Commits `00abfb6`/`1f8c103`/
>   `ee6dfa0`; **16 Commits vor `origin/main`**) — **DAS Deliverable dieser Runde.** = Bubbles +
>   belegte **Armutsgrenze** (`berechneArmutsgrenze()` in `data/sozialhilfeRechner.js`: SKOS-Grundbedarf
>   + effektive Wohnkosten + CHF 100/Person ab 16 vs. verfügbares Netto; Quelle BFS Ø2024 2388) +
>   **Netto→Brutto-Brücke** (`nettoZuBruttoRichtwert()` in `data/ahvRechner.js`: AHV/ALV 6.4 % + BVG-
>   Altersgutschrift nach Alter, Fixpunkt-Iteration). Das Barometer läuft dadurch **auch bei Netto**
>   (geschätztes Brutto). ⭐ **Regel:** die Mindestlohn-„!"-Warnung (→ Brief) greift **nie** auf
>   geschätztem Brutto, nur auf echtem (Test-Wächter `mlBreached = !geschaetztAusNetto`).
>
> **Review-Reife gegengecheckt (2026-07-19):** 766 Tests grün · Size **63.44/65 kB** (1.56 kB Luft) ·
> keine Debug-Reste · `geschaetztAusNetto` + `povertyBruttoHint` in allen 5 Sprachen verdrahtet.
> **Nächster Zug (Stebler Studios):** `/code-review ultra` auf `feat/armutsgrenze-auf-barometer`
> → Merge → `/maloja-predeploy` → `deploy.sh`. Claude startet weder Review noch Merge/Deploy.
>
> **Infrastruktur-Nebenarbeit:** `handoff` + `session-close` als generische Zwillinge nach
> `~/.claude/skills/` gehoben (Maloja behält die getunten lokalen Versionen, gewinnen lokal) —
> Prinzip „spicken statt duplizieren". Details: Claude-Memory `reference_globale_skills_layering`.
>
> **Noch offen:** GitHub aufräumen (`feat/uiux-p1-glyphen-armutsgrenze` überholt + 2 stale-gemergte
> Branches löschen) · Steuer-Säulen (nächster Bau-Faden, `project_steuer_saeulen_zivilstand`).

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | **`main`** (Sitzung 2026-07-18 endete an drei Merges: #100/#101/#102). Der Abschluss läuft über `chore/session-close-2026-07-18` → PR (GitHub Flow, nicht direkt auf `main`). |
| `main` steht auf | **`4c79bee`** (= `origin/main`, gegengeprüft 2026-07-18; Merge von #102). ⚠️ **Merge-Fallen-Regel (Gegenprobe = Schritt 1):** Steht hier ein Hash, der einen Merge alt ist, und `git diff <hier>..main -- src/` ist **leer** → ok. **Ist das Delta NICHT leer, hängt ein echter Deploy.** |
| Deploy hängt? | **NEIN — `main` (`4c79bee`) ist LIVE.** Deployt 2026-07-18 13:59 → Live-Bundle **`index-c5906715.js`** == frischer `main`-Build, per `curl` gegengeprüft. Damit ist die **KVG-«Kurz innehalten»-Änderung (#101) live**; #100 (Tresor 2b-pre) dormant + #102 (LockScreen) dev-only sind byte-neutral mitgegangen. `git diff <predeploy-ok>..HEAD -- src/` als Gegenprobe beim nächsten Mal. |
| Version (package.json) | `0.1.25-beta` |
| Letzter Tag | `v0.1.25-beta`. ⚠️ Der Tag zeigt auf `31abc36` — ein Hash, den der Purge **getötet** hat (`git log 31abc36..HEAD` bricht ab). Ab jetzt setzt `deploy.sh` den Tag automatisch aus `package.json`. |
| Live (malojaplana.ch) | Bundle **`index-c5906715.js`** / CSS `index-6b0b5577.css` (= `main` `4c79bee`, deployt **2026-07-18 13:59**, per `curl` verifiziert). Enthält Runde 8 (Lohn-Befund-Brief + Barometer) **und** Runde 9 (KVG-«Kurz innehalten» sichtbar; #100 Tresor dormant, #102 LockScreen dev-only/nicht im Prod-Bundle). Vorheriges Runde-8-Bundle war `index-96dd34ec.js` (11:53). ⚠️ **Ausnahme (weiter gültig):** r7-`.htaccess`-Fix `geolocation=(self)` — `deploy.sh` strippt `.htaccess`, Header kommt aus dem Infomaniak-Panel. |
| **Runde 9 (2026-07-18) — 🟢 GEMERGT (#99–#102), teils NICHT live** | **#99** maloja-c-Docs-Extraktion (Zielarchitektur, Positionierung, Tresor-Zielbild — docs-only). **#100 Tresor 2b-pre:** 4 🔴 der harten Vorbedingung + Härtung (Doc-Blobs verschlüsseln, prerestore-Purge best-effort, freundlicher Fehler, Leeres-Backup-Guard; PBKDF2 600k versioniert, `TRESOR_MIN_PASSPHRASE=12` + Merksatz-Nudge, Backup-Zwang, `VAULT_*`→`TRESOR_*`) — **dormant, kein Live-Effekt.** **#101 KVG «Kurz innehalten»:** Anti-Dark-Pattern-Schritt in KVGWechsel + i18n ×5 — **live-wirksam, noch nicht deployt.** **#102 LockScreen-Design:** Tresor-2b-UI-Wand entkoppelt (nur `onUnlock`-Prop), `tresorLock`-i18n ×5, dev-only `#/lockpreview` — **Prod byte-neutral.** 748 Tests grün, Size 64.97/65 kB. |
| Deploy-Zugang | **`.deploy.local` am 2026-07-18 wiederhergestellt** (war beim Klon verloren). ⚠️ Konkrete Werte (SFTP-Host/User/Remote-Pfad) stehen **nur** in `.deploy.local` (gitignored) + Claude-Memory `project_maloja_c_wiedereinstieg_2026-07-18` — **nie ins getrackte Repo** (Secret/PII, PII-Scan schlägt sonst an). Merker: der SFTP-User ist der Panel-**Admin**-FTP-Benutzer, NICHT der temporäre SSH-Zugang (der ist kein SFTP-Konto). Passwort nur interaktiv. **⚠️ ausserhalb git sichern (Passwort-Manager)** — dritter Verlust dieser Art. |
| ⚠️ Tote Hashes | Alle Hashes von **vor** dem Purge (2026-07-14) lösen nicht mehr auf — u. a. der Live-Marker `31abc36` und `.maloja/predeploy-ok`. **Ein toter Hash heisst NICHT, dass die Arbeit erfunden war.** Nachschlagen: `grep '<hash>' _maloja-archiv/HASH-LANDKARTE-vor-purge.md` (2070 Einträge, PII-frei). |
| **Runde 2026-07-12/13 (live)** | **✅ GEMERGT + LIVE (PRs #47–#59): Runde 2026-07-12 + Anspruchs-Instrumente Phase 1 (IPV-Beleg + Sozialhilfe-Pegel) + Design-Docs-Ent-Drift** |
| **Runde 2 (IPV-Lebenslinie) — ✅ LIVE** | **✅ PR #60 (`d9ee62b`):** IPV-Lebenslinie Phase 2 + Sozialhilfe-Rückerstattung + Predeploy-Fixes (Stempel/Kompass/Sie-Du/ipvSubsumed). Runde-2-Gate grün, ZH-Beträge live gegen Handbuch verifiziert. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 3 (Tresor + AHV-21) — ✅ LIVE** | **✅ PRs #62/#63/#65/#66 (`a9578f1` → in `69ea85e`):** Tresor-Lock cryptoCore/secureStore (**dormant/unverdrahtet**, Web Crypto, keine Deps) · AHV-21-Referenzalter der Frauen JG1961–63 (monatsgenau, swiss-precision-verifiziert) · a11y-soft-Kontrast. **Predeploy-Runde 3 (19 Agenten)** fand 3 🔴 → alle gefixt: AHV-Integration in Vergleichstabelle/Zukunftsbild/Feld-Default (#65, JG1962→2'341.33/0% statt Phantom-Aufschub), PII-Leak (#66), **Tresor-🔴 als Phase-2b-Blocker geparkt** (dormant, `docs/design/tresor-lock.md`). Polish #68: a11y 44px-Header-Schalter + Chip-Kontrast, Pensionierung-Frist ans echte Referenzalter, vr.source-Zitat. **Deployt in `index-8aeb4a84.js`.** |
| **Runde 4 (Doku + Governance + Momentum + Sie/Du) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#72/#73** Doku-Sprawl-Konsolidierung · **#74** Feature-Level-Tagging L0–L5 (`GOVERNANCE_LEVELS.md`, Runtime dormant) · **#75** Momentum-Anti-Druck-Zeile (`nextUpReassure`) · **#77** Sie/Du-Split der Zeile + Batterie-Polish (FinanzUebersicht-Chip Dunkelkontrast '60'→'40', `ctrlBtn`/Anrede `radius.sm`, `du`→`Du`, `leading.normal`). **Predeploy-Runde 4: volle Batterie (10 Prüfungen — Security+a11y+Design ganze App + Domänen + code-review) = 0 🔴.** In `main` (`b750e9e`), noch nicht deployt. |
| **Runde 5 (#79/#80) — 🟢 GEMERGT, Gate GRÜN, NICHT LIVE** | **#79** i18n-Jahr-Interpolation `lohnCheck.unterMindestlohn`. **#80 (Predeploy-Runde 5, volle Batterie erneut = 0 offene 🔴):** zwei pre-existing 🔴 gefixt — (1) **Kantons-Mindestlöhne auf 2026 offiziell verifiziert korrigiert** (GE 24.32→24.59, NE 21.31→21.35, BS 21.00→22.20 + `indexiert`-Flag, JU/TI bestätigt; war False-Negativ-Warnungs-Risiko, Wahrheits-Disziplin) · (2) **Schwarz-auf-Sage-🔴** an 3 Buttons (4.32:1)→`sageBtn`/weiss. Plus DE-Grammatik „beim". |
| **Runden 4–7 (#72–#84) — ✅ JETZT LIVE** | Doku/Governance (#72–74), Momentum-Zeile+Sie/Du (#75/#77), i18n-Jahr (#79), Mindestlohn 2026 (#80), SEO/GEO-Fundament (#82), roseDeep+tote-Links (#83), Predeploy-r7 a11y+BWO (#84) — **alle deployt + verified-live in `index-1f4c6867.js`** (2026-07-14). Predeploy-Runde 7: volle 8-Agenten-Batterie 0 🔴, alle ⚠️ auf ausdrücklichen Wunsch vor Deploy gefixt. |
| **Runde 8 (2026-07-15) — 🟡 GEMERGT in `main`, NICHT live; Blocker behoben auf `fix/predeploy-r8`** | ⚠️ **Predeploy-Runde 8 hat die Freigabe VERWEIGERT** — 9 🔴 in der Fachlogik. Volle Batterie: 9 Prüf-Agenten + Code-Review (44 Agenten); alle mechanischen Gates waren grün (701 Tests, Build, SEO 0/0, PII, Size, CSP, de-Chunks) — **die Skripte sahen nichts davon.** Behoben auf `fix/predeploy-r8` (siehe eigene Zeile). Details unten unter „Nächste Schritte" Punkt 0. <br> **`feat/befund-brief-lohn` (`d5a2898`, jetzt via PR #93 in `main`):** `c56272f` **Teilzeit-Fehlalarm behoben** — ohne erfasste Wochenstunden nahm der Mindestlohn-Befund blind Vollzeit an (182 Std.); CHF 3000 bei 50% wurden als 16.48/Std. statt 32.97/Std. gelesen → korrekt bezahlte Teilzeit-Angestellte wurden für unterbezahlt erklärt, **und der Befund führt neu zu einem Brief an den Arbeitgeber**. Jetzt nur `pruefeStundenlohn`; ohne Stunden ruhige Einladung statt Warnung, kein Brief-Knopf. · `1bca5a8` Arbeitgeber-**Adresse** (beide Kapitel, quer befüllt) + **Haupt-/Nebenerwerb-Auswahl** (`options.job` steuert Empfänger UND Zahlen) · `d5a2898` **NE/BS amtlich gegengeprüft** — NE hat KEIN „Mindestlohngesetz", der Mindestlohn steht in der **LEmpl von 2004, Art. 32a ff. (RSN 813.10)**; BS = **MiLoG vom 13.01.2021 (SG 812.200)**, Stelle AWA. Beide von `verify:true` → `false`. <br> **`feat/lohn-mietzins-barometer` (`6c143b0`, ab dem obigen):** `bc52438` **Barometer-Rebuild** nach der Rebuild-Spec (Lohn + Miete spiegelgleich in der Finanz-Übersicht, `data/lohnEinordnung.js`, `components/LohnEinordnung.jsx`, `components/MietVergleich.jsx` in BEIDEN Orten, `RegionalBarometer` + `fillColor`/`thresholdValue`) · `99c741f` `docs/design/farb-und-daten-system.md` · `f6d45b9` **Marken-Kollision** („!" und CH-Schnitt fallen bei ~CHF 4'000 Einkommen aufeinander — 1327×3=3981, mitten in der Zielgruppe) · `6c143b0` **Prüf-Agenten neu gebaut + `.claude/agents\|commands` in git**. |
| **Blocker-Behebung — ✅ via PR #97 in `main`, + dritte Prüfung** | Alle 9 🔴 aus Runde 8 behoben, dann DREI Prüf-Durchgänge gegen die Behebung selbst (jeder mit dem Auftrag, sie zu zerlegen). Bilanz: die Durchgänge 2+3 fanden **sechs weitere echte Fehler in den Fixes** (Netto/Brutto in `unpaidWage`, Netto als untere Schranke, Gate an den falschen Arbeitgeber, Zwei-Nenner-Marke, Netto-Stundenlohn unbeschriftet, Barometer-Text 4262 statt 4475) — alle behoben. **740 Tests grün** (64 Dateien), Build sauber, Size **64.96/65 kB**, i18n 32/32, PII + SEO grün. Der wichtigste Befund der Runde: dass die wiederholte adversariale Prüfung nötig war — Mechanik-Gates sahen KEINEN der Fehler. |
| **Deploy-Gate** | **⏳ Marke wird nach dem Merge von `fix/predeploy-r8-3` gesetzt.** `.maloja/predeploy-ok` ist **lokal + gitignored** (kein Repo-Artefakt) → wird auf den finalen `main`-HEAD geschrieben und lokal von `deploy.sh` gelesen. **Deploy selbst macht Stebler Studios** (nach `/code-review ultra`, billed, von SS ausgelöst — Claude kann es nicht starten). `deploy.sh` fährt PII- + SEO-Gate und setzt den Release-Tag automatisch. |

**⚠️ HISTORIE UMGESCHRIEBEN — ZWEIMAL.** (1) 2026-07-11: Alt-Mails raus, Autoren → „Stebler Studios". (2) **2026-07-14: Personas/Tester/Freunde/Drittperson/Mac-Benutzername + `docs/archive` (199 Dateien) aus der GESAMTEN Historie** (`filter-repo` invert-paths + replace-text, `main`→`35bd840`, force-push, alle Tags/Branches neu, lokal frisch geklont). Verifiziert 0 Treffer gegen `main`. **Bewusst geblieben:** eigener Name „Sophie Stebler" (Autoren-Angabe README/package.json + nDSG-Impressum, öffentlich). **Offen (2 Reste):** (a) `refs/pull/*/head` blieben beim Push abgelehnt → GitHub-Support-Ticket (SHA-Cache + PR-Refs, Formular private-information); (b) alte lokale Mirror-Backups in `_maloja-archiv/` mit Alt-PII (löschbar, waren Recovery-Netze). Details Claude-Memory `feedback_no_owner_name_in_git` + `project_cleanup_inventory` + Runbook `_maloja-archiv/HISTORIE-PURGE-NAME-2026-07-14.md`.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live:** Bundle **`index-96dd34ec.js`** / CSS `index-6b0b5577.css` läuft auf malojaplana.ch
  (Runde 8, deployt 2026-07-18, per `curl` verifiziert — `BriefGenerator`+`RegionalBarometer`
  als HTTP 200 belegt). **`main` (`4c79bee`) baut frisch → `index-c5906715.js`, ≠ live** →
  ein Deploy hängt, aber nur die KVG-#101-Änderung (live-wirksam); #100 dormant, #102 dev-only.
  **748 Tests grün** (64 Dateien), i18n-Parität 5 Spr., Build sauber, Size 64.97/65 kB.
  - Falle (weiter gültig): nach jedem Merge prüfen, dass `deploy.sh` wirklich frisch baut
    (schon mal alter Build ausgeliefert).
- **✅ Testlauf-Falle behoben** (PR #95, `8c30db3`): `vite.config.js` schliesst `**/.claude/**`
  aus. Ehrliche Zahl bestätigt: **63 Dateien / 701 Tests**. `npm test` genügt wieder, die
  Worktrees verfälschen nicht mehr. (Zuvor gemeldet: 122/1327.) Gegengeprüft: die neue
  Config ist **prod-neutral** — Basis-Code mit ihr gebaut ergibt denselben Hash `index-1f4c6867.js`.
- **⚠️ Prüf-Agenten-Falle — die Diagnose war falsch.** Bisher stand hier, Claude Code lade die
  Agenten „erst beim Sitzungsstart". Das stimmt nicht: **es ist der Ort, nicht das Timing.**
  `.claude/agents/` liegt in `maloja-frontend/`, die Sitzung lief auf der Container-Ebene
  `~/Projects/maloja plana/` — dort gibt es **kein `.claude/`**, also werden die Agenten nie
  geladen, auch nach beliebig vielen Neustarts nicht.
  **→ Sitzungen IMMER aus `maloja-frontend/` starten** (Repo-Root = Governance-Einheit).
  Kein zweites `.claude/` auf Container-Ebene (zwei Wahrheiten), kein Symlink (ungetrackt).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). `/session-close` schliesst Sitzungen ab. Kapitalbezugs-
  steuer (`e4fe262`) ist in `main` und live.

## Nächste Schritte

> **Stand 2026-09-17, 12:15 (Sitzungsabschluss):** Die Bau-Liste `docs/BAULISTE-2026-09-30.md`
> ist die Arbeitsliste; §16 ist der neueste Abschnitt. Der Block «Runde 9» darunter ist Historie.
>
> **Bei Stebler Studios:**
> 1. **M4** — Postfach `info@malojaplana.ch` im Infomaniak-Panel prüfen und eine Testmail senden (der letzte offene MUSS-Punkt).
> 2. **Panel-Durchgang** — O20 Cache `/assets/` + `/fonts/` 1 Jahr `immutable` (nicht `index.html`, `sw.js`, `theme-init.js`) · HSTS `31536000` · M15 `geolocation=(self)` · O8 CSP-Header mit `frame-ancestors 'none'` **und** `style-src 'self' 'unsafe-inline'` (K72). Live gemessen 17.09.: HSTS `16000000`, `geolocation=()`, kein `cache-control`, kein CSP-Header. Danach PageSpeed neu.
> 3. **Entscheide** — E40 (Behörden-JSON: Kennungen?), E41 (kantonale Taxpunktwert-Quellen in der App zeigen?), K55 («offline-fähig» in Werbetexten), K58 (Rückfall-Sprache en oder de), K62 (Partner-Regeln), K45/K46, E1 und E3 (Oktober), Wallis («warten»).
> 4. **Gegenlesen** — fr/it (K70), rm (K69), Jurist:in (K48).
>
> **Bei Claude, ohne Entscheid möglich:** K68 (vier Anrede-Reste) · K71 (Rückfall-Text, `createTranslator`) · K67 (zuerst nur messen, was im Hauptbundle steckt) · K54 (Kürzung der Berufsauslagen-Pauschale bei Teilzeit — erst ESTV-Beleg) · K56/K57 (Lizenz- und Doku-Reste).

> **Stand 2026-07-18 (Runde 9):** Runde 8 ist LIVE. Der ⭐-Block „Runde-8-Blocker" darunter
> ist damit **erledigt + deployt** (Historie belassen). Aktuelle offene Schritte:

**A. ✅ ERLEDIGT — KVG-«Kurz innehalten» (#101) ist live** (Deploy 2026-07-18 13:59,
   Bundle `index-c5906715.js` == `main`, curl-verifiziert). Merker fürs nächste Deploy:
   `.maloja/predeploy-ok` nach jedem `main`-Vorrücken frisch auf HEAD setzen (die Marke
   war für Runde 8 auf `091c184`, stale fürs KVG-Deploy → neu gesetzt).

**B. Tresor 2b-UI — die echte Verdrahtung (eigene, frische Sitzung, fasst echte Daten an).**
   Fundament #100 (2b-pre) + Wand #102 (LockScreen, design-first) sind gemergt. Offen:
   Seam in `main.jsx` (bei `isTresorActive()` → LockScreen statt App; `onUnlock` → `unlockTresor`
   → entschlüsselter State; Speichern → `persistTresor`), **Aktivierungs-Flow** mit erzwungenem
   Backup-Export (`activateTresor` verlangt `backupConfirmed`) + Setup-UX „nimm einen ganzen
   Satz" (≥12), `tresorLock`-Fehlermeldungen durch i18n, Doc-Ladepfad (`main.jsx:744`
   `doc.data||getDocBlob`) an den entsperrten In-Memory-Zustand koppeln, `autoBackup.js`
   mitverschlüsseln. **Verify-Punkt (Self-Review #100):** Doc-Blob-id-Typ (String vs. idb-Key)
   einmal end-to-end mit echten Dokumenten gegenprüfen. Spec: `docs/design/tresor-lock.md`.

**C. Klein/offen:** IDEEN §13 Rest-Idee „Freigabe-/Export-Vorschau «Das verlässt dein Gerät»";
   `wageClaim`-Brief-Wiedereinschaltung (siehe alter Punkt 0 unten).

---

0. **⭐ Runde-8-Blocker: BEHOBEN + DEPLOYT (2026-07-18). Historie unten belassen.**
   ⚠️ Merker: `/maloja-predeploy` Schritt 1 liest den LIVE-Marker aus dieser Datei — der
   Tag-Hash `31abc36` ist tot. **Der LIVE-Marker ist `5a4851c`** (= Bundle `index-1f4c6867.js`).

   **Stand: alle 🔴 behoben, DREI adversariale Prüf-Durchgänge, alle Funde behoben.**
   Runde 8 (erste Batterie) fand 9 🔴. Weil die Behebung KI-geschrieben und zuerst ungeprüft
   war — genau der Zustand, der die 9 erzeugt hat —, lief eine **zweite** Batterie gegen die
   Behebung: sie fand VIER falsche Fixes (Netto/Brutto in `unpaidWage` · Netto als untere
   Schranke · Gate an den gut zahlenden Arbeitgeber · Zwei-Nenner im Barometer) + zwei
   a11y-Regresse. Behoben (`6c53776`). swiss-precision fand zusätzlich drei Dinge am FEATURE
   selbst → **`wageClaim`-Brief RUHT** (`WAGECLAIM_BEREIT=false`, `2b8e90e`).
   Nach dem Merge (PR #97) lief eine **dritte** Prüfung gegen die zwei bis dahin ungeprüften
   Commits — sie fand ZWEI weitere echte Fehler (`fix/predeploy-r8-3`, `8a5eb11`):
   Netto-Stundenlohn wurde im Kapitel unbeschriftet gezeigt (Folge der Umsortierung), und die
   Barometer-Textzeile sagte „bei Vollzeit CHF 4262" statt 4475 (Marke braucht 40h, Text 42h)
   — plus vier latente/Aufräum-Punkte. Alle behoben.
   **Muster (das eigentliche Ergebnis):** JEDER Prüf-Durchgang fand die vorigen Fixes falsch,
   auf dieselbe Art wie die Fehler, die sie beheben sollten. Mechanik-Gates (Tests/Build/
   SEO/PII/Size) sahen KEINEN davon. **Ein KI-Fix ist nicht fertig, bis ihn eine unabhängige
   adversariale Prüfung nicht mehr umwerfen kann.** Nach der dritten fanden swiss-precision +
   a11y+copy 0 neue Blocker; der Code-Review 2 (behoben). Eine vierte wäre möglich — die
   Konvergenz (die dritte fand nur noch 2 statt 4) und der ruhende Brief begrenzen das Risiko.

   **Offen aus der zweiten Batterie (⚠️/💡, nicht-blockierend — Feature-Genauigkeit):**
   - **`wageClaim` wieder einschalten** braucht: Sektor + Status erfassen (Lehre/Praktikum/
     unter 18/GAV/Landwirtschaft/Ferienjob), GE-Sätze differenzieren (24.59/18.07/18.44),
     je Satz ein amtlicher Beleg. Dann `WAGECLAIM_BEREIT=true`. Der Brief-Code ist fertig.
   - **LSE-Median enthält ⅟₁₂ des 13. Monatslohns** (BFS-Definition): wer den Monatslohn ohne
     13. einträgt, liest sich ~8 % zu tief ein. Entweder im Feld nach dem 13. fragen, oder
     `lohnEinordnung.source` sagt, was der Median einschliesst.
   - **Armutsgrenze 2279** (`FinanzUebersicht.jsx`): unbelegt, veraltet (BFS 2024: **2388**),
     und misst die falsche Grösse — sie gilt für *verfügbares äquivalenziertes Haushalts*-
     einkommen (nach Abzügen), der Code hält sie gegen rohes Personen-`monthlyIncome`. `4000`
     ebenfalls unbelegt. **Pre-existing (seit `e437a42`), schon live** — kein Regress dieser
     Runde, aber ein echter Wahrheits-Disziplin-Fund. (Mein eigener Kommentar „armutsrelevant
     = tatsächliches Geld" war falsch.)
   - **Branchen-Chips + `belowMedian`-Band** (`FinanzUebersicht.jsx`) vergleichen ROH-Einkommen
     mit Brutto-VZÄ-Medianen — dieselbe Netto/Brutto-Klasse, die das Barometer streng meidet.
     Gehört zum Design-Entscheid Punkt 12 (Einkommens-Bänder).
   - **Haselnuss `#947750` vs. Spur = 3.0003:1** — besteht WCAG 1.4.11 mit null Reserve; jede
     `border`-Retusche kippt es. Vorschlag `#8E724D` (3.23) + Test-Schwelle auf 3.1.
   - **Ferien-/Feiertagszuschläge:** alle drei Mindestlöhne sind OHNE definiert; bei Stundenlohn
     enthält das Monatseinkommen ~14 % davon → abgeleiteter Stundenlohn zu hoch → verpasste
     Unterschreitungen. Sichere Richtung (kein Fehlalarm), darum nur Merker.
   - **`ChapterView` „im Kanton GE"** (Code statt Name) — der Brief sagt „Genf". Pre-existing,
     `getCantonName` liegt bereit.

   **Warum eine zweite Batterie:** Der Fix ist KI-geschrieben und war zuerst ungeprüft — genau
   der Zustand, der die Blocker erzeugt hat. Er zahlte sich zweimal aus: der Code-Review fand
   in Runde 1 zwei Fehler, die **alle neun** Prüfer übersahen (Netto/Brutto, >42-Std.-Freispruch),
   und eine eigene Render-Probe deckte auf, dass mein erster Netto-Fix nur **halb** war (der
   Mindestlohn schwieg, der Median-Vergleich lief weiter — der BFS-Median ist auch brutto).

   **Predeploy-Runde 8 (2026-07-15) verweigerte die Freigabe.** Batterie: 9 Prüf-Agenten +
   Code-Review (44 Agenten). Mechanik komplett grün — die Funde sassen in der Fachlogik.
   Roter Faden: **derselbe Lohn wurde an fünf Orten verschieden beurteilt** (`ChapterView`
   2×, `briefGenerator`, Barometer, `getLetterTemplates`), und am Ende steht ein Einschreiben
   an einen Arbeitgeber. **Die Behebung ist darum kein Flicken je Fund, sondern eine Wahrheit:**
   `pruefeStundenlohn` entscheidet, alle anderen fragen sie.

   **Was behoben ist** (Details je Commit; ↓ = Fundtext von Runde 8, unverändert als Beleg):

   **✅ (a) Netto/Brutto wird nie geprüft** *(behoben `cbd422a`: 4. Parameter `einkommensart`, nur „brutto" gibt einen Befund; Vergessen ⇒ Schweigen. Neu `sideIncomeType`, sonst wäre der Nebenerwerb eine Sackgasse.)* — `briefGenerator.js:66` (`lohnBefund`), Lohn-Pfad
   liest `finanzen.incomeType` **nirgends** (verifiziert: 0 Treffer). Die App fragt die
   Einkommensart ab (`constants.js:202`) und rät im Hinweis ausdrücklich zu **Netto**
   („Netto ist was auf Ihrem Konto ankommt", `de.js:1314`) — die Mindestlöhne sind aber
   **brutto** (`lohnCheck.js:1`). GE, CHF 4'000 netto bei 42 Std. → App rechnet 21.98/Std.
   < 24.59 → rote Warnung → Brief. Brutto wären ~4'550 = 25.00/Std., also **legal**.
   *Wer der Anleitung der App folgt, beschuldigt den Arbeitgeber zu Unrecht.*

   **✅ (b) `incomeFTE` normalisiert nur nach unten** *(behoben `cbd422a`: bei bekannten Stunden IMMER normalisieren; `mlBreached` kommt aus `pruefeStundenlohn` — Kapitel und Barometer stimmen per Konstruktion überein.)* — `lohnEinordnung.js:63/66`:
   `partTime = hoursKnown && stunden < 42` → wer **mehr** als 42 Std. arbeitet, behält den
   Rohlohn. BS, CHF 4'100 bei 45 Std.: Kapitel meldet korrekt „unter Mindestlohn" + Brief-Knopf,
   das Barometer daneben gibt **Entwarnung**. Eine echte Unterschreitung wird stumm freigesprochen.

   **✅ (c) 42 als Klassifikations-Schwelle statt Referenz-Nenner** *(behoben `cbd422a`: eigene, amtlich belegte Konstante `LSE_VOLLZEIT_STUNDEN_WOCHE = 40`; die Mindestlohn-42 bleibt unangetastet.)* — dieselbe Zeile. Ein normaler
   40-Std.-Vollzeitjob (CHF 6'788 = exakt der Median) wird „Teilzeit … hochgerechnet CHF 7'127" —
   CHF 339 erfunden; bei 39 Std. kippt die Aussage auf „über dem Median" (falsch).

   **✅ (d) `wageClaim`-Brief auch bei Befund `ok`** *(behoben `cbd422a`: der Befund entscheidet, nicht der Wohnort. Beim Bauen selbst gestolpert — mein erstes Gate fragte den nicht existierenden Nebenjob und hielt den Brief für alle offen; `getJobOptions` wusste es längst.)* — `briefGenerator.js:204` gated nur auf
   `kantonHatMindestlohn`, `:489` gated nur die *Zahlen*. GE/CHF 8'000: Brief behauptet
   „unter dem Mindestlohn … liegen dürfte" mit leeren Beträgen — die App hat den Verdacht
   selbst widerlegt. (Rechts-Prüfer + Code-Review unabhängig.)

   **✅ (e) Anzeige führt die 182h-Annahme wieder ein** *(behoben `cbd422a`: ohne Stunden ODER ohne Brutto-Basis zeigt das Instrument gar keinen Balken — jede Marke darauf ist Vollzeit UND brutto.)* — `LohnEinordnung.jsx:130`/`:105`: ohne
   Stunden bleibt `incomeFTE` roh, `rel` wird aber gegen den Vollzeit-Median gerechnet + Note
   „Für den Vergleich nehmen wir eine Vollzeitstelle an". Genau der Fehlalarm, den `c56272f`
   im Kapitel abgeschafft hat.

   **✅/⚠️ (f) `FinanzUebersicht.jsx:222` widerspricht sich in einer Karte** *(entschärft `cbd422a`. Beim Nachlesen subtiler als gemeldet: **beide Aussagen sind wahr, über verschiedene Fragen** — das Band misst das tatsächliche Monatseinkommen (armutsrelevant), das Barometer das Lohnniveau hochgerechnet. Gefixt ist der echte Fehler: die 6788 war HARTKODIERT (zweite Wahrheit) → `LOHN_REFERENZ.median`. Dazu Label „Einordnung" → „Was monatlich reinkommt". Die Bänder mischen weiterhin Armuts- (roh) und Median-Schwellen (FTE) in einer Skala — das ist ein Design-Entscheid, siehe Punkt 12.)* — Band-Label rechnet auf
   dem **Rohlohn**, das Barometer 11 Zeilen darunter auf **FTE**. 50%/CHF 3'400: „nahe der
   Armutsgrenze" über „Ihr Lohn: CHF 6'800 — nahe am Median".

   **✅ (g) `durchschnitt: 7996` unter BFS-Attribution** *(behoben `cbd422a`: ersatzlos raus, kein Ersatz erfunden. **Der Befund war zu gross:** `p10 4487`/`p90 12178` stehen wörtlich in der LSE-2022-Mitteilung — der `verify`-Kommentar war zu pessimistisch. Unbelegt war NUR der Durchschnitt. Dafür fand die Gegenprüfung einen NEUEN Blocker: die **LSE 2024** ist seit 25.11.2025 publiziert → Median 7024, p10 4635, p90 12526, alle drei belegt.)* — `de.js:2255` (+4 Spr.) nennt die Zahl
   namentlich und schreibt sie dem BFS zu; belegt ist nur der Median `6788`
   (BFS-Medienmitteilung 19.03.2024). Mittelwert/Perzentile stehen nur in **STAT-TAB**
   (nicht zitierbar). **Drei unabhängige Prüfer** (swiss-precision, link-checker, code-review).
   ⚠️ `lohnEinordnung.test.js:5` deckt 7996 in derselben Assertion wie den belegten Median ab
   („amtlich belegt") — der Test leiht der ungeprüften Zahl Autorität.

   **✅ (h) a11y-🔴 (a11y-Prüfer + Polygrafin unabhängig)** *(behoben `cbd422a` + `7000c54`:
   Deep-Varianten für Text — `readoutColor`/`accentText`/`dotTextColor` —, die kräftigen Töne
   bleiben der Grafik. Eigener Satz `mindestlohnBreachedLine` + im aria-Label, damit die
   Unterschreitung nicht mehr nur in der Farbe steht. Dazu der Regel-Konflikt Frucht-Farbe
   vs. WCAG 1.4.11: **die erste Vorlage an Stebler Studios war falsch gerechnet** — „Spur
   dunkler" macht es schlimmer (2.27→1.71→Tiefpunkt 1.05), weil die Frucht im Hellmodus
   dunkler ist als die Spur. Gelöst mit `lightDeep` (gleicher Farbton, weniger Helligkeit),
   Identitätsfarbe `light` unberührt; `lebensbereiche.contrast.test.js` rechnet nach.)*
   ↓ Fundtext Runde 8: rohes `palette.gold` als **Text**
   = **1.93:1** (nötig 4.5:1) in `LohnEinordnung.jsx:86,114` + `RegionalBarometer.jsx:121,129` —
   der Gold-Fall ist die Unter-Median-Lage, also die Zielgruppe. `readoutColor` (Deep) steht
   27 Zeilen höher fertig da; `MietVergleich.jsx:51` hat den Fix schon.
   **Und:** Mindestlohn-Unterschreitung **nur über Farbe** (WCAG 1.4.1 **Level A**) — Text in
   beiden Zuständen identisch, `aria-label` nennt sie nicht, und der ausformulierte Satz
   `lohnCheck.unterMindestlohn` rendert **nur** in `ChapterView`, nicht in `FinanzUebersicht`.

   **✅ (i) `unpaidWage` behauptet einen Betrag für einen unbekannten Zeitraum** *(behoben `cbd422a`: Zeitraum offen ⇒ Betrag offen; der Monatslohn steht als benannter Anhalt daneben.)* —
   `briefGenerator.js:531`: `{months}` bleibt „[bitte ergänzen]", der Betrag wird mit **einem**
   Monatslohn gefüllt. Wer 3 Monate schuldet, mahnt gedruckt ein Drittel.
0a. **Alt-PII auf der Platte löschen — Stebler Studios führt aus** (~85 MB, ausserhalb git):
   fünf Vor-Purge-Mirror in `_maloja-archiv/` (durchgehend Drittperson-Name) + `maloja_frontend_STRAY`
   (kein `.git`, nichts Einzigartiges, aber eigene veraltete `SESSION_START.md` = Zweitwahrheit)
   + `docs-archive-2026-07-14/_research-2026-05_BACKUP-vor-namensersetzung`.
   **Bleibt:** `maloja-mirror-PURGE2.git` (0 PII, HEAD `35bd840`) · `handoffs/` · die neue
   `HASH-LANDKARTE-vor-purge.md`. Der Purge ist damit erstmals auch lokal fertig.
   (In `research-2026-05/` sind die 11 Beispiel-Namen bereits auf `M./A. Muster` gehoben.)
0b. **Infomaniak-Panel `Permissions-Policy` → `geolocation=(self)` — GEPARKT zur Logins-/Backend-Phase** (Stebler-Studios-Entscheid 2026-07-14). Aktuell `geolocation=()` → **blockt den Opt-in-Standort der Notfall-Vorlesekarte** (einzige Folge). Panel-Handgriff, unabhängig von Logins, aber bewusst gebündelt. Der r7-`.htaccess`-Fix greift NICHT (`deploy.sh` löscht `dist/.htaccess`; Header laufen übers Panel). Gegenprüfen: `curl -sD - -o /dev/null https://malojaplana.ch/ | grep -i permissions-policy`. Merker: repo-`.htaccess` ist damit **vestigial**.
1. **Offene Kleinigkeiten aus der Sitzung 2026-07-15** (alle auf den zwei Feature-Zweigen):
   - **RM-Feinschliff:** Die neuen Strings (`lohnCheck.hoursMissing`, `briefe.jobPicker`,
     `lohnEinordnung.*`, `finanzen.sideEmployer*`) sind in rm Bau-Qualität, kein Endstand.
   - **Doppelte Kanton-Nennung** im Lohn-Brief: „sowie Genf — Art. 39K LIRT **(Kanton Genf)**".
     Die Vorlage hängt „(Kanton X)" an, die `gesetz`-Strings tragen den Kanton schon vorne.
     Betrifft alle 5 Kantone, ist pre-existing, reines Rauschen — kein Fehler.
   - **Marken-Kollision** im Miet-Barometer ist gefixt (`f6d45b9`), aber nur für „!" vs. Strich.
   - **`verify:true`-Fallback ohne Deckung:** Seit NE/BS belegt sind, trägt KEIN Kanton mehr
     `verify: true` — der neutrale Zweig in `wageClaimRefs` ist damit nicht mehr über einen
     echten Kanton getestet (Wächter dafür in `lohnRechtsstellen.test.js`).
2. **⭐ Tresor Phase 2b — Schritt 1.** Bestandsaufnahme
   2026-07-13 fertig (`secureStore.js` dormant/0 Importe, PBKDF2 100k, alle 4 🔴 real im
   Code bestätigt). Sicher beginnen — nichts ist aktiviert, reine Logik + Tests, **KEINE UI**:
   die 4 Blocker im dormanten `secureStore` fixen — (1) Doku-Blobs vor dem Verschlüsseln
   hydrieren · (2) `or5_*_prerestore`-Klartext mit-löschen · (3) Crash-Guard um
   `unpackRecord`/`atob` · (4) Backup bei aktivem Tresor nicht leer — plus PBKDF2 100k→600k
   (versioniert), Passphrase-Stärke, `VAULT_*`→`TRESOR_*`. Dann UI (Schritt 2), dann
   Voll-Zyklus live verifizieren (Schritt 3). Details: `docs/design/tresor-lock.md`.
   Bau-Freigabe nötig (berührt ALLE Daten — hohe Sorgfalt).
   ~~**Vorher/parallel — DEPLOY-BEREIT:** `main` (`e2953f7`, #72–#80) ist Deploy-Gate-GRÜN
   (Predeploy-Runde 5, Marke gesetzt).~~ **Überholt (2026-07-15):** `e2953f7` war der dritte
   tote `main`-Hash in dieser Datei; die Runden 4–7 (#72–#84) sind längst deployt und
   verified-live in `index-1f4c6867.js`. Der aktuelle Stand ist **Runde 8, Gate ROT** — siehe
   Punkt 0. ⚠️ Mindestlohn-Daten sind Stand 2026 (offiziell verifiziert) — vor JEDEM
   künftigen Jahreswechsel neu prüfen (GE/NE/BS indexiert).
   **Weiter geparkt (nicht blockierend) — whole-app-a11y/design-Sweep** (aus Runde-4/5-Vollbatterie):
   `MobileNav`-Schubladen-Fokus-Management (Fokus rein/zurück, Hintergrund inert) · Doppel-`h1`
   in `Lebenssituationen.jsx` (→ `PageTitle`) · `DocumentTresor`-Icon-Buttons 36→44px + Lösch-Rückfrage ·
   `LanguageSwitcher` kein 44px · `ChartsAdvanced` Farbenblind (rose-Duplikat + Hex statt Token) ·
   `htmlFor`/`id`-Kopplung breit (`LabeledField`-Migration fortsetzen) · Zweit-Formular-Tap-Ziele <44px ·
   `FinanzUebersicht`-StatusCard-SaaS-Muster · Token-Hygiene (Abstands-Drift, `PrimaryButton`-Reuse,
   Pseudo-Headings, `text.xs-1`) · Dashboard-`mvo.fields`-Doppel-Scan · `ChapterView:1785`-`.replace`-Kette ·
   2 ungeschützte `localStorage`-Zeilen · Meta-CSP als HTTP-Header · AHV Phase B.
3. **rm-Gegenlese** der neuen Keys (`TODO(rm)` gesetzt): `ipvStatus.*`, `barKurz.*`,
   `schnellcheck.ipvSubsumed/ipvEnthalten`, `sozialhilfe.repayment*` — Muttersprachler:in.
   **Neu dazu:** die in Predeploy-Runde 2 ergänzten RM-Vus-Formen (`{sie,du}`-Split) sind
   Best-Effort und gehören in dieselbe Gegenlese.
4. **Design-Vision offen (Discussion/Build):** #3-Instrumente EL (qualitativ) · Baum↔Obstgarten
   (Entscheid E) · Haus-Karte vs. Skeuo-Liste Metapher-Abgleich. Backlog: `docs/design/design-backlog.md` E.
   *(⚠️ Überschneidet sich mit Punkt 8 — beide Einträge stehen bewusst noch da; Zusammenlegen
   ist ein Entscheid von Stebler Studios, nicht des Predeploys.)*
5. **Tresor-Lock bauen** (Konzept steht, `docs/design/tresor-lock.md`): opt-in Passphrase-
   Verschlüsselung aller `or5_*`-Stores, Backup beim Setup. Erst mit ausdrücklicher Freigabe;
   Native-Secure-Safe-Vision (Ordner auf dem Gerät + Keychain/Keystore) → „Logins-Phase"
   zusammen mit App-Store/iOS-Recherche.
6. **Rechts-Feinschliff (offen, belegt vorbereitet):** exakte Kantons-Mechanik IPV automatisch
   vs. Antrag (schärft die Verzweigung); Rückerstattungs-Zahlen sind ZH-Werte (kantonal prüfen).
7. **GitHub-Support-Ticket** (Stebler Studios, Account-Aktion): nach dem Historie-Purge die
   gecachten Commits + `refs/pull/*/head` entfernen lassen (Formular
   support.github.com/contact/private-information). Ein normaler `git clone` ist sauber;
   die PR-Refs tragen die Alt-Gmail noch. Force-push erreicht sie nicht. **Zusätzlich:** die
   zwei privaten Alt-Mails standen kurz in `SESSION_START.md` (Commit `14d4196`, per PR #54
   bereinigt) → im selben Ticket den Cache dafür mit entfernen lassen.
8. **Design-Vision (Diskussion, kein Build) — gewählte Reihenfolge: erst §3, dann §2:**
   §3 Schnellchecks als Instrumente (Prototyp mit *einem* Check), §2 Obstgarten vs. ein
   Baum (Lean: beim einen Baum bleiben). Siehe `docs/IDEEN.md` „Nächste Schritte".
   *(⚠️ Überschneidet sich mit Punkt 4 — siehe dort.)*
9. **`docs/archive` Namen-PII** (offen): Persona-Beispiele mit echtem Namen/Geburtsjahr —
   der Purge ersetzte nur Mail-Strings, nicht Fliesstext. Separater Schritt auf ausdrückliche Freigabe.
10. Offen a11y (nicht-blockierend): #4 Fokusring-Farbe (Kür). rm-Gegenlese (Führerausweis
   + fr/it/rm generell).
11. **✅ ENTSCHIEDEN — Regel-Konflikt Frucht-Farbe vs. WCAG 1.4.11** (Stebler Studios,
   2026-07-15; umgesetzt in `7000c54`, Regel 3a in `docs/design/farb-und-daten-system.md`).
   Die Frucht-Regel der Doku bleibt; die Füllung nimmt einen eigenen **Füll-Ton**
   (`bereichFillColor` → `lightDeep`): gleicher Farbton, weniger Helligkeit.
   Birne `#7E9A4E`→`#6C8343` (3.03/3.58 ✓), Haselnuss `#A8895E`→`#947750` (3.00/3.54 ✓).
   `light` bleibt unberührt (Identität am Baum, den Karten, Reitern, Arztkoffer — und der
   Helligkeits-Kanal der Reihenfolge). **Nur hell** — im Dunkeln trägt `dark` schon (4.83/4.33).
   ⚠️ **Lehrstück:** Die erste Vorlage schlug „Spur dunkler" vor und behauptete ≈3.1–3.4:1.
   Das war **geraten und falsch** — nachgerechnet wird es schlimmer (2.27→1.71, Tiefpunkt
   ~1.05), weil die Frucht im Hellmodus dunkler ist als die helle Spur. Erst der zweite,
   gerechnete Anlauf trug. In einer Runde, die geratene Zahlen aufräumt, war das die falsche
   Art zu fragen: **erst rechnen, dann vorlegen.**
   Neu offen daraus: neue Instrumente brauchen für ihren Bereich ein `lightDeep`, sonst
   fällt `bereichFillColor` still auf `light` zurück (Dev-Warnung + Test hüten das).
12. **Design-Entscheid offen — Einkommens-Bänder in `FinanzUebersicht.jsx:~214`** (aus
   Runde 8, Fund (f)): Die Bänder mischen **zwei Bezugssysteme in einer Skala** — die
   Armuts-Schwellen (2279, 4000) messen das TATSÄCHLICHE Monatseinkommen, die
   Median-Schwellen (`LOHN_REFERENZ.median`, 10000) messen das Lohnniveau, das darunter
   liegende Barometer rechnet auf Vollzeit hoch. Beide Aussagen sind wahr, über
   verschiedene Fragen — nebeneinander lasen sie sich als Widerspruch („nahe der
   Armutsgrenze" über „CHF 6'800 — nahe am Median"). Entschärft ist es über das Label
   („Was monatlich reinkommt"), gelöst ist es nicht. Offen auch: sind 2279 / 4000 belegt,
   und auf welcher Basis (netto/brutto)? Kein Blocker, aber ein echter Design-Entscheid.
13. **Governance-Reste aus Runde 8** (nicht blockierend, aber Arbeit ausserhalb git):
   - `.claude/settings.json` ist weiterhin **ungetrackt** (`.gitignore:21`), enthält aber
     deny/ask-Liste **und** den Tests-vor-Commit-Hook. Massstab der eigenen `.gitignore`:
     „Was nicht in git ist, ist nicht sicher."
   - Darin: `Bash(git push:*)` steht **gleichzeitig** in `allow` und `ask` → `allow` gewinnt,
     `ask` läuft leer. Der `allow`-Block existiert überhaupt und enthält als einzigen Eintrag
     genau `git push` — der Memory-Entscheid lautet „nur deny+ask, kein allow".
   - `public/icon-preview.html` wird nach `dist/` gespiegelt → live unter
     `malojaplana.ch/icon-preview.html`, mit Inline-`<script>` und **ohne** die Meta-CSP aus
     `index.html`. Nicht ausnutzbar (nur statische Arrays), aber ein Dev-Werkzeug auf Prod.
   - `frame-ancestors 'none'` in `index.html:6` ist **wirkungslos** — die CSP-Spec ignoriert
     die Direktive in `<meta>`. Klickjacking-Schutz sieht vorhanden aus, ist es nicht.
     → gehört als HTTP-Header ins Infomaniak-Panel, zusammen mit Punkt 0b.
   - Stand „2 ungeschützte `localStorage`-Zeilen" ist **falsch**: es sind **12 aktive**
     (+9 im dormanten Tresor). Keine neu aus Runde 8.

## Nicht anfassen (Leitplanken)

> Gerettet aus dem archivierten `PROJECT_STATUS.md`/`PROJECT_HANDOFF.md`. Identität
> (Zero-Deps, Offline/Calm/Deterministic/Privacy) steht in `CLAUDE.md` — hier nur die
> konkreten Do-Not-Touch-Punkte.

- **localStorage-Keys `or5_*`** — keine Migrationen ohne ausdrückliche Freigabe (User-Daten).
- **Dependencies** — nur React + React-DOM als Runtime-Deps; kein Bloat.
- **Build-Budget** — Phase 1 < 200 KB gzip, Phase 2 < 250 KB gzip.
- **Build-Tool Vite** und **Inline-Styles/tokens.css** nicht wechseln (kein CSS-in-JS).
- **SKOS Grundbedarf** — pauschal nach Haushaltsgrösse ist *bewusste* Vereinfachung (KI-001), kein Refactoring.
- **PremiumSubsidy/IPV-Berechnung** — nicht anfassen.
- **Gross/Netto-Toggle** und **Multi-Person-Haushaltsmodell** — bewusst zurückgestellt.
- **KI-007:** kein Web-Crypto-Fallback — offen, niedrige Priorität.

## Merker (Fallen)

- **⭐ Vor jedem Deploy: ist die Version in `package.json` schon getaggt?** (`git tag -l v<version>`).
  Am 17.09. zweimal nicht angehoben — `deploy.sh` meldet dann nur «Tag existiert bereits», und der
  neue Live-Stand hätte kein eigenes Tag. Release-PR (Version + Changelog-Block) vor der Marke.
- **Mehrere parallele PRs mit CHANGELOG-Zeilen** kollidieren nur dort: in einem Release-Zweig
  zusammenführen (wie #208); GitHub zeigt die Einzel-PRs danach als gemergt.
- **Service Worker nur hinter dem BetaGate** (`registerServiceWorker` in `AppInner`): Offline-Tests
  brauchen den Beispiel-Modus oder `or5_beta_access` (nur lokal setzen). Messaufbau lokal:
  `vite preview`, Server stoppen, neu laden (K59).
- **JS-`\b` versagt bei Akzenten** (`êtes` → «tes»): für Anrede-Prüfungen `\p{L}`-Grenzen nehmen.

- **⭐ Sitzung IMMER aus `maloja-frontend/` starten, nie aus `~/Projects/maloja plana/`.**
  Claude Code sucht `.claude/` relativ zum Arbeitsverzeichnis. Auf der Container-Ebene gibt es
  keins → die 9 Prüf-Agenten und die Slash-Commands laden nicht, `/maloja-predeploy` ruft ins
  Leere. Es ist **der Ort, nicht das Timing** — ein Neustart behebt es nicht. (Teuer gelernt
  in Runde 8: die Doku behauptete an zwei Stellen „lädt beim nächsten Sitzungsstart".)
- **⭐ Gegenprobe vor Glauben — Schritt 1 jedes Predeploys:** `git rev-parse HEAD` und
  `git diff <LIVE-Marker>..HEAD -- src/`. Diese Datei kann einen Merge alt sein; ist das
  `src/`-Delta nicht leer, hängt ein echter Deploy — egal was oben steht. (In Runde 8 stand
  hier „`main` IST live, kein Deploy hängt", während 23 `src/`-Dateien davor lagen.)
- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: eigenen Branch ab `main` nehmen (nicht nur
  eigene Dateien stagen — Datei-Isolation ≠ Branch-Isolation; teuer gelernt bei PR #19).
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
- **Historie-Purge IMMER auf frischem `git clone --mirror` von GitHub**, nie dem lokalen
  Repo — dem können Refs fehlen (Alt-Tags/PR-Branches), die sonst die Alt-Historie am
  Leben halten. Lokales `git config user.name` muss „Stebler Studios" sein (nie Vorname).
