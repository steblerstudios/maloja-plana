# Master Feedback Reconciliation

**Datum:** 15. Juni 2026
**Quellen:** 90+ Review-Dokumente, Sprint-Berichte, Readiness Checks, Tester-Feedback
**Methode:** Vollständige Extraktion → Deduplizierung → Statusbestimmung → Priorisierung

---

## Zusammenfassung

| Kategorie | Anzahl |
|---|---|
| Gesamte Feedbackpunkte extrahiert | ~320 |
| Deduplizierte Themen | 68 |
| **A — Vollständig umgesetzt** | 24 |
| **B — Teilweise umgesetzt** | 18 |
| **C — Offen** | 21 |
| **D — Bewusst verworfen** | 5 |

---

# 1. VOLLSTÄNDIG UMGESETZT (Status A)

| # | Thema | Quelle | Nachweis |
|---|---|---|---|
| A1 | Privacy vor erstem Feld | PRIVACY_TRUST_REVIEW | Onboarding Step 1, Commit 3859197 |
| A2 | Notfallkarte als Dashboard-Einstieg | VALUE_PROPOSITION_REVIEW | Dashboard.jsx, Commit 3859197 |
| A3 | Zweiter Vorname (middleName) | DATA_REUSE_REVIEW | constants.js, alle 4 Sprachen, Commit 131394f |
| A4 | Security Headers (.htaccess) | MASTER_GAP_ROADMAP A.1 | public/.htaccess, Commit ce0ed78 |
| A5 | Fehlerseite 404 | MASTER_GAP_ROADMAP A.2 | public/404.html, Commit ce0ed78 |
| A6 | Notfallkarte Druckversion | Sprint-Bericht | ChapterView.jsx handleSaveCard, Commit ae40c48 |
| A7 | Wohnkostenanteil-Synthese | SYNTHESIS_REVIEW | ChapterView.jsx, cross-chapter via allData, Commit a256d3b |
| A8 | Franchise i18n Keys (numerisch) | Sprint-Bericht | de/en/fr/it.js, Commit a256d3b |
| A9 | Lebenssätze (Life Sentences) | ROADMAP_EXECUTION E-01 | MirrorCards.jsx, alle 7 Kapitel |
| A10 | MVO (Minimum Viable Order) | ROADMAP_EXECUTION E-02 | Dashboard.jsx, 18 Kernfelder markiert |
| A11 | Notfall-Einstieg (Szenarien) | ROADMAP_EXECUTION E-03 | NotfallEinstieg.jsx, 3 Szenarien |
| A12 | Ankunftsmomente | ROADMAP_EXECUTION E-04 | ChapterView.jsx, ankunft-Keys |
| A13 | Kapitelabschlüsse | ROADMAP_EXECUTION E-05 | ChapterView.jsx |
| A14 | Synthesen (Wohndauer, Ausgaben, Versicherungsübersicht) | ROADMAP_EXECUTION E-06 | ChapterView.jsx |
| A15 | Finanzdifferenz (Einnahmen − Ausgaben) | SYNTHESIS_VALUE_REVIEW | MirrorCards.jsx:230 |
| A16 | 4-Sprachen i18n (DE/EN/FR/IT) | I18N_FINAL_CHECK | ~1300 Keys pro Sprache |
| A17 | Section Intros (Orientierungssätze) | SECTION_VOICE_LIBRARY | 28 Sektionen, 4 Sprachen |
| A18 | Malojapass Berglandschaft | LANDSCAPE_IDENTITY_REVIEW | Dashboard.jsx, 3-Layer SVG |
| A19 | Progressive Easter Eggs | ICONOGRAPHY_IDENTITY_REVIEW | 9 Elemente (Tannen→Fahne) |
| A20 | Kapitel-Statuswörter (statt Prozent) | E06_IMPACT_REVIEW | chapterStatus: leer/begonnen/grundordnung/vertieft |
| A21 | Alpha-Banner mit Disclaimer | BETA_READINESS_REVIEW_V2 | Dashboard.jsx AlphaBanner |
| A22 | Hardcodierte Strings behoben | I18N_FINAL_CHECK | nav.privacyNote, chapterView.uploadSuccess |
| A23 | Versicherungsübersicht (Coverage) | SYNTHESIS_REVIEW | ChapterView.jsx:577 |
| A24 | Notfallkarte Privacy (erfasst statt Inhalt) | Sprint-Bericht | handleSaveCard, cardRecorded |

---

# 2. TEILWEISE UMGESETZT (Status B)

