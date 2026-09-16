import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isRTL, SUPPORTED_LANGUAGES, resolveInitialLang, createT } from '../index.js';
import en from '../en.js';
import de from '../de.js';
import fr from '../fr.js';
import itTranslations from '../it.js'; // nicht `it` — kollidiert mit vitest it()
import rm from '../rm.js';

// Sammelt alle Blatt-Pfade. Ein { sie, du }-Objekt zählt als EIN Blatt
// (Anrede-Variante), nicht als zwei verschachtelte Keys.
function flattenKeys(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && !('sie' in v || 'du' in v)) {
      flattenKeys(v, path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

describe('i18n Infrastruktur', () => {
  it('aktuelle Sprachen sind alle LTR', () => {
    for (const l of SUPPORTED_LANGUAGES) {
      expect(isRTL(l), `${l} sollte LTR sein`).toBe(false);
    }
  });

  it('isRTL erkennt Rechts-nach-links-Sprachen (Asyl-Ausbau)', () => {
    expect(isRTL('ar')).toBe(true);   // Arabisch
    expect(isRTL('fa')).toBe(true);   // Farsi/Dari
    expect(isRTL('ur')).toBe(true);   // Urdu
    expect(isRTL('he')).toBe(true);   // Hebräisch
  });

  it('isRTL ist robust bei Unbekanntem', () => {
    expect(isRTL('ti')).toBe(false);  // Tigrinya nutzt Ge’ez-Schrift, LTR
    expect(isRTL('sq')).toBe(false);  // Albanisch, LTR
    expect(isRTL(undefined)).toBe(false);
    expect(isRTL('')).toBe(false);
  });
});

describe('resolveInitialLang (Sprachauswahl-Vorrang)', () => {
  it('URL-Param hat Vorrang vor allem', () => {
    expect(resolveInitialLang({ urlLang: 'fr', stored: 'de', navLang: 'it-IT' })).toBe('fr');
    expect(resolveInitialLang({ urlLang: 'FR', stored: 'de' })).toBe('fr'); // case-insensitiv
  });

  it('ohne URL → gespeicherte Wahl', () => {
    expect(resolveInitialLang({ stored: 'it', navLang: 'de-CH' })).toBe('it');
  });

  it('ohne URL/Speicher → Browsersprache (Präfix)', () => {
    expect(resolveInitialLang({ navLang: 'de-CH' })).toBe('de');
    expect(resolveInitialLang({ navLang: 'rm' })).toBe('rm');
  });

  it('nicht unterstützte Werte werden übersprungen → Default en', () => {
    expect(resolveInitialLang({ urlLang: 'xx', stored: 'zz', navLang: 'ja-JP' })).toBe('en');
    expect(resolveInitialLang({})).toBe('en');
    expect(resolveInitialLang()).toBe('en');
  });

  it('nur unterstützte Sprachen werden je Stufe akzeptiert', () => {
    // unbekannte URL, aber gültiger Speicher → Speicher gewinnt
    expect(resolveInitialLang({ urlLang: 'xx', stored: 'fr' })).toBe('fr');
  });
});

// Schützt die Aktivierungs-Checkliste: jede SUPPORTED-Sprache braucht ein
// hreflang-Tag in index.html. Fängt "Sprache hinzugefügt, hreflang vergessen".
describe('hreflang-Vollständigkeit (index.html)', () => {
  const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
  const hreflangs = [...html.matchAll(/hreflang="([^"]+)"/g)].map(m => m[1]);

  it('für jede unterstützte Sprache existiert ein hreflang', () => {
    for (const l of SUPPORTED_LANGUAGES) {
      expect(hreflangs, `hreflang für ${l} fehlt in index.html`).toContain(l);
    }
  });

  it('x-default ist gesetzt', () => {
    expect(hreflangs).toContain('x-default');
  });
});

// Fängt Übersetzungs-Drift: Wenn ein Feature einen Key in en (DEFAULT_LANG /
// Fallback) ergänzt, aber eine Sprache nicht nachzieht, sehen deren Nutzer den
// englischen Fallback. Dieser Test verlangt, dass jede Sprache den en-Kanon
// vollständig abdeckt. (Zusätzliche, ungenutzte Keys in einer Sprache sind
// erlaubt — sie schaden nicht; nur fehlende sind ein Problem.)
describe('i18n-Parität (jede Sprache deckt den en-Kanon ab)', () => {
  const enKeys = flattenKeys(en);

  for (const [name, dict] of Object.entries({ de, fr, it: itTranslations, rm })) {
    it(`${name}.js hat keine fehlenden Keys gegenüber en`, () => {
      const have = new Set(flattenKeys(dict));
      const missing = enKeys.filter((k) => !have.has(k));
      expect(
        missing,
        `${name}.js fehlen ${missing.length} Keys (fallen auf EN zurück): ${missing.slice(0, 25).join(', ')}`
      ).toEqual([]);
    });
  }
});

// path -> Wert (Blatt). { sie, du } zählt als ein Blatt-Wert.
function flattenEntries(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && !('sie' in v || 'du' in v)) {
      flattenEntries(v, path, out);
    } else {
      out[path] = v;
    }
  }
  return out;
}

