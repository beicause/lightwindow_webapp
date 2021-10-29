import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Android, POLICY_VERSION } from '@/common/js/const'
import { sendPV } from '@/common/js/util'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/index/IndexApp.vue'),
    beforeEnter (to, from, next) {
      sendPV({ to: '/' })
      next()
    }
  },
  {
    path: '/policy',
    component: () => import('@/policy/PolicyApp.vue')
  },
  {
    path: '/main',
    component: () => import('@/main/MainApp.vue'),
    beforeEnter (to, from, next) {
      if (!Android) {
        sendPV({
          to: 'main',
          isAndroid: 'false'
        })
        next()
      } else if (Android.getPolicy() !== POLICY_VERSION) {
        sendPV({ to: 'policy' })
        next('/policy')
      } else {
        sendPV({ to: 'main' })
        next()
      }
    },
    children: [
      {
        path: '',
        redirect: 'feature'
      },
      {
        path: 'feature',
        name: 'feature',
        component: () => import('@/main/views/Feature.vue')
      },
      {
        path: 'guide',
        name: 'guide',
        component: () => import('../main/views/Guide.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../main/views/About.vue')
      }]
  },
  {
    path: '/music',
    component: () => import('@/music/MusicApp.vue')
  },
  {
    path: '/calendar',
    beforeEnter (to, from, next) {
      if (!Android) {
        sendPV({
          to: 'calendar',
          isAndroid: 'false'
        })
        window.location.href = 'https://qingcheng.asia/calendar/'
      } else if (Android.getPolicy() !== POLICY_VERSION) {
        sendPV({ to: 'policy' })
        next('/policy')
      } else {
        sendPV({ to: 'calendar' })
        window.location.href = 'https://qingcheng.asia/calendar/'
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
