# LIFE SPACE PHASE RETROSPECTIVE — Maloja Plana

> Erstellt: 2026-06-07
> Abschlussbericht der Lebensraum-Phase.
> Keine Implementierung. Nur Rückblick und Ausblick.

---

## 1. WAS WURDE ERREICHT

### Quantitativ

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Kapitel mit Spiegelung | 3/7 | **7/7** |
| Lebensraum-Skala (Durchschnitt) | 1.9/5 | **2.9/5** |
| Orientierungssätze auf Feldern | 17 | **19** |
| Kontextabhängige Orientierungshinweise | 2 | 2 |
| Warme Empty States | 7/7 | 7/7 |
| i18n-Sprachen mit Mirror-Keys | 4 | 4 (DE/EN/FR/IT) |

### Implementierung

| Metrik | Wert |
|--------|------|
| Commits | 2 (`9c3d1e3`, `b33d027`) |
| Geänderte Dateien | 7 |
| Zeilen hinzugefügt | 640 |
| Zeilen entfernt | 63 |
| MirrorCards.jsx Gesamtgrösse | 732 Zeilen |
| Neue i18n-Keys (pro Sprache) | ~87 |
| Bundle-Grösse | 674.98 kB (gzip 188.36 kB) |
| Bundle-Wachstum | +8.98 kB (+1.3%) |
| Arbeitstage | 2 |

### Pro Kapitel

| Kapitel | Vorher | Nachher | Was gebaut wurde |
|---------|--------|---------|-----------------|
| Basis | 3/5 ✓ | 3/5 | Bereits vorhanden |
| Wohnen | 3/5 ✓ | 3/5 | Bereits vorhanden |
| Finanzen | 2/5 ✓ | 2/5 | Bereits vorhanden |
| Versicherungen | 1/5 | **3/5** | Lebenssatz + 3 Karten (Grundversicherung, Sozialversicherungen, Weitere) |
| Ausbildung | 1/5 | **2/5** | Lebenssatz + 3 Karten (Bildung, Beruf, Sprachen) |
| Behörden | 1/5 | **3/5** | Lebenssatz + 4 Karten (Steuern, Recht, Vertretung, Vorsorge) |
| Notfall | 2/5 | **4/5** | Lebenssatz + 4 Karten (Kontakt, Arzt, Vorsorge, Gesundheit-Status), ersetzt Emergency-Summary |

### Was sich für den Nutzer verändert hat

**Vorher:** Wer ein Kapitel öffnete, sah Felder. Leere Felder oder gefüllte Felder, aber immer Felder. Die App fragte: "Gib mir deine Daten."

**Nachher:** Wer ein Kapitel öffnet, sieht zuerst sich selbst. Einen Satz, der die eigene Situation beschreibt. Karten, die zeigen was hinterlegt ist. Erst darunter kommen die Felder. Die App sagt: "Das ist deine Situation."

---

## 2. WELCHE PRODUKTANNAHME WURDE BESTÄTIGT

### Die Kernannahme

> "Spiegelungen verwandeln Daten über dich in ein Bild von dir."

**Bestätigt.** Das Pattern funktioniert konsistent über alle 7 Kapitel:

1. **Es ist erweiterbar.** Dasselbe `hasMinData → buildSentence → buildSections → {title, rows}` Pattern trägt alle 7 Kapitel. Kein Sonderfall, keine Ausnahme. 276 Zeilen Code für 4 neue Kapitel — das Pattern skaliert.

2. **Es ist sprachunabhängig.** Alle Lebenssätze und Karten funktionieren in 4 Sprachen, weil die Logik (Builder) von den Texten (i18n-Keys) getrennt ist.

3. **Es respektiert Leere.** Kein Kapitel zeigt eine Spiegelung ohne Daten. Der Empty State greift wie vorher. Die Spiegelung entsteht erst, wenn der Mensch etwas eingetragen hat — das ist der Anti-Shame-Mechanismus.

4. **Es normalisiert Schweres.** Behörden zeigt "Keine Einträge" im Betreibungsregister so ruhig wie Wohnen eine Adresse zeigt. Notfall zeigt "✓ Vorhanden / ○ Noch offen" ohne Druck. Der Ton ist durchgehend sachlich, nie wertend.

