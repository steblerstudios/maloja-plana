# SWISS LIFE ARCHITECTURE — Maloja Plana

> Erstellt: 2026-06-02
> Keine Implementierung. Keine Roadmap. Keine Features.
> Nur die Frage: Was ist die richtige Ordnung des Schweizer Lebens?

---

## 1. KERN-LEBENSRÄUME

### Die Frage

Welche Lebensräume braucht praktisch jede Person in der Schweiz — unabhängig von Alter, Herkunft, Einkommen, Familiensituation?

### Die Antwort

**Stufe 1 — Existenzielle Grundlage** (jeder Mensch, immer)

| Lebensraum | Warum universell |
|------------|-----------------|
| **Person** | Jeder hat einen Namen, ein Geburtsdatum, eine Nationalität, einen Aufenthaltsstatus. |
| **Zuhause** | Jeder wohnt irgendwo. Miete oder Eigentum, Adresse, Kosten. |
| **Geld** | Jeder hat ein Einkommen (oder keines) und Ausgaben. |
| **Gesundheit** | Jeder hat einen Körper, eine Krankenkasse, einen Arzt (oder braucht einen). |

**Stufe 2 — Gesellschaftliche Einbettung** (fast jeder, in irgendeiner Form)

| Lebensraum | Warum fast universell |
|------------|----------------------|
| **Arbeit** | Die meisten arbeiten oder suchen Arbeit. Auch Rente ist ein Arbeitsstatus. |
| **Versicherungen** | KVG ist obligatorisch. Haftpflicht fast universell. BVG für Angestellte. |
| **Behörden** | Steuern sind Pflicht. Aufenthalt muss geregelt sein. Betreibung kann jeden treffen. |

**Stufe 3 — Lebensphase** (viele, aber nicht alle)

| Lebensraum | Warum phasenabhängig |
|------------|---------------------|
| **Familie** | Nicht jeder hat Kinder oder einen Partner. Aber wer Familie hat, für den verändert sie alles. |
| **Vorsorge** | Wird ab ~40 relevant, vorher selten beachtet. Aber: Patientenverfügung betrifft alle Alter. |
| **Bildung** | In jungen Jahren zentral, später peripher. Weiterbildung ist optional. |

**Stufe 4 — Schutz** (immer vorhanden, selten gebraucht)

| Lebensraum | Warum im Hintergrund |
|------------|---------------------|
| **Notfall** | Braucht man nie — bis man es braucht. Dann ist es das Wichtigste. |

### Priorisierung

| Rang | Lebensraum | Begründung |
|------|------------|------------|
| 1 | Person | Ohne Identität existiert nichts anderes. |
| 2 | Zuhause | Grundbedürfnis. Grösster Einzelposten. |
| 3 | Geld | Existenzgrundlage. Verbindet alles. |
| 4 | Gesundheit | Betrifft jeden, jeden Tag. KVG ist obligatorisch. |
| 5 | Arbeit | Einkommensquelle. Identität. Aufenthaltsstatus. |
| 6 | Versicherungen | Pflicht (KVG) + Schutz. Komplex in der Schweiz. |
| 7 | Behörden | Pflicht (Steuern). Angstbesetzt. |
| 8 | Familie | Verändert alle anderen Lebensräume. |
| 9 | Vorsorge | Zukunftssicherung. Wird mit dem Alter dringlicher. |
| 10 | Bildung | Berufliche Grundlage. Weniger alltäglich. |
| 11 | Notfall | Immer bereit, selten gebraucht. |

---

## 2. FAMILIE — BEWERTUNG

### Die Frage

Ist Familie ein Teil von Basis, ein Teil von Finanzen oder ein eigenständiger Lebensraum?

### Heutige Realität in Maloja

Familie existiert heute als:
- **Basis:** Zivilstand (1 Feld), Haushalt (Anzahl Erwachsene, Kinderalter, Rentner-Flag)
- **Finanzen:** Familienzulagen (1 Feld), Alimente erhalten/bezahlt (2 Felder)
- **Sozialhilfe-Rechner:** Haushaltsgrösse (aus `basis.household` abgeleitet), Kinder-Kontext
- **IPV-Rechner:** `childrenCount`, `adults` (aus `basis.household` abgeleitet)

Kinder sind heute eine Zahl mit Alter. Kein Name, kein Geburtsdatum, keine eigene Versicherung, keine Schule, keine Betreuungskosten.

