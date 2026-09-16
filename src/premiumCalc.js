// KVG Prämienverbilligung — kantonale Anlaufstellen.
// Die eigentliche IPV-Berechnung erfolgt kantonal in config/cantonalData.js
// (calculateIPV). Die frühere nationale Pauschal-Tabelle (KVG_BRACKETS_2024)
// wurde entfernt, weil sie dem kantonalen Rechner widersprach.

import { getCantonName } from './config/cantonalData.js';
import { getFullName } from './config/constants.js';

// Das IPV-Dokument, das PremiumSubsidy als JSON herunterlädt. Eine Quelle für Datei
// und Export-Vorschau (K20): die Vorschau nennt, was genau dieses Objekt enthält.
export const buildIpvDokument = (data, t, ipvResult) => {
  const canton = (data && data.basis && data.basis.canton) || '';
  return {
    title: 'KVG IPV — Kantonal',
    date: new Date().toLocaleDateString(),
    canton,
    cantonName: getCantonName(canton, t),
    applicant: getFullName(data && data.basis) || '',
    ahv: (data && data.basis && data.basis.ahv) || '',
    result: ipvResult,
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
