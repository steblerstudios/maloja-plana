import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { feldNameOhneEinheit } from './utils/feldName.js';
import { useDateiAblage } from './hooks/useDateiAblage.js';
import { I18nContext } from './i18n/index.js';
import { tMitRueckfall } from './utils/tRueckfall.js';
import {
  validatePhone, validateAHV, validateEmail, validatePostalCode, getFileExpiryHint, formatAHVOnInput, normalizeEmail, formatPhoneOnBlur
} from './validationUtils.js';
import { Icon, hinweisZeichen, aufklappZeichen } from './IconSystem.jsx';
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, leading, space, radius, fontFamily, fontFamilyDisplay, duration, ease, visuallyHiddenStyle } from './config/tokens.js';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import MirrorCards from './MirrorCards.jsx';
import { blutgruppeLabel } from './utils/blutgruppe.js';
import { kapitelBereichsfarbe, bereichsTon } from './utils/lebensbereichFruechte.js';
import { betrag } from './utils/geld.js';
import { ExternerLink } from './components/ExternerLink.jsx';
import { kantonHatMindestlohn, stundenAufMonat, stundenAufJahr, pruefeStundenlohn, wochenstundenUnplausibel, LOHNCHECK_DATA_VERSION, WAGECLAIM_BEREIT } from './data/lohnCheck.js';
import { lohnStelleSatz } from './data/lohnRechtsstellen.js';
// Ein Blatt ohne eigene Importe — kostet hier nichts ausser sich selbst.
import { einzahlungenImJahr } from './data/saeule3a.js';
import { openPrintWindow, escapeHtml, formatDE } from './utils/helpers.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { TrustLockIcon } from './components/TrustLockIcon.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
// Nicht lazy: «oben» ist der Knopf für den Ernstfall — er soll ohne Nachladen dastehen.
import { NotfallImKapitel, NotfallErnstfallKnopf, NOTFALL_ANGABEN } from './components/NotfallImKapitel.jsx';
import { useIsMobile } from './hooks/useIsMobile.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { PLZAutocomplete } from './PLZAutocomplete.jsx';
import { ItemizedAmount } from './ItemizedAmount.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
import { trifftNichtZu, NA_FELD, feldHatWert, postenSumme } from './utils/vollstaendigkeit.js';
import { keineKontaktperson, keineMedikamente, naGruppeUmschalten, naVerdeckt, naKopplung } from './utils/naGruppen.js';
import { ansichtIkon, ansichtName, SEARCH_VIEWS } from './config/ansichtenRegister.js';
import { erwachseneImHaushalt, zeigtPartnereinkommen, zweitePersonFehlt } from './utils/partnereinkommen.js';
import { zahl } from './utils/geld.js';
import { kalenderdatum } from './utils/datumAnzeige.js';
import { abschnittGruppen } from './utils/abschnitte.js';
// Dasselbe Bild wie das Bergpanorama der Übersicht (BergLandschaft) — im Cache, kein zweiter Download.
import landschaft from './assets/berge/landschaft.webp?url';
import { sumAllExpenses, eigeneEinnahmen, monatsAusgaben } from './utils/monatsrechnung.js';
import { calculateMonthlyBudget } from './budgetSync.js';
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
// Jetzt spiegelt `lohnStelleSatz` (data/lohnRechtsstellen.js) `wageClaimRefs` — eine
// Quelle, eine Regel. Seit 19.10.2026 dort, damit auch der Stundenlohn-Rechner sie nutzt.

const MedicationManager = React.lazy(() => import('./MedicationManager.jsx'));
const DoctorManager = React.lazy(() => import('./DoctorManager.jsx'));
const DiseaseManager = React.lazy(() => import('./DiseaseManager.jsx'));
const Saeule3aTracker = React.lazy(() => import('./Saeule3aTracker.jsx'));
const LanguageManager = React.lazy(() => import('./LanguageManager.jsx'));
const JobManager = React.lazy(() => import('./JobManager.jsx'));
// Die Auswertung der Finanzen (früher die Finanz-Übersicht) — nur im Kapitel Finanzen gebraucht.
const FinanzenImKapitel = React.lazy(() => import('./components/FinanzAuswertung.jsx').then((m) => ({ default: m.FinanzenImKapitel })));// Spinnennetz der Versicherungs-Abschnitte (24.10.2026) — nur im Kapitel Versicherungen gebraucht.
const VersicherungsNetz = React.lazy(() => import('./components/VersicherungsNetz.jsx'));
// Der Mietvergleich (früher auf der Finanz-Übersicht unter dem Lohn) — nur im Kapitel Wohnen.
const WohnkostenInstrument = React.lazy(() => import('./components/WohnkostenInstrument.jsx').then((m) => ({ default: m.WohnkostenInstrument })));
const BehoerdenInstrument = React.lazy(() => import('./components/BehoerdenInstrument.jsx').then((m) => ({ default: m.BehoerdenInstrument })));
const LohnEinordnung = React.lazy(() => import('./components/LohnEinordnung.jsx').then((m) => ({ default: m.LohnEinordnung })));
const LebenslaufVorschau = React.lazy(() => import('./components/LebenslaufVorschau.jsx').then((m) => ({ default: m.LebenslaufVorschau })));
const VersicherungenInstrument = React.lazy(() => import('./components/VersicherungenInstrument.jsx').then((m) => ({ default: m.VersicherungenInstrument })));

// K62.3: Wann das Feld «Nettolohn Partner/in» erscheint. Die Steuerschätzung braucht die Angabe bei
// «verheiratet» (sonst keine Zahl, R4) und im Konkubinat (Zivilstand-Vergleich, K62.5) — auch wenn
// im Haushalt erst eine Person erfasst ist. Eingetragene Partnerschaft zählt wie verheiratet.
// Die Regel steht in utils/partnereinkommen.js — dieselbe entscheidet, ob der Wert in Rechnungen zählt.
export { zeigtPartnereinkommen };

// K62-Nachlauf E: der Knopf «Person hinzufügen» im Hinweis öffnet nur die bestehende Erfassung —
// er holt den Knopf «Erwachsene/n hinzufügen» ins Bild und setzt den Fokus darauf. Er fügt nichts
// hinzu; IPV und Sozialhilfe ändern sich erst, wenn die Person wirklich erfasst ist.
export const ERWACHSENE_HINZUFUEGEN_ID = 'hh-add-adult';
export function zurErwachsenenErfassung(doc = typeof document !== 'undefined' ? document : null) {
  const knopf = doc && doc.getElementById(ERWACHSENE_HINZUFUEGEN_ID);
  if (!knopf) return false;
  if (typeof knopf.scrollIntoView === 'function') knopf.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (typeof knopf.focus === 'function') knopf.focus({ preventScroll: true });
  return true;
}

// Fassung 5 · Kapitel Finanzen (Entscheid 23.10.2026): die fünf Nebenerwerb-Felder erscheinen
// erst mit einem Nebenerwerb. Ein eigenes Ja/Nein-Feld gibt es nicht; als angegeben gilt er,
// sobald eines der fünf Felder einen Wert trägt oder als «trifft nicht zu» markiert ist —
// so geht kein gespeicherter Nebenerwerb unsichtbar verloren.
export const NEBENERWERB_FELDER = ['sideIncome', 'sideEmployer', 'sideEmployerAddress', 'sideHoursPerWeek', 'sideIncomeType'];
export const nebenerwerbAngegeben = (d) => NEBENERWERB_FELDER.some((k) => feldHatWert(d, k) || trifftNichtZu(d, k));

// Fassung 5 · «Jeden Monat bleiben»: dieselbe Rechnung wie der Satz «Es bleiben CHF …»
// (MirrorCards → utils/monatsrechnung.js). null nur, wenn keine Ausgaben erfasst sind.
// Seit 24.10.2026 (docs/entscheide/finanzen-fusion.md) auch im Minus und ohne eigenes
// Einkommen — ob der Block dann erscheint, entscheidet renderMonatsHeld. Vorher: null.
// `brutto`: ein eigener Lohn (Haupt- oder Nebenerwerb) ist ausdrücklich brutto erfasst (Fassung 6).
export const monatsUebersicht = (finanzen, allData) => {
  const { total: einkommen, brutto } = eigeneEinnahmen(finanzen);
  const verplant = sumAllExpenses(finanzen, allData);
  if (!(verplant > 0)) return null;
  const anteil = einkommen > 0 ? Math.min(100, Math.round((verplant / einkommen) * 100)) : 100;
  return { einkommen, verplant, bleibt: einkommen - verplant, anteil, brutto };
};

// Saldo des ganzen Haushalts, wie die Budget-Seite rechnet (budgetSync.js). Seit Fassung 6
// (24.10.2026) dieselben Posten wie das Kapitel, dazu nur Partner/in. Entscheid Stebler
// Studios 24.10.2026 (docs/entscheide/finanzen-fusion.md): beide Saldi zeigen, klar benannt —
// der zweite nur, wenn er auf den Franken vom Kapitel-Saldo abweicht. Ist ein weiterer Lohn
// (Nebenerwerb, Partner/in) brutto erfasst, gibt es keinen Haushalts-Betrag (wie im Budget), nur
// die Frage nach dem Netto. Ist der eigene Lohn brutto, schweigt die Zeile: die Zahl darüber rechnet
// selbst mit dem Brutto, und «rechnen wir aus, was frei bleibt» stünde ihr direkt entgegen
// (Fachprüfung 24.10.2026; wie die Hauptzahl bei brutto aussieht, ist offen — Entscheidungsblatt).
export const haushaltsSaldo = (allData, kapitelBleibt) => {
  if (!allData || eigeneEinnahmen(allData.finanzen).brutto) return null;
  const b = calculateMonthlyBudget(allData);
  if (!Number.isFinite(b.remaining)) return null;
  const rest = Math.round(b.remaining);
  if (rest === Math.round(kapitelBleibt)) return null;
  return b.bruttoDabei ? { brutto: true } : { brutto: false, rest };
};

