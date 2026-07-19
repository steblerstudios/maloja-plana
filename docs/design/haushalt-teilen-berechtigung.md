# Haushalt, Teilen & Berechtigung — Design-Faden

> **Konzept — noch nicht gebaut. Level 0 (Doku), kein Code.** Gemeinsam mit Stebler
> Studios aufgeworfen 2026-07-18. Braucht ausdrückliche Bau-Freigabe.
>
> **Gehört zur vertagten Login-/Tresor-Phase** ([tresor-lock.md](tresor-lock.md)). Drei der
> fünf Stücke hängen direkt am Konten-/Login-Modell — darum kommt dieser Faden **zuletzt**,
> mit der Logins-Phase, nach allem anderen. Diese Notiz hält ihn vollständig fest, damit er
> bereitliegt — **nicht**, um ihn als nächsten Schritt vorzuziehen.

## Warum diese Notiz

Maloja modelliert den Partner heute **als Rechen-Parameter** (Zivilstand, Konkubinat,
Partner-Einkommen) — breit vorhanden in AHV/Vorsorge, Steuern, SKOS/Sozialhilfe, IPV, Heirat,
KindBekommen, Todesfall. Das ist gut und bleibt.

Was **fehlt** (reproduce-first 2026-07-18, grep = leer): der Partner als **Mit-Mensch im
Haushalt** — also ein geteiltes Haushalts-Datenmodell, Zahlungs-Aufteilung, Zugriffsrollen
und Nachlass-Zugang. Die App ist heute bewusst Ein-Mensch, Ein-Gerät, local-first. Dieser
Faden ist deshalb keine einzelne Funktion, sondern **eine neue Schicht** — das Fundament der
Login-Phase.

## Die fünf Stücke (zusammenhängend)

| Stück | Kernfrage | Hängt an |
|---|---|---|
| 1. Haushalts-Zahlungsmodell | Wie teilen zwei (+ Kind) ihre Sachen? | Haushalts-Datenmodell |
| 2. Berechtigung / Rollen | Wer darf was sehen/ändern? | **Login & Konten** |
| 3. Kind im Haushalt | Welcher Anspruch, wessen Einkommen zählt? | Haushalts-Datenmodell |
| 4. Nachlass-Zugang | Wer bekommt im Todesfall Zugang zu welchen Daten? | **Login & Tresor** (Notfallzugang) |
| 5. Teilen | Wie geben zwei Menschen Daten frei? | **Login & Tresor** |

### 1 · Haushalts-Zahlungsmodell

Zwei Menschen, die zusammen wohnen, teilen ihre Ausgaben nach unterschiedlichen Mustern. Das
Modell ist **wählbar** pro Haushalt — Maloja schreibt keins vor, es bildet ab und rechnet ehrlich.

Kandidaten-Modelle (Orientierung, keine Vorschrift):
- **Ein Topf** — alles gemeinsam, keine Aufteilung.
- **Proportional nach Einkommen** — wer mehr verdient, trägt mehr (z.B. 60/40).
- **50/50** — hälftig, unabhängig vom Einkommen.
- **Getrennt mit Ausgleich** — jede:r zahlt Eigenes, gemeinsame Posten werden ausgeglichen.
- **Einer zahlt** — ein Einkommen trägt den Haushalt.

Anschlüsse im Bestand: das Budget (`FinanzUebersicht`/`BudgetSync`), die Haushalts-Logik in
`sozialhilfeRechner.js` / `cantonalData.js` (SKOS-Grundbedarf nach Haushaltsgrösse), die
Miet-/Wohn-Angaben. ⚠️ **Wahrheits-Disziplin:** sobald ein Modell eine sozialrechtlich
relevante Zahl beeinflusst (SKOS-Anrechnung, IPV, Steuer-Splitting), braucht es einen
amtlichen Beleg — bis dahin reine Budget-Orientierung, keine Anspruchs-Aussage.

Skill-Anker für die Bau-Runde: `maloja-household-logic`, `maloja-budget-philosophy`,
`maloja-swiss-life-model`.

### 2 · Berechtigung / Rollen / Zugriff

Sobald zwei Menschen dieselben Daten nutzen, stellt sich: **wer darf was?** Heute gibt es
keinerlei Rollen- oder Zugriffsmodell (die App ist Ein-Nutzer).

