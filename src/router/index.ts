import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path:"/",
        component:()=>import("@/index/IndexApp.vue")
    },
    {
        path: '/guide',
        component: () => import ("@/guide/GuideApp.vue"),
        children: [
            {
                path: '',
                redirect: 'feature'
            },
            {
                path: 'feature',
                name: 'feature',
                component: () => import ("@/guide/views/Feature.vue")
            },
            {
                path: 'guide',
                name: 'guide',
                component: () => import('../guide/views/Guide.vue')
            },
            {
                path: 'about',
                name: 'about',
                component: () => import(/* webpackChunkName: "about" */ '../guide/views/About.vue')
            }]
    },
    {
        path: '/music',
        component: () => import('@/music/MusicApp.vue')
    },
    {
        path: '/cld',
        beforeEnter: () => window.location.href = 'https://qingcheng.asia/cld/'
    }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router
