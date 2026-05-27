# Household Model Minimal — Implementierungsplan

> Minimales Haushaltmodell, das SKOS, Budget, Alimente und Kinderzulagen entblockt.
> Kein CRM. Kein Family Tree. Kein Multi-Account. Kein WG-System.
>
> Stand: 2026-05-27

---

## 1. Ist-Zustand

### Aktuelles Datenmodell

```
or5_data.basis.dependents = "2"   // String (text input), Zahl der "Kinder"
or5_data.basis.maritalStatus = "married" | "single" | "divorced" | "widowed"
or5_data.finanzen.employmentType = "employed" | "selfEmployed" | "freelance" | "retired"
```

**Problem:** `dependents` ist ein einzelnes Zahlenfeld. Kein Alter der Kinder, kein Unterschied Erwachsene/Kinder, kein explizites Pensioniert-Flag.

### Wo `dependents` heute verwendet wird

| Datei | Zeile | Verwendung | Problem |
|-------|-------|-----------|---------|
| `cantonalData.js` | :187 | `householdSize = 1 + dependents` | Kinder = Erwachsene in SKOS |
| `cantonalData.js` | :224 | `dependents` fuer IPV-Berechnung | Kein Alter = kein Kind-Satz |
| `cantonalData.js` | :231 | `subsidyFamily + dependents * subsidyChild` | Pauschal pro "dependent" |
| `premiumCalc.js` | :14 | `calculatePremiumSubsidy(..., dependents)` | Gleiche Pauschalisierung |
| `constants.js` | :72 | Feld-Definition im Basis-Kapitel | `type: 'text'` (Freitext!) |
| `constants.js` | :251 | FIELD_KEYS — Initialisierung | — |

### SKOS-Bug (MP-BUG-001)

`calculateSozialhilfe()` verwendet `SKOS_GRUNDBEDARF[householdSize]`:

```
SKOS_GRUNDBEDARF = { 1: 1031, 2: 1577, 3: 1918, 4: 2201, ... }
```

Aktuell: `householdSize = 1 + dependents` → 1 Erwachsener + 2 Kinder = Groesse 3 → CHF 1918.

**Das ist falsch.** SKOS unterscheidet zwischen Haushaltszusammensetzungen. Ein Haushalt mit 1 Erwachsenem + 2 Kindern hat einen anderen Grundbedarf als 3 Erwachsene.

### Weitere Abhängigkeiten

| Bereich | Aktuell | Was Household entblockt |
|---------|---------|------------------------|
| **SKOS/Sozialhilfe** | Kinder = Erwachsene | Korrekte Zusammensetzung |
| **IPV** | Pauschal pro "dependent" | Kind-Alter bestimmt KK-Praemienklasse |
| **Budget** | 1 Einnahme, keine Haushaltlogik | Templates nach Haushaltgroesse |
| **Kinderzulagen** | Nicht vorhanden | CHF 200-300/Kind/Monat (kantonal) |
| **Alimente** | Nicht vorhanden | Einnahme oder Ausgabe je nach Situation |
| **Steuer** | Kein Haushaltsbezug | Kinderfreibetrag, Verheiratetentarif |
| **EL-Berechnung** | Nur AHV/IV-Check | Pensioniert-Flag praezisiert |

---

## 2. Ziel-Datenmodell (V1 Minimal)

### Neue Datenstruktur

```javascript
// In or5_data.basis (neben existierenden Feldern)
{
  // BESTEHEND (bleibt):
  maritalStatus: "married",    // Zivilstand
  dependents: "2",             // DEPRECATED — bleibt fuer Rueckwaertskompatibilitaet

  // NEU:
  household: {
    adults: 1,                 // Anzahl Erwachsene im Haushalt (1-4, default 1)
    children: [                // Array: Kinder mit Alter
      { age: 8 },
      { age: 3 }
    ],
    isRetired: false           // Pensioniert ja/nein
  }
}
```

### Warum diese Felder

| Feld | Warum minimal noetig |
|------|---------------------|
| `adults` | SKOS-Grundbedarf unterscheidet 1 vs 2 Erwachsene |
| `children[].age` | KK-Praemienklasse (0-18 vs 19-25 vs 26+), Kinderzulagen (bis 16 vs bis 25) |
| `isRetired` | AHV/BVG-Relevanz, Budget-Unterscheidung, EL-Berechtigung |

