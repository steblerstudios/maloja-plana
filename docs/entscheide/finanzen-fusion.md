# Kapitel Finanzen und Finanz-Übersicht zusammenlegen — Entscheidungsblatt

*Vorbereitet 24.10.2026 auf `main` `4299bfb9` (Zweig `feat/finanzen-fusion`). Entscheid: Stebler Studios.*

> ✅ **Plan freigegeben 24.10.2026, kurz vor 01:00** (Stebler Studios: «Der Plan passt, aber bei den
> Entscheiden will ich anders»). Die vier Entscheide unten sind aus dem Auswahl-Dialog derselben
> Sitzung übernommen. Noch nichts gebaut.

**Die Frage:** Das Kapitel Finanzen und die Ansicht «Finanz-Übersicht» (`#finanzuebersicht`)
zeigen teils dasselbe. Soll es nur noch einen Ort geben?

## 1 · Heute-Zustand — gemessen am Code

| Baustein | Kapitel Finanzen (`ChapterView.jsx`) | Finanz-Übersicht (`FinanzUebersicht.jsx`) |
|---|---|---|
| Lohn-Barometer | ja (Z. 2224) | ja, dazu Armutsgrenze und Branchen-Chips |
| Monatssaldo | «Jeden Monat bleiben» (Z. 1899), Rechnung `utils/monatsrechnung.js` | «Budget-Bilanz», Rechnung `budgetSync.js` |
| IPV | grüner Hinweis (Z. 2206) + Eintrag in «Passend» | Statuskarte |
| Nur Übersicht | — | Lebensbaum, Steuern, Sozialhilfe, EL, Vermögen, Gesundheitskosten, KK-Last, Reserve-Tank, Mietvergleich, Drucken |

🛑 **Die zwei Saldi rechnen verschieden.** `monatsrechnung.js` zählt als Einnahmen Lohn,
Familienzulagen und erhaltene Alimente. `budgetSync.js` zählt dazu Partner/in und Nebenerwerb, bei
den Ausgaben Kinderbetreuung, Hypothek, Gebäudeversicherung und Säule 3a. Mit einem dieser Posten
stehen heute zwei verschiedene «bleibt»-Beträge in der App (im Beispiel Maria: 2’480 und 2’459).
⟨korrigiert 24.10.2026 nach Fachprüfung⟩ Hier stand «und zieht die IPV ab». **Das stimmt nicht:**
`remaining` rechnet mit der vollen Prämie (`budgetSync.js:152, 178–179`); die Budget-Seite zeigt die
IPV nur als eigene Zeile daneben (`BudgetSync.jsx:325–335`). Der Kommentar in
`FinanzUebersicht.jsx` (~Z. 184) sagt es ebenso ungenau — fällt mit Bauschritt 2 weg.

## 2 · Entscheide (24.10.2026)

1. **Saldo: beide zeigen, klar benannt.** Keine der zwei Rechnungen wird still ersetzt. Der Entscheid
   vom 21.10.2026 («Charts rechnet wie das Kapitel») bleibt unberührt.
   *Vorschlag Claude, offen für die Copy-Prüfung:* oben «Ihr Monat» (Kapitel-Rechnung), darunter
   «Monat des Haushalts» (Budget-Rechnung) — die zweite Zeile nur, wenn sie vom ersten Betrag
   abweicht, mit einem Satz, was zusätzlich mitzählt.
2. **Lebensbaum: ins Kapitel Finanzen.** Der Entscheid vom 20.09.2026 (Baum bei den Finanzen, «zuerst,
   was gewachsen ist — dann die Rechnung») gilt weiter, nur der Ort wechselt.
3. **Sozialhilfe und EL: eingeklappt unter «Weitere Ansprüche»,** von selbst offen, sobald ein
   Anspruch möglich ist (`sozialhilfe.eligible`, `sozialhilfe.efbEntscheidet`, `el.eligible`).
4. **Probiermodus: das Kapitel Finanzen läuft dort mit Beispieldaten.** Heute steht
   `finanzuebersicht` in `SANDBOX_VIEWS` (`main.jsx`). Aufwand vor dem Bau prüfen.

## 3 · Reihenfolge im Kapitel nach der Zusammenlegung

| # | Teil | Herkunft |
|---|---|---|
| 1 | Kopf | bleibt |
| 2 | Monatssaldo nach Entscheid 1, aufklappbar mit Einnahmen- und Ausgabenzeilen; Brutto: Satz `budgetSync.availableNeedsNetto` | Kapitel + Budget-Bilanz |
| 3 | Ankunftsmoment, Spiegelsatz | bleibt |
| 4 | Abschnittsliste (Formular) | bleibt |
| 5 | Lebensbaum (Entscheid 2) — nach den Angaben, vor der Rechnung | Übersicht |
| 6 | Wo Sie stehen: Lohn-Barometer, Armutsgrenze, Branchen-Chips | Übersicht, ersetzt Z. 2224 |
| 7 | Was daraus folgt: Steuern (+ Kantonssteuer-Orientierung), IPV, KK-Last, Gesundheitskosten*, Vermögen* mit Reserve-Tank | Übersicht, IPV-Karte ersetzt Z. 2206 |
| 8 | Weitere Ansprüche: Sozialhilfe, EL (Entscheid 3) | Übersicht |
| 9 | Passend zu diesem Bereich: Neuer Job, Lohnausweis, Budget, Behördendossier | Kapitel |
| 10 | Übersicht drucken (Export-Vorschau, `druckAbschnitte`) | Übersicht |
| 11 | Hinweis zur Schätzung | Übersicht |
| 12 | Als Nächstes | bleibt |

