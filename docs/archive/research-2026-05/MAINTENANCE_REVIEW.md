# Maintenance Review

**Projekt:** Maloja Plana
**Datum:** 2026-06-13
**Grundlage:** D-1 bis D-25

---

# Drei Tätigkeiten

**Erfassen** ist: Zum ersten Mal eintragen. "Mein Einkommen ist CHF 5'400." Das kostet am meisten Energie — weil der Mensch sich erinnern, nachschauen, schätzen muss. Und weil die App noch fremd ist.

**Aktualisieren** ist: Einen bestehenden Wert ändern. "Mein Einkommen ist jetzt CHF 5'600." Das kostet wenig Energie — weil der Mensch weiss, wo das Feld ist. Und weil er nur eine Zahl ändert, nicht eine Entscheidung trifft.

**Nachschlagen** ist: Einen bestehenden Wert lesen. "Wie war meine AHV-Nummer nochmal?" Das kostet keine Energie — ausser der Energie, Maloja zu öffnen und das richtige Kapitel zu finden.

Erfassen ist Arbeit. Aktualisieren ist Pflege. Nachschlagen ist Nutzung.

Maloja wurde bisher ausschliesslich als Erfassungs-Werkzeug analysiert. Aber: Erfassen passiert einmal. Aktualisieren und Nachschlagen passieren über Jahre.

---

# A. Die Lebensdauer der Informationen

---

Jedes Feld hat eine natürliche Halbwertszeit: die Zeit, nach der die eingetragene Information mit 50% Wahrscheinlichkeit nicht mehr stimmt.

---

## Felder, die fast nie altern

| Feld | Kapitel | Halbwertszeit | Warum |
|---|---|---|---|
| firstName | Basis | ∞ | Ändert sich nie (ausser Heirat/Transition) |
| lastName | Basis | 20+ Jahre | Ändert sich bei Heirat |
| dateOfBirth | Basis | ∞ | Ändert sich nie |
| gender | Basis | ∞ | Ändert sich selten |
| nationality | Basis | 20+ Jahre | Ändert sich bei Einbürgerung |
| ahv | Basis | ∞ | Lebenslange Nummer |
| bloodType | Notfall | ∞ | Ändert sich nie |
| educationLevel | Ausbildung | 10+ Jahre | Ändert sich bei Weiterbildung |

**8 Felder, die praktisch nie aktualisiert werden müssen.**

Diese Felder sind "einmal richtig, immer richtig." Sie sind das stabilste Fundament von Maloja. Ein Mensch, der 2026 seinen Vornamen einträgt, muss dieses Feld 2036 nicht überprüfen.

---

## Felder, die jährlich altern

| Feld | Kapitel | Halbwertszeit | Typischer Auslöser |
|---|---|---|---|
| kkPremium | Versicherungen | 1 Jahr | Prämienänderung Januar |
| franchise | Versicherungen | 1–3 Jahre | Modellwechsel |
| kkModel | Versicherungen | 2–3 Jahre | Anbieterwechsel |
| monthlyTax | Finanzen | 1 Jahr | Neue Steuerrechnung |
| monthlyIncome | Finanzen | 1–2 Jahre | Lohnerhöhung, Jobwechsel |
| groceries | Finanzen | 1 Jahr | Inflation, Lebensänderung |
| mobility | Finanzen | 1–2 Jahre | ÖV-Preise, Umzug |
| pension3a | Finanzen | 1 Jahr | Jährliche Einzahlung |
| savingsAccount | Finanzen | 1 Jahr | Kontobewegungen |

**~9 Felder, die einmal pro Jahr überprüft werden sollten.**

Das sind vor allem Finanz- und Versicherungsfelder. Ihr gemeinsamer Auslöser: der Jahreswechsel. Neue Krankenkassenprämie (Januar). Neue Steuerrechnung (Februar/März). Neuer Lohnausweis (Januar). Neues Budget (Vorsatz).

