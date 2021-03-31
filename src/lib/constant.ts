import os from 'os'
import path from 'path'

import pkg from '../../package.json'

export const PKG_NAME = pkg.name

export const PLUGIN_NAME = PKG_NAME.replace('-', ':')

export const PLUGIN_DATA_DIR = path.join(os.homedir(), `.${PKG_NAME}`)
