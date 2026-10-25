import React, { useState, useMemo, useEffect } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { lookupPLZ } from './data/plzGemeinde.js';
import { getRegionInfo, getRegionalComparison } from './data/praemienRegionen.js';
import { RegionalBarometer } from './components/RegionalBarometer.jsx';
import { getInsurerPremium, getInsurerAllFranchises, insurerNrFromName, insurerNameFromNr, allInsurerNrs, ERW_FRA, KIN_FRA } from './data/praemienDetail.js';
import { Icon, hinweisZeichen, erledigtZeichen, aufklappZeichen } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { UvgHinweis } from './components/UvgHinweis.jsx';
import { ageClassFromBirth, parseFranchise, franchiseOptimierer, gesundheitskostenBisher } from './data/franchiseTacho.js';
import { FranchiseKreuz } from './components/FranchiseKreuz.jsx';
import { zahl, betrag } from './utils/geld.js';
import { Brotkrume } from './components/Brotkrume.jsx';
import { VersicherungenInstrument } from './components/VersicherungenInstrument.jsx';
import { Schutzschild } from './components/Schutzschild.jsx';
import { schildOptionen } from './data/schutzschild.js';
import { franchiseVorschlag } from './data/franchiseTacho.js';
import { calculateIPV, getCantonName } from './config/cantonalData.js';
import { ipvAbzug, IPV_ABZUG_GRUND, fristHinweisKey } from './data/ipvAbzug.js';
import { nextNov30, fristKnopfDatum } from './KVGWechsel.jsx';

