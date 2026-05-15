// ============================================================================
// HASH (für Password + Storage-Keys)
// ============================================================================
export function hashLite(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}

export function safeId(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// ============================================================================
// QR DATA ENCRYPTION
// ============================================================================
export function encryptQR(data) {
  // Einfache Base64 (Produktion: crypto.subtle)
  return btoa(JSON.stringify(data));
}

export function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ============================================================================
// PDF GENERATION (via jsPDF CDN)
// ============================================================================
export async function generatePDF({ title, chapters, data, filename }) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

    script.onload = () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 48;
        const line = 16;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, margin, 56);
        doc.setDrawColor(150);
        doc.line(margin, 88, pageW - margin, 88);

        let y = 112;
        const maxY = doc.internal.pageSize.getHeight() - margin;

        for (const ch of chapters) {
          if (y > maxY - 36) {
            doc.addPage();
            y = margin;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(ch.title, margin, y);
          y += 14;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(100);
          const descLines = doc.splitTextToSize(ch.description, pageW - margin * 2);
          for (const l of descLines) {
            if (y > maxY) {
              doc.addPage();
              y = margin;
            }
            doc.text(l, margin, y);
            y += line;
          }
          doc.setTextColor(0);
          y += 4;

          for (const f of ch.fields) {
            const v = data?.[ch.key]?.[f.k] ?? '';
            const label = `${f.label}: `;
            const value = v?.trim() ? v.trim() : '—';

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            if (y > maxY) {
              doc.addPage();
              y = margin;
            }
            doc.text(label, margin, y);

            doc.setFont('helvetica', 'normal');
            const labelW = doc.getTextWidth(label);
            const valueLines = doc.splitTextToSize(value, pageW - margin * 2 - labelW);
            doc.text(valueLines, margin + labelW, y);
            y += line * valueLines.length;
          }

          y += 10;
          doc.setDrawColor(200);
          doc.line(margin, y, pageW - margin, y);
          y += 18;
        }

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text('Lokal erstellt. Keine Datenübertragung.', margin, doc.internal.pageSize.getHeight() - 24);

        doc.save(filename);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = () => reject(new Error('jsPDF load failed'));
    document.head.appendChild(script);
  });
}

// ============================================================================
// QR CODE GENERATION (via qrcode.js CDN)
// ============================================================================
export async function generateQRCode(text, containerId) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

    script.onload = () => {
      try {
        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Container ${containerId} not found`);
        container.innerHTML = '';

        new window.QRCode(container, {
          text,
          width: 200,
          height: 200,
          colorDark: '#2a2a28',
          colorLight: '#fbfbf7',
        });

        resolve(true);
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = () => reject(new Error('QRCode load failed'));
    document.head.appendChild(script);
  });
}

// ============================================================================
// NUMBER HELPERS
// ============================================================================
export function formatCurrency(value) {
  const num = Number((value || '').toString().replace(/[^0-9.]/g, '')) || 0;
  return num.toFixed(2);
}

export function parseCurrency(value) {
  return Number((value || '').toString().replace(/[^0-9.]/g, '')) || 0;
}

// ============================================================================
// DATE HELPERS
// ============================================================================
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function daysUntil(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
}
