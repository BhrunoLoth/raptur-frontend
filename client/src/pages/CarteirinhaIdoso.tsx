import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { idosoAPI } from "@/lib/api";
import { toast } from "sonner";

export default function CarteirinhaIdoso() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const [carteirinha, setCarteirinha] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [solicitando, setSolicitando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (user?.perfil !== "passageiro") {
      toast.error("Acesso permitido apenas para passageiros");
      setLocation("/dashboard");
      return;
    }

    loadCarteirinha();
  }, [isAuthenticated]);

  const loadCarteirinha = async () => {
    try {
      const data = await idosoAPI.minha();
      setCarteirinha(data);
    } catch (_err) {
      setCarteirinha(null); // Sem carteirinha ainda
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitar = async () => {
    setSolicitando(true);
    try {
      const data = await idosoAPI.solicitar();
      setCarteirinha(data);
      toast.success("Solicitação enviada com sucesso!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao solicitar carteirinha");
    } finally {
      setSolicitando(false);
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

  // Se não tiver carteirinha ainda
  if (!carteirinha) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">Carteirinha do Idoso</h1>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Voltar
            </Button>
          </div>
        </header>

        <main className="container py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Solicitar Carteirinha do Idoso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground text-center">
                  Clique no botão abaixo para solicitar sua carteirinha
                </p>

                <Button
                  onClick={handleSolicitar}
                  className="w-full"
                  size="lg"
                  disabled={solicitando}
                >
                  {solicitando ? "Enviando..." : "Solicitar Carteirinha"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Carteirinha do Idoso</h1>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">CARTEIRINHA DO IDOSO</h2>
                  <p className="text-sm opacity-90">Gratuidade no Transporte Público</p>
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
                    {new Date(carteirinha.dataValidade).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-primary-foreground/20">
                <div>
                  <p className="text-xs opacity-75">Emissão</p>
                  <p className="text-sm font-medium">
                    {new Date(carteirinha.dataEmissao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    carteirinha.ativo ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {carteirinha.ativo ? "ATIVA" : "INATIVA"}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <QRCodeDisplay
              value={carteirinha.qrCode}
              title="QR Code da Carteirinha"
              size={220}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
