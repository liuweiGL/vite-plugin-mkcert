import { debug } from '../lib/logger'
import {
  resolvePath,
  readFile,
  writeFile,
  prettyLog,
  deepMerge
} from '../lib/util'

export type RecordMate = {
  /**
   * The hosts that have generated certificate
   */
  hosts: string[]

  /**
   * file hash
   */
  hash?: RecordHash
}

export type RecordHash = {
  key?: string
  cert?: string
}

const CONFIG_FILE_NAME = 'config.json'
const CONFIG_FILE_PATH = resolvePath(CONFIG_FILE_NAME)

class Config {
  /**
   * The mkcert version
   */
  private version: string | undefined

  private record: RecordMate | undefined

  public async init() {
    const str = await readFile(CONFIG_FILE_PATH)
    const options = str ? JSON.parse(str) : undefined

    if (options) {
      this.version = options.version
      this.record = options.record
    }
  }

  private async serialize() {
    await writeFile(CONFIG_FILE_PATH, prettyLog(this))
  }

  // deep merge
  public async merge(obj: Record<string, any>) {
    const currentStr = prettyLog(this)

    deepMerge(this, obj)

    const nextStr = prettyLog(this)

    debug(
      `Receive parameter ${prettyLog(
        obj
      )}, then update config from ${currentStr} to ${nextStr}`
    )

    await this.serialize()
  }

  public getRecord() {
    return this.record
  }

  public getVersion() {
    return this.version
  }
}

export default Config