\* nur, wenn etwas erfasst ist. Mietvergleich → Kapitel Wohnen, neben den Wohnkostenanteil.

## 4 · Bauschritte (je ein Commit)

1. Saldo-Anzeige nach Entscheid 1 (beide Rechnungen bleiben; über den `swiss-precision-pruefer`).
2. Bausteine aus `FinanzUebersicht.jsx` in eine lazy geladene `FinanzAuswertung` lösen (Startbündel 65 kB).
3. Kapitel in die Reihenfolge oben; neue Texte in alle 5 Sprachen.
4. `#finanzuebersicht` öffnet das Kapitel Finanzen bei Teil 5; Werkzeug-Register, Dashboard-Highlight,
   Suche zeigen aufs Kapitel. Die übrigen Aufrufer laufen über die Umleitung weiter.
5. Mietvergleich ins Kapitel Wohnen.
6. Probiermodus (Entscheid 4).
7. Tests anpassen (nicht löschen), FEATURES.md, `maloja-review`, Browser 375 px, Entwurfs-PR. Kein Merge.

## 5 · Stand Bauschritt 1 (24.10.2026)

Gebaut: unter «Jeden Monat bleiben» die Zeile «Mit dem ganzen Haushalt bleiben / fehlen CHF …»
mit Erklärsatz (`haushaltsSaldo`, `ChapterView.jsx`; Test `finanzenHaushaltsSaldo.test.js`).
Geprüft von `swiss-precision-pruefer` und `copy-pruefer`, Funde eingearbeitet (Satzbau Erklärzeile,
«Säule 3a», kein «CHF NaN», kein Netto-Hinweis unter einer Brutto-Zahl).

**Offen, für Stebler Studios:**
- **Eigener Lohn brutto:** Die grosse Zahl oben rechnet weiter mit dem Brutto (Fassung 5, nur
  «netto» fällt weg). Die Haushalts-Zeile schweigt dort, damit nicht zwei Aussagen gegeneinander
  stehen. Soll die Hauptzahl bei brutto durch den Netto-Satz ersetzt werden wie im Budget?
- **Kapitel-Saldo negativ oder ohne eigenen Lohn:** `monatsUebersicht` liefert dann nichts, und
  damit fehlt auch die Haushalts-Zeile — gerade bei Paaren, wo der Haushalt positiv sein kann.
  Gehört zum Umbau in Bauschritt 3.
- **Obere Zeile benennen?** Copy-Prüfer: «Jeden Monat bleiben» sagt nicht, dass es ums eigene
  Einkommen geht. Vorschlag «Vom eigenen Einkommen bleiben jeden Monat» — ändert den Wortlaut
  von Fassung 5, darum nicht ohne Zuruf.

> ✅ **Entschieden 24.10.2026, nach Bauschritt 1** (Stebler Studios, Auswahl-Dialog, je die
> empfohlene Option) — die drei Punkte oben:
> - **Brutto:** Ist der eigene Lohn brutto erfasst, steht oben keine Zahl, sondern die Netto-Frage
>   wie auf der Budget-Seite (`budgetSync.availableNeedsNetto`).
> - **Minus / kein eigener Lohn:** Der Block verschwindet nicht mehr. Im Minus «… fehlen CHF …» wie
>   im Spiegelsatz, darunter die Haushalts-Zeile, wenn sie abweicht.
> - **Benennung:** «Jeden Monat bleiben» bleibt der Normalfall. Steht die Haushalts-Zeile darunter,
>   heisst die obere Zeile «… vom eigenen Einkommen».

> ✅ **Nachtrag 24.10.2026** (Stebler Studios: «Ja, gleiche den Spiegelsatz an: bei brutto
> erfasstem Lohn kein «Es bleiben CHF …» mehr»): Der Spiegelsatz (`MirrorCards.jsx`) nennt bei
> brutto erfasstem eigenem Lohn Einkommen und Ausgaben, aber keinen Rest («Es bleiben / Es fehlen»).

## 6 · Stand Bauschritt 2 (24.10.2026)

Die Auswertung steht in `src/components/FinanzAuswertung.jsx`: `finanzWerte` (eine Rechnung),
`druckAbschnitte` + Druck, `LohnStandort` (Barometer, Armutsgrenze, Branchen-Chips),
`auswertungsKarten` (Steuern bis KK-Last), `UebersichtDrucken`, `auswertungsHinweis`. Die
Finanz-Übersicht setzt sich daraus zusammen; `druckAbschnitte` wird von dort weiter exportiert.
Reiner Umbau: gerenderter Text vorher/nachher bei Maria und einem knappen BE-Profil Zeichen für
Zeichen gleich; einzig der Druckknopf sitzt jetzt unter statt im Zwei-Spalten-Raster (volle
Breite wie vorher). Drei Tests, die den Quelltext lesen, zeigen auf die neue Datei.

