import axios from 'axios' 
import { message } from 'ant-design-vue'

// 配置默认的host,假如你的API host是：http://api.htmlx.club
// axios.defaults.baseURL = 'http://192.168.2.45:8080/'    

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
　　// 在发送请求之前做些什么
　　return config
}, function (error) {
　　// 对请求错误做些什么
return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  var code = response.data.code;
  if (code == 205) {
    location.href = window.location.origin
    // location.href = 'http://localhost:8084'
    message.error(response.data.message);
  }
　　// 对响应数据做点什么
　　return response
}, function (error) {
　　// 对响应错误做点什么
// console.log(err)
  // debugger
　　return Promise.reject(error)
});