import {Event} from "@/common/data";
import {compareEvents} from "@/common/util";

/**
 * 由Android webview提供
 * */
const Android = (window as any).Android as {
    setSystemAlarm: () => void,
    addEvents: (events: string) => void,
    removeEvents: (events: string) => void,
    getEvents: () => string,
    close: () => void,
    showZoom: () => void,
    requestCsustEvents:(username:string,password:string)=>string
} | undefined

function androidAddEvents(events: Event[]) {
    if (Android) console.log("android add", JSON.stringify(events))
    Android?.addEvents(JSON.stringify(events))
}

function androidRemoveEvents(events: Event[]) {
    if (Android) console.log("android remove", JSON.stringify(events))
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

function androidSetAlarm() {
    Android?.setSystemAlarm()
}

export {Android, androidSetAlarm, androidSyncData};
