<template>
  <v-app>
    <v-app-bar height="30" app extension-height="35" color="white">
      <template v-slot:default>
        <v-img contain height="20" src="@/assets/bandmin.png"></v-img>
        <v-icon dense @click="()=>{if (Android)Android.close()}" color="blue" style="position: absolute;right: 5px;">
          fal fa-times-circle</v-icon>
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
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Android} from "@/common/android";

export default Vue.extend({
  name: 'App',
  data() {
    return {
      Android
    }
  },
  mounted() {
    (window as any)['getVersion']=()=>100
    console.log((window as any).getVersion())
  }
});
</script>
