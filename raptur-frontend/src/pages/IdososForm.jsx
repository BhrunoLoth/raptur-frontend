import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, Save, Printer, User } from 'lucide-react';
import api from '../services/api';
import Carteirinha from '../components/Carteirinha';

const API = import.meta.env.VITE_API_URL;

export default function IdososForm() {
  const [formData, setFormData] = useState({ nome: '', cpf: '', dataNascimento: '' });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Carregar em edição
  useEffect(() => { if (id) { setIsEditing(true); fetchIdoso(); } }, [id]);

  const fetchIdoso = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/idosos/${id}`);
      setFormData({
        nome: data.nome || '',
        cpf: data.cpf || '',
        dataNascimento: data.dataNascimento || ''
      });
      if (data.fotoUrl) setFotoPreview(data.fotoUrl.startsWith('http') ? data.fotoUrl : `${API.replace('/api','')}${data.fotoUrl}`);
    } catch (err) {
      setError('Erro ao carregar dados do idoso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      const cpfFormatted = value.replace(/\D/g,'')
        .replace(/(\d{3})(\d)/,'$1.$2')
        .replace(/(\d{3})(\d)/,'$1.$2')
        .replace(/(\d{3})(\d{1,2})/,'$1-$2')
        .replace(/(-\d{2})\d+?$/,'$1');
      setFormData(prev => ({ ...prev, [name]: cpfFormatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Arquivo muito grande. Máximo 5MB.');
    if (!file.type.startsWith('image/')) return setError('Apenas imagens são permitidas.');

    setFoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    setError('');
  };

  // Câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setError('Erro ao acessar câmera. Verifique as permissões.');
    }
  };
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };
  useEffect(() => () => stopCamera(), []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current, video = videoRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'foto-capturada.jpg', { type: 'image/jpeg' });
      setFoto(file);
      setFotoPreview(canvas.toDataURL('image/jpeg', 0.9));
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return setError('Nome é obrigatório'), false;
    if (!formData.cpf.trim()) return setError('CPF é obrigatório'), false;
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) return setError('CPF deve estar no formato XXX.XXX.XXX-XX'), false;
    if (!formData.dataNascimento) return setError('Data de nascimento é obrigatória'), false;

    // 60+
    const hoje = new Date();
    const nasc = new Date(formData.dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    if (idade < 60) return setError('Pessoa deve ter pelo menos 60 anos'), false;

    return true;
  };

  const save = async () => {
    const fd = new FormData();
    fd.append('nome', formData.nome);
    fd.append('cpf', formData.cpf);
    fd.append('dataNascimento', formData.dataNascimento);
    if (foto) fd.append('foto', foto);
    if (isEditing) {
      await api.put(`/idosos/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return id;
    }
    const { data } = await api.post('/idosos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data?.idoso?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const newId = await save();
      navigate('/idosos');
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar idoso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAndPrint = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const newId = await save();
      // Abre PDF oficial do backend
      if (newId) window.open(`${API}/idosos/${newId}/carteirinha.pdf`, '_blank', 'noopener');
      navigate('/idosos');
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar/gerar PDF');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/idosos')} className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Carteirinha' : 'Nova Carteirinha do Idoso'}
          </h1>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* layout em 2 colunas: formulário + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <form className="space-y-6">
              {/* Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto 3x4</label>
                <div className="flex flex-col items-center space-y-4">
                  {fotoPreview ? (
                    <div className="relative">
                      <img src={fotoPreview} alt="Preview" className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300" />
                      <button
                        type="button"
                        onClick={() => { setFoto(null); setFotoPreview(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >×</button>
                    </div>
                  ) : (
                    <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={startCamera} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Camera size={16} /> Capturar
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                      <Upload size={16} /> Upload
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>

              {/* Dados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <input
                    type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} required maxLength={14}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
                  <input
                    type="date" id="dataNascimento" name="dataNascimento"
                    value={formData.dataNascimento} onChange={handleInputChange} required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pessoa deve ter pelo menos 60 anos</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-wrap justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => navigate('/idosos')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  <Save size={16} /> {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
                </button>
                {!isEditing && (
                  <button type="button" onClick={handleSubmitAndPrint} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">
                    <Printer size={16} /> {loading ? 'Gerando...' : 'Salvar & Imprimir'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview ao vivo (fiel à arte) */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pré-visualização</h2>
            <div className="flex justify-center">
              <Carteirinha
                idoso={{
                  nome: formData.nome || 'Nome do Idoso',
                  cpf: formData.cpf,
                  numeroCarteira: '0000-2025',
                  dataNascimento: formData.dataNascimento,
                  dataEmissao: new Date().toISOString(),
                  dataValidade: new Date(new Date().setFullYear(new Date().getFullYear()+5)).toISOString(),
                }}
                fotoPreview={fotoPreview}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-3">Visualização ilustrativa. O PDF oficial será gerado pelo sistema.</p>
          </div>
        </div>
      </div>

      {/* Modal Câmera */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Capturar Foto</h3>
            <div className="space-y-4">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-end gap-2">
                <button onClick={stopCamera} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={capturePhoto} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Capturar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
