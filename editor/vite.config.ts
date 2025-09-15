import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/editor/',   // 👈 importante
  build: {
    outDir: '../editor-dist', // Construye en la carpeta raíz
    emptyOutDir: true
  }
})
