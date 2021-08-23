import {Event} from "@/util/data";
import {compareEvents} from "@/util/util";

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

const Android: {setSystemAlarm:Function, addEvents: Function, removeEvents: Function, getEvents: () => string } | undefined = (window as any).Android

function androidAddEvents(events: Event[]) {
    // console.log("android new",JSON.stringify(events))
    Android?.addEvents(JSON.stringify(events))
}

function androidRemoveEvents(events: Event[]) {
    // console.log("android delete",JSON.stringify(events))
    Android?.removeEvents(JSON.stringify(events))
}

function androidGetEvents(): Event[] {
    return (Android?.getEvents() === undefined ? [] : JSON.parse(Android?.getEvents())) as Event[]
}

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