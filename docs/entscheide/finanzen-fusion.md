# Kapitel Finanzen und Finanz-Übersicht zusammenlegen — Entscheidungsblatt

*Vorbereitet 24.10.2026 auf `main` `4299bfb9` (Zweig `feat/finanzen-fusion`). Entscheid: Stebler Studios.*

> ✅ **Plan freigegeben 24.10.2026, kurz vor 01:00** (Stebler Studios: «Der Plan passt, aber bei den
> Entscheiden will ich anders»). Die vier Entscheide unten sind aus dem Auswahl-Dialog derselben
> Sitzung übernommen. Noch nichts gebaut.

**Die Frage:** Das Kapitel Finanzen und die Ansicht «Finanz-Übersicht» (`#finanzuebersicht`)
zeigen teils dasselbe. Soll es nur noch einen Ort geben?

## 1 · Heute-Zustand — gemessen am Code

| Baustein | Kapitel Finanzen (`ChapterView.jsx`) | Finanz-Übersicht (`FinanzUebersicht.jsx`) |
|---|---|---|
| Lohn-Barometer | ja (Z. 2224) | ja, dazu Armutsgrenze und Branchen-Chips |
| Monatssaldo | «Jeden Monat bleiben» (Z. 1899), Rechnung `utils/monatsrechnung.js` | «Budget-Bilanz», Rechnung `budgetSync.js` |
| IPV | grüner Hinweis (Z. 2206) + Eintrag in «Passend» | Statuskarte |
| Nur Übersicht | — | Lebensbaum, Steuern, Sozialhilfe, EL, Vermögen, Gesundheitskosten, KK-Last, Reserve-Tank, Mietvergleich, Drucken |

🛑 **Die zwei Saldi rechnen verschieden.** `monatsrechnung.js` zählt als Einnahmen Lohn,
Familienzulagen und erhaltene Alimente. `budgetSync.js` zählt dazu Partner/in und Nebenerwerb, bei
den Ausgaben Hypothek, Gebäudeversicherung und 3a, und zieht die IPV ab. Mit Nebenerwerb oder
Partner/in stehen heute zwei verschiedene «bleibt»-Beträge in der App.

## 2 · Entscheide (24.10.2026)

1. **Saldo: beide zeigen, klar benannt.** Keine der zwei Rechnungen wird still ersetzt. Der Entscheid
   vom 21.10.2026 («Charts rechnet wie das Kapitel») bleibt unberührt.
   *Vorschlag Claude, offen für die Copy-Prüfung:* oben «Ihr Monat» (Kapitel-Rechnung), darunter
   «Monat des Haushalts» (Budget-Rechnung) — die zweite Zeile nur, wenn sie vom ersten Betrag
   abweicht, mit einem Satz, was zusätzlich mitzählt.
2. **Lebensbaum: ins Kapitel Finanzen.** Der Entscheid vom 20.09.2026 (Baum bei den Finanzen, «zuerst,
   was gewachsen ist — dann die Rechnung») gilt weiter, nur der Ort wechselt.
3. **Sozialhilfe und EL: eingeklappt unter «Weitere Ansprüche»,** von selbst offen, sobald ein
   Anspruch möglich ist (`sozialhilfe.eligible`, `sozialhilfe.efbEntscheidet`, `el.eligible`).
4. **Probiermodus: das Kapitel Finanzen läuft dort mit Beispieldaten.** Heute steht
   `finanzuebersicht` in `SANDBOX_VIEWS` (`main.jsx`). Aufwand vor dem Bau prüfen.

## 3 · Reihenfolge im Kapitel nach der Zusammenlegung

| # | Teil | Herkunft |
|---|---|---|
| 1 | Kopf | bleibt |
| 2 | Monatssaldo nach Entscheid 1, aufklappbar mit Einnahmen- und Ausgabenzeilen; Brutto: Satz `budgetSync.availableNeedsNetto` | Kapitel + Budget-Bilanz |
| 3 | Ankunftsmoment, Spiegelsatz | bleibt |
| 4 | Abschnittsliste (Formular) | bleibt |
| 5 | Lebensbaum (Entscheid 2) — nach den Angaben, vor der Rechnung | Übersicht |
| 6 | Wo Sie stehen: Lohn-Barometer, Armutsgrenze, Branchen-Chips | Übersicht, ersetzt Z. 2224 |
| 7 | Was daraus folgt: Steuern (+ Kantonssteuer-Orientierung), IPV, KK-Last, Gesundheitskosten*, Vermögen* mit Reserve-Tank | Übersicht, IPV-Karte ersetzt Z. 2206 |
| 8 | Weitere Ansprüche: Sozialhilfe, EL (Entscheid 3) | Übersicht |
| 9 | Passend zu diesem Bereich: Neuer Job, Lohnausweis, Budget, Behördendossier | Kapitel |
| 10 | Übersicht drucken (Export-Vorschau, `druckAbschnitte`) | Übersicht |
| 11 | Hinweis zur Schätzung | Übersicht |
| 12 | Als Nächstes | bleibt |

\* nur, wenn etwas erfasst ist. Mietvergleich → Kapitel Wohnen, neben den Wohnkostenanteil.

## 4 · Bauschritte (je ein Commit)

1. Saldo-Anzeige nach Entscheid 1 (beide Rechnungen bleiben; über den `swiss-precision-pruefer`).
2. Bausteine aus `FinanzUebersicht.jsx` in eine lazy geladene `FinanzAuswertung` lösen (Startbündel 65 kB).
3. Kapitel in die Reihenfolge oben; neue Texte in alle 5 Sprachen.
4. `#finanzuebersicht` öffnet das Kapitel Finanzen bei Teil 5; Werkzeug-Register, Dashboard-Highlight,
   Suche zeigen aufs Kapitel. Die übrigen Aufrufer laufen über die Umleitung weiter.
5. Mietvergleich ins Kapitel Wohnen.
6. Probiermodus (Entscheid 4).
7. Tests anpassen (nicht löschen), FEATURES.md, `maloja-review`, Browser 375 px, Entwurfs-PR. Kein Merge.

**Offen:** Wortlaut der zwei Saldo-Zeilen · Aufwand Probiermodus · Lage des Baums im Browser prüfen.