| # | Thema | Was fehlt | Quelle |
|---|---|---|---|
| B1 | Auto-Prefill (employer, canton) | Duplikation erkannt, aber Prefill-Logik nicht implementiert | DATA_REUSE_REVIEW |
| B2 | Datenschutzerklärung | Legal-Seite existiert, aber Impressum hat Platzhalter | MASTER_GAP_ROADMAP A.5, I18N_FINAL_CHECK |
| B3 | Behörden Zeitkontext | Wohndauer existiert, aber Steuerfrist-Countdown fehlt | SYNTHESIS_REVIEW |
| B4 | Versicherungslücken sichtbar machen | Übersicht zeigt vorhandene, aber «nicht erfasst» wird nicht als Lücke benannt | SYNTHESIS_REVIEW, TRUST_REVIEW |
| B5 | Kapitelabschluss-Moment | Closure existiert, aber kein emotionaler Moment nach letztem Feld | SPATIAL_DESIGN_REVIEW, PROGRESSION_REVIEW |
| B6 | Lebenssatz am Arbeitsort | MirrorCards haben ihn, aber beim Ausfüllen nicht sichtbar | TRANSFORMATION_REVIEW, E06_IMPACT_REVIEW |
| B7 | Kuhglocke statt Alarmglocke | Konzept dokumentiert, SVG spezifiziert, aber nicht implementiert | KUHGLOCKE_IMPLEMENTATION_NOTE |
| B8 | Mobile 375px Feinschliff | Grundsätzlich responsive, aber systematischer Durchgang fehlt | MASTER_GAP_ROADMAP A.3 |
| B9 | Guided Start Schwelle | Karte erscheint, aber verschwindet zu spät (bei 28% statt bei Grundordnung) | E06_IMPACT_REVIEW |
| B10 | Sidebar Komplexität | 24 Einträge, zu viel für Erstnutzer | BETA_READINESS_REVIEW_V2 |
| B11 | Fortschrittsanzeige inkonsistent | MVO-Bar + Malojapass + Status-Wörter = 3 redundante Schichten | E06_IMPACT_REVIEW |
| B12 | Budget-Erlebnis | Budget Light existiert, aber dünn — nur 5 Kategorien, keine warme Sprache | BETA_REALITY_CHECK |
| B13 | Sozialhilfe i18n | Einige Ergebnis-Strings bypass i18n (hardcoded German) | PROJECT_STATUS, RELEASE_NOTES |
| B14 | AHV-Nummer Duplikation | Kann in Basis UND KK-Scanner eingegeben werden | PROJECT_STATUS KI-003 |
| B15 | QR-Code CDN-Abhängigkeit | Organspende + KK-Scanner nutzen externe CDN — widerspricht «lokal» | TRUST_REVIEW, RELEASE_NOTES |
| B16 | Sprache «Dokument-Tresor» | Sollte «Dokumentenablage» heissen — Bank-Metapher suggeriert falsche Sicherheit | LANGUAGE_SYSTEM_NOTE |
| B17 | SchuldenManager + BudgetImport | Scaffolded, aber persistieren keine Daten zwischen Sessions | RELEASE_NOTES |
| B18 | Testdaten-Set | Kein vorgefertigtes Demo-Profil für Vorführungen | MASTER_GAP_ROADMAP A.4 |

---

# 3. OFFEN (Status C)

