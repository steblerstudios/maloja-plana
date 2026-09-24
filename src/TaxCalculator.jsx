import React, { useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile.js';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { LabeledField } from './components/LabeledField.jsx';
import { Icon, hinweisZeichen, aufklappZeichen } from './IconSystem.jsx';
import { text, weight, radius , space } from './config/tokens.js';
import { grenzsteuersatz, STEUER_DATA_VERSION, STEUER_PARAMS } from './data/steuerRechner.js';
import { steuernFuerProfil, steuerEingabenAusDaten, tarifvergleichFuerProfil, tarifvergleichGrund, KANTONAL_DATA_VERSION, kantonsdatenAbgerufen } from './data/kantonaleSteuerdaten.js';
import { SAEULE3A_MAX } from './data/saeule3a.js';
import { getHouseholdInfo, getCantonName } from './config/cantonalData.js';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { SteuerSaeulen } from './components/SteuerSaeulen.jsx';
import { KantonssteuerOrientierung, bundOhneZahlText, ERKLAERT_IN_ORIENTIERUNG } from './components/KantonssteuerOrientierung.jsx';
import { steuerkantonVorbelegung } from './utils/steuerkanton.js';
import { giltAlsVerheiratet } from './utils/zivilstand.js';
import { chf, annahmenTexte } from './utils/steuerTexte.js';
import { visuallyHiddenStyle } from './components/ExternerLink.jsx';
import { GlossarText } from './GlossarBegriff.jsx';

// E38: Kantons-/Gemeindesteuer aus der ESTV-Stütztabelle (src/data/kantonaleSteuerdaten.js,
// docs/sources/kantonssteuer-tabelle-2026.md) — dieselbe Regel wie FinanzUebersicht und
// BehoerdenDossier. Zahl nur, wo die Tabelle trägt; sonst der Weg zum amtlichen Rechner.
const datumCH = (iso) => iso.split('-').reverse().join('.');

// E23 (B-2): Der Steuerrechner liest und schreibt den Steuerkanton im Profil
// (behoerden.cantoneOfTaxation). Leer → Wohnkanton (basis.canton).
// Dazwischen: der Schlüssel `canton` auf oberster Ebene. Dorthin schrieb der
// Steuerrechner bis 0.1.28 beim Speichern, gelesen hat ihn niemand. Er ist die
// einzige Spur einer früher gespeicherten Wahl — darum nur lesen, nie löschen,
// und nur solange cantoneOfTaxation leer ist. Das nächste Speichern schreibt
// cantoneOfTaxation, danach spielt er keine Rolle mehr.
// Die Vorbelegung selbst liegt seit K33 in src/utils/steuerkanton.js (auch FinanzUebersicht und
// OfficialLinkBox nutzen sie); hier weiter exportiert für bestehende Importe.
export { steuerkantonVorbelegung };

// Frage «auch Wohnkanton?» nur, wenn der gewählte Kanton vom Wohnkanton abweicht.
export const fragtNachWohnkanton = (data, canton) => Boolean(canton) && canton !== (data?.basis?.canton || '');

// Was gespeichert wird. Der Wohnkanton nur mit alsWohnkanton — also nur auf den Klick «Ja».
export const steuerkantonSpeichern = (data, canton, alsWohnkanton = false) => ({
  behoerden: { ...data?.behoerden, cantoneOfTaxation: canton },
  ...(alsWohnkanton ? { basis: { ...data?.basis, canton } } : {}),
});

// Ruhige Rückfrage unter dem Kantonsfeld. Ohne Hooks, damit sie direkt prüfbar ist.
export const WohnkantonFrage = ({ palette, t, canton, onJa, onNein }) => {
  const knopf = { padding: '8px 12px', minHeight: '44px', borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.medium };
  return React.createElement('div', { role: 'group', 'aria-live': 'polite', style: { marginBottom: space.md, padding: space.sm + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('p', { style: { margin: 0, marginBottom: space.sm, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } }, t('tax.wohnkantonFrage', { canton: getCantonName(canton, t) })),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm } },
      React.createElement('button', { type: 'button', onClick: onJa, style: { ...knopf, background: palette.sand, color: palette.onSand, border: 'none' } }, t('tax.wohnkantonJa')),
      React.createElement('button', { type: 'button', onClick: onNein, style: { ...knopf, background: 'none', color: palette.text, border: '1px solid ' + palette.border } }, t('tax.wohnkantonNein'))
    )
  );
};

