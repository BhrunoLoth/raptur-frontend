import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PassageiroDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarioAtualizado = async () => {
      try {
        const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');

        if (!usuarioStorage?.id || !token) {
          throw new Error('Token ou ID de usuário ausente.');
        }

        const resp = await fetch(`${API_URL}/passageiros/${usuarioStorage.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!resp.ok) {
          const erro = await resp.json().catch(() => ({}));
          throw new Error(erro.erro || 'Erro ao buscar dados do passageiro.');
        }

        const dadosAtualizados = await resp.json();
        localStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
        setUsuario(dadosAtualizados);
      } catch (error) {
        console.error('[Dashboard Passageiro] Erro:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioAtualizado();
  }, []);

  const baixarQRCode = () => {
    const img = document.getElementById('qrcode-img');
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const link = document.createElement('a');
    link.download = 'qrcode-raptur.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) return <p className="text-center text-gray-500">Carregando dados atualizados...</p>;
  if (!usuario) return <p className="text-center text-red-600">Erro ao carregar dados.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-800 text-center">
        Bem-vindo, {usuario.nome}
      </h2>

      <div className="mb-4 text-sm md:text-base">
        <strong>Tipo de passageiro:</strong> {usuario.subtipo_passageiro || '---'}
      </div>

      <div className="mb-4 text-sm md:text-base">
        <strong>Saldo:</strong> R$ {Number(usuario.saldo || 0).toFixed(2)}
      </div>

      <div className="text-sm md:text-base text-center mt-4">
        <strong>QR Code para embarque:</strong><br />
        {usuario.qrCode?.startsWith('http') ? (
          <>
            <img
              id="qrcode-img"
              src={usuario.qrCode}
              alt="QR Code"
              className="mt-4 mx-auto w-40 h-40 md:w-48 md:h-48"
            />
            <button
              onClick={baixarQRCode}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Baixar QR Code
            </button>
          </>
        ) : (
          <p className="text-red-500 mt-2">QR Code indisponível.</p>
        )}
      </div>
    </div>
  );
}
