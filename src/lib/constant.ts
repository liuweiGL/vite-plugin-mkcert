import os from 'os'
import path from 'path'

import pkg from '../../package.json'

export const PLUGIN_NAME = pkg.name

export const PLUGIN_DATA_DIR = path.join(os.homedir(), `.${PLUGIN_NAME}`)
