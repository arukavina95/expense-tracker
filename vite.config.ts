import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Generiši hash u imenima fajlova za cache busting
    rollupOptions: {
      output: {
        // Dodaj hash u imena fajlova
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Cache control za development server
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  // Cache control za production preview
  preview: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  }
})