function placeholderTokens(v) {
  const s = v && typeof v === 'object' ? `${v.sie || ''} ${v.du || ''}` : String(v == null ? '' : v);
  return [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
}

// Fängt vertippte/weggelassene {param}-Platzhalter: wenn en "{query}" hat, eine
// Übersetzung aber "{querry}" oder den Platzhalter ganz weglässt, bricht die
// Interpolation still (Nutzer sieht "{query}" oder einen leeren Wert).
describe('i18n-Platzhalter-Parität ({param}-Tokens stimmen mit en überein)', () => {
  const enEntries = flattenEntries(en);

  for (const [name, dict] of Object.entries({ de, fr, it: itTranslations, rm })) {
    it(`${name}.js: keine vertippten/fehlenden {platzhalter}`, () => {
      const langEntries = flattenEntries(dict);
      const mismatches = [];
      for (const [path, enVal] of Object.entries(enEntries)) {
        if (!(path in langEntries)) continue; // fehlende Keys deckt der Paritäts-Test ab
        const a = placeholderTokens(enVal).join(',');
        const b = placeholderTokens(langEntries[path]).join(',');
        if (a !== b) mismatches.push(`${path} (en:[${a}] ${name}:[${b}])`);
      }
      expect(
        mismatches,
        `${mismatches.length} Platzhalter-Abweichung(en): ${mismatches.slice(0, 15).join(' · ')}`
      ).toEqual([]);
    });
  }
});

// Ein { sie } oder { du } ohne Gegenstück wird von createT NICHT aufgelöst
// (verlangt beide als String) und als rohes Objekt zurückgegeben -> React-Crash
// "Objects are not valid as a React child". Dieser Test fängt das vorab.
describe('i18n Anrede-Objekte sind vollständig (sie UND du als String)', () => {
  function findHalfAnrede(obj, path, out) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    if ('sie' in obj || 'du' in obj) {
      if (typeof obj.sie !== 'string' || typeof obj.du !== 'string') {
        out.push(`${path} (sie:${typeof obj.sie}, du:${typeof obj.du})`);
      }
      return;
    }
    for (const [k, v] of Object.entries(obj)) findHalfAnrede(v, path ? `${path}.${k}` : k, out);
  }

  for (const [name, dict] of Object.entries({ en, de, fr, it: itTranslations, rm })) {
    it(`${name}.js: kein unvollständiges { sie }/{ du }-Objekt`, () => {
      const bad = [];
      findHalfAnrede(dict, '', bad);
      expect(
        bad,
        `${name}.js hat ${bad.length} unvollständige Anrede-Objekte: ${bad.slice(0, 15).join(' · ')}`
      ).toEqual([]);
    });
  }
});

