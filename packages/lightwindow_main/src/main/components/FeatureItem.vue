<template>
  <div>
    <v-row no-gutters align="center">
      <v-icon dense class="pr-1" color="blue">{{ prependIcon }}</v-icon>
      <div class="blue--text">{{ name }}</div>
      <v-spacer></v-spacer>
      <v-btn class="mr-1" v-if="showRun" icon @click="$emit('run-click')"
             :color="isRunning?'blue':'red'">
        <v-icon dense :color="isRunning?'blue':'red'">{{
            isRunning ? 'fas fa-spinner fa-spin' : 'mdi-play-speed'
          }}
        </v-icon>
      </v-btn>
      <v-btn color="blue" icon @click="$emit('nav-click')">
        <v-icon>fal fa-location-arrow</v-icon>
      </v-btn>
    </v-row>

    <div class="pb-2">
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FeatureItem',
  props: {
    showRun: {
      type: Boolean,
      default: false
    },
    isRunning: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    prependIcon: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped>

</style>
