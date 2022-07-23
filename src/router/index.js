import Vue from 'vue'
import VueRouter from 'vue-router'

import jwt from 'jsonwebtoken'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 懒加载 导入页面
const Login = () => import('../views/Login.vue')
const Control = () => import('../views/Control.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const User = () => import('../views/User.vue')
const Admin = () => import('../views/Admin.vue')
const Carousel = () => import('../views/Carousel.vue')
const Productcate = () => import('../views/Productcate.vue')
const Product = () => import('../views/Product.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, meta: { noAuth: true } },
    {
      path: '/control',
      component: Control,
      children: [
        { path: '/', redirect: 'dashboard' },
        { path: 'dashboard', component: Dashboard },
        { path: 'user', component: User },
        { path: 'admin', component: Admin },
        { path: 'carousel', component: Carousel },
        { path: 'productcate', component: Productcate },
        { path: 'product', component: Product }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 让loading走起来
  NProgress.start()

  const token = localStorage.getItem('XX-Token')
  let valid = token && true
  if (valid) {
    try {
      jwt.verify(token, '1314')
    } catch (err) {
      Vue.prototype.$notify.error({ title: '历史信息失效，重新登入', message: err })
      valid = false
    }
  }
  if (valid) {
    if (to.path === '/login') next('/control')
  } else {
    if (!to.meta.noAuth) next('/login')
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
