import { debug_log, info_log } from '../lib/logger'
import request from '../lib/request'
import { throttle, writeFile } from '../lib/util'

type DownloadOptions = {
  downloadUrl: string
  savedPath: string
  proxy?: string
  logProgress?: boolean
}

class Downloader {
  public static create() {
    return new Downloader()
  }

  private constructor() { }

  public async download(
    {
      downloadUrl,
      savedPath,
      proxy,
      logProgress = true
    }: DownloadOptions
  ) {
    let lastPercent = 0

    debug_log(
      'Downloading the mkcert executable from %s%s',
      downloadUrl,
      proxy ? ` via proxy ${proxy}` : ''
    )

    const { data } = await request.get(downloadUrl, {
      responseType: 'arraybuffer',
      proxy,
      onDownloadProgress: throttle(progress => {
        if (!logProgress) {
          return
        }

        if (typeof progress.percent === 'number') {
          const roundedPercent = Math.min(100, Math.floor(progress.percent))
          const bucket = Math.floor(roundedPercent / 10) * 10

          if (bucket >= lastPercent || roundedPercent === 100) {
            lastPercent = bucket
            info_log(`Downloading mkcert binary... ${roundedPercent}%`)
          }
        }
      }, 300)
    })

    await writeFile(savedPath, data)

    debug_log('The mkcert has been saved to %s', savedPath)
  }
}

export default Downloader
