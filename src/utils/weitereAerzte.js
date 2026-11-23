// Abgetrennt aus utils/hausarzt.js (19.11.2026, Fach Karteikarten), damit sie nicht im Startbündel liegt.
import { istHausarzt } from './hausarzt.js';

// Alle anderen Einträge der Liste (Zahnärztin, Psychiater, Gynäkologin …) — für die Zeile «weitere Ärzte»
// in Notfall-Dossier und Notfall-QR (Entscheid Stebler Studios 26.10.2026). Nur mit Namen.
// Seit dem Fach Karteikarten (19.11.2026) trägt die Liste auch Therapien und Kontakte (Physio, Apotheke, Spital …):
// sie sind keine Ärzte und stehen darum nicht in dieser Zeile (SPECIALTY_GRUPPEN, DoctorManager.jsx; Wächter
// bauplanNotfall.test.js hält die Liste gleich).
export const KEINE_AERZTE = ['physio', 'psychotherapie', 'ergo', 'apotheke', 'spital', 'spitex'];
export const weitereAerzteAusListe = (notfall) =>
  (Array.isArray(notfall?.doctorsList) ? notfall.doctorsList : [])
    .filter((x) => x && typeof x.name === 'string' && x.name.trim() !== '' && !istHausarzt(x)
      && !KEINE_AERZTE.includes(String(x.specialty || '').toLowerCase()));
