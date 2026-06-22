# LIFE MAP COMPLETENESS REVIEW — Maloja Plana

> Erstellt: 2026-06-02
> Keine Implementierung. Keine Roadmap. Keine Features.
> Nur die Frage: Bildet Maloja das Schweizer Leben vollständig ab?

---

## 1. BESTEHENDE LEBENSRÄUME

### 7 Kapitel (Lebensräume)

| # | Kapitel | Was es abdeckt | Was es nicht abdeckt |
|---|---------|---------------|---------------------|
| 1 | **Basis** | Name, Geburtsdatum, Kanton, AHV, Zivilstand, Haushalt (Erwachsene + Kinder mit Alter), Kontakt | Keine Partnerdaten, keine Kinderdetails (Name, Schule), keine Aufenthaltsbewilligung (→ in Ausbildung), kein Heimatort |
| 2 | **Wohnen** | Adresse, Miete, Nebenkosten, Einzugsdatum, Vermieter, Hypothek, Wohnform | Keine Mietkaution-Details, kein Kündigungsschutz, kein Umzugskontext, keine Wohnungsgrösse |
| 3 | **Finanzen** | Einkommen, Arbeitgeber, Budget (7 Kategorien), Schulden, Alimente, Sparen, Säule 3a | Keine Kontoübersicht, keine Steuererklärungsdaten, kein Vermögen (ausser Sparen), keine Erbschaft |
| 4 | **Versicherungen** | KVG, Franchise, BVG, UVG, Haftpflicht, Hausrat, Reise, Auto, AHV-Beitrag | Keine Zusatzversicherung-Details, keine Unfallversicherung privat, keine Lebensversicherung, keine Rechtsschutzversicherung |
| 5 | **Ausbildung** | Schule, Abschluss, Beruf, Arbeitgeber, Aufenthaltsbewilligung, Sprachen | Keine Weiterbildung, kein RAV-Bezug, keine Arbeitslosigkeit, kein Pensum-Detail |
| 6 | **Behörden** | Steuerkanton, Betreibung, Gerichtsverfahren, Rechtsbeistand, Testament | Kein Sozialdienst-Name (Feld heisst "Betreibungsamt"), kein Migrationsamt, keine Fristen-Verwaltung |
| 7 | **Notfall** | Kontaktperson, Blutgruppe, Allergien, Medikamente, Arzt, Spital, Vorsorgedokumente | Keine strukturierten Gesundheitsdaten (→ geplantes Gesundheitsmodul) |

### 14 Werkzeuge (kein Lebensraum-Status)

| Werkzeug | Aktueller Standort | Funktion |
|----------|-------------------|----------|
| Meine Unterlagen | Nav → Tools | Dokumenten-Übersicht |
| Dokumenten-Tresor | Nav → Tools | Upload + Verwaltung |
| KK-Scanner | Nav → Tools | KK-Karte scannen |
| Budget-Import | Nav → Tools | CSV-Import |
| SchuldenManager | Nav → Tools | Schuldenübersicht + Rechner |
| Steuerrechner | Nav → Tools | Steuerberechnung nach Kanton |
| Organspende | Nav → Tools | Organspende-Registrierung |
| Kalender-Erinnerungen | Nav → Erweitert | Fristenverwaltung |
| Budget-Sync | Nav → Erweitert | Geräte-Synchronisation |
| IPV (Prämienverbilligung) | Nav → Erweitert | Anspruchsprüfung |
| Sozialhilfe | Nav → Erweitert | Anspruchsprüfung |
| CV-Generator | Nav → Erweitert | Lebenslauf erstellen |
| Charts | Nav → Erweitert | Visualisierungen |
| Export | Nav → Erweitert | ZIP-Export |
| Lebensmappe | Via Dashboard | Print-Preview aller Daten |
| Notfall-Dossier | Via Dashboard | Print-Preview Notfalldaten |

---

## 2. FEHLENDE LEBENSRÄUME

### 2.1 Gesundheit

**Status:** Teilweise in Notfall (Freitextfelder), kein eigener Lebensraum.

**Was fehlt:**
- Strukturierte Medikamentenliste (Name, Dosierung, Dauer — siehe Konzeptkorrektur Gesundheitskarte)
- Strukturierte Allergien (Allergen, Schweregrad, Notfallrelevanz)
- Chronische Erkrankungen als eigener Bereich
- Arztbesuche / Behandlungshistorie
- Gesundheitskosten (laufende Medikamente, Selbstbehalt-Tracking)
- Franchise-Nutzung (wie viel der Franchise ist dieses Jahr verbraucht?)

