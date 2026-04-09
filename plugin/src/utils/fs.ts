import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

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

export const getHash = async (filePath: string) => {
  const content = await readFile(filePath)

  if (content) {
    const hash = crypto.createHash('sha256')
    hash.update(content)
    return hash.digest('hex')
  }

  return undefined
}
