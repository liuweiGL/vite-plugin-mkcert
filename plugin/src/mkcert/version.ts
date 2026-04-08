import { debug } from '../lib/logger'

import type Config from './config'

export type VersionMangerProps = {
  config: Config
}

const parseVersion = (version: string) => {
  const str = version.trim().replace(/v/i, '')

  return str.split('.')
}

class VersionManger {
  private config: Config

  public constructor(props: VersionMangerProps) {
    this.config = props.config
  }

  public async update(version: string) {
    try {
      await this.config.merge({ version })
    } catch (err) {
      debug('Failed to record mkcert version info: %o', err)
    }
  }

  public compare(version: string) {
    const currentVersion = this.config.getVersion()

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