## 7 · Stand Bauschritt 3 (24.10.2026)

Das Kapitel Finanzen steht in der Reihenfolge aus §3. Nach dem Formular lädt ChapterView
`FinanzenImKapitel` (lazy, `components/FinanzAuswertung.jsx`): Lebensbaum, Lohn-Barometer mit
Armutsgrenze und Branchen, «Was sich daraus ergibt» (Steuern, Orientierung, IPV, KK-Last,
Gesundheitskosten*, Vermögen*, Reserve-Tank), «Weitere Ansprüche» (Sozialhilfe, EL; offen bei
`sozialhilfe.eligible`, `efbEntscheidet` oder `el.eligible`). Nach «Passend» Drucken und Hinweis.
Weg: grüner IPV-Hinweis und das eigene Barometer im Kapitel (die IPV-Karte und der neue
Baustein ersetzen sie; `aktuellesKapitel` wandert mit). «Passend»: Neuer Job, Lohnausweis,
Monatsbudget, Behörden-Dossier. Vier verwaiste Texte aus fünf Sprachen entfernt
(`orientation.contextIpv`, `passend.uebersichtSub/ipv/ipvSub`). `main.jsx` reicht `chapters`,
`lang`, `onSelectChapter` ans Kapitel (für den Lebensbaum).

Noch nicht umgezogen: der Mietvergleich (Bauschritt 5) — er steht weiter nur auf der Übersicht.
Der Querverweis am Feld «Monatliches Einkommen» zeigt noch auf `finanzuebersicht` (Bauschritt 4).
Ebenso für Bauschritt 4: Die Steuer-Karte sagt im Kapitel «Angeben lässt sich das im Kapitel
«Finanzen & Geld»» — im Kapitel selbst ein Verweis auf sich. Copy-Prüfer 24.10.: Texte
übernommen («Was sich daraus ergibt», IT «Aiuto sociale», EN «missing», FR «son propre revenu»).

## 8 · Stand Bauschritt 4 (24.10.2026)

`finanzuebersicht` ist keine eigene Seite mehr, sondern ein Alias: `UMLEITUNGEN` in
`utils/hashRouter.js` → Kapitel 2 (finanzen), Sprungmarke `mp-finanz-auswertung`. Greift beim
Direktlink, bei Lesezeichen, bei der Zurück-Taste (`parseHash`) und bei jedem Knopf
(`handleNavigate`); die Adresse zeigt danach `#/chapter/2`. Menü, Suche, Dashboard, Lebensbaum,
der Querverweis am Lohn-Feld und die Rechner (Steuer, IPV, Vorsorge, Sozialhilfe, Mietzins …)
rufen unverändert `finanzuebersicht` auf und landen so bei der Auswertung. Register: Suchwort
«finanzen» entfernt (das Kapitel steht selbst in der Suche). `main.jsx`: kein Render-Zweig, kein
Lazy-Import der Übersicht mehr; `finanzuebersicht` aus `SANDBOX_VIEWS`.

**Korrektur zum Plan:** `SANDBOX_VIEWS` heisst nicht «läuft ohne Profil», sondern «hier erscheint
der Knopf ‹neben dem eigenen Stand rechnen›». Bauschritt 6 / Entscheid 4 ist darum neu zu lesen:
Soll dieser Knopf im Kapitel Finanzen erscheinen (bei der Auswertung)? Bis dahin fehlt er dort.

**Bleibt bewusst:** `FinanzUebersicht.jsx` wird nicht mehr angezeigt, aber noch von gut zehn
Tests gerendert (IPV, Steuern, Sozialhilfe). Die ziehen in Bauschritt 7 auf `FinanzenImKapitel`
um, dann fällt die Datei weg. Der Steuer-Satz «Angeben lässt sich das im Kapitel «Finanzen &
Geld»» ist ein geteilter Text (Steuerrechner, Dossier) und bleibt; im Kapitel ist er richtig,
nur nahe am eigenen Formular.

> ✅ **Entschieden 24.10.2026** (Stebler Studios: «Ja, der Knopf «neben dem eigenen Stand rechnen»
> soll im Kapitel Finanzen bei der Auswertung erscheinen»). Ersetzt Entscheid 4. Umgesetzt: der
> Knopf «Probier-Modus» steht am Anfang der Auswertung (`FinanzenImKapitel`, `data-weg="probieren"`),
> nur ausserhalb von Beispiel und laufendem Probiermodus (`main.jsx` gibt `onEnterSandbox` nur dann
> weiter). Im Probiermodus schreibt das Kapitel in die Probierdaten (`writeData`, `main.jsx`), nie
> ins Profil.

**Offen, übrige:** Lage des Baums im Browser prüfen · rm-Texte gegenlesen.
