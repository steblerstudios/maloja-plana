// D14 (Seitenrundgang 26.10.2026): Das Kapitel Notfall erfasst Ärztinnen und Ärzte als Liste (`doctorsList`).
// Dossier, Notfall-QR, Rucksack, Kapitel-Satz und Vollständigkeit lasen nur das alte Feld `doctor` —
// ein Hausarzt aus der Liste fehlte überall ausser auf der gedruckten Portemonnaie-Karte.
import { describe, it, expect } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview, notfallQrAbschnitte, getLebensMappePreview } from '../dossierGenerator.js';
import { hausarztName, hausarztTelefon } from '../utils/hausarzt.js';
import { feldHatWert, kapitelVollstaendigkeit } from '../utils/vollstaendigkeit.js';
import { gegenstandReadiness } from '../data/gepaeck.js';
import { MirrorCards } from '../MirrorCards.jsx';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';

const tk = (k) => k;
const chapters = getChapters(tk);
const nurListe = { emergencyContact: 'Peter Muster', doctorsList: [{ name: 'Dr. med. Lisa Brunner', specialty: 'hausarzt', phone: '+41 44 242 80 00' }] };

describe('utils/hausarzt.js', () => {
  it('Liste geht vor, sonst das alte Feld', () => {
    expect(hausarztName(nurListe)).toBe('Dr. med. Lisa Brunner');
    expect(hausarztTelefon(nurListe)).toBe('+41 44 242 80 00');
    expect(hausarztName({ doctor: 'Dr. Alt', doctorPhone: '044 000 00 00' })).toBe('Dr. Alt');
    expect(hausarztTelefon({ doctor: 'Dr. Alt', doctorPhone: '044 000 00 00' })).toBe('044 000 00 00');
    expect(hausarztName({ doctor: 'Dr. Alt', doctorsList: nurListe.doctorsList })).toBe('Dr. med. Lisa Brunner');
  });
  it('nur Hausärzte; fehlende Fachrichtung gilt als Hausarzt (wie im DoctorManager)', () => {
    const n = { doctorsList: [{ name: 'Dr. Zahn', specialty: 'zahnarzt', phone: '1' }, { name: 'Dr. Haus', phone: '2' }] };
    expect(hausarztName(n)).toBe('Dr. Haus');
    expect(hausarztTelefon(n)).toBe('2');
    expect(hausarztName({ doctorsList: [{ name: 'Dr. Zahn', specialty: 'zahnarzt' }] })).toBe('');
  });
  it('Hausarzt in der Liste ohne Nummer: die alte Nummer gilt weiter', () => {
    expect(hausarztTelefon({ doctorsList: [{ name: 'H', specialty: 'hausarzt' }], doctorPhone: '044 111 11 11' })).toBe('044 111 11 11');
    expect(feldHatWert({ doctorsList: [{ name: 'H' }], doctorPhone: '044 111 11 11' }, 'doctorPhone')).toBe(true);
  });
  it('mehrere Hausärzte mit Nummer: Name bleibt bei der Nummer', () => {
    const n = { doctorsList: [{ name: 'Dr. A', phone: '1' }, { name: 'Dr. B' }, { name: 'Dr. C', phone: '3' }] };
    expect(hausarztName(n)).toBe('Dr. A, Dr. B, Dr. C');
    expect(hausarztTelefon(n)).toBe('Dr. A: 1, Dr. C: 3');
  });
  it('Fachrichtung ohne Rücksicht auf Gross-/Kleinschreibung (Fremd-Import)', () => {
    expect(hausarztName({ doctorsList: [{ name: 'Dr. H', specialty: 'Hausarzt' }], doctor: 'Dr. Alt' })).toBe('Dr. H');
  });
  it('leere Einträge und fehlende Daten', () => {
    expect(hausarztName({ doctorsList: [{ name: '  ', specialty: 'hausarzt' }] })).toBe('');
    expect(hausarztName(undefined)).toBe('');
    expect(hausarztTelefon({ doctorsList: [{ name: 'Dr. Haus' }] })).toBe('');
    expect(hausarztName({ doctorsList: 'kaputt', doctor: 'Dr. Alt' })).toBe('Dr. Alt');
  });
});

describe('Ausgänge lesen den Hausarzt aus der Liste', () => {
  const data = { basis: { firstName: 'Anna' }, notfall: nurListe };
  const zeile = (sections, feld) => sections.flatMap((s) => s.rows).find((r) => r.feld === feld);

  it('Notfall-Dossier und Notfall-QR', () => {
    const { sections } = getNotfallDossierPreview(data, chapters, tk);
    expect(zeile(sections, 'notfall.doctor')?.value).toBe('Dr. med. Lisa Brunner');
    expect(zeile(sections, 'notfall.doctorPhone')?.value).toBe('+41 44 242 80 00');
    const qr = notfallQrAbschnitte(sections);
    expect(zeile(qr, 'notfall.doctor')?.value).toBe('Dr. med. Lisa Brunner');
  });

  it('nur Fachärzte in der Liste: das alte Feld erscheint im Dossier', () => {
    const alt = { notfall: { doctor: 'Dr. Alt', doctorPhone: '044 000 00 00', doctorsList: [{ name: 'Dr. Zahn', specialty: 'zahnarzt', phone: '9' }] } };
    const { sections } = getNotfallDossierPreview(alt, chapters, tk);
    expect(zeile(sections, 'notfall.doctor')?.value).toBe('Dr. Alt');
    expect(zeile(sections, 'notfall.doctorPhone')?.value).toBe('044 000 00 00');
  });

  it('Lebensmappe', () => {
    const { sections } = getLebensMappePreview(data, chapters, tk, []);
    const werte = sections.flatMap((s) => s.rows || []).map((r) => r.value);
    expect(werte).toContain('Dr. med. Lisa Brunner');
  });

  it('Rucksack «Gesundheit» zählt den Hausarzt', () => {
    const ohne = gegenstandReadiness('gesundheit', { notfall: {} }).done;
    expect(gegenstandReadiness('gesundheit', data).done).toBe(ohne + 1);
  });

  it('Vollständigkeit: Hausarzt und Telefon zählen (vorher suchte sie `doctorList`)', () => {
    expect(feldHatWert(nurListe, 'doctor')).toBe(true);
    expect(feldHatWert(nurListe, 'doctorPhone')).toBe(true);
    expect(feldHatWert({ doctorsList: [] }, 'doctor')).toBe(false);
    const notfall = chapters.find((c) => c.key === 'notfall');
    const mit = kapitelVollstaendigkeit(notfall, nurListe).pct;
    const ohne = kapitelVollstaendigkeit(notfall, { emergencyContact: 'Peter Muster' }).pct;
    expect(mit).toBeGreaterThan(ohne);
  });

  it('Satz oben im Kapitel nennt den Hausarzt', () => {
    const t = createT({ de }, 'de');
    const html = renderToStaticMarkup(React.createElement(MirrorCards, { chapterKey: 'notfall', data: nurListe, allData: {}, palette: {}, t }));
    expect(html).toContain('Ein Hausarzt ist eingetragen');
  });
});
