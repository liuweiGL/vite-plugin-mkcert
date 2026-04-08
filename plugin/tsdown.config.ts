import { resolve } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: resolve(import.meta.dirname, './src/index.ts'),
    outDir: resolve(import.meta.dirname, '../dist'),
    clean: true,
    exports: true,
    dts: true,
    minify: false,
    platform: 'node',
    format: ['cjs', 'es']
})
