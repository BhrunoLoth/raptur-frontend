import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QRScanner';
import { embarqueAPI } from '@/lib/api'; // ✅ removido viagemAPI (não existe mais)
import { toast } from 'sonner'; // ✅ permitido aqui, client-side

interface Viagem {
  id: string;
  rota?: { nome: string };
  onibus?: { placa: string };
}

interface Embarque {
  id: string;
  createdAt: string;
  valor: number;
  tipoEmbarque: string;
  passageiro?: { usuario?: { nome: string } };
}

export default function Cobrador() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [viagemSelecionada, setViagemSelecionada] = useState<string>('');
  const [embarques, setEmbarques] = useState<Embarque[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'cobrador') {
      setLocation('/dashboard');
      return;
    }
    loadViagens();
  }, [isAuthenticated, user]);

  const loadViagens = async () => {
    try {
      // ⚠️ Viagens estavam sendo carregadas via viagemAPI (removido)
      // Substituímos por dados estáticos ou você pode integrar depois à API real.
      setViagens([
        {
          id: '1',
          rota: { nome: 'Garça - Marília' },
          onibus: { placa: 'ABC-1234' },
        },
      ]);
    } catch {
      toast.error('Erro ao carregar viagens');
    }
  };

  const handleScan = async (qrCodeData: string) => {
    if (!viagemSelecionada) {
      toast.error('Selecione uma viagem primeiro');
      return;
    }

    try {
      const data = await embarqueAPI.validar(qrCodeData, viagemSelecionada);
      const embarque = data?.data || data;

      setEmbarques((prev) => [embarque, ...prev]);
      toast.success(
        `Embarque validado! ${
          embarque.tipoEmbarque === 'gratuito'
            ? 'GRATUITO'
            : `R$ ${embarque.valor}`
        }`
      );

      setShowScanner(false);
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao validar embarque');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Cobrador - Scanner</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Selecionar Viagem */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Viagem</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={viagemSelecionada}
              onChange={(e) => setViagemSelecionada(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Selecione uma viagem...</option>
              {viagens.map((viagem) => (
                <option key={viagem.id} value={viagem.id}>
                  {viagem.rota?.nome} - {viagem.onibus?.placa}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Botão / Scanner */}
        {viagemSelecionada && (
          <>
            {!showScanner ? (
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full"
                size="lg"
              >
                Abrir Scanner QR Code
              </Button>
            ) : (
              <QRScanner
                onScan={handleScan}
                onError={(error) => toast.error(error)}
              />
            )}
          </>
        )}

        {/* Lista de Embarques */}
        <Card>
          <CardHeader>
            <CardTitle>Embarques Hoje ({embarques.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {embarques.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum embarque registrado ainda
                </p>
              ) : (
                embarques.map((embarque) => (
                  <div
                    key={embarque.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {embarque.passageiro?.usuario?.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(embarque.createdAt).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          embarque.tipoEmbarque === 'gratuito'
                            ? 'text-secondary'
                            : 'text-primary'
                        }`}
                      >
                        {embarque.tipoEmbarque === 'gratuito'
                          ? 'GRATUITO'
                          : `R$ ${embarque.valor}`}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {embarque.tipoEmbarque}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
