<template>
  <v-container>
    <v-icon v-show="!drawer" class="expand-arrow" color="blue"
            @click="()=>{drawer=true}">fal fa-chevron-circle-right
    </v-icon>
    <v-navigation-drawer temporary fixed style="top: 65px" mini-variant v-model="drawer">
      <v-list dense>
        <v-list-item-group color="blue" @change="onItemClick" :value="selectItem">
          <v-list-item>
            <v-icon>fal fa-calendar-week</v-icon>
          </v-list-item>
          <!--          <v-list-item>-->
          <!--            <v-icon>far fa-paw</v-icon>-->
          <!--          </v-list-item>-->
          <v-list-item>
            <v-icon>fal fa-music</v-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <div v-show="selectItem===0">
      <p class="blue--text mt-2">编辑事件</p>
      <v-img height="100" contain src="/images/calendar_guide.svg"></v-img>

      <p class="blue--text mt-2">重力打开</p>
      <div class="body-2 indent-2 ">开启重力感应后，运行日程表服务时，将手机正面朝下后快速朝上，即可随时打开日程表</div>
      <div class="body-2 indent-2">为防止偶然打开造成不便，倒置超过0.5秒或手机熄屏，窗口自动关闭</div>
      <div class="body-2 indent-2 mt-1">进行以下配置以确保稳定运行，否则容易无响应</div>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold" expand-icon="mdi-menu-down">
            设置应用启动管理，关闭省电模式
          </v-expansion-panel-header>
          <v-expansion-panel-content class="body-2">
            在手机管家中设置为手动管理，运行应用自启动，关联启动和后台活动，
            并且关闭省电模式
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="body-2 mt-2">注：</div>
      <div class="body-2 indent-2">事件数据存储于本地，清除缓存后无法恢复。</div>
      <div class="body-2 indent-2">通知提醒的实际效果（振动，横幅，铃声等）取决于您的通知管理设置。</div>
      <div class="body-2 indent-2">闹钟提醒仅作为标记，[ 导出至系统闹钟 ] 会根据此标记自动设置您的闹钟。</div>
    </div>

    <!--    <div v-show="selectItem===1">-->
    <!--      <p>小宠物</p>-->
    <!--    </div>-->

    <div v-show="selectItem===1">
      <p class="blue--text">使用说明</p>
      <music-guide class="pt-0"></music-guide>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import MusicGuide from '@/music/components/MusicGuide.vue'

export default Vue.extend({
  name: 'Guide',
  components: { MusicGuide },
  data () {
    return {
      drawer: false,
      selectItem: 0
    }
  },
  methods: {
    onItemClick (e: number | undefined) {
      if (e !== undefined) this.selectItem = e
      this.drawer = false
    }
  }
})
</script>

<style scoped>
.expand-arrow {
  background-color: white;
  position: fixed;
  z-index: 2;
  top: 60%;
  left: 0
}

.indent-2 {
  text-indent: 2em;
}

p {
  margin-bottom: 12px;
}
</style>
