import axios from 'axios'

import { debug } from './logger'

const request = axios.create()

request.interceptors.response.use(
  res => {
    return res
  },
  error => {
    debug('Request error: %o', error)
    return Promise.reject(error)
  }
)

export default request
