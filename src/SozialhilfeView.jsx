import React from 'react';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, getCantonName, SKOS_GRUNDBEDARF } from './config/cantonalData.js';
import { SozialhilfeRechner } from './SozialhilfeRechner.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { Icon } from './IconSystem.jsx';
import { text, weight, leading, space, radius, shadow } from './config/tokens.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';

export const SozialhilfeView = ({ palette, t, data, onNavigate }) => {
  const vorlesen = useVorlesenContext();
  const canton = data.basis?.canton || '';
  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  const el = checkELEligibility(data);
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  const residenceKey = residenceType === 'wochenaufenthalt' ? 'wochenaufenthalt' : 'hauptwohnsitz';

  const formatCHF = (n) => 'CHF ' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const Row = (label, value, color) =>
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: (space.sm - 1) + 'px 0', borderBottom: '1px solid ' + palette.border, fontSize: text.sm } },
      React.createElement('span', { style: { color: palette.mid } }, label),
      React.createElement('span', { style: { fontWeight: weight.semi, color: color || palette.text } }, value)
    );

  // Only block when the canton is genuinely missing — the SKOS Grundbedarf is
  // household-based and useful even before income is entered.
  if (!canton) {
    return React.createElement(React.Fragment, null,
      React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: space.lg, borderRadius: radius.md, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('sozialhilfe.title')),
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed, marginBottom: space.lg, marginTop: space.sm, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('sozialhilfe.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('sozialhilfe.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),
        React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid } },
          'ⓘ ' + t('sozialhilfe.enterCanton')
        )
      ),
      React.createElement('div', { style: { marginTop: space.xl + 'px' } },
        React.createElement(SozialhilfeRechner, { palette, t, data })
      )
    );
  }

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: space.lg, borderRadius: radius.md, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('sozialhilfe.title')),

    React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed, marginBottom: space.lg, marginTop: space.sm, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('sozialhilfe.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('sozialhilfe.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),

    // Canton
    React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.lg, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.xs } }, 'ⓘ ' + t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
      React.createElement('div', { style: { color: palette.mid } },
        sozialhilfe.childrenCount > 0
          ? t('sozialhilfe.householdAdultsChildren', { adults: sozialhilfe.adults, children: sozialhilfe.childrenCount })
          : t('sozialhilfe.householdAdults', { count: sozialhilfe.adults })
      ),
      !canton && React.createElement('div', { style: { color: palette.rose, marginTop: space.xs } }, t('sozialhilfe.enterCanton'))
    ),

    // Residence type
    residenceKey === 'wochenaufenthalt' && React.createElement('div', { style: { padding: '10px', background: palette.gold + '22', borderRadius: radius.sm, border: '1px solid ' + palette.gold, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs } }, 'ⓘ ' + t('sozialhilfe.weeklyResidence')),
      React.createElement('div', null, t('residence.taxNote')),
      React.createElement('div', null, t('sozialhilfe.weeklyNote'))
    ),

    // SKOS Calculation
    React.createElement('div', { style: { marginBottom: space.lg + 4 } },
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: space.sm + 4 } }, '◰ ' + t('sozialhilfe.skosCalculation')),
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm } },
        Row(t('sozialhilfe.basicNeeds'), formatCHF(sozialhilfe.grundbedarf)),
        Row(t('sozialhilfe.housingCosts'), formatCHF(sozialhilfe.effectiveRent)),
        Row(t('sozialhilfe.rentLimit'), formatCHF(sozialhilfe.rentLimit), palette.mid),
        Row(t('sozialhilfe.healthInsurance'), formatCHF(sozialhilfe.effectiveKK)),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: text.sm, fontWeight: weight.bold, borderTop: '1px solid ' + palette.border, marginTop: space.xs } },
          React.createElement('span', null, t('sozialhilfe.totalNeeds')),
          React.createElement('span', null, formatCHF(sozialhilfe.totalBedarf))
        ),
        Row(t('sozialhilfe.deductIncome'), '- ' + formatCHF(sozialhilfe.income), palette.mid),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: text.body, fontWeight: weight.bold, borderTop: '1px solid ' + palette.border, marginTop: space.xs } },
          React.createElement('span', null, t('sozialhilfe.deficit')),
          React.createElement('span', { style: { color: palette.text } }, formatCHF(sozialhilfe.deficit) + t('common.perMonth'))
        )
      )
    ),

    // Status
    sozialhilfe.eligible ? React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, border: '1px solid ' + palette.gold, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs } }, 'ⓘ ' + t('sozialhilfe.entitled')),
      React.createElement('div', { style: { fontSize: text.sm } }, t(sozialhilfe.noteKey, sozialhilfe.noteParams))
    ) : React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs } }, 'ⓘ ' + t('sozialhilfe.notEntitled')),
      React.createElement('div', { style: { fontSize: text.sm } }, t(sozialhilfe.noteKey, sozialhilfe.noteParams))
    ),

    // Vermögensfreibetrag-Orientierung (SKOS C.7) — nur wenn ein Anspruch besteht UND
    // das Vermögen über dem Freibetrag liegt (sonst ist die Vermögensfrage nicht entscheidungsrelevant)
    sozialhilfe.eligible && sozialhilfe.vermoegenUeberFreibetrag > 0 && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs } }, 'ⓘ ' + t('sozialhilfe.assetLimitTitle')),
      React.createElement('div', { style: { fontSize: text.sm, lineHeight: leading.relaxed } }, t('sozialhilfe.assetLimitNote', { freibetrag: formatCHF(sozialhilfe.vermoegensfreibetrag), ueberschuss: formatCHF(sozialhilfe.vermoegenUeberFreibetrag) }))
    ),

    // Repayment info
    React.createElement('details', { style: { marginBottom: space.md } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, 'ⓘ ' + t('sozialhilfe.repaymentTitle')),
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
        React.createElement('p', { style: { marginBottom: space.sm } }, t('sozialhilfe.repaymentText')),
        React.createElement('p', { style: { marginBottom: space.sm, color: palette.mid } }, t('sozialhilfe.repaymentVaries')),
        React.createElement('p', { style: { fontWeight: weight.medium } }, t('sozialhilfe.repaymentAdvice'))
      )
    ),

    // IPV Info
    React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: space.sm + 4 } }, '◰ ' + t('sozialhilfe.ipvSection')),
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm } },
        ipv.eligible
          ? React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sage, marginBottom: space.xs, fontSize: text.sm } }, '✓ ' + t('premium.eligible') + ': ' + formatCHF(ipv.amount) + t('common.perMonth')),
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(ipv.noteKey, ipv.noteParams))
            )
          : React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs, fontSize: text.sm } }, 'ⓘ ' + t(ipv.noteKey, ipv.noteParams))
            )
      )
    ),

    // EL Info
    React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: space.sm + 4 } }, '◰ ' + t('sozialhilfe.elSection')),
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontWeight: weight.semi, color: el.eligible ? palette.sage : palette.mid, marginBottom: space.xs, fontSize: text.sm } },
          el.eligible ? '✓ ' + t('sozialhilfe.elPossible') : 'ⓘ ' + t(el.noteKey, el.noteParams)
        ),
        el.isAHVIV && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } },
          t('sozialhilfe.totalIncome', { value: el.totalIncome }) + ' | ' + t('sozialhilfe.totalExpenses', { value: el.totalExpenses })
        )
      )
    ),

    // Orientation note — visually distinct so users don't overlook it
    React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, marginBottom: space.md, padding: space.md + 'px', background: palette.gold + '15', borderRadius: radius.sm + 'px', borderLeft: '3px solid ' + palette.gold } },
      'ⓘ ' + t('sozialhilfe.orientationNote')
    ),

    // Children context (only when children present)
    sozialhilfe.childrenCount > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed } },
      React.createElement('div', { style: { marginBottom: space.xs } }, '□ ' + t('sozialhilfe.childrenNote')),
      sozialhilfe.children.some(c => c.age >= 16) &&
        React.createElement('div', { style: { marginTop: space.xs } }, '□ ' + t('sozialhilfe.childrenEducationNote'))
    ),

    // SKOS table
    React.createElement('details', { style: { marginBottom: space.md } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, '◰ ' + t('sozialhilfe.skosTable')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: space.sm, marginTop: space.sm } },
        Object.entries(SKOS_GRUNDBEDARF).map(([size, amount]) =>
          React.createElement('div', {
            key: size,
            style: {
              padding: space.sm,
              background: Number(size) === sozialhilfe.householdSize ? palette.gold + '22' : palette.up,
              borderRadius: '4px',
              border: '1px solid ' + (Number(size) === sozialhilfe.householdSize ? palette.gold : palette.border),
              fontSize: text.sm,
              textAlign: 'center'
            }
          },
            React.createElement('div', { style: { fontWeight: weight.semi } }, Number(size) === 1 ? t('common.person', { count: size }) : t('common.persons', { count: size })),
            React.createElement('div', { style: { color: palette.mid } }, formatCHF(amount))
          )
        )
      )
    ),

    // Next steps
    React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginTop: space.lg } },
      React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, '□ ' + t('sozialhilfe.nextSteps')),
      React.createElement('ul', { style: { fontSize: text.xs, paddingLeft: '20px', margin: 0, color: palette.mid, lineHeight: leading.relaxed } },
        React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step1')),
        React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step2')),
        React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step3')),
        sozialhilfe.eligible && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step4')),
        el.eligible && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step5'))
      )
    ),

    React.createElement(OfficialLinkBox, { palette, t, data, ids: 'sozialhilfe', cantonalKey: 'sozialdienst' }),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, 'ⓘ ' + t('trust.localOnly')),

    React.createElement('div', { style: { marginTop: space.xl + 'px' } },
      React.createElement(SozialhilfeRechner, { palette, t, data })
    ),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, '→ ' + t('nav.finanzUebersicht')),

    // Mietzinsbeiträge können ein Anspruch VOR/neben der Sozialhilfe sein — ruhig dorthin verweisen.
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('mietzins'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm + 'px' }
    }, '→ ' + t('nav.mietzins'))
  );
};

export default SozialhilfeView;
