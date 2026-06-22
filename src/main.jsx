import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './tokens.css';
import './print.css';
import { DARK_PALETTE, LIGHT_PALETTE, getChapters, CHAPTER_KEYS } from './config/constants.js';
import { DEMO_DATA } from './config/demoData.js';
import { cantonFromPLZ } from './config/cantonalData.js';
import { I18nProvider, useT } from './i18n/index.js';
import { registerServiceWorker, checkOverdueReminders } from './utils/notifications.js';
import { migrateData } from './utils/dataMigration.js';
import { validateData, validateDocs } from './utils/dataValidation.js';
import { createBackup } from './utils/autoBackup.js';
import { parseHash, setHash, replaceHash, onHashChange } from './utils/hashRouter.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Dashboard from './Dashboard.jsx';
import ChapterView from './ChapterView.jsx';
import DocumentTresor from './DocumentTresor.jsx';
import KKScanner from './KKScanner.jsx';
import BudgetImport from './BudgetImport.jsx';
import SchuldenManager from './SchuldenManager.jsx';
import TaxCalculator from './TaxCalculator.jsx';
import OrganDonation from './OrganDonation.jsx';
import BudgetSync from './BudgetSync.jsx';
import PremiumSubsidy from './PremiumSubsidy.jsx';
import CVGenerator from './CVGenerator.jsx';
import ChartsAdvanced from './ChartsAdvanced.jsx';
import ZipExport from './ZipExport.jsx';
import MeineUnterlagen from './MeineUnterlagen.jsx';
import Lebensmappe from './Lebensmappe.jsx';
import NotfallDossier from './NotfallDossier.jsx';
import BriefGenerator from './BriefGenerator.jsx';
import BehoerdenDossier from './BehoerdenDossier.jsx';
import SozialhilfeView from './SozialhilfeView.jsx';
import CalendarReminders from './CalendarReminders.jsx';
import OverdueBanner from './OverdueBanner.jsx';
import NotificationSettings from './NotificationSettings.jsx';
import { Onboarding, isOnboardingDone } from './Onboarding.jsx';
import { syncDocumentReminders } from './utils/docReminders.js';
import LegalView from './LegalView.jsx';
import BetaGate from './BetaGate.jsx';
import MobileNav from './MobileNav.jsx';
import AutoSaveStatus from './AutoSaveStatus.jsx';
import NotfallEinstieg from './NotfallEinstieg.jsx';
import StorageWarning from './StorageWarning.jsx';
const PraemienOrientierung = React.lazy(() => import('./PraemienOrientierung.jsx'));
const VorsorgeRechner = React.lazy(() => import('./VorsorgeRechner.jsx'));
const EOrechner = React.lazy(() => import('./EOrechner.jsx'));
const DirektLinks = React.lazy(() => import('./DirektLinks.jsx'));
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, space, radius, shadow, fontFamily } from './config/tokens.js';

// Language switcher component
const LanguageSwitcher = ({ palette }) => {
  const { t, lang, setLanguage, supportedLanguages } = useT();
  const labels = { en: 'EN', de: 'DE', fr: 'FR', it: 'IT' };

  return React.createElement('div', { style: { display: 'flex', gap: '2px', background: palette.up, borderRadius: '4px', padding: '2px' } },
    supportedLanguages.map(l =>
      React.createElement('button', {
        key: l,
        'aria-label': t('common.switchLang', { lang: labels[l] || l.toUpperCase() }),
        'aria-pressed': l === lang,
        onClick: () => setLanguage(l),
        style: {
          padding: '4px 6px',
          background: l === lang ? palette.sand : 'transparent',
          color: l === lang ? '#000' : palette.mid,
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: text.xs,
          fontWeight: l === lang ? '700' : '500',
          lineHeight: 1,
        }
      }, labels[l] || l.toUpperCase())
    )
  );
};

