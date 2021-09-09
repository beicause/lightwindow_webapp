<template>
    <v-btn @click="onClick">click</v-btn>
</template>

<script lang="ts">
import { Voice } from "@/music/common/data";
import Vue from "vue";

export default Vue.extend({
  name: "IndexApp",
  methods:{
    onClick(){
      const audio=new Audio()
      audio.src=Voice.getVoicePath('1')
      audio.load()
      audio.oncanplay=()=> {
        audio.playbackRate=1.5
        audio.play()
      }
    }
  }
})
</script>

<style scoped>

</style>
