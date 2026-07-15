---
description: Rohen Ideen-/Feedback-Dump strukturiert erfassen — Themen bündeln, triagieren (Jetzt/Backlog/Entscheidung), datierten Block an docs/TODO.md anhängen. Baut nichts, entscheidet nichts.
argument-hint: Stebler Studios’ Braindump (frei formuliert, Deutsch)
allowed-tools: Read, Edit, Grep, Glob
---

Erfasse Stebler Studios’ Braindump in `$ARGUMENTS`. Ziel: aus rohem, oft ungeordnetem Text eine ruhige, wiederauffindbare Liste machen — **ohne** etwas zu bauen, zu ändern oder zu entscheiden.

Vorgehen:

1. **Verstehen, nicht bewerten.** Lies den Dump. Wenn etwas unklar ist, notiere es als offene Frage (nicht raten). Nimm nichts als „schlechte Idee" ab — Stebler Studios sammelt hier erst.
2. **Bündeln.** Gruppiere die Punkte nach Thema/Bereich (z.B. Vorsorge, A11y, Navigation, Design, Fachdaten, Infrastruktur). Erkenne Dubletten zu bereits Bekanntem — greppe `docs/TODO.md` und `docs/ABLAEUFE.md` nach Stichworten und markiere „schon erfasst" statt doppelt zu listen.
3. **Triagieren** in drei Körbe:
   - 🟢 **Kleiner Win / jetzt** — klar, klein, keine Grundsatzfrage.
   - 🟡 **Grösser / Backlog** — mehr Aufwand oder abhängig.
   - 🔵 **Braucht Stebler Studios’ Entscheid** — Design-/Grundsatz-/Strategiefrage (nichts davon eigenmächtig starten — vgl. „Design-Entscheide immer gemeinsam").
4. **Anhängen** an `docs/TODO.md`: ein neuer Abschnitt `## Braindump <YYYY-MM-DD>` im Stil der Datei (Emoji-Marker 🔴 hoch / 🟠 mittel / 🟡 später, ✅ erledigt). Bestehende Einträge nicht anfassen. Format je Punkt: kurzer Titel — 1 Satz Kontext — Korb.
5. **Zurückmelden:** knappe Zusammenfassung der Körbe + die offenen Fragen. Frag Stebler Studios, ob und womit sie starten will — **nichts automatisch anfangen**.

Governance: reines Erfassen (Level 0–1). Keine App-Änderung, kein Commit, kein Deploy. Bausteine, die aus dem Dump entstehen, laufen später als normale scoped Änderungen mit Verifikation.
