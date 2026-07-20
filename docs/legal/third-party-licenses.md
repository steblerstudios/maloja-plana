# Third-Party-Lizenzen — Maloja Plana

**Stand: Juni 2026**

---

## Runtime Dependencies

| Paket | Version | Lizenz | Zweck |
|---|---|---|---|
| react | ^18.2.0 | MIT | UI-Framework |
| react-dom | ^18.2.0 | MIT | DOM-Rendering |
| @capacitor/core | ^8.4.1 | MIT | Native Bridge (iOS-Vorbereitung) |
| @capacitor/cli | ^8.4.1 | MIT | Capacitor CLI |
| @capacitor/ios | ^8.4.1 | MIT | iOS-Plattform |

## Vendored Libraries

| Paket | Datei | Lizenz | Zweck |
|---|---|---|---|
| qrcodejs | src/vendor/qrcodejs.js | MIT | QR-Code-Generierung (Organspende, KK-Scanner) |
| jsQR | public/vendor/jsQR.js | Apache-2.0 | QR-Code-Scanning |

## Dev Dependencies

| Paket | Version | Lizenz | Zweck |
|---|---|---|---|
| vite | ^4.4.0 | MIT | Build-Tool |
| @vitejs/plugin-react | ^4.0.0 | MIT | React-Support für Vite |
| vitest | ^4.1.6 | MIT | Test-Framework |
| size-limit | ^12.1.0 | MIT | Bundle-Size-Monitoring |
| @size-limit/file | ^12.1.0 | MIT | Size-Limit-Plugin |

## Schriftarten

| Schrift | Lizenz | Quelle |
|---|---|---|
| DM Sans | Open Font License (OFL) | Google Fonts (lokal eingebunden) |
| Cormorant Garamond | Open Font License (OFL) | Google Fonts (lokal eingebunden) |

---

## Externe Dienste

| Dienst | Zweck | Datenfluss |
|---|---|---|
| Infomaniak (Genf, CH) | Hosting der statischen Anwendung | Keine Nutzerdaten — nur statische Dateien |
| Google Fonts CDN | **Nicht verwendet** — Schriften lokal eingebunden | Kein Datenfluss |
| Vercel | **Nicht mehr verwendet** (Stand Juni 2026) | Kein Datenfluss |

---

## Hinweis

Alle Runtime-Dependencies verwenden permissive Lizenzen (MIT, Apache-2.0, OFL), die mit der AGPL-3.0 von Maloja Plana kompatibel sind.
