# Kuhglocke — Implementierungsnotiz

**Datum:** 2026-06-14  
**Status:** Noch nicht implementiert. Nur Planung.

---

## Warum Kuhglocke, nicht Alarmglocke

Die `_emergency`-Glocke in IconSystem.jsx (Zeile 768) ist eine **Kirchenglocke / Alarmglocke**: symmetrisch, Kupel-Form, Metallring oben. Sie signalisiert: Gefahr, Alarm, Dringlichkeit.

Eine **Kuhglocke (Trychel)** hat eine andere Form und Bedeutung:

| Merkmal | Alarmglocke | Kuhglocke |
|---|---|---|
| Form | Symmetrisch, Kupel | Trapezoid, nach unten breiter |
| Aufhängung | Ring / Bügel | Lederband mit Schnalle |
| Klöppel | Zentriert, symmetrisch | Sichtbar, asymmetrisch |
| Assoziation | Gefahr, Feuer, Alarm | Rhythmus, Ordnung, Alp, Alltag |
| Ton | Laut, durchdringend | Ruhig, tief, natürlich |

Maloja meldet sich nicht mit Alarm. Maloja meldet sich wie eine Kuhglocke im Tal — ruhig, natürlich, "etwas ist da, schau wenn du magst."

---

## Einsatzorte (aktuell generische Icons)

| Stelle | Datei | Aktuelles Icon | Kuhglocke sinnvoll? |
|---|---|---|---|
| Fällige-Dokumente-Banner | OverdueBanner.jsx | Farbkreis (Gold/Rose) + Zahl | Ja — als Symbol vor der Zahl |
| Kalender-Header | CalendarReminders.jsx:233 | `Icon name='calendar'` | Optional — Kuhglocke als Erinnerungs-Symbol |
| Leere Erinnerungsliste | CalendarReminders.jsx:348 | `Icon name='calendar' size=28` | Ja — Kuhglocke im Leerzustand |
| Benachrichtigungs-Einstellungen | NotificationSettings.jsx:86 | `Icon name='settings'` | Ja — Kuhglocke statt Zahnrad |
| Semantisches Icon `_emergency` | IconSystem.jsx:768 | Generische Kirchenglocke | Nein — Emergency bleibt als Alarm-Icon |

---

## Benötigte Icon-Grössen

| Grösse | Verwendung |
|---|---|
| 16px | Inline neben Text (OverdueBanner) |
| 20px | Header-Icons (NotificationSettings) |
| 24px | Standard-Icon-Grösse |
| 28px | Leerzustand-Illustration |

---

## SVG-Stilhinweise

- viewBox: `0 0 24 24`
- fill: `currentColor` (erbt Theme-Farbe)
- Keine festen Farben — muss in Dark und Light Mode funktionieren
- Strichstärke konsistent mit bestehendem System (1.5–1.8px für Stroked-Varianten)

### Formhinweise

```
Trapezoid-Körper:
  - Oben schmaler (~8px)
  - Unten breiter (~14px)  
  - Leichte Rundung an den Ecken

Lederband:
  - 2 Linien von den oberen Ecken nach oben
  - Treffen sich in einer Schnalle (kleines Rechteck)

Klöppel:
  - Vertikale Linie von innen oben
  - Kleiner Kreis am Ende
  - Leicht asymmetrisch (hängt nicht exakt mittig)
```

---

## Neuer Icon-Name

`_kuhglocke` in IconSystem.jsx, exportiert als `kuhglocke` im Icons-Objekt.

Nicht `_bell` (zu generisch), nicht `_notification` (zu digital), nicht `_alarm` (falsche Assoziation).

---

## Implementierungsschritte

1. SVG in IconSystem.jsx zeichnen (24×24, currentColor)
2. In Icons-Registry exportieren
3. OverdueBanner: Kuhglocke vor der Zahl
4. NotificationSettings: Header-Icon ersetzen
5. CalendarReminders Leerzustand: Kuhglocke statt Kalender
6. Browser-Test auf Desktop + Mobile

Geschätzter Aufwand: 3–4 Stunden.
