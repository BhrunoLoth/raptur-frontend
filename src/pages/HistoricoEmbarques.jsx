import React, { useEffect, useState } from 'react';
import MotoristaLayout from '../components/MotoristaLayout';

export default function HistoricoEmbarques() {
  const [embarques, setEmbarques] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      setCarregando(true);
      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!token || !usuario?.id) throw new Error('Usuário não autenticado.');

        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/motoristas/${usuario.id}/embarques`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
          setEmbarques([]);
          setCarregando(false);
          return;
        }

        if (!res.ok) {
          const erroApi = await res.json().catch(() => ({}));
          throw new Error(erroApi.erro || 'Erro ao buscar histórico.');
        }

        const data = await res.json();
        setEmbarques(Array.isArray(data) ? data : []);
      } catch (err) {
        setErro(err.message);
        setEmbarques([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchHistorico();
  }, []);

  return (
    <MotoristaLayout>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md max-w-3xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-800 text-center">
          Histórico de Embarques de Hoje
        </h2>

        {carregando && (
          <p className="text-gray-600 text-center">Carregando...</p>
        )}

        {erro && (
          <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
        )}

        {!carregando && !erro && embarques.length === 0 && (
          <p className="text-gray-600 text-center">Nenhum embarque registrado hoje.</p>
        )}

        {!carregando && !erro && embarques.length > 0 && (
          <ul className="space-y-3">
            {embarques.map((e) => (
              <li
                key={e.id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm text-sm md:text-base"
              >
                <div><strong>Passageiro:</strong> {e.usuario?.nome || '---'}</div>
                <div><strong>Ônibus:</strong> {e.veiculo?.placa || '---'}</div>
                <div><strong>Data/Hora:</strong> {new Date(e.data).toLocaleString()}</div>
                <div><strong>Status:</strong> {e.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MotoristaLayout>
  );
}