// Sammelt alle Pfade, an denen de.js ein { sie, du }-Objekt führt.
function flattenAnredePaths(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if ('sie' in v || 'du' in v) out.push(path);
      else flattenAnredePaths(v, path, out);
    }
  }
  return out;
}

function resolvePath(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function isAnredeObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) && ('sie' in v || 'du' in v);
}

// R4 (16.09.2026): fr.js/it.js hatten für dieselben Schlüssel oft nur eine feste
// Anrede-Form (vous- bzw. tu/Lei-Form) statt { sie, du } wie de.js — Nutzer:innen,
// die "Du" gewählt haben, sahen in fr/it trotzdem die formelle Form (und umgekehrt).
// Das gesamte legal.*-Namespace (Datenschutz/Nutzung/FAQ) wurde in diesem PR
// nachgezogen; die App-weiten übrigen Stellen sind als bekannte Lücke gelistet
// (KNOWN_GAPS) — dieser Test lässt sie unverändert durch, schlägt aber an, wenn
// NEUE Schlüssel dieselbe Lücke bekommen (Regressionsschutz), und wird enger,
// sobald weitere Schlüssel nachgezogen werden (dann aus der Liste entfernen).
const KNOWN_GAPS = {
  fr: [
    'alpha.disclaimer', 'asyl.alltag.f.reisen', 'asyl.alltag.s.reisen', 'asyl.alltagIntro', 'asyl.alltagTitle',
    'asyl.cantonOfficeTitle', 'asyl.linkDocs', 'backup.confirmRestore', 'backup.encryptionInfo', 'backup.passphraseHint',
    'backup.preRestoreNote', 'backupVoreinstellung.hinweisUnverschluesselt', 'beistand.wegweiserBody', 'beistand.wegweiserTitle',
    'beta.gateMessage', 'beta.intro', 'briefe.afterPrint.text', 'briefe.dataNote', 'briefe.intro', 'budget.budgetCalm',
    'budget.budgetTight', 'budget.deficitInfo', 'budget.elHint', 'budget.ipvHint', 'budget.rentInfo', 'budget.sozialhilfeHint',
    'budgetImport.selectCsvOrExcel', 'budgetSync.autoUpdateNote', 'budgetSync.emptyNote', 'budgetSync.emptyNoteSingle',
    'budgetSync.emptyStateGuide', 'calendar.disclaimer', 'calendar.exportIcsHint', 'calendar.noReminders',
    'chapters.ausbildung.description', 'chapters.ausbildung.intro', 'chapters.basis.description', 'chapters.basis.intro',
    'chapters.behoerden.intro', 'chapters.finanzen.description', 'chapters.finanzen.hints.alimentePaid',
    'chapters.finanzen.hints.alimenteReceived', 'chapters.finanzen.hints.monthlyIncome', 'chapters.finanzen.intro',
    'chapters.notfall.hints.bestattungswuensche', 'chapters.notfall.hints.patientenverfuegung',
    'chapters.notfall.hints.vorsorgeauftrag', 'chapters.notfall.intro', 'chapters.versicherungen.hints.ktg',
    'chapters.versicherungen.intro', 'chapters.wohnen.description', 'chapters.wohnen.intro', 'charts.noDataHint',
    'checklist.intro', 'dashboard.exportReminder', 'dashboard.exportReminderNever', 'dashboard.exportReminderOld',
    'dashboard.highlightNotfallSub', 'dashboard.highlightPrivacy', 'dashboard.highlightSozialhilfeSub',
    'dashboard.highlightTaxSub', 'dashboard.highlightTitle', 'dashboard.progress', 'dashboard.progressComplete',
    'dashboard.progressEarly', 'dashboard.progressMid', 'dashboard.progressStart', 'dashboard.quickCheckTitle',
    'dashboard.tagline', 'dashboard.tip1', 'dashboard.tip2', 'dashboard.tip3', 'dashboard.tip4', 'dashboard.toolsSubtitle',
    'dashboard.yourChapters', 'diseases.hint', 'docReminder.notes', 'edu.pathsTitle', 'eo.einkommenEingeben', 'eo.erklaerung',
    'error.message', 'error.privacy', 'error.viewCrash', 'finanzUebersicht.disclaimer', 'finanzUebersicht.noData',
    'finanzUebersicht.subtitle', 'finanzUebersicht.tankOrientation', 'finanzUebersicht.tankReadout', 'gepaeck.intro',
    'guidedStart.basicInfo', 'guidedStart.text', 'instrumente.intro', 'kkScanner.conflictHint', 'kkScanner.scanRequiresInternet',
    'kvg.belegEmpty', 'kvg.belegHint', 'kvg.belegRueckwirkend', 'kvg.disclaimer', 'kvg.eigenanteil', 'kvg.franchiseExplain',
    'kvg.franchiseLabel', 'kvg.statusInFranchise', 'kvg.statusInSelbstbehalt', 'kvg.zweitmeinungNote', 'lebensmappe.empty',
    'lebensmappe.previewNote', 'lebensmappe.subtitle', 'medications.hint', 'merkliste.empty', 'merkliste.intro',
    'merkliste.placeholder', 'mietzins.check', 'mietzins.has', 'mietzins.none', 'mietzinsView.cantonLabel',
    'mietzinsView.compareTitle', 'mietzinsView.enterCanton', 'mietzinsView.rentShare', 'mietzinsView.result_effortBased',
    'mietzinsView.result_incomeHigh', 'mietzinsView.result_likely', 'mietzinsView.result_needIncome', 'mvo.empty',
    'notfallDossier.empty', 'notfallDossier.previewNote', 'notifications.blockedHint', 'notifications.documentExpiryDesc',
    'notifications.overdueRemindersDesc', 'notifications.privacyNote', 'obstgarten.intro', 'onboarding.chooseLanguage',
    'onboarding.readyMessage', 'onboarding.tip1', 'onboarding.tip2', 'onboarding.tip3', 'onboarding.welcomeSubtitle',
    'onboarding.yourCanton', 'onboarding.yourName', 'overdue.notificationBody', 'po.chooseByPrice', 'po.disclaimer',
    'po.franchiseOptBreakeven', 'po.franchiseOptReserve', 'po.franchiseOptSaving', 'po.noInsurerHint', 'po.pickFranchiseHint',
    'po.premiumAbove', 'po.premiumBelow', 'po.regionalCompare.aria', 'po.regionalCompare.premium.yourVal',
    'po.regionalCompare.regionalVal', 'po.regionalCompare.rent.yourVal', 'po.reserveCheck_low', 'po.reserveCheck_none',
    'po.reserveCheck_ok', 'po.reserveCheck_strong', 'po.tachoOrientation', 'po.tachoReadoutBelow', 'po.yourPremium',
    'premium.enterCanton', 'progress.notStarted', 'schnellcheck.kompassIdle', 'schulden.helpTitle', 'schulden.intro',
    'search.empty', 'sectionIntros.ausbildung.education', 'sectionIntros.ausbildung.languages',
    'sectionIntros.ausbildung.work', 'sectionIntros.basis.contact', 'sectionIntros.basis.family', 'sectionIntros.basis.person',
    'sectionIntros.behoerden.legal', 'sectionIntros.behoerden.representation', 'sectionIntros.behoerden.taxes',
    'sectionIntros.finanzen.credit', 'sectionIntros.finanzen.income', 'sectionIntros.finanzen.provision',
    'sectionIntros.notfall.care', 'sectionIntros.notfall.medical', 'sectionIntros.notfall.provision',
    'sectionIntros.versicherungen.basic', 'sectionIntros.versicherungen.mobility', 'sectionIntros.versicherungen.occupational',
    'sectionIntros.versicherungen.property', 'sectionIntros.wohnen.address', 'sectionIntros.wohnen.costs',
    'sectionIntros.wohnen.landlord', 'sectionIntros.wohnen.property', 'sh.eingeben', 'sozialhilfe.childrenNote',
    'sozialhilfe.intro', 'sozialhilfe.noEntitlementNote', 'sozialhilfe.orientationNote', 'stip.formNote',
    'storage.warningMessage', 'tax.bandNotChecked', 'tax.bandNotCheckedBrutto', 'tax.bandNotCheckedPartner',
    'tax.bandOutside', 'tax.disclaimer', 'tax.elterntarifHint', 'tax.federalNotCheckedBrutto', 'tax.netIncomeNote',
    'tax.saeulen.hint', 'tax.selectCantonHint', 'tax.taxableEnteredHint', 'tax.taxableEstimatedHint', 'tresor.noDocuments',
    'tresor.noDocumentsHint', 'tresor.ordnerEmpty', 'tresor.ordnerGrowing', 'trust.localOnly', 'unterlagen.backup.description',
    'unterlagen.dossier.lebensmappe.description', 'unterlagen.note', 'unterlagen.subtitle', 'uvgHint.body',
    'uvgHint.fieldSuggest', 'vr.einkommenEingeben', 'vr.fzIntro', 'vr.fzScenarioGapText', 'vr.fzScenarioJobText',
    'vr.fzScenarioSelfText', 'vr.fzTip', 'vr.fzTitle', 'vr.ikEmpty', 'vr.ikIntro', 'vr.intlIntro', 'vr.intlVoluntaryText',
    'vr.saeule3aHint', 'zipExport.securityNote', 'zipExport.vorschau.introDatei', 'zipExport.vorschau.introDruck',
    'zipExport.vorschau.kat.dokumenteInhalt', 'zipExport.vorschau.kat.dokumenteListe', 'zipExport.vorschau.kat.name',
    'zipExport.vorschau.verschluesselt',
  ],
  it: [
    'alimentInfo.summaryNA', 'alv.beitragsmonateHint', 'alv.disclaimer', 'alv.ravBody', 'alv.ravTitle', 'asyl.disclaimer',
    'asyl.intro', 'asyl.process.beschwerde', 'asyl.rights.rechtsvertretung', 'asyl.status.n.desc', 'backup.confirmRestore',
    'backup.passphraseHint', 'backup.preRestoreNote', 'backupVoreinstellung.hinweisUnverschluesselt',
    'behoerdenDossier.disclaimer', 'beistand.wegweiserBody', 'beistand.wegweiserTitle', 'beta.gateMessage', 'beta.intro',
    'budget.elHint', 'budget.sozialhilfeHint', 'budgetImport.selectCsvOrExcel', 'budgetSync.autoUpdateNote',
    'calendar.disclaimer', 'chapters.finanzen.hints.alimentePaid', 'chapters.finanzen.hints.alimenteReceived',
    'chapters.notfall.hints.bestattungswuensche', 'chapters.notfall.hints.patientenverfuegung',
    'chapters.notfall.hints.vorsorgeauftrag', 'chapters.versicherungen.hints.ktg', 'charts.noDataHint', 'checklist.intro',
    'dashboard.toolsSubtitle', 'diseases.hint', 'docReminder.notes', 'edu.path2', 'edu.pathsHow', 'edu.pathsIntro',
    'edu.pathsTitle', 'finanzUebersicht.disclaimer', 'finanzUebersicht.tankOrientation', 'finanzUebersicht.tankReadout',
    'gepaeck.intro', 'instrumente.intro', 'jobs.sectionHint', 'kkScanner.conflictHint', 'kkScanner.scanRequiresInternet',
    'kvg.belegEmpty', 'kvg.belegHint', 'kvg.belegRueckwirkend', 'kvg.disclaimer', 'kvg.eigenanteil', 'kvg.franchiseExplain',
    'kvg.franchiseLabel', 'kvg.statusInFranchise', 'kvg.statusInSelbstbehalt', 'kvg.zweitmeinungNote', 'lebensmappe.empty',
    'lebensmappe.subtitle', 'medications.hint', 'mietzins.check', 'mietzins.has', 'mietzins.none', 'mietzinsView.cantonLabel',
    'mietzinsView.compareTitle', 'mietzinsView.enterCanton', 'mietzinsView.rentShare', 'mietzinsView.result_effortBased',
    'mietzinsView.result_incomeHigh', 'mietzinsView.result_likely', 'mietzinsView.result_needIncome',
    'mirror.versicherungen.insurerAndFranchise', 'mirror.versicherungen.insurerFranchiseBvg',
    'mirror.versicherungen.insurerSentence', 'mvo.empty', 'notifications.blockedHint', 'notifications.documentExpiryDesc',
    'notifications.overdueRemindersDesc', 'obstgarten.intro', 'onboarding.tip3', 'orientation.eo', 'po.chooseByPrice',
    'po.franchiseOptBreakeven', 'po.franchiseOptReserve', 'po.franchiseOptSaving', 'po.pickFranchiseHint',
    'po.reserveCheck_low', 'po.reserveCheck_none', 'po.reserveCheck_ok', 'po.reserveCheck_strong', 'po.tachoOrientation',
    'po.tachoReadoutBelow', 'schnellcheck.kompassIdle', 'schulden.helpTitle', 'sh.eingeben', 'sozialhilfe.childrenNote',
    'stip.checkStatusQ', 'stip.checkTitle', 'stip.formNote', 'stip.resultUnclear', 'storage.warningMessage',
    'tax.bandNotChecked', 'tax.bandNotCheckedBrutto', 'tax.bandNotCheckedPartner', 'tax.bandOutside',
    'tax.federalNotCheckedBrutto', 'tax.intro', 'tax.saeulen.hint', 'tax.selectCantonHint', 'tax.taxableEnteredHint',
    'tax.taxableEstimatedHint', 'unterlagen.dossier.behoerden.description', 'unterlagen.dossier.lebensmappe.description',
    'unterlagen.note', 'uvgHint.body', 'uvgHint.fieldSuggest', 'vr.fzTip', 'vr.ikEmpty', 'vr.ikIntro',
  ],
};

