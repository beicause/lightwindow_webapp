import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import * as VComponents from 'vuetify/lib/components'

Vue.use(Vuetify, {components: {...VComponents}});

export default new Vuetify({
    icons:{
        iconfont:'fa'
    }
});
