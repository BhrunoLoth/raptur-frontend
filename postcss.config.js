// postcss.config.js - compatível com Tailwind CSS v4
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ plugin correto do Tailwind v4
    autoprefixer: {},
  },
};
