// KVG Prämienverbilligung — kantonale Anlaufstellen.
// Die eigentliche IPV-Berechnung erfolgt kantonal in config/cantonalData.js
// (calculateIPV). Die frühere nationale Pauschal-Tabelle (KVG_BRACKETS_2024)
// wurde entfernt, weil sie dem kantonalen Rechner widersprach.

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
