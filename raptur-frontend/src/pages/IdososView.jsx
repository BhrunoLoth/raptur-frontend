import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Edit, QrCode } from 'lucide-react';
import api from '../services/api';
import Carteirinha from '../components/Carteirinha';

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace('/api','');

export default function IdososView() {
  const [idoso, setIdoso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const carteirinhaRef = useRef();

  useEffect(() => { fetchIdoso(); }, [id]);

  const fetchIdoso = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/idosos/${id}`);
      setIdoso(data); setError('');
    } catch (err) {
      setError('Erro ao carregar dados do idoso');
      console.error(err);
    } finally { setLoading(false); }
  };

  const openPdf = () => window.open(`${API}/idosos/${id}/carteirinha.pdf`, '_blank', 'noopener');

  if (loading) return <p>Carregando...</p>;
  if (error || !idoso) return <p>{error || 'Idoso não encontrado'}</p>;

  return (
    <div className="p-6">
      <Carteirinha
        ref={carteirinhaRef}
        idoso={idoso}
        fotoPreview={
          idoso.fotoUrl?.startsWith('http')
            ? idoso.fotoUrl
            : (idoso.fotoUrl ? `${API_BASE}${idoso.fotoUrl}` : null)
        }
      />
      <button onClick={openPdf}>Imprimir PDF</button>
    </div>
  );
}