Grobe Rollen-Kandidaten (zu präzisieren):
- **Vollzugriff** — sehen + bearbeiten alles im geteilten Haushalt.
- **Nur ansehen** — Einblick, keine Änderung.
- **Nur eigener Teil** — jede:r sieht/pflegt die eigenen Angaben, gemeinsame Posten geteilt.

Offene Grundsatzfragen: Was ist die kleinste teilbare Einheit (ganzer Tresor · pro Bereich ·
pro Dokument)? Wie bleibt das local-first und ohne Server (Datenübertrag Gerät↔Gerät)? Wie
passt es zur Trust-Layer-Haltung (kein stiller Datenabfluss, kein Cloud-Zwang)?

Skill-Anker: `maloja-trust-layer`, `maloja-local-first-engineering`.

### 3 · Kind im Haushalt

Das Kind ist heute **Anspruchs-Parameter** (Alter/Einkommen fliessen in IPV, SKOS, Steuern,
`KindBekommen`). Was fehlt, ist das Kind als **Haushalts-Mitglied mit eigener Berechtigungs-
Frage**: Wie viel „gehört" dem Kind, welche Leistungen hängen am Kind, wessen Einkommen zählt
für welchen Anspruch — und (später) ob/wie ein älteres Kind eigenen Einblick bekommt.

⚠️ Rechts-sensibel (Kinderzulagen, Ausbildungszulagen, IPV-Kinderalter, Unterhalt) → vor jeder
Zahl der `swiss-precision-pruefer`.

### 4 · Nachlass-Zugang

Die Frage, die beim Nachlass/Todesfall aufkam: **wer bekommt im Todesfall Zugang zu welchen
Daten?** `Todesfall.jsx` deckt heute Hinterbliebenenrente + EL + Erbschaft/Nachlass inhaltlich
ab; Vorsorgeauftrag/Patientenverfügung existieren als Begriffe (`MirrorCards` `vorsorgeKeys`).
Ein echter **Zugriffs-/Notfallzugang-Mechanismus** existiert nicht.

Zu klären (mit der Tresor-Phase): hinterlegter Notfallzugang (wer, wie ausgelöst), Verhältnis
zum Vorsorgeauftrag (rechtlich, ZGB Art. 360), „digitaler Nachlass" ohne Server/Cloud. ⚠️
Rechts-sensibel → `rechts-`/`swiss-precision-pruefer`.

### 5 · Teilen

Der Übertrag selbst: **wie geben zwei Menschen Daten frei** — Gerät↔Gerät, ohne Server, ohne
dass etwas still das Gerät verlässt. Verwandt mit dem bestehenden Export/Backup und der
IDEEN-§13-Idee „Das verlässt dein Gerät: …"-Vorschau (Freigabe zeigt datensparsam, was
rausgeht). Das ist das wiederverwendbare Vertrauens-Muster für **jeden** Teilen-Moment.

## Governance & nächster sinnvoller Schritt

- **Nichts hiervon wird ohne ausdrückliche Freigabe gebaut** (Design zuerst, gemeinsam).
- **Reihenfolge:** kommt mit der Login-/Tresor-Phase, bewusst zuletzt. Kein Vorziehen als
  „nächster Schritt" (früherer Handoff-Fehler, siehe [tresor-lock.md](tresor-lock.md)).
- **Wenn drangenommen:** eigene Design-Runde je Stück, Zahlungsmodelle zuerst (am wenigsten
  Login-abhängig, rein Budget-Orientierung), Rollen/Nachlass/Teilen erst mit dem Konten-Modell.
- **Wahrheits-Disziplin:** jede sozialrechtliche Zahl (SKOS, IPV, Kinderzulagen, Erbrecht)
  belegt, bevor sie eine Marke/Aussage trägt.

## Quellen-Anker (für die spätere Bau-Runde)

- SKOS-Richtlinien (Grundbedarf nach Haushaltsgrösse) — bereits in `sozialhilfeRechner.js`.
- ZGB Art. 360 (Vorsorgeauftrag), Art. 370 (Patientenverfügung) — bereits in `LegalView`/`notfall`.
- Individualbesteuerung/Ehepaar-Splitting — offener Rechts-Check (siehe
  [[project-steuer-saeulen-zivilstand]] / `steuerRechner.js`).
