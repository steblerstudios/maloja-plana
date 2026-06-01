// ─── MirrorCards — Living Mirror Layer ─────────────────────
// Renders life sentences and mirror cards for chapters.
// Pure render component — no state, no side effects.
// Uses React.createElement, inline styles, palette-based.
//
// Phase 3B: Transforms data-collection chapters into
// living spaces that reflect a person's situation.

import React from 'react';
import { getCantonName } from './config/cantonalData.js';
import { text, weight, space, radius, leading } from './config/tokens.js';

// ─── Data helpers ──────────────────────────────────────────

function hasMinData(chapterKey, data) {
  if (chapterKey === 'basis') {
    return Boolean(data.firstName);
  }
  return false;
}

function formatDate(dateStr, t) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return null;
  }
}

function birthYear(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).getFullYear();
  } catch {
    return null;
  }
}

function householdText(data, t) {
  const household = data.household;
  if (!household || typeof household !== 'object') return null;

  const adults = Math.max(1, Number(household.adults) || 1);
  const children = Array.isArray(household.children) ? household.children : [];

  if (children.length === 0) {
    if (adults === 1) return t('mirror.basis.householdAlone');
    return t('mirror.basis.householdAdults', { count: String(adults) });
  }

  const ages = children.map(c => c.age).join(', ');
  if (children.length === 1) {
    return t('mirror.basis.householdWithChild', { count: String(adults), age: ages });
  }
  return t('mirror.basis.householdWithChildren', {
    count: String(adults),
    childCount: String(children.length),
    ages: ages,
  });
}

function maritalLabel(value, t) {
  if (!value) return null;
  return t('chapters.basis.fields.maritalStatus.options.' + value) || value;
}

// ─── Life sentence builders ────────────────────────────────

function buildBasisSentence(data, t) {
  const parts = [];
  const name = [(data.firstName || ''), (data.lastName || '')].filter(Boolean).join(' ');
  if (!name) return null;

  const year = birthYear(data.dateOfBirth);
  const canton = data.canton ? getCantonName(data.canton, t) : null;
  const marital = maritalLabel(data.maritalStatus, t);
  const hh = householdText(data, t);

  // Build sentence progressively
  if (year && canton) {
    parts.push(name + ', ' + t('mirror.basis.born', { year: String(year) }) + ', ' + t('mirror.basis.livingIn', { canton: canton }) + '.');
  } else if (canton) {
    parts.push(name + ', ' + t('mirror.basis.livingIn', { canton: canton }) + '.');
  } else {
    parts.push(name + '.');
  }

  // Second sentence: family situation
  const familyParts = [marital, hh].filter(Boolean);
  if (familyParts.length > 0) {
    const familySentence = familyParts.join(', ');
    parts.push(familySentence.charAt(0).toUpperCase() + familySentence.slice(1) + '.');
  }

  return parts.join(' ');
}

function buildLifeSentence(chapterKey, data, allData, t) {
  if (chapterKey === 'basis') return buildBasisSentence(data, t);
  return null;
}

// ─── Mirror section builders ───────────────────────────────

function buildBasisSections(data, t) {
  const sections = [];

  // Section: Person
  const personRows = [];
  const fullName = [(data.firstName || ''), (data.lastName || '')].filter(Boolean).join(' ');
  if (fullName) personRows.push({ label: t('mirror.basis.name'), value: fullName });
  if (data.dateOfBirth) personRows.push({ label: t('mirror.basis.dateOfBirth'), value: formatDate(data.dateOfBirth, t) });
  if (data.canton) personRows.push({ label: t('mirror.basis.canton'), value: getCantonName(data.canton, t) });
  if (data.maritalStatus) personRows.push({ label: t('mirror.basis.maritalStatus'), value: maritalLabel(data.maritalStatus, t) });

  const hh = householdText(data, t);
  if (hh) personRows.push({ label: t('mirror.basis.household'), value: hh });

  if (personRows.length >= 2) {
    sections.push({ title: t('mirror.basis.person'), rows: personRows });
  }

  // Section: Contact & Family
  const contactRows = [];
  if (data.phone) contactRows.push({ label: t('mirror.basis.phone'), value: data.phone });
  if (data.email) contactRows.push({ label: t('mirror.basis.email'), value: data.email });

  if (contactRows.length > 0) {
    sections.push({ title: t('mirror.basis.contact'), rows: contactRows });
  }

  return sections;
}

function buildMirrorSections(chapterKey, data, t) {
  if (chapterKey === 'basis') return buildBasisSections(data, t);
  return [];
}

// ─── Render ────────────────────────────────────────────────

function MirrorRow({ label, value, palette, isLast }) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: space.sm + 'px 0',
      borderBottom: isLast ? 'none' : '1px solid ' + palette.border,
      gap: space.md + 'px',
    }
  },
    React.createElement('span', {
      style: { fontSize: text.sm, color: palette.mid, flexShrink: 0 }
    }, label),
    React.createElement('span', {
      style: { fontSize: text.body, color: palette.text, textAlign: 'right' }
    }, value || '—')
  );
}

function MirrorSection({ title, rows, palette }) {
  return React.createElement('div', {
    style: {
      background: palette.up,
      borderRadius: radius.sm,
      padding: space.md + 'px',
      marginBottom: space.md + 'px',
    }
  },
    React.createElement('div', {
      style: {
        fontSize: text.xs,
        color: palette.mid,
        letterSpacing: '0.3px',
        fontWeight: weight.medium,
        marginBottom: space.sm + 'px',
      }
    }, title),
    rows.map((row, idx) =>
      React.createElement(MirrorRow, {
        key: row.label,
        label: row.label,
        value: row.value,
        palette: palette,
        isLast: idx === rows.length - 1,
      })
    )
  );
}

export const MirrorCards = ({ chapterKey, data, allData, palette, t }) => {
  if (!hasMinData(chapterKey, data)) return null;

  const sentence = buildLifeSentence(chapterKey, data, allData, t);
  const sections = buildMirrorSections(chapterKey, data, t);

  if (!sentence && sections.length === 0) return null;

  return React.createElement('div', {
    style: { marginBottom: space.lg + 'px' }
  },
    // Life sentence card
    sentence && React.createElement('div', {
      style: {
        background: palette.surface,
        border: '1px solid ' + palette.border,
        borderRadius: radius.md,
        padding: space.md + 'px',
        marginBottom: sections.length > 0 ? space.md + 'px' : 0,
        fontSize: text.body,
        color: palette.text,
        lineHeight: leading.normal,
      }
    }, sentence),

    // Mirror sections
    sections.map((section) =>
      React.createElement(MirrorSection, {
        key: section.title,
        title: section.title,
        rows: section.rows,
        palette: palette,
      })
    )
  );
};

export default MirrorCards;
