import React, { useState, useEffect } from 'react';
import { useIsMobile } from './hooks/useIsMobile.js';
import { PageTitle } from './components/Heading.jsx';
import { getLetterTemplates, generateLetter, getFristInfo, getJobOptions, briefCanRender, BRIEF_ANGABEN, leseAngaben, angabenEingetippt, feldSichtbar, rechtsvorschlagFrist, klageFrist336b } from './briefGenerator.js';
import { istVorbei } from './utils/fristen.js';
import { formatDE } from './utils/helpers.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text as textTokens, weight, radius , leading , space, ease, duration } from './config/tokens.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { openPrintWindow } from './utils/helpers.js';
import { addReminder } from './utils/reminders.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { zahl } from './utils/geld.js';
import { Brotkrume } from './components/Brotkrume.jsx';

// Brieftypen mit einer Frist, die in den Kalender gelegt werden kann.
const FRIST_TEMPLATES = ['wageClaim', 'unpaidWage'];
// Brieftypen, die sich auf eine konkrete Anstellung beziehen (Haupt- oder Nebenerwerb).
const JOB_TEMPLATES = ['wageClaim', 'unpaidWage', 'workReference', 'dismissalObjection'];

// ─── Lebensereignis-Briefe: Hinweise und Angaben (26.09.2026) ───
// Die Hinweise stehen VOR dem Formular: bei Rechtsvorschlag und Todesfall ist die Frist
// bzw. die Erbschafts-Falle wichtiger als der Brief selbst. Gold wie die Fristen in AsylView.
const hinweisBox = (palette, title, zeilen, icon = 'info') => React.createElement('div', {
  role: 'note',
  style: {
    padding: '14px 16px', background: palette.gold + '1A', border: '1px solid ' + palette.gold + '66',
    borderRadius: radius.sm, marginBottom: space.md,
  },
},
  React.createElement('div', {
    style: { fontWeight: weight.semi, fontSize: textTokens.body, color: palette.goldDeep, marginBottom: space.xs },
  }, hinweisZeichen(icon), title),
  zeilen.filter(Boolean).map((z, i) => React.createElement('p', {
    key: i,
    style: { fontSize: textTokens.sm, color: palette.text, lineHeight: leading.normal, margin: i ? space.xs + 'px 0 0' : 0, fontWeight: z.stark ? weight.semi : undefined },
  }, z.text || z)),
);

function lebensereignisHinweis(selected, a, palette, t) {
  if (selected === 'debtObjection') {
    const k = 'briefe.debtObjection.frist.';
    const frist = rechtsvorschlagFrist(a.zustelldatum);
    const datum = frist
      ? { text: t(istVorbei(frist) ? k + 'vorbei' : k + 'datum', { date: formatDE(frist) }), stark: true }
      : t(k + 'ohne');
    return hinweisBox(palette, t(k + 'title'), [t(k + 'text'), datum, t(k + 'muendlich'), t(k + 'post')], 'calendar');
  }
  if (selected === 'dismissalObjection') {
    const k = 'briefe.dismissalObjection.frist.';
    const klage = klageFrist336b(a.ende);
    return hinweisBox(palette, t(k + 'title'), [
      t(k + 'einsprache'),
      a.ende && klage ? { text: t(k + 'einspracheDatum', { date: formatDE(a.ende) }), stark: true } : null,
      t(k + 'klage'),
      klage ? { text: t(k + 'klageDatum', { date: formatDE(klage) }), stark: true } : null,
      t(k + 'fristlos'),
      t(k + 'beratung'),
    ], 'calendar');
  }
  if (selected === 'deathNotice') {
    const k = 'briefe.deathNotice.erbe.';
    return hinweisBox(palette, t(k + 'title'), [t(k + 'text'), { text: t(k + 'brief'), stark: true }, t(k + 'miete')]);
  }
  if (selected === 'workReference') {
    return hinweisBox(palette, t('briefe.workReference.title'), [t('briefe.workReference.hinweis')]);
  }
  return null;
}

