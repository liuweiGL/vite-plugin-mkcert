import child_process, { type ExecOptions } from 'node:child_process'
import process from 'node:process'
import util from 'node:util'

export const exec = async (cmd: string, options?: ExecOptions) => {
  return util.promisify(child_process.exec)(cmd, options)
}

export const findCommandFromPath = async (command: string) => {
  const lookupCmd = process.platform === 'win32'
    ? `where ${command}`
    : `command -v ${command}`

  try {
    const { stdout } = await exec(lookupCmd)
    const output = stdout.toString().trim()

    if (!output) {
      return undefined
    }

    return output.split(/\r?\n/)[0].trim() || undefined
  } catch (_error) {
    return undefined
  }
}

export const escapeStr = (path?: string) => {
  return `"${path}"`
}
