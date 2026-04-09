import child_process, { type ExecOptions } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import util from 'node:util'

import { error_log } from './logger'

/**
 * Check if file exists
 *
 * @param filePath file path
 * @returns does the file exist
 */
export const exists = async (filePath: string) => {
  try {
    await fs.promises.access(filePath)
    return true
  } catch (_error) {
    return false
  }
}

export const mkdir = async (dirname: string) => {
  const isExist = await exists(dirname)

  if (!isExist) {
    await fs.promises.mkdir(dirname, { recursive: true })
  }
}

export const ensureDirExist = async (filePath: string, strip = false) => {
  const dirname = strip ? path.dirname(filePath) : filePath
  await mkdir(dirname)
}

export const readFile = async (filePath: string) => {
  const isExist = await exists(filePath)
  return isExist ? (await fs.promises.readFile(filePath)).toString() : undefined
}

export const writeFile = async (
  filePath: string,
  data: string | Uint8Array
) => {
  await ensureDirExist(filePath, true)
  await fs.promises.writeFile(filePath, data)
  await fs.promises.chmod(filePath, 0o777)
}

export const readDir = async (source: string) => {
  return fs.promises.readdir(source)
}

export const copyDir = async (source: string, dest: string) => {
  try {
    await fs.promises.cp(source, dest, {
      recursive: true
    })
  } catch (error: any) {
    error_log('Failed to copy directory from %s to %s: %o', source, dest, error)
  }
}

export const exec = async (cmd: string, options?: ExecOptions) => {
  return util.promisify(child_process.exec)(cmd, options)
}

type AnyFn = (...args: any[]) => void

export type ThrottledFn<T extends AnyFn> = ((...args: Parameters<T>) => void) & {
  cancel: () => void
  flush: () => void
}

export const throttle = <T extends AnyFn>(
  fn: T,
  wait = 300
): ThrottledFn<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let lastInvokeTime = 0
  let pendingArgs: Parameters<T> | undefined

  const invoke = (args: Parameters<T>) => {
    lastInvokeTime = Date.now()
    fn(...args)
  }

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    const elapsed = now - lastInvokeTime
    const remaining = wait - elapsed

    pendingArgs = args

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
      }

      invoke(args)
      pendingArgs = undefined
      return
    }

    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = undefined

        if (!pendingArgs) {
          return
        }

        invoke(pendingArgs)
        pendingArgs = undefined
      }, remaining)
    }
  }) as ThrottledFn<T>

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    pendingArgs = undefined
  }

  throttled.flush = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    if (!pendingArgs) {
      return
    }

    invoke(pendingArgs)
    pendingArgs = undefined
  }

  return throttled
}

/**
 * http://nodejs.cn/api/os/os_networkinterfaces.html
 */
const isIPV4 = (family: string | number) => {
  return family === 'IPv4' || family === 4
}

const isIPV6 = (family: string | number) => {
  return family === 'IPv6' || family === 6
}

const getLocalIps = (matcher: (family: string | number) => boolean) => {
  const interfaceDict = os.networkInterfaces()
  const addresses = new Set<string>()

  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key]
    if (interfaces) {
      for (const item of interfaces) {
        if (matcher(item.family)) {
          addresses.add(item.address)
        }
      }
    }
  }

  return Array.from(addresses)
}

export const getLocalV4Ips = () => {
  return getLocalIps(isIPV4)
}

export const getLocalV6Ips = () => {
  return getLocalIps(isIPV6)
    .map(ip => {
      // Strip scope id (e.g. %en0) to avoid invalid SAN entries.
      return ip.split('%')[0]
    })
    .filter(Boolean)
}

export const getDefaultHosts = () => {
  return ['localhost', '::1', ...getLocalV4Ips(), ...getLocalV6Ips()]
}

export const getHash = async (filePath: string) => {
  const content = await readFile(filePath)

  if (content) {
    const hash = crypto.createHash('sha256')
    hash.update(content)
    return hash.digest('hex')
  }

  return undefined
}

const isObj = (obj: any) =>
  Object.prototype.toString.call(obj) === '[object Object]'

const mergeObj = (target: any, source: any) => {
  if (!(isObj(target) && isObj(source))) {
    return target
  }

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const targetValue = target[key]
      const sourceValue = source[key]

      if (isObj(targetValue) && isObj(sourceValue)) {
        mergeObj(targetValue, sourceValue)
      } else {
        target[key] = sourceValue
      }
    }
  }
}

export const deepMerge = (target: any, ...source: any[]) => {
  return source.reduce((a, b) => mergeObj(a, b), target)
}

export const prettyLog = (obj?: Record<string, any>) => {
  return JSON.stringify(obj, null, 2)
}

export const escapeStr = (path?: string) => {
  return `"${path}"`
}