Ein natürlicher Pflege-Rhythmus wäre: einmal im Januar Finanzen und Versicherungen durchgehen. 20 Minuten. 9 Felder überprüfen, 3–5 davon ändern.

---

## Felder, die bei Lebensereignissen altern

| Feld | Kapitel | Auslöser | Wie viele Felder gleichzeitig |
|---|---|---|---|
| maritalStatus | Basis | Heirat, Scheidung, Verwitwung | 1 |
| household | Basis | Geburt, Auszug, Tod | 1 |
| employer | Finanzen/Ausbildung | Jobwechsel | 3–5 (Einkommen, Anstellungsart, Arbeitgeber, Pensum) |
| monthlyIncome | Finanzen | Jobwechsel, Beförderung, Entlassung | 1–3 |
| employmentType | Finanzen | Jobwechsel, Selbständigkeit, Arbeitslosigkeit | 1 |
| rentAmount | Wohnen | Umzug, Mieterhöhung | 4–8 (Adresse, PLZ, Stadt, Miete, Vermieter, Nebenkosten) |
| address/city/postalCode | Wohnen | Umzug | 3 |
| canton | Basis | Umzug in anderen Kanton | 2–3 (Kanton, Steuerkanton) |
| emergencyContact | Notfall | Trennung, neuer Partner, Tod | 2 |
| workPermit | Ausbildung | Bewilligungswechsel | 1 |
| kkInsurer | Versicherungen | Anbieterwechsel | 3–4 |
| debtPayments | Finanzen | Neue Schulden, Tilgung | 1–2 |
| alimentePaid/Received | Finanzen | Scheidung, Volljährigkeit Kind | 1 |
| betreibungsStatus | Behörden | Betreibungsverfahren | 1 |
| medications | Notfall | Neue Diagnose, neue Therapie | 1–2 |
| chronicDiseases | Notfall | Neue Diagnose | 1 |

**Das Muster:** Lebensereignisse ändern nicht ein Feld — sie ändern Cluster. Ein Umzug betrifft 4–8 Felder in 2 Kapiteln. Ein Jobwechsel betrifft 3–5 Felder in 2 Kapiteln. Eine Scheidung betrifft 5–8 Felder in 3 Kapiteln.

**Die wichtigsten Lebensereignisse und ihr Maloja-Aufwand:**

| Ereignis | Betroffene Felder | Betroffene Kapitel | Pflege-Aufwand |
|---|---|---|---|
| Umzug (gleicher Kanton) | 4–6 | Wohnen | 10 Minuten |
| Umzug (anderer Kanton) | 6–8 | Wohnen, Basis, Behörden | 15 Minuten |
| Jobwechsel | 3–5 | Finanzen, Ausbildung | 10 Minuten |
| Entlassung | 3–4 | Finanzen, Ausbildung | 5 Minuten (emotional: 30) |
| Heirat | 3–5 | Basis, Finanzen, Behörden | 10 Minuten |
| Scheidung | 5–8 | Basis, Finanzen, Notfall | 15 Minuten (emotional: 60) |
| Geburt eines Kindes | 3–5 | Basis, Finanzen, Versicherungen | 10 Minuten |
| Neue Diagnose | 2–3 | Notfall | 5 Minuten |
| Tod eines Angehörigen | 2–4 | Notfall, Basis | 5 Minuten (emotional: unendlich) |
| Krankenkassenwechsel | 3–4 | Versicherungen | 10 Minuten |
| Einbürgerung | 2–3 | Basis, Ausbildung | 5 Minuten |

---

## Felder, die kontinuierlich altern

| Feld | Kapitel | Alterungsrate | Das Problem |
|---|---|---|---|
| savingsAccount | Finanzen | Täglich | Kontostand ändert sich ständig |
| loans | Finanzen | Monatlich | Tilgung reduziert Betrag |
| groceries | Finanzen | Monatlich | Schwankend, saisonal |

