// Lebensbereich Notfall & Gesundheit · die Rechnungen (Bauplan Lebensbereich, Stebler Studios 18.11.2026).
// Nur Zahlen: kein React, kein Bauteil. Drei Fragen (Analyse stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md):
//   1. Franchise          franchiseStand        → Thermometer       (Zuhause Arztkoffer · Werkzeug KVG-Reiter · Kachel)
//   2. Als Nächstes fällig naechstesFaellig      → Kalenderblatt     (Zuhause Arztkoffer · Werkzeug Katalog, Beleg-Ordner)
//   3. Bereit             bereitschaft, lagenStand → Herz mit Puls   (Zuhause Kapitel Notfall · Kachel)
// Die Verfügungen (VORSORGE) sind eine Liste ohne Bild; ihre Rechnung steht hier, weil «Bereit» die
// Patientenverfügung mitzählt.
import { feldErledigt } from '../../utils/vollstaendigkeit.js';
import { berechneFranchise, VORSORGE_INTERVAL_MONATE } from '../../data/kvgLeistungen.js';
import { gesundheitskostenBisher, parseFranchise } from '../../data/franchiseTacho.js';

// ─── 3 · Bereit für den Ernstfall ────────────────────────────────────────────
// Die drei Lagen und ihre Angaben (Kapitel Notfall «ein Ort», Stebler Studios 24.10.2026).
export const SCENARIOS = [
  {
    key: 'unfall',
    fields: [
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'bloodType' },
      { chapter: 'notfall', k: 'allergies' },
      { chapter: 'notfall', k: 'medications' },
      { chapter: 'notfall', k: 'doctor' },
      { chapter: 'notfall', k: 'doctorPhone' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
    ],
  },
  {
    key: 'spital',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
      { chapter: 'versicherungen', k: 'franchise' },
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'patientenverfuegung' },
    ],
  },
  {
    key: 'behoerde',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'canton' },
      { chapter: 'wohnen', k: 'address' },
      { chapter: 'wohnen', k: 'postalCode' },
      { chapter: 'wohnen', k: 'city' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'behoerden', k: 'cantoneOfTaxation' },
    ],
  },
];

// Die verschiedenen Angaben der drei Lagen, ohne Doppelte (20), in der Reihenfolge des ersten Auftretens.
export const NOTFALL_ANGABEN = SCENARIOS.flatMap((s) => s.fields)
  .filter((f, i, alle) => alle.findIndex((x) => x.chapter === f.chapter && x.k === f.k) === i);

// Verfügungen: geregelt ist, was entschieden ist. Organspende: jede Wahl ausser «Noch nicht entschieden»;
// Testament: errichtet (eigenhändig oder öffentlich); die anderen: «Ja».
export const VORSORGE = [
  { k: 'organDonor', weg: null },
  { k: 'patientenverfuegung', weg: 'patientenverfuegung', wegKey: 'notfallKapitel.erstellen' },
  { k: 'vorsorgeauftrag', weg: 'vorsorgeauftrag', wegKey: 'notfallKapitel.erstellen' },
  { k: 'bestattungswuensche', weg: 'bestattung', wegKey: 'notfallKapitel.festhalten' },
  // Lebenslagen C3 (07.11.2026): das Feld bleibt, wo es gespeichert ist (Kapitel Behörden).
  { k: 'willMade', kapitel: 'behoerden', weg: 'testament', wegKey: 'notfallKapitel.nachlesen' },
];
const TESTAMENT_ERRICHTET = ['handwritten', 'public'];
export const vorsorgeGeregelt = (nf, k) => {
  const v = (nf || {})[k];
  if (!v) return false;
  if (k === 'willMade') return TESTAMENT_ERRICHTET.includes(v);
  return k === 'organDonor' ? v !== 'undecided' : v === 'yes';
};
export const vorsorgeEintragGeregelt = (alle, v) => vorsorgeGeregelt((alle || {})[v.kapitel || 'notfall'], v.k);

// Eine Angabe ist bereit, wenn sie einen Wert hat oder «trifft nicht zu» trägt. Ausnahme Patientenverfügung: erst
// bei «Ja» (Stebler Studios 25.10.2026, nach der Fachprüfung).
export const angabeBereit = (data, f) => (f.chapter === 'notfall' && f.k === 'patientenverfuegung'
  ? vorsorgeGeregelt((data || {}).notfall, 'patientenverfuegung')
  : feldErledigt((data || {})[f.chapter], f.k));

// Wie bereit: erledigt, gesamt, und das Fehlende mit den Lagen, für die es fehlt.
export const bereitschaft = (data) => {
  const d = data || {};
  const fehlend = NOTFALL_ANGABEN
    .filter((f) => !angabeBereit(d, f))
    .map((f) => ({ ...f, lagen: SCENARIOS.filter((s) => s.fields.some((x) => x.chapter === f.chapter && x.k === f.k)).map((s) => s.key) }));
  return { erledigt: NOTFALL_ANGABEN.length - fehlend.length, gesamt: NOTFALL_ANGABEN.length, fehlend };
};

// Je Lage: wie viele ihrer Angaben bereit sind. Ein Schlag im Herz ist hoch, wenn die Lage `voll` ist.
export const lagenStand = (data) => SCENARIOS.map((s) => {
  const erledigt = s.fields.filter((f) => angabeBereit(data, f)).length;
  return { key: s.key, erledigt, gesamt: s.fields.length, voll: erledigt === s.fields.length };
});

// ─── 1 · Franchise ───────────────────────────────────────────────────────────
// Dieselbe Rechnung wie die Kachel: erfasste Franchise, anrechenbare Belege dieses Jahres (belegeImJahr).
// Ohne erfasste Franchise keine Zahl (null), wie bisher.
export const franchiseStand = (data, heute = new Date()) => {
  const fr = parseFranchise(data?.versicherungen?.franchise);
  return fr != null ? berechneFranchise(fr, gesundheitskostenBisher(data, heute)) : null;
};

// ─── 2 · Als Nächstes fällig ─────────────────────────────────────────────────
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

// Nächste empfohlene Vorsorge-Untersuchung: letzte Untersuchung + Intervall (Monate). Eine Rechnung für den Katalog
// (Text «~MM.JJJJ») und die Arztkoffer-Seite. Ohne gültiges Datum oder Intervall: null.
export const naechsteVorsorge = (letzteIso, monate) => {
  if (!letzteIso || !monate) return null;
  const d = new Date(String(letzteIso) + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + monate);
  return iso(d);
};

// Das Früheste aus offenen Belegfristen und fälligen Vorsorge-Untersuchungen.
// `letzteBesuche` = { screeningKey: 'YYYY-MM-DD' } (utils/vorsorge.js, lokal gespeichert, nicht in `data`).
// Ergebnis: { art: 'beleg' | 'vorsorge', key, iso, vorbei } oder null, wenn nichts ansteht.
export const naechstesFaellig = (data, letzteBesuche = {}, heute = new Date()) => {
  const heuteIso = iso(heute);
  const belege = Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const kandidaten = [
    ...belege.filter((b) => b && b.status === 'offen' && b.frist)
      .map((b) => ({ art: 'beleg', key: b.id || null, iso: String(b.frist).slice(0, 10) })),
    ...Object.entries(letzteBesuche || {})
      .map(([key, letzte]) => ({ art: 'vorsorge', key, iso: naechsteVorsorge(letzte, VORSORGE_INTERVAL_MONATE[key]) }))
      .filter((k) => k.iso),
  ];
  if (!kandidaten.length) return null;
  const erstes = kandidaten.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0))[0];
  return { ...erstes, vorbei: erstes.iso < heuteIso };
};
