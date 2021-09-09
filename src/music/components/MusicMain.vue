<template>
  <v-container>
    <v-textarea rows="7" auto-grow :value="inputValue" label="请谱写乐章" :rules="rules"
                @input="onInputChange"></v-textarea>
    <v-row>
      <v-slider step="0.125" @change="sliderChange" :max="maxValue" :value="musicValue"></v-slider>
      <v-btn @click="onPlay"
             class="ml-2 mr-2" icon color="blue">
        <v-icon dense>{{ isPlaying ? 'fal fa-pause' : 'fal fa-play' }}</v-icon>
      </v-btn>
    </v-row>
    <music-guide></music-guide>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Voice} from "@/music/common/data";
import MusicGuide from "@/music/components/MusicGuide.vue";
import SoundFont from 'soundfont-player'

class PromiseResponse<T> {
  message: string
  data: T

  constructor(message: string, data: T) {
    this.message = message
    this.data = data
  }
}

export default Vue.extend({
  name: "MusicMain",
  components: {MusicGuide},
  data() {
    return {
      BEAT_DURATION: 0.5,//每拍0.5秒
      srcAudioMap: new Map<string, HTMLAudioElement>(),
      musicValue: 0,
      sliderValue: 0,
      maxValue: 0,
      inputValue: '',
      timerId: 0,
      isPlaying: false,
      noteIndex: 0,
      noteIndexValueMap: [0, 0] as [number, number]
    }
  },
  computed: {
    rules(): ((value: string) => boolean | string)[] {
      return [
        (value: string) => !(/uuuu/.test(value) && value[value.length - 1] !== '1') || 'uuuu后只能为1',
        // (value: string) => !(/[ud#]/.test(value) && !/\d/.test(value[value.length - 1])) || '变音记号后请接音符',
        (value: string) => (/^[0-7\r\n/_+ud#]*$/.test(value) || !value) || '出现非法字符',
        (value: string) => !/_{3,}/.test(value) || '不能小于十六分音符',
        // (value: string) => !/_#*\.*[0-7]?\.*\+/.test(value) || '增时线和减时线不可共用',
        (value: string) => {
          let error = false
          const sections = value.split('/')
          sections.forEach(r => {
            if (this.sectionBeat(r) > 4) error = true
          })
          return (!error) || '每小节不超过四拍'
        }
      ]
    }
  },
  methods: {
    onInputChange(value: string) {
      //如果长度增加
      if (value.length > this.inputValue.length) this.voiceLastNote(value)
      const sections = value.split('/')
      if (this.sectionBeat(sections[sections.length - 1]) === 4) value += '/'
      let musicLength = 0
      sections.forEach(s => musicLength += this.sectionBeat(s) * this.BEAT_DURATION)
      this.maxValue = musicLength
      this.noteIndex = 0
      this.musicValue = 0
      this.sliderValue = 0
      this.inputValue = value
    },

    onPlay: async function () {
      if (this.isPlaying) {
        this.isPlaying = false
        this.srcAudioMap.forEach(value1 => value1.pause())
        return
      }
      this.isPlaying = true
      this.sliderValue=this.musicValue
      this.musicValue = 0
      this.noteIndex = 0
      while (this.isPlaying) {
        for (; this.noteIndex <= this.inputValue.length; this.noteIndex++) {
          if (this.inputValue[this.noteIndex] === '+') continue
          const s = this.inputValue.substring(0, this.noteIndex)
          let isVoice = this.musicValue >= this.sliderValue
          this.musicValue += (await this.voiceLastNote(s, isVoice)).data
        }
        if (this.musicValue === 0) return
        this.noteIndex = 0
        this.musicValue = 0
        this.sliderValue = 0
      }
    },

    sliderChange(value: number) {
      this.srcAudioMap.forEach(value1 => value1.pause())
      this.isPlaying = false
      this.sliderValue = value
    },
    voiceLastNote: async function (s: string, voice = true) {
      const lastChar = s[s.length - 1]
      //不是音符直接返回
      if (!['1', '2', '3', '4', '5', '6', '7', '+'].includes(lastChar))
        return new PromiseResponse<number>('not music note', 0)

      let noteIndexReversed = [] as number[]
      for (let i = s.length - 1; i >= 0; i--) {
        if (/\d/.test(s[i])) noteIndexReversed.push(i)
      }
      let lastNoteIndex = noteIndexReversed[0]
      let lastSecondNoteIndex = noteIndexReversed[1]
      let level = 0
      let duration = this.BEAT_DURATION
      let isSharpe = false
      //解析前置符号
      let sign = s.substring(lastSecondNoteIndex + 1, lastNoteIndex)
      for (let i = 0; i < sign.length; i++) {
        if (sign[i] === 'u') level++
        if (sign[i] === 'd') level--
        if (sign[i] === '#') isSharpe = true
        if (sign[i] === '_') duration /= 2
      }
      //解析增时线
      if (lastChar === '+') duration += (s.length - 1 - lastNoteIndex) * this.BEAT_DURATION
      if (duration > 2) duration = 2

      const path = Voice.getVoicePath(s[lastNoteIndex] as any, level, isSharpe)
      if (voice) {
        if (path) {
          const msg = await this.voice(path, duration)
          return new PromiseResponse<number>(msg, duration)
        } else return new PromiseResponse<number>('path is empty', 0)
      } else return new PromiseResponse<number>('not voice', duration)
    },

    sectionBeat(r: string): number {
      let num = 0
      let isReduce = 0
      for (let i = 0; i < r.length; i++) {
        if (r[i] === '_') isReduce++
        else if (isReduce > 0) {
          num -= 1 - 1 / Math.pow(2, isReduce)
          isReduce = 0
        }
        if (r[i] === '+') num++
        if (/\d/.test(r[i])) num++
      }
      return num
    },
    voice(src: string, duration: number): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        console.log('voice',src,duration)
        this.srcAudioMap.forEach(value => {
          value.pause()
          value.currentTime=0
        })
        let audio = this.srcAudioMap.get(src)
        if (audio) audio.play()
        else {
          console.log('create a new audio')
          audio = new Audio()
          audio.src = src
          audio.load()
          audio.oncanplay = () => {
            if (!audio)reject('audio is undefined')
            else{
              audio.playbackRate = audio.duration / duration
              audio.oncanplay=null
              this.srcAudioMap.set(src, audio)
              audio.play()
            }
          }
        }
        audio.onerror = () => {
          reject('onerror')
        }
        audio.onended = () => {
          resolve('onended')
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
