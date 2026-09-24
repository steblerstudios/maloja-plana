// Reine Logik für die IPV-Lebenslinie (Phase 2) — kein React, damit testbar.
// Der Status lebt additiv in data.anspruch.ipv; fehlt er, ist der Zustand
// 'geschaetzt' (= exakt das Phase-1-Verhalten, keine Migration nötig).
// calculateIPV in config/cantonalData.js bleibt UNBERÜHRT — dies ist reiner
// Ablauf-Status, keine zweite Anspruchs-Rechnung.
//
//   geschaetzt → unsere Schätzung; der Kanton hat (noch) nicht entschieden
//   beantragt  → nur im Antrags-Weg; Automatik-Kantone überspringen ihn
//   bestaetigt → Verfügung da; Betrag stammt aus der Verfügung, nicht von uns

export const IPV_STATUS = { GESCHAETZT: 'geschaetzt', BEANTRAGT: 'beantragt', BESTAETIGT: 'bestaetigt' };

const VALID = new Set(Object.values(IPV_STATUS));

// Liest den IPV-Status defensiv aus den Profildaten. Betrag/Datum gelten nur im
// Zustand 'bestaetigt' — ein Stempel darf nie ohne Bestätigung entstehen.
// `kanton` und `jahr` (seit 0.1.40-beta): wofür die Verfügung gilt. Ältere Einträge haben sie
// nicht — dann null, und data/ipvAbzug.js zieht aus dieser Verfügung nichts ab (nicht
// zuordenbar). Gelöscht wird nichts: Betrag und Datum bleiben lesbar.
export function readIpvStatus(data) {
  const raw = data && data.anspruch && data.anspruch.ipv;
  const status = raw && VALID.has(raw.status) ? raw.status : IPV_STATUS.GESCHAETZT;
  const bestaetigt = status === IPV_STATUS.BESTAETIGT;
  const betrag = bestaetigt ? Math.max(0, Number(raw && raw.betrag) || 0) : 0;
  const datum = bestaetigt && raw && typeof raw.datum === 'string' ? raw.datum : null;
  const kanton = bestaetigt && raw && typeof raw.kanton === 'string' && raw.kanton ? raw.kanton : null;
  const jahr = bestaetigt && raw && Number.isInteger(raw.jahr) ? raw.jahr : null;
  return { status, betrag, datum, kanton, jahr };
}

// Baut das nächste Status-Objekt für updateData('anspruch', 'ipv', …).
// Nur 'bestaetigt' trägt Betrag + Datum + Kanton + Jahr; jeder andere Übergang räumt alles weg
// (Schätzung ≠ Entscheid — kein Stempel-Rest an einem unbestätigten Zustand).
// Kanton: der Wohnkanton beim Eintragen (fehlt er, wird keiner geschrieben — dann ist die
// Verfügung nicht zuordenbar). Jahr: ausdrücklich mitgegeben, sonst das Jahr des Datums, sonst
// das laufende Kalenderjahr.
export function nextIpvStatus(status, { betrag, datum, kanton, jahr } = {}) {
  const safe = VALID.has(status) ? status : IPV_STATUS.GESCHAETZT;
  if (safe === IPV_STATUS.BESTAETIGT) {
    const d = datum || new Date().toISOString().split('T')[0];
    const ausDatum = datum ? Number(String(datum).slice(0, 4)) : new Date().getFullYear();
    const next = {
      status: safe,
      betrag: Math.max(0, Number(betrag) || 0),
      datum: d,
      jahr: Number.isInteger(jahr) ? jahr : (Number.isInteger(ausDatum) ? ausDatum : new Date().getFullYear()),
    };
    if (typeof kanton === 'string' && kanton) next.kanton = kanton;
    return next;
  }
  return { status: safe };
}

export const isIpvConfirmed = (data) => readIpvStatus(data).status === IPV_STATUS.BESTAETIGT;
