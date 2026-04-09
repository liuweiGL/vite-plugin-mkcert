import { debug } from '../lib/logger'
import request from '../lib/request'
import { writeFile } from '../lib/util'

class Downloader {
  public static create() {
    return new Downloader()
  }

  private constructor() {}

  public async download(downloadUrl: string, savedPath: string, proxy?: string) {
    debug(
      'Downloading the mkcert executable from %s%s',
      downloadUrl,
      proxy ? ` via proxy ${proxy}` : ''
    )

    const { data } = await request.get(downloadUrl, {
      responseType: 'arraybuffer',
      proxy
    })

    await writeFile(savedPath, data)

    debug('The mkcert has been saved to %s', savedPath)
  }
}

export default Downloader
