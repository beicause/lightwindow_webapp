<template>
  <view>
    <view class="week-content">
      <view>
        <view @click="previousWeek" class="container-arrow">
          <view class="up-arrow"></view>
        </view>
        <view @click="nextWeek" class="container-arrow">
          <view class="down-arrow"></view>
        </view>
      </view>
      <text @click="dayEventsClick(index)()" class="week-item" v-for="(item,index) in weekDateText" :key="index"
            :style="index===activeStyle.index?activeStyle.style:''">{{ item }}
      </text>
    </view>
    <view class="container-schedule">
      <time-line class="-time-line"></time-line>
      <view class="container-events">
        <event-day-schedule @click.native="dayEventsClick(index)()" ref="weekSchedule" :key="index"
                        v-for="(item,index) in week" :areaStyle="{flex:1}"
                        :showDetail="false" @plus-click="plusClick(index)()" :editable="editable" :fontSize="12"
                        :day="day(index)">
        </event-day-schedule>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import store from '../../store'
import TheBuildButton from "@/components/the-build-button/theBuildButton.vue";
import TimeLine from '@/components/event-components/timeLine.vue';
import {dayFormat, parseDayToDate} from "@/util/util";
import Vue from 'vue'
import EventDaySchedule from "@/components/event-components/eventDaySchedule.vue";

/**
 * *页面直接组件-日程-周
 *
 * @property {Boolean} editable = [true | false] 是否开启编辑模式
 * @see EventDaySchedule
 */

export default Vue.extend({
  components: {
    EventDaySchedule,
    TheBuildButton,
    TimeLine
  },
  name: "calendarWeek",
  props:{
    editable:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      isBuildMode: false,
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      activeStyle: {
        index: 8,
        style: {
          backgroundColor: '#007aff',
          color: '#ffffff'
        },
      },
    }
  },
  computed: {
    /**
     * 获取一周的Date对象
     * */
    weekDate(): Date[] {
      const mWeekDate: Date[] = []
      const e = parseDayToDate(store.state.activeDay)
      this.activeStyle.index = (e.getDay() + 6) % 7
      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setTime(e.getTime() - 24 * 3600 * 1000 * (this.activeStyle.index - i))
        mWeekDate[i] = d
      }
      return mWeekDate
    },
    /**
     * 返回函数方便注入7天的day
     * */
    day(): (index: number) => string {
      return (index) => dayFormat(this.weekDate[index])
    },
    weekDateText(): string[] {
      const texts = []
      for (let i = 0; i < 7; i++) {
        const [, mm, dd] = dayFormat(this.weekDate[i]).split('-')
        texts[i] = mm + '-' + dd + '\n' + this.week[i]
      }
      return texts
    }
  },
  methods: {
    plusClick(index: number): () => void {
      return () => {
        (this.$refs.weekSchedule as any[])[index].add()
      }
    },
    /**
     * 点击每个{@link EventDaySchedule}组件都会将{@link activeDay}切换到该日
     * */
    dayEventsClick(index: number): () => void {
      return () => {
        store.commit("setActiveDay", dayFormat(this.weekDate[index]))
        console.log(store.state.activeDay)
      }
    },
    /**
     * 翻到下一周
     * */
    nextWeek() {
      const date = parseDayToDate(store.state.activeDay)
      date.setDate(date.getDate() + 7)
      store.commit('setActiveDay', dayFormat(date))
    },
    /**
     * 翻到上一周
     * */
    previousWeek() {
      const date = parseDayToDate(store.state.activeDay)
      date.setDate(date.getDate() - 7)
      store.commit('setActiveDay', dayFormat(date))
    }
  }
})
</script>

<style scoped>
.week-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  border-bottom-color: #e5e5e5;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.week-item {
  flex-grow: 1;
  text-align: center;
  font-size: 12px;
  padding: 5px 0 5px 0;
}

.container-schedule {
  display: flex;
}

.container-events {
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
  margin-left: -20px;
}

.container-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
}

.up-arrow {
  transform: rotate(45deg);
  width: 10px;
  height: 10px;
  border-left-color: #808080;
  border-left-style: solid;
  border-left-width: 2px;
  border-top-color: #555555;
  border-top-style: solid;
  border-top-width: 2px;
}

.down-arrow {
  transform: rotate(225deg);
  width: 10px;
  height: 10px;
  border-left-color: #808080;
  border-left-style: solid;
  border-left-width: 2px;
  border-top-color: #555555;
  border-top-style: solid;
  border-top-width: 2px;
}
.-time-line {
  margin: 22px 0;
}
</style>
