import { Octokit } from '@octokit/rest'
import log from '../lib/log'
import request from '../lib/request'

export type SourceInfo = {
  version: string
  downloadUrl: string
}

export abstract class BaseSource {
  abstract getSourceInfo(): Promise<SourceInfo | undefined>

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
}

/**
 * Download mkcert from github repo
 */
export class GithubSource extends BaseSource {
  public static create() {
    return new GithubSource()
  }

  private constructor() {
    super()
  }

  public async getSourceInfo(): Promise<SourceInfo | undefined> {
    let version: string | undefined
    let downloadUrl: string | undefined

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

    if (!(version && downloadUrl)) {
      log('Github assets do not match')
      return
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
export class CodingSource extends BaseSource {
  private static CODING_OPEN_API = 'https://liuweigl.coding.net/open-api'

  public static create() {
    return new CodingSource()
  }

  private constructor() {
    super()
  }

  async getSourceInfo(): Promise<SourceInfo | undefined> {
    const { data } = await request({
      method: 'POST',
      url: CodingSource.CODING_OPEN_API,
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
