<template>
  <v-app>
    <v-app-bar app color="white" height="30">
      <v-icon @click="$router.push({name:'feature'})" dense color="blue">
        fal fa-arrow-square-left
      </v-icon>
      <v-spacer></v-spacer>
      <v-icon dense color="blue">fal fa-music</v-icon>
      <div class="blue--text ml-1">音乐谱</div>
      <v-spacer></v-spacer>
      <v-icon dense @click="()=>{if (Android)Android.close()}" color="blue" class="mr-n3">
        fal fa-times-circle
      </v-icon>
    </v-app-bar>
    <v-main>
      <music-main></music-main>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import {Android} from "@/guide/common/android";
import MusicMain from "@/music/components/MusicMain.vue";

export default Vue.extend({
  name: "MusicApp",
  components: {MusicMain},
  data() {
    return {
      Android
    }
  }
})
</script>

<style scoped>

</style>
