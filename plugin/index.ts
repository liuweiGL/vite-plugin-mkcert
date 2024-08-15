import { createLogger, type PluginOption } from 'vite'

import { PLUGIN_NAME } from './lib/constant'
import { getDefaultHosts } from './lib/util'
import Mkcert, { type MkcertBaseOptions } from './mkcert/index'

export { BaseSource, type SourceInfo } from './mkcert/source'

export type MkcertPluginOptions = MkcertBaseOptions & {
  /**
   * The hosts that needs to generate the certificate.
   */
  hosts?: string[]
}

const plugin = (options: MkcertPluginOptions = {}): PluginOption => {
  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    config: async ({ server = {}, logLevel }) => {
      // v5.0 以下支持 boolean 类型的 https 配置
      if (typeof server.https === 'boolean' && server.https === false) {
        return
      }

      const { hosts = [], ...mkcertOptions } = options

      const logger = createLogger(logLevel, {
        prefix: PLUGIN_NAME
      })
      const mkcert = Mkcert.create({
        logger,
        ...mkcertOptions
      })

      await mkcert.init()

      const allHosts = [...getDefaultHosts(), ...hosts]

      if (typeof server.host === 'string') {
        allHosts.push(server.host)
      }

      const uniqueHosts = Array.from(new Set(allHosts)).filter(Boolean)

      const certificate = await mkcert.install(uniqueHosts)
      const httpsConfig = {
        key: certificate.key && Buffer.from(certificate.key),
        cert: certificate.cert && Buffer.from(certificate.cert)
      }

      return {
        server: {
          https: httpsConfig
        },
        preview: {
          https: httpsConfig
        }
      }
    }
  }
}

export default plugin
