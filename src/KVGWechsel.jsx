import React, { useState } from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { addTodo } from './utils/merkliste.js';
import { werktagAmOderDavor } from './utils/fristen.js';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles, useAblaufStand, ablaufTextFarbe } from './AblaufSchale.jsx';
import { hinweisZeichen, erledigtZeichen } from './IconSystem.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { ablaufStandKey } from './utils/ablaufStand.js';
import { zusatzSchritte, zusatzFussNotizen } from './ZusatzWechsel.jsx';

// KVG-Wechsel — der erste geführte Ablauf ("Faden"), jetzt auf der wiederverwendbaren
// Ablauf-Schale. Verkettet die vorhandenen Bausteine zu einem ruhigen Weg: Vergleich →
// neue Kasse (zwei Wege, anklickbar) → Kündigung → Frist sichern.
//
// F7-A5 (Entscheid Stebler Studios 27.10.2026): «Krankenkasse wechseln» und «Zusatzversicherung
// wechseln» sind EIN Ablauf mit einer Weiche in Schritt 1 — Grund- oder Zusatzversicherung. Beide
// Wege behalten ihre vier Schritte, Texte, Quellen und Fristen unverändert (Zusatz: ZusatzWechsel.jsx).
// Ohne Wahl gilt die Grundversicherung, wie bisher auf dieser Seite. `#/zusatzwechsel` führt hierher
// und stellt die Weiche auf «Zusatz» (Sprungmarke `mp-kvg-zusatz`, utils/hashRouter.js).

// Die Wahl bleibt wie der Stand (utils/ablaufStand.js): eigener or5_-Schlüssel, im Beispiel nur für jetzt.
const WEG_KEY = ablaufStandKey('kvgwechsel_weg');
const wegLaden = (vorlaeufig) => {
  if (vorlaeufig) return null;
  try { const w = localStorage.getItem(WEG_KEY); return w === 'grund' || w === 'zusatz' ? w : null; } catch { return null; }
};
const wegSichern = (w, vorlaeufig) => {
  if (vorlaeufig) return;
  try { localStorage.setItem(WEG_KEY, w); } catch { /* Speicher voll — die Wahl gilt dann nur jetzt */ }
};
// Zum Ansteuern von aussen (Umleitung, Querverweise): die Sprungmarke des Knopfs «Zusatzversicherung».
export const ZUSATZ_ANKER = 'mp-kvg-zusatz';

// Nächster Kündigungstermin nach der Prämienmitteilung: 30. November (dieses Jahr, sonst nächstes),
// KVG Art. 7 Abs. 2. Nicht die ordentliche Kündigung nach Abs. 1 (Ende Semester, Eingang bis 31. März
// bzw. 30. September) — die stand hier bis 24.10.2026 fälschlich (Fachprüfung swiss-precision).
export const nextNov30 = (heute = new Date()) => {
  const now = new Date(heute);
  now.setHours(0, 0, 0, 0); // Datum, nicht Uhrzeit vergleichen → der 30.11. selbst zählt noch
  const year = now.getFullYear();
  const nov30 = new Date(year, 10, 30);
  const y = now <= nov30 ? year : year + 1;
  // Samstag/Sonntag → Werktag davor (BAG, priminfo FAQ). Früher schadet nie.
  return werktagAmOderDavor(`${y}-11-30`);
};

// «TT.MM.JJJJ» aus dem ISO-Datum der Erinnerung — der Knopf zeigt, was im Kalender landet.
export const fristKnopfDatum = (iso) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;

