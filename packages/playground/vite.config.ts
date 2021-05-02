import { defineConfig } from 'vite'
import VitePluginCertificate from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: false,
    https: true
  },
  plugins: [
    VitePluginCertificate({
      source: 'coding'
    })
  ]
})
