import React, { useState, useMemo } from 'react';
import { lookupPLZ } from './data/plzGemeinde.js';
import { getRegionInfo } from './data/praemienRegionen.js';
import { getInsurerPremium, getInsurerAllFranchises, insurerNrFromName, insurerNameFromNr, allInsurerNrs, ERW_FRA, KIN_FRA } from './data/praemienDetail.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { linkifyDomains } from './utils/linkifyDomains.js';
import { KKLastCard } from './KKLastCard.jsx';

function ageClassFromBirth(dateStr) {
  if (!dateStr) return 'erwachsen';
  const birth = new Date(dateStr);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  if (age < 19) return 'kind';
  if (age < 26) return 'jung';
  return 'erwachsen';
}

function parseFranchise(val) {
  if (!val) return null;
  const s = String(val).replace(/[^0-9]/g, '');
  return s ? Number(s) : null;
}

export const PraemienOrientierung = ({ palette, t, data, onNavigate, onUpdateData }) => {
  const storedPLZ = data.wohnen?.postalCode || '';
  const [plzInput, setPlzInput] = useState(storedPLZ);
  const [selectedBfs, setSelectedBfs] = useState(null);
  const [detailNr, setDetailNr] = useState(null); // aufgeklappte Kasse im Vergleich

  const gemeinden = useMemo(() => {
    const plz = plzInput.trim();
    if (!plz || plz.length < 4) return [];
    return lookupPLZ(plz);
  }, [plzInput]);

  const activeBfs = selectedBfs || (gemeinden.length === 1 ? gemeinden[0].bfsNr : null);
  const activeGemeinde = gemeinden.find(g => g.bfsNr === activeBfs) || null;

  const regionInfo = useMemo(() => {
    if (!activeBfs) return null;
    return getRegionInfo(activeBfs);
  }, [activeBfs]);

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
    return { allFranchises: allFra, specificPremium };
  }, [insurerNr, regionInfo, ageClass, userFranchise]);

  // ── Marktplatz: alle Kassen vergleichen (günstigste zuerst) ──
  const targetInsurer = data.versicherungen?.targetInsurer || '';
  const compFranchise = userFranchise || (ageClass === 'kind' ? KIN_FRA[0] : ERW_FRA[0]);
  const allInsurers = useMemo(() => {
    if (!regionInfo) return [];
    const { kanton, region } = regionInfo;
    return allInsurerNrs()
      .map(nr => ({ nr, name: insurerNameFromNr(nr), premium: getInsurerPremium(nr, kanton, region, ageClass, compFranchise) }))
      .filter(x => x.premium != null && x.premium > 0)
      .sort((a, b) => a.premium - b.premium);
  }, [regionInfo, ageClass, compFranchise]);

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    section: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', fontSize: text.sm },
    label: { fontWeight: weight.semi, marginBottom: space.xs + 'px' },
    input: { width: '120px', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none' },
    gemeindeBtn: (active) => ({ padding: '6px 12px', fontSize: text.sm, border: '1px solid ' + (active ? palette.sage : palette.border), borderRadius: radius.sm + 'px', background: active ? palette.sage + '22' : palette.surface, color: active ? palette.sage : palette.text, cursor: 'pointer', fontFamily: 'inherit' }),
    highlight: { padding: space.md + 'px', background: palette.sage + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.sage, marginBottom: space.md + 'px' },
    warn: { padding: space.md + 'px', background: palette.gold + '22', borderRadius: radius.sm + 'px', border: '1px solid ' + palette.gold, marginBottom: space.md + 'px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: text.sm },
    th: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid ' + palette.border, color: palette.mid, fontWeight: weight.medium },
    td: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border },
    tdActive: { padding: '6px 8px', borderBottom: '1px solid ' + palette.border, fontWeight: weight.semi, color: palette.sage },
    nameBtn: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.text, textAlign: 'left' },
    targetBtn: (chosen) => ({ background: chosen ? palette.sage + '22' : 'none', border: '1px solid ' + (chosen ? palette.sage : palette.border), borderRadius: radius.sm + 'px', padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs, color: chosen ? palette.sage : palette.mid, fontWeight: chosen ? weight.semi : weight.normal }),
  };

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'insurance', size: 20 }),
      t('po.title')
    ),

    // Faden 3 / 3-I: KK-Last als % des Einkommens gegen WHO-10%-Richtwert
    React.createElement(KKLastCard, { palette, t, data, onNavigate }),

    React.createElement('div', { style: s.section },
      React.createElement('div', { style: s.label }, t('po.plzLabel')),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
        React.createElement('input', {
          type: 'text',
          inputMode: 'numeric',
          maxLength: 4,
          value: plzInput,
          onChange: (e) => { setPlzInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setSelectedBfs(null); },
          placeholder: '1000',
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

      plzInput.length === 4 && gemeinden.length === 0 && React.createElement('div', { style: { marginTop: space.sm + 'px', color: palette.rose, fontSize: text.xs } },
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
      )
    ),

    regionInfo && !insurer && React.createElement('div', { style: s.warn },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs + 'px' } },
        'ⓘ ' + t('po.noInsurer')
      ),
      React.createElement('div', { style: { fontSize: text.sm } }, t('po.noInsurerHint'))
    ),

    regionInfo && insurer && !insurerNr && React.createElement('div', { style: s.warn },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs + 'px' } },
        'ⓘ ' + t('po.insurerNotFound', { name: insurer })
      ),
      React.createElement('div', { style: { fontSize: text.sm } }, t('po.insurerNotFoundHint'))
    ),

    referenceData && referenceData.specificPremium && userPremium && React.createElement('div', { style: s.highlight },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sage, marginBottom: space.xs + 'px' } },
        t('po.comparison')
      ),
      React.createElement('div', { style: { fontSize: text.sm } },
        t('po.yourPremium', { amount: userPremium.toFixed(2) })
      ),
      React.createElement('div', { style: { fontSize: text.sm } },
        t('po.refPremium', { amount: referenceData.specificPremium.toFixed(2), franchise: userFranchise })
      ),
      Math.abs(userPremium - referenceData.specificPremium) > 1 && React.createElement('div', { style: { fontSize: text.sm, marginTop: space.xs + 'px', color: userPremium > referenceData.specificPremium ? palette.rose : palette.sage } },
        t(userPremium > referenceData.specificPremium ? 'po.premiumAbove' : 'po.premiumBelow', {
          diff: Math.abs(userPremium - referenceData.specificPremium).toFixed(2)
        })
      )
    ),

    referenceData && referenceData.allFranchises && referenceData.allFranchises.length > 0 && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { ...s.label, marginBottom: space.sm + 'px' } },
        t('po.franchiseTable', { insurer: insurer })
      ),
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('po.thFranchise')),
            React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, t('po.thPremium'))
          )
        ),
        React.createElement('tbody', null,
          referenceData.allFranchises.map(f =>
            React.createElement('tr', { key: f.franchise },
              React.createElement('td', { style: f.franchise === userFranchise ? s.tdActive : s.td },
                'CHF ' + f.franchise.toLocaleString()
              ),
              React.createElement('td', { style: { ...(f.franchise === userFranchise ? s.tdActive : s.td), textAlign: 'right' } },
                'CHF ' + f.premium.toFixed(2)
              )
            )
          )
        )
      )
    ),

    regionInfo && allInsurers.length > 0 && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { ...s.label, marginBottom: space.xs + 'px' } }, t('po.allInsurersTitle')),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px' } },
        t('po.compareFranchiseNote', { franchise: compFranchise.toLocaleString() })),
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('po.thInsurer')),
            React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, t('po.thPremium')),
            React.createElement('th', { style: s.th })
          )
        ),
        React.createElement('tbody', null,
          allInsurers.map(ins => {
            const isCurrent = insurerNr === ins.nr;
            const isChosen = targetInsurer === ins.name;
            const isOpen = detailNr === ins.nr;
            const out = [
              React.createElement('tr', { key: ins.nr },
                React.createElement('td', { style: s.td },
                  React.createElement('button', {
                    style: { ...s.nameBtn, color: isCurrent ? palette.sage : palette.text },
                    onClick: () => setDetailNr(isOpen ? null : ins.nr)
                  }, (isOpen ? '▾ ' : '▸ ') + ins.name + (isCurrent ? ' •' : ''))
                ),
                React.createElement('td', { style: { ...s.td, textAlign: 'right' } }, 'CHF ' + ins.premium.toFixed(2)),
                React.createElement('td', { style: { ...s.td, textAlign: 'right' } },
                  onUpdateData && React.createElement('button', {
                    style: s.targetBtn(isChosen),
                    onClick: () => onUpdateData('versicherungen', 'targetInsurer', isChosen ? '' : ins.name)
                  }, isChosen ? ('✓ ' + t('po.targetSelected')) : t('po.chooseTarget')))
              )
            ];
            if (isOpen) {
              const ladder = getInsurerAllFranchises(ins.nr, regionInfo.kanton, regionInfo.region, ageClass) || [];
              out.push(React.createElement('tr', { key: ins.nr + '-d' },
                React.createElement('td', { style: { ...s.td, paddingLeft: space.md + 'px' }, colSpan: 3 },
                  React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } },
                    ladder.map(f => 'CHF ' + f.franchise.toLocaleString() + ': CHF ' + f.premium.toFixed(2)).join('  ·  ')
                  )
                )
              ));
            }
            return out;
          })
        )
      ),
      targetInsurer && React.createElement('div', { style: { fontSize: text.sm, color: palette.sage, marginTop: space.sm + 'px', fontWeight: weight.medium } },
        t('po.targetChosenHint', { insurer: targetInsurer }))
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.md + 'px', fontStyle: 'italic' } },
      t('po.disclaimer')
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.sky, marginTop: space.xs } },
      linkifyDomains(t('po.source'))
    ),

    // Crosslink: vom Vergleich in den geführten Wechsel-Ablauf
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('kvgwechsel'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, '→ ' + t('kvgWechsel.title'))
  );
};

export default PraemienOrientierung;
