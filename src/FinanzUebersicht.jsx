import React from 'react';
import { Icon } from './IconSystem.jsx';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, getCantonName } from './config/cantonalData.js';
import { berechneBundessteuer } from './data/steuerRechner.js';
import { schaetzeKantonaleSteuer } from './data/kantonaleSteuerdaten.js';
import { text, weight, radius, leading, space } from './config/tokens.js';

function formatCHF(value) {
  const n = Math.round(value);
  if (n === 0) return 'CHF 0';
  const abs = Math.abs(n);
  const formatted = abs >= 1000
    ? abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’')
    : abs.toString();
  return (n < 0 ? '− ' : '') + 'CHF ' + formatted;
}

const StatusCard = ({ palette, icon, title, status, statusColor, detail, onClick }) =>
  React.createElement('div', {
    onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    onKeyDown: onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined,
    style: {
      padding: '16px', background: palette.up, borderRadius: radius.sm,
      border: '1px solid ' + palette.border, marginBottom: space.sm,
      cursor: onClick ? 'pointer' : 'default',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: '6px' }
    },
      React.createElement(Icon, { name: icon, size: 16 }),
      React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi } }, title),
      onClick && React.createElement('span', {
        style: { marginLeft: 'auto', color: palette.soft, fontSize: text.sm }
      }, '→')
    ),
    React.createElement('div', {
      style: { fontSize: text.body, fontWeight: weight.semi, color: statusColor || palette.text, marginBottom: detail ? '4px' : 0 }
    }, status),
    detail && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
    }, detail)
  );