Diese Felder haben keine Halbwertszeit — sie sind immer leicht falsch. "Sparkonto: CHF 12'000" — das war gestern richtig. Heute ist es 11'950 oder 12'050.

**Die Frage:** Lohnt es sich, diese Felder zu pflegen? Oder akzeptiert man, dass sie Näherungswerte sind?

**Die Antwort:** Näherung reicht. "Sparkonto: ca. 12'000" ist nützlicher als "Sparkonto: ___" (leer). Die Genauigkeit auf den Franken ist irrelevant. Die Grössenordnung zählt.

---

## Die Lebensdauer-Übersicht

| Lebensdauer | Felder | Anteil | Pflege |
|---|---|---|---|
| ∞ (ändert sich nie) | ~8 | 7% | Keine |
| 10+ Jahre | ~5 | 4% | Einmal pro Jahrzehnt |
| 1–5 Jahre | ~25 | 21% | Jährlich |
| Bei Lebensereignis | ~35 | 30% | Bei Bedarf |
| Kontinuierlich | ~5 | 4% | Immer leicht falsch |
| Nummern (ändern sich nie, aber brauchen Nachschlagen) | ~4 | 3% | Keine |
| Nischensituationen (irrelevant wenn nicht zutreffend) | ~10 | 9% | Keine |
| Übriges (mischbar) | ~25 | 21% | Gelegentlich |

---

# B. Pflegeaufwand pro Kapitel

---

## Basis — Pflege: minimal

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| firstName | Nie | — |
| lastName | Selten | Heirat |
| dateOfBirth | Nie | — |
| gender | Nie | — |
| nationality | Selten | Einbürgerung |
| canton | Selten | Umzug |
| phone | Selten | Neuer Vertrag |
| email | Selten | — |
| ahv | Nie | — |
| maritalStatus | Selten | Lebensereignis |
| household | Selten | Geburt, Auszug |

**Jährlicher Pflegeaufwand:** 0 Minuten (ausser bei Lebensereignis).
**Pflege-Trigger:** Heirat, Scheidung, Umzug, Kind. Sonst: nie.

Basis ist das stabilste Kapitel. Einmal erfasst, jahrelang korrekt.

---

## Wohnen — Pflege: niedrig (ausser Umzug)

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| address, postalCode, city | Selten | Umzug |
| moveInDate | Selten | Umzug |
| rentAmount | 1–3 Jahre | Mieterhöhung |
| utilities | 1–2 Jahre | Nebenkostenabrechnung |
| landlord, landlordPhone | Selten | Umzug, Verwalterwechsel |
| Eigenheim-Felder | Selten | Hypothekenanpassung |

**Jährlicher Pflegeaufwand:** 0–5 Minuten. Mieterhöhung: 1 Feld ändern.
**Pflege-Trigger:** Umzug (alles ändert sich), Mieterhöhung, Nebenkostenabrechnung.

Wohnen ist stabil — bis man umzieht. Dann ändert sich alles auf einmal.

---

## Finanzen — Pflege: am höchsten

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| monthlyIncome | 1–2 Jahre | Lohnerhöhung, Jobwechsel |
| employer | 2–5 Jahre | Jobwechsel |
| employmentType | 2–5 Jahre | Jobwechsel |
| monthlyTax | 1 Jahr | Steuerrechnung |
| groceries, mobility, communication | 1 Jahr | Preisänderungen, Lebensänderungen |
| debtPayments | Monatlich | Tilgung |
| savingsAccount | Kontinuierlich | Kontobewegungen |
| pension3a | 1 Jahr | Jahreseinzahlung |

**Jährlicher Pflegeaufwand:** 15–20 Minuten.
**Pflege-Trigger:** Januar (neue Steuerrechnung, Lohnausweis), Jobwechsel, Gehaltsänderung.

Finanzen ist das pflegeintensivste Kapitel. Weil Geld sich ständig bewegt. Einkommen steigt (oder sinkt). Preise steigen. Schulden werden getilgt. Das Sparkonto schwankt.

