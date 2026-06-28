import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './tokens.css';
import './print.css';
import { DARK_PALETTE, LIGHT_PALETTE, getChapters, CHAPTER_KEYS } from './config/constants.js';
import { DEMO_DATA } from './config/demoData.js';
import { cantonFromPLZ, gemeindeFromPLZ, preloadPLZ } from './config/cantonalData.js';
import { I18nProvider, useT } from './i18n/index.js';
import { useVorlesen } from './hooks/useVorlesen.js';
import { VorlesenContext } from './hooks/vorlesenContext.js';
import { registerServiceWorker, checkOverdueReminders } from './utils/notifications.js';
import { migrateData } from './utils/dataMigration.js';
import { validateData, validateDocs } from './utils/dataValidation.js';
import { createBackup } from './utils/autoBackup.js';
import { parseHash, setHash, replaceHash, onHashChange } from './utils/hashRouter.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import SettingsView from './SettingsView.jsx';
import Dashboard from './Dashboard.jsx';
import ChapterView from './ChapterView.jsx';
import OverdueBanner from './OverdueBanner.jsx';
import { Onboarding, isOnboardingDone } from './Onboarding.jsx';
import { syncDocumentReminders } from './utils/docReminders.js';
import LegalView from './LegalView.jsx';
import BetaGate from './BetaGate.jsx';
import MobileNav from './MobileNav.jsx';
import { Icon } from './IconSystem.jsx';
import AutoSaveStatus from './AutoSaveStatus.jsx';
import StorageWarning from './StorageWarning.jsx';
const DocumentTresor = React.lazy(() => import('./DocumentTresor.jsx'));
const KKScanner = React.lazy(() => import('./KKScanner.jsx'));
const BudgetImport = React.lazy(() => import('./BudgetImport.jsx'));
const TaxImport = React.lazy(() => import('./TaxImport.jsx'));
const SchuldenManager = React.lazy(() => import('./SchuldenManager.jsx'));
const TaxCalculator = React.lazy(() => import('./TaxCalculator.jsx'));
const OrganDonation = React.lazy(() => import('./OrganDonation.jsx'));
const BudgetSync = React.lazy(() => import('./BudgetSync.jsx'));
const PremiumSubsidy = React.lazy(() => import('./PremiumSubsidy.jsx'));
const CVGenerator = React.lazy(() => import('./CVGenerator.jsx'));
const ChartsAdvanced = React.lazy(() => import('./ChartsAdvanced.jsx'));
const ZipExport = React.lazy(() => import('./ZipExport.jsx'));
const MeineUnterlagen = React.lazy(() => import('./MeineUnterlagen.jsx'));
const Lebensmappe = React.lazy(() => import('./Lebensmappe.jsx'));
const NotfallDossier = React.lazy(() => import('./NotfallDossier.jsx'));
const BriefGenerator = React.lazy(() => import('./BriefGenerator.jsx'));
const BehoerdenDossier = React.lazy(() => import('./BehoerdenDossier.jsx'));
const SozialhilfeView = React.lazy(() => import('./SozialhilfeView.jsx'));
const CalendarReminders = React.lazy(() => import('./CalendarReminders.jsx'));
const NotificationSettings = React.lazy(() => import('./NotificationSettings.jsx'));
const NotfallEinstieg = React.lazy(() => import('./NotfallEinstieg.jsx'));
const PraemienOrientierung = React.lazy(() => import('./PraemienOrientierung.jsx'));
const VorsorgeRechner = React.lazy(() => import('./VorsorgeRechner.jsx'));
const StipendienView = React.lazy(() => import('./StipendienView.jsx'));
const AlvRechner = React.lazy(() => import('./AlvRechner.jsx'));
const AsylView = React.lazy(() => import('./AsylView.jsx'));
const EOrechner = React.lazy(() => import('./EOrechner.jsx'));
const FinanzUebersicht = React.lazy(() => import('./FinanzUebersicht.jsx'));
const DirektLinks = React.lazy(() => import('./DirektLinks.jsx'));
const KVGLeistungen = React.lazy(() => import('./KVGLeistungen.jsx'));
const FlyerView = React.lazy(() => import('./FlyerView.jsx'));
const MerklisteView = React.lazy(() => import('./MerklisteView.jsx'));
const SearchView = React.lazy(() => import('./SearchView.jsx'));
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, space, radius, shadow, fontFamily, duration, ease } from './config/tokens.js';

// Per-view error boundary — catches crashes in individual tools
// without taking down the entire app
class ViewErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('[Maloja Plana] View error:', err, info?.componentStack); }
  render() {
    if (!this.state.hasError) return this.props.children;
    const { palette, t } = this.props;
    return React.createElement('div', {
      role: 'alert',
      style: { padding: space.xl + 'px', textAlign: 'center', color: palette?.mid || '#888' }
    },
      React.createElement('p', { style: { fontSize: text.body, marginBottom: space.md + 'px' } },
        t ? t('error.viewCrash') : 'This section encountered an error.'
      ),
      React.createElement('button', {
        onClick: () => this.setState({ hasError: false }),
        style: { padding: space.sm + 'px ' + space.md + 'px', background: palette?.sand || '#c8a96e', color: '#000', border: 'none', borderRadius: radius.sm + 'px', cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm + 'px' }
      }, t ? t('error.tryAgain') : 'Try again')
    );
  }
}

