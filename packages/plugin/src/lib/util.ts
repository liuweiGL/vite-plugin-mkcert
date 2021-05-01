import child_process from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'

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
  return (await fs.promises.readFile(filePath)).toString()
}

export const writeFile = async (
  filePath: string,
  data: string | Uint8Array
) => {
  await ensureDirExist(filePath)
  return await fs.promises.writeFile(filePath, data)
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
