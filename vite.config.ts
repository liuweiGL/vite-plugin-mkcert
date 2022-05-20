import { defineConfig } from 'vite'

import mkcert from './plugin/index'

import pkg from './package.json'

console.log( Object.keys(pkg.dependencies))
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