**Schweizer Relevanz:** Hoch. KVG-Franchise, Selbstbehalt, Prämienverbilligung, Medikamentenkosten — das sind Alltagsthemen für jeden in der Schweiz. Für die Zielgruppe (niedrige Einkommen) sind Gesundheitskosten oft der zweitgrösste Posten nach Miete.

**Bewertung:** Fehlt als Lebensraum. Die stärkste Lücke.

---

### 2.2 Familie & Beziehungen

**Status:** Haushalt in Basis (Anzahl Erwachsene, Kinderalter). Zivilstand als Einzelfeld. Kein eigener Lebensraum.

**Was fehlt:**
- Kinder mit Namen, Geburtsdatum, Schule/Kita, eigener AHV
- Partner/Partnerin (Name, Geburtsdatum, Arbeitgeber, Einkommen — relevant für Steuern, Ergänzungsleistungen, Sozialhilfe)
- Sorgerecht bei Trennung
- Kinderbetreuung (Kita, Tagesschule, Nanny — mit Kosten)
- Familienkontext für Behörden (wer hat welche Bewilligung?)
- Familienzulagen pro Kind

**Schweizer Relevanz:** Sehr hoch. Die Schweiz rechnet fast alles pro Haushalt: Steuern, Prämienverbilligung, Sozialhilfe, Ergänzungsleistungen. Ohne vollständige Haushaltsdaten sind Berechnungen unvollständig. Familienzulagen sind pro Kind unterschiedlich (Alter, Kanton).

**Bewertung:** Fehlt als Lebensraum. Die zweitstärkste Lücke — weil fast alle anderen Lebensräume auf Familie angewiesen sind.

---

### 2.3 Vorsorge & Alter

**Status:** Säule 3a in Finanzen (ein Feld). BVG in Versicherungen (ein Feld). AHV-Beitrag in Versicherungen. Patientenverfügung und Vorsorgeauftrag in Notfall. Testament in Behörden. Verstreut.

**Was fehlt als zusammenhängender Lebensraum:**
- AHV-Rente (voraussichtlich, basierend auf Beitragsjahren)
- BVG-Guthaben und voraussichtliche Rente
- Säule 3a Gesamtguthaben
- Pensionierungszeitpunkt
- Frühpensionierung — finanzieller Effekt
- Ergänzungsleistungen im Alter
- Erbvorbezug / Schenkung
- Nachlass (Testament, Erbvertrag, Güterrecht)

**Schweizer Relevanz:** Hoch. Das 3-Säulen-System ist komplex und für viele undurchsichtig. Besonders für Ausländer/innen mit Beitragslücken ist die AHV-Berechnung relevant. Der Basel-Stadt User hat "Retirement" als fehlend gemeldet.

**Bewertung:** Fehlt als Lebensraum. Heute sind Vorsorge-Daten über 4 Kapitel verstreut (Finanzen, Versicherungen, Notfall, Behörden) — das verhindert jedes Gesamtbild.

---

### 2.4 Mobilität

**Status:** Auto-Versicherung in Versicherungen (ein Feld). Mobilitätskosten in Finanzen (ein Feld). Kein eigener Lebensraum.

**Was fehlt:**
- ÖV-Abo (GA, Halbtax, Verbund-Abo — mit Kosten)
- Auto (Marke, Kennzeichen, Versicherung, Steuern, Leasing)
- Führerausweis
- Parkplatz (Kosten)
- Velo / E-Bike (Versicherung)
- Carsharing (Mobility)

**Schweizer Relevanz:** Mittel. ÖV ist zentral im Schweizer Alltag, GA/Halbtax betrifft Millionen. Auto-Kosten sind für die Zielgruppe relevant (Leasing-Fallen, Versicherung). Aber: weniger emotional und weniger komplex als Gesundheit oder Familie.

**Bewertung:** Kein eigenständiger Lebensraum nötig. Könnte als Erweiterung von Finanzen (Kosten) und Versicherungen (Police) leben. Ein paar Felder reichen.

---

### 2.5 Arbeit & Beruf (eigenständig)

**Status:** In Ausbildung: Arbeitgeber, Beruf, Bewilligung, Pensum. In Finanzen: Einkommen, Arbeitgeber, Anstellungsart. Vermischt.

