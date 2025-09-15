import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX, Calendar, CreditCard, Printer } from 'lucide-react';
import api from '../services/api';

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace('/api','');

export default function IdososList() {
  const [idosos, setIdosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchIdosos(); }, [currentPage, search, showInactive]);

  const fetchIdosos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/idosos', {
        params: { page: currentPage, limit: 10, search, ativo: showInactive ? undefined : true }
      });
      setIdosos(data.idosos); setTotalPages(data.totalPages); setError('');
    } catch (err) {
      setError('Erro ao carregar lista de idosos');
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir a carteirinha de ${nome}?`)) return;
    try { await api.delete(`/idosos/${id}`); fetchIdosos(); }
    catch (err) { setError('Erro ao excluir idoso'); console.error(err); }
  };

  const toggleStatus = async (id, currentStatus) => {
    try { await api.put(`/idosos/${id}`, { ativo: !currentStatus }); fetchIdosos(); }
    catch (err) { setError('Erro ao alterar status do idoso'); console.error(err); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR');
  const calculateAge = (birth) => {
    const today = new Date(); const b = new Date(birth);
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };
  const isExpired = (valid) => new Date(valid) < new Date();

  const openPdf = (idosoId) => {
    window.open(`${API}/idosos/${idosoId}/carteirinha.pdf`, '_blank', 'noopener');
  };

  return (
    <div className="p-6">
      {/* ... tabela igual ao seu original mas ajustado fotoUrl */}
      {idosos.map((i) => (
        <tr key={i.id}>
          <td>
            {i.fotoUrl ? (
              <img src={i.fotoUrl.startsWith('http') ? i.fotoUrl : `${API_BASE}${i.fotoUrl}`} alt={i.nome}/>
            ) : '👤'}
          </td>
        </tr>
      ))}
    </div>
  );
}
