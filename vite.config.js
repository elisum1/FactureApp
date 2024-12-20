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
    outDir: 'dist',               // Directorio donde se guardará la build de producción
    minify: 'esbuild',            // Minificación del código
    emptyOutDir: true,            // Limpia el directorio de salida antes de construir
    sourcemap: false,             // Desactiva los sourcemaps en producción
    target: 'esnext',             // Objetivo de compilación para navegadores modernos
    cssCodeSplit: true,           // Divide el CSS en archivos separados
    rollupOptions: {
      input: '/index.html',       // Asegura que la entrada sea el archivo correcto
    },
  },
  resolve: {
    alias: {
      '@': '/src',                // Alias para rutas más limpias en tu proyecto
    },
  },
  base: './',                     // Asegura rutas relativas para desplegar en entornos como Vercel
  // Este es para solucionar problemas relacionados con el tipo MIME en Vercel.
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',           // Asegura que la aplicación se construya con ESNext para compatibilidad
    },
  },
});
