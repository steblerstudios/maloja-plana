// ─── Helvetia Orientation Registry ─────────────────────────
// Static registry of Swiss concepts that Maloja explains.
// Each entry maps to i18n keys: orientation.[key].title / .text
//
// This is NOT a calculator. NOT a legal database. NOT AI.
// It is a curated set of orientation sentences that help
// people understand the Swiss system.
//
// Priority: p0 = appears as hint on existing fields
//           p1 = available for future context layers
//           p2 = reference only, no UI integration yet

export const ORIENTATION_ENTRIES = [
  // ─── Sozialversicherungen (1. Säule) ─────────────────
  { key: 'ahv',        chapter: 'basis',          fieldKey: 'ahv',              priority: 'p0' },
  { key: 'ahvBeitrag', chapter: 'versicherungen', fieldKey: 'ahvContribution', priority: 'p0' },
  { key: 'alv',        chapter: 'finanzen',       fieldKey: null,               priority: 'p1' },
  { key: 'iv',         chapter: null,             fieldKey: null,               priority: 'p2' },
  { key: 'eo',         chapter: null,             fieldKey: null,               priority: 'p2' },
  { key: 'el',         chapter: null,             fieldKey: null,               priority: 'p1' },

  // ─── Berufliche Vorsorge (2. Säule) ──────────────────
  { key: 'bvg',        chapter: 'versicherungen', fieldKey: 'bvgInsurer',       priority: 'p0' },

  // ─── Private Vorsorge (3. Säule) ─────────────────────
  { key: 'saeule3a',   chapter: 'finanzen',       fieldKey: 'pension3a',        priority: 'p0' },

  // ─── Krankenversicherung ─────────────────────────────
  { key: 'kvg',        chapter: 'versicherungen', fieldKey: 'kkInsurer',        priority: 'p0' },
  { key: 'franchise',  chapter: 'versicherungen', fieldKey: 'franchise',        priority: 'p0' },
  { key: 'selbstbehalt', chapter: 'versicherungen', fieldKey: null,             priority: 'p1' },
  { key: 'ipv',        chapter: 'finanzen',       fieldKey: null,               priority: 'p0' },

  // ─── Unfallversicherung ──────────────────────────────
  { key: 'uvg',        chapter: 'versicherungen', fieldKey: 'uvg',              priority: 'p0' },

  // ─── Familie ─────────────────────────────────────────
  { key: 'familienzulagen', chapter: 'basis',     fieldKey: null,               priority: 'p0' },

  // ─── Aufenthalt ──────────────────────────────────────
  { key: 'bewilligung_b', chapter: 'ausbildung',  fieldKey: 'workPermit',       priority: 'p0' },
  { key: 'bewilligung_c', chapter: 'ausbildung',  fieldKey: 'workPermit',       priority: 'p0' },

  // ─── Schulden & Betreibung ───────────────────────────
  { key: 'betreibung', chapter: 'behoerden',      fieldKey: 'betreibungsStatus', priority: 'p0' },
  { key: 'verlustschein', chapter: 'behoerden',   fieldKey: null,               priority: 'p1' },

  // ─── Arbeit & Soziales ───────────────────────────────
  { key: 'rav',        chapter: null,             fieldKey: null,               priority: 'p1' },
  { key: 'skos',       chapter: null,             fieldKey: null,               priority: 'p1' },
];

// Lookup: get orientation key for a given chapter + field
export function getOrientationKey(chapterKey, fieldKey) {
  const entry = ORIENTATION_ENTRIES.find(
    e => e.chapter === chapterKey && e.fieldKey === fieldKey && e.priority === 'p0'
  );
  return entry ? entry.key : null;
}

// Get all p0 entries for a chapter (for context banners)
export function getChapterOrientations(chapterKey) {
  return ORIENTATION_ENTRIES.filter(
    e => e.chapter === chapterKey && e.priority === 'p0'
  );
}
