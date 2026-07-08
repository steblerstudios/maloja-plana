// Reine Logik für den Versicherungs-Schutzschild — kein React, damit testbar.
// Zeigt die drei KERN-Absicherungen, die fast alle brauchen und die sich ohne
// falsche Lücken bestimmen lassen: Krankenversicherung (obligatorisch),
// Privathaftpflicht, Hausrat. Bewusst NICHT im Schild: Unfall/Rechtsschutz/
// Leben/Auto — die sind situationsabhängig (Anstellung, Auto, …) und ergäben
// falsche „Lücken". Eine offene Absicherung ist ein ruhiger Hinweis, kein Alarm.
//
// v = data.versicherungen
export function schildState(v = {}) {
  const protections = [
    { key: 'kk', covered: !!(v.kkInsurer && String(v.kkInsurer).trim()) },
    { key: 'haftpflicht', covered: v.liabilityInsurance === 'yes' },
    { key: 'hausrat', covered: v.householdInsurance === 'yes' },
  ];
  const covered = protections.filter(p => p.covered).length;
  const total = protections.length;
  // „berührt": mind. eine Angabe gemacht → Schild erst dann zeigen, damit ein
  // leeres Formular keinen entmutigenden „0 von 3"-Schild wirft.
  const touched = v.kkInsurer != null && String(v.kkInsurer).trim() !== ''
    || v.liabilityInsurance != null && v.liabilityInsurance !== ''
    || v.householdInsurance != null && v.householdInsurance !== '';
  return {
    protections,
    covered,
    total,
    fraction: total ? covered / total : 0,
    allCovered: covered === total,
    gaps: protections.filter(p => !p.covered).map(p => p.key),
    touched,
  };
}
