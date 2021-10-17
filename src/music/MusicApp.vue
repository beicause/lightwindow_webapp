<template>
  <div>
    <v-app-bar app color="white" height="30">
      <v-icon @click="$router.push({name:'feature'})" dense color="blue">
        fal fa-arrow-square-left
      </v-icon>
      <v-spacer></v-spacer>
      <v-icon class="ml-n4" dense color="blue">fal fa-music</v-icon>
      <div class="blue--text ml-1">音乐谱</div>
      <v-spacer></v-spacer>
      <v-icon dense @click="closeClick" color="blue">
        fal fa-times-circle
      </v-icon>
    </v-app-bar>
    <v-main>
      <music-main></music-main>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MusicMain from '@/music/components/MusicMain.vue'
import { Android } from '@/common/js/const'

export default Vue.extend({
  name: 'MusicApp',
  components: { MusicMain },
  data () {
    return {
      Android
    }
  },
  methods: {
    closeClick () {
      if (Android) Android.close()
      else window.parent.postMessage('close', '*')
    }
  }
})
</script>

<style scoped>

</style>
