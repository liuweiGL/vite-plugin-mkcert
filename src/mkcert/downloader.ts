import { Octokit } from '@octokit/rest'

import log from '../lib/log'
import request from '../lib/request'
import { resolvePath, writeFile } from '../lib/util'

import VersionManger from './versionManger'

export type AssetInfo = {
  version: string
  downloadUrl: string
}

abstract class Downloader {
  public assetInfo?: AssetInfo
  private versionManger: VersionManger

  constructor() {
    this.versionManger = VersionManger.create()
  }

  abstract getAssetInfo(): Promise<AssetInfo>

  private getSavedFileName() {
    const fileName = 'mkcert'

    return process.platform === 'win32' ? `${fileName}.ext` : fileName
  }

  protected getPlatformIdentifier() {
    switch (process.platform) {
      case 'win32':
        return 'windows-amd64.exe'
      case 'linux':
        return process.arch === 'arm64'
          ? 'linux-arm64'
          : process.arch === 'arm'
          ? 'linux-arm'
          : 'linux-amd64'
      case 'darwin':
        return 'darwin-amd64'
      default:
        throw new Error('Unsupported platform')
    }
  }

  public async init() {
    this.assetInfo = await this.getAssetInfo()
  }

  public async download() {
    const fileName = this.getSavedFileName()

    if (this.assetInfo === undefined) {
      console.warn('Did you forget to call the [init] method to initialize')
      log(
        'The attachment information of mkcert has not been obtained, and the download has been skipped'
      )
      return resolvePath(fileName)
    }

    const { downloadUrl, version } = this.assetInfo
    const shouldUpdate = await this.versionManger.shouldUpdate(version)

    if (!shouldUpdate) {
      log('Mkcert is already up to date, skip downloading')
      return
    }

    log('Downloading the mkcert executable from %s', downloadUrl)

    const { data } = await request.get(downloadUrl)
    const savedPath = await writeFile(fileName, data)

    log('The mkcert has been saved to %s', savedPath)
    return savedPath
  }
}

/**
 * Download mkcert from github repo
 */
export class GithubDownloader extends Downloader {
  public static create() {
    return new GithubDownloader()
  }

  private constructor() {
    super()
  }

  async getAssetInfo(): Promise<AssetInfo> {
    let version: string | undefined
    let downloadUrl: string | undefined

    try {
      const octokit = new Octokit()
      const { data } = await octokit.repos.getLatestRelease({
        owner: 'FiloSottile',
        repo: 'mkcert'
      })
      const platformIdentifier = this.getPlatformIdentifier()

      version = data.tag_name
      downloadUrl = data.assets.find(item =>
        item.name.includes(platformIdentifier)
      )?.browser_download_url
    } catch (e) {}

    if (!(version && downloadUrl)) {
      log('Github assets do not match, use coding.net mirror')
      return CodingDownloader.create().getAssetInfo()
    }

    return {
      downloadUrl,
      version
    }
  }
}

/**
 * Download mkcert from coding repo
 *
 * @see {https://help.coding.net/openapi}
 */
export class CodingDownloader extends Downloader {
  private static CODING_OPEN_API = 'https://liuweigl.coding.net/open-api'

  public static create() {
    return new CodingDownloader()
  }

  private constructor() {
    super()
  }

  async getAssetInfo(): Promise<AssetInfo> {
    const { data } = await request({
      method: 'POST',
      url: CodingDownloader.CODING_OPEN_API,
      params: {
        Action: 'DescribeArtifactRepositoryFileList'
      },
      data: {
        Action: 'DescribeArtifactRepositoryFileList',
        Repository: 'mkcert',
        Project: 'github',
        PageSize: 10
      }
    })

    console.log(data)

    return data
  }
}
