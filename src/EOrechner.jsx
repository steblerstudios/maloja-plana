import React, { useState, useMemo } from 'react';
import { vergleicheEOLeistungen, eoErgebnis, EO_PARAMS, eoWerte } from './data/eoRechner.js';
import { RechnerForm, ErgebnisZahl } from './components/RechnerForm.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { zahl } from './utils/geld.js';
import { jahreslohnAusProfil, lohnIstNetto, lohnBasisOffen } from './utils/jahreslohnAusProfil.js';

// Rechner-Form X (F7-A2, 27.10.2026): Taggeld gross zuerst, die Leistungen als Tabelle darunter, dann die Angabe.
export const EOrechner = ({ palette, t, data, onNavigate }) => {
  // Bruttojahreslohn aus den Finanzen (inkl. 13.), nicht bei netto erfasstem Lohn (utils/jahreslohnAusProfil.js).
  const nettoHinterlegt = lohnIstNetto(data.finanzen) && Number(data.finanzen?.monthlyIncome) > 0;
  const basisOffen = lohnBasisOffen(data.finanzen);
  const [einkommen, setEinkommen] = useState(() => jahreslohnAusProfil(data.finanzen));
  const parsedEinkommen = Number(einkommen) || 0;

  const result = useMemo(() => {
    if (parsedEinkommen <= 0) return null;
    return vergleicheEOLeistungen(parsedEinkommen);
  }, [parsedEinkommen]);

  const s = {
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm, color: palette.text, marginTop: space.sm + 'px' },
    th: { textAlign: 'left', padding: '6px ' + space.xs + 'px 6px 0', borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: '6px ' + space.xs + 'px 6px 0', borderBottom: '1px solid ' + palette.border + '66', color: palette.text },
    tag: { display: 'inline-block', padding: '2px 8px', borderRadius: radius.xs, fontSize: text.xs, background: palette.sage + '22', color: palette.sageDeep, marginLeft: space.xs + 'px' },
    fuss: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' },
  };

  const fmt = (v) => v != null ? zahl(v) : '–';

  const leistungRow = (leistung, labelKey) => {
    if (!leistung || !leistung.anspruch) return null;
    return React.createElement('tr', { key: leistung.typ },
      React.createElement('td', { style: s.td },
        t('eo.' + labelKey),
        leistung.istPlafoniert && React.createElement('span', { style: s.tag }, t('eo.plafoniert'))
      ),
      // Betreuung: Taggelder, nicht Urlaubstage (EOG Art. 16q Abs. 3), und ein Höchstwert —
      // bei zwei erwerbstätigen Eltern je nach eigenem Einkommen (Art. 16q Abs. 4, 16r Abs. 1).
      React.createElement('td', { style: s.td }, leistung.typ === 'betreuung' ? t('eo.betreuungDauer', { n: leistung.tage }) : leistung.tage + ' ' + t('eo.tage')),
      React.createElement('td', { style: s.td }, 'CHF ' + fmt(leistung.taggeld)),
      React.createElement('td', { style: { ...s.td, fontWeight: weight.semi } }, (leistung.typ === 'betreuung' ? t('eo.hoechstens') + ' ' : '') + 'CHF ' + fmt(leistung.totalEntschaedigung))
    );
  };

  const ergebnis = result && React.createElement(React.Fragment, null,
    React.createElement(ErgebnisZahl, { palette, label: t('eo.taggeld'), wert: 'CHF ' + fmt(result.mutterschaft.taggeld) + ' / ' + t('eo.tag') }),
    React.createElement('p', { style: { ...s.fuss, marginTop: space.xs + 'px' } },
      t('eo.entschaedigungssatz') + ': ' + EO_PARAMS.entschaedigungssatz + '% · ' +
      t('eo.maximum') + ': CHF ' + fmt(EO_PARAMS.maxTaggeld) + '/' + t('eo.tag')),
    React.createElement('div', { style: { overflowX: 'auto' } },
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('eo.leistung')),
            React.createElement('th', { style: s.th }, t('eo.dauer')),
            React.createElement('th', { style: s.th }, t('eo.proTag')),
            React.createElement('th', { style: s.th }, t('eo.total'))
          )
        ),
        React.createElement('tbody', null,
          leistungRow(result.mutterschaft, 'mutterschaft'),
          leistungRow(result.vaterschaft, 'vaterschaft'),
          leistungRow(result.adoption, 'adoption'),
          leistungRow(result.betreuung, 'betreuung')
        )
      )
    )
  );

  return React.createElement(RechnerForm, {
    palette, t, view: 'eo', onNavigate,
    titel: t('eo.title'),
    ergebnis, ohneErgebnis: t('eo.einkommenEingeben'),
    art: eoErgebnis({ einkommen: parsedEinkommen }),
    vorbehalt: React.createElement(React.Fragment, null,
      // Die Bedingungen je Leistung direkt unter der Zahl; ohne Einkommen die Erklärung, wie gerechnet wird.
      result
        ? React.createElement('div', { style: s.fuss },
            React.createElement('div', null, t('eo.hinweisMutterschaft')),
            React.createElement('div', null, t('eo.hinweisVaterschaft')),
            React.createElement('div', null, t('eo.hinweisAdoption')),
            React.createElement('div', null, t('eo.hinweisBetreuung')))
        : React.createElement('p', { style: s.fuss }, t('eo.erklaerung')),
      React.createElement('p', { style: s.fuss }, t('alpha.noAdviceHint'))
    ),
    angaben: {
      erfasst: parsedEinkommen > 0 ? 1 : 0, gesamt: 1,
      inhalt: React.createElement('div', { style: { padding: space.xs + 'px 0 ' + space.sm + 'px' } },
        React.createElement('label', { htmlFor: 'eo-einkommen', style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: '2px' } }, t('eo.einkommen')),
        React.createElement('input', {
          id: 'eo-einkommen', type: 'number', inputMode: 'decimal', value: einkommen,
          onChange: (e) => setEinkommen(e.target.value), placeholder: '80000', 'aria-describedby': 'eo-einkommen-hinweis',
          style: { width: '180px', minHeight: '44px', boxSizing: 'border-box', marginTop: '4px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit' },
        }),
        React.createElement('p', { id: 'eo-einkommen-hinweis', style: { ...s.fuss, marginTop: '2px' } }, nettoHinterlegt ? t('eo.nettoHint') : basisOffen ? t('einkommensart.offenBrutto') : t('eo.einkommenHint'))
      ),
    },
    // Die Merkblätter der Ausgleichskassen, die das Register schon führt (data/direktLinks.js).
    stelle: React.createElement(OfficialLinkBox, { palette, t, data, ids: ['mutterschaft', 'vaterschaft'], alsZeilen: true }),
    quelle: renderSource(t('eo.source', { jahr: eoWerte().jahr }), null, t),
  });
};

export default EOrechner;
