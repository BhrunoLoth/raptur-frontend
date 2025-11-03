import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import RecargaPIX from '@/components/RecargaPIX';
import { authAPI, pixAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function Passageiro() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const [perfil, setPerfil] = useState<any>(null);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecarga, setShowRecarga] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'passageiro') {
      setLocation('/dashboard');
      return;
    }
    loadData();
  }, [isAuthenticated, user]);

  async function loadData() {
    try {
      const perfilRes = await authAPI.getProfile();
      const pagamentosRes = await pixAPI.listarPagamentos();

      setPerfil(perfilRes.data);
      setPagamentos(pagamentosRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  }

  const handleRecargaSuccess = () => {
    toast.success('Saldo atualizado!');
    loadData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  const saldo = perfil?.carteira?.saldo || 0;
  const qr = perfil?.qrCode || JSON.stringify({ id: perfil?.id, cpf: perfil?.cpf });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold">Minha Carteira</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card className="bg-gradient-to-br from-primary to-green-600 text-white">
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">R$ {saldo.toFixed(2)}</p>
            <Button
              onClick={() => setShowRecarga(true)}
              className="mt-4 bg-white text-primary"
            >
              Recarregar
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <QRCodeDisplay value={qr} size={220} title="QR de Embarque" />

          <Card>
            <CardHeader>
              <CardTitle>Meus Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p><b>Nome:</b> {perfil?.nome}</p>
              <p><b>CPF:</b> {perfil?.cpf}</p>
              <p><b>Email:</b> {perfil?.email}</p>
              <p><b>Telefone:</b> {perfil?.telefone}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Recargas</CardTitle>
          </CardHeader>
          <CardContent>
            {pagamentos.length === 0 && (
              <p className="text-center py-6 text-muted-foreground">
                Nenhuma recarga feita ainda
              </p>
            )}

            {pagamentos.map((p) => (
              <div key={p.id} className="flex justify-between py-2 border-b">
                <span>{new Date(p.createdAt).toLocaleString()}</span>
                <span>+ R$ {p.valor.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <RecargaPIX
        open={showRecarga}
        onClose={() => setShowRecarga(false)}
        onSuccess={handleRecargaSuccess}
      />
    </div>
  );
}
