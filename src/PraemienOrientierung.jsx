import React, { useState, useMemo, useEffect } from 'react';
import { lookupPLZ } from './data/plzGemeinde.js';
import { getRegionInfo, getRegionalComparison } from './data/praemienRegionen.js';
import { RegionalBarometer } from './components/RegionalBarometer.jsx';
import { getInsurerPremium, getInsurerAllFranchises, insurerNrFromName, insurerNameFromNr, allInsurerNrs, ERW_FRA, KIN_FRA } from './data/praemienDetail.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { KKLastCard } from './KKLastCard.jsx';
import { UvgHinweis } from './components/UvgHinweis.jsx';

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
  const [withUnfall, setWithUnfall] = useState(true); // UVG: Referenzprämie mit/ohne Unfalldeckung
  const [pickedFranchise, setPickedFranchise] = useState(null); // angeklickte Wunsch-Franchise fürs Vergleichen

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

    // UVG: Angestellte sind über den Arbeitgeber unfallversichert → Unfalldeckung
    // bei der Kasse abwählbar (tiefere Prämie). Zeigt nichts, wenn nicht angestellt.
    React.createElement(UvgHinweis, { palette, t, data }),

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
      ),
      // Regional vs. Schweiz — ruhiges Barometer (Fairness-Vision Stoßrichtung 1)
      regionalComparison && React.createElement(RegionalBarometer, {
        palette, t, comparison: regionalComparison, userValue: userPremium, kind: 'premium'
      })
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

    referenceData && referenceData.specificPremium && userPremium && (() => {
      const ohne = referenceData.specificOhne;
      const canToggle = ohne && Math.abs(ohne - referenceData.specificPremium) > 0.5;
      const shownRef = (!withUnfall && ohne) ? ohne : referenceData.specificPremium;
      const saving = ohne ? (referenceData.specificPremium - ohne) : 0;
      return React.createElement('div', { style: s.highlight },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sage, marginBottom: space.xs + 'px' } },
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
        canToggle && saving > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.sage, marginTop: '2px' } },
          t('po.unfallSaving', { diff: saving.toFixed(2) })
        ),
        Math.abs(userPremium - shownRef) > 1 && React.createElement('div', { style: { fontSize: text.sm, marginTop: space.xs + 'px', color: userPremium > shownRef ? palette.rose : palette.sage } },
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
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', { style: s.th }, t('po.thFranchise')),
              React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, hasOhne ? t('po.mitUnfall') : t('po.thPremium')),
              hasOhne && React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, t('po.ohneUnfall'))
            )
          ),
          React.createElement('tbody', null,
            referenceData.allFranchises.map(f => {
              // aktive Vergleichs-Franchise (angeklickt oder eigene) wird hervorgehoben
              const active = f.franchise === compFranchise;
              const cell = active ? s.tdActive : s.td;
              const ohnePrem = ohneByFra ? ohneByFra[f.franchise] : null;
              return React.createElement('tr', {
                key: f.franchise, onClick: () => setPickedFranchise(f.franchise),
                'aria-pressed': active, style: { cursor: 'pointer' },
              },
                React.createElement('td', { style: cell }, (active ? '✓ ' : '') + 'CHF ' + f.franchise.toLocaleString()),
                React.createElement('td', { style: { ...cell, textAlign: 'right' } }, 'CHF ' + f.premium.toFixed(2)),
                hasOhne && React.createElement('td', { style: { ...cell, textAlign: 'right', color: active ? palette.sage : palette.mid } },
                  ohnePrem != null ? 'CHF ' + ohnePrem.toFixed(2) : '–')
              );
            })
          )
        )
      );
    })(),

    regionInfo && allInsurers.length > 0 && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { ...s.label, marginBottom: space.xs + 'px' } }, t('po.allInsurersTitle')),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px' } },
        t('po.compareFranchiseNote', { franchise: compFranchise.toLocaleString() }) + ' ' + (onUpdateData ? t('po.chooseByPrice') : '')),
      React.createElement('table', { style: s.table },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: s.th }, t('po.thInsurer')),
            React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, ageClass !== 'kind' ? t('po.mitUnfall') : t('po.thPremium')),
            ageClass !== 'kind' && React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, t('po.ohneUnfall'))
          )
        ),
        React.createElement('tbody', null,
          allInsurers.map(ins => {
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
                      borderRadius: radius.sm + 'px', padding: '5px 8px', width: '100%', textAlign: 'right',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm,
                      color: chosenVariant === variant ? palette.sage : (variant === 'ohne' ? palette.mid : palette.text),
                      fontWeight: chosenVariant === variant ? weight.semi : weight.normal,
                    },
                  }, (chosenVariant === variant ? '✓ ' : '') + 'CHF ' + amount.toFixed(2))
                : 'CHF ' + amount.toFixed(2)
            );
            const out = [
              React.createElement('tr', { key: ins.nr },
                React.createElement('td', { style: s.td },
                  React.createElement('button', {
                    style: { ...s.nameBtn, color: isCurrent ? palette.sage : palette.text },
                    onClick: () => setDetailNr(isOpen ? null : ins.nr)
                  }, (isOpen ? '▾ ' : '▸ ') + ins.name + (isCurrent ? ' •' : ''))
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
                  React.createElement('table', { style: { ...s.table, fontSize: text.xs } },
                    React.createElement('thead', null,
                      React.createElement('tr', null,
                        React.createElement('th', { style: s.th }, t('po.thFranchise')),
                        React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, ohneMap ? t('po.mitUnfall') : t('po.thPremium')),
                        ohneMap && React.createElement('th', { style: { ...s.th, textAlign: 'right' } }, t('po.ohneUnfall'))
                      )
                    ),
                    React.createElement('tbody', null,
                      ladderMit.map(f => React.createElement('tr', { key: f.franchise },
                        React.createElement('td', { style: s.td }, 'CHF ' + f.franchise.toLocaleString()),
                        React.createElement('td', { style: { ...s.td, textAlign: 'right' } }, 'CHF ' + f.premium.toFixed(2)),
                        ohneMap && React.createElement('td', { style: { ...s.td, textAlign: 'right', color: palette.mid } },
                          ohneMap[f.franchise] != null ? 'CHF ' + ohneMap[f.franchise].toFixed(2) : '–')
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
      targetInsurer && React.createElement('div', { style: { fontSize: text.sm, color: palette.sage, marginTop: space.sm + 'px', fontWeight: weight.medium } },
        t('po.targetChosenHint', { insurer: targetInsurer }) + (ageClass !== 'kind' && data.versicherungen?.targetUvg ? ' (' + (data.versicherungen.targetUvg === 'ohne' ? t('po.ohneUnfall') : t('po.mitUnfall')) + ')' : ''))
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.md + 'px', fontStyle: 'italic' } },
      t('po.disclaimer')
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.sky, marginTop: space.xs } },
      renderSource(t('po.source'))
    ),

    // Crosslink: vom Vergleich in den geführten Wechsel-Ablauf
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('kvgwechsel'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md + 'px' }
    }, '→ ' + t('kvgWechsel.title'))
  );
};

export default PraemienOrientierung;