### Bewertung der drei Optionen

**Option A: Familie bleibt Teil von Basis**

| Vorteil | Nachteil |
|---------|----------|
| Einfach, keine neue Struktur | Basis wird überladen (11 Felder + Haushalt + Partnerdaten + Kinderdaten) |
| Weniger Kapitel = weniger Orientierungsaufwand | Kinder als Unterfeld von "Person" — das sagt: Kinder sind ein Attribut von dir, nicht eigene Menschen |
| | Keine Spiegelungsmöglichkeit für Familiensituation |

**Option B: Familie wird Teil von Finanzen**

| Vorteil | Nachteil |
|---------|----------|
| Familienzulagen, Alimente, Betreuungskosten sind finanziell | Familie auf Geld reduzieren — das widerspricht Malojas Werten |
| | Kinder als Kostenfaktor statt als Lebensmittelpunkt |
| | Emotional falsch: "Mein Kind gehört in mein Budget" |

**Option C: Familie als eigenständiger Lebensraum**

| Vorteil | Nachteil |
|---------|----------|
| Kinder und Partner als eigene Menschen mit eigenen Daten | Mehr Komplexität (1 Kapitel mehr) |
| Spiegelung möglich: "Du lebst mit Maria und zwei Kindern (Leon, 7 und Mia, 4)" | Nicht jeder hat Familie — leerer Lebensraum für Singles |
| Natürliche Heimat für: Partner, Kinder, Sorgerecht, Betreuung, Zulagen | Datenverknüpfungen werden komplexer (Haushaltsgrösse für Steuern, IPV, Sozialhilfe) |
| Behörden-Kontext: KESB, Kindesunterhalt, Familiennachzug | |
| Steuern: Verheiratet/unverheiratet bestimmt Tarif | |

### Empfehlung: C — Eigenständiger Lebensraum, aber nicht sofort

**Begründung:**

In der Schweiz bestimmt die Familienstruktur fast alles:
- **Steuern:** Tarif A/B/C/H hängt von Zivilstand und Kindern ab
- **IPV:** Berechnung basiert auf Haushaltsgrösse
- **Sozialhilfe:** SKOS-Grundbedarf ist nach Haushaltsgrösse gestaffelt
- **Familienzulagen:** Pro Kind, altersabhängig, kantonal unterschiedlich
- **KVG:** Kinder haben eigene Prämien, eigene Franchise
- **Aufenthalt:** Familiennachzug, Härtefallbewilligung

Ein Kind in der Schweiz ist nicht einfach "+1 im Haushalt". Es hat eine eigene AHV-Nummer, eine eigene Versicherung, eigene Zulagen, eigenen Betreuungsbedarf. Das lässt sich nicht in einem Unterfeld von "Basis" abbilden.

**Aber:** Für eine Person ohne Familie wäre ein leerer "Familie"-Lebensraum irritierend. Die Lösung: Familie erscheint erst, wenn der Haushalt mehr als 1 Erwachsenen oder Kinder enthält. Für Singles bleibt Zivilstand in Basis.

**Übergangsweg:**
1. Heute: Haushalt bleibt in Basis (Woche 2 — keine Änderung)
2. Mittelfristig: Haushalt bekommt Partnernamen und Kindernamen in Basis
3. Langfristig: Familie wird eigenständiger Lebensraum, Basis behält nur die eigene Person

---

## 3. GESUNDHEIT — BEWERTUNG

### Die Frage

Ist Gesundheit ein Teil von Versicherungen, ein Teil von Notfall oder ein eigenständiger Lebensraum?

### Heutige Realität in Maloja

Gesundheit existiert heute als:
- **Notfall:** Allergien (Freitext), Medikamente (Freitext), Chronische Erkrankungen (Freitext), Blutgruppe, Arzt, Spital
- **Versicherungen:** KVG-Prämie, Franchise, Modell
- **Finanzen:** Gesundheitskosten als Teil der Ausgaben (implizit, nicht explizit)

### Bewertung der drei Optionen

**Option A: Gesundheit bleibt Teil von Versicherungen**

