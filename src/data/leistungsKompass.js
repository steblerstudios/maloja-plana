// Reine Logik für den Leistungs-Kompass — kein React, damit testbar.
// Der Kompass ist ein Orientierungs-Instrument über dem bestehenden Leistungs-
// Schnellcheck: er misst nichts, er zeigt eine Richtung (Peilung). Emotional:
// „du bist nicht verloren — hier ist deine Richtung." Drei ehrliche Zustände.
//
//   idle  → noch kein Einkommen eingegeben: Nadel ruht, keine Peilung
//   found → Leistungen gedeckt: farbige Nadelspitze zeigt auf „Leistungen" (Norden)
//   none  → über Einkommen nichts Direktes, aber es gibt weitere Wege:
//           Nadelspitze zeigt auf „weitere Wege" (Süden)
//
// bearing = Grad im Uhrzeigersinn ab Norden (0 = oben). Die farbige Spitze
// zeigt immer auf die relevante Peilung.
export function kompassBearing({ hasIncome, benefitCount } = {}) {
  if (!hasIncome) return { state: 'idle', bearing: 0 };
  if ((benefitCount || 0) > 0) return { state: 'found', bearing: 0 };
  return { state: 'none', bearing: 180 };
}
