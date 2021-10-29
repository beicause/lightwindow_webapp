<template>
  <v-container>
    <feature-item :show-run="Android" name="日程表" :is-running="isNoticeRunning" prepend-icon="fal fa-calendar-week"
                  @run-click="runCalendar" @nav-click="navCalendar"></feature-item>
    <feature-item name="音乐谱" :is-running="false" prepend-icon="fal fa-music"
                  @nav-click="$router.push('/music')"></feature-item>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import FeatureItem from '@/main/components/FeatureItem.vue'
import { Android } from '@/common/js/const'

export default Vue.extend({
  name: 'feature',
  components: { FeatureItem },
  data () {
    return {
      isNoticeRunning: false,
      // isPetRunning: false,
      Android
    }
  },
  mounted () {
    this.isNoticeRunning = !!Android?.isNoticeRunning()
  },
  methods: {
    runCalendar () {
      this.isNoticeRunning = !this.isNoticeRunning
      if (Android) {
        if (this.isNoticeRunning) {
          Android.startNoticeService()
          // Const.redirectToCalendar()
        } else {
          Android.stopNoticeService()
        }
      }
    },
    navCalendar () {
      if (Android) {
        Android.redirectToCalendar()
      } else {
        window.location.href = 'https://qingcheng.asia/calendar/'
      }
    }
  }
})
</script>
