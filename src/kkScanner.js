// KK-Karten Scanner mit Barcode, QR, OCR

export const initBarcodeScanner = async () => {
  try {
    if (!document.getElementById('jsqr')) {
      const script = document.createElement('script');
      script.id = 'jsqr';
      script.src = '/vendor/jsQR.js';
      document.head.appendChild(script);
    }

    // OCR (Tesseract) removed — blocked by CSP (script-src 'self')
    // and too large (~4MB) for offline bundling. QR/barcode scan works offline.
  } catch {
    // Offline: scanning features unavailable, manual input still works
  }
};

export const scanBarcodeFromImage = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (window.jsQR) {
            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              resolve({
                type: 'qr',
                data: code.data,
                raw: code.data
              });
              return;
            }
          }

          // Wenn kein Barcode/QR gefunden, versuche OCR
          performOCR(imageFile).then(text => {
            resolve({
              type: 'ocr',
              data: extractKKDataFromText(text),
              raw: text
            });
          }).catch(() => {
            reject(new Error('Kein QR/Barcode oder OCR Fehler'));
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  });
};

export const performOCR = async () => {
  throw new Error('OCR not available — use QR/barcode scan or manual input');
};

export const extractKKDataFromText = (text) => {
  const result = {
    insurer: '',
    cardNumber: '',
    holder: '',
    ahv: '',
    franchise: '',
    model: ''
  };

  // Versicherer
  const insurers = ['Swica', 'Helsana', 'CSS', 'Assura', 'Sanitas', 'Axa', 'KPT', 'EGK'];
  insurers.forEach(insurer => {
    if (text.toUpperCase().includes(insurer.toUpperCase())) {
      result.insurer = insurer;
    }
  });

  // Kartennummer (meist 13-16 Ziffern)
  const cardMatch = text.match(/\d{13,16}/);
  if (cardMatch) result.cardNumber = cardMatch[0];

  // AHV (756.xxxx.xxxx.xx Format)
  const ahvMatch = text.match(/756[.\s]\d{4}[.\s]\d{4}[.\s]\d{2}/);
  if (ahvMatch) result.ahv = ahvMatch[0].replace(/\s/g, '.');

  // Franchise
  const franchiseMatch = text.match(/Franchise[:\s]+CHF\s*(\d+)/i);
  if (franchiseMatch) result.franchise = franchiseMatch[1];

  // Modell
  if (text.includes('Basic')) result.model = 'Basic';
  else if (text.includes('Standard')) result.model = 'Standard';
  else if (text.includes('Comfort')) result.model = 'Comfort';

  return result;
};

export const generateKKQRCode = (kkData) => {
  const qrData = JSON.stringify({
    type: 'KK_CARD',
    insurer: kkData.insurer,
    cardNumber: kkData.cardNumber,
    ahv: kkData.ahv,
    franchise: kkData.franchise,
    model: kkData.model
  });

  return qrData;
};

export const validateKKData = (data, t) => {
  const errors = [];

  if (!data.insurer) errors.push(t ? t('kkScanner.errorNoInsurer') : 'Insurer not recognized');
  if (!data.cardNumber || data.cardNumber.length < 10) errors.push(t ? t('kkScanner.errorCardNumber') : 'Card number invalid');
  if (data.ahv && !data.ahv.match(/756[.\s]\d{4}[.\s]\d{4}[.\s]\d{2}/)) {
    errors.push(t ? t('kkScanner.errorAhvFormat') : 'AHV format invalid');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const ALLOWED_KK_FIELDS = ['type', 'insurer', 'cardNumber', 'ahv', 'name', 'firstName', 'birthDate', 'model', 'franchise'];

export const parseKKQRCode = (qrText) => {
  if (typeof qrText !== 'string' || qrText.length > 2000) return null;
  try {
    const data = JSON.parse(qrText);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;
    if (data.type !== 'KK_CARD') return null;
    const sanitized = {};
    for (const key of ALLOWED_KK_FIELDS) {
      if (key in data && (typeof data[key] === 'string' || typeof data[key] === 'number')) {
        sanitized[key] = typeof data[key] === 'string' ? data[key].slice(0, 200) : data[key];
      }
    }
    if (!sanitized.type) return null;
    return sanitized;
  } catch (e) {
    return null;
  }
};
