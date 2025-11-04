import { useEffect, useState } from 'react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { pixAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RecargaPIX() {
  const [valor, setValor] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [pagamentoId, setPagamentoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecarga = async () => {
    if (!valor || Number(valor) <= 0) {
      return toast.error('Informe um valor válido');
    }

    try {
      setLoading(true);
      const valorNumber = Number(valor);

      const res = await pixAPI.criarRecarga(valorNumber);
      if (!res?.id || !res?.qr_code) {
        throw new Error('Resposta inválida do servidor');
      }

      setPagamentoId(res.id);
      setQRCode(res.qr_code);
      toast.success('QR Code gerado!');

      setValor('');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar pagamento Pix');
    } finally {
      setLoading(false);
    }
  };

  // Pooling para verificar pagamento
  useEffect(() => {
    if (!pagamentoId) return;

    const interval = setInterval(async () => {
      try {
        const status = await pixAPI.consultarStatus(pagamentoId);

        if (status?.status === 'approved' || status?.status === 'pago') {
          clearInterval(interval);
          setPagamentoId(null);
          toast.success('Pagamento confirmado! ✅');

          window.dispatchEvent(new Event("saldo-atualizado"));
          setQRCode('');
        }
      } catch {
        // Ignora erros silenciosamente
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pagamentoId]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Recarga via PIX</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!qrCode && (
            <>
              <input
                type="number"
                placeholder="Valor da recarga"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <Button onClick={handleRecarga} disabled={loading}>
                {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
              </Button>
            </>
          )}

          {qrCode && (
            <div className="space-y-4">
              <QRCodeDisplay value={qrCode} title="Escaneie para pagar" />

              <Button 
                variant="outline"
                onClick={() => {
                  setQRCode('');
                  setPagamentoId(null);
                }}
              >
                Cancelar
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Aguardando pagamento...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
