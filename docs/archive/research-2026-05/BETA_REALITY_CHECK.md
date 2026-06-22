# BETA REALITY CHECK — Maloja Plana

> Erstellt: 2026-06-01
> Keine Implementierung. Keine Features. Keine Roadmap.
> Nur die ehrliche Frage: Wirkt Maloja heute bereits wie die App, die wir bauen wollten?

---

## 1. PRODUKTIDENTITÄT — Versprechen vs. Realität

### Die 8 tragenden Aussagen

Diese Sätze ziehen sich durch die gesamte Entwicklung. Sie definieren, was Maloja sein will:

| # | Aussage | Heute sichtbar? | Bewertung |
|---|---------|-----------------|-----------|
| 1 | **"Ein Ort, kein Dashboard"** | Teilweise | Das Malojapass-SVG und die Tier-Struktur schaffen Ort-Gefühl. Aber: Kapitelansichten sind Formularseiten. Sobald man das Dashboard verlässt, betritt man kein "Zimmer" — man betritt ein Formular. |
| 2 | **"Lebensräume statt Tools"** | Ansatzweise | Die Spiegelungen (Basis, Wohnen, Finanzen) sind der erste echte Schritt Richtung Lebensraum — sie reflektieren die Person, nicht die Felder. Aber nur 3 von 7 Kapiteln haben sie. Die restlichen 4 sind reine Datensammlung. |
| 3 | **"Dossiers statt Export"** | Teilweise | Lebensmappe und Notfall-Dossier existieren als Print-Preview. Aber: ZIP-Export, CSV-Import, Budget-JSON sind immer noch "Werkzeug-Buttons" verstreut in verschiedenen Views. Das Sackmesser lebt noch. |
| 4 | **"Orientierung statt Berechnung"** | Ja, aber inkonsequent | Helvetia-Orientierungssätze stehen unter Feldern — das ist echte Orientierung. Aber: SozialhilfeView, TaxCalculator, PremiumSubsidy sind Rechner. Sie berechnen und zeigen Zahlen. Die Orientierungs-Disclaimer stehen daneben, aber der Screen sagt: "Ich bin ein Rechner." |
| 5 | **"Begleiten statt Verwalten"** | Nur im Dashboard | Das Dashboard begleitet — Progress-Kommunikation, kontextabhängige Motivationstexte, Malojapass als Wegmetapher. Aber Kapitelansichten verwalten — Felder ausfüllen, speichern, nächstes Feld. Kein Kapitel sagt: "Wie geht es dir mit diesem Thema?" |
| 6 | **"Vertrauen statt Optimierung"** | Ja | Local-first, kein Tracking, keine Accounts, kein Cloud — das ist gelebtes Vertrauen. Datenschutz-Seite ist ehrlich. Alpha-Banner sagt klar "Orientierung, nicht Beratung". Hier stimmen Anspruch und Realität überein. |
| 7 | **"Helvetia als Orientierung"** | Ja | Helvetia ist Ton, nicht Feature. 19 Orientierungssätze, 4 Sprachen, inline unter Feldern. Ruhig, sachkundig, nie belehrend. Das funktioniert so, wie es gemeint war. |
| 8 | **"Budget mit Geduld und Feingefühl"** | Nein | Budget Light existiert mit guten Prinzipien ("Orientierung, nicht Bewertung"). Aber: 5 Ausgabekategorien, kein Schweizer Haushaltsbild, keine warme Sprache bei leeren Zuständen. Das Budget ist noch nicht geduldig — es ist dünn. |

### Ehrliches Gesamtbild

**Was funktioniert:**
Das Dashboard und die Helvetia-Schicht verkörpern die Produktidentität glaubwürdig. Der Malojapass als Weg-Metapher, die Tier-Struktur, die Orientierungssätze — das sind die Momente, in denen Maloja sich wie Maloja anfühlt.

**Was nicht funktioniert:**
Sobald man ein Kapitel öffnet, verschwindet die Identität. Man ist in einem Formular. Die Felder sind funktional korrekt, aber sie erzählen nichts. Sie begleiten nicht. Sie fragen ab. Der Bruch zwischen Dashboard-Gefühl und Kapitel-Gefühl ist die grösste Identitätslücke.

