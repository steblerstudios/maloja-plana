import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, leading, duration, ease } from './config/tokens.js';
import { KVG_KATALOG, KVG_CATEGORIES, VORSORGE_EMPFEHLUNGEN, KVG_DETAILS, VORSORGE_INTERVAL_MONATE, FRANCHISE_STUFEN, berechneFranchise, berechneArztrechnung, TAXPUNKTWERT, KVG_DATA_VERSION } from './data/kvgLeistungen.js';
import { addReminder, loadReminders } from './utils/reminders.js';
import { loadVorsorgeDates, saveVorsorgeDate } from './utils/vorsorge.js';
import { renderSource } from './utils/renderSource.js';

// Status-Punkt-Farben (Granit-Palette). „excluded" (nicht gedeckt) ist bewusst
// neutral-grau — es ist Information, kein Alarm (dignity-first, Faden 3-II/2).
const STATUS_COLORS = (palette) => ({
  covered: palette.sage || '#5a7a5a',
  limited: palette.gold || '#c47a20',
  excluded: palette.soft || '#9a978f',
});

// Ruhiges Status-Signal: feiner Punkt + Wort statt lauter Pille (Faden 3-II/2,
// Layout-Schritt 2/3). Das Wort steht zurückhaltend in Sekundärfarbe.
// Im Farbenblind-Modus (palette.colorBlind) trägt der Punkt zusätzlich eine
// unterscheidbare FORM (voll / Ring-mit-Kern / hohl) — Bedeutung nie nur über Farbe.
const StatusBadge = ({ status, label, palette }) => {
  const colors = STATUS_COLORS(palette);
  const dot = colors[status] || palette.mid;
  const marker = palette.colorBlind
    ? React.createElement('svg', { width: '9', height: '9', viewBox: '0 0 10 10', 'aria-hidden': 'true', style: { flexShrink: 0 } },
        status === 'covered'
          ? React.createElement('circle', { cx: '5', cy: '5', r: '4', fill: dot })
          : status === 'limited'
            ? React.createElement(React.Fragment, null,
                React.createElement('circle', { cx: '5', cy: '5', r: '4', fill: 'none', stroke: dot, strokeWidth: '1.4' }),
                React.createElement('circle', { cx: '5', cy: '5', r: '1.6', fill: dot }))
            : React.createElement('circle', { cx: '5', cy: '5', r: '3.6', fill: 'none', stroke: dot, strokeWidth: '1.4' }))
    : React.createElement('span', {
        style: { width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0 }
      });
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }
  },
    marker,
    React.createElement('span', {
      style: { fontSize: text.xs, color: palette.mid }
    }, label)
  );
};

const TabButton = ({ active, label, onClick, palette }) =>
  React.createElement('button', {
    onClick,
    style: {
      padding: '8px 14px',
      background: active ? palette.sand : 'transparent',
      color: active ? '#000' : palette.mid,
      border: 'none',
      borderRadius: radius.sm,
      cursor: 'pointer',
      fontSize: text.sm,
      fontWeight: active ? weight.semi : weight.medium,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }
  }, label);

const CatButton = ({ active, label, onClick, palette }) =>
  React.createElement('button', {
    onClick,
    style: {
      padding: '4px 10px',
      background: active ? palette.sand + '25' : 'transparent',
      color: active ? palette.sand : palette.soft,
      border: active ? '1px solid ' + palette.sand + '40' : '1px solid ' + palette.border,
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: text.xs,
      fontWeight: weight.medium,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }
  }, label);

