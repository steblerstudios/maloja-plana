# Sprachstrategie — Maloja Plana

> Stand: 2026-06-21
> Zweck: Klare Trennung zwischen Landessprachen, Integrationssprachen und Wünschen.

---

## Aktuelle Sprachen (Beta)

| Sprache | Status | Warum |
|---------|--------|-------|
| Deutsch (DE) | Vollständig | Hauptsprache, grösste Nutzerbasis |
| Englisch (EN) | Vollständig | Internationale Zielgruppe, Expats, Erstorientierung |
| Französisch (FR) | Vollständig | Landessprache, ~23% der Bevölkerung |
| Italienisch (IT) | Vollständig (seit 2026-06-21) | Landessprache, ~8% der Bevölkerung |

---

## Sprachkategorien

### 1. Schweizer Landessprachen

DE, FR, IT sind umgesetzt. RM ist ein Sonderfall (siehe unten).

### 2. Integrationssprachen

Wenn das Ziel wirklich Integration ist — Menschen, die neu in der Schweiz ankommen und sich im System orientieren müssen — dann wären die nächsten Sprachen nicht RM, sondern:

| Sprache | Sprecher in CH (ca.) | Kontext |
|---------|---------------------|---------|
| Ukrainisch | ~80'000 (Schutzstatus S) | Grösste aktuelle Fluchtbewegung |
| Albanisch | ~250'000 | Kosovo/Nordmazedonien-Diaspora |
| Türkisch | ~80'000 | Etablierte Diaspora |
| Arabisch | ~50'000 | Syrien, Irak, Eritrea-Zweitsprache |
| Tigrinya | ~40'000 | Eritreische Diaspora |
| Portugiesisch | ~270'000 | Grösste Arbeitsmigrationsgruppe |

Diese Sprachen würden Menschen erreichen, die Maloja Plana am meisten brauchen.

### 3. Rätoromanisch (RM)

| Fakt | Detail |
|------|--------|
| Sprecher | ~60'000, praktisch alle bilingual (DE) |
| Signale | 4 unabhängige: Testperson C, Testperson A, Testperson B, Testperson G |
| Technischer Stand | `rm.js` existiert leer, nicht in SUPPORTED array, kein Header-Button |
| Status vorher | "Bewusst ausgeschlossen" |
| **Status jetzt** | **Dokumentierter Kandidat** — nicht ausgeschlossen, aber kein Beta-Blocker |

RM ist symbolisch wichtig (vierte Landessprache, Schweizer Identität), aber löst kein akutes Orientierungsproblem — alle RM-Sprecher verstehen Deutsch.

---

## Kriterien für neue Sprachen

Eine neue Sprache wird Kandidat, wenn:

1. **Nachfrage**: Mindestens 2 unabhängige Personen fragen danach
2. **Reichweite**: Die Sprache erreicht eine Gruppe, die Maloja Plana tatsächlich braucht
3. **Bedarf**: Die Zielgruppe hat keinen guten Zugang zu bestehenden DE/EN/FR/IT-Inhalten
4. **Machbarkeit**: Qualitätsübersetzung ist realistisch (nicht maschinell, fachlich korrekt)
5. **Pflege**: Jede neue Sprache muss bei jedem Feature-Update mitgepflegt werden

### Kosten pro Sprache

- ~1750 i18n-Keys (Stand Juni 2026)
- Fachterminologie (Sozialversicherungen, Steuern, Vorsorge)
- Laufende Pflege bei jedem neuen Feature
- Qualitätssicherung: kein Google Translate

---

## Entscheidungsmatrix

| Sprache | Nachfrage | Reichweite | Bedarf | Machbarkeit | Empfehlung |
|---------|-----------|------------|--------|-------------|------------|
| RM | 4 Signale (Testperson C, Testperson A, Testperson B, Testperson G) | Klein (~60k, alle bilingual) | Gering (alle sprechen DE) | Hoch (Romanisch-Übersetzungsdienste existieren) | Stärkster Sprach-Kandidat, aber löst keine Kernmuster |
| Ukrainisch | Nicht getestet | Hoch (~80k, wachsend) | Hoch (viele sprechen weder DE noch EN) | Mittel (Fachterminologie) | Prüfen wenn Integrations-Fokus wächst |
| Albanisch | Nicht getestet | Sehr hoch (~250k) | Mittel (viele sprechen DE, aber nicht alle) | Mittel | Prüfen bei Community-Feedback |
| Portugiesisch | Nicht getestet | Sehr hoch (~270k) | Mittel | Hoch | Prüfen bei Community-Feedback |

---

## Grundsatzentscheidung

Maloja Plana vermischt aktuell zwei Zielgruppen:

1. **Schweizer Bürger**, die ihr Leben ordnen wollen → DE/FR/IT/RM reichen
2. **Menschen in der Schweiz**, die sich im System orientieren müssen → Integrationssprachen wären wirkungsvoller

Die Sprachstrategie hängt davon ab, welche Zielgruppe Priorität hat.

**Aktuell:** Beide Gruppen werden mit DE/EN/FR/IT bedient. Weitere Sprachen erst nach validiertem Beta-Feedback und bewusster Zielgruppen-Entscheidung.
