import fs from 'fs'
import path from 'path'

import { PLUGIN_DATA_DIR } from './constant'

export const resolvePath = (fileName: string) => {
  return path.resolve(PLUGIN_DATA_DIR, fileName)
}

export const ensureDataDir = async () => {
  try {
    await fs.promises.access(PLUGIN_DATA_DIR, fs.constants.F_OK)
  } catch {
    await fs.promises.mkdir(PLUGIN_DATA_DIR, { recursive: true })
  }
}

export const writeFile = async (
  fileName: string,
  data: string | Uint8Array
) => {
  const filePath = resolvePath(fileName)
  await ensureDataDir()
  await fs.promises.writeFile(filePath, data)
  return filePath
}

export const readFile = async (fileName: string) => {
  const filePath = resolvePath(fileName)
  await ensureDataDir()
  return await fs.promises.readFile(filePath)
}
