import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Cobrador {
  id: string;
  usuarioId: string;
  ativo: boolean;
  usuario: {
    nome: string;
    cpf: string;
    telefone: string;
  };
}

export default function GerenciarCobradores() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [cobradores, setCobradores] = useState<Cobrador[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState('');

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
      const [cobradoresRes, usuariosRes] = await Promise.all([
        api.get('/cobradores'),
        api.get('/usuarios?perfil=cobrador'),
      ]);
      setCobradores(cobradoresRes.data.data || []);
      setUsuarios(usuariosRes.data.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedUsuarioId('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await api.post('/cobradores', { usuarioId: selectedUsuarioId });
      toast.success('Cobrador cadastrado com sucesso!');
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar cobrador');
    }
  };

  const handleToggleStatus = async (cobrador: Cobrador) => {
    try {
      await api.put(`/cobradores/${cobrador.id}`, {
        ativo: !cobrador.ativo,
      });
      toast.success(`Cobrador ${cobrador.ativo ? 'desativado' : 'ativado'} com sucesso!`);
      loadData();
    } catch (error: any) {
      toast.error('Erro ao alterar status do cobrador');
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
            <h1 className="text-2xl font-bold text-primary">Gerenciar Cobradores</h1>
          </div>
          <Button onClick={handleOpenDialog}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Cobrador
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cobradores Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {cobradores.length === 0 ? (
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
                <p className="text-muted-foreground">Nenhum cobrador cadastrado</p>
                <Button className="mt-4" onClick={handleOpenDialog}>
                  Cadastrar Primeiro Cobrador
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cobradores.map((cobrador) => (
                    <TableRow key={cobrador.id}>
                      <TableCell className="font-medium">{cobrador.usuario.nome}</TableCell>
                      <TableCell>{cobrador.usuario.cpf}</TableCell>
                      <TableCell>{cobrador.usuario.telefone}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cobrador.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cobrador.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant={cobrador.ativo ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(cobrador)}
                        >
                          {cobrador.ativo ? 'Desativar' : 'Ativar'}
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

      {/* Dialog para Criar Cobrador */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Cobrador</DialogTitle>
            <DialogDescription>
              Vincule um usuário como cobrador do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="usuarioId">Usuário</Label>
              <Select
                value={selectedUsuarioId}
                onValueChange={setSelectedUsuarioId}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!selectedUsuarioId}>
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

