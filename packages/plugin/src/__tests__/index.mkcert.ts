import Mkcert, { MkcertOptions } from '../mkcert/index'
import { Logger, createLogger } from 'vite'
import fs from "fs"

describe('Mkcert check', () => {

  jest.setTimeout(60000)
  test('should create a certificate', async () => {
    const logger = createLogger('info', {
      prefix: 'vite-plugin-mkcert'
    })

    const mc = Mkcert.create({
      logger
    })


    const keyFile = mc.getKeyPath()
    const certFile = mc.getCertPath()
    if (fs.existsSync(keyFile)) {
      fs.rmSync(keyFile)
    }
    if (fs.existsSync(certFile)) {
      fs.rmSync(certFile)
    }
    expect(await mc.isCertExist()).toBe(false)

    await mc.init()

    await mc.install(['localhost'])

    expect(fs.existsSync(keyFile)).toBe(true)
    expect(fs.existsSync(certFile)).toBe(true)
    expect(await mc.isCertExist()).toBe(true)

    const cert = await mc.getCertificate()
    expect('key' in cert).toBe(true)
    expect('cert' in cert).toBe(true)

  })

})
