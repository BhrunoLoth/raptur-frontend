import React from "react";
import SidebarMotorista from "./SidebarMotorista";

export default function LayoutMotorista({ children, onLogout }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0ffef 0%, #ffe6c3 100%)"
    }}>
      <SidebarMotorista onLogout={onLogout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
