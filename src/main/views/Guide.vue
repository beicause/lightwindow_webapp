<template>
  <v-container>
    <v-icon v-show="!drawer" class="expand-arrow" color="blue" @click="()=>{this.drawer=true}">fal fa-chevron-circle-right</v-icon>
    <v-navigation-drawer style="z-index: 6" absolute mini-variant v-model="drawer">
      <v-list dense>
        <v-list-item-group color="blue" @change="onItemClick" :value="selectItem">
          <v-list-item>
            <v-icon>fal fa-calendar-week</v-icon>
          </v-list-item>
          <v-list-item>
            <v-icon>far fa-paw</v-icon>
          </v-list-item>
          <v-list-item>
            <v-icon>fal fa-music</v-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <div v-show="selectItem===0">
      <p class="blue--text">权限要求</p>
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header expand-icon="mdi-menu-down">
            1. 设置应用启动管理，关闭省电模式</v-expansion-panel-header>
          <v-expansion-panel-content class="body-2">为了稳定运行服务，请在手机管家中设置为手动管理，运行应用自启动，关联启动和后台活动，
            并且关闭省电模式，否则本应用可能会在数分钟内停止运行。
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header expand-icon="mdi-menu-down">
            2. 关闭智能省流量或加入流量限制白名单
          </v-expansion-panel-header>
          <v-expansion-panel-content class="body-2">由于本应用为后台运行，省流量模式会阻止本应用联网，导致无法获取网络数据。
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <p class="blue--text mt-2">开始使用</p>
      <div class="body-2 indent-2 text-decoration-underline">运行日程表服务后，将手机正面朝下，即可随时通过重力感应打开日程表</div>
      <div class="body-2 indent-2">
        你可以轻松编辑每个事件：
      </div>
      <v-img height="140" contain src="@/main/assets/cld_guide.jpg"></v-img>
      <div class="body-2">注：</div>
      <div class="body-2 indent-2">数据存储于本地，清除缓存后无法恢复。</div>
      <div class="body-2 indent-2">通知提醒的实际效果（振动，横幅，铃声等）取决于您的通知管理设置。</div>
      <div class="body-2 indent-2">闹钟提醒仅作为标记，若要生效，请导出至系统闹钟。</div>
    </div>

    <div v-show="selectItem===1">
      <p>小宠物</p>
    </div>

    <div v-show="selectItem===2">
      <p class="blue--text">使用说明</p>
      <music-guide class="pt-0"></music-guide>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import MusicGuide from "@/music/components/MusicGuide.vue";

export default Vue.extend({
  name: "Guide",
  components: {MusicGuide},
  data() {
    return {
      drawer: false,
      selectItem: 0
    }
  },
  methods: {
    onItemClick(e: any) {
      if (e !== undefined) this.selectItem = e
      this.drawer = false
    }
  }
})
</script>

<style scoped>
.expand-arrow {
  position: fixed;
  z-index: 999;
  top: 60%;
  left: 0
}

.indent-2 {
  text-indent: 2em;
}
</style>
