# Was ist das hier?

**Der Ablageort für Dokumente, die ausgedient haben — aber nicht gelöscht werden.**

Angelegt am 2026-09-20 von Stebler Studios. Bis dahin gab es im Repo keinen solchen Ort:
Überholte Dokumente blieben deshalb einfach zwischen den gültigen liegen, und wer sie las,
konnte nicht erkennen, dass sie nicht mehr gelten.

---

## Die Regel

> **Verschieben statt löschen — und nie ohne Eintrag in der Tabelle unten.**

Ein Archiv ohne Erklärung ist Ballast. Ein Dokument, das ohne Begründung hier landet, ist
später nicht von einem verlegten zu unterscheiden.

**Drei Dinge gehören zu jedem Archivieren:**

1. Die Datei wird mit `git mv` hierher verschoben — **nie kopiert.** Zwei Fassungen mit
   demselben Namen laufen still auseinander; genau das soll das Archiv verhindern.
2. Ein **Archiv-Kopf** oben in der Datei: ab wann sie nicht mehr gilt und **was an ihre
   Stelle tritt**. Ein «überholt» ohne Nachfolger schickt die nächste Leserin ins Leere.
3. Eine **Zeile in der Tabelle** unten.

## Warum flach und nicht nach Datum geordnet

Am Schreibtisch (`~/Claude/Projects/Archiv/`) liegen datierte Unterordner, weil dort ganze
Vorgänge wandern. Hier wandern **einzelne Dokumente**, und es werden wenige sein. Ein
Unterordner je Datei wäre mehr Struktur als Inhalt — das Datum steht in der Tabelle und im
Archiv-Kopf. Wächst der Ordner über etwa zwanzig Dateien, ist das der Moment, die
Entscheidung neu anzuschauen.

## Was hier NICHT hingehört

- **Etwas, das noch gilt.** Ein Dokument, das nur unordentlich ist, gehört aufgeräumt, nicht
  archiviert.
- **Etwas, dessen Nachfolger noch nicht existiert.** Dann ist es nicht überholt, sondern
  unvollständig.
- **Die einzige Quelle einer Information.** Erst muss der Inhalt anderswo leben, dann darf
  die Hülle hierher.

## Was git dazu beiträgt — und was nicht

git behält jede Fassung, auch gelöschte. Trotzdem wird hier verschoben und nicht gelöscht:
**die Historie kennt nur, wer sie abfragt.** Ein Mensch, der im Ordner steht, sieht sie nicht.
Das Archiv ist für den Menschen da, nicht für das Werkzeug.

---

## Was hier liegt

| Datei | Seit | Warum überholt | Was an ihre Stelle tritt |
|---|---|---|---|
| *(noch nichts)* | — | — | — |

---

## 🛑 Offen: vier Dokumente unter Riegel

Vier Dokumente sind Kandidaten für dieses Archiv, dürfen aber **nicht** von selbst hierher
wandern — der Riegel steht ausdrücklich in `entscheidungs-matrix.md` der Werkstatt:

`BACKLOG_MASTER.md` · `master-roadmap.md` · `future-features.md` ·
`backlog-registry.json/yaml`

Der vereinbarte Weg hat **drei Schritte**, und Schritt 3 (Archiv-Kopf setzen und verschieben)
kommt erst nach Schritt 2 (*Faden für Faden gemeinsam durchgehen: bauen · parken · verwerfen*).

**Stand 2026-09-20:** Schritt 2 ist für **`BACKLOG_MASTER.md` erledigt** — alle 159 Punkte
haben einen Ort, die offenen 15 einen Entscheid (siehe `E3-VORSORTIERUNG-2026-09-19.md` in der
Werkstatt). Für die **übrigen drei ist Schritt 2 offen.**

> Auch mit erfülltem Schritt 2 löst den Riegel **nur ein ausdrücklicher Zuruf** von Stebler
> Studios, je Dokument einzeln. Nicht ein Morgenlauf, nicht ein Aufräum-Durchgang, und auch
> nicht «nur den Archiv-Kopf schon mal setzen». Dass es nach einer billigen, reversiblen
> Kleinigkeit aussieht, ist der Grund, warum der Riegel überhaupt existiert.
