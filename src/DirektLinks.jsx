import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { KATEGORIEN, BERATUNG_HILFE, HEARTFELT, HEARTFELT_GROUPS, getAllKategorien, getLinksByKategorie, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, ease } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

// Bücherregal mit mehreren Etagen: jede Kategorie (und jedes Sonderthema) ist ein
// Buch, dessen Rücken auf einem Regalbrett steht. Ein Klick klappt das Buch unter
// seiner eigenen Etage auf. Logisch sortiert (amtlich / Rat & Schutz / persönlich),
// damit neue Bücher leicht Platz finden. ALLE Buch-Inhalte nutzen dieselbe ruhige
// Eintragszeile (entryRow) — einheitliches Aussehen, Link stets aufs Wort.
const BUCH_TON = {
  gesundheit: 'rose',
  vorsorge: 'sage',
  soziales: 'sky',
  arbeit: 'gold',
  familie: 'sand',
  finanzen: 'sky',
  recht: 'soft',
};
// Sonderbücher (nicht aus KATEGORIEN): Ton, Icon, Titel-Key.
const SONDER = {
  beratung: { ton: 'sage', icon: 'contacts', titleKey: 'dl.beratungTitle' },
  sicher: { ton: 'sky', icon: 'lock', titleKey: 'dl.sicherTitle' },
  mitreden: { ton: 'sand', icon: 'edit', titleKey: 'dl.mitredenTitle' },
  herz: { ton: 'gold', icon: 'heart', titleKey: 'dl.herzTitle' },
};

