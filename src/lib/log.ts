import Debug from 'debug'

import { PLUGIN_NAME } from './constant'

type LogType = 'info' | 'error'

const LOG_PREFIX = `${PLUGIN_NAME}:`

const logProxy = (type: LogType, ...args: any[]) => {
  if (typeof args[0] === 'string') {
    args = [LOG_PREFIX + args[0], ...args.slice(1)]
  } else {
    args = [LOG_PREFIX + '%'.repeat(args.length), ...args]
  }
  console[type](...args)
}

/**
 * `vite --debug` will
 */
const debug = Debug(PLUGIN_NAME)

const logger = {
  debug(...args: any) {
    debug.log(...args)
  },
  info(...args: any[]) {
    logProxy('info', ...args)
  },
  error(...args: any[]) {
    logProxy('error', ...args)
  }
}

export default logger
