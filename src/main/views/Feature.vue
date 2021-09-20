<template>
  <v-container>
    <feature-item name="日程表" :is-running="isCldRunning" prepend-icon="fal fa-calendar-week"
                  @prepend-click="clickCld"></feature-item>
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
      isCldRunning: false,
      isPetRunning: false,
      Android
    }
  },
  mounted() {
    this.isCldRunning = !!Android?.isCldRunning()
  },
  methods: {
    clickCld() {
      this.isCldRunning = !this.isCldRunning
      if (Android) {
        if (this.isCldRunning) Android.startCldService(); else Android.stopCldService()
      } else window.location.href = 'https://qingcheng.asia/cld/'

    }
  }
})
</script>
