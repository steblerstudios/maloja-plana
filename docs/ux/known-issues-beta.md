# Known Issues — Beta (Stand 2026-06-23, Update 2026-06-23)

> Diese Liste ist für Tester gedacht. Hier stehen Dinge, die wir kennen und bewusst noch nicht behoben haben.

---

## Rechner-Einschränkungen

| Thema | Was passiert | Auswirkung |
|---|---|---|
| **Sozialhilfe: Haushalt** | Berechnung nimmt `1 + Abhängige` statt differenzierte SKOS-Zusammensetzung (Erwachsene vs. Kinder) | Betrag kann bei Familien leicht abweichen |
| **Steuerrechner** | Kantonale Schätzung basiert auf Hauptort-Multiplikatoren, nicht auf exaktem kantonalem Tarif | Betrag kann je nach Gemeinde abweichen |
| **IPV** | Lineares Modell (Abbau bis maxIncome) statt exaktem kantonalem Stufentarif | Betrag ist Orientierung, nicht verbindlich |
| **Mehrpersonen-Haushalte** | Partner-Einkommen fliesst in alle Rechner ein (Steuer, IPV, Sozialhilfe, EL). Feld erscheint bei 2+ Erwachsenen | Erledigt — Basisversion |

## Funktionale Hinweise

| Thema | Was passiert |
|---|---|
| **Daten nur lokal** | Alles liegt im Browser-Speicher. Browser-Cache löschen = Daten weg. Backup-Funktion nutzen! |
| **Kein Account** | Kein Login, keine Cloud-Sync. Daten existieren nur auf diesem Gerät/Browser |
| **Demo-Modus** | «Maria Muster ansehen» zeigt eine fiktive Person. Diese Daten werden nicht gespeichert |
| **Sprachen** | FR/IT/EN sind maschinell übersetzt und nicht professionell lektoriert |

## Erledigte Verbesserungen

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
| **Amanda: IPV-Erklärung** | Erledigt — premium.subtitle erklärt IPV in allen 5 Sprachen |
| **Amanda: Kind-Alter** | Erledigt — Alter wird automatisch aus Geburtsdatum berechnet, Feld wird readonly |
| **Amanda: Adresse-Crosslink** | Erledigt — Crosslink von Basis → Wohnen (Kapitel 1) nach Kanton-Feld |
| **Amanda: Nebenkosten-Hinweis** | Erledigt — Monats→Jahresschätzung + Genossenschafts-Hinweis bei NK > 0 |
| **Amanda: QuickCheck auto-fill** | Erledigt — Dashboard-QuickCheck übernimmt gespeichertes Einkommen |
| **Amanda: Crosslink-Audit** | Erledigt — Mindestlohn-Bug gefixt, 3 neue Crosslinks (Ausbildung→Tax, Behörden→Tax, Behörden→Schulden) |
| **Benefits vor Formular** | Erledigt — "Was Du davon hast"-Block direkt nach Header, vor Tabs |
| **Emotionale Differenzierung** | Erledigt — tax.intro, Betreibung gold statt rose, Schatten reduziert |
| **Mobile Grid-Overflow** | Erledigt — minmax(min(320px,100%),1fr) verhindert Feldabschneidung auf Mobilgeräten |

## Nicht-Ziele dieser Beta

- Keine Formulare für Behörden (kommt später)
- Kein Multi-Gerät-Sync (bewusste Designentscheidung: local-first)
- Keine Tarmed/Compendium-Integration (zu komplex für MVP)

---

## Feedback geben

Nutze das Feedback-Formular in der App (unten im Dashboard) oder schreib direkt an Stebler Studios.
