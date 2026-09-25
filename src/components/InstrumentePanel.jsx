import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { reserveTankState } from '../data/reserveTank.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../data/kantonaleSteuerdaten.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';
import { zahl, betrag as chfBetrag } from '../utils/geld.js';
import { shieldPath } from './shieldShape.js';
import { PanelTitle } from './Heading.jsx';
import { text, weight, space, radius, leading, duration, ease } from '../config/tokens.js';

// Dashboard-Spiegel der vier „Instrumente": eine kompakte Reihe, die jedes
// Instrument als Mini-Glyph + Peilung + Ort zeigt und in die Detailansicht führt.
// Live wo es günstig/robust ist (Schild, Tankanzeige, Steuer-Säule — reine Zustands-
// Funktionen). Das Franchise-Kreuz braucht die Prämien-Pipeline → hier bewusst nur
// Einstieg statt eines erfundenen Standes (Ehrlichkeit). Seit 25.09.2026 hat jedes
// Instrument eine eigene Form: Kreuz · Säule · Tacho (Reserve) · Schild.

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

// Steuer-Säule im Kleinen — Spiegel der EINEN Säule aus SteuerSaeulen.jsx, die die Person
// betrifft (Wunsch 25.09.2026): ihr Zivilstand, in Sand wie «aktuell gewählt» im Rechner,
// oben gerundet, auf der Grundlinie stehend. Eine einzelne Säule hat nichts, woran ihre Höhe
// sich messen könnte — darum feste Höhe; die Zahl darunter trägt die Aussage. Ohne Betrag
// gestrichelt, wie die Platzhalter-Säule im Rechner. <title> mit Name und Betrag (Hover).
const S_BASIS = 40, S_BREIT = 16, S_HOCH = 30;
const oben = (x, y, w, h, r) => 'M ' + x + ' ' + (y + h) + ' V ' + (y + r) + ' Q ' + x + ' ' + y + ' ' + (x + r) + ' ' + y
  + ' H ' + (x + w - r) + ' Q ' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + ' V ' + (y + h);
const miniSaeule = (palette, t, { betragJahr, verheiratet }) => {
  const h = React.createElement;
  const x = 20;
  const titel = t('tax.saeulen.' + (verheiratet ? 'gemeinsam' : 'ledig')) + (betragJahr != null ? ': ' + chfBetrag(betragJahr) : '');
  return h('svg', { viewBox: '0 0 56 44', width: 56, height: 44, role: 'img', 'aria-label': titel },
    betragJahr != null
      ? h('path', { d: oben(x, S_BASIS - S_HOCH, S_BREIT, S_HOCH, 3) + ' Z', fill: palette.sand }, h('title', null, titel))
      : h('path', { d: oben(x + 0.5, S_BASIS - S_HOCH, S_BREIT - 1, S_HOCH, 2), fill: 'none', stroke: palette.mid, strokeWidth: 1, strokeDasharray: '2 2' }, h('title', null, titel)),
    h('line', { x1: 12, x2: 44, y1: S_BASIS + 0.5, y2: S_BASIS + 0.5, stroke: palette.border, strokeWidth: 1 })
  );
};

// Mini-Kreuz — Spiegel des Franchise-Kreuzes (PraemienOrientierung): zwei Linien, die sich
// kreuzen (hohe Franchise sky, tiefe sand, wie dort). Bewusst ohne Strich für die eigenen
// Kosten — die Prämien-Pipeline läuft hier nicht, also kein erfundener Stand.
const miniKreuz = (palette) => {
  const h = React.createElement;
  return h('svg', { viewBox: '0 0 64 44', width: 64, height: 44, 'aria-hidden': true },
    h('line', { x1: 4, x2: 60, y1: 40.5, y2: 40.5, stroke: palette.border, strokeWidth: 1 }),
    h('polyline', { points: '6,28 34,15 58,15', fill: 'none', stroke: palette.sand, strokeWidth: 2.5, strokeLinejoin: 'round' }),
    h('polyline', { points: '6,35 40,11 58,7', fill: 'none', stroke: palette.sky, strokeWidth: 2.5, strokeLinejoin: 'round' }),
    h('rect', { x: 55, y: 12, width: 6, height: 6, fill: palette.sand }),
    h('circle', { cx: 58, cy: 7, r: 3, fill: palette.sky })
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
  let bundessteuer = null;
  try {
    if ((Number(data?.finanzen?.monthlyIncome) || 0) > 0 || (Number(data?.finanzen?.taxableIncome) || 0) > 0) {
      const eingaben = steuerEingabenAusDaten(data);
      const st = steuernFuerProfil(eingaben);
      bundessteuer = st?.bund ? Math.round(st.bund.steuer) : null;
    }
  } catch { /* Orientierung, nie blockierend */ }

  const setup = t('instrumente.setup');
  const tiles = [
    {
      key: 'tacho', name: t('instrumente.tacho'), sub: t('instrumente.tachoSub'),
      glyph: miniKreuz(palette),
      onClick: () => onNavigate('praemien'),
    },
    {
      // Bis 25.09.2026 stand hier der Leistungs-Kompass — er ist jetzt Kopf der Leistungsliste.
      key: 'steuer', name: t('instrumente.steuer'),
      sub: bundessteuer != null ? t('instrumente.steuerBetrag', { value: zahl(bundessteuer) }) : setup,
      glyph: miniSaeule(palette, t, { betragJahr: bundessteuer, verheiratet: giltAlsVerheiratet(data?.basis?.maritalStatus) }),
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