| Vorteil | Nachteil |
|---------|----------|
| KVG ist der finanzielle Rahmen für Gesundheit | Versicherung ≠ Gesundheit. "Ich bin bei der CSS" sagt nichts über meinen Körper. |
| Franchise-Nutzung gehört zur KVG | Medikamente, Allergien, Arzt haben mit der Police nichts zu tun |
| | Versicherungen wird noch grösser (17 Felder + Gesundheitsdaten) |

**Option B: Gesundheit bleibt Teil von Notfall**

| Vorteil | Nachteil |
|---------|----------|
| Allergien und Medikamente sind notfallrelevant | Notfall ist der Ausnahmezustand. Gesundheit ist der Alltag. |
| Arzt und Spital stehen dort | "Meine Medikamente gehören zum Notfall" — das sagt: Gesundheit ist nur dann relevant, wenn etwas schiefgeht |
| | Notfall soll ruhig und schlank bleiben (Konzeptkorrektur Gesundheitskarte) |

**Option C: Gesundheit als eigenständiger Lebensraum**

| Vorteil | Nachteil |
|---------|----------|
| Natürliche Heimat für: Arzt, Medikamente, Allergien, Franchise-Nutzung, Gesundheitskosten | Mehr Komplexität (1 Kapitel mehr) |
| Spiegelung möglich: "Du bist bei Dr. Meier in Behandlung. 2 regelmässige Medikamente." | Medizinprodukt-Risiko bei zu viel Tiefe |
| Cross-Chapter: KVG-Daten aus Versicherungen, Kosten in Finanzen | Sensible Daten — auch local-first braucht Vorsicht |
| Franchise-Tracking: "Du hast dieses Jahr CHF 1'200 von CHF 2'500 Franchise verbraucht" | |
| Gesundheitskosten als eigener, sichtbarer Posten | |

### Empfehlung: C — Eigenständiger Lebensraum, mittelfristig

**Begründung:**

In der Schweiz sind Gesundheitskosten für die Zielgruppe oft der grösste Stressfaktor nach Miete:
- **KVG-Prämie:** CHF 300–500/Monat, obligatorisch
- **Franchise:** CHF 300–2'500/Jahr Eigenanteil
- **Selbstbehalt:** 10% der Kosten über Franchise, max. CHF 700/Jahr
- **Medikamente:** Nicht alle von KVG gedeckt, Generika-Differenz
- **Zahnarzt:** Nicht im KVG, oft hunderte bis tausende Franken

Ein Mensch, der jeden Monat CHF 380 Prämie zahlt, CHF 50 für Medikamente ausgibt und dieses Jahr schon CHF 800 Franchise verbraucht hat — der braucht einen Ort, der ihm das zeigt. Nicht als Rechnung. Als Überblick.

Dieser Ort ist weder "Versicherung" (das ist die Police) noch "Notfall" (das ist der Ernstfall). Es ist "Gesundheit" — mein Körper, meine Kosten, mein Arzt, mein Alltag.

**Aber:** Gesundheit als Lebensraum birgt das Risiko der Medizinprodukt-Klassifizierung (siehe Konzeptkorrektur). Die Grenze ist klar: Maloja zeigt Daten, die der Mensch selbst eingibt. Maloja diagnostiziert nicht, empfiehlt nicht, bewertet nicht.

**Übergangsweg:**
1. Heute: Gesundheitsdaten bleiben in Notfall, Spiegelung V1 zeigt nur Status (Woche 2)
2. Mittelfristig: Gesundheit wird eigenständiger Lebensraum mit Arzt, Medikamenten (strukturiert), Allergien, Franchise-Tracking
3. Notfall behält: Notfallkontakt, Vorsorge, Blutgruppe, Notfallkarte — das, was *im Moment* zählt
4. Gesundheit übernimmt: Alles, was *im Alltag* zählt — Arzt, Medikamente, Kosten, Franchise

**Die Trennlinie:**
- **Notfall** = Was ein Sanitäter wissen muss
- **Gesundheit** = Was ich selbst wissen will

---

## 4. LEBENSÜBERGÄNGE

### Die Frage

Welche Lebensereignisse verändern mehrere Lebensräume gleichzeitig — und was bedeutet das für Maloja?

### Analyse

