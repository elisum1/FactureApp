import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,        // El puerto donde ejecutas en desarrollo (puedes cambiarlo si es necesario)
    host: true,        // Permite acceder a la app desde la red local
    strictPort: true,  // Asegura que el puerto especificado sea el único utilizado
    hmr: true,         // Hot Module Replacement (HMR) en desarrollo
  },
  build: {
    outDir: 'dist/inventario-app', // Directorio donde se guardará la build de producción
    minify: 'esbuild',            // Minificación del código
    emptyOutDir: true,            // Limpia el directorio de salida antes de construir
    sourcemap: false,             // Desactiva los sourcemaps en producción
    target: 'esnext',             // Objetivo de compilación para navegadores modernos
    cssCodeSplit: true,           // Divide el CSS en archivos separados
  },
  onServerClose() {
    console.log('El servidor se ha cerrado y el puerto ha sido liberado.');
    // Aquí puedes agregar lógica para liberar recursos si es necesario
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para rutas más limpias en tu proyecto
    },
  },
  base: './', // Asegura rutas relativas para desplegar en entornos como Vercel
});
