import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, Save, User } from 'lucide-react';
import api from '../services/api';

export default function IdososForm() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: ''
  });
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

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchIdoso();
    }
  }, [id]);

  const fetchIdoso = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/idosos/${id}`);
      const idoso = response.data;
      
      setFormData({
        nome: idoso.nome,
        cpf: idoso.cpf,
        dataNascimento: idoso.dataNascimento
      });
      
      if (idoso.fotoUrl) {
        setFotoPreview(`${import.meta.env.VITE_API_URL.replace('/api', '')}${idoso.fotoUrl}`);
      }
    } catch (err) {
      setError('Erro ao carregar dados do idoso');
      console.error('Erro ao buscar idoso:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Formatação automática do CPF
      const cpfFormatted = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
      
      setFormData(prev => ({ ...prev, [name]: cpfFormatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Apenas imagens são permitidas.');
        return;
      }
      
      setFoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setFotoPreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setError('Erro ao acessar câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'foto-capturada.jpg', { type: 'image/jpeg' });
        setFoto(file);
        setFotoPreview(canvas.toDataURL());
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.cpf.trim()) {
      setError('CPF é obrigatório');
      return false;
    }
    
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      setError('CPF deve estar no formato XXX.XXX.XXX-XX');
      return false;
    }
    
    if (!formData.dataNascimento) {
      setError('Data de nascimento é obrigatória');
      return false;
    }
    
    // Verificar se tem pelo menos 60 anos
    const hoje = new Date();
    const nascimento = new Date(formData.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    let idadeReal = idade;
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idadeReal--;
    }
    
    if (idadeReal < 60) {
      setError('Pessoa deve ter pelo menos 60 anos para ter direito à carteirinha do idoso');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('cpf', formData.cpf);
      formDataToSend.append('dataNascimento', formData.dataNascimento);
      
      if (foto) {
        formDataToSend.append('foto', foto);
      }
      
      if (isEditing) {
        await api.put(`/idosos/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/idosos', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/idosos');
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar idoso');
      console.error('Erro ao salvar idoso:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Carteirinha' : 'Nova Carteirinha do Idoso'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto 3x4
              </label>
              <div className="flex flex-col items-center space-y-4">
                {fotoPreview ? (
                  <div className="relative">
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFoto(null);
                        setFotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={16} />
                    Capturar
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Upload size={16} />
                    Upload
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  maxLength={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pessoa deve ter pelo menos 60 anos
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/idosos')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal da Câmera */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Capturar Foto</h3>
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-end gap-2">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Capturar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

