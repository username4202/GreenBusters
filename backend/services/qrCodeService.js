const QRCode = require('qrcode');

async function generateQRCode(url) {
  try {
    const qrCodeData = await QRCode.toDataURL(url);
    return qrCodeData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

module.exports = { generateQRCode };