### Die sekundäre Annahme

> "Orientierungssätze unter Feldern erklären das Warum."

**Bestätigt.** 19 Sätze stehen auf Feldern. Die Verdrahtung von Patientenverfügung und Vorsorgeauftrag (Tag 1, 15 Minuten) zeigt: Das Muster skaliert mit minimalem Aufwand. 13 weitere vorgeschriebene Sätze warten noch auf Verdrahtung — das ist Textarbeit, nicht Code.

### Die implizite Annahme

> "Die bestehende Architektur trägt."

**Bestätigt.** Keine neue Komponente, kein neuer Render-Typ, keine neuen Dependencies. MirrorCards.jsx wuchs von 456 auf 732 Zeilen — das ist akzeptabel für eine Datei mit klarer interner Struktur. ChapterView.jsx wurde sogar kleiner (−63 Zeilen durch Entfernung der Emergency-Summary).

---

## 3. WAS IST WEITERHIN NICHT PERFEKT

### 3.1 Finanzen bleibt bei 2/5

Finanzen hat eine Spiegelung, aber 21 Felder. Die Spiegelung mildert, aber heilt nicht. Das Kapitel fühlt sich nach dem Lebenssatz trotzdem wie eine Buchhaltung an. Die Anti-Shame-Sprache ("kein du hast zu viel ausgegeben") aus den Prinzipien ist nicht in den Feldern spürbar.

**Hebel:** Mehr Orientierungssätze auf Finanzen-Feldern. Budget-Philosophie als Intro. Keine Architektur-Arbeit.

### 3.2 Ausbildung bleibt bei 2/5

Ausbildung ist das schwächste Kapitel — ein Mischmakel aus Bildung und Beruf. Die Spiegelung hilft, aber das Kapitel hat kein klares Identitätsgefühl. "Ausbildung & Arbeit" als Titel suggeriert Gleichgewicht, aber 6 von 10 Feldern betreffen den Beruf.

**Hebel:** Langfristig: Trennung in Bildung + Arbeit (SWISS_LIFE_ARCHITECTURE.md). Kurzfristig: Nichts nötig.

### 3.3 Basis hat nur 1 Orientierungssatz

Alle anderen Kapitel haben ≥ 2. Basis hat nur den AHV-Satz. Das ist kein gravierendes Problem — Basis-Felder (Name, Geburtsdatum, Kanton) sind selbsterklärend. Aber ein Satz bei "Zivilstand" oder "Nationalität" könnte helfen.

### 3.4 Die Spiegelungen sind read-only

Die Spiegelkarten zeigen Daten, aber man kann sie dort nicht bearbeiten. Wer etwas ändern will, muss nach unten zu den Feldern scrollen. Das ist ein kleiner Bruch zwischen "Spiegel" und "Formular" — der Spiegel zeigt, das Formular verwaltet. Langfristig könnten die Karten klickbar sein und zum jeweiligen Feld scrollen.

### 3.5 Cross-Chapter-Potenzial ungenutzt

Finanzen nutzt Cross-Chapter-Daten (Miete aus Wohnen, KK-Prämie aus Versicherungen). Kein anderes Kapitel tut das. Behörden könnte den Wohnkanton aus Basis referenzieren ("Steuerkanton und Wohnkanton stimmen überein"). Versicherungen könnte die Franchise-Nutzung mit Gesundheitsdaten verknüpfen. Das sind Zukunftsthemen.

---

## 4. RISIKEN NACH 7/7 SPIEGELUNGEN

### 4.1 Erwartungshaltung steigt

**Risiko:** Nutzer, die die Spiegelungen in Basis und Wohnen sehen, erwarten dasselbe Niveau in allen Kapiteln. Versicherungen und Behörden liefern jetzt — aber Finanzen (2/5) und Ausbildung (2/5) fallen im Vergleich ab.

**Einschätzung:** Mittel. Die Spiegelungen heben das Gesamtniveau. Aber der Kontrast zwischen den besten (Notfall 4/5) und schwächsten (Finanzen/Ausbildung 2/5) Kapiteln ist jetzt spürbarer.

