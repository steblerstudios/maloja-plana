# SESSION START — zuerst lesen

> Die **objektive, repo-interne Wahrheit** über den aktuellen Stand. Am Sitzungs-Ende
> aktualisieren (via `/session-close`). Bei Widerspruch zu anderen Docs gilt
> **diese** Datei. Persönliche Session-Historie/Ideen → Claude-Memory, nicht hierher.
>
> Boot: `npm run dev` (Port 5174, via `.claude/launch.json`). Deploy: `bash deploy.sh`
> von `main` (nur Sophie). Verifizieren live: Footer-Version + Bundle-Hash greppen.

**Stand:** 2026-07-11

## Wo stehen wir gerade

| | |
|---|---|
| Aktueller Branch | `main` |
| `main` steht auf | `717a389` — Merge PR #35 (a11y-contrast-sweep); Runde 2026-07-11 komplett |
| Version (package.json) | `0.1.24-beta` (kein Bump für die Runde — offen, s.u.) |
| Letzter Tag | `v0.1.24-beta` |
| **Live** | `index-d1dacdf3.js` — byte-genau = main-Build, verifiziert 2026-07-11 |

**Runde 2026-07-11 GEMERGT + LIVE** (PR #23–#35, alle Feature-Branches gelöscht). Was live ging: PWA-Cache an Bundle-Hash + Home-Screen-Name „Maloja Plana" + iOS-Icon (#23); Beta-Code als SHA-256 (#24); ruhige Wartungsseite (#25); a11y rose→roseDeep (#26), Haushalt role=group (#27), Führerausweis-Ablauf ch.ch/ASTRA 5 Spr. (#28), soft→#64676E (#29); Deploy-Gate-Doku (#30); Session-Close-/Backlog-Doku (#31/#32); **blick-situationen** ehrlicher Speicher-Satz + 44px-Chips + Panel-Scroll (#33); **Feedback-Mail** vorbefüllt (Version/Ansicht/Sprache) + Bugfix-Ablauf-Doku (#34); **a11y-Kontrast-Sweep** goldDeep/roseDeep/onSand/sageBtn/roseBtn + theme-abhängiger Fokusring `--mp-focus` (#35). ⚠️ `feat/fuehrerausweis` rm = Best-Effort → Gegenlese.

## Verifikations-Status (das Wichtigste)

> Feature-für-Feature-Detail (built/deployed/verified-live): [`FEATURES.md`](FEATURES.md).


- **Live-verifiziert (2026-07-11):** App-Bundle `index-d1dacdf3.js` ist byte-genau
  live — curl auf malojaplana.ch == frischer main-Build (717a389); Vite-Content-Hash
  identisch. Auch live bestätigt: SW-Cache heisst jetzt `maloja-plana-d1dacdf3` (kein
  statisches `v9` mehr → self-invalidierend an den Bundle-Hash gekoppelt), Manifest
  `short_name` = „Maloja Plana". Die ganze Runde 2026-07-11 ist damit `verified-live`.
- **PWA-Namen/Icon-Falle (gelöst):** der alte `v9`-Service-Worker hatte eine veraltete
  `index.html` gecacht und lieferte sie weiter → iOS las beim „Zum Startbildschirm"
  den langen Titel + kein Icon. Jetzt behoben (bundle-hash-SW + skipWaiting/clients.claim
  live). ⚠️ Auf schon-installierten Geräten hält iOS Name/Icon fest: **altes Home-Screen-
  Icon löschen + neu hinzufügen** (ggf. Safari-Website-Daten für malojaplana.ch leeren).
- **GitHub Flow ist scharf:** `main` = einziger Stamm, kein `dev`, kein Sync-back.
  Ablauf `feat/…` → `deploy.sh --stage` → PR→main → `deploy.sh`; Qualitäts-Ring je
  Schicht (`DEV_WORKFLOW.md`). Deploy-Gate-Hook (Marke `.maloja/predeploy-ok`) ist live
  im Einsatz — dieser Deploy lief korrekt durch ihn. `/session-close` schliesst ab.

## Nächste Schritte

1. **PWA-Handy-Test (Sophie, am Gerät):** altes Maloja-Home-Screen-Icon löschen → Seite
   neu laden → neu „Zum Startbildschirm" → prüfen, dass „Maloja Plana" + M-Icon erscheinen.
2. **Version-Bump nachholen:** die Runde ging ohne `package.json`-Bump live (steht noch
   `0.1.24-beta`). Beim nächsten Release-Schritt nachziehen (Schema `0.1.x-beta`) + Tag.
3. **Offene ⚠️ (nicht-blockierend, aus dem Deploy-Gate):** sage-als-Text → sageDeep;
   Label-`htmlFor`-Kopplung; 36px-Touch-Ziele → 44; behoerdendossier-Fehlverweis;
   Begriff „Dokumenten-Tresor" vereinheitlichen; FR/IT-Maskulinum; wartung.html-Feinschliff
   (FR/IT/EN + lang-Attribute + Tokens/Fonts); optional 180×180 apple-touch-icon ohne
   eingebackene Rundung. rm-Gegenlese (Führerausweis + fr/it/rm generell).
4. Danach: TODOs/IDEEN (`docs/TODO.md`, `docs/IDEEN.md`) + Braindump-Queue.

## Nicht anfassen (Leitplanken)

> Gerettet aus dem archivierten `PROJECT_STATUS.md`/`PROJECT_HANDOFF.md`. Identität
> (Zero-Deps, Offline/Calm/Deterministic/Privacy) steht in `CLAUDE.md` — hier nur die
> konkreten Do-Not-Touch-Punkte.

- **localStorage-Keys `or5_*`** — keine Migrationen ohne ausdrückliche Freigabe (User-Daten).
- **Dependencies** — nur React + React-DOM als Runtime-Deps; kein Bloat.
- **Build-Budget** — Phase 1 < 200 KB gzip, Phase 2 < 250 KB gzip.
- **Build-Tool Vite** und **Inline-Styles/tokens.css** nicht wechseln (kein CSS-in-JS).
- **SKOS Grundbedarf** — pauschal nach Haushaltsgrösse ist *bewusste* Vereinfachung (KI-001), kein Refactoring.
- **PremiumSubsidy/IPV-Berechnung** — nicht anfassen.
- **Gross/Netto-Toggle** und **Multi-Person-Haushaltsmodell** — bewusst zurückgestellt.
- **KI-007:** kein Web-Crypto-Fallback — offen, niedrige Priorität.

## Merker (Fallen)

- Neue `<button>`/Titel IMMER `color` setzen (Dark-Mode-Falle).
- Bei i18n-Edits zügig committen.
- Parallel-Sitzung im selben Working Tree: eigenen Branch ab `main` nehmen (nicht nur
  eigene Dateien stagen — Datei-Isolation ≠ Branch-Isolation; teuer gelernt bei PR #19).
- Onboarding-Bypass zum Testen: `or5_onboarding_done` / `or5_lang` / `or5_tour_done` = true.
- PWA-Name/Icon: iOS liest sie beim „Zum Startbildschirm" einmalig aus der (evtl. per
  Service-Worker gecachten) Seite und aktualisiert sie nie von selbst → nach relevanten
  Deploys altes Icon löschen + neu hinzufügen. SW-Cache ist seit `#23` an den Bundle-Hash
  gekoppelt (self-invalidierend) — reine `public/`-only-Deploys ändern den Entry-Hash u.U. nicht.