// ─── Katalog Tab ───────────────────────────────────────────
// Eine Katalog-Zeile (Faden 3-II/1c): kein Box-pro-Eintrag mehr, sondern ruhiger
// Lese-Rhythmus — Raum + feine Trennlinie. Status rechts, Inhalt links.
const KatalogRow = ({ palette, t, item, isLast }) => {
  // Faden 3-II/3 (Layout 3/3): die reiche WHO/EU-Empfehlung startet eingeklappt;
  // nur auf Wunsch öffnen (Info-Button-Prinzip, ruhige Grunddichte).
  const [open, setOpen] = React.useState(false);
  const emp = VORSORGE_EMPFEHLUNGEN[item.key];
  const sources = emp ? [emp.who && 'WHO', emp.eu && 'EU'].filter(Boolean).join(' · ') : '';
  const detailCount = KVG_DETAILS[item.key];
  const expandable = !!emp || !!detailCount;
  // Faden 3-II/2: opt-in persönlicher Intervall-Abgleich (nur für Screenings mit
  // belegbarem Monats-Intervall). Druckfrei, lokal, nie aggressiver als das Intervall.
  const recMonths = VORSORGE_INTERVAL_MONATE[item.key];
  const [lastVisit, setLastVisit] = React.useState(() => recMonths ? (loadVorsorgeDates()[item.key] || '') : '');
  const [reminderSaved, setReminderSaved] = React.useState(false);

  return React.createElement('div', {
    style: {
      padding: '14px 0',
      borderBottom: isLast ? 'none' : '1px solid ' + palette.border,
    }
  },
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }
    },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', {
          style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '2px' }
        }, t('kvg.' + item.key)),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
        }, t('kvg.' + item.key + 'Note')),
        item.intervalKey && React.createElement('div', {
          style: { fontSize: text.xs, color: palette.sand, marginTop: '4px', fontWeight: weight.medium }
        }, 'ⓘ ' + t('kvg.' + item.intervalKey)),
        // Faden 3-II: einklappbarer Detail-Block — entweder die WHO/EU-Empfehlung
        // (Screenings) oder „Was genau gedeckt ist" (z. B. Schwangerschaft, Impfungen).
        expandable && React.createElement('div', {
          style: { marginTop: '6px', paddingTop: '6px', borderTop: '1px solid ' + palette.border }
        },
          React.createElement('button', {
            type: 'button',
            onClick: () => setOpen(!open),
            'aria-expanded': open,
            style: {
              background: 'none', border: 'none', color: palette.sand, cursor: 'pointer',
              fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0', fontWeight: weight.medium,
              textAlign: 'left',
            }
          }, (open ? '▾ ' : '▸ ') + (emp
            ? (open ? t('kvg.empfehlungHide') : t('kvg.empfehlungShow', { sources }))
            : (open ? t('kvg.detailHide') : t('kvg.detailShow')))),
          // Screening-Empfehlung (WHO/EU)
          open && emp && React.createElement('div', {
            style: { fontSize: text.xs, color: palette.mid, marginTop: '6px', lineHeight: leading.normal }
          },
            emp.who && React.createElement('div', null,
              React.createElement('span', { style: { fontWeight: weight.semi } }, 'WHO: '),
              t('kvg.' + item.key + 'Who')
            ),
            emp.eu && React.createElement('div', null,
              React.createElement('span', { style: { fontWeight: weight.semi } }, 'EU: '),
              t('kvg.' + item.key + 'Eu')
            ),
            React.createElement('div', { style: { marginTop: '3px' } }, t('kvg.' + item.key + 'Synthese')),
            React.createElement('div', {
              style: { color: palette.soft, marginTop: '2px' }
            }, t('kvg.' + item.key + 'Quelle')),
            // Faden 3-II/4: dezentes Evidenz-Label — das empfohlene Intervall ist evidenzbasiert.
            React.createElement('div', { style: { marginTop: '5px' } },
              React.createElement('span', {
                style: {
                  fontSize: text.xs, color: palette.sage,
                  border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: '1px 6px',
                }
              }, t('kvg.evidenceBased'))
            ),
            // Faden 3-II/2: opt-in persönlicher Abgleich — letzte Untersuchung eintragen,
            // dann ruhig „nächste empfohlene ~MM.JJJJ" + (wenn überfällig) sanfter Hinweis
            // und 1-Klick-Kalendereintrag. Kein Druck, keine Wertung über die Leitlinie hinaus.
            recMonths && React.createElement('div', {
              style: { marginTop: '8px', paddingTop: '8px', borderTop: '1px solid ' + palette.border }
            },
              React.createElement('label', {
                style: { display: 'block', color: palette.mid, marginBottom: '3px' }
              }, t('kvg.lastVisitLabel')),
              React.createElement('input', {
                type: 'date',
                value: lastVisit || '',
                max: new Date().toISOString().slice(0, 10),
                onChange: (e) => { const v = e.target.value; setLastVisit(v); saveVorsorgeDate(item.key, v); setReminderSaved(false); },
                style: {
                  fontSize: text.xs, padding: '4px 6px', border: '1px solid ' + palette.border,
                  borderRadius: radius.sm, fontFamily: 'inherit', color: palette.text,
                  background: 'transparent',
                }
              }),
              lastVisit && (() => {
                const next = new Date(lastVisit);
                next.setMonth(next.getMonth() + recMonths);
                const nextStr = ('0' + (next.getMonth() + 1)).slice(-2) + '.' + next.getFullYear();
                const overdue = next <= new Date();
                return React.createElement('div', { style: { marginTop: '5px' } },
                  React.createElement('div', { style: { color: palette.mid } }, t('kvg.nextRecommended', { date: nextStr })),
                  overdue && React.createElement('div', { style: { color: palette.mid, marginTop: '3px' } }, t('kvg.overdueHint')),
                  overdue && (reminderSaved
                    ? React.createElement('div', { style: { color: palette.sage, marginTop: '4px' } }, '✓ ' + t('kvg.reminderSaved'))
                    : React.createElement('button', {
                        type: 'button',
                        onClick: () => {
                          const r = addReminder({ title: t('kvg.' + item.key), dueDate: new Date().toISOString().slice(0, 10), category: 'health' });
                          if (r) setReminderSaved(true);
                        },
                        style: {
                          marginTop: '4px', background: 'none', border: '1px solid ' + palette.border,
                          borderRadius: radius.sm, padding: '4px 10px', fontSize: text.xs,
                          color: palette.text, cursor: 'pointer', fontFamily: 'inherit',
                        }
                      }, t('kvg.addToCalendar'))
                  )
                );
              })()
            )
          ),
          // „Was genau gedeckt ist" — N belegbare Detail-Zeilen + Quelle
          open && !emp && detailCount && React.createElement('div', {
            style: { fontSize: text.xs, color: palette.mid, marginTop: '6px', lineHeight: leading.normal }
          },
            Array.from({ length: detailCount }, (_, i) =>
              React.createElement('div', { key: i, style: i > 0 ? { marginTop: '3px' } : null },
                t('kvg.' + item.key + 'Detail' + (i + 1)))
            ),
            React.createElement('div', {
              style: { color: palette.soft, marginTop: '4px' }
            }, t('kvg.' + item.key + 'DetailQuelle'))
          )
        )
      ),
      React.createElement('div', { style: { paddingTop: '1px' } },
        React.createElement(StatusBadge, {
          status: item.status,
          label: t('kvg.' + item.status),
          palette,
        })
      )
    )
  );
};

