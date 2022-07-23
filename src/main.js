import './theme/index.css'
import './assets/css/reset.less'
import Vue from 'vue'

import router from './router/index.js'
import store from './store/index.js'
import http from './utils/request'

// 组件
import ElementUI from 'element-ui'

// 导入接口
import './api/index.js'

// 使用与配置
Vue.prototype.$http = http
Vue.use(ElementUI)

// 组件配置
// Vue.use(Element, { size: 'small', zIndex: 3000 })

new Vue({
  render: h => h('router-view'),
  router: router,
  store: store
}).$mount('#app')
