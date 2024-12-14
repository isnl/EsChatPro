// @ts-nocheck
import axios from './axios'
// get
export function get(url, params?: { [key: string]: number | string }): Promise<any> {
  return axios({
    url,
    method: 'get',
    params
  })
}
// post
export function post(url, data = {}, config = {}) {
  return axios({
    url,
    method: 'post',
    data,
    ...config
  })
}
// put
export function put(url, data) {
  return axios({
    url,
    method: 'put',
    data
  })
}

export function patch(url, data) {
  return axios({
    url,
    method: 'patch',
    data
  })
}
// deleteAction
export function deleteAction(url, params = {}) {
  return axios({
    url,
    method: 'delete',
    params
  })
}
export default {
  get,
  post,
  put,
  patch,
  delete: deleteAction
}
export const service = {
  get,
  post,
  put,
  patch,
  delete: deleteAction
}
