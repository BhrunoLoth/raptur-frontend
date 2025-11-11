import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Rota {
  id: string;
  nome: string;
  origem: string;
  destino: string;
  distanciaKm: number;
  tempoEstimado: number;
  pontos: string[];
  ativa: boolean;
  createdAt: string;
}

export default function GerenciarRotas() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRota, setEditingRota] = useState<Rota | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    origem: '',
    destino: '',
    distanciaKm: 0,
    tempoEstimado: 0,
    pontos: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'admin') {
      setLocation('/dashboard');
      return;
    }
    loadRotas();
  }, [isAuthenticated, user]);

  const loadRotas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rotas');
      setRotas(response.data.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar rotas');
      setRotas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (rota?: Rota) => {
    if (rota) {
      setEditingRota(rota);
      setFormData({
        nome: rota.nome,
        origem: rota.origem,
        destino: rota.destino,
        distanciaKm: rota.distanciaKm,
        tempoEstimado: rota.tempoEstimado,
        pontos: rota.pontos.join(', '),
      });
    } else {
      setEditingRota(null);
      setFormData({
        nome: '',
        origem: '',
        destino: '',
        distanciaKm: 0,
        tempoEstimado: 0,
        pontos: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        pontos: formData.pontos.split(',').map(p => p.trim()).filter(p => p),
      };
      
      if (editingRota) {
        await api.put(`/rotas/${editingRota.id}`, data);
        toast.success('Rota atualizada com sucesso!');
      } else {
        await api.post('/rotas', data);
        toast.success('Rota cadastrada com sucesso!');
      }
      setDialogOpen(false);
      loadRotas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar rota');
    }
  };

  const handleToggleStatus = async (rota: Rota) => {
    try {
      await api.put(`/rotas/${rota.id}`, {
        ativa: !rota.ativa,
      });
      toast.success(`Rota ${rota.ativa ? 'desativada' : 'ativada'} com sucesso!`);
      loadRotas();
    } catch (error: any) {
      toast.error('Erro ao alterar status da rota');
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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLocation('/dashboard')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Gerenciar Rotas</h1>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Rota
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Rotas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            {rotas.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-muted-foreground mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-muted-foreground">Nenhuma rota cadastrada</p>
                <Button className="mt-4" onClick={() => handleOpenDialog()}>
                  Cadastrar Primeira Rota
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Origem → Destino</TableHead>
                    <TableHead>Distância</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotas.map((rota) => (
                    <TableRow key={rota.id}>
                      <TableCell className="font-medium">{rota.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{rota.origem}</span>
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span>{rota.destino}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rota.distanciaKm} km</TableCell>
                      <TableCell>{rota.tempoEstimado} min</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rota.ativa
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rota.ativa ? 'Ativa' : 'Inativa'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(rota)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={rota.ativa ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(rota)}
                        >
                          {rota.ativa ? 'Desativar' : 'Ativar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog para Criar/Editar Rota */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingRota ? 'Editar Rota' : 'Nova Rota'}
            </DialogTitle>
            <DialogDescription>
              {editingRota
                ? 'Atualize as informações da rota'
                : 'Preencha os dados para cadastrar uma nova rota'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Rota</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Linha 01 - Centro/Bairro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="origem">Origem</Label>
                <Input
                  id="origem"
                  value={formData.origem}
                  onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                  placeholder="Terminal Central"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destino">Destino</Label>
                <Input
                  id="destino"
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  placeholder="Bairro São João"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="distanciaKm">Distância (km)</Label>
                <Input
                  id="distanciaKm"
                  type="number"
                  step="0.1"
                  value={formData.distanciaKm}
                  onChange={(e) => setFormData({ ...formData, distanciaKm: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tempoEstimado">Tempo Estimado (min)</Label>
                <Input
                  id="tempoEstimado"
                  type="number"
                  value={formData.tempoEstimado}
                  onChange={(e) => setFormData({ ...formData, tempoEstimado: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pontos">Pontos de Parada (separados por vírgula)</Label>
              <Textarea
                id="pontos"
                value={formData.pontos}
                onChange={(e) => setFormData({ ...formData, pontos: e.target.value })}
                placeholder="Praça Central, Escola Municipal, Hospital, Shopping"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingRota ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