**Das Problem:** Finanzen ist das Kapitel, das am schnellsten veraltet — und gleichzeitig das Kapitel mit der wichtigsten Synthese ("Dir bleiben CHF X"). Wenn die Synthese auf veralteten Daten basiert, ist sie falsch. Und eine falsche Synthese ist schlimmer als keine Synthese.

---

## Versicherungen — Pflege: jährlich

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| kkPremium | 1 Jahr | Prämienänderung Januar |
| kkInsurer | 2–5 Jahre | Anbieterwechsel |
| franchise | 1–3 Jahre | Modellwechsel |
| kkModel | 2–3 Jahre | Modellwechsel |
| Übrige | Selten | Neuabschluss, Kündigung |

**Jährlicher Pflegeaufwand:** 5–10 Minuten.
**Pflege-Trigger:** Januar (neue Prämie), Anbieterwechsel.

Ein natürlicher Moment: Der Brief der Krankenkasse im November ("Ihre neue Prämie ab Januar"). Das ist der Moment, Maloja zu öffnen und die Prämie zu ändern. Ein Feld. 30 Sekunden.

---

## Ausbildung — Pflege: minimal

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| jobTitle | 2–5 Jahre | Jobwechsel, Beförderung |
| employer | 2–5 Jahre | Jobwechsel |
| workPermit | 1–5 Jahre | Bewilligungswechsel |
| Übrige | Selten | Weiterbildung |

**Jährlicher Pflegeaufwand:** 0–5 Minuten.
**Pflege-Trigger:** Jobwechsel, Beförderung, Weiterbildung, Bewilligungswechsel.

Ausbildung ist das zweitstabilste Kapitel nach Basis.

---

## Behörden — Pflege: jährlich (aber punktuell)

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| cantoneOfTaxation | Selten | Umzug |
| taxFillingDeadline | 1 Jahr | Neue Frist |
| pendingTaxReturns | 1 Jahr | Abgabe/Neuberechnung |
| betreibungsStatus | Selten (hoffentlich) | Verfahren |
| willMade | Selten | Erstellung/Änderung |

**Jährlicher Pflegeaufwand:** 5 Minuten.
**Pflege-Trigger:** Steuererklärung (Frühling), Umzug.

---

## Notfall — Pflege: bei medizinischen Veränderungen

| Feld | Änderungsfrequenz | Auslöser |
|---|---|---|
| emergencyContact | Selten | Beziehungsänderung |
| medications | Bei neuer Verschreibung | Arztbesuch |
| chronicDiseases | Bei neuer Diagnose | Arztbesuch |
| doctor | Selten | Arztwechsel |
| Vorsorge-Felder | Selten | Erstellung von Dokumenten |

**Jährlicher Pflegeaufwand:** 0–5 Minuten.
**Pflege-Trigger:** Neue Diagnose, neues Medikament, neuer Arzt, Beziehungsänderung.

Notfall ist stabil — bis sich die Gesundheit ändert. Dann ist die Aktualisierung dringend (neue Medikamente nach Diagnose) und emotional aufgeladen.

---

## Gesamter Pflegeaufwand pro Jahr

| Kapitel | Jährlicher Aufwand | Trigger |
|---|---|---|
| Basis | 0 Min | Lebensereignis |
| Wohnen | 0–5 Min | Mieterhöhung |
| Finanzen | 15–20 Min | Januar |
| Versicherungen | 5–10 Min | Januar |
| Ausbildung | 0–5 Min | Jobwechsel |
| Behörden | 5 Min | Steuererklärung |
| Notfall | 0–5 Min | Gesundheitsänderung |
| **Gesamt** | **25–50 Min/Jahr** | — |

**Eine halbe Stunde pro Jahr.** Das ist der Preis für ein aktuelles Maloja.

Zum Vergleich: Die erste Erfassung (117 Felder) dauert 2–4 Stunden. Die jährliche Pflege dauert 25–50 Minuten. Das Verhältnis ist 4:1 bis 8:1. Erfassen ist 4–8× aufwändiger als Pflegen.