export const FinanzUebersicht = ({ palette, t, data, onNavigate }) => {
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const annualIncome = income * 12;
  const canton = data.basis?.canton || '';
  const verheiratet = data.basis?.maritalStatus === 'married';

  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  const el = checkELEligibility(data);
  const taxResult = annualIncome > 0
    ? berechneBundessteuer({ bruttoEinkommen: annualIncome, verheiratet, kinder: 0 })
    : null;
  const kantonal = taxResult && canton ? schaetzeKantonaleSteuer(taxResult.steuer, canton) : null;

  const hasData = income > 0;

  const rent = Number(data.wohnen?.rentAmount || 0);
  const utilities = Number(data.wohnen?.utilities || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);
  const groceries = Number(data.finanzen?.groceries || 0);
  const communication = Number(data.finanzen?.communication || 0);
  const mobility = Number(data.finanzen?.mobility || 0);
  const childcare = Number(data.finanzen?.childcare || 0);
  const otherIns = Number(data.finanzen?.otherInsurance || 0);
  const monthlyTax = Number(data.finanzen?.monthlyTax || 0);
  const debtPay = Number(data.finanzen?.debtPayments || 0);
  const alimentePaid = Number(data.finanzen?.alimentePaid || 0);

  const totalExpenses = rent + utilities + kkPremium + groceries + communication + mobility + childcare + otherIns + monthlyTax + debtPay + alimentePaid;
  const totalIncome = income + Number(data.finanzen?.familienzulagen || 0) + Number(data.finanzen?.alimenteReceived || 0);
  const freeAmount = totalIncome - totalExpenses;
  const hasExpenses = totalExpenses > 0;

  return React.createElement('div', { style: { maxWidth: '520px' } },

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: text.lg, fontWeight: weight.semi, marginBottom: '6px',
          display: 'flex', alignItems: 'center', gap: space.sm,
        }
      }, React.createElement(Icon, { name: 'budget', size: 18 }), t('finanzUebersicht.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal }
      }, t('finanzUebersicht.subtitle'))
    ),

    !hasData && React.createElement('div', {
      style: {
        padding: '24px 20px', textAlign: 'center', background: palette.up,
        borderRadius: radius.sm, border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm } },
        t('finanzUebersicht.noData')
      ),
      React.createElement('button', {
        onClick: () => onNavigate('chapter', 2),
        style: {
          padding: '8px 16px', background: palette.sand, color: '#fff',
          border: 'none', borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
        }
      }, t('finanzUebersicht.enterIncome'))
    ),

    hasData && React.createElement('div', {
      style: {
        padding: '16px', background: palette.sand + '10', borderRadius: radius.sm,
        border: '1px solid ' + palette.sand + '25', marginBottom: '16px',
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
        t('finanzUebersicht.monthlyIncome')
      ),
      React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi } },
        formatCHF(income) + ' ' + t('common.perMonth')
      ),
      canton && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px' } },
        t('finanzUebersicht.canton') + ': ' + getCantonName(canton, t)
      )
    ),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'money',
      title: t('finanzUebersicht.taxes'),
      status: kantonal
        ? '~ ' + formatCHF(kantonal.total) + ' ' + t('common.perYear')
        : taxResult
          ? '~ ' + formatCHF(taxResult.steuer) + ' ' + t('common.perYear') + ' (' + t('tax.federalOnly') + ')'
          : t('finanzUebersicht.noIncome'),
      statusColor: palette.text,
      detail: kantonal
        ? t('tax.federalTax') + ': ' + formatCHF(taxResult.steuer) + ' + ' + t('tax.cantonalAndMunicipal') + ': ' + formatCHF(kantonal.kantonalUndGemeinde)
        : !canton ? t('finanzUebersicht.selectCanton') : null,
      onClick: () => onNavigate('tax'),
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'insurance',
      title: t('finanzUebersicht.ipv'),
      status: ipv.eligible
        ? '✓ ' + formatCHF(ipv.amount) + ' ' + t('common.perMonth')
        : t('finanzUebersicht.notEligible'),
      statusColor: ipv.eligible ? palette.sage : palette.mid,
      detail: ipv.eligible
        ? formatCHF(ipv.annual) + ' ' + t('common.perYear')
        : ipv.canton ? t('ipv.incomeAboveLimit', { value: ipv.cantonData?.maxIncome || '' }) : t('finanzUebersicht.selectCanton'),
      onClick: () => onNavigate('premium'),
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'home',
      title: t('finanzUebersicht.sozialhilfe'),
      status: sozialhilfe.eligible
        ? t('sozialhilfe.entitled') + ': ~ ' + formatCHF(sozialhilfe.deficit) + ' ' + t('common.perMonth')
        : t('sozialhilfe.notEntitled'),
      statusColor: sozialhilfe.eligible ? palette.gold : palette.sage,
      detail: t('sozialhilfe.basicNeeds') + ': ' + formatCHF(sozialhilfe.grundbedarf) + ' | ' + t('sozialhilfe.totalNeeds') + ': ' + formatCHF(sozialhilfe.totalBedarf),
      onClick: () => onNavigate('sozialhilfe'),
    }),

    hasData && React.createElement(StatusCard, {
      palette, icon: 'legal',
      title: t('finanzUebersicht.el'),
      status: el.eligible
        ? t('sozialhilfe.elPossible')
        : el.noteKey === 'el.onlyAhvIv'
          ? t('sozialhilfe.elOnlyAhvIv')
          : t('finanzUebersicht.notApplicable'),
      statusColor: el.eligible ? palette.gold : palette.mid,
      detail: el.eligible ? formatCHF(el.deficit) + ' ' + t('common.perMonth') : null,
    }),

    hasData && hasExpenses && React.createElement('div', {
      style: {
        padding: '16px', background: freeAmount >= 0 ? palette.sage + '12' : palette.rose + '12',
        borderRadius: radius.sm, border: '1px solid ' + (freeAmount >= 0 ? palette.sage + '30' : palette.rose + '30'),
        marginBottom: '16px',
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
        t('finanzUebersicht.budgetBalance')
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }
      },
        React.createElement('span', { style: { fontSize: text.sm } }, t('finanzUebersicht.totalIncome')),
        React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm } }, formatCHF(totalIncome))
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }
      },
        React.createElement('span', { style: { fontSize: text.sm } }, t('finanzUebersicht.totalExpenses')),
        React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm } }, '− ' + formatCHF(totalExpenses))
      ),
      React.createElement('div', {
        style: { borderTop: '1px solid ' + palette.border, paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }
      },
        React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi } }, t('finanzUebersicht.freeAmount')),
        React.createElement('span', {
          style: { fontSize: text.lg, fontWeight: weight.semi, color: freeAmount >= 0 ? palette.sage : palette.rose }
        }, formatCHF(freeAmount))
      )
    ),

    hasData && React.createElement('div', {
      style: { borderTop: '1px solid ' + palette.border, margin: '16px 0' }
    }),

    hasData && React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm }
    },
      React.createElement('button', {
        onClick: () => onNavigate('sync'),
        style: {
          padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm,
          fontFamily: 'inherit', textAlign: 'left',
        }
      }, '◇ ' + t('finanzUebersicht.toBudget')),
      React.createElement('button', {
        onClick: () => onNavigate('behoerdendossier'),
        style: {
          padding: '12px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.sm,
          fontFamily: 'inherit', textAlign: 'left',
        }
      }, '◇ ' + t('finanzUebersicht.toDossier'))
    ),

    React.createElement('div', {
      style: { marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4' }
    }, '○ ' + t('finanzUebersicht.disclaimer'))
  );
};

export default FinanzUebersicht;
