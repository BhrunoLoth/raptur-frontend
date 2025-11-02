import { Clock } from "lucide-react";
import { Link } from "wouter";

export default function PagamentoPendente() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-yellow-50 to-white">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center border border-yellow-100">
        <Clock className="w-20 h-20 text-yellow-600 mx-auto mb-4 animate-spin-slow" />

        <h1 className="text-2xl font-bold text-yellow-700 mb-2">
          Pagamento Pendente
        </h1>
        <p className="text-gray-600 mb-6">
          Aguardando confirmação do PIX ⏳  
          Isso pode levar alguns segundos.
        </p>

        <Link
          href="/passageiro"
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition"
        >
          Ir para o painel
        </Link>
      </div>
    </div>
  );
}
