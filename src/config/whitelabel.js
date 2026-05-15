// ─── White-Label Configuration ─────────────────────────────
// Local-first organization profile for future white-label support.
// Stored in localStorage — no backend dependency.
// Organizations, municipalities, or NGOs can customize the app
// without any server-side changes.

const STORAGE_KEY = 'or5_whitelabel';

const DEFAULT_CONFIG = {
  // Organization identity
  orgName: '',                    // e.g. "Caritas Zürich"
  orgLogo: '',                    // base64 or data URL
  orgUrl: '',                     // e.g. "https://www.caritas-zuerich.ch"
  orgContact: '',                 // e.g. "info@caritas-zuerich.ch"

  // Branding overrides
  appName: 'Maloja Plana',        // custom app title
  tagline: '',                    // custom tagline (falls back to i18n default)
  accentColor: '',                // override palette.sand
  showPoweredBy: true,            // "Powered by Maloja Plana"

  // Resource links (shown in help/resources section)
  resources: [
    // { label: 'Migration office', url: 'https://...', category: 'admin' },
    // { label: 'Housing advice', url: 'https://...', category: 'housing' },
  ],

  // Canton/municipality focus
  defaultCanton: '',              // pre-select canton
  defaultLanguage: '',            // pre-select language

  // Feature toggles (for institutional deployments)
  features: {
    showBudgetSync: true,
    showPremiumSubsidy: true,
    showSozialhilfe: true,
    showTaxCalculator: true,
    showDebtManager: true,
    showCVBuilder: true,
    showOrganDonation: true,
    showEmergencyHub: true,
    showCalendar: true,
    showCharts: true,
    showExport: true,
  },
};

export const loadWhiteLabelConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
};

export const saveWhiteLabelConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
};

export const resetWhiteLabelConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};

// Check if a white-label config is active
export const isWhiteLabeled = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const config = JSON.parse(stored);
    return !!(config.orgName || config.appName !== 'Maloja Plana');
  } catch {
    return false;
  }
};

export { DEFAULT_CONFIG };
