import log from '../lib/log'
import { readFile, writeFile } from '../lib/util'

const VERSION_FILE_NAME = 'version.txt'

const parseVersion = (version: string) => {
  const str = version.trim().replace(/v|\./g, '')

  return Number.parseInt(str)
}

class VersionManger {
  public static create() {
    return new VersionManger()
  }

  private constructor() {}

  private async getCurrentVersion() {
    try {
      const version = await readFile(VERSION_FILE_NAME).toString()
      return parseVersion(version)
    } catch (e) {
      return 0
    }
  }

  public async updateCurrentVersion(version: string) {
    try {
      await writeFile(VERSION_FILE_NAME, version)
    } catch (err) {
      log('Failed to record mkcert version number: %s', err)
    }
  }

  public async shouldUpdate(version: string) {
    try {
      const currentVersion = await this.getCurrentVersion()
      const newVersion = parseVersion(version)
      return currentVersion < newVersion
    } catch (e) {
      return true
    }
  }
}

export default VersionManger