### Was NICHT in V1

| Feld | Warum nicht |
|------|------------|
| `partnerName` / `partnerIncome` | Partner-Verknuepfung ist Phase 2+ |
| `children[].name` | Kein CRM — nur Alter fuer Berechnungen |
| `children[].custody` | Sorgerecht-Logik ist zu komplex fuer V1 |
| `guardianType` | Kein Rollen-System |
| `householdType` (WG etc.) | Kein Multi-Haushalt-Modell |

---

## 3. Migration v2 → v3

### Strategie

```javascript
// dataMigration.js — neue Migration
2: (data) => {
  const basis = data.basis || {};
  const dependents = Number(basis.dependents || 0);

  // Migriere: dependents-Zahl → children-Array (Alter unbekannt = 0)
  const children = [];
  for (let i = 0; i < Math.min(dependents, 10); i++) {
    children.push({ age: 0 });  // Alter muss der User nachpflegen
  }

  // Pensioniert ableiten aus employmentType
  const isRetired = (data.finanzen?.employmentType === 'retired');

  basis.household = {
    adults: 1,        // Default: 1 Erwachsener
    children,
    isRetired,
  };

  return { ...data, basis, _version: 3, _migratedAt: new Date().toISOString() };
}
```

### Migrationssicherheit

- `dependents`-Feld bleibt erhalten (nicht loeschen)
- Kinder bekommen `age: 0` (unbekannt) — User wird gebeten, Alter nachzutragen
- `isRetired` wird aus `employmentType === 'retired'` abgeleitet
- `adults` startet bei 1, da wir aktuell keine Partner-Daten haben
- Pre-Migration-Snapshot wird wie bisher automatisch erstellt

---

## 4. Betroffene Dateien

### Muss geaendert werden

| Datei | Was aendern |
|-------|-------------|
| `src/utils/dataMigration.js` | Migration v2→v3, `CURRENT_DATA_VERSION = 3` |
| `src/config/cantonalData.js` | `calculateSozialhilfe()` — `household` statt `dependents` |
| `src/config/cantonalData.js` | `calculateIPV()` — `household.children` statt `dependents` |
| `src/config/cantonalData.js` | `getGrundbedarf()` — differenzierte Zusammensetzung |
| `src/config/cantonalData.js` | `getRentLimit()` — `household`-basiert |
| `src/config/constants.js` | Basis-Felder: `dependents` ersetzen durch Household-UI |
| `src/config/constants.js` | `FIELD_KEYS.basis` aktualisieren |
| `src/premiumCalc.js` | `calculatePremiumSubsidy()` — `children` statt `dependents` |
| `src/i18n/de.js` | Neue Keys: household, adults, children, isRetired |
| `src/i18n/en.js` | Ditto |
| `src/i18n/fr.js` | Ditto |
| `src/i18n/it.js` | Ditto |

### Muss geprueft/angepasst werden

| Datei | Was pruefen |
|-------|-------------|
| `src/SozialhilfeView.jsx` | Zeigt `householdSize` an — muss differenzierte Info zeigen |
| `src/PremiumSubsidy.jsx` | IPV-Anzeige anpassen |
| `src/budgetSync.js` | Budget-Referenzierung (noch keine Aenderung, aber vorbereiten) |
| `src/BudgetSync.jsx` | Budget-Anzeige (noch keine Aenderung) |
| `src/zipExport.js` | Export-Daten anpassen |
| `src/Onboarding.jsx` | Evtl. Household-Felder im Onboarding |

---

## 5. SKOS-Grundbedarf korrekt

### Aktuelle Tabelle (falsch verwendet)

```
SKOS_GRUNDBEDARF = { 1: 1031, 2: 1577, 3: 1918, 4: 2201, 5: 2446, 6: 2691, 7: 2891 }
```

Diese Tabelle gilt fuer "Personen im Haushalt" pauschal. SKOS-Richtlinien differenzieren aber:

### Korrektere SKOS-Interpretation

| Zusammensetzung | Grundbedarf (SKOS 2024) |
|-----------------|------------------------|
| 1 Person | CHF 1031 |
| 2 Personen (Paar) | CHF 1577 |
| 1 Erw. + 1 Kind | CHF 1577 (gleiche Stufe wie Paar) |
| 2 Erw. + 1 Kind | CHF 1918 |
| 1 Erw. + 2 Kinder | CHF 1918 |
| 2 Erw. + 2 Kinder | CHF 2201 |

