# Known Issues — Beta (Stand 2026-11-04, Version `0.1.49-beta`)

> Diese Liste ist für Tester gedacht. Hier stehen Dinge, die wir kennen und bewusst noch nicht behoben haben.

---

## Rechner-Einschränkungen (geprüft gegen den Code, 04.11.2026, Version `0.1.49-beta`)

| Thema | Was passiert | Auswirkung |
|---|---|---|
| **Steuerrechner** | Kanton und Gemeinde sind eine grobe Schätzung für den **Hauptort** des Kantons, **ohne Kirchensteuer**, aus Messpunkten des ESTV-Steuerrechners | In anderen Gemeinden kann der Betrag abweichen |
| **Steuerrechner: Quellensteuer** | Ohne Bewilligung C zeigt der Rechner **keine** Schätzung, weil Quellensteuer möglich ist (DBG Art. 83, 88) | Gewollt: lieber keine Zahl als eine falsche |
| **Steuerrechner: anderer Zivilstand / andere Kinderzahl** | Das eingetragene steuerbare Einkommen gehört zum Profil. Für eine andere Situation rechnet der Rechner nicht | Gewollt, Hinweis steht beim Rechner |
| **Prämienverbilligung (IPV)** | Jeder der 26 Kantone hat ein eigenes Modell nach der amtlichen Tabelle oder Formel (Jahr 2026) | Der Betrag ist eine Orientierung, verbindlich entscheidet die kantonale Stelle |
| **Sozialhilfe: Konkubinat** | Im stabilen Konkubinat zählt ein Konkubinatsbeitrag als Einnahme (SKOS-RL D.4.4). Den kann die App nicht rechnen | Nur ein Hinweis, kein Betrag |
| **Sozialhilfe: Haushaltsführung** | Wer für Mitbewohnende den Haushalt führt, dem wird eine Entschädigung angerechnet (SKOS-RL D.4.5). Sie hängt am Budget der anderen | Nur ein Hinweis, kein Betrag |
| **Rappen-Beträge beim Vermögen** | Summen werden anders gerundet als die einzelnen Zeilen | Eine Summe kann um 1 Franken neben den Zeilen liegen. Korrektur ist gebaut (#674, Entwurf), noch nicht gemergt |
| **Werte 2027** | Die Werte 2027 werden Kanton für Kanton nachgeführt. Wo der Beschluss eines Kantons noch nicht belegt ist, bleiben sie gesperrt (z.B. Aargau, `src/config/ipvAargau.js`) | Für 2027 noch nicht darauf verlassen. Nicht für jeden Kanton einzeln geprüft |

> **Seit Runde 1 erledigt** (Einträge vom 23.06.2026, bleiben als Beleg):
> ~~Sozialhilfe: Haushalt nimmt `1 + Abhängige`~~ → rechnet jetzt nach der Unterstützungseinheit
> (SKOS-RL C.2, C.3.1, Fassung 1.1.2026; `src/utils/unterstuetzungseinheit.js`).
> ~~IPV: lineares Modell statt kantonalem Stufentarif~~ → eigenes Modell je Kanton (`src/config/ipv*.js`).
> ~~Mehrpersonen-Haushalte~~ → war schon im Juni erledigt.

## Funktionale Hinweise

| Thema | Was passiert |
|---|---|
| **Daten nur lokal** | Alles liegt im Speicher dieses Browsers. Browser-Daten löschen = Daten weg. Backup-Funktion nutzen! |
| **Kein Account** | Kein Login, keine Cloud-Sync. Daten existieren nur auf diesem Gerät/Browser |
| **Ohne Code ausprobieren** | Zeigt die Beispielperson Maria Muster. **Nichts wird gespeichert**, nach dem Neuladen ist alles wie am Anfang |
| **Rumantsch** | Noch nicht von einem Menschen gegengelesen. Bekannt: Beim «Gepäck» steht die Einleitung auf Französisch (BUGS.md, B-6) |
| **Französisch, Italienisch, Englisch** | Noch nicht professionell lektoriert (Stand Juni, nicht neu geprüft) |

## Erledigte Verbesserungen (Runde 1, bis 23.06.2026)

| Thema | Status |
|---|---|
| **Budget: Orientierung** | Erledigt — BudgetSync zeigt Gesamtbild mit Gruppen |
| **Franchise: Erklärung** | Erledigt — Orientierungssatz auf Feld (5 Sprachen) |
| **KVG-Kontext** | Erledigt — Orientierungssatz auf KK-Feldern (5 Sprachen) |
| **BVG/AHV: In-Context-Hinweis** | Erledigt — Orientierungssätze auf BVG/AHV-Feldern |
| **QR via CDN** | Erledigt — QR-Generierung lokal (qrcodejs vendor), Tesseract-CDN entfernt |
| **Sozialhilfe-Disclaimer** | Erledigt — Gold-Rand + Hintergrund, visuell deutlich sichtbar |
| **Steuerrechner: Kantonale Steuer** | Erledigt — 26 Kantone, Hauptort-Multiplikatoren |
| **PDF-Export: Behörden-Dossier** | Erledigt — Dossier mit Berechnungen für Sozialamt-Termine (Browser-Print) |
| **BVG-Doppelabzug** | Erledigt — BVG/AHV als Referenz, nicht von Ausgaben abgezogen |
| **Fortschrittskarte** | Erledigt — Status-Label über Berglandschaft + Kapitel-Labels |
| **Finanz-Übersicht** | Erledigt — Kompaktansicht aller Rechner-Ergebnisse + Branchenvergleich |
| **Cross-Links Rechner** | Erledigt — Steuer-, IPV-, Sozialhilfe-, Vorsorge-Rechner verlinken |
| **Dropdown-UX** | Erledigt — Custom Chevron + appearance:none für alle Selects |
| **Dashboard-Snippets** | Erledigt — Versicherungen, Behörden, Notfall, Finanzen |
| **Behörden-Checkliste** | Erledigt — Interaktive Checkliste (localStorage-persistent, 5 Sprachen) |
| **Demo-Einstieg** | Erledigt — Prominente Demo-Card für Erstnutzer |
| **Trust-Kommunikation** | Erledigt — Aufklappbares Trust-Panel mit 3 Erklärungszeilen (5 Sprachen) |
| **Rätoromanisch** | Erledigt — 5. Sprache vollständig (2000+ Keys) |
| **Bundle-Optimierung** | Erledigt — PraemienOrientierung von 247KB→124KB gesplittet |
| **Error Boundaries** | Erledigt — Per-View Fehlerbehandlung, App crasht nicht komplett |
| **A11y: Keyboard** | Erledigt — Skip-Link, focus-visible, ARIA-Labels, Logo als Keyboard-Link |
| **SEO** | Erledigt — canonical, Schema.org, OG/Twitter, rating, robots |
| **Ressourcen** | Erledigt — Threema, SecureSafe, IncaMail, Beratungsstellen, Petitionen |
| **KVG-Leistungen** | Erledigt — Franchise-Tracker und Rechnungserklärung |
| **Print-Stylesheet** | Erledigt — Footer/Header ausgeblendet, sauberes A4-Layout |
| **Unicode-Icons** | Erledigt — font-variant-emoji:text verhindert Emoji-Rendering |
| **Button-Icons** | Bewusste Designentscheidung — typografische Zeichen (←, ○, ◇) als ruhiges Stilmittel |
| **Rückmeldung: IPV-Erklärung** | Erledigt — premium.subtitle erklärt IPV in allen 5 Sprachen |
| **Rückmeldung: Kind-Alter** | Erledigt — Alter wird automatisch aus Geburtsdatum berechnet, Feld wird readonly |
| **Rückmeldung: Adresse-Crosslink** | Erledigt — Crosslink von Basis → Wohnen (Kapitel 1) nach Kanton-Feld |
| **Rückmeldung: Nebenkosten-Hinweis** | Erledigt — Monats→Jahresschätzung + Genossenschafts-Hinweis bei NK > 0 |
| **Rückmeldung: QuickCheck auto-fill** | Erledigt — Dashboard-QuickCheck übernimmt gespeichertes Einkommen |
| **Rückmeldung: Crosslink-Audit** | Erledigt — Mindestlohn-Bug gefixt, 3 neue Crosslinks (Ausbildung→Tax, Behörden→Tax, Behörden→Schulden) |
| **Benefits vor Formular** | Erledigt — "Was Du davon hast"-Block direkt nach Header, vor Tabs |
| **Emotionale Differenzierung** | Erledigt — tax.intro, Betreibung gold statt rose, Schatten reduziert |
| **Mobile Grid-Overflow** | Erledigt — minmax(min(320px,100%),1fr) verhindert Feldabschneidung auf Mobilgeräten |

## Nicht-Ziele dieser Beta

- Keine amtlichen Formulare (Musterbriefe gibt es, vor dem Versand selbst prüfen)
- Kein Multi-Gerät-Sync (bewusste Designentscheidung: local-first)
- Keine Tarmed/Compendium-Integration (zu komplex für MVP)

---

## Feedback geben

In der App unten: **«Feedback per E-Mail»** öffnet einen Mail-Entwurf, abgeschickt wird erst mit Senden. Oder direkt an info@malojaplana.ch.
