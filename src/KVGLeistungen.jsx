import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen, erledigtZeichen, aufklappZeichen } from './IconSystem.jsx';
import { ExternerLink, visuallyHiddenStyle } from './components/ExternerLink.jsx';
import { text, weight, space, radius, leading, duration, ease } from './config/tokens.js';
import { KVG_KATALOG, KVG_CATEGORIES, VORSORGE_EMPFEHLUNGEN, KVG_DETAILS, VORSORGE_INTERVAL_MONATE, MAMMO_KANTONE_OHNE_PROGRAMM, MAMMO_GEO_STAND, MAMMO_GEO_URL, FRANCHISE_STUFEN, berechneFranchise, berechneArztrechnung, TAXPUNKTWERT, KVG_DATA_VERSION, TAXPUNKTWERT_DATA_VERSION, TAXPUNKTWERT_UNBELEGT_2026, TAXPUNKTWERT_QUELLEN, taxpunktwertFuer } from './data/kvgLeistungen.js';
import { addReminder, loadReminders } from './utils/reminders.js';
import { loadVorsorgeDates, saveVorsorgeDate } from './utils/vorsorge.js';
import { renderSource } from './utils/renderSource.js';
import { getCantonName } from './config/cantonalData.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { StatusForm } from './components/StatusForm.jsx';
import { inDays } from './utils/helpers.js';
import { betrag } from './utils/geld.js';

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
    ? React.createElement(StatusForm, {
        form: status === 'covered' ? 'voll' : status === 'limited' ? 'kern' : 'hohl',
        color: dot,
      })
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
      color: active ? palette.sandDeep : palette.soft,
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
const KatalogRow = ({ palette, t, item, isLast, canton }) => {
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
          style: { fontSize: text.xs, color: palette.sandDeep, marginTop: '4px', fontWeight: weight.medium }
        }, hinweisZeichen(), t('kvg.' + item.intervalKey)),
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
              background: 'none', border: 'none', color: palette.sandDeep, cursor: 'pointer',
              fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0', fontWeight: weight.medium,
              textAlign: 'left',
            }
          }, React.createElement('span', { 'aria-hidden': 'true' }, aufklappZeichen(open)), (emp
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
                  fontSize: text.xs, color: palette.sageDeep,
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
              // Das Feld war unbenannt: sichtbares Label ohne Verbindung, kein
              // aria-label. Die id traegt item.key, weil dieser Block je Leistung
              // einmal gerendert wird — eine feste id waere mehrfach da.
              React.createElement('label', {
                htmlFor: 'kvg-lastvisit-' + item.key,
                style: { display: 'block', color: palette.mid, marginBottom: '3px' }
              }, t('kvg.lastVisitLabel')),
              React.createElement('input', {
                id: 'kvg-lastvisit-' + item.key,
                type: 'date',
                value: lastVisit || '',
                max: inDays(0),
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
                    ? React.createElement('div', { style: { color: palette.sageDeep || '#4A6657', marginTop: '4px' } }, hinweisZeichen('check'), t('kvg.reminderSaved'))
                    : React.createElement('button', {
                        type: 'button',
                        onClick: () => {
                          const r = addReminder({ title: t('kvg.' + item.key), dueDate: inDays(0), category: 'health' });
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
            ),
            // Faden 3-II/3: geografische Programm-Realität — ruhige Orientierung, nur
            // Mammografie. Belegte „ohne Programm"-Liste (datengetrieben) + Live-Link,
            // da sich der Stand ändert. Personalisiert, wenn der Wohnkanton bekannt ist.
            item.key === 'mammografie' && React.createElement('div', {
              style: { marginTop: '8px', paddingTop: '8px', borderTop: '1px solid ' + palette.border }
            },
              React.createElement('div', {
                style: { fontWeight: weight.semi, color: palette.text, marginBottom: '3px' }
              }, t('kvg.mammoGeoTitle')),
              React.createElement('div', { style: { color: palette.mid } }, t('kvg.mammoGeoNote')),
              MAMMO_KANTONE_OHNE_PROGRAMM.includes(canton) && React.createElement('div', {
                style: { marginTop: '4px', color: palette.text, fontWeight: weight.medium }
              }, t('kvg.mammoGeoYourCantonNo', { canton: getCantonName(canton, t) })),
              React.createElement('div', { style: { marginTop: '4px', color: palette.mid } },
                t('kvg.mammoGeoOhne', { stand: MAMMO_GEO_STAND }) + ' ' + MAMMO_KANTONE_OHNE_PROGRAMM.map(c => getCantonName(c, t)).join(', ')),
              React.createElement('div', { style: { marginTop: '2px', color: palette.mid } }, t('kvg.mammoGeoWandel')),
              React.createElement('div', { style: { marginTop: '4px', color: palette.soft } }, t('kvg.mammoGeoTardoc')),
              React.createElement('div', { style: { marginTop: '4px', color: palette.soft } },
                t('kvg.mammoGeoCheck') + ' ',
                React.createElement(ExternerLink, {
                  t, href: MAMMO_GEO_URL,
                  style: { color: palette.sandDeep, textDecoration: 'underline' }
                }, t('kvg.mammoGeoLinkLabel'))
              )
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

const KatalogTab = ({ palette, t, filterCat, canton }) => {
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
          background: 'none', border: 'none', color: palette.sandDeep, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0', fontWeight: weight.medium,
          textAlign: 'left',
        }
      }, React.createElement('span', { 'aria-hidden': 'true' }, aufklappZeichen(evidenceOpen)), t('kvg.evidenceToggle')),
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
            key: item.key, palette, t, item, isLast: idx === catItems.length - 1, canton,
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
  const reminderTitle = (b) => t('kvg.belegReminderTitle', { betrag: betrag(Number(b.betrag) || 0, { hoechstens: 2 }) });
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
  // K103: ohne bekannten Wohnkanton keine Zahl (früher stiller Rückfall auf 0.89).
  const tpw = taxpunktwertFuer(canton);
  const tpBetrag = newTp && tpw !== null ? Math.round(Number(newTp) * tpw * 100) / 100 : 0;

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
      ? { text: t('kvg.selbstbehaltDone'), color: palette.sageDeep || '#4A6657', icon: 'check' }
    : result.franchiseOffen > 0
      ? { text: t('kvg.statusInFranchise', { offen: result.franchiseOffen }), color: palette.sandDeep, icon: 'info' }
      : { text: t('kvg.statusInSelbstbehalt', { sbOffen: Math.round(result.selbstbehaltMax - result.selbstbehalt) }), color: palette.goldDeep || '#c47a20', icon: 'info' };

  const barStyle = (_value, _max, _color) => ({
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
        htmlFor: 'kvg-franchise',
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.franchiseLabel')),
      React.createElement('div', { style: { position: 'relative', marginBottom: '12px' } },
        React.createElement('select', {
          id: 'kvg-franchise',
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
            React.createElement('option', { key: f, value: f }, betrag(f, { hoechstens: 2 }))
          )
        ),
        React.createElement('div', {
          'aria-hidden': 'true', // Deko-Pfeil des Auswahlfelds — nicht vorlesen
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, aufklappZeichen(true))
      ),

      // Brücke zum Franchise-Optimierer (Prämien-Orientierung): dort steht die
      // belegte Ersparnis-/Break-even-Rechnung für die eigene Kasse. Keine Waisen.
      onNavigate && React.createElement('button', {
        onClick: () => onNavigate('praemien'),
        style: {
          display: 'block', width: '100%', textAlign: 'start', background: 'none',
          border: 'none', padding: '2px 0 4px 0', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.medium,
        }
      }, t('kvg.franchiseOptimizerLink')),

      React.createElement('div', {
        style: { height: '1px', background: palette.border, margin: '14px 0' }
      }),
      // War ein <label> ohne Feld — das beschriftet nichts, ist nicht anklickbar
      // und wird von Screenreadern nicht als Bezug gelesen. Es ist eine
      // Abschnitts-Beschriftung, also ein div.
      React.createElement('div', {
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
              color: newStatus === s ? palette.sandDeep : palette.mid,
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
        'aria-expanded': tpOpen,
        style: {
          background: 'none', border: 'none', color: palette.sandDeep, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0',
          marginBottom: tpOpen ? '8px' : '10px', fontWeight: weight.medium,
        }
      }, React.createElement('span', { 'aria-hidden': 'true' }, aufklappZeichen(tpOpen)), t('kvg.belegFromTp')),

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
        tpw !== null && React.createElement('span', {
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
      // Deploy-Gate 0.1.37 (1+2): Versicherergruppe bzw. «Stand 2025» sichtbar, bevor der Betrag
      // als Beleg übernommen wird.
      tpOpen && tpw !== null && React.createElement('div', { style: { marginTop: '-6px', marginBottom: '10px' } },
        React.createElement(TpwErgebnisHinweise, { palette, t, canton })
      ),
      tpOpen && tpw === null && React.createElement('div', {
        'data-testid': 'tpw-ohne-kanton-profil',
        style: { fontSize: text.xs, color: palette.soft, marginTop: '-4px', marginBottom: '10px', lineHeight: leading.normal }
      }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvg.tpwOhneKantonProfil'))),

      React.createElement('button', {
        onClick: () => setNgOpen(!ngOpen),
        'aria-expanded': ngOpen,
        style: {
          background: 'none', border: 'none', color: palette.sandDeep, cursor: 'pointer',
          fontSize: text.xs, fontFamily: 'inherit', padding: '2px 0',
          marginBottom: ngOpen ? '8px' : '10px', fontWeight: weight.medium,
        }
      }, React.createElement('span', { 'aria-hidden': 'true' }, aufklappZeichen(ngOpen)), t('kvg.belegNichtGedeckt')),

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
          color: newEingereicht ? (palette.sageDeep || '#4A6657') : palette.mid, // Text: sageDeep statt sage (AA)
          fontWeight: newEingereicht ? weight.medium : weight.normal,
        }
      }, erledigtZeichen(newEingereicht, t('kvg.belegSubmitted'), 'kaestchen')),

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
              color: y === selectedYear ? palette.sandDeep : palette.soft,
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
                    React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium } }, betrag(Number(b.betrag) || 0, { hoechstens: 2 })),
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
                      color: remindedIds.has(b.id) ? (palette.sageDeep || '#4A6657') : palette.sandDeep,
                      cursor: remindedIds.has(b.id) ? 'default' : 'pointer',
                    }
                  }, erledigtZeichen(remindedIds.has(b.id), remindedIds.has(b.id) ? t('kvg.belegReminded') : t('kvg.belegRemind')))
                ),
                b.nichtGedeckt > 0 && React.createElement('div', {
                  style: { fontSize: text.xs, color: palette.soft, marginTop: '4px' }
                }, t('kvg.belegNichtGedecktNote', { amount: betrag(b.nichtGedeckt, { hoechstens: 2 }) })),
                React.createElement('button', {
                  onClick: () => toggleEingereicht(b.id),
                  'aria-pressed': b.eingereicht ? 'true' : 'false',
                  style: {
                    background: 'none', border: 'none', fontFamily: 'inherit', fontSize: text.xs,
                    padding: '2px 0', marginTop: '4px', cursor: 'pointer', display: 'block', textAlign: 'left',
                    color: b.eingereicht ? (palette.sageDeep || '#4A6657') : palette.soft,
                    fontWeight: b.eingereicht ? weight.medium : weight.normal,
                  }
                }, erledigtZeichen(b.eingereicht, t('kvg.belegSubmitted'), 'kaestchen'))
              );
            }),
            React.createElement('div', {
              style: { display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: text.sm }
            },
              React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, t('kvg.belegSum')),
              React.createElement('span', { style: { fontWeight: weight.semi } }, betrag(kosten, { hoechstens: 2 }))
            )
          ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal, marginTop: '12px', paddingTop: '10px', borderTop: '1px solid ' + palette.border }
      }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvg.belegRueckwirkend')))
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
      }, hinweisZeichen(statusMsg.icon), statusMsg.text),

      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.franchiseUsed')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, betrag(result.franchiseVerbraucht, { hoechstens: 2 }))
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.franchiseVerbraucht, result.franchise, palette.sand) })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.franchiseOpen') + ': ' + betrag(result.franchiseOffen, { hoechstens: 2 }))
      ),

      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.selbstbehalt')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, betrag(result.selbstbehalt))
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.selbstbehalt, result.selbstbehaltMax, palette.sage || '#5a7a5a') })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.selbstbehaltMax') + ': ' + betrag(result.selbstbehaltMax, { hoechstens: 2 }))
      ),

      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '14px' }
      }),

      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.eigenanteil')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.goldDeep || '#c47a20' }
        }, betrag(result.eigenanteil))
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.kasseZahlt')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.sageDeep || '#5a7a5a' }
        }, betrag(result.kasseZahlt))
      )
    )
  );
};

