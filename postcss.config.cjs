/* Configuração PostCSS para o workspace — ativa Tailwind CSS e Autoprefixer
   Ter este arquivo ajuda algumas ferramentas/editor a reconhecerem as at-rules
   do Tailwind (@tailwind, @layer, @apply) como válidas. */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
