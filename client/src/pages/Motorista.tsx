import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { viagemAPI, embarqueAPI } from '@/lib/api';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import { Scan, X, Users, DollarSign } from 'lucide-react';

export default function Motorista() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [viagens, setViagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modoScanner, setModoScanner] = useState(false);
  const [viagemAtiva, setViagemAtiva] = useState<any>(null);
  const [ultimoEmbarque, setUltimoEmbarque] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'motorista') {
      setLocation('/dashboard');
      return;
    }
    loadViagens();
  }, [isAuthenticated, user]);

  const loadViagens = async () => {
    try {
      const response = await viagemAPI.minhas();
      const lista = response.data?.data || response.data || [];
      setViagens(lista);

      const emAndamento = lista.find((v: any) => v.status === 'em_andamento');
      if (emAndamento) setViagemAtiva(emAndamento);
    } catch (_) {
      toast.error('Erro ao carregar viagens');
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarViagem = async (viagemId: string) => {
    try {
      await viagemAPI.iniciar(viagemId);
      toast.success('Viagem iniciada!');
      loadViagens();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erro ao iniciar viagem');
    }
  };

  const handleFinalizarViagem = async (viagemId: string) => {
    try {
      await viagemAPI.finalizar(viagemId);
      toast.success('Viagem finalizada!');
      setModoScanner(false);
      setViagemAtiva(null);
      loadViagens();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erro ao finalizar viagem');
    }
  };

  const handleAtivarScanner = (viagem: any) => {
    setViagemAtiva(viagem);
    setModoScanner(true);
  };

  const handleDesativarScanner = () => {
    setModoScanner(false);
    setUltimoEmbarque(null);
  };

  const handleScanSuccess = async (qrCodeData: string) => {
    if (!viagemAtiva) {
      toast.error('Nenhuma viagem ativa');
      return;
    }

    try {
      const res = await embarqueAPI.validar(qrCodeData, viagemAtiva.id);
      const resultado = res.data?.data || res.data;

      setUltimoEmbarque(resultado);

      setViagemAtiva((prev: any) => ({
        ...prev,
        totalPassageiros: (prev?.totalPassageiros || 0) + 1,
        totalArrecadado: (prev?.totalArrecadado || 0) + (resultado?.valor || 0),
      }));

      toast.success(resultado?.message || 'Embarque validado!', { duration: 3000 });

      setTimeout(() => setUltimoEmbarque(null), 5000);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Erro ao validar embarque';
      toast.error(msg);
      setUltimoEmbarque({ success: false, message: msg });
      setTimeout(() => setUltimoEmbarque(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de Scanner
  if (modoScanner && viagemAtiva) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg font-bold text-primary">{viagemAtiva.rota?.nome}</h1>
              <p className="text-xs text-muted-foreground">{viagemAtiva.onibus?.placa}</p>
            </div>
            <Button variant="outline" onClick={handleDesativarScanner} size="sm">
              <X className="w-4 h-4 mr-2" />
              Sair do Scanner
            </Button>
          </div>
        </header>

        <main className="container py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{viagemAtiva.totalPassageiros || 0}</p>
                    <p className="text-sm text-muted-foreground">Passageiros</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      R$ {(viagemAtiva.totalArrecadado || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Arrecadado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Scan className="w-8 h-8 mx-auto mb-2 text-primary" />
                Posicione o QR Code na câmera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRScanner onScan={handleScanSuccess} />
            </CardContent>
          </Card>

          {ultimoEmbarque && (
            <Card className={ultimoEmbarque.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <CardContent className="py-6">
                <div className="text-center">
                  {ultimoEmbarque.success ? (
                    <>
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-green-700 mb-2">✅ Embarque Validado!</h3>
                      <p className="text-lg font-semibold text-green-600 mb-3">{ultimoEmbarque.tipoEmbarque}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-green-700">
                          <strong>Passageiro:</strong> {ultimoEmbarque.passageiro?.nome}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Valor:</strong> R$ {Number(ultimoEmbarque.valor || 0).toFixed(2)}
                        </p>
                        {ultimoEmbarque.saldoRestante != null && (
                          <p className="text-sm text-green-700">
                            <strong>Saldo restante:</strong> R$ {Number(ultimoEmbarque.saldoRestante).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-red-700 mb-2">❌ Embarque Negado</h3>
                      <p className="text-lg text-red-600">{ultimoEmbarque.message}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted">
            <CardContent className="py-4">
              <h4 className="font-semibold mb-2">📱 Instruções:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Fixe o celular/tablet próximo à catraca</li>
                <li>Passageiros devem mostrar o QR Code para a câmera</li>
                <li>Aguarde a validação (2 segundos)</li>
                <li>Sinal verde = pode embarcar</li>
                <li>Sinal vermelho = não pode embarcar</li>
              </ul>
            </CardContent>
          </Card>

          <Button
            onClick={() => handleFinalizarViagem(viagemAtiva.id)}
            variant="destructive"
            size="lg"
            className="w-full"
          >
            Finalizar Viagem
          </Button>
        </main>
      </div>
    );
  }

  const viagensAgendadas = viagens.filter((v) => v.status === 'agendada');
  const viagensEmAndamento = viagens.filter((v) => v.status === 'em_andamento');
  const viagensFinalizadas = viagens.filter((v) => v.status === 'finalizada').slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Minhas Viagens</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {viagensEnAndamento.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary">Em Andamento</h2>
            <div className="grid gap-4">
              {viagensEmAndamento.map((viagem) => (
                <Card key={viagem.id} className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{viagem.rota?.nome}</span>
                      <span className="text-sm font-normal text-muted-foreground">{viagem.onibus?.placa}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Origem</p>
                        <p className="font-medium">{viagem.rota?.origem}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Destino</p>
                        <p className="font-medium">{viagem.rota?.destino}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Passageiros</p>
                        <p className="font-medium text-primary">{viagem.totalPassageiros || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Arrecadado</p>
                        <p className="font-medium text-secondary">R$ {(viagem.totalArrecadado || 0).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Button onClick={() => handleAtivarScanner(viagem)} className="w-full" size="lg">
                        <Scan className="w-5 h-5 mr-2" />
                        Ativar Scanner (Sem Cobrador)
                      </Button>

                      <Button onClick={() => handleFinalizarViagem(viagem.id)} variant="destructive" className="w-full">
                        Finalizar Viagem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {viagensAgendadas.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Agendadas</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {viagensAgendadas.map((viagem) => (
                <Card key={viagem.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{viagem.rota?.nome}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Saída</p>
                      <p className="font-medium">{new Date(viagem.dataHoraSaida).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ônibus</p>
                      <p className="font-medium">{viagem.onibus?.placa}</p>
                    </div>
                    <Button onClick={() => handleIniciarViagem(viagem.id)} className="w-full">
                      Iniciar Viagem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {viagensFinalizadas.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Finalizadas Recentemente</h2>
            <div className="space-y-3">
              {viagensFinalizadas.map((viagem) => (
                <Card key={viagem.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{viagem.rota?.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(viagem.dataHoraSaida).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{viagem.totalPassageiros} passageiros</p>
                        <p className="font-bold text-secondary">R$ {(viagem.totalArrecadado || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {viagens.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium mb-2">Nenhuma viagem encontrada</p>
              <p className="text-muted-foreground">Aguarde o administrador agendar viagens para você</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
