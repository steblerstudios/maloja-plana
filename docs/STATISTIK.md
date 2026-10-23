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

## Einmalige Einrichtung (im Infomaniak Manager)

- [ ] Prüfen, ob die **Web-Statistik** fürs Hosting aktiviert ist
      (Manager → Hosting → malojaplana.ch → Statistiken) und was sie ausweist.
- [ ] Prüfen, welche **Log-Aufbewahrung** eingestellt ist und ob es eine Option
      zur **IP-Anonymisierung** gibt — falls ja: einschalten (wir brauchen keine IPs).
- [ ] `stage.malojaplana.ch` aus der Betrachtung ausnehmen (Vorschau zählt nicht).
- [ ] Offener Prüfpunkt (rechts-pruefer, nicht raten): erwähnt die
      Datenschutzerklärung die Server-Logs des Hosters? Falls unklar → prüfen,
      nicht einfach ergänzen.

## Eigene Abrufe herausrechnen (Befund 18.10.2026)

Der Manager kann nicht filtern. Im Kopf abziehen, bevor eine Zahl gedeutet wird:

- **Webbrowser `stebler-cockpit-drift` und `stebler-cockpit-stand`** — das Cockpit
  (`stebler-studios/scripts/drift-pruefen.py`, `stand-erheben.py`). Oktober bis
  18.: 125 + 30 Abfragen.
- **`curl/…`, `python-requests/…`** — meist eigene Prüfungen (Claude-Sitzungen,
  `scripts/check-*.sh`). Nicht jede einzelne belegt.
- **Besucher-IPs des eigenen Anschlusses** — IPv6 wechselt im hinteren Teil, darum
  erscheint ein Anschluss als mehrere Adressen mit gleichem Anfang. Die eigene
  Adresse nachschauen statt hier notieren (keine IPs ins öffentliche Repo).

Was sicher **nicht** von uns ist: WordPress-/Joomla-Pfade, `wp2shell`, `cve-…`,
Censys/Palo Alto/Netcraft (Internet-Vermessung), Referrer `binance.com` (Spam).
Echte Menschen am ehesten erkennbar an: `/fonts/lexend-latin-400-normal.woff2`
(lädt nur ein echter Browser, einmal pro Gerät und Jahr) und Linkvorschauen
(`facebookexternalhit`, `WhatsApp`) — jemand hat einen Link geteilt.

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
| 2026-10 (bis 18.) | – | – | – | – | google · duckduckgo · bing · instagram · t.co (zus. ~22) | 6 142 Abfragen gesamt, davon 2 139 × 404 — Grossteil Scanner (WordPress/Joomla-JCE, ~900) + Referrer-Spam (binance.com, 70). `/favicon.ico` fehlte → PR #500. Alte Lazy-Chunks (`index-c41fa79f.js` u. a.) werden noch abgefragt und liefern 404. Stage (`stage.malojaplana.ch`) öffentlich, Stand 10.07. Besuchszahlen noch nicht abgelesen. |
| 2026-10 (bis 23.) | 863 Sitzungen (1.–21.10., Ansicht «Tägliche Besuche»; ~41/Tag) | 684 Einzelbesucher (Manager: −35 % zum Vormonat; Monat erst zu drei Vierteln um, Bots mitgezählt) | nicht verwertbar — Zuordnung über den Rückwärts-Namen der IP: «Unresolved/Unknown» 10 890, `.com` 399, `.net` 37, DE 33, CH 2 | – | direkter Aufruf 7 947 · `https://malojaplana.ch/` 966 · `http://` 444 · Joomla-JCE-Pfade 419 + 414 (Scanner) | Echte Browser grob **≤ ~400**: `lexend-latin-400-normal.woff2` 412 × (Näherung, s. oben). Die 684 Einzelbesucher enthalten Scanner und eigene Abrufe, taugen nicht als Menschenzahl. JCE-Abfragen ~830 = Scanner, Seite hat kein Joomla. `index-c41fa79f.js` 29 × 404 — seit PR #502 lädt die App in diesem Fall einmal neu (live geprüft 23.10.), `sw.js` hält keine alte `index.html` fest (Seiten network-first). **Tagesverlauf:** Sitzungen flach (26–58/Tag, vor und nach dem 13. gleich), Abfragen ab 13.10. etwa verzehnfacht (1.–12.: ~40–450/Tag, 13.–21.: 660–1 590/Tag; Daten bis 31 MB am 21.10., bis 614 «angesehene Seiten» bei 50 Sitzungen am 19.10.) — also nicht mehr Menschen, sondern mehr Abrufe je Sitzung. Ursache ohne Roh-Logs offen; Kandidaten: eigene Arbeit (vier PRs am 13.10., Deploys 19. und 21.10., Cockpit-Prüfungen), Crawler nach Deploys, Scanner. Grundlinie für Vergleiche: Sitzungen pro Tag, nicht Abfragen. Ruhe-Regel: keine Aktion aus einem Monat. |

## Später (Weg 2 — nur bei echtem Bedarf)

Wenn die Server-Zahlen einmal nicht mehr reichen (z. B. weil Ansichts-Zahlen
wirklich gebraucht würden), wäre der nächste Schritt ein **cookieloser,
aggregierter Zähler**. Das berührt CSP self-only und das Versprechen „die App
sendet nichts" — also ein bewusster Grundsatzentscheid mit eigenem Gespräch,
nicht eine stille Ergänzung.