// ─── Rechnung Tab ──────────────────────────────────────────
const RechnungTab = ({ palette, t, data }) => {
  const canton = data.basis?.canton || '';
  const [tp, setTp] = useState('');
  // K103: unbekannter Profil-Kanton → Auswahl leer statt eines Werts, den die Liste nicht kennt.
  const [selCanton, setSelCanton] = useState(taxpunktwertFuer(canton) !== null ? canton : '');

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
        htmlFor: 'kvg-taxpunkte',
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.taxpunkte')),
      React.createElement('input', {
        id: 'kvg-taxpunkte',
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
        htmlFor: 'kvg-kanton',
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('finanzUebersicht.canton')),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('select', {
          id: 'kvg-kanton',
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
          'aria-hidden': 'true', // Deko-Pfeil des Auswahlfelds — nicht vorlesen
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, aufklappZeichen(true))
      )
    ),

    // K103: Taxpunkte eingetragen, aber kein Kanton gewählt → keine Zahl, ein ruhiger Hinweis.
    tp && !result && React.createElement('div', {
      'data-testid': 'tpw-ohne-kanton',
      style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
    }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvg.tpwOhneKanton'))),

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
        React.createElement('span', { style: { fontWeight: weight.semi } }, betrag(result.taxpunktwert, { stellen: 2 }))
      ),
      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '8px' }
      }),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.body }
      },
        React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, t('kvg.berechneterBetrag')),
        React.createElement('span', { style: { fontWeight: weight.semi, color: palette.sandDeep } }, betrag(result.betrag, { stellen: 2 }))
      ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: '6px' }
      }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvg.tpwNote', { kantone: TAXPUNKTWERT_UNBELEGT_2026.join(', ') }))),
      // Versicherergruppe, Stand 2025 bzw. Datenstand — dieselben Zeilen wie im Franchise-Tab.
      React.createElement(TpwErgebnisHinweise, { palette, t, canton: selCanton, mitDatenstand: true })
    ),

    // E41: die Quelle je Kanton, verlinkt. Kantone ohne belegten Wert 2026 haben keinen Link
    // (die Fussnote kvg.tpwNote nennt sie).
    React.createElement(TpwQuellen, { palette, t })
  );
};

