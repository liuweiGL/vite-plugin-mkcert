import fs from 'fs'

import chalk from 'chalk'
import { Logger } from 'vite'

import { debug } from '../lib/logger'
import { exec, exists, resolvePath } from '../lib/util'

import Downloader from './downloader'
import { BaseSource, GithubSource, CodingSource } from './Source'
import VersionManger from './version'

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
   * @description it should be absolute path
   * @default none
   */
  mkcertPath?: string
}

export type MkcertProps = MkcertOptions & {
  logger: Logger
}

class Mkcert {
  private autoUpgrade?: boolean
  private mkcertLocalPath?: string
  private source: BaseSource
  private logger: Logger

  private mkcertSavedPath: string
  private sourceType: SourceType

  public static create(options: MkcertProps) {
    return new Mkcert(options)
  }

  private constructor(options: MkcertProps) {
    const { autoUpgrade, source, mkcertPath, logger } = options

    this.logger = logger
    this.autoUpgrade = autoUpgrade
    this.mkcertLocalPath = mkcertPath
    this.sourceType = source || 'github'

    if (this.sourceType === 'github') {
      this.source = GithubSource.create()
    } else if (this.sourceType === 'coding') {
      this.source = CodingSource.create()
    } else {
      this.source = this.sourceType
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
    return (await this.checkMkcert())
      ? this.mkcertLocalPath || this.mkcertSavedPath
      : undefined
  }

  /**
   * Check if mkcert exists
   */
  private async checkMkcert() {
    let exist: boolean
    if (this.mkcertLocalPath) {
      exist = await exists(this.mkcertSavedPath)
      this.logger.error(
        chalk.red(
          `${this.mkcertSavedPath} does not exist, please check the mkcertPath paramter`
        )
      )
    } else {
      exist = await exists(this.mkcertSavedPath)
      this.logger.warn(
        chalk.yellow(
          `${this.mkcertSavedPath} does not exist, initialization may have failed`
        )
      )
    }
    return exist
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

    if (!mkcertBinnary) {
      debug(
        `Mkcert does not exist, unable to generate certificate for ${hostname}`
      )
    }

    const keyFile = this.getKeyPath(hostname)
    const certFile = this.getCertPath(hostname)
    const cmd = `${mkcertBinnary} -install -key-file ${keyFile} -cert-file ${certFile} ${hostname}`

    await exec(cmd)

    this.logger.info(`Generated certificate:\n${keyFile}\n${certFile}`)
  }

  private async filterHostNames(hostnames: string[]) {
    const result = await Promise.all(
      hostnames.map(async hostname =>
        (await this.checkCertificate(hostname)) ? undefined : hostname
      )
    )
    return result.filter(item => !!item) as string[]
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
      if (typeof this.sourceType === 'string') {
        debug(`Failed to request mkcert information, please check your network`)
        if (this.sourceType === 'github') {
          debug(
            `If you are a user in china, maybe you should set "source" paramter to "coding"`
          )
        }
      } else {
        debug(
          `Please check your custom "source", it seems to return invalid result`
        )
      }
      debug(`Can not get mkcert information, update skipped`)
      return
    }

    const versionInfo = await versionManger.compare(sourceInfo.version)

    if (versionInfo.shouldUpdate) {
      if (versionInfo.breakingChange) {
        debug(
          `The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped`,
          versionInfo.currentVersion,
          versionInfo.nextVersion
        )
        return
      }

      const downloader = Downloader.create()

      await downloader.download(sourceInfo.downloadUrl, this.mkcertSavedPath)
    } else {
      debug('Mkcert is kept latest version, update skipped')
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
    const newHostNames = await this.filterHostNames(hostnames)

    if (newHostNames.length) {
      await this.renew(newHostNames)
    }

    return await this.getCertificates(hostnames)
  }
}

export default Mkcert
