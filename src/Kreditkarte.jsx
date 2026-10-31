import React from 'react';
import { RechnerForm } from './components/RechnerForm.jsx';
import { hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { betrag } from './utils/geld.js';
import { karteRechnen, VORTEILE, VERSICHERUNG_STATUS } from './utils/kreditkarte.js';

// «Lohnt sich meine Karte?» — pro Kreditkarte Kosten gegen Vorteile, aufs Jahr gerechnet.
// Wunsch und Skizze Stebler Studios 27.09.2026 (Flächen A–E):
//   A Karte + Jahresgebühr · B Ausgaben (Schnitt/Monat, Fremdwährung, Zinsen) · C Vorteile
//   D die Rechnung als ruhige Balken · E ein Satz als Ergebnis.
// Gespeichert unter finanzen.kreditkarten (Liste). Rechnung: utils/kreditkarte.js.
// Keine Fachdaten, keine üblichen Gebühren, keine Kartenempfehlung — nur die eigenen Angaben.

const LEER = {};

// Rechner-Form X (F7-A2, 27.10.2026): das Ergebnis je Karte (E, mit den Balken D) zuerst, die Angaben A–C
// darunter. Die Balken bleiben das Instrument dieses Rechners (F7-R3). Rechnung unverändert.
export const Kreditkarte = ({ palette, t, data, onUpdateData, onNavigate }) => {
  const gespeichert = Array.isArray(data?.finanzen?.kreditkarten) ? data.finanzen.kreditkarten : [];
  // Leerzustand: eine leere Karte zum Ausfüllen — gespeichert wird erst beim ersten Eintrag.
  const karten = gespeichert.length ? gespeichert : [LEER];
  const speichern = (liste) => onUpdateData && onUpdateData('finanzen', 'kreditkarten', liste);
  const aendern = (i, patch) => speichern(karten.map((k, j) => (j === i ? { ...k, ...patch } : k)));
  const vorteilAendern = (i, key, patch) => {
    const vs = karten[i].vorteile || {};
    aendern(i, { vorteile: { ...vs, [key]: { ...(vs[key] || {}), ...patch } } });
  };
  const saldo = Number(data?.finanzen?.creditCardBalance) || 0;

  const titelStil = { fontWeight: weight.semi, color: palette.text, margin: space.md + 'px 0 ' + space.sm + 'px' };
  const labelStil = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };
  const hinweisStil = { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const eingabeStil = { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', width: '100%', maxWidth: '220px', boxSizing: 'border-box' };
  const knopfStil = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium };

  const feld = (i, key, label, hinweis, extra = {}) => {
    const id = 'kk-' + i + '-' + key;
    return React.createElement('div', { key, style: { marginBottom: space.sm + 'px' } },
      React.createElement('label', { htmlFor: id, style: labelStil }, label),
      React.createElement('input', {
        id, type: 'text', inputMode: 'decimal', value: karten[i][key] ?? '',
        onChange: (e) => aendern(i, { [key]: e.target.value }),
        'aria-describedby': hinweis ? id + '-hinweis' : undefined,
        style: { ...eingabeStil, ...extra },
      }),
      hinweis && React.createElement('p', { id: id + '-hinweis', style: hinweisStil }, hinweis)
    );
  };

  const vorteilZeile = (i, { key, versicherung }) => {
    const v = (karten[i].vorteile || {})[key] || {};
    const id = 'kk-' + i + '-v-' + key;
    return React.createElement('div', { key, style: { marginBottom: space.sm + 'px' } },
      React.createElement('label', { htmlFor: id, style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: text.sm, color: palette.text, cursor: 'pointer', minHeight: '32px' } },
        React.createElement('input', { id, type: 'checkbox', checked: !!v.an, onChange: (e) => vorteilAendern(i, key, { an: e.target.checked }) }),
        t('kreditkarteView.vorteil_' + key)
      ),
      v.an && React.createElement('div', { style: { paddingLeft: '26px', marginTop: space.xs + 'px' } },
        versicherung && React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
          React.createElement('label', { htmlFor: id + '-status', style: labelStil }, t('kreditkarteView.statusFrage')),
          React.createElement('select', {
            id: id + '-status', value: v.status || '',
            onChange: (e) => vorteilAendern(i, key, { status: e.target.value }),
            style: { ...eingabeStil, maxWidth: '300px', appearance: 'auto' },
          },
            React.createElement('option', { value: '' }, t('common.select')),
            VERSICHERUNG_STATUS.map((s) => React.createElement('option', { key: s, value: s }, t('kreditkarteView.status_' + s)))
          )
        ),
        (!versicherung || v.status === 'braucheIch') && React.createElement('div', null,
          React.createElement('label', { htmlFor: id + '-wert', style: labelStil }, t(versicherung ? 'kreditkarteView.wertVersicherung' : 'kreditkarteView.wertGeld')),
          React.createElement('input', {
            id: id + '-wert', type: 'text', inputMode: 'decimal', value: v.wert ?? '',
            onChange: (e) => vorteilAendern(i, key, { wert: e.target.value }),
            'aria-describedby': versicherung ? undefined : id + '-wert-hinweis',
            style: eingabeStil,
          }),
          !versicherung && React.createElement('p', { id: id + '-wert-hinweis', style: hinweisStil }, t('kreditkarteView.wertGeldHinweis'))
        )
      )
    );
  };

  // D — die Rechnung: ein Balken je Posten, Länge im Verhältnis zum grössten. Keine Alarmfarbe.
  const rechnung = (r) => {
    const posten = [
      { key: 'cashback', wert: r.cashback, plus: true },
      { key: 'vorteile', wert: r.vorteile, plus: true },
      { key: 'gebuehr', wert: r.gebuehr, plus: false },
      { key: 'fremd', wert: r.fremdKosten, plus: false },
      { key: 'zinsen', wert: r.zinsen, plus: false },
    ].filter((p) => p.wert > 0);
    if (!posten.length) return null;
    const max = Math.max(...posten.map((p) => p.wert));
    return React.createElement('div', { style: { marginTop: space.sm + 'px' } },
      React.createElement('div', { style: titelStil }, t('kreditkarteView.rechnungTitel')),
      posten.map((p) => React.createElement('div', { key: p.key, style: { marginBottom: space.sm + 'px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid } },
          React.createElement('span', null, t('kreditkarteView.posten_' + p.key)),
          React.createElement('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums' } }, (p.plus ? '+ ' : '− ') + betrag(p.wert, Number.isInteger(p.wert) ? {} : { stellen: 2 }))
        ),
        React.createElement('div', { 'aria-hidden': true, style: { height: '6px', borderRadius: radius.hair + 'px', marginTop: '3px', width: Math.max(2, Math.round((p.wert / max) * 100)) + '%', background: p.plus ? palette.sage : palette.soft } })
      ))
    );
  };

  const kartenName = (k, i) => (k.name || '').trim() || t('kreditkarteView.karteLabel', { n: i + 1 });
  const rechnungen = karten.map((k) => karteRechnen(k));
  const gerechnet = rechnungen.some((r) => r.ergebnis !== 'brauchtAusgaben');

  // E + D je Karte — im Ergebnis-Teil der Form (role="status" trägt die Hülle).
  const ergebnis = gerechnet && React.createElement(React.Fragment, null,
    karten.map((k, i) => {
      const r = rechnungen[i];
      return React.createElement('div', { key: i, style: { marginBottom: i < karten.length - 1 ? space.md + 'px' : 0 } },
        karten.length > 1 && React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '2px' } }, kartenName(k, i)),
        React.createElement('p', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, lineHeight: leading.tight, margin: 0 } },
          hinweisZeichen(r.ergebnis === 'bringt' ? 'check' : 'info'),
          t('kreditkarteView.ergebnis_' + r.ergebnis, { betrag: betrag(Math.round(Math.abs(r.netto))) })),
        r.ergebnis !== 'brauchtAusgaben' && React.createElement('div', { style: hinweisStil }, t('kreditkarteView.basis', { ausgaben: betrag(r.jahresAusgaben) })),
        r.nichtGezaehlt.length > 0 && React.createElement('div', { style: hinweisStil },
          t('kreditkarteView.nichtGezaehlt', { liste: r.nichtGezaehlt.map((n) => t('kreditkarteView.vorteil_' + n.key)).join(', ') })),
        r.ergebnis !== 'brauchtAusgaben' && rechnung(r)
      );
    })
  );

  // «x von n»: je Karte Jahresgebühr und Ausgaben pro Monat — ohne sie rechnet nichts.
  const pflicht = ['jahresgebuehr', 'ausgabenMonat'];
  const erfasst = karten.reduce((n, k) => n + pflicht.filter((f) => String(k[f] ?? '').trim() !== '').length, 0);

  return React.createElement(RechnerForm, {
    palette, t, view: 'kreditkarte', onNavigate,
    titel: t('kreditkarteView.title'), satz: t('kreditkarteView.intro'),
    ergebnis, ohneErgebnis: t('kreditkarteView.ergebnis_brauchtAusgaben'),
    vorbehalt: saldo > 0 && React.createElement('p', { style: { ...hinweisStil, marginTop: space.sm + 'px' } },
      hinweisZeichen(), t('kreditkarteView.saldoHinweis', { betrag: betrag(saldo) })),
    angaben: {
      erfasst, gesamt: pflicht.length * karten.length,
      inhalt: React.createElement('div', null,
        karten.map((k, i) => React.createElement('section', { key: i, 'aria-label': kartenName(k, i), style: { paddingTop: space.xs + 'px', borderTop: i > 0 ? '1px solid ' + palette.border : 'none', fontSize: text.sm, color: palette.text } },
          // A
          React.createElement('div', { style: { ...titelStil, marginTop: space.sm + 'px' } }, kartenName(k, i)),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 ' + space.md + 'px' } },
            feld(i, 'name', t('kreditkarteView.name'), null, { maxWidth: '300px' }),
            feld(i, 'jahresgebuehr', t('kreditkarteView.jahresgebuehr'))
          ),
          // B
          React.createElement('div', { style: titelStil }, t('kreditkarteView.ausgabenTitel')),
          feld(i, 'ausgabenMonat', t('kreditkarteView.ausgabenMonat')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 ' + space.md + 'px' } },
            feld(i, 'fremdAnteil', t('kreditkarteView.fremdAnteil')),
            feld(i, 'fremdGebuehr', t('kreditkarteView.fremdGebuehr'), t('kreditkarteView.fremdGebuehrHinweis'))
          ),
          feld(i, 'zinsenJahr', t('kreditkarteView.zinsenJahr'), t('kreditkarteView.zinsenHinweis')),
          // C
          React.createElement('div', { style: titelStil }, t('kreditkarteView.vorteileTitel')),
          feld(i, 'cashback', t('kreditkarteView.cashback')),
          VORTEILE.map((v) => vorteilZeile(i, v)),
          gespeichert.length > 0 && onUpdateData && React.createElement('button', {
            type: 'button', onClick: () => speichern(gespeichert.filter((_, j) => j !== i)),
            style: { ...knopfStil, color: palette.mid, marginBottom: space.sm + 'px', minHeight: '44px' },
          }, t('kreditkarteView.karteWeg'))
        )),
        onUpdateData && React.createElement('button', {
          type: 'button', onClick: () => speichern([...karten, {}]),
          style: { ...knopfStil, minHeight: '44px' },
        }, t('kreditkarteView.karteDazu'))
      ),
    },
    // Keine Fachquelle: gerechnet wird nur mit den eigenen Angaben — das sagt die feste Zeile.
    quelle: t('kreditkarteView.vorlaeufig'),
  });
};

export default Kreditkarte;
