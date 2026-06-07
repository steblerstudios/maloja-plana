# Design Vision Gap — Maloja Plana

> Stand: 2026-06-07
> Keine Implementierung. Keine Roadmap. Nur Beobachtung.
> Frage: "Warum fühlt sich Maloja heute noch nicht wie die Maloja an, die wir ursprünglich entworfen haben?"

---

## A. Ursprüngliche Vision

Die Design Language Registry beschreibt Maloja Plana als:

> "Ein Ort, kein Dashboard."

Der Ort sollte sich anfühlen wie:

| Element | Gefühl |
|---------|--------|
| Malojapass | Ein Weg durch das Leben — Schritt für Schritt, mit weiter Sicht |
| Helvetia | Hoheitlich, beschützend, weiblich, schweizerisch |
| Fünfliber | Wert, Materialität, Gewicht in der Hand |
| Kuhglocke | Klang, Alp, Ruhe, Rhythmus |
| Schweizer Post | Zuverlässigkeit, Ordnung, der Brief kommt an |
| Wegweiser | Gelbe Schilder, klare Richtung, du bist nicht verloren |
| Dashboard als Landschaft | Nicht Metriken, sondern Topografie — Berge, Wege, Stationen |
| Papier / Stein / Holz | Materialien, die man anfassen kann |
| Nebel | Weiche Übergänge, nichts Hartes |

Die Emotion: **Sicherheit, Stille, Materialität, Schweizer Präzision mit menschlicher Wärme.**

---

## B. Aktueller Zustand

### Was existiert als Code

| Element | Implementiert? | Wo? |
|---------|---------------|-----|
| Malojapass-SVG | **Ja** | Dashboard.jsx — 3-Layer-Bergprofil, Trail, Stationen |
| Easter Eggs (Kuh, Matterhorn, Edelweiss, Uhr, Schokolade, Fahne) | **Ja** | Dashboard.jsx — erscheinen mit Fortschritt |
| Helvetia | **Ja** — als Icon | IconSystem.jsx — Behörden-Kapitel-Icon (48×48 SVG) |
| Fünfliber | **Ja** — als Icon | IconSystem.jsx — Finanzen-Kapitel-Icon (48×48 SVG) |
| Kapitel-Icons auf Passweg | **Ja** | Dashboard.jsx — 7 Stationen, Maturity-System |
| Orientierungssätze (Helvetia Layer) | **Ja** — 13 Sätze | ChapterView.jsx, constants.js |
| Farbpalette (Creme/Salbei/Anthrazit/Sand) | **Ja** — definiert | constants.js, tokens.css |
| DM Sans lokal | **Ja** | Geladen, aktiv |
| Tier-System (Core/Supporting/Protective) | **Ja** | Dashboard.jsx |
| Micro-Feedback (Stempel, Check-Pop, Lock-Close) | **Ja** — definiert | tokens.css Keyframes |
| Focus-Ring Sand | **Ja** | tokens.css |

### Was existiert nur als Idee oder Dokument

| Element | Status |
|---------|--------|
| Kuhglocke als Feedback-Sound oder -Metapher | **Nur Name** — nirgends im UI |
| Schweizer Post als Zuverlässigkeits-Metapher | **Nicht spürbar** — kein visueller Bezug |
| Wegweiser / gelbe Schilder | **Nicht umgesetzt** — keine Wegweiser-Metapher im UI |
| Nebel / weiche Übergänge / Transparenzen | **Nicht umgesetzt** — alles ist flat und solid |
| Papier-Textur / Stein-Tiefe / Holz-Wärme | **Nicht spürbar** — keine Materialität |
| Schatten (4 definierte Stufen) | **Fast nicht genutzt** — 2 Vorkommen von 4 definierten |
| Dashboard als begehbare Landschaft | **Ansatzweise** — Pass-SVG ja, Rest ist Liste |
| Lebensweg als durchgehende Metapher | **Nur im Dashboard** — in Kapiteln verschwindet es |
| Editorial Layout (Magazin statt Admin) | **Nicht erreicht** — 12px/600 dominiert |
| Emotionale Differenzierung schwerer Kapitel | **Nicht vorhanden** — Schulden = Wohnen = Basis |
| Typografische Hierarchie (15px Body) | **Nicht umgesetzt** — 12px ist der faktische Body |

