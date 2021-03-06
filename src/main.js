
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = axios
// 配置ajax的默认请求地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置ajax的token每次发送真正请求之前都带上token 拼到请求头中
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器 res.data
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY年MM月DD日 HH：mm:ss')
})

new Vue({
  router,

  render: h => h(App)
}).$mount('#app')
