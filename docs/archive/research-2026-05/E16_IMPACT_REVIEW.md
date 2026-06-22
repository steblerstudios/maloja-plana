# E-16 Financial Difference — Impact Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-14  
**Grundlage:** Commit 07e837d, alle Screenshots Desktop + Mobile 375px  
**Scope:** Wirkungsprüfung der Finanzdifferenz-Synthese

---

# Szenarien-Prüfung

---

| Szenario | Lebenssatz | Mirror-Card | Dashboard | Bewertung |
|---|---|---|---|---|
| 1. Leer | Kein Satz | Keine Card | Kein Snippet | ✓ Korrekt |
| 2. Einkommen ohne Ausgaben | "CHF 4'200 bei Helvetia AG." | Nur Einkommen-Sektion | "CHF 4'200." | ✓ Keine falsche Differenz |
| 3. Positiv (4'200 − 2'080) | "Es bleiben CHF 2'120." | "CHF 2'120 bleiben" | "CHF 4'200, CHF 2'080 erfasste Ausgaben." | ✓ |
| 4. Negativ (2'500 − 2'700) | "Es fehlen CHF 200." | "CHF 200 fehlen" | "CHF 2'500, CHF 2'700 erfasste Ausgaben." | ✓ |
| 5. Null (2'000 − 2'000) | "Einnahmen und erfasste Ausgaben gleichen sich aus." | "Ausgeglichen" | "CHF 2'000, CHF 2'000 erfasste Ausgaben." | ✓ |
| Mobile 375px positiv | Umbricht sauber, lesbar | Gut proportioniert | — | ✓ |
| Mobile 375px negativ | "Es fehlen CHF 200." Selbe Karte, selbe Farbe | "CHF 200 fehlen" | — | ✓ |

---

# A. Was funktioniert

---

## 1. Tonalität

Der Satz "Es bleiben CHF 2'120" ist ruhig. Er klingt wie ein Kontoauszug, nicht wie ein Coach. Keine Aufregung, keine Motivation, keine Bewertung. Er steht da — und der Mensch denkt seinen Teil.

Das ist exakt die Maloja-Haltung: Feststellen, nicht bewerten.

## 2. Konsistenz

Der positive und negative Fall verwenden dieselbe visuelle Behandlung. Selbe sage-grüne Karte. Selber Font. Selbe Grösse. Kein Farbwechsel, kein Warnsymbol, kein Alert. "Es fehlen CHF 200" sieht genauso aus wie "Es bleiben CHF 2'120."

Das ist wichtig. Ein Mensch, der monatlich CHF 200 im Minus ist, braucht keine App, die ihn anschreit. Er braucht eine App, die sagt, was ist.

## 3. Nachvollziehbarkeit

Die Mirror-Card-Sektionen zeigen die einzelnen Posten (Wohnen, Krankenkasse, Lebensmittel). Darunter die Schlusszeile. Der Mensch kann die Rechnung im Kopf nachprüfen. Keine Magie, keine versteckte Logik.

## 4. Positionierung

Im Lebenssatz steht die Differenz am Ende — als natürlicher Abschluss der Finanzgeschichte: Einkommen → Ausgaben → was bleibt. Die Dramaturgie stimmt.

In der Mirror Card steht sie als letzte Sektion. Einkommen oben, Ausgaben in der Mitte, Spielraum unten. Das ist die logische Reihenfolge.

## 5. Mobile

Auf 375px umbricht der Lebenssatz sauber. Die Mirror-Card-Sektionen stacken vertikal. "Monatlicher Spielraum" und "CHF 2'120 bleiben" stehen auf einer Zeile mit genug Abstand. Nichts bricht, nichts wird abgeschnitten.

---

# B. Was sprachlich riskant ist

---

## 1. "Es fehlen CHF 200."

**Risiko: 2/5**

"Es fehlen" ist eine Feststellung. Grammatisch ist der Satz neutral — es ist die gleiche Konstruktion wie "Es bleiben." Das Subjekt ist "es", nicht "dir." Kein Finger wird auf den Menschen gezeigt.

