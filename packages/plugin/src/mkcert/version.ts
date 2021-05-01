import { debug } from '../lib/logger'
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
      debug('Failed to record mkcert version info: %o', err)
    }
  }

  public async compare(version: string) {
    const currentVersion = await this.getVersion()

    if (!currentVersion) {
      return {
        currentVersion,
        nextVersion: version,
        breakingChange: false,
        shouldUpdate: true
      }
    }

    let breakingChange = false
    let shouldUpdate = false

    const newVersion = parseVersion(version)
    const oldVersion = parseVersion(currentVersion)

    for (let i = 0; i < newVersion.length; i++) {
      if (newVersion[i] > oldVersion[i]) {
        shouldUpdate = true
        breakingChange = i === 0
        break
      }
    }
    return {
      breakingChange,
      shouldUpdate,
      currentVersion,
      nextVersion: version
    }
  }
}

export default VersionManger
