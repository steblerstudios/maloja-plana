# Nachhaltigkeits-Statement — Maloja Plana

> Stand: Juni 2026

## Architektur als Klimaschutz

Maloja Plana ist so gebaut, dass sie möglichst wenig Energie verbraucht:

### Was wir bereits tun

| Massnahme | Effekt |
|---|---|
| **Kein Backend / kein Server** | Null laufende Serverprozesse, kein Dauerbetrieb |
| **Statische Auslieferung (CDN)** | Seite wird einmal gebaut, dann nur noch Dateien ausgeliefert |
| **Local-first Architektur** | Daten bleiben lokal — keine Datenbank-Abfragen, keine API-Calls |
| **Keine Tracker / Analytics** | Kein Google Analytics, kein Pixel, kein Hotjar — null externe Requests |
| **Minimale Dependencies** | Kleine Bundle-Grösse, weniger Code = weniger Übertragung |
| **Offline-fähig (PWA)** | Nach dem ersten Laden funktioniert alles ohne Netzwerk |

### Hosting

**Infomaniak (Schweiz)**  
Maloja Plana wird über die Domain malojaplana.ch bei Infomaniak Network SA (Genf, Schweiz) gehostet:
- Rechenzentren in der Schweiz (Genf, Winterthur)
- 100% erneuerbare Energie (Schweizer Wasserkraft)
- ISO 14001 zertifiziert (Umweltmanagement)
- CO₂-Kompensation über myclimate
- Daten bleiben in der Schweiz (nDSG-konform)

### Digitale Suffizienz

Wir folgen dem Prinzip der **digitalen Suffizienz**: Nur bauen, was gebraucht wird. Keine unnötigen Features, keine aufgeblähten Frameworks, keine Hintergrund-Prozesse. Jedes Kilobyte wird hinterfragt.

### Zahlen

- Bundle-Grösse: ~350 KB (komprimiert)
- Externe Requests beim Laden: 0 (nach Service Worker Cache)
- Server-Prozesse im Dauerbetrieb: 0
- Datenbank-Queries pro Nutzung: 0

## Nächste Schritte

- [ ] Custom Domain über Infomaniak (Schweizer Hosting)
- [ ] Website Carbon Badge einbinden (websitecarbon.com)
- [ ] Lighthouse Performance Score > 95 halten
- [ ] Green Web Foundation Verifizierung
