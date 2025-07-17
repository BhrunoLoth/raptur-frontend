import React, { useEffect, useState } from 'react';

export default function HistoricoEmbarques() {
  const [embarques, setEmbarques] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!token || !usuario?.id) {
          throw new Error('Usuário não autenticado.');
        }

        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/passageiros/${usuario.id}/embarques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const erro = await res.json().catch(() => ({}));
          throw new Error(erro.erro || 'Erro ao buscar histórico.');
        }

        const data = await res.json();
        setEmbarques(Array.isArray(data) ? data : []); // ← robustez aqui!
      } catch (err) {
        setErro(err.message);
        setEmbarques([]); // Segurança extra!
      }
    };

    fetchHistorico();
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-800 text-center">
        Histórico de Embarques
      </h2>

      {erro && (
        <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
      )}

      {Array.isArray(embarques) && embarques.length === 0 ? (
        <p className="text-gray-600 text-center">Nenhum embarque encontrado.</p>
      ) : (
        Array.isArray(embarques) && embarques.map((e, idx) => (
          <li
            key={idx}
            className="border border-gray-200 p-4 rounded-lg shadow-sm text-sm md:text-base"
          >
            <div className="mb-1">
              <strong>Data:</strong>{' '}
              {new Date(e.data_hora || e.data).toLocaleString()}
            </div>
            <div className="mb-1">
              <strong>Ônibus:</strong> {e.onibus?.placa || '---'}
            </div>
            <div>
              <strong>Tipo:</strong> {e.tipo || '---'}
            </div>
          </li>
        ))
      )}
    </div>
  );
}
