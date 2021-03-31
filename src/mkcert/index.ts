import { exec, exists, resolvePath } from '../lib/util'
import { BaseSource, GithubSource, CodingSource } from './Source'
import VersionManger from './version'
import fs from 'fs'
import { F_OK } from 'node:constants'
import { hostname } from 'node:os'
import Downloader from './downloader'
export type SourceType = 'github' | 'coding' | BaseSource

export type MkcertOptions = {
  /**
   * Automatically upgrade mkcert
   *
   * @default false
   */
  autoUpgrade?: boolean

  /**
   * Specify mkcert download source
   *
   * @default github
   */
  source?: SourceType

  /**
   * If your network is restricted, you can specify a local binary file instead of downloading
   *
   * @default none
   */
  mkcertPath?: string
}

class Mkcert {
  private autoUpgrade?: boolean
  private mkcertLocalPath?: string
  private source: BaseSource

  private mkcertSavedPath: string

  public static create(options: MkcertOptions) {
    return new Mkcert(options)
  }

  private constructor(options: MkcertOptions) {
    const { autoUpgrade, source, mkcertPath } = options

    this.autoUpgrade = autoUpgrade
    this.mkcertLocalPath = mkcertPath

    if (source === undefined || source === 'github') {
      this.source = GithubSource.create()
    } else if (source === 'coding') {
      this.source = CodingSource.create()
    } else {
      this.source = source
    }

    this.mkcertSavedPath = resolvePath(
      process.platform === 'win32' ? `mkcert.exe` : 'mkcert'
    )
  }

  private getKeyPath(hostname: string) {
    return resolvePath(`${hostname}.key`)
  }

  private getCertPath(hostname: string) {
    return resolvePath(`${hostname}.pem`)
  }

  private async getMkcertBinnary() {
    if (!(await this.checkMkcert())) {
      console.warn('Did you forget to call the [init] method to initialize')
    }
    return this.mkcertLocalPath || this.mkcertSavedPath
  }

  /**
   * Check if mkcert exists
   */
  private async checkMkcert() {
    return !!this.mkcertLocalPath || (await exists(this.mkcertSavedPath))
  }

  /**
   * Check if the hostname's certificate exists
   *
   * @param hostname hostname
   * @returns does the certificate exist
   */
  private async checkCertificate(hostname: string) {
    const keyExist = await exists(this.getKeyPath(hostname))
    const certExist = await exists(this.getCertPath(hostname))

    return keyExist && certExist
  }

  private async getCertificate(hostname: string) {
    const key = await fs.promises.readFile(this.getKeyPath(hostname))
    const cert = await fs.promises.readFile(this.getCertPath(hostname))

    return {
      key,
      cert
    }
  }

  private async getCertificates(hostnames: string[]) {
    return await Promise.all(hostnames.map(this.getCertificate))
  }

  private async createCertificate(hostname: string) {
    const mkcertBinnary = await this.getMkcertBinnary()
    const cmd = `${mkcertBinnary} -install -key-file ${this.getKeyPath(
      hostname
    )} -cert-file ${this.getCertPath(hostname)} ${hostname}`
    await exec(cmd)
    // TODO: log
  }

  public async init() {
    if (this.autoUpgrade || !(await this.checkMkcert())) {
      await this.updateMkcert()
    }
  }

  public async updateMkcert() {
    const versionManger = VersionManger.create()
    const sourceInfo = await this.source.getSourceInfo()

    if (!sourceInfo) {
      // TODO: add log for request error
      return
    }

    const versionInfo = await versionManger.compare(sourceInfo.version)

    if (versionInfo.shouldUpdate) {
      if (versionInfo.breakChange) {
        // TODO: add log for skip update
        return
      }

      const downloader = Downloader.create()

      // TODO: add log for upgrade
      await downloader.download(sourceInfo.downloadUrl, this.mkcertSavedPath)
    } else {
      // TODO: add log
    }
  }

  public async renew(hostnames: string[]) {
    await Promise.all(hostnames.map(this.createCertificate))
  }

  /**
   * Get certificates
   *
   * @param hostnames hostname collection
   * @returns cretificates
   */
  public async install(hostnames: string[]) {
    const newHostNames = []
    for (const hostname of hostnames) {
      const certificateExist = await this.checkCertificate(hostname)
      if (!certificateExist) {
        newHostNames.push(hostname)
      }
    }
    if (newHostNames.length) {
      await this.renew(newHostNames)
    }
    return await this.getCertificates(hostnames)
  }
}

export default Mkcert
