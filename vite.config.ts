import { defineConfig } from 'vite'

import pkg from './package.json'
import mkcert from './plugin/index'

export default defineConfig({
  plugins: [mkcert()],
  build: {
    outDir: 'dist',
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: 'plugin/index.ts',
      formats: ['es', 'cjs'],
      name: 'mkcert',
      fileName: format => `mkcert.${format}.js`
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies)
    }
  }
})
