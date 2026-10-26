import { schildState, schildOptionen } from './schutzschild.js';
import { alterUndRentenalter } from '../utils/nettoAusProfil.js';

// Absicherung je Lebensrisiko — Liste in der Versicherungs-Übersicht (Sophie 26.10.2026: «Liste je Risiko statt Netz»).
// Je Risiko Zeilen: was eingetragen ist, was das Gesetz vorsieht, freiwillig Erfasstes als Zusatz. Bewusst KEIN Anteil
// und keine Fläche: AHV/IV gelten für alle und sind nicht «erfasst», Freiwilliges ist keine Lücke (Fachprüfung des
// Netz-Konzepts, 26.10.2026). Haftpflicht und Hausrat stehen im Schutzschild «Empfohlen», nicht hier.
//
// Zeile: { key, p, art } — key unter vu.risiko.<key>, art: 'erfasst' | 'offen' | 'hinweis' | 'zusatz'.
// Gesetzesstellen, auf fedlex im Wortlaut gelesen (26.10.2026):
//   KVG Art. 3 (Pflicht für alle mit Wohnsitz), Art. 1a Abs. 1 (Taggeld freiwillig), Abs. 2 lit. b (Unfall, «soweit dafür
//   keine Unfallversicherung aufkommt») · UVG Art. 1a Abs. 1 (Arbeitnehmende, Arbeitslose obligatorisch), Art. 4
//   (Selbständige freiwillig) · IVG Art. 1b (versichert wie AHV), Art. 30 lit. b (IV-Rente erlischt mit der Altersrente),
//   Art. 36 Abs. 1 (mind. drei Beitragsjahre) · AHVG Art. 23 Abs. 1 (Witwen-/Witwerrente nur mit Kindern bei der
//   Verwitwung), Art. 25 (Waisenrente), Art. 29 (Voll- und Teilrenten) · BVG Art. 2, 4 (Selbständige freiwillig), 7 Abs. 1.

const has = (x) => x != null && String(x).trim() !== '';
const zeile = (key, art, p) => ({ key, art, ...(p ? { p } : {}) });

// Jahrgangsalter (Kalenderjahr − Geburtsjahr) — BVG Art. 7 Abs. 1 rechnet ab dem 1. Januar nach Vollendung.
function jahrAlterAus(basis, heute) {
  const m = /^(\d{4})-\d{2}-\d{2}/.exec(String(basis?.dateOfBirth || ''));
  return m ? heute.getFullYear() - Number(m[1]) : null;
}

export function absicherungJeRisiko(data = {}, heute = new Date()) {
  const v = data.versicherungen || {};
  const f = data.finanzen || {};
  const art = f.employmentType;
  const angestellt = art === 'employed';
  const selbstaendig = art === 'selfEmployed' || art === 'freelance';
  const rente = art === 'retired' || alterUndRentenalter(data.basis, heute).rentenalter === true;
  const jahrAlter = jahrAlterAus(data.basis, heute);
  const schild = schildState(v, schildOptionen(data));
  const bvgErfasst = has(v.bvgInsurer) || Number(v.bvgContribution) > 0 || Number(v.bvgBalance) > 0;
  const bvgPflicht = schild.pflicht.items.some((p) => p.key === 'bvg');
  const kkErfasst = has(v.kkInsurer);

  // Pensionskasse je Risiko: erfasst, oder warum (noch) nicht.
  const pk = (risiko) => {
    if (bvgErfasst) return has(v.bvgInsurer) ? zeile('pkErfasst', 'erfasst', { name: v.bvgInsurer }) : zeile('pkErfasstOhneName', 'erfasst');
    if (rente) return null;
    if (selbstaendig) return zeile('pkSelbst', 'hinweis');
    if (angestellt && jahrAlter != null && jahrAlter <= 17) return zeile('pkMindestalter', 'hinweis');
    if (risiko === 'alter' && angestellt && jahrAlter != null && jahrAlter <= 24) return zeile('pkAltersparen', 'hinweis');
    if (bvgPflicht) return zeile('pkOffen', 'offen');
    if (schild.bvgUnklar) return zeile('pkUnklar', 'hinweis');
    if (angestellt) return zeile('pkUnterSchwelle', 'hinweis');
    return zeile('pkJeNachArbeit', 'hinweis');
  };

  const krankheit = [
    kkErfasst ? zeile('kkErfasst', 'erfasst', { name: v.kkInsurer }) : zeile('kkOffen', 'offen'),
    v.ktg === 'employer' ? zeile('ktgArbeitgeber', 'zusatz') : v.ktg === 'yes' ? zeile('ktgErfasst', 'zusatz') : zeile('ktgNicht', 'hinweis'),
  ];

  const uvgDa = ['yes', 'employer', 'private'].includes(v.uvg);
  const unfall = angestellt
    ? [uvgDa ? zeile(v.uvg === 'employer' ? 'uvgArbeitgeber' : 'uvgErfasst', 'erfasst') : zeile('uvgOffen', 'offen')]
    : [
      uvgDa ? zeile('uvgErfasst', 'erfasst') : kkErfasst ? zeile('unfallKk', 'hinweis') : zeile('unfallOhneKk', 'offen'),
      selbstaendig && !uvgDa ? zeile('uvgFreiwillig', 'hinweis') : null,
    ];

  const invaliditaet = rente ? [zeile('ivRente', 'hinweis')] : [zeile('iv', 'hinweis'), pk('invaliditaet')];
  const tod = [zeile('ahvHinterlassene', 'hinweis'), pk('tod'), v.lifeInsurance === 'yes' ? zeile('leben', 'zusatz') : null];
  const saeule3a = Number(f.pension3a) > 0 || Number(f.pension3aBalance) > 0;
  const alter = [zeile('ahvAlter', 'hinweis'), pk('alter'), saeule3a ? zeile('saeule3a', 'zusatz') : null];

  const risiken = [
    { key: 'krankheit', zeilen: krankheit },
    { key: 'unfall', zeilen: unfall },
    { key: 'invaliditaet', zeilen: invaliditaet },
    { key: 'tod', zeilen: tod },
    { key: 'alter', zeilen: alter },
  ].map((r) => ({ ...r, zeilen: r.zeilen.filter(Boolean) }));
  const offen = risiken.reduce((n, r) => n + r.zeilen.filter((z) => z.art === 'offen').length, 0);
  return { risiken, offen };
}
