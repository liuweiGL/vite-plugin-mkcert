import fs from 'fs'
import path from 'path'

import { PLUGIN_DATA_DIR } from './constant'

/**
 * Resolve file path with `PLUGIN_DATA_DIR`
 *
 * @param fileName file name
 * @returns absolute path
 */
export const resolvePath = (fileName: string) => {
  return path.resolve(PLUGIN_DATA_DIR, fileName)
}

/**
 * Make sure `PLUGIN_DATA_DIR` exists
 */
export const ensureDataDir = async () => {
  try {
    await fs.promises.access(PLUGIN_DATA_DIR, fs.constants.F_OK)
  } catch {
    await fs.promises.mkdir(PLUGIN_DATA_DIR, { recursive: true })
  }
}

/**
 * Write data to the file under `PLUGIN_DATA_DIR`
 *
 * @param fileName file name
 * @param data file content
 * @returns file path
 */
export const writeFile = async (
  fileName: string,
  data: string | Uint8Array
) => {
  const filePath = resolvePath(fileName)
  await ensureDataDir()
  await fs.promises.writeFile(filePath, data)
  return filePath
}

/**
 * Read content from the file under `PLUGIN_DATA_DIR`
 *
 * @param fileName file name
 * @returns file content
 */
export const readFile = async (fileName: string) => {
  const filePath = resolvePath(fileName)
  await ensureDataDir()
  return await fs.promises.readFile(filePath)
}
