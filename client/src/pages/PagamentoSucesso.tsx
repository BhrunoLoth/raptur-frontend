import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function PagamentoSucesso() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center border border-green-100">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4 animate-bounce" />

        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Pagamento Confirmado!
        </h1>
        <p className="text-gray-600 mb-6">
          Sua recarga foi processada com sucesso ✅  
          O saldo será atualizado automaticamente.
        </p>

        <Link
          href="/passageiro"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          Ir para o painel
        </Link>
      </div>
    </div>
  );
}
