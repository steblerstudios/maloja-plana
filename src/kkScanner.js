// KK-Karten Scanner mit Barcode, QR, OCR

export const initBarcodeScanner = async () => {
  // Lade js-barcode und jsQR
  if (!document.getElementById('js-barcode')) {
    const script = document.createElement('script');
    script.id = 'js-barcode';
    script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js';
    document.head.appendChild(script);
  }

  if (!document.getElementById('jsqr')) {
    const script = document.createElement('script');
    script.id = 'jsqr';
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    document.head.appendChild(script);
  }

  if (!document.getElementById('tesseract')) {
    const script = document.createElement('script');
    script.id = 'tesseract';
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/tesseract.min.js';
    document.head.appendChild(script);
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
          if (window.JsBarcode && window.JsBarcode.scanBarcode) {
            // Versuche Barcode zu lesen
            window.JsBarcode.scanBarcode(canvas);
          }

          // Fallback: QR Code Scan
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

export const performOCR = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (window.Tesseract) {
          window.Tesseract.recognize(e.target.result, 'deu').then(result => {
            resolve(result.data.text);
          }).catch(reject);
        } else {
          reject(new Error('Tesseract nicht geladen'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(imageFile);
  });
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
  const ahvMatch = text.match(/756[\.\s]\d{4}[\.\s]\d{4}[\.\s]\d{2}/);
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

export const validateKKData = (data) => {
  const errors = [];

  if (!data.insurer) errors.push('Versicherer nicht erkannt');
  if (!data.cardNumber || data.cardNumber.length < 10) errors.push('Kartennummer ungültig');
  if (data.ahv && !data.ahv.match(/756[\.\s]\d{4}[\.\s]\d{4}[\.\s]\d{2}/)) {
    errors.push('AHV-Format ungültig');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const parseKKQRCode = (qrText) => {
  try {
    const data = JSON.parse(qrText);
    if (data.type === 'KK_CARD') {
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
};
