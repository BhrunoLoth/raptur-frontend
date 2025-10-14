import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true, // Permite acesso via localhost, 127.0.0.1 e rede local
    port: 5173, // Porta padrão do Vite
    strictPort: true, // Impede trocar de porta automaticamente
    open: true, // Abre o navegador automaticamente ao iniciar
    proxy: {
      "/api": {
        target: "http://localhost:3000", // URL do backend local
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },

  build: {
    outDir: "dist", // Pasta de saída do build
    emptyOutDir: true,
    sourcemap: false,
    assetsDir: "static", // Organização dos assets para evitar conflitos
    rollupOptions: {
      output: {
        entryFileNames: "static/[name]-[hash].js",
        chunkFileNames: "static/[name]-[hash].js",
        assetFileNames: "static/[name]-[hash][extname]",
      },
    },
  },

  preview: {
    port: 5173,
    strictPort: true,
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
  },
});
