import path from 'node:path'
import { defineConfig } from 'vite'

import mkcert from '..'

export default defineConfig({
  root: __dirname,
  plugins: [
    mkcert({
      source: 'coding',
      savePath: path.resolve(process.cwd(), '.mkcert')
    })
  ]
})
