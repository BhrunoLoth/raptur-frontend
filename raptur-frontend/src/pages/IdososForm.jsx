import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, ArrowLeft, Save, Printer, User } from 'lucide-react';
import api from '../services/api';
import Carteirinha from '../components/Carteirinha';

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace('/api','');

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
      if (data.fotoUrl) {
        setFotoPreview(
          data.fotoUrl.startsWith('http') ? data.fotoUrl : `${API_BASE}${data.fotoUrl}`
        );
      }
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
      {/* ...formulário igual ao seu original */}
    </div>
  );
}