**Was fehlt:**
- Arbeitslosigkeit (RAV-Anmeldung, Taggelder, Stempelkontrolle)
- Selbständigkeit (Einzelfirma, GmbH, AHV-Beiträge als Selbständiger)
- Arbeitsvertrag-Details (Probezeit, Kündigungsfrist, Ferienanspruch)
- Nebenerwerb
- Arbeitszeugnisse
- Weiterbildung (Kurse, Kosten, Subventionen)

**Schweizer Relevanz:** Hoch. Arbeitslosigkeit betrifft die Zielgruppe direkt. RAV-Prozesse sind komplex und angstbesetzt. Selbständigkeit hat in der Schweiz eigene AHV/BVG-Regeln.

**Bewertung:** "Ausbildung" ist heute ein Mischkapitel (Bildung + Beruf + Bewilligung). Die Trennung in "Bildung" und "Arbeit" wäre natürlicher — aber das ist eine strukturelle Änderung, kein fehlendes Thema. Die Daten sind da, die Zuordnung ist unscharf.

---

### 2.6 Weitere geprüfte Bereiche

| Bereich | Relevant? | Bewertung |
|---------|-----------|-----------|
| **Wohneigentum** | Ja, aber Nische | Teilweise abgedeckt (Hypothek, Gebäudeversicherung in Wohnen). Stockwerkeigentum, Renovationsfonds fehlen. Betrifft eine Minderheit der Zielgruppe. |
| **Haustiere** | Marginal | Hundesteuer, Haftpflicht, Tierarztkosten. Für die Zielgruppe selten prioritär. Kein Lebensraum. |
| **Freiwilligenarbeit / Verein** | Nein | Kein administrativer Bedarf. Keine Behörden-Schnittstelle. Nicht relevant für Maloja. |
| **Nachlass** | Ja | Heute: Testament in Behörden. Fehlt: Erbvertrag, Güterrecht, Begünstigungen, Todesfall-Checkliste. Könnte Teil von "Vorsorge & Alter" sein. |
| **Steuern (eigenständig)** | Bedingt | Heute: Steuerkanton in Behörden, Steuerrechner als Tool. Fehlt: Steuererklärungsprozess, Abzüge, Ratenzahlung. Könnte Erweiterung von Behörden sein, kein eigener Lebensraum. |
| **Digitales Leben** | Nein | Passwörter, Abos, digitaler Nachlass. Gibt es spezialisierte Tools dafür. Nicht Malojas Kernauftrag. |

---

## 3. FALSCH ZUGEORDNETE WERKZEUGE

### Werkzeuge, die zu einem Lebensraum gehören

| Werkzeug | Aktuell | Gehört zu | Begründung |
|----------|---------|-----------|------------|
| **KK-Scanner** | Tool (eigenständig) | **Versicherungen** | Scannt KK-Daten und schreibt sie in `versicherungen.*`. Ist ein Eingabe-Werkzeug für einen Lebensraum, kein eigenständiges Tool. |
| **IPV / Prämienverbilligung** | Tool (Erweitert) | **Versicherungen** | Berechnet IPV-Anspruch basierend auf Einkommen und KK-Daten. Gehört zur Versicherungssituation. |
| **SchuldenManager** | Tool (eigenständig) | **Finanzen** | Schulden sind Teil der finanziellen Situation. Heute als separates Tool, obwohl `debtPayments` und `loans` bereits in Finanzen liegen. |
| **Sozialhilfe** | Tool (Erweitert) | **Behörden** oder **Finanzen** | Sozialhilfe-Anspruch ist eine Behörden-Angelegenheit mit finanzieller Grundlage. Heute versteckt unter "Erweitert". |
| **Steuerrechner** | Tool (eigenständig) | **Behörden** | Steuerberechnung gehört zum Steuerkanton und zur Steuersituation, die in Behörden lebt. |
| **Organspende** | Tool (eigenständig) | **Notfall** | Organspende-Status existiert bereits als Feld in Notfall (`organDonor`). Das Tool ist eine Erweiterung davon. |
| **CV-Generator** | Tool (Erweitert) | **Ausbildung** | Lebenslauf wird aus Ausbildungs- und Berufsdaten generiert. Gehört dorthin. |
| **Kalender-Erinnerungen** | Tool (Erweitert) | **Meta-Ebene** | Fristen betreffen alle Kapitel (Steuern, Bewilligung, Versicherungswechsel). Kein einzelner Lebensraum. |

### Werkzeuge, die korrekt als Meta-Ebene existieren