const KatalogTab = ({ palette, t, filterCat }) => {
  // Editoriale Gruppierung: in der „Alle"-Ansicht nach Kategorie mit ruhigen
  // Überschriften als Landmarken; bei aktivem Filter eine einzelne Gruppe ohne
  // Überschrift (der Chip zeigt die Kategorie bereits an).
  const cats = filterCat === 'all' ? KVG_CATEGORIES : [filterCat];
  // Faden 3-II/4: einmalige, einklappbare Evidenz-Notiz („häufiger besser?") — nur
  // dort, wo Vorsorge-Screenings sichtbar sind. Ehrlich: mehr ist nicht besser.
  const [evidenceOpen, setEvidenceOpen] = React.useState(false);
  const showEvidence = filterCat === 'all' || filterCat === 'vorsorge';

  return React.createElement('div', null,
    showEvidence && React.createElement('div', { style: { marginBottom: '4px' } },
      React.createElement('button', {
        type: 'button',
        onClick: () => setEvidenceOpen(!evidenceOpen),
        'aria-expanded': evidenceOpen,
        style: {
          background: 'none', border: 'none', color: palette.sand, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0', fontWeight: weight.medium,
          textAlign: 'left',
        }
      }, (evidenceOpen ? '▾ ' : '▸ ') + t('kvg.evidenceToggle')),
      evidenceOpen && React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, marginTop: '4px', lineHeight: leading.normal }
      },
        React.createElement('div', null, t('kvg.evidenceNote1')),
        React.createElement('div', { style: { marginTop: '3px' } }, t('kvg.evidenceNote2')),
        React.createElement('div', { style: { marginTop: '3px' } }, t('kvg.evidenceNote3')),
        React.createElement('div', { style: { color: palette.soft, marginTop: '4px' } }, t('kvg.evidenceNoteQuelle'))
      )
    ),
    cats.map(cat => {
      const catItems = KVG_KATALOG.filter(i => i.cat === cat);
      if (catItems.length === 0) return null;
      return React.createElement('div', { key: cat },
        filterCat === 'all' && React.createElement('div', {
          style: {
            fontSize: text.xs, fontWeight: weight.semi, color: palette.soft,
            letterSpacing: '0.04em', margin: '20px 0 2px',
          }
        }, t('kvg.cat' + cat.charAt(0).toUpperCase() + cat.slice(1))),
        catItems.map((item, idx) =>
          React.createElement(KatalogRow, {
            key: item.key, palette, t, item, isLast: idx === catItems.length - 1,
          })
        )
      );
    })
  );
};

