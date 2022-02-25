import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [mkcert()]
})
