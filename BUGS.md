# Bugs — die eine Liste

Kein Fachchinesisch. Ein Ort, an dem alles steht, was **kaputt** ist.
Nicht was fehlt — das ist etwas anderes (siehe unten).

## Das Bild im Kopf

- **Ein Bug** = etwas ist versprochen und funktioniert **nicht** (falsche Zahl, Knopf tut nichts, Absturz).
- **Ein Backlog-Punkt** = etwas **fehlt** noch (ein neues Feature, ein Ausbau). Das gehört *nicht* hierher, sondern in `docs/TODO.md` / die Roadmap.

Wenn du unsicher bist: *Habe ich es versprochen und es hält nicht?* → Bug. *Gibt es das noch gar nicht?* → Backlog.

## Die einzige Regel

Ein Bug ist erst **weg**, wenn ein Test ihn festhält. So kommt derselbe Fehler nie ein zweites Mal.

1. **Nachstellen** — wie genau geht es kaputt? (Schritte aufschreiben.)
2. **Test schreiben, der rot ist** — er beweist den Fehler.
3. **Fixen**, bis der Test grün ist.
4. **Zeile hier streichen** (nach unten zu „Zuletzt behoben" verschieben).

Kleine Fixes, die man unmöglich testen kann (reiner Text, eine Farbe): einfach fixen und Zeile streichen. Der Test-Schritt ist für *Verhalten*.

---

## Offen

Format: `Schwere · wo · was ist kaputt`
Schwere: 🔴 stört echt · 🟠 spürbar · 🟡 Kosmetik/Politur

- 🟠 **Zukunftsrechner** · Zinsknick bei ~20 000 CHF — die Projektion springt an der Schwelle unschön, statt weich zu verlaufen.
- 🟡 **Zukunftsrechner** · 3a-Rollover — der Übergang ins Folgejahr rechnet noch nicht sauber weiter.
- 🟡 **VorsorgeRechner** · Der IK-Auszug hat im Zukunft-Reiter keinen ruhigen Leerzustand (EmptyState fehlt).
- 🟠 **App-weit (Barrierefreiheit)** · sage/rosé als einziges Unterscheidungsmerkmal ist eine Rot-Grün-Falle — braucht zusätzlich Form oder eine zweite Farbe (Blau/Orange).

## Zuletzt behoben

*(Neueste zuoberst. Nur zum Nachschauen — schön, wenn die Liste hier wächst.)*

- 2026-07-08 · Zukunft-Graph nannte AHV/BVG-Säulen, auch wenn es sie gar nicht gab → nur vorhandene Säulen werden benannt (`9134b86`).
