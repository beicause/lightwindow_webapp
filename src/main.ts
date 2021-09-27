import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import '@/plugins/fontawesome/css/all.min.css'

Vue.config.productionTip = false
const vm = new Vue({
    router,
    vuetify,
    render: h => h(App),
    mounted() {
        document.dispatchEvent(new Event('render-event'))
    }
})
vm.$mount('#app')
export {vm}
