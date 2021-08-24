import {colorArray, Event, Mark, PopMsg} from "@/util/data";
/**
 * 返回日期格式 yyyy-MM-dd
 * */
function dayFormat(date: Date) {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    return y + '-' + (m / 10 < 1 ? '0' + m : m) + '-' + (d / 10 < 1 ? '0' + d : d)
}

/**
 * 返回日期格式 HH:mm:ss
 * */
function timeFormat(date: Date) {
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return (h / 10 < 1 ? '0' + h : h) + ':' + (m / 10 < 1 ? '0' + m : m) + ':' + (s / 10 < 1 ? '0' + s : s)
}

/**
 * 返回日期格式 yyyy-MM-dd HH:mm:ss
 * */
function dateFormat(date: Date) {
    return dayFormat(date) + ' ' + timeFormat(date)
}
/**
 * 过滤出列表a，b各自的特有的事件（去除a，b相同事件），simple因为忽略了color和alarm
 * */
function compareSimpleEvents(a: Event[], b: Event[]): [Event[], Event[]] {
    const diffA = getSimpleDiff(a, b)
    const diffB = getSimpleDiff(b, a)
    return [diffA, diffB]
}
/**
 * 过滤出列表a,b各自的特有的事件（去除a，b相同事件）
 * */
function compareEvents(a: Event[], b: Event[]): [Event[], Event[]] {
    const diffA = getEventsDiff(a, b)
    const diffB = getEventsDiff(b, a)
    return [diffA, diffB]
}

/**
 * 过滤出列表a的特有的事件（去除a，b相同事件），simple因为忽略了color和alarm
 * */
function getSimpleDiff(a: Event[], b: Event[]): Event[] {
    return a.filter(r => b.every(l => r.title != l.title || r.time != l.time || r.day != l.day || r.detail != l.detail))
}
/**
 * 过滤出列表a的特有的事件（去除a，b相同事件）
 * */
function getEventsDiff(a: Event[], b: Event[]): Event[] {
    return a.filter(i => b.every(l => i.title != l.title || i.time != l.time || i.day != l.day || i.detail != l.detail || i.color != l.color || i.alarm != l.alarm))
}

/**
 * 过滤出列表a特有的标记（去除a，b相同标记）
 * */
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
/**
 * 返回只包含a特有的属性的对象（去除a，b相同属性）
 * */
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
/**
 * 返回只包含a，b特有的属性的对象（去除a，b相同属性）
 * */
function compareEvent(a: Event, b: Event): [PartEvent, PartEvent] {
    return [getEventDiff(a, b), getEventDiff(b, a)]
}
/**
 * yyyy-MM-dd HH:mm:ss字符串转Date对象
 * */
function parseDayToDate(date: string): Date {
    const [y, m, d] = date.split('-') as unknown as [number, number, number]
    const mDate = new Date()
    mDate.setFullYear(y)
    mDate.setMonth(m - 1)
    mDate.setDate(d)
    return mDate
}
/**
 * 修改事件颜色，相同title具有相同颜色
 * */
function giveColor(events: Event[]) {
    for (let i = 0; i < events.length; i++) {
        events[i].color = colorArray[i % colorArray.length]
        for (let j = 0; j < i; j++) {
            if (events[j].title === events[i].title) events[i].color = events[j].color
        }
    }
}
/**
 * 打开全局提示框
 * */
function showPopMsg(config: PopMsg) {
    uni.$emit('showPopMsg', config)
}
/**
 * 关闭全局提示框
 * */
function closePopMsg() {
    uni.$emit('closePopMsg')
}
/**
 * 打开全局对话框
 * */
function showDialog(config: PopMsg) {
    uni.$emit('showDialog', config)
}
/**
 * 关闭全局对话框
 * */
function closeDialog() {
    uni.$emit('closeDialog')
}

export {
    compareMarks,
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