### 4.2 Lebenssätze können irreführend sein

**Risiko:** "Du bist bei Visana grundversichert" klingt offiziell. Ein Nutzer könnte denken, die App hat seine Versicherungsdaten verifiziert. In Wahrheit hat er den Namen selbst eingetippt.

**Einschätzung:** Niedrig. Der Alpha-Banner und die Disclaimer machen klar: Orientierung, nicht Beratung. Aber: langfristig könnte ein dezenter Hinweis bei den Lebenssätzen helfen ("Basierend auf deinen Angaben").

### 4.3 Stale Data

**Risiko:** Spiegelungen zeigen den letzten Stand. Wenn jemand die Krankenkasse gewechselt hat, aber das Feld nicht aktualisiert, zeigt die Spiegelung falsche Daten — und zwar prominent. Ein falscher Wert in einem Feld fällt weniger auf als ein falscher Lebenssatz.

**Einschätzung:** Mittel. Die Karten-Erinnerungen (CalendarReminders) könnten hier helfen — z.B. "KK-Daten zuletzt aktualisiert vor 14 Monaten". Aber das ist eine neue Funktion.

### 4.4 Notfallkarte-Export Regression

**Risiko:** Die Emergency-Summary wurde entfernt und durch MirrorCards ersetzt. Der Export-Link wurde verschoben. Wenn der Link nicht sichtbar genug ist, verlieren Nutzer den Zugang zur Notfallkarte.

**Einschätzung:** Niedrig. Der Link existiert und funktioniert. Aber er ist jetzt ein kleiner Textlink unter den Spiegelkarten statt Teil eines prominenten Summary-Blocks.

### 4.5 Farbige Blutgruppe verloren

**Risiko:** Die Emergency-Summary hatte eine farbcodierte Blutgruppe (rot, gold, blau, grün je nach Typ). Die MirrorCards-Spiegelung zeigt "Blutgruppe: A+" als einfachen Text. Das ist ein bewusster Designtrade-off, aber ein visueller Verlust.

**Einschätzung:** Niedrig. Die Spiegelkarte ist konsistenter mit dem Rest. Aber: wenn die Blutgruppe im Notfall schnell erkannt werden muss, war die farbige Variante besser.

---

## 5. WAS VOR DER BETA NOCH GETESTET WERDEN SOLLTE

### Mit echten Daten

| Test | Warum |
|------|-------|
| **Alle Spiegelungen mit Minimaldaten** | Nur 1 Feld gefüllt — zeigt die Spiegelung trotzdem etwas Sinnvolles? |
| **Alle Spiegelungen mit Maximaldaten** | Alle Felder gefüllt — wird die Spiegelung zu lang? Scrollt man ewig? |
| **Sprachwechsel** | Von DE auf FR wechseln — bleiben die Lebenssätze grammatisch korrekt? |
| **Dark Mode** | Alle Karten in beiden Themes prüfen. |
| **Mobile** | Karten auf kleinem Bildschirm — brechen die Label/Value-Paare korrekt um? |

### Mit echten Menschen

| Test | Warum |
|------|-------|
| **Ersteindruck eines Kapitels** | Versteht ein neuer Nutzer, was die Spiegelung zeigt? Oder ist es verwirrend? |
| **Emotionale Reaktion bei Behörden** | Wirkt "Keine Einträge" im Betreibungsregister beruhigend oder beängstigend? |
| **Notfall-Ton** | Fühlt sich "Für den Notfall ist eine Kontaktperson hinterlegt" vorbereitend an oder alarmierend? |
| **Versicherungs-Verständnis** | Versteht die Zielgruppe "Franchise CHF 2500"? Oder braucht es mehr Kontext? |

### Technisch

| Test | Warum |
|------|-------|
| **NotfallDossier weiterhin funktional** | Print-Preview generiert korrekt — Spiegelungen beeinflussen die Rohdaten nicht. |
| **Lebensmappe weiterhin funktional** | Print-Preview aller Kapitel — keine Regression. |
| **Notfallkarte-Export** | TXT-Download funktioniert — Link ist erreichbar. |
| **Performance mit vielen Daten** | 7 Spiegelungen gleichzeitig im Speicher — keine merkbare Verlangsamung. |

