// Ausweis F, N, S: eine Stelle für die Frage, wer im Profil einen dieser Ausweise trägt (Stebler Studios 01.11.2026).
export const hatAusweisFNS = (data) => ['f', 'n', 's'].includes(String(data?.ausbildung?.workPermit || '').toLowerCase());
// Gruppe A L1 (11.11.2026): ohne Schweizer Pass — auch ohne Angabe — kann Sozialhilfe Folgen für die
// Bewilligung haben (AIG Art. 62 Abs. 1 Bst. e, Art. 63 Abs. 1 Bst. c). Nur «swiss» schliesst den Hinweis aus.
export const ohneSchweizerPass = (data) => String(data?.ausbildung?.workPermit || '').toLowerCase() !== 'swiss';
