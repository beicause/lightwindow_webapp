<template>
  <v-container>
    <v-textarea auto-grow :value="getInputValue(1)" label="高音谱" :rules="rules"
                @input="e=>onInput(1)(e)"></v-textarea>
    <v-textarea style="padding: 0" auto-grow :value="getInputValue(-1)" label="低音谱" :rules="rules"
                @input="e=>onInput(-1)(e)"></v-textarea>
    <v-row>
      <v-slider step="0.00125" @change="sliderChange" :max="maxTime" :value="musicTime"></v-slider>
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
import MusicGuide from "@/music/components/MusicGuide.vue";
import SoundFont from 'soundfont-player'
import * as gsap from "gsap";

export default Vue.extend({
  name: "MusicMain",
  components: {MusicGuide},
  data() {
    return {
      //每拍0.5秒
      BEAT_DURATION: 0.5,
      player: {} as SoundFont.Player,
      audio: {} as AudioContext,
      musicTime: 0,
      sliderValue: 0,
      maxTime: 0,
      inputValueHigh: '',
      inputValueLow: '',
      isPlaying: false,
      anim: {} as any
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
    onInput(level: 1 | 0 | -1) {
      return (value: string) => {
        //如果长度增加
        if (value.length > this.getInputValue(level).length) {
          const info = this.lastNoteInfo(value, level)
          if (info) this.player.play(info.note, 0, {duration: info.duration})
        }
        const sections = value.split('/')
        if (this.sectionBeat(sections[sections.length - 1]) === 4) value += '/'
        let musicLength = 0
        sections.forEach(s => musicLength += this.sectionBeat(s) * this.BEAT_DURATION)
        this.maxTime = musicLength
        this.musicTime = 0
        this.sliderValue = 0
        this.setInputValue(level, value)
      }
    },

    onPlay() {
      if (this.isPlaying) {
        this.player.stop()
        this.isPlaying = false
        return
      }
      if (this.musicTime >= this.maxTime) this.musicTime = 0
      const getSchedule = (level: 1 | 0 | -1) => {
        let maxTime = 0
        //获取音符序列
        const schedule = [] as { time: number, note: string, duration: number }[]
        for (let i = 0; i <= this.getInputValue(level).length; i++) {
          const noteString = this.getInputValue(level).substring(0, i)
          const info = this.lastNoteInfo(noteString, level)
          if (!info) continue
          schedule.push({time: maxTime, note: info.note, duration: info.duration})
          maxTime += info.duration
        }

        //剔除时间小于滑块值的
        for (let i = 0; i < schedule.length; i++) {
          schedule[i].time -= this.musicTime
          if (schedule[i].time < 0) {
            schedule.splice(i, 1)
            i--
          }
        }
        if (maxTime > this.maxTime) this.maxTime = maxTime
        return schedule
      }
      this.player.schedule(0, [...getSchedule(1), ...getSchedule(-1)])
      this.isPlaying = true
      this.anim = gsap.gsap.to(this.$data, {
        duration: this.maxTime - this.musicTime,
        musicTime: this.maxTime,
        ease:'none',
        onUpdate: () => {
          if (!this.isPlaying) this.anim.pause()
        },
        onComplete: () => {
          this.onPlay()
          this.musicTime=0
          setTimeout(()=> this.onPlay(),300)
        }
      })
      // const update = () => {
      //   if (this.musicTime >= this.maxTime) {
      //     this.onPlay()
      //     this.onPlay()
      //     return
      //   }
      //   if (this.isPlaying) requestAnimationFrame(update)
      //   this.musicTime = baseTime + this.audio.currentTime - startTime
      // }
      // update()
    },

    sliderChange(value: number) {
      this.isPlaying = false
      this.musicTime = value
    },
    lastNoteInfo(s: string, level: 1 | 0 | -1): { note: string, duration: number } | null {
      const lastChar = s[s.length - 1]
      //不是音符直接返回
      if (!['0', '1', '2', '3', '4', '5', '6', '7', '+'].includes(lastChar)) return null
      const noteIndexReversed = [] as number[]
      for (let i = s.length - 1; i >= 0; i--) {
        if (/\d/.test(s[i])) noteIndexReversed.push(i)
        if (noteIndexReversed.length === 2) break
      }
      const lastNoteIndex = noteIndexReversed[0]
      const lastSecondNoteIndex = noteIndexReversed[1]
      const lastNote = s[lastNoteIndex]
      let level1 = 0
      let duration = this.BEAT_DURATION
      let isSharpe = 0

      //解析前置符号
      let sign = s.substring(lastSecondNoteIndex + 1, lastNoteIndex)
      for (let i = 0; i < sign.length; i++) {
        if (sign[i] === 'u') level1++
        if (sign[i] === 'd') level1--
        if (sign[i] === '#') isSharpe = 1
        if (sign[i] === '_') duration /= 2
      }
      //解析增时线
      if (lastChar === '+') duration += (s.length - 1 - lastNoteIndex) * this.BEAT_DURATION
      if (duration > 2) duration = 2

      const note = (lastNote as unknown as number << 0) + 59 + level1 * 12 + isSharpe + 12 * level
      // console.log(note, duration)
      if (lastChar === '0') return {note: '0', duration}
      return {note: '' + note, duration}
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
    getInputValue(level: 0 | 1 | -1): string {
      return ((level: 1 | 0 | -1) => {
        if (level === 1) return this.inputValueHigh
        if (level === -1) return this.inputValueLow
        return ''
      })(level)
    },
    setInputValue(level: 0 | 1 | -1, value: string) {
      if (level === 1) this.inputValueHigh = value
      if (level === -1) this.inputValueLow = value
    }
  },
  mounted() {
    this.audio = new AudioContext()
    SoundFont.instrument(this.audio, './acoustic_grand_piano.js' as any, {gain: 5}).then(player => this.player = player)
    console.log('ok')
  }
})
</script>

<style scoped>

</style>
