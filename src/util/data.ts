interface Event {
    title: string,
    detail: string,
    day: string,
    time: string
    color: string,
    alarm: string
}
interface Mark{
    date:string,
    info:string
}
function marksMapToArray(m:Map<string,string>):Mark[]{
    const ms:Mark[]=[]
    for (let [k,v] of m){
        ms.push({date:k,info:v})
    }
    return ms
}
function marksArrayToMap(ms:Mark[]):Map<string,string>{
    const map=new Map<string,string>()
    for (let m of ms){
        map.set(m.date,m.info)
    }
    return map
}
const colorArray = [
    '#27ae60',
    '#00BCD4',
    '#007aff',
    '#F8BBD0',
    '#9C27B0',
    '#FBC02D',
    '#FF9800',
    '#F44336'
]

interface PopMsg {
    msg: string,
    type: 'success' | 'error' | 'info' | 'warn',
    duration?: number,
    confirm?:()=>void
}

export {colorArray, Event,PopMsg,Mark,marksArrayToMap,marksMapToArray}
