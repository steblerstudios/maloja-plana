# E-06 Impact Review — E-04 bis E-06

Stand: 2026-06-14
Geprüft: Desktop (1280px) + Mobile (375px)
Zustände: leer, MVO-Testdaten (alle 7 Kapitel), Ankunftsmoment

---

## A. Was besser wurde

### Erster Wertmoment (E-04)
Beim allerersten Eintrag in einem Kapitel erscheint sofort ein ruhiger Satz — *"Dein Zuhause hat jetzt einen Platz."* Der Moment ist da, bevor der Mensch zum Dashboard zurückkehrt. Das war vorher nicht so: der Wert war erst nach vielen Feldern sichtbar.

### Dashboard als Spiegel (E-05 + E-06)
Das Dashboard zeigt jetzt nicht mehr nur Felder und Prozente, sondern spricht. "Sophie Stebler, Basel-Stadt." — "Basel, CHF 1'200." — "Im Notfall: Maria Stebler." Das Dashboard reflektiert das Leben, nicht die Dateneingabe.

### Orientierung ohne Druck (E-05)
"Noch offen" / "Begonnen" / "Grundordnung" / "Vertieft" — vier Worte statt Prozentzahlen. Der Mensch sieht, wo er steht, ohne getrieben zu werden. Die Wörter bewerten nicht, sie beschreiben.

### Synthesen als Bedeutung (E-06)
Die Kapitelzeilen hatten vorher nur Titel + Description. Jetzt zeigen sie, was die Daten *bedeuten*. Der Unterschied: "Finanzen & Geld — Dein Einkommen, Erspartes und Bankdaten" vs. "Finanzen & Geld — *CHF 5'200, CHF 3'340 erfasste Ausgaben.*"

---

## B. Was noch nicht funktioniert

### Scrolling-Problem Desktop
Das Dashboard scrollt auf Desktop nicht zuverlässig via JavaScript — der Scroll-Container scheint ein inneres Element zu sein. Bei Testverifikation musste die Snapshot-Ansicht statt scrollbasierter Screenshots verwendet werden. Kein User-Impact, aber ein technisches Detail.

### MVO-Karte + Fortschrittsbalken: Redundanz
Das Dashboard zeigt jetzt: Grundordnung 18/18, Fortschritt 30%, UND pro Kapitel "Grundordnung" + Synthese. Das sind drei Schichten Information. Bei vollem Datenbestand wirkt das zusammen etwas dicht — nicht erdrückend, aber es gibt Raum zur Vereinfachung.

### "DEIN FORTSCHRITT 30%" ist der letzte verbleibende Prozentwert
E-05 hat Prozente aus den Kapitelzeilen entfernt, aber der globale Fortschrittsbalken zeigt noch "30%". Das steht im Spannungsfeld mit der Philosophie "keine Prozente, keine Scores."

---

## C. Neue Risiken

### Textdichte auf Mobile
Auf 375px zeigt jede Kapitelzeile jetzt: Titel + Status + Description + Synthese = 4 Zeilen Text. Bei 7 Kapiteln in 3 Tiers ergibt das eine lange Scrollstrecke. Es ist nicht überladen, aber an der Grenze. Besonders "Versicherungen & Vorsorge" mit langem Titel wird eng.

### "Grundordnung" bei jedem Kapitel
Wenn alle MVO-Felder ausgefüllt sind, steht bei JEDEM Kapitel "Grundordnung". Das Wort verliert dann an Bedeutung — es wird zum Standardzustand statt zum Meilenstein. Differenzierung (z.B. unterschiedliche Status bei unterschiedlichen Füllgraden) wäre wertvoller.

### Synthese als implizites Versprechen
"CHF 5'200, CHF 3'340 erfasste Ausgaben" suggeriert, dass die App rechnet. Das stimmt auch — aber es entsteht die Erwartung, dass das irgendwo weitergeführt wird (Budget, Differenz, Trend). Aktuell zeigt es nur den Ist-Zustand.

---

## D. Wirkung auf D-18/D-19/D-20

### D-18: "Wertmoment zu spät sichtbar"
**Gelöst.** E-04 bringt den Wertmoment auf die erste Sekunde nach dem ersten Eintrag. Der Mensch muss nicht mehr erst 10 Felder ausfüllen, um zu spüren, dass etwas passiert ist.

### D-19: "Dashboard ist Verwaltung, nicht Spiegel"
**Deutlich verbessert.** E-05 (Status) + E-06 (Synthesen) verwandeln die Kapitelzeilen von anonymen Navigationselementen in lebendige Zusammenfassungen. Das Dashboard sagt jetzt "So sieht dein Leben aus", nicht nur "So viel hast du ausgefüllt."

### D-20: "Lebenssatz zu weit weg"
**Teilweise gelöst.** Die Synthesen im Dashboard sind nah am Ort der Navigation. Aber sie sind Kurzform — der volle Lebenssatz (MirrorCards) bleibt in den Kapiteln. Das ist architektonisch richtig, aber der Mensch muss immer noch ein Kapitel öffnen für den vollen Spiegel.

---

## E. Bewertung

| Dimension | Vor E-04–E-06 | Nach E-04–E-06 |
|---|---|---|
| Erster Wertmoment | 1 | 4 |
| Dashboard als Spiegel | 1 | 3.5 |
| Orientierung | 2 | 4 |
| Ruhe | 3 | 3.5 |
| Energie | 2 | 3.5 |
| Maloja-Gefühl | 2 | 3.5 |
| Risiko von Druck | 1 (kein Druck, aber auch kein Gefühl) | 1.5 (minimales Risiko durch "Grundordnung") |

### Kommentar
Der grösste Sprung ist beim Wertmoment (1→4) und der Orientierung (1→4). Das Dashboard fühlt sich jetzt bewohnt an. Die Ruhe ist leicht gesunken (3→3.5) weil mehr Text da ist, aber nicht problematisch. Das Druckrisiko ist minimal — "Grundordnung" und "Vertieft" laden ein, sie fordern nicht.

---

## F. Empfehlung

### E-07 starten: Ja.

E-04 bis E-06 haben die inhaltliche Ebene adressiert. Was jetzt fehlt, ist die visuelle Ebene — die Texte sind da, aber die Typografie (12px), die fehlende Materiality (keine Tiefe, keine Schatten), und die monotone Farbgebung (alles beige/sage) dämpfen die Wirkung.

### Vor E-07 erwägen:
1. **Globalen Fortschrittsbalken mit % überdenken** — er widerspricht der Status-Philosophie von E-05
2. **"Guided Start" Card** — erscheint auch bei 28% Fortschritt, obwohl alle MVO-Felder voll sind (Schwelle ist 15%). Bei voller Grundordnung sollte sie verschwinden.

Diese zwei Punkte sind kleine Korrekturen, die in E-07 miteinfliessen können.

---

## Fazit

E-04 bis E-06 haben Maloja von einer Dateneingabe-App zu einem Ort gemacht, der zurückspricht. Der Mensch sieht jetzt nicht "Felder ausgefüllt: 24/87", sondern "Sophie Stebler, Basel-Stadt. Basel, CHF 1'200. Im Notfall: Maria Stebler."

Das ist ein substantieller Schritt Richtung: *"Ein stiller Ort, an dem ein Mensch sehen kann, wie sein Leben aussieht."*
