# Security Architecture — Login, API, Verschlüsselung

> **Status: ENTWURF.** Zur gemeinsamen Prüfung mit Stebler Studios. Beschreibt das *Zielbild*
> für den Tag, an dem Maloja ein optionales Konto/Backend bekommt. Es wird nichts
> davon gebaut, bevor die offenen Entscheidungen (Abschnitt 9) getroffen sind.
> Heute ist die App local-first ohne Backend — dieses Dokument ist der Plan, damit
> Authentifizierung, Autorisierung und Verschlüsselung von Tag 1 richtig sind.

Leitsatz: **Der Server soll die Daten der Nutzenden nicht lesen können.** Sicherheit
entsteht aus der Architektur, nicht aus Versprechen. „Richtig machen" heisst hier:
Zero-Knowledge, Least Privilege, kein Lock-in, und die local-first-Freiheit bleibt.

---

## 1. Grundprinzipien

1. **Local-first bleibt Standard.** Ein Konto ist *opt-in*. Ohne Login funktioniert
   alles wie heute (localStorage/IndexedDB). Niemand wird zu einem Konto gezwungen.
2. **Zero-Knowledge / Ende-zu-Ende.** Sobald synchronisiert wird, verlassen Daten das
   Gerät nur als Chiffrat. Der Schlüssel entsteht aus dem Geheimnis der Nutzerin und
   liegt nie im Klartext auf dem Server.
3. **Least Privilege.** Jede Komponente (Client, API, DB, Drittdienst) bekommt nur die
   minimal nötigen Rechte. Deny-by-default überall.
4. **Keine Geheimnisse im Client.** Der Browser-Code enthält nie Secret Keys (siehe
   bestehende Regel: nur Env-Variablen serverseitig).
5. **Schweizer Recht zuerst.** revDSG (revidiertes DSG, seit 2023) und wo relevant
   DSGVO. Datenminimierung, Auskunft, Löschung, Portabilität als Grundrechte.
6. **Auditierbar.** Sicherheitsrelevante Ereignisse werden protokolliert — aber **nie
   im Klartext PII/Passwörter/Token**.

---

## 2. Threat-Model

**Schutzgüter (sehr sensibel):** Gesundheitsdaten, Finanzen, Sozialsituation,
Ausweisdokumente, Notfallinfos. Ein Leak trifft potenziell verletzliche Menschen.

**Angreifer und Grenzen (Trust Boundaries):**

| Angreifer | Szenario | Primäre Abwehr |
|---|---|---|
| Gerätedieb / Mitbenutzer | greift auf entsperrten Browser / Profil zu | Konto-Sperre + verschlüsselter lokaler Cache (Abschnitt 6) |
| Netzwerk-Angreifer (MITM) | liest Verkehr im offenen WLAN | HTTPS/HSTS + E2E (nur Chiffrat unterwegs) |
| **Kompromittierter/neugieriger Server** | Betreiber, DB-Dump, Backup-Leak | **Zero-Knowledge — Server hat nur Chiffrat, kein Schlüssel** |
| Anderer eingeloggter Nutzer | ruft `/api/records/43` statt `/42` auf (IDOR) | Serverseitige Eigentümer-Prüfung auf *jedem* Endpoint (Abschnitt 4) |
| Phishing | lockt Login-Daten heraus | Passkeys/WebAuthn (phishing-resistent), kein Passwort zum Stehlen |
| XSS im Client | fremdes Script liest Token/Daten | strikte CSP (bereits aktiv), keine unsicheren HTML-Sinks, Token in httpOnly-Cookies |
| Supply-Chain | manipulierte Abhängigkeit | no-deps-Ethos, vendored Libs per SHA-256 gepinnt ([VENDOR.md](../../VENDOR.md)) |

**Explizit ausserhalb des Scope (vorerst):** staatlicher Zwang gegen die einzelne
Nutzerin auf ihrem eigenen entsperrten Gerät; kompromittierte Client-Hardware.

