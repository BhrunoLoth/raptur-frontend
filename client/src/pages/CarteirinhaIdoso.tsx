import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { idosoAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function CarteirinhaIdoso() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [carteirinha, setCarteirinha] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [solicitando, setSolicitando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/dashboard');
      return;
    }
    loadCarteirinha();
  }, [isAuthenticated]);

  const loadCarteirinha = async () => {
    try {
      const response = await idosoAPI.minha();
      setCarteirinha(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Não tem carteirinha ainda
        setCarteirinha(null);
      } else {
        toast.error('Erro ao carregar carteirinha');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitar = async () => {
    setSolicitando(true);
    try {
      const response = await idosoAPI.solicitar();
      setCarteirinha(response.data.data);
      toast.success('Carteirinha gerada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao gerar carteirinha');
    } finally {
      setSolicitando(false);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Carteirinha do Idoso</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {!carteirinha ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Solicitar Carteirinha do Idoso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-6 rounded-lg space-y-3">
                  <h3 className="font-semibold text-lg">Requisitos:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Ter 65 anos ou mais</li>
                    <li>Cadastro completo no sistema</li>
                    <li>Documento de identidade válido</li>
                  </ul>
                </div>

                <div className="bg-secondary/10 p-6 rounded-lg space-y-3">
                  <h3 className="font-semibold text-lg text-secondary">Benefícios:</h3>
                  <ul className="space-y-2 text-sm list-disc list-inside">
                    <li>Gratuidade no transporte público</li>
                    <li>1 viagem gratuita por dia por ônibus</li>
                    <li>Validade de 5 anos</li>
                    <li>QR Code para embarque rápido</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSolicitar}
                  className="w-full"
                  size="lg"
                  disabled={solicitando}
                >
                  {solicitando ? 'Gerando Carteirinha...' : 'Solicitar Carteirinha'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Carteirinha Visual */}
            <Card className="bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">CARTEIRINHA DO IDOSO</h2>
                    <p className="text-sm opacity-90">Gratuidade no Transporte Público</p>
                  </div>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Nome</p>
                    <p className="font-semibold text-lg">{carteirinha.usuario?.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">CPF</p>
                    <p className="font-semibold">{carteirinha.usuario?.cpf}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Número</p>
                    <p className="font-semibold">{carteirinha.numeroCarteirinha}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Validade</p>
                    <p className="font-semibold">
                      {new Date(carteirinha.dataValidade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary-foreground/20">
                  <div>
                    <p className="text-xs opacity-75">Emissão</p>
                    <p className="text-sm font-medium">
                      {new Date(carteirinha.dataEmissao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    carteirinha.ativo ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {carteirinha.ativo ? 'ATIVA' : 'INATIVA'}
                  </div>
                </div>
              </div>
            </Card>

            {/* QR Code */}
            <div className="grid gap-6 md:grid-cols-2">
              <QRCodeDisplay
                value={carteirinha.qrCode}
                title="QR Code da Carteirinha"
                size={220}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Como Usar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Ao embarcar, mostre o QR Code ao cobrador</li>
                    <li>O cobrador irá escanear o código</li>
                    <li>Embarque será validado automaticamente</li>
                    <li>Você tem direito a 1 viagem gratuita por dia por ônibus</li>
                  </ol>
                  <div className="bg-muted p-3 rounded-lg mt-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Importante:</strong> Mantenha sua carteirinha sempre atualizada.
                      Em caso de perda, solicite uma nova.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

