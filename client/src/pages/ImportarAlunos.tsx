import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';


export default function ImportarAlunos() {
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  if (user?.perfil !== 'admin') {
    setLocation('/dashboard');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setResultado(null);
    }
  };

  const handleDownloadModelo = async () => {
    try {
      const response = await api.get('/api/alunos/modelo', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'modelo_importacao_alunos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Modelo baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao baixar modelo');
    }
  };

  const handleImportar = async () => {
    if (!arquivo) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    setImportando(true);
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      const response = await api.post('/api/alunos/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResultado(response.data.data);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao importar alunos');
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Importar Alunos Gratuitos</h1>
          <Button variant="outline" onClick={() => setLocation('/dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Como Importar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Baixe o modelo de planilha Excel clicando no botão abaixo</li>
              <li>Preencha a planilha com os dados dos alunos gratuitos</li>
              <li>Salve o arquivo e faça o upload aqui</li>
              <li>O sistema irá criar os usuários automaticamente</li>
            </ol>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Informações importantes:</p>
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                <li>A senha inicial será o CPF do aluno (sem pontos e traços)</li>
                <li>Os alunos devem trocar a senha no primeiro acesso</li>
                <li>CPFs duplicados serão ignorados</li>
                <li>Todos os campos obrigatórios devem ser preenchidos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload do Arquivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleDownloadModelo}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Modelo Excel
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo Excel (.xlsx ou .csv)</Label>
              <Input
                id="arquivo"
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
              />
              {arquivo && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: <strong>{arquivo.name}</strong>
                </p>
              )}
            </div>

            <Button
              onClick={handleImportar}
              disabled={!arquivo || importando}
              className="w-full"
              size="lg"
            >
              {importando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Alunos
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Importação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{resultado.total}</p>
                  <p className="text-sm text-muted-foreground">Total de linhas</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg text-center border border-green-500/20">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{resultado.sucesso.length}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Importados</p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg text-center border border-red-500/20">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">{resultado.erros.length}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Erros</p>
                </div>
              </div>

              {resultado.sucesso.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">✅ Alunos Importados com Sucesso</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Senha Temporária</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultado.sucesso.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.linha}</TableCell>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell>{item.cpf}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell className="font-mono text-xs">{item.senhaTemporaria}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {resultado.erros.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">❌ Erros na Importação</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Erro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultado.erros.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.linha}</TableCell>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell>{item.cpf}</TableCell>
                            <TableCell className="text-red-600 text-sm">{item.erro}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

