import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// use import.meta.url with URL to compute file paths without importing Node 'path' (avoids needing @types/node)
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
  // fileURLToPath converts the file URL to a Windows-safe absolute path (no leading slash)
  'three/webgpu': fileURLToPath(new URL('./src/shims/three-webgpu.js', import.meta.url)),
  'three/tsl': fileURLToPath(new URL('./src/shims/three-tsl.js', import.meta.url))
    }
  }
})
