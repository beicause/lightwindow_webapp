const Android = (window as any).Android as {
    isCldRunning: () => boolean,
    startCldService: () => void,
    stopCldService: () => void,
    close: () => void,
    showZoom: () => void,
    getClipboardText: () => string,
    checkVersion: () => {
        is_app_update: boolean,
        is_web_update: boolean,
        local_web_version: string,
        local_app_version: string,
        web_version: string,
        app_version: string,
        force_update: boolean,
        version_info: string
    },
    showVersionUpdate: () => void
} | undefined

export {Android}
