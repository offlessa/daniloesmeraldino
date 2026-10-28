import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seo } from './seo'

export default defineConfig({
  plugins: [react(), seo()],
  server: {
    port: 5173,
    open: true,
  },
})