| # | Thema | Vertrauen | Nutzen | Verständlichkeit | CH-Identität | Aufwand | Quelle |
|---|---|---|---|---|---|---|---|
| C1 | Rumantsch (5. Landessprache) | 2 | 2 | 2 | 5 | 4 | RUMANTSCH_GAP_NOTE |
| C2 | Räumliches Kapitel-Erlebnis (Dramaturgie) | 3 | 4 | 4 | 3 | 4 | SPATIAL_DESIGN_REVIEW |
| C3 | Typografie-Lift (12→15px, Materiality) | 2 | 3 | 4 | 3 | 3 | ROADMAP_EXECUTION E-07 |
| C4 | Export-Erinnerung (Datenverlust-Schutz) | 5 | 4 | 3 | 1 | 2 | TRUST_REVIEW |
| C5 | Patientenverfügung Generator | 3 | 5 | 3 | 3 | 5 | ESTATE_GENERATOR_ARCHITECTURE |
| C6 | Vorsorgeauftrag Generator | 3 | 4 | 3 | 3 | 5 | ESTATE_GENERATOR_ARCHITECTURE |
| C7 | PWA / Service Worker (Offline) | 4 | 3 | 2 | 1 | 3 | RELEASE_NOTES |
| C8 | Kinder als eigene Entitäten | 2 | 4 | 3 | 3 | 5 | SWISS_LIFE_ARCHITECTURE |
| C9 | Lebensübergänge (Umzug, Geburt, Trennung) | 2 | 5 | 3 | 3 | 5 | TRANSITIONS_ARCHITECTURE |
| C10 | Familie als eigenes Kapitel | 2 | 3 | 3 | 3 | 5 | SWISS_LIFE_ARCHITECTURE |
| C11 | Gesundheit als eigenes Kapitel | 2 | 4 | 3 | 3 | 5 | SWISS_LIFE_ARCHITECTURE |
| C12 | Qualitative Fortschritts-Kommunikation | 3 | 4 | 5 | 2 | 2 | PROGRESSION_REVIEW |
| C13 | Notfall-Meaning-Translation | 3 | 3 | 4 | 2 | 2 | SYNTHESIS_REVIEW |
| C14 | Stille nach dem letzten Feld | 3 | 3 | 4 | 2 | 1 | PRODUCT_ESSENCE_REVIEW, SPATIAL_DESIGN_REVIEW |
| C15 | Kantonale Unterschiede (SKOS, Sozialhilfe) | 2 | 3 | 3 | 5 | 5 | PROJECT_STATUS KI-006 |
| C16 | Beispiel-Modus (fiktive Demo-Person) | 3 | 4 | 5 | 1 | 3 | VALUE_PROPOSITION_REVIEW |
| C17 | Quellangaben bei Berechnungen | 4 | 2 | 3 | 2 | 2 | TRUST_REVIEW |
| C18 | SKOS Haushaltsbug (Kinder als Erwachsene) | 2 | 3 | 2 | 2 | 4 | PROJECT_STATUS KI-001 |
| C19 | Schweizer Ikonografie-Integration | 1 | 2 | 3 | 5 | 3 | ROADMAP_EXECUTION E-08 |
| C20 | Gemeinde-Ebene (über Kanton hinaus) | 1 | 2 | 2 | 4 | 5 | Aufgabe 6 |
| C21 | Batterieverbrauch / Performance-Audit | 2 | 2 | 1 | 1 | 2 | Aufgabe 6 |

---

# 4. BEWUSST VERWORFEN (Status D)

| # | Thema | Grund | Quelle |
|---|---|---|---|
| D1 | Cloud-Sync | Widerspricht Kernidentität (lokal-first) | ROADMAP_CHECKPOINT |
| D2 | Bank-API Integration | Abhängigkeit, Sicherheitsrisiko, Identitätsverlust | ROADMAP_CHECKPOINT |
| D3 | Push-Notifications | Verändert Beziehung von «ich komme» zu «es sagt mir» | TRUST_REVIEW, ANTI_PATTERNS_REVIEW |
| D4 | Versicherungsvergleiche | Maloja ist Spiegel, nicht Berater | ANTI_PATTERNS_REVIEW |
| D5 | KI-basierte Empfehlungen | Widerspricht «nachvollziehbare Mathematik» | Projektvorgaben |

---

# 5. TOP 10 NÄCHSTE THEMEN

Sortiert nach Wirkung ÷ Aufwand:

| Rang | Thema | Wirkung | Aufwand | Score | Begründung |
|---|---|---|---|---|---|
| **1** | **C4 — Export-Erinnerung** | 5+4+3 = 12 | 2 | **6.0** | Grösste Vertrauenslücke: Datenverlust ohne Warnung. Ein einziger Banner/Reminder nach X Tagen ohne Export. |
| **2** | **C14 — Stille nach letztem Feld** | 3+3+4 = 10 | 1 | **10.0** | 1 Stunde Arbeit, schliesst Kapitel emotional ab. Jedes Review erwähnt fehlende Closure. |
| **3** | **C12 — Qualitative Fortschritts-Kommunikation** | 3+4+5 = 12 | 2 | **6.0** | Statt Prozent: «Dein Notfall ist geordnet. Willst du vertiefen?» — verändert das Erlebnis grundlegend. |
| **4** | **C17 — Quellangaben bei Berechnungen** | 4+2+3 = 9 | 2 | **4.5** | Jede Zahl, die Maloja zeigt, braucht eine nachprüfbare Quelle. Klein, aber vertrauenskritisch. |
| **5** | **B1 — Auto-Prefill (employer, canton)** | 2+3+3 = 8 | 1 | **8.0** | Daten existieren bereits. Nur Prefill-Logik fehlt. Reduziert Doppeleingabe sofort. |
| **6** | **C13 — Notfall-Meaning-Translation** | 3+3+4 = 10 | 2 | **5.0** | «Im Notfall ist das Wichtigste findbar» statt «3 von 8 Feldern ausgefüllt». |
| **7** | **B9 — Guided Start Schwelle** | 2+3+4 = 9 | 1 | **9.0** | Guided Start verschwindet bei Grundordnung, nicht bei 28%. Einzeilige Änderung. |
| **8** | **C3 — Typografie-Lift** | 2+3+4 = 9 | 3 | **3.0** | 12px → 15px Basisgrösse. Lesbarkeit steigt massiv, besonders mobil. |
| **9** | **B2 — Impressum vervollständigen** | 4+1+2 = 7 | 1 | **7.0** | Platzhalter durch echte Angaben ersetzen. Vertrauenskritisch. |
| **10** | **C16 — Beispiel-Modus** | 3+4+5 = 12 | 3 | **4.0** | Zeigt den Nutzen VOR der Dateneingabe. Stärkstes Mittel gegen «fühlt sich wie ein grosses Formular an». |