// Deploy-Gate 0.1.37 (1+2): ruhige Zeilen direkt beim berechneten Taxpunkt-Ergebnis — im Tab
// «Arztrechnung» und in der Umrechnung im Franchise-Tab (dort vor dem Übernehmen als Beleg).
//   · Gilt der Beleg nur für eine Versicherergruppe (TAXPUNKTWERT_QUELLEN.gruppe), steht sie hier,
//     nicht erst im Linktext der Quellenliste. SZ: auch der Wert für CSS und HSK ist belegt.
//   · K27/R4: die neun Kantone ohne Beleg 2026 zeigen «Stand 2025, provisorisch»; sonst — nur im
//     Tab «Arztrechnung» (mitDatenstand) — das Prüfdatum der belegten Werte.
export const TpwErgebnisHinweise = ({ palette, t, canton, mitDatenstand = false }) => {
  const q = Object.prototype.hasOwnProperty.call(TAXPUNKTWERT_QUELLEN, canton) ? TAXPUNKTWERT_QUELLEN[canton] : null;
  const gruppe = q && q.gruppe
    ? (q.zusatz === 'SZ' ? t('kvg.tpwErgebnisGruppeSZ') : t('kvg.tpwErgebnisGruppe', { gruppe: q.gruppe }))
    : null;
  const unbelegt = TAXPUNKTWERT_UNBELEGT_2026.includes(canton);
  const stand = unbelegt
    ? t('kvg.tpwStandUnbelegt', { kanton: canton })
    : mitDatenstand ? t('kvg.tpwDataVersion') + ': ' + TAXPUNKTWERT_DATA_VERSION : null;
  const zeile = { fontSize: text.xs, color: palette.soft, marginTop: '2px', lineHeight: leading.normal };
  return React.createElement(React.Fragment, null,
    gruppe && React.createElement('div', { 'data-testid': 'tpw-gruppe', style: zeile }, hinweisZeichen(), gruppe),
    stand && React.createElement('div', { style: zeile }, hinweisZeichen(), stand)
  );
};

