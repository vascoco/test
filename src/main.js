// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入elementui
import ElementUI from 'element-ui'
// 导入elementui的样式表
import 'element-ui/lib/theme-chalk/index.css'
// 导入公共样式
import './assets/css/common.css'
// 导入axios
import axios from 'axios'
// 把axios添加到vue实例上
Vue.prototype.axios = axios

Vue.use(ElementUI)

Vue.config.productionTip = false
// 定义全局的baseUrl ,baseURL会自动添加到url之前
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log('拦截到了', config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
