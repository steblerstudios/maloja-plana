// Vorgänge — Registry und Regeln der geführten Abläufe, die sich etwas merken (O12).
// Bewusst datenfrei und deterministisch: nur Struktur + Regeln, keine React- und keine
// Speicher-Abhängigkeit, damit testbar. Das Schreiben liegt in `utils/vorgaenge.js`,
// die Oberfläche in den bestehenden Ablauf-Dateien. Gleiches Muster wie `data/gepaeck.js`.
//
// Zwei Entscheide, die diese Datei trägt:
//
//  1. Die Aufgabenliste wird ABGELEITET, nicht gespeichert. Gespeichert wird nur, was die
//     Person getan hat (Verweise auf Merkliste/Kalender, „trifft mich nicht zu"). So kann
//     eine bessere Regel später alte Vorgänge verbessern, statt an ihnen vorbeizulaufen.
//  2. Fristen werden aus dem STICHTAG gerechnet, nie aus „heute" und nie gespeichert.
//     Gespeicherte Daten veralten; gerechnete nicht.

// ── Status ──────────────────────────────────────────────────────────────────
// Bewusst drei. Kein `paused`, `blocked`, `archived` — die kommen, wenn ein echter
// Fall sie verlangt, nicht vorher.
export const VORGANG_STATUS = ['entwurf', 'aktiv', 'abgeschlossen'];

// ── Anwendbarkeit ───────────────────────────────────────────────────────────
// Getrennt vom Erledigt-Zustand: „muss ich nicht machen" ist etwas anderes als
// „noch nicht erledigt". `unbekannt` heisst: die Lebensmappe sagt nichts dazu —
// dann wird die Aufgabe gezeigt, aber nicht als Versäumnis gezählt.
export const ANWENDBARKEIT = ['zutreffend', 'nichtZutreffend', 'unbekannt'];

// Ein Feld gilt als erfasst, wenn es einen echten Wert hat. Gleiche Regel wie
// `gegenstandReadiness` in `data/gepaeck.js` — bewusst dieselbe, nicht eine zweite.
const erfasst = (v) => {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  const s = String(v).trim().toLowerCase();
  return s !== '' && s !== 'no' && s !== 'none' && s !== '0';
};

// ── Umzug ───────────────────────────────────────────────────────────────────
// Die Aufgaben bilden ab, was `UmzugAblauf.jsx` heute schon führt — nicht mehr.
// Erweitert wird erst, wenn der Vorgang steht.
//
// `frage(kontext, data)` gibt eine der drei Anwendbarkeiten zurück.
// `fristTage` ist ein Versatz auf den Stichtag; `null` heisst: keine Frist.
//
// 🛑 Fristen brauchen eine Quelle. Hier steht genau EINE: die Anmeldung bei der neuen
// Gemeinde innert 14 Tagen nach Zuzug. Eine Frist für die ABMELDUNG wird bewusst nicht
// erfunden — sie ist kantonal verschieden und im Repo nicht belegt.
const UMZUG_AUFGABEN = [
  {
    key: 'neueAdresse',
    i18n: 'umzug.step1Title',
    fristTage: null,
    frage: () => 'zutreffend',
  },
  {
    key: 'einwohnerkontrolle',
    i18n: 'umzug.step2Title',
    fristTage: 14,
    frage: () => 'zutreffend',
  },
  { key: 'post', i18n: 'umzug.step3Post', fristTage: null, frage: () => 'zutreffend' },
  { key: 'krankenkasse', i18n: 'umzug.step3Kk', fristTage: null, frage: () => 'zutreffend' },
  {
    key: 'arbeitgeber',
    i18n: 'umzug.step3Employer',
    fristTage: null,
    // Nur wer eine Stelle erfasst hat. Ist nichts erfasst, wissen wir es nicht —
    // dann lieber zeigen als stillschweigend weglassen.
    frage: (_kontext, data) => {
      const f = data?.finanzen || {};
      if (erfasst(f.employer)) return 'zutreffend';
      if (f.employmentType === 'retired' || f.employmentType === 'unemployed') return 'nichtZutreffend';
      if (erfasst(f.employmentType)) return 'zutreffend';
      return 'unbekannt';
    },
  },
  { key: 'ahv', i18n: 'umzug.step3Ahv', fristTage: null, frage: () => 'zutreffend' },
  {
    key: 'steueramt',
    i18n: 'umzug.step3Tax',
    fristTage: null,
    frage: () => 'zutreffend',
  },
  { key: 'versicherungen', i18n: 'umzug.step3Insurance', fristTage: null, frage: () => 'zutreffend' },
  { key: 'bank', i18n: 'umzug.step3Bank', fristTage: null, frage: () => 'zutreffend' },
  { key: 'abos', i18n: 'umzug.step3Subs', fristTage: null, frage: () => 'zutreffend' },
  {
    key: 'wohnungKuendigen',
    i18n: 'umzug.step4Title',
    fristTage: null,
    // Nur bei einem Mietverhältnis. Wohneigentum oder nichts erfasst → nicht behaupten.
    frage: (_kontext, data) => {
      const w = data?.wohnen || {};
      if (erfasst(w.rentAmount)) return 'zutreffend';
      if (w.housingType === 'owner' || w.wohnform === 'eigentum') return 'nichtZutreffend';
      return 'unbekannt';
    },
  },
  {
    key: 'praemienregion',
    i18n: 'umzug.changesLinkPraemien',
    fristTage: null,
    // Die Prämienregion ändert sich erst ausserhalb der bisherigen Gemeinde.
    frage: (kontext) => (kontext?.umzugType && kontext.umzugType !== 'gemeinde' ? 'zutreffend' : 'nichtZutreffend'),
  },
  {
    key: 'mietzinsbeitraege',
    i18n: 'umzug.linkMietzins',
    fristTage: null,
    frage: (kontext) => (kontext?.umzugType && kontext.umzugType !== 'gemeinde' ? 'zutreffend' : 'nichtZutreffend'),
  },
  {
    key: 'steuerfolgen',
    i18n: 'umzug.changesLinkTax',
    fristTage: null,
    // Steuerhoheit wechselt erst beim Kantonswechsel.
    frage: (kontext) => (kontext?.umzugType === 'extra' ? 'zutreffend' : 'nichtZutreffend'),
  },
];