**Fuer V1-Minimal reicht:** Die bestehende SKOS-Tabelle nach Gesamtpersonenzahl bleibt valide. Die Differenzierung Erwachsene/Kinder wird hauptsaechlich fuer **Kinderzulagen, IPV-Praemienklasse und Budget-Templates** gebraucht, nicht fuer den SKOS-Grundbedarf selbst.

**Aber:** `householdSize` muss korrekt berechnet werden: `adults + children.length` statt `1 + dependents`.

---

## 6. UI-Aenderungen (Minimal)

### Basis-Kapitel: Familien-Sektion

Aktuell:
```
Zivilstand: [Dropdown]
Anzahl Kinder: [Freitextfeld]
```

Neu:
```
Zivilstand: [Dropdown]
Erwachsene im Haushalt: [1] [2] [3] [4]    ← Stepper oder Buttons
Kinder im Haushalt: [+] [-]                  ← Stepper
  Kind 1: Alter [__]
  Kind 2: Alter [__]
Pensioniert: [Ja/Nein]                       ← Toggle
```

### Prinzipien

- Ruhig, nicht ueberladen
- Inline im Basis-Kapitel (kein neuer Screen)
- Alter-Felder erscheinen dynamisch pro Kind
- Pensioniert-Toggle nur wenn employmentType nicht schon "retired" ist (oder immer zeigen fuer Klarheit)

---

## 7. Implementierungsreihenfolge

```
Schritt 1 — Datenschicht (kein UI):
  a) dataMigration.js: v2→v3 Migration
  b) cantonalData.js: Berechnungen auf household umstellen
  c) premiumCalc.js: Berechnungen auf household umstellen
  d) Build verifizieren

Schritt 2 — UI-Felder:
  a) constants.js: Basis-Kapitel Household-Felder
  b) ChapterView rendert die neuen Felder korrekt
  c) i18n: Neue Keys in allen 4 Sprachen
  d) Build + visuell verifizieren

Schritt 3 — Rueckwaertskompatibilitaet:
  a) Alle Stellen die `dependents` lesen, graceful auf `household` umstellen
  b) Fallback: wenn `household` fehlt, `dependents` verwenden
  c) Export (zipExport.js) anpassen
```

---

## 8. Risiken

| Risiko | Mitigation |
|--------|------------|
| Migration korrumpiert Daten | Pre-Migration-Snapshot (bestehend), `dependents` bleibt erhalten |
| Kinder-Alter unbekannt nach Migration | `age: 0` als "unbekannt", UI zeigt Hinweis |
| SKOS-Tabelle nicht differenziert genug | Fuer V1 reicht Gesamtpersonenzahl, spaeter verfeinern |
| Onboarding-Flow bricht | Household-Felder optional, Onboarding zeigt nur das Noetigste |
| Bundle-Groesse waechst | Minimal — nur Datenstruktur + wenige UI-Felder |

---

## 9. Explizite Nicht-Ziele

- Kein Partner/in-Profil
- Keine Kinder-Namen
- Kein Sorgerecht-/Custody-Modell
- Kein WG-/Mehrgenerationen-Haushalt
- Kein Multi-Account/Multi-Device
- Kein Household-Permission-System
- Keine Volljährigkeits-Uebergabe-Logik

---

## 10. Erfolgs-Kriterien

| Kriterium | Messung |
|-----------|---------|
| SKOS-Berechnung korrekt | `calculateSozialhilfe()` verwendet `household.adults + household.children.length` |
| IPV-Berechnung korrekt | `calculateIPV()` unterscheidet Kinder/Erwachsene |
| Migration sicher | v2→v3 ohne Datenverlust, Rollback moeglich |
| UI ruhig | Household-Felder integriert, nicht ueberladen |
| Build gruen | 0 Fehler, Bundle < 155 KB gzip |
| Rueckwaertskompatibel | Apps mit `dependents` (ohne `household`) funktionieren weiter |

---

*Dokument: household-model-minimal.md v1.0.0*
*Erstellt: 2026-05-27*
*Keine Implementation — nur Analyse + Plan.*
