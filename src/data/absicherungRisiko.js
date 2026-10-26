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
//   Art. 36 Abs. 1 (ordentliche Rente: mind. drei Beitragsjahre), Art. 39 (ausserordentliche Renten) · AHVG Art. 21
//   (Referenzalter), Art. 23 Abs. 1 (Witwen-/Witwerrente mit Kindern bei der Verwitwung), Art. 24 Abs. 1 (Witwe ohne
//   Kinder: 45 Jahre und fünf Jahre verheiratet), Art. 25 (Waisenrente), Art. 29 (Voll- und Teilrenten) · UVV Art. 13 · BVG Art. 2, 4 (Selbständige freiwillig), 7 Abs. 1.

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
  const ahvRente = alterUndRentenalter(data.basis, heute).rentenalter === true;
  // Rente für die Pensionskasse: Anstellungstyp «Rentner» oder Referenzalter. Für die IV nur das Alter — wer früh
  // pensioniert ist, bleibt bis zum Referenzalter IV-versichert (IVG Art. 30 lit. b; Fachprüfung 26.10.2026).
  const rente = art === 'retired' || ahvRente;
  const jahrAlter = jahrAlterAus(data.basis, heute);
  const schild = schildState(v, schildOptionen(data));
  // «Aktiv» = Kasse oder laufender Beitrag. Ein reines Guthaben (z. B. Freizügigkeit) zählt fürs Alter, nicht für
  // Invalidität und Tod (Fachprüfung 26.10.2026).
  const bvgAktiv = has(v.bvgInsurer) || Number(v.bvgContribution) > 0;
  const bvgGuthaben = Number(v.bvgBalance) > 0;
  const bvgPflicht = schild.pflicht.items.some((p) => p.key === 'bvg');
  const kkErfasst = has(v.kkInsurer);

  // Pensionskasse je Risiko: erfasst, oder warum (noch) nicht.
  const pk = (risiko) => {
    const erfasst = bvgAktiv || (risiko === 'alter' && bvgGuthaben);
    if (erfasst) return [has(v.bvgInsurer) ? zeile('pkErfasst', 'erfasst', { name: v.bvgInsurer }) : zeile('pkErfasstOhneName', 'erfasst')];
    const guthaben = bvgGuthaben ? zeile('pkGuthaben', 'hinweis') : null;
    if (rente) return [guthaben];
    if (selbstaendig) return [zeile('pkSelbst', 'hinweis'), guthaben];
    if (angestellt && jahrAlter != null && jahrAlter <= 17) return [zeile('pkMindestalter', 'hinweis'), guthaben];
    if (risiko === 'alter' && angestellt && jahrAlter != null && jahrAlter <= 24) return [zeile('pkAltersparen', 'hinweis'), guthaben];
    // Ohne Geburtsdatum ist offen, ob das Alterssparen schon läuft (BVG Art. 7) — Hinweis statt «offen».
    if (risiko === 'alter' && angestellt && jahrAlter == null && bvgPflicht) return [zeile('pkOhneGeburtsdatum', 'hinweis'), guthaben];
    if (bvgPflicht) return [zeile('pkOffen', 'offen'), guthaben];
    if (schild.bvgUnklar) return [zeile('pkUnklar', 'hinweis'), guthaben];
    if (angestellt) return [zeile('pkUnterSchwelle', 'hinweis'), guthaben];
    return [zeile('pkJeNachArbeit', 'hinweis'), guthaben];
  };

  const krankheit = [
    kkErfasst ? zeile('kkErfasst', 'erfasst', { name: v.kkInsurer }) : zeile('kkOffen', 'offen'),
    v.ktg === 'employer' ? zeile('ktgArbeitgeber', 'zusatz') : v.ktg === 'yes' ? zeile('ktgErfasst', 'zusatz')
      : rente ? null : zeile('ktgNicht', 'hinweis'),
  ];

  const uvgDa = ['yes', 'employer', 'private'].includes(v.uvg);
  // Unter 8 Std./Woche beim selben Arbeitgeber keine Nichtberufsunfall-Deckung (UVG Art. 8 Abs. 2, UVV Art. 13) —
  // nur wenn das Pensum erfasst ist, sonst kein Hinweis (kein Lärm).
  const stunden = Number(data.ausbildung?.workHoursPerWeek);
  const unter8 = Number.isFinite(stunden) && stunden > 0 && stunden < 8;
  const unfall = angestellt
    ? [uvgDa ? zeile(v.uvg === 'employer' ? 'uvgArbeitgeber' : 'uvgErfasst', 'erfasst') : zeile('uvgOffen', 'offen'),
      unter8 ? zeile('nbuUnter8', 'hinweis') : null]
    : [
      // Fehlt die Krankenkasse, ist das unter Krankheit schon «offen» — hier nicht doppelt zählen.
      uvgDa ? zeile('uvgErfasst', 'erfasst') : kkErfasst ? zeile('unfallKk', 'hinweis') : zeile('unfallOhneKk', 'hinweis'),
      selbstaendig && !uvgDa ? zeile('uvgFreiwillig', 'hinweis') : null,
      // Ohne Anstellungstyp: Arbeitslose sind obligatorisch unfallversichert (UVG Art. 1a Abs. 1 lit. b).
      !art && !uvgDa ? zeile('unfallArbeitslos', 'hinweis') : null,
    ];

  const invaliditaet = ahvRente ? [zeile('ivRente', 'hinweis')] : [zeile('iv', 'hinweis'), ...pk('invaliditaet')];
  const tod = [zeile('ahvHinterlassene', 'hinweis'), ...pk('tod'), v.lifeInsurance === 'yes' ? zeile('leben', 'zusatz') : null];
  const saeule3a = Number(f.pension3a) > 0 || Number(f.pension3aBalance) > 0;
  const alter = [zeile('ahvAlter', 'hinweis'), ...pk('alter'), saeule3a ? zeile('saeule3a', 'zusatz') : null];

  const risiken = [
    { key: 'krankheit', zeilen: krankheit },
    { key: 'unfall', zeilen: unfall },
    { key: 'invaliditaet', zeilen: invaliditaet },
    { key: 'tod', zeilen: tod },
    { key: 'alter', zeilen: alter },
  ].map((r) => ({ ...r, zeilen: r.zeilen.filter(Boolean) }));
  // Je fehlende Angabe einmal: die Pensionskasse steht unter drei Risiken, ist aber ein Eintrag (Fachprüfung 26.10.2026).
  const offen = new Set(risiken.flatMap((r) => r.zeilen.filter((z) => z.art === 'offen').map((z) => z.key))).size;
  return { risiken, offen };
}
