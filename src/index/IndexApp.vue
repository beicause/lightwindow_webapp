<template>
  <div class="pa-3" v-resize="onResize">
    <div class="d-flex justify-space-between align-center">
      <div class="flex-center"><img :height="isMobile?32:48" :width="isMobile?32:48" src="../../public/logo.svg"
                                    alt="logo">
        <span style="font-family: source-han, Roboto, sans-serif !important;"
              class=" blue--text text-sm-h4 text-h5">窗隙流光</span>
      </div>
      <v-icon @click="toGithub" :large="!isMobile">fab fa-github</v-icon>
    </div>

    <div style="text-align: center;vertical-align: middle">新颖·创意·简洁<br/>轻量快捷的悬浮窗应用</div>
    <img v-if="isClose" @click="isClose=false" class="anim-logo absolute-center" height="60" width="60"
         src="../../public/logo.svg"
         alt="logo">
    <iframe class="iframe-mobile absolute-center" src="../main" :class="{'iframe-hide':isClose}"
            :style="isZoom?{position:'fixed',border: 'none',height:windowSize.height+'px',width:windowSize.width+'px'}:{border: '#2196f3 1px solid'}"></iframe>
    <div style="position: absolute;top: 85%;left: 0;right: 0">
      <div :style="{height: windowSize.height*0.15+'px'}" class="d-flex justify-center mt-2">
        <v-btn @click="download" style="text-transform: none;" :x-large="!isMobile" color="blue" outlined>
          <v-icon>mdi-android</v-icon>
          Android下载
        </v-btn>
      </div>
      <v-row no-gutters justify="center">
        <v-col sm="5" cols="11" class="ma-3" v-for="(item,index) in cards" :key="index">
          <v-card>
            <div class="d-flex flex-row justify-space-between pr-4">
              <div>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>{{ item.text }}</v-card-text>
              </div>
              <v-icon>{{ item.icon }}</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <div style="font-size: 12px;" class="d-flex align-center justify-center flex-column">
        <a style="color: #bbb" href="https://beian.miit.gov.cn/">赣ICP备2021005447号</a>
        <div>
          <img src="./assets/gov.png" alt="gov">
          <a style="color: #bbb" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36070302360949">赣公网安备36070302360949号</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import '@/common/css/font.css'
import { DOWNLOAD_URL, GITHUB_URL } from '@/common/js/const'

class Card {
  title: string
  text: string
  icon: string

  constructor (title: string, text: string, icon: string) {
    this.title = title
    this.text = text
    this.icon = icon
  }
}

export default Vue.extend({
  name: 'IndexApp',
  data () {
    return {
      isZoom: false,
      isClose: true,
      windowSize: {
        width: 0,
        height: 0
      },
      cards: [
        new Card('日程表', '通知浮窗，便捷查看，支持导入教务课表', 'fal fa-calendar-week'),
        new Card('音乐谱', '以字符构建乐谱', 'fal fa-music')
      ]
    }
  },
  computed: {
    isMobile (): boolean {
      return this.$vuetify.breakpoint.mobile
    },
    mobileBreakPoint (): number {
      return this.$vuetify.breakpoint.thresholds.xs
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('message', e => {
      if (e.data === 'zoom') this.isZoom = !this.isZoom
      if (e.data === 'close') this.isClose = !this.isClose
    })
  },
  methods: {
    download () {
      window.open(DOWNLOAD_URL)
    },
    onResize () {
      this.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    toGithub () {
      window.open(GITHUB_URL)
    }
  }
})
</script>

<style scoped>
.iframe-hide {
  width: 0 !important;
  height: 0 !important;
  transition-property: width, height;
  transition-duration: 0.5s;
}

.iframe-mobile {
  transition-property: width, height;
  transition-duration: 0.5s;
  z-index: 1;
  width: 93%;
  height: 70%;
  max-width: 900px;
  background-color: white;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.absolute-center {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.anim-logo {
  animation-name: logoAnim;
  animation-iteration-count: infinite;
  animation-duration: 4s;
  animation-timing-function: linear;
}

@keyframes logoAnim {
  0% {
    transform: rotate(30deg);
  }
  50% {
    transform: rotate(210deg);
  }
  100% {
    transform: rotate(390deg);
  }
}
</style>
