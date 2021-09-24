<template>
  <v-app>
    <v-app-bar height="30" app extension-height="35" color="white">
      <template v-slot:default>
        <v-icon size="18" :style="{visibility:zoom?'visible':'hidden'}" @click="onClickZoom"
                color="blue" style="border: #2196f3 solid 1px;">
          mdi mdi-arrow-top-left-bottom-right border
        </v-icon>
        <v-img contain height="20" src="/src/main/assets/bandmin.png"></v-img>
        <v-icon dense @click="()=>{if (Android)Android.close()}" color="blue">
          fal fa-times-circle
        </v-icon>
      </template>

      <template v-slot:extension>
        <v-tabs grow>
          <v-tab :to="{name:'feature'}">
            <v-icon>mdi-database-outline</v-icon>
            <span>功能</span>
          </v-tab>
          <v-tab :to="{name:'guide'}">
            <v-icon>mdi-script-text-outline</v-icon>
            <span>说明</span>
          </v-tab>
          <v-tab :to="{name:'about'}">
            <v-icon>mdi-information-outline</v-icon>
            <span>关于</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Android} from "@/common/android";

export default Vue.extend({
  name: 'GuideApp',
  data() {
    return {
      zoom: true,
      Android
    }
  },
  created() {
    (window as any)['getVersion'] = () => 100
    console.log((window as any).getVersion());
    (window as any)['showZoom'] = () => this.zoom = true
  },
  methods: {
    onClickZoom() {
      this.zoom = false
      Android?.showZoom()
    },
  }
});
</script>
