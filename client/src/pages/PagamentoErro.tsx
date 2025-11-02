import { XCircle } from "lucide-react";
import { Link } from "wouter";

export default function PagamentoErro() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-red-50 to-white">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center border border-red-100">
        <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />

        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Falha no Pagamento
        </h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro ao processar sua recarga ❌  
          Tente novamente mais tarde.
        </p>

        <Link
          href="/passageiro"
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
        >
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
