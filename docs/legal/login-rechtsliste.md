# Login-Rechtsliste — was ein Konto rechtlich auslöst

> **Stand: 09.11.2026**, `main` = `dff64ec7`. Angelegt auf Anfrage von Stebler Studios.
> **Status: Prüfliste, kein Entscheid.** Es gibt kein Konto und keinen Code dafür. Der Bauplan
> [`SECURITY_PHASE_1_PLAN.md`](../context/SECURITY_PHASE_1_PLAN.md) steht seit Juli 2026 als «Entwurf» da
> (Passkey mit PRF, Ende-zu-Ende verschlüsseltes Backup, ein Gerät).
> **Keine Rechtsauskunft.** Eine Einordnung, damit die Fragen an die Jurist:in vor dem Bau gestellt werden
> und nicht danach. Die offenen Fragen (L1–L6) gehören ins Dossier zu [`k48-fragen-juristin.md`](k48-fragen-juristin.md).

## Die Regel, aus der alles folgt

Die DSFA sagt es selbst ([`dsfa-kurzfassung.md`](dsfa-kurzfassung.md) Z. 52): Benutzerkonten oder Logins
lösen eine neue Prüfung aus, **vor** der Änderung, nicht danach. Diese Liste ist die Vorarbeit dazu.

## Heute (ohne Konto) — Befund

- **Keine Cookies.** Datenschutzerklärung §11; CSP `connect-src 'self'`; kein Netzaufruf in `src/`.
  Gespeichert wird nur im Browser (localStorage, IndexedDB).
- **Kein Cookie-Banner nötig.** Das Schweizer Recht verlangt für lokales Speichern kein Opt-in, sondern Information.
- **Eine Lücke, nur in der Doku-Fassung geprüft:** Art. 45c FMG verlangt neben der Information über das
  Speichern auf dem Gerät auch den Hinweis, dass man es **ablehnen** kann. Die Datenschutzerklärung erklärt in
  §7.2 (Z. 128), wie man die Browserdaten löscht. Einen ausdrücklichen Satz «Sie können das Speichern ablehnen»
  gibt es dort nicht (`rg -i "ablehn"` → 0 Treffer, 09.11.2026). Die Fassung in der App (`legal.privacy.*`) habe ich
  nicht geprüft. → Frage L1.

## Was ein Login ändert

| # | Thema | Was sich ändert | Woran es hängt |
|---|---|---|---|
| 1 | **Vier Texte werden falsch** | Datenschutzerklärung (Z. 32–33), Nutzungsbedingungen (Z. 25), DSFA (Z. 17), Bearbeitungsverzeichnis sagen «kein Konto, kein Backend» | im selben Zweig wie das Konto nachführen |
| 2 | **Verantwortliche für Kontodaten** | Konto-ID, öffentlicher Passkey-Schlüssel, Zeitstempel, Server-Logs (IP) liegen bei uns. Damit gelten Auskunft und Löschung (Art. 25 ff. nDSG) und die Meldung von Datenpannen an den EDÖB (Art. 24 nDSG) | `DELETE /account` ist im Bauplan vorgesehen; Pannen-Ablauf fehlt |
| 3 | **Auftragsbearbeitung** | Der Hoster bearbeitet dann Personendaten für uns: Vertrag nötig (Art. 9 nDSG) | Infomaniak-Vertrag prüfen, Server in der Schweiz halten (kein Auslandtransfer) |
| 4 | **Besonders schützenswerte Daten** | Gesundheit, Sozialhilfe (Art. 5 lit. c nDSG). Auch als Chiffrat wohl Personendaten | → Frage L2 |
| 5 | **Login-Cookie** | Ein Sitzungs-Cookie ist technisch nötig: kein Opt-in, auch nicht nach EU-Recht. Es muss in die Datenschutzerklärung (§11 wird falsch). Kein Banner, solange nichts getrackt wird | §11 umschreiben, Art. 45c FMG mitdenken |
| 6 | **Datenverlust** | Passkey und Wiederherstellungs-Codes verloren = Backup unwiederbringlich. Muss klar in die Nutzungsbedingungen | → Frage L3 |
| 7 | **Technik mit Rechtsfolge** | CSP `connect-src` öffnen für die eigene API; Datensicherheit (Art. 8 nDSG); Sicherheitsprüfung vor dem Livegang (im Bauplan vorgesehen) | Security-Review-Gate |

## Fragen an die Jurist:in

- **L1** — Reicht der Lösch-Weg in §7.2 als «Hinweis auf die Ablehnung» nach Art. 45c FMG, oder braucht es einen eigenen Satz? *Hängt daran:* ein Satz in Datenschutzerklärung und App, heute schon.
- **L2** — Wie weit entlastet uns die Ende-zu-Ende-Verschlüsselung, wenn wir nur Chiffrat halten? Gelten die Pflichten für besonders schützenswerte Daten trotzdem? *Hängt daran:* Umfang der neuen DSFA.
- **L3** — Wie muss der Hinweis auf unwiederbringlichen Datenverlust formuliert und platziert sein, damit er hält (Haftungsausschluss)? *Hängt daran:* Nutzungsbedingungen und Text beim Einrichten.
- **L4** — Was muss der Vertrag mit Infomaniak als Auftragsbearbeiter enthalten, und reicht ihr Standardvertrag? *Hängt daran:* Wahl des Backend-Hostings.
- **L5** — Ändert sich die EU-Frage («nur Schweiz oder EU», Querschnittsfrage in K48), sobald es Konten gibt und fr/it/en frei sind? *Hängt daran:* ob DSGVO-Pflichten dazukommen.
- **L6** — Braucht es ein Mindestalter oder eine Regel für Minderjährige beim Konto? *Hängt daran:* Text und Ablauf beim Einrichten.

## Nächster Schritt

L1–L6 ins gebündelte Dossier zu K48 übernehmen. Gebaut wird erst, wenn die Antworten da sind und Stebler Studios das Konto ausdrücklich freigibt.
