import { debug } from '../lib/logger'
import request from '../lib/request'
import { writeFile } from '../lib/util'

class Downloader {
  public static create() {
    return new Downloader()
  }

  private constructor() {}

  public async download(downloadUrl: string, savedPath: string) {
    debug('Downloading the mkcert executable from %s', downloadUrl)

    const { data } = await request.get(downloadUrl, {
      responseType: 'arraybuffer'
    })

    await writeFile(savedPath, data)

    debug('The mkcert has been saved to %s', savedPath)
  }
}

export default Downloader
