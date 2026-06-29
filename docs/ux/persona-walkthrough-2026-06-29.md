# Persona-Walkthrough — 2026-06-29

**Qualitativer** Journey-Test: die 8 etablierten Personas (siehe
`docs/archive/research-2026-05/real-life-test-cases.md`) durch die echten Abläufe
„laufen lassen" und Lücken finden. Ergänzt den **quantitativen** Test
`src/config/__tests__/personaMatrix.test.js` (1404 Personas durch die Rechenlogik —
Invarianten halten).

Methode: pro Persona das zentrale Lebensereignis durchgehen → ✅ deckt ab · ⚠ Lücke ·
🔗 fehlende Verbindung. Daraus die priorisierte Liste am Ende.

Aktueller Ablauf-Bestand: KVG-Wechsel, Zusatz kündigen, **Umzug**, **Unfall/Krankheit**,
**Neuer Job** (alle auf der Ablauf-Schale) + Loop-Closure Brief→Ablage. Verkettung
geprüft: Neuer Job → Unfall/Krankheit trägt.

---

## 1 · Junge:r Erwachsene:r (erste eigene Wohnung/Job)
- ✅ Erste Wohnung → **Umzug**-Ablauf. Erster Job → **Neuer Job**-Ablauf (Vertrag, BVG, Steuern, Probezeit).
- ⚠ **Krankenkasse zum ersten Mal** abschliessen fehlt als Ablauf (mit ~25 fällt man aus der Familiendeckung; Neuzuzüger müssen sich innert 3 Monaten versichern). Schon als Memo vorgemerkt ([[project_kk_first_time_enrollment]]).
- 🔗 Umzug- und Neuer-Job-Ablauf kennen einander nicht (junge Person macht oft beides gleichzeitig). Crosslink fehlt.

## 2 · Alleinerziehend
- ✅ IPV, Sozialhilfe-Orientierung, Steuern vorhanden.
- ⚠ **Alimente/Unterhalt** und **Kinderbetreuungskosten** als geführte Orientierung fehlen (bedingte/einklappbare Sektion war angedacht).
- ⚠ **Trennung/Scheidung** als Lebensereignis-Ablauf fehlt (im ABLAEUFE-Audit als 🔴-Lücke).

## 3 · Rentner:in
- ✅ AHV/BVG, EL-Berechtigung, Gesundheitskosten vorhanden.
- ⚠ **Pensionierung** als geführter Ablauf fehlt (Übergang: AHV anmelden, BVG-Bezug Rente/Kapital, EL prüfen, 3a beziehen) — eigenes grosses Lebensereignis.
- ⚠ Reduzierte digitale Vertrautheit → **einfache Sprache** (P8-Inkr.4 offen) wäre hier am wichtigsten.

## 4 · Selbständige:r
- ✅ **Unfall/Krankheit**-Ablauf adressiert korrekt den Sonderfall „unter 8 Std./selbständig → Unfall muss in der KK eingeschlossen sein".
- ⚠ **Selbständigkeit** als Ablauf fehlt (AHV-Anmeldung als Selbständige:r, freiwilliges KTG/BVG, Steuer-Akontozahlungen, Vorsorgelücken) — 🔴 im Audit.

## 5 · Arbeitslos
- ✅ ALV-Taggeld-Rechner, CV-Generator vorhanden.
- ⚠ **Stelle verloren / Arbeitslosigkeit** als Ablauf fehlt — mit der kritischsten Frist überhaupt: **beim RAV anmelden, bevor der erste Tag ohne Stelle beginnt**. Idealer FristButton-Kandidat.
- 🔗 Neuer-Job-Ablauf hat kein Gegenstück „Job verloren".

## 6 · Migrant:in / Aufenthaltsbewilligung
- ✅ Quellensteuer jetzt im **Neuer Job**-Ablauf erklärt. Asyl-Orientierung vorhanden.
- ⚠ **Bewilligungs-Fristen** (Verlängerung B/L) und **KK-Erst-Anmeldung** (siehe Persona 1) fehlen als Abläufe.
- ✅ Mehrsprachigkeit grundsätzlich da (5 Sprachen); RM in den neuen Abläufen noch DE-Fallback (TODO).

## 7 · Person mit Schulden
- ✅ Schulden-Manager, KVG-Schulden-Sperre-Hinweis vorhanden — solide.
- ⚠ **Betreibung erhalten — was tun?** als ruhige Orientierung fehlt (Rechtsvorschlag-Frist 10 Tage!).

## 8 · Familienhaushalt
- ✅ Haushalts-/Kinder-Logik, gemeinsame Dokumente vorhanden.
- ⚠ **Heirat** und **Kind bekommen** als Lebensereignis-Abläufe fehlen (Zivilstand, Namens-/Steuerwechsel; Geburtsmeldung, Familienzulagen, KK fürs Kind, Betreuung).

---

## Priorisierte Befunde (woraus wir bauen)

**Muster:** Die Rechenlogik ist sauber (quantitativer Test). Die Lücken sind fast
alle **fehlende Lebensereignis-Abläufe** — genau Playbook Kap. 5. Die Schale macht
jeden neuen Ablauf günstig.

1. **Stelle verloren / RAV** — kritische Frist (RAV-Anmeldung), klares Gegenstück zu „Neuer Job", hoher Nutzen. **Top-Kandidat.**
2. **KK zum ersten Mal** — trifft Persona 1 + 6 (jung, Zuzug, Asyl); on-mission. ([[project_kk_first_time_enrollment]])
3. **Pensionierung** — grosses Lebensereignis, viele Zusammenhänge.
4. **Trennung/Scheidung**, **Heirat**, **Kind**, **Selbständigkeit**, **Betreibung erhalten** — je als ruhige Orientierungs-Karte (ABLAEUFE-Audit 🔴).
5. **Querschnitt:** einfache Sprache (Persona 3) · RM-Übersetzungen der neuen Abläufe · Cross-Verlinkung Umzug↔Neuer Job · eigene Werkzeug-Gruppe „Lebensereignisse" für Auffindbarkeit.

Kein Ablauf erzeugt eine Sackgasse; die gebauten Abläufe verlinken sauber nach
aussen (Kalender/Tresor/KK/Steuern) und untereinander.
