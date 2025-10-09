// src/components/IdosoCard.jsx
import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ✅ Compatível com ESM e Vercel
import '../styles/carteirinha.css';

/** Formata CPF no padrão xxx.xxx.xxx-xx */
function fmtCPF(v = '') {
  const d = String(v).replace(/\D/g, '');
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/** Formata data completa DD/MM/YYYY */
function fmtDMY(iso = '') {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(d)) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/** Formata data MM/YYYY */
function fmtMY(iso = '') {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(d)) return '-';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${mm}/${yy}`;
}

/**
 * Componente da carteirinha do idoso
 * @param {object} idoso - Dados do idoso
 * @param {string} fotoPreview - Caminho ou base64 da foto
 */
const IdosoCard = forwardRef(({ idoso, fotoPreview }, ref) => {
  if (!idoso) return null;

  const {
    nome,
    cpf,
    numeroCarteira,
    dataNascimento,
    dataEmissao,
    dataValidade,
    qrConteudo,
    id,
  } = idoso;

  // Conteúdo do QR Code (JSON seguro)
  const qrValue = qrConteudo || JSON.stringify({
    id,
    nome,
    cpf,
    numeroCarteira,
    tipo: 'carteirinha_idoso',
  });

  return (
    <div ref={ref} className="carteirinha-wrap">
      {/* Template de fundo */}
      <img
        className="carteirinha-bg"
        src="/assets/carteirinha-template.png"
        alt="template da carteirinha"
      />

      {/* Foto do idoso */}
      <div className="carteirinha-foto">
        {fotoPreview ? (
          <img src={fotoPreview} alt="foto do idoso" />
        ) : (
          <div className="foto-placeholder" />
        )}
      </div>

      {/* Nome */}
      <div className="carteirinha-nome">{nome || '-'}</div>

      {/* Dados principais */}
      <div className="carteirinha-linha">
        <strong>CPF:</strong>&nbsp;{fmtCPF(cpf)}
      </div>
      <div className="carteirinha-linha">
        <strong>Nº:</strong>&nbsp;{numeroCarteira || '-'}
      </div>
      <div className="carteirinha-linha">
        <strong>Nascimento:</strong>&nbsp;{fmtDMY(dataNascimento)}
      </div>
      <div className="carteirinha-linha">
        <strong>Emissão:</strong>&nbsp;{fmtMY(dataEmissao)}
      </div>
      <div className="carteirinha-linha">
        <strong>Validade:</strong>&nbsp;{fmtMY(dataValidade)}
      </div>

      {/* QR Code */}
      <div className="carteirinha-qr">
        <QRCodeSVG
          value={qrValue}
          size={90}
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    </div>
  );
});

export default IdosoCard;
