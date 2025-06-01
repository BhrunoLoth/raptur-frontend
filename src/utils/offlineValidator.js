import CryptoJS from 'crypto-js';

const SECRET = import.meta.env.VITE_QR_SECRET || 'super_secret_key';

export function validarQRCodeOffline(tokenBase64) {
  try {
    const json = JSON.parse(atob(tokenBase64));
    const { signature, ...payload } = json;

    const recalculated = CryptoJS.HmacSHA256(JSON.stringify(payload), SECRET).toString();

    if (signature !== recalculated) return null;
    return payload;
  } catch (err) {
    console.error('QR inválido:', err);
    return null;
  }
}