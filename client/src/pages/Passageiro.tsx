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

  const loadData = async () => {
    try {
      const [perfilRes, pagamentosRes] = await Promise.all([
        authAPI.getProfile(),
        pixAPI.listarPagamentos(),
      ]);

      setPerfil(perfilRes.data);
      setPagamentos(pagamentosRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleRecargaSuccess = () => {
    loadData();
    toast.success('Recarga realizada com sucesso!');
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

  const saldo = perfil?.carteira?.saldo || 0;
  const qrCodeData = perfil?.passageiro?.qrCode || JSON.stringify({ id: perfil?.id, cpf: perfil?.cpf });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Minha Carteira</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg opacity-90">Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-5xl font-bold">R$ {saldo.toFixed(2)}</span>
            <Button
              onClick={() => setShowRecarga(true)}
              className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Adicionar Créditos
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <QRCodeDisplay value={qrCodeData} title="Meu QR Code de Embarque" size={220} />

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ['Nome', perfil?.nome],
                ['CPF', perfil?.cpf],
                ['Email', perfil?.email],
                ['Telefone', perfil?.telefone],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Recargas</CardTitle>
          </CardHeader>
          <CardContent>
            {pagamentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma recarga realizada ainda</p>
            ) : (
              pagamentos.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Recarga PIX</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')} às {new Date(p.createdAt).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">+ R$ {p.valor.toFixed(2)}</p>
                    <p
                      className={`text-xs capitalize ${
                        p.status === 'aprovado'
                          ? 'text-green-600'
                          : p.status === 'pendente'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {p.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <RecargaPIX open={showRecarga} onClose={() => setShowRecarga(false)} onSuccess={handleRecargaSuccess} />
    </div>
  );
}
