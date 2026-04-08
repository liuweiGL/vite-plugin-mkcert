import path from 'node:path'

import { debug } from '../lib/logger'
import { readFile, writeFile, prettyLog, deepMerge } from '../lib/util'

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

export type ConfigOptions = {
  savePath: string
}

const CONFIG_FILE_NAME = 'config.json'

class Config {
  /**
   * The mkcert version
   */
  private version: string | undefined

  private record: RecordMate | undefined

  private configFilePath: string

  constructor({ savePath }: ConfigOptions) {
    this.configFilePath = path.resolve(savePath, CONFIG_FILE_NAME)
  }

  public async init() {
    const str = await readFile(this.configFilePath)
    const options = str ? JSON.parse(str) : undefined

    if (options) {
      this.version = options.version
      this.record = options.record
    }
  }

  private async serialize() {
    await writeFile(this.configFilePath, prettyLog(this))
  }

  // deep merge
  public async merge(obj: Record<string, any>) {
    const currentStr = prettyLog(this)

    deepMerge(this, obj)

    const nextStr = prettyLog(this)

    debug(
      `Receive parameter\n ${prettyLog(
        obj
      )}\nUpdate config from\n ${currentStr} \nto\n ${nextStr}`
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
