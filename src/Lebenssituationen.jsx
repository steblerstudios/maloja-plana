import React, { useState } from 'react';
import { text, weight, leading, space, radius, ease, duration } from './config/tokens.js';
import { LEBENSZUSTAENDE } from './data/lebenszustaende.js';
import { getRegionaleVerguenstigungen } from './data/regionaleVerguenstigungen.js';
import { lookupPLZ } from './data/plzGemeinde.js';

// ─── Lebenssituationen (Subpage) ──────────────────────────
// Lebenszustände — andauernde Situationen, die versteckte Berechtigungen
// aufdecken. Selbst gewählt (kein Auto-Erkennen, keine Etikettierung),
// lokal gespeichert (or5_-Prefix). Reine Daten aus data/lebenszustaende.js.
// Vom Dashboard auf eine eigene Subpage gezogen (ruhigerer „Ort"):
// erreichbar über Link in „Was steht mir zu?", Werkzeug und Menü.
const Lebenssituationen = ({ palette, t, data, onNavigate }) => {
  const storageKey = 'or5_lebenszustaende';

  // Wohnkanton für kanton-bewusste Angebote — aus der PLZ abgeleitet (wie in UmzugAblauf),
  // Fallback auf ein explizit erfasstes basis.canton. Kein Auto-Erkennen von Anspruch, nur Ort.
  const userCanton = (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length >= 4) {
      const gem = lookupPLZ(plz);
      if (gem && gem.length) return gem[0].kanton;
    }
    return (data?.basis?.canton || '').trim() || null;
  })();

  // „Hat Kinder?" — für Berechtigungen, die nur mit Kindern relevant sind (z. B.
  // Betreuungsgutscheine). Aus dem Haushalt-Modell (children[]), Fallback Legacy-dependents.
  const hatKinder = (() => {
    const hh = data?.basis?.household;
    if (hh && Array.isArray(hh.children)) return hh.children.length > 0;
    return Number(data?.basis?.dependents || 0) > 0;
  })();
  const [active, setActive] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const toggle = (key) => {
    setActive((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* localStorage nicht verfügbar */ }
      return next;
    });
  };

  // Externe ↗-Karte (gleicher Stil wie die Berechtigungs-Karten), für regionale Angebote.
  const extCard = (key, url, titel, textStr) =>
    React.createElement('a', {
      key, href: url, target: '_blank', rel: 'noopener noreferrer',
      style: {
        display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
        padding: '10px 12px', marginBottom: space.xs + 'px',
        background: palette.surface, color: palette.text, textDecoration: 'none',
        border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: `border-color ${duration.normal}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
    },
      React.createElement('div', { key: 't', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, titel + ' ↗'),
      React.createElement('div', { key: 'x', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed } }, textStr)
    );

  // Kanton-bewusster Regional-Block: zeigt konkrete Angebote ('has'), einen ruhigen
  // Verweis auf die regionale KulturLegi ('check') oder würdevoll die Lücke ('none').
  const renderRegionalAngebote = () => {
    const regio = getRegionaleVerguenstigungen(userCanton);
    const kids = [
      React.createElement('div', {
        key: 'h',
        style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.text, margin: space.sm + 'px 0 ' + space.xs + 'px 0' }
      }, t('lebenszustaende.regio.title')),
    ];
    if (regio.state === 'has') {
      kids.push(extCard('kulturlegiRegion', regio.kulturlegiUrl, t('lebenszustaende.regio.kulturlegiRegion'), t('lebenszustaende.regio.kulturlegiRegionText')));
      regio.offers.forEach(o =>
        kids.push(extCard(o.key, o.url, t('lebenszustaende.regio.offers.' + o.key + '.titel'), t('lebenszustaende.regio.offers.' + o.key + '.text'))));
    } else if (regio.state === 'none') {
      kids.push(React.createElement('div', {
        key: 'none',
        style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', lineHeight: leading.relaxed, padding: '4px 2px' }
      }, t('lebenszustaende.regio.noneNote')));
    } else {
      kids.push(extCard('kulturlegiRegion', regio.kulturlegiUrl, t('lebenszustaende.regio.checkTitle'), t('lebenszustaende.regio.checkText')));
    }
    return React.createElement('div', { key: 'regio' }, kids);
  };

  return React.createElement('div', { style: { maxWidth: '640px' } },
    React.createElement('h1', {
      style: { fontSize: text.xl, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px 0', letterSpacing: '-0.3px' }
    }, t('lebenszustaende.pageTitle')),
    React.createElement('p', {
      style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: leading.relaxed }
    }, t('lebenszustaende.sectionIntro')),

    // Situations-Chips (ruhig, selbst wählbar)
    React.createElement('div', {
      style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' }
    },
      LEBENSZUSTAENDE.map((z) => {
        const on = active.includes(z.key);
        return React.createElement('button', {
          key: z.key,
          onClick: () => toggle(z.key),
          'aria-pressed': on,
          style: {
            padding: '8px 14px', borderRadius: radius.pill || radius.md,
            border: '1px solid ' + (on ? palette.sage + '88' : palette.border + '66'),
            background: on ? palette.sage + '18' : 'transparent',
            color: on ? (palette.sageDeep || palette.text) : palette.mid,
            fontSize: text.sm, fontWeight: on ? weight.medium : weight.normal,
            fontFamily: 'inherit', cursor: 'pointer',
            transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
          },
        }, t('lebenszustaende.' + z.key + '.label'));
      })
    ),

    // Aufgedeckte Berechtigungen je gewähltem Zustand
    LEBENSZUSTAENDE.filter((z) => active.includes(z.key)).map((z) =>
      React.createElement('div', {
        key: z.key,
        style: {
          marginTop: space.sm, padding: '16px 18px',
          background: palette.up, borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
        }, t('lebenszustaende.' + z.key + '.intro')),
        z.berechtigungen.filter((b) => !b.nurMitKindern || hatKinder).map((b) => {
          const isExternal = !!b.url;
          const baseKey = 'lebenszustaende.' + z.key + '.berechtigungen.' + b.key;
          const cardStyle = {
            display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
            padding: '10px 12px', marginBottom: space.xs + 'px',
            background: palette.surface, color: palette.text, textDecoration: 'none',
            border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: `border-color ${duration.normal}ms ${ease}`,
          };
          const hover = {
            onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
            onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
          };
          const inner = [
            React.createElement('div', {
              key: 'titel',
              style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text }
            }, t(baseKey + '.titel') + (isExternal ? ' ↗' : '')),
            React.createElement('div', {
              key: 'text',
              style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed }
            }, t(baseKey + '.text')),
            React.createElement('div', {
              key: 'quelle',
              style: { fontSize: text.xs - 1, color: palette.soft, marginTop: space.xs + 'px' }
            }, t('lebenszustaende.quelleLabel') + ': ' + b.quelle + ' · ' + t('lebenszustaende.standLabel') + ' ' + b.stand)
          ];
          return isExternal
            ? React.createElement('a', { key: b.key, href: b.url, target: '_blank', rel: 'noopener noreferrer', style: cardStyle, ...hover }, inner)
            : React.createElement('button', { key: b.key, type: 'button', onClick: () => onNavigate(b.view), style: cardStyle, ...hover }, inner);
        }),
        // Kanton-bewusste regionale Vergünstigungen (nur bei markierten Zuständen).
        z.zeigeRegionaleAngebote && renderRegionalAngebote()
      )
    )
  );
};

export default Lebenssituationen;
