import process from 'node:process'

import { fetch, ProxyAgent, type RequestInit } from 'undici'

import { debug } from './logger'

type ResponseType = 'json' | 'arraybuffer' | 'text'

type RequestConfig = {
  method?: string
  url: string
  data?: unknown
  headers?: Record<string, string>
  responseType?: ResponseType
  proxy?: string
}

type RequestResponse<T = unknown> = {
  data: T
}

const getProxyFromEnv = () => {
  const value =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy

  return value?.trim() || undefined
}

const proxyAgentMap = new Map<string, ProxyAgent>()

const getDispatcher = (proxy?: string) => {
  const proxyUrl = proxy?.trim() || getProxyFromEnv()

  if (!proxyUrl) {
    return undefined
  }

  let dispatcher = proxyAgentMap.get(proxyUrl)

  if (!dispatcher) {
    dispatcher = new ProxyAgent(proxyUrl)
    proxyAgentMap.set(proxyUrl, dispatcher)
  }

  return dispatcher
}

const parseResponse = async (response: Response, responseType?: ResponseType) => {
  if (responseType === 'arraybuffer') {
    return Buffer.from(await response.arrayBuffer())
  }

  if (responseType === 'text') {
    return await response.text()
  }

  const contentType = response.headers.get('content-type')
  if (responseType === 'json' || contentType?.includes('application/json')) {
    return await response.json()
  }

  return await response.text()
}

async function doRequest<T = unknown>(
  config: RequestConfig
): Promise<RequestResponse<T>> {
  const { method = 'GET', url, data, headers, responseType, proxy } = config

  const init: RequestInit = { method }

  if (data) {
    init.headers = { 'Content-Type': 'application/json', ...headers }
    init.body = JSON.stringify(data)
  } else if (headers) {
    init.headers = headers
  }

  const dispatcher = getDispatcher(proxy)

  if (dispatcher) {
    ; (init as any).dispatcher = dispatcher
  }

  try {
    const response = await fetch(url, init as RequestInit)

    if (!response.ok) {
      throw new Error(
        `Request failed [${method}] ${url} (${response.status} ${response.statusText})`
      )
    }

    const responseData = await parseResponse(response, responseType)

    return { data: responseData as T }
  } catch (error) {
    debug('Request error: %o', error)
    throw error
  }
}

const request = Object.assign(doRequest, {
  get: <T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) =>
    doRequest<T>({ ...config, method: 'GET', url })
})

export default request
