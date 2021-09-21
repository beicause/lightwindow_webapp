const Android = (window as any).Android as {
    isNoticeRunning: () => boolean,
    startNoticeService: () => void,
    stopNoticeService: () => void,
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
    showVersionUpdate: () => void,
    redirectToMain: () => void,
    redirectToCalendar: () => void
} | undefined

export {Android}
