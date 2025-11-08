import { useEffect, useState } from "react";
import { idosoAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, CheckCircle2, XCircle, Printer } from "lucide-react";

export default function AdminIdosos() {
  const [idosos, setIdosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    loadIdosos();
  }, []);

  const loadIdosos = async () => {
    setLoading(true);
    try {
      const response = await idosoAPI.listarSolicitacoes();
      setIdosos(response.data.data || []);
    } catch (error) {
      toast.error("Erro ao carregar solicitações de idosos");
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      await idosoAPI.aprovar(id);
      toast.success("Idoso aprovado com sucesso!");
      loadIdosos();
    } catch {
      toast.error("Erro ao aprovar idoso");
    }
  };

  const handleRejeitar = async (id) => {
    try {
      await idosoAPI.rejeitar(id);
      toast.success("Solicitação rejeitada");
      loadIdosos();
    } catch {
      toast.error("Erro ao rejeitar solicitação");
    }
  };

  const handleUploadFoto = async (id, arquivo) => {
    if (!arquivo) return;
    setUploading(id);
    try {
      await idosoAPI.uploadFoto(id, arquivo);
      toast.success("Foto enviada com sucesso!");
      loadIdosos();
    } catch {
      toast.error("Erro ao enviar foto");
    } finally {
      setUploading(null);
    }
  };

  const handleImprimir = (id) => {
    idosoAPI.imprimirCarteira(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">Gestão de Idosos</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Carteirinha do Idoso</CardTitle>
          </CardHeader>
          <CardContent>
            {idosos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma solicitação pendente
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-muted">
                    <tr className="text-left">
                      <th className="p-3">Nome</th>
                      <th className="p-3">CPF</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Foto</th>
                      <th className="p-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {idosos.map((idoso) => (
                      <tr key={idoso.id} className="border-t">
                        <td className="p-3 font-medium">{idoso.usuario?.nome}</td>
                        <td className="p-3">{idoso.usuario?.cpf}</td>
                        <td className="p-3 capitalize">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              idoso.ativo
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            {idoso.ativo ? "Aprovado" : "Pendente"}
                          </span>
                        </td>

                        {/* Foto */}
                        <td className="p-3">
                          {idoso.fotoUrl ? (
                            <img
                              src={idoso.fotoUrl}
                              alt="Foto do idoso"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleUploadFoto(idoso.id, e.target.files[0])
                                }
                                className="hidden"
                                id={`foto-${idoso.id}`}
                              />
                              <label
                                htmlFor={`foto-${idoso.id}`}
                                className="cursor-pointer text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Upload size={16} />
                                {uploading === idoso.id
                                  ? "Enviando..."
                                  : "Enviar Foto"}
                              </label>
                            </div>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="p-3 text-center space-x-2">
                          {!idoso.ativo && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAprovar(idoso.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle2 size={16} className="mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejeitar(idoso.id)}
                              >
                                <XCircle size={16} className="mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {idoso.ativo && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleImprimir(idoso.id)}
                            >
                              <Printer size={16} className="mr-1" />
                              Imprimir Carteirinha
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