---

# 6. EMPFEHLUNG SPRINT 1 — «Vertrauen & Abschluss»

**Fokus:** Die 5 schnellsten Hebel mit höchster Vertrauens-Wirkung.

1. **Export-Erinnerung** — Banner nach 7 Tagen ohne Backup
2. **Stille nach letztem Feld** — Ruhe-Moment am Kapitelende
3. **Guided Start Schwelle korrigieren** — verschwinden bei Grundordnung
4. **Impressum vervollständigen** — Platzhalter ersetzen
5. **Auto-Prefill employer/canton** — Doppeleingabe eliminieren

**Geschätzt:** 1 Session, ~4 Stunden
**Wirkung:** Vertrauen +++ / Nutzen ++ / Aufwand gering

---

# 7. EMPFEHLUNG SPRINT 2 — «Erlebnis & Kommunikation»

**Fokus:** Das Kapitel-Erlebnis von «Formular» zu «Ort» bewegen.

1. **Qualitative Fortschritts-Kommunikation** — Statuswörter mit Kontext
2. **Notfall-Meaning-Translation** — «Im Notfall findbar» statt Feldanzahl
3. **Quellangaben bei Berechnungen** — IPV, Sozialhilfe mit Referenzen
4. **Kuhglocke implementieren** — sanfte Erinnerung statt Alarm
5. **Typografie-Lift** — 12→15px Basisgrösse

**Geschätzt:** 2 Sessions, ~8 Stunden
**Wirkung:** Verständlichkeit +++ / CH-Identität ++ / Nutzen ++

---

# 8. EMPFEHLUNG SPRINT 3 — «Mehrwert sichtbar machen»

**Fokus:** Nutzen zeigen, bevor Daten eingegeben werden.

1. **Beispiel-Modus** — fiktive Demo-Person zeigt alle Features
2. **Behörden Zeitkontext** — Steuerfrist-Countdown
3. **Sozialhilfe i18n** — hardcodierte Strings beheben
4. **QR-Code Library bundlen** — CDN-Abhängigkeit eliminieren
5. **Sidebar vereinfachen** — weniger Einträge für Erstnutzer

**Geschätzt:** 2 Sessions, ~8 Stunden
**Wirkung:** Nutzen +++ / Vertrauen ++ / CH-Identität +

---

# 9. BESONDERS GEPRÜFTE THEMEN (Aufgabe 6)

### Daten
| Thema | Status | Detail |
|---|---|---|
| Zweiter Vorname | ✅ A | Commit 131394f, alle Sprachen, getFullName(), MirrorCards, Notfallkarte, Export |
| Datenübernahme | ⚠️ B1 | Duplikation erkannt (employer, canton), Prefill nicht implementiert |
| Auto-Prefill | ❌ C | 0 Treffer in Code. Architektur (allData) ermöglicht es, aber keine Logik vorhanden |

### Vertrauen
| Thema | Status | Detail |
|---|---|---|
| Lokale Speicherung | ✅ A | localStorage, Privacy-Note vor erstem Feld, Alpha-Banner |
| Keine Datensammlung | ✅ A | Kein Tracking, kein Analytics, kein Network-Request für User-Daten |
| Dokumentenspeicher | ✅ A | DocumentTresor existiert, funktional |

