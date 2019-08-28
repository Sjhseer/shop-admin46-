import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'

Vue.use(Router)
// 命名路由, 有名字的路由
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    }
  ]
})
router.beforeEach((to, form, next) => {
  console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