describe('de-{sie,du}-Schlüssel sind in fr/it ebenfalls { sie, du } (keine stille Einheitsform)', () => {
  const deAnredePaths = flattenAnredePaths(de);

  for (const [name, dict] of Object.entries({ fr, it: itTranslations })) {
    it(`${name}.js: kein NEUER de-{sie,du}-Schlüssel ohne { sie, du } (ausser bekannte Lücke)`, () => {
      const gaps = new Set(KNOWN_GAPS[name]);
      const unexpected = [];
      for (const path of deAnredePaths) {
        const val = resolvePath(dict, path);
        if (val === undefined) continue; // fehlende Keys deckt der Paritäts-Test ab
        if (!isAnredeObject(val) && !gaps.has(path)) unexpected.push(path);
      }
      expect(
        unexpected,
        `${name}.js: ${unexpected.length} neue Schlüssel ohne { sie, du }, nicht in KNOWN_GAPS: ${unexpected.slice(0, 15).join(', ')}`
      ).toEqual([]);
    });

    it(`${name}.js: KNOWN_GAPS enthält keine bereits behobenen Schlüssel (Liste aktuell halten)`, () => {
      const stale = KNOWN_GAPS[name].filter((path) => isAnredeObject(resolvePath(dict, path)));
      expect(
        stale,
        `${name}.js: ${stale.length} Schlüssel in KNOWN_GAPS sind bereits { sie, du } — aus der Liste entfernen: ${stale.slice(0, 15).join(', ')}`
      ).toEqual([]);
    });
  }
});

