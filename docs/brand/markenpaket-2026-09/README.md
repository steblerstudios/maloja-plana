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

| `logo-horizontal-dunkel.svg` (hier) | Paket `logo/logo-horizontal-dunkel.svg`, pixelgeprüft gegen das gelieferte PNG (197 von 206 800 Pixeln weichen ab, nur Kantenglättung) |
| `src/components/MarkenLogo.jsx` | dieselben Pfade als EINE Logo-Quelle für Kopfzeile, Sperrbildschirm, Beta-Tor, Onboarding. `markenLogo.test.js` hält sie mit der SVG gleich |

**Farbe nach Fläche, nicht nach Modus:** dunkle Fläche → Salbei/Sand, Schrift Warmweiss; helle
Fläche → einfarbig Anthrazit `#22211F` (Markenbuch). Das Beta-Tor ist immer hell, darum
entscheidet die Palette der Fläche, nicht `data-theme`.

**Schrift:** Der Schriftzug ist Ubuntu **in Pfaden**, also ein Bild. Die App-Schrift bleibt
Lexend; es wird keine Ubuntu-Datei geladen (Entscheid Stebler Studios, 24.09.2026).

Noch offen: `brand-guidelines.md` beschreibt noch das alte Gipfel-Signet und die Granit-Palette.

Neu rendern: `sips -s format png -z 512 512 public/app-icon.svg --out public/icon-512.png`