---

# C. Die natürliche Besuchsfrequenz

---

Wie oft öffnet ein Mensch Maloja — wenn er nicht aktiv daran erinnert wird?

---

## Natürliche Anlässe

| Anlass | Frequenz | Was der Mensch tut | Kapitel |
|---|---|---|---|
| AHV-Nummer nachschlagen | 3–5× pro Jahr | Nachschlagen | Basis |
| KK-Kartennummer nachschlagen | 2–3× pro Jahr | Nachschlagen | Versicherungen |
| Neue Krankenkassenprämie | 1× pro Jahr (Januar) | Aktualisieren | Versicherungen |
| Steuererklärung | 1× pro Jahr (Frühling) | Nachschlagen + Aktualisieren | Finanzen, Behörden |
| Arztbesuch | 2–4× pro Jahr | Nachschlagen | Notfall, Versicherungen |
| Behördengang | 1–3× pro Jahr | Nachschlagen | Basis, Behörden |
| Lohnerhöhung | 0–1× pro Jahr | Aktualisieren | Finanzen |
| Wohnungsbewerbung | Alle paar Jahre | Nachschlagen + Export | Alle |
| Umzug | Alle 3–7 Jahre | Aktualisieren (viel) | Wohnen, Basis, Behörden |
| Jobwechsel | Alle 2–5 Jahre | Aktualisieren (mittel) | Finanzen, Ausbildung |
| Krise (Krankheit, Trennung, Entlassung) | Unvorhersagbar | Aktualisieren (emotional) | Verschieden |

**Die natürliche Besuchsfrequenz:** 8–15× pro Jahr. Einmal alle 3–5 Wochen.

Davon:
- ~70% Nachschlagen (AHV, KK-Karte, Steuerdaten)
- ~25% Aktualisieren (Prämie, Einkommen, Steuertermin)
- ~5% Erfassen (neues Feld, das vorher leer war)

---

## Die zwei Rhythmen

### Rhythmus 1: Der Januar-Check

Januar ist der natürliche Pflegemonat. Neue Krankenkassenprämie. Neuer Lohnausweis. Neues Budget.

Ein Mensch, der im Januar 20 Minuten in Maloja verbringt, hat sein Finanzen- und Versicherungs-Kapitel aktualisiert. Für ein ganzes Jahr.

### Rhythmus 2: Der Krisen-Check

Unvorhersagbar. Jobverlust. Diagnose. Trennung. Umzug.

In einer Krise öffnet der Mensch Maloja nicht, um zu pflegen. Er öffnet es, um nachzuschauen. "Wie viel habe ich auf dem Sparkonto?" "Wer ist mein Notfallkontakt?" "Wie heisst mein Anwalt?"

Und dann — nachdem die Krise sich stabilisiert hat — aktualisiert er. "Einkommen: jetzt CHF 0. Anstellungsart: arbeitslos." Das ist der schmerzhafteste Pflege-Moment. Nicht weil das Tippen Aufwand ist. Sondern weil das Ändern eine Wahrheit bestätigt.

---

## Die Gefahr der Nicht-Pflege

Was passiert, wenn der Mensch sein Maloja nicht pflegt?

**Jahr 1:** Alles stimmt (grösstenteils).
**Jahr 2:** Krankenkassenprämie stimmt nicht mehr (+CHF 15/Monat). Einkommen stimmt vielleicht nicht mehr. Lebensmittelschätzung veraltet.
**Jahr 3:** Finanzsynthese ist falsch. "Dir bleiben CHF 2'070" — aber in Wahrheit sind es CHF 1'850. Die Differenz wächst.
**Jahr 5:** Die Hälfte der Finanzfelder stimmt nicht mehr. Der Lebenssatz ist falsch. Der Spiegel zeigt ein Gesicht von vor fünf Jahren.

**Ab wann ist ein ungepflegtes Maloja schädlich?**

