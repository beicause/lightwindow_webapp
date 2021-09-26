import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {Android} from "@/common/android";
import {POLICY_VERSION} from "@/common/const";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        component: () => import("@/index/IndexApp.vue")
    },
    {
        path: "/policy",
        component: () => import("@/policy/PolicyApp.vue")
    },
    {
        path: '/main',
        component: () => import ("@/main/MainApp.vue"),
        beforeEnter(to, from, next) {
            if (!Android) next()
            else if (Android.getPolicy() !== POLICY_VERSION) next('/policy')
            else next()
        },
        children: [
            {
                path: '',
                redirect: 'feature'
            },
            {
                path: 'feature',
                name: 'feature',
                component: () => import ("@/main/views/Feature.vue")
            },
            {
                path: 'guide',
                name: 'guide',
                component: () => import('../main/views/Guide.vue')
            },
            {
                path: 'about',
                name: 'about',
                component: () => import(/* webpackChunkName: "about" */ '../main/views/About.vue')
            }]
    },
    {
        path: '/music',
        component: () => import('@/music/MusicApp.vue')
    },
    {
        path: '/calendar',
        beforeEnter(to, from, next) {
            if (!Android)
                window.location.href = 'https://qingcheng.asia/calendar/'
            else if (Android.getPolicy() !== POLICY_VERSION) next('/policy')
            else window.location.href = 'https://qingcheng.asia/calendar/'
        },
    }
]

const router = new VueRouter({
    mode: "history",
    routes,
})

export default router