### Was technisch vorhanden, aber kaum sichtbar ist

| Element | Problem |
|---------|---------|
| Helvetia-Icon (Behörden) | Wird bei 14–18px gerendert — Details unsichtbar |
| Fünfliber-Icon (Finanzen) | Wird bei 14–18px gerendert — Lorbeerkranz, Perlrand unsichtbar |
| Orientierungssätze | 11px, Sage, mit Unicode ○ — wirken wie Systemhinweise, nicht wie Orientierung |
| Stempel-Animation (mp-stamp) | Nur 1× verwendet (100%-Zustand im Dashboard) |
| Check-Pop / Lock-Close | Nur 1× verwendet (ZipExport) |
| Maturity-System der Icons | Funktioniert, aber die Grössen-Differenz (26→34px) ist subtil |
| Akzentfarben (Gold, Sage, Rose, Sky, Sand) | Vorhanden, aber zu selten und ohne System eingesetzt |

---

## C. Sichtbare Lücken

### Die 5 grössten Wahrnehmungs-Lücken

**1. Materialität fehlt komplett**

Die Vision spricht von Papier, Stein, Holz, Nebel. Die App hat: flache, solide, uniforme Flächen. Kein Schatten, keine Textur, keine Tiefe. Die Hände greifen ins Leere.

**2. Der Ort endet am Dashboard**

Der Malojapass ist emotional wirksam — aber sobald man ein Kapitel betritt, verschwindet jede Ortsmetapher. Man ist in einem Formular. Der Weg, die Landschaft, die Stationen — alles weg.

**3. Typografie erzählt nichts**

12px/600 überall. Keine Hierarchie, kein Rhythmus, kein Editorial. Die Vision beschreibt ein Magazin — die Realität ist ein Admin-Panel. Text wird nicht gelesen, sondern gescannt — weil alles gleich aussieht.

**4. Schwere Themen werden nicht aufgefangen**

Schulden, Sozialhilfe, Behörden — emotional die schwersten Räume — sehen identisch aus wie "Persönliche Basis". Kein empathischer Ton, keine visuelle Wärme, keine andere Behandlung. Die Vision sagt: "Emotionally heavy topics need warmth most." Die Realität: kälteste Darstellung.

**5. Schweizer Symbolik lebt nur in Icons**

Helvetia, Fünfliber, Kuh — alles existiert als handwerklich hochwertige SVGs. Aber sie sind 14–18px klein. Man sieht sie nicht. Die Symbolik ist da, aber sie wirkt nicht. Ein Fünfliber in 14px ist kein Fünfliber — er ist ein grauer Kreis.

---

## D. Die 10 grössten Unterschiede

| # | Vision | Realität | Kluft |
|---|--------|----------|-------|
| 1 | **Ort** — man betritt einen Raum | Formular — man füllt Felder aus | Fundamental |
| 2 | **Materialität** — Papier, Stein, Holz | Flat, uniform, technisch | Komplett fehlend |
| 3 | **Typografie** — Editorial, Magazin, Hierarchie | 12px/600, Admin-Panel | Gegenrichtung |
| 4 | **Schweizer Symbole** — gross, stolz, sichtbar | 14px Icons, kaum erkennbar | Verschenkt |
| 5 | **Emotionale Differenzierung** — warm bei schweren Themen | Gleichförmig kalt | Invertiert |
| 6 | **Nebel & Weichheit** — Transparenzen, Übergänge | Harte Kanten, solide Farben | Nicht begonnen |
| 7 | **Wegweiser** — "Du bist hier, dort geht es weiter" | Keine Navigation-Metapher in Kapiteln | Fehlt ganz |
| 8 | **Atemraum** — grosszügiger Weissraum | Kompakte Zeilen, 12px-Dichte | Zu wenig |
| 9 | **Micro-Delight** — Stempel, Häkchen-Pop, Feedback | Definiert, aber 2× verwendet | Schlafend |
| 10 | **Lebensweg** — durchgehende Pass-Metapher | Nur auf Dashboard, verschwindet in Kapiteln | Abgebrochen |

