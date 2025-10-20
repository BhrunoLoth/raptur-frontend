import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { viagemAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Motorista() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [viagens, setViagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      setViagens(response.data.data || []);
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao iniciar viagem');
    }
  };

  const handleFinalizarViagem = async (viagemId: string) => {
    try {
      await viagemAPI.finalizar(viagemId);
      toast.success('Viagem finalizada!');
      loadViagens();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao finalizar viagem');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const viagensAgendadas = viagens.filter(v => v.status === 'agendada');
  const viagensEmAndamento = viagens.filter(v => v.status === 'em_andamento');
  const viagensFinalizadas = viagens.filter(v => v.status === 'finalizada').slice(0, 5);

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
        {/* Viagens em Andamento */}
        {viagensEmAndamento.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary">Em Andamento</h2>
            <div className="grid gap-4">
              {viagensEmAndamento.map((viagem) => (
                <Card key={viagem.id} className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{viagem.rota?.nome}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {viagem.onibus?.placa}
                      </span>
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
                        <p className="font-medium text-secondary">
                          R$ {(viagem.totalArrecadado || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFinalizarViagem(viagem.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      Finalizar Viagem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Viagens Agendadas */}
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
                      <p className="font-medium">
                        {new Date(viagem.dataHoraSaida).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ônibus</p>
                      <p className="font-medium">{viagem.onibus?.placa}</p>
                    </div>
                    <Button
                      onClick={() => handleIniciarViagem(viagem.id)}
                      className="w-full"
                    >
                      Iniciar Viagem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Viagens Finalizadas */}
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
                        <p className="text-sm text-muted-foreground">
                          {viagem.totalPassageiros} passageiros
                        </p>
                        <p className="font-bold text-secondary">
                          R$ {(viagem.totalArrecadado || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sem viagens */}
        {viagens.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium mb-2">Nenhuma viagem encontrada</p>
              <p className="text-muted-foreground">
                Aguarde o administrador agendar viagens para você
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

