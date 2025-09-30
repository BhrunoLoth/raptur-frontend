// src/pages/IdososView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { buscarIdoso } from '../services/idosoService';
import IdosoCard from '../components/IdosoCard';

const API = import.meta.env.VITE_API_URL;

export default function IdososView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idoso, setIdoso] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await buscarIdoso(id);
        setIdoso(data);
        setErro('');
      } catch (e) {
        console.error(e);
        setErro('Erro ao carregar dados do idoso');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const abrirPdf = () => window.open(`${API}/idosos/${id}/carteirinha.pdf`, '_blank', 'noopener');

  if (loading) return <div style={{ padding: 16 }}>Carregando...</div>;
  if (erro || !idoso) return <div style={{ padding: 16 }}>{erro || 'Não encontrado'}</div>;

  return (
    <div style={{ padding: 16 }}>
      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => navigate('/admin/idosos')} style={{ display: 'flex', gap: 6 }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <button onClick={abrirPdf} style={{ display: 'flex', gap: 6 }}>
          <Printer size={16} /> Abrir PDF
        </button>
      </div>

      <IdosoCard idoso={idoso} />
    </div>
  );
}
