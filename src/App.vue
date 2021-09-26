<template>
  <v-app>
    <div>
      <v-expand-transition>
        <div class="alert" v-show="show">
          <v-alert class="ma-0" dense text :type="type">{{ text }}</v-alert>
        </div>
      </v-expand-transition>

      <router-view></router-view>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import {closePop} from "@/common/util";
import {vm} from "@/main";
import {VERSION} from "@/common/const";

export default Vue.extend({
  name: "App",
  data() {
    return {
      show: false,
      type: 'info' as 'info' | 'error' | 'success' | 'warning',
      text: ''
    }
  },
  created() {
    (window as any)['getVersion'] = () => VERSION
    console.log((window as any).getVersion());
  },
  mounted() {
    vm.$on('close-pop', () => this.show = false)
    vm.$on('show-pop', ({text, type, duration}:
                            { text: string, type: 'info' | 'error' | 'success' | 'warning', duration: number }) => {
      this.text = text
      this.type = type
      this.show = true
      setTimeout(() => closePop(), duration)
    })
  }
})
</script>

<style scoped>
.alert {
  left: 0;
  right: 0;
  z-index: 8;
  position: absolute;
  background-color: white;
}
</style>
