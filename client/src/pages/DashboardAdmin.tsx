import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardAPI } from "@/lib/api";
import { toast } from "sonner";
import LayoutAdmin from "@/components/LayoutAdmin"; // ✅ importa layout

export default function DashboardAdmin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
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
      const response = await dashboardAPI.estatisticas();
      setStats(response.data.data);
    } catch {
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin> {/* ✅ aplica layout */}
      <h2 className="text-3xl font-bold mb-6">
        Bem-vindo, {user?.nome?.split(" ")[0]}!
      </h2>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader><CardTitle>Total Usuários</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-primary">{stats.totais.usuarios}</div></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Passageiros</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-primary">{stats.totais.passageiros}</div></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Viagens Hoje</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.hoje.viagens}</div>
              <p className="text-sm text-muted-foreground">{stats.hoje.viagensEmAndamento} em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Receita Hoje</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                R$ {stats.hoje.receita.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </LayoutAdmin>
  );
}
