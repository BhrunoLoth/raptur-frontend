import React from "react";
import Sidebar from "./Sidebar";
import SidebarMotorista from "./SidebarMotorista";
import SidebarPassageiro from "./SidebarPassageiro";

export default function ProtectedLayout({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const perfil = usuario?.perfil;

  let SidebarComponent = Sidebar;
  if (perfil === "motorista") SidebarComponent = SidebarMotorista;
  else if (perfil === "passageiro" || perfil === "usuario") SidebarComponent = SidebarPassageiro;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarComponent onLogout={handleLogout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
