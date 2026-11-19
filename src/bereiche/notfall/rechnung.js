// Lebensbereich Notfall & Gesundheit · die Rechnungen (Bauplan Lebensbereich, Stebler Studios 18.11.2026).
// Nur Zahlen: kein React, kein Bauteil. Vier Fragen (Analyse stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md):
//   1. Franchise          franchiseStand        → Thermometer       (Zuhause Arztkoffer · Werkzeug KVG-Reiter · Kachel)
//   2. Als Nächstes fällig naechstesFaellig      → Kalenderblatt     (Zuhause Arztkoffer · Werkzeug Katalog, Beleg-Ordner)
//   3. Bereit             bereitschaft, lagenStand → Herz mit Puls   (Zuhause Kapitel Notfall · Kachel)
//   4. Impfung fällig     naechsteImpfung       → Kalenderblatt     (Fach Impfausweis; zählt bei 2 mit)
// Die Verfügungen (VORSORGE) sind eine Liste ohne Bild; ihre Rechnung steht hier, weil «Bereit» die
// Patientenverfügung mitzählt.
import { feldErledigt } from '../../utils/vollstaendigkeit.js';
import { berechneFranchise, VORSORGE_INTERVAL_MONATE, SELBSTBEHALT_RATE } from '../../data/kvgLeistungen.js';
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

// Das Früheste aus offenen Belegfristen, fälligen Vorsorge-Untersuchungen und fälligen Auffrischimpfungen (4).
// `letzteBesuche` = { screeningKey: 'YYYY-MM-DD' } (utils/vorsorge.js, lokal gespeichert, nicht in `data`).
// Ergebnis: { art: 'beleg' | 'vorsorge' | 'impfung', key, iso, vorbei } oder null, wenn nichts ansteht.
const frueheste = (kandidaten, heute) => {
  if (!kandidaten.length) return null;
  const erstes = [...kandidaten].sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0))[0];
  return { ...erstes, vorbei: erstes.iso < iso(heute) };
};
export const naechstesFaellig = (data, letzteBesuche = {}, heute = new Date()) => {
  const belege = Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  return frueheste([
    ...belege.filter((b) => b && b.status === 'offen' && b.frist)
      .map((b) => ({ art: 'beleg', key: b.id || null, iso: String(b.frist).slice(0, 10) })),
    ...Object.entries(letzteBesuche || {})
      .map(([key, letzte]) => ({ art: 'vorsorge', key, iso: naechsteVorsorge(letzte, VORSORGE_INTERVAL_MONATE[key]) }))
      .filter((k) => k.iso),
    ...naechsteImpfungen(data),
  ], heute);
};

// ─── 4 · Welche Impfung ist fällig? (Fach Impfausweis, Sophie 19.11.2026: «A · Liste + fällig») ────────────
// Die Impfungen stehen in data.notfall.impfungen = [{ id, art, name?, datum: 'YYYY-MM-DD' }] (lokal, wie alles).
// Gerechnet wird NUR, wo der Impfplan eine klare Regel hat; sonst keine Frist, Satz «bei der Ärztin prüfen».
// Quelle: Schweizerischer Impfplan 2026, BAG und EKIF, Stand Februar 2026 (am Original-PDF geprüft 19.11.2026):
//   dT  Tabelle 1, Fussnote 13, und Kap. 1.4 / 1.5 a): «Dabei bestimmt das Alter bei Verabreichung einer
//       Auffrischimpfung das Intervall zur nächsten Auffrischimpfung»: Dosis mit 16–24 Jahren → 10 Jahre,
//       mit 25–64 → 20 Jahre, ab 65 → 10 Jahre. Bei Immundefizienz weiterhin 10 Jahre (weiss die App nicht:
//       Hinweis im Fach). Unter 16 gilt das Kinder-Schema: keine Rechnung.
//   FSME Kap. 3 a): «Eine Auffrischimpfung wird alle 10 Jahre empfohlen.»
export const IMPF_ARTEN = ['dt', 'fsme', 'mmr', 'varizellen', 'grippe', 'covid', 'hepb', 'hepa', 'hpv', 'pneumo', 'zoster', 'andere'];

const datumVon = (wert) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(wert || ''));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getDate() === Number(m[3]) ? d : null;
};
// Ganze Lebensjahre am Tag `amIso`.
export const alterAm = (geburtIso, amIso) => {
  const g = datumVon(geburtIso), a = datumVon(amIso);
  if (!g || !a || a < g) return null;
  const jahre = a.getFullYear() - g.getFullYear();
  return (a.getMonth() < g.getMonth() || (a.getMonth() === g.getMonth() && a.getDate() < g.getDate())) ? jahre - 1 : jahre;
};

// Abstand bis zur nächsten Auffrischung in Jahren, oder null (keine belegte Regel / Alter unbekannt).
export const impfAbstandJahre = (art, datumIso, geburtIso) => {
  if (art === 'fsme') return 10;
  if (art !== 'dt') return null;
  const alter = alterAm(geburtIso, datumIso);
  if (alter == null || alter < 16) return null;
  return alter >= 25 && alter < 65 ? 20 : 10;
};

