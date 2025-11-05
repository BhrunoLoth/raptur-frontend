import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardAPI } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardAdmin() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (user?.perfil !== "admin") {
      setLocation("/");
      return;
    }

    loadStats();
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.estatisticas(); // ✅ correto
      setStats(response.data.data);
    } catch (error) {
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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">RAPTUR</h1>
          <div className="flex items-center gap-4">
            <p>{user?.nome}</p>
            <Button variant="outline" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-3xl font-bold mb-6">
          Bem-vindo, {user?.nome?.split(" ")[0]}!
        </h2>

        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader><CardTitle>Total Usuários</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.totais.usuarios}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Passageiros</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.totais.passageiros}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Viagens Hoje</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{stats.hoje.viagens}</div><p className="text-sm text-muted-foreground">{stats.hoje.viagensEmAndamento} em andamento</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Receita Hoje</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-secondary">R$ {stats.hoje.receita.toFixed(2)}</div></CardContent></Card>
          </div>
        )}
      </main>
    </div>
  );
}
