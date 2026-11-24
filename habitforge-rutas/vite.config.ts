import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Nombres de chunk legibles para mostrarlos en la exposición (Network / dist/assets)
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks: (id) => (id.includes('recharts') || id.includes('d3-') ? 'vendor-graficas' : undefined),
      },
    },
  },
})
