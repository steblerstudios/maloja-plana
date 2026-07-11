# Maloja Plana

**Dein ruhiger Überblick über das Leben in der Schweiz — privat, offline, kostenlos.**

![Version](https://img.shields.io/badge/version-0.1.0--beta-7E9F8C)
![License](https://img.shields.io/badge/license-AGPL--3.0-C4A870)

Maloja Plana hilft Menschen in der Schweiz, zu verstehen, was ihnen zusteht und was als
Nächstes ansteht — von Steuern über Prämienverbilligung und Sozialhilfe bis zur Notfallkarte.
In fünf Sprachen, ohne Konto, ohne dass die Daten das Gerät verlassen.

**Live:** [malojaplana.ch](https://malojaplana.ch) · von Stebler Studios (Basel)

---

## Was es ausmacht

- **Lokal & privat** — alle Daten bleiben auf deinem Gerät (localStorage + IndexedDB). Kein
  Server, kein Konto, kein Tracking.
- **Offline** — funktioniert nach dem ersten Laden vollständig ohne Internet (PWA + Service Worker).
- **Mehrsprachig** — Deutsch, Französisch, Italienisch, Englisch, Rätoromanisch.
- **Kostenlos & quelloffen** — AGPL-3.0. Jede und jeder kann nachprüfen, was die App tut.
- **Orientierung, keine Beratung** — die Rechner und Übersichten sind Orientierungshilfen auf
  Basis öffentlicher Daten, keine Rechts- oder Finanzberatung.

---

## Die sieben Lebensbereiche

| Bereich | Inhalt |
|---------|--------|
| Persönliche Basis | Name, Geburt, AHV, Adresse, Haushalt |
| Wohnen & Leben | Wohnsituation, Miete, Vermieter |
| Finanzen & Geld | Einkommen, Bank, Budget |
| Versicherungen & Vorsorge | Krankenkasse, BVG, Säule 3a |
| Ausbildung & Arbeit | Qualifikationen, Arbeitgeber, Lebenslauf |
| Behörden & Rechtliches | Steuern, Vollmachten, Verfügungen |
| Notfall | Notfallkontakte, Gesundheit, Notfall-Karte |

Dazu Werkzeuge: Steuerrechner, Prämienverbilligungs-Check (IPV), Sozialhilfe-Orientierung,
Vorsorge- und Mindestlohn-Rechner, Dokumentenablage und eine offline scannbare Notfall-Karte.

---

## Technik

- **React 18 + Vite**, ohne Runtime-Abhängigkeiten (bewusst schlank).
- **100 % client-seitig** — localStorage + IndexedDB, kein Backend.
- **Strikte Content-Security-Policy** (`script-src 'self'`) — keine externen Requests, keine Cookies.
- **Lokal gehostete Schriften** (Lexend für den Text, Hanken Grotesk für die Wortmarke).
- **5 Sprachen** über ein eigenes, schlankes i18n-System.

---

## Entwicklung

Voraussetzungen: **Node.js 18+** und npm.

```bash
git clone https://github.com/steblerstudios/maloja-plana.git
cd maloja-plana
npm install
npm run dev      # Dev-Server (Vite)
npm run build    # Production-Build
npx vitest run   # Tests
```

---

## Status

**0.1.0-beta** — live und in ruhiger, aktiver Weiterentwicklung. Bewusst **ohne Backend, ohne
Konten, ohne Cloud** — und das bleibt so.

---

## Datenschutz & Haftung

Alle Daten bleiben lokal auf deinem Gerät. Sichere dein Gerät und exportiere regelmässig ein
Backup (ZIP-Export). Die Rechner sind Orientierungshilfen auf Basis öffentlicher Quellen;
verbindliche Auskünfte erteilt die zuständige Behörde oder Fachstelle. Details findest du in der
App unter **Datenschutz** und **Impressum**.

---

## Lizenz

**AGPL-3.0** — quelloffen. Siehe [LICENSE](LICENSE). Der Name „Maloja Plana", das Logo und die
visuelle Identität sind nicht durch die AGPL abgedeckt.

---

## Von

**Stebler Studios** — Basel. Kontakt über das Impressum auf
[malojaplana.ch](https://malojaplana.ch).
