import child_process, { type ExecOptions } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import util from 'node:util'

import { PLUGIN_NAME } from './constant'

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
    // Fails when nodejs version < 16.7.0, ignore?
    console.log(`${PLUGIN_NAME}:`, error)
  }
}

export const exec = async (cmd: string, options?: ExecOptions) => {
  return util.promisify(child_process.exec)(cmd, options)
}

/**
 * http://nodejs.cn/api/os/os_networkinterfaces.html
 */
const isIPV4 = (family: string | number) => {
  return family === 'IPv4' || family === 4
}

export const getLocalV4Ips = () => {
  const interfaceDict = os.networkInterfaces()
  const addresses: string[] = []
  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key]
    if (interfaces) {
      for (const item of interfaces) {
        if (isIPV4(item.family)) {
          addresses.push(item.address)
        }
      }
    }
  }

  return addresses
}

export const getDefaultHosts = () => {
  return ['localhost', ...getLocalV4Ips()]
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
