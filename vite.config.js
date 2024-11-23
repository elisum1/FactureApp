import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,        // El puerto donde ejecutas en desarrollo (puedes cambiarlo si es necesario)
    host: true,        // Permite acceder a la app desde la red local
    strictPort: true,  // Asegura que el puerto especificado sea el único utilizado
    hmr: true,         // Hot Module Replacement (HMR) en desarrollo
  },
  build: {
    outDir: 'dist/inventario-app',      // Directorio donde se guardará la build de producción
    minify: 'esbuild',
    emptyOutDir: true,   // Minificación del código (mejor rendimiento)
    sourcemap: true,    // Desactiva los sourcemaps en producción, a menos que los necesites
    target: 'esnext',    // Define el objetivo de compilación (compatible con los navegadores modernos)
    cssCodeSplit: true,  // Divide el CSS en archivos separados
  },
  // Hook para manejar el cierre del servidor (por ejemplo, para asegurarte de liberar recursos)
  onServerClose() {
    console.log('El servidor se ha cerrado y el puerto ha sido liberado.');
    // Aquí puedes agregar lógica para liberar recursos si es necesario
  },
})