Aber: "fehlen" hat eine emotionale Ladung, die "bleiben" nicht hat. "Bleiben" ist entspannt. "Fehlen" ist angespannt. Nicht weil der Satz wertend wäre. Sondern weil die Wahrheit, die er ausspricht, schmerzen kann.

**Einschätzung:** Das ist kein Problem des Satzes. Das ist ein Problem der Situation. Ein Mensch, der monatlich CHF 200 im Minus ist, weiss das — oder ahnt es. Der Satz bestätigt, was er schon spürt. Er erzeugt den Schmerz nicht. Er macht ihn sichtbar.

Und Sichtbarmachung ist der Zweck von Maloja. Einen schmerzhaften Fakt weicher zu formulieren, wäre Beschönigung. Beschönigung ist keine Ruhe. Beschönigung ist Vermeidung.

**Empfehlung:** So lassen. "Es fehlen" ist ehrlich, kurz und nicht wertend. Die Alternative — "Die erfassten Ausgaben übersteigen die Einnahmen um CHF 200" — wäre länger, bürokratischer und würde versuchen, den Fakt zu verstecken, indem sie ihn in Wörter einwickelt.

## 2. "Monatlicher Spielraum"

**Risiko: 1/5**

"Spielraum" ist ein neutrales, alltagssprachliches Wort. Es impliziert weder "genug" noch "nicht genug." Man hat Spielraum — ob viel oder wenig, sagt das Wort nicht.

Ein Alternativbegriff wäre "Monatsübersicht" — aber der deckt sich mit den Sektionen darüber und wäre redundant. "Saldo" wäre zu technisch. "Bilanz" klingt nach Buchhaltung.

**Empfehlung:** So lassen.

## 3. "Differenz" als Label

**Risiko: 2/5**

"Differenz" ist mathematisch korrekt, aber nicht die Sprache, in der Menschen über Geld reden. Man sagt "Was bleibt?" — nicht "Was ist die Differenz?"

Andererseits: Das Label steht in der Mirror-Card-Sektion, nicht im Lebenssatz. In der Sektion ist es ein technisches Label neben einem Wert. "Differenz: CHF 2'120 bleiben" — der Wert selbst ("bleiben") spricht die Sprache des Menschen. Das Label benennt die Rechnung.

**Alternative:** "Übrig" oder "Verbleibend" wären menschlicher. Aber sie implizieren, dass etwas übrig sein sollte — und was ist, wenn nichts übrig ist? "Differenz" ist neutral in alle Richtungen.

**Empfehlung:** So lassen. Das Label ist der technische Rahmen. Der Wert ist die menschliche Aussage. Die Kombination funktioniert.

## 4. "Einnahmen und erfasste Ausgaben gleichen sich aus."

**Risiko: 1/5**

Korrekt, neutral, verständlich. Etwas lang für einen Lebenssatz, aber der Nullfall ist selten. "Ausgeglichen" in der Mirror Card ist die kürzere Version — passt.

**Empfehlung:** So lassen.

---

# C. Was visuell riskant ist

---

## 1. Keine visuelle Unterscheidung positiv/negativ

**Risiko: 0/5**

Das ist kein Risiko — das ist das Prinzip. Positiv und negativ sehen gleich aus. Keine Farbe, kein Icon, kein Badge. Das ist richtig.

Maloja bewertet nicht. Auch nicht visuell.

## 2. Fettung der Differenzzeile

**Risiko: 1/5**

Die Differenzzeile in der Mirror Card ist fett (bold). Das gibt ihr visuelles Gewicht. Es sagt: "Das ist die Zusammenfassung." Nicht: "Achtung." Die Fettung ist eine Hierarchie-Markierung, keine Bewertung.

**Empfehlung:** So lassen. Die Fettung ist angemessen — sie hebt die Schlusszeile ab, ohne zu schreien.

## 3. Dashboard-Snippet zeigt keine Differenz

**Beobachtung:** Der Dashboard-Snippet zeigt "CHF 5'200, CHF 2'130 erfasste Ausgaben." — ohne die Differenz. Die Differenz erscheint erst im Finanzen-Kapitel selbst.

