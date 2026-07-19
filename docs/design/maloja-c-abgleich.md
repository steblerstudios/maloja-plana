# maloja-c — systematischer Abgleich & Extraktion

> **Level 0 (Analyse-Doku), kein Code.** Erstellt 2026-07-18. Quelle: `Ideen Kiste/maloja c/`
> (Codex-Master-Dossier, Stand 2026-07-18). Zweck: aus dem maloja-c-Stand ehrlich rausnehmen,
> was ins heutige Produkt gehört — und sauber trennen, was Strategie bzw. Grundsatz-Entscheid ist.
>
> ⚠️ maloja-c sagt über sich selbst: *„noch nicht beginnen, Prototypen sind Arbeitsgrundlage,
> kein endgültiges Design"* (`NAECHSTE-SCHRITTE-GEORDNET.md`). Dieser Abgleich adoptiert nichts
> still — er sortiert.

## Was maloja-c ist

Ein **Master-Dossier für eine kommerzielle 4-Flächen-Plattform**:
1. öffentliche Website (Positionierung, Maloja-Index, Partnergewinnung),
2. persönliche Web/Mobile-App (Lebensnavigator) — **= das heutige Maloja**,
3. **Partnerportal** (Übergaben, Vertrag, Metering) — existiert heute nicht,
4. **internes Betreiberportal** (Finanzen, Nutzung, Compliance) — existiert heute nicht.

Dazu: Business-Metrics/Moat, Markt-Evidence-CH, B2B2C-Strategie, Finanzmodell, Plattform-
Architektur (Datenmodell, Encryption-Recovery), Partner-Prototypen (Offertenrechner, Portal,
Operator-Portal, Entitlement-Simulator, öffentliche Partnerseite) und vier Audits.

## Drei Schichten — und wohin sie gehören

### Schicht A · Produkt-Layer (ins heutige `maloja-frontend`, bescheiden)

| Idee | Status |
|---|---|
| „Vor dem Wechsel prüfen"-Schritt + „Das verlässt dein Gerät"-Vorschau | ✅ schon extrahiert (IDEEN §13) |
| ENCRYPTION-RECOVERY (Schlüssel-/Geräteverlust-/Wiederherstellungs-Konzept) | → Input für die vertagte **Tresor-Lock-Phase** ([tresor-lock.md](tresor-lock.md)) |
| Entitlement-Simulator (Berechtigung/Anspruch) | thematisch nah an `AnspruchLandkarte` + [Haushalt-Faden](haushalt-teilen-berechtigung.md) — als Ideen-Anker |
| Audit-Befunde (siehe unten) | teils auf die echte App anwendbar |

### Schicht B · Strategie/Business-Layer (→ Stebler Studios, NICHT ins App-Repo)

Business-Metrics/Moat · Market-Evidence-Pack-CH · B2B2C-Pull-Strategie · **Finanzmodell 2026-v2**
· Positionierung-nach-Lebenslagen. Das ist CFO/CMO-Material (businessplan / C-Suite), kein
App-Code. Gehört in den Stebler-Studios-Ordner, hier nur verlinkt.

### Schicht C · Kommerzielle Plattform-Richtung (Grundsatz-Entscheid, siehe unten)

Partnerportal · Operator-Portal · Offertenrechner · **Maloja-Index (Partner-Scoring)** · Metering
· verifizierter Nachweis = eine kommerzielle B2B2C-Partner-Plattform. **Kein „Feature-Rausnehmen",
sondern eine Identitäts-Entscheidung.**

## Audit-Abgleich (maloja-c-Audits → echte App, reproduce-first geprüft)

Die maloja-c-Audits prüfen den *Prototyp* (anderer Code). Übertragbar auf `maloja-frontend`:

