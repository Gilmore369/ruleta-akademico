import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuración de Vite para el proyecto de la ruleta.
 * Utilizamos el plugin oficial de React para soportar JSX/TSX y habilitar
 * el hot module replacement (HMR) durante el desarrollo.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    target: 'esnext',
  },
});
