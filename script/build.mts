import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { buildSync, Format } from 'esbuild'

import pkg from '../package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const WORKSPACE = path.resolve(__dirname, '..')

const OUTDIR = path.resolve(WORKSPACE, 'dist')

fs.rmSync(OUTDIR, {
  force: true,
  recursive: true
})

const build = (format: Format) => {
  buildSync({
    entryNames: `mkcert`,
    entryPoints: [path.resolve(WORKSPACE, 'plugin/index.ts')],
    format: format,
    platform: 'node',
    sourcemap: true,
    bundle: true,
    write: true,
    minify: false,
    outdir: OUTDIR,
    outExtension: {
      ['.js']: format === 'esm' ? '.mjs' : '.js'
    },
    external: Object.keys(pkg.dependencies)
  })
}

const formats: Format[] = ['cjs', 'esm']

for (const format of formats) {
  build(format)
}

execSync('tsc -p tsconfig.build.json')
