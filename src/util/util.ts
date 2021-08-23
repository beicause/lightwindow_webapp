import {colorArray, Event, Mark, PopMsg} from "@/util/data";
import axios, {AxiosResponse} from "axios";

async function getHfutEvents(username: string, password: string) {
    const res = await hfutLogin(username, password)
    const token = res.data.data.token
    return await getHfutEventsByToken(token)
}

async function hfutLogin(username: string, password: string) {
    const data = new FormData()
    data.append('username', username)
    data.append('password', password)
    return await axios.request({
        url: 'https://smile.huii.top/user/login',
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data
    });
}

async function getHfutEventsByToken(hfutToken: string) {
    const res = await getHfutSchedule(hfutToken)
    const {
        courses,
        diy,
        exams
    } = res.data.data
    const startDay = (await getHfutBase()).data.data.semesterstart
    //const events0 = parseHfut(startDay, diy)
    const events1 = parseHfut(startDay, exams)
    const events2 = parseHfut(startDay, courses)
    return [res, [...events1, ...events2], hfutToken] as [AxiosResponse, Event[], string]
}

async function getHfutSchedule(hfutToken: string) {
    return await axios.request({
        url: 'https://smile.huii.top/apps/schedule',
        headers: {
            token: hfutToken
        },
    });
}

async function getHfutBase() {
    return await axios.request({
        url: 'https://smile.huii.top/common/basicdatas'
    });
}

function parseHfut(startDay: string, type: Array<AnyObject>) {
    const events: Array<Event> = []
    for (let week = 0; week < type.length; week++) {
        type[week].forEach((e: { day: number; time: any[]; realTime: string | undefined; name: any; place: any; }) => {
            const date = new Date(startDay)
            date.setDate(date.getDate() + week * 7 + e.day - 1)
            switch (e.time[0]) {
                case 1:
                    date.setHours(8);
                    break
                case 2:
                    date.setHours(9);
                    break
                case 3:
                    date.setHours(10);
                    date.setMinutes(10);
                    break
                case 4:
                    date.setHours(11);
                    date.setMinutes(10);
                    break
                case 5:
                    date.setHours(14);
                    break
                case 6:
                    date.setHours(15);
                    break
                case 7:
                    date.setHours(16);
                    break
                case 8:
                    date.setHours(17);
                    break
                case 9:
                    date.setHours(19);
                    break
                case 10:
                    date.setHours(20);
                    break
                case 11:
                    date.setHours(21);
                    break
            }
            if (e.realTime != undefined) {
                const rt = (e.realTime.split('~'))[0]
                const [h, m] = rt.split(':')
                date.setHours(<number><unknown>h)
                date.setMinutes(<number><unknown>m)
            }
            const day = dayFormat(date)
            const time = timeFormat(date)
            const title = e.name
            const detail = e.place
            events.push({
                day,
                detail,
                time,
                title,
                alarm: '0',
                color: '#000000'
            } as Event)
        })
    }
    return events
}

function dayFormat(date: Date) {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return y + '-' + (m / 10 < 1 ? '0' + m : m) + '-' + (d / 10 < 1 ? '0' + d : d)
}

function timeFormat(date: Date) {
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return (h / 10 < 1 ? '0' + h : h) + ':' + (m / 10 < 1 ? '0' + m : m) + ':' + (s / 10 < 1 ? '0' + s : s)
}

function dateFormat(date: Date) {
    return dayFormat(date) + ' ' + timeFormat(date)
}

function compareSimpleEvents(a: Event[], b: Event[]): [Event[], Event[]] {
    const diffA = getSimpleDiff(a, b)
    const diffB = getSimpleDiff(b, a)
    return [diffA, diffB]
}

function compareEvents(a: Event[], b: Event[]): [Event[], Event[]] {
    const diffA = getEventsDiff(a, b)
    const diffB = getEventsDiff(b, a)
    return [diffA, diffB]
}

function getSimpleDiff(a: Event[], b: Event[]): Event[] {
    return a.filter(r => b.every(l => r.title != l.title || r.time != l.time || r.day != l.day || r.detail != l.detail))
}

function getEventsDiff(a: Event[], b: Event[]): Event[] {
    return a.filter(i => b.every(l => i.title != l.title || i.time != l.time || i.day != l.day || i.detail != l.detail || i.color != l.color || i.alarm != l.alarm))
}

function compareMarks(a: Mark[], b: Mark[]): [Mark[], Mark[]] {
    const diffA = a.filter(r => b.every(l => r.date != l.date || r.info != l.info))
    const diffB = b.filter(r => a.every(l => r.date != l.date || r.info != l.info))
    return [diffA, diffB]
}

interface PartEvent {
    time?: string,
    title?: string,
    day?: string,
    detail?: string,
    alarm?: string,
    color?: string
}

function getEventDiff(a: Event, b: Event): PartEvent {
    const ma = JSON.parse(JSON.stringify(a))
    if (ma.day === b.day) delete ma.day
    if (ma.detail === b.detail) delete ma.detail
    if (ma.time === b.time) delete ma.time
    if (ma.title === b.title) delete ma.title
    if (ma.color === b.color) delete ma.color
    if (ma.alarm === b.alarm) delete ma.alarm
    return ma
}

function compareEvent(a: Event, b: Event): [PartEvent, PartEvent] {
    return [getEventDiff(a, b), getEventDiff(b, a)]
}

function parseDayToDate(date: string): Date {
    const [y, m, d] = date.split('-') as unknown as [number, number, number]
    const mDate = new Date()
    mDate.setFullYear(y)
    mDate.setMonth(m - 1)
    mDate.setDate(d)
    return mDate
}

function giveColor(events: Event[]) {
    for (let i = 0; i < events.length; i++) {
        events[i].color = colorArray[i % colorArray.length]
        for (let j = 0; j < i; j++) {
            if (events[j].title === events[i].title) events[i].color = events[j].color
        }
    }
}

// function giveTitleEvents(events:Event[],title:string){
//     const daysToAdd=new Set<string>()
//     const notDays=new Set<string>()
//     events.forEach(e=>{
//         if (e.time==='00:00:00')notDays.add(e.day)
//         if (!notDays.has(e.day))daysToAdd.add(e.day)
//     })
//     daysToAdd.forEach(d=>{
//         events.push({
//             day:d,
//             detail:'',
//             time:'00:00:00',
//             title,
//             color:'#007aff',
//             alarm:'0'
//         } as Event)
//     })
// }
function showPopMsg(config: PopMsg) {
    uni.$emit('showPopMsg', config)
}

function closePopMsg() {
    uni.$emit('closePopMsg')
}

function showDialog(config: PopMsg) {
    uni.$emit('showDialog', config)
}

function closeDialog() {
    uni.$emit('closeDialog')
}

export {
    compareMarks,
    getHfutEvents,
    getHfutEventsByToken,
    dayFormat,
    timeFormat,
    parseDayToDate,
    dateFormat,
    giveColor,
    compareEvents,
    getEventsDiff,
    getEventDiff,
    compareEvent,
    getSimpleDiff,
    compareSimpleEvents,
    showPopMsg,
    closePopMsg,
    showDialog,
    closeDialog
}