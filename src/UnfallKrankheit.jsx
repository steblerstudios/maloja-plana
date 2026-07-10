import React from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Unfall oder Krankheit — was tun? Der 4. geführte Ablauf auf der Schale.
// Ruhige Orientierung: zuerst der Notfall (Nummern), dann der zentrale Schweizer
// Zusammenhang „wer zahlt?" (UVG bei Unfall vs. KVG bei Krankheit), dann
// Arbeitsunfähigkeit, dann Belege sichern. KEIN medizinischer/rechtlicher Rat.

// Schweizer Notrufnummern — bewusst die medizinisch relevanten zuerst.
const EMERGENCY = [
  { num: '144', key: 'sani' },
  { num: '1414', key: 'rega' },
  { num: '145', key: 'tox' },
  { num: '112', key: 'euro' },
];

export const UnfallKrankheit = ({ palette, t, chapters, onNavigate }) => {
  // Kapitel-Index über den Schlüssel auflösen (nicht hartkodieren) — robust gegen Umsortierung.
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);
  const s = {
    ...ablaufStyles(palette),
    cardWrap: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    card: { flex: '1 1 240px', padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border },
    cardTitle: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' },
    cardText: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal },
    telList: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: space.sm + 'px' },
    tel: { fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.semi, textDecoration: 'none', fontFamily: 'inherit' },
  };

  return React.createElement(AblaufContainer, {
    palette, icon: 'notfall',
    title: t('unfallKrankheit.title'),
    intro: t('unfallKrankheit.intro'),
  },
    // ── Schritt 1 — Im Notfall zuerst ──
    React.createElement(AblaufStep, { palette, title: t('unfallKrankheit.step1Title') },
      React.createElement('p', { style: s.stepText }, t('unfallKrankheit.step1Text')),
      React.createElement('div', { style: s.telList },
        EMERGENCY.map(e => React.createElement('a', {
          key: e.key, href: 'tel:' + e.num, style: s.tel,
        }, e.num + ' · ' + t('unfallKrankheit.num_' + e.key)))
      ),
      React.createElement('div', { style: s.note }, 'ⓘ ' + t('unfallKrankheit.step1Note')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('unfallKrankheit.step1Link'), onClick: () => onNavigate('notfalleinstieg') })
    ),

    // ── Schritt 2 — Wer zahlt? (Unfall = UVG, Krankheit = KVG) ──
    React.createElement(AblaufStep, { palette, title: t('unfallKrankheit.step2Title') },
      React.createElement('p', { style: s.stepText }, t('unfallKrankheit.step2Intro')),
      React.createElement('div', { style: s.cardWrap },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cardTitle }, t('unfallKrankheit.step2UnfallTitle')),
          React.createElement('div', { style: s.cardText }, t('unfallKrankheit.step2UnfallText'))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cardTitle }, t('unfallKrankheit.step2KrankheitTitle')),
          React.createElement('div', { style: s.cardText }, t('unfallKrankheit.step2KrankheitText'))
        )
      ),
      React.createElement('div', { style: s.note }, 'ⓘ ' + t('unfallKrankheit.step2Note'))
    ),

    // ── Schritt 3 — Wenn du nicht arbeiten kannst ──
    React.createElement(AblaufStep, { palette, title: t('unfallKrankheit.step3Title') },
      React.createElement('p', { style: s.stepText }, t('unfallKrankheit.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('unfallKrankheit.step3Link'), onClick: () => onNavigate('chapter', chapterIdx('versicherungen')) })
    ),

    // ── Schritt 4 — Belege sammeln & ablegen ──
    React.createElement(AblaufStep, { palette, title: t('unfallKrankheit.step4Title') },
      React.createElement('p', { style: s.stepText }, t('unfallKrankheit.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('unfallKrankheit.step4LinkScan'), onClick: () => onNavigate('kk') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('unfallKrankheit.step4LinkAblage'), onClick: () => onNavigate('tresor', undefined, 'versicherungen') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('unfallKrankheit.footerOrientation'), t('trust.localOnly')] })
  );
};

export default UnfallKrankheit;
