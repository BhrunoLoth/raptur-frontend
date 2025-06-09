import React, { useEffect, useState } from 'react';

export default function PassageiroDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsuarioAtualizado = async () => {
      try {
        const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
        const resp = await fetch(`/api/usuarios/${usuarioStorage.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!resp.ok) {
          throw new Error('Erro ao buscar dados do passageiro.');
        }

        const dadosAtualizados = await resp.json();
        localStorage.setItem('usuario', JSON.stringify(dadosAtualizados));
        setUsuario(dadosAtualizados);
      } catch (error) {
        console.error('[Dashboard Passageiro] Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioAtualizado();
  }, [token]);

  if (loading) return <p className="text-center text-gray-500">Carregando dados atualizados...</p>;
  if (!usuario) return <p className="text-center text-red-600">Erro ao carregar dados.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-800 text-center">
        Bem-vindo, {usuario.nome}
      </h2>

      <div className="mb-4 text-sm md:text-base">
        <strong>Tipo de passageiro:</strong> {usuario.subtipo_passageiro}
      </div>

      <div className="mb-4 text-sm md:text-base">
        <strong>Saldo:</strong> R$ {usuario.saldo_credito?.toFixed(2) || '0,00'}
      </div>

      <div className="text-sm md:text-base">
        <strong>QR Code para embarque:</strong><br />
        {usuario.qrCode ? (
          <img
            src={`data:image/png;base64,${usuario.qrCode}`}
            alt="QR Code"
            className="mt-4 mx-auto w-40 h-40 md:w-48 md:h-48"
          />
        ) : (
          <p className="text-red-500 mt-2">QR Code indisponível.</p>
        )}
      </div>
    </div>
  );
}
