import React, { useState, useEffect, useRef } from 'react';
import { GespeichertZeile } from './components/GespeichertZeile.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { calculateDebtStatus, createDebtPlan, prioritizeDebts, calculateBetreibungsRegisterImpact, formatVerlustschein, istUeberfaellig } from './schuldenCalc.js';
import { heuteIso, alsIsoDatum } from './utils/fristen.js';
import { offenePosten } from './utils/offenePosten.js';
import { renderSource } from './utils/renderSource.js';
import { formatDE } from './utils/helpers.js';
import { leseBetrag } from './briefGenerator.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { ExternerLink } from './components/ExternerLink.jsx';
import { LegendenMarke } from './components/LegendenMarke.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { AblaufLink } from './AblaufSchale.jsx';
import { betrag, zahl } from './utils/geld.js';
import { darlehenVorschlag, betreibungsHinweis, rateAusBudget } from './utils/schuldenAusProfil.js';
import { CHAPTER_KEYS } from './config/constants.js';
import { MAHNSTUFEN, leseStufe, naechsterWeg } from './utils/mahnstufe.js';
import { OffenBalken, AbbauZeitachse, MahnstufenUebersicht, AusserdemOffen, OffenePosten, STUFEN_TON, tierLabelKey } from './components/SchuldenBilder.jsx';

