import { Octokit } from '@octokit/rest'

import log from '../lib/log'
import request from '../lib/request'
import fs from 'fs'

class Downloader {
  public static create() {
    return new Downloader()
  }

  private constructor() {}

  public async download(downloadUrl: string, savedPath: string) {
    // if (this.assetInfo === undefined) {
    //   console.warn('Did you forget to call the [init] method to initialize')
    //   log(
    //     'The attachment information of mkcert has not been obtained, and the download has been skipped'
    //   )
    //   return resolvePath(fileName)
    // }

    // if (!shouldUpdate) {
    //   log('Mkcert is already up to date, skip downloading')
    //   return
    // }

    log('Downloading the mkcert executable from %s', downloadUrl)

    const { data } = await request.get(downloadUrl)
    await fs.promises.writeFile(savedPath, data)

    log('The mkcert has been saved to %s', savedPath)
  }
}

export default Downloader