export const KVGWechsel = ({ palette, t, data, onNavigate, startWeg = null }) => {
  const vorlaeufig = useVorlaeufig();
  const [gewaehlt, setGewaehlt] = useState(() => startWeg || wegLaden(vorlaeufig));
  const weg = gewaehlt || 'grund';
  const [stand, setStand] = useAblaufStand('kvgwechsel', 4);
  // Eine Wahl führt an den Anfang des gewählten Wegs (Schritt 1 gehört beiden).
  const waehle = (w) => { setGewaehlt(w); wegSichern(w, vorlaeufig); if (stand.schritt !== 0 || stand.fertig) setStand({ schritt: 0, fertig: false }); };
  const textFarbe = ablaufTextFarbe(palette, 'kvgwechsel') || palette.sageDeep || palette.mid;
  const [chosenPath, setChosenPath] = useState(null); // null | '3a' | '3b'
  const [wunschKasse, setWunschKasse] = useState(data?.versicherungen?.targetInsurer || ''); // Ziel-Kasse, vorbelegt aus dem Vergleich

  const currentInsurer = data?.versicherungen?.kkInsurer || '';
  const deadline = nextNov30();
  const deadlineYear = deadline.slice(0, 4);

  // Geteilte Schalen-Styles + KVG-eigene Extras (Wege-Karten, Wunsch-Kasse-Input).
  const s = {
    ...ablaufStyles(palette),
    pathWrap: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    reassure: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.xs + 'px' },
    chosenBadge: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sandDeep, marginTop: '6px' },
    inputLabel: { display: 'block', fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
    input: { display: 'block', width: '100%', maxWidth: '280px', marginTop: '4px', padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' },
    // „Kurz innehalten"-Prüfliste (Anti-Dark-Pattern: nicht pushen, sondern prüfen).
    checkList: { margin: space.xs + 'px 0 0', paddingLeft: '1.15em', display: 'flex', flexDirection: 'column', gap: '6px' },
    checkItem: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal },
  };

  // Ruhige Karte für einen der beiden Wege — anklickbar, hebt den gewählten hervor.
  const pathCard = (id, title, body, footer) => {
    const isChosen = chosenPath === id;
    const isDimmed = chosenPath && !isChosen;
    return React.createElement('button', {
      type: 'button',
      onClick: () => setChosenPath(id),
      'aria-pressed': isChosen,
      style: {
        flex: '1 1 240px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: space.md + 'px',
        background: isChosen ? palette.surface : palette.up,
        borderRadius: radius.sm,
        border: '1.5px solid ' + (isChosen ? palette.sand : palette.border),
        opacity: isDimmed ? 0.55 : 1,
        transition: 'opacity 120ms, border-color 120ms',
      },
    },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, title),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, body),
      footer,
      isChosen && React.createElement('div', { style: s.chosenBadge }, hinweisZeichen('check'), t('kvgWechsel.chosen'))
    );
  };

  const target = wunschKasse.trim();

  // Weiche in Schritt 1 (F7-A5): zwei ruhige Wahlknöpfe wie beim Umzug («Art des Umzugs»).
  const wahlKnopf = (w, label, extra = {}) => {
    const an = gewaehlt === w;
    return React.createElement('button', {
      type: 'button', key: w, onClick: () => waehle(w), 'aria-pressed': an, ...extra,
      style: {
        textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', padding: '12px', minHeight: '48px', fontSize: text.sm, color: palette.text,
        background: an ? textFarbe + '24' : palette.surface, borderRadius: radius.lg + 'px', border: '1px solid ' + (an ? textFarbe : palette.border),
      },
    }, erledigtZeichen(an, label));
  };
  const weiche = [
    React.createElement('p', { key: 'frage', id: 'mp-kvg-weiche', style: { ...s.stepText, marginBottom: '6px' } }, t('kvgWechsel.weicheFrage')),
    React.createElement('div', { key: 'wahl', role: 'group', 'aria-labelledby': 'mp-kvg-weiche', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm + 'px', margin: space.sm + 'px 0 ' + space.md + 'px' } },
      wahlKnopf('grund', t('kvgWechsel.weicheGrund')),
      // Sprungmarke: `#/zusatzwechsel` wählt diesen Knopf (springeZuAnker, data-anker-wahl).
      wahlKnopf('zusatz', t('kvgWechsel.weicheZusatz'), { id: ZUSATZ_ANKER, 'data-anker-wahl': '' })),
  ];

  const grund = [
    // ── Schritt 1 — Lohnt sich's? ──
    { titel: t('kvgWechsel.step1Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText },
        currentInsurer
          ? t('kvgWechsel.step1TextKnown', { insurer: currentInsurer })
          : t('kvgWechsel.step1Text')),
      onNavigate && React.createElement(AblaufLink, { key: 'b', palette, label: t('kvgWechsel.step1Link'), onClick: () => onNavigate('praemien') }),
      // Kurz innehalten — ein tieferer Preis allein ist noch kein Wechselgrund.
      React.createElement('p', { key: 'c', style: s.reassure }, t('kvgWechsel.checkIntro')),
      React.createElement('ul', { key: 'd', style: s.checkList },
        React.createElement('li', { style: s.checkItem }, t('kvgWechsel.checkPoint1')),
        React.createElement('li', { style: s.checkItem }, t('kvgWechsel.checkPoint2')),
        React.createElement('li', { style: s.checkItem }, t('kvgWechsel.checkPoint3'))
      ),
      // Seit F7-A5 derselbe Ablauf: der Verweis stellt die Weiche auf «Zusatz».
      React.createElement(AblaufLink, { key: 'e', palette, label: t('kvgWechsel.checkZusatzLink'), onClick: () => waehle('zusatz') }),
    ] },

    // ── Schritt 2 — Neue Kasse, zwei ruhige Wege (anklickbar) ──
    { titel: t('kvgWechsel.step2Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText }, t('kvgWechsel.step2Intro')),
      React.createElement('label', { key: 'b', style: s.inputLabel },
        t('kvgWechsel.wunschKasseLabel'),
        React.createElement('input', {
          type: 'text', value: wunschKasse,
          onChange: (e) => setWunschKasse(e.target.value),
          placeholder: t('kvgWechsel.wunschKassePlaceholder'),
          style: s.input,
        })
      ),
      React.createElement('div', { key: 'c', style: s.pathWrap },
        pathCard('3a', t('kvgWechsel.path3aTitle'), t('kvgWechsel.path3aText'),
          React.createElement('div', { style: s.warn }, hinweisZeichen('warning'), t('kvgWechsel.path3aWarn'))),
        pathCard('3b', t('kvgWechsel.path3bTitle'), t('kvgWechsel.path3bText'),
          React.createElement(React.Fragment, null,
            React.createElement('div', { style: s.reassure }, hinweisZeichen('check'), t('kvgWechsel.path3bReassure')),
            React.createElement('div', { style: s.warn }, hinweisZeichen('warning'), t('kvgWechsel.path3bCaveat'))
          ))
      ),
      React.createElement('div', { key: 'd', style: s.note }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvgWechsel.uptakeReassure'))),
      React.createElement('div', { key: 'e', style: s.note }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kvgWechsel.debtNote'))),
    ] },

    // ── Schritt 3 — Kündigung (passt sich dem gewählten Weg an) ──
    { titel: t('kvgWechsel.step3Title'), inhalt: [
      chosenPath === '3b'
        ? React.createElement('p', { key: 'a', style: s.stepText }, t('kvgWechsel.step3Note3b'))
        : React.createElement('p', { key: 'a', style: s.stepText }, t('kvgWechsel.step3Text')),
      onNavigate && React.createElement(AblaufLink, { key: 'b', palette, label: t('kvgWechsel.step3Link'), onClick: () => onNavigate('briefe') }),
    ] },

    // ── Schritt 4 — Frist sichern ──
    { titel: t('kvgWechsel.step4Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText }, t('kvgWechsel.step4Text', { year: deadlineYear })),
      React.createElement(FristButton, {
        key: 'b', palette, t,
        art: 'frist', buttonLabel: t('kvgWechsel.step4Button', { date: fristKnopfDatum(deadline) }),
        doneLabel: t('kvgWechsel.step4Done'),
        calendarLabel: t('kvgWechsel.step4CalendarLink'),
        onNavigate,
        reminder: {
          title: target ? t('kvgWechsel.reminderTitleTo', { insurer: target }) : t('kvgWechsel.reminderTitle'),
          dueDate: deadline,
          category: 'insurance',
          recurrence: 'yearly',
          notes: t('kvgWechsel.reminderNotes'),
        },
        // Rücklink zum Vergleich in die Merkliste — damit man die Wunsch-Kasse wiederfindet.
        onSaved: () => addTodo({ text: t('kvgWechsel.todoText'), link: 'praemien' }),
      }),
      // Ablegen geht oben in der Ablage — `unterlagen` springt zu «Meine Unterlagen» ganz unten.
      onNavigate && React.createElement(AblaufLink, { key: 'c', palette, label: t('kvgWechsel.policeLink'), onClick: () => onNavigate('tresor') }),
      // Seit F7-A5 derselbe Ablauf: zurück an den Anfang, Weiche auf «Zusatz».
      React.createElement(AblaufLink, { key: 'd', palette, label: t('zusatzWechsel.title'), onClick: () => waehle('zusatz') }),
    ] },
  ];
  const schritte = weg === 'zusatz' ? zusatzSchritte({ palette, t, data, onNavigate }) : grund;

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'kvgwechsel', icon: 'insurance', stand, setStand,
    title: t('kvgWechsel.title'),
    intro: t(weg === 'zusatz' ? 'zusatzWechsel.intro' : 'kvgWechsel.intro'),
  },
    ...schritte.map((x, i) => React.createElement(AblaufStep, { key: weg + i, palette, title: x.titel }, ...(i === 0 ? weiche : []), ...x.inhalt)),

    // ── Fuss — je Weg wie bisher: Grundversicherung mit Quelle KVG Art. 7, Sonderkündigungsrecht,
    // keine-Beratung und lokal-Hinweis; Zusatzversicherung zitiert ihre Quellen im Schritt selbst.
    weg === 'zusatz'
      ? React.createElement(AblaufFooter, { palette, notes: zusatzFussNotizen(t) })
      : React.createElement(AblaufFooter, { palette, t, quelle: t('kvgWechsel.quelle'), notes: [t('kvgWechsel.specialRight'), t('alpha.noAdviceHint'), t('trust.localOnly')] })
  );
};

// Die alte Seite «Zusatzversicherung wechseln» — derselbe Ablauf, Weiche auf «Zusatz».
export const ZusatzWechsel = (props) => React.createElement(KVGWechsel, { ...props, startWeg: 'zusatz' });

export default KVGWechsel;
