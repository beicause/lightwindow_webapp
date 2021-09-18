<template>
  <v-container>
    <v-textarea auto-grow :value="firstScore.inputValue" :label="levelName.get(firstScore.level)" :rules="rules"
                @input="e=>onInput(firstScore)(e)" append-icon="fal fa-cog"
                @click:append="()=>{this.blur();this.activeSettingPicker=0;$refs.picker.open()}"></v-textarea>
    <v-textarea style="padding: 0" auto-grow :value="secondScore.inputValue" :label="levelName.get(secondScore.level)"
                :rules="rules" append-icon="fal fa-cog"
                @click:append="()=>{this.blur();this.activeSettingPicker=1;$refs.picker.open()}"
                @input="e=>onInput(secondScore)(e)"></v-textarea>
    <v-slider dense :step="STEP" @change="sliderChange" :max="maxTime" :value="musicTime"
              :append-icon="isPlaying ? 'fal fa-pause' : 'fal fa-play'" @click:append="onPlay"></v-slider>

    <music-guide class="pt-0"></music-guide>
    <setting-picker ref="picker">
      <setting-clipboard @copied="onCopied" @pasted="onPasted"
                         :copy-value="activeSettingScore.inputValue"></setting-clipboard>
      <v-container>
        <setting-item
            @down-click="()=>{
            this.activeSettingScore.level--
            if (this.activeSettingScore.level===-2)this.activeSettingScore.level=1
        this.initMusic()}"
            @up-click="()=>{
          this.activeSettingScore.level++
          if (this.activeSettingScore.level===2)this.activeSettingScore.level=-1
          this.initMusic()}">
          音调：1={{ activeSettingScore.level === 0 ? 'c1' : (activeSettingScore.level === 1 ? 'c2' : 'c') }}
        </setting-item>

        <setting-item
            @down-click="()=>{
        this.activeSettingScore.gain--
        this.initMusic()}"
            @up-click="()=>{
          this.activeSettingScore.gain++
          this.initMusic()}">音量：{{ activeSettingScore.gain }}
        </setting-item>

        <setting-item
            @down-click="()=>{
        this.BEAT_DURATION=60/(60/BEAT_DURATION-10)
        this.initMusic()}"
            @up-click="()=>{
        this.BEAT_DURATION=60/(60/BEAT_DURATION+10)
        this.initMusic()}">速度：{{ Math.floor(60 / BEAT_DURATION) }}
        </setting-item>
      </v-container>
    </setting-picker>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import MusicGuide from "@/music/components/MusicGuide.vue";
import SoundFont from 'soundfont-player'
import SettingItem from "@/music/components/SettingItem.vue";
import SettingPicker from "@/music/components/SettingPicker.vue";
import SettingClipboard from "@/music/components/SettingClipboard.vue";
import {showPop} from "@/common/util";

interface ScoreInfo {
  inputValue: string
  level: 0 | 1 | -1,
  gain: number
}