// Mahnstufe einer Forderung (27.09.2026): Rechnung → Mahnung → Zahlungsbefehl, hier nur die Auswahl
// und der ruhige nächste Weg. Das Bild aller Stufen steht seit der Dataviz-Runde (27.09.) EINMAL in
// der Übersicht (MahnstufenUebersicht) statt als Punkte-Leiste auf jeder Karte.
export const MahnstufenLeiste = ({ debt, palette, t, inputStyle, onChange, onNavigate }) => {
  const stufe = leseStufe(debt.stufe);
  const weg = naechsterWeg(debt);
  const id = 'stufe-' + debt.id;
  // KVG Art. 64a Abs. 1: Zahlungsaufforderung der Kasse = noch keine Betreibung (Prüfer 27.09.).
  // Nur bei Krankenkassen-Forderungen — vorher stand der Satz unter jeder Forderung.
  const kk = debt.category === 'krankenkasse';
  return React.createElement('div', { style: { marginBottom: space.sm } },
    React.createElement('label', { htmlFor: id, style: { display: 'block', fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('schulden.stufe.label')),
    React.createElement('select', { id, 'aria-describedby': kk ? id + '-hilfe' : undefined, value: stufe, onChange: (e) => onChange(leseStufe(e.target.value)), style: { ...inputStyle, width: 'auto', maxWidth: '100%', marginBottom: space.xs, fontSize: text.sm } },
      React.createElement('option', { value: '' }, t('schulden.stufe.keine')),
      MAHNSTUFEN.map(k => React.createElement('option', { key: k, value: k }, t('schulden.stufe.' + k)))
    ),
    kk && React.createElement('div', { id: id + '-hilfe', style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('schulden.stufe.hilfe')),
    weg && onNavigate && React.createElement(AblaufLink, { palette, label: t(weg.key), onClick: () => onNavigate(weg.view) })
  );
};

// `vorlaeufig`: Beispiel oder Ausprobieren — Änderungen liegen nur im Arbeitsspeicher (main.jsx).
export const SchuldenManager = ({ palette, t, data, onSave, onNavigate, vorlaeufig }) => {
  const vorlesen = useVorlesenContext();
  const [view, setView] = useState('overview');
  const [schulden, setSchulden] = useState(data.schulden || []);
  const [betreibung, setBetreibung] = useState(data.betreibung || []);
  const [verlustscheine, setVerlustscheine] = useState(data.verlustscheine || []);
  // Nicht zweimal eingeben: «Persönliche Darlehen» aus dem Kapitel Finanzen, solange noch keine Schuld erfasst ist.
  const [vorschlag] = useState(() => darlehenVorschlag(data, data.schulden));
  const [newDebt, setNewDebt] = useState({ creditor: '', amount: vorschlag?.amount || '', dueDate: '', interestRate: '', status: 'open', category: vorschlag?.category || 'sonstige' });
  // Abbau-Plan: Rate als Text (Schweizer Schreibweise erlaubt), gelesen wie im Briefgenerator.
  // Vorschlag aus dem Budget (27.09.2026) — nur auf gleicher Basis, sonst leer mit Hinweis.
  const [budgetRate] = useState(() => rateAusBudget(data));
  const [planRate, setPlanRate] = useState(() => (budgetRate.grund === 'ok' ? String(budgetRate.vorschlag) : ''));
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
      createdAt: heuteIso()
    };

    setSchulden([...schulden, debt]);
    setNewDebt({ creditor: '', amount: '', dueDate: '', interestRate: '', status: 'open', category: 'sonstige' });
  };

  const handleAddBetreibung = () => {
    const entry = {
      id: Date.now(),
      creditor: '',
      amount: 0,
      registerDate: heuteIso(),
      status: 'open',
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
      court: '',
      status: 'open'
    });
    setVerlustscheine([...verlustscheine, entry]);
  };

  const handleUpdateVerlustschein = (id, field, value) => {
    setVerlustscheine(verlustscheine.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? Number(value) || 0 : value } : e));
  };

  const handleDeleteVerlustschein = (id) => {
    setVerlustscheine(verlustscheine.filter(e => e.id !== id));
  };

  // Mahnstufe nachtragen (27.09.2026): eine Forderung wandert von der Rechnung zur Mahnung.
  const handleUpdateDebt = (id, field, value) => {
    setSchulden(schulden.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleDeleteDebt = (id) => {
    setSchulden(schulden.filter(d => d.id !== id));
  };

  // Sofort übernehmen, wie überall sonst in der App. Bis 24.09.2026 lagen neue Einträge
  // nur hier im Zustand und wurden erst mit «Speichern» ganz unten geschrieben — wer
  // vorher auf «Übersicht» tippte, verlor sie still. Der erste Lauf (Einhängen) schreibt
  // nichts; `onSave` über eine Referenz, weil main.jsx bei jedem Rendern eine neue
  // Funktion übergibt und der Effekt sonst in jeder Runde feuern würde.
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const eingehaengt = useRef(false);
  const [gespeichert, setGespeichert] = useState(false);
  useEffect(() => {
    if (!eingehaengt.current) { eingehaengt.current = true; return; }
    onSaveRef.current({ schulden, betreibung, verlustscheine });
    setGespeichert(true);
  }, [schulden, betreibung, verlustscheine]);


  const debtStatus = calculateDebtStatus(schulden);
  // ① ② Mit dem lokalen Zustand, damit frisch Erfasstes sofort zählt.
  const posten = offenePosten({ ...data, schulden }, heuteIso());
  const prioritized = prioritizeDebts(schulden, method);
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const betreibungImpact = calculateBetreibungsRegisterImpact(betreibung, income);
  const plan = createDebtPlan(schulden, leseBetrag(planRate), method);
  const mitZahlungsbefehl = prioritized.filter(d => leseStufe(d.stufe) === 'zahlungsbefehl');

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
    // inline-flex + gap: Präfix-Icons (Kreuz, Rechner, Haken) sitzen mittig neben dem Text.
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: space.sm + 'px ' + space.sm + 'px ' + space.sm + 'px ' + (space.sm + 4) + 'px',
    background: palette.sand,
    color: palette.onSand,
    border: 'none',
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.xs,
    minHeight: '44px', boxSizing: 'border-box',
  };
  // Löschen ist kein Hauptknopf (Seitenrundgang 27.09.2026): vorher gefüllt
  // in Rose, so laut wie «+ Schuld erfassen». Jetzt Umriss mit
  // roséfarbenem Text als Hinweis, nicht als Alarm.
  const zweitKnopf = { ...buttonStyle, background: 'transparent', color: palette.text, border: '1px solid ' + palette.border };
  const loeschKnopf = { ...zweitKnopf, color: palette.roseDeep || palette.rose };

  // Ruhiger Erklärkasten mit Titel, Text und Quellenzeile (Verlustscheine, Bussen — 27.09.2026).
  const erklaerKasten = (key, titel, textKey, quelleKey) => React.createElement('div', { key, style: { padding: space.md + 'px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, marginBottom: space.md } },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm, color: palette.text, marginBottom: space.xs } }, titel),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6 } }, t(textKey)),
    quelleKey && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: 1.5 } }, renderSource(t(quelleKey), null, t))
  );

  const linkKnopf = { display: 'inline', background: 'none', border: 'none', padding: 0, color: palette.sageDeep, textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: text.xs };
  const detailsStil = { padding: space.sm + 'px ' + space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.sm, marginBottom: space.sm };
  const summaryStil = { cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, color: palette.text };
  const statusLabel = (d) => d.status === 'paid' ? t('schulden.statusPaid') : istUeberfaellig(d) ? t('schulden.overdue') : t('schulden.statusOpen');
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

    // Overview — Dataviz-Runde 27.09.2026: ein Balken nach Reihenfolge (A) und die Mahnstufen
    // aller Forderungen auf einer Leiste (C), statt fünf Zahlenzeilen. Bilder in SchuldenBilder.jsx.
    view === 'overview' && React.createElement('div', { role: 'tabpanel' },
      // ① ② stehen unabhängig davon, ob schon Forderungen erfasst sind (Arztrechnungen allein genügen).
      prioritized.length === 0 && debtStatus.paid === 0
        ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'money', size: 26, color: palette.mid }), title: t('schulden.emptyDebts') })
        : React.createElement(OffenBalken, { palette, t, prioritized, status: debtStatus }),
      React.createElement(AusserdemOffen, { palette, t, posten, onNavigate }),
      React.createElement(OffenePosten, { palette, t, posten, onNavigate }),
      React.createElement(MahnstufenUebersicht, { palette, t, prioritized, onNavigate }),

      betreibung.length > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.sm, color: palette.text } }, t('schulden.debtRegisterAnalysis')),
        // Neutral statt Wertung (27.09.2026): keine Schwellen ohne Quelle, ohne Einkommen keine Zahl.
        React.createElement('div', { style: { fontSize: text.sm, marginBottom: space.sm, color: palette.text } },
          betreibungImpact.monatseinkommen !== null
            ? t('schulden.betreibungSumme', { amount: betrag(betreibungImpact.totalDebt, { stellen: 2 }), monate: zahl(betreibungImpact.monatseinkommen, { hoechstens: 1 }) })
            : t('schulden.betreibungOhneEinkommen', { amount: betrag(betreibungImpact.totalDebt, { stellen: 2 }) })
        ),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, background: palette.surface, padding: space.sm, borderRadius: radius.sm } }, t('schulden.helpBody'))
      )
    ),

    // Abbau-Plan — neu geordnet 27.09.2026 (Design-Kritik Deploy-Tor: «überladen»): zuerst Rate und
    // Zeitachse (B), dann die Reihenfolge nach Stufen — Begründung EINMAL je Stufe statt je
    // Forderung —, dann Beratung, Hintergrund (Bussen, Steuern) eingeklappt.
    view === 'plan' && React.createElement('div', { role: 'tabpanel' },
      React.createElement('p', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginTop: 0, marginBottom: space.md } }, t('schulden.planIntro')),

      prioritized.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'money', size: 26, color: palette.mid }), title: t('schulden.emptyDebts') }) : React.createElement('div', null,
        // Richtwert: wie lange mit einer eigenen Monatsrate (Rechnung in schuldenCalc.createDebtPlan).
        React.createElement('div', { style: { padding: space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.sm, marginBottom: space.lg } },
          React.createElement('label', { htmlFor: 'plan-rate', style: { display: 'block', fontWeight: weight.semi, fontSize: text.sm, color: palette.text, marginBottom: space.xs } }, t('schulden.plan.rateLabel')),
          React.createElement('input', { id: 'plan-rate', type: 'text', inputMode: 'decimal', autoComplete: 'off', value: planRate, onChange: (e) => setPlanRate(e.target.value), 'aria-describedby': 'plan-rate-hilfe', style: { ...inputStyle, maxWidth: '220px', marginBottom: space.xs } }),
          React.createElement('div', { id: 'plan-rate-hilfe', style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } },
            budgetRate.grund === 'ok'
              ? t('schulden.plan.ausBudget', { einnahmen: betrag(budgetRate.einnahmen, { hoechstens: 2 }), ausgaben: betrag(budgetRate.ausgaben, { hoechstens: 2 }), vorschlag: betrag(budgetRate.vorschlag) })
              : budgetRate.grund === 'unvollstaendig'
                ? t('schulden.plan.budgetFehlt', { was: budgetRate.fehlend.map(k => t('schulden.plan.fehlt.' + k)).join(', ') })
                : t('schulden.plan.budget.' + budgetRate.grund),
            ' ', t('schulden.plan.rateHilfe'),
            budgetRate.grund === 'ok' && ' ' + t('schulden.plan.reserve'),
            budgetRate.grund === 'ok' && budgetRate.steuerFehlt && ' ' + t('schulden.plan.steuerFehlt'),
            budgetRate.grund === 'ok' && budgetRate.heutigeRaten > 0 && ' ' + t('schulden.plan.heutigeRaten', { amount: betrag(budgetRate.heutigeRaten, { hoechstens: 2 }) })
          ),
          // Knöpfe AUSSERHALB der Feld-Beschreibung (a11y-Prüfer Deploy-Tor 27.09.: in
          // aria-describedby wurden sie als Fliesstext vorgelesen).
          (budgetRate.grund === 'ok' ? leseBetrag(planRate) !== budgetRate.vorschlag : !!onNavigate) && React.createElement('div', { style: { marginTop: space.xs } },
            budgetRate.grund === 'ok'
              ? React.createElement('button', { type: 'button', onClick: () => setPlanRate(String(budgetRate.vorschlag)), style: linkKnopf }, t('schulden.plan.zurueck'))
              : React.createElement('button', { type: 'button', onClick: () => onNavigate('budget'), style: linkKnopf }, t('schulden.plan.zumBudget'))
          ),
          React.createElement('div', { role: 'status', 'aria-live': 'polite', style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginTop: space.sm } },
            !plan ? t('schulden.plan.ohne')
              : !plan.machbar ? t(plan.grund === 'zins' ? 'schulden.plan.zuWenig' : 'schulden.plan.zuLang', { rate: betrag(leseBetrag(planRate), { hoechstens: 2 }), zins: betrag(plan.zinsMonat || 0, { stellen: 2 }) })
              : t(plan.monate === 1 ? 'schulden.plan.ergebnisEins' : 'schulden.plan.ergebnis', { rate: betrag(leseBetrag(planRate), { hoechstens: 2 }), monate: String(plan.monate), zins: betrag(plan.zinsTotal, { stellen: 2 }) })
          ),
          React.createElement(AbbauZeitachse, { palette, t, plan }),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } }, t('schulden.plan.vereinfacht'))
        ),

        // Reihenfolge nach Stufe: Überschrift + Begründung einmal, darunter die Forderungen.
        [1, 2, 3].filter(tier => prioritized.some(d => d.tier === tier)).map(tier => React.createElement('section', { key: tier, 'aria-labelledby': 'stufe-titel-' + tier, style: { marginBottom: space.md } },
          React.createElement('div', { id: 'stufe-titel-' + tier, style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '2px' } },
            React.createElement(LegendenMarke, { form: 'fuellung', color: palette.text + STUFEN_TON[tier], palette }), t(tierLabelKey(tier))),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginBottom: space.xs } }, t('schulden.tier' + tier + 'Reason')),
          // Die Methode ordnet nur die übrigen Schulden — darum steht die Wahl hier.
          tier === 3 && React.createElement('div', { role: 'group', 'aria-label': t('schulden.planMethod'), style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', margin: space.xs + 'px 0' } },
            ['lawine', 'schneeball'].map(m => React.createElement('button', {
              key: m, type: 'button', onClick: () => setMethod(m), 'aria-pressed': method === m,
              style: { padding: space.xs + 'px ' + space.sm + 'px', fontSize: text.xs, fontWeight: weight.semi, textAlign: 'start', border: '1px solid ' + (method === m ? palette.sand : palette.border), background: method === m ? palette.sand + '22' : palette.surface, color: method === m ? palette.text : palette.mid, borderRadius: radius.sm, cursor: 'pointer' }
            }, t(m === 'lawine' ? 'schulden.methodLawine' : 'schulden.methodSchneeball')))
          ),
          React.createElement('ol', { start: prioritized.findIndex(d => d.tier === tier) + 1, style: { margin: 0, paddingInlineStart: '1.4em', fontSize: text.sm, color: palette.text } },
            prioritized.filter(d => d.tier === tier).map((d, idx) => React.createElement('li', { key: d.id || idx, style: { padding: '3px 0' } },
              React.createElement('span', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm } },
                React.createElement('span', null, d.creditor || '—'),
                React.createElement('span', { style: { fontVariantNumeric: 'tabular-nums' } }, betrag(Number(d.amount || 0), { stellen: 2 })))
            ))
          )
        )),

        // Beratungs-Box — warm, ohne Wertung
        React.createElement('div', { style: { padding: space.md + 'px', background: palette.sage + '14', border: '1px solid ' + palette.sage + '55', borderRadius: radius.sm, margin: space.md + 'px 0' } },
          React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.xs } }, t('schulden.helpTitle')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginBottom: space.sm } }, t('schulden.helpBody')),
          React.createElement('div', { style: { display: 'flex', gap: space.md, flexWrap: 'wrap', fontSize: text.sm, fontWeight: weight.semi } },
            React.createElement('a', { href: 'tel:0800708708', style: { color: palette.sageDeep, textDecoration: 'none' } }, '0800 708 708'),
            React.createElement(ExternerLink, { t, href: 'https://schulden.ch', style: { color: palette.sageDeep, textDecoration: 'none' } }, 'schulden.ch')
          ),
          onNavigate && React.createElement('div', { style: { marginTop: space.sm } },
            React.createElement(AblaufLink, { palette, label: t('schulden.situationLink'), onClick: () => onNavigate('situationen') }),
            React.createElement(AblaufLink, { palette, label: t('schulden.mahnungLink'), onClick: () => onNavigate('mahnung') })
          )
        ),

        // Hintergrund eingeklappt: Bussen (nur bei erfasster Busse) und Steuern (DBG/StHG).
        prioritized.some(d => d.category === 'bussen') && React.createElement('details', { style: detailsStil },
          React.createElement('summary', { style: summaryStil }, t('schulden.bussen.title')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginTop: space.xs } }, t('mahnung.step4Bussen')),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: 1.5 } }, renderSource(t('schulden.bussen.quelle'), null, t))
        ),
        React.createElement('details', { style: detailsStil },
          React.createElement('summary', { style: summaryStil }, t('schulden.steuer.title')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: 1.6, marginTop: space.xs } }, t('schulden.steuer.text'))
        ),

        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.sm, lineHeight: 1.5 } }, renderSource(t('schulden.planQuelle'), null, t))
      )
    ),

    // Debts View
    view === 'debts' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.addDebt')),

      React.createElement('div', { style: { background: palette.surface, padding: space.md, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.border } },
        React.createElement('input', { type: 'text', value: newDebt.creditor, onChange: (e) => setNewDebt(p => ({ ...p, creditor: e.target.value })), placeholder: t('schulden.creditor'), 'aria-label': t('schulden.creditor'), style: inputStyle }),
        React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: newDebt.amount, onChange: (e) => setNewDebt(p => ({ ...p, amount: e.target.value })), placeholder: t('schulden.amount'), 'aria-label': t('schulden.amount'), style: inputStyle }),
        vorschlag && newDebt.amount === vorschlag.amount && schulden.length === 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '-4px', marginBottom: space.sm } }, t('schulden.ausProfilHint')),
        // Pflicht = Gläubiger + Betrag; alles Weitere optional, eingeklappt
        React.createElement('details', null,
          React.createElement('summary', { style: { fontSize: text.sm, color: palette.mid, cursor: 'pointer', marginBottom: space.sm } }, t('schulden.moreDetails')),
          React.createElement('input', { type: 'date', value: newDebt.dueDate, onChange: (e) => setNewDebt(p => ({ ...p, dueDate: e.target.value })), 'aria-label': t('schulden.dueSoon') + ' (' + t('common.optional') + ')', style: { ...inputStyle, marginTop: space.sm } }),
          React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.1', value: newDebt.interestRate, onChange: (e) => setNewDebt(p => ({ ...p, interestRate: e.target.value })), placeholder: t('schulden.interestRate'), 'aria-label': t('schulden.interestRate') + ' (' + t('common.optional') + ')', style: inputStyle }),
          React.createElement('select', { value: newDebt.category, onChange: (e) => setNewDebt(p => ({ ...p, category: e.target.value })), 'aria-label': t('schulden.category'), style: inputStyle },
            React.createElement('option', { value: 'wohnen' }, t('schulden.catWohnen')),
            React.createElement('option', { value: 'krankenkasse' }, t('schulden.catKrankenkasse')),
            React.createElement('option', { value: 'gesundheit' }, t('schulden.catGesundheit')),
            React.createElement('option', { value: 'alimente' }, t('schulden.catAlimente')),
            React.createElement('option', { value: 'bussen' }, t('schulden.catBussen')),
            React.createElement('option', { value: 'steuern' }, t('schulden.catSteuern')),
            React.createElement('option', { value: 'kredit' }, t('schulden.catKredit')),
            React.createElement('option', { value: 'sonstige' }, t('schulden.catSonstige'))
          ),
          (newDebt.category === 'krankenkasse' || newDebt.category === 'gesundheit') && React.createElement('div', { 'data-testid': 'kat-hilfe', style: { fontSize: text.xs, color: palette.mid, marginTop: '-4px', marginBottom: space.sm } }, t('schulden.catHilfe.' + newDebt.category)),
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
            React.createElement('span', { style: { fontWeight: weight.semi, color: debt.status === 'paid' ? (palette.sageDeep || palette.sage) : palette.text } }, betrag(debt.amount, { stellen: 2 }))
          ),
          React.createElement('div', { style: { color: palette.mid, fontSize: text.sm, marginBottom: '6px' } },
            (debt.dueDate ? formatDE(debt.dueDate) + ' · ' : '') + statusLabel(debt)
          ),
          // Mahnstufe: Rechnung, Mahnung, Zahlungsbefehl (siehe MahnstufenLeiste oben).
          debt.status !== 'paid' && React.createElement(MahnstufenLeiste, { debt, palette, t, inputStyle, onNavigate, onChange: (v) => handleUpdateDebt(debt.id, 'stufe', v) }),
          React.createElement('button', { 'aria-label': t('common.delete') + ' ' + debt.creditor, onClick: () => handleDeleteDebt(debt.id), style: loeschKnopf }, React.createElement(Icon, { name: 'kreuz', size: 14 }), t('common.delete'))
        ))
      )
    ),

    // Betreibung View
    view === 'betreibung' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.debtCollection')),

      React.createElement('button', { onClick: handleAddBetreibung, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.addBetreibung')),
      // Registerstand im Kapitel Behörden nur als Hinweis, nie automatisch (utils/schuldenAusProfil.js).
      betreibungsHinweis(data.behoerden?.betreibungsStatus, betreibung) && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm, color: palette.text, lineHeight: '1.5' } },
        hinweisZeichen(), t('schulden.registerHinweis'), ' ',
        onNavigate && React.createElement('button', { type: 'button', onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf('behoerden')), style: { background: 'none', border: 'none', padding: 0, color: palette.sageDeep, textDecoration: 'underline', cursor: 'pointer', font: 'inherit' } }, t('schulden.registerHinweisLink'))
      ),

      // Mahnstufe «Zahlungsbefehl» auf einer Forderung und dieser Tab waren zwei Erfassungen ohne
      // Verbindung (Rundgang 27.09.). Hier nur der Hinweis — nichts wird automatisch angelegt.
      mitZahlungsbefehl.length > 0 && React.createElement('div', { style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm, color: palette.text, lineHeight: 1.5 } },
        hinweisZeichen(), t('schulden.bild.ausForderungen', { namen: mitZahlungsbefehl.map(d => d.creditor || '—').join(', ') })
      ),
      betreibung.length === 0 ? React.createElement(EmptyState, { palette, icon: React.createElement(Icon, { name: 'legal', size: 26, color: palette.mid }), title: t('schulden.emptyBetreibung') }) : React.createElement('div', null,
        betreibung.map(entry => React.createElement('div', { key: entry.id, style: { ...cardStyle, cursor: 'default', background: entry.status === 'paid' || entry.status === 'erledigt' ? palette.up : palette.gold + '0A' } },
          React.createElement('input', { type: 'text', value: entry.creditor, onChange: (e) => handleUpdateBetreibung(entry.id, 'creditor', e.target.value), placeholder: t('schulden.creditor'), 'aria-label': t('schulden.creditor'), style: { ...inputStyle, marginBottom: space.xs } }),
          React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.xs } },
            React.createElement('input', { type: 'number', inputMode: 'decimal', step: '0.01', value: entry.amount || '', onChange: (e) => handleUpdateBetreibung(entry.id, 'amount', e.target.value), placeholder: t('schulden.amount'), 'aria-label': t('schulden.amount'), style: { ...inputStyle, width: '140px', marginBottom: 0 } }),
            React.createElement('input', { type: 'date', value: alsIsoDatum(entry.registerDate), onChange: (e) => handleUpdateBetreibung(entry.id, 'registerDate', e.target.value), 'aria-label': t('schulden.registerDate'), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
            // Bis 27.09.2026 legte der Knopf 'active' an — keine der Optionen; gilt als offen.
            React.createElement('select', { value: entry.status === 'paid' ? 'paid' : 'open', onChange: (e) => handleUpdateBetreibung(entry.id, 'status', e.target.value), 'aria-label': t('schulden.statusField'), style: { ...inputStyle, width: '140px', marginBottom: 0 } },
              React.createElement('option', { value: 'open' }, t('schulden.statusOpen')),
              React.createElement('option', { value: 'paid' }, t('schulden.statusPaid'))
            )
          ),
          React.createElement('button', { 'aria-label': t('common.delete'), onClick: () => handleDeleteBetreibung(entry.id), style: { ...loeschKnopf, marginTop: space.xs } }, React.createElement(Icon, { name: 'kreuz', size: 14 }), t('common.delete'))
        ))
      )
    ),

    // Verlustscheine View
    view === 'verlustscheine' && React.createElement('div', { role: 'tabpanel' },
      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('schulden.lossReceipts')),
      // Was ein Verlustschein bedeutet (SchKG 149, 149a, 265) — 27.09.2026.
      erklaerKasten('vs', t('schulden.verlustschein.title'), 'schulden.verlustschein.text', 'schulden.verlustschein.quelle'),

      React.createElement('button', { onClick: handleAddVerlustschein, style: { ...buttonStyle, marginBottom: space.md } }, '+ ' + t('schulden.addVerlustschein')),

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
            React.createElement('input', { type: 'date', value: alsIsoDatum(entry.date), onChange: (e) => handleUpdateVerlustschein(entry.id, 'date', e.target.value), 'aria-label': t('schulden.date'), style: { ...inputStyle, width: '160px', marginBottom: 0 } }),
            React.createElement('button', { 'aria-label': t('common.delete'), onClick: () => handleDeleteVerlustschein(entry.id), style: loeschKnopf }, React.createElement(Icon, { name: 'kreuz', size: 14 }), t('common.delete'))
          )
        ))
      )
    ),

    // Privacy note
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.md, padding: 0 } }, hinweisZeichen(), t('trust.localOnly')),

    // Orientierungs-Disclaimer (keine Rechts-/Finanzberatung)
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm, lineHeight: 1.5, fontStyle: 'italic' } }, t('alpha.noAdviceHint')),

    // Kein «Speichern»-Knopf mehr: jede Änderung ist sofort übernommen. Die Zeile sagt es,
    // sobald es etwas zu sagen gibt — in einer Status-Region, die von Anfang an dasteht.
    React.createElement(GespeichertZeile, { palette, t, sichtbar: gespeichert, vorlaeufig })
  );
};

export default SchuldenManager;
