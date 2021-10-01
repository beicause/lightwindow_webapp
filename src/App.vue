<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mpType: 'app',
  onLaunch: function () {
    // #ifdef H5
    (window as any)['getVersion'] = () => '100'
    // #endif

    uni.preloadPage({url: "/pages/day/day"})
    uni.preloadPage({url: "/pages/week/week"})
    uni.preloadPage({url: "/pages/mon/mon"})
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