export const PraemienOrientierung = ({ palette, t, data, onNavigate, onUpdateData }) => {
  const storedPLZ = data.wohnen?.postalCode || '';
  const [plzInput, setPlzInput] = useState(storedPLZ);
  const [selectedBfs, setSelectedBfs] = useState(null);
  const [detailNr, setDetailNr] = useState(null); // aufgeklappte Kasse im Vergleich
  const [withUnfall, setWithUnfall] = useState(true); // UVG: Referenzprämie mit/ohne Unfalldeckung
  const [pickedFranchise, setPickedFranchise] = useState(null); // angeklickte Wunsch-Franchise fürs Vergleichen
  const [offenTeile, setOffenTeile] = useState({}); // welche aufklappbaren Teile offen sind (Übersicht)
  const [alleKassen, setAlleKassen] = useState(false); // «Alle Kassen»: erst fünf, dann alle

  const gemeinden = useMemo(() => {
    const plz = plzInput.trim();
    if (!plz || plz.length < 4) return [];
    return lookupPLZ(plz);
  }, [plzInput]);

  const activeBfs = selectedBfs || (gemeinden.length === 1 ? gemeinden[0].bfsNr : null);
  const activeGemeinde = gemeinden.find(g => g.bfsNr === activeBfs) || null;

  // „Nie zweimal eingeben": eine hier eingegebene, gültige PLZ ins Wohnen-Kapitel
  // zurückspeichern. Der zentrale Handler leitet daraus Kanton (→ IPV/Steuer) und
  // Gemeinde ab — so propagiert sie nach Budget, Mietzinsbeiträge usw.
  useEffect(() => {
    const plz = plzInput.trim();
    if (onUpdateData && plz.length === 4 && gemeinden.length > 0 && plz !== storedPLZ) {
      onUpdateData('wohnen', 'postalCode', plz);
    }
  }, [plzInput, gemeinden, storedPLZ, onUpdateData]);

  const regionInfo = useMemo(() => {
    if (!activeBfs) return null;
    return getRegionInfo(activeBfs);
  }, [activeBfs]);

  // Regionale Realität vs. nationaler Durchschnitt — gleiche Quelle/Definition (BAG).
  const regionalComparison = useMemo(() => {
    if (!activeBfs) return null;
    return getRegionalComparison(activeBfs, data.basis?.dateOfBirth);
  }, [activeBfs, data.basis?.dateOfBirth]);

  const insurer = data.versicherungen?.kkInsurer || '';
  const insurerNr = useMemo(() => insurer ? insurerNrFromName(insurer) : null, [insurer]);
  const ageClass = ageClassFromBirth(data.basis?.dateOfBirth);
  const userFranchise = parseFranchise(data.versicherungen?.franchise);
  const userPremium = data.versicherungen?.kkPremium ? Number(data.versicherungen.kkPremium) : null;

  const referenceData = useMemo(() => {
    if (!insurerNr || !regionInfo) return null;
    const kanton = regionInfo.kanton;
    const region = regionInfo.region;
    const allFra = getInsurerAllFranchises(insurerNr, kanton, region, ageClass);
    const specificPremium = userFranchise ? getInsurerPremium(insurerNr, kanton, region, ageClass, userFranchise) : null;
    // UVG: Referenzprämien ohne Unfalldeckung (nur Erw/Jung; Kinder haben keinen Ohne-Tarif)
    const allFraOhne = ageClass !== 'kind' ? getInsurerAllFranchises(insurerNr, kanton, region, ageClass, false) : null;
    const specificOhne = userFranchise && ageClass !== 'kind' ? getInsurerPremium(insurerNr, kanton, region, ageClass, userFranchise, false) : null;
    return { allFranchises: allFra, allFranchisesOhne: allFraOhne, specificPremium, specificOhne };
  }, [insurerNr, regionInfo, ageClass, userFranchise]);

  // ── Franchise-Optimierer: lohnt sich eine höhere Franchise? ──
  // Vergleicht tiefste vs höchste verfügbare Franchise (Mit-Unfall) der eigenen Kasse:
  // Prämien-Ersparnis/Jahr, max. Eigenanteil/Jahr (Reserve = Franchise + Selbstbehalt-Max)
  // und Break-even (Gesundheitskosten/Jahr, unter denen die hohe Franchise günstiger ist).
  // Rechnung in data/franchiseTacho.js — dieselbe, die das Dashboard-Instrument nutzt.
  const franchiseOpt = useMemo(() => franchiseOptimierer(referenceData?.allFranchises, ageClass), [referenceData, ageClass]);

  // Laufende, KVG-anrechenbare Gesundheitskosten dieses Jahres (aus den KK-Belegen) —
  // Zeigerwert des Franchise-Tachos. Gleiche Quelle/Definition wie der Franchise-Tab.
  const healthCostsYTD = useMemo(() => gesundheitskostenBisher(data), [data]);

  // ── Reserve-Check: kann der Maximalfall überhaupt getragen werden? ──
  // Die hohe Franchise spart Prämie, kostet im schlechten Jahr aber bis zu `reserve`
  // (Franchise + Selbstbehalt-Max) aus eigener Tasche. Ehrlich statt schönrechnen:
  // erst sicher, wenn dieses Polster da ist — ruhiger noch, wenn es für zwei Jahre reicht.
  const reserveCheck = useMemo(() => {
    if (!franchiseOpt) return null;
    const savings = parseFloat(data.finanzen?.savingsAccount) || 0;
    const need = franchiseOpt.reserve;   // Maximalfall einmal
    const ideal = need * 2;              // Vorgabe von Stebler Studios: „im Idealfall doppelt"
    let level;
    if (savings <= 0) level = 'none';        // nichts erfasst → sanft hinweisen
    else if (savings >= ideal) level = 'strong';
    else if (savings >= need) level = 'ok';
    else level = 'low';
    return { savings, need, ideal, level };
  }, [franchiseOpt, data.finanzen?.savingsAccount]);

  // ── Marktplatz: alle Kassen vergleichen (günstigste zuerst) ──
  const targetInsurer = data.versicherungen?.targetInsurer || '';
  // Vergleichs-Franchise: angeklickte Wunsch-Franchise, sonst die eigene, sonst tiefste Stufe.
  const compFranchise = pickedFranchise || userFranchise || (ageClass === 'kind' ? KIN_FRA[0] : ERW_FRA[0]);
  const allInsurers = useMemo(() => {
    if (!regionInfo) return [];
    const { kanton, region } = regionInfo;
    return allInsurerNrs()
      .map(nr => ({
        nr, name: insurerNameFromNr(nr),
        premium: getInsurerPremium(nr, kanton, region, ageClass, compFranchise),
        premiumOhne: ageClass !== 'kind' ? getInsurerPremium(nr, kanton, region, ageClass, compFranchise, false) : null,
      }))
      .filter(x => x.premium != null && x.premium > 0)
      .sort((a, b) => a.premium - b.premium);
  }, [regionInfo, ageClass, compFranchise]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px' },
    input: { width: '120px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    gemeindeBtn: (active) => ({ padding: '6px 12px', fontSize: text.sm, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? (palette.sageDeep || palette.sage) : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
    highlight: { padding: space.md + 'px', background: palette.sage + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage, marginBottom: space.md + 'px' },
    warn: { padding: space.md + 'px', background: palette.gold + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.gold, marginBottom: space.md + 'px' },
    // Feste Spaltenbreiten: bei 375 px schob die Kassen-Tabelle die Seite auf 385 px (25.09.2026).
    // Die Namensspalte bricht um, die Betragsspalten bleiben schmal, «CHF» steht einmal im Kopf.
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm, tableLayout: 'fixed' },
    th: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium, verticalAlign: 'bottom' },
    einheit: { display: 'block', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid },
    td: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border },
    tdActive: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border, fontWeight: weight.semi, color: palette.sageDeep },
    nameBtn: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.text, textAlign: 'left', overflowWrap: 'anywhere' },
    targetBtn: (chosen) => ({ background: chosen ? palette.sage + '22' : 'none', border: '1px solid ' + (chosen ? palette.sage : palette.border), borderRadius: radius.sm + 'px', padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: chosen ? (palette.sageDeep || palette.sage) : palette.mid, fontWeight: chosen ? weight.semi : weight.normal }),
  };
  // Betragsspalte: Kopf mit «CHF» darunter, damit die Zellen nur die Zahl tragen.
  const kopfBetrag = (key, label) => React.createElement('th', { key, style: { ...s.th, textAlign: 'right' } },
    label, React.createElement('span', { style: s.einheit }, 'CHF'));
  // Erste Spalte nimmt den Rest, jede Betragsspalte einen festen Anteil.
  const spalten = (betraege) => React.createElement('colgroup', null,
    React.createElement('col'),
    Array.from({ length: betraege }, (_, i) => React.createElement('col', { key: i, style: { width: betraege > 1 ? '29%' : '36%' } })));
  const zahlBetrag = (n) => zahl(n, { stellen: 2 });

  // ── Versicherungs-Übersicht (Fassung 6, Runde 9 AB; Schritt 3, Sophie 25.10.2026 «Baue 1 bis 9») ──
  // Aufbau wie die Finanz-Auswertung: Marken · Versicherungen pro Monat mit KK-Last · Zeilen mit Wert je Werkzeug ·
  // Schutzschild · vier aufklappbare Teile (die bisherige Prämien-Orientierung, unverändert gerechnet) · zwei Wege ·
  // Schlusssatz. Keine neue Rechnung: alle Werte aus denselben Quellen wie bisher.
  const h = React.createElement;
  const v = data.versicherungen || {};
  const modell = v.kkModel ? (t('chapters.versicherungen.fields.kkModel.options.' + v.kkModel) || v.kkModel) : '';
  const marken = [
    insurer && (modell ? insurer + ' · ' + String(modell).replace(/\s*\(.*\)\s*$/, '') : insurer),
    userFranchise && t('vu.markeFranchise', { franchise: zahl(userFranchise, { hoechstens: 2 }) }),
    regionInfo && t('vu.markeRegion', { kanton: getCantonName(regionInfo.kanton, t) || regionInfo.kanton, region: regionInfo.region }),
  ].filter(Boolean);

  // Zeilen mit Wert
  const vorschlag = franchiseOpt ? franchiseVorschlag(franchiseOpt, { costs: healthCostsYTD, eigeneFranchise: userFranchise, ersparnisse: data.finanzen?.savingsAccount }) : null;
  const heute = new Date();
  // Kündigungstermin nach der Prämienmitteilung (KVG Art. 7 Abs. 2): Eingang bei der Kasse bis 30. November, am
  // Wochenende der Werktag davor — dieselbe Rechnung wie der Ablauf «Krankenkasse wechseln» (Fachprüfung 25.10.2026).
  const kuendigungIso = nextNov30(heute);
  // IPV: was ankommt, sagt ipvAbzug — nie den rohen Anspruch aus calculateIPV (Frist vorbei, nur auf Gesuch, Verfügung; Fachprüfung).
  const ipv = calculateIPV(data);
  const abzug = ipvAbzug(data, ipv);
  const ipvNote = (key, params) => t(key, Object.fromEntries(Object.entries(params || {}).map(([k, x]) => [k, typeof x === 'number' && x > 3000 ? zahl(x) : x])));
  const ipvZeile = (() => {
    if (abzug.grund === IPV_ABZUG_GRUND.BESTAETIGT || abzug.grund === IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET) {
      return { wert: t('vu.ipvVerfuegt', { betrag: zahl(abzug.betrag) }), sub: t('vu.ipvVerfuegtSub') };
    }
    if (abzug.grund === IPV_ABZUG_GRUND.GESCHAETZT) {
      return { wert: t('vu.ipvBetrag', { betrag: zahl(abzug.betrag) }), sub: ipv.noteKey ? ipvNote(ipv.noteKey, ipv.noteParams) : t('vu.ipvSchaetzung', { jahr: heute.getFullYear() }) };
    }
    if (abzug.grund === IPV_ABZUG_GRUND.FRIST_VORBEI) return { wert: t('vu.ipvFrist'), sub: ipvNote(fristHinweisKey(ipv), abzug.frist) };
    if (abzug.grund === IPV_ABZUG_GRUND.GESUCH_NOETIG) return { wert: t('vu.ipvGesuch'), sub: ipv.gesuchNichtAbgezogenKey ? t(ipv.gesuchNichtAbgezogenKey) : t('nav.sub.kvgIpv') };
    if (ipv.belegt && !ipv.eligible) return { wert: t('vu.ipvKein'), sub: ipv.noteKey ? ipvNote(ipv.noteKey, ipv.noteParams) : t('nav.sub.kvgIpv') };
    return { wert: t('vu.ipvPruefen'), sub: t('nav.sub.kvgIpv') };
  })();
  // Gesundheitskosten: dieselbe Zahl wie das Franchise-Kreuz (bezahlt und offen, an die Franchise anrechenbar),
  // darunter, was davon bezahlt und was offen ist (Fachprüfung 25.10.2026).
  const belege = (Array.isArray(v.kkBelege) ? v.kkBelege : []).filter((b) => !b.datum || Number(String(b.datum).slice(0, 4)) === heute.getFullYear());
  const bezahlt = belege.filter((b) => b.status !== 'offen').reduce((x, b) => x + (Number(b.betrag) || 0), 0);
  const offen = belege.filter((b) => b.status === 'offen').reduce((x, b) => x + (Number(b.betrag) || 0), 0);
  const pk = Number(v.bvgBalance) > 0 ? Number(v.bvgBalance) : 0;
  // Nach dem Sprung steht der Fokus auf dem geöffneten Teil (A11y-Prüfung).
  const zuTeil = (id) => { setOffenTeile((o) => ({ ...o, [id]: true })); setTimeout(() => { const el = document.getElementById(id); if (el) { el.scrollIntoView({ block: 'start' }); const sm = el.querySelector('summary'); if (sm) sm.focus({ preventScroll: true }); } }, 0); };
  const zeilen = [
    { key: 'franchise', titel: t('vu.franchise'),
      wert: !vorschlag ? '' : vorschlag.art === 'wechsel' ? t('vu.eher', { franchise: zahl(vorschlag.franchise) }) : vorschlag.art === 'passt' ? t('vu.passt') : '',
      // Reicht das Polster nicht, steht der Vorbehalt in der Zeile — nicht nur im zugeklappten Kreuz (Fachprüfung).
      sub: vorschlag && vorschlag.polster
        ? (vorschlag.art === 'wechsel' ? t('instrumente.kreuzWechselPolster', { franchise: zahl(vorschlag.franchise) }) : t('instrumente.kreuzPasstPolster'))
        : franchiseOpt && franchiseOpt.breakEven != null ? t('vu.franchiseSub', { breakeven: zahl(franchiseOpt.breakEven, { hoechstens: 2 }), saving: zahl(franchiseOpt.annualSaving, { hoechstens: 2 }), jahr: franchiseOpt.praemienJahr || heute.getFullYear() }) : t('vu.franchiseOhne'),
      gehe: () => (franchiseOpt ? zuTeil('mp-vu-kreuz') : onNavigate && onNavigate('chapter', 3)) },
    { key: 'wechsel', titel: t('vu.wechsel'), wert: t('vu.kuendigung', { datum: fristKnopfDatum(kuendigungIso) }), sub: t('vu.wechselSub'), gehe: () => onNavigate && onNavigate('kvgwechsel') },
    { key: 'ipv', titel: t('nav.kvgIpv'),
      wert: ipvZeile.wert, sub: ipvZeile.sub,
      gehe: () => onNavigate && onNavigate('premium') },
    { key: 'kosten', titel: t('vu.kosten'), wert: belege.length ? betrag(bezahlt + offen) : '',
      sub: belege.length ? t('vu.kostenSub', { jahr: heute.getFullYear(), bezahlt: zahl(bezahlt), offen: zahl(offen) }) : t('vu.kostenLeer'),
      gehe: () => onNavigate && onNavigate('kvg') },
    { key: 'kvg', titel: t('nav.kvgLeistungen'), wert: '', sub: t('vu.kvgSub'), gehe: () => onNavigate && onNavigate('kvg') },
    { key: 'vorsorge', titel: t('vu.vorsorge'), wert: pk ? t('vu.pkGuthaben', { betrag: zahl(pk) }) : '', sub: t('vu.vorsorgeSub'), gehe: () => onNavigate && onNavigate('vorsorge') },
  ];
  const zeileKnopf = (z) => h('button', {
    key: z.key, type: 'button', className: 'mp-link', onClick: z.gehe, 'data-zeile': z.key,
    style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '56px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border + '88', padding: space.sm + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
  },
    h('span', { style: { flex: 1, minWidth: 0 } },
      h('span', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', flexWrap: 'wrap' } },
        h('span', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, z.titel),
        z.wert && h('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, z.wert)),
      // Kein Pegel: pegelState misst das rohe Einkommen, die Kantonsmodule (ZH, BE) ein anderes — er stünde neben
      // einem Betrag über der Linie (Fachprüfung 25.10.2026; pegel.js bleibt bewusst nicht verdrahtet).
      z.sub && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } }, z.sub)),
    h('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›'));

  // Aufklappbar: kontrolliert, damit die Franchise-Zeile das Kreuz öffnen kann.
  const teil = (id, titel, sub, inhalt) => h('details', {
    id, open: !!offenTeile[id] || undefined, 'data-teil': id,
    onToggle: (e) => { const auf = e.currentTarget.open; setOffenTeile((o) => (!!o[id] === auf ? o : { ...o, [id]: auf })); },
    style: { borderBottom: '1px solid ' + palette.border + '88', scrollMarginTop: 'var(--mp-sprungabstand)' },
  },
    // Flex auf einem inneren Teil, nicht auf summary — sonst verliert summary in WebKit seine Rolle (A11y-Prüfung).
    h('summary', { className: 'mp-summary', style: { cursor: 'pointer', minHeight: '48px', color: palette.text, listStyle: 'none', display: 'block', paddingTop: space.xs + 'px' } },
      h('span', { style: { display: 'block', minWidth: 0 } },
        h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, aufklappZeichen(!!offenTeile[id]), titel),
        sub && h('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, sub))),
    h('div', { style: { padding: space.sm + 'px 0 ' + space.md + 'px' } }, ...inhalt));

  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };

  return h('div', { style: s.card },
    onNavigate && React.createElement(Brotkrume, { palette, t, view: 'praemien', onNavigate }),
    h(PageTitle, { palette, icon: h(Icon, { name: 'insurance', size: 22 }), style: { marginBottom: space.xs + 'px' } }, t('po.title')),
    h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px', lineHeight: leading.relaxed } }, t('vu.satz')),

    marken.length > 0 && h('div', { 'data-teil': 'vu-marken', style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px', marginBottom: space.md + 'px' } },
      marken.map((m) => h('span', { key: m, style: { fontSize: text.xs, color: palette.text, padding: '4px 10px', borderRadius: radius.full + 'px', border: '1px solid ' + palette.border, background: palette.up } }, m))),

    // Ohne Prämienregion: die PLZ zuerst (sonst steht sie unter «Prämie regional»).
    !regionInfo && React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.label }, t('po.plzLabel')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
        React.createElement('input', {
          type: 'text',
          inputMode: 'numeric',
          maxLength: 4,
          value: plzInput,
          onChange: (e) => { setPlzInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setSelectedBfs(null); },
          placeholder: '1000', 'aria-label': t('po.plzLabel'),
          style: s.input
        }),
        activeGemeinde && React.createElement('span', { style: { color: palette.mid } },
          activeGemeinde.gemeinde + ' (' + activeGemeinde.kanton + ')'
        )
      ),

      gemeinden.length > 1 && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' } }, t('po.selectGemeinde')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' } },
          gemeinden.map(g =>
            React.createElement('button', {
              key: g.bfsNr,
              onClick: () => setSelectedBfs(g.bfsNr),
              style: s.gemeindeBtn(g.bfsNr === activeBfs)
            }, g.gemeinde + ' ' + g.kanton)
          )
        )
      ),

      plzInput.length === 4 && gemeinden.length === 0 && React.createElement('div', { style: { marginTop: space.sm + 'px', color: palette.roseDeep, fontSize: text.xs } },
        t('po.plzNotFound')
      )
    ),


    h(VersicherungenInstrument, { palette, t, versicherungen: v, allData: data, onNavigate, uebersicht: true }),

    h('section', { 'data-teil': 'vu-zeilen', 'aria-label': t('vu.zeilenAria') }, zeilen.map(zeileKnopf)),

    h('h3', { style: kapH }, t('instrumente.schild')),
    h(Schutzschild, { palette, t, versicherungen: v, klein: true, ...schildOptionen(data) }),

    h('div', { style: { marginTop: space.lg + 'px', borderTop: '1px solid ' + palette.border + '88' } },
      franchiseOpt && teil('mp-vu-kreuz', t('po.franchiseOptTitle'), franchiseOpt.breakEven != null ? t('vu.breakEven', { breakeven: zahl(franchiseOpt.breakEven, { hoechstens: 2 }) }) : '', [
    franchiseOpt && React.createElement('div', {
      style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border, marginBottom: space.md + 'px' },
    },
      // Franchise-Kreuz (seit 25.09.2026 statt Tacho): die zwei Gesamtkosten-Linien des Optimierers
      React.createElement(FranchiseKreuz, { palette, t, franchiseOpt, costs: healthCostsYTD, onNavigate }),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.normal, marginBottom: space.xs + 'px' } },
        t('po.franchiseOptSaving', { high: zahl(franchiseOpt.highFra, { hoechstens: 2 }), low: zahl(franchiseOpt.lowFra, { hoechstens: 2 }), saving: zahl(franchiseOpt.annualSaving, { hoechstens: 2 }) })),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.xs + 'px' } },
        t('po.franchiseOptReserve', { reserve: zahl(franchiseOpt.reserve, { hoechstens: 2 }), sb: franchiseOpt.sbMax })),
      franchiseOpt.breakEven != null && React.createElement('div', { style: { fontSize: text.sm, color: palette.sageDeep, lineHeight: leading.normal, marginBottom: space.xs + 'px', fontWeight: weight.medium } },
        t('po.franchiseOptBreakeven', { breakeven: zahl(franchiseOpt.breakEven, { hoechstens: 2 }) })),
      // Reserve-Check: trägt das Polster den Maximalfall? (sage = tragbar, gold = ruhiger Hinweis)
      reserveCheck && React.createElement('div', {
        style: {
          fontSize: text.sm,
          color: reserveCheck.level === 'strong' ? (palette.sageDeep || palette.sage) : (reserveCheck.level === 'ok' ? palette.text : (palette.goldDeep || palette.gold)),
          lineHeight: leading.normal, marginBottom: space.xs + 'px',
        },
      },
        t('po.reserveCheck_' + reserveCheck.level, {
          savings: zahl(reserveCheck.savings, { hoechstens: 2 }),
          need: zahl(reserveCheck.need, { hoechstens: 2 }),
          ideal: zahl(reserveCheck.ideal, { hoechstens: 2 }),
        }),
        // Bei dünner/fehlender Reserve ruhig in die Finanzübersicht verweisen.
        onNavigate && (reserveCheck.level === 'low' || reserveCheck.level === 'none') && React.createElement('button', {
          style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: '4px' },
          onClick: () => onNavigate('finanzuebersicht'),
        }, t('po.reserveCheckLink'))
      ),
      // (j) Wechsel-Häufigkeit: einmal pro Jahr, auf den 1. Januar, Frist Ende November
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.xs + 'px' } }, renderSource(t('po.franchiseChangeWhen'), null, t)),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px' } }, renderSource(t('po.franchiseOptSource'), null, t))
    )
      ]),
      regionInfo && teil('mp-vu-region', t('vu.regional'), '', [
    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.label }, t('po.plzLabel')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
        React.createElement('input', {
          type: 'text',
          inputMode: 'numeric',
          maxLength: 4,
          value: plzInput,
          onChange: (e) => { setPlzInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setSelectedBfs(null); },
          placeholder: '1000', 'aria-label': t('po.plzLabel'),
          style: s.input
        }),
        activeGemeinde && React.createElement('span', { style: { color: palette.mid } },
          activeGemeinde.gemeinde + ' (' + activeGemeinde.kanton + ')'
        )
      ),

      gemeinden.length > 1 && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' } }, t('po.selectGemeinde')),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' } },
          gemeinden.map(g =>
            React.createElement('button', {
              key: g.bfsNr,
              onClick: () => setSelectedBfs(g.bfsNr),
              style: s.gemeindeBtn(g.bfsNr === activeBfs)
            }, g.gemeinde + ' ' + g.kanton)
          )
        )
      ),

      plzInput.length === 4 && gemeinden.length === 0 && React.createElement('div', { style: { marginTop: space.sm + 'px', color: palette.roseDeep, fontSize: text.xs } },
        t('po.plzNotFound')
      )
    ),
    regionInfo && React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.label }, t('po.regionTitle')),
      React.createElement('div', null,
        t('po.regionInfo', { gemeinde: regionInfo.gemeinde, kanton: regionInfo.kanton, region: regionInfo.region })
      ),
      React.createElement('div', { style: { color: palette.mid, marginTop: space.xs + 'px' } },
        t('po.avgPremium', {
          kinder: regionInfo.praemien.kinder.toFixed(0),
          junge: regionInfo.praemien.junge.toFixed(0),
          erwachsene: regionInfo.praemien.erwachsene.toFixed(0)
        })
      ),
      // Regional vs. Schweiz — ruhiges Barometer (Fairness-Vision Stoßrichtung 1)
      regionalComparison && React.createElement(RegionalBarometer, {
        palette, t, comparison: regionalComparison, userValue: userPremium, kind: 'premium'
      })
    )
      ]),
      regionInfo && teil('mp-vu-vergleich', t('vu.vergleich'), referenceData && referenceData.specificPremium ? t('vu.referenz', { betrag: zahl(referenceData.specificPremium, { hoechstens: 2 }) }) : '', [
        h(UvgHinweis, { key: 'uvg', palette, t, data }),
    regionInfo && !insurer && React.createElement('div', { style: s.warn },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.xs + 'px' } },
        hinweisZeichen(), t('po.noInsurer')
      ),
      React.createElement('div', { style: { fontSize: text.sm } }, t('po.noInsurerHint'))
    ),

    regionInfo && insurer && !insurerNr && React.createElement('div', { style: s.warn },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.xs + 'px' } },
        hinweisZeichen(), t('po.insurerNotFound', { name: insurer })
      ),
      React.createElement('div', { style: { fontSize: text.sm } }, t('po.insurerNotFoundHint'))
    ),
    referenceData && referenceData.specificPremium && userPremium && (() => {
      const ohne = referenceData.specificOhne;
      const canToggle = ohne && Math.abs(ohne - referenceData.specificPremium) > 0.5;
      const shownRef = (!withUnfall && ohne) ? ohne : referenceData.specificPremium;
      const saving = ohne ? (referenceData.specificPremium - ohne) : 0;
      return React.createElement('div', { style: s.highlight },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sageDeep, marginBottom: space.xs + 'px' } },
          t('po.comparison')
        ),
        React.createElement('div', { style: { fontSize: text.sm } },
          t('po.yourPremium', { amount: userPremium.toFixed(2) })
        ),
        // UVG: Mit/Ohne-Unfall-Umschalter — nur wenn ein Ohne-Tarif existiert (Erw/Jung).
        canToggle && React.createElement('div', { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: space.xs + 'px', margin: space.xs + 'px 0' } },
          React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, t('po.unfallLabel') + ':'),
          React.createElement('div', { role: 'radiogroup', style: { display: 'flex', gap: '4px' } },
            [[true, t('po.mitUnfall')], [false, t('po.ohneUnfall')]].map(([val, label]) =>
              React.createElement('button', {
                key: String(val), type: 'button', role: 'radio', 'aria-checked': withUnfall === val,
                onClick: () => setWithUnfall(val), style: s.gemeindeBtn(withUnfall === val),
              }, label)
            )
          )
        ),
        React.createElement('div', { style: { fontSize: text.sm } },
          t('po.refPremium', { amount: shownRef.toFixed(2), franchise: userFranchise })
        ),
        canToggle && saving > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.sageDeep, marginTop: '2px' } },
          t('po.unfallSaving', { diff: saving.toFixed(2) })
        ),
        Math.abs(userPremium - shownRef) > 1 && React.createElement('div', { style: { fontSize: text.sm, marginTop: space.xs + 'px', color: userPremium > shownRef ? (palette.roseDeep || palette.rose) : (palette.sageDeep || palette.sage) } },
          t(userPremium > shownRef ? 'po.premiumAbove' : 'po.premiumBelow', {
            diff: Math.abs(userPremium - shownRef).toFixed(2)
          })
        )
      );
    })(),

    referenceData && referenceData.allFranchises && referenceData.allFranchises.length > 0 && (() => {
      const ohneList = referenceData.allFranchisesOhne;
      const hasOhne = ohneList && ohneList.length > 0;
      const ohneByFra = hasOhne ? Object.fromEntries(ohneList.map(f => [f.franchise, f.premium])) : null;
      return React.createElement('div', { style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: { ...s.label, marginBottom: space.xs + 'px' } },
          t('po.franchiseTable', { insurer: insurer })
        ),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px' } },
          t('po.pickFranchiseHint')),
        React.createElement('table', { style: s.table },
          spalten(hasOhne ? 2 : 1),
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { style: s.th }, t('po.thFranchise'), React.createElement('span', { style: s.einheit }, 'CHF')),
              kopfBetrag('mit', hasOhne ? t('po.mitUnfall') : t('po.thPremium')),
              hasOhne && kopfBetrag('ohne', t('po.ohneUnfall'))
            )
          ),
          React.createElement('tbody', null,
            referenceData.allFranchises.map(f => {
              const franchiseActive = f.franchise === compFranchise;
              const cell = franchiseActive ? s.tdActive : s.td;
              const ohnePrem = ohneByFra ? ohneByFra[f.franchise] : null;
              // (k) Mit/Ohne-Zelle einzeln anklickbar → wählt Franchise UND Unfall-Variante
              const variantCell = (variant, amount) => {
                const isActive = franchiseActive && (variant === 'mit' ? withUnfall : !withUnfall);
                return React.createElement('td', { key: variant, style: { ...s.td, textAlign: 'right', padding: '2px' } },
                  amount == null ? '–'
                    : React.createElement('button', {
                        type: 'button', 'aria-pressed': isActive,
                        onClick: () => { setPickedFranchise(f.franchise); setWithUnfall(variant === 'mit'); },
                        style: {
                          background: isActive ? palette.sage + '22' : 'none',
                          border: '1px solid ' + (isActive ? palette.sage : 'transparent'),
                          borderRadius: radius.sm + 'px', padding: '5px 6px', width: '100%', textAlign: 'right',
                          cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontVariantNumeric: 'tabular-nums',
                          color: isActive ? (palette.sageDeep || palette.sage) : (variant === 'ohne' ? palette.mid : palette.text),
                          fontWeight: isActive ? weight.semi : weight.normal,
                        },
                      }, erledigtZeichen(isActive, zahlBetrag(amount)))
                );
              };
              return React.createElement('tr', { key: f.franchise },
                React.createElement('td', { style: { ...cell, padding: 0 } },
                  React.createElement('button', {
                    type: 'button', onClick: () => setPickedFranchise(f.franchise),
                    style: { ...s.nameBtn, padding: '5px 8px', color: franchiseActive ? (palette.sageDeep || palette.sage) : palette.text, fontWeight: franchiseActive ? weight.semi : weight.normal },
                  }, zahl(f.franchise, { hoechstens: 2 }))
                ),
                hasOhne ? variantCell('mit', f.premium)
                  : React.createElement('td', { style: { ...cell, textAlign: 'right' } }, zahlBetrag(f.premium)),
                hasOhne && variantCell('ohne', ohnePrem)
              );
            })
          )
        )
      );
    })()
      ]),
      regionInfo && allInsurers.length > 0 && teil('mp-vu-kassen', t('po.allInsurersTitle'), t('vu.kassenZahl', { n: allInsurers.length }), [
    regionInfo && allInsurers.length > 0 && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px' } },
        t('po.compareFranchiseNote', { franchise: zahl(compFranchise, { hoechstens: 2 }) }) + ' ' + (onUpdateData ? t('po.chooseByPrice') : '')),
      // Franchise direkt hier wählbar (verschiedene Franchisen vergleichen) — treibt dieselbe Vergleichs-Franchise
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.xs + 'px', marginBottom: space.sm + 'px' } },
        React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, t('po.thFranchise') + ':'),
        (ageClass === 'kind' ? KIN_FRA : ERW_FRA).map(fr =>
          React.createElement('button', {
            key: fr, type: 'button', 'aria-pressed': compFranchise === fr,
            onClick: () => setPickedFranchise(fr), style: s.gemeindeBtn(compFranchise === fr),
          }, 'CHF ' + zahl(fr, { hoechstens: 2 }))
        )
      ),
      React.createElement('table', { style: s.table },
        spalten(ageClass !== 'kind' ? 2 : 1),
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('po.thInsurer')),
            kopfBetrag('mit', ageClass !== 'kind' ? t('po.mitUnfall') : t('po.thPremium')),
            ageClass !== 'kind' && kopfBetrag('ohne', t('po.ohneUnfall'))
          )
        ),
        React.createElement('tbody', null,
          (alleKassen ? allInsurers : allInsurers.slice(0, 5)).map(ins => {
            const isCurrent = insurerNr === ins.nr;
            const isOpen = detailNr === ins.nr;
            const cols = ageClass !== 'kind' ? 3 : 2;
            // gewählte Wunschkasse-Variante (Alt-Daten ohne targetUvg gelten als 'mit')
            const chosenVariant = targetInsurer === ins.name ? (data.versicherungen?.targetUvg || 'mit') : null;
            // Klickbare Preis-Zelle: wählt die Kasse in dieser Unfall-Variante als Wunschkasse
            const priceCell = (variant, amount) => React.createElement('td', { key: variant, style: { ...s.td, textAlign: 'right', padding: '2px' } },
              amount == null ? '–'
                : onUpdateData ? React.createElement('button', {
                    type: 'button', 'aria-pressed': chosenVariant === variant,
                    onClick: () => {
                      const sel = chosenVariant === variant;
                      onUpdateData('versicherungen', 'targetInsurer', sel ? '' : ins.name);
                      onUpdateData('versicherungen', 'targetUvg', sel ? '' : variant);
                    },
                    style: {
                      background: chosenVariant === variant ? palette.sage + '22' : 'none',
                      border: '1px solid ' + (chosenVariant === variant ? palette.sage : 'transparent'),
                      borderRadius: radius.sm + 'px', padding: '5px 6px', width: '100%', textAlign: 'right',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontVariantNumeric: 'tabular-nums',
                      color: chosenVariant === variant ? (palette.sageDeep || palette.sage) : (variant === 'ohne' ? palette.mid : palette.text),
                      fontWeight: chosenVariant === variant ? weight.semi : weight.normal,
                    },
                  }, erledigtZeichen(chosenVariant === variant, zahlBetrag(amount)))
                : zahlBetrag(amount)
            );
            const out = [
              React.createElement('tr', { key: ins.nr },
                React.createElement('td', { style: s.td },
                  React.createElement('button', {
                    style: { ...s.nameBtn, color: isCurrent ? (palette.sageDeep || palette.sage) : palette.text },
                    onClick: () => setDetailNr(isOpen ? null : ins.nr)
                  }, aufklappZeichen(isOpen), ins.name, isCurrent ? hinweisZeichen('check', 10) : null)
                ),
                priceCell('mit', ins.premium),
                ageClass !== 'kind' && priceCell('ohne', ins.premiumOhne)
              )
            ];
            if (isOpen) {
              const ladderMit = getInsurerAllFranchises(ins.nr, regionInfo.kanton, regionInfo.region, ageClass) || [];
              const ladderOhne = ageClass !== 'kind' ? (getInsurerAllFranchises(ins.nr, regionInfo.kanton, regionInfo.region, ageClass, false) || []) : null;
              const ohneMap = ladderOhne ? Object.fromEntries(ladderOhne.map(f => [f.franchise, f.premium])) : null;
              out.push(React.createElement('tr', { key: ins.nr + '-d' },
                React.createElement('td', { style: { ...s.td, paddingLeft: space.md + 'px' }, colSpan: cols },
                  React.createElement('table', { style: { ...s.table, fontSize: text.xs, fontVariantNumeric: 'tabular-nums' } },
                    spalten(ohneMap ? 2 : 1),
                    React.createElement('thead', null,
                      React.createElement('tr', null,
                        React.createElement('th', { style: s.th }, t('po.thFranchise'), React.createElement('span', { style: s.einheit }, 'CHF')),
                        kopfBetrag('mit', ohneMap ? t('po.mitUnfall') : t('po.thPremium')),
                        ohneMap && kopfBetrag('ohne', t('po.ohneUnfall'))
                      )
                    ),
                    React.createElement('tbody', null,
                      ladderMit.map(f => React.createElement('tr', { key: f.franchise },
                        React.createElement('td', { style: s.td }, zahl(f.franchise, { hoechstens: 2 })),
                        React.createElement('td', { style: { ...s.td, textAlign: 'right' } }, zahlBetrag(f.premium)),
                        ohneMap && React.createElement('td', { style: { ...s.td, textAlign: 'right', color: palette.mid } },
                          ohneMap[f.franchise] != null ? zahlBetrag(ohneMap[f.franchise]) : '–')
                      ))
                    )
                  )
                )
              ));
            }
            return out;
          })
        )
      ),
      allInsurers.length > 5 && React.createElement('button', {
        type: 'button', onClick: () => setAlleKassen((x) => !x),
        style: { marginTop: space.sm + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', fontSize: text.sm, color: palette.text, cursor: 'pointer', fontFamily: 'inherit' },
      }, t(alleKassen ? 'vu.wenigerKassen' : 'vu.alleKassen', { n: allInsurers.length })),
      targetInsurer && React.createElement('div', { style: { fontSize: text.sm, color: palette.sageDeep, marginTop: space.sm + 'px', fontWeight: weight.medium } },
        t('po.targetChosenHint', { insurer: targetInsurer }) + (ageClass !== 'kind' && data.versicherungen?.targetUvg ? ' (' + (data.versicherungen.targetUvg === 'ohne' ? t('po.ohneUnfall') : t('po.mitUnfall')) + ')' : ''))
    )
      ]),
    ),

    onNavigate && h('section', { 'data-teil': 'vu-wege', style: { marginTop: space.md + 'px' } },
      zeileKnopf({ key: 'zusatz', titel: t('zusatzWechsel.title'), sub: t('vu.zusatzSub'), gehe: () => onNavigate('zusatzwechsel') }),
      zeileKnopf({ key: 'scanner', titel: t('vu.scanner'), sub: t('nav.kkScanner'), gehe: () => onNavigate('kk') })),

    h('p', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.lg + 'px', lineHeight: leading.normal } }, t('vu.schluss')),
    h('div', { style: { fontSize: text.xs, color: palette.mid, fontStyle: 'italic', marginTop: space.xs + 'px' } }, t('po.disclaimer')),
    h('div', { style: { fontSize: text.xs, color: palette.skyDeep, marginTop: space.xs } }, renderSource(t('po.source'), null, t))
  );
};

export default PraemienOrientierung;
