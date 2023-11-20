import { defineConfig } from 'vite'
import path from 'path'

import mkcert from '..'

export default defineConfig({
  root: __dirname,
  plugins: [
    mkcert({
      source: 'coding',
      savePath: path.resolve(process.cwd(), 'node_modules/.mkcert')
    })
  ]
})
