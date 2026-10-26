import React, { useState } from 'react';
import { ErgebnisArt } from './components/ErgebnisArt.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { zahl } from './utils/geld.js';
import { berechneHilflosenentschaedigung, heErgebnis, GRADE } from './data/hilflosenentschaedigung.js';

// Hilflosenentschädigung — kleiner Rechner, eingebettet in die Abläufe «Angehörige pflegen» und
// «Krankheit & IV» (keine eigene Seite, Entscheid «Seiten bündeln» 24.10.2026).
// Fragt: wer zahlt (IV / AHV / Kind), Wohnform, Grad. Ohne Grad zeigt er nur die Spanne — den
// Grad legt die IV-Stelle fest. Beträge und Quellen: data/hilflosenentschaedigung.js.
// Nichts wird gespeichert; die Antworten leben nur in dieser Ansicht.

const PERSON = ['iv', 'ahv', 'kind'];

export const HilflosenRechner = ({ palette, t }) => {
  const [person, setPerson] = useState('iv');
  const [wohnen, setWohnen] = useState('zuhause');
  const [grad, setGrad] = useState(null);
  const [besitzstandIV, setBesitzstandIV] = useState(false);
  const [intensivStunden, setIntensivStunden] = useState(0);

  const minderjaehrig = person === 'kind';
  const traeger = person === 'ahv' ? 'ahv' : 'iv';
  const r = berechneHilflosenentschaedigung({ traeger, grad, wohnen, minderjaehrig, besitzstandIV, intensivStunden });
  const chf = (v) => 'CHF ' + zahl(v);

  const s = {
    wrap: { marginTop: space.sm + 'px' },
    frage: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium, margin: space.sm + 'px 0 ' + space.xs + 'px' },
    row: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' },
    toggle: (active) => ({ padding: '8px 14px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sageDeep : palette.text, cursor: 'pointer', fontFamily: 'inherit', minHeight: '44px' }),
    result: { marginTop: space.md + 'px', padding: space.md + 'px', background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.sm + 'px' },
    resultLabel: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' },
    big: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, fontVariantNumeric: 'tabular-nums' },
    sub: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed },
    note: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, marginTop: space.sm + 'px' },
    extLink: { display: 'inline-block', fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.medium, marginTop: space.sm + 'px', textDecoration: 'none' },
  };

  const auswahl = (frage, optionen, wert, setzen) =>
    React.createElement('div', { role: 'group', 'aria-label': frage },
      React.createElement('div', { style: s.frage }, frage),
      React.createElement('div', { style: s.row },
        optionen.map((o) => React.createElement('button', {
          key: String(o.v), type: 'button', 'aria-pressed': wert === o.v,
          style: s.toggle(wert === o.v), onClick: () => setzen(o.v),
        }, o.l))
      )
    );

  // Ergebnis-Box: Betrag, Spanne oder ein ruhiger Satz, warum es keinen Betrag gibt.
  let ergebnisInhalt;
  if (r.grund === 'minderjaehrig_heim') {
    ergebnisInhalt = React.createElement('div', { style: s.sub }, t('hilflos.kindHeim'));
  } else if (r.grund === 'ahv_leicht_heim') {
    ergebnisInhalt = React.createElement('div', { style: s.sub }, t('hilflos.ahvLeichtHeim'));
  } else if (r.grund === 'grad_offen') {
    ergebnisInhalt = [
      React.createElement('div', { key: 'l', style: s.resultLabel }, t('hilflos.spanneLabel')),
      React.createElement('div', { key: 'b', style: s.big }, chf(r.spanne.min) + ' – ' + chf(r.spanne.max) + ' / ' + t('hilflos.monat')),
      React.createElement('div', { key: 's', style: s.sub }, t('hilflos.gradWaehlen')),
    ];
  } else {
    ergebnisInhalt = [
      React.createElement('div', { key: 'l', style: s.resultLabel }, t('hilflos.resultLabel')),
      React.createElement('div', { key: 'b', style: s.big }, chf(r.totalMonat) + ' / ' + t('hilflos.monat')),
      React.createElement('div', { key: 's', style: s.sub },
        '≈ ' + chf(r.totalJahr) + ' / ' + t('hilflos.jahr')
        + (r.intensivMonat ? ' · ' + t('hilflos.davonIntensiv', { betrag: chf(r.intensivMonat) }) : '')),
      r.besitzstand && React.createElement('div', { key: 'bs', style: s.sub }, t('hilflos.besitzstandNote')),
    ];
  }

  const gradOptionen = [
    ...GRADE.map((g) => ({ v: g, l: t('hilflos.grad.' + g) })),
    { v: null, l: t('hilflos.grad.offen') },
  ];

  return React.createElement('div', { style: s.wrap },
    auswahl(t('hilflos.frageWer'), PERSON.map((p) => ({ v: p, l: t('hilflos.wer.' + p) })), person, setPerson),
    auswahl(t('hilflos.frageWohnen'), [
      { v: 'zuhause', l: t('hilflos.wohnen.zuhause') },
      { v: 'heim', l: t('hilflos.wohnen.heim') },
    ], wohnen, setWohnen),
    auswahl(t('hilflos.frageGrad'), gradOptionen, grad, setGrad),
    React.createElement('div', { style: s.note }, t('hilflos.gradErklaerung')),
    person === 'ahv' && auswahl(t('hilflos.frageBesitzstand'), [
      { v: false, l: t('common.no') },
      { v: true, l: t('common.yes') },
    ], besitzstandIV, setBesitzstandIV),
    minderjaehrig && wohnen === 'zuhause' && auswahl(t('hilflos.frageIntensiv'), [
      { v: 0, l: t('hilflos.intensiv.keine') },
      { v: 4, l: t('hilflos.intensiv.h', { n: 4 }) },
      { v: 6, l: t('hilflos.intensiv.h', { n: 6 }) },
      { v: 8, l: t('hilflos.intensiv.h', { n: 8 }) },
    ], intensivStunden, setIntensivStunden),
    React.createElement('div', { style: s.result, 'aria-live': 'polite' }, ergebnisInhalt),
    React.createElement(ErgebnisArt, { palette, t, ergebnis: heErgebnis({ grad }) }),
    React.createElement('div', { style: s.note }, t(r.traeger === 'ahv' ? 'hilflos.wartezeitAhv' : 'hilflos.wartezeitIv')),
    React.createElement('div', { style: s.note }, t('hilflos.unabhaengig')),
    r.gerechnet && React.createElement('div', { style: s.note }, t('hilflos.gerechnetNote', { jahr: r.jahr })),
    React.createElement('div', { style: s.note }, t('hilflos.folgen')),
    React.createElement(ExternerLink, {
      t, style: s.extLink,
      // Merkblätter gibt es auf d/f/i; en und rm führen aufs deutsche (hilflos.merkblattSprache).
      href: 'https://www.ahv-iv.ch/p/' + (r.traeger === 'ahv' ? '3.01' : '4.13') + '.' + t('hilflos.merkblattSprache'),
    }, t(r.traeger === 'ahv' ? 'hilflos.linkAhv' : 'hilflos.linkIv'))
  );
};

export default HilflosenRechner;