**Auf den Punkt:**
Maloja hat eine schöne Eingangshalle und funktionale Büros dahinter. Die Eingangshalle sagt "Ort". Die Büros sagen "Verwaltung".

---

## 2. SCHWEIZER IDENTITÄT — Authentisch oder Kitschig?

### Was vorhanden ist

| Element | Beschreibung | Bewertung |
|---------|-------------|-----------|
| **Malojapass-SVG** | 3-Layer Alpenprofil mit Pass-Sattel, Kapitel als Stationen | **Authentisch** — topographisch, nicht touristisch. Funktioniert als Wegmetapher. |
| **Fünfliber** | Heraldischer Schild, Lorbeerkranz, "2026" | **Grenzwertig** — als Easter Egg vertretbar, als prominentes UI-Element riskant. Noch nicht getestet. |
| **Helvetia-Silhouette** | Profil mit Robe und Krone | **Grenzwertig** — gleiche Einschätzung wie Fünfliber. Easter-Egg-Tiefe ist der richtige Ort. |
| **Alpen-Easter-Eggs** | Matterhorn, Tannen, Sonne, Fahne, Schokolade | **Kitsch-Risiko** — "Schokolade" und "Fahne" als Icons in einer App für vulnerable Menschen könnten als touristische Folklore wahrgenommen werden. |
| **Kuhglocke-Konzept** | Fristen-Erinnerungen statt Push-Notifications | **Authentisch als Metapher** — wenn es ruhig und ernst gemeint ist. Riskant, wenn es als Sound-Gag implementiert wird. |
| **Kapitel-Icons (Stationen)** | SVG-Pictogramme im Schweizer-Grafik-Stil | **Authentisch** — SBB/CFF-inspiriert, reduziert, funktional. |
| **DM Sans** | Schrift | **Neutral** — kein Schweizer Bezug, aber passt zum Gesamtbild. |
| **Palette (Creme/Salbei/Sand)** | Farbwelt | **Authentisch** — geerdet, natürlich, nicht folkloristisch. |
| **Schweizer Behördenkontext** | AHV, BVG, KVG, SKOS, IPV etc. | **Authentisch** — das ist der Kern-USP. Real, nützlich, einzigartig. |

### Risiko-Einschätzung

**A) Authentisch schweizerisch:**
- Malojapass als Wegmetapher
- Kapitel-Icons (SBB-Stil)
- Palette und Farbwelt
- Behördenkontext und Orientierungssätze
- Local-first als Schweizer Vertrauensprinzip
- "Plana" als Name (Ordnung + Silvaplana)

**B) Neutral:**
- DM Sans
- Progress-Bar
- Dossier-Konzept (könnte überall sein)

**C) Potenziell kitschig:**
- Schokolade, Fahne als Easter Eggs
- Fünfliber und Helvetia als visuelle Elemente (vertretbar als Easter Egg, riskant als Feature)
- Kuhglocke, falls nicht ernsthaft umgesetzt

### Das eigentliche Problem

**Kein einziger Mensch aus der Zielgruppe hat die Schweizer Symbolik beurteilt.**

Eine Person aus dem Kongo, die seit 6 Monaten in der Schweiz lebt und Sozialhilfe bezieht — empfindet sie den Fünfliber als "Swiss Quality" oder als "das ist nicht meine Schweiz"? Wir wissen es nicht.

Eine Expat-Familie aus Deutschland, die den Malojapass nie gesehen hat — versteht sie die Metapher? Wir wissen es nicht.

Die Schweizer Symbolik funktioniert als Designsprache für Sophie. Ob sie für die Zielgruppe funktioniert, ist eine offene Frage. Und es ist die richtige Frage für die Beta.

---

## 3. OFFENE FEEDBACK-LÜCKEN — Was nie gefragt wurde

### Grundlegende Produktfragen

