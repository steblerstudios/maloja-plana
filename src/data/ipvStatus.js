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
export function readIpvStatus(data) {
  const raw = data && data.anspruch && data.anspruch.ipv;
  const status = raw && VALID.has(raw.status) ? raw.status : IPV_STATUS.GESCHAETZT;
  const betrag = status === IPV_STATUS.BESTAETIGT ? Math.max(0, Number(raw && raw.betrag) || 0) : 0;
  const datum = status === IPV_STATUS.BESTAETIGT && raw && typeof raw.datum === 'string' ? raw.datum : null;
  return { status, betrag, datum };
}

// Baut das nächste Status-Objekt für updateData('anspruch', 'ipv', …).
// Nur 'bestaetigt' trägt Betrag + Datum; jeder andere Übergang räumt beides weg
// (Schätzung ≠ Entscheid — kein Stempel-Rest an einem unbestätigten Zustand).
export function nextIpvStatus(status, { betrag, datum } = {}) {
  const safe = VALID.has(status) ? status : IPV_STATUS.GESCHAETZT;
  if (safe === IPV_STATUS.BESTAETIGT) {
    return {
      status: safe,
      betrag: Math.max(0, Number(betrag) || 0),
      datum: datum || new Date().toISOString().split('T')[0],
    };
  }
  return { status: safe };
}

export const isIpvConfirmed = (data) => readIpvStatus(data).status === IPV_STATUS.BESTAETIGT;