---

## 3. Authentifizierung (wer bist du?)

- **Primär: Passkeys / WebAuthn.** Phishing-resistent, kein Passwort, kein
  wiederverwendbares Geheimnis. Bestes Verhältnis von Sicherheit und ruhiger UX.
- **Schweiz-Option: SwissID** (SwissSign) als alternativer Identitätsanbieter für die
  App — der realistische CH-Identitäts-Weg für eine private Consumer-App.
- **AGOV / CH-LOGIN (eIAM):** staatliche Logins für *Behörden*-Dienste, nicht ohne
  Weiteres als IdP für eine Consumer-App nutzbar. Relevant erst im **B2B-/Gemeinde-/
  Behörden-Kontext** (Asyl-/Beratungsstellen-Vision, [[project_asylum_direction]]) —
  dort als Zugangsweg vormerken, nicht als Consumer-Login.
- **Fallback: Passwort + zweiter Faktor (TOTP/Passkey).** Nur wenn nötig, mit:
  - Argon2id-Hash (nie Klartext, nie MD5/SHA-1),
  - Abgleich gegen bekannte geleakte Passwörter (k-anonymity/HaveIBeenPwned oder lokale Liste),
  - Länge vor Sonderzeichen-Zwang.
- **Sessions:**
  - kurzer Access-Token (15–30 Min) + Refresh-Token (7–30 Tage),
  - Speicherung ausschliesslich in `httpOnly; Secure; SameSite`-Cookies — **nie** in
    localStorage (dort läse jedes Script sie),
  - neue Session-ID nach jedem Login (gegen Session-Fixation),
  - Logout invalidiert serverseitig, nicht nur im Browser,
  - „Überall abmelden" + Invalidierung aller Sessions bei Passwort-/Schlüsselwechsel.