// Der Übersetzungs-Kern selbst (Schlüssel-Auflösung, Fallback-Kette, Sie/Du-Wahl,
// Param-Interpolation) — mit kontrollierten Fixtures statt der echten Sprachdateien.
// DEFAULT_LANG ist 'en' (Fallback-Sprache).
describe('Vorsorge-Szenario: Referenzalter als Platzhalter, nicht fest «65»', () => {
  // AHV 21: Frauen JG 1961–63 haben ein Referenzalter unter 65 (64 J 3/6/9 M). Die
  // Szenariotexte müssen den echten Wert aus dem Rechner zeigen, nicht pauschal 65.
  const all = { en, de, fr, it: itTranslations, rm };
  const keys = ['vr.zukunftSzenarioFrueh', 'vr.zukunftSzenarioAufschub', 'vr.zukunftSzenarioReferenz'];
  for (const lang of Object.keys(all)) {
    it(`${lang}: {referenzalter} wird eingesetzt, keine feste 65`, () => {
      const t = createT(all, lang, 'sie');
      for (const key of keys) {
        const out = t(key, { dauer: '2 X', referenzalter: '64 Y 6 Z' });
        expect(out, `${lang} ${key}`).toContain('64 Y 6 Z');
        expect(out, `${lang} ${key}`).not.toMatch(/65/);
        expect(out, `${lang} ${key}`).not.toMatch(/\{\w+\}/);
      }
    });
  }
});

