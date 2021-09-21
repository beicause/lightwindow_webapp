function setStorage(k: 'updateTime' | 'events' | 'marks' | 'eduUserInfo' | 'eduEvents', v: string) {
    uni.setStorageSync(k, v)
}

function getStorage(k: 'updateTime' | 'events' | 'marks' | 'eduUserInfo' | 'eduEvents'): string {
    const s = uni.getStorageSync(k)
    if (!s) {
        if (k === 'events' || k === 'marks' || k === 'eduEvents') return "[]"
        if (k === 'eduUserInfo') return "{}"
    }
    if (typeof s === 'string') return s
    else return JSON.stringify(s)
}

function removeStorage(ks: ('updateTime' | 'events' | 'marks' | 'eduUserInfo' | 'eduEvents')[]) {
    ks.forEach(k => {
        uni.removeStorageSync(k)
    })
}

export {
    setStorage, getStorage, removeStorage
}
