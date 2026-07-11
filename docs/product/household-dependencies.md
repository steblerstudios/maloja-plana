# Household Model — Abhängigkeiten

> Stand: 2026-06-01
> Zweck: Klarheit, welche Teile vom Household Model von welchen Entscheidungen abhängen.
> Keine Implementierung — nur Abhängigkeitsanalyse.

---

## 1. Brutto/Netto-Entscheidung

**Was blockiert ist:**

| Bereich | Warum blockiert |
|---------|----------------|
| Budget Hardening | Einkommensfeld-Semantik unklar — alle Berechnungen hängen davon ab |
| Steuer-Integration im Budget | Brutto-Netto-Differenz ist Grundlage für Steuerberechnung |
| SKOS-Referenzwerte | SKOS-Grundbedarf basiert auf Nettoeinkommen |
| IPV im Budget | IPV-Berechnung braucht klare Einkommensdefinition |

**Was NICHT blockiert ist:**

| Bereich | Warum unabhängig |
|---------|-----------------|
| Household-Datenstruktur | Anzahl Erwachsene, Kinder, Alter, Pensioniert-Flag — unabhängig von Brutto/Netto |
| Household-UI (Felder) | Kann gebaut werden ohne Brutto/Netto |
| SKOS-Kinderlogik (Struktur) | Kinder vs. Erwachsene unterscheiden — unabhängig vom Einkommen |

**Empfehlung:** Household-Datenstruktur und UI können vor der Brutto/Netto-Entscheidung gebaut werden. Budget Hardening braucht die Entscheidung.

---

## 2. SKOS-Kinderlogik

**Abhängig von:**

| Voraussetzung | Status |
|---------------|--------|
| Household Model (Kinder mit Alter) | noch nicht implementiert |

**Was blockiert ist:**

| Bereich | Warum blockiert |
|---------|----------------|
| SKOS-Berechnung korrekt | Kinder werden aktuell als Erwachsene gezählt (FB-005) |
| Kinderzulagen als Einnahme | Ohne Kinder-Datenstruktur keine Berechnung möglich |
| Alimente als Einnahme/Ausgabe | Abhängig von Haushaltszusammensetzung |
| Familienzulagen-Kontext | Spiegelkarte zeigt Hinweis nur bei vorhandenen Kindern |

**Reihenfolge:**
```
Household-Datenstruktur → Kinder-Felder → SKOS-Tabelle korrigieren → Kinderzulagen
```

---

## 3. Budget Hardening

**Abhängig von:**

| Voraussetzung | Status |
|---------------|--------|
| Brutto/Netto-Entscheidung | Aktion von Stebler Studios ausstehend |
| Household Model (für Phase 2) | noch nicht implementiert |

**Budget Hardening Phasen:**

| Phase | Inhalt | Abhängigkeit |
|-------|--------|--------------|
| Phase 1 (Struktur) | Brutto/Netto-Toggle, Fixkosten erweitern, Schulden-Integration, IPV als Einnahme | Brutto/Netto-Entscheidung |
| Phase 2 (Household) | Kinderzulagen, Alimente, Kinderbetreuung, Haushaltsgrößen-Templates | Household Model |
| Phase 3 (Orientierung) | Calm Budget Sprache, SKOS-Referenzwerte, Rückstellungen | Phase 1 + 2 |

---

## Zusammenfassung: Was jetzt möglich ist

```
OHNE Brutto/Netto-Entscheidung:
  ✓ Household-Datenstruktur definieren
  ✓ Household-UI bauen (Felder)
  ✓ SKOS-Kinderlogik korrigieren (nach Household)
  ✓ Kinderzulagen-Berechnung (nach Household)

BRAUCHT Brutto/Netto-Entscheidung:
  ✗ Budget Hardening Phase 1
  ✗ Steuer-Integration
  ✗ IPV im Budget
  ✗ SKOS-Referenzwerte im Budget

BRAUCHT beides:
  ✗ Budget Hardening Phase 2
  ✗ Haushaltsgrößen-Templates
  ✗ Calm Budget Sprache (sinnvoller nach Struktur)
```

---

*Dokument: household-dependencies.md v1.0.0*
*Erstellt: 2026-06-01*
*Keine Implementierung — nur Abhängigkeitsanalyse.*
