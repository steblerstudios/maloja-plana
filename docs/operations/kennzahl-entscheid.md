# Die eine Kennzahl — Entscheidungsblatt

**Stand:** 2026-11-08 · **Status:** ✅ entschieden — **A** (Stebler Studios, 08.11.2026, «Ja, A»)
**Rolle geklärt 09.11.2026** (Stebler Studios, «Beide, getrennte Rollen»): **Wiederkehr pro Monat bleibt der Live-North-Star** (26.10.). **A ist die Zahl für Testsitzungen**: ob ein einzelner Besuch hilft. A ersetzt die Wiederkehr nicht.
**Gehört zu:** [`analytics-decision.md`](analytics-decision.md) (Weg 1 läuft, Weg 2 offen)

> ⚠️ **Korrektur 09.11.2026 — dieses Blatt wurde ohne zwei frühere Entscheide geschrieben.**
> 1. **Es gibt schon einen North-Star:** «Wiederkehr pro Monat» (wie viele Menschen Maloja an
>    mindestens 2 Tagen im Monat nutzen), entschieden 26.10.2026, Messweg aus den Server-Zahlen
>    (Oktober ≈ 1,26 Sitzungen je Einzelbesucher). Steht in den internen Betriebsunterlagen
>    von Stebler Studios, nicht in diesem Repo.
> 2. **Die Statistik-Regel vom 02.11.2026** «Zählen ja, drängen nein»: Weg B (Wiederkehr nur auf
>    dem Gerät zählen, freiwillig im Beta-Feedback mitschicken) ist als Entwurfs-PR #652 gebaut.
>
> Darum ist die Begründung bei **D unten falsch**: Wiederkehr lässt sich ohne Wiedererkennung
> messen (auf dem Gerät gezählt oder aus den Server-Zahlen angenähert). Die Zeile bleibt als Beleg
> stehen. ~~**Offen:** Ersetzt A die Wiederkehr …?~~ → **Geklärt 09.11.:** beide, getrennte Rollen
> (siehe Status oben). Wiederkehr allein ist für eine Behörden-Hilfe mehrdeutig — wer sein Problem
> gelöst hat, kommt zu Recht nicht wieder; A deckt genau diese Lücke.

## Worum es geht

Eine einzige Zahl, die sagt, ob Maloja seinen Zweck erfüllt — damit jede Änderung
eine Antwort auf «bringt das etwas?» bekommt. **Nicht** Besuche, Klicks oder Verweildauer:
die messen Aufmerksamkeit, nicht Hilfe.

Rahmen, der nicht verhandelt wird: kein Tracking, `connect-src 'self'`, keine Replays,
keine Verfolgung über Sitzungen hinweg (`ethics-manifest.md:18`, Datenschutzerklärung).
Eine Kennzahl, die nur mit Bruch dieses Versprechens messbar ist, scheidet aus.

## Die Kandidaten

| | Kennzahl | Was sie wirklich misst | Messbar heute? | Urteil |
|---|---|---|---|---|
| **A** | **Mit einem nächsten Schritt in der Hand gehen** — Anteil der Besuche, die mit einem greifbaren Ergebnis enden: Frist im Kalender (`.ics`), Dossier/PDF, Notfallkarte, Brief-Vorlage | Hat die Person etwas, womit sie handeln kann? | Von Hand in Testsitzungen ja · in der App nur mit Weg 2 | ✅ **Empfehlung** |
| **B** | Anspruch entdeckt — Anteil der Checks mit mindestens einem möglichen Anspruch (IPV, EL, Stipendien) | Trefferquote des Checks | Nur mit Weg 2 | ⚠️ Gefährlich als Ziel: wer sie hochtreiben will, zeigt mehr «Ansprüche» → falsche Hoffnung, Haftung. Gut als **Begleitzahl**, nie als Ziel |
| **C** | Zeit bis zur ersten Klarheit — vom Öffnen bis zum ersten konkreten nächsten Schritt | Wie schnell Orientierung entsteht | Ja, mit der Stoppuhr in Testsitzungen | 🟡 Gute **Zweitzahl** zu A; allein verleitet sie zu Hast |
| **D** | Rückkehr vor der Frist | Ob Fristen eingehalten werden | Nein — braucht Wiedererkennung über Sitzungen | ❌ Widerspricht local-first |
| **E** | Selbstauskunft «Weiss ich jetzt, was zu tun ist?» (ja/teilweise/nein) | Empfundene Klarheit | Von Hand ja · in der App nur mit Weg 2 | 🟡 Ehrlich, aber leise; als Frage am Ende der Testsitzung nehmen |

## Empfehlung

**A als die eine Zahl, C und E als Begleitung, B nur beobachten.**

Genaue Fassung von A:
> Von 10 Menschen, die mit einer echten Frage kommen, wie viele gehen mit einem
> **greifbaren nächsten Schritt** — eine Frist im eigenen Kalender, ein Dokument,
> das sie abschicken oder mitnehmen können, oder eine Notfallkarte?

Warum A: Maloja ist eine Hilfe zum Handeln, nicht zum Lesen. Ein exportiertes Ergebnis
ist der eine Moment, in dem die App beweisbar etwas in die Welt gebracht hat. Und A lässt
sich nicht billig aufblähen — mehr Exporte erzwingen geht nur, indem der Weg dorthin
klarer wird.

## Wie messen — ohne das Versprechen zu brechen

1. **Jetzt, ohne Code:** Testsitzungen mit Menschen von aussen (passt zur Stufenregel,
   Beta braucht ohnehin Testende). Je Sitzung festhalten: A (ja/nein + welches Ergebnis),
   C (Minuten), E (Antwort). Fünf Sitzungen ergeben eine erste ehrliche Zahl.
2. **Später, falls Weg 2 entschieden wird:** genau **ein** anonymer Zähler je Ergebnisart
   («ics erzeugt», «Dossier erzeugt»), kein Bezug zur Person, first-party. Die
   Copy-Stellen aus `analytics-decision.md` müssen dann vorher ehrlich werden.

Zur Testschleife aus dem Video («halbe Nutzer A, halbe B»): bei Maloja nicht möglich —
braucht In-App-Messung und grosse Zahlen. Ersatz: eine Änderung, dann die nächsten
3–5 Testsitzungen dagegen halten.

## Protokoll Testsitzungen (Vorlage)

| Datum | Frage der Person | A: Ergebnis mitgenommen? | C: Minuten | E: weiss nächsten Schritt | Wo gehakt |
|---|---|---|---|---|---|
| | | | | | |

## Offen — braucht Entscheid

- [x] A als die eine Kennzahl — entschieden 08.11.2026; C und E begleiten, B nur beobachten, D ausgeschlossen
- [ ] Erste Testsitzungen: wer, wann?
- [ ] Weg 2 bleibt unabhängig davon offen
