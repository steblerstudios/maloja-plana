# Rechts-Check: Individualbesteuerung — Status für die dritte Steuer-Säule

Stand der Recherche: **2026-07-29**. Betrifft die Platzhalter-Säule
«Verheiratet, einzeln» in `src/components/SteuerSaeulen.jsx` (Steuer-Rechner).

Zweck: festhalten, ob die dritte Säule eine **belegte Zahl** tragen darf, oder
weiterhin zahllos bleiben muss — mit Quellen, nach Wahrheits-Disziplin (siehe
Wurzel-`CLAUDE.md`: falsche Fakten = Haftung).

## Nachtrag 2026-09-19: Inkrafttreten belegt (2032)

Der Bundesrat hat an seiner Sitzung vom **19. August 2026** beschlossen, dass
die Individualbesteuerung **2032** in Kraft tritt. Das ist der spätestmögliche
Termin; er wurde gewählt, damit die Kantone Zeit für die Umsetzung haben.

- ESTV, Medienmitteilung vom 19.08.2026 «Individualbesteuerung tritt 2032 in
  Kraft»: https://www.estv.admin.ch/de/newnsb/khPH1Sn08Zr6iGZYe4tsB
  (belegt 2026-09-19)
- EFD, Abstimmung: https://www.efd.admin.ch/de/abstimmung-individualbesteurung —
  «Das Bundesgesetz tritt bei einer Annahme spätestens 2032 in Kraft.»
  (belegt 2026-09-19)

Nur das **Jahr** 2032 ist belegt. Ein genauer Stichtag (etwa der 1. Januar) ist
nicht aus erster Hand gelesen und wird darum nirgends genannt.

Folge: `tax.saeulen.einzelnPending` (alle fünf Sprachen) und der Kommentar in
`SteuerSaeulen.jsx` nennen jetzt «tritt 2032 in Kraft (Entscheid des Bundesrats
vom 19. August 2026)». Die Säule bleibt **weiter zahllos**: die Reform ist
weiterhin noch nicht in Kraft, der neue Tarif liegt nicht als belegte Ziffern
vor, und der Rechner kennt keine Einzeleinkommen (Gründe 1–3 unten gelten
unverändert).

## Ergebnis (kurz)

**Die Platzhalter-Säule bleibt vorerst korrekt zahllos.** Die Reform ist zwar
angenommen, aber noch nicht in Kraft, und ein verlässlicher Rechenwert ist heute
aus drei Gründen nicht möglich (siehe unten). Kein geschätzter Wert einsetzen.

## Belegte Fakten