const AppInner = () => {
  const { t, lang, setLanguage, supportedLanguages } = useT();
  const [isDarkMode, setIsDarkMode] = useState(() => { try { return JSON.parse(localStorage.getItem('or5_theme') || 'true'); } catch { return true; } });
  const palette = isDarkMode ? DARK_PALETTE : LIGHT_PALETTE;

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
  const [onboardingDone, setOnboardingDone] = useState(isOnboardingDone);
  const [demoMode, setDemoMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const activeData = demoMode ? DEMO_DATA : data;

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
        localStorage.setItem('or5_data', JSON.stringify(data));
        localStorage.setItem('or5_docs', JSON.stringify(documents));
        lastPersistedData.current = data;
        lastPersistedDocs.current = documents;
        setLastSave(new Date());
        setIsSaving(false);
        runtimeEventBus.publish({
          id: crypto.randomUUID(),
          eventType: 'DATA_PERSISTED',
          timestamp: new Date().toISOString(),
          actor: 'system',
          workflowId: 'auto-save',
        });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [data, documents]);

  const updateData = (chapter, field, value) => {
    if (demoMode) return;
    setData(prev => {
      const next = { ...prev, [chapter]: { ...prev[chapter], [field]: value } };

      // PLZ->Kanton auto-sync
      if (chapter === 'wohnen' && field === 'postalCode' && value.length === 4) {
        const detected = cantonFromPLZ(value);
        if (detected) {
          next.basis = { ...next.basis, canton: next.basis?.canton || detected };
          next.behoerden = { ...next.behoerden, cantoneOfTaxation: next.behoerden?.cantoneOfTaxation || detected };
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

  return React.createElement('div', { 'aria-label': t('common.appName'), style: { width: '100vw', height: '100vh', background: palette.bg, color: palette.text, fontFamily: fontFamily, display: 'flex', flexDirection: 'column' } },
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
      completion: calculateCompletion()
    }),
    React.createElement('header', { role: 'banner', style: { background: palette.surface + 'F2', borderBottom: '1px solid ' + palette.border + '88', boxShadow: shadow.sm, padding: '14px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm, position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } },
      React.createElement('h1', {
        onClick: () => setView('dashboard'),
        style: { fontSize: text.lg, fontWeight: weight.semi, margin: 0, cursor: 'pointer', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '10px' }
      },
        // Logo mark — abstract topographic line
        React.createElement('svg', { width: '22', height: '22', viewBox: '0 0 24 24', fill: 'none', stroke: palette.sand, strokeWidth: '1.8', strokeLinecap: 'round' },
          React.createElement('path', { d: 'M 3 17 Q 7 9 12 12 Q 17 15 21 7' }),
          React.createElement('path', { d: 'M 3 20 Q 8 14 12 16 Q 16 18 21 13', opacity: '0.4' })
        ),
        t('common.appName')
      ),
      React.createElement('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center' } },
        React.createElement(LanguageSwitcher, { palette }),
        React.createElement(ThemeToggle, { palette, t, isDarkMode, onToggle: () => setIsDarkMode(!isDarkMode) }),
        React.createElement('button', {
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
    view === 'dashboard' && !demoMode && React.createElement('div', {
      style: {
        padding: '6px 16px',
        background: palette.sage + '0A',
        borderBottom: '1px solid ' + palette.sage + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      }
    },
      React.createElement('svg', { width: '12', height: '12', viewBox: '0 0 16 16', fill: 'none', stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round' },
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
    React.createElement('main', { id: 'mp-main', role: 'main', tabIndex: -1, style: { flex: 1, overflowY: 'auto', padding: '24px 20px 32px 20px', outline: 'none' } },
      view !== 'dashboard' && React.createElement('button', {
        onClick: () => setView('dashboard'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 ' + space.md + 'px 0', fontSize: text.sm,
          color: palette.mid, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '6px',
        },
      }, '← ', t('nav.backToDashboard')),
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
          demoMode,
          onEnterDemo: () => { setDemoMode(true); setView('dashboard'); },
          onLeaveDemo: () => setDemoMode(false),
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
      }),
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
          setData(prev => {
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
        onImport: (updated) => setData(prev => ({ ...prev, finanzen: { ...prev.finanzen, ...updated } }))
      }),
      view === 'schulden' && React.createElement(SchuldenManager, {
        palette, t,
        data: activeData,
        onSave: (schuldenData) => setData(prev => ({ ...prev, ...schuldenData }))
      }),
      view === 'tax' && React.createElement(TaxCalculator, {
        palette, t,
        data: activeData,
        onSave: (updatedData) => setData(prev => ({ ...prev, ...updatedData }))
      }),
      view === 'organ' && React.createElement(OrganDonation, {
        palette, t,
        data: activeData,
        onSave: (organData) => setData(prev => ({ ...prev, ...organData }))
      }),
      view === 'sync' && React.createElement(BudgetSync, { palette, t, data: activeData }),
      view === 'premium' && React.createElement(PremiumSubsidy, { palette, t, data: activeData }),
      view === 'praemien' && React.createElement(React.Suspense, { fallback: null }, React.createElement(PraemienOrientierung, { palette, t, data: activeData })),
      view === 'vorsorge' && React.createElement(React.Suspense, { fallback: null }, React.createElement(VorsorgeRechner, { palette, t, data: activeData })),
      view === 'eo' && React.createElement(React.Suspense, { fallback: null }, React.createElement(EOrechner, { palette, t, data: activeData })),
      view === 'cv' && React.createElement(CVGenerator, { palette, t, data: activeData }),
      view === 'charts' && React.createElement(ChartsAdvanced, { palette, t, data: activeData }),
      view === 'sozialhilfe' && React.createElement(SozialhilfeView, { palette, t, data: activeData }),
      view === 'direktlinks' && React.createElement(React.Suspense, { fallback: null }, React.createElement(DirektLinks, { palette, t })),
      view === 'unterlagen' && React.createElement(MeineUnterlagen, { palette, t, onNavigate: handleNavigate }),
      view === 'lebensmappe' && React.createElement(Lebensmappe, { palette, t, data: activeData, chapters, documents, onNavigate: handleNavigate }),
      view === 'notfalldossier' && React.createElement(NotfallDossier, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
      view === 'behoerdendossier' && React.createElement(BehoerdenDossier, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
      view === 'briefe' && React.createElement(BriefGenerator, { palette, t, data: activeData, onNavigate: handleNavigate }),
      view === 'notfalleinstieg' && React.createElement(NotfallEinstieg, { palette, t, data: activeData, chapters, onNavigate: handleNavigate }),
      view === 'export' && React.createElement(ZipExport, { palette, t, data: activeData, documents, demoMode }),
      view === 'calendar' && React.createElement(CalendarReminders, { palette, t, data: activeData }),
      view === 'notifications' && React.createElement(NotificationSettings, { palette, t }),
      view === 'legal' && React.createElement(LegalView, { palette, t, onNavigate: handleNavigate, section: legalSection })
    ),
    React.createElement(AutoSaveStatus, { palette, t, lastSave, isSaving }),
    React.createElement('div', {
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
      }
    },
      React.createElement('span', { style: { pointerEvents: 'none' } }, t('beta.bannerLabel') + ' · v0.1.0-alpha'),
      React.createElement('span', { style: { pointerEvents: 'none' } }, '·'),
      React.createElement('a', {
        href: 'mailto:steblerstudios@gmail.com?subject=Maloja%20Plana%20Beta%20Feedback',
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
        onClick: () => { setDemoMode(!demoMode); setView('dashboard'); },
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.xs, padding: 0,
          fontFamily: 'inherit', letterSpacing: '0.3px',
          textDecoration: 'underline', textUnderlineOffset: '2px',
        }
      }, demoMode ? t('demo.leave') : t('demo.footerLink'))
    )
  );
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
