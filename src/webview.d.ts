import { Android } from '@/common/js/android'

declare global {
  interface Window {
    Android?: Android
    showZoom?: () => void
    getVersion?: () => string
  }
}