Direkt gelesen auf der amtlichen ESTV-Seite
(https://www.estv.admin.ch/de/individualbesteuerung, abgerufen 2026-07-29):

- **Angenommen:** «Das Bundesgesetz über die Individualbesteuerung wurde an der
  Volksabstimmung vom 8. März 2026 mit 54,23 % Ja-Stimmen angenommen.»
- **Neuer Tarif:** Es wird ein neuer Tarif angewendet — «Die Steuersätze für
  tiefe und mittlere Einkommen werden gesenkt. Die Steuersätze für hohe
  Einkommen leicht erhöht.» Die konkreten Prozent-Stufen liegen laut ESTV nur
  als Grafik/Download vor, **nicht** als überprüfbare Zahlen im Fließtext.
- **Kinderabzug:** direkte Bundessteuer «von 6 800 Franken auf 12 000 Franken
  pro Kind».
- **Mechanik:** jede Person reicht eine eigene Steuererklärung ein, Einkommen
  (Lohn, Rente) wird pro Person separat besteuert. Wirkung ist von der
  Einkommensverteilung im Paar abhängig: ähnlich hohe Einkommen → tendenziell
  weniger direkte Bundessteuer; ungleiche Verteilung → tendenziell mehr. Alles
  als **Tendenz** formuliert, keine garantierten Ergebnisse.

## Noch NICHT primär belegt (vor einer Zahl zwingend zu bestätigen)

> **Überholt am 2026-09-19** — das Inkrafttreten ist jetzt primär belegt
> (2032, siehe Nachtrag oben). Der Abschnitt bleibt als Historie stehen.

- **Inkrafttreten:** Der genaue Zeitpunkt ist offen. swissinfo (8.3.2026):
  «Wann genau die Individualbesteuerung eingeführt wird, ist angesichts des
  Aufwands für die nötigen Änderungen in den Systemen noch nicht abzuschätzen.»
  Mehrere Berichte nennen als gesetzlichen Backstop **spätestens 2032**, mit
  möglichem früherem Inkrafttreten durch den Bundesrat — diese Frist ist
  bislang nur aus Sekundärberichten, **noch nicht** aus einer direkt gelesenen
  amtlichen Primärquelle bestätigt (admin.ch und parlament.ch antworten dem
  Abruf mit HTTP 403). Vor jeder Nutzung im UI primär prüfen: Gesetzestext /
  Bundesblatt / ESTV «Inkrafttreten Neuerungen».

## Warum heute keine Zahl in die Säule darf

1. **Nicht in Kraft.** Ein «aktueller» Wert wäre falsch, solange die alte
   Rechtslage (gemeinsame Veranlagung) gilt.
2. **Neuer Tarif nicht als verwendbare Zahlen verfügbar.** `steuerRechner.js`
   kennt heute nur Grundtarif (ledig) und Verheiratetentarif (DBG Art. 36).
   Der Individualbesteuerungs-Tarif ist ein **anderer** Tarif — der bestehende
   Grundtarif ist NICHT die Individualbesteuerungs-Zahl. Seine Stufen sind mir
   nicht als belegte Ziffern verfügbar.
3. **Braucht Pro-Person-Einkommen.** Individualbesteuerung besteuert jede Person
   einzeln — sinnvoll nur mit den Einzeleinkommen beider Partner, nicht mit
   einem Haushalts-Einkommen. Der Rechner modelliert heute ein Gesamteinkommen.

## Was erfüllt sein müsste, bevor die Säule eine Zahl bekommt

- Inkrafttreten gesetzt **und** neuer Tarif als belegte Stufen (ESTV/Bundesblatt)
  vorliegend.
- Rechenweg in `steuerRechner.js`: neuer Tarif + Kinderabzug 12 000 + Modell mit
  Einzeleinkommen der Partner.
- Empfehlung: menschliche Rechtsprüfung, bevor eine Zahl live geht.

## Folge für die Copy

Der i18n-Text `tax.saeulen.einzelnPending` wurde am 2026-07-29 aktualisiert:
von «laufende Reform» auf «am 8. März 2026 angenommen, aber noch nicht in Kraft —
Zeitpunkt offen». Wahrheits-Disziplin: die Reform ist entschieden, nur der
Zeitpunkt und der verwendbare Tarif fehlen.

Am 2026-09-19 erneut nachgeführt: «Zeitpunkt offen» ersetzt durch «tritt 2032
in Kraft (Entscheid des Bundesrats vom 19. August 2026)». Offen bleibt nur der
verwendbare Tarif (und das Einzeleinkommen-Modell).

## Quellen

- ESTV, Medienmitteilung 19.08.2026 «Individualbesteuerung tritt 2032 in Kraft»: https://www.estv.admin.ch/de/newnsb/khPH1Sn08Zr6iGZYe4tsB (belegt 2026-09-19)

- ESTV, «Individualbesteuerung»: https://www.estv.admin.ch/de/individualbesteuerung (direkt gelesen 2026-07-29)
- ESTV, «Auswirkungen Individualbesteuerung»: https://www.estv.admin.ch/de/auswirkungen-individualbesteuerung
- EFD, Abstimmung: https://www.efd.admin.ch/de/abstimmung-individualbesteurung
- admin.ch, «Individualbesteuerung»: https://www.admin.ch/de/individualbesteuerung (Abruf 403, nur via Suche)
- Geschäft 24.026, parlament.ch: https://www.parlament.ch/de/ratsbetrieb/suche-curia-vista/geschaeft?AffairId=20240026 (Abruf 403)
- swissinfo, Abstimmung 8.3.2026: https://www.swissinfo.ch/ger/schweizer-politik/eidgen%C3%B6ssische-abstimmung-vom-8-3-2026-individualbesteuerung/91004072
