// Ausweis F, N, S: eine Stelle für die Frage, wer im Profil einen dieser Ausweise trägt (Stebler Studios 01.11.2026).
export const hatAusweisFNS = (data) => ['f', 'n', 's'].includes(String(data?.ausbildung?.workPermit || '').toLowerCase());
// Gruppe A L1 (11.11.2026): ohne Schweizer Pass — auch ohne Angabe — kann Sozialhilfe Folgen für die
// Bewilligung haben (AIG Art. 62 Abs. 1 Bst. e, Art. 63 Abs. 1 Bst. c). Ausweis oder Nationalität «swiss» schliesst aus.
const ausweis = (data) => String(data?.ausbildung?.workPermit || '').toLowerCase();
export const ohneSchweizerPass = (data) => ausweis(data) !== 'swiss' && data?.basis?.nationality !== 'swiss';
// Welcher Satz zur Sozialhilfe (rechts-pruefer nach dem Bau, 11.11.2026): AIG Art. 62/63 gelten nur für Bewilligungen
// nach dem AIG. N und S haben keine (Widerruf S: AsylG Art. 78 ohne Sozialhilfe), G wohnt im Ausland — kein Satz.
// F ist eine vorläufige Aufnahme: eigener Satz zu Familiennachzug (AIG Art. 85c Abs. 1 Bst. c) und Bewilligung (Art. 84 Abs. 5).
export const sozHinweisSchluessel = (data) => {
  if (!ohneSchweizerPass(data)) return null;
  const a = ausweis(data);
  if (a === 'f') return 'wasStehtMirZu.sozBewilligungF';
  return ['n', 's', 'g'].includes(a) ? null : 'wasStehtMirZu.sozBewilligung';
};
