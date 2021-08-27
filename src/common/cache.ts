import {Event} from "@/common/data";
import {compareEvents} from "@/common/util";

function setStorage(k: 'token' | 'updateTime' | 'events' | 'email' | 'eduToken' | 'school' | 'marks', v: string) {
    uni.setStorageSync(k, v)
}

function getStorage(k: 'token' | 'updateTime' | 'events' | 'email' | 'eduToken' | 'school' | 'marks'): string {
    const s = uni.getStorageSync(k)
    if (typeof s === 'string') return s
    else return JSON.stringify(s)
}

function removeStorage(...ks: string[]) {
    ks.forEach(k => {
        uni.removeStorageSync(k)
    })
}
/**
 * 由Android webview提供
 * */
const Android:
    {
        setSystemAlarm:()=>void,
        addEvents: (events:string)=>void,
        removeEvents: (events:string)=>void,
        getEvents: () => string
    } | undefined = (window as any).Android

function androidAddEvents(events: Event[]) {
    if (Android)console.log("android add",JSON.stringify(events))
    Android?.addEvents(JSON.stringify(events))
}

function androidRemoveEvents(events: Event[]) {
    if (Android)console.log("android remove",JSON.stringify(events))
    Android?.removeEvents(JSON.stringify(events))
}

function androidGetEvents(): Event[] {
    return (Android?.getEvents() === undefined ? [] : JSON.parse(Android?.getEvents())) as Event[]
}
/**
 * Android数据库与web数据同步
 * */
function androidSyncData(events: Event[]) {
    const [web, android] = compareEvents(events, androidGetEvents())
    androidRemoveEvents(android)
    androidAddEvents(web)
}

function androidSetAlarm(){
    Android?.setSystemAlarm()
}

export {
    androidSyncData,androidSetAlarm,
    setStorage, getStorage, removeStorage
}
