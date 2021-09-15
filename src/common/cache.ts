function setStorage(k: 'updateTime' | 'events' | 'marks' | 'eduUserInfo', v: string) {
    uni.setStorageSync(k, v)
}

function getStorage(k: 'updateTime' | 'events' | 'marks' | 'eduUserInfo'): string {
    const s = uni.getStorageSync(k)
    if (typeof s === 'string') return s
    else return JSON.stringify(s)
}

function removeStorage(ks: ('updateTime' | 'events' | 'marks' | 'eduUserInfo')[]) {
    ks.forEach(k => {
        uni.removeStorageSync(k)
    })
}

export {
    setStorage, getStorage, removeStorage
}