describe('createT (Übersetzungs-Kern)', () => {
  const fixtures = {
    en: {
      greet: 'Hello',
      nested: { deep: 'Deep EN' },
      withParam: 'Hi {name}',
      count: 'Count: {n}',
      onlyEn: 'EN only',
      emptyStr: '',
    },
    de: {
      greet: { sie: 'Guten Tag', du: 'Hallo' },
      nested: { deep: 'Tief DE' },
      withParam: 'Hallo {name}',
    },
  };

  it('löst einen einfachen Key in der aktiven Sprache auf', () => {
    expect(createT(fixtures, 'de', 'sie')('nested.deep')).toBe('Tief DE');
  });

  it('fällt auf DEFAULT_LANG (en) zurück, wenn der Key in der Sprache fehlt', () => {
    expect(createT(fixtures, 'de', 'sie')('onlyEn')).toBe('EN only');
  });

  it('gibt den Key-String zurück, wenn nirgends vorhanden', () => {
    expect(createT(fixtures, 'de', 'sie')('does.not.exist')).toBe('does.not.exist');
  });

  it('{sie,du}: Standard Sie, Du nur bei anrede="du"', () => {
    expect(createT(fixtures, 'de', 'sie')('greet')).toBe('Guten Tag');
    expect(createT(fixtures, 'de', 'du')('greet')).toBe('Hallo');
    expect(createT(fixtures, 'de', undefined)('greet')).toBe('Guten Tag'); // kein anrede → Sie
  });

  it('interpoliert {param}', () => {
    expect(createT(fixtures, 'de', 'sie')('withParam', { name: 'Sofie' })).toBe('Hallo Sofie');
  });

  it('interpoliert den Wert 0 korrekt (kein Falsy-Zero-Bug)', () => {
    expect(createT(fixtures, 'de', 'sie')('count', { n: 0 })).toBe('Count: 0');
  });

  it('lässt unaufgelöste {param} sichtbar stehen', () => {
    expect(createT(fixtures, 'de', 'sie')('withParam', {})).toBe('Hallo {name}');
    expect(createT(fixtures, 'de', 'sie')('withParam')).toBe('Hallo {name}');
  });

  it('gibt einen leeren String zurück (nicht Fallback) bei absichtlich leerem Wert', () => {
    expect(createT(fixtures, 'en', 'sie')('emptyStr')).toBe('');
  });

  it('ist robust bei nicht geladener Sprache (translations[lang] undefined)', () => {
    // de fehlt 'count' → Fallback en; aber wenn die Sprache ganz fehlt:
    expect(createT(fixtures, 'xx', 'sie')('onlyEn')).toBe('EN only'); // Fallback en greift
    expect(createT(fixtures, 'xx', 'sie')('greet')).toBe('Hello');    // en-Wert (plain)
  });
});
