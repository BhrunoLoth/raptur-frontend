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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return setLocation("/login");
    if (user?.perfil !== "admin") return setLocation("/");

    loadStats();
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      const [resumo, estatisticas, notificacoes] = await Promise.all([
        dashboardAPI.resumo(),
        dashboardAPI.estatisticas(),
        dashboardAPI.notificacoes(),
      ]);

      setStats({
        resumo: resumo.data.data,
        estatisticas: estatisticas.data.data,
        notificacoes: notificacoes.data.data,
      });
    } catch (err) {
      console.error(err);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">RAPTUR</h1>
          <div className="flex gap-4 items-center">
            <span>{user?.nome}</span>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.nome?.split(" ")[0]}!
        </h2>
        <p className="text-muted-foreground mb-6">Resumo do sistema</p>

        {stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader><CardTitle>Total Usuários</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.estatisticas.totais.usuarios}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Passageiros</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.estatisticas.totais.passageiros}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Viagens Hoje</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats.resumo.hoje.viagens}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.resumo.hoje.viagensEmAndamento} em andamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Receita Hoje</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  R$ {stats.resumo.hoje.receita.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
