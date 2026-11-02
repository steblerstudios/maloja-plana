import React, { useState, useMemo } from 'react';
import { useIsMobile } from './hooks/useIsMobile.js';
import { RechnerForm } from './components/RechnerForm.jsx';
import { Pegel } from './components/Pegel.jsx';
import { sozialhilfePegelAusRechner } from './data/pegel.js';
import { berechneSozialhilfe, sozialhilfeErgebnis } from './data/sozialhilfeRechner.js';
import { aufklappZeichen } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { betrag, zahl } from './utils/geld.js';
import { sozialhilfeVorbefuellung } from './utils/sozialhilfeVorbefuellung.js';
import { gblStand } from './data/skosGrundbedarf.js';
import { hatAusweisFNS } from './data/ausweis.js';
import { verfuegbarUeberFreibetrag } from './utils/unterstuetzungseinheit.js';

const KINDER_MAX = 12;

// `titel`, `satz`, `weiteres`, `stelle`: von SozialhilfeView (die Seite um den Rechner), sonst leer.
export const SozialhilfeRechner = ({ palette, t, data, onNavigate, titel, satz, weiteres, stelle, tun, mitPegel }) => {
  const isMobile = useIsMobile();
  // Kanton aus dem Profil → kantonaler Vermögensfreibetrag (ohne Kanton: SKOS-Empfehlung).
  const kanton = data?.basis?.canton || '';
  const vorbefuellt = useMemo(() => sozialhilfeVorbefuellung(data), [data]);
  const initAdults = Math.min(4, vorbefuellt.adults);
  const initChildren = Math.min(KINDER_MAX, vorbefuellt.kinder);

  const [adults, setAdults] = useState(initAdults);
  const [kinderCount, setKinderCount] = useState(initChildren);
  // Mitbewohnende ausserhalb der Unterstützungseinheit + wie der Haushalt geführt wird (SKOS C.3.1/C.3.2).
  const [weiterePersonen, setWeiterePersonen] = useState(Math.min(5, vorbefuellt.weiterePersonen));
  const [wohnform, setWohnform] = useState(vorbefuellt.wohnform === 'allein' ? 'familienaehnlich' : vorbefuellt.wohnform);
  // Vorbefüllen aus bereits erfassten Angaben (überschreibbar) — nicht zweimal eingeben.
  const [miete, setMiete] = useState(vorbefuellt.miete);
  const [kvg, setKvg] = useState(data?.versicherungen?.kkPremium ? String(data.versicherungen.kkPremium) : '');
  // Sozialhilfe basiert auf dem NETTO-Einkommen: ist das Einkommen als Brutto hinterlegt,
  // NICHT vorbefüllen (falsche Basis) — stattdessen ruhiger Hinweis am Feld.
  const nettoBruttoMismatch = vorbefuellt.hauptBrutto;
  const [einkommen, setEinkommen] = useState(vorbefuellt.einkommen);
  const [andereEinkuenfte, setAndereEinkuenfte] = useState(vorbefuellt.andereEinkuenfte);
  const [vermoegen, setVermoegen] = useState(vorbefuellt.vermoegen);
  const [erwerbstaetig, setErwerbstaetig] = useState(vorbefuellt.erwerbstaetig);
  const [integration, setIntegration] = useState(false);
  // Erwerbsunkosten (SKOS-RL C.6.3): belegte Mehrkosten der Arbeit. Das Profil kennt sie nicht,
  // darum leer; gerechnet wird nur mit einem eingetragenen Betrag (data/sozialhilfeKern.js).
  const [erwerbsunkosten, setErwerbsunkosten] = useState('');

  // Lohn im Profil, das Feld trägt ihn nicht oder nur zum Teil, und niemand hat es angepasst.
  const lohnOffen = (vorbefuellt.lohnNichtUebernommen && String(einkommen).trim() === '') || (vorbefuellt.lohnUnvollstaendig && String(einkommen) === vorbefuellt.einkommen);

  // Kein Einkommen eingetragen: Ohne Sperre stünde der ganze Bedarf als Betrag da (F8-S4). Eine 0 ist eine Antwort.
  // Andere Einkünfte sagen nichts über den Lohn (Fachprüfung 532cb632), ausser das Profil nennt eine Lage ohne Erwerb.
  const ohneErwerb = !erwerbstaetig && !!data?.finanzen?.employmentType && Number(andereEinkuenfte) > 0;
  const einkommenLeer = String(einkommen ?? '').trim() === '' && !ohneErwerb;

  const result = useMemo(() => {
    const m = Number(miete) || 0;
    const k = Number(kvg) || 0;
    if (m <= 0 && k <= 0) return null;
    if (einkommenLeer) return null;
    // Lohn im Profil, aber nicht als Netto: Ohne Eintrag gäbe es sonst einen Betrag aus einem Einkommen von 0.
    if (lohnOffen) return null;
    return berechneSozialhilfe({
      adults,
      kinderImHaushalt: kinderCount,
      weiterePersonen,
      wohnform,
      miete: m,
      krankenkassePraemie: k,
      erwerbsunkosten: erwerbstaetig ? Number(erwerbsunkosten) || 0 : 0,
      erwerbseinkommen: Number(einkommen) || 0,
      andereEinkuenfte: Number(andereEinkuenfte) || 0,
      vermoegen: Number(vermoegen) || 0,
      erwerbstaetig,
      erwerbsunkostenErfasst: String(erwerbsunkosten).trim() !== '',
      ohneFreibetrag: vorbefuellt.ohneFreibetrag,
      integrationsMassnahme: integration,
      kanton,
    });
  }, [adults, kinderCount, weiterePersonen, wohnform, miete, kvg, erwerbsunkosten, einkommen, andereEinkuenfte, vermoegen, erwerbstaetig, vorbefuellt.ohneFreibetrag, lohnOffen, einkommenLeer, integration, kanton]);

  // Konkubinat mit Partnerlohn: kein Betrag, wo eine Lücke bleibt. Deckt das eigene Einkommen den Bedarf, gilt das gewöhnliche Nein.
  const konkubinatGesperrt = !!(result && vorbefuellt.konkubinatBetragOffen && result.offenOhneVermoegen);
  const zeige = konkubinatGesperrt ? null : result;
  const ohneMieteUndPraemie = !(Number(miete) > 0) && !(Number(kvg) > 0);
  // «Nächste Schritte» nur, wo ein Gang zum Sozialdienst etwas bringen kann (F8-S6).
  const tunSichtbar = konkubinatGesperrt || !!(zeige && (zeige.hatAnspruch || zeige.anspruchOffen || zeige.efbEntscheidet));

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px', fontSize: text.sm },
    hint: { color: palette.mid, fontSize: text.xs, marginBottom: space.xs + 'px' },
    inputRow: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap', marginBottom: space.sm + 'px', alignItems: 'flex-end' },
    inputGroup: { display: 'flex', flexDirection: 'column', minWidth: '140px', maxWidth: '240px' },
    input: { width: '140px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    select: { width: '100%', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none', appearance: 'none', WebkitAppearance: 'none', paddingRight: '28px', cursor: 'pointer', boxSizing: 'border-box' },
    selectWrap: { position: 'relative', display: 'inline-block', width: '80px' },
    selectChevron: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' },
    checkbox: { display: 'flex', alignItems: 'center', gap: space.xs + 'px', fontSize: text.sm, cursor: 'pointer', marginBottom: space.xs + 'px', ...(isMobile ? { minHeight: '44px' } : {}) },
    highlight: { padding: space.md + 'px', borderRadius: radius.sm + 'px', border: '1px solid ', marginBottom: space.md + 'px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: space.sm, borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: space.sm, borderBottom: '1px solid ' + palette.border },
    tdRight: { padding: space.sm, borderBottom: '1px solid ' + palette.border, textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
    big: { fontSize: text.xl, fontWeight: weight.bold },
    source: { marginTop: space.md + 'px', fontSize: text.sm, color: palette.mid, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border, lineHeight: '1.5' },
  };

  const fmt = (v) => v != null ? zahl(v) : '–';

  const field = (labelKey, value, setter, placeholder, hint) =>
    React.createElement('div', { style: s.inputGroup },
      React.createElement('div', { style: s.label }, t(labelKey)),
      hint && React.createElement('div', { style: s.hint }, hint),
      React.createElement('input', {
        style: s.input, type: 'number', inputMode: 'decimal', value, placeholder,
        'aria-label': t(labelKey),
        onChange: e => setter(e.target.value),
      })
    );

  const toggle = (labelKey, value, setter) =>
    React.createElement('label', { style: s.checkbox },
      React.createElement('input', {
        type: 'checkbox', checked: value,
        onChange: e => setter(e.target.checked),
      }),
      t(labelKey)
    );

  // Rechner-Form X (F7-A2, 27.10.2026): Anspruch gross zuerst (Live-Region), darunter die Rechnung als Tabelle,
  // dann «Ihre Angaben». Steht der Rechner in der Sozialhilfe-Seite, bringt sie Titel, Satz, ihre Orientierung
  // aus dem Profil (`weiteres`) und die offizielle Stelle mit. Rechnung unverändert.
  const ergebnis = zeige && React.createElement(React.Fragment, null,
      React.createElement('div', {
        style: {
          ...s.highlight,
          borderColor: result.hatAnspruch ? palette.sage : palette.border,
          background: result.hatAnspruch ? palette.sage + '15' : palette.up,
        }
      },
        React.createElement('div', { style: s.label }, t('sh.anspruch')),
        React.createElement('div', {
          style: { ...s.big, color: result.hatAnspruch ? (palette.sageDeep || palette.sage) : palette.mid }
        },
          result.hatAnspruch
            ? 'CHF ' + fmt(result.totalUnterstuetzung) + ' / ' + t('sh.monat')
            : t(result.vermoegenZuerst && !result.knapp && (String(vermoegen) !== String(vorbefuellt.vermoegen) || verfuegbarUeberFreibetrag(data?.finanzen, result.vermoegensfreibetrag)) ? 'sh.vermoegenZuerstTitel' : result.efbEntscheidet || result.anspruchOffen ? 'dashboard.anspruchMoeglich' : 'sh.keinAnspruch')
        ),
        result.hatAnspruch && result.izu > 0 && React.createElement('div', { style: s.hint },
          t('sh.inklusiveIzu') + ': CHF ' + fmt(result.izu)
        ),
        // Erst der Einkommensfreibetrag ergäbe einen Anspruch — ob er beim Eintritt zählt, regelt der Kanton.
        !result.hatAnspruch && result.efbEntscheidet && React.createElement('div', { style: s.hint },
          t('sozialhilfe.efbEntscheidet')
        ),
        result.knapp && result.vermoegenZuerst && React.createElement('div', { style: s.hint }, t('pegel.coveredOffen')),
        !result.hatAnspruch && !result.efbEntscheidet && result.anspruchOffen && !result.vermoegenZuerst && React.createElement('div', { style: s.hint }, t('pegel.coveredOffen')),
        // R4: der Anspruch hängt am Freibetrag (Vermögen darunter) — ist er kantonal nicht
        // bestätigt, hier leise sagen (über dem Freibetrag steht es unten beim Vermögen).
        result.hatAnspruch && result.vfbUnbestaetigt && React.createElement('div', { style: s.hint },
          t('sozialhilfe.assetLimitUnconfirmedUnder', { freibetrag: 'CHF ' + fmt(result.vermoegensfreibetrag) })
        )
      ),
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('sh.position')),
            React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, 'CHF')
          )
        ),
        React.createElement('tbody', null,
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.gbl') + ' (' + (
              result.wohnform === 'familienaehnlich' ? t('sh.gblAnteil', { einheit: result.haushaltGroesse, haushalt: result.haushaltGroesse + result.weiterePersonen })
                : result.wohnform === 'zweckWg' ? t('sh.gblZweckWg', { einheit: result.haushaltGroesse })
                : result.haushaltGroesse + ' ' + t('sh.personen')) + ')'),
            React.createElement('td', { style: s.tdRight }, fmt(result.gbl))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.wohnkosten')),
            React.createElement('td', { style: s.tdRight }, fmt(result.wohnkosten))
          ),
          React.createElement('tr', null,
            React.createElement('td', { colSpan: 2, style: { ...s.td, ...s.hint, paddingTop: 0 } }, t('sozialhilfe.rentLimitUnbekannt'))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.kvgLabel')),
            React.createElement('td', { style: s.tdRight }, fmt(result.kvgPraemie))
          ),
          result.erwerbsunkosten > 0 && React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.erwerbsunkostenZeile')),
            React.createElement('td', { style: s.tdRight }, fmt(result.erwerbsunkosten))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, fontWeight: weight.semi } }, t('sh.bedarf')),
            React.createElement('td', { style: { ...s.tdRight, fontWeight: weight.semi } }, fmt(result.bedarf))
          ),
          result.totalEinkommen > 0 && React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.einkommenTotal')),
            React.createElement('td', { style: s.tdRight }, '− ' + fmt(result.totalEinkommen))
          ),
          // Freibetrag nur, wenn eine Lücke bleibt (er gilt im Bezug) — sonst ginge die Tabelle nicht auf.
          result.efb > 0 && result.sozialhilfeAnspruch > 0 && React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, color: palette.sageDeep } }, t('sh.efbLabel')),
            React.createElement('td', { style: { ...s.tdRight, color: palette.sageDeep } }, '+ ' + fmt(result.efb))
          ),
          result.efb > 0 && result.sozialhilfeAnspruch > 0 && React.createElement('tr', null,
            React.createElement('td', { colSpan: 2, style: { ...s.td, ...s.hint, paddingTop: 0 } }, t('sozialhilfe.efbGeschaetzt'))
          ),
          result.efb > 0 && result.sozialhilfeAnspruch > 0 && React.createElement('tr', null,
            React.createElement('td', { style: s.td }, t('sh.anrechenbar')),
            React.createElement('td', { style: s.tdRight }, '− ' + fmt(result.anrechenbaresEinkommen))
          ),
          React.createElement('tr', null,
            React.createElement('td', { style: { ...s.td, fontWeight: weight.bold } }, t('sh.sozialhilfe')),
            React.createElement('td', { style: { ...s.tdRight, fontWeight: weight.bold } }, result.anspruchOffen || result.efbEntscheidet ? '—' : fmt(result.sozialhilfeAnspruch))
          )
        )
      ),
      result.vermoegenZuerst && React.createElement('div', {
        style: { ...s.section, marginTop: space.md + 'px', color: palette.warn || palette.mid, border: '1px solid ' + (palette.warn || palette.mid), background: (palette.warn || palette.mid) + '15' }
      },
        // Der eine Vermögenssatz der Seite (F8-G3), mit Frist und Vorschuss nach SKOS D.3.1 Abs. 2 und 3.
        t('sozialhilfe.assetLimitNote', {
          basis: kanton ? t('sozialhilfe.assetLimitBasisCanton', { name: t('cantons.' + kanton) }) : t('sozialhilfe.assetLimitBasisSkos'),
          freibetrag: betrag(result.vermoegensfreibetrag), ueberschuss: betrag(result.anrechenbaresVermoegen),
        }),
        result.vfbUnbestaetigt && React.createElement('div', { style: { marginTop: space.xs + 'px', color: palette.mid } }, t('sozialhilfe.assetLimitUnconfirmed'))
      )
  );
  // Wer erwerbstätig ist, hat fünf Angaben: Sonst stünde «4 von 4» neben «Noch eine Angabe nötig» (F8-S3).
  const angabenWerte = [miete, kvg, einkommen, vermoegen, ...(erwerbstaetig ? [erwerbsunkosten] : [])];
  // Der Jahreshinweis gilt auch ohne Ergebnis: Darunter steht die SKOS-Tabelle.
  const gbl = gblStand();
  const vorbehalte = [!gbl.belegt && t('sh.gblNichtBelegt', { jahr: gbl.jahr, laufend: new Date().getFullYear() })].concat(zeige ? [
    hatAusweisFNS(data) && t('pegel.ansatzTiefer'),
    vorbefuellt.ohneFreibetrag && t('pegel.ohneFreibetrag'),
    vorbefuellt.vorBeitraegen && t('pegel.vorBeitraegen'),
    ...vorbefuellt.hinweise.map((k) => t(k)),
    vorbefuellt.nebenerwerbBrutto && t('sh.nebenerwerbBruttoHint'),
    vorbefuellt.nebenerwerbBasisOffen && t('einkommensart.nebenOffen'),
    erwerbstaetig && String(erwerbsunkosten).trim() === '' && t('sozialhilfe.erwerbsunkostenOffen'),
  ] : (konkubinatGesperrt && result.vermoegenZuerst ? [t('pegel.vermoegen'), result.vfbUnbestaetigt && t('sozialhilfe.assetLimitUnconfirmed')] : [])).filter(Boolean);
  return React.createElement(RechnerForm, {
    palette, t, view: 'sozialhilfe', onNavigate,
    titel: titel || t('sh.title'), satz,
    ergebnis, ohneErgebnis: t(konkubinatGesperrt ? 'pegel.konkubinatBetragOffen' : lohnOffen ? (Number(data?.finanzen?.monthlyIncome) > 0 && (vorbefuellt.hauptBrutto || vorbefuellt.hauptBasisOffen) ? 'sh.lohnEingeben' : 'sh.nebenEingeben') : ohneMieteUndPraemie ? 'sh.eingeben' : 'sh.einkommenEingeben'),
    art: konkubinatGesperrt ? null : sozialhilfeErgebnis({ miete, kvgPraemie: kvg, erwerbseinkommen: einkommen, vermoegen, kanton, erwerbstaetig, erwerbsunkosten }),
    // Vorbehalte als Liste, nicht als ein Absatz (F8-G3).
    vorbehalt: vorbehalte.length > 0 && React.createElement('ul', { style: { ...s.hint, marginTop: space.sm + 'px', paddingLeft: '18px' } },
      vorbehalte.map((v) => React.createElement('li', { key: v, style: { marginBottom: '2px' } }, v))),
    instrument: mitPegel && zeige ? React.createElement(Pegel, { palette, t, state: sozialhilfePegelAusRechner(zeige) }) : null,
    angaben: {
      erfasst: angabenWerte.filter((v) => String(v ?? '').trim() !== '').length, gesamt: angabenWerte.length,
      inhalt: React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.inputRow },
        React.createElement('div', { style: s.inputGroup },
          React.createElement('div', { style: s.label }, t('sh.erwachsene')),
          React.createElement('div', { style: s.hint }, t('sh.erwachseneHint')),
          vorbefuellt.jungErwachsen && React.createElement('div', { style: s.hint }, t('sh.jungeErwachseneHint')),
          React.createElement('div', { style: s.selectWrap },
            React.createElement('select', {
              style: s.select, value: adults,
              'aria-label': t('sh.erwachsene'),
              onChange: e => setAdults(Number(e.target.value)),
            },
              [1,2,3,4].map(n =>
                React.createElement('option', { key: n, value: n }, n)
              )
            ),
            React.createElement('div', { style: s.selectChevron }, aufklappZeichen(true))
          )
        ),
        React.createElement('div', { style: s.inputGroup },
          React.createElement('div', { style: s.label }, t('sh.kinder')),
          React.createElement('div', { style: s.selectWrap },
            React.createElement('select', {
              style: s.select, value: kinderCount,
              'aria-label': t('sh.kinder'),
              onChange: e => setKinderCount(Number(e.target.value)),
            },
              Array.from({ length: KINDER_MAX + 1 }, (_, n) => n).map(n =>
                React.createElement('option', { key: n, value: n }, n)
              )
            ),
            React.createElement('div', { style: s.selectChevron }, aufklappZeichen(true))
          )
        ),
        React.createElement('div', { style: s.inputGroup },
          React.createElement('div', { style: s.label }, t('sh.weiterePersonen')),
          React.createElement('div', { style: s.hint }, t('sh.weiterePersonenHint')),
          React.createElement('div', { style: s.selectWrap },
            React.createElement('select', {
              style: s.select, value: weiterePersonen,
              'aria-label': t('sh.weiterePersonen'),
              onChange: e => setWeiterePersonen(Number(e.target.value)),
            },
              [0,1,2,3,4,5].map(n =>
                React.createElement('option', { key: n, value: n }, n)
              )
            ),
            React.createElement('div', { style: s.selectChevron }, aufklappZeichen(true))
          )
        ),
        field('sh.miete', miete, setMiete, '1200', vorbefuellt.mieteAnteil ? t('sh.mieteAnteilProfilHint') : weiterePersonen > 0 ? t('sh.mieteAnteilHint') : null),
        field('sh.kvg', kvg, setKvg, '380'),
      ),
      weiterePersonen > 0 && React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
        React.createElement('div', { style: s.label, id: 'sh-wohnform' }, t('sh.wohnform')),
        React.createElement('div', { role: 'radiogroup', 'aria-labelledby': 'sh-wohnform' },
          ['familienaehnlich', 'zweckWg'].map(w => React.createElement('label', { key: w, style: s.checkbox },
            React.createElement('input', { type: 'radio', name: 'sh-wohnform', value: w, checked: wohnform === w, onChange: () => setWohnform(w) }),
            t(w === 'zweckWg' ? 'sh.wohnformZweckWg' : 'sh.wohnformFamilienaehnlich')
          ))
        ),
        React.createElement('div', { style: { ...s.hint, marginBottom: space.sm + 'px' } }, t('sh.wohnformHint'))
      ),
      React.createElement('div', { style: s.inputRow },
        field('sh.einkommen', einkommen, setEinkommen, '0',
          nettoBruttoMismatch ? t('sh.nettoBruttoHint')
            : vorbefuellt.hauptBasisOffen ? t('einkommensart.offenNetto')
            : vorbefuellt.nebenerwerbBrutto ? t('sh.nebenerwerbBruttoHint')
            : vorbefuellt.nebenerwerbBasisOffen ? t('einkommensart.nebenOffen')
            : vorbefuellt.einkommenMitNebenerwerb ? t('sh.ausProfilHint') : null),
        field('sh.andereEinkuenfte', andereEinkuenfte, setAndereEinkuenfte, '0',
          vorbefuellt.partnerKonkubinat ? t('sh.konkubinatHint') : (vorbefuellt.andereEinkuenfte ? t('sh.ausProfilHint') : t('sh.andereEinkuenfteHint'))),
        field('sh.vermoegen', vermoegen, setVermoegen, '0', vorbefuellt.vermoegen3aDurchIv ? t('sh.inkl3aIvHint') : vorbefuellt.vermoegenMit3a ? t('sh.inkl3aHint') : vorbefuellt.vermoegen ? t('sh.ausProfilHint') : null),
      ),
      React.createElement('div', { style: { marginTop: space.sm + 'px' } },
        toggle('sh.erwerbstaetig', erwerbstaetig, setErwerbstaetig),
        erwerbstaetig && React.createElement('div', { style: { marginLeft: '24px', marginBottom: space.sm + 'px' } },
          field('sh.erwerbsunkosten', erwerbsunkosten, setErwerbsunkosten, '0', t('sh.erwerbsunkostenHint'))
        ),
        toggle('sh.integration', integration, setIntegration),
        React.createElement('div', { style: { ...s.hint, marginTop: '2px', marginLeft: '24px' } }, t('sh.integrationHint'))
      )
    ),
    },
    tun: tun ? tun(zeige, tunSichtbar) : undefined, stelle,
    quelle: renderSource(t('sh.source', { jahr: gblStand().jahr }), null, t),
  }, weiteres || null);
};

export default SozialhilfeRechner;