- **Missbrauchsschutz:** Rate-Limit auf Login/Signup/Reset (z. B. 5–10/Min/IP),
  Konto-Sperre nach zu vielen Fehlversuchen + Benachrichtigung, **einheitliche
  Fehlermeldung** („E-Mail oder Passwort falsch") gegen Account-Enumeration.
- **Passwort-Reset:** einmalig verwendbarer, zeitlich begrenzter Token; verrät nie, ob
  ein Konto existiert; invalidiert danach andere Sessions. *(Achtung Wechselwirkung mit
  E2E — siehe Abschnitt 5: Reset des Login-Passworts ≠ Reset des Verschlüsselungs-Schlüssels.)*

---

## 4. Autorisierung (was darfst du?) — das Zuhause von „Item 4"

Das ist genau die 42→43-Frage. Regeln:

1. **Eigentümer-Prüfung auf JEDEM Endpoint.** Vor jedem Lesen/Ändern/Löschen prüft der
   Server: gehört diese Ressource der eingeloggten Person? Wenn nein → `403`. „Ist
   eingeloggt" allein genügt nie.
2. **Deny-by-default.** Eine zentrale Middleware erzwingt Authentifizierung *und* eine
   ressourcenspezifische Berechtigungsfunktion. Kein Endpoint ohne beides.
3. **Nicht erratbare IDs.** UUIDs statt fortlaufender Zahlen — kein Durchzählen möglich.
4. **Rollen serverseitig.** Admin-Aktionen prüfen die Rolle in der DB, nie „Button im
   Frontend versteckt = geschützt".
5. **Row-Level Security** auf DB-Ebene (MariaDB/Postgres) als zweite Verteidigungslinie.
6. **Unautorisierte Zugriffe werden geloggt** (für Monitoring/Alerts).

Bei Zero-Knowledge ist die Angriffsfläche kleiner (der Server sieht ohnehin nur
Chiffrat), aber Autorisierung bleibt Pflicht: niemand darf fremde Chiffrat-Blobs
abrufen, überschreiben oder löschen.

---

## 5. Verschlüsselung / Zero-Knowledge — Zuhause von „Item 1"

**Kernidee:** Daten werden **im Browser** ver-/entschlüsselt. Der Server speichert nur
Chiffrat. Der Schlüssel wird aus dem Geheimnis der Nutzerin abgeleitet (Passphrase via
Argon2id, oder aus dem Passkey-Material) und verlässt das Gerät nie.

- **Transport:** immer HTTPS + HSTS, unabhängig von E2E.
- **Server-at-rest:** zusätzlich DB-/Blob-Verschlüsselung als Defense-in-Depth (auch
  wenn der Inhalt schon E2E-chiffriert ist).
- **Lokaler Cache:** sobald ein Konto existiert, kann der lokale Cache mit demselben
  Session-Schlüssel verschlüsselt werden — löst „Item 1a" (heute Klartext) mit.

**Die harte Frage — Recovery.** Zero-Knowledge heisst: verliert die Nutzerin ihr
Geheimnis, sind die Daten weg — auch wir können nicht helfen. Das ist für eine
verletzliche Zielgruppe heikel. Deshalb ist der Recovery-Mechanismus die wichtigste
gemeinsame Entscheidung (Abschnitt 9). Optionen:
  - **Recovery-Codes:** beim Setup generierte Codes; die Nutzerin verwahrt sie
    (Papier/Tresor). Kein Server-Zugriff, aber bei Verlust weg.
  - **Optionale Schlüssel-Hinterlegung (Escrow):** bewusst gewählte Vertrauensperson /
    digitaler Nachlass ([[project_digital_legacy]]) hält einen Wiederherstellungs-Schlüssel.
  - **Kompromiss:** Login-Passwort (Server-seitig zurücksetzbar) getrennt vom
    Verschlüsselungs-Schlüssel (nur per Recovery-Code wiederherstellbar) — Nutzerin
    versteht: „Zugang zum Konto" ≠ „Zugang zu den Daten".

Merksatz: **Das Zurücksetzen des Login-Passworts stellt niemals die Daten wieder her.**
Das muss die UX ruhig und ehrlich kommunizieren, ohne Angst zu machen.

---

## 6. API-Härtung (Checkliste für den Bau)

- **CORS** streng auf die eigene Domain (nie `*`), nur nötige Methoden.
- **CSP** bleibt streng (heute schon `connect-src 'self'` etc.) — beim Backend
  `connect-src` gezielt um die eigene API-Domain erweitern, sonst nichts.
- **Serverseitige Validierung** jedes Feldes (Typ, Länge, Bereich, Enum, Array-Limit) —
  Frontend-Validierung ist nur UX, nie Sicherheit.
- **Security-Header:** HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`.
- **Keine internen Details in Fehlern** (keine Stacktraces/DB-Struktur an den Client).
- **Rate-Limiting** auf teure/sensible Endpoints (Login, Reset, Sync, Export).
- **Audit-Log** für Auth-Ereignisse — mit Redaction, nie PII/Token/Passwort im Klartext.
- **Monitoring/Alerts** für Anomalien (viele Fehl-Logins, Massenzugriffe, 401/403-Spitzen).
- **Abhängigkeiten** minimal und geprüft (no-deps-Ethos, [VENDOR.md](../../VENDOR.md),
  Advisory-Check vor jedem Release).

---

## 7. Migrationspfad local-first → optionales Konto

1. Heute: alles lokal, kein Konto.
2. Opt-in-Konto: Nutzerin wählt bewusst Sync. Beim Setup entsteht der E2E-Schlüssel +
   Recovery-Mechanismus. Bestehende lokale Daten werden client-seitig verschlüsselt
   hochgeladen.
3. Rechte: Auskunft (Export aller eigenen Daten) und Löschung („Konto + alle Daten
   wirklich löschen") von Anfang an — revDSG/DSGVO.
4. Kein Zwang, kein Downgrade: Konto kündbar, Daten bleiben lokal nutzbar.

---

## 8. Was heute schon stimmt (nicht anfassen)

- Kein Backend, keine Netzwerkaufrufe → ganze Klassen von Lücken existieren nicht.
- Strikte CSP (self-only) inkl. `object-src 'none'`, `frame-ancestors 'none'`.
- Keine hardcodierten Secrets im Client.
- Print/Export-Templates escapen Nutzereingaben ([helpers.js](../../src/utils/helpers.js) `escapeHtml`).
- Vendored Libs per SHA-256 gepinnt.

---

## 9. Entscheidungen (Stand 2026-07-07, Session #28)

**Getroffen (gemeinsam mit Stebler Studios):**

1. **Auth-Priorität — ENTSCHIEDEN:** Passkeys/WebAuthn primär, **SwissID als
   gleichwertige Option**, Passwort+2FA nur als Fallback für Geräte ohne Passkey.
   Google/Apple bleiben ausgeschlossen.
4. **Hosting/Stack — ENTSCHIEDEN:** Infomaniak MariaDB (bereits angelegt, siehe
   [[project_backend_accounts_direction]]) + schlanke Node-API (Fastify/Express) +
   Prisma. DB hält nur verschlüsselte Blobs + Referenzen. *Anmerkung:* die
   Eigentümer-Prüfung (Abschnitt 4) läuft auf App-Ebene, unabhängig von der DB — MariaDB
   ist damit unkritisch (Postgres-RLS wäre ein Nice-to-have, kein Muss).
5. **Umfang v1 + Bau-Prozess — ENTSCHIEDEN:** phasiert **1 → 2 → 3**, jede Phase in
   *eigener Session* mit *eigenem Security-Review als Freigabe-Tor*. Keine Phase geht
   live ohne bestandenen Review.

2.+3. **Recovery-Modell + Server-Vertrauen — ENTSCHIEDEN 2026-07-07 (Gate 0 für jetzt):**
   **Echtes Zero-Knowledge** (Server nie lesefähig) mit **Recovery-Codes** als
   Wiederherstellungs-Weg. **Stufe 3 (server-gestützte Recovery) vertagt** — vielleicht
   für immer. Das menschliche Netz (optionale Vertrauensperson-Hinterlegung) kommt mit
   **Phase 3**; v1 startet mit Recovery-Codes allein, ehrlich beschriftet.
   *Warum das für v1 genügt und sicher ist:* Phase 1 ist nur ein verschlüsseltes
   **Backup** — die Originaldaten bleiben lokal auf dem Gerät (wie heute). Verlorene
   Codes in v1 bedeuten „dieses Backup nicht wiederherstellbar", nicht „Daten weg". Das
   harte Recovery-Problem beisst erst, wenn das Backup zur einzigen Kopie wird
   (Phase 2/3) — dann greift die Vertrauensperson aus Phase 3.

## 10. Bau-Phasen mit Review-Gates

> Reihenfolge bestätigt. Jede Phase: eigene Session → bauen → Security-Review → erst bei
> „clean" live. Bis Phase 1 startet, bleibt Maloja unverändert local-first.

- **Gate 0 (Design, vor Phase 1) — ERLEDIGT 2026-07-07:** Zero-Knowledge +
  Recovery-Codes; Stufe 3 (server-gestützt) vertagt; Vertrauensperson erst in Phase 3.
  Krypto-Design für Phase 1 damit freigeschaltet.
- **Phase 1 — verschlüsseltes Backup eines Geräts:** Konto (Passkeys/SwissID) +
  E2E-verschlüsseltes Backup/Restore für EIN Gerät. Kleinste Angriffsfläche.
  → Security-Review-Gate.
- **Phase 2 — Mehrgeräte-Sync:** Schlüssel-Handling über mehrere Geräte,
  Konfliktlösung. → Security-Review-Gate.
- **Phase 3 — Freigabe & digitaler Nachlass:** Vertrauensperson-Freigabe,
  Recovery-Escrow, [[project_digital_legacy]]. → Security-Review-Gate.
