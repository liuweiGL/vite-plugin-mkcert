import ViteCertPlugin from '../index'
import Mkcert from '../mkcert/index'


const install = jest.fn()

jest.mock('../mkcert/index', () => {
    return class {
      static create() {
        return new this()
      }
      install(...args: any[]) {
        install(...args)
      }
      public async init() {}
    }
})

describe('custom hostnames', () => {
  test('should install with custom hostnames', async () => {

    const plugin = ViteCertPlugin({
      hostnames: ['www.test.com']
    })

    await (plugin as any).config({
      server: {
        https: true
      }
    })

    expect(install).toHaveBeenCalledTimes(1)

    const args = install.mock.calls[0][0]
    expect(JSON.stringify(args)).toMatch('www.test.com')
    // expect((args as string[]).includes('www.test.com')).toBeTruthy()
  })
})