// Kanton-/Gemeinde-Portal nach dem Muster www.<code|gemeinde>.ch (Sophies Entscheid:
// trifft meist, gelegentlich daneben, bewusst akzeptiert).
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
  const [offen, setOffen] = useState(null); // Buch-id oder null
  const lang = t('dl.lang');
  const l = (obj) => obj[lang] || obj.de;

  // Etagen des Regals — logisch sortiert.
  const regale = [
    { key: 'amtlich', label: t('dl.shelfAmtlich'), ids: kategorien.map(k => k.id) },
    { key: 'rat', label: t('dl.shelfRat'), ids: ['beratung', 'sicher', 'mitreden'] },
    { key: 'persoenlich', label: t('dl.shelfPersoenlich'), ids: ['herz'] },
  ];

  // Ton, Icon, Titel je Buch (Kategorie oder Sonderbuch).
  const bookInfo = (id) => SONDER[id]
    ? { ton: SONDER[id].ton, icon: SONDER[id].icon, name: t(SONDER[id].titleKey) }
    : { ton: BUCH_TON[id] || 'soft', icon: KATEGORIEN[id].icon, name: l(KATEGORIEN[id]) };

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.lg + 'px' },
    etage: { marginBottom: space.lg + 'px' },
    shelfLabel: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, letterSpacing: '0.3px', margin: '0 0 ' + space.xs + 'px 2px' },
    shelfWrap: { overflowX: 'auto', paddingBottom: space.xs + 'px', WebkitOverflowScrolling: 'touch' },
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
    book: (ton) => ({ background: palette.up, border: '1px solid ' + palette.border, borderLeft: '4px solid ' + palette[ton], borderRadius: '0 ' + radius.sm + 'px ' + radius.sm + 'px 0', padding: space.md + 'px', marginTop: space.sm + 'px' }),
    bookHead: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.sm + 'px' },
    bookIntro: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px', fontStyle: 'italic' },
    groupHeading: { fontWeight: weight.semi, fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 ' + space.xs + 'px' },
    entryRow: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.sm + 'px' },
    entryLink: { color: palette.sage, textDecoration: 'none' },
    meta: { color: palette.soft },
    aff: { color: palette.soft, fontSize: text.xs },
    empty: { fontSize: text.sm, color: palette.mid, textAlign: 'center', padding: space.lg + 'px' },
    canton: { padding: space.md + 'px', background: palette.sage + '11', borderRadius: radius.sm + 'px', margin: space.sm + 'px 0 ' + space.md + 'px', border: '1px solid ' + palette.sage + '33' },
    cantonTitle: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.sm + 'px', color: palette.sage },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.sky },
  };

  const eLink = (label, url, key) => React.createElement('a', { key, href: url, target: '_blank', rel: 'noopener noreferrer', style: s.entryLink }, label);

  // Einheitliche Eintragszeile für ALLE Bücher: „→ Name[ · Affiliate] — Beschreibung
  // [ · Meta]". Link stets aufs Wort (Name), nie nackte URL. Ohne url nur der Name.
  // e = { key, name, url?, desc?, affiliate?, extras?: [{ label, url? }] }
  const entryRow = (e) => {
    const kids = ['→ ', e.url ? eLink(e.name, e.url, 'n') : e.name];
    if (e.affiliate) kids.push(React.createElement('span', { key: 'aff', style: s.aff }, ' · ' + t('legal.resources.affiliateMarker')));
    if (e.desc) kids.push(' — ' + e.desc);
    (e.extras || []).forEach((x, i) => {
      kids.push(' · ');
      kids.push(x.url ? eLink(x.label, x.url, 'x' + i) : React.createElement('span', { key: 'x' + i, style: s.meta }, x.label));
    });
    return React.createElement('p', { key: e.key, style: s.entryRow }, ...kids);
  };

  const groupHeading = (label, key) => React.createElement('p', { key, style: s.groupHeading }, label);

  // Kategorie-Link → normalisierter Eintrag (Antragsstelle als Meta statt eigener Zeile).
  const katEntries = (id) => getLinksByKategorie(id).map(link => ({
    key: link.id, name: l(link.name), url: link.url, desc: l(link.beschreibung),
    extras: link.antragsstelle ? [{ label: t('dl.antragsstelle') + ': ' + l(link.antragsstelle) }] : [],
  }));
  // i18n-Ressourcen-Objekt ({ name, url, desc, web? }) → normalisierter Eintrag.
  const resEntry = (key, e) => ({ key, name: e.name, url: e.url, desc: e.desc, extras: e.web ? [{ label: 'Website', url: e.web }] : [] });

  // Gemeinde-/Kanton-Zeile fürs „Mitreden"-Buch (kantonsabhängig) — gleiche Zeilenoptik.
  const renderLocalGov = () => {
    const canton = (data && data.basis && data.basis.canton) || '';
    const city = ((data && data.wohnen && data.wohnen.city) || '').trim();
    const cantonName = canton ? getCantonName(canton, t) : '';
    if (!city && !cantonName) return React.createElement('p', { key: 'lg', style: s.entryRow }, '→ ' + t('legal.resources.petition3'));
    const parts = ['→ '];
    if (city) { const cUrl = communeUrl(city); parts.push(cUrl ? eLink(city, cUrl, 'gm') : city); }
    if (cantonName) {
      if (city) parts.push(' · ');
      parts.push(eLink(t('legal.resources.cantonPortal', { canton: cantonName }), cantonPortalUrl(canton), 'kt'));
    }
    parts.push(' — ' + t('legal.resources.localGovDesc'));
    return React.createElement('p', { key: 'lg', style: s.entryRow }, ...parts);
  };

  // Buch-Hülle: farbige Kante + Kopf (Icon + Titel) + optionaler Intro + Inhalt.
  const bookWrap = (id, intro, children) => {
    const info = bookInfo(id);
    return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': info.name, style: s.book(info.ton) },
      React.createElement('div', { style: s.bookHead },
        React.createElement(Icon, { name: info.icon, size: 20 }),
        React.createElement(PanelTitle, { palette, style: { margin: 0 } }, info.name)
      ),
      intro ? React.createElement('p', { style: s.bookIntro }, intro) : null,
      ...children
    );
  };

  // Inhalt des aufgeschlagenen Buchs.
  const renderBuch = () => {
    if (!offen) return null;
    // Herzensempfehlungen: echte 24 nach Themengruppen (geteilte Quelle + i18n mit LegalView).
    if (offen === 'herz') {
      const hasAff = HEARTFELT.some(i => i.affiliate);
      const kids = [];
      HEARTFELT_GROUPS.forEach(g => {
        const items = HEARTFELT
          .filter(i => i.group === g)
          .map(item => ({ item, desc: t('legal.resources.' + item.key) }))
          .filter(({ desc }) => desc && desc.indexOf('legal.resources.') !== 0)
          .sort((a, b) => a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' }));
        if (!items.length) return;
        kids.push(groupHeading(t('legal.resources.heartfeltGroups.' + g), 'hg-' + g));
        items.forEach(({ item, desc }) => kids.push(entryRow({ key: item.key, name: item.name, url: item.url, desc, affiliate: item.affiliate })));
      });
      return bookWrap('herz', t(hasAff ? 'legal.resources.heartfeltIntroAffiliate' : 'legal.resources.heartfeltIntro'), kids);
    }
    // Beratung & Hilfe: Beratungsstellen (help + Sophies 3) + Ombudsstellen (ombuds).
    if (offen === 'beratung') {
      const kids = [];
      kids.push(groupHeading(t('legal.resources.helpTitle'), 'gh-help'));
      ['help1', 'help2', 'help3', 'help4'].forEach((k, i) => kids.push(entryRow(resEntry('help' + i, t('legal.resources.' + k)))));
      BERATUNG_HILFE.forEach((x, i) => kids.push(entryRow({ key: 'ber' + i, name: l(x.name), url: x.url, desc: l(x.beschreibung) })));
      kids.push(groupHeading(t('legal.resources.ombudsTitle'), 'gh-omb'));
      ['ombuds1', 'ombuds2', 'ombuds3', 'ombuds4'].forEach((k, i) => kids.push(entryRow(resEntry('omb' + i, t('legal.resources.' + k)))));
      return bookWrap('beratung', t('dl.beratungNote'), kids);
    }
    // Sichere Kanäle: verschlüsselte/rechtsgültige Kommunikationswege.
    if (offen === 'sicher') {
      const kids = ['threema', 'secureSafe', 'incamail'].map((k, i) => entryRow(resEntry('sec' + i, t('legal.resources.' + k))));
      return bookWrap('sicher', t('legal.resources.secure1'), kids);
    }
    // Mitreden: Petitionen + Gemeinde/Kanton (Bürgerrechte, Art. 33 BV).
    if (offen === 'mitreden') {
      return bookWrap('mitreden', t('legal.resources.petition1'), [
        entryRow(resEntry('pet2', t('legal.resources.petition2'))),
        renderLocalGov(),
      ]);
    }
    // Kategorie-Buch.
    const entries = katEntries(offen);
    return bookWrap(offen, null, entries.length ? entries.map(entryRow) : [React.createElement('div', { key: 'empty', style: s.empty }, t('dl.alle'))]);
  };

  // Ein Buchrücken im Regal.
  const spine = (id) => {
    const info = bookInfo(id);
    const active = offen === id;
    return React.createElement('button', {
      key: id, type: 'button', 'aria-pressed': active, 'aria-expanded': active, 'aria-controls': 'buch-panel',
      'aria-label': info.name, title: info.name, style: s.spine(info.ton, active),
      onClick: () => setOffen(active ? null : id),
    },
      React.createElement('span', { style: s.cap(info.ton), 'aria-hidden': 'true' }),
      React.createElement(Icon, { name: info.icon, size: 17 }),
      React.createElement('span', { style: s.spineName }, info.name)
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'dokumentTresor', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('dl.title')),
    React.createElement('p', { style: s.intro }, t('dl.shelfIntro')),

    // Das Regal mit mehreren Etagen. Das aufgeschlagene Buch erscheint unter seiner Etage.
    ...regale.map(regal => React.createElement('div', { key: regal.key, style: s.etage },
      React.createElement('div', { style: s.shelfLabel }, regal.label),
      React.createElement('div', { style: s.shelfWrap },
        React.createElement('div', { style: s.shelf, role: 'group', 'aria-label': regal.label },
          ...regal.ids.map(id => spine(id))
        )
      ),
      regal.ids.includes(offen) ? renderBuch() : null
    )),

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
