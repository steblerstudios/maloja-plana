import { calculateIPV, calculateSozialhilfe, checkELEligibility } from '../config/cantonalData.js';

// Anspruch-Signale (#4.4 „Schnellcheck wächst als Ast", Session #38): welche
// berechenbaren Ansprüche sind aus dem heutigen Profil gedeckt — und an welchem
// Lebensbaum-Ast (Kapitel-Schlüssel) hängen sie. EINZIGE Quelle der Wahrheit für
// den Ring am Baum (Variante A) und die Zeile in den Nachrichten (Variante C).
//
// GUARDRAIL — Ehrlichkeit: nur die DREI Leistungen, die der Schnellcheck auch
// wirklich rechnet (IPV / Sozialhilfe / EL), mit denselben Ehrlichkeits-Gates.
// Nie ein Ring ohne gedeckten Anspruch. Lage-abhängige Leistungen (Stipendien,
// IV, ALV, EO, Familienzulagen …) bleiben bewusst draussen: sie hängen an einer
// Lebenslage, nicht an Zahlen — daraus lässt sich kein ehrliches „du hast das"
// ableiten. Dieselbe Engine wie Schnellcheck/AnspruchCheck, damit Baum und
// Rechner nie widersprechen.
//
// Ast-Zuordnung (Kapitel-Schlüssel der 7 heutigen Kapitel):
//   IPV          → versicherungen (Prämienverbilligung)
//   Sozialhilfe  → behoerden      (deckt sich mit dem Sozialhilfe-Werkzeug)
//   EL           → finanzen       (Ergänzung zu AHV/IV-Renten, view: finanzuebersicht)

// item = i18n-Basis anspruch.items.<key>.{label,sub}; view = onNavigate-Ziel.
export function anspruchSignale(data = {}) {
  const byChapter = {};
  const add = (chapterKey, sig) => { (byChapter[chapterKey] = byChapter[chapterKey] || []).push(sig); };
  try {
    const canton = data?.basis?.canton || '';
    const income = Number(data?.finanzen?.monthlyIncome) || 0;
    const rent = Number(data?.wohnen?.rentAmount) || 0;

    // IPV: kantonal + einkommensgetrieben. Ohne Kanton kein Signal.
    if (income > 0 && canton && calculateIPV(data)?.eligible) {
      add('versicherungen', { key: 'ipv', view: 'premium' });
    }
    // Sozialhilfe: nur mit Mietkontext + ungedecktem Bedarf + Vermögen unter
    // Freibetrag — sonst wäre der Ring unehrlich.
    if (rent > 0) {
      const sh = calculateSozialhilfe(data);
      if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) {
        add('behoerden', { key: 'sozialhilfe', view: 'sozialhilfe' });
      }
    }
    // EL: nur im AHV-/IV-Renten-Kontext.
    if (checkELEligibility(data)?.eligible) {
      add('finanzen', { key: 'el', view: 'finanzuebersicht' });
    }
  } catch { /* Orientierung, nie blockierend */ }
  return byChapter;
}

// Flache Liste aller gedeckten Signale — für die Nachrichten/Benachrichtigungen
// (Variante C) und schnelle „gibt es überhaupt etwas?"-Prüfungen.
export function anspruchSignaleListe(data = {}) {
  const byChapter = anspruchSignale(data);
  return Object.keys(byChapter).flatMap((chapterKey) =>
    byChapter[chapterKey].map((sig) => ({ ...sig, chapterKey }))
  );
}
