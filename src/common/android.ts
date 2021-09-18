const Android=(window as any).Android as {
    isCldRunning: () => boolean,
    startCldService: () => void,
    stopCldService: () => void,
    close: () => void,
    showZoom: () => void,
    getClipboardText: () => string
}|undefined

export {Android}
