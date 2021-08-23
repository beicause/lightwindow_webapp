<script lang="ts">
import store from "@/store";
import Vue from 'vue'
export default Vue.extend({
  mpType: 'app',
  onLaunch: function () {
    console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
    console.log('App Launch')
    store.commit('initAll');
    // #ifdef H5
    (window as any)['getVersion'] = () => 100
    console.log((window as any).getVersion());
    // #endif
    console.log(store.state.updateTime)
    console.log(store.state.events)
    uni.preloadPage({url: "/pages/day/day"})
    uni.preloadPage({url: "/pages/week/week"})
    uni.preloadPage({url: "/pages/mon/mon"})
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
})
</script>

<style>
/*每个页面公共css */
.app-container {
  padding: 0 5px;
}

.build-margin {
  margin-top: 10px;
}

.cld-com-height {
  height: 507px;
}
</style>