#### Geburt eines Kindes

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Familie / Basis | +1 Kind mit Name, Geburtsdatum |
| Versicherungen | Neue KVG-Police für Kind (eigene Prämie, eigene Versichertennummer) |
| Finanzen | Familienzulagen (+), Betreuungskosten (+), evtl. Einkommensreduktion |
| Arbeit | Mutterschaftsentschädigung (14 Wochen), Vaterschaftsurlaub (2 Wochen), evtl. Pensumsreduktion |
| Behörden | Anmeldung Einwohneramt, Kinderausweis, evtl. Familiennachzug |
| Steuern | Kinderabzug, evtl. Tarifwechsel |

**Komplexität:** Hoch. 6 Lebensräume gleichzeitig betroffen.

#### Trennung / Scheidung

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Familie / Basis | Zivilstand, Haushalt (-1 Erwachsener), evtl. geteiltes Sorgerecht |
| Zuhause | Umzug einer Person, neue Miete, evtl. Wohnungswechsel |
| Finanzen | Alimente (+/−), Einkommensveränderung, geteilte Kosten |
| Versicherungen | Eigene Police (wenn vorher über Partner), Tarifänderung |
| Behörden | KESB (bei Kindern), Güterrecht, evtl. Scheidungskonvention |
| Steuern | Tarifwechsel (verheiratet → getrennt), getrennte Veranlagung |

**Komplexität:** Sehr hoch. Emotional am schwersten. 6 Lebensräume + juristische Dimension.

#### Umzug (innerhalb der Schweiz)

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Zuhause | Neue Adresse, neue Miete, neuer Vermieter |
| Basis | Neuer Kanton (falls Kantonswechsel) |
| Behörden | Ummeldung Einwohneramt, neuer Steuerkanton |
| Versicherungen | KVG-Prämie ändert sich (kantonal), evtl. IPV-Anspruch ändert sich |
| Steuern | Steuerfuss ändert sich, evtl. Quellensteuer |
| Bildung / Arbeit | Arbeitsweg, evtl. Schulwechsel der Kinder |

**Komplexität:** Mittel. Administrativ aufwändig, emotional meist positiv.

#### Arbeitslosigkeit

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Arbeit | Kündigung, RAV-Anmeldung, Taggelder |
| Finanzen | Einkommen sinkt (70–80% des versicherten Verdienstes), Budget muss angepasst werden |
| Versicherungen | BVG: Auffangeinrichtung, UVG: endet 31 Tage nach Lohnende |
| Behörden | Evtl. Sozialhilfe, evtl. Aufenthaltsbewilligung gefährdet |
| Gesundheit | Stress, evtl. Prämienverbilligung-Anspruch |

**Komplexität:** Hoch. Emotional belastend. Zeitdruck (RAV-Fristen).

#### Pensionierung

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Arbeit | Endet |
| Finanzen | Einkommen: AHV-Rente + BVG-Rente ersetzt Lohn. Säule 3a: Bezug. |
| Vorsorge | Alles wird real: AHV-Rente, BVG-Kapital oder Rente, Ergänzungsleistungen |
| Versicherungen | UVG endet, KVG-Prämie evtl. anders (Prämienregion), BVG-Beiträge enden |
| Steuern | Renteneinkommen statt Lohn, 3a-Bezug wird besteuert |
| Behörden | AHV-Anmeldung (3–6 Monate vorher) |

**Komplexität:** Hoch. Emotional ambivalent (Freiheit + Existenzangst). Finanziell der grösste Umbruch.

#### Todesfall in der Familie

| Betroffener Lebensraum | Was sich ändert |
|------------------------|----------------|
| Familie | Haushalt verändert sich |
| Finanzen | Einkommen fällt weg oder ändert sich, Erbschaft, Witwen-/Waisenrente |
| Versicherungen | Lebensversicherung, BVG-Todesfall-Leistungen |
| Behörden | Todesfall melden, Erbschein, Willensvollstreckung, Steuererklärung des Verstorbenen |
| Vorsorge | Testament-Vollzug, Nachlass-Regelung |
| Notfall | Kontaktpersonen aktualisieren |

**Komplexität:** Sehr hoch. Emotional am schwersten. Administrativ überfordernd.

### Zusammenfassung Übergänge

| Lebensereignis | Betroffene Lebensräume | Emotionale Last | Zeitdruck |
|---------------|----------------------|-----------------|-----------|
| Geburt | 6 | Mittel (Freude + Überforderung) | Mittel |
| Trennung | 6 | Sehr hoch | Hoch |
| Umzug | 6 | Niedrig–Mittel | Mittel |
| Arbeitslosigkeit | 5 | Hoch | Sehr hoch |
| Pensionierung | 6 | Mittel–Hoch | Mittel |
| Todesfall | 6 | Extrem | Hoch |

