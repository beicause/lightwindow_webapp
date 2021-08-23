<template>
  <view>
    <uni-calendar :showMonth="false" :date="activeDay" :selected="selected" @change="select"></uni-calendar>
    <uni-transition :show="editable" :mode-class="['fade','slide-left']">
      <view class="mark-input-view">
        <text>标记</text>
        <input v-model="inputText"/>
      </view>
    </uni-transition>
    <event-schedule-vertical :day="activeDay"></event-schedule-vertical>
  </view>
</template>

<script lang="ts">
import theBuildButton from "@/components/the-build-button/theBuildButton.vue";
import Vue from 'vue'
import store from "@/store";
import EventScheduleVertical from "@/components/event-line/eventScheduleVertical.vue";
import {getStorage} from "@/util/cache";
import {Event, Mark, marksArrayToMap, marksMapToArray} from "@/util/data";
import {compareEvents, parseDayToDate, showPopMsg} from "@/util/util";

export default Vue.extend({
  components: {EventScheduleVertical, theBuildButton},
  name: "calendarMonth",
  props: {
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isBuildMode: false,
    };
  },
  computed: {
    selected: {
      get(): Mark[] {
        return marksMapToArray(store.state.marks)
        // 以每天第一个事件名为标记↓↓  放弃这种方式
        // const s= new Set<{date: string; info: string,time:string}>()
        // store.state.events.forEach(e => {
        //   s.add({date:e.day,info:e.title,time:e.time})
        //   s.forEach(f=>{
        //     if (f.date===e.day&&this.compareTime(e.time,f.time)){
        //       s.delete(f)
        //     }
        //   })
        // })
        // const a:{date:string,info:string}[]=[]
        // s.forEach(e=>a.push({date:e.date,info:e.info}))
        // return a
      }
    },
    inputText: {
      get(): string {
        const text=store.state.marks.get(this.activeDay)
        return text?text:''
      },
      set(v:string){
        if (v!=='') store.commit('addMarks',[{date:this.activeDay,info:v}])
        else store.commit('removeMarks',[{date:this.activeDay,info:''}])
      }
    },
    activeDay(): string {
      return store.state.activeDay
    }
  },
  methods: {
    // compareTime(a:string,b:string):boolean{
    //   const [h,m,s]=a.split(':') as any[]
    //   const as= h*3600+m*60+s*1
    //   const [h1,m1,s1]=b.split(':') as any[]
    //   const bs= h1*3600+m1*60+s1*1
    //   return as<bs
    // },

    commit() {
      const alarms = store.state.events.filter(e =>
          e.alarm.match(/^\*/) && parseDayToDate(e.day).getTime() > new Date().getTime())
      const cAlarms = (JSON.parse(getStorage('events')) as Event[]).filter(e =>
          e.alarm.match(/^\*/) && parseDayToDate(e.day).getTime() > new Date().getTime())
      const [a, b] = compareEvents(alarms, cAlarms)
      if (a.length !== 0 || b.length !== 0) showPopMsg({
        msg: '闹钟提醒发生变化，若要生效，请点击【更多】->【导出闹钟提醒】',
        type: 'info',
        duration: 2000
      })
      store.dispatch('cacheAndTryPush')
    },
    cancel() {
      store.commit('updateMarks',marksArrayToMap(JSON.parse(getStorage('marks'))))
    },
    select(e: AnyObject) {
      store.commit('setActiveDay', e.fulldate as string)
    }
  }
})
</script>

<style scoped>
.mark-input-view {
  position: absolute;
  height: 50px;
  margin-top: -50px;
  color: #007AFF;
  font-size: 14px;
  display: flex;
  align-items: center;
  background-color: white;
}

input {
  margin-left: 10px;
  border: #007AFF dotted 1px;
  width: 42px;
}
</style>
