import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { reserveTankState } from '../data/reserveTank.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { steuernFuerProfil, steuerEingabenAusDaten, tarifvergleichFuerProfil } from '../data/kantonaleSteuerdaten.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';
import { zahl } from '../utils/geld.js';
import { shieldPath } from './shieldShape.js';
import { PanelTitle } from './Heading.jsx';
import { text, weight, space, radius, leading, duration, ease } from '../config/tokens.js';

// Dashboard-Spiegel der vier „Instrumente": eine kompakte Reihe, die jedes
// Instrument als Mini-Glyph + Peilung + Ort zeigt und in die Detailansicht führt.
// Live wo es günstig/robust ist (Schild, Tankanzeige, Kompass — reine Zustands-
// Funktionen). Der Tacho braucht die Prämien-Pipeline → hier bewusst nur
// Einstieg statt gefälschtem Zeiger (Ehrlichkeit).

// ── Mini-Glyphen (ohne Text, damit sie klein lesbar bleiben) ──
const gp = (f, r, cx, cy) => { const a = Math.PI * (1 - Math.max(0, Math.min(1, f))); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
const garc = (f1, f2, r, cx, cy) => { const [x1, y1] = gp(f1, r, cx, cy); const [x2, y2] = gp(f2, r, cx, cy); return 'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1); };

const miniGauge = (palette, { split = 0.5, left, right, needle }) => {
  const h = React.createElement;
  const cx = 30, cy = 30, r = 24;
  const els = [
    h('path', { key: 't', d: garc(0, 1, r, cx, cy), fill: 'none', stroke: palette.border, strokeWidth: 6, strokeLinecap: 'round' }),
    h('path', { key: 'l', d: garc(0, split, r, cx, cy), fill: 'none', stroke: left, strokeWidth: 6 }),
    h('path', { key: 'rr', d: garc(split, 1, r, cx, cy), fill: 'none', stroke: right, strokeWidth: 6 }),
  ];
  if (needle != null) {
    const [nx, ny] = gp(needle, r - 5, cx, cy);
    els.push(h('line', { key: 'n', x1: cx, y1: cy, x2: nx, y2: ny, stroke: palette.text, strokeWidth: 2.5, strokeLinecap: 'round' }));
  } else {
    const [mx1, my1] = gp(split, r - 4, cx, cy); const [mx2, my2] = gp(split, r + 3, cx, cy);
    els.push(h('line', { key: 'm', x1: mx1, y1: my1, x2: mx2, y2: my2, stroke: palette.mid, strokeWidth: 2 }));
  }
  els.push(h('circle', { key: 'h', cx, cy, r: 4, fill: palette.surface, stroke: palette.text, strokeWidth: 2 }));
  return h('svg', { viewBox: '0 0 60 40', width: 60, height: 40, style: { overflow: 'visible' }, 'aria-hidden': true }, els);
};

// Steuer-Säulen im Kleinen — Spiegel von SteuerSaeulen.jsx (Steuerrechner): zwei belegte
// Säulen (ledig, verheiratet gemeinsam, DBG Art. 36), die dritte gestrichelt und ohne Wert
// (Individualbesteuerung, noch nicht in Kraft). Höhen aus dem echten Tarifvergleich, sonst
// gleich hoch; die Säule des eigenen Zivilstands in Sand, wie «aktuell gewählt» im Rechner.
const miniSaeulen = (palette, { ledig, gemeinsam, verheiratet }) => {
  const h = React.createElement;
  const max = Math.max(ledig || 0, gemeinsam || 0);
  const hoehe = (v) => (max > 0 ? 10 + 24 * (v / max) : 22);
  const saeule = (key, x, v, aktiv) => h('rect', {
    key, x, width: 9, rx: 2, y: 38 - hoehe(v), height: hoehe(v),
    fill: aktiv ? palette.sand : palette.mid + '55',
  });
  return h('svg', { viewBox: '0 0 46 40', width: 46, height: 40, 'aria-hidden': true },
    saeule('l', 4, ledig, !verheiratet),
    saeule('g', 18, gemeinsam, verheiratet),
    h('rect', { key: 'e', x: 32.5, y: 10.5, width: 8, height: 27, rx: 2, fill: 'none', stroke: palette.mid, strokeDasharray: '2 2' })
  );
};

const MINI_TOP = 3, MINI_BOTTOM = 38;
const SHIELD = shieldPath(18, MINI_TOP, 26, MINI_BOTTOM - MINI_TOP);
const miniShield = (palette, fraction) => {
  const h = React.createElement;
  const top = MINI_TOP, bottom = MINI_BOTTOM;
  const fh = fraction * (bottom - top);
  return h('svg', { viewBox: '0 0 36 42', width: 36, height: 42, 'aria-hidden': true },
    h('defs', null, h('clipPath', { id: 'mini-shield-clip' }, h('path', { d: SHIELD }))),
    h('g', { clipPath: 'url(#mini-shield-clip)' },
      h('rect', { x: 3, y: 0, width: 30, height: 42, fill: palette.up }),
      h('rect', { x: 3, y: bottom - fh, width: 30, height: fh + 2, fill: palette.sage, opacity: 0.85 })
    ),
    h('path', { d: SHIELD, fill: 'none', stroke: palette.sage, strokeWidth: 2 })
  );
};

// eingebettet: steht im Dashboard-Block «Was steht mir zu?» (seit 25.09.2026) —
// Titel dann in der Grösse der übrigen Zwischentitel dort, kein eigener Abstand nach unten.
export const InstrumentePanel = ({ palette, t, data, onNavigate, eingebettet = false }) => {
  const h = React.createElement;
  const v = data?.versicherungen || {};
  const shield = schildState(v, {
    employed: data?.finanzen?.employmentType === 'employed',
    annualIncome: (Number(data?.finanzen?.monthlyIncome) || 0) * 12,
  });
  const tank = reserveTankState({ savings: Number(data?.finanzen?.savingsAccount) || 0, monthlyExpenses: monthlyExpenses(data) });

  // Steuer: dieselbe Rechnung wie Steuerrechner und Finanz-Übersicht (E39: steuernFuerProfil).
  // Nur die Bundessteuer als Zahl — sie ist der amtlich belegte Tarif (DBG Art. 36).
  let bundessteuer = null, tarif = null;
  try {
    if ((Number(data?.finanzen?.monthlyIncome) || 0) > 0 || (Number(data?.finanzen?.taxableIncome) || 0) > 0) {
      const eingaben = steuerEingabenAusDaten(data);
      const st = steuernFuerProfil(eingaben);
      bundessteuer = st?.bund ? Math.round(st.bund.steuer) : null;
      tarif = tarifvergleichFuerProfil(eingaben);
    }
  } catch { /* Orientierung, nie blockierend */ }

  const setup = t('instrumente.setup');
  const tiles = [
    {
      key: 'tacho', name: t('instrumente.tacho'), sub: t('instrumente.tachoSub'),
      glyph: miniGauge(palette, { split: 0.5, left: palette.sage, right: palette.sandDeep }),
      onClick: () => onNavigate('praemien'),
    },
    {
      // Bis 25.09.2026 stand hier der Leistungs-Kompass — er ist jetzt Kopf der Leistungsliste.
      key: 'steuer', name: t('instrumente.steuer'),
      sub: bundessteuer != null ? t('instrumente.steuerBetrag', { value: zahl(bundessteuer) }) : setup,
      glyph: miniSaeulen(palette, {
        ledig: tarif ? Number(tarif.alleinstehend) : 0,
        gemeinsam: tarif ? Number(tarif.verheiratet) : 0,
        verheiratet: giltAlsVerheiratet(data?.basis?.maritalStatus),
      }),
      onClick: () => onNavigate('tax'),
    },
    {
      key: 'tank', name: t('instrumente.tank'),
      sub: tank.mode === 'months' ? t('instrumente.tankMonths', { months: tank.months }) : setup,
      glyph: miniGauge(palette, { split: 0.5, left: palette.sandDeep, right: palette.sage, needle: tank.mode === 'months' ? tank.needle / tank.fullMonths : null }),
      onClick: () => onNavigate('finanzuebersicht'),
    },
    {
      key: 'schild', name: t('instrumente.schild'),
      sub: shield.touched ? t('instrumente.schildCount', { covered: shield.overall.covered, total: shield.overall.total }) : setup,
      glyph: miniShield(palette, shield.touched ? shield.overall.fraction : 0),
      onClick: () => onNavigate('chapter', 3),
    },
  ];

  const titel = h(PanelTitle, {
    palette,
    style: eingebettet
      ? { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      : { margin: '0 0 ' + space.xs + 'px 0' },
  }, t('instrumente.title'));

  return h('div', { style: eingebettet ? { marginTop: space.lg + 'px' } : { marginBottom: space.xl + 'px' } },
    // Eingebettet: Titel ohne Einleitung — die Finanz-Übersicht steht als Karte direkt darüber.
    eingebettet ? h('div', { style: { marginBottom: space.sm + 'px' } }, titel) : titel,
    !eingebettet && h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed } }, t('instrumente.intro')),
    // Festes 2-Spalten-Raster: bei genau vier Instrumenten ergibt das ein ruhiges
    // 2×2 statt eines verwaisten 3+1 (auto-fit liess bei ~570 px drei Kacheln zu).
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: space.sm + 'px' } },
      tiles.map(tile => h('button', {
        key: tile.key,
        onClick: tile.onClick,
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          padding: space.md + 'px', background: 'transparent', color: palette.text,
          border: '1px solid ' + palette.border + '44', borderRadius: radius.md,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
          transition: 'background ' + duration.normal + 'ms ' + ease + ', border-color ' + duration.normal + 'ms ' + ease,
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sage + '55'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = palette.border + '44'; },
      },
        h('div', { style: { height: '44px', display: 'flex', alignItems: 'center' } }, tile.glyph),
        h('div', { style: { fontSize: text.sm, fontWeight: weight.medium } }, tile.name),
        h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } }, tile.sub)
      ))
    )
  );
};

export default InstrumentePanel;
