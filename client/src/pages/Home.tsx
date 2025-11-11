import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Se não tiver token, ir para login
        if (!isAuthenticated) {
          setLocation("/login");
          return;
        }

        // Valida token e obtém perfil
        const res = await authAPI.getProfile();
        const user = res.data?.data;

        if (!user) throw new Error("Usuário inválido");

        setUser(user);

        // Vai para dashboard conforme perfil
        setLocation("/dashboard");
      } catch (error) {
        // Token inválido → força logout
        logout();
        toast.error("Sua sessão expirou! Faça login novamente.");
        setLocation("/login");
      }
    };

    verifySession();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