// ─── Franchise Tab ─────────────────────────────────────────
const FranchiseTab = ({ palette, t, data, onUpdateData, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const storedFranchise = (() => {
    const f = data.versicherungen?.franchise;
    if (!f) return 300;
    const n = Number(String(f).replace(/[^0-9]/g, ''));
    return FRANCHISE_STUFEN.includes(n) ? n : 300;
  })();

  const [franchise, setFranchise] = useState(storedFranchise);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Belege werden einzeln erfasst und pro Jahr zur Summe zusammengerechnet.
  // Diese Summe ist die Quelle des Verbrauchs (zuerst Franchise, dann Selbstbehalt).
  const belege = Array.isArray(data.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  // Jahr eines Belegs: aus dem Datum, ODER laufendes Jahr wenn ohne Datum (gerade bezahlt).
  const belegYear = (b) => b.datum ? Number(String(b.datum).slice(0, 4)) : currentYear;
  // Jahre mit Belegen + laufendes Jahr, neueste zuerst — für den Jahr-Umschalter.
  const availableYears = [...new Set([currentYear, ...belege.map(belegYear)])].sort((a, b) => b - a);
  const yearBelege = belege.filter(b => belegYear(b) === selectedYear);
  const kosten = yearBelege.reduce((sum, b) => sum + (Number(b.betrag) || 0), 0);

  // Eingabe-Zustand für „Beleg hinzufügen"
  const [newDatum, setNewDatum] = useState('');
  const [newBetrag, setNewBetrag] = useState('');
  const [newStatus, setNewStatus] = useState('bezahlt');
  const [newFrist, setNewFrist] = useState('');
  const [tpOpen, setTpOpen] = useState(false);
  const [newTp, setNewTp] = useState('');
  const [ngOpen, setNgOpen] = useState(false);
  const [newNichtGedeckt, setNewNichtGedeckt] = useState('');
  const [newEingereicht, setNewEingereicht] = useState(false);

  // Belege, für die schon eine offene Kalender-Erinnerung existiert (für ✓-Feedback,
  // auch nach erneutem Öffnen der Ansicht). addReminder ist ohnehin idempotent.
  const reminderTitle = (b) => t('kvg.belegReminderTitle', { betrag: 'CHF ' + (Number(b.betrag) || 0) });
  const [remindedIds, setRemindedIds] = useState(() => {
    const rem = loadReminders();
    const s = new Set();
    belege.forEach(b => { if (b.frist && rem.some(r => !r.done && r.dueDate === b.frist && r.title === reminderTitle(b))) s.add(b.id); });
    return s;
  });
  const remindBeleg = (b) => {
    if (!b.frist) return;
    const r = addReminder({ title: reminderTitle(b), dueDate: b.frist, category: 'health' });
    if (r) setRemindedIds(prev => new Set(prev).add(b.id));
  };

  const canton = data.basis?.canton || '';
  const tpw = TAXPUNKTWERT[canton] || 0.89;
  const tpBetrag = newTp ? Math.round(Number(newTp) * tpw * 100) / 100 : 0;

  const addBeleg = () => {
    const betrag = Number(newBetrag);
    if (!betrag || betrag <= 0 || !onUpdateData) return;
    const beleg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      datum: newDatum || '', betrag,
      status: newStatus,
      frist: newStatus === 'offen' ? (newFrist || '') : '',
      // Optionaler nicht-gedeckter Anteil (z.B. Selbstzahler) — zählt NICHT auf
      // Franchise/Selbstbehalt, fliesst aber in die Gesundheitskosten (Finanzen).
      nichtGedeckt: Number(newNichtGedeckt) > 0 ? Number(newNichtGedeckt) : 0,
      eingereicht: newEingereicht,
    };
    onUpdateData('versicherungen', 'kkBelege', [...belege, beleg]);
    setSelectedYear(belegYear(beleg)); // den neu erfassten Beleg sofort sichtbar machen
    setNewDatum(''); setNewBetrag(''); setNewTp(''); setTpOpen(false);
    setNewStatus('bezahlt'); setNewFrist('');
    setNewNichtGedeckt(''); setNgOpen(false);
    setNewEingereicht(false);
  };
  const removeBeleg = (id) => {
    if (!onUpdateData) return;
    onUpdateData('versicherungen', 'kkBelege', belege.filter(b => b.id !== id));
  };
  // Zweite Dimension: bei der KK eingereicht? (ruhiger Haken, keine falsche Dringlichkeit)
  const toggleEingereicht = (id) => {
    if (!onUpdateData) return;
    onUpdateData('versicherungen', 'kkBelege', belege.map(b => b.id === id ? { ...b, eingereicht: !b.eingereicht } : b));
  };
  const fmtDatum = (d) => d ? d.split('-').reverse().join('.') : t('kvg.belegNoDate');

  const result = berechneFranchise(franchise, kosten);
  const hasInput = kosten > 0;

  // Ein ruhiger Standort-Satz: wo stehe ich dieses Jahr? (drei Zonen)
  const statusMsg = !hasInput ? null
    : result.selbstbehaltAusgeschoepft
      ? { text: t('kvg.selbstbehaltDone'), color: palette.sage || '#5a7a5a', icon: '✓' }
    : result.franchiseOffen > 0
      ? { text: t('kvg.statusInFranchise', { offen: result.franchiseOffen }), color: palette.sand, icon: 'ⓘ' }
      : { text: t('kvg.statusInSelbstbehalt', { sbOffen: Math.round(result.selbstbehaltMax - result.selbstbehalt) }), color: palette.gold || '#c47a20', icon: 'ⓘ' };

  const barStyle = (value, max, color) => ({
    height: '8px',
    background: palette.border,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  });

  const barFill = (value, max, color) => ({
    height: '100%',
    width: (max > 0 ? Math.min(100, (value / max) * 100) : 0) + '%',
    background: color,
    borderRadius: '4px',
    transition: `width ${duration.slow}ms ${ease}`,
  });

  return React.createElement('div', null,
    React.createElement('div', {
      style: { padding: '14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '16px' }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
      }, t('kvg.franchiseExplain')),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.franchiseLabel')),
      React.createElement('div', { style: { position: 'relative', marginBottom: '12px' } },
        React.createElement('select', {
          value: franchise,
          onChange: (e) => setFranchise(Number(e.target.value)),
          style: {
            width: '100%', padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
            appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px',
            cursor: 'pointer',
          }
        },
          FRANCHISE_STUFEN.map(f =>
            React.createElement('option', { key: f, value: f }, 'CHF ' + f)
          )
        ),
        React.createElement('div', {
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, '▾')
      ),

      // Brücke zum Franchise-Optimierer (Prämien-Orientierung): dort steht die
      // belegte Ersparnis-/Break-even-Rechnung für die eigene Kasse. Keine Waisen.
      onNavigate && React.createElement('button', {
        onClick: () => onNavigate('praemien'),
        style: {
          display: 'block', width: '100%', textAlign: 'start', background: 'none',
          border: 'none', padding: '2px 0 4px 0', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: text.sm, color: palette.sand, fontWeight: weight.medium,
        }
      }, t('kvg.franchiseOptimizerLink') + ' →'),

      React.createElement('div', {
        style: { height: '1px', background: palette.border, margin: '14px 0' }
      }),
      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.belegSection')),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal, marginBottom: '10px' }
      }, t('kvg.belegHint')),

      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
        React.createElement('input', {
          type: 'date',
          'aria-label': t('kvg.belegDatum'),
          value: newDatum,
          onChange: (e) => setNewDatum(e.target.value),
          style: {
            flex: '1 1 0', minWidth: 0, padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, fontFamily: 'inherit', boxSizing: 'border-box',
          }
        }),
        React.createElement('input', {
          type: 'number',
          inputMode: 'decimal',
          'aria-label': t('kvg.belegBetrag'),
          value: newBetrag,
          onChange: (e) => setNewBetrag(e.target.value),
          placeholder: t('kvg.belegBetrag'),
          style: {
            flex: '1 1 0', minWidth: 0, padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, boxSizing: 'border-box',
          }
        })
      ),

      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: newStatus === 'offen' ? '8px' : '8px' } },
        ['bezahlt', 'offen'].map(s =>
          React.createElement('button', {
            key: s,
            onClick: () => setNewStatus(s),
            style: {
              flex: '1 1 0', padding: '8px', borderRadius: radius.sm, fontFamily: 'inherit',
              fontSize: text.sm, cursor: 'pointer',
              border: '1px solid ' + (newStatus === s ? palette.sand : palette.border),
              background: newStatus === s ? palette.sand + '20' : 'transparent',
              color: newStatus === s ? palette.sand : palette.mid,
              fontWeight: newStatus === s ? weight.semi : weight.normal,
            }
          }, t(s === 'bezahlt' ? 'kvg.belegPaid' : 'kvg.belegOpen'))
        )
      ),

      newStatus === 'offen' && React.createElement('input', {
        type: 'date',
        'aria-label': t('kvg.belegFrist'),
        value: newFrist,
        onChange: (e) => setNewFrist(e.target.value),
        style: {
          width: '100%', padding: space.sm, borderRadius: radius.sm,
          border: '1px solid ' + palette.border, background: palette.surface,
          color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
          boxSizing: 'border-box', marginBottom: '8px',
        }
      }),

      React.createElement('button', {
        onClick: () => setTpOpen(!tpOpen),
        style: {
          background: 'none', border: 'none', color: palette.sand, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0',
          marginBottom: tpOpen ? '8px' : '10px', fontWeight: weight.medium,
        }
      }, (tpOpen ? '▾ ' : '▸ ') + t('kvg.belegFromTp')),

      tpOpen && React.createElement('div', {
        style: {
          display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px',
          padding: '8px 10px', background: palette.surface, borderRadius: radius.sm,
          border: '1px solid ' + palette.border,
        }
      },
        React.createElement('input', {
          type: 'number',
          inputMode: 'decimal',
          'aria-label': t('kvg.taxpunkte'),
          value: newTp,
          onChange: (e) => setNewTp(e.target.value),
          placeholder: t('kvg.taxpunkte'),
          style: {
            flex: '1 1 0', minWidth: 0, padding: '6px 8px', borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.up,
            color: palette.text, fontSize: text.sm, boxSizing: 'border-box',
          }
        }),
        React.createElement('span', {
          style: { fontSize: text.sm, color: palette.mid, whiteSpace: 'nowrap' }
        }, t('kvg.belegTpResult', { betrag: tpBetrag })),
        React.createElement('button', {
          onClick: () => { if (tpBetrag > 0) { setNewBetrag(String(tpBetrag)); setTpOpen(false); } },
          disabled: !(tpBetrag > 0),
          style: {
            padding: '6px 12px', borderRadius: radius.sm, border: 'none',
            background: tpBetrag > 0 ? palette.sand : palette.border,
            color: tpBetrag > 0 ? '#000' : palette.soft,
            fontSize: text.xs, fontWeight: weight.semi, fontFamily: 'inherit',
            cursor: tpBetrag > 0 ? 'pointer' : 'default', whiteSpace: 'nowrap',
          }
        }, t('kvg.belegTpApply'))
      ),

      React.createElement('button', {
        onClick: () => setNgOpen(!ngOpen),
        style: {
          background: 'none', border: 'none', color: palette.sand, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0',
          marginBottom: ngOpen ? '8px' : '10px', fontWeight: weight.medium,
        }
      }, (ngOpen ? '▾ ' : '▸ ') + t('kvg.belegNichtGedeckt')),

      ngOpen && React.createElement('div', {
        style: {
          marginBottom: '10px', padding: '8px 10px', background: palette.surface,
          borderRadius: radius.sm, border: '1px solid ' + palette.border,
        }
      },
        React.createElement('input', {
          type: 'number',
          inputMode: 'decimal',
          'aria-label': t('kvg.belegNichtGedeckt'),
          value: newNichtGedeckt,
          onChange: (e) => setNewNichtGedeckt(e.target.value),
          placeholder: 'CHF',
          style: {
            width: '100%', padding: '6px 8px', borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.up,
            color: palette.text, fontSize: text.sm, boxSizing: 'border-box', marginBottom: '6px',
          }
        }),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal }
        }, t('kvg.belegNichtGedecktHint'))
      ),

      React.createElement('button', {
        onClick: () => setNewEingereicht(!newEingereicht),
        'aria-pressed': newEingereicht ? 'true' : 'false',
        style: {
          background: 'none', border: 'none', fontFamily: 'inherit', fontSize: text.sm,
          padding: '4px 0', marginBottom: '8px', cursor: 'pointer', display: 'block', textAlign: 'left',
          color: newEingereicht ? (palette.sage || '#5a7a5a') : palette.mid,
          fontWeight: newEingereicht ? weight.medium : weight.normal,
        }
      }, (newEingereicht ? '✓ ' : '○ ') + t('kvg.belegSubmitted')),

      React.createElement('button', {
        onClick: addBeleg,
        disabled: !(Number(newBetrag) > 0),
        style: {
          width: '100%', padding: space.sm, borderRadius: radius.sm, border: 'none',
          background: Number(newBetrag) > 0 ? palette.sand : palette.border,
          color: Number(newBetrag) > 0 ? '#000' : palette.soft,
          fontSize: text.sm, fontWeight: weight.semi, fontFamily: 'inherit',
          cursor: Number(newBetrag) > 0 ? 'pointer' : 'default',
        }
      }, '+ ' + t('kvg.belegAdd'))
    ),

    React.createElement('div', {
      style: { padding: '14px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '16px' }
    },
      availableYears.length > 1 && React.createElement('div', {
        style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }
      },
        availableYears.map(y =>
          React.createElement('button', {
            key: y,
            onClick: () => setSelectedYear(y),
            'aria-pressed': y === selectedYear ? 'true' : 'false',
            style: {
              padding: '4px 10px', borderRadius: '12px', fontFamily: 'inherit', fontSize: text.xs, cursor: 'pointer',
              border: '1px solid ' + (y === selectedYear ? palette.sand + '40' : palette.border),
              background: y === selectedYear ? palette.sand + '25' : 'transparent',
              color: y === selectedYear ? palette.sand : palette.soft,
              fontWeight: y === selectedYear ? weight.medium : weight.normal,
            }
          }, String(y))
        )
      ),

      React.createElement('div', {
        style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '10px' }
      }, t('kvg.belegYearTitle', { year: selectedYear })),

      yearBelege.length === 0
        ? React.createElement('div', {
            style: { fontSize: text.sm, color: palette.soft, lineHeight: leading.normal }
          }, t('kvg.belegEmpty'))
        : React.createElement('div', null,
            yearBelege.map(b => {
              const offen = b.status === 'offen';
              const gold = palette.gold || '#c47a20';
              return React.createElement('div', {
                key: b.id,
                style: { padding: '8px 0', borderBottom: '1px solid ' + palette.border }
              },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }
                },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, fmtDatum(b.datum)),
                    offen && React.createElement('span', {
                      style: {
                        fontSize: text.xs, fontWeight: weight.medium, color: gold,
                        background: gold + '18', padding: '1px 7px', borderRadius: '8px',
                      }
                    }, t('kvg.belegOpen'))
                  ),
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                    React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium } }, 'CHF ' + (Number(b.betrag) || 0)),
                    React.createElement('button', {
                      onClick: () => removeBeleg(b.id),
                      'aria-label': t('kvg.belegRemove'),
                      style: {
                        background: 'none', border: 'none', color: palette.soft, cursor: 'pointer',
                        fontSize: '16px', lineHeight: 1, padding: '0 2px', fontFamily: 'inherit',
                      }
                    }, '×')
                  )
                ),
                offen && b.frist && React.createElement('div', {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '6px' }
                },
                  React.createElement('span', { style: { fontSize: text.xs, color: palette.soft } },
                    t('kvg.belegFrist') + ': ' + fmtDatum(b.frist)),
                  React.createElement('button', {
                    onClick: () => remindBeleg(b),
                    disabled: remindedIds.has(b.id),
                    style: {
                      background: 'none', border: 'none', fontFamily: 'inherit',
                      fontSize: text.xs, fontWeight: weight.medium, padding: '2px 0',
                      color: remindedIds.has(b.id) ? (palette.sage || '#5a7a5a') : palette.sand,
                      cursor: remindedIds.has(b.id) ? 'default' : 'pointer',
                    }
                  }, remindedIds.has(b.id) ? '✓ ' + t('kvg.belegReminded') : t('kvg.belegRemind'))
                ),
                b.nichtGedeckt > 0 && React.createElement('div', {
                  style: { fontSize: text.xs, color: palette.soft, marginTop: '4px' }
                }, t('kvg.belegNichtGedecktNote', { amount: 'CHF ' + b.nichtGedeckt })),
                React.createElement('button', {
                  onClick: () => toggleEingereicht(b.id),
                  'aria-pressed': b.eingereicht ? 'true' : 'false',
                  style: {
                    background: 'none', border: 'none', fontFamily: 'inherit', fontSize: text.xs,
                    padding: '2px 0', marginTop: '4px', cursor: 'pointer', display: 'block', textAlign: 'left',
                    color: b.eingereicht ? (palette.sage || '#5a7a5a') : palette.soft,
                    fontWeight: b.eingereicht ? weight.medium : weight.normal,
                  }
                }, (b.eingereicht ? '✓ ' : '○ ') + t('kvg.belegSubmitted'))
              );
            }),
            React.createElement('div', {
              style: { display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: text.sm }
            },
              React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, t('kvg.belegSum')),
              React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + kosten)
            )
          ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal, marginTop: '12px', paddingTop: '10px', borderTop: '1px solid ' + palette.border }
      }, 'ⓘ ' + t('kvg.belegRueckwirkend'))
    ),

    hasInput && React.createElement('div', {
      style: { padding: '14px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border }
    },
      statusMsg && React.createElement('div', {
        style: {
          padding: '10px 12px', background: statusMsg.color + '15',
          borderRadius: radius.sm, border: '1px solid ' + statusMsg.color + '30',
          fontSize: text.sm, color: statusMsg.color, marginBottom: '14px',
          lineHeight: leading.normal,
        }
      }, statusMsg.icon + ' ' + statusMsg.text),

      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.franchiseUsed')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + result.franchiseVerbraucht)
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.franchiseVerbraucht, result.franchise, palette.sand) })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.franchiseOpen') + ': CHF ' + result.franchiseOffen)
      ),

      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.selbstbehalt')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + Math.round(result.selbstbehalt))
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.selbstbehalt, result.selbstbehaltMax, palette.sage || '#5a7a5a') })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.selbstbehaltMax') + ': CHF ' + result.selbstbehaltMax)
      ),

      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '14px' }
      }),

      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.eigenanteil')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.gold || '#c47a20' }
        }, 'CHF ' + Math.round(result.eigenanteil))
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.kasseZahlt')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.sage || '#5a7a5a' }
        }, 'CHF ' + Math.round(result.kasseZahlt))
      )
    )
  );
};

