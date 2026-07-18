import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  validatePhone, validateAHV, validateEmail, validatePostalCode, getFileExpiryHint, formatAHVOnInput, normalizeEmail, formatPhoneOnBlur
} from './validationUtils.js';
import { Icon } from './IconSystem.jsx';
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, leading, space, radius, shadow, fontFamily, duration, ease } from './config/tokens.js';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import MirrorCards from './MirrorCards.jsx';
import { Schutzschild } from './components/Schutzschild.jsx';
import { kantonHatMindestlohn, stundenAufMonat, stundenAufJahr, pruefeStundenlohn, LOHNCHECK_DATA_VERSION, WAGECLAIM_BEREIT } from './data/lohnCheck.js';
import { getLohnKontrollstelle } from './data/lohnRechtsstellen.js';
import { openPrintWindow, escapeHtml } from './utils/helpers.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { TrustLockIcon } from './components/TrustLockIcon.jsx';
import { ScrollFadeStrip } from './components/ScrollFadeStrip.jsx';
import { useIsMobile } from './hooks/useIsMobile.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { PLZAutocomplete } from './PLZAutocomplete.jsx';
import { ItemizedAmount } from './ItemizedAmount.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
// Die zuständige Stelle für den Mindestlohn-Befund — aus derselben Registry, die auch der
// Brief nutzt. Vorher stand im Kapitel fest „das kantonale Arbeitsinspektorat"; das gibt es
// in JU (gar keine Kontrollstelle → Weg übers Arbeitsgericht), BS (AWA) und NE (ORCT) unter
// diesem Namen nicht (Predeploy-Runde 8).
//
// WAHRHEITS-DISZIPLIN: `verify: true` heisst „amtlich noch nicht gegengeprüft" — eine solche
// Stelle wird NICHT genannt, weder im Brief noch hier. Dann trägt die neutrale Formulierung.
// Nie eine Stelle erfinden.
//
// ⚠️ Predeploy-Runde 8, ZWEITE Batterie (Rechts-Prüfer, gegen den Fix selbst): Diese Funktion
// warf den `fallback` weg (`!e.stelle` → neutral) — `briefGenerator.wageClaimRefs` nutzt ihn
// dagegen (`e.stelle || e.fallback || neutral`). Für JU (`stelle: null`, `fallback:
// „Conseil de prud'hommes … Porrentruy"`) sagte das Kapitel darum „der zuständigen
// kantonalen Stelle", der Brief nannte Porrentruy. Dieselbe Registry, zwei Wahrheiten —
// und irreführend obendrein: für den JU-Mindestlohn ist gar KEINE kantonale Stelle
// zuständig, der Weg führt ans Arbeitsgericht. Die App schickte die Nutzerin zu einer
// Behörde, deren Nichtexistenz sie selbst dokumentiert (`hinweis` im Registry-Eintrag).
// Jetzt spiegelt diese Funktion `wageClaimRefs` — eine Quelle, eine Regel.
function lohnKontrollstelleText(kanton, tr) {
  const e = getLohnKontrollstelle(kanton);
  if (!e || e.verify) return tr('lohnCheck.stelleFallbackKurz');
  return e.stelle || e.fallback || tr('lohnCheck.stelleFallbackKurz');
}

const MedicationManager = React.lazy(() => import('./MedicationManager.jsx'));
const DoctorManager = React.lazy(() => import('./DoctorManager.jsx'));
const DiseaseManager = React.lazy(() => import('./DiseaseManager.jsx'));
const Saeule3aTracker = React.lazy(() => import('./Saeule3aTracker.jsx'));
const LanguageManager = React.lazy(() => import('./LanguageManager.jsx'));
const JobManager = React.lazy(() => import('./JobManager.jsx'));

