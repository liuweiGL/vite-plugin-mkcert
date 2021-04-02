import { Plugin } from 'vite'

import { PLUGIN_NAME } from '../lib/constant'
import { getLocalV4Ips } from '../lib/util'
import Mkcert, { MkcertOptions } from '../mkcert'

export type ViteCertificateOptions = MkcertOptions

const plugin = (options: ViteCertificateOptions): Plugin => {
  return {
    name: PLUGIN_NAME,
    config: async config => {
      if (config.server?.https) {
        const ips = getLocalV4Ips()
        const mkcert = Mkcert.create(options)
        await mkcert.init()
        const certificates = await mkcert.install([...ips, 'localhost'])
        const keys = certificates.map(item => item.key)
        const certs = certificates.map(item => item.cert)
        if (config.server.https === true) {
          config.server.https = {
            key: keys,
            cert: certs
          }
        } else {
          Object.assign(config.server.https, {
            key: keys,
            cert: certs
          })
        }
      }
    }
  }
}

export default plugin
