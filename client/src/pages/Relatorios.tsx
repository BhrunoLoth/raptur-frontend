import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function Relatorios() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [tipoRelatorio, setTipoRelatorio] = useState('embarques');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.perfil !== 'admin') {
      setLocation('/dashboard');
      return;
    }
    // Definir datas padrão (últimos 30 dias)
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(trintaDiasAtras.toISOString().split('T')[0]);
  }, [isAuthenticated, user]);

  const gerarRelatorio = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/relatorios/${tipoRelatorio}`, {
        params: { dataInicio, dataFim },
      });
      setDados(response.data.data.registros || []);
      setResumo(response.data.data.resumo || null);
      toast.success('Relatório gerado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao gerar relatório');
      setDados([]);
      setResumo(null);
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (dados.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const headers = Object.keys(dados[0]).join(',');
    const rows = dados.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Relatório exportado com sucesso!');
  };

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
            <h1 className="text-2xl font-bold text-primary">Relatórios</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerar Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoRelatorio">Tipo de Relatório</Label>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="embarques">Embarques</SelectItem>
                    <SelectItem value="receitas">Receitas</SelectItem>
                    <SelectItem value="viagens">Viagens</SelectItem>
                    <SelectItem value="usuarios">Usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>&nbsp;</Label>
                <Button onClick={gerarRelatorio} disabled={loading} className="w-full">
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        {resumo && (
          <div className="grid gap-6 md:grid-cols-4 mb-6">
            {Object.entries(resumo).map(([key, value]: [string, any]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {typeof value === 'number' && key.toLowerCase().includes('receita')
                      ? `R$ ${value.toFixed(2)}`
                      : value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabela de Dados */}
        {dados.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resultados</CardTitle>
              <Button variant="outline" onClick={exportarCSV}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(dados[0]).map((key) => (
                        <TableHead key={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dados.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <TableCell key={i}>
                            {typeof value === 'number' && Object.keys(row)[i].toLowerCase().includes('valor')
                              ? `R$ ${value.toFixed(2)}`
                              : typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
                              ? new Date(value).toLocaleDateString('pt-BR')
                              : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Total de registros: {dados.length}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vazio */}
        {!loading && dados.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-muted-foreground">
                  Selecione os filtros e clique em "Gerar Relatório"
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

