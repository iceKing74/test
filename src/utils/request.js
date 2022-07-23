import Vue from 'vue'
import axios from 'axios'

const vm = Vue.prototype

// 创建 axios 实例
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 9000,
  headers: {
    'Content-Type': 'application/json',
    'Gx-Token': null
  }
})

const error = (err) => {
  if (err.response) {
    const { status } = err.response
    if (status === 401) {
      vm.$notify.error({ title: '401 错误', message: '访问被拒绝！' })
    } else if (status === 403) {
      vm.$notify.error({ title: '403 错误', message: '资源不可用！' })
    } else if (status === 404) {
      vm.$notify.error({ title: '404 错误', message: '找不到页面！' })
    } else if (status === 405) {
      vm.$notify.error({ title: '405 错误', message: '不允许此方法！' })
    } else if (status === 500) {
      vm.$notify.error({ title: '500 错误', message: '服务内部错误！' })
    } else if (status === 503) {
      vm.$notify.error({ title: '503 错误', message: '服务过载错误！' })
    } else {
      vm.$notify.error({ title: '错误', message: '未知错误！' })
    }
  }

  // 返回输出错误
  return Promise.reject(err)
}

http.interceptors.request.use(config => {
  return config
}, error)

http.interceptors.response.use(response => {
  return response.data
}, error)

export default http