// K88/K89: Zusatz im Linktext — Versicherergruppe (zusatz, Muster K92) bzw. «Ärztegesellschaften»,
// dazu Stand-Datum der Übersicht (stand) und Seiten im Amtsblatt (seiten).
const quelleZusatz = (q, t) => {
  const teile = [];
  if (q.zusatz) teile.push(t('kvg.tpwQuelle' + q.zusatz));
  else if (q.art === 'tarifpartner') teile.push(t('kvg.tpwQuelleTarifpartner'));
  if (q.stand) teile.push(t('kvg.tpwQuelleStand', { datum: q.stand }));
  if (q.seiten) teile.push(t('kvg.tpwQuelleSeiten', { seiten: q.seiten }));
  return teile.length ? ' (' + teile.join('; ') + ')' : '';
};

export const TpwQuellen = ({ palette, t }) =>
  React.createElement('div', {
    'data-testid': 'tpw-quellen',
    style: { fontSize: text.xs, color: palette.mid, marginTop: '12px', lineHeight: leading.normal }
  },
    React.createElement('div', { style: { marginBottom: '4px' } }, t('kvg.tpwQuellenTitel')),
    React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0 6px' } },
      Object.keys(TAXPUNKTWERT_QUELLEN).sort().map((c) => {
        const q = TAXPUNKTWERT_QUELLEN[c];
        return React.createElement('li', { key: c },
          React.createElement(ExternerLink, {
            t, href: q.url,
            style: { color: palette.sandDeep, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 6px' }
          },
            React.createElement('span', { style: visuallyHiddenStyle }, t('kvg.tpwQuelleVor') + ' '),
            c + quelleZusatz(q, t)
          )
        );
      })
    )
  );

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
      React.createElement(KatalogTab, { palette, t, filterCat, canton: data.basis?.canton || '' })
    ),

    tab === 'franchise' && React.createElement(FranchiseTab, { palette, t, data, onUpdateData, onNavigate }),
    tab === 'rechnung' && React.createElement(RechnungTab, { palette, t, data }),

    React.createElement('div', {
      style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
    },
      hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvg.disclaimer')),
      React.createElement('br'),
      hinweisZeichen(), renderSource(t('kvg.source'), null, t), ' · v' + KVG_DATA_VERSION
    )
  );
};

export default KVGLeistungen;
