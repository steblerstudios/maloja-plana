import React, { useState, useEffect } from 'react';
import { calculateMonthlyBudget, createBudgetReport, BUDGET_GROUPS, BUDGET_BENCHMARKS } from './budgetSync.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, shadow, radius , leading , space } from './config/tokens.js';

// Format CHF amount — Swiss style with apostrophe thousands separator
const formatCHF = (amount) => {
  if (amount === 0) return 'CHF 0';
  const rounded = Math.round(amount);
  const abs = Math.abs(rounded);
  const formatted = abs >= 1000
    ? abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’')
    : abs.toString();
  return (rounded < 0 ? '− ' : '') + 'CHF ' + formatted;
};

export const BudgetSync = ({ palette, t, data, onUpdate }) => {
  const [budget, setBudget] = useState(null);
  const [showAnnual, setShowAnnual] = useState(false);

  useEffect(() => {
    const synced = calculateMonthlyBudget(data, t);
    setBudget(synced);
  }, [data]);

  if (!budget) return React.createElement('div', null, 'ⓘ ' + t('common.loading'));

  const handleExportReport = () => {
    const report = createBudgetReport(data, t);
    const text = JSON.stringify(report, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget_report_' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Shared styles
  const lineStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '5px 0', fontSize: text.sm, lineHeight: leading.normal
  };
  const itemLineStyle = {
    ...lineStyle, paddingLeft: '16px', color: palette.mid, fontSize: text.sm
  };
  const emptyValueStyle = { color: palette.soft, fontStyle: 'italic', fontSize: text.sm };
  const separatorStyle = {
    borderTop: '1px solid ' + palette.border, margin: '12px 0'
  };
  const groupHeaderStyle = {
    ...lineStyle, fontWeight: weight.semi, paddingTop: '10px'
  };

  // Compute group totals
  const groupData = BUDGET_GROUPS.map(group => {
    const items = group.fields.map(field => ({
      key: field,
      label: t('budgetSync.field.' + field),
      value: Number(budget.expenses[field] || 0)
    }));
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return { ...group, items, total };
  });

  // Count unfilled categories
  const emptyCount = groupData.reduce((count, group) =>
    count + group.items.filter(item => item.value === 0).length, 0
  );

  // Multiplier for annual view
  const mult = showAnnual ? 12 : 1;

  // Quiet BFS benchmark line (Faden 4) — orientation only, never a judgement.
  // groupLevel = no extra indent; field-level lines sit under their indented item.
  const renderBenchmarkLine = (avg, key, groupLevel) => React.createElement('div', {
    key: 'bm-' + key,
    style: {
      paddingLeft: groupLevel ? '0' : '16px', paddingBottom: '6px',
      fontSize: text.sm, color: palette.soft, lineHeight: leading.normal
    }
  }, t('budgetSync.benchmark', { amount: formatCHF(avg * mult) }));

  // Render a single field line
  const renderItem = (item) => {
    const isEmpty = item.value === 0;
    const bm = isEmpty ? null : BUDGET_BENCHMARKS.byField[item.key];
    return React.createElement('div', { key: item.key },
      React.createElement('div', { style: itemLineStyle },
        React.createElement('span', null, item.label),
        isEmpty
          ? React.createElement('span', { style: emptyValueStyle }, '—')
          : React.createElement('span', null, formatCHF(item.value * mult))
      ),
      bm && renderBenchmarkLine(bm, item.key)
    );
  };

  // Group percentage (only shown when income > 0 and group has values)
  const groupPercent = (total) => {
    if (budget.income <= 0 || total <= 0) return null;
    return Math.round((total / budget.income) * 100) + '%';
  };

  // Render a group section
  const renderGroup = (group) => {
    const pct = groupPercent(group.total);
    const singleField = group.items.length === 1;
    const groupBm = group.total > 0 ? BUDGET_BENCHMARKS.byGroup[group.key] : null;
    return React.createElement('div', { key: group.key, style: { marginBottom: space.xs } },
      // Group header with label, total, and quiet percentage
      React.createElement('div', { style: groupHeaderStyle },
        React.createElement('span', null, t('budgetSync.group.' + group.key)),
        React.createElement('span', { style: { display: 'flex', alignItems: 'baseline', gap: space.sm } },
          group.total > 0
            ? React.createElement('span', null, formatCHF(group.total * mult))
            : React.createElement('span', { style: emptyValueStyle }, '—'),
          pct && React.createElement('span', {
            style: { fontSize: text.sm, color: palette.soft, fontWeight: weight.normal, minWidth: '28px', textAlign: 'right' }
          }, pct)
        )
      ),
      // BFS group-level benchmark (e.g. Housing, Mobility) directly under the header
      groupBm && renderBenchmarkLine(groupBm, group.key, true),
      // Individual items — skip when group has only one field (avoids redundant line)
      !singleField && group.items.map(renderItem)
    );
  };

  // BVG/AHV reference total
  const bvgAhvTotal = (budget.reference.bvg || 0) + (budget.reference.ahv || 0) + (budget.expenses.uvg || 0);

  return React.createElement('div', {
    style: {
      background: palette.surface, padding: '20px', borderRadius: radius.sm,
      border: '1px solid ' + palette.border, maxWidth: '520px',
      boxShadow: shadow.sm
    }
  },

    // Title
    React.createElement('h2', {
      style: {
        fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md,
        display: 'flex', alignItems: 'center', gap: space.sm
      }
    }, React.createElement(Icon, { name: 'budget', size: 18 }), t('budgetSync.title')),

    // === Income section ===
    budget.incomeDetail.net > 0 && React.createElement('div', { style: itemLineStyle },
      React.createElement('span', null, t('budgetSync.incomeNet')),
      React.createElement('span', null, formatCHF(budget.incomeDetail.net * mult))
    ),
    budget.incomeDetail.familienzulagen > 0 && React.createElement('div', { style: itemLineStyle },
      React.createElement('span', null, t('budgetSync.incomeFamilienzulagen')),
      React.createElement('span', null, formatCHF(budget.incomeDetail.familienzulagen * mult))
    ),
    budget.incomeDetail.alimenteReceived > 0 && React.createElement('div', { style: itemLineStyle },
      React.createElement('span', null, t('budgetSync.incomeAlimente')),
      React.createElement('span', null, formatCHF(budget.incomeDetail.alimenteReceived * mult))
    ),
    React.createElement('div', { style: { ...lineStyle, fontWeight: weight.semi, fontSize: text.body } },
      React.createElement('span', null, t('budgetSync.totalIncome')),
      budget.income > 0
        ? React.createElement('span', null, formatCHF(budget.income * mult))
        : React.createElement('span', { style: emptyValueStyle }, t('budgetSync.notRecorded'))
    ),

    // Separator
    React.createElement('div', { style: separatorStyle }),

    // === Empty state guidance (only when no income) ===
    budget.income <= 0 && React.createElement('div', {
      style: {
        padding: '12px 14px', background: palette.up, borderRadius: radius.sm,
        fontSize: text.sm, lineHeight: '1.6', color: palette.mid, marginBottom: '12px'
      }
    }, t('budgetSync.emptyStateGuide')),

    // === Grouped expenses ===
    groupData.map(renderGroup),

    // IPV relief (shown only when eligible)
    budget.ipvRelief > 0 && budget.expenses.healthInsurance > 0 && React.createElement('div', {
      style: { marginTop: space.xs, padding: '8px 12px', background: palette.up, borderRadius: '4px', fontSize: text.sm, lineHeight: leading.normal }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', color: palette.mid } },
        React.createElement('span', null, t('budgetSync.ipvRelief')),
        React.createElement('span', null, '− ' + formatCHF(budget.ipvRelief * mult))
      ),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: weight.semi, marginTop: space.xs, fontSize: text.sm } },
        React.createElement('span', null, t('budgetSync.ipvEffective')),
        React.createElement('span', null, formatCHF(Math.max(0, budget.expenses.healthInsurance - budget.ipvRelief) * mult))
      )
    ),

    // BVG/AHV reference note (if any exist)
    bvgAhvTotal > 0 && React.createElement('div', {
      style: {
        marginTop: space.sm, padding: '8px 12px', background: palette.up,
        borderRadius: '4px', fontSize: text.sm, color: palette.mid, lineHeight: leading.normal
      }
    }, 'ⓘ ' + t('budgetSync.bvgReferenceNote') + ' (' + formatCHF(bvgAhvTotal * mult) + ')'),

    // Separator before total
    React.createElement('div', { style: { ...separatorStyle, borderTopWidth: '2px' } }),

    // === Total expenses ===
    React.createElement('div', { style: { ...lineStyle, fontSize: text.sm, color: palette.mid } },
      React.createElement('span', null, t('budgetSync.total')),
      React.createElement('span', null, formatCHF(budget.totalExpenses * mult))
    ),

    // === Available line ===
    React.createElement('div', {
      style: {
        ...lineStyle, fontWeight: weight.semi, fontSize: text.sm, paddingTop: '8px'
      }
    },
      React.createElement('span', null,
        showAnnual ? t('budgetSync.annualAvailable') : t('budgetSync.available')
      ),
      React.createElement('span', {
        style: { color: budget.remaining < 0 ? palette.rose : palette.text }
      }, formatCHF(budget.remaining * mult))
    ),

    // === SKOS household orientation ===
    budget.householdContext && budget.income > 0 && React.createElement('div', {
      style: {
        marginTop: '12px', padding: '10px 14px', background: palette.up,
        borderRadius: radius.sm, fontSize: text.sm, lineHeight: '1.6', color: palette.mid,
      }
    },
      React.createElement('div', { style: { marginBottom: space.xs } },
        'ⓘ ' + t('budgetSync.skosOrientation', {
          size: budget.householdContext.size,
          amount: formatCHF(budget.householdContext.skosGrundbedarf),
        })
      ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft }
      }, t('budgetSync.skosNote'))
    ),

    // === Recommendations (calm, info-level only) ===
    budget.recommendations && budget.recommendations.length > 0 && React.createElement('div', {
      style: { marginTop: space.md }
    },
      budget.recommendations.map((rec, idx) => React.createElement('div', {
        key: idx,
        style: {
          padding: '10px 12px', background: palette.up, borderRadius: radius.sm,
          fontSize: text.sm, lineHeight: '1.6', color: palette.mid,
          marginBottom: idx < budget.recommendations.length - 1 ? '6px' : 0
        }
      },
        React.createElement('span', { style: { marginRight: '6px' } }, rec.icon),
        rec.text
      ))
    ),

    // === Empty fields note ===
    emptyCount > 0 && React.createElement('div', {
      style: {
        marginTop: '14px', fontSize: text.sm, color: palette.soft, lineHeight: leading.normal
      }
    }, emptyCount === 1
      ? t('budgetSync.emptyNoteSingle')
      : t('budgetSync.emptyNote', { count: emptyCount })
    ),

    // === Footer: annual toggle + export ===
    React.createElement('div', {
      style: {
        marginTop: space.md, display: 'flex', gap: space.sm
      }
    },
      React.createElement('button', {
        onClick: () => setShowAnnual(!showAnnual),
        style: {
          flex: 1, padding: '9px', background: showAnnual ? palette.sand : palette.up,
          color: showAnnual ? '#fff' : palette.mid, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm,
          fontWeight: showAnnual ? '600' : '400'
        }
      }, showAnnual ? 'ⓘ ' + t('budgetSync.title') : 'ⓘ ' + t('budgetSync.annualView')),
      React.createElement('button', {
        onClick: handleExportReport,
        style: {
          padding: '9px 14px', background: palette.up, color: palette.mid,
          border: '1px solid ' + palette.border, borderRadius: radius.sm,
          cursor: 'pointer', fontSize: text.sm
        }
      }, t('nav.export'))
    ),

    // === Auto-update note ===
    React.createElement('div', {
      style: {
        marginTop: '10px', fontSize: text.xs, color: palette.soft, lineHeight: '1.4'
      }
    }, 'ⓘ ' + t('budgetSync.autoUpdateNote')),

    // === Orientierungs-Disclaimer (keine Rechts-/Finanzberatung) ===
    React.createElement('div', {
      style: {
        marginTop: space.sm, fontSize: text.xs, color: palette.soft, lineHeight: '1.4', fontStyle: 'italic'
      }
    }, t('alpha.noAdviceHint'))
  );
};

export default BudgetSync;