// Deploy-Gate 0.1.37 (a11y): welche Teile des Ergebnisses gerade einen Hinweis statt einer Zahl
// zeigen — Bundessteuer (E39/R4), Kantons- und Gemeindesteuer (E38/K87/K98), Satz und
// Nettoeinkommen (K86). Ohne Kanton steht «Kanton wählen», das ist kein Wechsel Zahl → Hinweis.
export const hinweisTeile = ({ taxResult, canton, kantonal, gemeinsamDirekt }) => [
  !taxResult && 'bund',
  canton && !kantonal && 'kanton',
  taxResult && gemeinsamDirekt && 'netto',
].filter(Boolean);

// K62.5: warum der Zivilstand-Vergleich keine Zahl zeigt (tarifvergleichGrund).
const VERGLEICH_OHNE_ZAHL_TEXT = { konkubinatPartner: 'tax.saeulen.konkubinatPartner', konkubinatPartnerOffen: 'tax.saeulen.konkubinatPartnerOffen' };

const TEIL_TEXT = { bund: 'tax.federalTax', kanton: 'tax.cantonalAndMunicipal', netto: 'tax.netIncome' };

// Was die kleine Live-Region sagt, wenn sich hinweisTeile ändert (nicht bei jeder neuen Zahl).
export const steuerAnsageText = (t, teile) => teile.length
  ? t('tax.ansageHinweis', { teile: teile.map((k) => t(TEIL_TEXT[k])).join(', ') })
  : t('tax.ansageZahlen');

