// Die Schriftstufen aus tokens.js als Zahl (px bei 16-px-Grundschrift): zum Rechnen und für
// SVG-Zeichenflächen. Eigene Datei, damit das Startbündel sie nicht trägt (Schriftskala 23.11.2026).
import { text } from './tokens.js';

export const textPx = Object.fromEntries(Object.entries(text).map(([k, v]) => [k, parseFloat(v) * 16]));
export const rem = (px) => px / 16 + 'rem';
