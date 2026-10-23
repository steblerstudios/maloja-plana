# Heute neben neu · Seite für Seite (23.10.2026)

Auftrag (Stebler Studios): jede Seite von heute neben ihre neue Fassung halten und schauen,
was in der neuen Version noch fehlt oder anders ist. **Ansehen:** `vergleich.html` — links das
Bild von heute, rechts Fassung 4 zum Antippen, darunter die Liste mit Filter.

## Wie gemessen

Im Demo-Modus («Maria Muster»), Stand `main` 0eba0fc1 (nach #534/#537/#538), Handy 390 × 844.
Ein Skript hat jede Seite vollständig durchgezählt — Überschriften, Felder, Knöpfe, Links,
Texte —, nicht nur den sichtbaren Anfang. Rohdaten: `vergleich-inventar.json`.

| Seite | Bausteine heute | fehlt noch im Mockup | anders | drin | neu |
|---|---|---|---|---|---|
| Eingang | 12 | 0 | 0 | 4 | 0 |
| Übersicht | 98 | 10 | 4 | 2 | 0 |
| Kapitel Finanzen | 51 | 3 | 3 | 3 | 1 |
| Rechner IPV | 39 | 5 | 4 | 2 | 1 |
| Ablauf Umzug | 47 | 5 | 1 | 1 | 1 |
| Dokumentenablage | 13 | 2 | 2 | 2 | 1 |
| Merkliste | 10 | 2 | 1 | 1 | 1 |
| Kalender · Was ansteht | 57 | 4 | 2 | 0 | 1 |
| Menü | 16 | 3 | 1 | 2 | 1 |

## Was am meisten wiegt

1. **Übersicht:** Die Mockups zeigen nur Bild, Karte und Bereiche. Heute gibt es zusätzlich
   «Was steht mir zu?», «Leistungen» mit Einkommens-Eingabe, «Ihre Instrumente»
   (Franchise-Kreuz, Steuer-Säule, Reserve-Tankanzeige, Schutzschild), Obstgarten,
   Werkzeuge nach Gruppen, «Jetzt sichern», Tipps, den Beta-Hinweis und die Demo-Leiste.
2. **Rechner IPV — Fehler im Mockup:** heute rechnet er mit der kantonalen **Jahresgrenze**
   (Zürich CHF 61'090, Modell einkommensabhängig, Anspruchsjahr 2026, Prämienregion 1) und zeigt
   monatliche und jährliche Förderung. Das Mockup hatte eine erfundene Monatsgrenze.
3. **Ablauf Umzug:** heute **vier** Schritte (Mockup: drei) — mit Umzugsdatum und Hinweis bei
   verpasster Frist, Mietzinsbeiträgen, «Adresse überall nachführen» (6 Stellen, merken,
   Adressänderungs-Brief) und Quellen (RHG Art. 11, OR Art. 266c).
4. **Kapitel:** die Lohn-Einordnung (Median, BFS) fehlt im Mockup, ebenso die Reiter
   «Angaben / Dokumente»; heute sind es **sieben** Gruppen statt der vier erfundenen.
5. **Merkliste und Kalender:** das Hinzufügen fehlt im Mockup (Eingabe + «Verknüpfen mit»;
   «+ Erinnerung hinzufügen»), ebenso Monats-/Jahressprung und «Erledigt».
6. **Menü:** Steuern, Finanz-Übersicht, Lebenssituationen, «Alle Werkzeuge im Gepäck»,
   «Auf den Startbildschirm legen» und die Gliederung Alltag/Absicherung/Schutz fehlen.

**Nächster Schritt:** Fassung 5 holt die «fehlt noch»-Punkte in die Mockups, damit nichts
verloren geht, was heute funktioniert — Seite für Seite, in der Reihenfolge oben.

---

## Nachtrag 23.10.2026 · Fassung 5 neben heute

**Ansehen:** `vergleich-v5.html`. Gleiche Seite wie oben, rechts jetzt Fassung 5 (`seiten-v5.html`),
in der Spalte «Stand» steht bei jeder geänderten Zeile auch der Stand von Fassung 4.
`vergleich.html` (Fassung 4) bleibt unverändert als Beleg.

Ergebnis der Einordnung (von Hand, Zeile für Zeile gegen die Liste oben):
**0 fehlt noch · 10 anders · 59 drin · 7 neu.** Der Eingang steht weiter neben Fassung 4,
weil Fassung 5 ihn nicht neu zeichnet (er ist seit #537 live).

Die zehn «anders» sind bewusste Entscheide oder offene Fragen, kein Vergessen. Sie sind der Stoff
fürs gemeinsame Durchgehen, Seite für Seite:
- Übersicht: Ring «63 %» statt zwei Kreisen (welche Zahl gilt?), Karte «Ihr Lebensordner»,
  Bereichszeilen ohne %, die Bereiche ein Mal statt zwei Mal
- Kapitel: Kopf links statt zentriert
- Rechner: «Anspruch» als Aufklapp-Zeile
- Ablage: Reiter erst ab Inhalt (heute auch leer «0 Aktiv · 0 Archiv»), Suche erst ab Inhalt
- Kalender: Titel «Was ansteht» statt «Kalender und Erinnerungen», Tagesleiste statt Monatsraster

Die Mess-Skripte der alten Sitzung liegen jetzt unter `messung/`.