| Frage | Jemals beantwortet? |
|-------|---------------------|
| Würde jemand Maloja weiterempfehlen? | **Nein** |
| Welches Kapitel wird zuerst geöffnet? | **Nein** |
| Was wirkt verwirrend? | **Teilweise** (Franchise, KVG — aber nur aus Top-10 Confusions, nicht aus Tests) |
| Was wirkt vertrauenswürdig? | **Nein** |
| Was wirkt unnötig? | **Nein** |
| Was fehlt am meisten? | **Teilweise** (Basel-Stadt User nannte Mietbeiträge, Retirement, Versicherungs-Links) |
| Wie fühlt sich die App nach 10 Minuten an? | **Nein** |

### Emotionale Fragen

| Frage | Jemals beantwortet? |
|-------|---------------------|
| Fühlt sich die App sicher an? | **Nein** |
| Gibt es Momente der Scham? | **Nein** |
| Gibt es Momente der Erleichterung? | **Nein** |
| Was macht Angst? | **Nein** |
| Was macht Mut? | **Nein** |
| Fühlt sich "Sozialhilfe" als Thema respektvoll behandelt an? | **Nein** — der Basel-Stadt User hat den Bug gemeldet, aber nie über sein Gefühl beim Benutzen gesprochen |

### Schweizer Identitätsfragen

| Frage | Jemals beantwortet? |
|-------|---------------------|
| Funktionieren die Schweizer Symbole? | **Nein** |
| Ist der Malojapass verständlich? | **Nein** |
| Wirkt die App "schweizerisch" oder "generisch"? | **Nein** |
| Sind Begriffe wie AHV, BVG, KVG verständlich? | **Teilweise** (Top-10 Confusions nennt Franchise und KVG als schwach) |
| Fühlt sich die App wie "meine Schweiz" an? | **Nein** |

### Praktische Fragen

| Frage | Jemals beantwortet? |
|-------|---------------------|
| Kann jemand die App ohne Hilfe benutzen? | **Nein** |
| Wie lange dauert es, bis ein neuer Nutzer produktiv ist? | **Nein** |
| Was würde jemand als erstes tun? | **Nein** |
| Was würde jemand nach 1 Woche tun? | **Nein** |
| Würde jemand seine echten Daten eingeben? | **Nein** |

---

## 4. BETA-TESTAUFGABEN — 5 menschliche Aufgaben

Nicht technisch. Nicht "klicke hier, prüfe dort". Sondern: Verstehen, Orientieren, Vertrauen, Identifizieren, Nutzen.

---

### Aufgabe 1: Ankommen

> Du hast gerade diese App zum ersten Mal geöffnet.
> Schau dich 2 Minuten um. Klicke nichts an.
> Dann erzähle:
>
> — Was glaubst du, wofür diese App da ist?
> — Für wen ist sie gemacht?
> — Würdest du weitermachen oder schliessen?

**Was wir lernen:** Ersteindruck. Orientierung. Identifikation. Ob das Dashboard "Ort" oder "Verwaltung" sagt.

---

### Aufgabe 2: Etwas von sich erzählen

> Gehe zu "Persönliche Basis".
> Trage deinen Vornamen, deinen Kanton und dein Geburtsdatum ein.
> Dann gehe zurück zum Dashboard.
>
> — Hat sich etwas verändert?
> — Wie fühlt es sich an, Daten einzugeben?
> — Vertraust du der App mit diesen Informationen?
> — Warum oder warum nicht?

**Was wir lernen:** Vertrauen. Datenschutz-Wahrnehmung. Ob die Spiegelung (Basis-MirrorCard) einen Moment der Resonanz erzeugt.

---

### Aufgabe 3: Ein schwieriges Thema

> Öffne das Kapitel "Finanzen & Geld".
> Schau dir die Felder an.
> Du musst nichts ausfüllen.
>
> — Wie fühlt sich diese Seite an?
> — Würdest du hier dein echtes Einkommen eintragen?
> — Gibt es etwas, das dich nervös macht?
> — Gibt es etwas, das dich beruhigt?

