<template>
  <v-container>
    <feature-item name="日程表" :is-running="isNoticeRunning" prepend-icon="fal fa-calendar-week"
                  @prepend-click="clickCalendar"></feature-item>
    <feature-item name="音乐谱" :is-running="false" prepend-icon="fal fa-music"
                  @prepend-click="$router.push('/music')"></feature-item>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Android} from "@/common/android";
import FeatureItem from "@/main/components/FeatureItem.vue";

export default Vue.extend({
  name: 'feature',
  components: {FeatureItem},
  data() {
    return {
      isNoticeRunning: false,
      isPetRunning: false,
      Android
    }
  },
  mounted() {
    this.isNoticeRunning = !!Android?.isNoticeRunning()
  },
  methods: {
    clickCalendar() {
      this.isNoticeRunning = !this.isNoticeRunning
      if (Android) {
        if (this.isNoticeRunning) {
          Android.startNoticeService()
          Android.redirectToCalendar()
        } else Android.stopNoticeService()
      } else window.location.href = 'https://qingcheng.asia/calendar/'
    }
  }
})
</script>
