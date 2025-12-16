import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ⬇⬇⬇ KLJUČNO ZA VERCEL + PWA
  base: '/',

  // opcionalno (ali dobro)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})