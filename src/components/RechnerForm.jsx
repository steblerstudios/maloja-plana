import React from 'react';
import { PageTitle } from './Heading.jsx';
import { ErgebnisArt } from './ErgebnisArt.jsx';
import { Icon } from '../IconSystem.jsx';
import { text, weight, space, radius, leading } from '../config/tokens.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { RECHNER_KAPITEL } from '../config/brotkrumePfade.js';
import { ansichtIkon } from '../config/ansichtenRegister.js';
import { chapterColor } from '../data/lebensbereiche.js';
import { kontrast, lesbareFarbe } from '../utils/lebensbereichFruechte.js';

// Rechner-Form X — die EINE Hülle für alle Rechner (Entscheid Stebler Studios 24.10.2026, «Entwurf X passt
// für alle Rechner»; gebaut F7-A2, 27.10.2026). Wortlaut: docs/design/mockups-stardust-2026-10-23/VERGLEICH.md,
// «Rechner-Form (X) · entschieden». Steuern und IPV haben die Form schon (Fassung 5) und bleiben, wie sie sind.
//
// Sechs Teile, immer in dieser Reihenfolge — die Rechner liefern nur den Inhalt:
//   (1) Kopf links: Brotkrume «Übersicht › Kapitel › Rechner», Bereichssymbol, Titel, Satz
//   (2) Ergebnis zuerst: eine grosse Zahl, wenige Zeilen, Vorbehalt (ErgebnisArt) direkt darunter, role="status".
//       Ohne Ergebnis steht an derselben Stelle der App-Satz und «Noch n Angaben nötig» (ErgebnisArt).
//   (3) «Ihre Angaben» aufgeklappt, mit «x von n»
//   (4) was zu tun ist / wo man sich meldet
//   (5) «Offizielle Stelle & Antrag» als Zeilen mit ↗ (OfficialLinkBox `alsZeilen`)
//   (6) Quelle · Stand — feste Zeile, dieselbe Stelle in jedem Rechner (F7-R6)
// Keine Kartenwand, kein Kopf in einer Karte. Die Teile tragen `data-teil` — daran prüfen die Tests die
// Reihenfolge, ohne an Texten zu hängen (rechnerForm.test.js).

// Kapitel-Farbe für das Bereichssymbol, wie AblaufSchale `ablaufFarbe`: das Zeichen ist Grafik, 3:1 genügt
// (WCAG 1.4.11). Ohne lesbare Palette (Tests mit Platzhalter-Farben) bleibt es bei palette.text.
const zeichenFarbe = (palette, kapitel) => {
  try {
    const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
    const farbe = chapterColor(kapitel, dunkel);
    return farbe ? { flaeche: farbe, zeichen: lesbareFarbe(farbe, palette.bg, dunkel, 3) } : null;
  } catch { return null; }
};

const abschnittTitel = (palette, id, inhalt) => React.createElement('h3', {
  id, style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px' },
}, inhalt);

