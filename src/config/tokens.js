// Maloja Plana — JS Design Tokens
//
// JS-side mirror of tokens.css and the Design Language Registry.
// React.createElement + inline styles cannot reference CSS custom properties,
// so components import these constants instead. tokens.css remains the
// conceptual source of truth; values here must stay in sync with it.
//
// Usage:
//   import { space, text, weight, leading, radius, shadow, ease, duration } from '../config/tokens.js';
//   style: { fontSize: text.body, padding: space.md, borderRadius: radius.sm }

// ─── Spacing (4px base grid) ────────────────────────────────
export const space = {
  '2xs': 2,
  xs:    4,
  sm:    8,
  md:    16,
  lg:    24,
  xl:    32,
  '2xl': 48,
  '3xl': 64,
};

// ─── Typography scale ───────────────────────────────────────
export const text = {
  xs:   13,
  sm:   15,
  body: 16,
  lg:   19,
  xl:   23,
  '2xl': 28,
  '3xl': 36,
};

// ─── Font weights ───────────────────────────────────────────
export const weight = {
  normal: 400,
  medium: 500,
  semi:   600,
  bold:   700,
};

// ─── Line heights ───────────────────────────────────────────
export const leading = {
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.7,
};

// ─── Border radii ───────────────────────────────────────────
export const radius = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  full: 9999,
};

// ─── Shadows (subtle, premium) ──────────────────────────────
export const shadow = {
  sm: '0 1px 3px rgba(0,0,0,0.06)',
  md: '0 2px 8px rgba(0,0,0,0.08)',
  lg: '0 4px 16px rgba(0,0,0,0.10)',
  xl: '0 8px 32px rgba(0,0,0,0.12)',
};

// ─── Motion ─────────────────────────────────────────────────
export const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

export const duration = {
  fast:   150,
  normal: 250,
  slow:   400,
  cinematic: 600,
};

// ─── Font stack ─────────────────────────────────────────────
export const fontFamily = "'DM Sans', sans-serif";
