import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import '@/plugins/fontawesome/css/all.min.css'
import '@/common/css/www.fontorg.com.f222-4ac0011d9f0.css'

Vue.config.productionTip = false
const vm = new Vue({
    router,
    vuetify,
    render: h => h(App)
})
vm.$mount('#app')
export {vm}
