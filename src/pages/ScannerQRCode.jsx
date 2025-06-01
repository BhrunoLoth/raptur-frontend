import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { validarQRCodeOffline } from '../../utils/offlineValidator';
import { salvarEmbarqueLocal } from '../../services/offlineStorage';
import { sincronizarEmbarques } from '../../services/syncService';

export default function ScannerQRCode() {
  const [log, setLog] = useState('');

  const handleScan = (data) => {
    if (data) {
      const validado = validarQRCodeOffline(data);
      if (!validado) return setLog('❌ QR inválido.');

      const embarque = {
        passageiroId: validado.id,
        tipo: validado.tipo,
        timestamp: Date.now(),
        onibusId: 1 // ⚠️ troque por valor dinâmico se necessário
      };

      salvarEmbarqueLocal(embarque);
      setLog(`✅ Embarque salvo offline. Tipo: ${validado.tipo}`);
    }
  };

  const handleSync = async () => {
    const msg = await sincronizarEmbarques();
    setLog(msg);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modo Offline - Scanner QR</h2>
      <QrReader
        delay={300}
        onScan={handleScan}
        onError={(err) => console.error('Erro no scanner:', err)}
        style={{ width: '100%' }}
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

      <p style={{ marginTop: 10 }}>{log}</p>
    </div>
  );
}