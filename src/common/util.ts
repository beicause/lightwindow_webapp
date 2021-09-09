import Vue from "vue";

function showPop(vm:Vue,text:string,type:'info' | 'error' | 'success' | 'warning'='info',duration=800):void{
    vm.$emit('show-pop',{text,type,duration})
}
function closePop(vm:Vue):void{
    vm.$emit('close-pop')
}
export {showPop,closePop}
