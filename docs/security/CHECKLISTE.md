# Sicherheits-Checkliste — Maloja Plana

Angepasste Fassung des „Security Prompt Pack" (14 Punkte, ursprünglich für Backend-Apps
mit Konten und Datenbank). Maloja Plana ist **local-first, frontend-only, ohne Konten,
ohne Server, ohne Dependencies, CSP self-only**. Darum gilt ein grosser Teil des Packs
heute nicht — und wird erst relevant, wenn ein Backend (`maloja-server`) mit Konten kommt.

Diese Datei ordnet jeden der 14 Punkte ehrlich ein: **greift heute** / **Stärke** /
**erst mit Backend**. Vor jedem grösseren Feature den relevanten Abschnitt durchgehen.

Legende: ✅ erfüllt · 🟡 teils / beobachten · ⬜ offen · ➖ nicht anwendbar (heute) ·
🔒 wird scharf, sobald Konten/Sync kommen

---

## Greift heute am ausgelieferten Frontend

### 6 · Injection / XSS
Einzige echte Angriffsfläche im Frontend. `React.createElement` schützt by default
(kein JSX-`dangerouslySetInnerHTML` im Code). Kritisch sind die **HTML-Generatoren**
(Print/Export), die Nutzerdaten in HTML-Strings interpolieren.
- ✅ `dangerouslySetInnerHTML` / `eval` / `new Function` — kommen nicht vor.
- ✅ Zentrale `escapeHtml()` in `src/utils/helpers.js`; lokale `esc()` in
  `briefGenerator.js`, `dossierGenerator.js`, `flyerGenerator.js`, `icsExport.js`.
- ✅ `cvGenerator.js` — Nutzerfelder escaped (Fix 2026-07-08, Regressions-Test
  `src/__tests__/cvGenerator.test.js`).
- **Regel für neue Generatoren:** jede `${nutzerfeld}`-Interpolation in einen HTML-String
  läuft durch `escapeHtml()` / `esc()`. Labels aus `t()` sind vertrauenswürdig.

### 2 · Secrets / API-Keys
- ✅ Kein Backend-Key im Frontend nötig. Open-Core-Split auditiert (kein Leak).
- **Regel:** niemals Secrets ins öffentliche Repo; `.env` bleibt gitignored.

### 5 · Fehler-Leaks
- 🟡 ErrorBoundary vorhanden. Keine sensiblen `console.log` mit Personendaten einbauen.

### 9 · HTTPS & Transport-Security
- ✅ CSP self-only in `index.html`; `frame-ancestors 'none'` = Clickjacking-Schutz.
- ✅ Referrer-Policy `strict-origin-when-cross-origin` (Meta-Tag).
- ⬜ HSTS / `X-Content-Type-Options: nosniff` / `Permissions-Policy` — nur als echte
  HTTP-Header wirksam, im Infomaniak-Panel zu setzen (kein `.htaccess`). Siehe SECURITY.md.

---

## Stärke — bei uns kein Risiko, sondern Verkaufsargument

### 10 · Datenschutz / PII
Maloja ist ein Lebensordner voller sensibler Daten. Die Antwort ist nicht „verschlüsselt
at rest", sondern: **die Daten verlassen das Gerät nie.** Local-first = kein Serverabfluss.
- ✅ localStorage `or5_` + IndexedDB, lokal. Backups AES-256-GCM.
- ✅ Datensparsamkeit gelebt (z. B. JSON-Resume bewusst ohne Geburtsdatum/Zivilstand).

### 12 · Dependencies
- ✅ **NO deps.** Stärkste mögliche Antwort auf „vulnerable dependencies".
  Vendored Libs (z. B. `qrcodejs`) in `VENDOR.md` dokumentiert.

---

## Nicht anwendbar heute (kein Server / kein Multi-User)

- ➖ **1 Frontend- vs. Backend-Validierung** — kein Backend. Eingabe-Robustheit bleibt
  trotzdem UX-Thema (tolerante, inline-validierte Formulare).
- ➖ **3 Auth / Session** — keine Konten.
- ➖ **4 Authorization / IDOR** — es gibt keine fremden Nutzerdaten. Alles lokal.
- ➖ **6 SQL-Injection** — keine Datenbank.
- ➖ **8 Rate-Limiting** — kein Server-Endpoint.
- ➖ **11 CORS / Debug-Mode / Prod-Config** — kein Server. (Vite-Build ist Prod.)
- ➖ **13 Logging / Monitoring** — kein Server; lokal wäre es sogar ein Datenschutz-Risiko.

---

## 🔒 Wird scharf, sobald `maloja-server` (Konten / Sync) kommt

Der Braindump hat den wichtigsten Punkt richtig erkannt: **Authentication ≠ Authorization.**
SwissID-Login zu haben heisst *nicht*, dass geprüft wird, ob *dieser* Nutzer *diese* Zeile
sehen darf. Das ist die Design-Frage Nr. 1 — **von Anfang an einbauen, nicht nachträglich.**

Sobald ein Backend existiert, gelten **alle 14 Punkte** voll, besonders:
- **4 Authorization / IDOR** — jede Zeile an die Besitzer-UUID binden; `order/42→43` muss
  „kein Zugriff" liefern, nicht fremde Daten. Nicht-erratbare IDs (UUID).
- **3 Session** — Token-Ablauf, httpOnly/secure/sameSite-Cookies, echtes Server-Logout,
  Reset-Links single-use + zeitlich begrenzt (30 min).
- **1 Backend-Validierung** — jede Eingabe serverseitig prüfen, nicht nur im Browser.
- **8 Rate-Limiting** — Login/Reset gegen Brute-Force.
- **13 Logging** — sicherheitsrelevante Events, ohne PII in Logs.
- Bei E2E-verschlüsseltem Opt-in-Sync: Zugriffskontrolle + Schlüsselverwaltung sauber trennen.

Genau deshalb ist die Backend-Richtung ein **Grundsatzentscheid, nicht einfach bauen**.

---

## Master-Prompt (Punkt 14) — nach jedem Feature

> Ich habe gerade [Feature] gebaut. Prüfe **nur** den neuen Code, angepasst an local-first
> ohne Backend: (1) Baut das Feature HTML-Strings aus Nutzerdaten (Print/Export/Generator)?
> Dann muss jede Interpolation durch `escapeHtml()`/`esc()`. (2) `dangerouslySetInnerHTML`
> oder `.innerHTML` mit Nutzertext? (3) Schreibt es versehentlich PII in `console.log`?
> (4) Neue externe Ressource, die die CSP self-only bräche? (5) Neue Dependency (soll NICHT
> passieren)? Wenn ein Backend berührt wird: zusätzlich Authorization/IDOR, Session,
> Backend-Validierung, Rate-Limiting.

Quelle: „The Security Prompt Pack" (teknical.ai), sinngemäss übernommen und an die
Architektur von Maloja Plana angepasst.
