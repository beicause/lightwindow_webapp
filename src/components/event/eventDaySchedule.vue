<template>
  <movable-area style="height: 442px" :style="areaStyle">
    <movable-view v-for="(item,index) in mDayEvents" :y="ys.get(index)" :key="index" :disabled="!editable"
                  direction="vertical" style="width: 100%;height: 42px;"
                  @change="e=> {
				    if (e.detail.source==='touch')initTime(e.detail.y,item)
      }">
      <event-line @alarm-picker-change="e=>{item.alarm=e}"
                  @time-picker-change="e=>{item.time=e;}"
                  @color-picker-change="e=>{item.color=e}"
                  @title-input="e=>{item.title=e}"
                  @detail-input="e=>{item.detail=e}"
                  @repeat-picker-change="e=>{repeatChange(item)(e)}"
                  :showDetail="showDetail" :color="item.color"
                  :fontSize="fontSize" :editable="editable"
                  :time="item.time.substr(0,5)" :detail="item.detail" :title="item.title"
                  :alarm="item.alarm"></event-line>
    </movable-view>
    <uni-transition :show="editable" :mode-class="['fade','slide-right']"
                    :styles="{position: 'absolute',bottom:-fontSize*1.5+'px',left:'calc(50% - '+fontSize*0.75+'px)'}">
      <uni-icons @click="$emit('plus-click')"
                 color="#007aff" :size="fontSize*1.5" type="plus"></uni-icons>
    </uni-transition>
  </movable-area>
</template>

<script lang="ts">
import store from '../../store'
import {Event} from "@/util/data";
import {getStorage} from '@/util/cache'
import eventLine from "@/components/event/eventLine.vue"
import Vue from "vue";
import {compareEvents, dayFormat, getEventDiff, getEventsDiff, parseDayToDate, showPopMsg} from "@/util/util";

export default Vue.extend({
  components: {
    eventLine
  },
  name: "eventDaySchedule",
  props: {
    areaStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    showDetail: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 12
    },
    day: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mDayEvents: [] as Event[],
      ys: new Map<number, number>(),
      off: () => {
      }
    }
  },
  created() {
    this.initYs()
    this.off = store.watch((state) => state.events, () => {
      this.mDayEvents = JSON.parse(JSON.stringify(store.getters.getDayEvents(this.day)))
    })
  },
  mounted() {

  },
  beforeDestroy() {
    this.off()
  },
  watch: {
    day: {
      immediate: true,
      handler(newValue: string): void {
        this.mDayEvents =  JSON.parse(JSON.stringify(store.getters.getDayEvents(newValue)))
      }
    },
    mDayEvents: {
      immediate: true,
      deep: true,
      handler(newValue: Event[]) {
        this.initYs()
        const [ns, os] = compareEvents(newValue, store.getters.getDayEvents(this.day))
        if (ns.length === 0 && os.length === 0) return
        store.commit('updateDayEvents', {dayEvents: newValue, day: this.day})
      }
    }
  },
  methods: {
    initYs() {
      this.ys.clear()
      this.mDayEvents.forEach((value, index) => {
        this.ys.set(index, this.percent(value.time) * 400)
      })
    },
    initTime(y: number, item: Event) {
      const percent = y / 400
      const secondAll = percent === 1 ? (24 * 3600 - 1) : 24 * 3600 * percent
      const hour = Math.floor(secondAll / 3600)
      const min = Math.floor((secondAll - hour * 3600) / 60)
      const second = Math.floor(secondAll - hour * 3600 - min * 60)
      item.time = (hour / 10 < 1 ? ('0' + hour) : hour) + ':'
          + (min / 10 < 1 ? ('0' + min) : min) + ':' + (second / 10 < 1 ? ('0' + second) : second)
      //更新位置，否则会颤动
      // this.ys.set(this.mDayEvents.indexOf(item), y)
    },
    repeatChange(item: Event) {
      return (e: number) => {
        switch (e) {
          case 0:
            store.commit('removeEvents', [item])
            break
          case 1:
            const repeatEvents: Event[] = []
            store.state.events.forEach(event => {
              const diffE = getEventDiff(event, item)
              if (Object.keys(diffE).length === 1 && typeof diffE.day === 'string' &&
                  parseDayToDate(diffE.day).getTime() > parseDayToDate(item.day).getTime()) {
                repeatEvents.push(event)
              }
            })
            store.commit('removeEvents', repeatEvents)
            break
          case 2:
            const newEvents: Event[] = []
            for (let i = 1; i < 100 + 1; i++) {
              const ne = JSON.parse(JSON.stringify(item))
              const date = parseDayToDate(item.day)
              date.setDate(date.getDate() + i)
              ne.day = dayFormat(date)
              newEvents.push(ne)
            }
            store.commit('addEvents', newEvents)
            break
          case 3:
            const newEvents1: Event[] = []
            for (let i = 1; i < 20 + 1; i++) {
              const ne = JSON.parse(JSON.stringify(item))
              const date = parseDayToDate(item.day)
              date.setDate(date.getDate() + i * 7)
              ne.day = dayFormat(date)
              newEvents1.push(ne)
            }
            store.commit('addEvents', newEvents1)
            break
        }
      }
    },
    percent(time: string): number {
      const [hh, mm, ss] = time.split(':') as unknown as [number, number, number]
      return (hh * 3600 + mm * 60 + (ss << 0)) / (3600 * 24)
    },
    /**
     * 从缓存中恢复课表，这里不调用，抛给父组件
     * */
    restore(): void {
      store.commit('updateEvents', JSON.parse(getStorage('events')))
    },
    /**
     * 添加事件，这里不调用，抛给父组件
     * */
    add(): void {
      this.mDayEvents.push({
        title: '',
        detail: '',
        time: '00:00:00',
        day: this.day,
        color: '#000000',
        alarm: '0'
      } as Event)
    }
  }
})
</script>

<style scoped>
</style>