**Die Erkenntnis:** Jedes grosse Lebensereignis betrifft 5–6 Lebensräume gleichzeitig. Kein Ereignis betrifft nur einen. Das bedeutet: Lebensübergänge können nicht *in* einem Lebensraum leben. Sie sind *Querschnittsthemen*, die *zwischen* Lebensräumen existieren.

### Was das für Maloja bedeutet

Übergänge sind keine Lebensräume. Sie sind **Pfade durch die Lebensräume**.

Ein Übergang sagt: "Du erlebst gerade X. Das betrifft folgende Bereiche deines Lebens. Hier ist, was sich ändert."

Das ist keine Feature-Beschreibung. Das ist eine konzeptionelle Erkenntnis: Maloja braucht neben der vertikalen Ordnung (Lebensräume) irgendwann eine horizontale Ordnung (Lebensereignisse). Die vertikale zeigt *was ist*. Die horizontale zeigt *was sich ändert*.

Heute existiert nur die vertikale. Das reicht für den Anfang. Aber die horizontale ist die Schicht, die Maloja von einem Ordner zu einem Begleiter machen würde.

---

## 5. IDEALE LEBENSLANDKARTE

### Ordnungsprinzip

Nicht nach Verwaltungslogik. Nicht nach Behördenstruktur. Sondern nach der Frage:

**Wenn ein Mensch an sein Leben denkt — in welcher Reihenfolge denkt er?**

1. Wer bin ich?
2. Mit wem lebe ich?
3. Wo wohne ich?
4. Wovon lebe ich?
5. Was habe ich? Was gebe ich aus?
6. Wie geht es mir?
7. Wie bin ich abgesichert?
8. Was muss ich regeln?
9. Was kommt danach?
10. Was, wenn etwas passiert?

### Die Landkarte

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   ICH                                                ║
║   Wer bin ich? Name, Herkunft, Kontakt.             ║
║                                                      ║
║   ┌──────────────┐  ┌──────────────┐                ║
║   │  FAMILIE     │  │  ZUHAUSE     │                ║
║   │  Mit wem.    │  │  Wo.         │                ║
║   └──────────────┘  └──────────────┘                ║
║                                                      ║
║   ┌──────────────┐  ┌──────────────┐                ║
║   │  ARBEIT      │  │  GELD        │                ║
║   │  Wovon.      │  │  Was.        │                ║
║   └──────────────┘  └──────────────┘                ║
║                                                      ║
║   ┌──────────────┐  ┌──────────────┐                ║
║   │  GESUNDHEIT  │  │  SCHUTZ      │                ║
║   │  Wie es mir  │  │  Versiche-   │                ║
║   │  geht.       │  │  rungen.     │                ║
║   └──────────────┘  └──────────────┘                ║
║                                                      ║
║   ┌──────────────┐  ┌──────────────┐                ║
║   │  BEHÖRDEN    │  │  VORSORGE    │                ║
║   │  Was ich     │  │  Was danach  │                ║
║   │  muss.       │  │  kommt.      │                ║
║   └──────────────┘  └──────────────┘                ║
║                                                      ║
║   ┌──────────────────────────────────┐              ║
║   │  NOTFALL                         │              ║
║   │  Was im Ernstfall zählt.         │              ║
║   └──────────────────────────────────┘              ║
║                                                      ║
║   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                ║
║   MEINE UNTERLAGEN · FRISTEN · EXPORT               ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

### 11 Lebensräume, detailliert

