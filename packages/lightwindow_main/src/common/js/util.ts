import CompositionApi, { reactive } from '@vue/composition-api'
import axios, { AxiosResponse } from 'axios'
import Vue from 'vue'
Vue.use(CompositionApi)

export const popState = reactive({
  showPop: false,
  text: '',
  type: 'info' as 'info' | 'error' | 'success' | 'warning',
  duration: 800,
  timerId: NaN
})
function showPop (text: string, type: 'info' | 'error' | 'success' | 'warning' = 'info', duration = 800): void {
  closePop()
  popState.duration = duration
  popState.text = text
  popState.type = type
  popState.showPop = true
  popState.timerId = setTimeout(() => closePop(), duration) as unknown as number
}

function closePop (): void {
  clearTimeout(popState.timerId)
  popState.showPop = false
  popState.text = ''
  popState.duration = 800
  popState.type = 'info'
}

function sendPV (args: Record<string, string>): void {
  if (window.aplus_queue) {
    window.aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [
        { is_auto: false },
        args
      ]
    })
  }
}

async function getVersion (): Promise<AxiosResponse<{
  /* eslint-disable  camelcase */
  web_version: string,
  app_version: string,
  force_update: boolean,
  version_info: string
  /* eslint-enable  camelcase */
}>> {
  return await axios.get('https://874be9c6-69bb-473d-9ba3-8afc02442e35.bspapp.com/http/version')
}

function isMobile ():boolean {
  const agents = navigator.userAgent
  let f = false;
  ['Android', 'iPhone', 'iPad', 'iPod', 'Windows Phone', 'SymbianOS'].forEach(e => {
    if (agents.indexOf(e) > 0)f = true
  })
  return f
}
export { showPop, closePop, getVersion, sendPV, isMobile }

export function disableScroll () {
  const body = document.body
  const html = document.documentElement
  html.style.maxHeight = '90vh'
  body.style.maxHeight = '90vh'
  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'
}
export function resumeScroll () {
  const body = document.body
  const html = document.documentElement
  html.style.maxHeight = ''
  html.style.overflow = ''
  body.style.maxHeight = ''
  body.style.overflow = ''
}
