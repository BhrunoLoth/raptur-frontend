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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Motorista {
  id: string;
  usuarioId: string;
  cnh: string;
  categoriaCNH: string;
  validadeCNH: string;
  ativo: boolean;
  usuario: {
    nome: string;
    cpf: string;
    telefone: string;
  };
}

export default function GerenciarMotoristas() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(null);
  const [formData, setFormData] = useState({
    usuarioId: '',
    cnh: '',
    categoriaCNH: 'D',
    validadeCNH: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'admin') {
      setLocation('/dashboard');
      return;
    }
    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [motoristasRes, usuariosRes] = await Promise.all([
        api.get('/api/motoristas'),
        api.get('/api/usuarios?perfil=motorista'),
      ]);
      setMotoristas(motoristasRes.data.data || []);
      setUsuarios(usuariosRes.data.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (motorista?: Motorista) => {
    if (motorista) {
      setEditingMotorista(motorista);
      setFormData({
        usuarioId: motorista.usuarioId,
        cnh: motorista.cnh,
        categoriaCNH: motorista.categoriaCNH,
        validadeCNH: motorista.validadeCNH.split('T')[0],
      });
    } else {
      setEditingMotorista(null);
      setFormData({
        usuarioId: '',
        cnh: '',
        categoriaCNH: 'D',
        validadeCNH: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingMotorista) {
        await api.put(`/api/motoristas/${editingMotorista.id}`, formData);
        toast.success('Motorista atualizado com sucesso!');
      } else {
        await api.post('/api/motoristas', formData);
        toast.success('Motorista cadastrado com sucesso!');
      }
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar motorista');
    }
  };

  const handleToggleStatus = async (motorista: Motorista) => {
    try {
      await api.put(`/api/motoristas/${motorista.id}`, {
        ativo: !motorista.ativo,
      });
      toast.success(`Motorista ${motorista.ativo ? 'desativado' : 'ativado'} com sucesso!`);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao alterar status do motorista');
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
            <h1 className="text-2xl font-bold text-primary">Gerenciar Motoristas</h1>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Motorista
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Motoristas Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {motoristas.length === 0 ? (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-muted-foreground">Nenhum motorista cadastrado</p>
                <Button className="mt-4" onClick={() => handleOpenDialog()}>
                  Cadastrar Primeiro Motorista
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>CNH</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Validade CNH</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motoristas.map((motorista) => (
                    <TableRow key={motorista.id}>
                      <TableCell className="font-medium">{motorista.usuario.nome}</TableCell>
                      <TableCell>{motorista.usuario.cpf}</TableCell>
                      <TableCell className="font-mono">{motorista.cnh}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {motorista.categoriaCNH}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(motorista.validadeCNH).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            motorista.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {motorista.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(motorista)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={motorista.ativo ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(motorista)}
                        >
                          {motorista.ativo ? 'Desativar' : 'Ativar'}
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

      {/* Dialog para Criar/Editar Motorista */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMotorista ? 'Editar Motorista' : 'Novo Motorista'}
            </DialogTitle>
            <DialogDescription>
              {editingMotorista
                ? 'Atualize as informações do motorista'
                : 'Vincule um usuário como motorista'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="usuarioId">Usuário</Label>
              <Select
                value={formData.usuarioId}
                onValueChange={(value) => setFormData({ ...formData, usuarioId: value })}
                disabled={!!editingMotorista}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.nome} - {usuario.cpf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnh">CNH</Label>
              <Input
                id="cnh"
                value={formData.cnh}
                onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                placeholder="00000000000"
                maxLength={11}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoriaCNH">Categoria CNH</Label>
              <Select
                value={formData.categoriaCNH}
                onValueChange={(value) => setFormData({ ...formData, categoriaCNH: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D">D - Ônibus</SelectItem>
                  <SelectItem value="E">E - Ônibus com reboque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validadeCNH">Validade da CNH</Label>
              <Input
                id="validadeCNH"
                type="date"
                value={formData.validadeCNH}
                onChange={(e) => setFormData({ ...formData, validadeCNH: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingMotorista ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

