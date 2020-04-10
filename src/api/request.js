import axios from 'axios'
import {LOGINAUTHTOKEN} from '../utils/constants'

const baseURL = '/console'
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
})
axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(
  config => {
    let sessionToken = window.localStorage.getItem(LOGINAUTHTOKEN)
    if (sessionToken) {
      // eslint-disable-next-line
      config.headers['console-token'] = `${sessionToken}`.replace(/(^\")|(\"$)/g, '')
    }
    return config
  },
  err => {
    console.error('interceptor error print',err.response.status)
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      response = response.data
      if(response.code){
        if(response.code === 0) {
          return response
        } else {
          return Promise.reject(response)
        }
      }
    }
    return response
  },
  err => {
    return Promise.reject(err)
  }
)

export default {
  async get (url, params, responseType) {
    return instance.get(url, params, {responseType})
  },
  async post (url, params, responseType) {
    return instance.post(url, params, {responseType})
  },
  async delete (url, params) {
    return instance.delete(url, params)
  },
  async patch (url, params) {
    return instance.patch(url, params)
  },
  async put (url, params) {
    return instance.put(url, params)
  },
  getBaseUrl () {
    return baseURL
  }
}
