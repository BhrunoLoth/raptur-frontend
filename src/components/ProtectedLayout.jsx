import Sidebar from "./Sidebar";
import SidebarMotorista from "./SidebarMotorista";
import SidebarPassageiro from "./SidebarPassageiro";

export default function ProtectedLayout({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const perfil = usuario?.perfil;

  let SidebarComponent = null;

  // Decida explicitamente qual sidebar usar!
  if (perfil === "admin") SidebarComponent = Sidebar;
  else if (perfil === "motorista") SidebarComponent = SidebarMotorista;
  else if (perfil === "passageiro" || perfil === "usuario") SidebarComponent = SidebarPassageiro;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (!SidebarComponent) {
    // Se não tem perfil, não renderiza nada até ter!
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarComponent onLogout={handleLogout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