**Einschätzung:** Das ist richtig so. Der Dashboard-Snippet ist ein Hinweis, kein Bericht. Er sagt: "Du hast Finanzdaten." Er sagt nicht: "Deine Finanzen sind so und so." Die Differenz gehört in den Kontext des Kapitels, wo der Mensch die einzelnen Posten sehen und die Rechnung nachvollziehen kann.

Die Differenz auf dem Dashboard zu zeigen, wäre wie eine Diagnose ohne Befund. Die Zahl allein — ohne die Aufschlüsselung darunter — erzeugt Reaktion ohne Verständnis.

**Empfehlung:** Dashboard-Snippet nicht ändern.

---

# D. Empfehlung für Text

---

| Element | Aktuell | Empfehlung |
|---|---|---|
| Lebenssatz positiv | "Es bleiben CHF 2'120." | **So lassen** |
| Lebenssatz negativ | "Es fehlen CHF 200." | **So lassen** |
| Lebenssatz null | "Einnahmen und erfasste Ausgaben gleichen sich aus." | **So lassen** |
| Mirror-Card Titel | "Monatlicher Spielraum" | **So lassen** |
| Mirror-Card Label | "Differenz" | **So lassen** |
| Mirror-Card positiv | "CHF 2'120 bleiben" | **So lassen** |
| Mirror-Card negativ | "CHF 200 fehlen" | **So lassen** |
| Mirror-Card null | "Ausgeglichen" | **So lassen** |
| Dashboard-Snippet | Keine Differenz | **So lassen** |

Kein Text muss geändert werden.

---

# E. Empfehlung für Platzierung

---

| Ort | Aktuell | Empfehlung |
|---|---|---|
| Lebenssatz (Finanzen-Kapitel) | Differenz als letzter Satz | **So lassen** — natürlicher Abschluss |
| Mirror-Card-Sektion | Eigene Sektion "Monatlicher Spielraum" | **So lassen** — nachprüfbar, visuell abgesetzt |
| Dashboard-Snippet | Nur Einkommen + Ausgaben | **So lassen** — Kontext fehlt auf dem Dashboard |

Keine Platzierung muss geändert werden.

---

# F. Bewertung

---

| Dimension | Wert | Begründung |
|---|---|---|
| Klarheitsgewinn | 5/5 | Die Lebensfrage "Reicht es?" wird beantwortet. Zum ersten Mal sieht der Mensch, was übrig bleibt. |
| Ruhe | 4/5 | Positiv: maximale Ruhe. Negativ: ruhig, aber der Inhalt kann beunruhigen. Das ist kein Designfehler — das ist die Wahrheit. |
| Bewertungsfreiheit | 5/5 | Kein Adjektiv, keine Farbe, kein Urteil. Feststellung pur. |
| Emotionale Verträglichkeit | 4/5 | "Es fehlen CHF 200" kann wehtun. Aber es tut weniger weh als die vage Angst, es könnte nicht reichen. Die Zahl ersetzt die Angst durch ein Faktum. |
| Maloja-Gefühl | 5/5 | Fühlt sich an wie der Rest von Maloja: still, klar, ehrlich. Kein neues visuelles Element, keine neue Interaktion. Nur ein neuer Satz in einer bestehenden Karte. |
| Risiko | 1/5 | Triviale Mathematik. Keine Interpretation. Keine Bewertung. Das Einzige, was schiefgehen kann: der Mensch hat nicht alle Ausgaben erfasst. Aber "erfasste Ausgaben" sagt genau das. |

---

# G. Entscheidung

---

**So lassen.**

Die Finanzdifferenz fühlt sich wie Maloja an. Sie steht ruhig. Sie bewertet nicht. Sie sagt, was ist. Und sie beantwortet die Frage, die der Mensch seit Jahren mit sich trägt.

Kein Text muss geändert werden.
Keine Platzierung muss geändert werden.
Kein visuelles Element muss geändert werden.

Die Synthese ist fertig.