export const ChapterViewComplete = ({ palette, t, chapter, data, allData, onUpdate, onAddDocument, onNavigate, demoMode, simpleView, nextChapter, onNext }) => {
  const vorlesen = useVorlesenContext();
  const isMobile = useIsMobile();
  const [expandedSection, setExpandedSection] = useState('fields');
  const [uploadError, setUploadError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Themen-Reiter: die benannten Sektionen der primären Felder (Person/Kontakt/…),
  // damit man im Kapitel springen kann statt hochzuscrollen (Testperson A #1).
  const [activeSection, setActiveSection] = useState(null);
  const primarySections = chapter.fields.filter((f) => !f.secondary && f.section).map((f) => ({ name: f.section, k: f.k }));
  // Auch benannte Sektionen unter „mehr Felder" (z.B. Vorsorge / 3. Säule) bekommen
  // einen Reiter, damit sie auffindbar sind statt im aufklappbaren Teil zu verschwinden
  // (Stebler Studios, Braindump #21). Ein Klick klappt den Sekundär-Teil auf und springt hin.
  const secondarySections = chapter.fields.filter((f) => f.secondary && f.section).map((f) => ({ name: f.section, k: f.k, secondary: true }));
  const sectionTabs = [...primarySections, ...secondarySections];

  const hasSecondaryFields = chapter.fields.some(f => f.secondary);
  const secondaryHasData = chapter.fields.filter(f => f.secondary).some(f => data[f.k]);
  const storageKey = 'or5_disclosure_' + chapter.key;
  const [showSecondary, setShowSecondary] = useState(() => {
    if (secondaryHasData) return true;
    try { return localStorage.getItem(storageKey) === 'true'; } catch { return false; }
  });
  const toggleSecondary = () => {
    const next = !showSecondary;
    setShowSecondary(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
  };

  // t() with fallback if not provided (backward compat). useMemo → stabile Referenz,
  // damit tr sauber als useEffect-Dep dienen kann (t ist bereits memoisiert).
  const tr = useMemo(() => t || ((k) => k), [t]);

  // Scroll-Spy: hebt den Reiter der Sektion hervor, die man gerade liest.
  // Nicht per schmalem Intersection-Band (die Sektionsköpfe sind dünn und rutschen
  // zwischen den Scrollpositionen durch → Highlight blinkt nur kurz auf). Stattdessen:
  // aktiv ist der zuletzt überschrittene Kopf oberhalb einer Linie knapp unter dem
  // klebenden Reiter — so bleibt die aktuelle Sektion durchgehend markiert.
  useEffect(() => {
    setActiveSection(null);
    if (sectionTabs.length < 2) return;
    const root = document.getElementById('mp-main');
    if (!root) return;
    const compute = () => {
      const anchors = document.querySelectorAll('[data-section-k]');
      if (!anchors.length) return;
      const line = root.getBoundingClientRect().top + 120;
      let current = anchors[0].getAttribute('data-section-k');
      for (const el of anchors) {
        if (el.getBoundingClientRect().top <= line) current = el.getAttribute('data-section-k');
        else break;
      }
      setActiveSection(current);
    };
    compute();
    root.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => { root.removeEventListener('scroll', compute); window.removeEventListener('resize', compute); };
  }, [chapter.key, expandedSection, showSecondary, sectionTabs.length]);

  // Aktiven Reiter in die (horizontal scrollbare) Leiste holen, damit die
  // Hervorhebung immer sichtbar bleibt, auch wenn der Reiter rechts ausserhalb liegt.
  useEffect(() => {
    if (!activeSection) return;
    const tl = document.querySelector('[data-section-tablist]');
    const btn = tl && tl.querySelector('[data-section-tab="' + activeSection + '"]');
    if (!tl || !btn) return;
    const b = btn.getBoundingClientRect(), t = tl.getBoundingClientRect();
    if (b.left < t.left + 4 || b.right > t.right - 4) {
      tl.scrollBy({ left: (b.left + b.width / 2) - (t.left + t.width / 2), behavior: 'smooth' });
    }
  }, [activeSection]);

  useEffect(() => {
    let timer;
    const listener = (event) => {
      if (event.eventType === 'DOCUMENT_UPLOADED') {
        setUploadSuccess(tr('chapterView.uploadSuccess'));
        timer = setTimeout(() => setUploadSuccess(''), 3000);
      }
    };
    runtimeEventBus.subscribe(listener);
    return () => {
      runtimeEventBus.unsubscribe(listener);
      if (timer) clearTimeout(timer);
    };
    // tr ist stabil (= memoisiertes t); als Dep wird bei Sprachwechsel sauber neu
    // abonniert → die Upload-Meldung nutzt die aktuelle Sprache (keine Stale-Closure).
  }, [tr]);

  const validateField = (fieldKey, value) => {
    let error = '';
    if (fieldKey.includes('phone') || fieldKey.includes('Phone')) {
      error = validatePhone(value, tr).error;
    } else if (fieldKey === 'ahv') {
      error = validateAHV(value, tr).error;
    } else if (fieldKey.includes('email')) {
      error = validateEmail(value, tr).error;
    } else if (fieldKey === 'postalCode') {
      error = validatePostalCode(value, 'CH', tr).error;
    }
    return error;
  };

  const handleFieldChange = (fieldKey, value) => {
    let processedValue = value;

    if (fieldKey === 'ahv') {
      processedValue = formatAHVOnInput(value);
    }

    onUpdate(fieldKey, processedValue);

    const error = validateField(fieldKey, processedValue);
    if (!error) setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    else if (touched[fieldKey]) setErrors(prev => ({ ...prev, [fieldKey]: error }));
  };

  const handleFieldBlur = (fieldKey, value) => {
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
    const error = validateField(fieldKey, value);
    setErrors(prev => ({ ...prev, [fieldKey]: error }));
  };

  const handleEmailBlur = (fieldKey, value) => {
    const normalized = normalizeEmail(value);
    if (normalized !== value) {
      onUpdate(fieldKey, normalized);
    }
  };

  const handlePhoneBlur = (fieldKey, value) => {
    const formatted = formatPhoneOnBlur(value);
    if (formatted && formatted !== value) {
      onUpdate(fieldKey, formatted);
    }
  };

  const renderHouseholdFields = () => {
    const household = data.household || { adults: 1, children: [], isRetired: false };
    const adults = household.adults || 1;
    const children = Array.isArray(household.children) ? household.children : [];
    const isRetired = Boolean(household.isRetired);

    const hhLabel = {
      display: 'block', fontSize: text.sm, fontWeight: weight.medium,
      color: palette.mid, marginBottom: space.sm - 2
    };
    const hhSelect = {
      width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
      borderRadius: radius.sm, border: '1px solid ' + palette.border,
      background: palette.up, color: palette.text, boxSizing: 'border-box',
      fontSize: text.body, fontFamily: fontFamily, cursor: 'pointer'
    };

    const updateHousehold = (patch) => {
      const next = { ...household, ...patch };
      onUpdate('household', next);
    };

    // Erwachsene als Liste (wie Kinder). Erste Person = ich selbst (fix).
    // Bestehende Daten (nur Zahl `adults`) werden beim Rendern als leere
    // Liste synthetisiert und erst beim Bearbeiten persistiert (keine stille
    // Migration). `adults` bleibt als Zahl in Sync → Berechnungen unverändert.
    const adultsList = Array.isArray(household.adultsList)
      ? household.adultsList
      : Array.from({ length: Math.max(0, adults - 1) }, () => ({ name: '', relationship: '' }));
    const adultCount = 1 + adultsList.length;
    const setAdultsList = (list) => updateHousehold({ adultsList: list, adults: 1 + list.length });

    // Pill-group — consistent with field-based pills (Zivilstand)
    const hhPills = (labelText, opts, current, onSelect) =>
      React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('div', { style: hhLabel }, labelText),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          opts.map((opt, idx) => {
            const selected = current === opt.value;
            return React.createElement('button', {
              key: idx, type: 'button',
              onClick: () => onSelect(opt.value),
              style: {
                padding: '7px 14px', fontSize: text.sm, fontFamily: 'inherit',
                fontWeight: selected ? weight.semi : weight.normal,
                border: '1px solid ' + (selected ? palette.sage : palette.border),
                borderRadius: radius.sm + 'px',
                background: selected ? palette.sage + '18' : palette.surface,
                color: selected ? palette.sage : palette.text,
                cursor: 'pointer', transition: 'all ' + duration.fast + 'ms ' + ease,
              }
            }, opt.label);
          })
        )
      );

    return React.createElement('div', { key: 'household-fields', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '0 16px' } },

      // Adults — als Liste wie Kinder (erste Person = ich selbst, fix)
      React.createElement('div', { key: 'adults-section', role: 'group', 'aria-labelledby': 'hh-adults-heading', style: { gridColumn: '1 / -1', marginBottom: space.md } },
        React.createElement('div', { id: 'hh-adults-heading', style: hhLabel }, tr('chapters.basis.fields.household.adults')),

        // Ich selbst — feste, nicht entfernbare erste Person
        React.createElement('div', {
          style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.sm, fontSize: text.sm, color: palette.text, fontWeight: weight.medium }
        }, tr('chapters.basis.fields.household.adultSelf') + (data.basis && data.basis.firstName ? ' · ' + data.basis.firstName : '')),

        // Weitere Erwachsene
        adultsList.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md, marginBottom: '12px' } },
          adultsList.map((adult, idx) => {
            const updateAdult = (patch) => setAdultsList(adultsList.map((a, i) => i === idx ? { ...a, ...patch } : a));
            return React.createElement('div', {
              key: idx,
              style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
            },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm } },
                React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
                  tr('chapters.basis.fields.household.adultLabel', { nr: idx + 2 })
                ),
                React.createElement('button', {
                  type: 'button',
                  onClick: () => setAdultsList(adultsList.filter((_, i) => i !== idx)),
                  style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.xs, padding: '6px 8px', minHeight: '24px', fontFamily: fontFamily }
                }, tr('chapters.basis.fields.household.removeChild'))
              ),
              React.createElement('div', { style: { marginBottom: space.sm } },
                React.createElement('label', { htmlFor: 'hh-adult-' + idx + '-name', style: { ...hhLabel, fontSize: text.xs } }, tr('chapters.basis.fields.household.childName')),
                React.createElement('input', { id: 'hh-adult-' + idx + '-name', type: 'text', value: adult.name || '', onChange: (e) => updateAdult({ name: e.target.value }), placeholder: '–', style: { ...hhSelect, cursor: 'text' } })
              ),
              hhPills(
                tr('chapters.basis.fields.household.adultRelationship'),
                [
                  { value: 'partner', label: tr('chapters.basis.fields.household.relPartner') },
                  { value: 'roommate', label: tr('chapters.basis.fields.household.relRoommate') },
                  { value: 'parent', label: tr('chapters.basis.fields.household.relParent') },
                  { value: 'other', label: tr('chapters.basis.fields.household.relOther') },
                ],
                adult.relationship,
                (v) => updateAdult({ relationship: v })
              )
            );
          })
        ),

        React.createElement('button', {
          type: 'button',
          onClick: () => setAdultsList([...adultsList, { name: '', relationship: '' }]),
          style: { background: 'none', border: '1px dashed ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', color: palette.mid, fontSize: text.sm, padding: space.sm + 'px ' + space.md + 'px', fontFamily: fontFamily }
        }, '+ ' + tr('chapters.basis.fields.household.addAdult'))
      ),

      // Partner income — only when 2+ adults
      adultCount >= 2 && React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('label', { htmlFor: 'hh-partner-income', style: hhLabel }, tr('chapters.basis.fields.household.partnerIncome')),
        React.createElement('input', {
          id: 'hh-partner-income',
          type: 'number', inputMode: 'decimal',
          value: household.partnerIncome || '',
          onChange: (e) => updateHousehold({ partnerIncome: e.target.value }),
          placeholder: '0',
          style: { ...hhSelect, cursor: 'text' }
        }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
          tr('chapters.basis.fields.household.partnerIncomeHint')
        )
      ),

      // Retired
      hhPills(
        tr('chapters.basis.fields.household.retired'),
        [
          { value: 'no', label: tr('chapters.basis.fields.household.retiredNo') },
          { value: 'yes', label: tr('chapters.basis.fields.household.retiredYes') }
        ],
        isRetired ? 'yes' : 'no',
        (v) => updateHousehold({ isRetired: v === 'yes' })
      ),

      // Children section — full width
      React.createElement('div', { role: 'group', 'aria-labelledby': 'hh-children-heading', style: { gridColumn: '1 / -1', marginBottom: space.md } },
        React.createElement('div', { id: 'hh-children-heading', style: hhLabel }, tr('chapters.basis.fields.household.children')),

        children.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md, marginBottom: '12px' } },
          children.map((child, idx) => {
            const updateChild = (patch) => {
              const updated = children.map((c, i) => i === idx ? { ...c, ...patch } : c);
              updateHousehold({ children: updated });
            };
            const childInput = { ...hhSelect, cursor: 'text', width: '100%' };
            return React.createElement('div', {
              key: idx,
              style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
            },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm } },
                React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
                  tr('chapters.basis.fields.household.childLabel', { nr: idx + 1 })
                ),
                React.createElement('button', {
                  type: 'button',
                  onClick: () => updateHousehold({ children: children.filter((_, i) => i !== idx) }),
                  style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.xs, padding: '6px 8px', minHeight: '24px', fontFamily: fontFamily }
                }, tr('chapters.basis.fields.household.removeChild'))
              ),
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm } },
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: 'hh-child-' + idx + '-name', style: { ...hhLabel, fontSize: text.xs } }, tr('chapters.basis.fields.household.childName')),
                  React.createElement('input', { id: 'hh-child-' + idx + '-name', type: 'text', value: child.name || '', onChange: (e) => updateChild({ name: e.target.value }), placeholder: '–', style: childInput })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: 'hh-child-' + idx + '-bd', style: { ...hhLabel, fontSize: text.xs } }, tr('chapters.basis.fields.household.childBirthDate')),
                  React.createElement('input', { id: 'hh-child-' + idx + '-bd', type: 'date', value: child.birthDate || '', onChange: (e) => updateChild({ birthDate: e.target.value }), style: childInput })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: 'hh-child-' + idx + '-age', style: { ...hhLabel, fontSize: text.xs } }, tr('chapters.basis.fields.household.childAge')),
                  React.createElement('input', {
                    id: 'hh-child-' + idx + '-age',
                    type: 'number', inputMode: 'numeric', min: 0, max: 25,
                    value: (() => {
                      if (child.birthDate) {
                        const bd = new Date(child.birthDate);
                        const now = new Date();
                        let age = now.getFullYear() - bd.getFullYear();
                        if (now.getMonth() < bd.getMonth() || (now.getMonth() === bd.getMonth() && now.getDate() < bd.getDate())) age--;
                        return Math.max(0, age);
                      }
                      return child.age === 0 ? '0' : (child.age || '');
                    })(),
                    readOnly: !!child.birthDate,
                    onChange: (e) => !child.birthDate && updateChild({ age: Math.max(0, Math.min(25, Number(e.target.value) || 0)) }),
                    style: { ...childInput, ...(child.birthDate ? { opacity: 0.7, cursor: 'default' } : {}) },
                    title: child.birthDate ? tr('chapters.basis.fields.household.childAgeAuto') || '' : ''
                  })
                ),
                React.createElement('div', null,
                  React.createElement('label', { htmlFor: 'hh-child-' + idx + '-insurer', style: { ...hhLabel, fontSize: text.xs } }, tr('chapters.basis.fields.household.childInsurer')),
                  React.createElement('input', { id: 'hh-child-' + idx + '-insurer', type: 'text', value: child.insurer || '', onChange: (e) => updateChild({ insurer: e.target.value }), placeholder: '–', style: childInput })
                )
              )
            );
          })
        ),

        React.createElement('button', {
          type: 'button',
          onClick: () => updateHousehold({ children: [...children, { age: 0, name: '', birthDate: '', insurer: '' }] }),
          style: {
            background: 'none', border: '1px dashed ' + palette.border, borderRadius: radius.sm,
            cursor: 'pointer', color: palette.mid, fontSize: text.sm,
            padding: (space.sm) + 'px ' + space.md + 'px',
            fontFamily: fontFamily,
          }
        }, '+ ' + tr('chapters.basis.fields.household.addChild'))
      )
    );
  };

  const renderOrientation = (field) => {
    const parts = [];
    if (field.orientation) {
      parts.push(React.createElement('div', { key: 'or', style: { fontSize: text.sm, color: palette.sageDeep, marginTop: space.xs + 'px', lineHeight: leading.relaxed } }, 'ⓘ ' + field.orientation));
    }
    if (field.link) {
      parts.push(React.createElement('a', {
        key: 'lk', href: field.link.url, target: '_blank', rel: 'noopener noreferrer',
        style: { display: 'inline-block', fontSize: text.xs, color: palette.skyDeep, marginTop: space.xs + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
      }, '→ ' + field.link.label));
    }
    return parts.length > 0 ? parts : null;
  };

  // Vorsorgeauftrag → ruhiger Wegweiser zum Erwachsenenschutz: Wer entscheidet, wenn man
  // es selbst nicht mehr kann? Mit Vorsorgeauftrag die Person der eigenen Wahl, ohne ordnet
  // die KESB eine Beistandschaft an. Orientierend, nicht rechnend. GlossarText fasst den
  // Begriff „Beistandschaft" für die ⓘ-Erklärung.
  const renderBeistandWegweiser = () => React.createElement('div', {
    key: 'beistand-wegweiser',
    style: {
      gridColumn: '1 / -1',
      background: palette.sageMist || palette.up,
      borderRadius: radius.sm,
      borderLeft: '3px solid ' + palette.sage + '40',
      padding: space.sm + 'px ' + space.md + 'px',
      marginBottom: space.sm + 'px',
    }
  },
    React.createElement('div', {
      style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, marginBottom: space.xs + 'px' }
    }, 'ⓘ ' + tr('beistand.wegweiserTitle')),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
    }, React.createElement(GlossarText, { t: tr, palette }, tr('beistand.wegweiserBody'))),
    React.createElement('a', {
      href: 'https://kesb-kurz-erklaert.ch/erwachsene/', target: '_blank', rel: 'noopener noreferrer',
      style: { display: 'inline-block', fontSize: text.xs, color: palette.skyDeep, marginTop: space.sm + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
    }, '→ ' + tr('beistand.wegweiserLink'))
  );

  const renderField = (field) => {
    if (field.type === 'household') return renderHouseholdFields();
    const value = data[field.k] || '';
    const error = errors[field.k];

    const baseStyle = { marginBottom: space.lg + 'px' };

    const labelStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: simpleView ? text.body : text.sm,
      fontWeight: simpleView ? weight.semi : weight.medium,
      color: simpleView ? palette.text : palette.mid,
      marginBottom: space.sm - 2
    };

    const renderLabel = (fieldId, labelText, hint) => React.createElement('label', { id: fieldId + '-label', htmlFor: fieldId, style: labelStyle },
      labelText,
      vorlesen?.enabled && React.createElement(VorlesenButton, { text: labelText + (hint ? '. ' + hint : ''), speak: vorlesen.speak, color: palette.mid, label: tr('vorlesen.label') })
    );

    const inputStyle = {
      width: '100%',
      padding: (space.sm + 2) + 'px ' + space.sm + 'px ' + (space.sm + 2) + 'px ' + (space.sm + 4) + 'px',
      borderRadius: radius.sm,
      border: error ? '2px solid ' + palette.rose : '1px solid ' + palette.border,
      background: palette.up,
      color: palette.text,
      boxSizing: 'border-box',
      fontSize: simpleView ? text.lg : text.body,
      fontFamily: fontFamily,
      ...(simpleView ? { padding: space.md + 'px' } : {}),
      ...(demoMode ? { pointerEvents: 'none', opacity: 0.7 } : {}),
    };

    const errorStyle = {
      fontSize: text.xs,
      color: palette.roseDeep || palette.rose,
      marginTop: space.xs
    };

    // Fehler programmatisch an das Feld koppeln: role="alert" spricht ihn beim
    // Erscheinen aus, die id verbindet ihn via aria-describedby mit dem Eingabefeld.
    const renderError = (fieldId) => error && React.createElement('div',
      { id: fieldId + '-err', role: 'alert', style: errorStyle }, error);
    // aria-Props fürs Eingabefeld — nur wenn ein Fehler ansteht.
    const errAria = (fieldId) => error
      ? { 'aria-invalid': 'true', 'aria-describedby': fieldId + '-err' }
      : null;

    // Mehrfach-Einträge — mehrere benannte Posten, die sich zur Summe addieren.
    // Das Budget-Feld (field.k) bleibt eine Zahl (= Summe); die Posten liegen in <field.k>Items.
    if (field.itemized) {
      const itemsKey = field.k + 'Items';
      const stored = Array.isArray(data[itemsKey]) ? data[itemsKey] : [];
      // Alt-Einzelbetrag verlustfrei als erster Posten übernehmen (ohne Bezeichnung).
      const seed = stored.length ? stored : (data[field.k] ? [{ label: '', amount: data[field.k] }] : []);
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        field.hint && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, 'ⓘ ' + field.hint),
        React.createElement(ItemizedAmount, {
          palette, t: tr, items: seed,
          onChange: (list) => {
            onUpdate(itemsKey, list);
            onUpdate(field.k, list.reduce((a, r) => a + (Number(r.amount) || 0), 0));
          },
        }),
        renderOrientation(field)
      );
    }

    // Doctors — structured input instead of plain text fields
    if (field.k === 'doctor' && chapter.key === 'notfall') {
      const docList = Array.isArray(data.doctorsList) ? data.doctorsList : [];
      const oldDoctor = typeof data.doctor === 'string' ? data.doctor : '';
      const oldPhone = typeof data.doctorPhone === 'string' ? data.doctorPhone : '';
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('doctors.hint')),
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(DoctorManager, {
            palette, t: tr, doctors: docList,
            onChange: (list) => onUpdate('doctorsList', list),
          })
        ),
        oldDoctor && !docList.length && React.createElement('div', {
          style: { marginTop: space.sm, padding: space.sm + 'px', background: palette.gold + '0A', borderRadius: radius.sm, border: '1px solid ' + palette.border, fontSize: text.xs, color: palette.mid }
        },
          React.createElement('div', { style: { fontWeight: weight.medium, marginBottom: space.xs } }, tr('doctors.migrated')),
          React.createElement('div', null, oldDoctor + (oldPhone ? ' · ' + oldPhone : ''))
        )
      );
    }
    if ((field.k === 'doctorPhone') && chapter.key === 'notfall') {
      return null;
    }

    // Text Input
    // Postleitzahl: lokales PLZ→Gemeinde-Autocomplete (offline). Auswahl füllt
    // PLZ + Stadt; der Kanton kommt aus dem PLZ→Kanton-Sync in main.jsx.
    if (field.k === 'postalCode') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label + (field.required ? ' *' : ''), field.hint),
        React.createElement(PLZAutocomplete, {
          fieldId, value, palette, inputStyle,
          placeholder: field.placeholder || '',
          onChange: (v) => handleFieldChange('postalCode', v),
          onBlur: (v) => handleFieldBlur('postalCode', v),
          onPick: (s) => { handleFieldChange('postalCode', s.plz); onUpdate('city', s.gemeinde); }
        }),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, 'ⓘ ' + field.hint),
        renderOrientation(field),
        renderError(fieldId)
      );
    }

    if (field.type === 'text') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label + (field.required ? ' *' : ''), field.hint),
        React.createElement('input', {
          id: fieldId,
          type: 'text',
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          onBlur: (e) => handleFieldBlur(field.k, e.target.value),
          placeholder: field.placeholder || '',
          autoComplete: field.autoComplete || 'off',
          ...errAria(fieldId),
          style: inputStyle
        }),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, 'ⓘ ' + field.hint),
        renderOrientation(field),
        renderError(fieldId)
      );
    }

    // Phone with country code prefix
    if (field.type === 'tel') {
      const phoneCodes = [
        { code: '+41', label: '+41' },
        { code: '+49', label: '+49' },
        { code: '+43', label: '+43' },
        { code: '+33', label: '+33' },
        { code: '+39', label: '+39' },
      ];
      const detectedCode = phoneCodes.find(p => value.startsWith(p.code));
      const activeCode = detectedCode ? detectedCode.code : '+41';
      const localPart = detectedCode ? value.slice(detectedCode.code.length).replace(/^\s+/, '') : (value.startsWith('0') ? value.slice(1) : value);

      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('select', {
            value: activeCode,
            onChange: (e) => {
              const newCode = e.target.value;
              const joined = localPart ? newCode + ' ' + localPart : newCode;
              handleFieldChange(field.k, joined);
            },
            'aria-label': tr('validation.countryCode'),
            style: { ...inputStyle, width: '80px', flex: '0 0 80px', cursor: 'pointer' }
          },
            phoneCodes.map(p => React.createElement('option', { key: p.code, value: p.code }, p.label))
          ),
          React.createElement('input', {
            id: fieldId,
            type: 'tel',
            value: localPart,
            onChange: (e) => {
              const joined = activeCode + ' ' + e.target.value;
              handleFieldChange(field.k, joined);
            },
            onBlur: (e) => {
              const full = activeCode + ' ' + e.target.value;
              handlePhoneBlur(field.k, full);
              handleFieldBlur(field.k, full);
            },
            placeholder: field.placeholder || '79 123 45 67',
            autoComplete: field.autoComplete || 'off',
            ...errAria(fieldId),
            style: { ...inputStyle, flex: 1 }
          })
        ),
        renderError(fieldId)
      );
    }

    // Email
    if (field.type === 'email') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        React.createElement('input', {
          id: fieldId,
          type: 'email',
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          onBlur: (e) => { handleEmailBlur(field.k, e.target.value); handleFieldBlur(field.k, e.target.value); },
          placeholder: 'name@example.com',
          autoComplete: field.autoComplete || 'off',
          ...errAria(fieldId),
          style: inputStyle
        }),
        renderError(fieldId)
      );
    }

    // Date
    if (field.type === 'date') {
      const fieldId = chapter.key + '-' + field.k;
      const openPicker = () => {
        const inp = document.getElementById(fieldId);
        if (!inp) return;
        if (typeof inp.showPicker === 'function') { try { inp.showPicker(); return; } catch (_) { /* fällt auf focus zurück */ } }
        inp.focus();
      };
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('input', {
            id: fieldId,
            key: field.k + '_' + (value || 'empty'),
            type: 'date',
            className: 'mp-date-input',
            value: value || '',
            onChange: (e) => handleFieldChange(field.k, e.target.value),
            onInput: (e) => { if (!e.target.value && value) handleFieldChange(field.k, ''); },
            autoComplete: field.autoComplete || 'off',
            style: { ...inputStyle, paddingRight: (value ? 64 : 38) + 'px' }
          }),
          value && React.createElement('button', {
            type: 'button',
            onClick: () => handleFieldChange(field.k, ''),
            'aria-label': tr('common.delete'),
            style: {
              position: 'absolute', right: '36px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: palette.mid, fontSize: text.body, padding: space.xs, lineHeight: 1,
            }
          }, '✕'),
          // Eigenes, immer sichtbares Kalender-Symbol → öffnet den Datepicker
          !demoMode && React.createElement('button', {
            type: 'button',
            onClick: openPicker,
            tabIndex: -1,
            'aria-label': tr('common.pickDate'),
            title: tr('common.pickDate'),
            style: {
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: palette.mid, padding: space.xs, lineHeight: 0, display: 'flex', alignItems: 'center',
            }
          },
            React.createElement('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' },
              React.createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
              React.createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
              React.createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
              React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
            )
          )
        )
      );
    }

    // Säule 3a — deposit tracker instead of single currency input
    if (field.k === 'pension3a' && chapter.key === 'finanzen') {
      const fieldId = chapter.key + '-' + field.k;
      // Migrate an old single annual value into one deposit row for display
      const rawDeposits = Array.isArray(data.pension3aDeposits)
        ? data.pension3aDeposits
        : (Number(data.pension3a) > 0 ? [{ date: '', amount: Number(data.pension3a) }] : []);
      const handleDeposits = (deposits) => {
        const sum = deposits.reduce((s, d) => s + (Number(d.amount) || 0), 0);
        onUpdate('pension3aDeposits', deposits);
        onUpdate('pension3a', sum ? String(sum) : '');
      };
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        renderOrientation(field),
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(Saeule3aTracker, {
            palette, t: tr, deposits: rawDeposits,
            onChange: handleDeposits,
          })
        )
      );
    }

    // Currency
    if (field.type === 'currency') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('span', { style: { padding: '10px 12px', background: palette.up, borderRadius: radius.sm, borderLeft: '1px solid ' + palette.border } }, 'CHF'),
          React.createElement('input', {
            id: fieldId,
            type: 'number',
            inputMode: 'decimal',
            value: value,
            onChange: (e) => handleFieldChange(field.k, e.target.value),
            placeholder: '0.00',
            step: '0.01',
            style: { ...inputStyle, flex: 1 }
          })
        ),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, 'ⓘ ' + field.hint),
        renderOrientation(field)
      );
    }

    // Select — supports both {value, label} objects and plain strings
    if (field.type === 'select') {
      const options = (field.options || []).map(opt => {
        if (typeof opt === 'object' && opt.value !== undefined) return opt;
        return { value: opt, label: opt };
      });

      const fieldId = chapter.key + '-' + field.k;
      const usePills = options.length > 0 && options.length <= 6;

      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        usePills
          ? React.createElement('div', {
              role: 'radiogroup',
              'aria-labelledby': fieldId + '-label',
              style: { display: 'flex', flexWrap: 'wrap', gap: '6px' }
            },
              options.map((opt, idx) => {
                const selected = value === opt.value;
                return React.createElement('button', {
                  key: idx,
                  type: 'button',
                  role: 'radio',
                  'aria-checked': selected,
                  onClick: () => handleFieldChange(field.k, selected ? '' : opt.value),
                  style: {
                    padding: '7px 14px',
                    fontSize: text.sm,
                    fontFamily: 'inherit',
                    fontWeight: selected ? weight.semi : weight.normal,
                    border: '1px solid ' + (selected ? palette.sage : palette.border),
                    borderRadius: radius.sm + 'px',
                    background: selected ? palette.sage + '18' : palette.surface,
                    color: selected ? palette.sage : palette.text,
                    cursor: 'pointer',
                    transition: 'all ' + duration.fast + 'ms ' + ease,
                  }
                }, opt.label);
              })
            )
          : React.createElement('div', { style: { position: 'relative' } },
              React.createElement('select', {
                id: fieldId,
                value: value,
                onChange: (e) => handleFieldChange(field.k, e.target.value),
                style: {
                  ...inputStyle,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingRight: '36px',
                }
              },
                React.createElement('option', { value: '' }, tr('chapterView.selectOption')),
                options.map((opt, idx) => React.createElement('option', { key: idx, value: opt.value }, opt.label))
              ),
              React.createElement('div', {
                style: {
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: palette.mid, fontSize: '10px',
                }
              }, '▾')
            ),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, 'ⓘ ' + field.hint),
        // UVG: bei Angestellten transparent vorschlagen, dass die Unfalldeckung über
        // den Arbeitgeber läuft (kein verstecktes Auto-Ausfüllen — nur ein Hinweis).
        field.k === 'uvg' && chapter.key === 'versicherungen' && allData && allData.finanzen && allData.finanzen.employmentType === 'employed' &&
          React.createElement('div', { style: { fontSize: text.sm, color: palette.sageDeep, marginTop: space.xs + 'px', lineHeight: leading.relaxed } }, 'ⓘ ' + tr('uvgHint.fieldSuggest')),
        renderOrientation(field)
      );
    }

    // Medications — structured input instead of textarea
    if (field.k === 'medications' && chapter.key === 'notfall') {
      const medList = Array.isArray(data.medicationsList) ? data.medicationsList : [];
      const oldText = typeof data.medications === 'string' ? data.medications : '';
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('medications.hint')),
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(MedicationManager, {
            palette, t: tr, medications: medList,
            onChange: (list) => onUpdate('medicationsList', list),
          })
        ),
        oldText && !medList.length && React.createElement('div', {
          style: { marginTop: space.sm, padding: space.sm + 'px', background: palette.gold + '0A', borderRadius: radius.sm, border: '1px solid ' + palette.border, fontSize: text.xs, color: palette.mid }
        },
          React.createElement('div', { style: { fontWeight: weight.medium, marginBottom: space.xs } }, tr('medications.migrated')),
          React.createElement('div', null, oldText)
        )
      );
    }

    // Languages — structured input (language + CEFR level) instead of textarea
    if (field.k === 'languages' && chapter.key === 'ausbildung') {
      const langList = Array.isArray(data.languagesList) ? data.languagesList : [];
      const oldText = typeof data.languages === 'string' ? data.languages : '';
      const handleLangs = (langs) => {
        onUpdate('languagesList', langs);
        const joined = langs.filter(x => x.name).map(x => {
          const lvl = x.level === 'native' ? tr('langSkill.levels.native') : x.level;
          return x.name + (lvl ? ' (' + lvl + ')' : '');
        }).join(', ');
        onUpdate('languages', joined);
      };
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('langSkill.hint')),
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(LanguageManager, {
            palette, t: tr, languages: langList,
            onChange: handleLangs,
          })
        ),
        oldText && !langList.length && React.createElement('div', {
          style: { marginTop: space.sm, padding: space.sm + 'px', background: palette.gold + '0A', borderRadius: radius.sm, border: '1px solid ' + palette.border, fontSize: text.xs, color: palette.mid }
        },
          React.createElement('div', { style: { fontWeight: weight.medium, marginBottom: space.xs } }, tr('langSkill.migrated')),
          React.createElement('div', null, oldText)
        )
      );
    }

    // Chronic diseases — structured input with ICD-10 autocomplete instead of textarea
    if (field.k === 'chronicDiseases' && chapter.key === 'notfall') {
      const dList = Array.isArray(data.chronicDiseasesList) ? data.chronicDiseasesList : [];
      const oldText = typeof data.chronicDiseases === 'string' ? data.chronicDiseases : '';
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('diseases.hint')),
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(DiseaseManager, {
            palette, t: tr, diseases: dList,
            onChange: (list) => onUpdate('chronicDiseasesList', list),
          })
        ),
        oldText && !dList.length && React.createElement('div', {
          style: { marginTop: space.sm, padding: space.sm + 'px', background: palette.gold + '0A', borderRadius: radius.sm, border: '1px solid ' + palette.border, fontSize: text.xs, color: palette.mid }
        },
          React.createElement('div', { style: { fontWeight: weight.medium, marginBottom: space.xs } }, tr('diseases.migrated')),
          React.createElement('div', null, oldText)
        )
      );
    }

    // Textarea
    if (field.type === 'textarea') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint),
        React.createElement('textarea', {
          id: fieldId,
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          placeholder: field.placeholder || '',
          style: { ...inputStyle, minHeight: '100px', fontFamily: 'Lexend, monospace', resize: 'vertical' }
        })
      );
    }

    return null;
  };

  const filledCount = chapter.fields.filter(f => data[f.k]).length;

  const ankunftKey = 'or5_ankunft_' + chapter.key;
  const [showAnkunft, setShowAnkunft] = useState(false);
  const prevFilledRef = useRef(filledCount);
  useEffect(() => {
    if (prevFilledRef.current === 0 && filledCount > 0) {
      try {
        if (!localStorage.getItem(ankunftKey)) {
          localStorage.setItem(ankunftKey, Date.now().toString());
          setShowAnkunft(true);
          const timer = setTimeout(() => setShowAnkunft(false), 6000);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
    prevFilledRef.current = filledCount;
  }, [filledCount, ankunftKey]);

  const CHECKLIST_STORAGE_KEY = 'or5_behoerden_checklist';
  const [checklistChecked, setChecklistChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY)) || {}; } catch { return {}; }
  });

  const introText = tr('chapters.' + chapter.key + '.intro');
  const hasIntro = introText && introText !== 'chapters.' + chapter.key + '.intro';

  const isNotfall = chapter.key === 'notfall';
  const hasContact = isNotfall && data.emergencyContact;
  const hasBlood = isNotfall && data.bloodType && data.bloodType !== 'unknown' && data.bloodType !== '';
  const vorsorgeKeys = ['patientenverfuegung', 'vorsorgeauftrag', 'bestattungswuensche'];
  const hasVorsorge = isNotfall && vorsorgeKeys.some(k => data[k]);
  const showSummary = hasContact || hasBlood || hasVorsorge;
  const hasDoctors = Array.isArray(data.doctorsList) && data.doctorsList.some(d => d.name);
  const hasMedical = isNotfall && (hasContact || hasBlood || data.allergies || (Array.isArray(data.medicationsList) && data.medicationsList.some(m => m.name)) || hasDoctors || data.doctor);

  const handleSaveCard = () => {
    const basis = allData && allData.basis || {};
    const name = [basis.firstName, basis.middleName, basis.lastName].filter(Boolean).join(' ');
    const dob = basis.dateOfBirth ? new Date(basis.dateOfBirth).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const sections = [];
    if (name || dob) {
      const rows = [];
      if (name) rows.push('<div style="font-size:18px;font-weight:500">' + escapeHtml(name) + '</div>');
      if (dob) rows.push('<div style="color:#666">' + tr('notfallSummary.cardDateOfBirth') + ': ' + dob + '</div>');
      sections.push({ title: tr('notfallSummary.cardPerson'), html: rows.join('') });
    }
    if (data.emergencyContact) {
      const rows = ['<div>' + escapeHtml(data.emergencyContact) + '</div>'];
      if (data.emergencyPhone) rows.push('<div>' + escapeHtml(data.emergencyPhone) + '</div>');
      sections.push({ title: tr('notfallSummary.handoverContact'), html: rows.join('') });
    }
    const medRows = [];
    if (hasBlood) medRows.push('<div>' + tr('notfallSummary.bloodType') + ': <strong>' + escapeHtml(data.bloodType) + '</strong></div>');
    if (data.allergies) medRows.push('<div>' + tr('chapters.notfall.fields.allergies') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    const medList = Array.isArray(data.medicationsList) ? data.medicationsList.filter(m => m.name) : [];
    if (medList.length) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + medList.map(m => escapeHtml(m.name) + (m.dose ? ' ' + escapeHtml(m.dose) + ' ' + escapeHtml(m.unit) : '')).join(', ') + '</div>');
    else if (data.medications) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    const dList = Array.isArray(data.chronicDiseasesList) ? data.chronicDiseasesList.filter(d => d.name) : [];
    if (dList.length) medRows.push('<div>' + tr('chapters.notfall.fields.chronicDiseases') + ': ' + dList.map(d => escapeHtml(d.name) + (d.code ? ' (' + escapeHtml(d.code) + ')' : '')).join(', ') + '</div>');
    else if (data.chronicDiseases) medRows.push('<div>' + tr('chapters.notfall.fields.chronicDiseases') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    if (medRows.length) sections.push({ title: tr('notfallSummary.handoverMedical'), html: medRows.join('') });
    const docList = Array.isArray(data.doctorsList) ? data.doctorsList.filter(d => d.name) : [];
    if (docList.length) {
      const rows = docList.map(d => '<div>' + escapeHtml(d.name) + (d.phone ? ' · ' + escapeHtml(d.phone) : '') + '</div>');
      sections.push({ title: tr('notfallSummary.cardDoctor'), html: rows.join('') });
    } else if (data.doctor) {
      const rows = ['<div>' + escapeHtml(data.doctor) + (data.doctorPhone ? ' · ' + escapeHtml(data.doctorPhone) : '') + '</div>'];
      sections.push({ title: tr('notfallSummary.cardDoctor'), html: rows.join('') });
    }
    const provRows = [];
    if (data.patientenverfuegung && data.patientenverfuegung !== 'no') provRows.push('<div>' + tr('notfallSummary.cardAdvanceDirective') + '</div>');
    if (data.vorsorgeauftrag && data.vorsorgeauftrag !== 'no') provRows.push('<div>' + tr('notfallSummary.cardPowerOfAttorney') + '</div>');
    if (provRows.length) sections.push({ title: tr('notfallSummary.handoverProvision'), html: provRows.join('') });
    const sectionHtml = sections.map(s =>
      '<div style="margin-bottom:16px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:4px">' + s.title + '</div>' + s.html + '</div>'
    ).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + tr('notfallSummary.cardTitle') + '</title>' +
      '<style>@media print{body{margin:0;padding:20mm}@page{size:A4;margin:20mm}}body{font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:40px auto;padding:0 24px;color:#222;line-height:1.5}' +
      '.card{border:1px solid #ddd;border-radius:8px;padding:24px;background:#fff}h1{font-size:20px;font-weight:500;margin:0 0 4px;letter-spacing:0.3px}' +
      '.subtitle{font-size:13px;color:#888;margin:0 0 20px;font-style:italic}.footer{margin-top:20px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa}' +
      '.no-print{text-align:center;margin-bottom:24px}@media print{.no-print{display:none}}</style></head><body>' +
      '<div class="no-print"><button onclick="window.print()" style="padding:8px 20px;font-size:14px;border:1px solid #ccc;border-radius:6px;background:#f8f7f5;cursor:pointer">' + tr('notfallSummary.printCard') + '</button></div>' +
      '<div class="card"><h1>' + tr('notfallSummary.cardTitle') + '</h1>' +
      '<p class="subtitle">' + tr('notfallSummary.handoverIntro') + '</p>' +
      sectionHtml +
      '<div class="footer">' + tr('notfallSummary.cardFooter') + '</div></div></body></html>';
    openPrintWindow(html);
  };

  const chapterAccent = {
    basis: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    wohnen: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    // icon = Vordergrundfarbe für Icon UND kursiven Intro-Text (Zeile ~1023) → muss
    // lesbar sein (AA ≥4.5). Roh-Akzente (gold 2.19 / sky 3.20 / sand 2.34 / rose 3.59)
    // fielen als Text durch; darum die *Deep-Varianten. bg/border bleiben roh (dekorativ).
    finanzen: { bg: palette.gold + '0A', border: palette.gold, icon: palette.goldDeep },
    versicherungen: { bg: palette.sky + '0A', border: palette.sky, icon: palette.skyDeep },
    ausbildung: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    behoerden: { bg: palette.sand + '0A', border: palette.sand, icon: palette.sandDeep },
    notfall: { bg: palette.rose + '0A', border: palette.rose, icon: palette.roseDeep },
  };
  const accent = chapterAccent[chapter.key] || chapterAccent.basis;

  return React.createElement('div', { style: { background: palette.surface, padding: space.md + 4 + 'px ' + space.md + 'px', borderRadius: radius.md, border: '1px solid ' + palette.border + '88', boxShadow: shadow.sm } },
    // Header — expressive chapter entrance with landscape continuity
    React.createElement('div', { style: { textAlign: 'center', marginBottom: space.xl + 'px', paddingTop: space.lg + 'px', paddingBottom: space.lg + 'px', background: accent.bg, borderRadius: radius.md, marginLeft: '-' + space.md + 'px', marginRight: '-' + space.md + 'px', marginTop: '-' + (space.md + 4) + 'px', borderBottom: '1px solid ' + accent.border + '20' } },
      React.createElement('div', { style: { marginBottom: space.md + 'px', color: accent.icon } },
        React.createElement(Icon, { name: chapter.key, size: 48 })
      ),
      React.createElement(PageTitle, { palette, style: { marginBottom: space.xs + 'px' } }, chapter.title),
      React.createElement('p', { style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' } }, chapter.description),
      hasIntro && React.createElement('p', { style: { fontSize: text.sm, color: accent.icon, marginTop: space.md + 'px', lineHeight: leading.relaxed, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', fontStyle: 'italic' } }, introText)
    ),

    demoMode && React.createElement('div', {
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        marginBottom: space.md + 'px',
        background: palette.sand + '15',
        borderRadius: radius.sm,
        border: '1px solid ' + palette.sand + '25',
        fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed,
      }
    }, tr('demo.readOnlyHint')),

    // "Was Du davon hast" — shows which tools benefit from this chapter's data (before fields)
    (() => {
      const benefitsKey = 'chapters.' + chapter.key + '.benefits';
      const benefits = tr(benefitsKey);
      if (benefits === benefitsKey || !Array.isArray(benefits)) return null;
      return React.createElement('div', {
        style: {
          marginBottom: space.md + 'px',
          padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sand + '0C',
          borderRadius: radius.sm,
          border: '1px solid ' + palette.sand + '20',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
        }
      },
        React.createElement('span', {
          style: { fontSize: text.xs, color: palette.mid, marginRight: '2px' }
        }, tr('chapterView.benefitsLabel')),
        benefits.map((b, i) =>
          React.createElement('span', {
            key: i,
            style: {
              fontSize: text.xs, color: palette.sageDeep,
              padding: '2px 8px',
              background: palette.sage + '0D',
              borderRadius: radius.sm,
              whiteSpace: 'nowrap',
            }
          }, '→ ' + b)
        )
      );
    })(),

    // Ankunftsmoment — calm acknowledgment on first data entry
    !demoMode && showAnkunft && React.createElement('div', {
      style: {
        textAlign: 'center', padding: space.md + 'px ' + space.lg + 'px',
        marginBottom: space.md + 'px',
        background: palette.sageDew || palette.sage + '08',
        borderRadius: radius.md,
        border: '1px solid ' + palette.sage + '25',
        animation: 'fadeIn 0.8s ease',
      }
    },
      React.createElement('div', {
        style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed, fontStyle: 'italic' }
      }, tr('ankunft.' + chapter.key))
    ),

    // Living mirror layer — life sentence + mirror cards
    React.createElement(MirrorCards, { chapterKey: chapter.key, data: data, allData: allData, palette: palette, t: tr }),

    // Notfallübergabe — calm structured summary when enough data is present
    isNotfall && showSummary && (() => {
      const sections = [];
      if (data.emergencyContact) {
        const rows = [data.emergencyContact];
        if (data.emergencyPhone) rows.push(data.emergencyPhone);
        sections.push({ title: tr('notfallSummary.handoverContact'), rows: rows });
      }
      const medRows = [];
      if (hasBlood) medRows.push(tr('notfallSummary.bloodType') + ': ' + data.bloodType);
      if (data.allergies) medRows.push(tr('notfallSummary.handoverAllergies'));
      const medList2 = Array.isArray(data.medicationsList) ? data.medicationsList.filter(m => m.name) : [];
      if (medList2.length) medRows.push(tr('notfallSummary.handoverMedications') + ': ' + medList2.map(m => m.name).join(', '));
      else if (data.medications) medRows.push(tr('notfallSummary.handoverMedications'));
      const dList2 = Array.isArray(data.chronicDiseasesList) ? data.chronicDiseasesList.filter(d => d.name) : [];
      if (dList2.length) medRows.push(tr('notfallSummary.handoverChronic') + ': ' + dList2.map(d => d.name).join(', '));
      else if (data.chronicDiseases) medRows.push(tr('notfallSummary.handoverChronic'));
      if (medRows.length) sections.push({ title: tr('notfallSummary.handoverMedical'), rows: medRows });
      const careRows = [];
      const docList3 = Array.isArray(data.doctorsList) ? data.doctorsList.filter(d => d.name) : [];
      if (docList3.length) docList3.forEach(d => careRows.push(d.name + (d.phone ? ' · ' + d.phone : '')));
      else if (data.doctor) careRows.push(data.doctor + (data.doctorPhone ? ' · ' + data.doctorPhone : ''));
      if (data.hospital) careRows.push(data.hospital);
      if (careRows.length) sections.push({ title: tr('notfallSummary.handoverCare'), rows: careRows });
      const provRows = [];
      if (data.patientenverfuegung && data.patientenverfuegung !== 'no') provRows.push(tr('notfallSummary.patientenverfuegung'));
      if (data.vorsorgeauftrag && data.vorsorgeauftrag !== 'no') provRows.push(tr('notfallSummary.vorsorgeauftrag'));
      if (data.bestattungswuensche && data.bestattungswuensche !== 'no') provRows.push(tr('notfallSummary.bestattungswuensche'));
      if (provRows.length) sections.push({ title: tr('notfallSummary.handoverProvision'), rows: provRows });
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('notfallSummary.handoverIntro')),
        ...sections.map((sec, i) =>
          React.createElement('div', { key: i, style: { marginBottom: i < sections.length - 1 ? space.sm + 'px' : 0 } },
            React.createElement('div', {
              style: { fontSize: text.xs, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: space.xs }
            }, sec.title),
            ...sec.rows.map((row, j) =>
              React.createElement('div', { key: j, style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed } }, row)
            )
          )
        )
      );
    })(),

    // Notfallkarte export — quiet text link (below mirror cards)
    isNotfall && hasMedical && React.createElement('div', {
      style: { marginBottom: space.md }
    },
      React.createElement('span', {
        onClick: handleSaveCard,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter') handleSaveCard(); },
        style: {
          fontSize: text.sm, color: palette.mid, cursor: 'pointer', letterSpacing: '0.2px',
          borderBottom: '1px solid ' + palette.border,
          paddingBottom: '1px',
        }
      }, '□ ' + tr('notfallSummary.printCard'))
    ),

    // Versicherungsübersicht — coverage overview when at least one field is filled
    chapter.key === 'versicherungen' && (() => {
      const areas = [
        { key: 'kvg', fields: ['kkInsurer', 'kkModel', 'kkPremium', 'franchise', 'kkCardNumber'] },
        { key: 'bvg', fields: ['bvgInsurer', 'bvgContribution'] },
        { key: 'uvg', fields: ['uvg'] },
        { key: 'haftpflicht', fields: ['liabilityInsurance', 'liabilityAmount'] },
        { key: 'hausrat', fields: ['householdInsurance', 'householdInsuranceAmount'] },
        { key: 'reise', fields: ['travelInsurance'] },
        { key: 'cyber', fields: ['cyberInsurance'] },
        { key: 'fahrzeug', fields: ['autoInsurance', 'autoInsuranceAmount'] },
        { key: 'ahv', fields: ['ahvContribution'] },
      ];
      const hasAny = areas.some(a => a.fields.some(f => data[f]));
      if (!hasAny) return null;
      const erfasst = tr('versicherungsübersicht.erfasst');
      const nicht = tr('versicherungsübersicht.nichtErfasst');
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('versicherungsübersicht.intro')),
        ...areas.map((area, i) => {
          const filled = area.fields.some(f => data[f]);
          return React.createElement('div', {
            key: i,
            style: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < areas.length - 1 ? '1px solid ' + palette.border + '33' : 'none',
            }
          },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('versicherungsübersicht.' + area.key)),
            React.createElement('span', {
              style: { fontSize: text.sm, color: filled ? palette.sageDeep || palette.sage : palette.mid, fontStyle: filled ? 'normal' : 'italic' }
            }, filled ? erfasst : nicht)
          );
        })
      );
    })(),

    // Behörden-Zeitstatus — temporal overview of official matters
    chapter.key === 'behoerden' && (() => {
      const rows = [];
      if (data.taxFilingDeadline) {
        const deadline = new Date(data.taxFilingDeadline);
        const now = new Date();
        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        let relative;
        if (diffDays === 0) relative = tr('behördenStatus.today');
        else if (diffDays > 0 && diffDays < 60) relative = tr('behördenStatus.inDays').replace('{n}', diffDays);
        else if (diffDays >= 60) relative = tr('behördenStatus.inMonths').replace('{n}', Math.round(diffDays / 30));
        else if (diffDays > -60) relative = tr('behördenStatus.agoDays').replace('{n}', Math.abs(diffDays));
        else relative = tr('behördenStatus.ago').replace('{n}', Math.round(Math.abs(diffDays) / 30));
        const formatted = deadline.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
        rows.push({ label: tr('behördenStatus.taxDeadline'), value: formatted + ' (' + relative + ')' });
      }
      if (data.pendingTaxReturns) rows.push({ label: tr('behördenStatus.pendingReturns'), value: data.pendingTaxReturns });
      if (data.betreibungsStatus) {
        const opts = { none: tr('chapters.behoerden.fields.betreibungsStatus.options.none') || data.betreibungsStatus, entries: tr('chapters.behoerden.fields.betreibungsStatus.options.entries') || data.betreibungsStatus, unknown: tr('chapters.behoerden.fields.betreibungsStatus.options.unknown') || data.betreibungsStatus };
        rows.push({ label: tr('behördenStatus.betreibung'), value: opts[data.betreibungsStatus] || data.betreibungsStatus });
      }
      if (data.courtCases) {
        const val = data.courtCases === 'yes' ? (tr('chapters.behoerden.fields.courtCases.options.yes') || data.courtCases) : (tr('chapters.behoerden.fields.courtCases.options.no') || data.courtCases);
        rows.push({ label: tr('behördenStatus.courtCases'), value: val });
      }
      if (data.willMade) {
        const wOpts = { no: tr('chapters.behoerden.fields.willMade.options.no'), handwritten: tr('chapters.behoerden.fields.willMade.options.handwritten'), public: tr('chapters.behoerden.fields.willMade.options.public'), inProgress: tr('chapters.behoerden.fields.willMade.options.inProgress') };
        rows.push({ label: tr('behördenStatus.will'), value: wOpts[data.willMade] || data.willMade });
      }
      if (data.legalRepresentative) rows.push({ label: tr('behördenStatus.legalRep'), value: data.legalRepresentative });
      if (rows.length === 0) return null;
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('behördenStatus.intro')),
        ...rows.map((row, i) =>
          React.createElement('div', {
            key: i,
            style: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '6px 0',
              borderBottom: i < rows.length - 1 ? '1px solid ' + palette.border + '33' : 'none',
            }
          },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, row.label),
            React.createElement('span', { style: { fontSize: text.sm, color: palette.mid, textAlign: 'right', maxWidth: '55%' } }, row.value)
          )
        )
      );
    })(),

    // Behörden-Checkliste — interactive checklist for common official tasks
    chapter.key === 'behoerden' && (() => {
      const items = [
        { id: 'betreibungsauszug', key: 'checklist.betreibungsauszug' },
        { id: 'steuererklaerung', key: 'checklist.steuererklaerung' },
        { id: 'wohnsitzbestaetigung', key: 'checklist.wohnsitzbestaetigung' },
        { id: 'ausweisRenewal', key: 'checklist.ausweisRenewal' },
        { id: 'strafregisterauszug', key: 'checklist.strafregisterauszug' },
        { id: 'patientenverfuegung', key: 'checklist.patientenverfuegung' },
      ];
      const checked = checklistChecked;
      const toggle = (id) => {
        const next = { ...checked, [id]: !checked[id] };
        setChecklistChecked(next);
        try { localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next)); } catch {}
      };
      const done = items.filter(i => checked[i.id]).length;
      return React.createElement('details', {
        style: { marginBottom: space.lg + 'px' }
      },
        React.createElement('summary', {
          style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' }
        }, '□ ' + tr('checklist.title') + (done > 0 ? ' (' + done + '/' + items.length + ')' : '')),
        React.createElement('div', {
          style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, marginTop: space.xs + 'px' }
        },
          React.createElement('p', {
            style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px', lineHeight: leading.relaxed }
          }, tr('checklist.intro')),
          ...items.map(item =>
            React.createElement('label', {
              key: item.id,
              style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', padding: '6px 0', cursor: 'pointer', borderBottom: '1px solid ' + palette.border + '33', fontSize: text.sm, ...(isMobile ? { minHeight: '44px' } : {}) }
            },
              React.createElement('input', {
                type: 'checkbox',
                checked: !!checked[item.id],
                onChange: () => toggle(item.id),
                style: { accentColor: palette.sand, flexShrink: 0 }
              }),
              React.createElement('span', {
                style: { color: checked[item.id] ? palette.mid : palette.text, textDecoration: checked[item.id] ? 'line-through' : 'none' }
              }, tr(item.key))
            )
          )
        )
      );
    })(),

    // Wohnkostenanteil — housing cost share when both costs and income are recorded
    chapter.key === 'wohnen' && allData && (() => {
      const rent = parseFloat(data.rentAmount) || 0;
      const util = parseFloat(data.utilities) || 0;
      const wohnkosten = rent + util;
      if (wohnkosten <= 0) return null;
      const fin = allData.finanzen || {};
      const income = (parseFloat(fin.monthlyIncome) || 0) + (parseFloat(fin.familienzulagen) || 0) + (parseFloat(fin.alimenteReceived) || 0);
      if (income <= 0) return null;
      const pct = ((wohnkosten / income) * 100).toFixed(1).replace(/\.0$/, '');
      const fmt = (v) => Math.round(v).toLocaleString(undefined, { minimumFractionDigits: 0 });
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('wohnkostenanteil.intro')),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border + '33' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('wohnkostenanteil.housing')),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + fmt(wohnkosten) + ' ' + tr('wohnkostenanteil.perMonth'))
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border + '33' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('wohnkostenanteil.income')),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + fmt(income) + ' ' + tr('wohnkostenanteil.perMonth'))
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text, fontWeight: weight.medium } }, tr('wohnkostenanteil.share')),
          React.createElement('span', { style: { fontSize: text.body, color: palette.text, fontWeight: weight.medium } }, pct + ' %')
        )
      );
    })(),

    // Versicherungs-Schutzschild: Deckungsgrad der drei Kern-Absicherungen
    // (Instrument #4). data = versicherungen-Kapitel; blendet sich selbst aus,
    // solange nichts erfasst ist.
    chapter.key === 'versicherungen' &&
      React.createElement(Schutzschild, {
        palette, t, versicherungen: data,
        employed: allData?.finanzen?.employmentType === 'employed',
        annualIncome: (Number(allData?.finanzen?.monthlyIncome) || 0) * 12,
      }),

    // ─── Contextual orientation hints (Helvetia layer) ──────
    // IPV: shown in finanzen when income + canton exist
    chapter.key === 'finanzen' && allData && allData.finanzen?.monthlyIncome && allData.basis?.canton &&
      React.createElement('div', {
        style: {
          marginBottom: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sageMist || (palette.sage + '10'), borderRadius: radius.sm,
          border: '1px solid ' + palette.sage + '25',
          borderLeft: '3px solid ' + palette.sage + '50',
          fontSize: text.sm, color: palette.sageDeep || palette.sage, lineHeight: leading.relaxed,
        }
      }, 'ⓘ ' + tr('orientation.contextIpv')),
    chapter.key === 'finanzen' && allData && allData.finanzen?.monthlyIncome && onNavigate &&
      React.createElement('button', {
        onClick: () => onNavigate('finanzuebersicht'),
        style: {
          marginBottom: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sageMist || palette.up,
          border: 'none', borderRadius: radius.sm,
          fontSize: text.sm, color: palette.sageDeep || palette.mid,
          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
        }
      }, t('nav.crosslink.finanzuebersichtHint')),

    // Familienzulagen: shown in basis when children exist
    chapter.key === 'basis' && allData && allData.basis?.household?.children?.length > 0 &&
      React.createElement('div', {
        style: {
          marginBottom: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sageMist || (palette.sage + '10'), borderRadius: radius.sm,
          border: '1px solid ' + palette.sage + '25',
          borderLeft: '3px solid ' + palette.sage + '50',
          fontSize: text.sm, color: palette.sageDeep || palette.sage, lineHeight: leading.relaxed,
        }
      }, 'ⓘ ' + tr('orientation.contextFamilienzulagen')),

    // Tabs
    // marginBottom klein halten: der Sektions-Reiter darunter soll als Unter-Ebene
    // von „Angaben" gelesen werden, nicht losgelöst tief darunter schweben.
    React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', marginBottom: space.sm + 'px', borderBottom: '1px solid ' + palette.border, paddingBottom: space.md + 'px' } },
      React.createElement('button', {
        onClick: () => setExpandedSection('fields'),
        style: {
          padding: space.sm + 'px ' + space.md + 'px',
          background: expandedSection === 'fields' ? palette.sand : 'transparent',
          color: expandedSection === 'fields' ? '#000' : palette.text,
          border: 'none',
          borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
          cursor: 'pointer',
          fontWeight: weight.semi,
          fontSize: text.sm
        }
      }, tr('chapterView.fields')),
      React.createElement('button', {
        onClick: () => setExpandedSection('documents'),
        style: {
          padding: space.sm + 'px ' + space.md + 'px',
          background: expandedSection === 'documents' ? palette.sand : 'transparent',
          color: expandedSection === 'documents' ? '#000' : palette.text,
          border: 'none',
          borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
          cursor: 'pointer',
          fontWeight: weight.semi,
          fontSize: text.sm
        }
      }, tr('chapterView.documents'))
    ),

    // Fields Tab
    expandedSection === 'fields' && React.createElement('div', null,
      // Sticky Themen-Reiter — springt zu den Sektionen, hebt die aktuelle hervor.
      sectionTabs.length >= 2 && React.createElement(ScrollFadeStrip, {
        palette,
        role: 'tablist',
        'data-section-tablist': '1',
        'aria-label': tr('chapterView.sectionNav'),
        containerStyle: {
          // top: -24px gleicht das padding-top:24px des Scroll-Containers (#mp-main) aus,
          // damit der Reiter beim Kleben bündig unter dem „100% lokal"-Streifen sitzt.
          // Sonst bleibt ein 24px-Spalt, durch den der scrollende Text durchscheint.
          position: 'sticky', top: '-24px', zIndex: 5,
          marginBottom: space.md + 'px',
          background: palette.surface,
          borderBottom: '1px solid ' + palette.border + '55',
        },
        style: {
          // Einzeilig + horizontal scrollbar statt Umbruch: spart Sticky-Höhe bei
          // vielen Sektionen; die Leiste bleibt ruhig, statt zwei Reihen zu füllen.
          display: 'flex', flexWrap: 'nowrap', gap: space.xs + 'px',
          overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
          padding: space.sm + 'px 0',
        },
      },
        sectionTabs.map((s) => {
          const on = activeSection === s.k;
          const jump = () => { const el = document.getElementById('mp-section-' + s.k); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
          return React.createElement('button', {
            key: s.k,
            'data-section-tab': s.k,
            // Sekundär-Reiter: erst „mehr Felder" aufklappen, dann hinspringen
            // (das Ziel existiert erst nach dem Aufklappen im DOM).
            onClick: s.secondary
              ? () => { if (!showSecondary) { setShowSecondary(true); try { localStorage.setItem(storageKey, 'true'); } catch {} requestAnimationFrame(() => requestAnimationFrame(jump)); } else { jump(); } }
              : jump,
            'aria-current': on ? 'true' : undefined,
            style: {
              flexShrink: 0,
              padding: '5px 12px', borderRadius: (radius.pill || radius.md),
              border: '1px solid ' + (on ? palette.sage + '88' : palette.border + '66'),
              background: on ? palette.sage + '18' : 'transparent',
              color: on ? (palette.sageDeep || palette.text) : palette.mid,
              fontSize: text.xs, fontWeight: on ? weight.medium : weight.normal,
              fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 160ms ease, border-color 160ms ease',
            },
          }, s.name);
        })
      ),
      filledCount === 0 && React.createElement('div', { style: { padding: space.lg + 'px', background: palette.sageMist || palette.up, borderRadius: radius.md, border: '1px solid ' + palette.sage + '22', textAlign: 'center', marginBottom: space.lg + 'px' } },
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyState'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyState'); })()
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 10px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyStateHint'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyStateHint'); })()
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: text.xs, color: palette.sageDeep, opacity: 0.8 } },
          React.createElement(TrustLockIcon, { size: 11, color: 'currentColor' }),
          tr('trust.chapterTrust')
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '0 16px' } },
        chapter.fields.filter(f => !f.secondary).map((field, idx, primaryFields) => {
          const elements = [];
          if (field.section) {
            const isFirst = idx === 0 || !primaryFields.slice(0, idx).some(f => f.section);
            elements.push(
              React.createElement('div', {
                key: 'section-' + field.k,
                id: 'mp-section-' + field.k,
                'data-section-k': field.k,
                role: 'presentation',
                'aria-label': field.section,
                style: {
                  gridColumn: '1 / -1',
                  scrollMarginTop: '52px',
                  marginTop: isFirst ? 0 : space['2xl'] + 'px',
                  paddingTop: isFirst ? 0 : space.lg + 'px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.sage + '18',
                  fontSize: text.sm,
                  fontWeight: weight.medium,
                  color: palette.sageDeep || palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: space.sm + 'px',
                }
              }, field.section)
            );
            if (field.sectionIntro) {
              elements.push(
                React.createElement('p', {
                  key: 'sectionIntro-' + field.k,
                  style: {
                    gridColumn: '1 / -1',
                    fontSize: text.sm,
                    color: palette.sageDeep || palette.sage,
                    fontStyle: 'italic',
                    lineHeight: leading.relaxed,
                    margin: '0 0 12px 0',
                    maxWidth: '420px',
                    background: palette.sageMist || 'transparent',
                    padding: space.sm + 'px ' + space.md + 'px',
                    borderRadius: radius.sm,
                    borderLeft: '3px solid ' + palette.sage + '40',
                  }
                }, field.sectionIntro)
              );
            }
          }
          elements.push(renderField(field));
          const crosslinkBtn = (key, view, textKey) => onNavigate && elements.push(
            React.createElement('button', {
              key: 'crosslink-' + key,
              onClick: () => onNavigate(view),
              style: {
                gridColumn: '1 / -1',
                background: palette.sageMist || palette.up,
                border: 'none',
                borderRadius: radius.sm,
                padding: space.sm + 'px ' + space.md + 'px',
                fontSize: text.sm,
                color: palette.sageDeep || palette.mid,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                marginBottom: space.sm + 'px',
              }
            }, t(textKey))
          );
          // Mehrere verwandte Links zu einem Feld → eine ruhige Box statt gestapelter Buttons
          const crosslinkBundle = (items) => onNavigate && elements.push(
            React.createElement('div', {
              key: 'crosslink-bundle-' + field.k,
              style: {
                gridColumn: '1 / -1',
                background: palette.sageMist || palette.up,
                borderRadius: radius.sm,
                padding: space.sm + 'px ' + space.md + 'px',
                marginBottom: space.sm + 'px',
              }
            },
              React.createElement('div', {
                style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sageDeep || palette.mid, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: space.xs + 'px' }
              }, t('nav.crosslink.relatedTitle')),
              items.map(([key, view, textKey]) => React.createElement('button', {
                key: 'crosslink-' + key,
                onClick: () => onNavigate(view),
                style: {
                  display: 'block', width: '100%',
                  background: 'transparent', border: 'none',
                  padding: space.xs + 'px 0',
                  fontSize: text.sm, color: palette.sageDeep || palette.mid,
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }
              }, t(textKey)))
            )
          );
          if (field.k === 'kkPremium' && chapter.key === 'versicherungen') {
            crosslinkBtn('ipv', 'premium', 'nav.crosslink.ipvHint');
          }
          if (field.k === 'kkInsurer' && chapter.key === 'versicherungen') {
            crosslinkBtn('praemien', 'praemien', 'nav.crosslink.praemienHint');
          }
          if (field.k === 'bvgContribution' && chapter.key === 'versicherungen') {
            crosslinkBtn('vorsorge', 'vorsorge', 'nav.crosslink.vorsorgeHint');
          }
          if (field.k === 'educationLevel' && chapter.key === 'ausbildung') {
            const eduLink = { display: 'inline-block', fontSize: text.xs, color: palette.skyDeep, marginTop: space.sm + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' };
            const pathItem = (titleKey, bodyKey) => React.createElement('div', { key: titleKey, style: { marginBottom: space.sm + 'px' } },
              React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm, color: palette.text } }, tr('edu.' + titleKey)),
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } }, tr('edu.' + bodyKey))
            );
            elements.push(
              React.createElement('details', {
                key: 'edu-paths',
                style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, borderRadius: radius.sm, padding: space.md + 'px', marginBottom: space.sm + 'px' }
              },
                React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text } }, 'ⓘ ' + tr('edu.pathsTitle')),
                React.createElement('div', { style: { marginTop: space.md + 'px' } },
                  React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.md + 'px' } }, tr('edu.pathsIntro')),
                  pathItem('path1Title', 'path1'),
                  pathItem('path2Title', 'path2'),
                  pathItem('path3Title', 'path3'),
                  React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginTop: space.sm + 'px' } }, tr('edu.pathsHow')),
                  React.createElement('a', { href: 'https://www.berufsbildung.ch/de/lexikon/berufsabschluss-fuer-erwachsene', target: '_blank', rel: 'noopener noreferrer', style: eduLink }, '→ ' + tr('edu.pathsLink'))
                )
              )
            );
          }
          if (field.k === 'workHoursPerWeek' && chapter.key === 'ausbildung') {
            const hrs = parseFloat(String(data.workHoursPerWeek || '').replace(',', '.')) || 0;
            if (hrs > 0) {
              const perMonth = stundenAufMonat(hrs);
              const perYear = stundenAufJahr(hrs);
              const kanton = allData && allData.basis && allData.basis.canton;
              const monthlyIncome = parseFloat(allData && allData.finanzen && allData.finanzen.monthlyIncome) || 0;
              // Einkommensart mitgeben (Mindestlohn = brutto) — sonst rechnet dieser zweite
              // Aufrufer einen Netto-Lohn gegen den Brutto-Boden, während das Finanzen-Kapitel
              // korrekt schweigt. Fünf Stellen rechneten diesen Befund, jede etwas anders.
              const check = monthlyIncome > 0
                ? pruefeStundenlohn(monthlyIncome, hrs, kanton, allData?.finanzen?.incomeType)
                : null;
              elements.push(
                React.createElement('div', {
                  key: 'hours-calc',
                  style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                },
                  React.createElement('div', null, tr('lohnCheck.hoursEquiv', { month: String(perMonth), year: String(perYear) })),
                  // ⚠️ NUR bei brutto-Basis (Predeploy-Runde 8, dritte Prüfung): Die Umsortierung
                  // in `pruefeStundenlohn` gibt `lohnStunde` jetzt AUCH bei 'basisUnklar' zurück —
                  // für einen Netto-Nutzer wäre das der Netto-Stundenlohn, hier im
                  // Mindestlohn-Kontext (Brutto) unbeschriftet gezeigt. Genau die Netto/Brutto-
                  // Vermengung, die diese Runde überall sonst trennt. Ohne belegte Brutto-Basis
                  // steht die Umrechnung „Std./Monat" da, aber kein „Stundenlohn: CHF X".
                  check && check.lohnStunde != null && allData?.finanzen?.incomeType === 'brutto' && React.createElement('div', { style: { marginTop: space.xs + 'px' } }, tr('lohnCheck.hourlyWage', { wage: check.lohnStunde.toFixed(2) }))
                )
              );
              if (check && check.status === 'unterMindestlohn') {
                elements.push(
                  React.createElement('div', {
                    key: 'hours-minwage-warn',
                    style: { gridColumn: '1 / -1', background: palette.rose + '15', border: '1px solid ' + palette.rose + '40', borderLeft: '3px solid ' + palette.rose, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.roseDeep, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                  },
                    // FIX D: pro-Kanton-Jahr (check.jahr), nicht das globale LOHNCHECK_DATA_VERSION —
                    // sonst zeigte ein TI-Nutzer im Kapitel ein anderes Jahr als im Brief.
                    tr('lohnCheck.unterMindestlohn', { kanton: check.kanton, mindestStunde: check.mindestStunde.toFixed(2), lohnStunde: check.lohnStunde.toFixed(2), jahr: check.jahr || LOHNCHECK_DATA_VERSION, stelle: lohnKontrollstelleText(check.kanton, tr), ausnahmen: tr('lohnCheck.ausnahmen') })
                  )
                );
                // ⚠️ Der Brief-Knopf ruht (`WAGECLAIM_BEREIT === false`): Der Befund kennt
                // die gesetzlichen Ausnahmen nicht (Lehre/Praktikum/unter 18/GAV; GE hat drei
                // Sätze), also darf aus ihm kein Einschreiben an einen Arbeitgeber entstehen.
                // Begründung + Belege bei der Konstante in `data/lohnCheck.js`.
                // Keine Sackgasse: der Befund nennt die Ausnahmen und die zuständige Stelle.
                if (WAGECLAIM_BEREIT && onNavigate) {
                  elements.push(
                    React.createElement('button', {
                      key: 'hours-minwage-nextstep',
                      onClick: () => onNavigate('briefe', undefined, 'wageClaim'),
                      style: { gridColumn: '1 / -1', justifySelf: 'start', background: 'none', border: '1px solid ' + palette.rose + '55', borderRadius: radius.sm, padding: space.xs + 'px ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.medium, color: palette.roseDeep, cursor: 'pointer', marginBottom: space.sm + 'px' }
                    }, tr('lohnCheck.nextStepLink') + ' →')
                  );
                }
              }
            }
            // Multi-Job — weitere / frühere Anstellungen
            const additionalJobs = Array.isArray(data.additionalJobs) ? data.additionalJobs : [];
            elements.push(
              React.createElement('div', { key: 'jobs-section', style: { gridColumn: '1 / -1', marginTop: space.md + 'px', marginBottom: space.md + 'px' } },
                React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.xs + 'px' } }, tr('jobs.sectionTitle')),
                React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, fontStyle: 'italic', marginBottom: space.sm + 'px' } }, tr('jobs.sectionHint')),
                React.createElement(React.Suspense, { fallback: null },
                  React.createElement(JobManager, {
                    palette, t: tr, jobs: additionalJobs,
                    onChange: (jobs) => onUpdate('additionalJobs', jobs),
                  })
                )
              )
            );
          }
          if (field.k === 'rentAmount' && chapter.key === 'wohnen') {
            crosslinkBtn('budget', 'sync', 'nav.crosslink.budgetHint');
          }
          if (field.k === 'utilities' && chapter.key === 'wohnen') {
            const monthlyNK = parseFloat(data.utilities) || 0;
            if (monthlyNK > 0) {
              elements.push(
                React.createElement('div', {
                  key: 'nk-hint',
                  style: {
                    gridColumn: '1 / -1',
                    background: palette.sageMist || palette.up,
                    borderRadius: radius.sm,
                    padding: space.sm + 'px ' + space.md + 'px',
                    fontSize: text.sm,
                    color: palette.sageDeep || palette.mid,
                    lineHeight: leading.relaxed,
                    marginBottom: space.sm + 'px',
                  }
                }, 'ⓘ ' + t('wohnen.nkEstimate', { monthly: Math.round(monthlyNK), annual: Math.round(monthlyNK * 12) }))
              );
            }
          }
          if (field.k === 'jobTitle' && chapter.key === 'ausbildung') {
            const kanton = allData && allData.basis && allData.basis.canton;
            if (kanton && kantonHatMindestlohn(kanton)) {
              onNavigate && elements.push(
                React.createElement('button', {
                  key: 'crosslink-mindestlohn',
                  onClick: () => onNavigate('chapter', 2),
                  style: {
                    gridColumn: '1 / -1',
                    background: palette.sageMist || palette.up,
                    border: 'none', borderRadius: radius.sm,
                    padding: space.sm + 'px ' + space.md + 'px',
                    fontSize: text.sm, color: palette.sageDeep || palette.mid,
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    marginBottom: space.sm + 'px',
                  }
                }, t('nav.crosslink.mindestlohnHint'))
              );
            }
          }
          if (field.k === 'educationLevel' && chapter.key === 'ausbildung') {
            crosslinkBtn('educationTax', 'tax', 'nav.crosslink.educationTaxHint');
          }
          if (field.k === 'taxFilingDeadline' && chapter.key === 'behoerden') {
            crosslinkBtn('taxFromBehoerden', 'tax', 'nav.crosslink.taxFromBehoerdenHint');
          }
          if (field.k === 'betreibungsStatus' && chapter.key === 'behoerden') {
            crosslinkBtn('schuldenFromBehoerden', 'schulden', 'nav.crosslink.schuldenFromBehoerdenHint');
          }
          // Nicht-zutreffende Sektion (Alimente ohne Kinder): eingeklappt + gedämpft,
          // aber erkundbar — mit ehrlicher Orientierung statt Zahlen-Versprechen.
          if (field.k === 'alimentePaid' && chapter.key === 'finanzen') {
            const kids = (allData && allData.basis && allData.basis.household && Array.isArray(allData.basis.household.children)) ? allData.basis.household.children.length : 0;
            const notApplicable = kids === 0;
            elements.push(
              React.createElement('details', {
                key: 'alimente-orientierung',
                open: !notApplicable,
                style: {
                  gridColumn: '1 / -1',
                  background: notApplicable ? palette.up : (palette.sageMist || palette.up),
                  borderRadius: radius.sm,
                  padding: space.sm + 'px ' + space.md + 'px',
                  marginBottom: space.sm + 'px',
                  opacity: notApplicable ? 0.72 : 1,
                }
              },
                React.createElement('summary', {
                  style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: notApplicable ? palette.mid : (palette.sageDeep || palette.text) }
                }, 'ⓘ ' + tr('alimentInfo.title') + ' — ' + tr(notApplicable ? 'alimentInfo.summaryNA' : 'alimentInfo.summaryActive')),
                React.createElement('div', { style: { marginTop: space.sm + 'px', fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } },
                  React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0' } }, tr('alimentInfo.noFormula')),
                  React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0' } }, tr('alimentInfo.magnitude')),
                  React.createElement('p', { style: { margin: 0 } }, tr('alimentInfo.binding')),
                  React.createElement('a', {
                    href: 'https://www.gerichte-zh.ch/themen/partnerschaft/hilfen/unterhaltsberechnung.html',
                    target: '_blank', rel: 'noopener noreferrer',
                    style: { display: 'inline-block', marginTop: space.sm + 'px', fontSize: text.sm, color: palette.skyDeep, textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
                  }, '→ ' + tr('alimentInfo.linkLabel'))
                )
              )
            );
          }
          if (field.k === 'monthlyIncome' && chapter.key === 'finanzen') {
            crosslinkBundle([
              ['tax', 'tax', 'nav.crosslink.taxHint'],
              ['ipvIncome', 'premium', 'nav.crosslink.ipvFromIncome'],
              ['sozialhilfe', 'sozialhilfe', 'nav.crosslink.sozialhilfeHint'],
              ['finanzuebersicht', 'finanzuebersicht', 'nav.crosslink.finanzuebersichtHint'],
            ]);
            const kanton = allData && allData.basis && allData.basis.canton;
            if (kanton && kantonHatMindestlohn(kanton)) {
              const lohn = parseFloat(data[field.k]) || 0;
              if (lohn > 0) {
                // WAHRHEITS-DISZIPLIN: keine 182h-Vollzeit-Annahme mehr. Bei Teilzeit erzeugte sie
                // einen Fehlalarm (CHF 3000 bei 50% = 32.97/Std., nicht 16.48/Std.) — und der Befund
                // führt neu zu einem Brief an den Arbeitgeber. Ohne echte Stunden lieber ruhig
                // nachfragen als raten; `pruefeStundenlohn` meldet das selbst als 'unvollstaendig'.
                const wHrs = parseFloat(String(allData && allData.ausbildung && allData.ausbildung.workHoursPerWeek || '').replace(',', '.')) || 0;
                // Einkommensart mitgeben: der Mindestlohn ist ein BRUTTO-Stundenlohn, und der
                // Feld-Hinweis rät zu Netto. Ohne bekannte Basis kein Befund ('basisUnklar').
                const result = pruefeStundenlohn(lohn, wHrs, kanton, data.incomeType);
                if (result.status === 'unvollstaendig' && onNavigate) {
                  elements.push(
                    React.createElement('button', {
                      key: 'mindestlohn-hours-missing',
                      onClick: () => onNavigate('chapter', 4),
                      style: {
                        gridColumn: '1 / -1',
                        justifySelf: 'stretch',
                        textAlign: 'left',
                        background: palette.sageMist || palette.up,
                        border: 'none',
                        borderRadius: radius.sm,
                        padding: space.sm + 'px ' + space.md + 'px',
                        fontSize: text.sm,
                        color: palette.sageDeep || palette.mid,
                        lineHeight: leading.relaxed,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        marginBottom: space.sm + 'px',
                      }
                    }, tr('lohnCheck.hoursMissing') + ' →')
                  );
                }
                // Basis unbekannt → ruhige Einladung, wie bei den fehlenden Stunden.
                // Kein Alarm: die App weiss es nicht, statt es besser zu wissen.
                if (result.status === 'basisUnklar') {
                  elements.push(
                    React.createElement('div', {
                      key: 'mindestlohn-basis-unklar',
                      style: {
                        gridColumn: '1 / -1',
                        background: palette.sageMist || palette.up,
                        borderRadius: radius.sm,
                        padding: space.sm + 'px ' + space.md + 'px',
                        fontSize: text.sm,
                        color: palette.sageDeep || palette.mid,
                        lineHeight: leading.relaxed,
                        marginBottom: space.sm + 'px',
                      }
                    }, tr(result.einkommensart === 'netto' ? 'lohnCheck.basisNetto' : 'lohnCheck.basisMissing'))
                  );
                }
                if (result.status === 'unterMindestlohn') {
                  elements.push(
                    React.createElement('div', {
                      key: 'mindestlohn-warnung',
                      style: {
                        gridColumn: '1 / -1',
                        background: palette.rose + '15',
                        border: '1px solid ' + palette.rose + '40',
                        borderLeft: '3px solid ' + palette.rose,
                        borderRadius: radius.sm,
                        padding: space.sm + 'px ' + space.md + 'px',
                        fontSize: text.sm,
                        color: palette.roseDeep,
                        lineHeight: leading.relaxed,
                        marginBottom: space.sm + 'px',
                      }
                    },
                      t('lohnCheck.unterMindestlohn')
                        .replace('{kanton}', kanton)
                        .replace('{mindestStunde}', result.mindestStunde.toFixed(2))
                        .replace('{lohnStunde}', result.lohnStunde.toFixed(2))
                        // FIX D: pro-Kanton-Jahr, nicht global (TI-Konsistenz Kapitel↔Brief).
                        .replace('{jahr}', result.jahr || LOHNCHECK_DATA_VERSION)
                        // 🔴 Predeploy-Runde 8: Hier stand fest „beim kantonalen
                        // Arbeitsinspektorat" — das gibt es unter diesem Namen in JU (gar
                        // keine Kontrollstelle), BS (AWA) und NE (ORCT) nicht. Der Diff legte
                        // die kantonsgenaue Registry für den BRIEF an, das Kapitel zeigte
                        // weiter auf eine erfundene Sammelstelle. Jetzt dieselbe Quelle.
                        // Funktions-Replacer für die PROSA-Platzhalter (Stelle, Ausnahmen):
                        // `String.replace(str, str)` würde ein `$`-Zeichen im eingesetzten Text
                        // als Ersetzungs-Muster lesen ($&, $1, …) und den Text verstümmeln.
                        // Ein Funktions-Replacer gibt ihn wörtlich zurück (Predeploy-Runde 8,
                        // dritte Prüfung). Die Zahl-/Code-Platzhalter oben sind ungefährlich.
                        .replace('{stelle}', () => lohnKontrollstelleText(kanton, tr))
                        // Der Befund kennt die Ausnahmen nicht → er nennt sie, statt eine
                        // Rechtsverletzung festzustellen (siehe `WAGECLAIM_BEREIT`).
                        .replace('{ausnahmen}', () => tr('lohnCheck.ausnahmen'))
                    )
                  );
                  // ⚠️ Brief-Knopf ruht — siehe `WAGECLAIM_BEREIT` in data/lohnCheck.js.
                  if (WAGECLAIM_BEREIT && onNavigate) {
                    elements.push(
                      React.createElement('button', {
                        key: 'mindestlohn-nextstep',
                        onClick: () => onNavigate('briefe', undefined, 'wageClaim'),
                        style: { gridColumn: '1 / -1', justifySelf: 'start', background: 'none', border: '1px solid ' + palette.rose + '55', borderRadius: radius.sm, padding: space.xs + 'px ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.medium, color: palette.roseDeep, cursor: 'pointer', marginBottom: space.sm + 'px' }
                      }, t('lohnCheck.nextStepLink') + ' →')
                    );
                  }
                }
              }
            }
          }
          if (field.k === 'moveInDate' && chapter.key === 'wohnen' && data[field.k]) {
            elements.push(
              React.createElement('div', {
                key: 'umzug-checklist',
                style: {
                  gridColumn: '1 / -1',
                  background: palette.sageMist || palette.up,
                  borderRadius: radius.sm,
                  padding: space.sm + 'px ' + space.md + 'px',
                  fontSize: text.sm,
                  color: palette.sageDeep || palette.mid,
                  lineHeight: leading.relaxed,
                  marginBottom: space.sm + 'px',
                }
              },
                React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.xs + 'px' } }, t('wohnen.umzugTitle')),
                React.createElement('div', null, 'ⓘ ' + t('wohnen.umzugGemeinde')),
                React.createElement('div', null, 'ⓘ ' + t('wohnen.umzugKK')),
                React.createElement('div', null, 'ⓘ ' + t('wohnen.umzugPost')),
              )
            );
          }
          if (field.k === 'canton' && chapter.key === 'basis') {
            crosslinkBtn('cantonTax', 'tax', 'nav.crosslink.cantonTaxHint');
            crosslinkBtn('cantonSozial', 'sozialhilfe', 'nav.crosslink.cantonSozialhilfeHint');
            onNavigate && elements.push(
              React.createElement('button', {
                key: 'crosslink-addressWohnen',
                onClick: () => onNavigate('chapter', 1),
                style: {
                  gridColumn: '1 / -1',
                  background: palette.sageMist || palette.up,
                  border: 'none',
                  borderRadius: radius.sm,
                  padding: space.sm + 'px ' + space.md + 'px',
                  fontSize: text.sm,
                  color: palette.sageDeep || palette.mid,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  marginBottom: space.sm + 'px',
                }
              }, t('nav.crosslink.addressInWohnen'))
            );
          }
          if (field.k === 'kkModel' && chapter.key === 'versicherungen') {
            crosslinkBtn('kkModel', 'praemien', 'nav.crosslink.kkModelHint');
          }
          if (field.k === 'emergencyContact' && chapter.key === 'notfall') {
            crosslinkBtn('notfallkarte', 'notfalleinstieg', 'nav.crosslink.notfallkarteHint');
          }
          return elements;
        })
      ),

      // Progressive disclosure toggle
      hasSecondaryFields && React.createElement('div', {
        style: {
          marginTop: space.lg,
          paddingTop: '16px',
          borderTop: '1px solid ' + palette.border,
          textAlign: 'center',
        }
      },
        React.createElement('button', {
          onClick: toggleSecondary,
          'aria-expanded': showSecondary,
          style: {
            background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: text.sm, color: palette.text, letterSpacing: '0.3px',
            padding: '8px 16px',
            fontFamily: fontFamily,
          }
        },
          React.createElement('span', null,
            showSecondary
              ? tr('chapterView.disclosure.' + chapter.key + '.less')
              : tr('chapterView.disclosure.' + chapter.key + '.more')
          ),
          // Aufklapp-Pfeil — dreht beim Öffnen (macht klar: es kommen mehr Felder, keine Info).
          React.createElement('span', {
            'aria-hidden': 'true',
            style: { display: 'inline-flex', transition: `transform ${duration.normal}ms ${ease}`, transform: showSecondary ? 'rotate(180deg)' : 'none', color: palette.mid },
          },
            React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
              React.createElement('polyline', { points: '6 9 12 15 18 9' })
            )
          )
        ),
        !showSecondary && secondaryHasData && React.createElement('div', {
          style: { fontSize: text.xs, color: palette.sageDeep, marginTop: space.xs }
        }, tr('chapterView.disclosure.' + chapter.key + '.hint'))
      ),

      // Secondary fields
      hasSecondaryFields && showSecondary && React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '0 16px', marginTop: space.sm }
      },
        chapter.fields.filter(f => f.secondary).map((field, idx, secFields) => {
          const elements = [];
          if (field.section) {
            const isFirst = idx === 0 || !secFields.slice(0, idx).some(f => f.section);
            elements.push(
              React.createElement('div', {
                key: 'section-' + field.k,
                id: 'mp-section-' + field.k,
                'data-section-k': field.k,
                role: 'presentation',
                'aria-label': field.section,
                style: {
                  // scroll-margin, damit der klebende Reiter das Ziel nicht verdeckt
                  scrollMarginTop: '64px',
                  gridColumn: '1 / -1',
                  marginTop: isFirst ? '8px' : space['2xl'] + 'px',
                  paddingTop: isFirst ? 0 : space.lg + 'px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.sage + '18',
                  fontSize: text.sm,
                  fontWeight: weight.medium,
                  color: palette.sageDeep || palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: space.sm + 'px',
                }
              }, field.section)
            );
            if (field.sectionIntro) {
              elements.push(
                React.createElement('p', {
                  key: 'sectionIntro-' + field.k,
                  style: {
                    gridColumn: '1 / -1',
                    fontSize: text.sm,
                    color: palette.sageDeep || palette.sage,
                    fontStyle: 'italic',
                    lineHeight: leading.relaxed,
                    margin: '0 0 12px 0',
                    maxWidth: '420px',
                    background: palette.sageMist || 'transparent',
                    padding: space.sm + 'px ' + space.md + 'px',
                    borderRadius: radius.sm,
                    borderLeft: '3px solid ' + palette.sage + '40',
                  }
                }, field.sectionIntro)
              );
            }
          }
          elements.push(renderField(field));
          if (field.k === 'vorsorgeauftrag' && chapter.key === 'notfall') {
            elements.push(renderBeistandWegweiser());
          }
          return elements;
        })
      )
    ),

    // Documents Tab
    expandedSection === 'documents' && chapter.docs && React.createElement('div', null,
      React.createElement(PanelTitle, { palette, style: { marginBottom: space.md } }, '↗ ' + tr('chapterView.upload')),

      // Upload Form
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, border: '2px dashed ' + palette.border } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' } },
          React.createElement('div', null,
            React.createElement('label', { htmlFor: 'doc-upload-type', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, display: 'block', marginBottom: space.sm - 2 } }, tr('chapterView.docType') + ' *'),
            React.createElement('select', {
              id: 'doc-upload-type',
              value: uploadType,
              onChange: (e) => setUploadType(e.target.value),
              style: { width: '100%', padding: '10px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
            },
              React.createElement('option', { value: '' }, tr('chapterView.selectOption')),
              chapter.docs.map((doc, idx) => React.createElement('option', { key: idx, value: doc.k }, doc.label))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { htmlFor: 'doc-upload-expiry', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, display: 'block', marginBottom: space.sm - 2 } }, tr('chapterView.expiryDate') + ' *'),
            React.createElement('input', {
              id: 'doc-upload-expiry',
              type: 'date',
              value: uploadExpiry,
              onChange: (e) => setUploadExpiry(e.target.value),
              style: { width: '100%', padding: '10px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
            }),
            uploadType && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, 'ⓘ ' + getFileExpiryHint(uploadType, tr))
          )
        ),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.surface, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          '□ ' + tr('chapterView.selectFile'),
          React.createElement('input', {
            type: 'file',
            onChange: (e) => setUploadFile(e.target.files?.[0]),
            style: { display: 'none' }
          })
        ),

        uploadError && React.createElement('div', { style: { padding: space.sm + 2, background: palette.rose + '22', border: '1px solid ' + palette.rose, borderRadius: radius.sm, color: palette.roseDeep, fontSize: text.sm, marginBottom: space.sm + 4 } }, uploadError),

        uploadSuccess && React.createElement('div', { style: { padding: space.sm + 2, background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.sm, color: palette.sageDeep, fontSize: text.sm, marginBottom: space.sm + 4 } }, '✓ ' + uploadSuccess),

        React.createElement('button', {
          onClick: () => {
            if (!uploadFile) { setUploadError(tr('chapterView.selectFile')); return; }
            if (!uploadType) { setUploadError(tr('chapterView.selectDocType')); return; }
            if (!uploadExpiry) { setUploadError(tr('chapterView.selectExpiry')); return; }
            // Grössen-Guard: Dokumente liegen in IndexedDB (deutlich grösseres
            // Kontingent als localStorage). Sehr grosse Dateien trotzdem ruhig
            // begrenzen, damit Backups handhabbar bleiben.
            const MAX_DOC_BYTES = 20 * 1024 * 1024;
            if (uploadFile.size > MAX_DOC_BYTES) { setUploadError(tr('chapterView.fileTooLarge', { max: '20 MB' })); return; }
            setUploadError('');
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                await onAddDocument({
                  type: uploadType,
                  fileName: uploadFile.name,
                  fileSize: (uploadFile.size / 1024).toFixed(1) + ' KB',
                  uploadDate: new Date().toLocaleDateString('de-CH'),
                  expiryDate: uploadExpiry,
                  status: 'active',
                  data: reader.result
                });
                runtimeEventBus.publish({
                  id: crypto.randomUUID(),
                  eventType: 'DOCUMENT_UPLOADED',
                  timestamp: new Date().toISOString(),
                  actor: 'user',
                  workflowId: 'document-tresor',
                });
                setUploadFile(null);
                setUploadType('');
                setUploadExpiry('');
              } catch (err) {
                setUploadError(tr('chapterView.uploadError') + ': ' + err.message);
              }
            };
            reader.readAsDataURL(uploadFile);
          },
          disabled: !uploadFile || !uploadType || !uploadExpiry,
          style: {
            width: '100%',
            padding: '10px',
            background: uploadFile && uploadType && uploadExpiry ? palette.sageBtn : palette.mid,
            color: '#fff',
            border: 'none',
            borderRadius: radius.sm,
            cursor: uploadFile && uploadType && uploadExpiry ? 'pointer' : 'not-allowed',
            fontWeight: weight.semi,
            fontSize: text.sm
          }
        }, '↗ ' + tr('chapterView.upload'))
      ),

      // Required documents list
      React.createElement('div', { style: { padding: space.sm + 4, background: palette.up, borderRadius: radius.sm } },
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm + 2 } }, '□ ' + tr('chapterView.requiredDocs')),
        React.createElement('ul', { style: { fontSize: text.sm, paddingLeft: '20px', margin: 0 } },
          chapter.docs.map((doc, idx) => React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc.label))
        )
      ),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '12px', letterSpacing: '0.2px' } },
        tr('chapterView.trustDocuments')
      )
    ),

    // Nächstes Thema — Testperson A: am Kapitelende ruhig weitergehen, ohne hochzuscrollen.
    nextChapter && onNext ? React.createElement('button', {
      type: 'button',
      onClick: onNext,
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md + 'px',
        width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
        marginTop: space.xl + 'px', padding: space.md + 'px ' + space.lg + 'px',
        background: palette.surface, border: '1px solid ' + palette.border,
        borderRadius: radius.md, color: palette.text,
        transition: 'background 160ms ease, border-color 160ms ease',
      },
      onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sand + '66'; },
      onMouseLeave: (e) => { e.currentTarget.style.background = palette.surface; e.currentTarget.style.borderColor = palette.border; },
    },
      React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 } },
        React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, tr('chapterView.nextTopic')),
        React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.semi } }, nextChapter.title),
      ),
      React.createElement('span', { style: { color: palette.sandDeep, fontSize: text.lg, flexShrink: 0 } }, '→'),
    ) : null,

    // Chapter arrival — quiet rest moment when enough data is present
    (() => {
      const primaryFields = chapter.fields.filter(f => !f.secondary);
      const primaryFilled = primaryFields.filter(f => data[f.k]).length;
      const threshold = Math.ceil(primaryFields.length * 0.6);
      if (primaryFilled < threshold) return null;
      const allPrimaryFilled = primaryFilled === primaryFields.length;
      const ruheText = tr('ruhe.' + chapter.key);
      const stilleText = tr('stille.' + chapter.key);
      const hasRuhe = ruheText && ruheText !== 'ruhe.' + chapter.key;
      const hasStille = stilleText && stilleText !== 'stille.' + chapter.key;
      if (!hasRuhe && !hasStille) return null;
      return React.createElement('div', {
        style: {
          textAlign: 'center',
          paddingTop: space['2xl'] + 'px',
          paddingBottom: space.lg + 'px',
          marginTop: space.xl + 'px',
          borderTop: '1px solid ' + palette.border + '44',
        }
      },
        hasRuhe && !allPrimaryFilled && React.createElement('p', {
          style: {
            fontSize: text.sm,
            color: palette.mid,
            fontStyle: 'italic',
            letterSpacing: '0.3px',
            margin: 0,
          }
        }, ruheText),
        allPrimaryFilled && hasStille && React.createElement('div', {
          style: { animation: 'fadeIn 1s ease' }
        },
          React.createElement('p', {
            style: {
              fontSize: text.body,
              color: palette.text,
              fontStyle: 'italic',
              letterSpacing: '0.2px',
              margin: '0 0 ' + space.md + 'px 0',
              lineHeight: leading.relaxed,
            }
          }, stilleText),
          React.createElement('div', {
            style: { width: '32px', height: '1px', background: palette.border, margin: '0 auto' }
          })
        )
      );
    })()
  );
};

export default ChapterViewComplete;
