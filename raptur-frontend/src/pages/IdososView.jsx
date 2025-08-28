import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Printer, Edit, Download, QrCode } from 'lucide-react';
import api from '../services/api';
import Carteirinha from '../components/Carteirinha';

export default function IdososView() {
  const [idoso, setIdoso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const carteirinhaRef = useRef();

  useEffect(() => {
    fetchIdoso();
  }, [id]);

  const fetchIdoso = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/idosos/${id}`);
      setIdoso(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados do idoso');
      console.error('Erro ao buscar idoso:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => carteirinhaRef.current,
    documentTitle: `Carteirinha-${idoso?.nome?.replace(/\s+/g, '-')}-${idoso?.numeroCarteira}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        
        .carteirinha-container {
          width: 8.5cm !important;
          height: 5.4cm !important;
          margin: 0.3cm auto !important;
          page-break-inside: avoid;
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Pequeno delay para garantir que o componente está renderizado
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => {
      console.log('Impressão concluída');
    },
    onPrintError: (error) => {
      console.error('Erro na impressão:', error);
      setError('Erro ao imprimir carteirinha');
    }
  });

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-modal canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR-${idoso.numeroCarteira}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const isExpired = (validityDate) => {
    return new Date(validityDate) < new Date();
  };

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
            <button
              onClick={() => navigate('/idosos')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Carteirinha do Idoso</h1>
          </div>
          
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Idoso não encontrado'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/idosos')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Carteirinha do Idoso</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <QrCode size={16} />
              QR Code
            </button>
            <button
              onClick={() => navigate(`/idosos/${id}/editar`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit size={16} />
              Editar
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
        </div>

        {/* Status da Carteirinha */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            idoso.ativo 
              ? isExpired(idoso.dataValidade)
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {idoso.ativo 
              ? isExpired(idoso.dataValidade) 
                ? '⚠️ Carteirinha Vencida' 
                : '✅ Carteirinha Ativa'
              : '❌ Carteirinha Inativa'
            }
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carteirinha */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Carteirinha</h2>
            <div className="flex justify-center">
              <Carteirinha ref={carteirinhaRef} idoso={idoso} />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Tamanho real: 8,5 × 5,4 cm (padrão CR-80)
            </p>
          </div>

          {/* Informações Detalhadas */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Informações Detalhadas</h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                  <p className="text-gray-900 font-medium">{idoso.nome}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">CPF</label>
                  <p className="text-gray-900 font-mono">{idoso.cpf}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                  <p className="text-gray-900">{formatDate(idoso.dataNascimento)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Idade</label>
                  <p className="text-gray-900">{calculateAge(idoso.dataNascimento)} anos</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Número da Carteira</label>
                  <p className="text-gray-900 font-mono font-bold">{idoso.numeroCarteira}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Data de Emissão</label>
                  <p className="text-gray-900">{formatDate(idoso.dataEmissao)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Data de Validade</label>
                  <p className={`font-medium ${isExpired(idoso.dataValidade) ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(idoso.dataValidade)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className={`font-medium ${idoso.ativo ? 'text-green-600' : 'text-red-600'}`}>
                    {idoso.ativo ? 'Ativa' : 'Inativa'}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-500 mb-2">Cadastrado em</label>
                <p className="text-gray-900">{formatDate(idoso.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" id="qr-modal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code da Carteirinha</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white border rounded-lg">
                  <canvas 
                    ref={(canvas) => {
                      if (canvas) {
                        import('qrcode').then(QRCode => {
                          QRCode.toCanvas(canvas, idoso.qrConteudo, {
                            width: 200,
                            margin: 2,
                            color: {
                              dark: '#000000',
                              light: '#FFFFFF'
                            }
                          });
                        });
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium">{idoso.nome}</p>
                <p>Carteira: {idoso.numeroCarteira}</p>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} />
                  Baixar
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
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

