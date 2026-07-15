---
description: Monatliches Statistik-Ritual — begleitet durch die Infomaniak-Zahlen (aggregiert, cookielos, keine Personen) und trägt sie in docs/STATISTIK.md ein. Read-only gegenüber allem ausser der Verlaufstabelle. Kein Tracking, keine A/B-Tests.
argument-hint: (optional) die Zahlen direkt mitgeben, z.B. "Juli: 420 Besuche, CH/DE/FR, 60% mobil, Google"
allowed-tools: Read, Edit, Grep, Glob, Bash
---

Führe das **Maloja-Statistik-Ritual** durch (Haltung und Ablauf: `docs/STATISTIK.md`).

**Grundsätze:** Aggregierte, cookielose Zahlen vom Hoster — keine Personen, kein
Verhalten in der App, keine A/B-Tests. Ich kann das Infomaniak-Panel nicht selbst
öffnen (Login gehört Stebler Studios); ich begleite, rechne und schreibe die Tabelle nach.

1. `docs/STATISTIK.md` lesen: Verlaufstabelle und letzte Notizen aufnehmen.
2. Falls `$ARGUMENTS` schon Zahlen enthält → direkt zu Schritt 4.
3. Sonst Stebler Studios ruhig durch die fünf Werte führen (Manager → Hosting →
   Statistik von malojaplana.ch, NICHT Stage): Besuche, eindeutige Besucher,
   Top-Herkunftsländer, Mobil-Anteil, Top-Referrer. Dazu die 404-/Fehlerliste:
   Auffälliges als Kandidat für `BUGS.md` notieren (nicht selbst eintragen ohne Wort).
4. Neue Zeile in die Verlaufstabelle von `docs/STATISTIK.md` eintragen
   (einzige Schreib-Operation dieses Rituals).
5. Trend statt Einzelwert: mit den Vormonaten vergleichen und in 2–3 ruhigen
   Sätzen einordnen — wächst es, woher kommen die Menschen, gibt es genau
   eine Sache, die daraus folgt? **Aus einer einzelnen Monatszahl folgt keine
   Aktion** (Ruhe-Regel, erst ~3 Monate sind ein Signal).
6. Kein Drängen, keine Wachstums-Rhetorik, keine Ziele/KPIs — Zahlen sind
   Orientierung, nicht Bewertung.
