import React, { useState } from 'react';
import { calculateDebtStatus, createDebtPlan, calculateBetreibungsRegisterImpact, formatVerlustschein, createBetreibungsAuszugTemplate, parseBetreibungsAuszugFile } from './schuldenCalc.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, shadow } from './config/tokens.js';

export const SchuldenManager = ({ palette, t, data, onSave }) => {
  const [view, setView] = useState('overview');
  const [schulden, setSchulden] = useState(data.schulden || []);
  const [betreibung, setBetreibung] = useState(data.betreibung || []);
  const [verlustscheine, setVerlustscheine] = useState(data.verlustscheine || []);
  const [newDebt, setNewDebt] = useState({ creditor: '', amount: '', dueDate: '', interestRate: '', status: 'open' });
  const [debtPlan, setDebtPlan] = useState(null);

  const handleAddDebt = () => {
    if (!newDebt.creditor || !newDebt.amount) return;

    const debt = {
      id: Date.now(),
      creditor: newDebt.creditor,
      amount: Number(newDebt.amount),
      dueDate: newDebt.dueDate,
      interestRate: Number(newDebt.interestRate) || 0,
      status: newDebt.status,
      createdAt: new Date().toLocaleDateString('de-CH')
    };

    setSchulden([...schulden, debt]);
    setNewDebt({ creditor: '', amount: '', dueDate: '', interestRate: '', status: 'open' });
  };

  const handleAddBetreibung = () => {
    const entry = {
      id: Date.now(),
      creditor: '',
      amount: 0,
      registerDate: new Date().toLocaleDateString('de-CH'),
      status: 'active',
      documentFile: null
    };
    setBetreibung([...betreibung, entry]);
  };

  const handleUpdateBetreibung = (id, field, value) => {
    setBetreibung(betreibung.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? Number(value) || 0 : value } : e));
  };

  const handleDeleteBetreibung = (id) => {
    setBetreibung(betreibung.filter(e => e.id !== id));
  };

  const handleAddVerlustschein = () => {
    const entry = formatVerlustschein({
      debtor: '',
      amount: 0,
      creditor: '',
      date: new Date().toLocaleDateString('de-CH'),
      court: '',
      status: 'active'
    });
    setVerlustscheine([...verlustscheine, entry]);
  };

  const handleUpdateVerlustschein = (id, field, value) => {
    setVerlustscheine(verlustscheine.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? Number(value) || 0 : value } : e));
  };

  const handleDeleteVerlustschein = (id) => {
    setVerlustscheine(verlustscheine.filter(e => e.id !== id));
  };

  const handleDeleteDebt = (id) => {
    setSchulden(schulden.filter(d => d.id !== id));
  };

  const handleSaveAll = () => {
    onSave({ schulden, betreibung, verlustscheine });
  };

  const debtStatus = calculateDebtStatus(schulden);
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const betreibungImpact = calculateBetreibungsRegisterImpact(betreibung, income || 1);

  const cardStyle = {
    padding: space.md,
    background: palette.up,
    borderRadius: radius.sm,
    marginBottom: space.sm,
    fontSize: text.sm,
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: space.sm + 'px ' + (space.sm + 2) + 'px',
    marginBottom: space.sm,
    borderRadius: radius.sm,
    border: '1px solid ' + palette.border,
    background: palette.surface,
    color: palette.text,
    boxSizing: 'border-box',
    fontSize: text.body
  };

  const buttonStyle = {
    padding: space.sm + 'px ' + space.sm + 'px ' + space.sm + 'px ' + (space.sm + 4) + 'px',
    background: palette.sand,
    color: '#fff',
    border: 'none',
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.xs
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
    React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: '1.6', marginTop: 0, marginBottom: space.md, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('schulden.intro')),

    // Tab Navigation
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md, borderBottom: '1px solid ' + palette.border, paddingBottom: space.sm + 4 } },
      React.createElement('button', {
        onClick: () => setView('overview'),
        style: { padding: space.sm + 'px ' + (space.sm + 4) + 'px', background: view === 'overview' ? palette.sand : palette.up, color: view === 'overview' ? '#fff' : palette.text, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.xs }
      }, React.createElement(Icon, { name: 'dashboard', size: 14 }), ' ' + t('schulden.overview')),
      React.createElement('button', {
        onClick: () => setView('debts'),
        style: { padding: space.sm + 'px ' + (space.sm + 4) + 'px', background: view === 'debts' ? palette.sand : palette.up, color: view === 'debts' ? '#fff' : palette.text, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.xs }
      }, React.createElement(Icon, { name: 'debt', size: 14 }), ' ' + t('schulden.debts')),
      React.createElement('button', {
        onClick: () => setView('betreibung'),
        style: { padding: space.sm + 'px ' + (space.sm + 4) + 'px', background: view === 'betreibung' ? palette.sand : palette.up, color: view === 'betreibung' ? '#fff' : palette.text, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.xs }
      }, React.createElement(Icon, { name: 'behoerden', size: 14 }), ' ' + t('schulden.debtCollection')),
      React.createElement('button', {
        onClick: () => setView('verlustscheine'),
        style: { padding: space.sm + 'px ' + (space.sm + 4) + 'px', background: view === 'verlustscheine' ? palette.sand : palette.up, color: view === 'verlustscheine' ? '#fff' : palette.text, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.xs }
      }, '□ ' + t('schulden.lossReceipts'))
    ),

    // Overview
    view === 'overview' && React.createElement('div', null,
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: space.md, marginBottom: space.lg } },
        React.createElement('div', { style: { padding: space.lg - 4, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('schulden.totalDebt')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.medium, color: palette.text, marginTop: space.xs } }, 'CHF ' + debtStatus.totalDebt.toFixed(2))
        ),
        React.createElement('div', { style: { padding: space.lg - 4, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('schulden.overdue')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.medium, color: palette.text, marginTop: space.xs } }, 'CHF ' + debtStatus.overdue.toFixed(2))
        ),
        React.createElement('div', { style: { padding: space.lg - 4, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('schulden.dueSoon')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.medium, color: palette.text, marginTop: space.xs } }, 'CHF ' + debtStatus.upcoming.toFixed(2))
        ),
        React.createElement('div', { style: { padding: space.lg - 4, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('schulden.alreadyPaid')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.medium, color: palette.text, marginTop: space.xs } }, 'CHF ' + debtStatus.paid.toFixed(2))
        )
      ),

      betreibung.length > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.sm } }, t('schulden.debtRegisterAnalysis')),
        React.createElement('div', { style: { fontSize: text.sm, marginBottom: space.sm } },
          t('schulden.debtRatio') + ': ' + betreibungImpact.debtToIncomeRatio + '% (' + t('debtLevels.' + betreibungImpact.severity) + ')'
        ),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, background: palette.surface, padding: space.sm, borderRadius: radius.sm } }, t(betreibungImpact.recommendationKey))
      )
    ),

    // Debts View
    view === 'debts' && React.createElement('div', null,
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('schulden.addDebt')),

      React.createElement('div', { style: { background: palette.surface, padding: space.md, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.border } },
        React.createElement('input', { type: 'text', value: newDebt.creditor, onChange: (e) => setNewDebt(p => ({ ...p, creditor: e.target.value })), placeholder: t('schulden.creditor'), style: inputStyle }),
        React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: newDebt.amount, onChange: (e) => setNewDebt(p => ({ ...p, amount: e.target.value })), placeholder: t('schulden.amount'), style: inputStyle }),
        React.createElement('input', { type: 'date', value: newDebt.dueDate, onChange: (e) => setNewDebt(p => ({ ...p, dueDate: e.target.value })), style: inputStyle }),
        React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.1', value: newDebt.interestRate, onChange: (e) => setNewDebt(p => ({ ...p, interestRate: e.target.value })), placeholder: t('schulden.interestRate'), style: inputStyle }),
        React.createElement('select', { value: newDebt.status, onChange: (e) => setNewDebt(p => ({ ...p, status: e.target.value })), style: inputStyle },
          React.createElement('option', { value: 'open' }, t('schulden.statusOpen')),
          React.createElement('option', { value: 'overdue' }, t('schulden.overdue')),
          React.createElement('option', { value: 'paid' }, t('schulden.statusPaid'))
        ),
        React.createElement('button', { onClick: handleAddDebt, style: buttonStyle }, '+ ' + t('schulden.addDebt'))
      ),

      schulden.length === 0 ? React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px', color: palette.mid } }, t('common.none')) : React.createElement('div', null,
        schulden.map(debt => React.createElement('div', { key: debt.id, style: cardStyle },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
            React.createElement('strong', null, debt.creditor),
            React.createElement('span', { style: { fontWeight: weight.semi, color: debt.status === 'paid' ? palette.sage : debt.status === 'overdue' ? palette.rose : palette.text } }, 'CHF ' + debt.amount.toFixed(2))
          ),
          React.createElement('div', { style: { color: palette.mid, fontSize: text.sm, marginBottom: '6px' } },
            debt.dueDate + ' | ' + debt.status
          ),
          React.createElement('button', { 'aria-label': t('common.delete') + ' ' + debt.creditor, onClick: () => handleDeleteDebt(debt.id), style: { ...buttonStyle, background: palette.rose } }, '✕ ' + t('common.delete'))
        ))
      ),

      schulden.some(d => d.interestRate > 0) && React.createElement('div', { style: { marginTop: space.md, padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('button', { onClick: () => setDebtPlan(createDebtPlan(debtStatus.totalDebt, 500, schulden[0]?.interestRate || 0)), style: buttonStyle }, '◰ ' + t('schulden.paymentPlan'))
      ),

      debtPlan && React.createElement('div', { style: { marginTop: space.md, padding: '12px', background: palette.up, borderRadius: radius.sm, maxHeight: '400px', overflowY: 'auto' } },
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, t('schulden.paymentPlanTitle', { amount: 500 })),
        debtPlan.slice(0, 12).map((month, idx) => React.createElement('div', { key: idx, style: { fontSize: text.xs, padding: space.xs, borderBottom: '1px solid ' + palette.border } },
          '#' + month.month + ': CHF ' + month.payment + ' (' + t('budgetSync.remaining') + ': CHF ' + month.remaining + ')'
        ))
      )
    ),

    // Betreibung View
    view === 'betreibung' && React.createElement('div', null,
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('schulden.debtCollection')),

      React.createElement('button', { onClick: handleAddBetreibung, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.addDebt')),

      betreibung.length === 0 ? React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px', color: palette.mid } }, t('common.none')) : React.createElement('div', null,
        betreibung.map(entry => React.createElement('div', { key: entry.id, style: { ...cardStyle, cursor: 'default', background: entry.status === 'erledigt' ? palette.up : palette.gold + '0A' } },
          React.createElement('input', { type: 'text', value: entry.creditor, onChange: (e) => handleUpdateBetreibung(entry.id, 'creditor', e.target.value), placeholder: t('schulden.creditor'), style: { ...inputStyle, marginBottom: space.xs } }),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: entry.amount || '', onChange: (e) => handleUpdateBetreibung(entry.id, 'amount', e.target.value), placeholder: t('schulden.amount'), style: { ...inputStyle, width: '140px', marginBottom: 0 } }),
            React.createElement('input', { type: 'date', value: entry.registerDate || '', onChange: (e) => handleUpdateBetreibung(entry.id, 'registerDate', e.target.value), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
            React.createElement('select', { value: entry.status, onChange: (e) => handleUpdateBetreibung(entry.id, 'status', e.target.value), style: { ...inputStyle, width: '140px', marginBottom: 0 } },
              React.createElement('option', { value: 'open' }, t('schulden.statusOpen')),
              React.createElement('option', { value: 'paid' }, t('schulden.statusPaid'))
            )
          ),
          React.createElement('button', { 'aria-label': t('common.delete'), onClick: () => handleDeleteBetreibung(entry.id), style: { ...buttonStyle, background: palette.rose, marginTop: space.xs } }, '✕ ' + t('common.delete'))
        ))
      )
    ),

    // Verlustscheine View
    view === 'verlustscheine' && React.createElement('div', null,
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('schulden.lossReceipts')),

      React.createElement('button', { onClick: handleAddVerlustschein, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.lossReceipts')),

      verlustscheine.length === 0 ? React.createElement('div', { style: { textAlign: 'center', padding: '40px 20px', color: palette.mid } }, t('common.none')) : React.createElement('div', null,
        verlustscheine.map(entry => React.createElement('div', { key: entry.id, style: { ...cardStyle, cursor: 'default' } },
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'text', value: entry.creditor || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'creditor', e.target.value), placeholder: t('schulden.creditor'), style: { ...inputStyle, flex: '1 1 200px', marginBottom: 0 } }),
            React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: entry.amount || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'amount', e.target.value), placeholder: t('schulden.amount'), style: { ...inputStyle, width: '140px', marginBottom: 0 } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'text', value: entry.debtor || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'debtor', e.target.value), placeholder: t('schulden.debtor') || 'Schuldner', style: { ...inputStyle, flex: '1 1 200px', marginBottom: 0 } }),
            React.createElement('input', { type: 'text', value: entry.court || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'court', e.target.value), placeholder: t('schulden.court') || 'Betreibungsamt', style: { ...inputStyle, flex: '1 1 160px', marginBottom: 0 } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center' } },
            React.createElement('input', { type: 'date', value: entry.date || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'date', e.target.value), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
            React.createElement('button', { 'aria-label': t('common.delete'), onClick: () => handleDeleteVerlustschein(entry.id), style: { ...buttonStyle, background: palette.rose } }, '✕ ' + t('common.delete'))
          )
        ))
      )
    ),

    // Privacy note
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.md, padding: 0 } }, 'ⓘ ' + t('trust.localOnly')),

    // Orientierungs-Disclaimer (keine Rechts-/Finanzberatung)
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm, lineHeight: 1.5, fontStyle: 'italic' } }, t('alpha.noAdviceHint')),

    // Save Button
    React.createElement('button', { onClick: handleSaveAll, style: { ...buttonStyle, width: '100%', padding: '12px', marginTop: space.sm, background: palette.sage, color: '#000' } }, '□ ' + t('common.save'))
  );
};

export default SchuldenManager;
