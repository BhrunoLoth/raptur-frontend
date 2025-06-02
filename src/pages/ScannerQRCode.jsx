// ✅ ScannerQRCode.jsx
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // ✅ Correção: named import
import { validarQRCodeOffline } from '../utils/offlineValidator';
import { salvarEmbarqueLocal } from '../services/offlineStorage';
import { sincronizarEmbarques } from '../services/syncService';

export default function ScannerQRCode() {
  const [log, setLog] = useState('');

  const handleScan = (data) => {
    if (!data) return;

    const validado = validarQRCodeOffline(data);

    if (!validado.valido) {
      setLog(`❌ ${validado.erro}`);
      return;
    }

    const embarque = {
      passageiroId: validado.dados.id,
      tipo: validado.dados.tipo,
      timestamp: Date.now(),
      onibusId: 1 // 🔁 Em breve: identificar ônibus via login do motorista ou QR
    };

    salvarEmbarqueLocal(embarque);
    setLog(`✅ Embarque salvo offline. Tipo: ${validado.dados.tipo}`);
  };

  const handleSync = async () => {
    const msg = await sincronizarEmbarques();
    setLog(msg);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛰️ Modo Offline - Scanner QRCode</h2>

      <QrReader
        scanDelay={300} // ✅ Novo nome na lib atual
        onResult={(result, error) => {
          if (!!result) handleScan(result?.text);
          if (!!error) console.warn('⚠️ Erro na leitura:', error);
        }}
        constraints={{ facingMode: 'environment' }}
        containerStyle={{ width: '100%', maxWidth: '480px' }}
        videoStyle={{ width: '100%' }}
      />

      <button
        onClick={handleSync}
        style={{
          marginTop: 12,
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Sincronizar Embarques
      </button>

      <p style={{ marginTop: 10, fontFamily: 'monospace' }}>{log}</p>
    </div>
  );
}
