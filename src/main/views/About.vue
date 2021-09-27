<template>
  <v-container>
    <v-row no-gutters align="center">
      <v-col cols="3">App版本：</v-col>
      <v-col>{{ appVersion }}</v-col>
      <v-col cols="1">
        <v-btn @click="update" :disabled="!(version&&version.app_version)" icon color="blue">
          <v-icon dense>fal fa-arrow-alt-circle-up</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pb-2">
      <v-divider></v-divider>
    </div>

    <v-row no-gutters align="center">
      <v-col cols="3">网页地址：</v-col>
      <v-col style="overflow: auto">{{ INDEX_URL }}</v-col>
      <v-col cols="1">
        <v-btn @click="copy(INDEX_URL)" icon color="blue">
          <v-icon dense>fal fa-copy</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pb-2">
      <v-divider></v-divider>
    </div>


    <v-row no-gutters align="center">
      <v-col cols="3">开源仓库：</v-col>
      <v-col style="overflow: auto">{{ GIT_URL }}</v-col>
      <v-col cols="1">
        <v-btn @click="copy(GIT_URL)" icon color="blue">
          <v-icon dense>fal fa-copy</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pb-2">
      <v-divider></v-divider>
    </div>

    <v-row no-gutters align="center">
      <v-col cols="3">建议反馈：</v-col>
      <v-col style="overflow: auto">{{ EMAIL }}</v-col>
      <v-col cols="1">
        <v-btn @click="copy(EMAIL)" icon color="blue">
          <v-icon dense>fal fa-copy</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pb-2">
      <v-divider></v-divider>
    </div>

    <v-row no-gutters align="center">
      <v-col cols="3">隐私政策：</v-col>
      <v-col style="overflow: auto">{{ INDEX_URL + '/policy' }}</v-col>
      <v-col cols="1">
        <v-btn @click="$router.push('/policy')" icon color="blue">
          <v-icon dense color="blue">mdi-play-speed</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pb-2">
      <v-divider></v-divider>
    </div>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import {showPop} from "@/common/util";
import {Android, AppVersionInfo} from "@/common/android";
import {EMAIL, GIT_URL, INDEX_URL} from "@/common/const";

export default Vue.extend({
  name: 'About',
  data() {
    return {
      Android,
      GIT_URL,
      EMAIL,
      INDEX_URL,
      version: undefined as AppVersionInfo | undefined
    }
  },
  mounted() {
    if (Android) {
      this.version = JSON.parse(Android.checkVersion()) as AppVersionInfo
    }
  },
  computed: {
    appVersion(): string {
      if (!this.version) return '---'
      return '窗隙流光' + this.versionCodeToName(this.version.local_app_version)
          + (this.version.is_app_update ? '（发现新版本）' : '')
    }
  },
  methods: {
    versionCodeToName(code: string): string {
      return 'v' + code.split("").join('.')
    },
    copy(value: string) {
      const text = document.createElement('textarea');
      text.value = value
      document.body.appendChild(text);
      text.select();
      const isSuccess = document.execCommand('Copy');
      text.remove();
      if (isSuccess) showPop("复制成功", 'success')
      else showPop("复制失败", 'error')
    },
    update() {
      if (this.version?.is_app_update) {
        Android?.showVersionUpdate()
      } else showPop("目前已是最新版本", 'success')
    }
  }
})
</script>
<style scoped>

</style>
