import { defineConfig } from 'vite'

import mkcert from '..'

export default defineConfig({
  root: __dirname,
  plugins: [mkcert()]
})
