import Vue from 'vue'
import Vuex from 'vuex'
import {
    compareEvents, compareMarks,
    dateFormat,
    dayFormat,
    getEventsDiff
} from '@/util/util'
import {androidSyncData, getStorage, setStorage} from '@/util/cache'
import {Event, Mark, marksArrayToMap, marksMapToArray} from '@/util/data'

Vue.use(Vuex);
//缓存
//token
//updateTime
//events
//email
//eduToken
//school
//marks
const store = new Vuex.Store({
    state: {
        token: '',
        events: [] as Event[],
        marks:new Map<string,string>(),
        updateTime: '',
        eduToken: '',
        email: '',
        school: '',
        activeDay: dayFormat(new Date()),
    },
    getters: {
        getDayEvents: (state) => (day: string) => state.events.filter(i => i.day === day) as Event[]
    },
    mutations: {
        setActiveDay(state, day: string) {
            if (!day.match(/\d{4}-\d{2}-\d{2}/)) throw '日期格式错误'
            state.activeDay = day
        },
        initAll(state) {
            let e = getStorage('events')
            if (!e) {
                e = "[]"
                setStorage('events', e)
            }
            let m = getStorage('marks')
            if (!m) {
                m = "[]"
                setStorage('marks', m)
            }
            state.events = JSON.parse(e)
            state.marks =marksArrayToMap( JSON.parse(m))
            androidSyncData(state.events)
            state.token = getStorage('token')
            state.school = getStorage('school')
            state.eduToken = getStorage('eduToken')
            state.email = getStorage('email')
            state.updateTime = getStorage('updateTime')
            state.activeDay = dayFormat(new Date())
        },
        setAnyString(state, kvs: ['email' | 'updateTime' | 'token' | 'eduToken' | 'school', string][]) {
         kvs.forEach(e => {
                setStorage(e[0], e[1]);
                (state as any)[e[0]] = e[1]
            })
        },
        updateMarks(state, marks: Map<string,string>) {
            state.marks = marks
        },
        addMarks(state, marks:Mark[]){
            marks.forEach(mark=>state.marks.set(mark.date,mark.info))
            state.marks=new Map<string, string>(state.marks)
        },
        removeMarks(state,marks:Mark[]){
          marks.forEach(mark=>state.marks.delete(mark.date))
          state.marks=new Map<string, string>(state.marks)
        },
        cacheMarks(state) {
            console.log('缓存marks')
            setStorage("marks", JSON.stringify(marksMapToArray(state.marks)))
        },
        cacheEvents(state) {
            const e = getStorage('events')
            const [a, b] = compareEvents(state.events, JSON.parse(e ? e : "[]"))
            console.log(a, b)
            if (a.length === 0 && b.length === 0) {
                console.log('无变化不缓存')
                return
            }
            setStorage('events', JSON.stringify(state.events));
            androidSyncData(state.events);
            (this as any).commit('setAnyString',[['updateTime', dateFormat(new Date())]])
            console.log('缓存更新', state.updateTime)
        },
        addEvents(state, events: Event[]) {
            const b = getEventsDiff(events, state.events)
            state.events = [...state.events, ...b]
        },
        removeEvents(state, events: Event[]) {
            state.events = getEventsDiff(state.events, events)
        },
        updateEvents(state, newValue: Event[]) {
            state.events = newValue
        },
        updateDayEvents(state, payload: { dayEvents: Event[], day: string }) {
            const old = state.events.filter(i => i.day === payload.day) as Event[];
            (this as any).commit("removeEvents", old);
            (this as any).commit("addEvents", payload.dayEvents);
        },
    }
})

export default store
