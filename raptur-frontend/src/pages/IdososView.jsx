import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Edit, Download, QrCode, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Carteirinha from '../components/Carteirinha';

const API = import.meta.env.VITE_API_URL;

export default function IdososView() {
  const [idoso, setIdoso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
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

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR');
  const calculateAge = (birth) => {
    const t = new Date(); const b = new Date(birth);
    let a = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
    return a;
  };
  const isExpired = (v) => new Date(v) < new Date();

  const openPdf = () => window.open(`${API}/idosos/${id}/carteirinha.pdf`, '_blank', 'noopener');

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }
  if (error || !idoso) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/idosos')} className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Carteirinha do Idoso</h1>
          </div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error || 'Idoso não encontrado'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/idosos')} className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Carteirinha do Idoso</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQR(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <QrCode size={16} /> QR Code
            </button>
            <button onClick={() => navigate(`/idosos/${id}/editar`)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Edit size={16} /> Editar
            </button>
            <button onClick={openPdf} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <Printer size={16} /> Imprimir PDF
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            idoso.ativo ? (isExpired(idoso.dataValidade) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800') : 'bg-red-100 text-red-800'
          }`}>
            {idoso.ativo ? (isExpired(idoso.dataValidade) ? '⚠️ Carteirinha Vencida' : '✅ Carteirinha Ativa') : '❌ Carteirinha Inativa'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Carteirinha</h2>
            <div className="flex justify-center">
              <Carteirinha ref={carteirinhaRef} idoso={idoso} fotoPreview={idoso.fotoUrl?.startsWith('http') ? idoso.fotoUrl : (idoso.fotoUrl ? `${API.replace('/api','')}${idoso.fotoUrl}` : null)} />
            </div>
            <p className="text-sm text-gray-600 text-center">Visualização. Use “Imprimir PDF” para o documento oficial.</p>
          </div>

          {/* Infos */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Informações Detalhadas</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-500">Nome</label><p className="text-gray-900 font-medium">{idoso.nome}</p></div>
                <div><label className="block text-sm text-gray-500">CPF</label><p className="text-gray-900 font-mono">{idoso.cpf}</p></div>
                <div><label className="block text-sm text-gray-500">Nascimento</label><p className="text-gray-900">{formatDate(idoso.dataNascimento)}</p></div>
                <div><label className="block text-sm text-gray-500">Idade</label><p className="text-gray-900">{calculateAge(idoso.dataNascimento)} anos</p></div>
                <div><label className="block text-sm text-gray-500">Número da Carteira</label><p className="text-gray-900 font-mono font-bold">{idoso.numeroCarteira}</p></div>
                <div><label className="block text-sm text-gray-500">Emissão</label><p className="text-gray-900">{formatDate(idoso.dataEmissao)}</p></div>
                <div><label className="block text-sm text-gray-500">Validade</label><p className={`font-medium ${isExpired(idoso.dataValidade) ? 'text-red-600' : 'text-gray-900'}`}>{formatDate(idoso.dataValidade)}</p></div>
                <div><label className="block text-sm text-gray-500">Status</label><p className={`font-medium ${idoso.ativo ? 'text-green-600' : 'text-red-600'}`}>{idoso.ativo ? 'Ativa' : 'Inativa'}</p></div>
              </div>
              <div className="pt-4 border-t">
                <label className="block text-sm text-gray-500 mb-2">Cadastrado em</label>
                <p className="text-gray-900">{formatDate(idoso.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" id="qr-modal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code da Carteirinha</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white border rounded-lg">
                  <canvas ref={(canvas) => {
                    if (canvas) {
                      import('qrcode').then(QRCode => {
                        QRCode.toCanvas(canvas, idoso.qrConteudo || `raptur:idoso:${idoso.id}`, { width: 200, margin: 2, color: { dark: '#000', light: '#fff' } });
                      });
                    }
                  }} />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{idoso.nome}</p>
                <p>Carteira: {idoso.numeroCarteira}</p>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    const canvas = document.querySelector('#qr-modal canvas');
                    if (!canvas) return;
                    const link = document.createElement('a');
                    link.download = `QR-${idoso.numeroCarteira}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} /> Baixar
                </button>
                <button onClick={() => setShowQR(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
