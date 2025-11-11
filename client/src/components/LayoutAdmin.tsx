import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function LayoutAdmin({ children }) {
  const [, setLocation] = useLocation();
  const { logout, user } = useAuthStore();

  const menu = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Usuários", path: "/gerenciar-usuarios" },
    { label: "Ônibus", path: "/gerenciar-onibus" },
    { label: "Rotas", path: "/gerenciar-rotas" },
    { label: "Motoristas", path: "/gerenciar-motoristas" },
    { label: "Cobradores", path: "/gerenciar-cobradores" },
    { label: "Relatórios", path: "/relatorios" },
    { label: "Importar Alunos", path: "/importar-alunos" },
  ];

  const logoutHandler = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-4">
        <h1 className="text-xl font-bold text-primary mb-6">RAPTUR ADMIN</h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link href={item.path} key={item.path}>
              <Button variant="ghost" className="w-full justify-start">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-background">
        <div className="flex justify-end mb-4">
          <span className="mr-4">{user?.nome}</span>
          <Button onClick={logoutHandler} variant="outline">Sair</Button>
        </div>

        {children}
      </main>
    </div>
  );
}