---

## E. Die 3 wichtigsten Hebel

### Hebel 1: Typografie — von Admin zu Editorial

**Warum der grösste Hebel:**

Typografie berührt jede einzelne Zeile der App. 12px → 15px Body, 600 → 400/500 Default-Gewicht, mehr Zeilenhöhe — das würde die gesamte Atmosphäre verändern, ohne ein einziges Feature zu bauen.

**Was sich ändern würde:**
- Die App wirkt sofort ruhiger, erwachsener, lesbarer
- Hierarchie wird sichtbar (Titel ≠ Label ≠ Body ≠ Hint)
- Editorial statt Admin
- Die Orientierungssätze wären lesbar statt winzig

**Metapher:** Heute flüstert die App in 12px. Die Vision sagt: sprich ruhig und deutlich.

---

### Hebel 2: Materialität — von flat zu greifbar

**Warum der zweitgrösste Hebel:**

Die definierten Schatten und Tiefen existieren bereits als Tokens. Sie werden nur nicht eingesetzt. Schatten + subtile Transparenzen + mehr Tiefenabstufung (up → surface → top) würden den "Ort" spürbar machen — ohne neue Designarbeit.

**Was sich ändern würde:**
- Karten heben sich vom Hintergrund ab → Raum entsteht
- Tiefenwirkung → man schaut "in" etwas hinein
- Nebel-Qualität durch weiche Transparenzen → weniger technisch
- Die Icons hätten mehr Bühne

**Metapher:** Heute ist die App ein Blatt Papier. Die Vision sagt: es ist ein Raum mit Boden, Wänden und Licht.

---

### Hebel 3: Schweizer Symbole sichtbar machen

**Warum der dritte Hebel:**

Die handwerkliche Arbeit ist getan — Helvetia, Fünfliber, Kuh, Malojapass, alle 40 Icons sind hochwertig. Aber sie werden bei 14–18px gerendert, wo ihre Details verschwinden. Grössere Darstellung an wenigen Schlüsselstellen würde die gesamte Schweizer Identität aktivieren.

**Was sich ändern würde:**
- Kapitelüberschriften mit grossem Icon → Schweizer Charakter sofort sichtbar
- Helvetia bei 48px ist eine Figur — bei 14px ist sie ein Fleck
- Der Fünfliber bei 48px zeigt Lorbeerkranz und Kreuz — bei 14px ist er ein grauer Punkt
- Die App sagt visuell: "Das ist schweizerisch"

**Metapher:** Die Symbole sind wie Briefmarken in einem Album — kunstvoll, aber eingeklebt und zu klein zum Erkennen. Die Vision sagt: sie sind die Wappen über der Tür.

---

## Zusammenfassung

Die Maloja, die wir entworfen haben, ist ein Ort.
Die Maloja, die existiert, ist ein Formular mit einem schönen Eingang.

Der Malojapass-Moment auf dem Dashboard funktioniert. Er beweist, dass die Vision real werden kann. Aber sobald man den Pass hinter sich lässt und ein Kapitel betritt, ist man in einer anderen Welt — einer technischen, dichten, gleichförmigen Welt ohne Materialität, ohne Symbolik, ohne Atemraum.

Die Lücke ist nicht: "Es fehlen Features."
Die Lücke ist: "Die Features, die da sind, sprechen nicht die Sprache der Vision."

Die Vision lebt in den Dokumenten und im Dashboard-SVG.
Sie muss in jede Zeile, jeden Raum, jede Oberfläche einziehen.
