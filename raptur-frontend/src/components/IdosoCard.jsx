// src/components/IdosoCard.jsx
import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/carteirinha.css"; // usa o CSS que você já tem

/** Formata CPF no padrão xxx.xxx.xxx-xx */
function fmtCPF(v = "") {
  const d = String(v).replace(/\D/g, "");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/** Formata data completa DD/MM/YYYY */
function fmtDMY(iso = "") {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(d)) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/** Formata data MM/YYYY */
function fmtMY(iso = "") {
  const d = iso ? new Date(iso) : null;
  if (!d || isNaN(d)) return "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${mm}/${yy}`;
}

/**
 * Componente da carteirinha do idoso (compatível com layout em mm)
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
  const qrValue =
    qrConteudo ||
    JSON.stringify({
      id,
      nome,
      cpf,
      numeroCarteira,
      tipo: "carteirinha_idoso",
    });

  return (
    <div ref={ref} className="card">
      {/* Foto */}
      {fotoPreview ? (
        <img src={fotoPreview} alt="foto do idoso" className="foto" />
      ) : (
        <div className="foto foto--placeholder" />
      )}

      {/* Nome */}
      <div className="nome">{nome || "-"}</div>

      {/* Labels */}
      <div className="label label-cpf">CPF:</div>
      <div className="label label-num">Nº:</div>
      <div className="label label-nasc">Nascimento:</div>
      <div className="label label-emis">Emissão:</div>
      <div className="label label-val">Validade:</div>

      {/* Valores */}
      <div className="value value-cpf">{fmtCPF(cpf)}</div>
      <div className="value value-num">{numeroCarteira || "-"}</div>
      <div className="value value-nasc">{fmtDMY(dataNascimento)}</div>
      <div className="value value-emis">{fmtMY(dataEmissao)}</div>
      <div className="value value-val">{fmtMY(dataValidade)}</div>

      {/* QR Code */}
      <div className="qr">
        <QRCodeSVG
          value={qrValue}
          size={110}
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    </div>
  );
});

export default IdosoCard;
