// src/components/IdosoCard.jsx
import React, { forwardRef } from 'react';
import QRCode from 'qrcode.react';
import '../styles/carteirinha.css';

const mm = (n) => `${n}mm`;

/**
 * idoso: {
 *   nome, cpf, numeroCarteira, dataNascimento, dataEmissao, dataValidade, qrConteudo, fotoUrl
 * }
 * fotoPreview: se quiser forçar uma imagem (dataURL) vinda do formulário
 */
const IdosoCard = forwardRef(({ idoso, fotoPreview }, ref) => {
  const fotoSrc = fotoPreview || idoso?.fotoUrl || '';
  const qrValue = idoso?.qrConteudo || `raptur:idoso:${idoso?.id}`;

  const fmtCPF = (digits = '') =>
    String(digits).replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  const fmtDMY = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm_ = String(date.getMonth() + 1).padStart(2, '0');
    const yy = date.getFullYear();
    return `${dd}/${mm_}/${yy}`;
  };

  const fmtMY = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    const mm_ = String(date.getMonth() + 1).padStart(2, '0');
    const yy = date.getFullYear();
    return `${mm_}/${yy}`;
  };

  return (
    <div className="card" ref={ref}>
      {/* Foto */}
      {fotoSrc ? (
        <img className="foto" src={fotoSrc} alt="Foto do idoso" />
      ) : (
        <div className="foto foto--placeholder" />
      )}

      {/* Nome */}
      <div className="nome">{idoso?.nome ?? '-'}</div>

      {/* Labels */}
      <div className="label label-cpf">CPF:</div>
      <div className="label label-num">Nº:</div>
      <div className="label label-nasc">Nascimento:</div>
      <div className="label label-emis">Emissão:</div>
      <div className="label label-val">Validade:</div>

      {/* Valores */}
      <div className="value value-cpf">{fmtCPF(idoso?.cpf)}</div>
      <div className="value value-num">{idoso?.numeroCarteira ?? '-'}</div>
      <div className="value value-nasc">{fmtDMY(idoso?.dataNascimento)}</div>
      <div className="value value-emis">{fmtMY(idoso?.dataEmissao)}</div>
      <div className="value value-val">{fmtMY(idoso?.dataValidade)}</div>

      {/* QR */}
      <div className="qr">
        <QRCode value={qrValue} size={140} includeMargin={false} />
      </div>
    </div>
  );
});

export default IdosoCard;
