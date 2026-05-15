# Ordnung & Ruhe

**Privacy-first Swiss Life Organizer — 100% lokal, sicher, strukturiert**

![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)
![License](https://img.shields.io/badge/license-AGPL--3.0-green)

---

## 🎯 Vision

Ordnung & Ruhe ist ein digitaler Lebensordner für Schweizerinnen und Schweizer. Du erfasst deine wichtigsten Informationen in 7 Bereichen, und die App speichert alles lokal — ohne Cloud, ohne Server, ohne Datenverkauf.

**Kern:**
- ✅ 100% lokal (Deine Daten gehören dir)
- ✅ Privat (kein Tracking, keine Server)
- ✅ Strukturiert (7 Kapitel, alle CH-relevanten Felder)
- ✅ Druckbar (PDF-Export, einfach ablegen)
- ✅ Offen (Open Source, später auch API)

---

## 📂 Struktur

```
ordnung-ruhe/
├── public/                   ← HTML Entry Point
│   └── index.html
├── src/
│   ├── components/           ← UI Components (SoftCard, Field, etc.)
│   ├── pages/                ← Ganze Screens (Landing, App, etc.)
│   ├── api/                  ← API Stubs (Compendium, ICD, etc.)
│   ├── storage/              ← localStorage + IndexedDB Handler
│   ├── hooks/                ← Custom React Hooks
│   ├── utils/                ← Helper (QR, PDF, Hash, etc.)
│   ├── config/               ← Konstanten, Chapters, API-Endpoints
│   └── main.jsx              ← Entry Point (React)
├── docs/
│   ├── ARCHITECTURE.md       ← Wie alles zusammenhängt
│   ├── API-ROADMAP.md        ← API-Pläne
│   └── SCHEMA.md             ← Datenstruktur
├── README.md                 ← Diese Datei
├── CONTRIBUTING.md           ← Für Community (später)
├── LICENSE                   ← AGPL-3.0
├── package.json
├── vite.config.js
└── .env.example
```

---

## 🚀 Quick Start

### Voraussetzungen
- **Node.js 18+**
- **npm 9+**
- Git

### Installation

```bash
# 1. Repo klonen (privat)
git clone https://github.com/YOUR-USERNAME/ordnung-ruhe.git
cd ordnung-ruhe

# 2. Dependencies installieren
npm install

# 3. Dev-Server starten
npm run dev
```

Der Server startet auf **http://localhost:5173**

---

## 📝 7 Kapitel

| Kapitel | Icon | Beschreibung |
|---------|------|-------------|
| **Persönliche Basis** | ◎ | Name, Geburt, AHV, Adresse |
| **Wohnen & Leben** | ⌂ | Haushalt, Miete, Hausschlüssel |
| **Finanzen & Geld** | ◇ | Banken, Budget, Einnahmen/Ausgaben |
| **Versicherungen** | ◰ | KK, BVG, Säule 3a/3b |
| **Ausbildung & Arbeit** | ✦ | EFZ, Diplom, Arbeitgeber |
| **Behörden & Rechtliches** | ◉ | Steuern, Testament, Patientenverfügung |
| **Notfall** | ⚠ | Notfallkontakte, Gesundheit, Notfall-QR |

---

## 💾 Speicherung

**Lokal im Browser:**
- `localStorage` — Texte, Einstellungen, Passwort-Hash
- `IndexedDB` — Dokumente, Blobs, Dateien

**Wird NICHT übertragen:**
- Kein Server, keine Cloud
- Kein Tracking
- Keine Datenverkehr

---

## 🔐 Sicherheit

- **SHA-256 Passwort-Hash** (lokal, keine Übertragung)
- **Base64 QR-Verschlüsselung** (für Notfall)
- **Keine Cookies, kein Tracking**

---

## 🎨 Design

**Fonts:**
- `Cormorant Garamond` — Titel (elegant, Swiss)
- `DM Sans` — Body (clean, modern)

**Farben (Dark & Light):**
- Dark: `#0F0E0C` (bg) → `#EDE8E0` (text)
- Light: `#F5F2EE` (bg) → `#1C1A17` (text)

**Icons:**
- Nur Unicode (◎ ⌂ ◇ ◰ ✦ ◉ ⚠ ☀ ◐)
- Keine Emojis, keine Icon-Fonts

---

## 🔄 Budget-Sync

Einnahmen/Ausgaben werden **automatisch** aus den Feldern synchronisiert:

- `finanzen.monthlyIncome` → Income
- `wohnen.rentAmount` → Expense (Wohnen)
- `wohnen.utilities` → Expense (Wohnen)
- `versicherungen.healthPremium` → Expense (Versicherungen)

**Live-Berechnung:** Einkommen - Ausgaben = Restbetrag

---

## 📲 Export

- **PDF** — Alle Daten oder einzelne Kapitel (jsPDF via CDN)
- **XLSX** — Budget-History (SheetJS, später)
- **JSON** — Backup/Restore

---

## 🛣️ Roadmap (v0.1 → v1.0)

### v0.1-alpha (JETZT)
- [x] 7 Kapitel + Felder
- [x] localStorage + IndexedDB
- [x] PDF-Export
- [x] Dark/Light Mode
- [ ] Notfall-QR (WIP)
- [ ] Dokumenten-Upload (WIP)

### v0.2-beta
- [ ] API-Stubs (Compendium, ICD, etc.)
- [ ] Budget-Diagramme
- [ ] Lebenslauf-Generator
- [ ] Kontakt-Import (Handy)

### v0.5-rc
- [ ] eBill-Integration
- [ ] Steuerkanton-APIs
- [ ] BlueBudget-Sync
- [ ] Infomaniak Secure Safe

### v1.0-stable
- [ ] Vollständige API-Integrationen
- [ ] Mobile App (PWA)
- [ ] B2B Versionen (Behörden, Banken)
- [ ] Open Source Release

---

## 📚 Dokumentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Code-Struktur
- **[API-ROADMAP.md](docs/API-ROADMAP.md)** — API-Pläne
- **[SCHEMA.md](docs/SCHEMA.md)** — Datenstruktur

---

## 🤝 Contributing

Später! Im Moment privat. Nach Open Source Release siehe `CONTRIBUTING.md`

---

## 📄 Lizenz

**AGPL-3.0** — Später Open Source!

---

## 👤 Author

**Sophie Stebler**  
Email: sophie@stebler.ch  
Location: Switzerland

---

## ⚖️ Disclaimer

- Keine Garantie für Datensicherheit
- Keine Haftung bei Datenverlust
- Sichern Sie Ihre Daten regelmässig (PDF-Export)

---

**Made with ❤️ in Switzerland**
