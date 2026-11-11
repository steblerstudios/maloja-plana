# _archiv · Bauteile, die nicht mehr gezeichnet werden

**Ordnen statt wegnehmen** (Brand Book §8). Hier liegen Bauteile, die keine Ansicht mehr aufruft, die aber als
Beleg und als Vorlage bleiben. Nichts in diesem Ordner darf von einer Ansicht importiert werden; Tests dürfen.

| Datei | Was es war | Seit wann nicht mehr gezeichnet | Was es ersetzt | Was bleibt im Betrieb |
|---|---|---|---|---|
| `Schutzschild.jsx` | Zwei Schilde «Pflicht / Empfohlen» (58/96/260 px) für das Kapitel Versicherungen | F7-K3-6, 27.10.2026 (Netz-Schild statt der zwei Schilde); Kachel seit 09.11.2026 | `components/NetzSchild.jsx` + `data/netzSchild.js` | `data/schutzschild.js` (`schildState`, `schildOptionen`) rechnet weiter, u. a. für das Netz-Schild und die Kacheln |

Archiviert am 11.11.2026 (Befund B-T1, Instrumente-Matrix vom 10.11.2026, Lebensbereich Versicherungen).
Der Test `__tests__/schutzschild.test.js` rendert das Bauteil weiter, damit es lauffähig bleibt, falls es je
zurückkommt. Freigabe-Register Nr. 21 nennt den neuen Pfad.
