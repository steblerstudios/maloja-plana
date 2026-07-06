# Analytics Weg 1 — Anleitung (Server-Log-Statistik)

> Operativer Runbook zum **Decision Record** [`analytics-decision.md`](analytics-decision.md).
> Kurz: Maloja verspricht „kein Tracking, keine Analytics" — deshalb **keine In-App-Analytics**.
> Erlaubt und ehrlich ist einzig die **aggregierte Auswertung der Server-Logs**, die
> `trust.hosting1` bereits deklariert (IP/Browsertyp, automatisch gelöscht). Kein Code,
> kein Cookie, kein Skript. „Kein Tracking" bleibt wörtlich wahr.

Diese Anleitung ist zum **Abarbeiten** gedacht: einmal einrichten, dann alle 3 Monate
5 Minuten für die Pitch-Zahlen.

---

## Einmalig — wo die Zahlen liegen (Infomaniak)

1. **Infomaniak Manager** einloggen → `manager.infomaniak.com`.
2. **Hosting / Hébergement Web** → Website **`malojaplana.ch`** wählen.
3. Bereich **Statistiken / Statistiques** öffnen. Infomaniak generiert daraus
   **AWStats** (bzw. Webalizer) direkt aus den Server-Logs — nichts zu aktivieren,
   es läuft schon.
4. Falls der Bereich leer wirkt: prüfen, ob **Log-Aufbewahrung / conservation des logs**
   im Hosting-Panel eingeschaltet ist (Standard: ja). Ohne aufbewahrte Logs keine Statistik.

**Optional — Roh-Logs selbst auswerten:** Manager → *Logs* (oder per FTP das Logs-Verzeichnis)
herunterladen und lokal aggregieren. Nur nötig, wenn AWStats nicht reicht.

---

## Was ablesen (und was NICHT geht)

**Verlässlich aus dem Server-Log:**

| Kennzahl | Wo in AWStats | Für den Pitch |
|---|---|---|
| Besuche / Monat | „Besuche" / „Visits" | Reichweite |
| Eindeutige Besucher | „Unique visitors" (IP-aggregiert) | grobe Nutzer:innenzahl |
| Seitenaufrufe | „Pages" | Aktivität |
| Herkunftsländer | „Länder / Countries" | CH-Fokus belegen |
| Referrer | „Referrers" | woher kommen die Leute |
| Einstiegs-Pfade | „Meistbesuchte URLs" | z. B. `/`, `/index.html` |

**Wichtige Grenze — Hash-Routing:** Maloja routet In-App über `#/…` (z. B. `#/situationen`,
`#/notfallkarte`). Der Fragment-Teil nach `#` wird vom Browser **nie an den Server gesendet**.
Server-Logs zeigen also **Besuche und Seitenaufrufe**, aber **nicht**, welche In-App-Views
geöffnet werden (Dashboard / Situationen / PDF-Export / einzelne Abläufe).
→ Genau diese Nutzungstiefe ist der Grund für **Weg 2** (siehe Decision Record). Nicht in
Weg 1 hineininterpretieren.

---

## Pitch-Zahlen festhalten (Vorlage)

Einmal pro Quartal die Zeile ausfüllen und hier anhängen — so entsteht eine ehrliche,
belegbare Zeitreihe ohne jede Nutzer:innen-Verfolgung.

| Monat | Besuche | Eind. Besucher | Seitenaufrufe | Top-Land | Notiz |
|---|---|---|---|---|---|
| 2026-07 |  |  |  |  |  |

---

## Datenschutz-Check (revDSG / DSG, kurz)

Maloja ist eine Schweizer Anwendung → massgeblich ist das **revidierte DSG (in Kraft seit
1.9.2023)**; die Punkte decken sich mit der DSGVO-Logik.

- **Server-Logs mit IP = Personendaten.** Ihre Bearbeitung ist zulässig, weil sie
  technisch notwendig ist (Betrieb/Sicherheit) und in `trust.hosting1` **transparent
  deklariert** wird.
- **Aggregierte Statistik** (Summen, Länder, Referrer) enthält keine Personendaten mehr →
  unbedenklich für Pitch/Reporting.
- **Kein Cookie, kein Skript** → **keine Einwilligung nötig** (kein ePrivacy-/Cookie-Consent-Fall).
- **Aufbewahrung:** Roh-Logs kurz halten und automatisch löschen lassen (Infomaniak-Default).
  Nur die **aggregierten** Zahlen dauerhaft aufheben, nicht die Roh-Logs.
- **Nicht** aus einzelnen IPs Personen zu identifizieren versuchen oder IP-Listen exportieren
  — das wäre eine neue, nicht deklarierte Bearbeitung.

> Kurzcheck vor dem ersten Reporting: Deckt sich `trust.hosting1` (i18n, 5 Sprachen)
> wirklich mit der tatsächlichen Log-Aufbewahrung bei Infomaniak? Wenn ja, ist Weg 1 sauber.
> (Keine Rechtsberatung — im Zweifel kurz mit einer Fachperson gegenlesen.)

---

## Rhythmus

- **Quartalsweise** (März/Juni/September/Dezember) die Pitch-Zahlen-Zeile ausfüllen —
  eingetragen im [Wartungskalender](maintenance-calendar.md).
- Kein Code, kein Deploy nötig. Reine Ablese-Aufgabe.

## Wenn Weg 1 nicht mehr reicht

Sobald du wissen willst, **welche Bereiche** genutzt werden (nicht nur wie viele Besuche),
ist das **Weg 2** (first-party Privacy-Analytics). Der braucht einen eigenen Mini-Endpoint
und ist an die Backend-Grundsatzfrage gekoppelt → **nicht ohne Gespräch bauen**.
Details im [Decision Record](analytics-decision.md).
