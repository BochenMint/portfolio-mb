import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5190,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        v1: 'v1.html',
        v2: 'v2.html',
        v3: 'v3.html',
        v4: 'v4.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})