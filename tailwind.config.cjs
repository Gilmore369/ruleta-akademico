/*
 * Configuración de Tailwind para el proyecto Ruleta Akadémico.
 * Definimos una paleta de colores coherente con la marca de Akadémico
 * y habilitamos el análisis de todos los archivos fuente relevantes.
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        akademico: {
          /**
           * Colores primarios de la marca Akadémico. Puedes ajustar los
           * valores hexadecimales para alinearlos con la identidad visual
           * corporativa definitiva.
           */
          primary: '#0144A6',
          secondary: '#0070F3',
          accent: '#FFC107',
        },
      },
    },
  },
  plugins: [],
};
