// Lebensbereich Behörden · die Rechnungen (Bauplan Lebensbereich, Stebler Studios 18.11.2026; Behörden 21.11.2026,
// Analyse stebler-studios/analysen/2026-11-21-behoerden-bauplan.md). Kein React: nur Zahlen.
// Drei Fragen, je eine Rechnung, ein Bild, eine Hauptzahl:
//   A Wie lange bis zur Steuerfrist?   steuerfristLage   → Kalenderblatt am Anschlagbrett
//   B Wie viele Gänge sind erledigt?   gaengeLage        → Gemeindehaus, erledigte Fenster hell
//   C Gibt es Leistungen für mich?     leistungenLage    → Wegweiser mit Kompass
// Nichts wird neu gerechnet: Frist aus utils/fristAbstand.js (wie die Kachel), Gänge aus utils/behoerdenGaenge.js (wie
// Kachel und Dashboard), Leistungen aus data/anspruchWege.js (wie Übersicht und Schnellcheck).
import { fristAbstand } from '../../utils/fristAbstand.js';
import { steuerfristVorbei } from '../../utils/steuerfrist.js';
import { GAENGE, offeneErklaerungen, erledigtesSteuerjahr, gangErledigt } from '../../utils/behoerdenGaenge.js';
import { wegeAusProbe, leistungsKompass } from '../../data/anspruchWege.js';
import { calculateIPV } from '../../config/cantonalData.js';
import { einnahmenErfasst } from '../../utils/unterstuetzungseinheit.js';

export { GAENGE, offeneErklaerungen, erledigtesSteuerjahr, gangErledigt };

const heuteIso = (n) => n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');

// A · Steuerfrist. Ohne gültiges Datum: null (dann bleibt das Anschlagbrett weg).
// `zeigen` wie die Kachel (InstrumentePanel): eine Zahl nur, wenn die Frist noch kommt oder verpasst ist und noch etwas
// offen sein kann. Eine erledigte alte Frist ist Geschichte.
export const steuerfristLage = (behoerden, heute = new Date()) => {
  const iso = String(behoerden?.taxFilingDeadline || '').slice(0, 10);
  const ab = fristAbstand(iso, heute.getTime());
  if (!ab) return null;
  const vorbei = steuerfristVorbei(behoerden || {}, heuteIso(heute));
  return { iso, abstand: ab, vorbei, offen: offeneErklaerungen(behoerden), zeigen: !ab.vorbei || vorbei };
};

// B · Behördengänge, je Gang erledigt (eigener Haken oder Vorschlag aus «0 offen») und das Steuerjahr dazu.
export const gaengeLage = (checked = {}, behoerden = {}, heute = new Date()) => {
  const liste = GAENGE.map((g) => {
    const jahr = g.id === 'steuererklaerung' ? erledigtesSteuerjahr(behoerden, heute) : null;
    return { ...g, erledigt: gangErledigt(g.id, checked, behoerden, heute), jahr, vorschlag: jahr != null && checked[g.id] === undefined };
  });
  return { liste, erledigt: liste.filter((g) => g.erledigt).length, total: liste.length };
};

// C · Leistungen: dieselbe Peilung wie Übersicht und Schnellcheck, dazu die Wege (für den Satz).
// `profil` trägt das Netto wie dort (useEinkommen). Solange das Kantonsmodell der IPV lädt, keine Aussage: calculateIPV
// meldet bis dahin «prüfen», bei Maria (ZH) wurde daraus ein Weg, den es mit geladenem Modell nicht gibt (22.11.2026).
// `fertig`: das Laden ist zu Ende, auch mit Fehler — dann gilt die Orientierung «prüfen» wie in der Übersicht.
export const leistungenLage = (profil, { fertig = false } = {}) => {
  const p = profil || {};
  if (!fertig && p.basis?.canton && einnahmenErfasst(p.finanzen) && calculateIPV(p).offen === 'laden') {
    return { state: 'laden', bearing: 0, anzahl: 0, wege: [] };
  }
  const { wege } = wegeAusProbe(p);
  return { ...leistungsKompass(profil || {}, wege), wege };
};

// Welcher Text zu welchem Weg gehört (dieselben Namen wie in der Leistungsliste der Übersicht).
export const WEG_NAME = { ipv: 'dashboard.quickCheckIpv', soz: 'nav.sozialhilfe', el: 'schnellcheck.el' };

// ── Tür im Gemeindehaus (Stebler Studios 23.11.2026, «3 klingt gut»: die Tür ist die eigene Gemeinde) ─────────────────
// Die Gemeinde kommt aus der Postleitzahl bei Wohnen (data/plzGemeinde.js, swisstopo, Amtliches Ortschaftenverzeichnis).
// Nur eindeutig: die PLZ gehört zu genau einer Gemeinde. Kein Abgleich mit dem Ort (Fachprüfung 23.11.2026, Blocker):
// der Ort bei Wohnen ist der Postort, nicht die Gemeinde — «1032 Romanel-sur-Lausanne» liegt zu 19 % in Lausanne,
// 638 solche Paare. Lieber kein Name als die falsche Gemeinde über der Tür. `treffer`: lookupPLZ(plz).
export const gemeindeLage = (treffer) => {
  const liste = Array.isArray(treffer) ? treffer : [];
  if (liste.length === 0) return { state: 'ohne' };
  return liste.length === 1 ? { state: 'eindeutig', ...liste[0] } : { state: 'mehrdeutig' };
};

// Der Link, den die Person selbst eingetragen hat — nur http(s), sonst keiner (kein «javascript:», keine Leerzeichen).
// «www.musterhausen.ch» wird zu «https://www.musterhausen.ch». Ergebnis: die Adresse oder null.
export const sichereWebsite = (roh) => {
  const s = String(roh || '').trim();
  if (!s || /\s/.test(s)) return null;
  const mitSchema = /^https?:\/\//i.test(s) ? s : /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(s) ? 'https://' + s : null;
  if (!mitSchema) return null;
  try {
    const u = new URL(mitSchema);
    // Sicherheitsprüfung 23.11.2026: keine Zugangsdaten in der Adresse (https://name:pw@…).
    if (u.username || u.password) return null;
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.') ? u.href : null;
  } catch { return null; }
};