| Werkzeug | Begründung |
|----------|------------|
| **Meine Unterlagen** | Dokumente aus allen Kapiteln — kapitelübergreifend. |
| **Dokumenten-Tresor** | Speicher-Infrastruktur — kapitelübergreifend. |
| **Lebensmappe** | Print-Preview aller Daten — kapitelübergreifend. |
| **Notfall-Dossier** | Print-Preview Notfalldaten — gehört zu Notfall, aber als Ausgabeformat, nicht als Eingabe. |
| **Budget-Import** | Import-Werkzeug — temporär, kein dauerhafter Ort. |
| **Budget-Sync** | Infrastruktur — kapitelübergreifend. |
| **Export** | Ausgabe — kapitelübergreifend. |
| **Charts** | Visualisierung — kapitelübergreifend. |

### Bewertung

**8 von 14 Werkzeugen gehören eigentlich zu einem Lebensraum.** Sie stehen heute als eigenständige Tools in der Navigation, obwohl sie inhaltlich Teil eines Kapitels sind. Das erzeugt den "Sackmesser"-Effekt aus BETA_REALITY_CHECK.md: Funktionen sind verstreut statt integriert.

Die natürliche Struktur wäre:
- Werkzeuge leben *innerhalb* ihres Lebensraums (als Tab, als Erweiterung, als Aktion)
- Meta-Werkzeuge leben auf einer eigenen Ebene ("Meine Unterlagen", Export, Sync)

---

## 4. SCHWEIZER ALLTAGSSZENARIEN

### Was Maloja heute abbilden kann

| Lebenssituation | Abgedeckt? | Wie |
|-----------------|-----------|-----|
| **Umzug innerhalb der Schweiz** | Teilweise | Neue Adresse in Wohnen. Neuer Kanton in Basis. Aber: keine Umzugs-Checkliste, keine Ummeldung-Erinnerung, kein Kantonswechsel-Effekt auf Steuern/KK. |
| **Erste Steuererklärung** | Teilweise | Steuerkanton in Behörden. Steuerrechner als Tool. Aber: keine Abzüge, keine Anleitung, kein Zusammenhang mit den anderen Daten. |
| **KK-Wechsel im Herbst** | Ja | KK-Daten in Versicherungen. KK-Scanner zum Erfassen. IPV-Prüfung. Franchise-Vergleich fehlt. |
| **Geburt eines Kindes** | Kaum | Kind zum Haushalt hinzufügen (Alter). Aber: kein Kindername, keine Familienzulage pro Kind, keine Kita-Kosten, keine Mutterschaftsentschädigung, kein Kinderarzt. |
| **Trennung / Scheidung** | Kaum | Zivilstand ändern. Alimente erfassen. Aber: kein Sorgerecht, kein geteilter Haushalt, keine KESB, kein Güterrecht. |
| **Arbeitslosigkeit** | Kaum | Einkommen auf 0 setzen. Aber: kein RAV, keine Taggelder, keine Stempelkontrolle, keine ALV-Berechnung. |
| **Krankheit / Unfall** | Teilweise | Arzt und Spital in Notfall. Allergien, Medikamente (Freitext). Aber: keine Franchise-Nutzung, keine Krankheitskosten, kein Krankengeld, kein UV-Prozess. |
| **Pensionierung** | Kaum | Haushalt `isRetired` Flag. Säule 3a in Finanzen. BVG in Versicherungen. Aber: keine AHV-Rente, kein Pensionierungsdatum, keine Vorsorgelücke, keine EL. |
| **Todesfall in der Familie** | Kaum | Notfallkontakte, Patientenverfügung, Testament. Aber: keine Todesfall-Checkliste, keine Erbschaft, keine Willensvollstreckung, keine Trauerunterstützung. |
| **Studium / Weiterbildung** | Teilweise | Schule und Abschluss in Ausbildung. Aber: keine Studiengebühren, keine Stipendien, keine Bildungskosten. |
| **Selbständig werden** | Nein | Kein Feld für Selbständigkeit. Keine AHV als Selbständiger. Keine Buchhaltungspflicht. |
| **Schulden abbauen** | Teilweise | SchuldenManager als Tool. Schuldenraten in Finanzen. Betreibungsstatus in Behörden. Aber: kein Schuldenbereinigungsplan, keine Schuldnerberatung-Verweis, kein Verlustschein-Tracking. |
| **Einbürgerung** | Nein | Aufenthaltsbewilligung in Ausbildung. Aber: kein Einbürgerungsprozess, keine Wohnsitzdauer-Berechnung, kein Sprachnachweis. |

