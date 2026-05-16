# Threat Model

## Hauptbedrohungen

### Gerät wird gestohlen
Risiko:
- localStorage lesbar
- Browserdaten zugänglich

Minderung:
- AES-Verschlüsselung
- Session-Lock
- Kein Klartext-Export

---

### Shared Computer
Risiko:
- Offene Session
- Browser speichert Daten

Minderung:
- Auto-Lock
- Session Timeout
- Lokale Warnungen

---

### Browser Storage Limits
Risiko:
- IndexedDB Corruption
- Storage eviction

Minderung:
- Backup Export
- Storage Monitor
- Export Erinnerungen

