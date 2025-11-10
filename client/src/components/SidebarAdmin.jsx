import { NavLink } from "wouter";
import {
  LayoutDashboard,
  Users,
  BusFront,
  Route,
  UserCog,
  FileText,
  Upload,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function SidebarAdmin() {
  const { logout } = useAuthStore();

  const links = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gerenciar-usuarios", label: "Usuários", icon: Users },
    { href: "/gerenciar-onibus", label: "Ônibus", icon: BusFront },
    { href: "/gerenciar-rotas", label: "Rotas", icon: Route },
    { href: "/gerenciar-motoristas", label: "Motoristas", icon: UserCheck },
    { href: "/gerenciar-cobradores", label: "Cobradores", icon: UserCog },
    { href: "/relatorios", label: "Relatórios", icon: FileText },
    { href: "/importar-alunos", label: "Importar Alunos", icon: Upload },
    // ✅ Novo item — Gestão de Idosos
    { href: "/admin/idosos", label: "Gestão de Idosos", icon: UserCog },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <h1 className="text-lg font-bold text-green-700 mb-6 text-center">
        RAPTUR ADMIN
      </h1>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <NavLink key={href} href={href} className="block">
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-800 font-semibold"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-auto flex items-center gap-2 text-red-600 hover:text-red-800 transition"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
