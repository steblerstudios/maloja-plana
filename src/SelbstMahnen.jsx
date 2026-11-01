import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// «Jemand schuldet Ihnen Geld» — eigener kurzer Ablauf (F7-A10, Entscheid Stebler Studios 27.10.2026).
// Bis dahin Schritt 6 «Umgekehrt: Ihnen schuldet jemand Geld» im Ablauf «Mahnung oder Zahlungsbefehl»
// (MahnungErhalten.jsx). Text und Brief-Verweis 1:1 übernommen (OR Art. 102 Abs. 1, 104 Abs. 1 — Wortlaut
// geprüft 27.09.2026, siehe MahnungErhalten.jsx); die Quellenzeile trägt genau diese zwei Artikel aus
// mahnung.quelle. Orientierung, keine Rechtsberatung.
export const SelbstMahnen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'selbstmahnen', icon: 'money',
    title: t('selbstMahnen.title'),
  },
    // Schritt 1 — Selbst mahnen (OR 102 Abs. 1, 104 Abs. 1)
    React.createElement(AblaufStep, { palette, title: t('selbstMahnen.step1Title') },
      React.createElement('p', { style: s.stepText }, t('selbstMahnen.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('briefe.ablaufLink.paymentReminder'), onClick: () => onNavigate('briefe', undefined, { template: 'paymentReminder' }) })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('selbstMahnen.quelle'), notes: [t('alpha.noAdviceHint'), t('trust.localOnly')] })
  );
};

export default SelbstMahnen;