### Nutzen
| Thema | Status | Detail |
|---|---|---|
| Warum Maloja? | ⚠️ B | Tagline vorhanden, aber Nutzen erst nach Dateneingabe sichtbar |
| Notfallkarte | ✅ A | Druckbar, Privacy-aware, Dashboard-Einstieg |
| Sichtbarer Mehrwert | ⚠️ B | Guided Start + Notfallkarte gut, aber kein Beispiel-Modus |

### Versicherungen
| Thema | Status | Detail |
|---|---|---|
| Ablaufdaten | ❌ C | Kein Ablaufdatum-Feld, kein Erneuerungshinweis |
| Übersicht | ✅ A | Coverage-Übersicht in ChapterView.jsx:577 |
| Mögliche Vergleiche | 🚫 D | Bewusst verworfen — Spiegel, nicht Berater |

### Finanzen
| Thema | Status | Detail |
|---|---|---|
| Budgetziele | ⚠️ B | budgetGoal-Felder existieren (11 Treffer), aber keine Orientierung |
| Orientierung | ⚠️ B | Finanzdifferenz zeigt Saldo, aber ohne «auf Basis der erfassten Ausgaben» |

### Wohnen
| Thema | Status | Detail |
|---|---|---|
| Kantonale Unterschiede | ❌ C | Kantonslogik für Steuern, aber keine Mietrecht-Unterschiede |
| Kündigungsfristen | ❌ C | 1 Treffer im Code — nicht als Feature vorhanden |

### Schweiz
| Thema | Status | Detail |
|---|---|---|
| Rumantsch | ❌ C1 | rm.js existiert, 0 Bytes. Nicht in SUPPORTED. ~180 Keys fehlen |
| Kantonslogik | ✅ A | 26 Kantone, cantonalData.js, Steuer/Sozialhilfe-Berechnung |
| Gemeindeunterschiede | ❌ C20 | 14 Treffer, aber keine Gemeinde-Auswahl oder -Logik |

### Vorsorge
| Thema | Status | Detail |
|---|---|---|
| Testament | ✅ A | Feld willMade in Behörden, Lebenssatz reflektiert es |
| Vorsorgeauftrag | ✅ A | Feld powerOfAttorney in Notfall |
| Bestattungswünsche | ✅ A | Feld burialWishes in Notfall, Disclosure-geschützt |

### Performance
| Thema | Status | Detail |
|---|---|---|
| Bundle-Grösse | ⚠️ B | 713 KB (uncompressed), ~200 KB gzip. Budget: <200 KB. Knapp. |
| Geschwindigkeit | ✅ A | Instant load, kein Spinner, localStorage-basiert |
| Batterieverbrauch | ❌ C21 | Kein Audit durchgeführt. Auto-save alle 5s ohne Dirty-Flag (KI-008) |

---

# 10. GRÖSSTER BLINDER FLECK

**Datenverlust ohne Warnung.**

Maloja speichert alles in localStorage. Browser-Cache leeren = alles weg. Es gibt keinen Export-Reminder, keine Warnung, keine automatische Sicherung. TRUST_REVIEW bewertet dies als #1 Vertrauensrisiko (5/5). Kein anderes Feedback-Thema hat gleichzeitig so hohe Wirkung und so niedrigen Aufwand.

---

# 11. WIDERSPRÜCHE IM FEEDBACK

| Widerspruch | Quelle A | Quelle B | Auflösung |
|---|---|---|---|
| «Mehr Synthesen» vs «Keine Empfehlung» | SYNTHESIS_REVIEW | ANTI_PATTERNS_REVIEW | Synthesen zeigen Fakten (38%), keine Bewertung (zu viel) |
| «Completion sichtbar» vs «Keine Prozente» | COMPLETENESS_REVIEW | LANGUAGE_SYSTEM_NOTE | Statuswörter (leer/begonnen/vertieft) statt Prozente ✅ gelöst |
| «Mehr Kapitel» vs «Feature Creep» | SWISS_LIFE_ARCHITECTURE | PRODUCT_ESSENCE_REVIEW | Erst bestehende 7 vertiefen, neue Kapitel sind Vision, nicht nächster Schritt |
| «Stille ist Vertrauen» vs «Stille ist Vernachlässigung» | REST_REVIEW | REALITY_REVIEW | Stille mit Orientierung (Section Intros), nicht absolute Stille |
| «100 Felder ausfüllen» vs «23 reichen für Verständnis» | DEPTH_REVIEW | TRANSFORMATION_REVIEW | MVO (18 Felder) als Kern, Rest als Vertiefung — beides koexistiert |
