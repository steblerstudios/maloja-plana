import React from 'react';
import { getLinkById, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, space, radius } from './config/tokens.js';
import { steuerkantonVorbelegung } from './utils/steuerkanton.js';
import { ExternerLink } from './components/ExternerLink.jsx';

// Reusable "mirror" of an official DirektLinks entry, shown in context next to a
// calculator or section (e.g. the Sozialhilfe link beside the Sozialhilfe view).
// `ohneRahmen` (Fassung 5, Prämienverbilligung): ohne Kasten und ohne eigenen Titel — für eine
// Aufklapp-Zeile, die «Offizielle Stelle & Antrag» schon als Überschrift trägt.
// `alsZeilen` (Rechner-Form X, F7-A2 27.10.2026): Teil 5 «Offizielle Stelle & Antrag» als Zeilen — Name mit
// Zeichen (ExternerLink), darunter Beschreibung und Antragsstelle; ohne Versalien und ohne ausgeschriebene Adresse.
export const OfficialLinkBox = ({ palette, t, data, ids, cantonalKey, ohneRahmen = false, alsZeilen = false }) => {
  const lang = t('dl.lang');
  const l = (obj) => (obj && (obj[lang] || obj.de)) || '';
  const links = (Array.isArray(ids) ? ids : [ids]).map(getLinkById).filter(Boolean);
  if (!links.length) return null;

  // K33/E23: Nur der Steuererklärungs-Link (TaxCalculator.jsx nutzt
  // cantonalKey:'steuererklaerung') zeigt auf den Steuerkanton — kann vom
  // Wohnkanton abweichen. Jeder andere Aufruf (Sozialhilfe, IPV, AHV, ALV …)
  // bleibt beim Wohnkanton. Dasselbe Vorbelegungsmuster wie im Steuerrechner
  // (PR #165), hier ohne Änderung an der Aufrufstelle in TaxCalculator.jsx.
  const canton = cantonalKey === 'steuererklaerung'
    ? steuerkantonVorbelegung(data)
    : (data && data.basis && data.basis.canton);
  const cantonalLinks = canton ? getCantonalLinks(canton) : null;
  const cantonalUrl = cantonalLinks && cantonalKey ? cantonalLinks[cantonalKey] : null;

  const linkStyle = {
    fontSize: text.xs, color: palette.sageDeep, textDecoration: 'underline',
    textUnderlineOffset: '2px', wordBreak: 'break-all',
  };
  // Der Behörden-/Quellenname ist der Link (semantisches Wort statt nackter URL,
  // vgl. Quellen-Link-Stil); die echte Gov-URL steht klein/gedimmt darunter als
  // Transparenz-Beleg, dass es eine offizielle Quelle ist.
  const nameLinkStyle = {
    fontWeight: weight.semi, fontSize: text.sm, color: palette.sageDeep,
    textDecoration: 'underline', textUnderlineOffset: '2px',
  };
  const urlHintStyle = {
    fontSize: text.xs, color: palette.mid, wordBreak: 'break-all', marginTop: '2px',
  };

  if (alsZeilen) {
    const zeile = { padding: space.sm + 'px 0', minHeight: '44px', boxSizing: 'border-box', borderBottom: '1px solid ' + palette.border };
    return React.createElement('div', null,
      links.map((link) => React.createElement('div', { key: link.id, style: zeile },
        React.createElement(ExternerLink, { t, href: link.url, style: nameLinkStyle }, l(link.name)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
          [l(link.beschreibung), t('dl.antragsstelle') + ': ' + l(link.antragsstelle)].filter(Boolean).join(' · '))
      )),
      cantonalUrl && React.createElement('div', { style: zeile },
        React.createElement(ExternerLink, { t, href: cantonalUrl, style: nameLinkStyle },
          t('dl.cantonalTitle', { canton: getCantonName(canton, t) }) + ' — ' + t('dl.cantonal.' + cantonalKey)))
    );
  }

  return React.createElement('div', {
    style: ohneRahmen ? { marginTop: space.xs + 'px' } : {
      marginTop: space.md + 'px', padding: space.md + 'px',
      background: palette.up, borderRadius: radius.sm + 'px',
      border: '1px solid ' + palette.border,
    }
  },
    !ohneRahmen && React.createElement('div', {
      style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.sm + 'px' }
    }, t('dl.mirrorTitle')),

    links.map((link, i) =>
      React.createElement('div', { key: link.id, style: { marginBottom: i < links.length - 1 ? space.sm + 'px' : 0 } },
        React.createElement(ExternerLink, { t, href: link.url, style: nameLinkStyle }, l(link.name)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, l(link.beschreibung)),
        React.createElement('div', { style: urlHintStyle }, link.url),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px' } }, t('dl.antragsstelle') + ': ' + l(link.antragsstelle))
      )
    ),

    cantonalUrl && React.createElement('div', {
      style: { marginTop: space.sm + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border }
    },
      React.createElement(ExternerLink, { t, href: cantonalUrl, style: linkStyle },
        t('dl.cantonalTitle', { canton: getCantonName(canton, t) }) + ' — ' + t('dl.cantonal.' + cantonalKey)
      )
    )
  );
};

export default OfficialLinkBox;
