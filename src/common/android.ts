const Android=(window as any).Android as {
    isCldRunning:()=>boolean,
    startCldService:()=>void,
    stopCldService:()=>void,
    close:()=>void
}|undefined

export {Android}