// Language switcher component
// Native language names — ready to scale to many more languages (asylum focus).
// Geplante Asyl-Sprachen sind hier schon erfasst (native Schreibweise), damit
// die Aktivierung nur noch je einen Eintrag in i18n/index.js SUPPORTED + loaders
// braucht, sobald eine professionell übersetzte Sprachdatei vorliegt.
// Siehe docs/i18n-sprachausbau.md.
const LANGUAGE_NATIVE_NAMES = {
  de: 'Deutsch', en: 'English', fr: 'Français', it: 'Italiano', rm: 'Rumantsch',
  // Geplant (noch nicht in SUPPORTED — erst mit verifizierter Übersetzung):
  ti: 'ትግርኛ',          // Tigrinya (Eritrea/Äthiopien)
  sq: 'Shqip',          // Albanisch (Westbalkan)
  ar: 'العربية',        // Arabisch (RTL)
};

const LanguageSwitcher = ({ palette }) => {
  const { t, lang, setLanguage, supportedLanguages } = useT();

  return React.createElement('div', { style: { position: 'relative', display: 'inline-flex', alignItems: 'center' } },
    // Globe — universal "language" symbol, recognisable without reading
    React.createElement('span', {
      'aria-hidden': 'true',
      style: { position: 'absolute', insetInlineStart: '9px', pointerEvents: 'none', color: palette.mid, display: 'inline-flex' }
    },
      React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
        React.createElement('circle', { cx: '12', cy: '12', r: '9' }),
        React.createElement('path', { d: 'M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18' })
      )
    ),
    // Eingeklappt zeigen wir nur das Kürzel (DE) über ein Overlay; die aufgeklappte
    // Auswahlliste zeigt die ausgeschriebenen Namen (Deutsch, English …). Dazu wird
    // der Select-Text transparent gemacht und die feste Breite hält ihn kompakt.
    React.createElement('select', {
      value: lang,
      onChange: (e) => setLanguage(e.target.value),
      'aria-label': t('common.selectLanguage'),
      style: {
        appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        background: palette.up, color: 'transparent',
        border: '1px solid ' + palette.border, borderRadius: '6px',
        paddingBlock: '5px', paddingInlineStart: '30px', paddingInlineEnd: '26px',
        fontSize: text.xs, fontWeight: '600',
        cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1,
        width: '72px',
      }
    },
      supportedLanguages.map(l =>
        // Aufgeklappte Auswahl: ausgeschriebener nativer Name (für alle Sprachen)
        React.createElement('option', { key: l, value: l, style: { color: palette.text, background: palette.up } }, LANGUAGE_NATIVE_NAMES[l] || l.toUpperCase())
      )
    ),
    // Overlay: kompaktes Kürzel der aktuell gewählten Sprache (DE/EN/FR/IT/RM)
    React.createElement('span', {
      'aria-hidden': 'true',
      style: { position: 'absolute', insetInlineStart: '30px', pointerEvents: 'none', color: palette.text, fontSize: text.xs, fontWeight: '600', lineHeight: 1 }
    }, lang.toUpperCase()),
    React.createElement('span', {
      'aria-hidden': 'true',
      style: { position: 'absolute', insetInlineEnd: '9px', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
    }, '▾')
  );
};

const VorlesenToggle = ({ palette, t, vorlesen }) => {
  return React.createElement('button', {
    'aria-label': t('vorlesen.toggle'),
    'aria-pressed': vorlesen.enabled,
    onClick: vorlesen.toggle,
    title: t('vorlesen.toggle'),
    style: {
      padding: '6px 8px',
      background: vorlesen.enabled ? palette.sand + '30' : 'transparent',
      color: vorlesen.enabled ? palette.sand : palette.mid,
      border: vorlesen.enabled ? '1px solid ' + palette.sand + '50' : '1px solid transparent',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: `all ${duration.normal}ms ${ease}`,
    },
  },
    React.createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'currentColor' },
      React.createElement('path', { d: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0012 8.5v1.06a3.5 3.5 0 010 4.88V15.5a4.5 4.5 0 004.5-3.5z' })
    ),
    React.createElement('span', {
      style: { display: 'none' },
      className: 'mp-vorlesen-label',
    }, t('vorlesen.label'))
  );
};

const useViewport = () => {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 400);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
};

