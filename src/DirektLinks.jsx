import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { DIREKTLINKS, KATEGORIEN, BERATUNG_HILFE, HEARTFELT, HEARTFELT_GROUPS, getAllKategorien, getLinksByKategorie, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, ease } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

// Jede Kategorie ist ein Buch, das im Regal steht (Buchrücken = Kategorie).
// Ein Klick klappt das Buch auf. Zwei Sonderbücher rechts: „Beratung & Hilfe"
// (gemeinnützige Anlaufstellen) und die persönlichen „Herzensempfehlungen" (24,
// gruppiert, geteilte Quelle mit LegalView). Ruhige Skeuomorphie: dünnes
// Regalbrett, flache Rücken, kleiner Farbstreifen.
const BUCH_TON = {
  gesundheit: 'rose',
  vorsorge: 'sage',
  soziales: 'sky',
  arbeit: 'gold',
  familie: 'sand',
  finanzen: 'sky',
  recht: 'soft',
};
const BERATUNG_TON = 'sage';
const SICHER_TON = 'sky';
const MITREDEN_TON = 'sand';
const HERZ_TON = 'gold';

// Kanton-/Gemeinde-Portal nach dem Muster www.<code|gemeinde>.ch (wie LegalView —
// Sophies Entscheid: trifft meist, gelegentlich daneben, bewusst akzeptiert).
const cantonPortalUrl = (code) => 'https://www.' + String(code).toLowerCase() + '.ch';
const communeUrl = (city) => {
  const slug = String(city).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/[àâá]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíî]/g, 'i')
    .replace(/[òóô]/g, 'o').replace(/[ùúû]/g, 'u').replace(/ç/g, 'c').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug ? 'https://www.' + slug + '.ch' : null;
};