export const RechnerForm = ({
  palette, t, view, onNavigate, titel, satz,
  etikett, ergebnis, ohneErgebnis, art, vorbehalt, instrument,
  angaben, tun, stelle, quelle, children, reiter,
}) => {
  const kapitel = RECHNER_KAPITEL[view] || null;
  const farbe = kapitel ? zeichenFarbe(palette, kapitel) : null;
  const stufe = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: palette.mid, padding: 0, minHeight: '44px', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: palette.border };
  const pfeil = (k) => React.createElement('span', { key: k, 'aria-hidden': 'true', style: { color: palette.mid, fontSize: text.xs } }, '›');
  const id = (teil) => 'rf-' + view + '-' + teil;

  const teile = [
    // (2) Ergebnis zuerst — als Live-Region, damit eine neue Zahl angesagt wird.
    React.createElement('section', { 'aria-labelledby': etikett ? id('ergebnis') : undefined, style: { padding: space.sm + 'px 0 ' + space.md + 'px', borderBottom: '1px solid ' + palette.border } },
      React.createElement('div', { 'data-teil': 'ergebnis', role: 'status', 'aria-live': 'polite' },
        etikett && React.createElement('div', { id: id('ergebnis'), style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs + 'px' } }, etikett),
        ergebnis || (ohneErgebnis && React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: leading.normal, margin: 0 } }, ohneErgebnis)),
        vorbehalt,
        React.createElement(ErgebnisArt, { palette, t, ergebnis: art })
      ),
      // Ein Instrument (Grafik mit Regler) steht unter der Live-Region: sonst würde jede Bewegung angesagt.
      instrument || null
    ),

    // (3) Ihre Angaben — aufgeklappt, mit «x von n».
    angaben && React.createElement('details', { 'data-teil': 'angaben', open: true, style: { borderBottom: '1px solid ' + palette.border, padding: '0 0 ' + space.sm + 'px' } },
      React.createElement('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.body, fontWeight: weight.semi, color: palette.text } },
        React.createElement('span', null, t('rechnerForm.angaben')),
        angaben.gesamt > 0 && React.createElement('b', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, fontVariantNumeric: 'tabular-nums' } }, t('rechnerForm.vonN', { x: angaben.erfasst, n: angaben.gesamt }))
      ),
      angaben.inhalt
    ),

    // (4) Was zu tun ist / wo man sich meldet
    tun && React.createElement('section', { 'data-teil': 'tun', 'aria-labelledby': id('tun'), style: { padding: space.md + 'px 0', borderBottom: '1px solid ' + palette.border } },
      abschnittTitel(palette, id('tun'), tun.titel || t('rechnerForm.tun')),
      tun.inhalt
    ),

    // Was ein Rechner darüber hinaus zeigt (Erklärungen, Listen) — nach der Form, vor der Stelle.
    children || null
  ];

  return React.createElement('div', { 'data-rechner-form': view, style: { maxWidth: '720px', color: palette.text } },
    // (1) Kopf links
    React.createElement('div', { 'data-teil': 'kopf' },
      React.createElement('nav', { 'aria-label': t('nav.pfad'), style: { marginBottom: space.xs + 'px' } },
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 8px' } },
          React.createElement('button', { type: 'button', className: 'mp-link', style: stufe, onClick: () => onNavigate && onNavigate('dashboard') }, t('nav.backToDashboard')),
          kapitel && pfeil('p1'),
          kapitel && React.createElement('button', { type: 'button', className: 'mp-link', style: stufe, onClick: () => onNavigate && onNavigate('chapter', CHAPTER_KEYS.indexOf(kapitel)) }, t('chapters.' + kapitel + '.title')),
          pfeil('p2'),
          React.createElement('span', { 'aria-current': 'page', style: { fontSize: text.xs, color: palette.text } }, titel)
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: space.sm + 'px' } },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '48px', height: '48px', borderRadius: radius.lg + 'px', flexShrink: 0, display: 'grid', placeItems: 'center', background: (farbe ? farbe.flaeche : palette.sage) + '2E', color: farbe ? farbe.zeichen : palette.text } },
          React.createElement(Icon, { name: ansichtIkon(view), size: 24 })),
        // Lange Titel («Arbeitslosenentschädigung») brechen mit Silbentrennung (Heading.jsx `umbruch`).
        React.createElement(PageTitle, { palette, style: { fontSize: 'clamp(22px, 6.4vw, 30px)', lineHeight: 1.1, minWidth: 0 } }, titel)
      ),
      satz && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px', maxWidth: '560px' } }, satz)
    ),

    // Reiter (Schulden, KVG, Vorsorge): Teile 2–4 sind das Reiter-Feld; Stelle und Quelle gelten für alle.
    reiter ? React.createElement(Tabs, { palette, ...reiter }, ...teile) : React.createElement(React.Fragment, null, ...teile),

    // (5) Offizielle Stelle & Antrag
    stelle && React.createElement('section', { 'data-teil': 'stelle', 'aria-labelledby': id('stelle'), style: { padding: space.md + 'px 0 0' } },
      abschnittTitel(palette, id('stelle'), t('dl.mirrorTitle')),
      stelle
    ),

    // (6) Quelle · Stand
    quelle && React.createElement('div', { 'data-teil': 'quelle', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: space.lg + 'px' } }, quelle)
  );
};