**Was wir lernen:** Emotionale Temperatur bei sensiblen Themen. Ob "Orientierung statt Berechnung" spürbar ist. Ob die Anti-Shame-Sprache funktioniert.

---

### Aufgabe 4: Etwas Schweizerisches verstehen

> Du siehst in der App den Begriff "Franchise".
> (Oder: "AHV", "Prämienverbilligung", "Betreibung" — je nach Testperson)
>
> — Weisst du, was das bedeutet?
> — Wenn ja: Erklärt die App es gut genug?
> — Wenn nein: Würdest du hier Hilfe erwarten?
> — Ist die Erklärung (falls vorhanden) verständlich?

**Was wir lernen:** Ob die Helvetia-Orientierungsschicht funktioniert. Ob Schweizer Begriffe für die Zielgruppe zugänglich sind. Ob 1–2 Sätze reichen.

---

### Aufgabe 5: Weitermachen oder nicht

> Du hast die App jetzt 10 Minuten benutzt.
>
> — Würdest du morgen wiederkommen?
> — Was würdest du als nächstes tun?
> — Würdest du die App jemandem empfehlen?
> — Wem? Und was würdest du über die App sagen?
> — Was fehlt dir am meisten?

**Was wir lernen:** Retention-Instinkt. Weiterempfehlungsbereitschaft. Die wichtigste fehlende Funktion aus Nutzersicht.

---

## 5. GRÖSSTE RISIKEN

| # | Risiko | Warum ernst |
|---|--------|-------------|
| 1 | **Kein Mensch aus der Zielgruppe hat die App getestet** | Alles bisherige Feedback stammt aus dem erweiterten Umfeld. Kein Immigrant, kein Geflüchteter, kein neurodivergenter Mensch hat Maloja jemals benutzt. Die App wurde für diese Menschen gebaut — ohne sie. |
| 2 | **Der Identitätsbruch zwischen Dashboard und Kapiteln** | Das Dashboard verspricht "Ort". Die Kapitel liefern "Formular". Beta-Tester spüren diesen Bruch. Er untergräbt das Vertrauen in die Produktidentität. |
| 3 | **Emotionale Temperatur bei schweren Themen** | SozialhilfeView, SchuldenManager, TaxCalculator — die Screens, die Menschen in der verletzlichsten Lage benutzen, sind die kältesten. Das ist nicht nur ein UX-Problem. Es widerspricht dem Kernversprechen. |
| 4 | **Budget zu dünn für echte Orientierung** | 5 Ausgabekategorien bilden keinen Schweizer Haushalt ab. Wer Budget Light öffnet und sein Leben nicht wiedererkennt, verliert Vertrauen in die gesamte App. |
| 5 | **Schweizer Symbolik ohne Validierung** | Malojapass, Fünfliber, Helvetia — gestaltet von Sophie, nicht getestet mit der Zielgruppe. Die Symbolik könnte als "Schweizer Folklore" wahrgenommen werden statt als "meine Lebensrealität". |
| 6 | **Impressum fehlt** | Rechtliche Pflicht. Ohne Name/Adresse/Kontakt kein öffentlicher Beta-Launch möglich. |

---

## 6. GRÖSSTE CHANCEN

