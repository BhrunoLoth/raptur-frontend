import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Onibus {
  id: string;
  placa: string;
  modelo: string;
  capacidade: number;
  anoFabricacao: number;
  ativo: boolean;
  createdAt: string;
}

export default function GerenciarOnibus() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOnibus, setEditingOnibus] = useState<Onibus | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    capacidade: 40,
    anoFabricacao: new Date().getFullYear(),
  });

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'admin') {
      setLocation('/dashboard');
      return;
    }
    loadOnibus();
  }, [isAuthenticated, user]);

  const loadOnibus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/onibus');
      setOnibus(response.data.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar ônibus');
      setOnibus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (bus?: Onibus) => {
    if (bus) {
      setEditingOnibus(bus);
      setFormData({
        placa: bus.placa,
        modelo: bus.modelo,
        capacidade: bus.capacidade,
        anoFabricacao: bus.anoFabricacao,
      });
    } else {
      setEditingOnibus(null);
      setFormData({
        placa: '',
        modelo: '',
        capacidade: 40,
        anoFabricacao: new Date().getFullYear(),
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingOnibus) {
        await api.put(`/api/onibus/${editingOnibus.id}`, formData);
        toast.success('Ônibus atualizado com sucesso!');
      } else {
        await api.post('/api/onibus', formData);
        toast.success('Ônibus cadastrado com sucesso!');
      }
      setDialogOpen(false);
      loadOnibus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar ônibus');
    }
  };

  const handleToggleStatus = async (bus: Onibus) => {
    try {
      await api.put(`/api/onibus/${bus.id}`, {
        ativo: !bus.ativo,
      });
      toast.success(`Ônibus ${bus.ativo ? 'desativado' : 'ativado'} com sucesso!`);
      loadOnibus();
    } catch (error: any) {
      toast.error('Erro ao alterar status do ônibus');
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
            <h1 className="text-2xl font-bold text-primary">Gerenciar Ônibus</h1>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Ônibus
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Frota de Ônibus</CardTitle>
          </CardHeader>
          <CardContent>
            {onibus.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-muted-foreground">Nenhum ônibus cadastrado</p>
                <Button className="mt-4" onClick={() => handleOpenDialog()}>
                  Cadastrar Primeiro Ônibus
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {onibus.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-medium font-mono">{bus.placa}</TableCell>
                      <TableCell>{bus.modelo}</TableCell>
                      <TableCell>{bus.capacidade} passageiros</TableCell>
                      <TableCell>{bus.anoFabricacao}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bus.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bus.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(bus)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={bus.ativo ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(bus)}
                        >
                          {bus.ativo ? 'Desativar' : 'Ativar'}
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

      {/* Dialog para Criar/Editar Ônibus */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingOnibus ? 'Editar Ônibus' : 'Novo Ônibus'}
            </DialogTitle>
            <DialogDescription>
              {editingOnibus
                ? 'Atualize as informações do ônibus'
                : 'Preencha os dados para cadastrar um novo ônibus'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                placeholder="ABC-1234 ou ABC1D23"
                maxLength={8}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Mercedes-Benz OF-1721"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacidade">Capacidade (passageiros)</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) || 0 })}
                min={1}
                max={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anoFabricacao">Ano de Fabricação</Label>
              <Input
                id="anoFabricacao"
                type="number"
                value={formData.anoFabricacao}
                onChange={(e) => setFormData({ ...formData, anoFabricacao: parseInt(e.target.value) || new Date().getFullYear() })}
                min={1990}
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingOnibus ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

