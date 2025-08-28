import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Carteirinha = forwardRef(({ idoso }, ref) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div ref={ref} className="carteirinha-container">
      {/* Estilos para impressão */}
      <style jsx>{`
        @media print {
          .carteirinha-container {
            width: 8.5cm !important;
            height: 5.4cm !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid;
            transform: none !important;
            box-shadow: none !important;
          }
          
          .carteirinha-card {
            width: 8.5cm !important;
            height: 5.4cm !important;
            margin: 0.3cm !important;
            font-size: 8pt !important;
            line-height: 1.2 !important;
          }
          
          .carteirinha-header {
            height: 1.2cm !important;
            font-size: 12pt !important;
            font-weight: bold !important;
          }
          
          .carteirinha-content {
            height: 3cm !important;
            padding: 0.2cm !important;
          }
          
          .carteirinha-foto {
            width: 3cm !important;
            height: 4cm !important;
            margin-right: 0.3cm !important;
          }
          
          .carteirinha-dados {
            flex: 1 !important;
            font-size: 8pt !important;
          }
          
          .carteirinha-qr {
            width: 2cm !important;
            height: 2cm !important;
          }
          
          .carteirinha-footer {
            height: 1.2cm !important;
            font-size: 9pt !important;
            font-weight: bold !important;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      
      <div className="carteirinha-card bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg" 
           style={{ width: '340px', height: '216px', fontFamily: 'Arial, sans-serif' }}>
        
        {/* Cabeçalho Verde */}
        <div className="carteirinha-header bg-green-600 text-white flex items-center justify-center text-center px-2 py-1"
             style={{ height: '48px', backgroundColor: '#16a34a' }}>
          <div>
            <div className="font-bold text-lg leading-tight">Raptur</div>
            <div className="text-sm leading-tight">Cartão de Idoso – Uso Gratuito</div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="carteirinha-content flex p-2 bg-gray-50" style={{ height: '120px' }}>
          {/* Foto */}
          <div className="carteirinha-foto flex-shrink-0 mr-3" style={{ width: '120px', height: '96px' }}>
            {idoso.fotoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${idoso.fotoUrl}`}
                alt={idoso.nome}
                className="w-full h-full object-cover rounded border-2 border-green-600"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded border-2 border-green-600 flex items-center justify-center">
                <span className="text-gray-600 text-xs">Sem foto</span>
              </div>
            )}
          </div>

          {/* Dados */}
          <div className="carteirinha-dados flex-1 text-xs space-y-1">
            <div>
              <span className="font-semibold text-green-700">Nome:</span>
              <div className="font-bold text-sm text-gray-900 leading-tight">{idoso.nome}</div>
            </div>
            
            <div>
              <span className="font-semibold text-green-700">CPF:</span>
              <div className="font-mono text-gray-900">{formatCPF(idoso.cpf)}</div>
            </div>
            
            <div>
              <span className="font-semibold text-green-700">Nº:</span>
              <div className="font-mono font-bold text-gray-900">{idoso.numeroCarteira}</div>
            </div>
            
            <div>
              <span className="font-semibold text-green-700">Nascimento:</span>
              <div className="text-gray-900">{formatDate(idoso.dataNascimento)}</div>
            </div>
            
            <div>
              <span className="font-semibold text-green-700">Emissão:</span>
              <div className="text-gray-900">{formatDate(idoso.dataEmissao)}</div>
            </div>
            
            <div>
              <span className="font-semibold text-green-700">Validade:</span>
              <div className="text-gray-900 font-semibold">{formatDate(idoso.dataValidade)}</div>
            </div>
          </div>

          {/* QR Code */}
          <div className="carteirinha-qr flex-shrink-0 ml-2" style={{ width: '80px', height: '80px' }}>
            <QRCodeCanvas
              value={idoso.qrConteudo}
              size={80}
              level="M"
              includeMargin={false}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Rodapé Laranja */}
        <div className="carteirinha-footer bg-orange-500 text-white flex items-center justify-center text-center px-2 py-1"
             style={{ height: '48px', backgroundColor: '#f97316' }}>
          <div className="font-bold text-sm leading-tight">
            Apresente este cartão ao motorista durante o embarque.
          </div>
        </div>
      </div>
    </div>
  );
});

Carteirinha.displayName = 'Carteirinha';

export default Carteirinha;

