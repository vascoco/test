import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import User from '@/components/User.vue'
import Roles from '@/components/Roles.vue'
import Rights from '@/components/Rights.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
      path: '/user',
      component: User
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/rights',
      component: Rights
    }
    ]
  }
  ]
})

// to :表示去哪里
// from :表示从哪里来
// next 表示放行
// 这里需要
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
