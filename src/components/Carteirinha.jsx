import React, { forwardRef, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * Preview 1:1 da carteirinha no navegador (para conferir antes de salvar).
 * O PDF oficial continua vindo do backend em /api/idosos/:id/carteirinha.pdf
 */
const Carteirinha = forwardRef(({ idoso, fotoPreview }, ref) => {
  const green = '#1b6b3a';
  const orange = '#f4a000';

  // conteúdo do QR só para preview (o oficial é gerado no backend)
  const qrValue = useMemo(() => {
    if (!idoso) return 'raptur:preview';
    return idoso.qrConteudo || `raptur:idoso:${idoso.id || 'preview'}`;
  }, [idoso]);

  const fmtCPF = (v='') =>
    String(v).replace(/\D/g,'').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');

  const fmtDMY = (iso='') => {
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  };
  const fmtMY = (iso='') => {
    const d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yy = d.getFullYear();
    return `${mm}/${yy}`;
  };

  return (
    <div
      ref={ref}
      className="carteirinha-container select-none"
      style={{
        // Tamanho real (CR-80): 85.6mm x 54mm
        width: '85.6mm',
        height: '54mm',
        borderRadius: '3.2mm',
        boxShadow: '0 2px 10px rgba(0,0,0,.08)',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial',
      }}
    >
      {/* Topo verde */}
      <div style={{ background: green, color: '#fff', padding: '4mm 6mm', display: 'flex', alignItems: 'baseline', gap: '4mm' }}>
        <div style={{ fontSize: '7mm', fontWeight: 800, lineHeight: 1 }}>Raptur</div>
        <div style={{ fontSize: '3.2mm', opacity: .95 }}>Cartão de Idoso — Uso Gratuito</div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '4mm 6mm 0 6mm', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '28mm 1fr 22mm', gap: '4mm', alignItems: 'start' }}>

          {/* Foto com borda arredondada */}
          <div style={{
            width: '28mm', height: '28mm', borderRadius: '2mm',
            border: `0.6mm solid ${green}`, overflow: 'hidden', background: '#f5f7f6'
          }}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#bbb',fontSize:'10mm'}}>👤</div>
            )}
          </div>

          {/* Textos */}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: green, fontSize: '6mm', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5mm', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {idoso?.nome || 'Nome do Idoso'}
            </div>

            <div style={{ display: 'grid', rowGap: '1.2mm', fontSize: '3.6mm' }}>
              <div><span style={{ color: green, fontWeight: 800 }}>CPF: </span><span>{fmtCPF(idoso?.cpf)}</span></div>
              <div><span style={{ color: green, fontWeight: 800 }}>Nº: </span><span>{idoso?.numeroCarteira || '0000-2025'}</span></div>
              <div><span style={{ color: green, fontWeight: 800 }}>Nascimento: </span><span>{fmtDMY(idoso?.dataNascimento)}</span></div>
              <div><span style={{ color: green, fontWeight: 800 }}>Emissão: </span><span>{fmtMY(idoso?.dataEmissao)}</span></div>
              <div><span style={{ color: green, fontWeight: 800 }}>Validade: </span><span>{fmtMY(idoso?.dataValidade)}</span></div>
            </div>
          </div>

          {/* QR */}
          <div style={{ justifySelf: 'end' }}>
            <div style={{
              borderRadius: '2mm', background: '#f5f5f5', border: '0.4mm solid #ddd', padding: '1.2mm'
            }}>
              <QRCodeCanvas value={qrValue} size={130} level="M" includeMargin={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé laranja */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: orange, color: '#fff', textAlign: 'center',
        padding: '2.8mm 4mm', fontSize: '4mm', fontWeight: 600
      }}>
        Apresentação Obrigatória
      </div>
    </div>
  );
});

export default Carteirinha;