export const TaxCalculator = ({ palette, t, data, onSave, onNavigate }) => {
  const isMobile = useIsMobile();
  const hh = getHouseholdInfo(data);
  const deductions = [
    { label: t('tax.workCosts'), key: 'workCosts', default: 0, max: 5000 },
    { label: t('tax.pension3a'), key: 'pension3a', default: 0, max: SAEULE3A_MAX },
    { label: t('tax.debtInterest'), key: 'debtInterest', default: 0, max: 50000 },
    { label: t('tax.maintenance'), key: 'maintenance', default: 0, max: 50000 },
    { label: t('tax.education'), key: 'education', default: 0, max: 10000 },
    { label: t('tax.otherDeductions'), key: 'other', default: 0, max: 10000 }
  ];

  const [taxData, setTaxData] = useState(data.taxData || {});
  const [canton, setCanton] = useState(() => steuerkantonVorbelegung(data));
  const [frage, setFrage] = useState(false);
  const [uebernommen, setUebernommen] = useState(false);
  const [verheiratet, setVerheiratet] = useState(giltAlsVerheiratet(data.basis?.maritalStatus));
  const [kinder, setKinder] = useState(hh.childrenCount);
  // Elterntarif (DBG Art. 36 Abs. 2bis) für Nicht-Verheiratete: nur mit ausdrücklicher Bestätigung
  // (Kinder im gleichen Haushalt, Unterhalt zur Hauptsache). Ohne sie: vorsichtiger Grundtarif.
  const elterntarif = taxData.elterntarif === true;

  // Steuerbares Einkommen — die Tarif-Basis (Brutto − Abzüge, DBG Art. 36), nicht das
  // Reineinkommen. Kann aus dem Steuer-Import kommen ODER direkt eingegeben werden (z.B.
  // vom Steuerbescheid). Wenn gesetzt, dient es 1:1 als Basis (Abzüge entfallen, kein
  // Doppel-Abzug). Geteilter Knoten data.finanzen.taxableIncome
  // — dieselbe Zahl, die EO/IPV/Sozialhilfe später bevorzugt nutzen können.
  const [taxableInput, setTaxableInput] = useState(data.finanzen?.taxableIncome ? String(data.finanzen.taxableIncome) : '');
  const enteredTaxable = Number(taxableInput) || 0;
  // R4: Das Häkchen wird gespeichert (taxData.useEnteredTaxable). Ohne gespeicherten Wert gilt der
  // eingetragene Wert — dieselbe Rückfall-Regel wie in steuerEingabenAusDaten().
  const [useEnteredTaxable, setUseEnteredTaxable] = useState(() => (typeof data.taxData?.useEnteredTaxable === 'boolean' ? data.taxData.useEnteredTaxable : enteredTaxable > 0));
  const useEntered = enteredTaxable > 0 ? useEnteredTaxable : undefined;

  // E39: EIN steuerbares Einkommen für Bund und Kanton — dieselbe Regel wie FinanzUebersicht und
  // BehoerdenDossier (steuernFuerProfil). R4: Die Live-Eingaben dieser Seite gehen als Profil in
  // steuerEingabenAusDaten() — so gelten Häkchen, 13. Monatslohn, Anstellungstyp und Partnerangabe
  // genau wie auf den anderen zwei Seiten.
  const liveDaten = {
    ...data,
    taxData: { ...taxData, useEnteredTaxable: useEntered },
    finanzen: { ...data.finanzen, taxableIncome: enteredTaxable > 0 ? enteredTaxable : undefined },
  };
  const profilEingaben = steuerEingabenAusDaten(liveDaten);
  const eingaben = {
    ...profilEingaben,
    kanton: canton,
    verheiratet, kinder, elterntarif,
    // Probiermodus: Wer im Profil nicht verheiratet ist und hier «verheiratet» ankreuzt, rechnet
    // ein gedachtes Alleinverdiener-Ehepaar (gekennzeichnet). Im Profil verheiratet → Angabe nötig.
    partnerAngegeben: profilEingaben.partnerAngegeben || !giltAlsVerheiratet(data.basis?.maritalStatus),
    // K117: die Kantonssteuer im Konkubinat mit Kindern fragt die Angabe im Profil, nicht den Probiermodus.
    partnerAngegebenProfil: profilEingaben.partnerAngegeben,
  };
  const steuern = steuernFuerProfil(eingaben);
  // K62.5: der Vergleich richtet sich nach der Partnerangabe im Profil, nicht nach dem Probiermodus.
  const vergleichEingaben = { ...eingaben, partnerAngegebenProfil: profilEingaben.partnerAngegeben };
  const vergleich = tarifvergleichFuerProfil(vergleichEingaben);
  const ohneVergleich = vergleich ? null : tarifvergleichGrund(vergleichEingaben);
  const annahmen = annahmenTexte(t, steuern.annahmen);
  const income = eingaben.nettolohnJahr;
  const taxResult = steuern.bund;
  const taxableIncome = steuern.steuerbar ?? 0;
  const estimatedTax = taxResult ? taxResult.steuer : 0;

  const handleInputChange = (key, value) => {
    setTaxData(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleSave = () => {
    // taxableIncome als geteilten Knoten mitspeichern (oder tilgen, wenn leer), das Häkchen dazu.
    onSave({ ...data, taxData: { ...taxData, useEnteredTaxable: useEntered }, ...steuerkantonSpeichern(data, canton), finanzen: { ...data.finanzen, taxableIncome: enteredTaxable > 0 ? enteredTaxable : undefined } });
  };

  const inputStyle = {
    width: '100%',
    padding: space.sm,
    marginBottom: space.sm,
    borderRadius: radius.sm,
    border: '1px solid ' + palette.border,
    background: palette.surface,
    color: palette.text,
    boxSizing: 'border-box',
    fontSize: text.sm
  };

  // Die Kantonstabelle wird mit demselben steuerbaren Einkommen gelesen.
  const schaetzung = steuern.kanton;
  const kantonal = schaetzung.kantonal;

  // a11y: Ansage nur beim Wechsel zwischen Zahl und Hinweis. Die Boxen selbst sind keine
  // Live-Region, sonst würde jede Eingabe vorgelesen (Muster: WohnkantonFrage, aria-live polite).
  // Zustand beim Rendern nachführen statt im Effekt (React: «Adjusting state when a prop changes»).
  const teileJetzt = hinweisTeile({ taxResult, canton, kantonal, gemeinsamDirekt: steuern.gemeinsamDirekt }).join('|');
  const [teileVorher, setTeileVorher] = useState(teileJetzt);
  const [ansage, setAnsage] = useState('');
  if (teileVorher !== teileJetzt) {
    setTeileVorher(teileJetzt);
    setAnsage(steuerAnsageText(t, teileJetzt ? teileJetzt.split('|') : []));
  }

  const buttonStyle = {
    padding: '10px 16px',
    background: palette.sand,
    color: palette.onSand,
    border: 'none',
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'money', size: 22 }), style: { marginBottom: space.sm } }, t('tax.title')),

    React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: '1.6', marginTop: 0, marginBottom: space.md, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('tax.intro')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: space.md, marginBottom: '20px' } },
      // Left side: Input
      React.createElement('div', null,
        React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('tax.inputs')),

        React.createElement(LabeledField, { palette, label: t('tax.taxCanton'), style: { marginBottom: space.md } },
          (id) => React.createElement('div', { style: { position: 'relative' } },
            React.createElement('select', { id, value: canton, onChange: (e) => { const c = e.target.value; setCanton(c); setUebernommen(false); setFrage(fragtNachWohnkanton(data, c)); }, style: { ...inputStyle, marginBottom: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px' } },
              React.createElement('option', { value: '' }, t('common.select')),
              ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'].map(c => React.createElement('option', { key: c, value: c }, c))
            ),
            React.createElement('div', { style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' } }, aufklappZeichen(true))
          )
        ),
        frage && React.createElement(WohnkantonFrage, {
          palette, t, canton,
          // Nur dieser Klick ändert den Wohnkanton — und speichert beide Kantone sofort.
          onJa: () => { onSave(steuerkantonSpeichern(data, canton, true)); setFrage(false); setUebernommen(true); },
          onNein: () => setFrage(false),
        }),
        uebernommen && React.createElement('div', { role: 'status', style: { marginBottom: space.md, fontSize: text.xs, color: palette.mid } }, hinweisZeichen('check'), t('tax.wohnkantonUebernommen', { canton: getCantonName(canton, t) })),

        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.md, cursor: 'pointer', ...(isMobile ? { minHeight: '44px' } : {}) } },
          React.createElement('input', {
            type: 'checkbox',
            checked: verheiratet,
            onChange: (e) => setVerheiratet(e.target.checked),
            style: { accentColor: palette.sand }
          }),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, t('tax.married'))
        ),

        React.createElement(LabeledField, { palette, label: t('tax.children'), style: { marginBottom: space.md } },
          (id) => React.createElement('div', { style: { position: 'relative' } },
            React.createElement('select', { id, value: kinder, onChange: (e) => setKinder(Number(e.target.value)), style: { ...inputStyle, marginBottom: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px' } },
              [0, 1, 2, 3, 4, 5, 6].map(n => React.createElement('option', { key: n, value: n }, n))
            ),
            React.createElement('div', { style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' } }, aufklappZeichen(true))
          )
        ),

        !verheiratet && kinder > 0 && React.createElement('label', { htmlFor: 'tax-elterntarif', style: { display: 'flex', alignItems: 'flex-start', gap: space.sm, marginBottom: space.xs, cursor: 'pointer', ...(isMobile ? { minHeight: '44px' } : {}) } },
          React.createElement('input', {
            type: 'checkbox',
            id: 'tax-elterntarif',
            checked: elterntarif,
            onChange: (e) => setTaxData(prev => ({ ...prev, elterntarif: e.target.checked })),
            style: { accentColor: palette.sand, marginTop: '2px' }
          }),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, t('tax.elterntarifConfirm'))
        ),
        !verheiratet && kinder > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.md } },
          hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('tax.elterntarifHint', { value: STEUER_PARAMS.kinderabzugProKind }))
        ),

        React.createElement('div', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium } }, t('tax.grossIncome')),
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.sandDeep, padding: space.sm, background: palette.up, borderRadius: radius.sm, marginBottom: space.xs } }, 'CHF ' + income.toFixed(0)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('budgetSync.bvgReferenceNote'))),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.md, fontStyle: 'italic' } }, hinweisZeichen(), t(eingaben.dreizehnter === 'ja' ? 'tax.netIncomeNote13' : 'tax.netIncomeNote')),

        React.createElement(LabeledField, { palette, label: t('tax.taxableIncomeDirect'), style: { marginBottom: space.xs } },
          React.createElement('input', {
            type: 'number',
            inputMode: 'decimal',
            value: taxableInput,
            onChange: (e) => {
              const v = e.target.value;
              setTaxableInput(v);
              setUseEnteredTaxable((Number(v) || 0) > 0);
            },
            placeholder: t('tax.taxableIncomeDirectPlaceholder'),
            style: inputStyle
          })
        ),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.md } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('tax.taxableIncomeDirectHint'))),

        enteredTaxable > 0 && React.createElement('label', { htmlFor: 'tax-use-entered', style: { display: 'flex', alignItems: 'flex-start', gap: space.sm, marginBottom: space.md, cursor: 'pointer', ...(isMobile ? { minHeight: '44px' } : {}) } },
          React.createElement('input', {
            type: 'checkbox',
            checked: useEnteredTaxable,
            onChange: (e) => setUseEnteredTaxable(e.target.checked),
            id: 'tax-use-entered',
            style: { accentColor: palette.sand, marginTop: '2px' }
          }),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, t('tax.useTaxableEntered'))
        ),

        useEntered !== true && deductions.map(ded => React.createElement('div', { key: ded.key, style: { marginBottom: '12px' } },
          React.createElement(LabeledField, { palette, label: ded.label, style: { marginBottom: 0 } },
            React.createElement('input', {
              type: 'number',
              inputMode: 'decimal',
              value: taxData[ded.key] || '',
              onChange: (e) => handleInputChange(ded.key, e.target.value),
              placeholder: '0',
              style: inputStyle
            })
          ),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, 'Max: CHF ' + ded.max)
        ))
      ),

      // Right side: Result
      React.createElement('div', { style: { background: palette.up, padding: space.md, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement(PanelTitle, { palette, style: { marginBottom: space.md } }, t('tax.calculation')),
        React.createElement('div', { 'data-testid': 'steuer-ansage', role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle }, ansage),

        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.grossIncome')),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + income.toFixed(0))
        ),

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        steuern.quelle === 'estv' && React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('common.total') + ' (-)'),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '- CHF ' + (income - taxableIncome).toFixed(0))
        ),

        steuern.quelle === 'estv' && React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        // E39: das eine steuerbare Einkommen — für Bund und Kanton.
        steuern.steuerbar != null && React.createElement('div', { 'data-testid': 'steuerbares-einkommen', style: { marginBottom: space.md, padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, steuern.quelle === 'estv' ? t('tax.taxableIncomeEstimated') : t('tax.taxableIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + taxableIncome.toFixed(0)),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            steuern.quelle === 'estv' ? t('tax.taxableEstimatedHint') : t('tax.taxableEnteredHint')
          ),
          // R4: die Annahmen hinter der Zahl, sichtbar am Ergebnis.
          annahmen.length > 0 && React.createElement('div', { 'data-testid': 'steuer-annahmen', style: { fontSize: text.xs, color: palette.text, marginTop: space.xs } },
            ...annahmen.map((a) => React.createElement('div', { key: a }, hinweisZeichen(), a))
          )
        ),

        taxResult && taxResult.kinderabzug > 0 ? React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.childDeduction')),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '- CHF ' + taxResult.kinderabzug)
        ) : null,

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        // Bruttolohn: dieselbe Begründung steht gleich darunter bei der Kantonssteuer — hier nur kurz.
        !taxResult && React.createElement('div', { 'data-testid': 'bundessteuer-ohne-zahl', style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.federalTax')),
          React.createElement('p', { style: { margin: 0, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } }, (canton && ERKLAERT_IN_ORIENTIERUNG.includes(steuern.grund)) ? t('tax.noTaxFigure') : bundOhneZahlText(t, steuern.grund))
        ),

        taxResult && React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } },
            t('tax.federalTax'),
            // K86: kein Satz, wenn das steuerbare Einkommen der gemeinsame Wert ist (effektiverSatz null).
            taxResult.effektiverSatz != null ? ' ~' + taxResult.effektiverSatz + '%' : ''
          ),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + estimatedTax.toFixed(0)),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('tax.tariff') + ': ' + (taxResult?.tarif === 'eltern' ? t('tax.parentTariff') : verheiratet ? t('tax.marriedTariff') : t('tax.singleTariff')),
            ' · ' + t('tax.marginalRate') + ': ' + grenzsteuersatz(taxableIncome, verheiratet || taxResult?.tarif === 'eltern').toFixed(2) + '%'
          ),
          // K86: warum hier kein Satz und unten kein Nettoeinkommen steht.
          steuern.gemeinsamDirekt && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('tax.gemeinsamDirektHinweis')))
        ),

        (() => {
          if (!canton) return React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px dashed ' + palette.border } },
            React.createElement('div', { style: { fontSize: text.sm, color: palette.soft, fontStyle: 'italic' } }, t('tax.selectCantonHint'))
          );
          // E38: wo die Tabelle nicht trägt, keine Zahl — ruhige Orientierung mit dem Weg zum amtlichen Rechner.
          if (!kantonal) return React.createElement(KantonssteuerOrientierung, { palette, t, canton, schaetzung, jahr: KANTONAL_DATA_VERSION });
          return React.createElement(React.Fragment, null,
            React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.xs, marginBottom: space.xs, flexWrap: 'wrap' } },
                React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } },
                  t('tax.cantonalAndMunicipal') + ' (' + kantonal.hauptort + ')'
                ),
                // K13: am Ergebnis sichtbar als grobe Schätzung kennzeichnen (Bauliste §9-E20/K13).
                React.createElement('span', {
                  style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.soft, background: palette.up, border: '1px solid ' + palette.border, borderRadius: '999px', padding: '1px 8px' }
                }, t('tax.roughEstimateBadge'))
              ),
              React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + kantonal.kantonalUndGemeinde),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
                t('tax.basedOnHauptort', { year: KANTONAL_DATA_VERSION })
              )
            ),
            React.createElement('div', { 'aria-live': 'polite', style: { marginBottom: space.md, padding: '12px', background: palette.sand + '12', borderRadius: radius.sm, border: '1px solid ' + palette.sand + '30' } },
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.totalEstimate')),
              React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + kantonal.total),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
                t('tax.totalNote')
              )
            )
          );
        })(),

        // K86: eigener Nettolohn minus Steuer auf das gemeinsame Einkommen ergibt keine Aussage.
        taxResult && !steuern.gemeinsamDirekt && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.netIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } },
            'CHF ' + (income - (kantonal ? kantonal.total : estimatedTax)).toFixed(0)
          ),
          !kantonal && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } }, t('tax.netIncomeFederalOnly'))
        )
      )
    ),

    // R4: je Zivilstand das passende steuerbare Einkommen (tarifvergleichFuerProfil).
    taxResult && vergleich && React.createElement(SteuerSaeulen, {
      palette, t,
      istVerheiratet: verheiratet,
      vergleich,
      onSelect: (v) => setVerheiratet(v),
    }),
    taxResult && vergleich && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
      hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('tax.saeulen.abzuegeNote', { ledig: chf(vergleich.steuerBaresEinkommen), verheiratet: chf(vergleich.steuerBaresEinkommenVerheiratet) }))
    ),
    taxResult && !vergleich && React.createElement('div', { style: { marginTop: space.lg, padding: space.md, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PanelTitle, { palette, style: { marginBottom: space.xs } }, t('tax.saeulen.title')),
      React.createElement('div', { 'data-testid': 'tarifvergleich-ohne-zahl', style: { fontSize: text.sm, color: palette.mid } }, t(VERGLEICH_OHNE_ZAHL_TEXT[ohneVergleich] || 'tax.saeulen.nurGeschaetzt'))
    ),

    React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%' } }, hinweisZeichen('kaestchen'), t('tax.saveData')),

    React.createElement('div', { style: { marginTop: space.md, padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid } },
      hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('tax.disclaimer'))
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.sm } }, hinweisZeichen(), t('tax.federalTax') + ': DBG Art. 36, ' + t('tax.dataVersion') + ': ' + STEUER_DATA_VERSION),
    canton && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, hinweisZeichen(), t('tax.cantonalAndMunicipal') + ': ' + t('tax.dataVersion') + ': ' + t('tax.bandChecked', { year: KANTONAL_DATA_VERSION, date: datumCH(kantonsdatenAbgerufen(canton)) })),
    React.createElement(OfficialLinkBox, { palette, t, data, ids: 'steuern', cantonalKey: 'steuererklaerung' }),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, hinweisZeichen(), t('trust.localOnly')),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, t('nav.finanzUebersicht')),

    // Crosslink: Frist nicht zu schaffen? → Fristverlängerungs-Brief (Vorlage existiert)
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('briefe'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm }
    }, t('briefe.taxExtension.title'))
  );
};

export default TaxCalculator;
