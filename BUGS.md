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

Und die wichtigste Vorregel: **erst nachstellen, dann eintragen.** Kein Bug wandert hierher, ohne dass jemand ihn gesehen hat. Was sich beim Nachstellen als *schon erledigt* oder als *fehlendes Feature* entpuppt, gehört nicht in diese Liste.

---

## Offen

*Gerade keine offenen, nachgestellten Bugs.* Das ist ein guter Zustand — er heisst, die App ist nicht sichtbar kaputt. Die offene Arbeit ist Feature-Ausbau und Politur, und die lebt im Backlog.

## Geprüft — kein offener Bug (2026-07-08)

Vier Punkte standen kurz hier, aus dem Gedächtnis. Beim Nachstellen zeigte sich: keiner ist ein Bug. Festgehalten, damit sie nicht als Phantome wiederkommen.

- **IK-Leerzustand (Zukunft-Reiter)** → *kein Bug.* Der IK-Leerzustand ist gebaut und funktioniert (AHV-Reiter, `EmptyState`). Der IK-Auszug wird nur im AHV-Reiter gezeigt. „IK auch im Zukunft-Reiter" ist ein **Feature-Wunsch** (nie zurück-navigieren müssen) → Backlog.
- **Zinsknick bei 20 000** → *kein Bug.* Die Projektion rechnet glatt (Zinseszins pro Jahr, keine Schwelle im Code). Die 20 000-Grenze ist nur ein Strategie-Hinweis. Reale Bank-Schwellen abzubilden wäre ein **Modell-Ausbau** → Backlog.
- **3a-Rollover** → *kein Bug.* Der Jahr-für-Jahr-Übergang stimmt. Ein echter Rollover/Drawdown in der Rentenphase ist eine **Ausbaustufe** → Backlog.
- **Rot-Grün-Falle (sage/rosé)** → *kein einzelner Bug, echtes Anliegen.* Farbenblind-Modus + Form-Marker sind schon da (opt-in, Okabe-Ito). Ob weitere Stellen Form-Marker brauchen, klärt ein **fokussierter A11y-Durchgang** — kein einzelner reproduzierbarer Fehler.

## Zuletzt behoben

*(Neueste zuoberst. Nur zum Nachschauen — schön, wenn die Liste hier wächst.)*

- 2026-07-08 · Zukunft-Graph nannte AHV/BVG-Säulen, auch wenn es sie gar nicht gab → nur vorhandene Säulen werden benannt (`9134b86`).
