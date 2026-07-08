# Rätoromanisch (rm) — Gegenlese-Stand

**Aktualisiert:** 2026-07-08
**Status:** Aktiviert und live. Übersetzung noch unvollständig (Best-Effort aus DE-first-Bau).

> Diese Notiz war bis 2026-07-08 veraltet (behauptete `rm.js` sei leer / nicht
> aktiviert). Rumantsch ist längst live in `SUPPORTED` und im Sprachumschalter.
> Der echte offene Punkt ist nicht die Aktivierung, sondern die **Gegenlese**.

---

## So misst du den Stand

```
node scripts/i18n-gap-scan.mjs            # Übersicht je Sprache + Bereiche
node scripts/i18n-gap-scan.mjs --list rm  # volle Liste der offenen rm-Schlüssel
```

Der Scan findet Schlüssel, deren rm-Wert **exakt dem Deutschen gleicht** — das
starke Signal für „noch nicht übersetzt". (Fehlende Schlüssel fängt separat der
i18n-Vollständigkeitstest.) Nach jeder übersetzten Runde neu laufen lassen — die
Zahl soll sinken.

## Ehrliches Bild (Stand 2026-07-08)

| Sprache | Verdächtige Schlüssel | Einschätzung |
|---|---|---|
| **fr** | 57 | Praktisch sauber. Fast alles Cognates (Adresse, Total, Budget, Franchise, Testament, Tarif, Niveau — im Französischen dasselbe Wort), Eigennamen (Maloja Plana, Basler Angebote) und Platzhalter. |
| **it** | 38 | Praktisch sauber. Gleiche Lage — Cognates, Marken, Kürzel. |
| **rm** | 263 | **Der echte offene Brocken.** Ganze Ablauf-Flows stehen noch auf Deutsch. |

Kurz: **fr und it brauchen kaum etwas.** Die Gegenlese-Arbeit ist fast vollständig
Rätoromanisch.

## Wo die rm-Lücke sitzt (die Ablauf-Flows)

Die Schuld kommt aus den neueren, DE-first gebauten Lebensereignis-Abläufen, die
nie nach rm übersetzt wurden. Die grössten Blöcke — hier lohnt sich das Abarbeiten
Flow für Flow:

| Bereich | offene Schlüssel |
|---|---|
| `umzug` (Umzug) | 39 |
| `kvgWechsel` (Krankenkasse wechseln) | 35 |
| `unfallKrankheit` | 25 |
| `neuerJob` | 22 |
| `zusatzWechsel` (Zusatzversicherung) | 20 |
| `stelleVerloren` | 20 |
| `chapters` / `legal` u. a. | Rest (teils Cognates/Eigennamen → prüfen) |

Allein die sechs Flows oben = 161 Schlüssel. Ein Flow pro Sitzung ist eine ruhige,
abschliessbare Portion.

---

## Beim Übersetzen beachten

**Idiom:** Rumantsch Grischun (offizielle Schriftsprache des Bundes, SRF RTR,
Schulen) — durchgängig, wie bisher.

**Fachbegriffe:** Viele Verwaltungs-/Versicherungsbegriffe (AHV, IV, EL, BVG,
Krankenkasse) haben keine etablierte rm-Entsprechung. Die Bundeskanzlei führt die
Terminologie-Datenbank **TERMDAT** — dort prüfen statt raten (Haftung/Vertrauen).

**Warum überhaupt:** Rumantsch ist für Maloja Plana **identitätsstiftend**, nicht
nutzungsgetrieben (~60'000 Muttersprachler). Eine Schweizer Lebensordnungs-App
ohne die vierte Landessprache hat eine Lücke — auch wenn die meisten rm-Sprechenden
digitale Dienste auf Deutsch nutzen.
