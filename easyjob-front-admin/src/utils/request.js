import axios from 'axios'
import { ElLoading } from 'element-plus'
import router from '@/router'
import Message from '@/utils/message'


let loading = null
const instance = axios.create({
  baseURL: "/api",
  timeout: 5000
})

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'

//请求拦截器
instance.interceptors.request.use((config) => {
  if (config.showLoading) {
    // 设置loading,防止重复请求
    loading = ElLoading.service({
      lock: true,
      text: '加载中',
      background: 'rgba(0,0,0,0.7)'
    })
  }
  return config
}, (error) => {
  if (config.showLoading && loading) {
    loading.close()
  }
  Message.error('请求发送失败')
  return Promise.reject(error)
})

//请求后拦截器
instance.interceptors.response.use((response) => {
  const { showLoading, errorCallback, showError = true } = response.config
  if (showLoading && loading) {
    loading.close()
  }
  const responseDate = response.data
  // 正常请求
  if (responseDate.code === 200) {
    return responseDate.data
  } else if (responseDate.code === 901) {
    //登录超时
    setTimeout(() => {
      router.push('/login')
    }, 2000);
    return Promise.reject({ showError: true, msg: '请求超时' })
  } else {
    //其他错误
    if (errorCallback) {
      errorCallback(responseDate.info)
    }
    return Promise.reject({ showError: showError, msg: responseDate.info })
  }

}, (error) => {
  if (error.config.showLoading && loading) {
    loading.close()
  }
  return Promise.reject({ showError: true, msg: '网络异常' })
})

const request = (config) => {
  const { url, params, dateType, showLoading = true, } = config
  let contentType = contentTypeForm
  let formData = new FormData() //创建表单对象
  for (let key in params) {
    formData.append(key, params[key] === undefined ? '' : params[key])
  }
  if (dateType != null && dateType === 'json') {
    contentType = contentTypeJson
  }
  let headers = {
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  return instance.post(url, formData, {
    headers: headers,
    showLoading: showLoading,
    errorCallback: config.errorCallback,
    showError: config.showError
  }).catch(error => {
    console.log(error)
    if (error.showError) {
      Message.error(error.msg)
    }
    return null
  })
}

export default request