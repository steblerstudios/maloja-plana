# ADR-009 — Storage Strategy: Local-First with Optional Server Sync

| Meta | Value |
|------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | Sophie Stebler |
| **Relates to** | ADR-001 (Offline-First), ADR-002 (No Accounts), GAP-01, GAP-02 |

---

## Context

The application needs to store sensitive personal data (documents, budget, health records, audit trails). Current architecture uses:

- `localStorage` for chapter data (`or5_<chapter>`, `or5_settings`)
- `IndexedDB` for audit logs (`maloja-plana-audit` v1→v2), documents (`ordnung-ruhe-documents`), backups (`ordnung-ruhe-backups`), workflows (`maloja-plana-workflows`)

Future requirements include multi-device access, family account sharing, and document vault synchronization. The decision impacts every module in the system.

---

## Decision

**Hybrid Local-First Architecture** with three tiers:

### Tier 1: Local-Only (Default, MVP)
- All data stored in IndexedDB + localStorage
- Zero server dependency
- Full functionality offline
- Encryption at rest via Web Crypto API (AES-256-GCM)

### Tier 2: Encrypted Sync (Optional, Post-MVP)
- User opts in explicitly (Approval Gate)
- Zero-Knowledge encryption: server never sees plaintext
- Client encrypts before upload using PBKDF2-derived key from user passphrase
- Conflict resolution: Last-Write-Wins with manual merge for documents
- Sync queue with retry on reconnect

### Tier 3: Shared Access (Phase 3+)
- Family accounts, medical staff access
- Key sharing via asymmetric encryption (ECDH key exchange)
- Per-document access control lists
- Re-keying on role transitions (child → adult)

---

## Technical Implementation

### Encryption Stack (Zero Dependencies)

```
User Passphrase
  → PBKDF2 (100,000 iterations, SHA-256)
    → Master Key (256-bit)
      → Per-Document Key (AES-256-GCM, random IV per operation)
        → Encrypted Blob + IV + Auth Tag → IndexedDB
```

### IndexedDB Schema (v2)

```javascript
// maloja-plana-audit (v2)
{
  stores: {
    events: { keyPath: 'id', indexes: ['timestamp', 'type', 'actor', 'module'] },
    snapshots: { keyPath: 'id', indexes: ['timestamp', 'hash'] },
    evidence: { keyPath: 'id', indexes: ['chainId', 'sequence'] }
  }
}

// ordnung-ruhe-documents (v1)
{
  stores: {
    documents: { keyPath: 'id', indexes: ['type', 'created', 'encrypted'] },
    metadata: { keyPath: 'docId', indexes: ['tags', 'category'] }
  }
}

// maloja-plana-workflows (v1)
{
  stores: {
    definitions: { keyPath: 'id' },
    instances: { keyPath: 'id', indexes: ['status', 'started'] },
    steps: { keyPath: 'id', indexes: ['workflowId', 'status'] }
  }
}
```

### Storage Budget

| Store | Estimated Size | Limit |
|-------|---------------|-------|
| localStorage (chapters) | < 2 MB | 5 MB browser limit |
| IndexedDB (audit) | < 50 MB (with retention) | No hard limit |
| IndexedDB (documents) | < 500 MB | Device storage |
| IndexedDB (workflows) | < 10 MB | No hard limit |

### Migration Path (v1 → v2)

1. Detect version on app start
2. Create new stores alongside old
3. Copy + transform data in background
4. Swap references atomically
5. Delete old stores after verification
6. Log migration evidence to audit trail

---

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Pure localStorage** | Simple | 5MB limit, no binary, no indexing | Rejected for documents |
| **SQLite (via WASM)** | SQL queries, mature | 500KB+ WASM binary, exceeds build budget | Rejected |
| **PouchDB/CouchDB** | Sync built-in | 45KB+ dependency, server dependency | Rejected (zero-dep constraint) |
| **IndexedDB + Web Crypto** | Zero deps, unlimited storage, encryption | More code to write | **Selected** |
| **OPFS (Origin Private File System)** | Fast binary storage | Limited browser support (2024+) | Future consideration |

---

## Consequences

### Positive
- Full offline functionality from day one
- No server costs for MVP
- User data never leaves device by default
- Encryption protects even if device is compromised
- Migration path preserves all data

### Negative
- More complex sync logic when Tier 2 is implemented
- No automatic backup without user action (Tier 1)
- IndexedDB API is verbose (mitigated by thin wrapper)
- Web Crypto API requires async patterns throughout

### Risks
- IndexedDB storage eviction under storage pressure (mitigated: request `navigator.storage.persist()`)
- Browser incompatibilities in crypto (mitigated: feature detection + fallback to unencrypted with warning)

---

## Compliance

| Standard | Requirement | How Met |
|----------|------------|---------|
| ISO 27001 A.9 | Access control | Encryption at rest, per-document keys |
| ISO 27001 A.12 | Operations security | Audit trail for all storage operations |
| DSGVO Art. 32 | Security of processing | AES-256-GCM, PBKDF2 key derivation |
| DSG (Schweiz) | Data protection | Local-first, no server transfer by default |
| EU AI Act Art. 14 | Human oversight | All sync operations require Approval Gate |

---

## Action Items

1. Implement `CryptoService` using Web Crypto API
2. Create IndexedDB v2 migration script
3. Add `navigator.storage.persist()` request on first use
4. Design Sync Queue interface (for Tier 2 preparation)
5. Document key management in user-facing help
