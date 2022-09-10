import { defineConfig } from 'vite'

import mkcert from '../plugin/index'

export default defineConfig({
  root: __dirname,
  plugins: [mkcert()]
})