---

## 6. WAS IST DIE NÄCHSTE PHASE

### Die Reihenfolge aus LIFE_SPACE_CLOSURE_PLAN.md

| Phase | Was | Status |
|-------|-----|--------|
| ~~Spiegelungen für alle Kapitel~~ | ~~7/7 Lebensräume~~ | ✅ **Abgeschlossen** |
| **Werkzeug-Integration** | 8 Tools in Lebensräume verschieben | **Nächster Schritt** |
| Ausbildung → Arbeit + Bildung | Natürliche Trennung | Danach |
| Gesundheit als Lebensraum | Grösste inhaltliche Lücke | Danach |
| Familie als Lebensraum | Grösste strukturelle Lücke | Danach |
| Vorsorge als Lebensraum | Komplexeste Integration | Zuletzt |

### Werkzeug-Integration — was das bedeutet

8 Werkzeuge stehen heute als eigenständige Views in der Navigation, obwohl sie inhaltlich zu einem Lebensraum gehören:

| Werkzeug | Gehört zu | Aufwand |
|----------|-----------|---------|
| KK-Scanner | Versicherungen | Mittel |
| IPV / Prämienverbilligung | Versicherungen | Klein |
| SchuldenManager | Finanzen | Mittel |
| Steuerrechner | Behörden | Klein |
| Sozialhilfe | Behörden | Klein |
| Organspende | Notfall | Klein (redundant zum Feld) |
| CV-Generator | Ausbildung | Klein |
| Kalender-Erinnerungen | Meta-Ebene (bleibt) | — |

**Das Ziel:** Weniger eigenständige Tools in der Navigation. Mehr integrierte Funktionen innerhalb der Lebensräume. Aus dem "Sackmesser" wird ein "Schweizer Haus" — alles hat seinen Raum.

### Alternativ: Beta-Vorbereitung statt Werkzeug-Integration

Die Werkzeug-Integration ist die nächste logische Phase. Aber es gibt eine Alternative: **Beta-Vorbereitung**. Das würde bedeuten:

1. Impressum erstellen (rechtliche Pflicht)
2. Beta-Testaufgaben vorbereiten (BETA_REALITY_CHECK.md)
3. Den Basel-Stadt User kontaktieren
4. Emotionale Temperatur bei schweren Themen prüfen
5. Mobile-Optimierung

Beide Pfade sind valide. Die Frage ist: **Erst aufräumen (Werkzeuge), dann testen? Oder erst testen, dann aufräumen?**

Die Antwort hängt davon ab, ob der erste Beta-Test die Werkzeug-Struktur mitbewerten soll oder nur die Lebensraum-Qualität.

---

## ZUSAMMENFASSUNG

Die Lebensraum-Phase hat das Produktversprechen eingelöst: **"Lebensräume statt Tools."** Alle 7 Kapitel spiegeln jetzt die Situation des Menschen — ruhig, sachlich, ohne Bewertung.

**Was funktioniert:**
- Das Pattern trägt und skaliert
- Der Ton ist durchgehend richtig (vorbereitet, nicht alarmierend)
- Die Architektur brauchte keine Änderung
- 640 neue Zeilen, 63 entfernte — die Bilanz ist sauber

**Was bleibt:**
- Finanzen und Ausbildung sind die schwächsten Kapitel
- 13 Orientierungssätze warten auf Verdrahtung
- Die Werkzeuge sind noch verstreut
- Kein Mensch aus der Zielgruppe hat die Spiegelungen je gesehen

**Der eine Satz:**
> Maloja zeigt jetzt nicht mehr "Gib mir deine Daten", sondern "Das ist deine Situation."
> Ob die Zielgruppe das genauso empfindet, wissen wir erst nach der Beta.

---

*LIFE_SPACE_PHASE_RETROSPECTIVE.md — Abschluss der Lebensraum-Phase.*
*Von 1.9 auf 2.9. Von "überwiegend Verwaltung" zu "überwiegend Ort".*
*Die nächste Frage ist nicht mehr "funktioniert das Pattern?" — sondern "fühlt es sich richtig an?"*