Ab dem Moment, in dem der Mensch einer falschen Information vertraut. "Mein Sparkonto hat CHF 12'000." Hat es aber nicht — es hat CHF 3'000, weil er in der Zwischenzeit ein Auto gekauft hat. Wenn er eine Entscheidung auf der falschen Zahl basiert, hat Maloja geschadet statt geholfen.

**Zeitrahmen:** Nach 2–3 Jahren ohne Pflege ist ein Maloja mit Finanzfeldern potenziell irreführend. Nach 5 Jahren ohne Pflege ist es ein historisches Dokument, kein aktueller Spiegel.

---

# D. Die grössten Veraltungsrisiken

---

## Risiko 1: Stille Veraltung der Finanzen

**Was passiert:** Die Krankenkassenprämie steigt im Januar. Der Mensch ändert sie nicht in Maloja. Die Finanzsynthese basiert auf dem alten Betrag. "Dir bleiben CHF 2'070" — stimmt nicht, weil die Prämie um 40 Franken gestiegen ist. "Dir bleiben CHF 2'030."

40 Franken Differenz. Klingt wenig. Aber: Maloja zeigt die alte Zahl. Mit der Autorität eines berechneten Werts. Ohne Warnung. Ohne "Stand: Januar 2026." Ohne "Zuletzt aktualisiert vor 14 Monaten."

**Warum es ein Risiko ist:** Weil der Mensch der Zahl vertraut. Die Zahl steht da, in einem Feld, berechnet. Sie sieht aktuell aus. Sie ist es nicht.

**Schweregrad:** ★★★★ (schleichend, aber kumulativ)

---

## Risiko 2: Veralteter Notfallkontakt

**Was passiert:** Der Mensch trägt seinen Partner als Notfallkontakt ein. Zwei Jahre später trennen sie sich. Der Notfallkontakt in Maloja ist immer noch der Ex-Partner.

Wenn der Mensch einen Unfall hat und jemand die Notfallkarte sieht: Es wird der Ex-Partner angerufen. Nicht die Mutter. Nicht der neue Partner. Der Ex.

**Warum es ein Risiko ist:** Weil falsche Notfallinformationen schlimmer sind als keine. "Kein Notfallkontakt" → Rettungssanitäter sucht selbst. "Falscher Notfallkontakt" → Rettungssanitäter ruft die falsche Person an.

**Schweregrad:** ★★★★★ (potenziell lebensrelevant)

---

## Risiko 3: Veraltete Medikation

**Was passiert:** Der Mensch trägt seine Medikamente ein: "Metformin 500mg." Ein Jahr später ändert der Arzt die Dosierung: "Metformin 1000mg." Der Mensch ändert es nicht in Maloja.

Im Notfall: Die Notfallkarte zeigt die halbe Dosis. Der Arzt im Spital geht von 500mg aus. Medizinische Entscheidung auf falscher Grundlage.

**Schweregrad:** ★★★★★ (medizinisch relevant)

---

## Risiko 4: Veraltete Arbeitssituation

**Was passiert:** Der Mensch wird entlassen. Er ändert "Anstellungsart: Festanstellung" nicht zu "arbeitslos." Sein Maloja zeigt weiterhin "Einkommen: CHF 5'400."

Kein unmittelbares Risiko. Aber: Der Spiegel lügt. Er zeigt ein Leben, das nicht mehr existiert. Und ein Spiegel, der lügt, ist kein Spiegel — er ist eine Illusion.

**Schweregrad:** ★★★ (emotional, nicht praktisch)

---

## Risiko 5: Veraltete Versicherungssituation

**Was passiert:** Der Mensch wechselt die Krankenkasse. Von CSS zu Helsana. Er ändert es nicht in Maloja. "Grundversichert bei CSS" — falsch.

Beim Arztbesuch, wenn er die KK-Karte vergessen hat und in Maloja nachschaut: CSS. Falsch. Der Arzt rechnet mit CSS ab. Die Rechnung geht an den falschen Versicherer.