### Zusammenfassung

**Gut abgedeckt:** Grundsituation (wer bin ich, wo wohne ich, was verdiene ich, wie bin ich versichert).

**Teilweise abgedeckt:** Steuern, Umzug, KK-Wechsel, Schulden.

**Kaum abgedeckt:** Lebensereignisse (Geburt, Trennung, Krankheit, Pensionierung, Todesfall).

**Nicht abgedeckt:** Arbeitslosigkeit, Selbständigkeit, Einbürgerung.

**Die grösste Lücke:** Maloja bildet einen *Zustand* ab, aber keine *Übergänge*. Es zeigt: "So ist dein Leben jetzt." Aber nicht: "Du bist gerade in einer Veränderung. Das kommt jetzt auf dich zu."

---

## 5. PRIORISIERUNG — DIE NÄCHSTEN LEBENSRÄUME

### Tier 1 — Höchste Priorität

| Lebensraum | Nutzen | Emotionaler Wert | CH-Relevanz | Maloja-Passung | Gesamt |
|------------|--------|-------------------|-------------|----------------|--------|
| **Gesundheit** | Sehr hoch (Kosten, Franchise, Medikamente) | Hoch (Angst vor Kosten, Unsicherheit) | Sehr hoch (KVG-System einzigartig) | Perfekt (Spiegelung der Gesundheitssituation) | ★★★★★ |
| **Familie** | Sehr hoch (Steuern, Zulagen, Betreuung) | Sehr hoch (Kinder, Partner, Sorge) | Sehr hoch (Haushaltsprinzip) | Perfekt (Lebensraum par excellence) | ★★★★★ |

### Tier 2 — Hohe Priorität

| Lebensraum | Nutzen | Emotionaler Wert | CH-Relevanz | Maloja-Passung | Gesamt |
|------------|--------|-------------------|-------------|----------------|--------|
| **Vorsorge & Alter** | Hoch (3-Säulen-Überblick) | Hoch (Existenzangst, Sicherheit) | Sehr hoch (3-Säulen-System) | Hoch (sammelt Verstreutes) | ★★★★ |
| **Arbeit** (als eigenständig von Ausbildung) | Hoch (RAV, Verträge, Selbständigkeit) | Hoch (Existenz, Identität) | Hoch (ALV-System, Bewilligungen) | Hoch (fehlt heute fast ganz) | ★★★★ |

### Tier 3 — Mittlere Priorität

| Lebensraum | Nutzen | Emotionaler Wert | CH-Relevanz | Maloja-Passung | Gesamt |
|------------|--------|-------------------|-------------|----------------|--------|
| **Steuern** (Erweiterung Behörden) | Mittel (Abzüge, Fristen) | Mittel (Pflicht, nicht Angst) | Hoch (obligatorisch) | Mittel (Steuerrechner existiert) | ★★★ |
| **Mobilität** (Erweiterung Finanzen/Versicherungen) | Mittel (Kosten-Überblick) | Niedrig | Mittel (GA/Halbtax) | Niedrig (wenig Spiegelungspotenzial) | ★★ |

### Tier 4 — Langfristig

| Lebensraum | Bewertung |
|------------|-----------|
| **Nachlass** | Wichtig, aber betrifft wenige akut. Könnte Teil von Vorsorge sein. |
| **Wohneigentum** | Nische für die Zielgruppe. Erweiterung von Wohnen reicht. |
| **Digitales / Abos** | Nicht Malojas Kernauftrag. |

---

## 6. LANGFRISTIGE VISION — MALOJA IN 5 JAHREN

### Die vollständige Schweizer Lebenslandkarte

Nicht als Featureliste. Als Antwort auf die Frage: *Wenn ein Mensch in der Schweiz sein gesamtes administratives Leben an einem Ort ordnen möchte — was müsste dieser Ort kennen?*

---

**Kern-Lebensräume (wer bin ich)**

| Lebensraum | Inhalt |
|------------|--------|
| **Ich** | Name, Geburtsdatum, Nationalität, Aufenthalt, AHV, Kontakt. Wer ich bin. |
| **Familie** | Partner, Kinder, Sorgerecht, Betreuung, Zulagen. Mit wem ich lebe. |
| **Zuhause** | Adresse, Miete, Eigentum, Vermieter, Nebenkosten. Wo ich lebe. |

**Existenz-Lebensräume (wovon ich lebe)**

