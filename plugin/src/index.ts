import type { PluginOption } from 'vite'
import Mkcert, { type MkcertBaseOptions } from './mkcert/index'
import { PLUGIN_NAME } from './utils/constant'
import { type LogLevel, setLogLevel } from './utils/logger'
import { getDefaultHosts } from './utils/network'

export { BaseSource, type SourceInfo } from './mkcert/source'

export type MkcertPluginOptions = MkcertBaseOptions & {
  /**
   * Restrict when the plugin is applied.
   *
   * @default 'serve'
   */
  apply?: 'serve' | 'build'

  /**
   * The hosts that needs to generate the certificate.
   */
  hosts?: string[]

  /**
   * Log level used by the plugin logger.
   *
   * If omitted, Vite's log level is used.
   */
  logLevel?: LogLevel
}

const plugin = ({
  apply = 'serve',
  hosts = [],
  logLevel,
  ...mkcertOptions
}: MkcertPluginOptions = {}): PluginOption => {
  return {
    name: PLUGIN_NAME,
    apply,
    config: async ({ server = {}, logLevel: viteLogLevel }) => {
      setLogLevel(logLevel ?? viteLogLevel ?? 'info')

      // v5.0 以下支持 boolean 类型的 https 配置
      if (typeof server.https === 'boolean' && server.https === false) {
        return
      }

      const mkcert = Mkcert.create(mkcertOptions)

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
