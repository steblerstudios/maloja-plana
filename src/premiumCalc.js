// KVG Prämienverbilligung — kantonale Anlaufstellen.
// Die eigentliche IPV-Berechnung erfolgt kantonal in config/cantonalData.js
// (calculateIPV). Die frühere nationale Pauschal-Tabelle (KVG_BRACKETS_2024)
// wurde entfernt, weil sie dem kantonalen Rechner widersprach.

import { getCantonName } from './config/cantonalData.js';
import { getFullName } from './config/constants.js';
import { getCantonalLinks } from './data/direktLinks.js';

// Das IPV-Dokument, das PremiumSubsidy als JSON herunterlädt. Eine Quelle für Datei
// und Export-Vorschau (K20): die Vorschau nennt, was genau dieses Objekt enthält.
//
// E9: Bei einem Kanton ohne amtlichen Beleg steht im Dokument KEIN Betrag und keine
// Grenze — nur die Einschätzung, der Hinweistext und der Weg zur kantonalen Stelle.
const ipvErgebnisFuerDokument = (r, t) => {
  if (!r || r.belegt !== false) return r;
  return {
    belegt: false,
    einschaetzung: 'beim-kanton-pruefen',
    hinweis: t ? t(r.noteKey, r.noteParams) : r.noteKey,
    kantonaleStelle: (getCantonalLinks(r.canton) || {}).ipv || null,
  };
};

export const buildIpvDokument = (data, t, ipvResult) => {
  const canton = (data && data.basis && data.basis.canton) || '';
  return {
    title: 'KVG IPV — Kantonal',
    date: new Date().toLocaleDateString(),
    canton,
    cantonName: getCantonName(canton, t),
    applicant: getFullName(data && data.basis) || '',
    ahv: (data && data.basis && data.basis.ahv) || '',
    result: ipvErgebnisFuerDokument(ipvResult, t),
  };
};

export const getKVGApplicationLink = (canton) => {
  const links = {
    'ZH': 'https://www.zh.ch/de/gesundheit/praemienverbilligung_krankenversicherung.html',
    'BE': 'https://www.asv.dij.be.ch/de/start/themen/pv.html',
    'GE': 'https://www.ge.ch/informations-generales-subside-assurance-maladie',
    'VD': 'https://www.vd.ch/sante-soins-et-handicap/assurance-maladie/subside-a-lassurance-maladie',
    'default': 'https://www.bag.admin.ch/de/krankenversicherung-praemienverbilligung'
  };

  return links[canton] || links.default;
};