**Schweregrad:** ★★★ (praktische Konsequenz, aber korrigierbar)

---

## Die Veraltungskaskade

Das Tückische: Veraltung geschieht nicht plötzlich. Sie geschieht schleichend. Ein Feld nach dem anderen. Zuerst die Prämie. Dann das Einkommen. Dann die Adresse. Dann der Notfallkontakt.

Jedes einzelne veraltete Feld ist harmlos. Die Summe ist es nicht. Weil: Wenn genug Felder veraltet sind, stimmt der Lebenssatz nicht mehr. Und ein falscher Lebenssatz ist schlimmer als kein Lebenssatz. Weil er Vertrauen zerstört.

"Sophie Stebler, wohnhaft im Kanton Zürich." — Aber sie ist vor einem Jahr nach Bern gezogen. Der Spiegel zeigt die falsche Stadt. Das Vertrauen bricht. "Dem kann ich nicht trauen."

---

# E. Die Bedeutung von Aktualität

---

## Aktualität ist das Immunsystem von Maloja

D-25 sagt: "Aktualität schlägt Vollständigkeit. Immer."

Das stimmt. Aber es geht weiter: Aktualität ist nicht nur wertvoller als Vollständigkeit. Aktualität ist die Bedingung für Wert.

Ein aktuelles Maloja mit 18 Feldern hat Wert.
Ein veraltetes Maloja mit 117 Feldern hat negativen Wert (es erzeugt falsche Sicherheit).

**Aktualität ist nicht ein Feature. Es ist die Existenzbedingung.**

---

## Was Aktualität erfordert

Nicht viel. 25–50 Minuten pro Jahr. Einmal im Januar (Finanzen, Versicherungen). Einmal bei einem Lebensereignis (was sich ändert, ändern).

Aber: Diese 25–50 Minuten müssen stattfinden. Ohne sie verfällt Maloja. Langsam. Leise. Ohne Warnung.

---

## Was Maloja aktuell tut, um Aktualität zu fördern

Nichts.

Kein "Zuletzt bearbeitet am..." Kein "Deine Krankenkassenprämie wurde vor 14 Monaten zuletzt geändert." Kein "Stimmt das noch?" Keine Erinnerung. Kein Hinweis. Nichts.

Maloja ist stumm. Es zeigt die Daten, die einmal eingetragen wurden. Es fragt nie: "Stimmt das noch?"

---

## Die Grenze: Keine Erinnerungen

Maloja darf nicht erinnern. D-12: "Silence before action." D-13: "Keine Notifications" ist eine rote Linie.

Keine Push-Benachrichtigung: "Aktualisiere dein Maloja!"
Keine E-Mail: "Deine Daten könnten veraltet sein."
Kein Badge: "3 Felder überprüfen."

All das wäre das Gegenteil von Ruhe. Es wäre Druck. Und Druck ist Anti-Maloja.

---

## Was stattdessen möglich wäre

Nicht erinnern. Sondern: zeigen. Leise.

Wenn der Mensch Maloja öffnet — aus eigenem Antrieb, weil er etwas nachschlagen will — könnte er sehen:

"Zuletzt bearbeitet: Januar 2026."

Ein Datum. Keine Warnung. Keine Aufforderung. Nur ein Datum. Und der Mensch entscheidet selbst, ob "Januar 2026" noch aktuell genug ist.

Oder, noch leiser: Der Lebenssatz könnte einen Zeitbezug haben.

"Sophie Stebler, geboren am 15. März 1990, wohnhaft im Kanton Zürich. Stand: Januar 2026."

"Stand: Januar 2026." Vier Wörter. Kein Druck. Keine Aufforderung. Nur: Transparenz.

---

# F. Empfehlung

---

## Was die Analyse zeigt

