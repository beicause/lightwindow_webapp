<template>
  <v-container>
    <v-row class="pt-4">
      <v-col>
        <v-row align="center">
          <v-icon dense class="pl-5 pr-1" color="blue">fal fa-calendar-week</v-icon>
          <div class="blue--text">日程表</div>
          <v-spacer></v-spacer>
          <v-btn small class="mx-auto mr-2" @click="()=>{this.isCldRunning=!isCldRunning
          if (Android){if (isCldRunning)Android.startCldService();else Android.stopCldService()}}"
                 :color="isCldRunning?'blue':'red'" outlined>
            <v-icon dense :color="isCldRunning?'blue':'red'">{{
                isCldRunning ? 'fas fa-spinner fa-spin' : 'mdi-play-speed'
              }}
            </v-icon>
          </v-btn>
        </v-row>

        <v-row class="pt-2">
          <v-divider></v-divider>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="pt-2">
      <v-col>
        <v-row align="center">
          <v-icon dense class="pl-5 pr-1" color="blue">far fa-paw</v-icon>
          <div class="blue--text">小宠物</div>
          <v-spacer></v-spacer>
          <v-btn small class="mx-auto mr-2" @click="()=>{this.isPetRunning=!isPetRunning}"
                 :color="isPetRunning?'blue':'red'" outlined>
            <v-icon dense :color="isPetRunning?'blue':'red'">{{
                isPetRunning ? 'fas fa-spinner fa-spin' : 'mdi-play-speed'
              }}
            </v-icon>
          </v-btn>
        </v-row>

        <v-row class="pt-2">
          <v-divider></v-divider>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Android} from "@/common/android";

export default Vue.extend({
  name: 'feature',
  data() {
    return {
      isCldRunning: false,
      isPetRunning:false,
      Android
    }
  },
  mounted() {
    this.isCldRunning = !!Android?.isCldRunning()
  }
})
</script>
