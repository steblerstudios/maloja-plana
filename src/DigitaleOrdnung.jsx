import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';

// Digitale Ordnung — geführter Durchgang, gebaut 01.11.2026 auf Wunsch von Stebler Studios, Anstoss Reclaim City.
// Konzept und Grenzen: docs/design/digitale-ordnung-schweiz.md. Jeder Schritt ist etwas, das man selbst
// ausserhalb der App tut. Maloja fragt nie nach den Passwörtern der eigenen Konten und verbindet sich mit keinem Konto; gespeichert
// wird nur der Stand des Ablaufs (utils/ablaufStand.js). Bewusst noch ohne eigene Briefe: Schritt 5 führt zu
// den Musterbriefen des EDÖB. Eigene Vorlagen setzen die Bedingungen aus dem Konzept §5 voraus.

const GERAETE = 'https://www.bacs.admin.ch/de/geraeteschutz';
const SICHERN = 'https://www.bacs.admin.ch/de/datensicherung';
const ROBINSON = 'https://sdv-konsumenteninfo.ch/robinsonliste/';
const MUSTER = 'https://www.edoeb.admin.ch/de/musterbriefe-datenschutz';
const ERSTE = 'https://www.bacs.admin.ch/de/erste-schritte-privat';
const GEHACKT = 'https://www.bacs.admin.ch/de/konto-gehackt';
const MELDEN = 'https://www.report.ncsc.admin.ch/de/chat?path=406%3E407%3E1';

export const DigitaleOrdnung = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const absatz = (key) => React.createElement('p', { key, style: { ...s.stepText, marginTop: '8px' } }, t(key));
  const aussen = (key, href) => React.createElement('p', { key, style: { ...s.stepText, marginTop: '8px' } },
    React.createElement(ExternerLink, { t, href, style: { color: palette.sageDeep } }, t(key)));
  const schritt = (n, ...kinder) => React.createElement(AblaufStep, { key: n, palette, info: false, title: t('digitaleOrdnung.step' + n + 'Title') },
    React.createElement('p', { style: s.stepText }, t('digitaleOrdnung.step' + n + 'Text')),
    ...kinder);

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'digitaleordnung', icon: 'lock',
    title: t('digitaleOrdnung.title'),
    intro: t('digitaleOrdnung.intro'),
  },
    schritt(1,
      absatz('digitaleOrdnung.step1Text2'),
      aussen('digitaleOrdnung.step1Link', GERAETE),
      onNavigate && React.createElement(AblaufLink, { key: 'regal', palette, label: t('digitaleOrdnung.linkRegal'), onClick: () => onNavigate('direktlinks') })),
    schritt(2, aussen('digitaleOrdnung.step2Link', SICHERN)),
    schritt(3),
    schritt(4,
      absatz('digitaleOrdnung.step4Text2'),
      absatz('digitaleOrdnung.step4Text3'),
      aussen('digitaleOrdnung.step4Link', ROBINSON)),
    schritt(5,
      absatz('digitaleOrdnung.step5Text2'),
      aussen('digitaleOrdnung.step5Link', MUSTER),
      onNavigate && React.createElement(AblaufLink, { key: 'bv', palette, label: t('digitaleOrdnung.step5LinkBetreibung'), onClick: () => onNavigate('betreibungsauszug') }),
      onNavigate && React.createElement(AblaufLink, { key: 'sch', palette, label: t('digitaleOrdnung.step5LinkSchulden'), onClick: () => onNavigate('schulden') })),
    schritt(6, aussen('digitaleOrdnung.step6Link', ERSTE)),
    schritt(7,
      absatz('digitaleOrdnung.step7Text2'),
      aussen('digitaleOrdnung.step7Link', GEHACKT),
      aussen('digitaleOrdnung.step7LinkMelden', MELDEN)),
    schritt(8,
      onNavigate && React.createElement(AblaufLink, { key: 'va', palette, label: t('digitaleOrdnung.step8LinkVorsorge'), onClick: () => onNavigate('vorsorgeauftrag') })),
    React.createElement(AblaufFooter, { palette, t, quelle: t('digitaleOrdnung.quelle'), notes: [t('digitaleOrdnung.footerNote'), t('trust.localOnly')] })
  );
};

export default DigitaleOrdnung;
