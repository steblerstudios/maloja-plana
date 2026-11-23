import React, { useState, useId } from 'react';
import { ErgebnisArt } from './components/ErgebnisArt.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { betrag, betragSpanne } from './utils/geld.js';
import { auswahlStil } from './components/PrimaryButton.jsx';
import { berechnePflegeUebersicht, GUTSCHRIFT_STATUS } from './data/pflegeUebersicht.js';

// «Was zusammenkommt» — Übersicht am Ende des Pflege-Ablaufs. Liest die Ergebnisse der beiden
// eingebetteten Rechner (Entlöhnung, Hilflosenentschädigung) und fragt nach den Bedingungen der
// Betreuungsgutschrift. Drei getrennte Zeilen, weil das Geld drei verschiedenen Stellen zufliesst —
// bewusst kein Gesamttotal. Logik und Quellen: data/pflegeUebersicht.js. Nichts wird gespeichert.

const JA_NEIN = [true, false];

export const PflegeUebersicht = ({ palette, t, lohn, he }) => {
  const [erreichbar, setErreichbar] = useState(null);
  const [mind180Tage, setMind180Tage] = useState(null);
  const [verheiratet, setVerheiratet] = useState(false);
  const [anzahl, setAnzahl] = useState(1);
  const [erziehung, setErziehung] = useState(null);
  const [referenzalter, setReferenzalter] = useState(null);
  const idBasis = useId();

  const r = berechnePflegeUebersicht({ lohn, he, erreichbar, mind180Tage, erziehung, referenzalter, anzahlBetreuende: anzahl, verheiratet });
  const g = r.gutschrift;

  const s = {
    wrap: { marginTop: space.sm + 'px' },
    frage: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium, margin: space.sm + 'px 0 ' + space.xs + 'px' },
    row: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' },
    toggle: (active) => ({ ...auswahlStil(palette, active), padding: '8px 16px', fontSize: text.sm, fontWeight: active ? weight.semi : weight.normal, minHeight: '44px', minWidth: '44px' }),
    result: { marginTop: space.md + 'px', padding: space.md + 'px', background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.lg + 'px' },
    zeile: { padding: space.xs + 'px 0' },
    trenner: { borderTop: '1px solid ' + palette.sage, margin: space.xs + 'px 0' },
    label: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' },
    big: { fontSize: text.body, fontWeight: weight.bold, color: palette.text, fontVariantNumeric: 'tabular-nums' },
    sub: { fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.relaxed },
    note: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, marginTop: space.sm + 'px' },
  };

  // Die sichtbare Frage benennt die Gruppe (aria-labelledby) — so wird sie nur einmal vorgelesen.
  const auswahl = (name, frage, optionen, wert, setzen) =>
    React.createElement('div', { role: 'group', 'aria-labelledby': idBasis + name },
      React.createElement('div', { id: idBasis + name, style: s.frage }, frage),
      React.createElement('div', { style: s.row },
        optionen.map((o) => React.createElement('button', {
          key: String(o.v), type: 'button', 'aria-pressed': wert === o.v,
          style: s.toggle(wert === o.v), onClick: () => setzen(o.v),
        }, o.l))
      )
    );
  const jaNein = JA_NEIN.map((v) => ({ v, l: t(v ? 'common.yes' : 'common.no') }));
  const monat = ' / ' + t('pflege.uebersicht.monat');

  const zeile = (key, label, wert, sub) => React.createElement('div', { key, style: s.zeile },
    React.createElement('div', { style: s.label }, label),
    React.createElement('div', { style: s.big }, wert),
    sub && React.createElement('div', { style: s.sub }, sub));

  // Zeile 1 — an die pflegende Person
  const zeileDich = zeile('dich', t('pflege.uebersicht.anDich'),
    r.anDich ? betragSpanne(r.anDich.monatVon, r.anDich.monatBis) + monat : t('pflege.uebersicht.leer'),
    r.anDich && t('pflege.uebersicht.anDichSub'));

  // Zeile 2 — an die gepflegte Person
  let heWert = t('pflege.uebersicht.leer');
  if (r.anGepflegte?.monat != null) heWert = betrag(r.anGepflegte.monat) + monat;
  else if (r.anGepflegte?.spanne) heWert = betragSpanne(r.anGepflegte.spanne.min, r.anGepflegte.spanne.max) + monat;
  else if (he && he.anspruch === false) heWert = t('pflege.uebersicht.keineHe');
  // Sind die Beträge des Jahres nur aus dem Gesetz gerechnet (keine amtliche Tabelle), sagt die Übersicht
  // das wie der Rechner selbst (Predeploy 23.11.2026, swiss-precision: der Hinweis fehlte hier).
  const heSub = [
    r.anGepflegte?.spanne && t('pflege.uebersicht.gradOffen'),
    r.anGepflegte && he?.gerechnet && t('hilflos.gerechnetNote', { jahr: he.jahr }),
  ].filter(Boolean).join(' ');
  const zeileGepflegt = zeile('gepflegt', t('pflege.uebersicht.anGepflegte'), heWert, heSub || null);

  // Zeile 3 — später in der Rente (Betreuungsgutschrift). «angerechnet, kein Geld» steht in der grossen
  // Zeile selbst: der Betrag ist Einkommen auf dem AHV-Konto, nicht Rente (Predeploy 23.11.2026).
  const gWert = g.status === GUTSCHRIFT_STATUS.NEIN
    ? t('pflege.uebersicht.gutschriftNein')
    : t('pflege.uebersicht.heute') + ' ' + betrag(g.betragJahr) + ' / ' + t('pflege.uebersicht.jahr') + ' · ' + t('pflege.uebersicht.angerechnet');
  const gSub = [
    g.status !== GUTSCHRIFT_STATUS.NEIN && t('pflege.uebersicht.betragHinweis'),
    t('pflege.uebersicht.grund.' + (g.grund || 'ja')),
    g.status !== GUTSCHRIFT_STATUS.NEIN && (g.geteilt || g.anzahl > 1)
      && t('pflege.uebersicht.geteiltSub', { voll: betrag(g.vollerBetragJahr) }),
  ].filter(Boolean).join(' ');
  const zeileRente = zeile('rente', t('pflege.uebersicht.rente'), gWert, gSub);

  return React.createElement('div', { style: s.wrap },
    auswahl('erreichbar', t('pflege.uebersicht.frageErreichbar'), jaNein, erreichbar, setErreichbar),
    auswahl('tage', t('pflege.uebersicht.frage180'), jaNein, mind180Tage, setMind180Tage),
    auswahl('erziehung', t('pflege.uebersicht.frageErziehung'), jaNein, erziehung, setErziehung),
    auswahl('referenzalter', t('pflege.uebersicht.frageReferenzalter'), jaNein, referenzalter, setReferenzalter),
    auswahl('ehe', t('pflege.uebersicht.frageVerheiratet'), jaNein, verheiratet, setVerheiratet),
    auswahl('anzahl', t('pflege.uebersicht.frageAnzahl'), [1, 2, 3, 4].map((n) => ({ v: n, l: String(n) })), anzahl, setAnzahl),
    React.createElement('div', { style: s.result, 'aria-live': 'polite', 'aria-atomic': 'true' },
      zeileDich,
      React.createElement('div', { style: s.trenner }),
      zeileGepflegt,
      React.createElement('div', { style: s.trenner }),
      zeileRente
    ),
    React.createElement(ErgebnisArt, { palette, t, ergebnis: r.ergebnis }),
    g.status !== GUTSCHRIFT_STATUS.NEIN && React.createElement('div', { style: s.note }, t('pflege.uebersicht.hinweisJahre')),
    React.createElement('div', { style: s.note }, t('pflege.uebersicht.keinTotal')),
    React.createElement('div', { style: s.note }, t('pflege.uebersicht.lohnUndGutschrift')),
    r.eoHinweis && React.createElement('div', { style: s.note }, t('pflege.uebersicht.eoHinweis')),
    React.createElement('div', { style: s.note }, t('pflege.uebersicht.stand', { jahr: r.jahr }))
  );
};

export default PflegeUebersicht;
