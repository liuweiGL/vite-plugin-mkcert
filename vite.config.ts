import { defineConfig } from 'vite'

import mkcert from '.'

export default defineConfig({
  plugins: [mkcert()]
})
