import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Feature from "@/views/Feature.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path:'/',
    redirect:'/feature'
  },
  {
    path: '/feature',
    name: 'feature',
    component: Feature
  },
  {
    path:'/guide',
    name:'guide',
    component:()=>import('../views/Guide.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode:"hash",
  routes
})

export default router
