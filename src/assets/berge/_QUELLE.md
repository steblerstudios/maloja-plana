# Dashboard-Landschaft · Herkunft

`landschaft.webp` — 1482 × 1062 px, WebP Qualität 0.88, 87 KB.

**Kette:** eigene Fotos vom Malojapass (Stebler Studios) → Illustration von Codex →
Codex-Vektorisierung `maloja plana/maloja-landschaft-detail.svg` (48 Farbflächen, 12,7 MB,
sha256 `f57b40149607b58e…`, liegt ausserhalb des Repos) → in Chrome auf ein Canvas in
Originalgrösse gezeichnet → `canvas.toBlob('image/webp', 0.88)`.

**Warum Raster und nicht die SVG:** die Vektor-Fassung lässt sich nicht zugleich detailliert
und leicht machen. Gemessen am 25.09.2026 (gzip): Original 2,9 MB · RDP 1 px 821 KB ·
2 px 332 KB · 5 px 62 KB — und bei 5 px fehlten Tannenlichter, Felsstreifen und Fahrbahnränder
sichtbar (1:1-Vergleich). Das WebP hält alle Details bei 87 KB. Umfärben für einen Dunkelmodus
braucht es nicht: das Bild bleibt auch im Dunkelmodus hell (Entscheid Stebler Studios, 25.09.2026).

**Neu erzeugen:** Quelle in Chrome laden, `drawImage` auf ein 1482 × 1062-Canvas, als WebP 0.88
speichern. Stationen und Wegstücke in `components/BergLandschaft.jsx` sind in Bildkoordinaten
(1100 × 788) gemessen — bei einer anderen Vorlage neu messen.