// ─── Rechnung Tab ──────────────────────────────────────────
const RechnungTab = ({ palette, t, data }) => {
  const canton = data.basis?.canton || '';
  const [tp, setTp] = useState('');
  const [selCanton, setSelCanton] = useState(canton);

  const cantons = Object.keys(TAXPUNKTWERT).sort();
  const result = tp ? berechneArztrechnung(Number(tp), selCanton) : null;

  return React.createElement('div', null,
    React.createElement('div', {
      style: { padding: '14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '16px' }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
      }, t('kvg.rechnungExplain')),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.taxpunkte')),
      React.createElement('input', {
        type: 'number',
        inputMode: 'decimal',
        value: tp,
        onChange: (e) => setTp(e.target.value),
        placeholder: '0',
        style: {
          width: '100%', padding: space.sm, borderRadius: radius.sm,
          border: '1px solid ' + palette.border, background: palette.surface,
          color: palette.text, fontSize: text.sm, boxSizing: 'border-box',
          marginBottom: '12px',
        }
      }),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('finanzUebersicht.canton')),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('select', {
          value: selCanton,
          onChange: (e) => setSelCanton(e.target.value),
          style: {
            width: '100%', padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
            appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px',
            cursor: 'pointer',
          }
        },
          React.createElement('option', { value: '' }, t('common.select')),
          cantons.map(c => React.createElement('option', { key: c, value: c }, c + ' (' + TAXPUNKTWERT[c].toFixed(2) + ')'))
        ),
        React.createElement('div', {
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, '▾')
      )
    ),

    result && React.createElement('div', {
      style: { padding: '14px', background: palette.sand + '10', borderRadius: radius.sm, border: '1px solid ' + palette.sand + '25' }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.taxpunkte')),
        React.createElement('span', { style: { fontWeight: weight.semi } }, result.taxpunkte)
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.taxpunktwert')),
        React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + result.taxpunktwert.toFixed(2))
      ),
      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '8px' }
      }),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.body }
      },
        React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, t('kvg.berechneterBetrag')),
        React.createElement('span', { style: { fontWeight: weight.semi, color: palette.sand } }, 'CHF ' + result.betrag.toFixed(2))
      ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: '6px' }
      }, 'ⓘ ' + t('kvg.tpwNote'))
    )
  );
};

