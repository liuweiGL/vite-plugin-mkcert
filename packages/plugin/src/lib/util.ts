import child_process from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'
import crypto from 'crypto'

import { PLUGIN_DATA_DIR } from './constant'

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
  } catch (error) {
    return false
  }
}

/**
 * Resolve file path with `PLUGIN_DATA_DIR`
 *
 * @param fileName file name
 * @returns absolute path
 */
export const resolvePath = (fileName: string) => {
  return path.resolve(PLUGIN_DATA_DIR, fileName)
}

export const mkdir = async (dirname: string) => {
  const isExist = await exists(dirname)

  if (!isExist) {
    await fs.promises.mkdir(dirname, { recursive: true })
  }
}

export const ensureDirExist = async (filePath: string) => {
  const dirname = path.dirname(filePath)
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
  await ensureDirExist(filePath)
  await fs.promises.writeFile(filePath, data)
  await fs.promises.chmod(filePath, 0o777)
}

export const exec = async (cmd: string) => {
  return await util.promisify(child_process.exec)(cmd)
}

export const getLocalV4Ips = () => {
  const interfaceDict = os.networkInterfaces()
  const addresses: string[] = []
  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key]
    if (interfaces) {
      for (const item of interfaces) {
        if (item.family === 'IPv4') {
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
    if (Object.prototype.hasOwnProperty.call(source, key)) {
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
  return obj ? JSON.stringify(obj, null, 2) : obj
}
