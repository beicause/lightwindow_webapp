import { vm } from '@/main'
import axios, { AxiosResponse } from 'axios'

function showPop (text: string, type: 'info' | 'error' | 'success' | 'warning' = 'info', duration = 800): void {
  closePop()
  vm.$emit('show-pop', {
    text,
    type,
    duration
  })
}

function closePop (): void {
  vm.$emit('close-pop')
}

function sendPV (args: Record<string, string>):void {
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

export { showPop, closePop, getVersion, sendPV }