const AppInner = () => {
  const { t, lang, setLanguage, supportedLanguages, anrede, setAnrede } = useT();
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return JSON.parse(localStorage.getItem('or5_theme') || 'true'); } catch { return true; } });
  const [readable, setReadable] = useState(() => { try { return localStorage.getItem('or5_readable') === 'true'; } catch { return false; } });
  // „Einfache Ansicht" (Analphabeten-/Low-Literacy-Modus): icon-zentriertes Dashboard
  // + automatisches Vorlesen. Persistent, geräteweit.
  const [simpleView, setSimpleView] = useState(() => { try { return localStorage.getItem('or5_simpleView') === '1'; } catch { return false; } });
  useEffect(() => { try { localStorage.setItem('or5_simpleView', simpleView ? '1' : '0'); } catch {} }, [simpleView]);
  // Schwarzweiss-/Ruhe-Modus: entsättigt die ganze App (weniger Reiz, dumbphone-nah)
  const [grayscale, setGrayscale] = useState(() => { try { return localStorage.getItem('or5_grayscale') === '1'; } catch { return false; } });
  useEffect(() => { try { localStorage.setItem('or5_grayscale', grayscale ? '1' : '0'); } catch {} }, [grayscale]);
  const palette = isDarkMode ? DARK_PALETTE : LIGHT_PALETTE;
  const vorlesen = useVorlesen(lang);
  const vw = useViewport();
  const isTablet = vw >= 768;
  // Unter dieser Breite passt die volle Kopfzeile (Logo + 5 Bedienelemente + Menü)
  // nicht mehr in eine Reihe → Sekundär-Bedienelemente wandern ins ☰-Menü.
  const isMobile = vw < 560;
  const contentMax = vw >= 1024 ? '780px' : isTablet ? '680px' : '520px';

  // ─── Data loading with migration ──────────────────────────
  const [data, setData] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('or5_data') || '{}');
      const result = migrateData(raw);
      if (result.migrated) {
        localStorage.setItem('or5_data', JSON.stringify(result.data));
        console.info('[app] Data migrated v' + result.fromVersion + ' → v' + result.toVersion);
      }
      if (result.error) {
        console.error('[app] Migration error:', result.error);
      }
      const validation = validateData(result.data);
      if (!validation.valid) {
        console.warn('[app] Data validation warnings:', validation.errors);
      }
      return validation.sanitized;
    } catch { return {}; }
  });

  const [documents, setDocuments] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('or5_docs') || '[]');
      const validation = validateDocs(raw);
      if (!validation.valid) {
        console.warn('[app] Docs validation warnings:', validation.errors);
      }
      return validation.sanitized;
    } catch { return []; }
  });

  // ─── Hash routing: read initial view from URL ─────────────
  const [view, setView] = useState(() => {
    const parsed = parseHash();
    return parsed ? parsed.view : 'dashboard';
  });
  const [activeChapter, setActiveChapter] = useState(() => {
    const parsed = parseHash();
    if (parsed && parsed.chapterIndex !== null) {
      return Math.min(parsed.chapterIndex, 6); // 7 chapters (0-6)
    }
    return 0;
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [legalSection, setLegalSection] = useState('privacy');
  const [lastSave, setLastSave] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(isOnboardingDone);
  const [demoMode, setDemoMode] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [sandboxData, setSandboxData] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const sandboxActive = sandboxMode && sandboxData;
  const activeData = demoMode ? DEMO_DATA : (sandboxActive ? sandboxData : data);
  // Sandbox ("Probier-Modus"): writes go to an in-memory copy, never persisted, until applied.
  const writeData = sandboxActive ? setSandboxData : setData;
  const enterSandbox = () => { setSandboxData(JSON.parse(JSON.stringify(data))); setSandboxMode(true); setDemoMode(false); };
  const discardSandbox = () => { setSandboxMode(false); setSandboxData(null); };
  // Guard auf nicht-leeren Stand: ein leeres Sandbox-Objekt ({}) ist truthy, würde
  // aber via setData({}) alle Kapitel löschen (siehe blankSandbox).
  const applySandbox = () => { if (sandboxData && Object.keys(sandboxData).length > 0) setData(sandboxData); setSandboxMode(false); setSandboxData(null); };
  // Leere Tafel im Probier-Modus: für ein frisches Beispiel (z.B. jemandem zeigen),
  // ohne die eigenen Zahlen — nichts wird persistiert.
  const blankSandbox = () => { setSandboxData({}); setSandboxMode(true); setDemoMode(false); };
  // Views where "neben dem eigenen Stand rechnen" is meaningful → prominent entry chip
  const SANDBOX_VIEWS = ['tax', 'budget', 'vorsorge', 'alv', 'eo', 'schulden', 'premium', 'sozialhilfe', 'finanzuebersicht'];

  // Build translated chapters — recalculates when language changes
  const chapters = useMemo(() => getChapters(t), [t]);

  // ─── Hash routing: sync URL when view changes ─────────────
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    const chapterIdx = view === 'chapter' ? activeChapter : null;
    if (isFirstRender.current) {
      // First render: replace URL without creating a history entry
      replaceHash(view, chapterIdx);
      isFirstRender.current = false;
    } else {
      setHash(view, chapterIdx);
    }
  }, [view, activeChapter]);

  // ─── Hash routing: listen for browser back/forward ────────
  useEffect(() => {
    const cleanup = onHashChange((parsed) => {
      if (parsed.view === 'chapter' && parsed.chapterIndex !== null) {
        // Clamp to valid chapter range
        const maxIdx = chapters.length > 0 ? chapters.length - 1 : 0;
        setActiveChapter(Math.min(parsed.chapterIndex, maxIdx));
      }
      setView(parsed.view);
    });
    return cleanup;
  }, [chapters.length]);

  // Register service worker + check overdue reminders on mount
  useEffect(() => {
    registerServiceWorker();
    checkOverdueReminders(t);
    // PLZ->Gemeinde-Daten vorladen, damit Kanton/City-Autofill schon beim ersten PLZ-Eintrag greift
    preloadPLZ();
  }, []);

  // ─── Automatic backup on mount (once per 12h) ─────────────
  useEffect(() => {
    createBackup().then(result => {
      if (result.success) {
        console.info('[app] Auto-backup created:', result.id);
      }
    }).catch(() => { /* backup is best-effort */ });
  }, []);

  // Sync document expiry dates → calendar reminders
  useEffect(() => {
    syncDocumentReminders(documents, t);
  }, [documents]);

  useEffect(() => { localStorage.setItem('or5_theme', JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { try { localStorage.setItem('or5_readable', String(readable)); } catch {} document.documentElement.classList.toggle('mp-readable', readable); }, [readable]);
  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const lastPersistedData = React.useRef(data);
  const lastPersistedDocs = React.useRef(documents);
  useEffect(() => {
    const timer = setInterval(() => {
      if (data !== lastPersistedData.current || documents !== lastPersistedDocs.current) {
        setIsSaving(true);
        try {
          localStorage.setItem('or5_data', JSON.stringify(data));
          localStorage.setItem('or5_docs', JSON.stringify(documents));
          // Refs nur bei Erfolg vorrücken → bei Fehler Retry in der nächsten Runde.
          lastPersistedData.current = data;
          lastPersistedDocs.current = documents;
          setLastSave(new Date());
          setSaveError(false);
          runtimeEventBus.publish({
            id: crypto.randomUUID(),
            eventType: 'DATA_PERSISTED',
            timestamp: new Date().toISOString(),
            actor: 'system',
            workflowId: 'auto-save',
          });
        } catch (err) {
          // Quota o.ä.: Loop am Leben halten, ruhig melden statt still scheitern.
          setSaveError(true);
          if (typeof console !== 'undefined') console.warn('Auto-Save fehlgeschlagen:', err && err.name);
        } finally {
          setIsSaving(false);
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [data, documents]);

  const updateData = (chapter, field, value) => {
    if (demoMode) return;
    writeData(prev => {
      const next = { ...prev, [chapter]: { ...prev[chapter], [field]: value } };

      // PLZ->Kanton + PLZ->Gemeinde auto-sync (lokal, offline).
      // WICHTIG: nur befüllen, wenn die präzise PLZ-DB geladen ist (gemeinde != null).
      // Sonst liefert cantonFromPLZ den ~18% ungenauen Range-Fallback, der wegen der
      // "fill-if-empty"-Semantik als FALSCHER Kanton kleben bliebe und Steuer/IPV
      // falsch triebe. gemeindeFromPLZ hat keinen Range-Fallback -> != null heisst
      // Modul geladen -> cantonFromPLZ liefert dann den präzisen Kanton.
      if (chapter === 'wohnen' && field === 'postalCode' && value.length === 4) {
        const gemeinde = gemeindeFromPLZ(value);
        if (gemeinde) {
          const detected = cantonFromPLZ(value); // Modul geladen -> präzise
          if (detected) {
            next.basis = { ...next.basis, canton: next.basis?.canton || detected };
            next.behoerden = { ...next.behoerden, cantoneOfTaxation: next.behoerden?.cantoneOfTaxation || detected };
          }
          if (!next.wohnen?.city) {
            next.wohnen = { ...next.wohnen, city: gemeinde };
          }
        }
      }

      if (chapter === 'basis' && field === 'canton' && value) {
        next.behoerden = { ...next.behoerden, cantoneOfTaxation: next.behoerden?.cantoneOfTaxation || value };
      }

      if (chapter === 'finanzen' && field === 'employer' && value) {
        next.ausbildung = { ...next.ausbildung, employer: next.ausbildung?.employer || value };
      }
      if (chapter === 'ausbildung' && field === 'employer' && value) {
        next.finanzen = { ...next.finanzen, employer: next.finanzen?.employer || value };
      }

      return next;
    });
  };

  const calculateCompletion = () => {
    let filled = 0, total = 0;
    chapters.forEach(ch => { ch.fields.forEach(f => { total++; if (activeData[ch.key]?.[f.k]) filled++; }); });
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  const handleAddDocument = (doc) => {
    const newDoc = { ...doc, id: Date.now().toString(), chapter: chapters[activeChapter]?.key || 'basis' };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    runtimeEventBus.publish({
      id: crypto.randomUUID(),
      eventType: 'DOCUMENT_DELETED',
      timestamp: new Date().toISOString(),
      actor: 'user',
      workflowId: 'document-tresor',
    });
  };

  const handleDownloadDocument = (doc) => {
    if (doc.data) {
      const a = document.createElement('a');
      a.href = doc.data;
      a.download = doc.fileName || 'document';
      a.click();
    }
  };

  const handleUpdateDocExpiry = (docId, newDate) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, expiryDate: newDate } : d));
  };

  const handleNavigate = (viewName, chapterIdx, extra) => {
    if (viewName === 'chapter' && chapterIdx !== undefined) {
      setActiveChapter(chapterIdx);
    }
    if (viewName === 'legal' && extra) {
      setLegalSection(extra);
    }
    setView(viewName);
    requestAnimationFrame(() => {
      const main = document.getElementById('mp-main');
      if (main) { main.scrollTop = 0; main.focus({ preventScroll: true }); }
    });
  };

  // ─── Onboarding gate ─────────────────────────────────────
  if (!onboardingDone) {
    return React.createElement(Onboarding, {
      palette, t, setLanguage, supportedLanguages,
      onComplete: () => setOnboardingDone(true),
      onUpdateData: updateData,
    });
  }

  // Sekundäre Kopfzeilen-Bedienelemente — auf dem Desktop in der Kopfzeile,
  // auf dem Handy ins ☰-Menü eingeklappt (ruhigere, nicht überlaufende Kopfzeile).
  const settingsControls = [
    React.createElement(VorlesenToggle, { key: 'voice', palette, t, vorlesen }),
    React.createElement('button', {
      key: 'readable',
      'aria-label': t('common.readable'), 'aria-pressed': readable, title: t('common.readable'),
      onClick: () => setReadable(r => !r),
      style: { padding: '6px 9px', background: readable ? palette.sage + '22' : 'transparent', color: readable ? palette.sage : palette.mid, border: '1px solid ' + (readable ? palette.sage + '55' : 'transparent'), borderRadius: '4px', cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '1px', fontFamily: "'Atkinson Hyperlegible', sans-serif" }
    },
      React.createElement('span', { style: { fontSize: '15px', fontWeight: 700 } }, 'A'),
      React.createElement('span', { style: { fontSize: '10px', fontWeight: 700 } }, 'a')
    ),
    (lang === 'de' || lang === 'it' || lang === 'rm') ? (() => {
      const formal = lang === 'it' ? 'Lei' : lang === 'rm' ? 'Vus' : 'Sie';
      const informal = lang === 'it' ? 'Tu' : lang === 'rm' ? 'Ti' : 'Du';
      const tooltip = lang === 'it' ? 'Forma di cortesia: Lei / Tu' : lang === 'rm' ? 'Furma da curtaschia: Vus / Ti' : 'Anrede: Sie / Du';
      const current = anrede === 'du' ? informal : formal;
      return React.createElement('button', {
        key: 'anrede',
        'aria-label': 'Anrede: ' + current,
        title: tooltip,
        onClick: () => setAnrede(anrede === 'du' ? 'sie' : 'du'),
        style: { padding: '6px 9px', background: 'transparent', color: palette.mid, border: '1px solid ' + palette.border, borderRadius: '4px', cursor: 'pointer', fontSize: text.xs, fontWeight: 700, lineHeight: 1, minWidth: '30px' }
      }, current);
    })() : null,
    React.createElement(LanguageSwitcher, { key: 'lang', palette }),
    React.createElement(ThemeToggle, { key: 'theme', palette, t, isDarkMode, onToggle: () => setIsDarkMode(!isDarkMode) }),
    React.createElement('button', {
      key: 'simpleview',
      'aria-label': t('common.simpleView'), 'aria-pressed': simpleView, title: t('common.simpleView'),
      // Beim Einschalten automatisch Vorlesen aktivieren (Inkrement-1-Entscheid).
      onClick: () => setSimpleView(v => { const next = !v; if (next) vorlesen.enable(); return next; }),
      style: { padding: '6px 9px', background: simpleView ? palette.sand + '30' : 'transparent', color: simpleView ? palette.sand : palette.mid, border: '1px solid ' + (simpleView ? palette.sand + '55' : 'transparent'), borderRadius: '4px', cursor: 'pointer', lineHeight: 0, display: 'flex', alignItems: 'center' }
    },
      // Icon: 2×2-Kachelraster = „grosse Symbole"
      React.createElement('svg', { width: '17', height: '17', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
        React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
        React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
        React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
        React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
      )
    ),
    React.createElement('button', {
      key: 'grayscale',
      'aria-label': t('common.grayscale'), 'aria-pressed': grayscale, title: t('common.grayscale'),
      onClick: () => setGrayscale(g => !g),
      style: { padding: '6px 9px', background: grayscale ? palette.mid + '22' : 'transparent', color: grayscale ? palette.text : palette.mid, border: '1px solid ' + (grayscale ? palette.mid + '55' : 'transparent'), borderRadius: '4px', cursor: 'pointer', lineHeight: 0, display: 'flex', alignItems: 'center' }
    },
      // Icon: halb gefüllter Kreis = Kontrast / Schwarzweiss
      React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        React.createElement('circle', { cx: '12', cy: '12', r: '9', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }),
        React.createElement('path', { d: 'M12 3a9 9 0 0 1 0 18z', fill: 'currentColor' })
      )
    ),
  ].filter(Boolean);

  return React.createElement(VorlesenContext.Provider, { value: vorlesen },
  React.createElement('div', { 'aria-label': t('common.appName'), style: { width: '100vw', height: '100vh', background: palette.bg, color: palette.text, fontFamily: fontFamily, display: 'flex', flexDirection: 'column', ...(grayscale ? { filter: 'grayscale(1)' } : {}) } },
    // Skip-to-content link for keyboard users
    React.createElement('a', { href: '#mp-main', className: 'mp-skip-link' }, t('common.skipToContent') || 'Skip to content'),
    React.createElement(MobileNav, {
      palette, t,
      isOpen: mobileNavOpen,
      onClose: () => setMobileNavOpen(false),
      onNavigate: handleNavigate,
      activeChapter,
      activeView: view,
      chapters,
      completion: calculateCompletion(),
      // Auf dem Handy wandern die Kopfzeilen-Bedienelemente hierher.
      settingsControls: isMobile ? settingsControls : null,
      settingsLabel: t('nav.settings'),
    }),
    React.createElement('header', { role: 'banner', style: { background: palette.surface + 'F2', borderBottom: '1px solid ' + palette.border + '88', boxShadow: shadow.sm, padding: '14px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm, flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } },
      React.createElement('h1', {
        onClick: () => setView('dashboard'),
        role: 'link', tabIndex: 0,
        'aria-label': t('common.appName'),
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('dashboard'); } },
        style: { fontSize: text.lg, fontWeight: weight.semi, margin: 0, cursor: 'pointer', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '2px' }
      },
        // Wortmarke — das «M» von Maloja IST der Gipfel (Maloja-Pass)
        React.createElement('svg', { width: '17', height: '19', viewBox: '0 0 20 22', fill: 'none', 'aria-hidden': 'true', style: { display: 'block', flexShrink: 0 } },
          React.createElement('polyline', { points: '2,19 6.5,4 10,11 13.5,2 18,19', fill: 'none', stroke: palette.text, strokeWidth: '2.4', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '13.5', cy: '2.4', r: '1.7', fill: palette.gold })
        ),
        'aloja Plana'
      ),
      React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' } },
        // Desktop: Bedienelemente in der Kopfzeile. Handy: ins ☰-Menü eingeklappt (s. MobileNav).
        ...(isMobile ? [] : settingsControls),
        React.createElement('button', {
          key: 'menu',
          'aria-label': t('nav.menu'),
          onClick: () => setMobileNavOpen(!mobileNavOpen),
          style: { padding: '8px 10px', background: 'transparent', color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontSize: text.body, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }
        },
          // Hamburger icon as SVG
          React.createElement('svg', { width: '16', height: '16', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' },
            React.createElement('line', { x1: '2', y1: '4', x2: '14', y2: '4' }),
            React.createElement('line', { x1: '2', y1: '8', x2: '14', y2: '8' }),
            React.createElement('line', { x1: '2', y1: '12', x2: '14', y2: '12' })
          )
        )
      )
    ),
    !demoMode && React.createElement('div', {
      style: {
        background: palette.sage + '0A',
        borderBottom: '1px solid ' + palette.sage + '15',
        padding: '6px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      }
    },
      React.createElement('svg', { width: '12', height: '12', viewBox: '0 0 16 16', fill: 'none', stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round', 'aria-hidden': 'true' },
        React.createElement('rect', { x: '4', y: '7', width: '8', height: '7', rx: '1' }),
        React.createElement('path', { d: 'M 6 7 V 5 a 2 2 0 0 1 4 0 V 7' })
      ),
      React.createElement('span', { style: { fontSize: text.xs, color: palette.sage, letterSpacing: '0.2px' } }, t('trust.localBadge')),
      isOffline && React.createElement('span', {
        role: 'status',
        style: { fontSize: text.xs, color: palette.mid, marginLeft: space.sm, opacity: 0.8 }
      }, '· offline')
    ),
    demoMode && React.createElement('div', {
      role: 'status',
      style: {
        padding: '10px 16px',
        background: palette.sand + '18',
        borderBottom: '1px solid ' + palette.sand + '30',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
        flexWrap: 'wrap',
      }
    },
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('demo.bannerTitle')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, t('demo.bannerText'))
      ),
      React.createElement('button', {
        onClick: () => setDemoMode(false),
        style: {
          padding: '6px 14px', background: palette.surface, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.medium,
          color: palette.text, fontFamily: 'inherit', flexShrink: 0,
        }
      }, t('demo.leave'))
    ),
    sandboxActive && React.createElement('div', {
      role: 'status',
      style: {
        padding: '10px 16px',
        background: palette.sage + '18',
        borderBottom: '1px solid ' + palette.sage + '30',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
        flexWrap: 'wrap',
      }
    },
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('sandbox.bannerTitle')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, t('sandbox.bannerText')),
        React.createElement('button', {
          onClick: blankSandbox,
          style: {
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 0 0',
            fontSize: text.xs, fontWeight: weight.medium, color: palette.sage, fontFamily: 'inherit',
            textDecoration: 'underline', textUnderlineOffset: '2px',
          },
        }, '△ ' + t('sandbox.startBlank'))
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', flexShrink: 0 } },
        React.createElement('button', {
          onClick: discardSandbox,
          style: {
            padding: '6px 14px', background: palette.surface, border: '1px solid ' + palette.border,
            borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.medium,
            color: palette.text, fontFamily: 'inherit',
          }
        }, t('sandbox.discard')),
        React.createElement('button', {
          onClick: applySandbox,
          style: {
            padding: '6px 14px', background: palette.sage, border: 'none',
            borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi,
            color: '#fff', fontFamily: 'inherit',
          }
        }, t('sandbox.apply'))
      )
    ),
    React.createElement('main', { id: 'mp-main', role: 'main', tabIndex: -1, style: { flex: 1, overflowY: 'auto', padding: '24px 20px 32px 20px', outline: 'none', width: '100%', maxWidth: contentMax, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' } },
      view !== 'dashboard' && React.createElement('button', {
        onClick: () => setView('dashboard'),
        'aria-label': t('nav.backToDashboard'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 ' + space.md + 'px 0', fontSize: text.sm,
          color: palette.mid, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '6px',
        },
      }, '← ', t('nav.backToDashboard')),
      !demoMode && !sandboxActive && SANDBOX_VIEWS.includes(view) && React.createElement('button', {
        onClick: enterSandbox,
        style: {
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          margin: '0 0 ' + space.md + 'px 0', padding: '6px 12px',
          background: palette.sage + '12', border: '1px solid ' + palette.sage + '30',
          borderRadius: radius.sm, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.medium,
          color: palette.sage, fontFamily: 'inherit',
        },
      }, '△ ' + t('sandbox.footerLink')),
      view === 'dashboard' && React.createElement(React.Fragment, null,
        React.createElement(StorageWarning, { palette, t }),
        React.createElement(OverdueBanner, { palette, t, onNavigate: setView }),
        installPrompt && React.createElement('div', {
          style: { margin: space.md + 'px ' + space.md + 'px 0', padding: space.md + 'px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.md + 'px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm }
        },
          React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, t('pwa.installHint')),
          React.createElement('div', { style: { display: 'flex', gap: space.xs } },
            React.createElement('button', {
              onClick: () => { installPrompt.prompt(); installPrompt.userChoice.then(() => setInstallPrompt(null)); },
              style: { padding: space.xs + 'px ' + space.sm + 'px', background: palette.sand, color: '#000', border: 'none', borderRadius: radius.sm + 'px', cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi }
            }, t('pwa.install')),
            React.createElement('button', {
              onClick: () => setInstallPrompt(null),
              'aria-label': t('common.close'),
              style: { padding: space.xs + 'px ' + space.sm + 'px', background: 'transparent', color: palette.mid, border: 'none', cursor: 'pointer', fontSize: text.sm }
            }, '×')
          )
        ),
        React.createElement(Dashboard, {
          palette, t, chapters, data: activeData,
          onSelectChapter: (idx) => { setActiveChapter(idx); setView('chapter'); },
          completion: calculateCompletion(),
          onNavigate: setView,
          simpleView,
          demoMode,
          onEnterDemo: () => { setDemoMode(true); setView('dashboard'); },
          onLeaveDemo: () => setDemoMode(false),
          isTablet,
        })
      ),
      view === 'chapter' && React.createElement(ChapterView, {
        palette, t,
        chapter: chapters[activeChapter],
        data: activeData[chapters[activeChapter].key] || {},
        allData: activeData,
        onUpdate: (field, value) => updateData(chapters[activeChapter].key, field, value),
        onAddDocument: handleAddDocument,
        onNavigate: handleNavigate,
        demoMode,
        simpleView,
      }),
      React.createElement(ViewErrorBoundary, { palette, t, key: view },
      React.createElement(React.Suspense, { fallback: React.createElement('div', { style: { padding: space.xl + 'px', textAlign: 'center', color: palette.soft, fontSize: text.sm }, role: 'status', 'aria-live': 'polite' }, t('common.loading')) },
        view === 'tresor' && React.createElement(DocumentTresor, {
          palette, t,
          documents: documents,
          chapters: chapters,
          onDownload: handleDownloadDocument,
          onDelete: handleDeleteDocument,
          onUpdateExpiry: handleUpdateDocExpiry
        }),
        view === 'kk' && React.createElement(KKScanner, {
          palette, t, data: activeData,
          onSave: (kkData) => {
            const franchiseKey = kkData.franchise ? 'f' + kkData.franchise : '';
            writeData(prev => {
              const next = { ...prev };
              next.versicherungen = { ...next.versicherungen,
                kkInsurer: kkData.insurer || next.versicherungen?.kkInsurer || '',
                kkCardNumber: kkData.cardNumber || next.versicherungen?.kkCardNumber || '',
                kkModel: kkData.model || next.versicherungen?.kkModel || '',
              };
              if (franchiseKey) next.versicherungen.franchise = franchiseKey;
              if (kkData.ahv && !next.basis?.ahv) {
                next.basis = { ...next.basis, ahv: kkData.ahv };
              }
              return next;
            });
          }
        }),
        view === 'budget' && React.createElement(BudgetImport, {
          palette, t,
          currentBudget: activeData.finanzen || {},
          onImport: (updated) => writeData(prev => ({ ...prev, finanzen: { ...prev.finanzen, ...updated } }))
        }),
        view === 'taxImport' && React.createElement(TaxImport, {
          palette, t,
          currentFinanzen: activeData.finanzen || {},
          onImport: (merged) => writeData(prev => ({ ...prev, finanzen: { ...prev.finanzen, ...merged } })),
          onNavigate: handleNavigate,
        }),
        view === 'schulden' && React.createElement(SchuldenManager, {
          palette, t,
          data: activeData,
          onSave: (schuldenData) => writeData(prev => ({ ...prev, ...schuldenData }))
        }),
        view === 'tax' && React.createElement(TaxCalculator, {
          palette, t,
          data: activeData,
          onSave: (updatedData) => writeData(prev => ({ ...prev, ...updatedData })),
          onNavigate: handleNavigate,
        }),
        view === 'organ' && React.createElement(OrganDonation, {
          palette, t,
          data: activeData,
          onSave: (organData) => writeData(prev => ({ ...prev, ...organData }))
        }),
        view === 'sync' && React.createElement(BudgetSync, { palette, t, data: activeData }),
        view === 'premium' && React.createElement(PremiumSubsidy, { palette, t, data: activeData, onNavigate: handleNavigate, onUpdateData: updateData }),
        view === 'praemien' && React.createElement(PraemienOrientierung, { palette, t, data: activeData }),
        view === 'vorsorge' && React.createElement(VorsorgeRechner, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'alv' && React.createElement(AlvRechner, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'asyl' && React.createElement(AsylView, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'flyer' && React.createElement(FlyerView, { palette, t, lang }),
        view === 'merkliste' && React.createElement(MerklisteView, { palette, t, onNavigate: handleNavigate }),
        view === 'search' && React.createElement(SearchView, { palette, t, chapters, onNavigate: handleNavigate }),
        view === 'eo' && React.createElement(EOrechner, { palette, t, data: activeData }),
        view === 'stipendien' && React.createElement(StipendienView, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'cv' && React.createElement(CVGenerator, { palette, t, data: activeData }),
        view === 'charts' && React.createElement(ChartsAdvanced, { palette, t, data: activeData }),
        view === 'finanzuebersicht' && React.createElement(FinanzUebersicht, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'sozialhilfe' && React.createElement(SozialhilfeView, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'direktlinks' && React.createElement(DirektLinks, { palette, t, data: activeData }),
        view === 'kvg' && React.createElement(KVGLeistungen, { palette, t, data: activeData }),
        view === 'unterlagen' && React.createElement(MeineUnterlagen, { palette, t, onNavigate: handleNavigate }),
        view === 'lebensmappe' && React.createElement(Lebensmappe, { palette, t, data: activeData, chapters, documents, onNavigate: handleNavigate }),
        view === 'notfalldossier' && React.createElement(NotfallDossier, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
        view === 'behoerdendossier' && React.createElement(BehoerdenDossier, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
        view === 'briefe' && React.createElement(BriefGenerator, { palette, t, data: activeData, onNavigate: handleNavigate }),
        view === 'notfalleinstieg' && React.createElement(NotfallEinstieg, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
        view === 'export' && React.createElement(ZipExport, { palette, t, data: activeData, documents, demoMode }),
        view === 'calendar' && React.createElement(CalendarReminders, { palette, t, data: activeData }),
        view === 'notifications' && React.createElement(NotificationSettings, { palette, t }),
        view === 'settings' && React.createElement(SettingsView, {
          palette, t, controls: settingsControls,
          onEditBasis: () => { setActiveChapter(0); setView('chapter'); },
          onExport: () => setView('export'),
        }),
      )),
      view === 'legal' && React.createElement(LegalView, { palette, t, onNavigate: handleNavigate, section: legalSection, data: activeData })
    ),
    React.createElement(AutoSaveStatus, { palette, t, lastSave, isSaving, saveError }),
    React.createElement('footer', {
      role: 'contentinfo',
      style: {
        fontSize: text.xs,
        color: palette.mid,
        letterSpacing: '0.3px',
        opacity: 0.7,
        display: 'flex',
        flexWrap: 'wrap',
        gap: space.sm,
        alignItems: 'center',
        padding: '16px 20px',
        width: '100%',
        maxWidth: contentMax,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
      }
    },
      React.createElement('span', { style: { pointerEvents: 'none' } }, t('beta.bannerLabel') + ' · v0.1.4-beta'),
      React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
      React.createElement('a', {
        href: 'mailto:info@malojaplana.ch?subject=Maloja%20Plana%20Beta%20Feedback',
        style: {
          color: palette.mid, fontSize: text.xs, fontFamily: 'inherit',
          letterSpacing: '0.3px', textDecoration: 'underline', textUnderlineOffset: '2px',
        }
      }, t('beta.feedbackMail')),
      React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
      React.createElement('button', {
        onClick: () => handleNavigate('legal'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.xs, padding: 0,
          fontFamily: 'inherit', letterSpacing: '0.3px',
          textDecoration: 'underline', textUnderlineOffset: '2px',
        }
      }, t('legal.footerLink')),
      React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
      React.createElement('button', {
        onClick: () => { setDemoMode(!demoMode); setSandboxMode(false); setSandboxData(null); setView('dashboard'); },
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.xs, padding: 0,
          fontFamily: 'inherit', letterSpacing: '0.3px',
          textDecoration: 'underline', textUnderlineOffset: '2px',
        }
      }, demoMode ? t('demo.leave') : t('demo.footerLink')),
      !demoMode && !sandboxMode && React.createElement(React.Fragment, null,
        React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
        React.createElement('button', {
          onClick: enterSandbox,
          style: {
            background: 'none', border: 'none', cursor: 'pointer',
            color: palette.mid, fontSize: text.xs, padding: 0,
            fontFamily: 'inherit', letterSpacing: '0.3px',
            textDecoration: 'underline', textUnderlineOffset: '2px',
          }
        }, t('sandbox.footerLink'))
      ),
      React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
      React.createElement('a', {
        href: 'https://www.thegreenwebfoundation.org/green-web-check/?domain=malojaplana.ch',
        target: '_blank', rel: 'noopener noreferrer',
        title: t('greenHostingFooter'),
        style: {
          color: palette.sage, fontSize: text.xs, fontFamily: 'inherit',
          letterSpacing: '0.3px', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
        }
      },
        React.createElement(Icon, { name: 'leaf', size: 13 }),
        React.createElement('span', { style: { textDecoration: 'underline', textUnderlineOffset: '2px' } }, t('greenHostingFooter'))
      )
    )
  ));
};

// Wrap in I18nProvider + ErrorBoundary + BetaGate
const App = () => React.createElement(I18nProvider, null,
  React.createElement(ErrorBoundary, null,
    React.createElement(BetaGate, null,
      React.createElement(AppInner)
    )
  )
);

// Prevent duplicate createRoot calls during Vite HMR
const container = document.getElementById('root');
if (!container._reactRoot) {
  container._reactRoot = ReactDOM.createRoot(container);
}
container._reactRoot.render(React.createElement(App));
export default App;
