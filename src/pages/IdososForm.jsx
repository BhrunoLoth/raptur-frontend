// src/pages/IdososForm.jsx
import "../styles/formulario.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Save, Printer, ArrowLeft } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { criarIdoso } from '../services/idosoService';
import api from '../services/api';

const API = import.meta.env.VITE_API_URL;

export default function IdososForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', cpf: '', dataNascimento: '' });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      const cpf = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
      setForm((p) => ({ ...p, cpf }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    if (erro) setErro('');
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setErro('Apenas imagens são permitidas.');
    if (f.size > 5 * 1024 * 1024) return setErro('Arquivo muito grande (máx 5MB).');
    setFoto(f);
    const rd = new FileReader();
    rd.onload = (ev) => setFotoPreview(ev.target.result);
    rd.readAsDataURL(f);
  };

  const onCapture = (file, dataUrl) => {
    setFoto(file);
    setFotoPreview(dataUrl);
    setShowCamera(false);
  };

  const validate = () => {
    if (!form.nome.trim()) return setErro('Nome é obrigatório'), false;
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) return setErro('CPF inválido'), false;
    if (!form.dataNascimento) return setErro('Data de nascimento é obrigatória'), false;
    return true;
  };

  const doSave = async (printAfter = false) => {
    if (!validate()) return;
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('nome', form.nome);
      fd.append('cpf', form.cpf);
      fd.append('dataNascimento', form.dataNascimento);
      if (foto) fd.append('foto', foto);

      const { idoso } = await criarIdoso(fd); // seu back devolve { mensagem, idoso }
      if (!idoso?.id) throw new Error('Falha ao salvar');

      if (printAfter) {
        window.open(`${API}/idosos/${idoso.id}/carteirinha.pdf`, '_blank', 'noopener');
      }
      navigate('/admin/idosos');
    } catch (e) {
      console.error(e);
      setErro(e?.response?.data?.erro || e.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 640 }}>
      <button className="no-print" onClick={() => navigate('/admin/idosos')} style={{ display: 'flex', gap: 6 }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <h2 style={{ marginTop: 12, marginBottom: 12 }}>Cadastrar Idoso</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          Nome*<br />
          <input name="nome" value={form.nome} onChange={onChange} />
        </label>

        <label>
          CPF*<br />
          <input name="cpf" value={form.cpf} onChange={onChange} placeholder="000.000.000-00" />
        </label>

        <label>
          Data de Nascimento*<br />
          <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={onChange} />
        </label>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Upload size={16} />
            <input type="file" accept="image/*" onChange={onFile} />
          </label>

          <button type="button" onClick={() => setShowCamera(true)} style={{ display: 'flex', gap: 6 }}>
            <Camera size={16} /> Tirar foto
          </button>
        </div>

        {fotoPreview && (
          <img
            src={fotoPreview}
            alt="Prévia"
            style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
          />
        )}

        {showCamera && (
          <CameraCapture onCapture={onCapture} onCancel={() => setShowCamera(false)} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button disabled={loading} onClick={() => doSave(false)} style={{ display: 'flex', gap: 6 }}>
          <Save size={16} /> Salvar
        </button>
        <button disabled={loading} onClick={() => doSave(true)} style={{ display: 'flex', gap: 6 }}>
          <Printer size={16} /> Salvar & Imprimir
        </button>
      </div>
    </div>
  );
}
