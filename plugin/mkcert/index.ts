import fs from 'fs'
import process from 'process'

import pc from 'picocolors'
import { Logger } from 'vite'

import { debug } from '../lib/logger'
import {
  ensureDirExist,
  escape,
  exec,
  exists,
  getHash,
  prettyLog,
  resolvePath
} from '../lib/util'

import Config from './config'
import Downloader from './downloader'
import Record from './record'
import { BaseSource, GithubSource, CodingSource } from './source'
import VersionManger from './version'

export type SourceType = 'github' | 'coding' | BaseSource

export type MkcertOptions = {
  /**
   * Whether to force generate
   */
  force?: boolean

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

const KEY_FILE_PATH = resolvePath('certs/dev.key')
const CERT_FILE_PATH = resolvePath('certs/dev.pem')

class Mkcert {
  private force?: boolean
  private autoUpgrade?: boolean
  private mkcertLocalPath?: string
  private source: BaseSource
  private logger: Logger

  private mkcertSavedPath: string
  private sourceType: SourceType

  private config: Config

  public static create(options: MkcertProps) {
    return new Mkcert(options)
  }

  private constructor(options: MkcertProps) {
    const { force, autoUpgrade, source, mkcertPath, logger } = options

    this.force = force
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
      process.platform === 'win32' ? 'mkcert.exe' : 'mkcert'
    )

    this.config = new Config()
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
      if (!exists) {
        this.logger.error(
          pc.red(
            `${this.mkcertLocalPath} does not exist, please check the mkcertPath paramter`
          )
        )
      }
    } else {
      exist = await exists(this.mkcertSavedPath)
    }
    return exist
  }

  private async getCertificate() {
    const key = await fs.promises.readFile(KEY_FILE_PATH)
    const cert = await fs.promises.readFile(CERT_FILE_PATH)

    return {
      key,
      cert
    }
  }

  private async createCertificate(hosts: string[]) {
    const names = hosts.join(' ')

    const mkcertBinnary = await this.getMkcertBinnary()

    if (!mkcertBinnary) {
      debug(
        `Mkcert does not exist, unable to generate certificate for ${names}`
      )
    }

    await ensureDirExist(KEY_FILE_PATH)
    await ensureDirExist(CERT_FILE_PATH)

    const cmd = `${escape(mkcertBinnary)} -install -key-file ${escape(
      KEY_FILE_PATH
    )} -cert-file ${escape(CERT_FILE_PATH)} ${names}`

    await exec(cmd, {
      env: {
        ...process.env,
        JAVA_HOME: undefined
      }
    })

    this.logger.info(
      `The certificate is saved in:\n${KEY_FILE_PATH}\n${CERT_FILE_PATH}`
    )
  }

  private getLatestHash = async () => {
    return {
      key: await getHash(KEY_FILE_PATH),
      cert: await getHash(CERT_FILE_PATH)
    }
  }

  private async regenerate(record: Record, hosts: string[]) {
    await this.createCertificate(hosts)

    const hash = await this.getLatestHash()

    record.update({ hosts, hash })
  }

  public async init() {
    await this.config.init()

    const exist = await this.checkMkcert()

    if (!exist) {
      await this.initMkcert()
    } else if (this.autoUpgrade) {
      await this.upgradeMkcert()
    }
  }

  private async getSourceInfo() {
    const sourceInfo = await this.source.getSourceInfo()

    if (!sourceInfo) {
      if (typeof this.sourceType === 'string') {
        this.logger.error(
          'Failed to request mkcert information, please check your network'
        )
        if (this.sourceType === 'github') {
          this.logger.info(
            'If you are a user in china, maybe you should set "source" paramter to "coding"'
          )
        }
      } else {
        this.logger.info(
          'Please check your custom "source", it seems to return invalid result'
        )
      }
      return undefined
    }

    return sourceInfo
  }
  private async initMkcert() {
    const sourceInfo = await this.getSourceInfo()

    debug('The mkcert does not exist, download it now')

    if (!sourceInfo) {
      this.logger.error(
        'Can not obtain download information of mkcert, init skipped'
      )
      return
    }

    await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath)
  }

  private async upgradeMkcert() {
    const versionManger = new VersionManger({ config: this.config })
    const sourceInfo = await this.getSourceInfo()

    if (!sourceInfo) {
      this.logger.error(
        'Can not obtain download information of mkcert, update skipped'
      )
      return
    }

    const versionInfo = versionManger.compare(sourceInfo.version)

    if (!versionInfo.shouldUpdate) {
      debug('Mkcert is kept latest version, update skipped')
      return
    }

    if (versionInfo.breakingChange) {
      debug(
        'The current version of mkcert is %s, and the latest version is %s, there may be some breaking changes, update skipped',
        versionInfo.currentVersion,
        versionInfo.nextVersion
      )
      return
    }

    debug(
      'The current version of mkcert is %s, and the latest version is %s, mkcert will be updated',
      versionInfo.currentVersion,
      versionInfo.nextVersion
    )

    await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath)
    versionManger.update(versionInfo.nextVersion)
  }

  private async downloadMkcert(sourceUrl: string, distPath: string) {
    const downloader = Downloader.create()
    await downloader.download(sourceUrl, distPath)
  }

  public async renew(hosts: string[]) {
    const record = new Record({ config: this.config })

    if (this.force) {
      debug(`Certificate is forced to regenerate`)

      await this.regenerate(record, hosts)
    }

    if (!record.contains(hosts)) {
      debug(
        `The hosts changed from [${record.getHosts()}] to [${hosts}], start regenerate certificate`
      )

      await this.regenerate(record, hosts)
      return
    }

    const hash = await this.getLatestHash()

    if (record.tamper(hash)) {
      debug(
        `The hash changed from ${prettyLog(record.getHash())} to ${prettyLog(
          hash
        )}, start regenerate certificate`
      )

      await this.regenerate(record, hosts)
      return
    }

    debug('Neither hosts nor hash has changed, skip regenerate certificate')
  }

  /**
   * Get certificates
   *
   * @param hosts host collection
   * @returns cretificates
   */
  public async install(hosts: string[]) {
    if (hosts.length) {
      await this.renew(hosts)
    }

    return await this.getCertificate()
  }
}

export default Mkcert
