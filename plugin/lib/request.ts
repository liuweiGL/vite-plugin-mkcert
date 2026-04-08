import { debug } from './logger'

type RequestConfig = {
  method?: string
  url: string
  data?: unknown
  headers?: Record<string, string>
  responseType?: string
}

type RequestResponse = {
  data: any
}

async function doRequest(config: RequestConfig): Promise<RequestResponse> {
  const { method = 'GET', url, data, headers, responseType } = config

  const init: RequestInit = { method }

  if (data) {
    init.headers = { 'Content-Type': 'application/json', ...headers }
    init.body = JSON.stringify(data)
  } else if (headers) {
    init.headers = headers
  }

  try {
    const response = await fetch(url, init)

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      )
    }

    const responseData =
      responseType === 'arraybuffer'
        ? Buffer.from(await response.arrayBuffer())
        : await response.json()

    return { data: responseData }
  } catch (error) {
    debug('Request error: %o', error)
    throw error
  }
}

const request = Object.assign(doRequest, {
  get: (url: string, config?: Omit<RequestConfig, 'url' | 'method'>) =>
    doRequest({ ...config, method: 'GET', url })
})

export default request