export const impfungenListe = (data) => (Array.isArray(data?.notfall?.impfungen) ? data.notfall.impfungen : [])
  .filter((e) => e && IMPF_ARTEN.includes(e.art) && datumVon(e.datum));

// Je Impfung mit Regel: die letzte Dosis + Abstand. { art: 'impfung', key, iso, abstand, letzte }.
export const naechsteImpfungen = (data) => {
  const geburt = data?.basis?.dateOfBirth;
  const letzte = {};
  impfungenListe(data).forEach((e) => { if (!letzte[e.art] || e.datum > letzte[e.art]) letzte[e.art] = e.datum; });
  return Object.entries(letzte).flatMap(([art, datum]) => {
    const abstand = impfAbstandJahre(art, datum, geburt);
    if (!abstand) return [];
    const d = datumVon(datum);
    d.setFullYear(d.getFullYear() + abstand);
    return [{ art: 'impfung', key: art, iso: iso(d), abstand, letzte: String(datum).slice(0, 10) }];
  });
};

// Die früheste fällige Auffrischung (mit `vorbei`), oder null.
export const naechsteImpfung = (data, heute = new Date()) => frueheste(naechsteImpfungen(data), heute);

// ─── 5 · Impfcheck: Was empfiehlt der Impfplan für mein Alter? (Sophie 19.11.2026, «Ja, nach Alter», abwählbar) ─────
// Nur Impfungen «bei allen Personen oder in einem bestimmten Alter» für Erwachsene, aus Art. 12a KLV, Referenzdokument
// «Prophylaktische Impfungen» vom 1. Juli 2026, Kap. 4 (deckungsgleich mit Impfplan 2026, Kap. 1). Risikogruppen, Beruf,
// Reise und Schwangerschaft nicht: dafür steht im Fach «in der Arztpraxis prüfen». Unter 16 gilt der Kinder-Impfplan.
//   dt 4.1 · fsme 4.11 (ab 3 Jahren, ganze Schweiz ausser Tessin) · mmr 4.4 (Nachholimpfung, nach 1963 geboren, 2 Dosen)
//   varizellen 4.12 (bis 39, wenn nicht durchgemacht, 2 Dosen) · hpv 4.13 (11–26; 2 Dosen bei Beginn 11–14, sonst 3)
//   grippe 4.6 und covid 4.16 (ab 65, jedes Jahr Herbst/Winter) · pneumo 4.8 (ab 65, einmal) · zoster 4.17 (ab 65, 2 Dosen)
export const IMPFCHECK = [
  { key: 'dt', ab: 16, auffrischung: true },
  { key: 'fsme', ab: 16, auffrischung: true },
  { key: 'mmr', ab: 16, dosen: 2, geborenNach: 1963 },
  { key: 'varizellen', ab: 16, bis: 39, dosen: 2 },
  { key: 'hpv', ab: 16, bis: 26, dosen: 'hpv' },
  { key: 'grippe', ab: 65, jaehrlich: true },
  { key: 'covid', ab: 65, jaehrlich: true },
  { key: 'pneumo', ab: 65, dosen: 1 },
  { key: 'zoster', ab: 65, dosen: 2 },
];
export const IMPFCHECK_OFFEN = ['ok', 'faellig', 'teilweise', 'offen'];

const datumHeute = (heute) => iso(heute);
// Status je Zeile: ok · faellig · teilweise · offen · jaehrlich (nur «zuletzt») · spaeter (Alter noch nicht) ·
// vorbei (Alter vorbei) · aus (abgewählt: «trifft für mich nicht zu»). Ohne Geburtsdatum: { alter: null }.
export const impfcheck = (data, heute = new Date()) => {
  const geburt = data?.basis?.dateOfBirth;
  const alter = alterAm(geburt, datumHeute(heute));
  if (alter == null) return { alter: null, kind: false, zeilen: [], erledigt: 0, gesamt: 0 };
  if (alter < 16) return { alter, kind: true, zeilen: [], erledigt: 0, gesamt: 0 };
  const aus = Array.isArray(data?.notfall?.impfcheckAus) ? data.notfall.impfcheckAus : [];
  const liste = impfungenListe(data);
  const naechste = naechsteImpfungen(data);
  const zeilen = IMPFCHECK.filter((r) => !r.geborenNach || Number(String(geburt).slice(0, 4)) > r.geborenNach).map((r) => {
    const eigene = liste.filter((e) => e.art === r.key).sort((a, b) => (a.datum < b.datum ? -1 : 1));
    const letzte = eigene.length ? eigene[eigene.length - 1].datum : null;
    const basis = { key: r.key, ab: r.ab, bis: r.bis || null, anzahl: eigene.length, letzte };
    if (alter < r.ab) return { ...basis, status: 'spaeter' };
    if (r.bis && alter > r.bis) return { ...basis, status: 'vorbei' };
    if (aus.includes(r.key)) return { ...basis, status: 'aus' };
    if (r.jaehrlich) return { ...basis, status: 'jaehrlich' };
    if (r.auffrischung) {
      const n = naechste.find((x) => x.key === r.key);
      if (!n) return { ...basis, status: 'offen' }; // nichts eingetragen, oder nur Dosen vor 16 (Kinder-Schema)
      return { ...basis, status: n.iso < datumHeute(heute) ? 'faellig' : 'ok', iso: n.iso, abstand: n.abstand };
    }
    // HPV: 2 Dosen bei Impfbeginn 11–14, sonst 3 (Referenzdokument 4.13).
    const noetig = r.dosen === 'hpv' ? (eigene.length && alterAm(geburt, eigene[0].datum) < 15 ? 2 : 3) : r.dosen;
    return { ...basis, noetig, status: eigene.length >= noetig ? 'ok' : eigene.length ? 'teilweise' : 'offen' };
  });
  const zaehlbar = zeilen.filter((z) => IMPFCHECK_OFFEN.includes(z.status));
  return { alter, kind: false, zeilen, erledigt: zaehlbar.filter((z) => z.status === 'ok').length, gesamt: zaehlbar.length,
    tessin: data?.basis?.canton === 'TI' };
};