| # | Name | Heute | Künftig | Kern-Spiegelung |
|---|------|-------|---------|----------------|
| 1 | **Ich** (= Basis) | Name, Kanton, AHV, Zivilstand, Haushalt | Name, Kanton, AHV, Nationalität, Aufenthalt, Kontakt. Nur die eigene Person. | "Sophie, 37, wohnhaft in Basel-Stadt. Aufenthaltsbewilligung C." |
| 2 | **Familie** | Haushalt in Basis (Anzahl + Alter) | Partner (Name, Einkommen), Kinder (Name, Geburtsdatum, Schule, Versicherung), Betreuung, Sorgerecht, Zulagen | "Du lebst mit Leon (7) und Mia (4). Kita Mia: 3 Tage/Woche." |
| 3 | **Zuhause** (= Wohnen) | Adresse, Miete, Vermieter | Unverändert. Evtl. Wohnungsgrösse, Mietkaution-Status. | "Musterstrasse 12, Basel. Seit 4 Jahren. CHF 1'650/Mt." |
| 4 | **Arbeit** | In Ausbildung vermischt | Beruf, Arbeitgeber, Pensum, Vertrag, Bewilligung, Arbeitslosigkeit, Selbständigkeit | "Pflegefachfrau, Unispital Basel, 80%. Bewilligung B bis März 2027." |
| 5 | **Geld** (= Finanzen) | Einkommen, Budget, Schulden, Sparen | Unverändert im Kern. Schuldenmanager integriert. Gesundheitskosten aus Gesundheit. | "Einkommen CHF 5'200. Erfasste Ausgaben CHF 4'100." |
| 6 | **Gesundheit** | Freitext in Notfall | Arzt, Medikamente (strukturiert), Allergien, Franchise-Nutzung, Gesundheitskosten | "Dr. Meier, Hausarzt. 2 regelmässige Medikamente. Franchise: CHF 1'200 von 2'500 verbraucht." |
| 7 | **Schutz** (= Versicherungen) | KVG, BVG, UVG, Haftpflicht, Hausrat | Unverändert. KK-Scanner integriert. IPV integriert. | "CSS Grundversicherung, Franchise 2'500. Total Versicherungen CHF 520/Mt." |
| 8 | **Behörden** | Steuern, Betreibung, Rechtsbeistand | + Sozialdienst (Name, Kontakt), Steuerrechner integriert, Migrationsamt | "Steuerkanton Basel-Stadt. Keine Betreibungen." |
| 9 | **Vorsorge** | Verstreut über 4 Kapitel | AHV-Situation, BVG-Guthaben, Säule 3a, Pensionierung, Patientenverfügung, Vorsorgeauftrag, Testament, Nachlass | "AHV: 12 Beitragsjahre. BVG bei Publica. Patientenverfügung vorhanden." |
| 10 | **Bildung** (= Ausbildung ohne Arbeit) | Schule, Abschluss, Sprachen | Abschlüsse, Zertifikate, Weiterbildung, Sprachen, CV-Generator integriert | "Pflegefachfrau HF. Deutsch C1, Französisch B1." |
| 11 | **Notfall** | Kontakt, Blutgruppe, Allergien, Medikamente, Arzt, Vorsorge | Nur noch: Kontaktperson, Blutgruppe, Notfallkarte. Das, was ein Sanitäter braucht. | "Notfallkontakt: Maria Stebler. Blutgruppe A+. Allergien erfasst." |

### Werkzeug-Integration

| Heutiges Werkzeug | Wird Teil von |
|-------------------|---------------|
| KK-Scanner | Schutz (Versicherungen) |
| IPV / Prämienverbilligung | Schutz (Versicherungen) |
| SchuldenManager | Geld (Finanzen) |
| Steuerrechner | Behörden |
| Sozialhilfe | Behörden |
| Organspende | Notfall oder Vorsorge |
| CV-Generator | Bildung |
| Kalender-Erinnerungen | Meta-Ebene (Fristen) |
| Budget-Import | Meta-Ebene (Import) |
| Budget-Sync | Meta-Ebene (Sync) |
| Export | Meta-Ebene |
| Charts | Meta-Ebene |
| Meine Unterlagen | Meta-Ebene |
| Lebensmappe | Meta-Ebene |
| Notfall-Dossier | Notfall (Ausgabeformat) |

**Ergebnis:** 10 von 15 Werkzeugen werden in Lebensräume integriert. 5 bleiben als Meta-Ebene.

---

## 6. EMPFEHLUNGEN

### Was sich nicht ändern sollte

- **Die 7 bestehenden Kapitel bleiben.** Sie sind die Grundlage. Keine Umstrukturierung jetzt.
- **Die Spiegelungen bleiben der Hebel.** Behörden und Notfall bekommen Spiegelungen (Woche 2). Versicherungen und Ausbildung folgen.
- **Local-first bleibt.** Kein Kompromiss.
- **Die Malojapass-Metapher bleibt.** Sie funktioniert mit 7 Stationen. Sie würde auch mit 11 funktionieren — der Weg wird länger, nicht anders.

