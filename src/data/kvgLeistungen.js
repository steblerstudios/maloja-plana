// KVG-Leistungskatalog, Franchise/Selbstbehalt, Taxpunktwerte
// Quellen: BAG KVG Art. 25–31, KLV, TARDOC/Tarmed, santésuisse
export const KVG_DATA_VERSION = '2026-06';

// Franchise-Stufen (KVG Art. 64)
export const FRANCHISE_STUFEN = [300, 500, 1000, 1500, 2000, 2500];
export const FRANCHISE_KINDER = [0, 100, 200, 300, 400, 500, 600];
export const SELBSTBEHALT_RATE = 0.10;
export const SELBSTBEHALT_MAX = 700;
export const SELBSTBEHALT_MAX_KINDER = 350;

export function berechneFranchise(franchise, kosten) {
  const fr = Number(franchise) || 300;
  const k = Number(kosten) || 0;
  const franchiseVerbraucht = Math.min(k, fr);
  const franchiseOffen = fr - franchiseVerbraucht;
  const kostenUeberFranchise = Math.max(0, k - fr);
  const selbstbehalt = Math.min(kostenUeberFranchise * SELBSTBEHALT_RATE, SELBSTBEHALT_MAX);
  const kasseZahlt = Math.max(0, k - franchiseVerbraucht - selbstbehalt);
  const eigenanteil = franchiseVerbraucht + selbstbehalt;
  return {
    franchise: fr,
    kosten: k,
    franchiseVerbraucht,
    franchiseOffen,
    selbstbehalt,
    selbstbehaltMax: SELBSTBEHALT_MAX,
    kasseZahlt,
    eigenanteil,
    selbstbehaltAusgeschoepft: selbstbehalt >= SELBSTBEHALT_MAX,
  };
}

// Taxpunktwert (TPW) pro Kanton in CHF (TARDOC/Tarmed, Stand 2025)
export const TAXPUNKTWERT = {
  AG: 0.89, AI: 0.89, AR: 0.89, BE: 0.89, BL: 0.89, BS: 0.91,
  FR: 0.88, GE: 0.96, GL: 0.87, GR: 0.89, JU: 0.88, LU: 0.87,
  NE: 0.92, NW: 0.87, OW: 0.87, SG: 0.87, SH: 0.87, SO: 0.89,
  SZ: 0.87, TG: 0.86, TI: 0.90, UR: 0.87, VD: 0.93, VS: 0.86,
  ZG: 0.89, ZH: 0.89,
};

export function berechneArztrechnung(taxpunkte, canton) {
  const tpw = TAXPUNKTWERT[canton] || 0.89;
  return {
    taxpunkte,
    taxpunktwert: tpw,
    betrag: Math.round(taxpunkte * tpw * 100) / 100,
    canton,
  };
}

