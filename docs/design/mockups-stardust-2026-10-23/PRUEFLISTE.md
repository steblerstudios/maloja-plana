# Prüfliste für die Seiten-Mockups (Fassung 3)

Auftrag (Stebler Studios, 23.10.2026): «alle Sachen, die wir in der Vergangenheit
eingebaut haben, nicht vergessen — auch die Detailsachen». Hier steht jeder frühere
Entscheid, an dem Fassung 3 gemessen wird, mit Quelle. Was Fassung 2 verletzt hat, ist markiert.

## Ordnung und Wege

| # | Regel | Quelle | Fassung 2 |
|---|---|---|---|
| W1 | Brotkrume zeigt die feste Ordnung: «Übersicht › Bereich › Seite» | IDEEN §15, Entscheid 25.09. (B) | nur «Übersicht · Kapitel» |
| W2 | Wer über einen Querverweis kommt, bekommt zusätzlich «‹ Zurück zu ‹Kapitel›» | IDEEN §15 «Brotkrume + Herkunft» | fehlt |
| W3 | Keine Sackgassen: jeder Rechner führt weiter (Frist, Merkliste, Kapitel) | Lärm-Audit N3, Navigation-Spine | Rechner endet beim Knopf |
| W4 | Die Klammer Kalender · Merkliste · Unterlagen trägt alle Seiten | Navigation-Spine | fehlt |
| W5 | Handy: leiser Boden-Anker mit Mitte-Knopf; Desktop: ruhiges Seitenmenü, keine Boden-Leiste | Navigation-Spine «Nav-Mechanik» | Anker fehlt ganz |
| W6 | Ast-Zoom: ein Bereich zeigt Felder + Abläufe + Anspruch + Dokumente an einem Ort | Navigation-Spine «Ort» | nur Felder |

## Bild und Farbe

| # | Regel | Quelle | Fassung 2 |
|---|---|---|---|
| F1 | Neutrals bis zur EINEN Handlung; nur sie trägt Sand | UI-Prinzipien | erfüllt |
| F2 | Bereichsfarbe ist ein Barrierefreiheits-Kanal: Farbe + Form + Helligkeit + Wort, nie Farbe allein | Navigation-Spine, Farb- und Daten-System | Gruppen ohne Form |
| F3 | Daten-Grammatik: Füllung = Ihr Wert, ! = harte Schwelle, Rot nur auf der kritischen Seite | farb-und-daten-system.md | erfüllt |
| F4 | Kein Vergleich mit «Durchschnitts-Nutzern» | UX-Playbook §10 | «| Schnitt» im IPV-Barometer — raus |
| F5 | Achsen haben immer Bedeutung: was + Einheit | UI-Prinzipien (07.07.) | Skala ohne Einheit |
| F6 | Dunkelmodus: Hierarchie über tonale dunkle Flächen, nie helle Flächen | UI-Prinzipien Runde 2 | erfüllt |
| F7 | Logo nach Fläche: hell = Anthrazit, dunkel = farbig | MarkenLogo.jsx | Platzhalter-Quadrat |
| F8 | Graustufen-Test muss halten (`or5_grayscale`) | Navigation-Spine | nicht prüfbar |

## Schrift und Sprache

| # | Regel | Quelle | Fassung 2 |
|---|---|---|---|
| S1 | Keine Überschriften in Versalien («SaaS-Uppercase») | Lärm-Audit N4 | «JEDEN MONAT», «IHRE LAGE» … |
| S2 | Sie als Standard, Du gespiegelt, auch Imperative | Brand-Identity «Voice» | nur Sie |
| S3 | Keine Emojis, keine Dingbats; Häkchen als Zeichnung | feedback_no_emojis, N5 | «✓» als Zeichen |
| S4 | Formular-Labels als Frage mit Absicht; 2–7 Optionen als Pills | UI-Prinzipien Runde 3 | erfüllt |
| S5 | Schweizer Schreibweise: CHF 6'200, «innert», ss | Brand, maloja-sprache | erfüllt |
| S6 | Fachbegriffe mit Erklärung (Glossar «IPV ⓘ») | GlossarBegriff.jsx | fehlt |
| S7 | Rechner zeigen Quelle und Stand, und «Orientierung, keine Rechtsberatung» | Quellen-Redlichkeit, Disclaimer | fehlt |

## Zustände (planen, was man nicht kontrolliert)

| # | Regel | Quelle | Fassung 2 |
|---|---|---|---|
| Z1 | Jede Handlung gibt Rückmeldung (Erfolg sichtbar) | feedback_robustness_ux | «Erledigt» ohne Rückmeldung |
| Z2 | Leer ≠ kaputt: sagen warum, und was als Nächstes | robustness_ux, Playbook §10 | erfüllt |
| Z3 | Löschen: Listen sofort mit «Entfernt · Rückgängig»; Tresor mit Nachfrage (Datei weg) | IDEEN §15 «Löschen», Vorschlag C | fehlt |
| Z4 | Gespeichert-Anzeige im Kapitel | AutoSaveStatus.jsx | fehlt |
| Z5 | Fristen sanft: «innert 14 Tagen» → als Frist in den Kalender, keine Dringlichkeit | calm-ux, Notification-Philosophie | fehlt |
| Z6 | Fortschritt ohne Prozent-Angst (Prozent nur auf den Bergen) | Navigation-Spine N1, Playbook §10 | erfüllt |

## Bewegung und Bedienung

| # | Regel | Quelle | Fassung 2 |
|---|---|---|---|
| B1 | Rule of Three: gestaffelt Primär → Sekundär → Tertiär | UI-Prinzipien Runde 3 | erfüllt |
| B2 | Übergänge: Context (Inhalt wechselt), Drill (Ebene tiefer), Continuity (Element bleibt) | UI-Prinzipien Runde 3 | teilweise |
| B3 | «Bewegung reduzieren» stellt alles still | tokens.css, a11y | erfüllt |
| B4 | Tippflächen ≥ 44 px, wo es geht | tippflaechenGate, Messung 23.10. | meist erfüllt |
| B5 | Gleiche Komponente = gleiches Verhalten überall (Jakob's Law) | UI-Prinzipien | erfüllt |

## Bewusst nicht

Keine Streaks, Badges, Gamification · keine Dringlichkeit, kein Rot als Alarm auf Formularen
(N2) · keine Scham-Leerzustände · kein Tracking · kein Universal-Werkzeug (Playbook §10).
