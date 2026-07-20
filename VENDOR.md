# Vendored libraries

These libraries are checked into the repo directly (not installed from npm), in
keeping with the local-first / no-dependency-bloat stance. That means **nothing
updates them automatically and no tooling scans them for advisories** — this file
is the manual pin. Review it before each release.

For each entry: the SHA-256 is the integrity pin. If a file changes, its hash must
change here in the same commit, with a note on why. Recompute with:

```
shasum -a 256 public/vendor/jsQR.js src/vendor/qrcodejs.js
```

| File | Library | Version | License | Source |
|------|---------|---------|---------|--------|
| `src/vendor/qrcodejs.js` | QRCode.js | **1.0.0** | MIT | https://github.com/davidshimjs/qrcodejs |
| `public/vendor/jsQR.js` | jsQR | **unverified** (no version banner in file) | Apache-2.0 | https://github.com/cozmo/jsQR |

## SHA-256 integrity pins

```
bc40c8a15196236b2314db0856f72ca0b49980cd5413b8c852a7349f5fee0859  public/vendor/jsQR.js
e36ad1026851e6e8c1ace31ef7e35a690248c92490a3e5b5403269e0c9ac8288  src/vendor/qrcodejs.js
```

## Notes to check before the next release

- **jsPDF removed 2026-07-20.** `public/vendor/jspdf.umd.min.js` (2.5.1, 364 KB) was
  vendored but never imported by any code path, and still shipped in every build. Since
  the 2.5.x range carries a ReDoS advisory, that was attack surface without a use. Deleted
  rather than pinned. If PDF export is ever built, start from the 3.x line.
- **QRCode.js 1.0.0** (davidshimjs) is effectively unmaintained. It is used only to
  render the user's own data to a QR image locally; no untrusted input reaches it.
- **jsQR** has no version banner. Pinned by SHA-256 only. When it is next refreshed,
  fetch a tagged release and record the version number here.