// KVG-Leistungskatalog: was zahlt die Grundversicherung?
// Kategorien: covered (ja), limited (mit Bedingungen), excluded (nein)
// interval: Häufigkeit falls limitiert
export const KVG_KATALOG = [
  // ─── Arztbesuche ─────────────────────────────────────
  { key: 'hausarzt',       cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'spezialist',     cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'notfall',        cat: 'arzt',    status: 'covered',  intervalKey: null },
  { key: 'zweitmeinung',   cat: 'arzt',    status: 'covered',  intervalKey: null },

  // ─── Vorsorge & Screening ───────────────────────────
  { key: 'gynaeko',        cat: 'vorsorge', status: 'limited',  intervalKey: 'gynaeko3j' },
  { key: 'mammografie',    cat: 'vorsorge', status: 'limited',  intervalKey: 'mammografie2j' },
  { key: 'darmkrebs',      cat: 'vorsorge', status: 'limited',  intervalKey: 'darmkrebs10j' },
  { key: 'impfungen',      cat: 'vorsorge', status: 'covered',  intervalKey: 'impfBag' },
  { key: 'checkup',        cat: 'vorsorge', status: 'excluded', intervalKey: null },
  { key: 'augenarzt',      cat: 'vorsorge', status: 'excluded', intervalKey: null },

  // ─── Labor & Tests ──────────────────────────────────
  { key: 'bluttest',       cat: 'labor',   status: 'covered',  intervalKey: 'mitVerordnung' },
  { key: 'std',            cat: 'labor',   status: 'excluded', intervalKey: null },
  { key: 'schwangerschaft',cat: 'labor',   status: 'covered',  intervalKey: 'schwangerschaftFrei' },
  { key: 'genetik',        cat: 'labor',   status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Medikamente ────────────────────────────────────
  { key: 'slMedi',         cat: 'medi',    status: 'covered',  intervalKey: null },
  { key: 'nichtSlMedi',    cat: 'medi',    status: 'excluded', intervalKey: null },
  { key: 'generika',       cat: 'medi',    status: 'covered',  intervalKey: 'generikaBonus' },

  // ─── Spital ─────────────────────────────────────────
  { key: 'spitalAllg',     cat: 'spital',  status: 'covered',  intervalKey: null },
  { key: 'spitalHalbpriv', cat: 'spital',  status: 'excluded', intervalKey: null },
  { key: 'ambulant',       cat: 'spital',  status: 'covered',  intervalKey: null },
  { key: 'reha',           cat: 'spital',  status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Zähne ──────────────────────────────────────────
  { key: 'zahnarzt',       cat: 'dental',  status: 'excluded', intervalKey: null },
  { key: 'zahnUnfall',     cat: 'dental',  status: 'covered',  intervalKey: null },
  { key: 'kieferChirurgie',cat: 'dental',  status: 'limited',  intervalKey: 'mitVerordnung' },

  // ─── Therapien ──────────────────────────────────────
  { key: 'physio',         cat: 'therapie',status: 'covered',  intervalKey: 'physio9' },
  { key: 'ergo',           cat: 'therapie',status: 'covered',  intervalKey: 'mitVerordnung' },
  { key: 'psycho',         cat: 'therapie',status: 'covered',  intervalKey: 'psychoModell' },
  { key: 'chiropraktik',   cat: 'therapie',status: 'covered',  intervalKey: null },
  { key: 'akupunktur',     cat: 'therapie',status: 'limited',  intervalKey: 'mitVerordnung' },
  { key: 'homoeoDurch',    cat: 'therapie',status: 'limited',  intervalKey: 'aerztlich' },

  // ─── Hilfsmittel & Diverses ─────────────────────────
  { key: 'brille',         cat: 'divers',  status: 'limited',  intervalKey: 'brilleKinder' },
  { key: 'hoergeraet',     cat: 'divers',  status: 'limited',  intervalKey: 'mitVerordnung' },
  { key: 'transport',      cat: 'divers',  status: 'limited',  intervalKey: 'transport50' },
  { key: 'ausland',        cat: 'divers',  status: 'limited',  intervalKey: 'auslandNotfall' },
  { key: 'mutterschaft',   cat: 'divers',  status: 'covered',  intervalKey: 'mutterschaftFrei' },
  { key: 'spitex',         cat: 'divers',  status: 'covered',  intervalKey: null },
];

export const KVG_CATEGORIES = ['arzt', 'vorsorge', 'labor', 'medi', 'spital', 'dental', 'therapie', 'divers'];

// Belegbare internationale Vorsorge-Empfehlungen als ruhige Orientierung neben der
// KVG-Deckung (Faden 3-II). KEINE Angst-Differenz: bei diesen Screenings deckt die
// Grundversicherung den empfohlenen Rhythmus — beim Zervix-Screening empfiehlt die WHO
// sogar längere Intervalle als die Schweizer Praxis (entkräftet den „Pap-Mythos").
// Konsistente Referenz-Anker: KVG (Deckung, oben) + WHO + EU — aber EHRLICH pro Screening,
// nur Anker zeigen, die belegbar existieren. Darmkrebs: die WHO hat KEIN eigenes Screening-
// Intervall (who:false) → nicht erfinden, nur EU. Texte liegen in i18n
// (kvg.<key>Who / <key>Eu / <key>Synthese / <key>Quelle).
// Quellen: WHO-Leitlinie 2021 (Zervix), WHO/ECIBC (Mammografie), Europäischer Kodex gegen Krebs 5. Aufl.
export const VORSORGE_EMPFEHLUNGEN = {
  gynaeko:     { who: true,  eu: true },
  mammografie: { who: true,  eu: true },
  darmkrebs:   { who: false, eu: true },
};

// Belegbare „Was genau gedeckt ist"-Details für Einträge, deren Note zu knapp ist
// (Faden 3-II). Wert = Anzahl Detail-Zeilen in i18n (kvg.<key>Detail1..N + <key>DetailQuelle).
// Gleiche einklappbare Mechanik wie die WHO/EU-Empfehlung, ruhige Grunddichte.
// Quellen: KVG/KLV Art. 13–14 (Schwangerschaft), Schweizerischer Impfplan (Impfungen).
export const KVG_DETAILS = {
  schwangerschaft: 3,
  impfungen: 3,
  transport: 3,
  ausland: 3,
};

// Empfohlenes Intervall in Monaten für den opt-in persönlichen Abgleich (Faden 3-II/2).
// = KVG-gedeckter / CH-klinischer Rhythmus (konkret + belegbar). Der „liegt länger
// zurück"-Hinweis ist nie aggressiver als dieser Wert (dignity-first; der WHO/EU-Kontext
// — z. T. längere Intervalle — steht weiter oben im Empfehlungsblock).
export const VORSORGE_INTERVAL_MONATE = {
  gynaeko: 36,
  mammografie: 24,
  darmkrebs: 120,
};
