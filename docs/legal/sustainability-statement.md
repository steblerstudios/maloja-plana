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
| **Offline-fähig (PWA)** | Nach dem ersten Laden auch ohne Netzwerk nutzbar — in der Regel in den Bereichen, die schon einmal geöffnet wurden (der Service Worker legt die Teile der App beim ersten Öffnen ab) |

### Hosting

**Infomaniak (Schweiz)**  
Maloja Plana wird über die Domain malojaplana.ch bei Infomaniak Network SA (Genf, Schweiz) gehostet:
- Rechenzentren in der Schweiz, nach Angaben des Anbieters in Genf
- ausschliesslich zertifizierter erneuerbarer Strom (Wasserkraft und weitere lokale erneuerbare Quellen)
- ISO 14001 zertifiziert (Umweltmanagement), nach Angaben des Anbieters seit 2015
- CO₂-Kompensation über Projekte der Stiftung myclimate
- Die Eingaben in der App bleiben lokal auf dem Gerät der Person (localStorage/IndexedDB); der Hoster liefert nur die statischen Dateien der Website aus (`docs/legal/datenschutzerklaerung-ndsg.md` §5–6)

*Quellen (Angaben von Infomaniak, per `curl` gelesen am 17.09.2026):*
- <https://www.infomaniak.com/en/about> — «its own data centers in Switzerland»
- <https://www.infomaniak.com/en/hosting/datacenter-housing> — Rechenzentren in Genf
- <https://www.infomaniak.com/en/ecology> — erneuerbarer Strom (Wasserkraft und weitere lokale Quellen), ISO 14001 seit 2015
- <https://www.infomaniak.com/en/ecology/certificates-rewards> — Kompensation über myclimate

*Korrigiert 17.09.2026 (K47): «Winterthur» war nicht belegt und ist entfernt; «100 % Schweizer
Wasserkraft» stand enger als die Quelle, die auch weitere lokale erneuerbare Quellen nennt.
Korrigiert 17.09.2026 (K57): «Daten bleiben in der Schweiz (nDSG-konform)» war ohne Beleg; eine
Konformitätsaussage ist eine Rechtsbeurteilung und steht hier nicht mehr.*

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
