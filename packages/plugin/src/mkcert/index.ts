import fs from 'fs'

import chalk from 'chalk'
import { Logger } from 'vite'

import { debug } from '../lib/logger'
import { ensureDirExist, exec, exists, resolvePath } from '../lib/util'

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

  /**
   * Custom hostnames
   *
   * @default []
   */
  hostnames?: string[]
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

  private getKeyPath() {
    return resolvePath(`certs/dev.key`)
  }

  private getCertPath() {
    return resolvePath(`certs/dev.pem`)
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
      exist = await exists(this.mkcertLocalPath)
      this.logger.error(
        chalk.red(
          `${this.mkcertLocalPath} does not exist, please check the mkcertPath paramter`
        )
      )
    } else {
      exist = await exists(this.mkcertSavedPath)
    }
    return exist
  }

  private async getCertificate() {
    const key = await fs.promises.readFile(this.getKeyPath())
    const cert = await fs.promises.readFile(this.getCertPath())

    return {
      key,
      cert
    }
  }

  private async createCertificate(hostnames: string[]) {
    const hostlist = hostnames.join(' ')
    const mkcertBinnary = await this.getMkcertBinnary()

    if (!mkcertBinnary) {
      debug(
        `Mkcert does not exist, unable to generate certificate for ${hostlist}`
      )
    }

    const keyFile = this.getKeyPath()
    const certFile = this.getCertPath()

    await ensureDirExist(keyFile)
    await ensureDirExist(certFile)

    const cmd = `${mkcertBinnary} -install -key-file ${keyFile} -cert-file ${certFile} ${hostlist}`

    await exec(cmd)

    this.logger.info(`The certificate is saved in:\n${keyFile}\n${certFile}`)
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

    if (!versionInfo.shouldUpdate) {
      debug('Mkcert is kept latest version, update skipped')
      return
    }

    if (versionInfo.breakingChange) {
      debug(
        `The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped`,
        versionInfo.currentVersion,
        versionInfo.nextVersion
      )
      return
    }

    debug(
      `The current version of mkcert is %s, and the latest version is %s, mkcert is be updated`,
      versionInfo.currentVersion,
      versionInfo.nextVersion
    )

    const downloader = Downloader.create()

    await downloader.download(sourceInfo.downloadUrl, this.mkcertSavedPath)
  }

  public async renew(hostnames: string[]) {
    await this.createCertificate(hostnames)
  }

  /**
   * Get certificates
   *
   * @param hostnames hostname collection
   * @returns cretificates
   */
  public async install(hostnames: string[]) {
    if (hostnames.length) {
      await this.renew(hostnames)
    }

    return await this.getCertificate()
  }
}

export default Mkcert