// Die bekannten Umzugs-Typen — identisch zu `UmzugAblauf.jsx`.
// 🛑 Bekannte Lücke: „Zuzug aus dem Ausland" fehlt (siehe docs/product/vorgaenge-1.0-entwurf.md §K5).
export const UMZUG_TYPEN = ['gemeinde', 'kanton', 'extra'];

// ── Registry ────────────────────────────────────────────────────────────────
export const VORGANG_TYPEN = {
  umzug: {
    key: 'umzug',
    view: 'umzug',          // die bestehende Ablauf-Ansicht
    i18n: 'umzug.title',
    aufgaben: UMZUG_AUFGABEN,
  },
};

export const vorgangTyp = (typ) => VORGANG_TYPEN[typ] || null;

// ── Abgeleitete Aufgabenliste ───────────────────────────────────────────────
// Deterministisch aus Regeln + Lebensmappe + dem, was die Person festgehalten hat.
// Gibt IMMER alle Aufgaben zurück, auch die nicht zutreffenden — wer zählt, filtert
// selbst. So bleibt sichtbar, was Maloja bewusst nicht verlangt.
export const aufgabenFuer = (vorgang, data) => {
  const typ = vorgangTyp(vorgang?.typ);
  if (!typ) return [];
  const gespeichert = vorgang?.aufgaben || {};
  const kontext = vorgang?.kontext || {};

  return typ.aufgaben.map((regel) => {
    const eigen = gespeichert[regel.key] || {};
    // Die Person darf die Regel überstimmen — aber nur in eine Richtung:
    // „trifft mich nicht zu". Das Umgekehrte behauptet Maloja nicht.
    const anwendbarkeit = eigen.nichtZutreffend === true
      ? 'nichtZutreffend'
      : regel.frage(kontext, data || {});

    return {
      key: regel.key,
      i18n: regel.i18n,
      anwendbarkeit,
      frist: fristFuer(vorgang, regel),
      todoId: eigen.todoId || null,
      reminderId: eigen.reminderId || null,
    };
  });
};

// ── Frist ───────────────────────────────────────────────────────────────────
// Stichtag + Versatz. Ohne Stichtag oder ohne Versatz: keine Frist — und ausdrücklich
// KEIN Ersatz aus „heute". Genau das war der Fehler in `UmzugAblauf.jsx:25`.
export const fristFuer = (vorgang, regel) => {
  if (!regel || regel.fristTage == null) return null;
  const stichtag = vorgang?.stichtag;
  if (!stichtag || !/^\d{4}-\d{2}-\d{2}$/.test(stichtag)) return null;
  const [y, m, d] = stichtag.split('-').map(Number);
  const datum = new Date(y, m - 1, d);
  if (Number.isNaN(datum.getTime())) return null;
  datum.setDate(datum.getDate() + regel.fristTage);
  const mm = String(datum.getMonth() + 1).padStart(2, '0');
  const dd = String(datum.getDate()).padStart(2, '0');
  return `${datum.getFullYear()}-${mm}-${dd}`;
};

// ── Fortschritt ─────────────────────────────────────────────────────────────
// Gezählt, nicht geschätzt. Erledigt wird aus der Merkliste ABGELEITET — es gibt
// keinen zweiten Erledigt-Zustand, der mit ihr auseinanderlaufen könnte.
// `todos` ist die Merkliste in ihrer bestehenden Form ({id, text, link, done}).
//
// Nicht zutreffende Aufgaben zählen weder als offen noch als erledigt: wer alles
// Zutreffende getan hat, steht auf „fertig" — nicht auf „11 von 14".
export const fortschritt = (vorgang, data, todos) => {
  const liste = aufgabenFuer(vorgang, data).filter((a) => a.anwendbarkeit !== 'nichtZutreffend');
  const erledigtSet = new Set((todos || []).filter((t) => t && t.done).map((t) => t.id));
  const erledigt = liste.filter((a) => a.todoId && erledigtSet.has(a.todoId)).length;
  return { erledigt, gesamt: liste.length, offen: liste.length - erledigt };
};

// Die nächste offene Aufgabe: erst die mit der frühesten Frist, dann der Reihe nach.
// Bewusst kein Ranking, keine Gewichtung — die Reihenfolge der Registry ist die
// Reihenfolge des Ablaufs. („Als Nächstes" quer über alle Vorgänge ist O7.)
export const naechsteAufgabe = (vorgang, data, todos) => {
  const erledigtSet = new Set((todos || []).filter((t) => t && t.done).map((t) => t.id));
  const offen = aufgabenFuer(vorgang, data)
    .filter((a) => a.anwendbarkeit !== 'nichtZutreffend')
    .filter((a) => !(a.todoId && erledigtSet.has(a.todoId)));
  if (!offen.length) return null;
  const mitFrist = offen.filter((a) => a.frist).sort((a, b) => a.frist.localeCompare(b.frist));
  return mitFrist[0] || offen[0];
};
