import {vm} from "@/main";

function showPop(text: string, type: 'info' | 'error' | 'success' | 'warning' = 'info', duration = 800): void {
    closePop()
    vm.$emit('show-pop', {text, type, duration})
}

function closePop(): void {
    vm.$emit('close-pop')
}

export {showPop, closePop}
