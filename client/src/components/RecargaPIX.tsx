import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import QRCodeDisplay from './QRCodeDisplay';
import { pixAPI } from '@/lib/api';
import { toast } from 'sonner';

interface RecargaPIXProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RecargaPIX({ open, onClose, onSuccess }: RecargaPIXProps) {
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pagamentoId, setPagamentoId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum < 1) {
      toast.error('Valor mínimo é R$ 1,00');
      return;
    }

    setLoading(true);
    try {
      const response = await pixAPI.criarRecarga(valorNum);
      const { qrCode: qrCodeData, pagamentoId: id } = response.data.data;
      
      setQrCode(qrCodeData);
      setPagamentoId(id);
      toast.success('QR Code gerado! Escaneie para pagar');
      
      // Iniciar verificação de status
      startStatusCheck(id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao gerar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const startStatusCheck = (id: string) => {
    const interval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const response = await pixAPI.consultarStatus(id);
        const { status } = response.data.data;

        if (status === 'aprovado') {
          clearInterval(interval);
          toast.success('Pagamento aprovado! Saldo atualizado');
          onSuccess?.();
          handleClose();
        } else if (status === 'cancelado' || status === 'expirado') {
          clearInterval(interval);
          toast.error('Pagamento não realizado');
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      } finally {
        setCheckingStatus(false);
      }
    }, 3000); // Verificar a cada 3 segundos

    // Parar após 5 minutos
    setTimeout(() => clearInterval(interval), 300000);
  };

  const handleClose = () => {
    setValor('');
    setQrCode(null);
    setPagamentoId(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Recarga via PIX</DialogTitle>
          <DialogDescription>
            Adicione créditos à sua carteira usando PIX
          </DialogDescription>
        </DialogHeader>

        {!qrCode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor da Recarga</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Valor mínimo: R$ 1,00</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setValor('10')}
                className="flex-1"
              >
                R$ 10
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValor('20')}
                className="flex-1"
              >
                R$ 20
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValor('50')}
                className="flex-1"
              >
                R$ 50
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Gerando QR Code...' : 'Gerar QR Code PIX'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <QRCodeDisplay 
              value={qrCode} 
              title={`Pagar R$ ${parseFloat(valor).toFixed(2)}`}
              size={200}
            />
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Como pagar:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar com PIX</li>
                <li>Escaneie o QR Code acima</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            {checkingStatus && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Aguardando pagamento...
              </div>
            )}

            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancelar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

