import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (user?.perfil === "passageiro") setLocation("/passageiro");
    if (user?.perfil === "motorista") setLocation("/motorista");
    if (user?.perfil === "cobrador") setLocation("/cobrador");

    if (user?.perfil === "admin") loadStats();
    else setLocation("/login");
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.estatisticas();
      setStats(response.data.data);
    } catch {
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
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
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Bem-vindo, {user?.nome?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground mt-1">Resumo do sistema</p>
        </div>

        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card><CardHeader className="pb-3"><CardTitle>Total Usuários</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.totais.usuarios}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle>Passageiros</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.totais.passageiros}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle>Viagens Hoje</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.hoje.viagens}</div><p className="text-sm text-muted-foreground">{stats.hoje.viagensEmAndamento} em andamento</p></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle>Receita Hoje</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-secondary">R$ {stats.hoje.receita.toFixed(2)}</div></CardContent></Card>
          </div>
        )}
      </main>
    </div>
  );
}
