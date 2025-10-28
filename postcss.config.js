// postcss.config.js - Compatível com TailwindCSS v4
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ novo plugin obrigatório na versão 4
    autoprefixer: {},
  },
};
