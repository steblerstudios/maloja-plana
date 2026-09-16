import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';
import { getCantonName } from '../config/cantonalData.js';
import { getLinkById, getCantonalLinks } from '../data/direktLinks.js';

// E38: Wenn die Tabelle für die Kantons- und Gemeindesteuer nicht trägt (Einkommen ausserhalb,
// Lage nicht gemessen), zeigen TaxCalculator und FinanzUebersicht keine Zahl, sondern diesen
// ruhigen Weg zum amtlichen Rechner und zur kantonalen Steuerverwaltung.
// schaetzung = Rückgabe von schaetzeKantonaleSteuer() (src/data/kantonaleSteuerdaten.js).

// Tausendertrennung wie in FinanzUebersicht/dossierGenerator — nicht von der Laufzeit-Locale abhängig.
const chf = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');

export const orientierungsText = (t, schaetzung, jahr) =>
  schaetzung.lage === 'ausserhalb' && schaetzung.bereich
    ? t('tax.bandOutside', { min: chf(schaetzung.bereich.min), max: chf(schaetzung.bereich.max), year: jahr })
    : schaetzung.grund === 'partner'
      ? t('tax.bandNotCheckedPartner')
      : schaetzung.grund === 'brutto'
        ? t('tax.bandNotCheckedBrutto')
        : t('tax.bandNotChecked');

export const KantonssteuerOrientierung = ({ palette, t, canton, schaetzung, jahr, style }) => {
  const kantonsLink = canton ? (getCantonalLinks(canton) || {}).steuererklaerung : null;
  const estvLink = getLinkById('steuern');
  const linkStyle = { fontSize: text.sm, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px', fontWeight: weight.medium };
  return React.createElement('div', { 'data-testid': 'kantonssteuer-orientierung', style: { marginBottom: space.md, padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border, ...style } },
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } },
      t('tax.cantonalAndMunicipal') + ' · ' + getCantonName(canton, t)
    ),
    React.createElement('p', { style: { margin: 0, marginBottom: space.sm, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } },
      orientierungsText(t, schaetzung, jahr)
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs } },
      estvLink && React.createElement('a', { href: estvLink.url, target: '_blank', rel: 'noopener noreferrer', style: linkStyle }, '→ ' + t('tax.bandLinkEstv')),
      kantonsLink && React.createElement('a', { href: kantonsLink, target: '_blank', rel: 'noopener noreferrer', style: linkStyle }, '→ ' + t('tax.bandLinkKanton', { canton: getCantonName(canton, t) }))
    )
  );
};
