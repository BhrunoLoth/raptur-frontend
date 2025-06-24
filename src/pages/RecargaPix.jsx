import React, { useState } from 'react';

export default function RecargaPix() {
  const [valor, setValor] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [copiaCola, setCopiaCola] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [verificando, setVerificando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const passageiro = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  const handleRecarga = async () => {
    setMensagem('');
    setQrCode(null);
    setCopiaCola('');
    setCarregando(true);

    try {
      const resp = await fetch(`${API_URL}/pix/cobrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          passageiroId: passageiro.id,
          valor: parseFloat(valor)
        })
      });

      if (!resp.ok) {
        const erro = await resp.json();
        throw new Error(erro.erro || 'Erro ao gerar cobrança');
      }

      const dados = await resp.json();
      setQrCode(dados.qr_base64);
      setCopiaCola(dados.qr_code);
      setMensagem('Aguardando pagamento via Pix...');
      verificarPagamento(dados.transacaoId);
    } catch (err) {
      setMensagem(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const verificarPagamento = async (transacaoId) => {
    setVerificando(true);
    const intervalo = setInterval(async () => {
      try {
        const resp = await fetch(`${API_URL}/pix/status/${transacaoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resp.ok) {
          const { pago } = await resp.json();
          if (pago) {
            clearInterval(intervalo);
            setMensagem('✅ Pagamento confirmado! Atualizando saldo...');
            await atualizarDadosPassageiro();
            setValor('');
            setQrCode(null);
            setCopiaCola('');
            setVerificando(false);
          }
        }
      } catch (e) {
        console.error('Erro ao verificar pagamento:', e);
      }
    }, 5000);
  };

  const atualizarDadosPassageiro = async () => {
    try {
      const resp = await fetch(`${API_URL}/passageiros/${passageiro.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.ok) {
        const dadosAtualizados = await resp.json();
        localStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
      }
    } catch (e) {
      console.error('Erro ao atualizar saldo:', e);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-800 text-center">Recarga via Pix</h2>

      <input
        type="number"
        min={1}
        step={1}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Digite o valor da recarga (ex: 10.00)"
        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
      />

      <button
        onClick={handleRecarga}
        className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-medium"
        disabled={carregando || !valor}
      >
        {carregando ? 'Gerando Pix...' : 'Gerar QR Code'}
      </button>

      {mensagem && (
        <p className="mt-4 text-sm text-center text-green-700">{mensagem}</p>
      )}

      {qrCode && (
        <div className="mt-6 text-center">
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="QR Code Pix"
            className="mx-auto w-40 h-40 md:w-48 md:h-48"
          />
          <p className="mt-3 text-sm text-gray-700">Código copia-e-cola:</p>
          <textarea
            value={copiaCola}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md text-sm mt-2"
          />
        </div>
      )}

      {verificando && (
        <p className="mt-4 text-xs text-center text-gray-500">
          ⏳ Verificando pagamento automaticamente...
        </p>
      )}
    </div>
  );
}
