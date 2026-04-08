import type Config from './config'
import type { RecordHash, RecordMate } from './config'

export type RecordProps = {
  config: Config
}
class Record {
  private config: Config

  constructor(options: RecordProps) {
    this.config = options.config
  }

  public getHosts() {
    return this.config.getRecord()?.hosts
  }

  public getHash() {
    return this.config.getRecord()?.hash
  }

  public contains(hosts: string[]) {
    const oldHosts = this.getHosts()

    if (!oldHosts) {
      return false
    }

    // require hosts is subset of oldHosts
    for (const host of hosts) {
      if (!oldHosts.includes(host)) {
        return false
      }
    }

    return true
  }

  // whether the files has been tampered with
  public equal(hash: RecordHash) {
    const oldHash = this.getHash()

    if (!oldHash) {
      return false
    }

    return oldHash.key === hash.key && oldHash.cert === hash.cert
  }

  public async update(record: RecordMate) {
    await this.config.merge({ record })
  }
}

export default Record
