import axios from 'axios'

import log from './log'

const request = axios.create()

request.interceptors.response.use(
  res => {
    return res
  },
  error => {
    log('Request error: %s', error)
    return Promise.reject(error)
  }
)

export default request