// Angaben-Formular aus BRIEF_ANGABEN — dieselbe Liste, aus der der Generator liest.
function angabenFormular(selected, roh, setRoh, palette, t, isMobile) {
  const felder = BRIEF_ANGABEN[selected];
  if (!felder) return null;
  const a = leseAngaben(selected, roh);
  const set = (key, v) => setRoh(r => ({ ...r, [key]: v }));
  const base = (f) => `briefe.${selected}.felder.${f.key}`;
  const labelStil = { display: 'block', fontSize: textTokens.sm, color: palette.text, fontWeight: weight.medium, marginBottom: space.xs };
  const inputStil = {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface, color: palette.text,
    fontSize: textTokens.sm, fontFamily: 'inherit',
  };
  const zeile = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer', color: palette.text, ...(isMobile ? { minHeight: '44px' } : {}) };
  const sichtbar = felder.filter(f => feldSichtbar(f, a));
  return React.createElement('div', {
    style: { padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, marginBottom: space.md },
  },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: textTokens.body, color: palette.text, marginBottom: space.xs } }, t('briefe.angaben.title')),
    React.createElement('div', { style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm } }, t('briefe.angaben.intro')),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md } },
      sichtbar.map(f => {
        const id = `brief-${selected}-${f.key}`;
        const hilfeKey = base(f) + '.hilfe';
        const hilfe = t(hilfeKey) !== hilfeKey ? React.createElement('div', { id: id + '-hilfe', style: { fontSize: textTokens.xs, color: palette.mid, lineHeight: leading.normal, marginTop: space.xs } }, t(hilfeKey)) : null;
        if (f.type === 'wahl') {
          return React.createElement('fieldset', { key: f.key, style: { border: 'none', padding: 0, margin: 0 } },
            React.createElement('legend', { style: { ...labelStil, padding: 0 } }, t(base(f) + '.label')),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
              f.optionen.map(o => React.createElement('label', { key: o, style: zeile },
                React.createElement('input', { type: 'radio', name: id, checked: a[f.key] === o, onChange: () => set(f.key, o), style: { flexShrink: 0 } }),
                React.createElement('span', { style: { color: palette.text } }, t(base(f) + '.' + o))
              ))
            )
          );
        }
        if (f.type === 'ja') {
          return React.createElement('label', { key: f.key, style: { ...zeile, alignItems: 'flex-start' } },
            React.createElement('input', { type: 'checkbox', checked: a[f.key], onChange: (e) => set(f.key, e.target.checked), style: { marginTop: '3px', flexShrink: 0 } }),
            React.createElement('span', { style: { color: palette.text } }, t(base(f) + '.label'))
          );
        }
        return React.createElement('div', { key: f.key },
          React.createElement('label', { htmlFor: id, style: labelStil }, t(base(f) + '.label')),
          React.createElement('input', {
            id,
            type: f.type === 'date' ? 'date' : 'text',
            inputMode: f.type === 'betrag' ? 'decimal' : undefined,
            value: roh[f.key] == null ? '' : String(roh[f.key]),
            onChange: (e) => set(f.key, e.target.value),
            'aria-describedby': hilfe ? id + '-hilfe' : undefined,
            autoComplete: 'off',
            style: inputStil,
          }),
          hilfe,
          // Betrag: zeigen, was im Brief steht — eine falsch gelesene Zahl fiele sonst erst
          // beim Betreibungsamt auf (Fach-Prüfer 26.09.2026).
          f.type === 'betrag' && String(roh[f.key] == null ? '' : roh[f.key]).trim() !== '' && React.createElement('div', {
            'aria-live': 'polite',
            style: { fontSize: textTokens.xs, color: a[f.key] > 0 ? palette.text : palette.goldDeep, lineHeight: leading.normal, marginTop: space.xs, fontWeight: weight.medium },
          }, a[f.key] > 0 ? t('briefe.angaben.betragErkannt', { amount: zahl(a[f.key], { stellen: Number.isInteger(a[f.key]) ? 0 : 2 }) }) : t('briefe.angaben.betragUnklar'))
        );
      })
    )
  );
}
// FIX A: getrennte Reminder-Notiz je Weg — wageClaim → Kontrollstelle,
// unpaidWage → Schlichtungsbehörde/Arbeitsgericht (nicht dieselbe Stelle).
const REMINDER_NOTES_KEY = { wageClaim: 'briefe.wageReminder.notesWageClaim', unpaidWage: 'briefe.wageReminder.notesUnpaid' };

// ISO-Datum → TT.MM.JJJJ für die Anzeige in der Beleg-Auswahl.
const fmtDate = (iso) => {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso);
};
const fmtAmount = (n) => {
  const num = Number(n);
  return isFinite(num) ? zahl(num, { hoechstens: 2 }) : String(n);
};

