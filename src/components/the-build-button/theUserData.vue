<template>
  <view class="container-data">

    <view class="container-head">
      <view class="line"></view>
      <text>本地数据</text>
      <view class="container-icon">
        <view class="container-icon-content" @click="trash">
          <uni-icons type="trash" color="#007aff"></uni-icons>
          <text>清空</text>
        </view>
      </view>
    </view>

    <view class="container-content">
      <text>事件数量：{{ localEventsNum }}</text>
      <text>绑定学校：{{ localSchool }}</text>
      <text>修改时间：{{ localUpdateTime }}</text>
    </view>
    <!--#ifdef H5-->
      <the-user-data-graph></the-user-data-graph>
    <!--#endif-->
  </view>
</template>

<script lang="ts">
import store from '../../store'
import {
  showDialog
} from '@/common/util'
import {getStorage, removeStorage} from '@/common/cache'
import Vue from "vue";
import TheBuildButton from "@/components/the-build-button/theBuildButton.vue";
import UniIcons from "@/uni-ui/lib/uni-icons/uni-icons.vue";
import TheUserDataGraph from "@/components/the-build-button/theUserDataGraph.vue";

/**
 * 本地数据界面
 * @see TheBuildButton
 */

export default Vue.extend({
  name: "theUserData",
  components: {TheUserDataGraph, UniIcons},
  data() {
    return {
      remoteSchool: '',
      localSchool: '',
      localEventsNum: '',
      localUpdateTime: '',
    }
  },
  mounted() {
    this.initLocal()
  },
  methods: {
    initLocal(): void {
      this.localSchool = getStorage('school')
      const e = getStorage('events')
      this.localEventsNum = e ? JSON.parse(e).length : ''
      this.localUpdateTime = getStorage('updateTime')
    },
    trash(): void {
      const dialogText = '确定清空本地缓存数据吗？';
      const confirm = () => {
        removeStorage('events', 'school', 'eduToken', 'updateTime')
        this.initLocal()
        store.commit('initAll')
      }
      showDialog({msg: dialogText, type: "warn", confirm: confirm})
    }
  }
})
</script>

<style scoped>
.container-data {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  width: 310px;
  border-radius: 5px;
  padding: 5px;
}

.container-head {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f8f8f8;
  color: #007AFF;
}

.container-content {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  font-size: 14px;
}

.line {
  height: 15px;
  background-color: #007aff;
  width: 3px;
  margin: 5px;
}

.container-icon {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.container-icon-content {
  border: #007AFF solid 1px;
  border-radius: 3px;
  padding: 2px;
  margin-right: 5px;
}

</style>