| # | Chance | Warum jetzt |
|---|--------|-------------|
| 1 | **Die Spiegelungen sind der Durchbruch** | Basis, Wohnen, Finanzen zeigen bereits: Wenn Daten reflektiert statt gesammelt werden, entsteht "Lebensraum"-Gefühl. 4 weitere Kapitel könnten folgen. Das ist der Hebel, um den Identitätsbruch zu heilen. |
| 2 | **Helvetia funktioniert** | 19 Orientierungssätze, ruhig, sachkundig, inline. Das ist einzigartig. Kein Konkurrenzprodukt hat eine "Schweizer Orientierungsstimme". Mehr davon (Franchise, KVG, Mietbeiträge) ist reiner Content — keine Architektur. |
| 3 | **Local-first ist der stärkste Vertrauensbeweis** | "Deine Daten verlassen dein Gerät nie." In einer Welt voller Datenskandale ist das keine technische Eigenschaft — es ist ein emotionales Versprechen. Und es ist wahr. |
| 4 | **Empty-State-Wärme ist der schnellste Gewinn** | Die kalten Empty States ("no data", "incomplete") sind Textänderungen. 1 Tag Arbeit. Sofort spürbar für jeden neuen Nutzer. Der erste Bildschirm eines leeren Kapitels definiert das Gefühl der gesamten App. |
| 5 | **Der Basel-Stadt User ist der ideale erste Beta-Tester** | Diese Person hat bereits 7 Feedbacks gegeben, lebt die Zielgruppe, kennt die App. Ein strukturiertes Testgespräch mit dieser Person wäre mehr wert als 100 Seiten Dokumentation. |
| 6 | **Die Dossier-Idee ist fast fertig** | Lebensmappe und Notfall-Dossier existieren als Print-Preview. Der konzeptionelle Sprung von "Export-Buttons" zu "Meine Unterlagen als ruhiger Bereich" ist klein — aber er vollendet das Sackmesser→Dossier-Versprechen. |

---

## 7. DIE WICHTIGSTE FRAGE

### Wenn eine Person Maloja 10 Minuten benutzt — was sollte sie danach fühlen?

> "Ich bin nicht allein mit meinem Papierkram.
> Es gibt einen Ort, der mich versteht.
> Er fragt mich nicht alles auf einmal.
> Er erklärt mir Dinge, die ich nicht verstehe.
> Meine Daten bleiben bei mir.
> Ich kann morgen wiederkommen."

Das ist das Ziel. 6 Sätze. Kein Feature davon ist technisch komplex. Alles davon ist emotional.

### Was dieses Gefühl heute unterstützt

| Element | Warum es funktioniert |
|---------|----------------------|
| Malojapass-Dashboard | Ort-Gefühl, Wegmetapher, "Ich bin irgendwo angekommen" |
| Helvetia-Orientierungssätze | "Jemand erklärt mir das" — ruhig, in meiner Sprache |
| Spiegelungen (Basis, Wohnen, Finanzen) | "Die App sieht mich, nicht nur meine Daten" |
| Local-first / kein Login | "Meine Daten gehören mir" — sofort spürbar |
| Progress-Kommunikation | "Ich muss nicht alles sofort machen" |
| 4 Sprachen | "Die App spricht meine Sprache" |

### Was gegen dieses Gefühl arbeitet

| Element | Warum es schadet |
|---------|-----------------|
| Formular-Kapitel ohne Spiegelung | "Ach, doch wieder Felder ausfüllen." |
| 12px-Typografie in Kapiteln | "Das ist klein und dicht — wie ein Formular vom Amt." |
| Kalte Empty States | "Diese App wünscht sich, dass ich vollständig bin." |
| SozialhilfeView ohne Empathie | "Die App behandelt meine Armut wie eine Tabellenkalkulation." |
| SchuldenManager ohne Kontext | "Betreibung klingt hier genauso kalt wie beim Betreibungsamt." |
| Budget mit 5 Posten | "Das ist nicht mein Leben." |
| Verstreute Export-Buttons | "Wo kriege ich meine Unterlagen her?" |

---

## ZUSAMMENFASSUNG

Maloja Plana hat eine klare, starke, ehrliche Produktidentität. Die Vision ist aussergewöhnlich.

Die Frage für die Beta ist nicht "funktioniert es technisch" — das tut es.

Die Frage ist: **Fühlt es sich an wie das, was es sein will?**

Heute: Teilweise. Das Dashboard ja. Die Kapitel noch nicht. Die schweren Themen am wenigsten.

Die gute Nachricht: Die Lücke ist nicht architektonisch. Sie ist emotional. Und emotionale Lücken lassen sich mit Text, Raum und Wärme schliessen — nicht mit neuen Features.

---

*BETA_REALITY_CHECK.md — Ehrlicher Blick auf die Produktrealität vor der Beta.*
*Keine Implementierung. Nur Klarheit.*