1. **Pflege ist billig.** 25–50 Minuten pro Jahr. Ein Bruchteil der Ersterfassung.
2. **Pflege hat natürliche Trigger.** Januar (Finanzen, Versicherungen). Lebensereignisse (alles andere).
3. **Ohne Pflege verfällt Maloja.** Nach 2–3 Jahren ist es potenziell irreführend.
4. **Maloja fördert Pflege nicht.** Kein Datum, kein Hinweis, keine Transparenz.
5. **Maloja darf nicht erinnern.** Keine Notifications, kein Druck.

---

## Der natürliche Pflege-Zyklus

Das ideale Maloja-Jahr:

**Januar:** Krankenkassenprämie aktualisieren. Einkommen überprüfen. Steuertermin setzen. 15 Minuten.

**Bei Bedarf:** Umzug → Wohnen aktualisieren. Jobwechsel → Finanzen + Ausbildung aktualisieren. Neue Diagnose → Notfall aktualisieren. Trennung → Notfallkontakt + Basis aktualisieren.

**Zwischendurch:** Nachschlagen. AHV-Nummer beim Arzt. Steuernummer bei der Behörde. KK-Kartennummer in der Apotheke.

**Gesamtaufwand pro Jahr:** 25–50 Minuten aktive Pflege. Plus 5–10 Nachschlage-Momente à 30 Sekunden.

---

## Was der Mensch tun muss, damit Maloja in drei Jahren noch hilft

Drei Dinge:

### 1. Einmal im Jahr öffnen und Finanzen überprüfen

Nicht alle 117 Felder. Nur Finanzen und Versicherungen. 9 Felder überprüfen. 3–5 ändern. 15 Minuten.

### 2. Bei Lebensereignissen aktualisieren

Umzug: 10 Minuten. Jobwechsel: 10 Minuten. Trennung: 15 Minuten. Neue Diagnose: 5 Minuten.

Nicht sofort. Nicht am Tag des Ereignisses. Aber: innerhalb von Wochen. Wenn die neue Realität sich gesetzt hat. Wenn der Mensch bereit ist, die neue Wahrheit in ein Feld zu schreiben.

### 3. Den Notfallkontakt aktuell halten

Das wichtigste einzelne Feld. Wenn sich die Person ändert, der man sein Leben anvertraut — dann muss dieses eine Feld aktualisiert werden. Das ist kein Aufwand. Das ist eine Verantwortung.

---

## Was das für das Produkt bedeutet

Maloja muss nichts tun, um Pflege zu erzwingen. Pflege ist die Verantwortung des Menschen.

Aber Maloja kann etwas tun, um Pflege zu ermöglichen:

**Ein Datum.** "Zuletzt bearbeitet: Januar 2026." Sichtbar auf dem Dashboard. Leise. Ohne Druck.

**Ein Lebenssatz-Datum.** "Stand: Januar 2026" am Ende jedes Lebenssatzes. Damit der Mensch weiss: "Das war im Januar richtig. Ist es im September noch richtig?"

Mehr nicht. Kein Reminder. Kein Badge. Kein "Überprüfe jetzt." Nur: ein Datum. Und die Intelligenz des Menschen, der selbst entscheidet, ob es Zeit ist.

---

> **Was muss ein Mensch tun, damit sein Maloja in drei Jahren noch hilfreich ist?**
>
> Einmal im Jahr öffnen. 15 Minuten. Finanzen und Versicherungen überprüfen.
>
> Bei grossen Veränderungen aktualisieren. 10 Minuten. Was sich geändert hat, ändern.
>
> Den Notfallkontakt aktuell halten. 30 Sekunden. Wenn nötig.
>
> Das ist alles.
>
> Kein Aufwand. Keine Disziplin. Nur: ein Moment im Jahr, in dem man seinen Spiegel putzt.
>
> Weil ein verstaubter Spiegel noch ein Spiegel ist. Und ein Wisch mit dem Tuch reicht, um sich wieder zu sehen.
>
> Aber wenn der Staub drei Jahre liegt, sieht man nur noch Staub.

---

*Analyse erstellt am 2026-06-13. Keine Implementierung. Kein Commit.*
