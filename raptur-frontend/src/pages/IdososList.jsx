import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX, Calendar, CreditCard, Printer } from 'lucide-react';
import api from '../services/api';

const API = import.meta.env.VITE_API_URL;

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Carteirinhas do Idoso</h1>
        <button onClick={() => navigate('/idosos/novo')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Nova Carteirinha
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text" placeholder="Buscar por nome, CPF ou número da carteira..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showInactive" checked={showInactive} onChange={(e)=>setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
            <label htmlFor="showInactive" className="text-sm text-gray-700">Mostrar inativos</label>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : idosos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Nenhuma carteirinha encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idoso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº Carteira</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {idosos.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                          {i.fotoUrl ? (
                            <img className="h-10 w-10 object-cover" src={i.fotoUrl.startsWith('http') ? i.fotoUrl : `${API.replace('/api','')}${i.fotoUrl}`} alt={i.nome} />
                          ) : <div className="h-full w-full flex items-center justify-center text-gray-600"><UserCheck className="h-6 w-6" /></div>}
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">{i.nome}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAge(i.dataNascimento)} anos</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-mono text-gray-900">{i.numeroCarteira}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className={`text-sm ${isExpired(i.dataValidade) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(i.dataValidade)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        i.ativo ? (isExpired(i.dataValidade) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800') : 'bg-red-100 text-red-800'
                      }`}>
                        {i.ativo ? (isExpired(i.dataValidade) ? 'Vencida' : 'Ativa') : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/idosos/${i.id}`)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Visualizar">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => navigate(`/idosos/${i.id}/editar`)} className="text-green-600 hover:text-green-900 p-1 rounded" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => openPdf(i.id)} className="text-orange-600 hover:text-orange-800 p-1 rounded" title="Imprimir PDF">
                          <Printer size={16} />
                        </button>
                        <button onClick={() => toggleStatus(i.id, i.ativo)} className={`p-1 rounded ${i.ativo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`} title={i.ativo ? 'Desativar' : 'Ativar'}>
                          {i.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button onClick={() => handleDelete(i.id, i.nome)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:block text-sm text-gray-700">
              Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 disabled:opacity-50">Próximo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