// ─── 6 · Was kosten mich die Impfungen? (Sophie 19.11.2026, Preise auf alle drei Arten, abwählbar) ───────────────
// Referenzdokument zu Art. 12a KLV vom 1. Juli 2026, Kap. 2: «Seit dem 1. Januar 2026 sind die Impfungen nach
// Artikel 12a KLV und die dazugehörige Beratung von der Franchise befreit. Der Selbstbehalt für die Versicherten bleibt
// unverändert.» Selbstbehalt 10 % (SELBSTBEHALT_RATE, KVG Art. 64 Abs. 2 Bst. b). «Bei beruflichen und
// reisemedizinischen Indikationen erfolgt keine Kostenübernahme durch die OKP.» Was eine Zusatzversicherung zahlt,
// steht in der Police: keine Zahl.
export const IMPF_ZAHLER = ['kasse', 'zusatz', 'selbst'];

// Richtpreise Impfstoff je Dosis, nur mit Quelle (Publikumspreis Spezialitätenliste). Fehlt eine Impfung hier, sagt
// das Formular «Richtpreis nicht belegt». Form: { chf, praeparat, quelle, stand }.
export const IMPF_RICHTPREISE = {};
const rappen = (n) => Math.round(n * 20) / 20;
const betragVon = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };

// Vorschlag, wer zahlt: Grundversicherung, wenn die Impfung zum Zeitpunkt für alle in diesem Alter empfohlen war;
// sonst selbst. Nur ein Vorschlag im Formular — wer es besser weiss (Risikogruppe, Reise), wählt um.
export const impfZahlerVorschlag = (data, art, datumIso) => {
  const r = IMPFCHECK.find((x) => x.key === art);
  const alter = alterAm(data?.basis?.dateOfBirth, datumIso);
  if (!r || alter == null || alter < r.ab || (r.bis && alter > r.bis)) return 'selbst';
  return 'kasse';
};

// { gesamt, eigen, kasse } in Franken; eigen/kasse null, wenn es von der Police abhängt. Ohne Preis: null.
export const impfKosten = (e, satz = SELBSTBEHALT_RATE) => {
  const gesamt = betragVon(e?.preis) + betragVon(e?.gebuehr);
  if (!gesamt) return null;
  const zahler = IMPF_ZAHLER.includes(e?.zahler) ? e.zahler : 'selbst';
  if (zahler === 'zusatz') return { gesamt, eigen: null, kasse: null, zahler };
  if (zahler === 'selbst') return { gesamt, eigen: gesamt, kasse: 0, zahler };
  const eigen = rappen(gesamt * satz);
  return { gesamt, eigen, kasse: rappen(gesamt - eigen), zahler };
};

// Eigenanteil der eingetragenen Impfungen eines Jahres. `offen`: Anzahl mit Zusatzversicherung (Betrag je nach Police).
export const impfKostenJahr = (data, jahr) => impfungenListe(data)
  .filter((e) => Number(String(e.datum).slice(0, 4)) === jahr)
  .reduce((s, e) => {
    const k = impfKosten(e);
    if (!k) return s;
    return { gesamt: s.gesamt + k.gesamt, eigen: s.eigen + (k.eigen || 0), offen: s.offen + (k.eigen == null ? 1 : 0), mitPreis: s.mitPreis + 1 };
  }, { gesamt: 0, eigen: 0, offen: 0, mitPreis: 0 });

// Für den Satz im Fach: Starrkrampf eingetragen, aber ohne Geburtsdatum nicht rechenbar.
export const impfungOhneAlter = (data) => !datumVon(data?.basis?.dateOfBirth) &&impfungenListe(data).some((e) => e.art === 'dt');
