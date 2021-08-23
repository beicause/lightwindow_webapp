<template>
  <view class="build">
    <uni-tag @click="btnSettings" text="更多" inverted type="primary"></uni-tag>
    <view class="container-btn-build">
      <uni-transition :mode-class="['fade' ,'slide-right']" :show="isBuildMode">
        <uni-tag @click="cancel" type="primary" text="取消" :inverted="true" style="margin-right: 15px;">
        </uni-tag>
      </uni-transition>
      <uni-tag @click="build" :text="tagText" type="primary" :inverted="!isBuildMode"></uni-tag>
    </view>
    <uni-popup ref="popSettings">
      <uni-transition :show="true" :mode-class="['fade','slide-left']">
        <view class="container-settings">

          <view class="settings-item" @click="setAlarm">
            <text class="settings-item-text">导出闹钟提醒</text>
            <uni-icons type="arrowright" color="#007aff"></uni-icons>
          </view>

          <view class="settings-item" @click="eduLogin">
            <text class="settings-item-text">导入教务课表</text>
            <uni-icons type="arrowright" color="#007aff"></uni-icons>
          </view>

          <view class="settings-item" @click="userData">
            <text class="settings-item-text">本地和云端数据</text>
            <uni-icons type="arrowright" color="#007aff"></uni-icons>
          </view>

        </view>
      </uni-transition>
    </uni-popup>
    <uni-popup ref="popEduLogin">
      <the-build-edu-login @close="$refs.popEduLogin.close()"></the-build-edu-login>
    </uni-popup>
    <uni-popup ref="popUserData">
      <the-build-user-data></the-build-user-data>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import theBuildUserData from "@/components/the-build-button/theBuildUserData.vue";
import theBuildEduLogin from "@/components/the-build-button/theBuildEduLogin.vue";
import Vue from 'vue'
import {androidSetAlarm} from "@/util/cache";
import {showDialog} from "@/util/util";

export default Vue.extend({
  name: "theBuildButton",
  components: {
    theBuildUserData,
    theBuildEduLogin
  },
  data() {
    return {
      isBuildMode: false,
      tagText: '编辑'
    };
  },
  methods: {
    build(): void {
      this.isBuildMode = !this.isBuildMode
      this.tagText = this.isBuildMode ? '保存' : '编辑'
      this.$emit('build-click', this.isBuildMode)
    },
    cancel(): void {
      this.isBuildMode = !this.isBuildMode
      this.tagText = '编辑'
      this.$emit('cancel-click')
    },
    btnSettings(): void {
      (this.$refs.popSettings as any).open()
    },
    setAlarm() {
      showDialog({
        msg: '确认将已设置的闹钟提醒加入系统闹钟吗？\n已加入的闹钟不会撤销，如需取消闹钟，请手动前往设置。',
        type: 'info',
        confirm: () => androidSetAlarm()
      })
    },
    eduLogin(): void {
      (this.$refs.popSettings as any).close();
      (this.$refs.popEduLogin as any).open()
    },
    userData() {
      (this.$refs.popUserData as any).open();
      (this.$refs.popSettings as any).close()
    }
  }
})
</script>

<style scoped>
.build {
  height: 32px;
}

.container-btn-build {
  float: right;
  display: flex;
}

.container-settings {
  display: flex;
  flex-direction: column;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 2px;
  background-color: #FFFFFF;
  border: #007AFF solid 1px;
  border-radius: 5px;
  color: #007AFF;
  width: 300px;
  height: 30px;
}

.settings-item-text {
  flex: 1;
}
</style>
