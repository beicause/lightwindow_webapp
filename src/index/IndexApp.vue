<template>
  <div>
    <v-btn @click="onClick">click</v-btn>
    <v-btn @click="onClick1"></v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SoundFont from 'soundfont-player'
export default Vue.extend({
  name: "IndexApp",
  data(){return{
    isPlaying:false ,
    ac:new AudioContext()
  }},
  methods:{
    onClick(){
      SoundFont.instrument(this.ac,'acoustic_grand_piano',{gain:10}).then(p=>{
        p.schedule(1,[{time:0,note:'60'},{time:0,note: '61'},{time: 0,note: '62',duration:0.1}])
        // p.play('60')
        // p.play('0')
        // p.play('60')
        // p.play('0')
        // p.play('60')
        // p.on('ended',()=>console.log(this.ac.state))
      })
      // const audio=new Audio()
      // audio.src=Voice.getVoicePath('1')
      // audio.load()
      // audio.oncanplay=()=> {
      //   audio.playbackRate=1.5
      //   audio.play()
      // }
    },
    onClick1(){

      if (this.isPlaying)this.ac.suspend()
      else this.ac.resume()
      this.isPlaying=!this.isPlaying
    }
  }
})
</script>

<style scoped>

</style>
