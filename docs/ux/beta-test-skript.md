# Maloja Plana Beta-Test — Kurzskript

Dauer: 10–15 Minuten
URL: https://malojaplana.ch
Version: `0.1.49-beta` (Runde 2, November 2026)
Zugang: **«Ohne Code ausprobieren»** auf der Startseite. Für diese Runde braucht niemand einen Code.

> Tester-Erwartungen und Signal-Kriterien: siehe [feedback-rekonstruktion.md](../ux/feedback-rekonstruktion.md)
> Priorisierte Kandidatenliste: siehe [feedback-rekonstruktion.md](../ux/feedback-rekonstruktion.md#priorisierte-kandidatenliste)
> Was wir schon kennen: siehe [known-issues-beta.md](known-issues-beta.md) — bitte vor dem Test nicht lesen,
> erst danach.

---

## Runde 2 — worum es geht

Runde 1 (Juni 2026) fand drei Muster: **Nutzen kommt zu spät** · **Vertrauen & Datenhoheit** ·
**Verbindungen statt Formulare**. Seither ist viel gebaut worden. Runde 2 prüft, ob die drei Muster
noch auftauchen. Darum bleiben Teil 1 bis 4 **gleich wie im Juni** — nur so lässt sich vergleichen.
Teil 5 ist neu.

**Gut zu wissen für Testende:** «Ohne Code ausprobieren» zeigt die Beispielperson Maria Muster.
Man kann alles ansehen und ausprobieren, **gespeichert wird nichts**. Nach dem Neuladen ist alles
wieder wie am Anfang. Das ist gewollt.

## Geplante Tester

| Person | Perspektive | Sprache | Gerät | Worauf achten |
|--------|-------------|---------|-------|---------------|
| Testperson A | Verständlichkeit, Vertrauen, visuelle Wirkung | DE | offen | Fühlt sich die App vertrauenswürdig an? |
| Testperson B | Logik, technische Konsistenz | DE | offen | Rechner plausibel? Fehlende Verknüpfungen? |
| Testperson C | Erstnutzer, Sprachsensibilität | DE/EN | offen | "Wo klicke ich?", "Was soll ich hier machen?" |
| Testperson D | Nutzen, Alltag | DE | offen | Was bringt mir das konkret? |
| Testperson E | Nutzen, Motivation | DE | offen | Warum soll ich das ausfüllen? |
| Testperson F | UX, Design, Navigation | DE | offen | Visuelles Urteil, Interaktionsprobleme |
| Neu 1 | hat Maloja nie gesehen | **FR** | offen | Versteht man es auf Französisch? |
| Neu 2 | hat Maloja nie gesehen | DE | **iPhone** | Läuft es auf dem Telefon? |

Mindestens eine Person testet auf dem **iPhone**, mindestens eine auf **Französisch**.

---

## Teil 1 — Erster Eindruck (30 Sekunden)

Öffne die App. Schau 30 Sekunden nur auf die Startseite — nicht klicken.

Beantworte dann:

- Was glaubst du, ist Maloja Plana?
- Für wen ist es?
- Wo würdest du zuerst klicken?
- Würdest du hier persönliche Daten eintragen? Warum / warum nicht?

---

## Teil 2 — Frei herum klicken (5–10 Minuten)

Klicke auf «Ohne Code ausprobieren» und dann frei herum. Probiere mindestens:

- Ein Kapitel öffnen
- Einen Rechner öffnen (z.B. "Prämienverbilligung", "Steuern" oder "Sozialhilfe")
- "Datenschutz & Rechtliches" im Footer anschauen

---

## Teil 3 — Feedback (5 Minuten)

- Was war klar?
- Was war verwirrend?
- Was wirkt vertrauenswürdig?
- Was wirkt unsicher oder unfertig?
- Was fehlt dir?

---

## Teil 4 — Abschlussfrage

- Würdest du Maloja Plana jemandem empfehlen?
- Falls ja: wem?
- Falls nein: warum nicht?

---

## Teil 5 — Die drei Muster aus Runde 1 (neu, 2 Minuten)

Je eine Frage zu einem Muster. Antwort: ja · eher ja · eher nein · nein.

1. **Nutzen:** Wusstest du nach der ersten Minute, was dir Maloja bringt?
2. **Vertrauen:** Weisst du, wo deine Daten liegen würden, wenn du sie eintippst?
3. **Verbindungen:** Hattest du das Gefühl, etwas doppelt eingeben zu müssen?

---

## Rückmeldung geben

In der App unten: **«Feedback per E-Mail»**. Der Knopf öffnet einen Mail-Entwurf, abgeschickt wird
erst, wenn du auf Senden drückst. Oder direkt an info@malojaplana.ch. Ein kurzes Gespräch geht auch.

---

## Vorlage für die Auswertung

Je Person ein Block in [beta-test-auswertung.md](beta-test-auswertung.md), unter «Runde 2»,
im gleichen Format wie Runde 1:

```
Version: 0.1.49-beta · Gerät: … · Sprache: …
Verstanden in 30 Sek.? ja / teilweise / nein
Vertrauen: …
Klarheit: …
Grösstes Problem: …
Beste Sache: …
Konkreter nächster Fix: …
Teil 5: Nutzen … · Vertrauen … · Verbindungen …
Muster: 1 / 2 / 3 / neu
```

**Erfolg heisst:** Muster 1 («Nutzen kommt zu spät») nennen höchstens 1 von 8 Personen
(Runde 1: 3 von 6).