// Die grosse Zahl (Teil 2): Beschriftung links, Betrag rechts — eine pro Rechner.
export const ErgebnisZahl = ({ palette, label, wert }) => React.createElement('div', {
  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md + 'px', flexWrap: 'wrap' },
},
  React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, label),
  React.createElement('b', { 'data-grosse-zahl': '', style: { fontSize: '26px', fontWeight: weight.bold, color: palette.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, wert)
);

// Eine der wenigen Zeilen unter der grossen Zahl.
export const ErgebnisZeile = ({ palette, label, wert }) => React.createElement('div', {
  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md + 'px', padding: '6px 0', borderBottom: '1px solid ' + palette.border + '66', fontSize: text.sm },
},
  React.createElement('span', { style: { color: palette.mid } }, label),
  React.createElement('span', { style: { color: palette.text, textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }, wert)
);

// Einzelwahl als radiogroup (a11y M2): Pfeiltasten wählen und wandern, nur die gewählte Option ist im
// Tab-Weg (roving tabindex, WAI-ARIA «Radio Group»). `optionen`: [{ wert, label }].
export const Einzelwahl = ({ palette, id, label, hinweis, optionen, wert, onWahl }) => {
  const index = optionen.findIndex((o) => o.wert === wert);
  const taste = (e, i) => {
    const schritt = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!schritt) return;
    e.preventDefault();
    const n = (i + schritt + optionen.length) % optionen.length;
    onWahl(optionen[n].wert);
    const knoepfe = e.currentTarget.parentNode && e.currentTarget.parentNode.children;
    if (knoepfe && knoepfe[n]) knoepfe[n].focus();
  };
  return React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
    React.createElement('div', { id: id + '-label', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: '2px' } }, label),
    hinweis && React.createElement('div', { id: id + '-hinweis', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '4px' } }, hinweis),
    React.createElement('div', { role: 'radiogroup', 'aria-labelledby': id + '-label', 'aria-describedby': hinweis ? id + '-hinweis' : undefined, style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
      optionen.map((o, i) => {
        const an = o.wert === wert;
        return React.createElement('button', {
          key: String(o.wert), type: 'button', role: 'radio', 'aria-checked': an,
          tabIndex: an || (index < 0 && i === 0) ? 0 : -1,
          onClick: () => onWahl(o.wert),
          onKeyDown: (e) => taste(e, i),
          style: {
            minHeight: '44px', padding: '8px 16px', fontSize: text.sm, fontFamily: 'inherit', cursor: 'pointer', borderRadius: radius.sm + 'px',
            fontWeight: an ? weight.semi : weight.normal,
            border: '1px solid ' + (an ? palette.sage : palette.border),
            background: an ? palette.sage + '22' : palette.surface,
            color: an ? (palette.sageDeep || palette.text) : palette.text,
          },
        }, o.label);
      })
    )
  );
};

// Reiter (a11y M4, Entscheid X: «Reiter/Tabs werden eine Tabs-Komponente mit Pfeiltasten»): tablist/tab/tabpanel,
// Pfeil links/rechts wandern und wählen, Pos1/Ende springen; nur der aktive Reiter ist im Tab-Weg.
// `liste`: [{ key, label }]. Der Inhalt (children) ist das eine Reiter-Feld, es beschriftet sich nach dem aktiven Reiter.
export const Tabs = ({ palette, id, label, liste, aktiv, onWahl, children }) => {
  const taste = (e, i) => {
    const ziel = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: liste.length - 1 }[e.key];
    if (ziel == null) return;
    e.preventDefault();
    const n = (ziel + liste.length) % liste.length;
    onWahl(liste[n].key);
    const el = typeof document !== 'undefined' && document.getElementById(id + '-tab-' + liste[n].key);
    if (el) el.focus();
  };
  return React.createElement(React.Fragment, null,
    React.createElement('div', { role: 'tablist', 'aria-label': label, style: { display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0 ' + space.sm + 'px', margin: '0 0 ' + space.xs + 'px' } },
      liste.map((r, i) => {
        const an = r.key === aktiv;
        return React.createElement('button', {
          key: r.key, id: id + '-tab-' + r.key, type: 'button', role: 'tab',
          'aria-selected': an, 'aria-controls': id + '-panel', tabIndex: an ? 0 : -1,
          onClick: () => onWahl(r.key), onKeyDown: (e) => taste(e, i),
          style: {
            flexShrink: 0, minHeight: '44px', padding: '8px 14px', fontSize: text.sm, fontFamily: 'inherit', cursor: 'pointer',
            borderRadius: radius.full + 'px', whiteSpace: 'nowrap',
            fontWeight: an ? weight.semi : weight.medium,
            border: '1px solid ' + (an ? palette.sage : palette.border),
            background: an ? palette.sage + '22' : 'transparent',
            color: an ? (palette.sageDeep || palette.text) : palette.text,
          },
        }, r.label);
      })
    ),
    React.createElement('div', { role: 'tabpanel', id: id + '-panel', 'aria-labelledby': id + '-tab-' + aktiv, tabIndex: 0 }, children)
  );
};

export default RechnerForm;
