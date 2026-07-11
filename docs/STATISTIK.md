# Statistik — ruhig zählen, niemanden verfolgen

> Haltung (Entscheid 2026): **Aggregierte, cookielose Zahlen ja — Verfolgung
> einzelner Personen nein.** Kein Google Analytics, kein Cookie-Banner, kein
> Tracking-Script in der App. Die App bleibt CSP self-only und sendet nichts.
> Quelle der Zahlen ist ausschliesslich der Hoster (Infomaniak): Server-Logs
> und die eingebaute Besucherstatistik im Manager.

## Was wir wissen wollen (und so erfahren können)

- **Wie viele?** Besuche auf malojaplana.ch, Grössenordnung und Verlauf.
- **Woher?** Herkunftsländer/-regionen, soweit der Hoster sie grob ausweist.
- **Womit?** Anteil Handy vs. Desktop, Browser-Sprachen.
- **Über welchen Weg?** Referrer: Suchmaschine, direkter Aufruf, verlinkende Seiten.
- **Läuft alles?** 404-Fehler, kaputte Pfade → gehören in `BUGS.md` / zum Link-Checker.

## Was wir bewusst nicht messen

- **Keine Personen.** Keine Cookies, kein Fingerprinting, keine Wiedererkennung
  einzelner Besucherinnen, keine Profile, keine A/B-Experimente.
- **Kein Verhalten in der App.** Die App nutzt Hash-Routen (`#/…`) — die erreichen
  den Server nie. Der Hoster sieht nur, *dass* die Seite geladen wurde, nicht,
  was jemand im Lebensordner tut. Das ist kein Mangel, sondern der eingebaute
  Beweis der Privatheit. Wer Ansichts-Zahlen will, bräuchte einen Zähler in der
  App — das wäre ein Grundsatzentscheid (siehe „Später"), kein Nebenbei.

## Einmalige Einrichtung (Sophie, im Infomaniak Manager)

- [ ] Prüfen, ob die **Web-Statistik** fürs Hosting aktiviert ist
      (Manager → Hosting → malojaplana.ch → Statistiken) und was sie ausweist.
- [ ] Prüfen, welche **Log-Aufbewahrung** eingestellt ist und ob es eine Option
      zur **IP-Anonymisierung** gibt — falls ja: einschalten (wir brauchen keine IPs).
- [ ] `stage.malojaplana.ch` aus der Betrachtung ausnehmen (Vorschau zählt nicht).
- [ ] Offener Prüfpunkt (rechts-pruefer, nicht raten): erwähnt die
      Datenschutzerklärung die Server-Logs des Hosters? Falls unklar → prüfen,
      nicht einfach ergänzen.

## Das monatliche Ritual (~10 Minuten, z. B. am Monatsersten)

1. Manager öffnen → Statistik von `malojaplana.ch` anschauen (nicht Stage).
2. Fünf Werte in die Verlaufstabelle unten eintragen: Besuche, eindeutige
   Besucher (falls ausgewiesen), Top-Herkunftsländer, Mobil-Anteil, Top-Referrer.
3. Die 404-/Fehlerliste überfliegen — Auffälliges als Zeile in `BUGS.md`.
4. Eine Zeile Interpretation in die Notiz-Spalte: Wächst es? Woher kommen die
   Menschen? Gibt es genau eine Sache, die daraus folgt?
5. **Ruhe-Regel:** Aus einer einzelnen Monatszahl folgt keine Aktion.
   Erst ein Trend über etwa drei Monate ist ein Signal.

In der interaktiven CLI begleitet `/maloja-statistik` durch diese Schritte und
trägt die Werte hier ein (`.claude/commands/`, lokal).

## Verlauf

| Monat | Besuche | Besucher | Top-Länder | Mobil-Anteil | Top-Referrer | Notiz |
|---|---|---|---|---|---|---|
| 2026-07 | | | | | | (erste Erhebung) |

## Später (Weg 2 — nur bei echtem Bedarf)

Wenn die Server-Zahlen einmal nicht mehr reichen (z. B. weil Ansichts-Zahlen
wirklich gebraucht würden), wäre der nächste Schritt ein **cookieloser,
aggregierter Zähler**. Das berührt CSP self-only und das Versprechen „die App
sendet nichts" — also ein bewusster Grundsatzentscheid mit eigenem Gespräch,
nicht eine stille Ergänzung.
