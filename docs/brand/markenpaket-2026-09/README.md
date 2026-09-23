# Markenpaket 1.0 — Bildmarke «Weg durch die Berge» (23.09.2026)

Quelle: Markenpaket 1.0 von Stebler Studios (lokal erstellt 23.09.2026, bestätigtes Logo-Konzept V3).
Die Bildmarke ist eine Vektor-Adaption, keine pixelgenaue Nachzeichnung.

Was davon in `public/` liegt:

| Datei | Herkunft |
|---|---|
| `public/favicon.svg` | Paket `logo/favicon.svg`, 1:1 (vereinfachte Fassung für 16/32 px) |
| `public/app-icon.svg` | Paket `logo/app-icon.svg`, 1:1 (abgerundet, Fläche `#2B2A26`) |
| `public/icon-192.png`, `icon-512.png` | aus `app-icon.svg` gerendert (`sips`) — Manifest `purpose: any` |
| `public/icon-maskable-*.png`, `apple-touch-icon.png` | aus `icon-maskable.svg` hier gerendert: randlos, Zeichen in der 80-%-Schutzzone |
| `public/og-image.svg` | Paket `anwendungen/social-preview-1200x630.svg`, 1:1 (Schrift in Pfaden, kein Ubuntu nötig) |
| `public/og-image.png` | aus `og-image.svg` gerendert, 1200 × 630 |

Noch nicht übernommen: Wortmarke im Kopf der App (das «M als Gipfel»
in `main.jsx`, `LockScreen.jsx`, `BetaGate.jsx`, `Onboarding.jsx`) und die Schriftfrage
(Paket: Ubuntu · App: Lexend/Hanken). Das ist ein Entscheid, kein Rückstand.

Neu rendern: `sips -s format png -z 512 512 public/app-icon.svg --out public/icon-512.png`
