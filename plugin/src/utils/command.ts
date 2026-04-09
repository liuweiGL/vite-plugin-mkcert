import child_process, { type ExecOptions } from 'node:child_process'
import util from 'node:util'

export const exec = async (cmd: string, options?: ExecOptions) => {
  return util.promisify(child_process.exec)(cmd, options)
}

export const escapeStr = (path?: string) => {
  return `"${path}"`
}
