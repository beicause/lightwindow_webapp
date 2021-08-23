<template>
  <view class="app-container">
    <the-nav-bar @nav="nav"></the-nav-bar>
    <uni-transition v-show="index===0" :show="index===0" :mode-class="mode">
      <view class="cld-com-height">
        <calendar-day :editable="editable" ref="day"></calendar-day>
      </view>
    </uni-transition>
    <uni-transition v-show="index===1" :show="index===1" :mode-class="mode">
      <view class="cld-com-height">
        <calendar-week :editable="editable" ref="week"></calendar-week>
      </view>
    </uni-transition>
    <uni-transition v-show="index===2" :show="index===2" :mode-class="mode">
      <view class="cld-com-height">
        <calendar-month :editable="editable" ref="mon"></calendar-month>
      </view>
    </uni-transition>
    <the-build-button class="build-margin" @cancel-click="cancelClick"
                      @build-click="buildClick"></the-build-button>
    <uni-popup ref="msg" type="message" :mask-click="false">
      <uni-popup-message :type="popType" :message="popMsg" :duration="0"></uni-popup-message>
    </uni-popup>
    <uni-popup ref="dialog" type="dialog" @maskClick="$refs.dialog.close()">
      <uni-popup-dialog @close="$refs.dialog.close()" :content="dialogText" :type="dialogType" @confirm="confirm()">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import TheBuildButton from "../../components/the-build-button/theBuildButton.vue";
import CalendarDay from "../../components/calendar-day/calendarDay.vue";
import CalendarWeek from "../../components/calendar-week/calendarWeek.vue";
import CalendarMonth from "../../components/calendar-month/calendarMonth.vue";
import TheNavBar from "@/components/the-nav-bar/theNavBar.vue";
import {PopMsg} from "@/util/data";
import {showPopMsg} from "@/util/util";


export default Vue.extend({
  name: "index",
  components: {TheNavBar, CalendarMonth, CalendarWeek, CalendarDay, TheBuildButton},
  data() {
    return {
      index: 0,
      mode: 'fade',
      editable: false,
      popType: '',
      popMsg: '',
      dialogType: '',
      dialogText: '',
      confirm: () => {
      },
    }
  },
  mounted() {
    uni.$on('showPopMsg', (e: PopMsg) => {
      this.showPop(e.msg, e.type)
      if (e.duration) setTimeout(() => this.closePop(), e.duration)
    })
    uni.$on('closePopMsg', () => {
      this.closePop()
    })
    uni.$on('showDialog', (e: PopMsg) => {
      this.showDialog(e.msg, e.type, e.confirm)
    })
    uni.$on('closeDialog',()=>{
      this.closeDialog()
    })
  },
  beforeDestroy() {
    uni.$off('showPopMsg')
    uni.$off('closePopMsg')
    uni.$off('showDialog')
    uni.$off('closeDialog')
  },
  methods: {
    showPop(msg: string, type: string): void {
      this.popMsg = msg
      this.popType = type;
      (this.$refs.msg as any).open()
    },
    closePop() {
      (this.$refs.msg as any).close()
    },
    showDialog(msg: string, type: string, confirm: () => void = () => {(this.$refs.dialog as any).close()}){
      this.dialogText = msg;
      this.dialogType = type;
      this.confirm = confirm;
      (this.$refs.dialog as any).open()
    },
    closeDialog() {
      (this.$refs.dialog as any).close()
    },
    nav(e: { from: number, to: number }): void {
      uni.$emit('navigate',e)
      if (e.to > e.from) this.mode = 'slide-right'
      else this.mode = 'slide-left'
      this.index = e.to
    },
    cancelClick() {
      this.editable = false;
      (this.$refs as any).day?.cancel();
      (this.$refs as any).week?.cancel();
      (this.$refs as any).mon?.cancel();

    },
    buildClick(editable: boolean) {
      this.editable = editable
      if (!editable) {
        (this.$refs as any).day?.commit();
        (this.$refs as any).week?.commit();
        (this.$refs as any).mon?.commit();
      }
    }
  }
})
</script>

<style scoped>
</style>