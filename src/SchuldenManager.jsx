import React, { useState } from 'react';
import { EmptyState } from './components/EmptyState.jsx';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { calculateDebtStatus, createDebtPlan, prioritizeDebts, calculateBetreibungsRegisterImpact, formatVerlustschein } from './schuldenCalc.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { AblaufLink } from './AblaufSchale.jsx';

export const SchuldenManager = ({ palette, t, data, onSave, onNavigate }) => {
  const vorlesen = useVorlesenContext();
  const [view, setView] = useState('overview');
  const [schulden, setSchulden] = useState(data.schulden || []);
  const [betreibung, setBetreibung] = useState(data.betreibung || []);
  const [verlustscheine, setVerlustscheine] = useState(data.verlustscheine || []);
  const [newDebt, setNewDebt] = useState({ creditor: '', amount: '', dueDate: '', interestRate: '', status: 'open', category: 'sonstige' });
  const [debtPlan, setDebtPlan] = useState(null);
  const [method, setMethod] = useState('lawine');
  const [formError, setFormError] = useState(false);

  const handleAddDebt = () => {
    if (!newDebt.creditor || !newDebt.amount) { setFormError(true); return; }
    setFormError(false);

    const debt = {
      id: Date.now(),
      creditor: newDebt.creditor,
      amount: Number(newDebt.amount),
      dueDate: newDebt.dueDate,
      interestRate: Number(newDebt.interestRate) || 0,
      status: newDebt.status,
      category: newDebt.category || 'sonstige',
      createdAt: new Date().toLocaleDateString('de-CH')
    };

    setSchulden([...schulden, debt]);
    setNewDebt({ creditor: '', amount: '', dueDate: '', interestRate: '', status: 'open', category: 'sonstige' });
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
  const prioritized = prioritizeDebts(schulden, method);
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
    color: palette.onSand,
    border: 'none',
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.xs
  };

  const statusLabel = (s) => s === 'paid' ? t('schulden.statusPaid') : s === 'overdue' ? t('schulden.overdue') : t('schulden.statusOpen');
  const tabs = [
    { key: 'overview', icon: 'dashboard', label: t('schulden.overview') },
    { key: 'debts', icon: 'debt', label: t('schulden.debts') },
    { key: 'plan', icon: 'timeline', label: t('schulden.planTab') },
    { key: 'betreibung', icon: 'behoerden', label: t('schulden.debtCollection') },
    { key: 'verlustscheine', icon: 'document', label: t('schulden.lossReceipts') },
  ];

  return React.createElement('div', { style: { maxWidth: '720px' } },
    React.createElement(PageTitle, { palette, style: { marginBottom: space.sm } }, t('schulden.title')),
    React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: '1.6', marginTop: 0, marginBottom: space.md, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('schulden.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('schulden.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),

    // Tab Navigation (role=tablist; aktiver Tab via Border+Tint, nicht nur Farbe)
    React.createElement('div', { role: 'tablist', 'aria-label': t('schulden.title'), style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, marginBottom: space.md, borderBottom: '1px solid ' + palette.border, paddingBottom: space.sm + 4 } },
      tabs.map(tab => {
        const active = view === tab.key;
        return React.createElement('button', {
          key: tab.key, role: 'tab', 'aria-selected': active, onClick: () => setView(tab.key),
          style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: space.sm + 'px ' + (space.sm + 4) + 'px', border: '1px solid ' + (active ? palette.sand : palette.border), background: active ? palette.sand + '22' : palette.surface, color: active ? palette.text : palette.mid, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.xs }
        }, React.createElement(Icon, { name: tab.icon, size: 14 }), ' ' + tab.label);
      })
    ),

    // Overview
    view === 'overview' && React.createElement('div', { role: 'tabpanel' },
      // Ruhige Label-Wert-Zeilenliste statt KPI-Kachelraster (Schulden = sensibel)
      React.createElement('div', { style: { background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.lg } },
        [
          ['totalDebt', debtStatus.totalDebt],
          ['overdue', debtStatus.overdue],
          ['dueSoon', debtStatus.upcoming],
          ['alreadyPaid', debtStatus.paid],
        ].map(([key, val], i, arr) =>
          React.createElement('div', { key, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm, padding: space.sm + 'px ' + space.md + 'px', borderBottom: i < arr.length - 1 ? '1px solid ' + palette.border + '55' : 'none', fontSize: text.sm } },
            React.createElement('span', { style: { color: palette.mid } }, t('schulden.' + key)),
            React.createElement('span', { style: { fontWeight: weight.medium, color: palette.text } }, 'CHF ' + val.toFixed(2))
          )
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

    // Abbau-Plan View (Konsequenz-Priorität + Methode, reine Orientierung)
    view === 'plan' && React.createElement('div', { role: 'tabpanel' },
      React.createElement('p', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginTop: 0, marginBottom: space.md, padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } }, t('schulden.planIntro')),

      // Beratungs-Box — warm, prominent, ohne Wertung
      React.createElement('div', { style: { padding: space.md + 'px', background: palette.sage + '14', border: '1px solid ' + palette.sage + '55', borderRadius: radius.sm, marginBottom: space.md } },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.xs } }, t('schulden.helpTitle')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginBottom: space.sm } }, t('schulden.helpBody')),
        React.createElement('div', { style: { display: 'flex', gap: space.md, flexWrap: 'wrap', fontSize: text.sm, fontWeight: weight.semi } },
          React.createElement('a', { href: 'tel:0800708708', style: { color: palette.sageDeep, textDecoration: 'none' } }, '0800 708 708'),
          React.createElement('a', { href: 'https://schulden.ch', target: '_blank', rel: 'noopener', style: { color: palette.sageDeep, textDecoration: 'none' } }, 'schulden.ch')
        ),
        onNavigate && React.createElement('div', { style: { marginTop: space.sm } },
          React.createElement(AblaufLink, { palette, label: t('schulden.situationLink'), onClick: () => onNavigate('situationen') })
        )
      ),

      prioritized.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'money', size: 26, color: palette.mid }), title: t('schulden.emptyDebts') }) : React.createElement('div', null,
        React.createElement('div', { style: { marginBottom: space.md } },
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('schulden.planMethod')),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap' } },
            ['lawine', 'schneeball'].map(m => React.createElement('button', {
              key: m, onClick: () => setMethod(m),
              style: { padding: space.sm + 'px ' + space.md + 'px', fontSize: text.xs, fontWeight: weight.semi, textAlign: 'start', border: '1px solid ' + (method === m ? palette.sand : palette.border), background: method === m ? palette.sand + '22' : palette.surface, color: method === m ? palette.text : palette.mid, borderRadius: radius.sm, cursor: 'pointer' }
            }, t(m === 'lawine' ? 'schulden.methodLawine' : 'schulden.methodSchneeball')))
          )
        ),
        prioritized.map((d, idx) => {
          const tierLabel = d.tier === 1 ? t('schulden.tier1') : d.tier === 2 ? t('schulden.tier2') : t('schulden.tier3');
          const tierReason = d.tier === 1 ? t('schulden.tier1Reason') : d.tier === 2 ? t('schulden.tier2Reason') : t('schulden.tier3Reason');
          const tierColor = d.tier === 1 ? palette.roseDeep : d.tier === 2 ? palette.goldDeep : palette.mid;
          return React.createElement('div', { key: d.id || idx, style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, marginBottom: space.sm, border: '1px solid ' + palette.border } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm, marginBottom: '4px' } },
              React.createElement('span', { style: { fontWeight: weight.semi } }, (idx + 1) + '. ' + (d.creditor || '—')),
              React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + Number(d.amount || 0).toFixed(2))
            ),
            React.createElement('div', { style: { display: 'inline-block', fontSize: text.xs, fontWeight: weight.semi, color: tierColor, marginBottom: '4px' } }, '● ' + tierLabel),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } }, tierReason)
          );
        })
      )
    ),

    // Debts View
    view === 'debts' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.addDebt')),

      React.createElement('div', { style: { background: palette.surface, padding: space.md, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.border } },
        React.createElement('input', { type: 'text', value: newDebt.creditor, onChange: (e) => setNewDebt(p => ({ ...p, creditor: e.target.value })), placeholder: t('schulden.creditor'), 'aria-label': t('schulden.creditor'), style: inputStyle }),
        React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: newDebt.amount, onChange: (e) => setNewDebt(p => ({ ...p, amount: e.target.value })), placeholder: t('schulden.amount'), 'aria-label': t('schulden.amount'), style: inputStyle }),
        // Pflicht = Gläubiger + Betrag; alles Weitere optional, eingeklappt
        React.createElement('details', null,
          React.createElement('summary', { style: { fontSize: text.sm, color: palette.mid, cursor: 'pointer', marginBottom: space.sm } }, t('schulden.moreDetails')),
          React.createElement('input', { type: 'date', value: newDebt.dueDate, onChange: (e) => setNewDebt(p => ({ ...p, dueDate: e.target.value })), 'aria-label': t('schulden.dueSoon') + ' (' + t('common.optional') + ')', style: { ...inputStyle, marginTop: space.sm } }),
          React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.1', value: newDebt.interestRate, onChange: (e) => setNewDebt(p => ({ ...p, interestRate: e.target.value })), placeholder: t('schulden.interestRate'), 'aria-label': t('schulden.interestRate') + ' (' + t('common.optional') + ')', style: inputStyle }),
          React.createElement('select', { value: newDebt.category, onChange: (e) => setNewDebt(p => ({ ...p, category: e.target.value })), 'aria-label': t('schulden.category'), style: inputStyle },
            React.createElement('option', { value: 'wohnen' }, t('schulden.catWohnen')),
            React.createElement('option', { value: 'krankenkasse' }, t('schulden.catKrankenkasse')),
            React.createElement('option', { value: 'alimente' }, t('schulden.catAlimente')),
            React.createElement('option', { value: 'bussen' }, t('schulden.catBussen')),
            React.createElement('option', { value: 'steuern' }, t('schulden.catSteuern')),
            React.createElement('option', { value: 'kredit' }, t('schulden.catKredit')),
            React.createElement('option', { value: 'sonstige' }, t('schulden.catSonstige'))
          ),
          React.createElement('select', { value: newDebt.status, onChange: (e) => setNewDebt(p => ({ ...p, status: e.target.value })), 'aria-label': t('schulden.statusField'), style: inputStyle },
            React.createElement('option', { value: 'open' }, t('schulden.statusOpen')),
            React.createElement('option', { value: 'overdue' }, t('schulden.overdue')),
            React.createElement('option', { value: 'paid' }, t('schulden.statusPaid'))
          )
        ),
        formError && React.createElement('div', { role: 'alert', style: { fontSize: text.sm, color: palette.roseDeep, marginTop: space.sm, marginBottom: space.sm } }, t('schulden.needInfo')),
        React.createElement('button', { onClick: handleAddDebt, style: { ...buttonStyle, marginTop: space.sm } }, '+ ' + t('schulden.addDebt'))
      ),

      schulden.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'money', size: 26, color: palette.mid }), title: t('schulden.emptyDebts') }) : React.createElement('div', null,
        schulden.map(debt => React.createElement('div', { key: debt.id, style: cardStyle },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
            React.createElement('strong', null, debt.creditor),
            React.createElement('span', { style: { fontWeight: weight.semi, color: debt.status === 'paid' ? palette.sage : debt.status === 'overdue' ? palette.roseDeep : palette.text } }, 'CHF ' + debt.amount.toFixed(2))
          ),
          React.createElement('div', { style: { color: palette.mid, fontSize: text.sm, marginBottom: '6px' } },
            (debt.dueDate ? debt.dueDate + ' · ' : '') + statusLabel(debt.status)
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
    view === 'betreibung' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.debtCollection')),

      React.createElement('button', { onClick: handleAddBetreibung, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.addDebt')),

      betreibung.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'legal', size: 26, color: palette.mid }), title: t('schulden.emptyBetreibung') }) : React.createElement('div', null,
        betreibung.map(entry => React.createElement('div', { key: entry.id, style: { ...cardStyle, cursor: 'default', background: entry.status === 'erledigt' ? palette.up : palette.gold + '0A' } },
          React.createElement('input', { type: 'text', value: entry.creditor, onChange: (e) => handleUpdateBetreibung(entry.id, 'creditor', e.target.value), placeholder: t('schulden.creditor'), 'aria-label': t('schulden.creditor'), style: { ...inputStyle, marginBottom: space.xs } }),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: entry.amount || '', onChange: (e) => handleUpdateBetreibung(entry.id, 'amount', e.target.value), placeholder: t('schulden.amount'), 'aria-label': t('schulden.amount'), style: { ...inputStyle, width: '140px', marginBottom: 0 } }),
            React.createElement('input', { type: 'date', value: entry.registerDate || '', onChange: (e) => handleUpdateBetreibung(entry.id, 'registerDate', e.target.value), 'aria-label': t('schulden.registerDate'), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
            React.createElement('select', { value: entry.status, onChange: (e) => handleUpdateBetreibung(entry.id, 'status', e.target.value), 'aria-label': t('schulden.statusField'), style: { ...inputStyle, width: '140px', marginBottom: 0 } },
              React.createElement('option', { value: 'open' }, t('schulden.statusOpen')),
              React.createElement('option', { value: 'paid' }, t('schulden.statusPaid'))
            )
          ),
          React.createElement('button', { 'aria-label': t('common.delete'), onClick: () => handleDeleteBetreibung(entry.id), style: { ...buttonStyle, background: palette.rose, marginTop: space.xs } }, '✕ ' + t('common.delete'))
        ))
      )
    ),

    // Verlustscheine View
    view === 'verlustscheine' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.lossReceipts')),

      React.createElement('button', { onClick: handleAddVerlustschein, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.lossReceipts')),

      verlustscheine.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'document', size: 26, color: palette.mid }), title: t('schulden.emptyVerlustschein') }) : React.createElement('div', null,
        verlustscheine.map(entry => React.createElement('div', { key: entry.id, style: { ...cardStyle, cursor: 'default' } },
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'text', value: entry.creditor || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'creditor', e.target.value), placeholder: t('schulden.creditor'), 'aria-label': t('schulden.creditor'), style: { ...inputStyle, flex: '1 1 200px', marginBottom: 0 } }),
            React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: entry.amount || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'amount', e.target.value), placeholder: t('schulden.amount'), 'aria-label': t('schulden.amount'), style: { ...inputStyle, width: '140px', marginBottom: 0 } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'text', value: entry.debtor || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'debtor', e.target.value), placeholder: t('schulden.debtor'), 'aria-label': t('schulden.debtor'), style: { ...inputStyle, flex: '1 1 200px', marginBottom: 0 } }),
            React.createElement('input', { type: 'text', value: entry.court || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'court', e.target.value), placeholder: t('schulden.court'), 'aria-label': t('schulden.court'), style: { ...inputStyle, flex: '1 1 160px', marginBottom: 0 } })
          ),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center' } },
            React.createElement('input', { type: 'date', value: entry.date || '', onChange: (e) => handleUpdateVerlustschein(entry.id, 'date', e.target.value), 'aria-label': t('schulden.date'), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
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
    React.createElement('button', { onClick: handleSaveAll, style: { ...buttonStyle, width: '100%', padding: '12px', marginTop: space.sm, background: palette.sageBtn, color: '#fff' } }, '□ ' + t('common.save'))
  );
};

export default SchuldenManager;
