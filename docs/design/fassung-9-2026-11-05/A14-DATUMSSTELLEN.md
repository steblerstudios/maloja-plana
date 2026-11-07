# F9-A14 · Wo die App ein Datum zeigt — Liste vor dem Kalenderblatt

*Erhoben 06.11.2026 auf dem Stand von `feat/f9-querverweise` (`ab98b5cd`), nur lesend.
Gezählt sind Stellen, an denen ein Datum **am Bildschirm** steht. Briefe, Dossiers, CV,
Export und Import sind ausgenommen (Dokumente, kein Bildschirm).*

## Ergebnis in einem Satz

Die Bestandsaufnahme rechnete mit «rund 17 Stellen». Es sind **64**, davon **50 Fristen mit
Handlung**. Aber **33 davon laufen durch zwei Bausteine** in `src/AblaufSchale.jsx`
(`EreignisFrist`, 18 Dateien · `FristButton`, 9 Dateien, Stichprobe nachgezählt). Ein
Kalenderblatt dort deckt fast alle Abläufe auf einmal ab.

## Je Art

| Art | Anzahl | Kalenderblatt? |
|---|---|---|
| Frist mit Handlung | 50 | **ja** |
| Termin (Verabredung, Untersuchung) | 2 | nein — sonst sieht alles wie eine Frist aus |
| Info-Datum (Rechnung vom, seit, hochgeladen) | 12 | nein |
| Vergangen/Stand (gesichert, erledigt am, Stand der Quelle) | 12 | nein |
| Kalender-Raster (Wochentage, Monate) | 6 | nein — ist selbst schon Kalender |
| unklar: Ablaufdatum im Tresor (Ausweis läuft ab) | 1 | **zu entscheiden** |

## Die Fristen mit Handlung, gruppiert

1. **Abläufe, Baustein `EreignisFrist`** (24 Aufrufe): Bewilligung, Quellensteuer, Ausweis,
   Todesfall, Umzug, EL, Volljährig, Kind, Zuzug, Neuer Job, Adoption, Wohnung gekündigt,
   Aussteuerung, Wegzug, KK-Erstanmeldung, Betreibung, Dienst. Wird bei «vorbei» schon **rot**
   umrandet (`palette.rose`).
2. **Abläufe, Baustein `FristButton`** (9 Aufrufe): Stelle verloren, KVG-Wechsel,
   Pensionierung, Heirat, IV-Verfahren, Selbständigkeit, Zusatzversicherung. Führerausweis ist
   eher ein Termin.
3. **Steuerfrist an fünf Stellen**: Dashboard (2), `BehoerdenInstrument` (hat das Blatt heute
   als einzige Stelle), `InstrumentePanel`, Kapitelwert im Kapitel Behörden.
4. **Kalender, Jahreskreis, Merkliste**: Liste «Was ansteht» (überfällig schon `roseDeep`),
   «Als Nächstes», Liste unter dem Jahreskreis (vergangen nur grau), geplanter Tag der Merkliste.
5. **Zahlungsfristen**: KVG-Beleg, Arztrechnungen (2), Forderungen. Überfällig nirgends rot.
6. **Brief-Hinweise am Bildschirm**: Rechtsvorschlag (10 Tage), Kündigung (Einsprache, Klage),
   Lohn-Rückmeldung.
7. **Krankenkasse wechseln**: Dashboard-Zeile, Prämien-Orientierung (2).

**Rot bei Überfälligkeit** gibt es heute nur in `EreignisFrist` und in der Kalenderliste.
Nach F9-A2 («überfällig rot», Wächter `fristenBlau.test.js`) fehlt es an den übrigen Stellen.

## Zu F9-B6 · dieselbe Frist, viele Namen

- **Steuerfrist** heisst: «Steuerfrist», «Frist {date}», «Steuererklärung fällig am …»,
  «Steuererklärung bis …», «Steuererklärung fällig», «Steuererklärung Frist»,
  «Nächste Frist». Dazu drei Datumsformate (langer Monat, kurzer Monat, TT.MM.JJJJ).
- **KVG-Kündigung** heisst sechsmal anders; in `po.wechselzeitNachFrist` heisst der
  1. Januar «Termin».
- **Frist oder Erinnerung hängt am Schalter, nicht am Inhalt**: Ohne `art:'frist'` zeigt die
  Karte «Erinnerung am …», auch wenn der Titel selbst «Frist» oder «spätestens» sagt
  (Zusatzversicherung, RAV-Anmeldung, Probezeit).
- **«Vorbei» hat fünf Wörter**: überfällig, verpasst, vorbei seit, abgelaufen, Überfällig.
- **«Deadline»** steht in keinem deutschen UI-Text, nur in Key-Namen. Gemischt sind in der
  Praxis Frist, Termin, fällig, bis, Erinnerung und Ablauf.

## Vorschlag für den Bau (noch nicht entschieden)

1. **Ein Baustein `Kalenderblatt`** (stumm, `aria-hidden`; das Datum trägt der Satz daneben,
   wie heute in `BehoerdenInstrument`). Zuerst in `EreignisFrist` und `FristButton` einsetzen —
   das sind 33 der 50 Stellen mit zwei Änderungen. Danach Steuerfrist (5) und Kalenderliste.
2. **Farbe:** Band blau, überfällig rot (F9-A2). Vorher Skizze hell/dunkel/Handy.
3. **Wort:** Wo ein Blatt steht, heisst es «Frist» (B6). `art:'frist'` dort setzen, wo der
   Inhalt eine Frist ist, nicht wo der Schalter zufällig fehlt.
4. **Bündel:** Der Baustein soll nicht ins Startbündel (64.97/65 kB). Ob `AblaufSchale`
   nachgeladen wird, ist **nicht geprüft** — vor dem Bau nachsehen. Nach dem Commit `size-limit`.

**Entschieden 06.11.2026** (Stebler Studios, «Ja, als Frist»): Das **Ablaufdatum im Tresor**
(z. B. Ausweis erneuern, `DocumentTresor.jsx:225`) ist eine **Frist mit Blatt**. Damit sind es
**51** Stellen mit Kalenderblatt. Folge: abgelaufen dort **rot** statt heute grau (F9-A2), und
das Wort heisst «Frist», nicht «Ablauf» (B6; «Ablauf» bleibt für die Abläufe).

**Entschieden 06.11.2026** (Stebler Studios, «abgelaufen / überfällig»): Für «vorbei» gelten
nur noch zwei Wörter. **«abgelaufen»** bei Fristen (Abläufe, Steuerfrist, Kalender,
Jahreskreis, Merkliste, Tresor), **«überfällig»** bei Zahlungen (Zahlungsfristen, Forderungen,
Arztrechnungen). «verpasst» und «vorbei seit» fallen weg (`calendar.verpasst`,
`dashboard.glanceDeadlinePast`, `calendar.overdueDays` bei Fristen). In allen fünf Sprachen
anzugleichen; fr/it/en/rm-Wörter vor dem Bau festlegen.

Damit sind alle Entscheide vor der Skizze gefallen. **Nächster Schritt:** Skizze des Blatts
(hell, dunkel, Handy; Band blau, abgelaufen rot) zeigen, erst dann bauen.
