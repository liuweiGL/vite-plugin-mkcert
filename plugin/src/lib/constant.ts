import os from 'node:os'
import path from 'node:path'

export const PKG_NAME = 'vite-plugin-mkcert'

export const PLUGIN_NAME = PKG_NAME.replace(/-/g, ':')

export const PLUGIN_DATA_DIR = path.join(os.homedir(), `.${PKG_NAME}`)
