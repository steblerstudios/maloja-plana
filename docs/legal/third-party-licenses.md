# Third-Party-Lizenzen — Maloja Plana

**Stand: Juni 2026, nachgeführt 17.09.2026 und 24.09.2026**

---

## Runtime Dependencies

| Paket | Version | Lizenz | Zweck |
|---|---|---|---|
| react | ^18.2.0 | MIT | UI-Framework |
| react-dom | ^18.2.0 | MIT | DOM-Rendering |
| **three** | **^0.186.0** | **MIT** | **3D-Lebensbaum (`Baum3D.jsx`)** |
| loose-envify | transitiv | MIT | über react |
| js-tokens | transitiv | MIT | über loose-envify |
| scheduler | transitiv | MIT | über react-dom |

*`three` und die drei transitiven Pakete fehlten bis 23.09.2026 in dieser Tabelle —
gefunden bei der Rechts-Prüfung des Zweigs `docs/compliance-uebersicht`. `three` ist
seit dem 3D-Lebensbaum eine echte Laufzeit-Abhängigkeit und landet im Bundle.*

## Vendored Libraries

| Paket | Datei | Lizenz | Zweck |
|---|---|---|---|
| qrcodejs | src/vendor/qrcodejs.js | MIT | QR-Code-Generierung (Organspende, KK-Scanner) |
| jsQR | public/vendor/jsQR.js | Apache-2.0 | QR-Code-Scanning |

## Ausgelieferte Lizenztexte

Die MIT-Lizenz verlangt, dass ihr Text **mitgeliefert** wird («shall be included in
all copies or substantial portions of the Software») — nicht nur, dass die Lizenz
genannt wird. Seit 23.09.2026 liegen darum **alle acht** Texte unter
`public/licenses/` und im Build unter `/licenses/`:

`react` · `react-dom` · `three` · `scheduler` · `loose-envify` · `js-tokens`
(alle MIT) · `QRCode.js-LICENSE.txt` (MIT) · `jsQR-LICENSE.txt` (Apache-2.0)

*Bis dahin waren es nur die zwei vendorierten Dateien. Die sechs npm-Pakete sind ins
Bundle kompiliert, ihre Lizenztexte fehlten in der Auslieferung — aufgefallen bei der
Rechts-Prüfung am 23.09.2026.*

## Dev Dependencies

| Paket | Version | Lizenz | Zweck |
|---|---|---|---|
| vite | ^7.3.6 | MIT | Build-Tool |
| @vitejs/plugin-react | ^5.2.0 | MIT | React-Support für Vite |
| vitest | ^4.1.6 | MIT | Test-Framework |
| size-limit | ^12.1.0 | MIT | Bundle-Size-Monitoring |
| @size-limit/file | ^12.1.0 | MIT | Size-Limit-Plugin |
| eslint | ^9.39.5 | MIT | Lint |
| @eslint/js | ^9.39.5 | MIT | Lint-Grundregeln |
| eslint-plugin-react-hooks | ^7.1.1 | MIT | Lint-Regeln für React-Hooks |
| globals | ^17.7.0 | MIT | Lint: bekannte globale Namen |
| @capacitor/core | ^8.4.1 | MIT | Native Bridge (iOS-Vorbereitung) |
| @capacitor/cli | ^8.4.1 | MIT | Capacitor CLI |
| @capacitor/ios | ^8.4.1 | MIT | iOS-Plattform |

*Nachgeführt 24.09.2026 (Deploy-Gate 0.1.40-beta) an `package.json` `devDependencies`: vite stand
hier noch auf ^4.4.0 und @vitejs/plugin-react auf ^4.0.0; die vier Lint-Pakete fehlten; die drei
Capacitor-Pakete standen unter «Runtime», `package.json` führt sie als Dev-Abhängigkeiten (sie
landen nicht im Web-Bundle). Lizenzen aus `node_modules/<paket>/package.json` gelesen.*

## Schriftarten

| Schrift | Lizenz | Quelle |
|---|---|---|
| Lexend | SIL Open Font License 1.1 | https://github.com/googlefonts/lexend (lokal unter `public/fonts/`) |
| Hanken Grotesk | SIL Open Font License 1.1 | https://github.com/marcologous/hanken-grotesk (lokal unter `public/fonts/`) |
| Atkinson Hyperlegible | SIL Open Font License 1.1 | https://www.brailleinstitute.org/freefont (lokal unter `public/fonts/`) |

Lizenztext und Copyright-Vermerke liegen bei den Schriften (`public/fonts/OFL.txt`, `LICENSE.txt`,
`README.md`) und werden mit ausgeliefert. *Korrigiert 17.09.2026 (K75): Hier standen DM Sans und
Cormorant Garamond; ausgeliefert werden seit dem Schriftwechsel Lexend, Hanken Grotesk und Atkinson
Hyperlegible (gemessen: `ls public/fonts`).*

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
