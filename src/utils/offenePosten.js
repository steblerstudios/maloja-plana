// Offene Posten: Arztbelege (Versicherungen) und Forderungen (Schuldenmanager) ohne Doppelzählung.
// Spec: docs/superpowers/specs/2026-10-05-schulden-rechnungen-design.md (① Übersicht, ② Liste, ③ Übernehmen).
//
// Eine Quelle je Wahrheit: ein Betrag lebt an genau einer Stelle. Erst beim bewussten Übernehmen (③)
// wird er kopiert; der Beleg trägt dann `forderungId` und zählt nur noch als Forderung.
// Nichts geschieht automatisch — `belegAlsForderung` und `abgleichBelege` sind reine Funktionen,
// die Ansicht ruft sie erst nach einem Klick auf.
//
// Datumsregel wie `istUeberfaellig` (src/schuldenCalc.js): ISO-Text, abgelaufen = Frist < heute;
// «heute» ist noch nicht abgelaufen.

const rappen = (x) => Math.round((Number(x) || 0) * 100);

const belege = (data) => (Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : []);
const schulden = (data) => (Array.isArray(data?.schulden) ? data.schulden : []);

export const istBelegUebernehmbar = (beleg, heute) =>
  !!beleg && beleg.status === 'offen' && !beleg.forderungId && (!beleg.frist || beleg.frist < heute);

export const offenePosten = (data, heute) => {
  const arzt = belege(data)
    .filter(b => b && b.status === 'offen' && !b.forderungId)
    .map(b => ({
      id: b.id,
      datum: b.datum || '',
      betrag: Number(b.betrag) || 0,
      frist: b.frist || '',
      abgelaufen: !!b.frist && b.frist < heute,
    }));
  const forderungen = schulden(data)
    .filter(s => s && s.status !== 'paid')
    .map(s => {
      const f = { id: s.id, creditor: s.creditor, amount: Number(s.amount) || 0, stufe: s.stufe, belegDatum: s.belegDatum || '' };
      if (s.ausBeleg) f.ausBeleg = s.ausBeleg;
      return f;
    });
  const summeArzt = arzt.reduce((a, b) => a + rappen(b.betrag), 0);
  const summeForderungen = forderungen.reduce((a, f) => a + rappen(f.amount), 0);
  const fristen = arzt.map(b => b.frist).filter(f => f && f >= heute).sort();
  return {
    arzt,
    forderungen,
    summeArzt: summeArzt / 100,
    summeForderungen: summeForderungen / 100,
    summe: (summeArzt + summeForderungen) / 100,
    naechsteFrist: fristen.length ? fristen[0] : null,
  };
};

export const belegAlsForderung = (data, belegId, heute, neueId) => {
  const unveraendert = { schulden: data?.schulden, versicherungen: data?.versicherungen };
  const beleg = belege(data).find(b => b && b.id === belegId);
  if (!istBelegUebernehmbar(beleg, heute)) return unveraendert;
  const forderung = {
    id: neueId,
    creditor: '',
    amount: beleg.betrag,
    dueDate: beleg.frist || '',
    interestRate: 0,
    category: 'gesundheit',
    status: 'open',
    stufe: 'rechnung',
    ausBeleg: beleg.id,
    belegDatum: beleg.datum || '',
    createdAt: heute,
  };
  return {
    schulden: [...schulden(data), forderung],
    versicherungen: {
      ...data.versicherungen,
      kkBelege: belege(data).map(b => (b === beleg ? { ...b, forderungId: String(neueId) } : b)),
    },
  };
};

export const abgleichBelege = (data) => {
  const liste = belege(data);
  const forderungen = schulden(data);
  let geaendert = false;
  const neu = liste.map(b => {
    if (!b || !b.forderungId) return b;
    const f = forderungen.find(s => String(s.id) === String(b.forderungId));
    if (!f) {
      geaendert = true;
      const { forderungId: _weg, ...rest } = b;
      return rest;
    }
    if (f.status === 'paid' && b.status !== 'bezahlt') {
      geaendert = true;
      return { ...b, status: 'bezahlt' };
    }
    return b;
  });
  if (!geaendert) return data;
  return { ...data, versicherungen: { ...data.versicherungen, kkBelege: neu } };
};

// Verdrahtung für main.jsx (Task 4): beide Funktionen sind rein, main.jsx ruft nur sie auf.
// ③ Übernehmen: schreibt in beide Ablagen (schulden + versicherungen) mit einem Klick.
export const uebernehmen = (prev, belegId, heute, neueId) => ({ ...prev, ...belegAlsForderung(prev, belegId, heute, neueId) });

// Speichern im Schuldenmanager: Bezahlt-Abgleich zurück zum Beleg. Nur mit echtem Array —
// ohne `schulden` würde `abgleichBelege` jede Verbindung als «Forderung fehlt» lesen und lösen.
export const nachSchuldenSpeichern = (prev, schuldenData) => {
  const neu = { ...prev, ...schuldenData };
  return Array.isArray(schuldenData?.schulden) ? abgleichBelege(neu) : neu;
};
