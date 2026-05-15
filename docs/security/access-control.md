# Access Control

## Current Model (Phase 5)

Maloja Plana has no authentication system. All data is stored locally in the user's browser. Access is controlled by physical access to the device and browser.

### Who can read data
- Anyone with physical access to the device
- Anyone with access to the browser's developer tools on that device
- No remote access is possible (no backend, no cloud sync)

### Who can modify data
- The user, through the app UI
- Anyone with physical access to the device and browser console
- The app's auto-save interval (writes every 5 seconds)

### Who can export data
- The user, through the export/backup UI
- Encrypted export requires a passphrase known only to the user

### Who can delete data
- The user, by clearing browser data
- The browser, through automatic storage cleanup (e.g., Safari ITP)
- No remote deletion is possible

## Planned Enhancements

### Phase 9: Per-profile PIN
- Optional numeric PIN per household profile
- Stored as hash, not plaintext
- Protects against casual access on shared devices
- Not a security boundary — determined users can bypass via developer tools

### Future: Device-level protection
- Defer to OS/browser-level biometrics (not implemented by app)
- Users are advised to use device screen lock

## Vercel Deployment Access

- GitHub repository: private (steblerstudios only)
- Vercel deployment: public URL for alpha testing
- No server-side access control on Vercel free tier
- Alpha testers access via shared URL (no authentication)
- Production deployment will require access control evaluation

## Security Headers

Set via `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
