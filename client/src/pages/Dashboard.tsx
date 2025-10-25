import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    loadStats();
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.estatisticas();
      setStats(response.data.data);
    } catch (error: any) {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const navigateTo = (path: string) => {
    setLocation(path);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">RAPTUR</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.nome}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.perfil}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Bem-vindo, {user?.nome?.split(' ')[0]}!</h2>
          <p className="text-muted-foreground mt-1">Aqui está um resumo do sistema</p>
        </div>

        {/* Stats Cards */}
        {user?.perfil === 'admin' && stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totais.usuarios}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Passageiros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totais.passageiros}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Viagens Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.hoje.viagens}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.hoje.viagensEmAndamento} em andamento
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Receita Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  R$ {stats.hoje.receita.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user?.perfil === 'passageiro' && (
            <>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/passageiro')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Minha Carteira
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Ver saldo, QR Code e recarregar</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/carteirinha')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    Carteirinha do Idoso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Solicitar ou visualizar carteirinha</p>
                </CardContent>
              </Card>
            </>
          )}
          
          {user?.perfil === 'motorista' && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/motorista')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Minhas Viagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Gerenciar viagens e jornada</p>
              </CardContent>
            </Card>
          )}

          {user?.perfil === 'cobrador' && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/cobrador')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Scanner QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Validar embarques</p>
              </CardContent>
            </Card>
          )}

          {user?.perfil === 'admin' && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-secondary" onClick={() => navigateTo('/importar-alunos')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Importar Alunos Gratuitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Importar lista de alunos via Excel</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

