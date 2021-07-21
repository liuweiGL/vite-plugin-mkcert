import ViteCertPlugin from '../index'
import Mkcert from '../mkcert/index'


const install = jest.fn()
const getCertificate = jest.fn()
jest.mock('../mkcert/index', () => {
    return class {
      static create() {
        return new this()
      }
      install(...args: any[]) {
        install(...args)
      }
      getCertificate() {
        getCertificate()
      }
      isCertExist() {
        return true
      }
      public async init() {}
    }
})

describe('cache certificate', () => {
  test('should not install if the certificate exists', async () => {

    const plugin = ViteCertPlugin({})

    await (plugin as any).config({
      server: {
        https: true
      }
    })

    expect(getCertificate).toBeCalledTimes(1)
  })
})