export default Vue.extend({
  name: "MusicMain",
  components: {SettingClipboard, SettingPicker, SettingItem, MusicGuide},
  data() {
    return {
      //每拍0.5秒
      BEAT_DURATION: 0.50,
      STEP: 0.0125,
      firstScore: {inputValue: '', level: 1, gain: 5} as ScoreInfo,
      secondScore: {inputValue: '', level: -1, gain: 5} as ScoreInfo,
      player: {} as SoundFont.Player,
      audio: {} as AudioContext,
      musicTime: 0,
      sliderValue: 0,
      maxTime: 0,
      isPlaying: false,
      activeSettingPicker: 0 as 0 | 1
    }
  },
  computed: {
    activeSettingScore(): ScoreInfo {
      if (this.activeSettingPicker === 0) return this.firstScore
      if (this.activeSettingPicker === 1) return this.secondScore
      throw new Error()
    },
    levelName(): Map<0 | 1 | -1, string> {
      const map = new Map<0 | 1 | -1, string>()
      map.set(1, '高音谱')
      map.set(0, '中音谱')
      map.set(-1, '低音谱')
      return map
    },
    rules(): ((value: string) => boolean | string)[] {
      return [
        (value: string) => !(/uuuu/.test(value) && value[value.length - 1] !== '1') || 'uuuu后只能为1',
        // (value: string) => !(/[ud#]/.test(value) && !/\d/.test(value[value.length - 1])) || '变音记号后请接音符',
        (value: string) => (/^[0-7\r\n/_~ud#]*$/.test(value) || !value) || '出现非法字符',
        (value: string) => !/_{3,}/.test(value) || '不能小于十六分音符',
        // (value: string) => !/_#*\.*[0-7]?\.*\-/.test(value) || '增时线和减时线不可共用',
        // (value: string) => {
        //   let error = false
        //   const sections = value.split('/')
        //   sections.forEach(r => {
        //     if (this.sectionBeat(r) > 4) error = true
        //   })
        //   return (!error) || '每小节不超过四拍'
        // }
      ]
    }
  },
  methods: {
    initMusic() {
      this.onInput(this.firstScore)(this.firstScore.inputValue)
      this.onInput(this.secondScore)(this.secondScore.inputValue)
    },
    onInput(score: ScoreInfo) {
      return (value: string) => {
        console.log(value)
        this.isPlaying = false
        this.player.stop()
        //如果长度增加
        if (value.length > score.inputValue.length) {
          const info = this.lastNoteInfo(value, score.level)
          if (info) this.player.play(info.note, 0, {duration: info.duration, gain: score.gain})
        }
        const sections = value.split('/')
        if (this.sectionBeat(sections[sections.length - 1]) === 4) value += '/'
        let musicLength = 0
        sections.forEach(s => musicLength += this.sectionBeat(s) * this.BEAT_DURATION)
        this.maxTime = musicLength
        this.sliderValue = 0
        this.musicTime = 0
        score.inputValue = value
      }
    },

    onPlay() {
      if (this.isPlaying) {
        this.player.stop()
        this.isPlaying = false
        return
      }
      if (this.musicTime >= this.maxTime) this.musicTime = 0
      const getSchedule = (score: ScoreInfo) => {
        let maxTime = 0
        //获取音符序列
        const schedule = [] as { time: number, note: string, duration: number, gain: number }[]
        const input = score.inputValue
        if (!input) return schedule
        for (let i = 0; i <= input.length; i++) {
          const noteString = input.substring(0, i)
          const info = this.lastNoteInfo(noteString, score.level)
          if (!info) continue
          schedule.push({time: maxTime, note: info.note, duration: info.duration, gain: score.gain})
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
      console.log(this.maxTime)
      const schedule = [...getSchedule(this.firstScore), ...getSchedule(this.secondScore)]
      if (schedule.length === 0) return;
      this.player.schedule(0, schedule)
      this.isPlaying = true

      const step = 0.1
      const timerId = setInterval(() => {
        if (!this.isPlaying) clearInterval(timerId)
        this.musicTime += step
        if (this.musicTime >= this.maxTime) {
          clearInterval(timerId)
          this.onPlay()
          this.musicTime = 0
          setTimeout(() => this.onPlay(), 300)
        }
      }, step * 1000)
      // const target={musicTime:this.musicTime}
      // this.anim = gsap.gsap.to(target, {
      //   duration: this.maxTime - this.musicTime,
      //   musicTime: this.maxTime,
      //   ease:'none',
      //   onUpdate: () => {
      //     if (!this.isPlaying) this.anim.pause()
      //     const value=Math.floor(target.musicTime/this.STEP)*this.STEP
      //     if (this.musicTime!==value)this.musicTime=value
      //   },
      //   onComplete: () => {
      //     this.onPlay()
      //     this.musicTime=0
      //     setTimeout(()=> this.onPlay(),300)
      //   }
      // })
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
      this.player.stop()
      this.isPlaying = false
      this.musicTime = value
    },
    lastNoteInfo(s: string, level: 1 | 0 | -1): { note: string, duration: number } | null {
      const lastChar = s[s.length - 1]
      //不是音符直接返回
      if (!['0', '1', '2', '3', '4', '5', '6', '7', '-'].includes(lastChar)) return null
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
      if (lastChar === '~') duration += (s.length - 1 - lastNoteIndex) * this.BEAT_DURATION
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
        if (r[i] === '~') num++
        if (/\d/.test(r[i])) num++
      }
      return num
    },
    onCopied(isSuccess: boolean) {
      if (isSuccess) showPop('内容复制成功', 'success')
      else showPop('内容为空')
    },
    onPasted(clipValue: string) {
      if (clipValue) {
        this.activeSettingScore.inputValue += clipValue
        showPop('剪切板粘贴成功', 'success')
      } else showPop('剪切板为空')
    },
    blur() {
      for (let element of document.getElementsByTagName('textarea')) {
        element.blur()
      }
    }
  },
  mounted() {
    this.audio = new AudioContext()
    SoundFont.instrument(this.audio, './acoustic_grand_piano.js' as any)
        .then(player => this.player = player)
        .catch((err: any) => console.log(err))
    console.log('soundfont loaded')
  }
})
</script>

<style scoped>

</style>
