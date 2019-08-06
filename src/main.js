// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import axios from 'axios'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
import utils from './utils';
import './axios'
moment.locale('zh-cn');

Vue.prototype.$axios = axios
Vue.use(Antd)




import {
  Container,
  Header,
  Aside,
  Main
} from "element-ui";
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);


//Vue.prototype.$baseUrl=utils.getUrlKey();//打包放出
Vue.prototype.$baseUrl = "http://192.168.2.45:8080/";//打包屏蔽
// Vue.prototype.$baseUrl = "https://test.heidouinfo.com";//打包屏蔽
Vue.prototype.$uploadUrl = "http://file.heidouinfo.com/";//文件服务器地址
import '../src/assets/styles/common.scss'

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(function (item) {
   
//     return item.meta.isAuthRequired
//   })) {
//     next('/home')
//   } else 
//     next()
// })

router.beforeEach((to, from, next) => { 
  next(); 
});

// router.beforeEach((to, from, next) => {
//   let token = sessionStorage.getItem("code");
//   //如果有token的话说明你已经登录,让你正常登录
//   if (token) {
//     next();
//   } else {
//     //如果没有登录你访问的不是login就让你强制跳转到login页面
//     if (to.path !== "/login") {
//       next({ path: "/login" });
//     } else {
//       next();
//     }
//   }
// });



/* eslint-disable no-new */
var s = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
