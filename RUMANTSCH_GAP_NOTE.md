# Rätoromanisch (rm) — Gegenlese-Stand

**Aktualisiert:** 2026-07-08
**Status:** Aktiviert und live. Übersetzung noch unvollständig (Best-Effort aus DE-first-Bau).

> Diese Notiz war bis 2026-07-08 veraltet (behauptete `rm.js` sei leer / nicht
> aktiviert). Rumantsch ist längst live in `SUPPORTED` und im Sprachumschalter.
> Der echte offene Punkt ist nicht die Aktivierung, sondern die **Gegenlese**.

---

## So misst du den Stand

```
node scripts/i18n-gap-scan.mjs            # ehrliche Übersicht (Fehlalarme abgezogen)
node scripts/i18n-gap-scan.mjs --list rm  # echte offene rm-Schlüssel
node scripts/i18n-gap-scan.mjs --raw      # rohe Zahlen (mit Fehlalarmen)
```

Der Scan findet Schlüssel, deren rm-Wert **exakt dem Deutschen gleicht** — das
starke Signal für „noch nicht übersetzt". (Fehlende Schlüssel fängt separat der
i18n-Vollständigkeitstest.) Nach jeder übersetzten Runde neu laufen lassen — die
Zahl soll sinken.

## Ehrliches Bild (Stand 2026-07-08, nach Fehlalarm-Filter)

Der Scan zieht seit 2026-07-08 die Fehlalarme selbst ab (`isLikelyLegit`):
Cognates, Eigennamen, Codes, Format-Strings. Die **rohen** Zahlen (`--raw`) lagen
bei fr 57 / it 38 / rm 263 — **ehrlich** sind:

| Sprache | Echte Verdächtige | Einschätzung |
|---|---|---|
| **fr** | 9 | Faktisch fertig. 7 davon legitim (Testament, Cookies, „Franchise (CHF)" — im FR dasselbe Wort). Echt offen nur 2 Wortwahl-Entscheide: `Impressum`, `Affiliate`. |
| **it** | 2 | Fertig bis auf genau dieselben 2 Wortwahl-Fragen (`Impressum`, `Affiliate`). |
| **rm** | 217 | **Der echte offene Brocken.** Ganze Ablauf-Flows stehen noch auf Deutsch. |

Kurz: **fr und it brauchen nichts ausser einem Wortwahl-Entscheid.** Die
Gegenlese-Arbeit ist praktisch vollständig Rätoromanisch.

**Entscheid 2026-07-08:** RM bewusst **geparkt** — kein rm-Gegenleser verfügbar.
Nicht maschinell füllen (Haftung: falsche Fristen/Abläufe schaden mehr als die
sichtbare DE-Rückfallanzeige). Wieder aufnehmen, sobald jemand gegenlesen kann —
dann Flow für Flow, Liste via `--list rm`.

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
