import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },{
    path: '/home',
    component: Home,
    children:[
      {
        path:':id?',
        name:'message',
        component:() => import(/* webpackChunkName: "message" */ '../views/Message.vue'),
      },
      {
        path:'contact',
        name:'contact',
        component:() => import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
      },
      {
        path:'cloud',
        name:'cloud',
        component:() => import(/* webpackChunkName: "cloud" */ '../views/Cloud.vue'),
      }
    ]
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
const whiteList = ['/','/login']
// router.beforeEach((to, from, next) => {
//   console.warn(to)
//   if (whiteList.some((i) => to.path=== i)) {
//     console.error('white')
//     start()
//     next()
//   } else {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       console.error('home')
//       Toast.fail('请登录后再操作')
//       next({ path: '/login' })
//     } else {
//       console.error('continus')
//       start()
//       next()
//     }
//   }
// })
// router.afterEach(() => {
//   done()
// })
router.onError((err) => alert(err))
export default router