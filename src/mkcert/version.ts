import log from '../lib/log'
import { readFile, resolvePath, writeFile } from '../lib/util'

const VERSION_FILE_NAME = 'version.txt'
const VERSION_FILE_PATH = resolvePath(VERSION_FILE_NAME)

const parseVersion = (version: string) => {
  const str = version.trim().replace(/v/i, '')

  return str.split('.')
}

class VersionManger {
  public static create() {
    return new VersionManger()
  }

  private constructor() {}

  private async getVersion() {
    try {
      return await readFile(VERSION_FILE_PATH)
    } catch (e) {
      return undefined
    }
  }

  public async updateVersion(version: string) {
    try {
      await writeFile(VERSION_FILE_PATH, version)
    } catch (err) {
      log('Failed to record mkcert version number: %s', err)
    }
  }

  public async compare(version: string) {
    const currentVersion = await this.getVersion()

    if (!currentVersion) {
      return {
        breakChange: false,
        shouldUpdate: true
      }
    }

    let breakChange = false
    let shouldUpdate = false

    const newVersion = parseVersion(version)
    const oldVersion = parseVersion(currentVersion)

    for (let i = 0; i < newVersion.length; i++) {
      if (newVersion[i] > oldVersion[i]) {
        shouldUpdate = true
        breakChange = i === 0
        break
      }
    }
    return {
      breakChange,
      shouldUpdate
    }
  }
}

export default VersionManger