const BriefGenerator = ({ palette, t, data, onNavigate, initialTemplate }) => {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(initialTemplate || null);
  const [preview, setPreview] = useState(false);
  const [printed, setPrinted] = useState(false);
  // Frist in den Kalender gelegt (ruhige Bestätigung statt Doppel-Anlage).
  const [reminderAdded, setReminderAdded] = useState(false);
  // Export-Vorschau (K3): vor dem Öffnen zeigen, welche Angaben im Brief stehen.
  const [exportVorschau, setExportVorschau] = useState(false);

  // Um welche Anstellung geht es? Nur nötig, wenn ein Nebenerwerb erfasst ist —
  // sonst bleibt es bei der Hauptanstellung und die Auswahl erscheint gar nicht.
  const [jobKey, setJobKey] = useState('main');

  // Kommt der Aufruf vom Befund („→ nächster Schritt"), ist eine Vorlage vorgewählt.
  useEffect(() => {
    if (initialTemplate) { setSelected(initialTemplate); setPreview(false); setPrinted(false); setReminderAdded(false); }
  }, [initialTemplate]);

  // Vorlagenwechsel setzt die Anstellungs-Wahl zurück — sonst trüge ein neuer Brief
  // stillschweigend die Wahl des vorherigen.
  useEffect(() => { setJobKey('main'); }, [selected]);
  // Eingetippte Angaben der Lebensereignis-Briefe — nur im Speicher dieser Ansicht, nie
  // gespeichert. Ein Vorlagenwechsel leert sie (sonst trüge ein neuer Brief alte Nummern).
  const [angaben, setAngaben] = useState({});
  useEffect(() => { setAngaben({}); }, [selected]);
  // Für den Reklamationsbrief: vom Nutzer gewählte Belege (kein Auto-Raten).
  const [belegIds, setBelegIds] = useState([]);
  // Geführter „was stimmt nicht"-Schritt: gewählte Beanstandungsgründe.
  const [reasons, setReasons] = useState([]);
  const REKLAMATION_GRUENDE = ['nichtErhalten', 'doppelt', 'falscherBetrag', 'franchiseSelbstbehalt', 'nichtGedeckt', 'falschePerson'];

  const templates = getLetterTemplates(t, data);
  const selectedTmpl = templates.find(tmpl => tmpl.key === selected);

  const jobOptions = getJobOptions(data);
  const kkBelege = Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const reklamationBelege = selected === 'kkReklamation' ? kkBelege.filter(b => belegIds.includes(b.id)) : [];

  const handlePrint = () => {
    // `briefCanRender`: eine ruhende Vorlage (WAGECLAIM_BEREIT=false) wird nicht gedruckt,
    // auch nicht über einen Deep-Link auf `selected` (Predeploy-Runde 8, dritte Prüfung).
    if (!selected || !briefCanRender(selected)) return;
    const html = generateLetter(selected, data, t, { belege: reklamationBelege, reasons, job: jobKey, angaben });
    openPrintWindow(html);
    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    setPrinted(true);
  };

  // Frist-Datum des gewählten Brieftyps (nur Lohn-Briefe) — dieselbe Quelle wie im Brieftext.
  const frist = FRIST_TEMPLATES.includes(selected) ? getFristInfo(selected) : null;

  const handleAddReminder = () => {
    if (!frist) return;
    const r = addReminder({
      title: t('briefe.' + selected + '.reminderTitle'),
      dueDate: frist.iso,
      category: 'work',
      recurrence: 'once',
      notes: t(REMINDER_NOTES_KEY[selected]),
    });
    if (r) setReminderAdded(true);
  };

  // Vorschau nur für Vorlagen, die auch angeboten werden dürfen — sonst rendert ein
  // Deep-Link auf 'wageClaim' den ruhenden Anschuldigungsbrief (Predeploy-Runde 8, dritte Prüfung).
  const previewHtml = (selected && briefCanRender(selected)) ? generateLetter(selected, data, t, { belege: reklamationBelege, reasons, job: jobKey, angaben }) : '';

  return React.createElement('div', {
    style: { maxWidth: '720px', margin: '0 auto' }
  },
    // Ein Weg zurück: die Brotkrume (Entscheid 25.09.2026) statt eines eigenen Zurück-Knopfs.
    React.createElement(Brotkrume, { palette, t, view: 'briefe', onNavigate }),

    // Title
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('briefe.title')),

    React.createElement('p', {
      style: { fontSize: textTokens.sm, color: palette.mid, marginBottom: '20px', lineHeight: '1.6' }
    }, t('briefe.intro')),

    // Template cards
    React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }
    },
      templates.map(tmpl => React.createElement('button', {
        key: tmpl.key,
        onClick: () => { setSelected(tmpl.key); setPreview(false); setPrinted(false); setBelegIds([]); setReasons([]); setReminderAdded(false); setExportVorschau(false); },
        style: {
          padding: '14px 16px', background: selected === tmpl.key ? palette.up : palette.surface,
          border: '1px solid ' + (selected === tmpl.key ? palette.sage : palette.border),
          borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left',
          // Buttons erben color NICHT (UA-Reset auf schwarz) → im Dark Mode war der
          // Vorlagen-Titel unlesbar schwarz. Explizit auf palette.text setzen.
          color: palette.text,
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          transition: `border-color ${duration.normal}ms ${ease}`,
        }
      },
        React.createElement(Icon, { name: tmpl.icon, size: 20, color: selected === tmpl.key ? palette.sage : palette.mid }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, tmpl.title),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, tmpl.description),
          tmpl.legalRef && React.createElement('div', {
            style: { fontSize: textTokens.xs, color: palette.soft, marginTop: space.xs }
          }, tmpl.legalRef)
        )
      ))
    ),

    // Anstellungs-Auswahl — erscheint NUR, wenn wirklich ein Nebenerwerb erfasst ist.
    // Wer einen Job hat, sieht hier nichts: kein Klick für die Mehrheit. Die Wahl steuert
    // Empfänger UND Zahlen, damit ein Brief über den Nebenjob nie den Hauptlohn nennt.
    JOB_TEMPLATES.includes(selected) && jobOptions.length > 1 && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
      }
    },
      React.createElement('div', {
        style: { fontWeight: weight.semi, fontSize: textTokens.body, color: palette.text, marginBottom: space.xs }
      }, t('briefe.jobPicker.title')),
      React.createElement('div', {
        style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm }
      }, t('briefe.jobPicker.intro')),
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '8px' }
      },
        jobOptions.map(o => React.createElement('label', {
          key: o.key,
          style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer', color: palette.text, ...(isMobile ? { minHeight: '44px' } : {}) }
        },
          React.createElement('input', {
            type: 'radio',
            name: 'brief-job',
            checked: jobKey === o.key,
            onChange: () => setJobKey(o.key),
            style: { flexShrink: 0 },
          }),
          React.createElement('span', { style: { color: palette.text } },
            t('briefe.jobPicker.' + o.key) + (o.employer ? ' — ' + o.employer : ''))
        ))
      )
    ),

    // Lebensereignis-Briefe: erst der Hinweis (Frist / Erbschaft), dann die Angaben.
    selected && lebensereignisHinweis(selected, leseAngaben(selected, angaben), palette, t),
    selected && angabenFormular(selected, angaben, setAngaben, palette, t, isMobile),

    // Grund-Auswahl — geführter „was stimmt nicht"-Schritt: die gewählten Gründe
    // werden im Brief als klare Beanstandung ausformuliert (statt Platzhalter).
    selected === 'kkReklamation' && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
      }
    },
      React.createElement('div', {
        style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
      }, t('briefe.kkReasonPicker.title')),
      React.createElement('div', {
        style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm }
      }, t('briefe.kkReasonPicker.intro')),
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '8px' }
      },
        REKLAMATION_GRUENDE.map(g => React.createElement('label', {
          key: g,
          style: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer', color: palette.text, ...(isMobile ? { minHeight: '44px', alignItems: 'center' } : {}) }
        },
          React.createElement('input', {
            type: 'checkbox',
            checked: reasons.includes(g),
            onChange: () => setReasons(rs => rs.includes(g) ? rs.filter(x => x !== g) : [...rs, g]),
            style: { marginTop: '3px', flexShrink: 0 },
          }),
          React.createElement('span', null, t('briefe.kkReklamation.reasons.' + g))
        ))
      )
    ),

    // Beleg-Auswahl — nur für den Reklamationsbrief: du wählst die strittigen
    // Belege, Datum + Betrag fliessen in den Brief (Fallback: leeres Gerüst).
    selected === 'kkReklamation' && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
      }
    },
      React.createElement('div', {
        style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
      }, t('briefe.kkBelegPicker.title')),
      React.createElement('div', {
        style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.sm }
      }, t('briefe.kkBelegPicker.intro')),
      kkBelege.length === 0
        ? React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, fontStyle: 'italic' }
          }, t('briefe.kkBelegPicker.empty'))
        : React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '8px' }
          },
            kkBelege.map(b => React.createElement('label', {
              key: b.id,
              style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: textTokens.sm, cursor: 'pointer', ...(isMobile ? { minHeight: '44px' } : {}) }
            },
              React.createElement('input', {
                type: 'checkbox',
                checked: belegIds.includes(b.id),
                onChange: () => setBelegIds(ids => ids.includes(b.id) ? ids.filter(x => x !== b.id) : [...ids, b.id]),
              }),
              React.createElement('span', null,
                (fmtDate(b.datum) || t('briefe.kkBelegPicker.undated')) + ' · CHF ' + fmtAmount(b.betrag))
            ))
          )
    ),

    // Data status + Disclaimer.
    // Der Disclaimer stand bis Predeploy-Runde 8 NUR im Brief selbst (`legal-note`) — und
    // wurde damit mitgedruckt, landete also beim Empfänger statt bei der Nutzerin. Jetzt
    // ist die `legal-note` `.no-print` (Bildschirm ja, Couvert nein), und der Hinweis steht
    // hier, wo er hingehört: bei der Person, die den Brief verantwortet.
    selected && React.createElement('div', {
      style: {
        padding: '10px 14px', background: palette.up, borderRadius: radius.sm,
        fontSize: textTokens.sm, color: palette.mid, lineHeight: '1.6',
        marginBottom: space.md,
      }
    },
      React.createElement('div', null, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('briefe.dataNote'))),
      React.createElement('div', { style: { marginTop: space.xs } }, t('briefe.disclaimer'))
    ),

    // Actions
    selected && React.createElement('div', {
      style: { display: 'flex', gap: space.sm, marginBottom: space.md }
    },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: {
          padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, preview ? t('briefe.hidePreview') : t('briefe.showPreview')),
      React.createElement(PrimaryButton, { palette, onClick: () => { if (selected && briefCanRender(selected)) setExportVorschau(true); } }, t('briefe.printLetter'))
    ),
    selected && exportVorschau && React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement(ExportVorschau, {
        palette, t, art: 'brief',
        quelle: { data, templateKey: selected, belegeCount: reklamationBelege.length, job: jobKey, angabenEingetippt: angabenEingetippt(selected, angaben) },
        onWeiter: () => { setExportVorschau(false); handlePrint(); },
        onZurueck: () => setExportVorschau(false),
      })
    ),

    // Frist → Kalender: den berechneten Rückmelde-Termin ruhig in den Kalender legen.
    frist && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, border: '1px solid ' + palette.border,
        borderRadius: radius.sm, marginBottom: space.md,
        display: 'flex', flexDirection: 'column', gap: space.sm,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'flex-start', gap: '10px' }
      },
        React.createElement(Icon, { name: 'calendar', size: 18, color: palette.mid }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs, color: palette.text }
          }, t('briefe.wageReminder.title')),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, t('briefe.wageReminder.text', { frist: frist.display, days: String(frist.days) }))
        )
      ),
      reminderAdded
        ? React.createElement('div', {
            style: { alignSelf: 'flex-start', fontSize: textTokens.sm, fontWeight: weight.medium, color: palette.sageDeep, display: 'flex', alignItems: 'center', gap: '6px' }
          }, hinweisZeichen('check'), t('briefe.wageReminder.added'))
        : React.createElement('button', {
            onClick: handleAddReminder,
            style: {
              alignSelf: 'flex-start', padding: '8px 14px', background: palette.surface,
              border: '1px solid ' + palette.border, borderRadius: radius.sm,
              cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
              color: palette.text,
            }
          }, t('briefe.wageReminder.cta'))
    ),

    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    printed && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.sage + '14',
        border: '1px solid ' + palette.sage + '44', borderRadius: radius.sm,
        marginBottom: space.md, display: 'flex', flexDirection: 'column', gap: space.sm,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'flex-start', gap: '10px' }
      },
        React.createElement(Icon, { name: 'document', size: 18, color: palette.sage }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, t('briefe.afterPrint.title')),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, t('briefe.afterPrint.text'))
        )
      ),
      React.createElement('button', {
        onClick: () => onNavigate('tresor', undefined, selectedTmpl?.chapter || 'all'),
        style: {
          alignSelf: 'flex-start', padding: '8px 14px', background: palette.surface,
          border: '1px solid ' + palette.sage + '66', borderRadius: radius.sm,
          cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
          color: palette.text,
        }
      }, t('briefe.afterPrint.toTresor'))
    ),

    // Preview
    preview && previewHtml && React.createElement('div', {
      style: {
        border: '1px solid ' + palette.border, borderRadius: radius.sm,
        overflow: 'hidden', background: '#fff',
      }
    },
      React.createElement('iframe', {
        srcDoc: previewHtml,
        style: { width: '100%', height: '700px', border: 'none' },
        title: t('backup.letterPreview'),
      })
    ),
  );
};

export default BriefGenerator;