### Was sich mittelfristig ändern sollte

**Schritt 1: Werkzeuge integrieren** (vor neuen Lebensräumen)

Die 8 Werkzeuge, die zu Lebensräumen gehören, sollten dort landen. Das reduziert die Navigation, schafft Zusammenhang und beseitigt den "Sackmesser"-Effekt. Keine neue Architektur nötig — nur Verschiebung.

**Schritt 2: Ausbildung aufteilen in Arbeit + Bildung**

"Ausbildung" ist heute ein Mischkapitel. Arbeitgeber, Bewilligung, Pensum — das ist Arbeit. Schule, Abschluss, Sprachen — das ist Bildung. Die Trennung ist natürlich und erfordert keine neuen Daten, nur eine andere Anordnung.

**Schritt 3: Gesundheit als eigenständiger Lebensraum**

Wenn die strukturierten Gesundheitsdaten (Konzeptkorrektur Gesundheitskarte) bereit sind, wird Gesundheit aus Notfall herausgelöst. Notfall behält nur das Notfall-Minimum.

**Schritt 4: Familie als eigenständiger Lebensraum**

Wenn Kinder mehr als eine Zahl mit Alter werden sollen — Name, Versicherung, Betreuung, Zulagen — brauchen sie einen eigenen Ort. Familie erscheint nur, wenn der Haushalt mehr als eine Person umfasst.

### Was langfristig entstehen könnte

**Vorsorge** als Sammlung der heute verstreuten Vorsorge-Daten (AHV, BVG, 3a, Testament, Patientenverfügung). Das ist der komplexeste neue Lebensraum, weil er Daten aus vielen Quellen zusammenführt.

**Lebensübergänge** als horizontale Schicht: "Du erlebst gerade eine Trennung. Das betrifft diese Bereiche." Das ist die fernste Vision — und die transformativste.

### Was nicht passieren sollte

- ❌ Alle 11 Lebensräume gleichzeitig bauen
- ❌ Bestehende Kapitel umbenennen oder umstrukturieren, bevor Spiegelungen fertig sind
- ❌ Werkzeuge als eigenständige Views behalten und gleichzeitig neue Lebensräume einführen
- ❌ Gesundheit einführen, bevor die medizinisch-rechtlichen Fragen geklärt sind
- ❌ Übergänge als Feature bauen, bevor die Lebensräume stabil sind

### Die Reihenfolge

| Phase | Was | Warum zuerst |
|-------|-----|-------------|
| **Jetzt** | Spiegelungen für alle 7 Kapitel | Verwandelt bestehende Formularkapitel in Lebensräume |
| **Danach** | Werkzeuge in Lebensräume integrieren | Beseitigt Sackmesser, schafft Zusammenhang |
| **Dann** | Ausbildung → Arbeit + Bildung | Natürliche Trennung, keine neuen Daten |
| **Dann** | Gesundheit als Lebensraum | Grösste inhaltliche Lücke |
| **Dann** | Familie als Lebensraum | Grösste strukturelle Lücke |
| **Zuletzt** | Vorsorge als Lebensraum | Komplexeste Integration |

---

## ZUSAMMENFASSUNG

Die heutige Struktur (7 Kapitel) ist eine solide Grundlage. Sie deckt die administrative Grundsituation ab. Was fehlt, sind nicht Features — es sind Lebensbereiche: Gesundheit, Familie, Vorsorge, eine klare Trennung von Arbeit und Bildung.

Die ideale Landkarte hat 11 Lebensräume. Aber der Weg dorthin führt nicht über Neubau, sondern über drei Bewegungen:

1. **Vertiefen** — Spiegelungen für alle bestehenden Kapitel
2. **Aufräumen** — Werkzeuge in ihre Lebensräume integrieren
3. **Erweitern** — Neue Lebensräume, wenn die bestehenden stabil sind

Die wichtigste Erkenntnis ist nicht, was fehlt. Die wichtigste Erkenntnis ist: **Die Reihenfolge zählt.** Erst die bestehenden 7 Kapitel zu echten Lebensräumen machen. Dann erweitern. Nicht umgekehrt.

---

*SWISS_LIFE_ARCHITECTURE.md — Die ideale Ordnung des Schweizer Lebens.*
*Keine Implementierung. Keine Roadmap. Nur die Struktur, die Maloja tragen könnte.*
