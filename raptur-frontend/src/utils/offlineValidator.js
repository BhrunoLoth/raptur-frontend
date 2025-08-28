export function validarQRCodeOffline(qrData) {
  try {
    const decoded = JSON.parse(atob(qrData));
    return {
      valido: true,
      dados: decoded
    };
  } catch (err) {
    return {
      valido: false,
      erro: 'QR inválido ou malformado'
    };
  }
}
