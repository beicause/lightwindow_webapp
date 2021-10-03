import { Android } from '@/common/js/types'

declare global {
  interface Window {
    Android?: Android
    showZoom?: () => void
    getVersion?: () => string
  }
}
