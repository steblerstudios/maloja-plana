import React from 'react';
import { RechnerForm } from './components/RechnerForm.jsx';
import { hinweisZeichen } from './IconSystem.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { getMietzinsbeitraege, mietzinsIncomeLimit, mietzinsErgebnis, bsHaushalt, istJungErwachsen } from './data/mietzinsbeitraege.js';
import { getCantonName, getHouseholdInfo } from './config/cantonalData.js';
import { lookupPLZ } from './data/plzGemeinde.js';
import { MietVergleich } from './components/MietVergleich.jsx';
import { renderSource } from './utils/renderSource.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { zahl } from './utils/geld.js';
import { dreizehnterStatus, hauptlohnMonate } from './utils/dreizehnter.js';
import { giltAlsVerheiratet } from './utils/zivilstand.js';
import { partnerEinkommenRoh } from './utils/partnereinkommen.js';
import { CHAPTER_KEYS } from './config/constants.js';

// Mietzinsbeiträge-Orientierung — parallel zur Prämienorientierung (PraemienOrientierung)
// und mit Schnellcheck wie die IPV (PremiumSubsidy). Rechnet — wo möglich — mit den BEREITS
// erfassten Beträgen (Einkommen, Miete, Haushalt) gegen recherchierte, belegte Kanton-Eckwerte
// (data/mietzinsbeitraege.js). Den Vergleich mit einer «kantonalen Mietzins-Limite» gibt es seit
// 28.09.2026 nicht mehr: die Tabelle war unbelegt (siehe config/cantonalData.js).
// Bewusst eine EINSCHÄTZUNG, keine verbindliche Zusage — die Programme sind kantonal/kommunal
// fragmentiert; verbindlich ist immer die kantonale Stelle (würdevoll, keine falsche Hoffnung).
// Rechner-Form X (F7-A2, 27.10.2026): Einschätzung zuerst, mit dem Miet-Barometer aus dem Kapitel Wohnen
// (MietVergleich, F7-R3); darunter die Angaben, was zu tun ist (Kanton, Unterlagen), die Stelle, die Quelle.
export const MietzinsOrientierung = ({ palette, t, data, onNavigate, onUpdateData, isDarkMode }) => {
  const canton = data?.basis?.canton || (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length < 4) return '';
    const gem = lookupPLZ(plz);
    return gem && gem.length ? gem[0].kanton : '';
  })();

  const info = canton ? getMietzinsbeitraege(canton) : null;
  const hasProgram = !!info && info.state === 'has';

  const hh = getHouseholdInfo(data) || {};
  const householdSize = hh.householdSize || 1;
  const childrenCount = hh.childrenCount || 0;

  const monthlyIncome = parseFloat(data?.finanzen?.monthlyIncome) || 0;
  // 13. Monatslohn: dieselbe Regel wie Steuer und IPV (utils/dreizehnter.js). Vorher immer ×12 —
  // mit 13. lag das Jahreseinkommen 8,3 % zu tief, die Einschätzung zu grosszügig.
  // Massgebend ist in allen vier Programmen das HAUSHALTSeinkommen (Fachprüfung 25.09.2026:
  // BS «Summe aller Einkünfte des Haushalts», bs.ch · BL MBG § 8 Abs. 1 «Nettoeinkommen aller im
  // Haushalt lebenden … Personen» · ZG Merkblatt Sept. 2025 «Haushaltseinkommen nach direkter
  // Bundessteuer» · GE LRDU). Darum: Nebenerwerb ×12 immer; Partnereinkommen bei Ehe/eingetragener
  // Partnerschaft. Im Konkubinat hängt es an Dauer und gemeinsamen Kindern (BS: mit Kindern oder nach
  // fünf Jahren · BL: «gefestigtes Konkubinat» § 4 Abs. 2 lit. b MBG · ZG: nicht belegt) — dort NICHT
  // eingerechnet, aber die Zahl mit ihm genannt. Vorher zählte nur der Hauptlohn: zu grosszügig.
  const partnerMonat = hh.partnerIncome || 0;
  const partnerZaehlt = giltAlsVerheiratet(data?.basis?.maritalStatus);
  const eigenesJahr = Math.round(monthlyIncome * hauptlohnMonate(data?.finanzen?.dreizehnter)
    + (parseFloat(data?.finanzen?.sideIncome) || 0) * 12);
  const annualIncome = eigenesJahr + (partnerZaehlt ? Math.round(partnerMonat * 12) : 0);
  // Nicht verheiratet, aber eine zweite Person mit Einkommen im Haushalt (Konkubinat, ohne Zivilstand,
  // Wohngemeinschaft): nicht eingerechnet, die Zahl mit ihr steht daneben (Abschluss-Prüfung 25.09.2026 —
  // vorher nur bei «cohabiting», sonst fiel sie still weg).
  const konkubinatMitPartner = !partnerZaehlt && partnerMonat > 0
    ? eigenesJahr + Math.round(partnerMonat * 12) : null;
  // Verheiratet, Partnereinkommen nicht beantwortet: gerechnet ohne — wie «Alleinverdiener» bei der Steuer.
  const partnerRoh = partnerEinkommenRoh(data?.basis);
  const partnerOffen = partnerZaehlt && (partnerRoh === undefined || partnerRoh === null || String(partnerRoh).trim() === '');
  const ohneDreizehnten = monthlyIncome > 0 && dreizehnterStatus(data?.finanzen?.dreizehnter) === 'offen';
  const rentMonthly = (parseFloat(data?.wohnen?.rentAmount) || 0) + (parseFloat(data?.wohnen?.utilities) || 0);
  // BS ohne Ehe: die zweite erwachsene Person gehört (noch) nicht zur Haushaltseinheit — Grenze ohne sie,
  // passend zum Einkommen ohne sie; die Grenze mit ihr nennt der Hinweis (vorher bis 2'250 zu grosszügig).
  const ohneZweitePerson = info?.limitFormel === 'bs' && !partnerZaehlt && (hh.adults || 1) >= 2 ? 1 : 0;
  const incomeLimit = hasProgram ? mietzinsIncomeLimit(info, householdSize - ohneZweitePerson, childrenCount, hh.children || []) : null;
  const grenzeMitPartner = ohneZweitePerson && hasProgram ? mietzinsIncomeLimit(info, householdSize, childrenCount, hh.children || []) : null;
  // BS: jemand zwischen 18 und 24 im Haushalt — ob in Erstausbildung, entscheidet, ob er zählt.
  const bsJungOffen = info?.limitFormel === 'bs' && bsHaushalt(householdSize - ohneZweitePerson - childrenCount, hh.children || []).offen;

  // ZG: gilt nur für WFG-Wohnungen — die Antwort steht in wohnen.wfgWohnung (Frage unten im Schnellcheck).
  const wfg = data?.wohnen?.wfgWohnung;

  // Einschätzung aus erfassten Beträgen + Kanton-Eckwerten (nie verbindlich).
  const assessment = (() => {
    if (!hasProgram) return null;
    if (info.group === 'families' && childrenCount === 0) return { key: 'familiesOnly', tone: 'soft' };
    if (info.wfgFrage && wfg === 'nein') return { key: 'wfgNein', tone: 'soft' };
    // GE: mietabhängiges barème · BL: Grenze je Haushalt, von der Gemeinde festgesetzt (§ 6/§ 10 MBG).
    // BS: Haushaltstyp, den die Beitragstabelle nicht führt (drei und mehr Erwachsene ohne Kind).
    if (incomeLimit == null) return { key: info.limitArt === 'gemeinde' ? 'municipalLimit' : bsJungOffen ? 'jungeErwachseneOffen' : info.limitFormel ? 'tableLimit' : 'effortBased', tone: 'neutral' };
    if (!annualIncome) return { key: 'needIncome', tone: 'neutral' };
    if (annualIncome > incomeLimit) return { key: 'incomeHigh', tone: 'soft', params: { income: zahl(annualIncome, { hoechstens: 2 }), limit: zahl(incomeLimit, { hoechstens: 2 }) } };
    return { key: 'likely', tone: 'good', params: { income: zahl(annualIncome, { hoechstens: 2 }), limit: zahl(incomeLimit, { hoechstens: 2 }) } };
  })();
  // Grosser Ergebnis-Satz (Form X): «gut» in sageDeep, sonst Textfarbe — soft wäre als Hauptsatz zu blass.
  const toneColor = (tone) => tone === 'good' ? (palette.sageDeep || palette.text) : palette.text;
  // O3: die Art des Ergebnisses, abgeleitet aus der Einschätzung oben (data/mietzinsbeitraege.js).
  const art = mietzinsErgebnis({ info, assessmentKey: assessment && assessment.key, annualIncome });

  const linkBtn = { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: '44px', textAlign: 'left', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm + 'px' };

  const klein = { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal };
  const auswahlStil = { padding: '8px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', appearance: 'auto', minWidth: '200px' };
  const fragenLabel = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };

  // Ergebnis: die Einschätzung gross, dann das Miet-Barometer. Ohne Kanton/Programm der App-Satz.
  const ergebnis = hasProgram && assessment && React.createElement(React.Fragment, null,
    React.createElement('p', { style: { margin: 0, fontSize: text.lg, fontWeight: weight.semi, color: toneColor(assessment.tone), lineHeight: leading.tight } },
      hinweisZeichen(assessment.tone === 'good' ? 'check' : 'info'), t('mietzinsView.result_' + assessment.key, assessment.params || {}))
  );
  const ohneErgebnis = !canton
    ? React.createElement(React.Fragment, null, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('mietzinsView.enterCanton')))
    : t('mietzins.' + info.state);

  const vorbehalt = React.createElement(React.Fragment, null,
    // Frage offen, ×12 gerechnet: nur wo es die Einschätzung kippen kann (unter der Grenze).
    assessment && assessment.key === 'likely' && ohneDreizehnten && React.createElement('div', { style: klein }, hinweisZeichen(), t('mietzinsView.annahmeOhneDreizehnten')),
    // Bedingung, die die App nicht kennt (ZG: nur WFG-Wohnungen) — beim positiven Ergebnis sichtbar.
    assessment && assessment.key === 'likely' && info.bedingungKey && !(info.wfgFrage && wfg === 'ja') && React.createElement('div', { style: klein }, hinweisZeichen(), t(info.bedingungKey)),
    // ZG (steuerbar) / BS (massgebend nach SoHaG) messen ein Einkommen nach Abzügen — meist tiefer als
    // der Lohn, mit dem hier gerechnet wird. Knapp über der Grenze kann es reichen.
    assessment && assessment.key === 'incomeHigh' && info.einkommensBasis && React.createElement('div', { style: klein },
      hinweisZeichen(), t(info.einkommensBasis === 'steuerbar' ? 'mietzinsView.steuerbarTiefer' : 'mietzinsView.massgebendTiefer')),
    // Ohne Ehe: ob das Einkommen der zweiten Person zählt, entscheidet die Stelle — die Zahlen mit ihr stehen daneben.
    assessment && (assessment.key === 'likely' || assessment.key === 'incomeHigh') && konkubinatMitPartner != null && React.createElement('div', { style: klein },
      hinweisZeichen(), grenzeMitPartner != null
        ? t('mietzinsView.konkubinatPartnerGrenze', { mit: zahl(konkubinatMitPartner, { hoechstens: 2 }), grenze: zahl(grenzeMitPartner, { hoechstens: 2 }) })
        : t('mietzinsView.konkubinatPartner', { mit: zahl(konkubinatMitPartner, { hoechstens: 2 }) })),
    // BS: ab AHV-Referenzalter kein Anspruch (MBG 890.500 § 4 Abs. 2). Die App kennt nur «pensioniert» —
    // das kann auch eine Frühpensionierung sein, darum Hinweis statt Ausschluss.
    assessment && assessment.key === 'likely' && info.limitFormel === 'bs' && hh.isRetired && React.createElement('div', { style: klein }, hinweisZeichen(), t('mietzinsView.referenzalterBS')),
    // BS: Kind ohne Altersangabe zählt als minderjährig (bsHaushalt) — sichtbar machen.
    assessment && (assessment.key === 'likely' || assessment.key === 'incomeHigh') && info.limitFormel === 'bs' && (hh.children || []).some((c) => c?.age == null || c?.age === '' || !Number.isFinite(Number(c?.age))) && React.createElement('div', { style: klein },
      hinweisZeichen(), t('mietzinsView.kindOhneAlter')),
    // Verheiratet ohne Angabe zum Partnereinkommen: gerechnet ohne — sichtbar.
    assessment && assessment.key === 'likely' && partnerOffen && React.createElement('div', { style: klein }, hinweisZeichen(), t('mietzinsView.partnerOffen')),
    // ZG 50'000–60'000: nur bei Mietbelastung über 25 % (nach Verbilligung) — hier nur mit Miete vor Verbilligung prüfbar.
    assessment && assessment.key === 'likely' && info.mietbelastung && annualIncome > info.mietbelastung.ab && rentMonthly * 12 <= info.mietbelastung.anteil * annualIncome && React.createElement('div', { style: klein },
      hinweisZeichen(), t('mietzinsView.mietbelastungZG')),
    // F7-R3: das Instrument des Kapitels Wohnen — «Wo steht Ihre Miete?» (dasselbe Bauteil wie in der Finanz-Übersicht).
    canton && React.createElement('div', { style: { marginTop: space.md + 'px' } },
      React.createElement(MietVergleich, { palette, t, data, isDarkMode, canton }))
  );

  // Angaben: was die Einschätzung verwendet (aus dem Profil), dazu die Rückfragen einzelner Kantone.
  const angabenInhalt = React.createElement('div', { style: { fontSize: text.sm, color: palette.text, paddingBottom: space.xs + 'px' } },
    React.createElement('p', { style: { ...klein, marginTop: 0 } },
      t('mietzinsView.basis', {
        income: annualIncome ? zahl(annualIncome, { hoechstens: 2 }) : '—',
        rent: rentMonthly ? zahl(rentMonthly, { hoechstens: 2 }) : '—',
        size: householdSize,
      })),
    // ZG: die WFG-Frage — nur mit Schreibweg (onUpdateData); ohne bleibt es beim Hinweis am Ergebnis.
    hasProgram && info.wfgFrage && onUpdateData && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
      React.createElement('label', { htmlFor: 'mz-wfg', style: fragenLabel }, t('mietzinsView.wfgFrage')),
      React.createElement('select', {
        id: 'mz-wfg', value: wfg || '', 'aria-describedby': 'mz-wfg-hinweis',
        onChange: (e) => onUpdateData('wohnen', 'wfgWohnung', e.target.value),
        style: auswahlStil,
      },
        React.createElement('option', { value: '' }, t('common.select')),
        ['ja', 'nein', 'weissNicht'].map((v) => React.createElement('option', { key: v, value: v }, t('mietzinsView.wfg_' + v)))
      ),
      React.createElement('p', { id: 'mz-wfg-hinweis', style: klein }, t('mietzinsView.wfgHinweis'))
    ),
    // BS: je Kind zwischen 18 und 24 — in Erstausbildung? Nur dann zählt es zum Haushalt (SoHaV § 2/§ 3).
    // Die Antwort steht am Kind im Haushalt (basis.household.children[i].erstausbildung).
    hasProgram && info.limitFormel === 'bs' && onUpdateData && (hh.children || []).some(istJungErwachsen) && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
      (hh.children || []).map((c, i) => istJungErwachsen(c) && React.createElement('div', { key: i, style: { marginBottom: space.xs + 'px' } },
        React.createElement('label', { htmlFor: 'mz-ausb-' + i, style: fragenLabel },
          t('mietzinsView.erstausbildungFrage', { name: (c.name || '').trim() || t('mietzinsView.personAlter', { alter: Number(c.age) }) })),
        React.createElement('select', {
          id: 'mz-ausb-' + i, value: c.erstausbildung || '', 'aria-describedby': 'mz-ausb-hinweis',
          onChange: (e) => {
            const household = data?.basis?.household || {};
            const children = (household.children || []).map((k, j) => j === i ? { ...k, erstausbildung: e.target.value || undefined } : k);
            onUpdateData('basis', 'household', { ...household, children });
          },
          style: auswahlStil,
        },
          React.createElement('option', { value: '' }, t('common.select')),
          React.createElement('option', { value: 'ja' }, t('mietzinsView.wfg_ja')),
          React.createElement('option', { value: 'nein' }, t('mietzinsView.wfg_nein'))
        )
      )),
      React.createElement('p', { id: 'mz-ausb-hinweis', style: klein }, t('mietzinsView.erstausbildungHinweis'))
    ),
    // Fehlt etwas, führt ein Weg dorthin, wo man es einträgt.
    !canton && onNavigate && React.createElement('button', { type: 'button', style: linkBtn, onClick: () => onNavigate('praemien') }, t('mietzinsView.enterCantonLink')),
    // Ins Kapitel Finanzen oben zum Formular — nicht über `finanzuebersicht`: dessen Sprungmarke
    // liegt bei der Auswertung UNTER den Eingabefeldern (Befund Rundgang 24.10.2026).
    assessment && assessment.key === 'needIncome' && onNavigate && React.createElement('button', { type: 'button', style: linkBtn, onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('finanzen')) }, t('mietzinsView.enterIncomeLink'))
  );

  return React.createElement(RechnerForm, {
    palette, t, view: 'mietzins', onNavigate,
    titel: t('mietzinsView.title'), satz: t('mietzinsView.intro'),
    ergebnis, ohneErgebnis, art, vorbehalt,
    angaben: {
      erfasst: (canton ? 1 : 0) + (annualIncome > 0 ? 1 : 0) + (rentMonthly > 0 ? 1 : 0), gesamt: 3,
      inhalt: angabenInhalt,
    },
    // Was zu tun ist: das Programm im Kanton (belegt) und die Unterlagen, die meist gebraucht werden.
    tun: canton ? {
      titel: t('mietzinsView.cantonLabel', { name: getCantonName(canton, t) || canton }),
      inhalt: React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } },
        hasProgram && React.createElement('div', null, t('mietzins.' + info.state)),
        hasProgram && info.noteKey && React.createElement('div', { style: { marginTop: space.xs + 'px' } }, hinweisZeichen(), t(info.noteKey)),
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, margin: space.sm + 'px 0 ' + space.xs + 'px' } }, t('mietzinsView.docsTitle')),
        React.createElement('ul', { style: { paddingLeft: '20px', margin: 0 } },
          [t('mietzinsView.doc1'), t('mietzinsView.doc2'), t('mietzinsView.doc3')].map((d, i) =>
            React.createElement('li', { key: i, style: { marginBottom: '4px' } }, d)))
      ),
    } : null,
    stelle: canton && info.url && React.createElement('div', { style: { padding: space.sm + 'px 0', minHeight: '44px', boxSizing: 'border-box', borderBottom: '1px solid ' + palette.border } },
      React.createElement(ExternerLink, { t, href: info.url, style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } },
        info.state === 'has' ? t('mietzins.linkCanton') : t('mietzins.linkOverview'))),
    quelle: React.createElement(React.Fragment, null,
      React.createElement('div', null, renderSource(t('mietzinsView.source'), null, t)),
      React.createElement('div', { style: { marginTop: space.xs + 'px' } }, hinweisZeichen(), t('trust.localOnly'))),
  },
    canton && onNavigate && React.createElement('div', { style: { paddingTop: space.sm + 'px' } },
      React.createElement('button', { type: 'button', style: linkBtn, onClick: () => onNavigate('sync') }, t('mietzinsView.linkBudget')),
      React.createElement('button', { type: 'button', style: linkBtn, onClick: () => onNavigate('finanzuebersicht') }, t('nav.finanzUebersicht')))
  );
};

export default MietzinsOrientierung;
