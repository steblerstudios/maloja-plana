import React from 'react';
import { AblaufContainer, ablaufStyles } from './AblaufSchale.jsx';
import { MahnungTeil } from './MahnungErhalten.jsx';
import { BetreibungTeil } from './BetreibungErhalten.jsx';
import { text, weight, radius, space } from './config/tokens.js';

// «Mahnung oder Zahlungsbefehl — was tun?» — seit 24.10.2026 EINE Seite für «Mahnung erhalten» und «Betreibung
// erhalten» (docs/entscheide/seiten-buendeln.md, Gruppe E, Entscheid 5). Oben die Wahl, was
// angekommen ist; darunter nur der gewählte Teil, Schritte und Quellen unverändert.
// Bewusst kein Aufklappen: die 10-Tage-Frist des Rechtsvorschlags (SchKG Art. 74) steht, wer
// über «Betreibung» kommt, sofort oben — nie hinter einer zugeklappten Zeile.
// Die zwei Adressen bleiben (#/mahnung, #/betreibung) und wählen die Stufe; die Wahl wechselt
// die Adresse, damit «Zurück» und Lesezeichen stimmen.

export const STUFEN = ['mahnung', 'betreibung'];

export const RechnungOffen = ({ palette, t, onNavigate, stufe = 'mahnung' }) => {
  const s = ablaufStyles(palette);
  const aktiv = STUFEN.includes(stufe) ? stufe : 'mahnung';
  const knopf = (key) => React.createElement('button', {
    key, type: 'button', 'aria-pressed': aktiv === key, 'data-stufe': key,
    onClick: () => { if (key !== aktiv && onNavigate) onNavigate(key); },
    style: {
      flex: '1 1 0', minHeight: '44px', padding: '8px 12px', fontFamily: 'inherit', fontSize: text.sm,
      cursor: key === aktiv ? 'default' : 'pointer', borderRadius: radius.sm,
      border: '1px solid ' + (aktiv === key ? palette.text : palette.border),
      background: aktiv === key ? palette.up : 'none',
      color: aktiv === key ? palette.text : palette.mid,
      fontWeight: aktiv === key ? weight.semi : weight.normal,
    },
  }, t(key === 'betreibung' ? 'rechnungOffen.stufeBetreibung' : 'rechnungOffen.stufeMahnung'));

  return React.createElement(AblaufContainer, {
    palette, icon: 'money',
    title: t('rechnungOffen.title'),
    intro: t('rechnungOffen.intro'),
  },
    React.createElement('div', { role: 'group', 'aria-labelledby': 'mp-rechnung-frage', style: { margin: space.sm + 'px 0 ' + space.md + 'px' } },
      React.createElement('div', { id: 'mp-rechnung-frage', style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs + 'px' } }, t('rechnungOffen.frage')),
      React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } }, STUFEN.map(knopf))
    ),
    // Die Einleitung des gewählten Teils — wie bisher oben auf seiner eigenen Seite.
    React.createElement('p', { 'data-teil': 'stufe-intro', style: { ...s.stepText, marginBottom: space.sm + 'px' } }, t(aktiv + '.intro')),
    aktiv === 'betreibung'
      ? React.createElement(BetreibungTeil, { palette, t, onNavigate })
      : React.createElement(MahnungTeil, { palette, t, onNavigate })
  );
};

export default RechnungOffen;