// ─── Main Component ────────────────────────────────────────
export const KVGLeistungen = ({ palette, t, data, onUpdateData, initialTab, onNavigate }) => {
  const [tab, setTab] = useState(initialTab || 'katalog');
  const [filterCat, setFilterCat] = useState('all');

  const catLabels = {
    all: t('kvg.allCategories'),
    arzt: t('kvg.catArzt'),
    vorsorge: t('kvg.catVorsorge'),
    labor: t('kvg.catLabor'),
    medi: t('kvg.catMedi'),
    spital: t('kvg.catSpital'),
    dental: t('kvg.catDental'),
    therapie: t('kvg.catTherapie'),
    divers: t('kvg.catDivers'),
  };

  return React.createElement('div', { style: { maxWidth: '580px' } },

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '16px',
      }
    },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'health', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('kvg.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal }
      }, t('kvg.subtitle'))
    ),

    React.createElement('div', {
      style: {
        display: 'flex', gap: '4px', background: palette.up, borderRadius: radius.sm,
        padding: '4px', marginBottom: '16px', overflowX: 'auto',
      }
    },
      React.createElement(TabButton, { active: tab === 'katalog', label: t('kvg.tabKatalog'), onClick: () => setTab('katalog'), palette }),
      React.createElement(TabButton, { active: tab === 'franchise', label: t('kvg.tabFranchise'), onClick: () => setTab('franchise'), palette }),
      React.createElement(TabButton, { active: tab === 'rechnung', label: t('kvg.tabRechnung'), onClick: () => setTab('rechnung'), palette })
    ),

    tab === 'katalog' && React.createElement(React.Fragment, null,
      React.createElement('div', {
        style: {
          display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px',
        }
      },
        React.createElement(CatButton, { active: filterCat === 'all', label: catLabels.all, onClick: () => setFilterCat('all'), palette }),
        KVG_CATEGORIES.map(cat =>
          React.createElement(CatButton, { key: cat, active: filterCat === cat, label: catLabels[cat], onClick: () => setFilterCat(cat), palette })
        )
      ),
      React.createElement(KatalogTab, { palette, t, filterCat })
    ),

    tab === 'franchise' && React.createElement(FranchiseTab, { palette, t, data, onUpdateData, onNavigate }),
    tab === 'rechnung' && React.createElement(RechnungTab, { palette, t, data }),

    React.createElement('div', {
      style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
    },
      'ⓘ ' + t('kvg.disclaimer'),
      React.createElement('br'),
      'ⓘ ', renderSource(t('kvg.source')), ' · v' + KVG_DATA_VERSION
    )
  );
};

export default KVGLeistungen;
