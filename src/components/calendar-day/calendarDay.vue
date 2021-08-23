<template>
	<view>
		<header-date></header-date>
		<view style="display: flex;">
        <time-line class="-time-line"></time-line>
			<event-day-schedule :fontSize="12" :day="day" @plus-click="plusClick" ref="daySchedule"
                      :editable="editable" :areaStyle="{marginLeft:'-20px',flex:1}"></event-day-schedule>
		</view>

	</view>
</template>

<script lang="ts">
import store from '../../store'
import timeLine from '../time-line/timeLine.vue'
import headerDate from "@/components/calendar-day/headerDate.vue";
import theBuildButton from "@/components/the-build-button/theBuildButton.vue";
import eventSchedule from "@/components/event-line/eventDaySchedule.vue"
import Vue from "vue";
import EventDaySchedule from "@/components/event-line/eventDaySchedule.vue";
import {compareEvents, parseDayToDate, showPopMsg} from "@/util/util";
import {getStorage} from "@/util/cache";
import {Event} from "@/util/data";
	export default Vue.extend({
	  components:{
      EventDaySchedule,
      timeLine,
      headerDate,
      theBuildButton,
      eventSchedule
    },
		name: "calendarDay",
    props:{
	    editable:{
	      type:Boolean,
        default:false
      }
    },
		data() {
			return {
			};
		},
		computed:{
			day():string{
				return store.state.activeDay
			}
		},
		methods: {
			commit():void{
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
			cancel():void{
				(this.$refs.daySchedule as any).restore()
			},
			plusClick():void{
				(this.$refs.daySchedule as any).add()
			}
		},
	})
</script>

<style scoped>
	.-time-line {
		margin: 22px 0;
	}
</style>