| Lebensraum | Inhalt |
|------------|--------|
| **Arbeit** | Beruf, Arbeitgeber, Vertrag, Pensum, Bewilligung, Arbeitslosigkeit. Wovon ich lebe. |
| **Finanzen** | Einkommen, Ausgaben, Budget, Schulden, Sparen, Konten. Was ich habe und was ich ausgebe. |
| **Bildung** | Abschlüsse, Weiterbildung, Sprachen, Zertifikate. Was ich kann. |

**Schutz-Lebensräume (was mich absichert)**

| Lebensraum | Inhalt |
|------------|--------|
| **Versicherungen** | KVG, BVG, UVG, Haftpflicht, Hausrat, Auto. Was mich schützt. |
| **Gesundheit** | Arzt, Medikamente, Allergien, Franchise-Nutzung, Gesundheitskosten. Wie es mir geht. |
| **Vorsorge** | AHV, BVG, 3a, Pensionierung, Patientenverfügung, Vorsorgeauftrag, Testament, Nachlass. Was nach mir kommt. |

**Pflicht-Lebensräume (was ich muss)**

| Lebensraum | Inhalt |
|------------|--------|
| **Behörden** | Steuern, Betreibung, Sozialdienst, Migrationsamt, Gerichtsverfahren. Was der Staat von mir will. |
| **Notfall** | Kontaktperson, medizinische Kurzinfo, Notfallkarte. Was im Ernstfall zählt. |

**Meta-Ebene (meine Unterlagen)**

| Bereich | Inhalt |
|---------|--------|
| **Meine Unterlagen** | Alle Dokumente, sortiert nach Lebensraum. |
| **Lebensmappe** | Druckbarer Überblick über alles. |
| **Fristen** | Kapitelübergreifende Termine und Erinnerungen. |

---

### Das wären 11 Lebensräume + 3 Meta-Bereiche.

**Heute:** 7 Lebensräume + 14 verstreute Werkzeuge.

**Der Weg:**

| Phase | Lebensräume | Werkzeuge |
|-------|-------------|-----------|
| **Heute** | 7 Kapitel, davon 3 mit Spiegelung | 14 eigenständige Tools |
| **Nächster Schritt** | Bestehende Werkzeuge in Lebensräume integrieren | Tools werden Aktionen innerhalb von Kapiteln |
| **Mittelfristig** | Gesundheit + Familie als neue Lebensräume | Weniger eigenständige Tools, mehr integrierte Funktionen |
| **Langfristig** | 11 Lebensräume, alle mit Spiegelung | Tools existieren nur noch als Meta-Ebene |

---

### Die Architektur-Frage

Die heutige Kapitelstruktur (7 Kapitel in einem Array) kann erweitert werden. Die Frage ist nicht "können wir mehr Kapitel haben?" — die Frage ist:

**Wie viele Lebensräume kann ein Mensch gleichzeitig sehen, ohne sich verloren zu fühlen?**

7 ist an der Grenze. 11 braucht eine andere Ordnung — die Tier-Struktur (Kern / Existenz / Schutz / Pflicht) wäre diese Ordnung. Sie existiert bereits im Dashboard und in der Navigation.

---

## 7. DIE WICHTIGSTE ERKENNTNIS

Maloja bildet heute den **administrativen Zustand** eines Schweizer Lebens ab: Wer ich bin, wo ich wohne, was ich verdiene, wie ich versichert bin.

Was fehlt, ist die **Lebensdynamik**: Familie als Lebensraum, Gesundheit als laufender Prozess, Vorsorge als Zukunftsperspektive, Arbeit als veränderlicher Zustand.

Die 7 bestehenden Kapitel sind wie ein Passfoto: korrekt, aber still. Die fehlenden Lebensräume würden aus dem Passfoto einen Film machen — ein Leben, das sich bewegt, verändert, Übergänge hat.

Aber: Das ist kein Argument für sofortiges Bauen. Es ist ein Argument für bewusstes Priorisieren. Gesundheit und Familie zuerst, weil sie die stärksten Alltagsanker sind. Vorsorge und Arbeit danach, weil sie die stärksten Zukunftsanker sind.

Und: Die bestehenden 8 Werkzeuge, die eigentlich zu Lebensräumen gehören, sollten dort landen, bevor neue Lebensräume entstehen. Erst aufräumen, dann erweitern.

---

*LIFE_MAP_COMPLETENESS_REVIEW.md — Die Lebenslandkarte auf Vollständigkeit geprüft.*
*Keine Implementierung. Keine Roadmap. Nur Klarheit über das Ganze.*