export const DirektLinks = ({ palette, t, data }) => {
  const kategorien = getAllKategorien();
  const [offen, setOffen] = useState(null); // Kategorie-id oder 'herz' oder null
  const lang = t('dl.lang');
  const l = (obj) => obj[lang] || obj.de;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px' },
    shelfWrap: { overflowX: 'auto', paddingBottom: space.xs + 'px', marginBottom: space.md + 'px', WebkitOverflowScrolling: 'touch' },
    shelf: { display: 'inline-flex', gap: space.sm + 'px', alignItems: 'flex-end', minWidth: '100%', padding: '0 2px', borderBottom: '3px solid ' + palette.top },
    spine: (ton, active) => ({
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
      flex: '0 0 auto', width: '48px', minHeight: '76px', paddingTop: '11px', paddingBottom: space.sm + 'px',
      background: palette.up, border: '1px solid ' + (active ? palette[ton] : palette.border), borderBottom: 'none',
      borderTopLeftRadius: '3px', borderTopRightRadius: '3px', cursor: 'pointer', fontFamily: 'inherit',
      color: palette.text, // Dark-Mode: Icon erbt fill:currentColor — Button erbt color nicht zuverlässig
      transform: active ? 'translateY(-5px)' : 'none', transition: 'transform 140ms ' + ease.out,
      boxShadow: active ? '0 2px 10px ' + palette[ton] + '2E' : 'none',
    }),
    cap: (ton) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: palette[ton], borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }),
    spineName: { writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: text.xs, fontWeight: weight.semi, color: palette.text, letterSpacing: '0.2px', whiteSpace: 'nowrap' },
    book: (ton) => ({ background: palette.up, border: '1px solid ' + palette.border, borderLeft: '4px solid ' + palette[ton], borderRadius: '0 ' + radius.sm + 'px ' + radius.sm + 'px 0', padding: space.md + 'px', marginBottom: space.md + 'px' }),
    bookHead: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.sm + 'px' },
    herzNote: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px', fontStyle: 'italic' },
    hfGroup: { fontWeight: weight.semi, fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 ' + space.xs + 'px' },
    hfRow: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5, margin: '0 0 ' + space.sm + 'px' },
    hfLink: { color: palette.sage, textDecoration: 'none' },
    hfAff: { color: palette.soft, fontSize: text.xs },
    linkCard: { padding: space.md + 'px', background: palette.surface, borderRadius: radius.sm + 'px', marginBottom: space.sm + 'px', border: '1px solid ' + palette.border },
    linkName: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: '2px', color: palette.text },
    linkDesc: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px', lineHeight: 1.5 },
    linkUrl: { fontSize: text.xs, color: palette.sage, textDecoration: 'none', wordBreak: 'break-all' },
    linkStelle: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px' },
    empty: { fontSize: text.sm, color: palette.mid, textAlign: 'center', padding: space.lg + 'px' },
    canton: { padding: space.md + 'px', background: palette.sage + '11', borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', border: '1px solid ' + palette.sage + '33' },
    cantonTitle: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.sm + 'px', color: palette.sage },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.sky },
  };

  // Ein einzelner Link als Karte (amtlich mit Antragsstelle, Herz ohne).
  const linkCard = (link, mitStelle) => React.createElement('div', { key: link.id, style: s.linkCard },
    React.createElement('div', { style: s.linkName }, l(link.name)),
    React.createElement('div', { style: s.linkDesc }, l(link.beschreibung)),
    React.createElement('a', { href: link.url, target: '_blank', rel: 'noopener noreferrer', style: s.linkUrl }, link.url),
    mitStelle && link.antragsstelle && React.createElement('div', { style: s.linkStelle }, t('dl.antragsstelle') + ': ' + l(link.antragsstelle))
  );

  // Ein Buchrücken im Regal.
  const spine = (id, ton, iconName, name) => {
    const active = offen === id;
    return React.createElement('button', {
      key: id, type: 'button', 'aria-pressed': active, 'aria-expanded': active, 'aria-controls': 'buch-panel',
      'aria-label': name, title: name, style: s.spine(ton, active),
      onClick: () => setOffen(active ? null : id),
    },
      React.createElement('span', { style: s.cap(ton), 'aria-hidden': 'true' }),
      React.createElement(Icon, { name: iconName, size: 17 }),
      React.createElement('span', { style: s.spineName }, name)
    );
  };

  // Eine Herzensempfehlungs-Zeile: „→ Name · Affiliate — Beschreibung". Beschreibung
  // aus i18n (legal.resources.<key>, geteilt mit LegalView); ohne url nur der Name
  // (bewusst kein Link). Übersetzt eine fehlende Beschreibung nicht → Eintrag entfällt.
  const hfRow = (item, desc) => React.createElement('p', { key: item.key, style: s.hfRow },
    '→ ',
    item.url
      ? React.createElement('a', { href: item.url, target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, item.name)
      : item.name,
    item.affiliate ? React.createElement('span', { style: s.hfAff }, ' · ' + t('legal.resources.affiliateMarker')) : null,
    ' — ' + desc
  );

  // Ressourcen-Zeile „→ Name — Beschreibung · Website" für die aus i18n kommenden
  // Einträge ({ name, url, desc, web? }) und die normalisierten Beratung-&-Hilfe-
  // Objekte. url kann tel: sein. Ohne url nur der Name (bewusst kein Link).
  const resRow = (key, e) => e && React.createElement('p', { key, style: s.hfRow },
    '→ ',
    e.url ? React.createElement('a', { href: e.url, target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, e.name) : e.name,
    ' — ' + e.desc,
    e.web ? React.createElement(React.Fragment, null, ' · ', React.createElement('a', { href: e.web, target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, 'Website')) : null
  );

  // Gemeinde-/Kanton-Zeile fürs „Mitreden"-Buch (wie LegalView, kantonsabhängig).
  const renderLocalGov = () => {
    const canton = (data && data.basis && data.basis.canton) || '';
    const city = ((data && data.wohnen && data.wohnen.city) || '').trim();
    const cantonName = canton ? getCantonName(canton, t) : '';
    if (!city && !cantonName) return React.createElement('p', { style: s.hfRow }, '→ ' + t('legal.resources.petition3'));
    const parts = ['→ '];
    if (city) { const cUrl = communeUrl(city); parts.push(cUrl ? React.createElement('a', { key: 'gm', href: cUrl, target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, city) : city); }
    if (cantonName) {
      if (city) parts.push(' · ');
      parts.push(React.createElement('a', { key: 'kt', href: cantonPortalUrl(canton), target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, t('legal.resources.cantonPortal', { canton: cantonName })));
    }
    parts.push(' — ' + t('legal.resources.localGovDesc'));
    return React.createElement('p', { style: s.hfRow }, ...parts);
  };

  // Inhalt des aufgeschlagenen Buchs.
  const renderBuch = () => {
    if (!offen) return null;
    // Herzensempfehlungen: die echten 24, nach Themengruppen (geteilte Quelle + i18n
    // mit LegalView). Affiliate transparent, „kein Link" ehrlich.
    if (offen === 'herz') {
      const hasAff = HEARTFELT.some(i => i.affiliate);
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.herzTitle'), style: s.book(HERZ_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'heart', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.herzTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t(hasAff ? 'legal.resources.heartfeltIntroAffiliate' : 'legal.resources.heartfeltIntro')),
        ...HEARTFELT_GROUPS.flatMap(g => {
          const items = HEARTFELT
            .filter(i => i.group === g)
            .map(item => ({ item, desc: t('legal.resources.' + item.key) }))
            .filter(({ desc }) => desc && desc.indexOf('legal.resources.') !== 0)
            .sort((a, b) => a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' }));
          if (!items.length) return [];
          return [
            React.createElement('p', { key: 'hg-' + g, style: s.hfGroup }, t('legal.resources.heartfeltGroups.' + g)),
            ...items.map(({ item, desc }) => hfRow(item, desc)),
          ];
        })
      );
    }
    // Beratung & Hilfe: Beratungsstellen (help + Sophies 3) + Ombudsstellen (ombuds).
    if (offen === 'beratung') {
      const beratung = BERATUNG_HILFE.map(x => ({ name: l(x.name), url: x.url, desc: l(x.beschreibung) }));
      const help = ['help1', 'help2', 'help3', 'help4'].map(k => t('legal.resources.' + k));
      const ombuds = ['ombuds1', 'ombuds2', 'ombuds3', 'ombuds4'].map(k => t('legal.resources.' + k));
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.beratungTitle'), style: s.book(BERATUNG_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'contacts', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.beratungTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t('dl.beratungNote')),
        React.createElement('p', { style: s.hfGroup }, t('legal.resources.helpTitle')),
        ...help.map((e, i) => resRow('help' + i, e)),
        ...beratung.map((e, i) => resRow('ber' + i, e)),
        React.createElement('p', { style: s.hfGroup }, t('legal.resources.ombudsTitle')),
        ...ombuds.map((e, i) => resRow('omb' + i, e))
      );
    }
    // Sichere Kanäle: verschlüsselte/rechtsgültige Kommunikationswege.
    if (offen === 'sicher') {
      const items = ['threema', 'secureSafe', 'incamail'].map(k => t('legal.resources.' + k));
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.sicherTitle'), style: s.book(SICHER_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'lock', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.sicherTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t('legal.resources.secure1')),
        ...items.map((e, i) => resRow('sec' + i, e))
      );
    }
    // Mitreden: Petitionen + Gemeinde/Kanton (Bürgerrechte, Art. 33 BV).
    if (offen === 'mitreden') {
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.mitredenTitle'), style: s.book(MITREDEN_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'edit', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.mitredenTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t('legal.resources.petition1')),
        resRow('pet2', t('legal.resources.petition2')),
        renderLocalGov()
      );
    }
    const kat = KATEGORIEN[offen];
    const links = getLinksByKategorie(offen);
    return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': l(kat), style: s.book(BUCH_TON[offen] || 'soft') },
      React.createElement('div', { style: s.bookHead },
        React.createElement(Icon, { name: kat.icon, size: 20 }),
        React.createElement(PanelTitle, { palette, style: { margin: 0 } }, l(kat))
      ),
      links.length ? links.map(link => linkCard(link, true)) : React.createElement('div', { style: s.empty }, t('dl.alle'))
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'dokumentTresor', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('dl.title')),
    React.createElement('p', { style: s.intro }, t('dl.shelfIntro')),

    // Das Regal: Kategorie-Bücher, dann Beratung & Hilfe, dann Herzensempfehlungen.
    React.createElement('div', { style: s.shelfWrap },
      React.createElement('div', { style: s.shelf, role: 'group', 'aria-label': t('dl.title') },
        ...kategorien.map(k => spine(k.id, BUCH_TON[k.id] || 'soft', k.icon, l(k))),
        spine('beratung', BERATUNG_TON, 'contacts', t('dl.beratungTitle')),
        spine('sicher', SICHER_TON, 'lock', t('dl.sicherTitle')),
        spine('mitreden', MITREDEN_TON, 'edit', t('dl.mitredenTitle')),
        spine('herz', HERZ_TON, 'heart', t('dl.herzTitle'))
      )
    ),

    // Aufgeschlagenes Buch (nur wenn ein Rücken gewählt ist).
    renderBuch(),

    // Kantonale Anlaufstellen bleiben erhalten (unverändert), unter dem Regal.
    data && data.basis?.canton && getCantonalLinks(data.basis.canton) && React.createElement('div', { style: s.canton },
      React.createElement('div', { style: s.cantonTitle }, t('dl.cantonalTitle', { canton: getCantonName(data.basis.canton, t) })),
      Object.entries(getCantonalLinks(data.basis.canton)).map(([key, url]) =>
        React.createElement('div', { key, style: { marginBottom: space.xs + 'px' } },
          React.createElement('a', { href: url, target: '_blank', rel: 'noopener noreferrer', style: { fontSize: text.xs, color: palette.sage, textDecoration: 'none' } },
            t('dl.cantonal.' + key) + ' →'
          )
        )
      )
    ),

    React.createElement('div', { style: s.source }, renderSource(t('dl.source')))
  );
};

export default DirektLinks;
