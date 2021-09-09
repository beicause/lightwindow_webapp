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
        path:'/music',
        component:()=>import('@/music/MusicApp.vue')
    }
]

const router = new VueRouter({
    mode: "hash",
    routes
})

export default router
