// Ausweis F, N, S: eine Stelle für die Frage, wer im Profil einen dieser Ausweise trägt (Stebler Studios 01.11.2026).
export const hatAusweisFNS = (data) => ['f', 'n', 's'].includes(String(data?.ausbildung?.workPermit || '').toLowerCase());
