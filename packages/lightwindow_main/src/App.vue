<template>
  <VApp>
    <div>
      <v-expand-transition>
        <div class="alert" v-show="popState.showPop">
          <v-alert class="ma-0" dense text :type="popState.type">{{ popState.text }}</v-alert>
        </div>
      </v-expand-transition>

      <router-view></router-view>
    </div>
  </VApp>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { popState } from '@/common/js/util'
</script>

<style scoped>
.alert {
  left: 0;
  right: 0;
  z-index: 8;
  position: absolute;
  background-color: white;
}
</style>