| Befund (Quelle) | Ist-Stand echte App | Aktion |
|---|---|---|
| **DSFA / Privacy-by-Design** (FACH-RECHT) — bei besonders schützenswerten Daten Pflicht (revDSG, EDÖB) | nur `datenschutzerklaerung-ndsg.md` vorhanden, **keine DSFA** | 🟠 vor Produktivstart: DSFA + per-Modul-Freigabe-Register. Local-first entschärft massiv, aber Disziplin gilt (v.a. vor jeder Cloud/Partner). |
| **Per-Modul-Freigabe** (Fachperson/Rechtsgrundlage/Version/Kanton) (FACH-RECHT) | Daten-Versions-Konstanten da; formales Freigabe-Register fehlt | 🟡 Doku-Disziplin, deckt sich mit Wahrheits-Disziplin |
| **Backup-Import-Härtung** (SECURITY: Grössenlimit, Feld-Whitelist, Längen-Caps, Anzahl-Cap) | Backup ist **verschlüsselt** + Magic-Bytes + Typ-Guard + try/catch; **keine** Feld-Whitelist/Längen-Caps/Obergrenze | 🟡 Defense-in-Depth (Verschlüsselung entschärft); Whitelist + Caps beim Restore nachziehen |
| **innerHTML → createElement/textContent + CSP** (SECURITY) | ✅ reine `React.createElement`-App, kein `dangerouslySetInnerHTML`, nur QR-Container-Clears + Vendor-Lib; strikte CSP | ✅ deckt sich, keine Aktion |
| **LocalStorage unverschlüsselt** (SECURITY) | bekannt | = die vertagte Tresor-Lock-Phase, schon getrackt |
| **WCAG 2.2: reale Screenreader/Zoom/Reflow-Tests offen** (WCAG) | gleiche offene Front wie die App-eigenen a11y-Audits | = bestehende a11y-Grenze, nichts Neues |

**Netto neu für die App:** DSFA-Lücke · per-Modul-Freigabe-Register · Backup-Restore-Härtung.
Alles kein Bug, alles „vor Produktivstart / Defense-in-Depth". → als TODO-Einträge festgehalten.

## Schicht C · Strategie-Abwägung (Grundsatz)

Die zentrale Frage: **soll Maloja die kommerzielle B2B2C-Partner-Plattform-Richtung einschlagen?**

**Die Spannung ist real und geht an den Kern:**
- Malojas Identität + Vertrauens-Fundament = **local-first, kostenlos, keine Daten verkaufen,
  kein Tracking, keine stillen Datenabflüsse** (CLAUDE.md, Trust-Layer, Onboarding-Versprechen).
- Ein Partner-Portal + **Maloja-Index (Partner-Scoring)** + Metering + Operator-Portal führt
  Partner-Interessen, Datenflüsse zu Dritten (Versicherer/Arbeitgeber) und ein kommerzielles
  Anreiz-System ein. Genau das, wovor die Trust-Layer heute schützt.
- Risiko: der B2B2C-Weg kann das eine untergraben, was Maloja wertvoll macht — dass Menschen
  ihm ihre sensibelsten Daten anvertrauen, *weil* niemand mitverdient.

**Empfehlung (nicht Entscheid — der liegt bei Stebler Studios):**
1. **Produkt bleibt local-first & kostenlos.** Die Herzensempfehlungen bleiben **kuratiert &
   nicht-kommerziell** (kein Pay-for-Placement, kein Index, der Partner rankt).
2. Falls Tragfähigkeit nötig: Modelle prüfen, die das Versprechen **nicht** brechen — Stiftungs-/
   B-Corp-Finanzierung, Spenden, oder bezahltes **B2B-Tooling für NGOs/Gemeinden**, das die
   *Nutzerdaten nie berührt* (die Menschen bleiben local-first).
3. Partner-Portal / Operator-Portal / Maloja-Index = **bewusster, getrennter Strategie-Strang**
   bei Stebler Studios — nicht ins Produkt falten, nicht still starten. Wenn je, dann mit DSFA,
   Re-Identifikations-Schwellen und getrennten, widerrufbaren Einwilligungen (FACH-RECHT-Punkte 6/7).

⚠️ **Wahrheits-Disziplin:** der „Maloja-Index" und „verifizierter Nachweis" müssten, falls je
gebaut, jede Bewertung belegen — sonst ist es ein Gütesiegel ohne Substanz (Haftung + Vertrauen).

## Governance

Nichts hiervon wird gebaut ohne ausdrückliche Freigabe. Schicht A (Audit-TODOs) läuft als normale
gescopte Änderungen. Schicht B wandert zu Stebler Studios. Schicht C ist ein Strategie-Entscheid,
kein Produkt-Schritt — und kollidiert bewusst mit dem Kern-Ethos, darum explizit und getrennt.