export const ChapterViewComplete = ({ palette, t: tEingang, chapter, data, allData, onUpdate, onUpdateIn, onAddDocument, onNavigate, demoMode, simpleView, nextChapter, onNext, isDarkMode, anfangsOffen, chapters, onSelectChapter, lang, onEnterSandbox }) => {
  const vorlesen = useVorlesenContext();
  const isMobile = useIsMobile();
  const [expandedSection, setExpandedSection] = useState('fields');
  // Nebenerwerb: offen, wenn beim ersten Zeigen schon etwas erfasst ist — danach hält das
  // <details> seinen Zustand selbst (sonst klappte es beim Leeren des letzten Feldes zu).
  const nebenerwerbAnfangsOffen = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  // «oder hierher ziehen» stand schon da — jetzt tut die Fläche es auch.
  const [ablageProps, ablageAktiv] = useDateiAblage((e) => { setUploadFile(e.target.files?.[0]); setUploadError(''); });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Abschnittsliste: welche Abschnitte gerade als Formular offen sind (Schlüssel = erstes Feld).
  // (Die klebenden Themen-Reiter samt Scroll-Spy entfielen am 27.09.2026 — die Abschnitte
  // stehen jetzt selbst als kurze Liste da.)
  // Offen starten die Abschnitte, in denen etwas fehlt, das zählt (ein leeres Feld der
  // Grundordnung) oder ein Hinweis ansteht («zweite Person fehlt») — so sieht eine neue
  // Person gleich die Felder, und kein Hinweis verschwindet hinter «ändern ›».
  // `anfangsOffen: 'alle'` öffnet alles (Tests des Formulars).
  const abschnitteAnfang = () => {
    const d = data || {};
    const offen = {};
    abschnittGruppen(chapter.fields, chapter.title).forEach((g) => g.felder.forEach((f) => {
      const leerGrundordnung = f.mvo && !feldHatWert(d, f.k) && !trifftNichtZu(d, f.k);
      const hinweis = f.type === 'household' && zweitePersonFehlt(Number(d.household && d.household.adults) || 1, d.maritalStatus);
      if (anfangsOffen === 'alle' || leerGrundordnung || hinweis) offen[g.key] = true;
    }));
    return offen;
  };
  const [offeneAbschnitte, setOffeneAbschnitte] = useState(abschnitteAnfang);
  // Kapitelwechsel ohne Neuaufbau: die Regel gilt fürs neue Kapitel neu.
  useEffect(() => { setOffeneAbschnitte(abschnitteAnfang()); }, [chapter.key]); // eslint-disable-line react-hooks/exhaustive-deps
  const secondaryHasData = chapter.fields.filter(f => f.secondary).some(f => feldHatWert(data, f.k));
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

  // K64: ohne t kein roher Schlüssel mehr — Rückfall auf den I18n-Kontext, sonst
  // leerer Text (tMitRueckfall). useMemo → stabile Referenz, damit tr sauber als
  // useEffect-Dep dienen kann (t ist bereits memoisiert).
  const i18nKontext = useContext(I18nContext);
  const kontextT = i18nKontext ? i18nKontext.t : null;
  const tr = useMemo(() => tMitRueckfall(tEingang, kontextT, 'ChapterView'), [tEingang, kontextT]);
  const t = tr; // auch die direkten t(…)-Aufrufe unten laufen über den Rückfall
  // Export-Vorschau (K20) vor der Notfallkarte: erst zeigen, was im Dokument steht.
  const [kartenVorschau, setKartenVorschau] = useState(false);


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

    // Pill-group — consistent with field-based pills (Zivilstand): radiogroup mit benennender
    // Überschrift, je Pille role="radio" + aria-checked (Gate 24.09.2026, a11y).
    const hhPills = (groupId, labelText, opts, current, onSelect) =>
      React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('div', { id: groupId, style: hhLabel }, labelText),
        React.createElement('div', { role: 'radiogroup', 'aria-labelledby': groupId, style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          opts.map((opt, idx) => {
            const selected = current === opt.value;
            return React.createElement('button', {
              key: idx, type: 'button', role: 'radio', 'aria-checked': selected,
              onClick: () => onSelect(opt.value),
              style: {
                padding: '7px 14px', fontSize: text.sm, fontFamily: 'inherit',
                fontWeight: selected ? weight.semi : weight.normal,
                border: '1px solid ' + (selected ? palette.sage : palette.border),
                borderRadius: radius.sm + 'px',
                background: selected ? palette.sage + '18' : palette.surface,
                color: selected ? (palette.sageDeep || palette.sage) : palette.text,
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

        // K62-Nachlauf E: Zivilstand verheiratet / eingetragene Partnerschaft / Konkubinat, erfasst ist
        // nur eine Person → ein ruhiger Satz, kein Warnton. Dieselbe Regel wie das Partnereinkommen.
        zweitePersonFehlt(adultCount, data.maritalStatus) && React.createElement('p', {
          'data-hinweis': 'zweite-person',
          style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
        },
          tr('chapters.basis.fields.household.zweitePersonFehlt') + ' ',
          React.createElement('button', {
            type: 'button',
            onClick: () => zurErwachsenenErfassung(),
            style: { background: 'none', border: 'none', padding: '6px 0', minHeight: '24px', cursor: 'pointer', color: palette.sageDeep || palette.text, textDecoration: 'underline', fontSize: text.sm, fontFamily: fontFamily }
          }, tr('chapters.basis.fields.household.zweitePersonHinzufuegen'))
        ),

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
                'hh-adult-' + idx + '-rel-label',
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
          id: ERWACHSENE_HINZUFUEGEN_ID,
          onClick: () => setAdultsList([...adultsList, { name: '', relationship: '' }]),
          style: { background: 'none', border: '1px dashed ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', color: palette.mid, fontSize: text.sm, padding: space.sm + 'px ' + space.md + 'px', fontFamily: fontFamily }
        }, '+ ' + tr('chapters.basis.fields.household.addAdult'))
      ),

      // Partnereinkommen: bei 2+ Erwachsenen — K62.3 auch, wenn der Zivilstand «verheiratet» oder
      // «Konkubinat» ist und noch keine zweite Person erfasst wurde (die Steuerschätzung fragt danach).
      // Nur sichtbar machen, nichts vorbelegen und die Erwachsenen-Liste nicht ändern.
      zeigtPartnereinkommen(adultCount, data.maritalStatus) && React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('label', { htmlFor: 'hh-partner-income', style: hhLabel }, tr('chapters.basis.fields.household.partnerIncome')),
        React.createElement('input', {
          id: 'hh-partner-income',
          type: 'number', inputMode: 'decimal',
          // K62: 0 ist eine Antwort (kein Partnereinkommen) und bleibt als «0» sichtbar.
          value: household.partnerIncome ?? '',
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
        'hh-retired-label',
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
      parts.push(React.createElement('div', { key: 'or', style: { fontSize: text.sm, color: palette.sageDeep, marginTop: space.xs + 'px', lineHeight: leading.relaxed } }, hinweisZeichen(), field.orientation));
    }
    if (field.link) {
      parts.push(React.createElement(ExternerLink, {
        key: 'lk', t: tr, href: field.link.url,
        style: { display: 'inline-block', fontSize: text.xs, color: palette.skyDeep, marginTop: space.xs + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
      }, field.link.label));
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
    }, hinweisZeichen(), tr('beistand.wegweiserTitle')),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
    }, React.createElement(GlossarText, { t: tr, palette }, tr('beistand.wegweiserBody'))),
    React.createElement(ExternerLink, {
      t: tr, href: 'https://kesb-kurz-erklaert.ch/erwachsene/',
      style: { display: 'inline-block', fontSize: text.xs, color: palette.skyDeep, marginTop: space.sm + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
    }, tr('beistand.wegweiserLink'))
  );

  // E17 · «trifft nicht zu»: ein kleiner, ruhiger Schalter unter Feldern, die für manche
  // Lebenslagen nicht passen (`naOk`, z. B. Arbeitgeber bei Pensionierten). Markiert zählt
  // das Feld als erledigt und wird nicht als nächste Angabe vorgeschlagen; zurücknehmbar.
  // Nur angeboten, solange das Feld leer ist — wer etwas eingetragen hat, braucht ihn nicht.
  // Im Beispiel schreibt updateData ohnehin nichts, darum dort kein Schalter.
  // K38: `naMit` nimmt Felder mit (Notfallkontakt → Telefon), `naVon`-Felder bleiben dann verdeckt.
  const renderFeldMitNa = (field) => {
    if (naVerdeckt(data, field)) return null;
    const el = renderField(field);
    if (!field.naOk || demoMode) return el;
    // K45: ein eingetragener Wert geht vor — auch bei Altdaten, die noch beides tragen.
    // K82: eine 0 ist ein eingetragener Wert.
    const na = trifftNichtZu(data, field.k) && !feldHatWert(data, field.k);
    if (!na && feldHatWert(data, field.k)) return el;
    // K38: gekoppelte Felder (Arbeitgeber) gleich auch im anderen Kapitel umschalten.
    const umschalten = () => {
      const neu = naGruppeUmschalten(data, field);
      onUpdate(NA_FELD, neu);
      const kopplung = naKopplung(allData, chapter.key, neu);
      if (kopplung && onUpdateIn) onUpdateIn(kopplung.kapitel, NA_FELD, kopplung.liste);
    };
    const knopf = React.createElement('button', {
      type: 'button', onClick: umschalten, 'data-na': na ? '1' : '0',
      'aria-label': field.label + ': ' + tr(na ? 'naZustand.zuruecknehmen' : 'naZustand.markieren'),
      style: {
        // Tippfläche mind. 44 px hoch (WCAG 2.5.5, Predeploy 16.09.), optisch weiter ein leiser Textlink.
        background: 'none', border: 'none', padding: '10px 0', minHeight: '44px', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: text.xs, color: palette.mid, textDecoration: 'underline', textUnderlineOffset: '3px',
        textDecorationColor: palette.border,
      },
    }, tr(na ? 'naZustand.zuruecknehmen' : 'naZustand.markieren'));
    if (!na) {
      return React.createElement('div', { key: field.k },
        el,
        React.createElement('div', { style: { marginTop: -(space.lg - space.xs) + 'px', marginBottom: space.lg + 'px' } }, knopf)
      );
    }
    return React.createElement('div', {
      key: field.k,
      style: {
        marginBottom: space.lg + 'px', padding: space.sm + 'px ' + space.md + 'px',
        background: palette.up, borderRadius: radius.sm, border: '1px dashed ' + palette.border,
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm + 'px', flexWrap: 'wrap',
      },
    },
      React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } },
        React.createElement('span', { style: { color: palette.text } }, field.label),
        ' — ' + tr('naZustand.markiert')
      ),
      knopf,
      // K38: eine leise Anregung, nur hier beim Feld — keine Wiederholung anderswo.
      field.k === 'emergencyContact' && React.createElement('p', {
        style: { flexBasis: '100%', margin: 0, fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
      }, tr('naZustand.notfallAnregung'))
    );
  };

  const renderField = (field) => {
    if (field.type === 'household') return renderHouseholdFields();
    // K82: eine gespeicherte 0 ist eine Antwort und bleibt als «0» sichtbar; Leeres bleibt ''.
    const value = feldHatWert(data, field.k) ? data[field.k] : '';
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

    // `alsGruppenTitel`: für Felder, die KEIN einzelnes Control rendern, sondern
    // eine Gruppe (Options-Pillen, Listen-Manager). Dort gab es bisher trotzdem
    // ein `htmlFor` auf eine id, die niemand trägt — ein totes Versprechen: der
    // Klick aufs Label tut nichts, und das Dokument enthält einen Verweis ins
    // Leere. Der Bezug läuft in diesen Fällen über `aria-labelledby` auf die
    // `-label`-id, die hier in beiden Fällen gesetzt bleibt. Ohne Control ist
    // <label> ausserdem das falsche Element, deshalb <div>.
    const renderLabel = (fieldId, labelText, hint, alsGruppenTitel) => React.createElement(alsGruppenTitel ? 'div' : 'label', { id: fieldId + '-label', htmlFor: alsGruppenTitel ? undefined : fieldId, style: labelStyle },
      labelText,
      // E17: empfohlen statt Pflicht — leise, ohne Stern.
      field.recommended && React.createElement('span', { style: { fontSize: text.xs, color: palette.soft, fontWeight: weight.normal } }, '· ' + tr('naZustand.empfohlen')),
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
    // aria-Props fürs Eingabefeld: Pflicht, Fehler und — wo es ihn gibt — der Hinweis.
    // Bis 24.09.2026 nur der Fehler: das Pflicht-Sternchen stand allein im Label-Text
    // (von Screenreadern je nach Satzzeichen-Einstellung verschluckt), und der Hinweis
    // unter dem Feld war nicht angebunden — wer das Feld ansteuerte, hörte ihn nicht.
    const errAria = (fieldId, hinweisId) => {
      const beschrieben = [hinweisId, error ? fieldId + '-err' : null].filter(Boolean).join(' ');
      return {
        ...(field.required ? { 'aria-required': 'true' } : null),
        ...(error ? { 'aria-invalid': 'true' } : null),
        ...(beschrieben ? { 'aria-describedby': beschrieben } : null),
      };
    };

    // Mehrfach-Einträge — mehrere benannte Posten, die sich zur Summe addieren.
    // Das Budget-Feld (field.k) bleibt eine Zahl (= Summe); die Posten liegen in <field.k>Items.
    if (field.itemized) {
      const itemsKey = field.k + 'Items';
      const stored = Array.isArray(data[itemsKey]) ? data[itemsKey] : [];
      // Alt-Einzelbetrag verlustfrei als erster Posten übernehmen (ohne Bezeichnung).
      const seed = stored.length ? stored : (feldHatWert(data, field.k) ? [{ label: '', amount: data[field.k] }] : []);
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint, true),
        field.hint && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, hinweisZeichen(), field.hint),
        React.createElement('div', { role: 'group', 'aria-labelledby': fieldId + '-label' },
          React.createElement(ItemizedAmount, {
            palette, t: tr, items: seed,
            onChange: (list) => {
              onUpdate(itemsKey, list);
              // K82: ohne Betrag in einem Posten bleibt das Feld leer (keine 0 als Scheinantwort).
              onUpdate(field.k, postenSumme(list));
            },
          })
        ),
        renderOrientation(field)
      );
    }

    // Doctors — structured input instead of plain text fields
    if (field.k === 'doctor' && chapter.key === 'notfall') {
      const docList = Array.isArray(data.doctorsList) ? data.doctorsList : [];
      const oldDoctor = typeof data.doctor === 'string' ? data.doctor : '';
      const oldPhone = typeof data.doctorPhone === 'string' ? data.doctorPhone : '';
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint, true),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('doctors.hint')),
        React.createElement('div', { role: 'group', 'aria-labelledby': chapter.key + '-' + field.k + '-label' },
          React.createElement(React.Suspense, { fallback: null },
          React.createElement(DoctorManager, {
            palette, t: tr, doctors: docList,
            onChange: (list) => onUpdate('doctorsList', list),
          })
        )
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
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, hinweisZeichen(), field.hint),
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
          ...errAria(fieldId, field.hint ? fieldId + '-hint' : null),
          style: inputStyle
        }),
        field.hint && React.createElement('div', { id: fieldId + '-hint', style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, hinweisZeichen(), field.hint),
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
        renderLabel(fieldId, field.label + (field.required ? ' *' : ''), field.hint),
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
            ...errAria(fieldId),
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
          }, React.createElement(Icon, { name: 'kreuz', size: 12 })),
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
      // 🛑 `pension3a` ist ein JAHRESbetrag — das Feld heisst «3. Säule A eingezahlt
      // CHF/Jahr», der Steuerrechner vergleicht es mit dem Jahreshöchstabzug und
      // budgetSync.js teilt es durch 12. Bis zum 23.09.2026 stand hier die Summe ALLER
      // Zeilen: wer den Tracker über Jahre weiterführte, schrieb damit mehrere Jahre in ein
      // Jahresfeld (drei Zeilen à 7'000 ⇒ 21'000). Gezählt wird jetzt nur das laufende Jahr;
      // die Zuordnung liegt in src/data/saeule3a.js, damit Anzeige und Formular sie gleich
      // lesen. Die älteren Zeilen bleiben erhalten und sichtbar — sie sind Historie, kein Müll.
      const jahrJetzt = new Date().getFullYear();
      const handleDeposits = (deposits) => {
        const sum = einzahlungenImJahr(deposits, jahrJetzt);
        onUpdate('pension3aDeposits', deposits);
        onUpdate('pension3a', sum ? String(sum) : '');
      };
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(fieldId, field.label, field.hint, true),
        renderOrientation(field),
        React.createElement('div', { role: 'group', 'aria-labelledby': fieldId + '-label' },
          React.createElement(React.Suspense, { fallback: null },
            React.createElement(Saeule3aTracker, {
              palette, t: tr, deposits: rawDeposits, jahr: jahrJetzt,
              onChange: handleDeposits,
            })
          )
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
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, hinweisZeichen(), field.hint),
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
        // Bei Pillen gibt es kein <select id={fieldId}> — der Bezug läuft über
        // die radiogroup und ihr aria-labelledby. Ohne Pillen bleibt es ein
        // echtes Label am echten Feld.
        renderLabel(fieldId, field.label, field.hint, usePills),
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
                    // a11y: sage als Text verfehlt AA (≈4.2:1) — sageDeep trägt (wie sonst im Farbsystem für Text).
                    color: selected ? palette.sageDeep : palette.text,
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
              }, aufklappZeichen(true))
            ),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, hinweisZeichen(), field.hint),
        // UVG: bei Angestellten transparent vorschlagen, dass die Unfalldeckung über
        // den Arbeitgeber läuft (kein verstecktes Auto-Ausfüllen — nur ein Hinweis).
        field.k === 'uvg' && chapter.key === 'versicherungen' && allData && allData.finanzen && allData.finanzen.employmentType === 'employed' &&
          React.createElement('div', { style: { fontSize: text.sm, color: palette.sageDeep, marginTop: space.xs + 'px', lineHeight: leading.relaxed } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t: tr }, tr('uvgHint.fieldSuggest'))),
        renderOrientation(field)
      );
    }

    // Medications — structured input instead of textarea
    if (field.k === 'medications' && chapter.key === 'notfall') {
      const medList = Array.isArray(data.medicationsList) ? data.medicationsList : [];
      const oldText = typeof data.medications === 'string' ? data.medications : '';
      return React.createElement('div', { key: field.k, style: baseStyle },
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint, true),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('medications.hint')),
        React.createElement('div', { role: 'group', 'aria-labelledby': chapter.key + '-' + field.k + '-label' },
          React.createElement(React.Suspense, { fallback: null },
          React.createElement(MedicationManager, {
            palette, t: tr, medications: medList,
            onChange: (list) => onUpdate('medicationsList', list),
          })
        )
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
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint, true),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('langSkill.hint')),
        React.createElement('div', { role: 'group', 'aria-labelledby': chapter.key + '-' + field.k + '-label' },
          React.createElement(React.Suspense, { fallback: null },
            React.createElement(LanguageManager, {
              palette, t: tr, languages: langList,
              onChange: handleLangs,
            })
          )
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
        renderLabel(chapter.key + '-' + field.k, field.label, field.hint, true),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, tr('diseases.hint')),
        React.createElement('div', { role: 'group', 'aria-labelledby': chapter.key + '-' + field.k + '-label' },
          React.createElement(React.Suspense, { fallback: null },
          React.createElement(DiseaseManager, {
            palette, t: tr, diseases: dList,
            onChange: (list) => onUpdate('chronicDiseasesList', list),
          })
        )
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

  const filledCount = chapter.fields.filter(f => feldHatWert(data, f.k)).length;

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
  const hasDoctors = Array.isArray(data.doctorsList) && data.doctorsList.some(d => d.name);
  const hasMedical = isNotfall && (hasContact || hasBlood || data.allergies || (Array.isArray(data.medicationsList) && data.medicationsList.some(m => m.name)) || hasDoctors || data.doctor);

  // Notfallkarte: je Abschnitt das Druck-HTML UND die Feldnamen. Eine Quelle für Druck und
  // Export-Vorschau (K20) — die Vorschau nennt genau die gedruckten Abschnitte, ohne Werte.
  const notfallkarteAbschnitte = () => {
    const basis = allData && allData.basis || {};
    const name = [basis.firstName, basis.middleName, basis.lastName].filter(Boolean).join(' ');
    // Lokal gelesen und in der App-Sprache (Seitenrundgang 26.10.2026: Browsersprache, und «1990-05-12» als
    // UTC-Mitternacht konnte westlich von Greenwich den Vortag drucken).
    const dob = basis.dateOfBirth ? kalenderdatum(basis.dateOfBirth, lang) : '';
    const sections = [];
    if (name || dob) {
      const rows = [];
      const felder = [];
      if (name) { rows.push('<div style="font-size:18px;font-weight:500">' + escapeHtml(name) + '</div>'); felder.push(tr('zipExport.manifest.name')); }
      if (dob) { rows.push('<div style="color:#666">' + tr('notfallSummary.cardDateOfBirth') + ': ' + dob + '</div>'); felder.push(tr('notfallSummary.cardDateOfBirth')); }
      sections.push({ title: tr('notfallSummary.cardPerson'), felder, html: rows.join('') });
    }
    if (data.emergencyContact) {
      const rows = ['<div>' + escapeHtml(data.emergencyContact) + '</div>'];
      const felder = [tr('chapters.notfall.fields.emergencyContact')];
      if (data.emergencyPhone) { rows.push('<div>' + escapeHtml(data.emergencyPhone) + '</div>'); felder.push(tr('chapters.notfall.fields.emergencyPhone')); }
      sections.push({ title: tr('notfallSummary.handoverContact'), felder, html: rows.join('') });
    } else if (keineKontaktperson(data)) {
      sections.push({ title: tr('notfallSummary.handoverContact'), felder: [], html: '<div style="color:#666">' + escapeHtml(tr('naZustand.keineKontaktperson')) + '</div>' });
    }
    const medRows = [];
    const medFelder = [];
    if (hasBlood) { medRows.push('<div>' + tr('notfallSummary.bloodType') + ': <strong>' + escapeHtml(blutgruppeLabel(data.bloodType, tr)) + '</strong></div>'); medFelder.push(tr('notfallSummary.bloodType')); }
    if (data.allergies) { medRows.push('<div>' + tr('chapters.notfall.fields.allergies') + ': ' + tr('notfallSummary.cardRecorded') + '</div>'); medFelder.push(tr('chapters.notfall.fields.allergies')); }
    const medList = Array.isArray(data.medicationsList) ? data.medicationsList.filter(m => m.name) : [];
    if (medList.length) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + medList.map(m => escapeHtml(m.name) + (m.dose ? ' ' + escapeHtml(m.dose) + ' ' + escapeHtml(m.unit) : '')).join(', ') + '</div>');
    else if (data.medications) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    else if (keineMedikamente(data)) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + escapeHtml(tr('naZustand.keineMedikamente')) + '</div>');
    if (medList.length || data.medications || keineMedikamente(data)) medFelder.push(tr('chapters.notfall.fields.medications'));
    const dList = Array.isArray(data.chronicDiseasesList) ? data.chronicDiseasesList.filter(d => d.name) : [];
    if (dList.length) medRows.push('<div>' + tr('chapters.notfall.fields.chronicDiseases') + ': ' + dList.map(d => escapeHtml(d.name) + (d.code ? ' (' + escapeHtml(d.code) + ')' : '')).join(', ') + '</div>');
    else if (data.chronicDiseases) medRows.push('<div>' + tr('chapters.notfall.fields.chronicDiseases') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    if (dList.length || data.chronicDiseases) medFelder.push(tr('chapters.notfall.fields.chronicDiseases'));
    if (medRows.length) sections.push({ title: tr('notfallSummary.handoverMedical'), felder: medFelder, html: medRows.join('') });
    const docList = Array.isArray(data.doctorsList) ? data.doctorsList.filter(d => d.name) : [];
    if (docList.length) {
      const rows = docList.map(d => '<div>' + escapeHtml(d.name) + (d.phone ? ' · ' + escapeHtml(d.phone) : '') + '</div>');
      const felder = [tr('chapters.notfall.fields.doctor')];
      if (docList.some(d => d.phone)) felder.push(tr('chapters.notfall.fields.doctorPhone'));
      sections.push({ title: tr('notfallSummary.cardDoctor'), felder, html: rows.join('') });
    } else if (data.doctor) {
      const rows = ['<div>' + escapeHtml(data.doctor) + (data.doctorPhone ? ' · ' + escapeHtml(data.doctorPhone) : '') + '</div>'];
      const felder = [tr('chapters.notfall.fields.doctor')];
      if (data.doctorPhone) felder.push(tr('chapters.notfall.fields.doctorPhone'));
      sections.push({ title: tr('notfallSummary.cardDoctor'), felder, html: rows.join('') });
    }
    const provRows = [];
    if (data.patientenverfuegung && data.patientenverfuegung !== 'no') provRows.push(tr('notfallSummary.cardAdvanceDirective'));
    if (data.vorsorgeauftrag && data.vorsorgeauftrag !== 'no') provRows.push(tr('notfallSummary.cardPowerOfAttorney'));
    if (provRows.length) sections.push({ title: tr('notfallSummary.handoverProvision'), felder: provRows, html: provRows.map(r => '<div>' + r + '</div>').join('') });
    return sections;
  };

  const handleSaveCard = () => {
    const sections = notfallkarteAbschnitte();
    const sectionHtml = sections.map(s =>
      '<div style="margin-bottom:16px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:4px">' + s.title + '</div>' + s.html + '</div>'
    ).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + tr('notfallSummary.cardTitle') + '</title>' +
      '<style>@media print{body{margin:0;padding:20mm}@page{size:A4;margin:20mm}}body{font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:40px auto;padding:0 24px;color:#222;line-height:1.5}' +
      '.card{border:1px solid #ddd;border-radius:8px;padding:24px;background:#fff}h1{font-size:20px;font-weight:500;margin:0 0 4px;letter-spacing:0.3px}' +
      '.subtitle{font-size:13px;color:#888;margin:0 0 20px;font-style:italic}.footer{margin-top:20px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa}' +
      '.no-print{text-align:center;margin-bottom:24px}@media print{.no-print{display:none}}</style></head><body>' +
      '<div class="no-print"><button data-druck onclick="window.print()" style="padding:8px 20px;font-size:14px;border:1px solid #ccc;border-radius:6px;background:#f8f7f5;cursor:pointer">' + tr('notfallSummary.printCard') + '</button></div>' +
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
  // Titel und Zeichen in der Bereichsfarbe, lesbar gemacht (Entscheid 27.09.2026).
  const bereichsfarbe = kapitelBereichsfarbe(chapter.key, palette, isDarkMode);

  // Die Elemente eines Feldes (Abschnittskopf, Feld, Querverweise) — herausgelöst am
  // 27.09.2026, damit die Abschnittsliste beim «ändern ›» dieselben Felder UND dieselben
  // Querverweise zeigt wie das Formular. Den Abschnittskopf setzt der Aufrufer.
  const feldElemente = (field) => {
          const elements = [];
          elements.push(renderFeldMitNa(field));
          // Das Piktogramm des ZIELS, aus dem Register der Suche — keine zweite Liste
          // (21.09.2026). Ein Querverweis ohne Zeichen sah aus wie jeder andere; mit
          // dem Zeichen seines Ziels sagt er auf einen Blick, wohin er führt.
          // Kein Rückfall auf `external` (27.09.2026): jeder Querverweis hier bleibt
          // in Maloja (`onNavigate`), das Hinaus-Zeichen wäre an ihm immer falsch.
          const zielIkon = (view) => ansichtIkon(view);
          const crosslinkBtn = (key, view, textKey) => onNavigate && elements.push(
            React.createElement('button', {
              key: 'crosslink-' + key,
              className: 'mp-link',
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
            }, hinweisZeichen(zielIkon(view), 14), t(textKey))
          );
          // Mehrere verwandte Links zu einem Feld → eine ruhige Box statt gestapelter Buttons
          const crosslinkBundle = (items, dach) => onNavigate && elements.push(
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
                className: 'mp-link',
                onClick: () => onNavigate(view),
                style: {
                  display: 'flex', alignItems: 'center', gap: space.xs + 'px', width: '100%',
                  background: 'transparent', border: 'none',
                  padding: space.xs + 'px 0',
                  fontSize: text.sm, color: palette.sageDeep || palette.mid,
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }
              }, hinweisZeichen(zielIkon(view), 14), t(textKey))),
              // Der letzte Eintrag kann ein «Dach» sein — eine Übersicht, die die
              // Werkzeuge darüber zusammenfasst. Er ist kein Geschwister, also steht
              // er abgesetzt: feine Linie, etwas Luft. Hierarchie durch Raum, nicht
              // durch Gewicht (21.09.2026).
              dach && React.createElement('button', {
                key: 'crosslink-dach',
                className: 'mp-link',
                onClick: () => onNavigate(dach[1]),
                style: {
                  display: 'flex', alignItems: 'center', gap: space.xs + 'px', width: '100%',
                  background: 'transparent', border: 'none',
                  borderTop: '1px solid ' + (palette.sage || palette.border) + '33',
                  marginTop: space.xs + 'px', paddingTop: space.sm + 'px',
                  padding: space.sm + 'px 0 ' + space.xs + 'px 0',
                  fontSize: text.sm, fontWeight: weight.medium,
                  color: palette.sageDeep || palette.mid,
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }
              }, hinweisZeichen(zielIkon(dach[1]), 14), t(dach[2]))
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
                React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t: tr }, tr('edu.pathsTitle'))),
                React.createElement('div', { style: { marginTop: space.md + 'px' } },
                  React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.md + 'px' } }, tr('edu.pathsIntro')),
                  pathItem('path1Title', 'path1'),
                  pathItem('path2Title', 'path2'),
                  pathItem('path3Title', 'path3'),
                  React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginTop: space.sm + 'px' } }, tr('edu.pathsHow')),
                  React.createElement(ExternerLink, { t: tr, href: 'https://www.berufsbildung.ch/de/lexikon/berufsabschluss-fuer-erwachsene', style: eduLink }, tr('edu.pathsLink'))
                )
              )
            );
          }
          if (field.k === 'workHoursPerWeek' && chapter.key === 'ausbildung') {
            const hrs = parseFloat(String(data.workHoursPerWeek || '').replace(',', '.')) || 0;
            // Über der Plausibilitätsgrenze (lohnCheck.js) keine Umrechnung, sondern die Frage
            // nach dem Pensum — Barometer und Mindestlohn-Prüfung rechnen dann nicht mit.
            if (wochenstundenUnplausibel(hrs)) {
              elements.push(
                React.createElement('div', {
                  key: 'hours-implausible',
                  style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                }, tr('lohnEinordnung.hoursImplausibleNote', { hours: String(hrs) }))
              );
            } else if (hrs > 0) {
              const perMonth = stundenAufMonat(hrs);
              const perYear = stundenAufJahr(hrs);
              const kanton = allData && allData.basis && allData.basis.canton;
              const monthlyIncome = parseFloat(allData && allData.finanzen && allData.finanzen.monthlyIncome) || 0;
              // Einkommensart mitgeben (Mindestlohn = brutto) — sonst rechnet dieser zweite
              // Aufrufer einen Netto-Lohn gegen den Brutto-Boden, während das Finanzen-Kapitel
              // korrekt schweigt. Fünf Stellen rechneten diesen Befund, jede etwas anders.
              const check = monthlyIncome > 0
                ? pruefeStundenlohn(monthlyIncome, hrs, kanton, allData?.finanzen?.incomeType, allData?.finanzen?.dreizehnter)
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
                  check && check.lohnStunde != null && allData?.finanzen?.incomeType === 'brutto' && React.createElement('div', { style: { marginTop: space.xs + 'px' } }, tr('lohnCheck.hourlyWage', { wage: zahl(check.lohnStunde, { stellen: 2 }) }))
                )
              );
              // Jahres-Riegel (data/lohnCheck.js): kein belegter Satz fürs laufende Jahr → Hinweis statt Befund.
              if (check && check.status === 'jahrNichtBelegt') {
                elements.push(
                  React.createElement('div', {
                    key: 'hours-minwage-jahr-nicht-belegt',
                    style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                  }, tr('lohnCheck.jahrNichtBelegt', { jahr: check.jahr, laufend: check.laufendesJahr, kanton: check.kanton }))
                );
              }
              if (check && check.status === 'unterMindestlohn') {
                elements.push(
                  React.createElement('div', {
                    key: 'hours-minwage-warn',
                    style: { gridColumn: '1 / -1', background: palette.rose + '15', border: '1px solid ' + palette.rose + '40', borderLeft: '3px solid ' + palette.rose, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.roseDeep, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                  },
                    // FIX D: pro-Kanton-Jahr (check.jahr), nicht das globale LOHNCHECK_DATA_VERSION —
                    // sonst zeigte ein TI-Nutzer im Kapitel ein anderes Jahr als im Brief.
                    tr('lohnCheck.unterMindestlohn', { kanton: check.kanton, mindestStunde: zahl(check.mindestStunde, { stellen: 2 }), lohnStunde: zahl(check.lohnStunde, { stellen: 2 }), jahr: check.jahr || LOHNCHECK_DATA_VERSION, stelleSatz: lohnStelleSatz(check.kanton, tr, 'lohnCheck.stelleSatz', 'lohnCheck.stelleSatzNeutral'), ausnahmen: tr('lohnCheck.ausnahmen') })
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
                      className: 'mp-link',
                      key: 'hours-minwage-nextstep',
                      onClick: () => onNavigate('briefe', undefined, 'wageClaim'),
                      style: { gridColumn: '1 / -1', justifySelf: 'start', background: 'none', border: '1px solid ' + palette.rose + '55', borderRadius: radius.sm, padding: space.xs + 'px ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.medium, color: palette.roseDeep, cursor: 'pointer', marginBottom: space.sm + 'px' }
                    }, tr('lohnCheck.nextStepLink'))
                  );
                }
              }
              // Im 12/13-Spalt, 13.-Frage offen: NICHT anklagen, sondern ruhig zur Angabe
              // einladen (wie 'basisUnklar'). Der Falsch-Alarm gegen einen 13.-Bezüger,
              // der das Feld nur nicht gesetzt hat, bleibt so aus.
              if (check && check.status === 'dreizehnterUnklar') {
                elements.push(
                  React.createElement('div', {
                    key: 'hours-dreizehnter-unklar',
                    style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, lineHeight: leading.relaxed, marginBottom: space.sm + 'px' }
                  }, tr('lohnCheck.dreizehnterUnklar'))
                );
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
                }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('wohnen.nkEstimate', { monthly: zahl(Math.round(monthlyNK)), annual: zahl(Math.round(monthlyNK * 12)) })))
              );
            }
          }
          if (field.k === 'jobTitle' && chapter.key === 'ausbildung') {
            const kanton = allData && allData.basis && allData.basis.canton;
            if (kanton && kantonHatMindestlohn(kanton)) {
              onNavigate && elements.push(
                React.createElement('div', {
                  key: 'crosslink-mindestlohn-news',
                  style: {
                    gridColumn: '1 / -1', marginBottom: space.xs + 'px',
                    fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed,
                  },
                }, hinweisZeichen(), tr('nav.crosslink.mindestlohnNews')),
                React.createElement('button', {
                  className: 'mp-link',
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
                }, hinweisZeichen(), tr('alimentInfo.title') + ' — ' + tr(notApplicable ? 'alimentInfo.summaryNA' : 'alimentInfo.summaryActive')),
                React.createElement('div', { style: { marginTop: space.sm + 'px', fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } },
                  React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0' } }, tr('alimentInfo.noFormula')),
                  React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0' } }, tr('alimentInfo.magnitude')),
                  React.createElement('p', { style: { margin: 0 } }, tr('alimentInfo.binding')),
                  React.createElement(ExternerLink, {
                    t: tr,
                    href: 'https://www.gerichte-zh.ch/themen/partnerschaft/hilfen/unterhaltsberechnung.html',
                    style: { display: 'inline-block', marginTop: space.sm + 'px', fontSize: text.sm, color: palette.skyDeep, textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
                  }, tr('alimentInfo.linkLabel'))
                )
              )
            );
          }
          if (field.k === 'monthlyIncome' && chapter.key === 'finanzen') {
            crosslinkBundle([
              ['tax', 'tax', 'nav.crosslink.taxHint'],
              ['ipvIncome', 'premium', 'nav.crosslink.ipvFromIncome'],
              ['sozialhilfe', 'sozialhilfe', 'nav.crosslink.sozialhilfeHint'],
            ], ['finanzuebersicht', 'finanzuebersicht', 'nav.crosslink.finanzuebersichtHint']);
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
                const result = pruefeStundenlohn(lohn, wHrs, kanton, data.incomeType, data.dreizehnter);
                if (result.status === 'unvollstaendig' && onNavigate) {
                  elements.push(
                    React.createElement('button', {
                      className: 'mp-link',
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
                    }, tr('lohnCheck.hoursMissing'))
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
                // 12/13-Spalt mit offener 13.-Frage: ruhige Einladung statt Alarm (wie 'basisUnklar').
                if (result.status === 'dreizehnterUnklar') {
                  elements.push(
                    React.createElement('div', {
                      key: 'mindestlohn-dreizehnter-unklar',
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
                    }, tr('lohnCheck.dreizehnterUnklar'))
                  );
                }
                // Jahres-Riegel (data/lohnCheck.js): für das laufende Jahr kein belegter Satz →
                // ruhiger Hinweis mit Datenjahr und zuständiger Stelle, kein Betrag aus dem Vorjahr.
                if (result.status === 'jahrNichtBelegt') {
                  elements.push(
                    React.createElement('div', {
                      key: 'mindestlohn-jahr-nicht-belegt',
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
                    }, tr('lohnCheck.jahrNichtBelegt', { jahr: result.jahr, laufend: result.laufendesJahr, kanton: result.kanton }))
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
                        .replace('{mindestStunde}', zahl(result.mindestStunde, { stellen: 2 }))
                        .replace('{lohnStunde}', zahl(result.lohnStunde, { stellen: 2 }))
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
                        .replace('{stelleSatz}', () => lohnStelleSatz(kanton, tr, 'lohnCheck.stelleSatz', 'lohnCheck.stelleSatzNeutral'))
                        // Der Befund kennt die Ausnahmen nicht → er nennt sie, statt eine
                        // Rechtsverletzung festzustellen (siehe `WAGECLAIM_BEREIT`).
                        .replace('{ausnahmen}', () => tr('lohnCheck.ausnahmen'))
                    )
                  );
                  // ⚠️ Brief-Knopf ruht — siehe `WAGECLAIM_BEREIT` in data/lohnCheck.js.
                  if (WAGECLAIM_BEREIT && onNavigate) {
                    elements.push(
                      React.createElement('button', {
                        className: 'mp-link',
                        key: 'mindestlohn-nextstep',
                        onClick: () => onNavigate('briefe', undefined, 'wageClaim'),
                        style: { gridColumn: '1 / -1', justifySelf: 'start', background: 'none', border: '1px solid ' + palette.rose + '55', borderRadius: radius.sm, padding: space.xs + 'px ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.medium, color: palette.roseDeep, cursor: 'pointer', marginBottom: space.sm + 'px' }
                      }, t('lohnCheck.nextStepLink'))
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
                React.createElement('div', null, hinweisZeichen(), t('wohnen.umzugGemeinde')),
                React.createElement('div', null, hinweisZeichen(), t('wohnen.umzugKK')),
                React.createElement('div', null, hinweisZeichen(), t('wohnen.umzugPost')),
              )
            );
          }
          if (field.k === 'canton' && chapter.key === 'basis') {
            crosslinkBtn('cantonTax', 'tax', 'nav.crosslink.cantonTaxHint');
            crosslinkBtn('cantonSozial', 'sozialhilfe', 'nav.crosslink.cantonSozialhilfeHint');
            onNavigate && elements.push(
              React.createElement('button', {
                className: 'mp-link',
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
          // Kreditkarte vorhanden → «Lohnt sich die Karte?» (Rechner, 27.09.2026).
          if (field.k === 'creditCard' && chapter.key === 'finanzen' && (data.creditCard === 'one' || data.creditCard === 'multiple')) {
            crosslinkBtn('kreditkarte', 'kreditkarte', 'nav.crosslink.kreditkarteHint');
          }
          if (field.k === 'kkModel' && chapter.key === 'versicherungen') {
            crosslinkBtn('kkModel', 'praemien', 'nav.crosslink.kkModelHint');
          }
          // K38: der Hinweis sagt «Kontakt hinterlegt» — also nur, wenn wirklich einer da ist.
          if (field.k === 'emergencyContact' && chapter.key === 'notfall' && data.emergencyContact) {
            // Seit 24.10.2026 direkt zur Vorlesekarte — der Einstieg steht jetzt in diesem Kapitel.
            crosslinkBtn('notfallkarte', 'notfallkarte', 'nav.crosslink.notfallkarteHint');
          }
          return elements;
        };
  const feldElementeSek = (field) => {
          const elements = [];
          elements.push(renderFeldMitNa(field));
          if (field.k === 'vorsorgeauftrag' && chapter.key === 'notfall') {
            elements.push(renderBeistandWegweiser());
          }
          // Bestattungswünsche in Fragen festhalten (27.09.2026).
          if (field.k === 'bestattungswuensche' && chapter.key === 'notfall' && onNavigate) {
            elements.push(React.createElement('button', {
              key: 'crosslink-bw', type: 'button', className: 'mp-link',
              onClick: () => onNavigate('bestattung'),
              style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, border: 'none', borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', marginBottom: space.sm + 'px' },
            }, tr('nav.crosslink.bwHint') + ' ›'));
          }
          // Patientenverfügung in Fragen erstellen (27.09.2026) — immer, auch wenn schon «Ja».
          if (field.k === 'patientenverfuegung' && chapter.key === 'notfall' && onNavigate) {
            elements.push(React.createElement('button', {
              key: 'crosslink-pv', type: 'button', className: 'mp-link',
              onClick: () => onNavigate('patientenverfuegung'),
              style: { gridColumn: '1 / -1', background: palette.sageMist || palette.up, border: 'none', borderRadius: radius.sm, padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.sageDeep || palette.mid, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', marginBottom: space.sm + 'px' },
            }, tr('nav.crosslink.pvHint') + ' ›'));
          }
          return elements;
        };

  // ─── Abschnittsliste (Entscheid Stebler Studios 27.09.2026, Probe an Finanzen) ──────
  // Jeder Wert steht EINMAL da: Abschnitte als ruhige Liste; «ändern ›» macht genau diesen
  // Abschnitt an Ort und Stelle zum Formular — mit denselben Feldern und Querverweisen wie
  // vorher (feldElemente). Leere Abschnitte gestrichelt mit «ergänzen ›». Vorher standen
  // dieselben Zahlen als Satz, als Tabelle und im Formular — Finanzen 8681 px hoch.
  const abschnittWert = (f) => {
    const v = data[f.k];
    if (trifftNichtZu(data, f.k)) return tr('naZustand.markieren');
    if (f.type === 'household') {
      const h = v || {};
      const kinder = Array.isArray(h.children) ? h.children.length : 0;
      // Fassung 6 (Runde 9, Y): eine lesbare Zeile «Im Haushalt». Abnahme F6 (Sophie 25.10.2026): statt
      // «1 Erwachsene · 0 Kinder» jetzt «allein, keine Kinder» bzw. «2 Erwachsene, 1 Kind». Die Zahl
      // der Erwachsenen wie die Erfassung sie zählt (adultsList, sonst adults; utils/partnereinkommen.js).
      const erwachsene = erwachseneImHaushalt(h);
      return [
        erwachsene <= 1 ? tr('chapterView.haushaltAllein') : tr('chapterView.haushaltErwachsene', { n: erwachsene }),
        kinder === 0 ? tr('chapterView.haushaltKeineKinder') : kinder === 1 ? tr('chapterView.haushaltEinKind') : tr('chapterView.haushaltKinder', { n: kinder }),
      ].join(', ');
    }
    if (f.type === 'currency') {
      const n = (Number(v) === 0 && Array.isArray(data[f.k + 'Items'])) ? postenSumme(data[f.k + 'Items']) : v;
      const wert = betrag(Number(n), Number.isInteger(Number(n)) ? {} : { stellen: 2 });
      // Jahresbeträge (`jahr: true` in constants.js) tragen «/ Jahr» am Wert: der Feldname verliert
      // sein «CHF/Jahr» in der Liste, und «Hausrat-Prämie CHF 22» las sich als Monatsbetrag
      // (Abnahme F6, 25.10.2026).
      // Geschütztes Leerzeichen: «/ Jahr» bricht nie allein in die nächste Zeile (Copy-Prüfer).
      return f.jahr ? wert + '\u00a0' + tr('chapterView.proJahr') : wert;
    }
    // Schweizer/innen brauchen keine Aufenthaltsbewilligung: in der Liste nicht «Aufenthaltsbewilligung:
    // Schweizer/in», sondern «nicht nötig (Schweizer/in)» (Abnahme F6, 25.10.2026). Die Auswahl bleibt.
    if (f.k === 'workPermit' && v === 'swiss') return tr('chapterView.bewilligungNichtNoetig');
    if (Array.isArray(f.options) && f.options.length) {
      const o = f.options.find((x) => String(x.value) === String(v));
      return o ? o.label : String(v);
    }
    if (f.type === 'date') return formatDE(v);
    // Listen-Felder (Medikamente, Vorerkrankungen): die Namen, wie sie in der Liste stehen.
    const posten = Array.isArray(data[f.k + 'List']) ? data[f.k + 'List'].filter((x) => x && x.name) : [];
    if (posten.length) return posten.map((x) => x.name).join(', ');
    return String(v);
  };
  // Von oben direkt zu einem Feld (Notfall, «Bereit für den Ernstfall» und Vorsorge, Runde 9 AE): den
  // Abschnitt öffnen, hinscrollen, ins Feld setzen. Ein ausgeblendeter Abschnitt wird erst gezeigt.
  const zumFeld = (k) => {
    const g = abschnittGruppen(chapter.fields, chapter.title).find((x) => x.felder.some((f) => f.k === k));
    if (!g) return;
    if (g.sek && !showSecondary) toggleSecondary();
    setOffeneAbschnitte((o) => ({ ...o, [g.key]: true }));
    setTimeout(() => {
      const abschnitt = document.getElementById('mp-section-' + g.key);
      // Den Abstand unter dem stehenden Ernstfall-Knopf hält scroll-padding (NotfallErnstfallKnopf).
      if (abschnitt) abschnitt.scrollIntoView({ block: 'start' });
      const feld = document.getElementById(chapter.key + '-' + k);
      if (feld && feld.focus) feld.focus({ preventScroll: true });
    }, 0);
  };
  const abschnittGefuellt = (f) => (f.type === 'household' ? !!data.household : (feldHatWert(data, f.k) || trifftNichtZu(data, f.k)));
  // Fassung 5 · Finanzen: die «mehr Felder» (steuerbares Einkommen, Vorsorge) stehen hinter
  // «Weitere Bereiche anzeigen» — auch das steuerbare Einkommen mitten im Abschnitt Einkommen.
  // Ein ausgeblendetes Feld mit Daten verschwindet nie still: der Schalter startet offen,
  // sobald eines Daten trägt, und eingeklappt steht der App-Hinweis «Einige ausgeblendete
  // Bereiche enthalten bereits Daten.». Andere Kapitel bleiben, wie sie waren.
  const istFinanzen = chapter.key === 'finanzen';
  const feldSichtbar = (f) => !istFinanzen || showSecondary || !f.secondary;
  // ─── Muster für alle Kapitel (Fassung 6, M1–M4; Sophie 25.10.2026) ─────────────────────
  // M1: die Angaben als EINE ruhige Liste wie im Entwurf (Abschnittstitel, darunter Zeilen
  // «Bezeichnung … Wert»), nicht mehr eine Karte je Abschnitt. Der Wert nimmt seine Breite (bis 62 %),
  // die Bezeichnung den Rest («flex: 1 1 0») — so bricht «Noch nicht» nicht neben einem langen Namen;
  // ein Wert bricht nur zwischen Wörtern.
  // M2: «x von n» am Abschnitt; was fehlt, steht da — Wichtiges (Grundordnung, empfohlen; im
  // Notfall die Angaben für den Ernstfall) mit «ergänzen ›», der Rest leise «Nicht erfasst: …».
  // M3: ganz leere Abschnitte in EINER Zeile («Eigentum · Mobilität · noch leer»).
  // M4: Einheiten im Wert (Wochenstunden, Franchise), Nummern brechen nicht.
  const feldWichtig = (f) => (isNotfall
    ? NOTFALL_ANGABEN.some((x) => x.chapter === 'notfall' && x.k === f.k)
    : !!(f.mvo || f.recommended));
  // Finanzen · Nebenerwerb: die Felder gelten erst mit Nebenerwerb — ohne ihn fehlen sie nicht.
  // Wohnen · Eigentum: ohne Hypothek («Nein») fehlen Zins, Immobilienwert und Gebäudeversicherung nicht
  // (Fachprüfung 25.10.2026).
  const feldZaehlt = (f) => !(istFinanzen && NEBENERWERB_FELDER.includes(f.k) && !nebenerwerbAngegeben(data))
    && !(chapter.key === 'wohnen' && data.mortgageStatus === 'no' && ['mortgagePayment', 'propertyValue', 'buildingsInsurance'].includes(f.k));
  // Kennnummern und Telefonnummern («ZH-2024-123456», «+41 79 654 32 10») bleiben am Stück (Abnahme F6,
  // Behörden 10, Notfall) — per CSS, nicht mit geschützten Zeichen: so bleibt die Nummer beim Kopieren
  // dieselbe (A11y-Prüfung 25.10.2026).
  const amStueck = (s) => typeof s === 'string' && s.length <= 24 && /\d/.test(s) && /^[\w+()./ -]+$/.test(s);
  // In der Liste ohne das, was der Wert schon sagt («CHF», «CHF/Monat»), und ohne Eingabe-Beispiel
  // («Anzahl Zimmer (z. B. 3.5)» → «Anzahl Zimmer»).
  const listenName = (f) => {
    if (f.type === 'household') return tr('chapterView.imHaushalt');
    return feldNameOhneEinheit(f.label, f.type);
  };
  const listenWert = (f) => {
    const w = abschnittWert(f);
    if (trifftNichtZu(data, f.k)) return w;
    if ((f.k === 'workHoursPerWeek' || f.k === 'sideHoursPerWeek') && /^\d+([.,]\d+)?$/.test(String(data[f.k]).trim())) return w + '\u00a0' + tr('chapterView.stdProWoche');
    if (f.type === 'select' && /(\sCHF|\(CHF\))\s*$/.test(String(f.label || '')) && /^[\d’']+$/.test(String(w))) return 'CHF\u00a0' + w;
    return w;
  };
  // PLZ und Ort in einer Zeile («PLZ · Ort  8004 Zürich»), wenn beide erfasst sind.
  const zeilenAus = (felder) => {
    const plz = felder.find((f) => f.k === 'postalCode');
    const ort = felder.find((f) => f.k === 'city');
    const beide = plz && ort && feldHatWert(data, 'postalCode') && feldHatWert(data, 'city');
    return felder.flatMap((f) => {
      if (beide && f.k === 'city') return [];
      if (beide && f.k === 'postalCode') return [{ k: 'plzOrt', name: tr('chapterView.plzOrt'), wert: String(data.postalCode) + '\u00a0' + String(data.city) }];
      const wert = listenWert(f);
      return [{ k: f.k, name: listenName(f), wert, amStueck: amStueck(wert) }];
    });
  };
  const linkKnopf = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium, color: palette.sandDeep, minHeight: '44px', padding: '0 4px', whiteSpace: 'nowrap' };
  const zeile = (z) => React.createElement('div', { key: 'z-' + z.k, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md + 'px', padding: '3px 0 3px ' + space.sm + 'px' } },
    React.createElement('dt', { style: { color: palette.mid, margin: 0, flex: '1 1 0', minWidth: 0, hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' } }, z.name),
    React.createElement('dd', { style: { color: palette.text, margin: 0, flex: '0 1 auto', maxWidth: '62%', textAlign: 'right', fontWeight: weight.medium, overflowWrap: 'break-word', ...(z.amStueck ? { whiteSpace: 'nowrap' } : {}) } }, z.wert));
  const abschnittsliste = () => {
    const gruppen = abschnittGruppen(chapter.fields, chapter.title);
    const abschnitt = (g) => {
      const felder = g.felder.filter(feldSichtbar);
      if (felder.length === 0) return null;
      const gefuellt = felder.filter(abschnittGefuellt);
      const fehlend = felder.filter((f) => !abschnittGefuellt(f) && feldZaehlt(f));
      const zaehlend = felder.filter(feldZaehlt);
      const offen = !!offeneAbschnitte[g.key];
      const umschalten = () => setOffeneAbschnitte((o) => ({ ...o, [g.key]: !o[g.key] }));
      // Finanzen · Nebenerwerb (Entscheid 23.10.2026): die fünf Felder erst mit Nebenerwerb.
      // Es gibt kein eigenes Ja/Nein-Feld — angegeben ist ein Nebenerwerb, sobald eines der
      // fünf Felder einen Wert trägt (oder «trifft nicht zu»). Dann steht die Zeile offen;
      // sonst eingeklappt «Nebenerwerb · falls vorhanden», ein Tipp öffnet sie.
      const feldBausteine = (f) => (f.secondary ? feldElementeSek(f) : feldElemente(f));
      const formular = [];
      felder.forEach((f) => {
        if (!(istFinanzen && NEBENERWERB_FELDER.includes(f.k))) {
          formular.push(React.createElement(React.Fragment, { key: 'af-' + f.k }, ...feldBausteine(f)));
          return;
        }
        if (f.k !== NEBENERWERB_FELDER[0]) return;
        const neben = felder.filter((x) => NEBENERWERB_FELDER.includes(x.k));
        const angegeben = nebenerwerbAngegeben(data);
        if (nebenerwerbAnfangsOffen.current === null) nebenerwerbAnfangsOffen.current = angegeben;
        formular.push(React.createElement('details', {
          key: 'af-nebenerwerb', 'data-nebenerwerb': angegeben ? 'angegeben' : 'leer', open: nebenerwerbAnfangsOffen.current || undefined,
          style: { gridColumn: '1 / -1', marginBottom: space.sm + 'px', borderTop: '1px solid ' + palette.border + '88', borderBottom: '1px solid ' + palette.border + '88' },
        },
          React.createElement('summary', {
            style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
          },
            tr('chapters.finanzen.nebenerwerb.titel'),
            React.createElement('span', { style: { fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } },
              tr(angegeben ? 'chapters.finanzen.nebenerwerb.erfasst' : 'chapters.finanzen.nebenerwerb.fallsVorhanden'))
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '0 16px', paddingTop: space.sm + 'px' } },
            ...neben.map((x) => React.createElement(React.Fragment, { key: 'af-' + x.k }, ...feldBausteine(x))))
        ));
      });
      const wichtig = fehlend.filter(feldWichtig);
      const leise = fehlend.filter((f) => !feldWichtig(f));
      return React.createElement('section', {
        key: g.key, id: 'mp-section-' + g.key, 'aria-labelledby': 'mp-abschnitt-' + g.key, 'data-abschnitt': offen ? 'offen' : 'liste',
        style: {
          scrollMarginTop: 'var(--mp-sprungabstand)',
          borderTop: '1px solid ' + palette.border + '88',
          // Beim Ändern trägt der Abschnitt eine Linie in Sand am Rand — er bleibt in der Liste.
          ...(offen ? { borderLeft: '2px solid ' + palette.sand, paddingLeft: space.sm + 'px' } : {}),
        },
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm + 'px', minHeight: '44px' } },
          React.createElement('h3', { id: 'mp-abschnitt-' + g.key, style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, g.titel),
          React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px' } },
            // Sichtbar kurz «6 von 7» wie im Entwurf; vorgelesen «6 von 7 Angaben erfasst» (A11y- und Copy-Prüfung).
            !offen && fehlend.length > 0 && React.createElement('span', { 'data-erfasst': gefuellt.filter(feldZaehlt).length + '/' + zaehlend.length, style: { fontSize: text.xs, color: palette.mid, whiteSpace: 'nowrap' } },
              React.createElement('span', { 'aria-hidden': 'true' }, tr('chapterView.abschnitt.erfasst', { n: gefuellt.filter(feldZaehlt).length, total: zaehlend.length })),
              React.createElement('span', { style: visuallyHiddenStyle }, tr('chapterView.abschnitt.erfasstSr', { n: gefuellt.filter(feldZaehlt).length, total: zaehlend.length }))),
            React.createElement('button', {
              type: 'button', className: 'mp-link', onClick: umschalten, 'aria-expanded': offen,
              'aria-label': tr(offen ? 'chapterView.abschnitt.fertigAria' : 'chapterView.abschnitt.aendernAria', { name: g.titel }),
              style: { ...linkKnopf, color: offen ? palette.mid : palette.sandDeep },
            }, offen
              ? React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px' } }, tr('chapterView.abschnitt.fertig'), React.createElement(Icon, { name: 'check', size: 14 }))
              : tr('chapterView.abschnitt.aendern') + ' ›'))
        ),
        offen
          ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '0 16px', paddingBottom: space.sm + 'px' } },
              demoMode && React.createElement('p', { key: 'demo', style: { gridColumn: '1 / -1', fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px' } }, tr('demo.readOnlyHint')),
              g.intro && React.createElement('p', { key: 'intro', style: { gridColumn: '1 / -1', fontSize: text.sm, color: palette.mid, fontStyle: 'italic', lineHeight: leading.relaxed, margin: '0 0 ' + space.sm + 'px' } }, g.intro),
              ...formular)
          : React.createElement('div', { style: { paddingBottom: space.sm + 'px', fontSize: text.sm } },
              React.createElement('dl', { style: { margin: 0 } }, ...zeilenAus(gefuellt).map(zeile)),
              ...wichtig.map((f) => React.createElement('button', {
                key: 'fehlt-' + f.k, type: 'button', className: 'mp-link', 'data-fehlt': f.k, onClick: () => zumFeld(f.k),
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.md + 'px', width: '100%', minHeight: '44px', padding: '0 0 0 ' + space.sm + 'px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid, textAlign: 'left' },
              }, React.createElement('span', { style: { color: palette.mid } }, listenName(f)), React.createElement('span', { style: { color: palette.sandDeep, fontWeight: weight.medium, whiteSpace: 'nowrap' } }, tr('chapterView.abschnitt.ergaenzen') + ' ›'))),
              leise.length > 0 && React.createElement('p', { 'data-nicht-erfasst': leise.map((f) => f.k).join(' '), style: { margin: '2px 0 0', padding: '0 0 0 ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } },
                // In der Aufzählung ohne das Fragezeichen der Feldnamen («13. Monatslohn?,» las sich holprig).
                tr('chapterView.abschnitt.nichtErfasst', { liste: leise.map((f) => listenName(f).replace(/\s*\?$/, '')).join(', ') }))
            )
      );
    };
    // M3: Abschnitte ohne jede Angabe in EINER Zeile; «ergänzen ›» öffnet sie alle.
    const leereZeile = (liste) => {
      const zu = liste.filter((g) => !offeneAbschnitte[g.key] && g.felder.filter(feldSichtbar).length > 0);
      if (zu.length === 0) return null;
      return React.createElement('div', { key: 'leer', 'data-teil': 'leere-abschnitte', style: { borderTop: '1px solid ' + palette.border + '88', paddingBottom: space.sm + 'px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm + 'px', minHeight: '44px' } },
          React.createElement('h3', { style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.mid } }, zu.map((g) => g.titel).join(' · ')),
          React.createElement('button', {
            type: 'button', className: 'mp-link',
            // Die Zeile verschwindet beim Öffnen — der Fokus geht auf «fertig» des ersten geöffneten Abschnitts
            // (A11y-Prüfung 25.10.2026, sonst fiele er auf den Seitenanfang).
            onClick: () => {
              if (zu.some((g) => g.sek) && !showSecondary) toggleSecondary();
              setOffeneAbschnitte((o) => ({ ...o, ...Object.fromEntries(zu.map((g) => [g.key, true])) }));
              setTimeout(() => { const k = document.querySelector('#mp-section-' + zu[0].key + ' button[aria-expanded="true"]'); if (k) k.focus(); }, 0);
            },
            'aria-label': tr('chapterView.abschnitt.ergaenzenAria', { name: zu.map((g) => g.titel).join(', ') }),
            style: linkKnopf,
          }, tr('chapterView.abschnitt.ergaenzen') + ' ›')
        ),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, paddingLeft: space.sm + 'px' } }, tr('chapterView.abschnitt.leer'))
      );
    };
    const hatAngabe = (g) => g.felder.filter(feldSichtbar).some(abschnittGefuellt);
    const liste = (gs) => React.createElement('div', { 'data-teil': 'angaben-liste', style: { marginBottom: space.lg + 'px', borderBottom: '1px solid ' + palette.border + '88' } },
      ...gs.filter((g) => hatAngabe(g) || offeneAbschnitte[g.key]).map(abschnitt),
      leereZeile(gs.filter((g) => !hatAngabe(g))));
    if (istFinanzen) {
      const hatSekFelder = chapter.fields.some((f) => f.secondary);
      return React.createElement('div', null,
        liste(gruppen.filter((g) => !g.sek || showSecondary)),
        hatSekFelder && React.createElement('div', { key: 'mehr', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', margin: '-' + space.sm + 'px 0 ' + space.lg + 'px' } },
          React.createElement('button', {
            type: 'button', onClick: toggleSecondary, 'aria-expanded': showSecondary,
            style: { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.full, cursor: 'pointer', fontSize: text.sm, color: palette.text, padding: '8px 16px', minHeight: '44px', fontFamily: 'inherit' },
          }, tr(showSecondary ? 'chapterView.showLess' : 'chapterView.showMore')),
          !showSecondary && secondaryHasData && React.createElement('small', { 'data-hinweis': 'ausgeblendet-mit-daten', style: { fontSize: text.xs, color: palette.mid } }, tr('chapterView.hasHiddenData'))
        )
      );
    }
    // Die «mehr»-Abschnitte (Eigentum, Mobilität …) stehen mit in der Liste: mit Angaben als
    // Abschnitt, ohne in der einen Zeile «noch leer» (M3) — kein eigener Knopf mehr davor.
    return liste(gruppen);
  };

  // ─── Fassung 5 · Kapitel Finanzen (Entscheid 23.10.2026) ──────────────────────────────
  // Ein Text mit «{betrag}» und dem Betrag fett darin — die Wortstellung bleibt je Sprache.
  const mitBetrag = (key, wert, format = zahl) => {
    const [vor, nach = ''] = tr(key).split('{betrag}');
    return [vor, React.createElement('b', { key: 'b', style: { color: palette.text, fontWeight: weight.semi, whiteSpace: 'nowrap' } }, format(wert)), nach];
  };
  // Entscheide 24.10.2026 (docs/entscheide/finanzen-fusion.md): eigener Lohn brutto → die
  // Netto-Frage statt einer Zahl, die so nie auf dem Konto liegt (wie die Budget-Seite). Im Minus
  // «Jeden Monat fehlen» statt nichts. Ohne eigenes Einkommen nur, wenn der Haushalt etwas zu sagen
  // hat. Steht die Haushalts-Zeile darunter, nennt die obere Zeile das eigene Einkommen.
  const renderMonatsHeld = () => {
    const m = monatsUebersicht(data, allData);
    if (!m) return null;
    const label = { fontSize: text.sm, color: palette.mid, marginBottom: '2px' };
    if (m.brutto && m.einkommen > 0) {
      return React.createElement('div', { 'data-teil': 'monat-bleiben', style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: label }, tr('chapters.finanzen.monat.bleiben')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, tr('budgetSync.availableNeedsNetto'))
      );
    }
    const h = haushaltsSaldo(allData, m.bleibt);
    if (m.einkommen <= 0 && !h) return null;
    const plus = m.bleibt >= 0;
    const titelKey = 'chapters.finanzen.monat.' + (h ? (plus ? 'eigenBleiben' : 'eigenFehlen') : (plus ? 'bleiben' : 'fehlen'));
    // «netto» nur, wenn das Einkommen als Netto erfasst ist — sonst stimmte das Wort nicht.
    // Mit Nebenerwerb muss auch er als netto erfasst sein (Fassung 6: er zählt jetzt mit).
    const allesNetto = data.incomeType === 'netto' && (!(Number(data.sideIncome) > 0) || data.sideIncomeType === 'netto');
    const einkommenKey = allesNetto ? 'chapters.finanzen.monat.vonEinkommenNetto' : 'chapters.finanzen.monat.vonEinkommen';
    return React.createElement('div', { 'data-teil': 'monat-bleiben', style: { marginBottom: space.md + 'px' } },
      React.createElement('div', { style: label }, tr(titelKey)),
      React.createElement('div', { style: { fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, lineHeight: 1.2, marginBottom: space.sm + 'px' } }, betrag(Math.abs(m.bleibt))),
      // Der Balken wiederholt nur die Zahlen darunter — darum für Screenreader stumm.
      // Fassung 6 («nachentschieden» 24.10.2026): unterteilt in Wohnen · Versicherungen · Steuern ·
      // Übriges; der leere Rest ist, was bleibt. Gemessen am Einkommen, im Minus an den Ausgaben.
      renderMonatsBalken(m),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', marginTop: space.xs + 'px', fontSize: text.sm, color: palette.mid } },
        React.createElement('span', null, ...mitBetrag('chapters.finanzen.monat.verplant', m.verplant)),
        m.einkommen > 0 && React.createElement('span', null, ...mitBetrag(einkommenKey, m.einkommen))
      ),
      renderDoppeltVersichert(),
      renderHaushaltsSaldo(h)
    );
  };
  // Seit 25.10.2026 zählen Hausrat- und Haftpflicht-Prämie aus dem Kapitel Versicherungen. Wer sie
  // vorher in «Weitere Versicherungen» (Pauschale) eingetragen hat, zählt sie jetzt doppelt — die App
  // kann nichts herausrechnen und zieht nichts still ab; sie sagt es nur (Fachprüfung 25.10.2026).
  const renderDoppeltVersichert = () => {
    const v = allData?.versicherungen || {};
    const weitere = Number(data.otherInsurance) > 0;
    const praemie = Number(v.householdInsuranceAmount) > 0 || Number(v.liabilityPremium) > 0;
    return weitere && praemie && React.createElement('p', { 'data-teil': 'doppelt-versichert', style: { margin: space.sm + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } },
      tr('chapters.finanzen.monat.doppeltVersichert'));
  };
  const renderMonatsBalken = (m) => {
    const p = monatsAusgaben({ ...(allData || {}), finanzen: data });
    const teile = [
      // Muster M8 (25.10.2026): die Bereichsfarben der Kapitel Wohnen und Versicherungen (vorher rose / sky).
      { key: 'wohnen', wert: p.rent + p.utilities + p.mortgage + p.buildingsInsurance, farbe: bereichsTon('wohnen', palette) || palette.rose },
      { key: 'versicherungen', wert: p.healthInsurance + p.householdInsurance + p.liabilityInsurance + p.otherInsurance, farbe: bereichsTon('versicherungen', palette) || palette.sky },
      { key: 'steuern', wert: p.tax, farbe: '#8B7355' },
    ];
    teile.push({ key: 'uebriges', wert: Math.max(0, m.verplant - teile.reduce((a, x) => a + x.wert, 0)), farbe: palette.gold });
    const basis = Math.max(m.einkommen, m.verplant) || 1;
    const sichtbar = teile.filter((x) => x.wert > 0);
    return React.createElement('div', { 'aria-hidden': 'true', 'data-teil': 'monat-balken' },
      React.createElement('div', { style: { display: 'flex', height: '10px', borderRadius: radius.full, background: palette.up, border: '1px solid ' + palette.border, overflow: 'hidden' } },
        ...sichtbar.map((x) => React.createElement('div', { key: x.key, style: { width: (x.wert / basis) * 100 + '%', background: x.farbe } }))
      ),
      sichtbar.length > 1 && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '2px ' + space.sm + 'px', marginTop: '4px', fontSize: text.xs, color: palette.mid } },
        ...sichtbar.map((x) => React.createElement('span', { key: x.key, style: { display: 'inline-flex', alignItems: 'center', gap: '4px', color: palette.mid } },
          React.createElement('span', { style: { width: '8px', height: '8px', borderRadius: radius.hair, background: x.farbe } }),
          tr('chapters.finanzen.monat.teil.' + x.key)
        ))
      )
    );
  };
  // Zweite Zeile: der Haushalt wie auf der Budget-Seite — nur, wenn er abweicht.
  const renderHaushaltsSaldo = (h) => {
    if (!h) return null;
    return React.createElement('div', { 'data-teil': 'monat-haushalt', style: { marginTop: space.sm + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '88' } },
      h.brutto
        ? React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, tr('budgetSync.availableNeedsNetto'))
        : React.createElement('div', { style: { fontSize: text.sm, color: palette.text } },
            ...mitBetrag(h.rest >= 0 ? 'chapters.finanzen.monat.haushaltBleiben' : 'chapters.finanzen.monat.haushaltFehlen', Math.abs(h.rest), betrag)),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '2px' } }, tr('chapters.finanzen.monat.haushaltWie'))
    );
  };
  // Die Auswertung (früher die Finanz-Übersicht), in zwei Teilen um «Passend» herum —
  // components/FinanzAuswertung.jsx, erst bei Bedarf geladen. Zusammenlegung 24.10.2026.
  const renderAuswertung = (teil) => React.createElement(React.Suspense, { key: 'auswertung-' + teil, fallback: null },
    React.createElement(FinanzenImKapitel, {
      teil, palette, t: tr, data: allData || { finanzen: data }, onNavigate: onNavigate || (() => {}),
      isDarkMode, chapters: chapters || [], onSelectChapter, isMobile, lang,
      onEnterSandbox: teil === 'oben' ? onEnterSandbox : undefined,
    })
  );
  // «Passend zu diesem Bereich»: nur Ziele, die es in der App gibt (Register der Ansichten).
  // Seit der Zusammenlegung (24.10.2026) stehen Übersicht und IPV oben im Kapitel; dazu kamen
  // die zwei Wege, die die Übersicht unten hatte: Budget und Behörden-Dossier.
  // Fassung 6 (Runde 9, VERGLEICH.md): in jedem Kapitel, je mit den von Sophie gewählten Zielen.
  // Muster M7 (Sophie 25.10.2026): Namen und Untertitel wie im Entwurf statt aus dem Register
  // («Ablauf · 4 Schritte», «Neue Stelle», «Lebenslauf erstellen · Aus Ihren Angaben · als PDF» …);
  // wo ein Untertitel eine Zahl nennt, ist sie gezählt (Umzug: 4 Schritte, Neue Stelle: 5).
  // Die Ablage nennt die Unterlagen, die das Kapitel kennt (wie bisher schon Notfall).
  const passendZiele = () => {
    const weg = (view, extra = {}) => {
      const subKey = SEARCH_VIEWS.find((v) => v.view === view)?.sub;
      return { key: view, titel: tr(ansichtName(view) || view), sub: subKey ? tr(subKey) : '', gehe: () => onNavigate(view), ikon: ansichtIkon(view), ...extra };
    };
    const P = (k, p) => tr('chapterView.passend.' + k, p);
    const schritte = (n) => tr('chapters.finanzen.passend.neuerJobSub', { n: String(n) });
    // Die Ablage, gefiltert auf das Kapitel (wie «Lohnausweis ablegen» bei Finanzen).
    const unterlagen = (chapter.docs || []).length ? P('unterlagen', { liste: chapter.docs.map((d) => d.label).join(', ') }) : tr('chapters.finanzen.passend.lohnausweisSub');
    const ablage = (titelKey) => ({ key: 'ablage', titel: tr(titelKey), sub: unterlagen, gehe: () => onNavigate('tresor', undefined, chapter.key), ikon: ansichtIkon('tresor') });
    const b = allData?.basis || {};
    switch (chapter.key) {
      case 'basis': return [
        // Je nach Angaben oben (Runde 9, Y). «Neu in der Schweiz» (Ablauf `zuzug`) sollte nur nach einem
        // Zuzug in den letzten 12 Monaten erscheinen; ein Zuzugsdatum gibt es im Profil nicht. Abnahme F6
        // (Sophie 25.10.2026): weglassen, bis es ein Datum gibt — sonst stünde es auch nach 20 Jahren da.
        ...(b.nationality && b.nationality !== 'swiss' ? [weg('bewilligung', { sub: P('bewilligungSub') }), weg('einbuergerung', { sub: P('einbuergerungSub') })] : []),
        weg('lebensmappe', { sub: P('lebensmappeSub') }),
        weg('ausweis', { sub: P('ausweisSub') }),
        weg('gepaeck', { key: 'familie', titel: P('familie'), sub: P('familieSub'), ikon: 'family' }),
        ablage('chapterView.passend.ablageBasis'),
      ];
      case 'wohnen': return [weg('umzug', { sub: schritte(4) }), weg('mietzins', { sub: P('mietzinsSub') }), weg('wohnunggekuendigt', { sub: P('gekuendigtSub') }), ablage('chapterView.passend.ablageWohnen')];
      // Runde 9 AA nachgebessert: zuoberst «Alle Versicherungen auf einen Blick» → die Versicherungs-Übersicht
      // (Runde 9 AB, seiten-buendeln.md §11), im Untertitel mit ihrem Namen wie im Entwurf.
      case 'versicherungen': return [
        weg('praemien', { key: 'alle-versicherungen', titel: P('alleVersicherungen'), sub: tr(ansichtName('praemien') || 'praemien') + ': ' + P('alleVersicherungenSub') }),
        weg('premium', { sub: P('ipvSub') }), weg('kvgwechsel', { sub: P('kvgwechselSub') }), weg('vorsorge', { sub: P('vorsorgeSub') }),
        ablage('chapterView.passend.ablageVersicherungen'),
      ];
      case 'ausbildung': return [
        weg('cv', { titel: P('cv'), sub: P('cvSub') }), weg('neuerjob', { titel: P('neueStelle'), sub: schritte(5) }),
        weg('stelleverloren', { sub: P('stelleverlorenSub') }), weg('stundenlohn', { titel: P('stundenlohn'), sub: P('stundenlohnSub') }),
        ablage('chapterView.passend.ablageAusbildung'),
      ];
      case 'behoerden': return [
        // Je nach Angaben (Runde 9, AD): Einträge im Betreibungsregister → Zahlungsbefehl und Schulden-Hilfe nach oben.
        ...(data?.betreibungsStatus === 'entries' ? [weg('betreibung'), weg('schulden')] : []),
        weg('tax', { sub: P('steuernSub') }), weg('betreibungsauszug'),
        ...(data?.betreibungsStatus === 'entries' ? [] : [weg('betreibung')]),
        weg('vorsorgeauftrag', { sub: tr('behoerdenInstrument.vorsorgeWegSub') }), weg('briefe', { sub: P('briefeSub') }),
        ablage('chapterView.passend.ablageDokumente'),
      ];
      // Runde 9, AE (dritte Fassung): Patientenverfügung und Bestattungswünsche führen jetzt aus «Vorsorge»
      // oben selbst zum Werkzeug — hier bleibt die Ablage, mit den Unterlagen, die dazugehören.
      case 'notfall': return [ablage('chapterView.passend.ablageDokumente')];
      default: return [
        // Der Ablauf «Neuer Job» hat fünf Schritte (NeuerJob.jsx, step1–step5); im Entwurf «Neue Stelle».
        { key: 'neuerjob', titel: P('neueStelle'), sub: schritte(5), gehe: () => onNavigate('neuerjob'), ikon: ansichtIkon('neuerjob') },
        // Wie der Ablauf «Neuer Job»: die Ablage, gefiltert auf Finanzen.
        { key: 'lohnausweis', titel: tr('chapters.finanzen.passend.lohnausweis'), sub: unterlagen, gehe: () => onNavigate('tresor', undefined, 'finanzen'), ikon: ansichtIkon('tresor') },
        { key: 'budget', titel: tr('budgetSync.title'), sub: tr('chapters.finanzen.passend.budgetSub'), gehe: () => onNavigate('sync'), ikon: ansichtIkon('sync') },
        // Entscheid «Steuern aufteilen» (24.10.2026): Geld hier, Behördengang im Kapitel Behörden — beide verweisen
        // aufeinander (Behörden: Zeile «Steuerbetrag und Belastung» beim Kalenderblatt).
        { key: 'steuerfrist', titel: P('steuerfrist'), sub: P('steuerfristSub'), gehe: () => onNavigate('chapter', 5), ikon: ansichtIkon('tax') },
        // Zeichen wie auf der früheren Übersicht («mappe»); das Dossier steht nicht im Ansichten-Register.
        { key: 'dossier', titel: tr('behoerdenDossier.title'), sub: tr('behoerdenDossier.subtitle'), gehe: () => onNavigate('behoerdendossier'), ikon: 'mappe' },
      ];
    }
  };
  // M7: das Zeichen in einer Kachel (36 px) in der Bereichsfarbe, wie im Entwurf — vorher klein ohne Kachel.
  const renderPassend = () => {
    if (!onNavigate) return null;
    const ziele = passendZiele();
    return React.createElement('section', { 'data-teil': 'passend', 'aria-labelledby': 'mp-passend-titel', style: { marginTop: space.xl + 'px' } },
      React.createElement('h3', { id: 'mp-passend-titel', style: { margin: '0 0 4px', fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, tr('chapters.finanzen.passend.titel')),
      ...ziele.map((z) => React.createElement('button', {
        key: z.key, type: 'button', className: 'mp-link', onClick: z.gehe,
        style: { display: 'flex', alignItems: 'center', gap: space.md + 'px', width: '100%', minHeight: '56px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border + '88', padding: space.sm + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
      },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '36px', height: '36px', borderRadius: radius.md, display: 'grid', placeItems: 'center', flexShrink: 0, background: bereichsfarbe ? bereichsfarbe.grund : palette.up, boxShadow: 'inset 0 0 0 1px ' + (bereichsfarbe ? bereichsfarbe.schrift + '4D' : palette.border), color: bereichsfarbe ? bereichsfarbe.schrift : palette.sageDeep } }, React.createElement(Icon, { name: z.ikon, size: 18 })),
        React.createElement('span', { style: { flex: 1, minWidth: 0 } },
          React.createElement('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, z.titel),
          z.sub && React.createElement('small', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, z.sub)
        ),
        React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›')
      ))
    );
  };
  // Muster M6 (Fassung 6, Sophie 25.10.2026): «Als Nächstes» ruhig wie im Entwurf — zentriert über
  // einer Linie, leiser Umrissknopf statt gefüllter Karte mit Goldknopf und Versalien. Gleich für
  // «Alle Kapitel durchgegangen» (Notfall), dort zusätzlich «Ihre Daten bleiben auf diesem Gerät.».
  // Rand in palette.mid: ein Bedienelement braucht 3:1 gegen den Grund (palette.border hat 1.3:1; A11y-Prüfung).
  const ruhigerKnopf = { display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px', padding: '10px 16px', border: '1px solid ' + palette.mid, borderRadius: radius.full, background: 'transparent', color: palette.text, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium };
  const ruhigesEnde = (etikett, titel, satz, knopf, onClick, fuss) => React.createElement('section', { 'data-teil': 'als-naechstes', style: { marginTop: space.xl + 'px', padding: space.lg + 'px 0 ' + space.xs + 'px', borderTop: '1px solid ' + palette.border, textAlign: 'center' } },
    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '4px' } }, etikett),
    React.createElement('h3', { style: { margin: '0 0 4px', fontSize: text.xl, fontWeight: weight.semi, color: palette.text } }, titel),
    satz && React.createElement('p', { style: { margin: '0 0 ' + space.md + 'px', fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } }, satz),
    React.createElement('button', { type: 'button', className: 'mp-link', onClick, style: ruhigerKnopf }, knopf, ' ›'),
    fuss && React.createElement('p', { style: { margin: space.md + 'px 0 0', fontSize: text.xs, color: palette.mid } }, fuss)
  );
  const renderAlsNaechstes = () => ruhigesEnde(tr('chapterView.alsNaechstes'), nextChapter.title, nextChapter.description,
    tr('dashboard.nextUpWeiter', { name: nextChapter.title }), onNext);

  // Das letzte Kapitel (Notfall) endete ohne Weg — jetzt zurück zur Übersicht (Runde 9, AE).
  const renderAlleDurch = () => ruhigesEnde(tr('chapterView.alleDurch'), tr('chapterView.zurUebersichtTitel'), tr('chapterView.zurUebersichtSatz'),
    tr('chapterView.zurUebersicht'), () => onNavigate('dashboard'), tr('trust.localOnly'));

  // Muster M5 (Fassung 6, Sophie 25.10.2026): Kopf wie im Entwurf — Landschaftsband in der
  // Bereichsfarbe, darauf die Brotkrume «Übersicht › Kapitel», darunter das Symbol in einer Kachel
  // und der Titel. Keine Karte mehr um das Kapitel (vorher Kopf und Inhalt in einer Karte, die Seite
  // dahinter getönt; Entscheid 27.09.2026). Das Band reicht bis an den Rand (main: 20 px seitlich).
  const kachelGrund = bereichsfarbe ? bereichsfarbe.grund : palette.up;
  return React.createElement('div', { 'data-kapitel': chapter.key },
    React.createElement('div', { 'data-kapitelkopf': 'band', style: { textAlign: 'left', marginBottom: space.lg + 'px' } },
      React.createElement('div', { 'aria-hidden': 'true', style: { position: 'relative', height: '112px', margin: '0 -20px', overflow: 'hidden' } },
        React.createElement('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'url(' + landschaft + ')', backgroundSize: 'cover', backgroundPosition: 'center 72%', opacity: 0.5 } }),
        React.createElement('div', { style: { position: 'absolute', inset: '0 0 -1px 0', background: 'linear-gradient(to bottom, ' + kachelGrund + ' 0%, transparent 45%, ' + palette.bg + ' 100%)' } })
      ),
      React.createElement('nav', { 'aria-label': tr('nav.pfad'), style: { position: 'relative', marginTop: '-46px', marginBottom: space.md + 'px' } },
        React.createElement('ol', { style: { listStyle: 'none', margin: 0, padding: '0 10px', display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 6px', borderRadius: radius.full, background: palette.bg + 'E6', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontSize: text.sm } },
          React.createElement('li', null, React.createElement('button', {
            type: 'button', className: 'mp-link', onClick: () => onNavigate && onNavigate('dashboard'),
            style: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid, padding: '0 4px', margin: '0 -4px', minHeight: '44px' },
          }, tr('nav.backToDashboard'))),
          React.createElement('li', { 'aria-hidden': 'true', style: { color: palette.mid } }, '›'),
          React.createElement('li', { 'aria-current': 'page', style: { color: palette.text, fontWeight: weight.medium } }, chapter.title)
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: space.sm + 'px' } },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '52px', height: '52px', borderRadius: radius.lg, display: 'grid', placeItems: 'center', flexShrink: 0, background: kachelGrund, boxShadow: 'inset 0 0 0 1px ' + (bereichsfarbe ? bereichsfarbe.schrift + '4D' : palette.border), color: bereichsfarbe ? bereichsfarbe.schrift : accent.icon } },
          React.createElement(Icon, { name: chapter.key, size: 26 })
        ),
        // Titel wie Entwurf G (30 px Display, Stebler Studios 27.10.2026: «die Kapitel-Köpfe genauso angleichen»);
        // gleich wie der Kopf von «Was ansteht» (CalendarReminders), Wächter: kopfTitelGleich.test.js.
        React.createElement(PageTitle, { palette, style: { color: palette.text, minWidth: 0, fontFamily: fontFamilyDisplay, fontSize: '30px', lineHeight: 1.05, letterSpacing: '-0.015em' } }, chapter.title)
      ),
      React.createElement('p', { style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '560px' } }, chapter.description),
      hasIntro && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: space.sm + 'px 0 0', lineHeight: leading.relaxed, maxWidth: '560px' } }, introText)
    ),

    // Fassung 5 · «Jeden Monat bleiben» — nur Finanzen. Rechnet genau wie der Satz
    // «Es bleiben CHF …» (utils/monatsrechnung.js). Seit 24.10.2026 im Minus «Jeden Monat
    // fehlen» (wie der Satz «Es fehlen …»), bei Brutto die Netto-Frage — siehe renderMonatsHeld.
    chapter.key === 'finanzen' && renderMonatsHeld(),

    // Beispiel-Hinweis steht seit 27.09.2026 im geöffneten Abschnitt, dort wo man tippt
    // (Abschnittsliste) — oben war er Vorspann vor jedem Inhalt.

    // «Ihre Daten fliessen in …» (Chips) entfiel am 27.09.2026: Vorspann vor dem Inhalt.
    // Die Wege zu den Werkzeugen stehen als Querverweise an den Feldern selbst.

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
    // Nur der Satz — die Tabellen wiederholten, was die Abschnittsliste zeigt (27.09.2026).
    React.createElement(MirrorCards, { chapterKey: chapter.key, data: data, allData: allData, palette: palette, t: tr }),

    // Fassung 6 · Kapitel Wohnen (Runde 9, Entwurf Z): Wohnkosten pro Monat mit Drittel-Marke,
    // Regional-Barometer und «Ausprobieren: andere Miete». Einkommen und «Frei verfügbar» aus der
    // einen Monatsrechnung; der Regler verändert das Profil nie.
    chapter.key === 'wohnen' && allData && React.createElement(React.Suspense, { key: 'wohnkosten', fallback: null },
      React.createElement(WohnkostenInstrument, { palette, t: tr, wohnen: data, allData, isDarkMode })
    ),

    // Fassung 6 · Kapitel Behörden (Runde 9, Entwurf AD): Steuerfrist als Kalenderblatt, Behördengänge offen,
    // «Für den Fall der Fälle». Die Haken der Behördengänge bleiben im selben Speicher wie die frühere Checkliste.
    chapter.key === 'behoerden' && React.createElement(React.Suspense, { key: 'behoerden-instrument', fallback: null },
      React.createElement(BehoerdenInstrument, {
        palette, t: tr, behoerden: data, allData, onNavigate, lang, checked: checklistChecked,
        onToggle: (id, wert) => {
          const next = { ...checklistChecked, [id]: wert };
          setChecklistChecked(next);
          try { localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next)); } catch { /* privat: nur im Speicher */ }
        },
      })
    ),

    // Fassung 6 · Kapitel Ausbildung (Runde 9, Entwurf AC): oben «Wo steht Ihr Lohn?» — dasselbe Barometer wie in
    // der Finanz-Auswertung (mit «So ist gerechnet») — und die Vorschau des Lebenslaufs aus den Angaben.
    // `aktuellesKapitel` fest 'ausbildung': ein «fehlt noch …»-Hinweis springt nicht ins eigene Kapitel.
    chapter.key === 'ausbildung' && allData && React.createElement(React.Suspense, { key: 'ausbildung-oben', fallback: null },
      React.createElement('div', { 'data-teil': 'ausbildung-lohn', style: { marginBottom: space.lg + 'px' } },
        React.createElement(LohnEinordnung, { palette, t: tr, data: { ...allData, ausbildung: data }, isDarkMode, embedded: true, onNavigate, aktuellesKapitel: 'ausbildung' })
      ),
      React.createElement(LebenslaufVorschau, { palette, t: tr, ausbildung: data, allData, onNavigate })
    ),

    // Fassung 6 · Kapitel Versicherungen (Runde 9, Entwurf AA, nachgebessert): Versicherungen pro Monat,
    // KK-Last, Schutzschild klein, Franchise-Kreuz klein mit Weg zur Übersicht. Das grosse Schutzschild
    // stand bis 25.10.2026 weiter unten (Instrument #4); es lebt jetzt hier in der kleinen Fassung.
    chapter.key === 'versicherungen' && allData && React.createElement(React.Suspense, { key: 'versicherungen-instrument', fallback: null },
      React.createElement(VersicherungenInstrument, { palette, t: tr, versicherungen: data, allData, onNavigate, uebersichtName: tr(ansichtName('praemien') || 'praemien') })
    ),

    // Notfallübergabe entfiel am 27.09.2026 (Wiederholung der Abschnittsliste).

    // Notfall · «ein Ort» (Runde 9, AE; gebaut Abnahme F6, 25.10.2026): nach der Zusammenfassung
    // Ernstfall, «Bereit für den Ernstfall», die vier Unterlagen und Vorsorge. Die Portemonnaie-Karte
    // (früher «Notfallkarte drucken») ist eine der vier Kacheln; ihre Vorschau (K20, Feldnamen, nie
    // Werte) steht zugeklappt darunter, bis die Kachel sie öffnet.
    isNotfall && React.createElement(NotfallErnstfallKnopf, { palette, t: tr, onNavigate }),
    isNotfall && React.createElement(NotfallImKapitel, {
      palette, t: tr, data: allData || { notfall: data }, chapters: chapters || [], onNavigate,
      onUpdate, demoMode, zumFeld,
      karteMoeglich: !!hasMedical,
      onKarteDrucken: () => setKartenVorschau((v) => !v),
      karteVorschau: kartenVorschau && hasMedical && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
        React.createElement(ExportVorschau, {
          palette, t: tr, art: 'dossier',
          quelle: { abschnitte: notfallkarteAbschnitte().map(s => ({ titel: s.title, felder: s.felder })) },
          onWeiter: () => { setKartenVorschau(false); handleSaveCard(); },
          onZurueck: () => setKartenVorschau(false),
        })),
    }),

    // Versicherungsübersicht entfiel am 27.09.2026 (Wiederholung der Abschnittsliste).

    // Behörden: der Kasten «Folgende Stände und Fristen sind erfasst» und die zugeklappte «Behörden-Checkliste»
    // standen bis 25.10.2026 hier. Seit Fassung 6 (Runde 9, Entwurf AD) ersetzt sie das Behörden-Instrument oben
    // (components/BehoerdenInstrument.jsx): Kalenderblatt, Behördengänge offen, «Für den Fall der Fälle».

    // Wohnen: der Kasten «Wohnkosten / Einkommen / Anteil» und der MietVergleich standen bis
    // 24.10.2026 hier. Seit Fassung 6 (Runde 9, Entwurf Z) ersetzt sie das Wohnkosten-Instrument
    // oben unter der Zusammenfassung (components/WohnkostenInstrument.jsx).

    // Versicherungs-Schutzschild (Instrument #4): seit 25.10.2026 klein im Versicherungen-Instrument
    // oben (components/VersicherungenInstrument.jsx), nicht mehr gross an dieser Stelle.

    // ─── Contextual orientation hints (Helvetia layer) ──────
    // Finanzen: der IPV-Hinweis und das Lohn-Barometer standen hier bis 24.10.2026. Seit der
    // Zusammenlegung mit der Finanz-Übersicht stehen IPV-Karte und Lohn-Barometer in der
    // Auswertung unter dem Formular (renderAuswertung, components/FinanzAuswertung.jsx).

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
      }, hinweisZeichen(), React.createElement(GlossarText, { palette, t: tr }, tr('orientation.contextFamilienzulagen'))),

    // F7-K2-5 (Sophie 27.10.2026): Die Auswertung (Lebensbaum, Lohn, Steuern, IPV, KK-Last, Vermögen) steht vor
    // den Angaben, wie die Instrumente der anderen Kapitel — vorher kam sie erst nach dem ganzen Formular
    // (finanzen-fusion.md §3, Entscheid 2 «nach den Angaben»; damit überholt).
    istFinanzen && renderAuswertung('oben'),

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

    // Fields Tab — seit 27.09.2026 die Abschnittsliste (abschnittsliste oben).
    expandedSection === 'fields' && React.createElement('div', null,
      filledCount === 0 && React.createElement('div', { style: { padding: space.lg + 'px', background: palette.sageMist || palette.up, borderRadius: radius.md, border: '1px solid ' + palette.sage + '22', textAlign: 'center', marginBottom: space.lg + 'px' } },
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyState'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyState'); })()
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 10px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyStateHint'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyStateHint'); })()
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: text.xs, color: palette.sageDeep } },  // kein opacity: 0.8 ergab 3.85:1 hell
          React.createElement(TrustLockIcon, { size: 11, color: 'currentColor' }),
          tr('trust.chapterTrust')
        )
      ),
      // Versicherungen: das Netz über den Abschnitten, sobald etwas eingetragen ist. Ein Tipp
      // auf eine Achse öffnet den Abschnitt darunter und springt hin (id mp-section-<erstes Feld>).
      chapter.key === 'versicherungen' && filledCount > 0 && React.createElement(React.Suspense, { fallback: null },
        React.createElement(VersicherungsNetz, {
          chapter, data, palette, tr,
          onAbschnitt: (key) => {
            setOffeneAbschnitte((o) => ({ ...o, [key]: true }));
            // Erst nach dem Zeichnen des aufgeklappten Abschnitts springen: mit requestAnimationFrame
            // lief der Sprung zu früh und die Seite blieb stehen (im Browser gemessen 24.10.2026).
            setTimeout(() => document.getElementById('mp-section-' + key)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
          },
        })
      ),
      abschnittsliste()
    ),

    // Documents Tab
    expandedSection === 'documents' && chapter.docs && React.createElement('div', null,
      React.createElement(PanelTitle, { palette, style: { marginBottom: space.md } }, hinweisZeichen('upload'), tr('chapterView.upload')),

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
            uploadType && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, hinweisZeichen(), getFileExpiryHint(uploadType, tr))
          )
        ),

        React.createElement('label', { ...ablageProps, style: { display: 'block', padding: '20px', background: palette.surface, border: '2px dashed ' + (ablageAktiv ? palette.sageDeep : palette.border), borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          // Nach der Wahl steht der Dateiname da, wo vorher «Datei auswählen» stand —
          // sonst sieht niemand (und hört kein Screenreader), welche Datei hochgeht.
          hinweisZeichen(uploadFile ? 'document' : 'kaestchen'), uploadFile ? uploadFile.name : tr('chapterView.selectFile'),
          React.createElement('input', {
            type: 'file',
            onChange: (e) => { setUploadFile(e.target.files?.[0]); setUploadError(''); },
            className: 'mp-datei-eingang', style: visuallyHiddenStyle,
          })
        ),

        // Fassung 5 · Finanzen: «Dokument fotografieren» als zweiter Weg zur Datei. Kein eigener
        // Kamera-Code — derselbe Datei-Eingang mit `capture`: auf dem Handy öffnet er die Kamera,
        // sonst die Dateiwahl. Wird die Kamera abgelehnt, bleibt «Datei auswählen» darüber.
        istFinanzen && React.createElement('label', {
          'data-weg': 'fotografieren',
          style: { display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', padding: '0 ' + space.md + 'px', marginBottom: '12px', border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontSize: text.sm, fontWeight: weight.medium, cursor: 'pointer', boxSizing: 'border-box' },
        },
          tr('chapterView.fotografieren'),
          React.createElement('input', {
            type: 'file', accept: 'image/*', capture: 'environment',
            onChange: (e) => { setUploadFile(e.target.files?.[0]); setUploadError(''); },
            className: 'mp-datei-eingang', style: visuallyHiddenStyle,
          })
        ),

        uploadError && React.createElement('div', { role: 'alert', style: { padding: space.sm + 2, background: palette.rose + '22', border: '1px solid ' + palette.rose, borderRadius: radius.sm, color: palette.roseDeep, fontSize: text.sm, marginBottom: space.sm + 4 } }, uploadError),

        // Die Status-Region steht immer da und füllt sich erst — eine Region, die MIT
        // ihrem Text erscheint, wird von Screenreadern oft nicht angesagt.
        React.createElement('div', { role: 'status' },
          uploadSuccess && React.createElement('div', { style: { padding: space.sm + 2, background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.sm, color: palette.sageDeep, fontSize: text.sm, marginBottom: space.sm + 4 } }, hinweisZeichen('check'), uploadSuccess)),

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
            // Dritter Zustand (Robustheits-Checkliste): eine unlesbare Datei darf den Knopf nicht
            // stumm stehen lassen — vorher gab es nur Erfolg oder nichts (Voll-Review 15.09.2026).
            reader.onerror = () => { setUploadError(tr('chapterView.uploadError') + ': ' + (reader.error?.message || uploadFile.name)); };
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
        }, hinweisZeichen('upload'), tr('chapterView.upload'))
      ),

      // Required documents list
      React.createElement('div', { style: { padding: space.sm + 4, background: palette.up, borderRadius: radius.sm } },
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm + 2 } }, hinweisZeichen('kaestchen'), tr('chapterView.requiredDocs')),
        React.createElement('ul', { style: { fontSize: text.sm, paddingLeft: '20px', margin: 0 } },
          chapter.docs.map((doc, idx) => React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc.label))
        )
      ),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '12px', letterSpacing: '0.2px' } },
        tr('chapterView.trustDocuments')
      )
    ),

    // Nächstes Thema — Testperson A: am Kapitelende ruhig weitergehen, ohne hochzuscrollen.
    // Seit 27.09.2026 (Seitenrundgang) als der eine Hauptknopf «Weiter mit … ›», wie auf
    // der Übersicht — vorher eine stille Karte, die neben den Feldern kaum als Weg las.
    // Fassung 5 · Finanzen: «Passend zu diesem Bereich» und «Als Nächstes» (Entscheid 23.10.2026).
    // Zusammenlegung mit der Finanz-Übersicht (24.10.2026): nach dem Formular die Auswertung,
    // nach «Passend» der Druck und der Hinweis (docs/entscheide/finanzen-fusion.md §3).
    // Fassung 6 (Runde 9): «Passend» und «Als Nächstes» in jedem Kapitel. Notfall: die drei Lagen
    // stehen seit AE zugeklappt in «Bereit für den Ernstfall»; das letzte Kapitel endet mit «Alle
    // Kapitel durchgegangen».
    renderPassend(),
    istFinanzen && renderAuswertung('unten'),
    nextChapter && onNext ? renderAlsNaechstes() : (!nextChapter && onNavigate ? renderAlleDurch() : null),

    // Chapter arrival — quiet rest moment when enough data is present
    (() => {
      const primaryFields = chapter.fields.filter(f => !f.secondary);
      const primaryFilled = primaryFields.filter(f => feldHatWert(data, f.k)).length;
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
